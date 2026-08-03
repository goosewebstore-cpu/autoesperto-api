import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '@autoesperto/database';
import { buildReport } from '../services/reportService';
import { analyzeVehiclePhoto, askAutoEsperto } from '../services/ai';
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

const freeScanSchema = z.object({
  imageData: z.string().regex(/^data:image\/(jpeg|jpg|png|webp);base64,/, 'Carica una foto JPG, PNG o WebP').max(7_500_000),
});

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
    const { imageData } = freeScanSchema.parse(req.body);
    let photo: Awaited<ReturnType<typeof analyzeVehiclePhoto>> | undefined;

    // Primo tentativo normale
    try {
      photo = await analyzeVehiclePhoto({ imageData });
    } catch (error) {
      console.warn('free scan first attempt failed:', error);
    }

    // Se il primo è fallito o non ha riconosciuto, secondo tentativo aggressive
    if (!photo?.vehicle?.make || !photo?.vehicle?.model) {
      try {
        photo = await analyzeVehiclePhoto({ imageData, aggressive: true });
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

    let report;
    try {
      ({ report } = await buildReport({ make: photo.vehicle.make, model: photo.vehicle.model, year: photo.vehicle.year }));
    } catch (error) {
      console.warn('free scan price unavailable:', error);
      throw serviceUnavailable('Veicolo riconosciuto, ma il calcolo del prezzo non è disponibile in questo momento. Riprova tra poco.');
    }

    res.set('Cache-Control', 'no-store');
    void prisma.analyticsEvent.create({
      data: { type: 'scan', path: '/', meta: JSON.stringify({ make: photo.vehicle.make, model: photo.vehicle.model, recognized: true }) },
    }).catch(() => undefined);
    res.json({
      success: true,
      recognized: true,
      vehicle: photo.vehicle,
      report,
    });
  })
);

export default router;
