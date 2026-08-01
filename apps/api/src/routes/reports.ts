import { Router } from 'express';
import { z } from 'zod';
import { buildReport } from '../services/reportService';
import { askAutoEsperto } from '../services/ai';
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

export default router;
