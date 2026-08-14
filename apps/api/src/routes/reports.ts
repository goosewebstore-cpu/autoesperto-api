import { Router } from 'express';
import { z } from 'zod';
import type { Request } from 'express';
import { prisma } from '@autoesperto/database';
import { buildReport } from '../services/reportService';
import { estimateMarketValue } from '../services/pricing';
import { fetchSubitoMarketStats } from '../services/market';
import { analyzeVehiclePhoto, askAutoEsperto, type PhotoAnalysisResult } from '../services/ai';
import { searchModel } from '../services/modelDB';
import { verifyAuthToken } from '../services/auth';
import { getAccountEntitlement } from '../services/entitlement';
import { asyncHandler, serviceUnavailable } from '../http';

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
    year: z.number().int().min(1950).max(new Date().getFullYear() + 1).optional(),
    km: z.number().int().min(0).max(1000000).optional(),
    requestedPrice: z.number().int().min(0).max(10000000).optional(),
  })
  .refine((data) => Boolean(data.plate) !== Boolean(data.make && data.model), {
    message: 'Indica la targa oppure marca e modello',
  });

const askSchema = z.object({
  question: z.string().trim().min(3).max(500),
  vehicle: z.object({ make: z.string(), model: z.string() }).passthrough(),
  analysis: z.object({ score: z.number(), verdict: z.string() }).passthrough(),
});

const photoSchema = z.object({
  imageData: z.string().regex(/^data:image\/(jpeg|jpg|png|webp);base64,/, 'Carica una foto JPG, PNG o WebP').max(7_500_000),
  vehicle: z.object({ make: z.string().optional(), model: z.string().optional(), year: z.number().int().optional() }).optional(),
});

const freeScanSchema = z
  .object({
    imageData: z
      .string()
      .regex(/^data:image\/(jpeg|jpg|png|webp);base64,/, 'Carica una foto JPG, PNG o WebP')
      .max(7_500_000)
      .optional(),
    make: z.string().trim().min(2).optional(),
    model: z.string().trim().min(1).optional(),
    year: z.number().int().min(1950).max(new Date().getFullYear() + 1).optional(),
    km: z.number().int().min(0).max(1000000).optional(),
    requestedPrice: z.number().int().min(0).max(10000000).optional(),
    freeUsed: z.boolean().optional(),
  })
  .refine((data) => Boolean(data.imageData) !== Boolean(data.make && data.model), {
    message: 'Indica una foto oppure marca e modello',
  });

function priceVerdict(requestedPrice: number, estimated: number): { label: string; tone: 'good' | 'fair' | 'high'; percent: number } {
  const percent = estimated > 0 ? ((requestedPrice - estimated) / estimated) * 100 : 0;
  if (requestedPrice <= estimated * 1.03) return { label: 'BUON AFFARE', tone: 'good', percent };
  if (requestedPrice <= estimated * 1.1) return { label: 'TRATTA', tone: 'fair', percent };
  return { label: 'EVITALA', tone: 'high', percent };
}

function getOptionalUserId(req: Request): string | null {
  const authorization = req.header('authorization') || '';
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;
  try {
    return verifyAuthToken(match[1]).sub;
  } catch {
    return null;
  }
}

function manualPhotoAnalysis(make: string, model: string, year?: number): PhotoAnalysisResult {
  return {
    vehicle: {
      make,
      model,
      year,
      confidence: 'media',
    },
    damage: {
      visible: false,
      category: 'non_chiaro',
      severity: 'media',
      description: 'Inserimento manuale di marca e modello.',
    },
    note: 'Analisi basata su marca e modello inseriti a mano.',
  };
}
router.post(
  '/analyze',
  asyncHandler(async (req, res) => {
    const input = reportSchema.parse(req.body);
    const { report, cached } = await buildReport(input);
    res.set('Cache-Control', 'no-store');
    res.json({ success: true, report, cached });
  })
);

router.post(
  '/ask',
  asyncHandler(async (req, res) => {
    const { question, vehicle, analysis } = askSchema.parse(req.body);
    const answer = await askAutoEsperto(question, vehicle, analysis);
    res.set('Cache-Control', 'no-store');
    res.json({ success: true, answer });
  })
);

router.post(
  '/photo-analyze',
  asyncHandler(async (req, res) => {
    const input = photoSchema.parse(req.body);
    let analysis;
    try {
      analysis = await analyzeVehiclePhoto(input);
    } catch (error) {
      console.warn('photo analysis unavailable:', error);
      analysis = {
        vehicle: { confidence: 'bassa' as const },
        damage: {
          visible: false,
          category: 'non_chiaro' as const,
          severity: 'media' as const,
          description: 'Il riconoscimento automatico non ha restituito marca e modello per questa foto.',
        },
        note: 'Il riconoscimento visivo non è disponibile in questo momento. La foto non viene salvata: riprova più tardi oppure inserisci marca e modello.',
      };
    }
    res.set('Cache-Control', 'no-store');
    res.json({ success: true, analysis });
  })
);

router.post(
  '/free-scan',
  asyncHandler(async (req, res) => {
    const input = freeScanSchema.parse(req.body);

    let photo: PhotoAnalysisResult | undefined;
    let photoAnalysis: PhotoAnalysisResult;
    let make: string | undefined;
    let model: string | undefined;
    let year: number | undefined;

    if (input.imageData) {
      // Primo tentativo normale
      try {
        photo = await analyzeVehiclePhoto({ imageData: input.imageData });
      } catch (error) {
        console.warn('free scan first attempt failed:', error);
      }

      // Se il primo è fallito o non ha riconosciuto, secondo tentativo aggressive
      if (!photo?.vehicle?.make || !photo?.vehicle?.model) {
        try {
          photo = await analyzeVehiclePhoto({ imageData: input.imageData, aggressive: true });
        } catch (error) {
          console.warn('free scan aggressive attempt failed:', error);
        }
      }

      // Se il servizio è completamente down
      if (!photo) {
        throw serviceUnavailable('Il riconoscimento gratuito non è disponibile in questo momento. Riprova tra poco.');
      }

      if (!photo.vehicle.make || !photo.vehicle.model) {
        res.set('Cache-Control', 'no-store');
        res.json({
          success: true,
          recognized: false,
          message: 'L\'AI non ha riconosciuto marca e modello con sufficiente sicurezza. Prova una foto nitida di tre quarti, oppure inserisci marca e modello a mano.',
        });
        return;
      }
      make = photo.vehicle.make;
      model = photo.vehicle.model;
      year = photo.vehicle.year;
      photoAnalysis = photo;
    } else {
      make = input.make;
      model = input.model;
      year = input.year;
      const found = searchModel(make!, model!);
      photoAnalysis = manualPhotoAnalysis(make!, model!, year);
      if (found && !year) {
        photoAnalysis.vehicle.year = found.year;
        year = found.year;
      }
    }

    const vehicle = {
      make,
      model,
      generation: photoAnalysis.vehicle.generation,
      year: photoAnalysis.vehicle.year,
      color: photoAnalysis.vehicle.color,
      bodyType: photoAnalysis.vehicle.bodyType,
      confidence: photoAnalysis.vehicle.confidence,
    };

    // Analisi base (marca, modello, anno, colore, tipologia) → sempre gratuita.
    // Il report completo richiede uno slot gratuito: la prima analisi è gratis
    // alla prima visita (anonimo, flag dal client) o col primo account;
    // poi serve Premium.
    const userId = getOptionalUserId(req);
    const entitlement = await getAccountEntitlement(userId);
    const anonymousFreeSlot = !userId && !input.freeUsed;
    const freeSlot = userId ? entitlement.freeAvailable : anonymousFreeSlot;
    const entitled = userId ? entitlement.entitled : anonymousFreeSlot;

    if (!entitled) {
      const estimate = estimateMarketValue({ make: make!, model: model!, year, body: vehicle.bodyType });
      let value: { estimated: number; min: number; max: number; source: 'stima' | 'market' } = {
        estimated: estimate.value, min: estimate.min, max: estimate.max, source: 'stima',
      };
      const marketStats = await fetchSubitoMarketStats(make!, model!, year, undefined).catch(() => undefined);
      const marketSample = marketStats?.comparison?.sampleSize ?? (marketStats?.total ?? 0);
      if (marketStats?.priceAvg && marketSample >= 2) {
        const estimated = Math.round(marketStats.priceAvg / 100) * 100;
        const spread = Math.round((estimated * 0.2) / 100) * 100;
        value = {
          estimated,
          min: marketStats.priceMin ? Math.max(Math.round(marketStats.priceMin / 100) * 100, estimated - spread) : estimated - spread,
          max: marketStats.priceMax ? Math.min(Math.round(marketStats.priceMax / 100) * 100, estimated + spread) : estimated + spread,
          source: 'market',
        };
      }
      res.set('Cache-Control', 'no-store');
      const priceCheck =
        input.requestedPrice != null && value.estimated > 0
          ? priceVerdict(input.requestedPrice, value.estimated)
          : undefined;
      res.json({
        success: true,
        recognized: true,
        vehicle,
        report: null,
        value,
        priceCheck,
        saved: false,
        needsLogin: false,
        needsUpgrade: true,
        needsEmailVerification: false,
        message: 'L\'analisi base (marca, modello, anno, colore, tipologia e valore stimato) è sempre gratuita. Per il verdetto completo sblocca il report o passa a Premium.',
      });
      return;
    }

    let report;
    try {
      ({ report } = await buildReport({ make, model, year, km: input.km, requestedPrice: input.requestedPrice }));
    } catch (error) {
      console.warn('free scan price unavailable:', error);
      throw serviceUnavailable('Veicolo riconosciuto, ma il calcolo del prezzo non è disponibile in questo momento. Riprova tra poco.');
    }

    const title = [make, model, photoAnalysis.vehicle.generation, year].filter(Boolean).join(' ');

    // Il salvataggio richiede un account: l'anonimo riceve il report ma non
    // può salvarlo (il client segna lo slot gratuito come consumato).
    let saved = false;
    let analysis: { id: string; createdAt: Date } | null = null;
    if (userId && entitlement.entitled) {
      const stored = await prisma.analysis.create({
        data: {
          userId,
          title,
          vehicleJson: JSON.stringify(photoAnalysis.vehicle),
          photoAnalysisJson: JSON.stringify(photoAnalysis),
          reportJson: JSON.stringify(report),
          sourceImageStored: false,
          immediateExecutionAccepted: true,
          consentAt: new Date(),
          termsVersion: '2026-08-02',
        },
      });
      saved = true;
      analysis = { id: stored.id, createdAt: stored.createdAt };
    }

    res.set('Cache-Control', 'no-store');
    void prisma.analyticsEvent.create({
      data: { type: 'scan', path: '/', meta: JSON.stringify({ make, model, recognized: true, saved }), userId },
    }).catch(() => undefined);
    res.json({
      success: true,
      recognized: true,
      vehicle,
      report,
      saved,
      freeUsed: !userId,
      analysis: analysis ? { id: analysis.id, createdAt: analysis.createdAt.toISOString() } : undefined,
    });
  })
);

export default router;
