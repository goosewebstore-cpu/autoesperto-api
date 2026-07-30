import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '@autoesperto/database';
import type { AutoReport } from '@autoesperto/types';
import { lookupPlate } from '../services/regcheck';
import { normalizeVehicleData, getAlternatives } from '../services/vehicleKB';
import { estimateMarketValue, estimateMarketValueWithKm } from '../services/pricing';
import { generateMarketListings } from '../services/market';
import { analyzeVehicle, askAutoEsperto } from '../services/ai';
import { authMiddleware, type AuthRequest } from '../lib/auth';

const router = Router();
router.use(authMiddleware);

const reportSchema = z.object({
  plate: z.string().min(5).optional(),
  vin: z.string().min(5).optional(),
  km: z.number().min(0).optional(),
  requestedPrice: z.number().min(0).optional(),
});

router.post('/analyze', async (req: AuthRequest, res) => {
  try {
    const parsed = reportSchema.parse(req.body);
    if (!parsed.plate && !parsed.vin) {
      return res.status(400).json({ success: false, error: 'Inserisci targa o VIN' });
    }

    const raw = await lookupPlate(parsed.plate || '');
    const vehicle = normalizeVehicleData(raw);
    vehicle.plate = parsed.plate;
    vehicle.vin = parsed.vin || vehicle.vin;

    const inputKm = parsed.km;
    const { value, min, max, adjustedForKm, kmAdjustment } = inputKm
      ? estimateMarketValueWithKm(vehicle, inputKm)
      : { ...estimateMarketValue(vehicle), adjustedForKm: 0, kmAdjustment: 0 };

    const listings = generateMarketListings(vehicle, value, inputKm);

    const reliability = await analyzeVehicle({
      vehicle,
      km: inputKm,
      requestedPrice: parsed.requestedPrice,
      marketValue: value,
    });

    const priceVsMarket = parsed.requestedPrice && value
      ? Math.round(((parsed.requestedPrice - value) / value) * 100)
      : undefined;

    const report: AutoReport = {
      vehicle,
      reliability,
      price: {
        estimatedValue: value,
        min,
        max,
        adjustedForKm,
        kmAdjustment,
        inputKm: inputKm || undefined,
        listings,
        requestedPrice: parsed.requestedPrice,
        priceVsMarketPercent: priceVsMarket,
        comment: priceVsMarket === undefined
          ? 'Prezzo stimato allineato alle quotazioni di mercato.'
          : priceVsMarket > 10
          ? `Il prezzo richiesto è superiore del ${priceVsMarket}% rispetto alla media. Consigliamo una trattativa.`
          : priceVsMarket < -10
          ? `Il prezzo richiesto è inferiore del ${Math.abs(priceVsMarket)}%: potrebbe essere un'occasione, ma verifica lo stato.`
          : 'Il prezzo richiesto è allineato al mercato.',
      },
      alternatives: getAlternatives(vehicle.make, vehicle.model),
      videos: [
        { title: `Recensione ${vehicle.make} ${vehicle.model}`, thumbnail: '', url: `https://www.youtube.com/results?search_query=${encodeURIComponent(vehicle.make + ' ' + vehicle.model + ' prova su strada')}` },
        { title: `Problemi comuni ${vehicle.make} ${vehicle.model}`, thumbnail: '', url: `https://www.youtube.com/results?search_query=${encodeURIComponent(vehicle.make + ' ' + vehicle.model + ' problemi')}` },
      ],
      createdAt: new Date().toISOString(),
    };

    // Salva nel database se l'utente è autenticato
    if (req.userId) {
      const existingVehicle = await prisma.vehicle.findFirst({
        where: { OR: [{ plate: vehicle.plate || undefined }, { vin: vehicle.vin || undefined }] },
      });
      let vehicleId: string;
      if (existingVehicle) {
        vehicleId = existingVehicle.id;
      } else {
        const newVehicle = await prisma.vehicle.create({
          data: {
            plate: vehicle.plate,
            vin: vehicle.vin,
            make: vehicle.make,
            model: vehicle.model,
            version: vehicle.version,
            year: vehicle.year,
            fuel: vehicle.fuel,
            displacement: vehicle.displacement,
            power: vehicle.power,
            transmission: vehicle.transmission,
            body: vehicle.body,
            doors: vehicle.doors,
            color: vehicle.color,
            euroClass: vehicle.euroClass,
            imageUrl: vehicle.imageUrl,
          },
        });
        vehicleId = newVehicle.id;
      }
      await prisma.report.create({
        data: {
          userId: req.userId,
          vehicleId,
          reliabilityScore: reliability.score,
          verdict: reliability.verdict,
          marketValue: value,
          marketMin: min,
          marketMax: max,
          summary: reliability.summary,
          fullAnalysis: JSON.stringify(report),
        },
      });
    }

    res.json({ success: true, report });
  } catch (err: any) {
    console.error('Analyze error:', err.message);
    res.status(400).json({ success: false, error: err.message });
  }
});

router.post('/ask', async (req, res) => {
  try {
    const { question, vehicle, analysis } = req.body;
    if (!question || !vehicle || !analysis) {
      return res.status(400).json({ success: false, error: 'Domanda, veicolo e analisi richiesti' });
    }
    const answer = await askAutoEsperto(question, vehicle, analysis);
    res.json({ success: true, answer });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;