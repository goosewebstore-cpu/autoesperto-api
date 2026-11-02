import { Router } from 'express';
import { prisma } from '@autoesperto/database';
import { z } from 'zod';
import { asyncHandler, forbidden, unauthorized } from '../http';
import { type AuthenticatedRequest, requireAuth } from '../services/auth';
import { isOwnerEmail } from '../services/owner';

const router = Router();

// Eventi funnel: i vecchi eventi (visit/scan/analysis/checkout/login/register)
// restano validi per retrocompatibilità; i nuovi eventi coprono l'intero funnel
// di conversione: analisi → risultato → offerta report → pagamento.
const trackSchema = z.object({
  type: z.enum(["visit","scan","analysis","checkout","login","register","page_view","page_leave","analysis_failed","photo_recognition_started","photo_recognition_completed","photo_recognition_failed","search_car","photo_upload","car_selected","car_image_uploaded","analysis_started","analysis_completed","result_viewed","premium_viewed","premium_cta_clicked","premium_checkout_started","premium_subscribed","report_offer_viewed","report_purchase_started","purchase_completed","pdf_requested","share_clicked","sell_ad_generated","ad_impression","compare_started","guide_read","account_created","tool_click","sell_cta","advisor_message_sent","natural_language_search_executed","homepage_view","valuation_viewed","passport_created","passport_shared","passport_transferred","document_uploaded","document_verified","vehicle_saved","comparison_started","auto_finder_started","auto_finder_completed","finder_started","finder_completed","preference_changed","car_saved","buy_score_viewed","negotiator_message_copied","listing_analyzed","health_scan_completed","health_score_applied"]),
  eventId: z.string().uuid().optional(),
  path: z.string().max(300).optional(),
  meta: z.string().max(2000).optional(),
  visitorId: z.string().max(120).optional(),
  duration: z.number().int().min(0).max(86400).optional(),
});

router.post(
  '/track',
  asyncHandler(async (req, res) => {
    const input = trackSchema.parse(req.body);
    let userId: string | undefined;
    if (req.header('authorization')) {
      try {
        const payload = await new Promise<{ userId: string }>((resolve, reject) => {
          const authHeader = req.header('authorization') || '';
          const match = authHeader.match(/^Bearer\s+(.+)$/i);
          if (!match) { reject(new Error('no token')); return; }
          try {
            const { verifyAuthToken } = require('../services/auth');
            const parsed = verifyAuthToken(match[1]);
            resolve({ userId: parsed.sub });
          } catch (error) {
            reject(error);
          }
        });
        userId = payload.userId;
      } catch {
        userId = undefined;
      }
    }

    try {
    await prisma.analyticsEvent.create({
      data: {
        ...(input.eventId ? { id: input.eventId } : {}),
        type: input.type,
        path: input.path || null,
        meta: input.meta || null,
        visitorId: input.visitorId || null,
        userId: userId || null,
        duration: input.duration || null,
      },
    });
    } catch (error) {
      if (!input.eventId || (error as { code?: string }).code !== 'P2002') throw error;
    }
    res.set('Cache-Control', 'no-store');
    res.json({ success: true });
  })
);

router.get(
  '/overview',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { userId } = (req as AuthenticatedRequest).auth;
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
    if (!isOwnerEmail(user?.email)) throw forbidden('Accesso riservato al proprietario.');

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(startOfDay.getTime() - 6 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(startOfDay.getTime() - 29 * 24 * 60 * 60 * 1000);

    const [totalVisits, totalScans, totalAnalyses, totalCheckouts, totalRegisters, uniqueVisitors7d, last7d, last30d] = await Promise.all([
      prisma.analyticsEvent.count({ where: { type: 'visit' } }),
      prisma.analyticsEvent.count({ where: { type: 'scan' } }),
      prisma.analyticsEvent.count({ where: { type: 'analysis' } }),
      prisma.analyticsEvent.count({ where: { type: 'checkout' } }),
      prisma.analyticsEvent.count({ where: { type: 'register' } }),
      prisma.analyticsEvent.findMany({
        where: { type: 'visit', createdAt: { gte: sevenDaysAgo } },
        select: { visitorId: true },
        distinct: ['visitorId'],
      }),
      prisma.analyticsEvent.groupBy({
        by: ['type'],
        where: { createdAt: { gte: sevenDaysAgo } },
        _count: { _all: true },
      }),
      prisma.analyticsEvent.groupBy({
        by: ['type'],
        where: { createdAt: { gte: thirtyDaysAgo } },
        _count: { _all: true },
      }),
    ]);

    const visitsByDay7d = await prisma.analyticsEvent.findMany({
      where: { type: 'visit', createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true },
    });

    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(sevenDaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      return { key, label: d.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }), count: 0 };
    });
    for (const v of visitsByDay7d) {
      const d = v.createdAt;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const bucket = days.find((x) => x.key === key);
      if (bucket) bucket.count++;
    }

    const byType7d = (type: string) => last7d.find((x: { type: string; _count: { _all: number } }) => x.type === type)?._count._all || 0;
    const byType30d = (type: string) => last30d.find((x: { type: string; _count: { _all: number } }) => x.type === type)?._count._all || 0;

    const pct = (n: number, d: number) => (d > 0 ? Math.round((n / d) * 1000) / 10 : 0);
    const funnel7d = [
      { step: 'Visite', count: byType7d('visit') },
      { step: 'Analisi avviate', count: byType7d('analysis_started') },
      { step: 'Analisi completate', count: byType7d('analysis_completed') },
      { step: 'Risultato visto', count: byType7d('result_viewed') },
      { step: 'Offerta report vista', count: byType7d('report_offer_viewed') },
      { step: 'Checkout avviato', count: byType7d('checkout') },
      { step: 'Pagamenti completati', count: byType7d('purchase_completed') },
    ];
    const funnelWithPct = funnel7d.map((f, i) => ({
      ...f,
      conversion: i === 0 ? 100 : pct(f.count, funnel7d[i - 1].count),
      overall: pct(f.count, funnel7d[0].count),
    }));

    const failures = await prisma.analyticsEvent.findMany({
      where: { type: 'analysis_failed', createdAt: { gte: sevenDaysAgo } },
      select: { meta: true },
    });
    const reasons = new Map<string, number>();
    for (const failure of failures) {
      try {
        const meta = JSON.parse(failure.meta || '{}');
        const reason = String(meta.reason || 'unknown');
        reasons.set(reason, (reasons.get(reason) || 0) + 1);
      } catch { reasons.set('unknown', (reasons.get('unknown') || 0) + 1); }
    }
    res.set('Cache-Control', 'no-store');
    res.json({
      success: true,
      overview: {
        measurement: { version: 2, since: '2026-11-02', visits: 'Sessioni browser con consenso analytics; scadenza dopo 30 minuti di inattività.', note: 'I dati precedenti alla versione 2 includono visite duplicate. Gli step sono conteggi di eventi, non una coorte di persone; non tutti gli utenti devono acquistare dopo la prima prova gratuita.' },
        failures7d: [...reasons].map(([reason, count]) => ({ reason, count })).sort((a, b) => b.count - a.count),
        totals: {
          visits: totalVisits,
          scans: totalScans,
          analyses: totalAnalyses,
          checkouts: totalCheckouts,
          registers: totalRegisters,
          uniqueVisitors7d: uniqueVisitors7d.filter((u: { visitorId: string | null }) => u.visitorId).length,
          pageViews: await prisma.analyticsEvent.count({ where: { type: 'page_view' } }),
          purchases: await prisma.analyticsEvent.count({ where: { type: 'purchase_completed' } }),
          premiumSubscribers: await prisma.analyticsEvent.count({ where: { type: 'premium_subscribed' } }),
        },
        last7d: {
          visits: byType7d('visit'),
          scans: byType7d('scan'),
          analyses: byType7d('analysis'),
          checkouts: byType7d('checkout'),
          registers: byType7d('register'),
          pageViews: byType7d('page_view'),
          analysesStarted: byType7d('analysis_started'),
          analysesCompleted: byType7d('analysis_completed'),
          analysesFailed: byType7d('analysis_failed'),
          resultsViewed: byType7d('result_viewed'),
          reportOffersViewed: byType7d('report_offer_viewed'),
          reportPurchasesStarted: byType7d('report_purchase_started'),
          premiumCheckoutsStarted: byType7d('premium_checkout_started'),
          purchases: byType7d('purchase_completed'),
        },
        last30d: {
          visits: byType30d('visit'),
          scans: byType30d('scan'),
          analyses: byType30d('analysis'),
          checkouts: byType30d('checkout'),
          registers: byType30d('register'),
          pageViews: byType30d('page_view'),
          analysesStarted: byType30d('analysis_started'),
          analysesCompleted: byType30d('analysis_completed'),
          analysesFailed: byType30d('analysis_failed'),
          resultsViewed: byType30d('result_viewed'),
          reportOffersViewed: byType30d('report_offer_viewed'),
          reportPurchasesStarted: byType30d('report_purchase_started'),
          premiumCheckoutsStarted: byType30d('premium_checkout_started'),
          purchases: byType30d('purchase_completed'),
        },
        funnel7d: funnelWithPct,
        visitsByDay: days,
      },
    });
  })
);

export default router;
