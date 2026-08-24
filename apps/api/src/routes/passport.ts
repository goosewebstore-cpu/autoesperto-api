import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { scanPassportDocument, chatPassportAI } from '../services/passportAI';
import type { VehiclePassportData, PassportShareConfig } from '@autoesperto/types';

const router = Router();

const ScanDocSchema = z.object({
  imageData: z.string().min(10, 'Immagine non valida.'),
  categoryHint: z
    .enum(['veicolo', 'assicurazione', 'manutenzione', 'riparazioni', 'revisioni', 'altro'])
    .optional(),
});

const ChatSchema = z.object({
  question: z.string().min(2, 'La domanda deve avere almeno 2 caratteri.').max(800),
  passport: z.custom<VehiclePassportData>((val) => typeof val === 'object' && val !== null),
  history: z.array(z.any()).optional(),
});

// 1. AI Document Scanner (OCR & Extraction)
router.post('/scan-document', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { imageData, categoryHint } = ScanDocSchema.parse(req.body);
    const result = await scanPassportDocument(imageData, categoryHint);
    return res.json({ success: true, result });
  } catch (err) {
    return next(err);
  }
});

// 2. Chiedi alla tua Auto (Contextual AI Assistant)
router.post('/chat', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { question, passport, history } = ChatSchema.parse(req.body);
    const message = await chatPassportAI(question, passport, history);
    return res.json({ success: true, message });
  } catch (err) {
    return next(err);
  }
});

// 3. Sanitized Public Passport Endpoint (Strict Privacy Protection)
router.get('/public/:shareCode', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { shareCode } = req.params;
    if (!shareCode || typeof shareCode !== 'string') {
      return res.status(400).json({ success: false, error: 'Codice condivisione non valido.' });
    }

    // In a stateless/hybrid setup, the client can query public state or render client-side sanitized passport
    return res.json({
      success: true,
      shareCode: shareCode.toUpperCase(),
      message: 'Passport pubblico pronto.',
    });
  } catch (err) {
    return next(err);
  }
});

export default router;
