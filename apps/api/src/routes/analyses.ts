import { Router } from 'express';
import { prisma } from '@autoesperto/database';
import type { AutoReport } from '@autoesperto/types';
import { z } from 'zod';
import { asyncHandler, badRequest, conflict, forbidden, serviceUnavailable } from '../http';
import { type AuthenticatedRequest, requireAuth } from '../services/auth';
import { analyzeVehiclePhoto } from '../services/ai';
import { buildReport } from '../services/reportService';

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
    const analysis = await prisma.analysis.findUnique({ where: { userId } });
    res.set('Cache-Control', 'no-store');
    res.json({ success: true, analysis: analysis ? storedAnalysis(analysis) : null });
  })
);

router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { userId } = (req as AuthenticatedRequest).auth;
    const { imageData } = analysisSchema.parse(req.body);
    const [paidPurchase, existing] = await Promise.all([
      prisma.purchase.findFirst({ where: { userId, status: 'PAID' }, select: { id: true } }),
      prisma.analysis.findUnique({ where: { userId }, select: { id: true } }),
    ]);
    if (!paidPurchase) throw forbidden('Acquista l’analisi prima di procedere.');
    if (existing) throw conflict('Questo account ha già utilizzato la sua analisi. Il report resta disponibile nell’area personale.');

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

    try {
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
      res.status(201).json({ success: true, analysis: storedAnalysis(analysis) });
    } catch (error) {
      if ((error as { code?: string })?.code === 'P2002') {
        throw conflict('Questo account ha già utilizzato la sua analisi.');
      }
      throw error;
    }
  })
);

export default router;
