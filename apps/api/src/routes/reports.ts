import { Router } from 'express';
import { z } from 'zod';
import { buildReport } from '../services/reportService';
import { analyzeVehiclePhoto, askAutoEsperto } from '../services/ai';
import { asyncHandler } from '../http';

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
          description: 'Non riesco a distinguere con affidabilità auto o danno in questa immagine.',
        },
        note: 'L’analisi visiva non è disponibile per questa foto. Prova con una foto esterna nitida, scattata da vicino e senza screenshot; non viene salvata.',
      };
    }
    res.set('Cache-Control', 'no-store');
    res.json({ success: true, analysis });
  })
);

export default router;
