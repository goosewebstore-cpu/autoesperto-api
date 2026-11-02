import { resolveVehicleFuel } from '../services/powertrain';
import { imageDataSchema } from '../services/imageValidation';
import { Router } from 'express';
import { z } from 'zod';
import type { Request } from 'express';
import { prisma } from '@autoesperto/database';
import { buildReport } from '../services/reportService';
import { analyzeVehiclePhoto, askAutoEsperto, isVisionConfigured, type PhotoAnalysisResult } from '../services/ai';
import { searchModel } from '../services/modelDB';
import { findModelEra } from '../services/modelEra';
import { verifyAuthToken } from '../services/auth';
import { asyncHandler, serviceUnavailable, badRequest, notFound, paymentRequired } from '../http';
import { getAccountEntitlement } from '../services/entitlement';
import { getAnalysisPrice } from '../services/billing';
import { createUnlockedReportShare, getUnlockedReport, readGeneratedReportPreview, readSharedReport, saveGeneratedReport, unlockReportWithCredit, unlockReportWithPro } from '../services/reportPreview';
import { requireAuth, type AuthenticatedRequest } from '../services/auth';
import { PRO_REPORTS_PER_CYCLE } from '../services/proPlans';

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
    year: z.coerce.number().int().min(1950).max(new Date().getFullYear() + 1).optional(),
    km: z.coerce.number().int().min(0).max(1000000).optional(),
    requestedPrice: z.coerce.number().int().min(0).max(10000000).optional(),
    fuel: z.string().trim().optional(),
    transmission: z.string().trim().optional(),
    version: z.string().trim().optional(),
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
  imageData: imageDataSchema,
  vehicle: z.object({ make: z.string().optional(), model: z.string().optional(), year: z.coerce.number().int().optional(), fuel: z.string().optional() }).optional(),
});

const freeScanSchema = z
  .object({
    imageData: imageDataSchema
      .optional(),
    make: z.string().trim().min(2).optional(),
    model: z.string().trim().min(1).optional(),
    year: z.coerce.number().int().min(1950).max(new Date().getFullYear() + 1).optional(),
    km: z.coerce.number().int().min(0).max(1000000).optional(),
    requestedPrice: z.coerce.number().int().min(0).max(10000000).optional(),
    fuel: z.string().trim().optional(),
    transmission: z.string().trim().optional(),
    version: z.string().trim().optional(),
    mode: z.enum(['model', 'photo', 'listing']).optional(),
    // La foto viene prima usata per un riconoscimento rapido; il report parte
    // solo dopo che l'utente ha confermato anno e chilometri.
    recognitionOnly: z.boolean().optional(),
  })
  .refine((data) => Boolean(data.imageData) || Boolean(data.make && data.model), {
    message: 'Indica una foto oppure marca e modello',
  });

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

function manualPhotoAnalysis(make: string, model: string, year?: number, fuel?: string): PhotoAnalysisResult {
  return {
    vehicle: {
      make,
      model,
      year,
      fuel,
      confidence: 'bassa',
    },
    damage: {
      visible: false,
      category: 'non_chiaro',
      severity: 'media',
      description: 'Inserimento manuale di marca e modello.',
    },
    note: 'Identità del veicolo basata sui dati inseriti. Non è stato possibile eseguire una valutazione visiva della foto.',
  };
}

async function premiumAccess(req: Request, res: import('express').Response): Promise<boolean> {
  const userId = getOptionalUserId(req);
  if (!userId) { res.status(401).json({success:false,needsLogin:true,error:'Accedi per usare questa funzione. Puoi comunque ottenere un’anteprima gratuita da modello, foto o annuncio.'}); return false; }
  const entitlement = await getAccountEntitlement(userId);
  if (!entitlement.entitled) { res.status(402).json({success:false,needsUpgrade:true,error:'Questa funzione AI avanzata non è inclusa nei nuovi piani. Puoi consultare l’anteprima e sbloccare il report completo dalla pagina prezzi.'}); return false; }
  return true;
}
router.get('/trial', asyncHandler(async (_req,res) => { res.set('Cache-Control','no-store'); res.json({success:true,available:false,modelFree:true,trialDays:0}); }));

router.post(
  '/analyze',
  asyncHandler(async (req, res) => {
    const input = reportSchema.parse(req.body);
    const { report, cached } = await buildReport(input);
    const preview = await saveGeneratedReport({
      userId: getOptionalUserId(req),
      title: [report.vehicle.make, report.vehicle.model, report.vehicle.year].filter(Boolean).join(' '),
      report,
      photoAnalysis: report.photoAnalysis,
    });
    res.set('Cache-Control', 'no-store');
    res.json({ success: true, preview, cached });
  })
);

router.get('/preview/:id', asyncHandler(async (req, res) => {
  const token = req.header('x-report-access') || '';
  const preview = await readGeneratedReportPreview(req.params.id, token);
  res.set('Cache-Control', 'no-store');
  if (!preview) { res.status(404).json({ success: false, error: 'Anteprima non trovata o scaduta.' }); return; }
  res.json({ success: true, preview });
}));

router.get('/:id/full', requireAuth, asyncHandler(async (req, res) => {
  const { userId } = (req as AuthenticatedRequest).auth;
  const report = await getUnlockedReport(req.params.id, userId);
  res.set('Cache-Control', 'no-store');
  if (!report) throw notFound('Report non trovato o non acquistato da questo account.');
  res.json({ success: true, report });
}));

router.post('/:id/share', requireAuth, asyncHandler(async (req, res) => {
  const { userId } = (req as AuthenticatedRequest).auth;
  const share = await createUnlockedReportShare(req.params.id, userId);
  if (!share) throw notFound('Report completo non trovato in questo account.');
  await prisma.analyticsEvent.create({ data: { type: 'share_clicked', userId, path: '/account/pro', meta: JSON.stringify({ reportId: req.params.id, expiresAt: share.expiresAt.toISOString() }) } });
  res.set('Cache-Control', 'no-store').json({ success: true, token: share.token, expiresAt: share.expiresAt.toISOString() });
}));

router.get('/share/:token', asyncHandler(async (req, res) => {
  const shared = await readSharedReport(req.params.token);
  res.set('Cache-Control', 'private, no-store');
  if (!shared) throw notFound('Questo link è scaduto o non è più valido.');
  res.json({ success: true, ...shared });
}));

router.post('/:id/unlock-with-credit', requireAuth, asyncHandler(async (req, res) => {
  const { userId } = (req as AuthenticatedRequest).auth;
  const token = req.header('x-report-access') || '';
  const report = await unlockReportWithCredit(req.params.id, userId, token);
  if (!report) {
    const remaining = await prisma.reportCredit.count({ where: { userId, status: 'AVAILABLE', purchase: { status: 'PAID' } } });
    if (!remaining) throw paymentRequired('Non hai crediti disponibili. Scegli il report singolo o il pacchetto da 4 report (3 + 1 omaggio).');
    throw notFound('Anteprima scaduta o non associata al tuo account.');
  }
  res.set('Cache-Control', 'no-store').json({ success: true, report });
}));

router.post('/:id/unlock-pro', requireAuth, asyncHandler(async (req, res) => {
  const { userId } = (req as AuthenticatedRequest).auth;
  const token = req.header('x-report-access') || '';
  const report = await unlockReportWithPro(req.params.id, userId, token);
  if (!report) {
    const subscription = await prisma.proSubscription.findUnique({ where: { userId } });
    if (!subscription || subscription.status !== 'ACTIVE' || !subscription.periodEnd || subscription.periodEnd <= new Date()) throw paymentRequired('AutoEsperto PRO non è attivo.');
    if (subscription.reportsUsed >= PRO_REPORTS_PER_CYCLE) throw paymentRequired('Hai utilizzato tutti i 33 report di questo ciclo (30 inclusi + 3 omaggio). La quota si rinnova alla prossima data di fatturazione.');
    throw notFound('Anteprima scaduta o non associata al tuo account.');
  }
  res.set('Cache-Control', 'no-store').json({ success: true, report });
}));

router.post(
  '/ask',
  asyncHandler(async (req, res) => {
    const { question, vehicle, analysis } = askSchema.parse(req.body);
    if (!(await premiumAccess(req,res))) return;
    const answer = await askAutoEsperto(question, vehicle, analysis);
    res.set('Cache-Control', 'no-store');
    res.json({ success: true, answer });
  })
);

router.post(
  '/photo-analyze',
  asyncHandler(async (req, res) => {
    const input = photoSchema.parse(req.body);
    if (!(await premiumAccess(req,res))) return;
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
    const mode = input.mode || (input.imageData ? 'photo' : 'model');
    if (mode === 'model' && (!input.make || !input.model)) throw badRequest('Inserisci marca e modello per la valutazione gratuita.');
    let photo: PhotoAnalysisResult | undefined;
    let photoAnalysis: PhotoAnalysisResult;
    let make: string | undefined;
    let model: string | undefined;
    let year: number | undefined;
    let fuel: string | undefined = input.fuel;

    if (input.imageData && mode === 'photo') {
      // Un solo tentativo di riconoscimento: i loop AI sequenziali multipli
      // ritardavano la risposta oltre ogni budget. Se l'AI non è configurata o
      // il primo tentativo non riconosce l'auto, rispondiamo subito con
      // recognized:false e il cliente compila a mano (nessun errore bloccante).
      if (isVisionConfigured()) {
        try {
          photo = await analyzeVehiclePhoto({
            imageData: input.imageData,
            ...(input.make && input.model ? { vehicle: { make: input.make, model: input.model, year: input.year } } : {}),
            aggressive: !input.recognitionOnly,
          });
        } catch (error) {
          console.warn('free scan recognition failed:', error);
        }
      }

      if (!photo && input.make && input.model && !input.recognitionOnly) {
        photo = manualPhotoAnalysis(input.make, input.model, input.year, fuel);
      }

      if (!photo) {
        res.set('Cache-Control', 'no-store');
        res.json({
          success: true,
          recognized: false,
          message: 'Non riusciamo a riconoscere l\'auto dalla foto in questo momento. Inserisci marca e modello a mano e procedi subito.',
        });
        return;
      }

      if ((!photo.vehicle.make || !photo.vehicle.model) && !(input.make && input.model)) {
        res.set('Cache-Control', 'no-store');
        res.json({
          success: true,
          recognized: false,
          message: 'L\'AI non ha riconosciuto marca e modello con sufficiente sicurezza. Prova una foto nitida di tre quarti, oppure inserisci marca e modello a mano.',
        });
        return;
      }
      make = input.make || photo.vehicle.make;
      model = input.model || photo.vehicle.model;
      year = input.year || photo.vehicle.year;
      if (!fuel && photo.vehicle.fuel) {
        fuel = photo.vehicle.fuel;
      }
      photoAnalysis = photo;
    } else {
      make = input.make;
      model = input.model;
      year = input.year;
      const found = searchModel(make!, model!, fuel);
      const era = findModelEra(make!, model!);
      if (!year) {
        year = found?.year || era?.medianYear;
      }
      if (!fuel) {
        fuel = found?.fuel || era?.fuel;
      }
      photoAnalysis = manualPhotoAnalysis(make!, model!, year, fuel);
      if (year && !photoAnalysis.vehicle.year) {
        photoAnalysis.vehicle.year = year;
      }
      if (fuel && !photoAnalysis.vehicle.fuel) {
        photoAnalysis.vehicle.fuel = fuel;
      }
    }

    fuel = resolveVehicleFuel(make,model,fuel || photoAnalysis.vehicle.fuel);
    photoAnalysis.vehicle.fuel = fuel;
    const vehicle = {
      make,
      model,
      generation: photoAnalysis.vehicle.generation,
      year,
      fuel: fuel || photoAnalysis.vehicle.fuel,
      color: photoAnalysis.vehicle.color,
      bodyType: photoAnalysis.vehicle.bodyType,
      confidence: photoAnalysis.vehicle.confidence,
    };

    // Non bloccare lo scanner fotografico con scraping annunci e costruzione
    // dell'intero report. Il client raccoglie subito anno, km e alimentazione
    // effettivi, quindi invia una seconda richiesta con dati migliori.
    if (input.recognitionOnly) {
      res.set('Cache-Control', 'no-store');
      res.json({
        success: true,
        recognized: true,
        vehicle,
        saved: false,
        freeUsed: true,
      });
      return;
    }

    const userId = getOptionalUserId(req);

    let report;
    try {
      ({ report } = await buildReport({
        make,
        model,
        year,
        km: input.km,
        requestedPrice: input.requestedPrice,
        fuel: vehicle.fuel,
        transmission: input.transmission,
        version: input.version,
      }));
    } catch (error) {
      console.warn('free scan price unavailable:', error);
      throw serviceUnavailable('Veicolo riconosciuto, ma il calcolo del prezzo non è disponibile in questo momento. Riprova tra poco.');
    }

    const title = [make, model, photoAnalysis.vehicle.generation, year].filter(Boolean).join(' ');

    if (input.imageData) report.photoAnalysis = photoAnalysis;

    const preview = await saveGeneratedReport({ userId, title, report, photoAnalysis });

    res.set('Cache-Control', 'no-store');
    void prisma.analyticsEvent.create({
      data: { type: 'scan', path: '/', meta: JSON.stringify({ make, model, recognized: true, saved: false }), userId },
    }).catch(() => undefined);
    const result = {
      success: true,
      recognized: true,
      vehicle,
      preview,
      saved: false,
      freeUsed: false,
      mode,
    };
    res.json(result);
  })
);

export default router;
