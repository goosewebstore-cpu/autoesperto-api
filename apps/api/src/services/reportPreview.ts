import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { prisma } from '@autoesperto/database';
import type { AutoReport, PhotoAnalysisResult, ReportPreview } from '@autoesperto/types';
import { PRO_REPORTS_PER_CYCLE } from './proPlans';

const PREVIEW_TTL_DAYS = 30;

export function buildReportPreview(report: AutoReport, reportId: string, accessToken: string): ReportPreview {
  const { vehicle, price } = report;
  const comparison = price.market?.comparison;
  const hasReliableComparables = Boolean(
    comparison && (comparison.sampleSize || 0) >= 3 && comparison.yearMatched !== false &&
    (price.inputKm === undefined || comparison.kmMatched === true)
  );
  const hasYear = Boolean(vehicle.year);
  const hasKm = price.inputKm !== undefined;
  const hasPrice = price.requestedPrice !== undefined;
  const completeEnough = hasYear && hasKm && hasPrice && hasReliableComparables;
  const confidence: ReportPreview['confidence'] = completeEnough ? 'alta' : hasYear && hasKm ? 'media' : 'bassa';
  const firstJudgment = hasReliableComparables && price.priceLabel
    ? price.priceLabel === 'GOOD'
      ? { label: 'Prezzo sotto gli annunci comparabili', explanation: 'Il prezzo richiesto è inferiore ai prezzi pubblicati per auto simili. Verifica comunque condizioni e documenti.' }
      : price.priceLabel === 'HIGH'
        ? { label: 'Prezzo sopra gli annunci comparabili', explanation: 'Confronta dotazioni, chilometraggio e condizioni prima di valutare il prezzo.' }
        : { label: 'Prezzo vicino agli annunci comparabili', explanation: 'Il prezzo è vicino ai valori degli annunci usati come confronto.' }
    : undefined;
  const missingData: string[] = [];
  if (!hasYear) missingData.push('Anno non disponibile');
  if (!hasKm) missingData.push('Chilometraggio non inserito');
  if (!hasPrice) missingData.push('Prezzo richiesto non inserito');
  if (!hasReliableComparables) missingData.push('Annunci comparabili sufficienti non disponibili');

  return {
    reportId,
    accessToken,
    vehicle: {
      make: vehicle.make,
      model: vehicle.model,
      ...(vehicle.year ? { year: vehicle.year } : {}),
      ...(vehicle.version ? { version: vehicle.version } : {}),
      ...(vehicle.fuel ? { fuel: vehicle.fuel } : {}),
    },
    ...(hasPrice ? { requestedPrice: price.requestedPrice } : {}),
    ...(hasReliableComparables && Number.isFinite(price.min) && Number.isFinite(price.max)
      ? { marketRange: { min: price.min, max: price.max } }
      : {}),
    ...(firstJudgment ? { firstJudgment } : {}),
    firstCheck: 'Chiedi le fatture dei tagliandi e fai controllare l’auto da un meccanico.',
    confidence,
    missingData,
    limitations: ['Chilometraggio, incidenti, tagliandi e stato meccanico non sono verificati da una foto o da un annuncio.'],
  };
}

export async function saveGeneratedReport(input: {
  userId: string | null;
  title: string;
  report: AutoReport;
  photoAnalysis?: PhotoAnalysisResult;
}) {
  const id = randomUUID();
  const accessToken = randomBytes(32).toString('base64url');
  const accessTokenHash = createHash('sha256').update(accessToken).digest('hex');
  const preview = buildReportPreview(input.report, id, accessToken);
  const { accessToken: _token, ...previewJson } = preview;
  const expiresAt = new Date(Date.now() + PREVIEW_TTL_DAYS * 24 * 60 * 60 * 1000);
  await prisma.generatedReport.create({
    data: {
      id,
      userId: input.userId,
      accessTokenHash,
      title: input.title,
      vehicleJson: JSON.stringify(input.report.vehicle),
      photoAnalysisJson: input.photoAnalysis ? JSON.stringify(input.photoAnalysis) : null,
      previewJson: JSON.stringify(previewJson),
      reportJson: JSON.stringify(input.report),
      expiresAt,
    },
  });
  return preview;
}

export async function readGeneratedReportPreview(id: string, accessToken: string): Promise<ReportPreview | null> {
  const stored = await findGeneratedReportWithToken(id, accessToken);
  if (!stored || (stored.expiresAt && stored.expiresAt.getTime() <= Date.now())) return null;
  let preview: Omit<ReportPreview, 'accessToken'>;
  try {
    preview = JSON.parse(stored.previewJson) as Omit<ReportPreview, 'accessToken'>;
  } catch {
    return null;
  }
  return { ...preview, accessToken };
}

async function findGeneratedReportWithToken(id: string, accessToken: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id) || accessToken.length < 32 || accessToken.length > 100) return null;
  const accessTokenHash = createHash('sha256').update(accessToken).digest('hex');
  const stored = await prisma.generatedReport.findUnique({ where: { id } });
  if (!stored || stored.accessTokenHash !== accessTokenHash) return null;
  return stored;
}

export async function getReportForCheckout(id: string, userId: string, accessToken: string) {
  const stored = await findGeneratedReportWithToken(id, accessToken);
  if (!stored || stored.userId && stored.userId !== userId || stored.expiresAt && stored.expiresAt.getTime() <= Date.now()) return null;
  if (stored.status !== 'PREVIEW') return null;
  return stored;
}

export async function getUnlockedReport(id: string, userId: string) {
  const stored = await prisma.generatedReport.findUnique({ where: { id } });
  if (!stored || stored.userId !== userId || stored.status !== 'UNLOCKED') return null;
  try { return JSON.parse(stored.reportJson); } catch { return null; }
}

export async function createUnlockedReportShare(id: string, userId: string) {
  const report = await prisma.generatedReport.findFirst({ where: { id, userId, status: 'UNLOCKED' }, select: { id: true } });
  if (!report) return null;
  const token = randomBytes(32).toString('base64url');
  const shareTokenHash = createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await prisma.generatedReport.update({ where: { id }, data: { shareTokenHash, shareExpiresAt: expiresAt } });
  return { token, expiresAt };
}

export async function readSharedReport(token: string) {
  if (!/^[A-Za-z0-9_-]{40,60}$/.test(token)) return null;
  const shareTokenHash = createHash('sha256').update(token).digest('hex');
  const report = await prisma.generatedReport.findUnique({ where: { shareTokenHash } });
  if (!report || report.status !== 'UNLOCKED' || !report.shareExpiresAt || report.shareExpiresAt <= new Date()) return null;
  try { return { report: JSON.parse(report.reportJson), title: report.title, expiresAt: report.shareExpiresAt }; } catch { return null; }
}

export async function unlockReportWithCredit(id: string, userId: string, accessToken: string) {
  const stored = await findGeneratedReportWithToken(id, accessToken);
  if (!stored || stored.userId && stored.userId !== userId || stored.expiresAt && stored.expiresAt.getTime() <= Date.now()) return null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await prisma.$transaction(async (tx) => {
    const fresh = await tx.generatedReport.findUnique({ where: { id } });
    if (!fresh) return null;
    if (fresh.status === 'UNLOCKED') {
      if (fresh.userId !== userId) return null;
      try { return JSON.parse(fresh.reportJson); } catch { return null; }
    }
    if (fresh.status !== 'PREVIEW') return null;
    const credit = await tx.reportCredit.findFirst({ where: { userId, status: 'AVAILABLE', purchase: { status: 'PAID' } }, orderBy: { createdAt: 'asc' } });
    if (!credit) return null;
    const reportClaim = await tx.generatedReport.updateMany({ where: { id, status: 'PREVIEW' }, data: { status: 'UNLOCKED', userId, unlockedAt: new Date(), expiresAt: null } });
    if (reportClaim.count !== 1) {
      const winner = await tx.generatedReport.findUnique({ where: { id } });
      if (winner?.status === 'UNLOCKED' && winner.userId === userId) {
        try { return JSON.parse(winner.reportJson); } catch { return null; }
      }
      return null;
    }
    const creditClaim = await tx.reportCredit.updateMany({ where: { id: credit.id, status: 'AVAILABLE', generatedReportId: null }, data: { status: 'CONSUMED', generatedReportId: id, consumedAt: new Date() } });
    if (creditClaim.count !== 1) throw new Error('Il credito è già stato utilizzato.');
    await tx.analyticsEvent.upsert({ where: { id: 'report-unlocked:' + id }, update: {}, create: { id: 'report-unlocked:' + id, type: 'report_unlocked', userId, path: '/account', meta: JSON.stringify({ reportId: id, source: 'credit' }) } });
    try { return JSON.parse(fresh.reportJson); } catch { return null; }
      }, { isolationLevel: 'Serializable' });
    } catch (error) {
      if ((error as { code?: string }).code === 'P2034' && attempt < 2) continue;
      throw error;
    }
  }
  return null;
}

export async function unlockReportWithPro(id: string, userId: string, accessToken: string) {
  const stored = await findGeneratedReportWithToken(id, accessToken);
  if (!stored || (stored.userId && stored.userId !== userId) || (stored.expiresAt && stored.expiresAt.getTime() <= Date.now())) return null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await prisma.$transaction(async (tx) => {
        const report = await tx.generatedReport.findUnique({ where: { id } });
        if (!report) return null;
        if (report.status === 'UNLOCKED') {
          if (report.userId !== userId) return null;
          try { return JSON.parse(report.reportJson); } catch { return null; }
        }
        if (report.status !== 'PREVIEW') return null;
        const subscription = await tx.proSubscription.findUnique({ where: { userId } });
        if (!subscription || subscription.status !== 'ACTIVE' || !subscription.periodStart || !subscription.periodEnd || subscription.periodEnd <= new Date()) return null;
        const claim = await tx.proSubscription.updateMany({
          where: { id: subscription.id, status: 'ACTIVE', periodStart: subscription.periodStart, periodEnd: { gt: new Date() }, reportsUsed: { lt: PRO_REPORTS_PER_CYCLE } },
          data: { reportsUsed: { increment: 1 } },
        });
        if (claim.count !== 1) return null;
        await tx.proReportUsage.create({ data: { subscriptionId: subscription.id, generatedReportId: id, periodStart: subscription.periodStart, periodEnd: subscription.periodEnd } });
        const unlocked = await tx.generatedReport.updateMany({ where: { id, status: 'PREVIEW' }, data: { status: 'UNLOCKED', userId, unlockedAt: new Date(), expiresAt: null } });
        if (unlocked.count !== 1) throw new Error('Report già sbloccato.');
        await tx.analyticsEvent.upsert({ where: { id: 'report-unlocked:' + id }, update: {}, create: { id: 'report-unlocked:' + id, type: 'report_unlocked', userId, path: '/account', meta: JSON.stringify({ reportId: id, source: 'pro' }) } });
        try { return JSON.parse(report.reportJson); } catch { return null; }
      }, { isolationLevel: 'Serializable' });
    } catch (error) {
      if ((error as { code?: string }).code === 'P2034' && attempt < 2) continue;
      if ((error as { code?: string }).code === 'P2002') return await getUnlockedReport(id, userId);
      throw error;
    }
  }
  return null;
}
