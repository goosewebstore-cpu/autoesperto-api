import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { scanPassportDocument, chatPassportAI } from '../services/passportAI';
import type { VehiclePassportData, PassportShareConfig } from '@autoesperto/types';
import rateLimit from 'express-rate-limit';

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

const PublicPassportSchema = z.object({
  c: z.string().regex(/^AE-[A-Z0-9]{5,32}$/i),
  nn: z.string().max(100).optional(),
  v: z.object({
    mk: z.string().max(80),
    md: z.string().max(100),
    vr: z.string().max(120).optional(),
    y: z.number().int().min(1950).max(2100).optional(),
    f: z.string().max(40).optional(),
    p: z.string().max(40).optional(),
    dp: z.string().max(40).optional(),
    tr: z.string().max(40).optional(),
    bd: z.string().max(50).optional(),
    cl: z.string().max(40).optional(),
    ec: z.string().max(30).optional(),
    img: z.string().max(200_000).optional(),
  }).strip(),
  km: z.number().int().min(0).max(2_000_000).optional(),
  kd: z.string().max(40).optional(),
  hs: z.number().min(0).max(100).optional(),
  ev: z.number().min(0).max(10_000_000).optional(),
  em: z.number().min(0).max(10_000_000).optional(),
  rp: z.number().min(0).max(10_000_000).optional(),
  ab: z.number().min(0).max(10_000_000).optional(),
  ph: z.array(z.object({
    id: z.string().max(100).optional(),
    u: z.string().max(200_000),
    c: z.string().max(40).optional(),
    t: z.string().max(120).optional(),
    d: z.string().max(500).optional(),
  }).strip()).max(30).optional(),
  tm: z.array(z.object({
    id: z.string().max(100).optional(),
    d: z.string().max(40),
    k: z.number().int().min(0).max(2_000_000).optional(),
    t: z.union([z.string().max(40), z.number()]),
    ti: z.string().max(160),
    de: z.string().max(1000).optional(),
    c: z.number().min(0).max(10_000_000).optional(),
  }).strip()).max(100).optional(),
  sc: z.object({
    enabled: z.boolean().optional(),
    showVehicleInfo: z.boolean().optional(),
    showMileage: z.boolean().optional(),
    showMaintenance: z.boolean().optional(),
    showRepairs: z.boolean().optional(),
    showRevisions: z.boolean().optional(),
    showHealthScore: z.boolean().optional(),
    showOriginalDocs: z.boolean().optional(),
    showPhotos: z.boolean().optional(),
    showTimeline: z.boolean().optional(),
    showValuation: z.boolean().optional(),
  }).strip().optional(),
  sl: z.object({
    enabled: z.boolean(),
    askingPrice: z.number().min(0).max(10_000_000).optional(),
    negotiable: z.boolean().optional(),
    showValuation: z.boolean(),
    showHealthScore: z.boolean(),
    showMaintenance: z.boolean(),
    showInspection: z.boolean(),
    showPhotos: z.boolean(),
    allowContact: z.boolean(),
    contactMethod: z.enum(['whatsapp', 'email', 'phone']).optional(),
    contactValue: z.string().max(160).optional(),
    sellerNotes: z.string().max(1000).optional(),
  }).strip().optional(),
  tb: z.enum(['AI_ANALYZED', 'VERIFIED', 'INSPECTED']).optional(),
  ca: z.string().max(40).optional(),
}).strip();

const shareWriteLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Troppe richieste di condivisione. Riprova tra un minuto.' },
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

// In-memory store for shared public passports on Express backend
const sharedPublicPassports = new Map<string, any>();

// 3. Store Shared Public Passport
router.post('/share', shareWriteLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = PublicPassportSchema.parse(req.body);
    if (payload.sc?.showMileage === false) {
      delete payload.km;
      delete payload.kd;
      payload.tm = payload.tm?.map(({ k: _hiddenKm, ...item }) => item);
    }
    if (payload.sc?.showHealthScore === false) delete payload.hs;
    if (payload.sc?.showValuation === false) {
      delete payload.ev; delete payload.em; delete payload.rp; delete payload.ab;
    }
    if (payload.sc?.showVehicleInfo === false) {
      payload.v = { mk: payload.v.mk, md: payload.v.md, ...(payload.sc.showPhotos === false ? {} : { img: payload.v.img }) };
    }
    if (payload.sc?.showPhotos === false) { delete payload.v.img; delete payload.ph; }
    if (payload.sc?.showTimeline === false) delete payload.tm;
    const shareCode = payload.c.toUpperCase();
    const existing = sharedPublicPassports.get(shareCode);
    if (existing && JSON.stringify(existing) !== JSON.stringify(payload)) {
      return res.status(409).json({ success: false, error: 'Questo profilo condiviso non può essere sovrascritto.' });
    }
    if (!existing) sharedPublicPassports.set(shareCode, payload);
    return res.json({ success: true, shareCode });
  } catch (err) {
    return next(err);
  }
});

// 4. Sanitized Public Passport Endpoint (Strict Privacy Protection)
router.get('/public/:shareCode', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { shareCode } = req.params;
    if (!shareCode || typeof shareCode !== 'string') {
      return res.status(400).json({ success: false, error: 'Codice condivisione non valido.' });
    }

    const clean = shareCode.toUpperCase().trim();
    const stored = sharedPublicPassports.get(clean);
    if (stored) {
      res.set('Cache-Control', 'no-store');
      return res.json({
        success: true,
        shareCode: clean,
        payload: stored,
        passport: stored,
      });
    }

    return res.status(404).json({
      success: false,
      shareCode: clean,
      error: 'Profilo non trovato.',
    });
  } catch (err) {
    return next(err);
  }
});

export default router;
