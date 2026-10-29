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
import { asyncHandler, serviceUnavailable } from '../http';
import { getAccountEntitlement } from '../services/entitlement';
import { getAnalysisPrice } from '../services/billing';

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
    freeUsed: z.boolean().optional(),
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
    let fuel: string | undefined = input.fuel;

    if (input.imageData) {
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
    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Accedi o crea un account per iniziare con la tua analisi gratuita.',
        needsLogin: true,
      });
      return;
    }

    const entitlement = await getAccountEntitlement(userId);
    if (!entitlement.entitled) {
      res.status(402).json({
        success: false,
        error: 'Hai terminato l’analisi gratuita. Acquista un’analisi singola a 1,99 €.',
        needsUpgrade: true,
        amountCents: getAnalysisPrice().amountCents,
      });
      return;
    }

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

    let saved = false;
    let analysis: { id: string; createdAt: Date } | null = null;
    const stored = await prisma.analysis.create({
        data: {
          userId,
          title,
          vehicleJson: JSON.stringify({ ...photoAnalysis.vehicle, make, model, year, fuel: vehicle.fuel }),
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
