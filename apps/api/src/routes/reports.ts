import { Router } from 'express';
import { z } from 'zod';
import type { AutoReport } from '@autoesperto/types';
import { lookupPlate, normalizeVehicleData } from '../services/regcheck';
import { getAlternatives } from '../services/vehicleKB';
import { estimateMarketValue } from '../services/pricing';
import { generateMarketListings } from '../services/market';
import { analyzeVehicle } from '../services/ai';

const router = Router();

const reportSchema = z.object({
  plate: z.string().min(5).optional(),
  vin: z.string().min(5).optional(),
  km: z.number().min(0).optional(),
  requestedPrice: z.number().min(0).optional(),
});

router.post('/analyze', async (req, res) => {
  try {
    const parsed = reportSchema.parse(req.body);
    if (!parsed.plate && !parsed.vin) {
      return res.status(400).json({ success: false, error: 'Inserisci targa o VIN' });
    }

    const raw = await lookupPlate(parsed.plate || '');
    const vehicle = normalizeVehicleData(raw);
    vehicle.plate = parsed.plate;
    vehicle.vin = parsed.vin || vehicle.vin;

    const { value, min, max } = estimateMarketValue(vehicle);
    const listings = generateMarketListings(vehicle, value);

    const reliability = await analyzeVehicle({
      vehicle,
      km: parsed.km,
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
        { title: `Recensione ${vehicle.make} ${vehicle.model}`, thumbnail: '/video-thumb.jpg', url: `https://www.youtube.com/results?search_query=${encodeURIComponent(vehicle.make + ' ' + vehicle.model + ' prova su strada')}` },
        { title: `Problemi comuni ${vehicle.make} ${vehicle.model}`, thumbnail: '/video-thumb.jpg', url: `https://www.youtube.com/results?search_query=${encodeURIComponent(vehicle.make + ' ' + vehicle.model + ' problemi')}` },
      ],
      createdAt: new Date().toISOString(),
    };

    res.json({ success: true, report });
  } catch (err: any) {
    console.error('Analyze error:', err.message);
    res.status(400).json({ success: false, error: err.message });
  }
});

router.post('/ask', async (req, res) => {
  try {
    const { question, vehicle, analysis } = req.body;
    const { askAutoEsperto } = await import('../services/ai');
    const answer = await askAutoEsperto(question, vehicle, analysis);
    res.json({ success: true, answer });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
