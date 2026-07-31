import { Router } from 'express';
import { z } from 'zod';
import type { AutoReport, PriceLabel } from '@autoesperto/types';
import { lookupPlate } from '../services/regcheck';
import { normalizeVehicleData } from '../services/vehicleKB';
import { searchModel } from '../services/modelDB';
import { estimateMarketValue, estimateMarketValueWithKm } from '../services/pricing';
import { getMarketSearchUrls } from '../services/market';
import { analyzeVehicle, askAutoEsperto } from '../services/ai';
import { cacheGet, cacheSet } from '../services/cache';

const router = Router();

const platePattern = /^[A-Z]{2}\d{3}[A-Z]{2}$/;

const reportSchema = z
  .object({
    plate: z
      .string()
      .trim()
      .toUpperCase()
      .regex(platePattern, 'Targa non valida: formato italiano atteso (es. AB123CD)')
      .optional(),
    make: z.string().trim().min(2).optional(),
    model: z.string().trim().min(1).optional(),
    km: z.number().int().min(0).max(1000000).optional(),
    requestedPrice: z.number().int().min(0).max(10000000).optional(),
  })
  .refine((data) => Boolean(data.plate) !== Boolean(data.make && data.model), {
    message: 'Indica la targa oppure marca e modello',
  });

function priceLabelFor(requestedPrice: number, estimate: number): PriceLabel {
  if (requestedPrice < estimate * 0.95) return 'GOOD';
  if (requestedPrice > estimate * 1.05) return 'HIGH';
  return 'FAIR';
}

function buildPriceComment(requestedPrice: number | undefined, value: number, km: number | undefined) {
  if (!requestedPrice) {
    return km
      ? `Stima indicativa per circa ${km.toLocaleString('it-IT')} km. Inserisci il prezzo richiesto per il confronto.`
      : 'Stima indicativa di mercato. Inserisci il prezzo richiesto per il confronto.';
  }
  const diff = Math.round(((requestedPrice - value) / value) * 100);
  if (requestedPrice < value * 0.95) return `Prezzo inferiore di circa il ${Math.abs(diff)}% rispetto alla stima: potenziale buon affare, verifica comunque lo stato.`;
  if (requestedPrice > value * 1.05) return `Prezzo superiore di circa il ${diff}% rispetto alla stima: prova a trattare.`;
  return 'Prezzo allineato alla stima di mercato.';
}

router.post('/analyze', async (req, res) => {
  try {
    const parsed = reportSchema.parse(req.body);
    const isModelSearch = !parsed.plate;

    let vehicle;
    const cachePrefix = isModelSearch
      ? `model:${(parsed.make || '').toLowerCase()}:${(parsed.model || '').toLowerCase()}`
      : `plate:${(parsed.plate || '').toUpperCase()}`;
    const reportKey = `${cachePrefix}:${parsed.km || ''}:${parsed.requestedPrice || ''}`;

    const cached = cacheGet<AutoReport>(`report:${reportKey}`);
    if (cached) {
      res.set('Cache-Control', 'no-store');
      return res.json({ success: true, report: cached, cached: true });
    }

    if (isModelSearch) {
      if (!parsed.make || !parsed.model) {
        return res.status(400).json({ success: false, error: 'Inserisci marca e modello' });
      }
      vehicle = searchModel(parsed.make, parsed.model);
      if (!vehicle) {
        return res.status(404).json({ success: false, error: `Modello "${parsed.make} ${parsed.model}" non trovato nel database.` });
      }
    } else {
      let raw;
      const cachedRaw = cacheGet(cachePrefix);
      if (cachedRaw) {
        raw = cachedRaw;
      } else {
        raw = await lookupPlate(parsed.plate || '');
        cacheSet(cachePrefix, raw, 24 * 60 * 60 * 1000);
      }
      vehicle = normalizeVehicleData(raw);
      vehicle.plate = parsed.plate;
      vehicle.dataSource = 'plate';
    }

    const inputKm = parsed.km;
    const { value, min, max, adjustedForKm, kmAdjustment } = inputKm
      ? estimateMarketValueWithKm(vehicle, inputKm)
      : { ...estimateMarketValue(vehicle), adjustedForKm: 0, kmAdjustment: 0 };

    const comparisonValue = adjustedForKm > 0 ? adjustedForKm : value;

    const reliability = await analyzeVehicle({
      vehicle,
      km: inputKm,
      requestedPrice: parsed.requestedPrice,
      marketValue: comparisonValue,
    });

    const priceLabel = parsed.requestedPrice ? priceLabelFor(parsed.requestedPrice, comparisonValue) : undefined;

    const report: AutoReport = {
      vehicle,
      reliability,
      price: {
        estimatedValue: value,
        min,
        max,
        adjustedForKm: adjustedForKm || undefined,
        kmAdjustment: kmAdjustment || undefined,
        inputKm: inputKm || undefined,
        requestedPrice: parsed.requestedPrice,
        priceVsMarketPercent: parsed.requestedPrice
          ? Math.round(((parsed.requestedPrice - comparisonValue) / comparisonValue) * 100)
          : undefined,
        priceLabel,
        comment: buildPriceComment(parsed.requestedPrice, comparisonValue, inputKm),
        marketUrls: getMarketSearchUrls(vehicle),
      },
      createdAt: new Date().toISOString(),
    };

    cacheSet(`report:${reportKey}`, report, isModelSearch ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000);

    res.set('Cache-Control', 'no-store');
    res.json({ success: true, report, cached: false });
  } catch (err: any) {
    console.error('Analyze error:', err.message);
    if (err instanceof z.ZodError) {
      const first = err.issues[0]?.message || 'Dati non validi';
      return res.status(400).json({ success: false, error: first });
    }
    if (err.message && err.message.includes('Servizio di ricerca veicoli')) {
      return res.status(503).json({ success: false, error: err.message });
    }
    res.status(400).json({ success: false, error: err.message || 'Errore durante l\'analisi' });
  }
});

router.post('/ask', async (req, res) => {
  try {
    const schema = z.object({
      question: z.string().trim().min(3).max(500),
      vehicle: z.object({ make: z.string(), model: z.string() }).passthrough(),
      analysis: z.object({ score: z.number(), verdict: z.string() }).passthrough(),
    });
    const parsed = schema.parse(req.body);
    const answer = await askAutoEsperto(parsed.question, parsed.vehicle, parsed.analysis as any);
    res.set('Cache-Control', 'no-store');
    res.json({ success: true, answer });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Domanda, veicolo e analisi richiesti' });
    }
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
