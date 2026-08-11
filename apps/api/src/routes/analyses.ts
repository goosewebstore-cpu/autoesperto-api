import { Router } from 'express';
import { prisma } from '@autoesperto/database';
import type { AutoReport } from '@autoesperto/types';
import { z } from 'zod';
import { asyncHandler, badRequest, conflict, forbidden, serviceUnavailable } from '../http';
import { type AuthenticatedRequest, requireAuth } from '../services/auth';
import { analyzeVehiclePhoto } from '../services/ai';
import { buildReport } from '../services/reportService';
import { isOwnerEmail } from '../services/owner';

const router = Router();

const analysisSchema = z.object({
  imageData: z
    .string()
    .regex(/^data:image\/(jpeg|jpg|png|webp);base64,/, 'Carica una foto JPG, PNG o WebP')
    .max(7_500_000),
  immediateExecutionAccepted: z.literal(true, {
    errorMap: () => ({ message: 'È necessario richiedere espressamente l’esecuzione immediata del report.' }),
  }),
});

function parseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function storedAnalysis(analysis: {
  id: string;
  title: string;
  vehicleJson: string;
  photoAnalysisJson: string;
  reportJson: string;
  sourceImageStored: boolean;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: analysis.id,
    title: analysis.title,
    vehicle: parseJson(analysis.vehicleJson),
    photoAnalysis: parseJson(analysis.photoAnalysisJson),
    report: parseJson(analysis.reportJson),
    sourceImageStored: analysis.sourceImageStored,
    createdAt: analysis.createdAt.toISOString(),
    updatedAt: analysis.updatedAt.toISOString(),
  };
}

router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { userId } = (req as AuthenticatedRequest).auth;
    const analyses = await prisma.analysis.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.set('Cache-Control', 'no-store');
    res.json({ success: true, analyses: analyses.map(storedAnalysis), analysis: analyses[0] ? storedAnalysis(analyses[0]) : null });
  })
);

router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { userId } = (req as AuthenticatedRequest).auth;
    const { imageData } = analysisSchema.parse(req.body);
    const [analysisCount, paidPurchase, subscription] = await Promise.all([
      prisma.analysis.count({ where: { userId } }),
      prisma.purchase.findFirst({ where: { userId, status: 'PAID' }, select: { id: true } }),
      prisma.user.findUnique({ where: { id: userId }, select: { email: true, subscription: { select: { plan: true, status: true } } } }),
    ]);
    const premiumActive = subscription?.subscription?.plan === 'PREMIUM' && subscription?.subscription?.status === 'ACTIVE';
    if (analysisCount > 0 && !paidPurchase && !premiumActive && !isOwnerEmail(subscription?.email)) {
      throw forbidden('Hai già usato la tua analisi gratuita. Passa a Premium per salvare e analizzare altre auto senza limiti.');
    }

    let photoAnalysis: Awaited<ReturnType<typeof analyzeVehiclePhoto>>;
    try {
      photoAnalysis = await analyzeVehiclePhoto({ imageData });
    } catch (error) {
      console.warn('paid photo analysis unavailable:', error instanceof Error ? error.message : error);
      throw serviceUnavailable('L’analisi visiva non è disponibile in questo momento. Riprova più tardi: il credito non è stato utilizzato.');
    }
    const { make, model, year } = photoAnalysis.vehicle;
    if (!make || !model) {
      throw badRequest('Non riesco a riconoscere l’auto con sufficiente sicurezza. Prova una foto nitida di tre quarti. Il credito non è stato utilizzato.');
    }

    let report: AutoReport;
    try {
      ({ report } = await buildReport(
        { make, model, year },
        { requireDetailedModelAnalysis: true },
      ));
    } catch (error) {
      console.warn('paid detailed report unavailable:', error instanceof Error ? error.message : error);
      throw serviceUnavailable('Il report specifico per questo modello non è disponibile in questo momento. Riprova più tardi: il credito non è stato utilizzato.');
    }
    const title = [make, model, photoAnalysis.vehicle.generation, year].filter(Boolean).join(' ');

    const analysis = await prisma.analysis.create({
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
    void prisma.analyticsEvent.create({
      data: { type: 'analysis', path: '/account', meta: JSON.stringify({ make, model }), userId },
    }).catch(() => undefined);
    res.status(201).json({ success: true, analysis: storedAnalysis(analysis) });
  })
);

export default router;
