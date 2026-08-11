import { Router } from 'express';
import { prisma } from '@autoesperto/database';
import { z } from 'zod';
import { asyncHandler, forbidden, unauthorized } from '../http';
import { type AuthenticatedRequest, requireAuth } from '../services/auth';
import { isOwnerEmail } from '../services/owner';

const router = Router();

const trackSchema = z.object({
  type: z.enum(['visit', 'scan', 'analysis', 'checkout', 'login', 'register']),
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

    await prisma.analyticsEvent.create({
      data: {
        type: input.type,
        path: input.path || null,
        meta: input.meta || null,
        visitorId: input.visitorId || null,
        userId: userId || null,
        duration: input.duration || null,
      },
    });
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

    res.set('Cache-Control', 'no-store');
    res.json({
      success: true,
      overview: {
        totals: {
          visits: totalVisits,
          scans: totalScans,
          analyses: totalAnalyses,
          checkouts: totalCheckouts,
          registers: totalRegisters,
          uniqueVisitors7d: uniqueVisitors7d.filter((u: { visitorId: string | null }) => u.visitorId).length,
        },
        last7d: {
          visits: byType7d('visit'),
          scans: byType7d('scan'),
          analyses: byType7d('analysis'),
          checkouts: byType7d('checkout'),
          registers: byType7d('register'),
        },
        last30d: {
          visits: byType30d('visit'),
          scans: byType30d('scan'),
          analyses: byType30d('analysis'),
          checkouts: byType30d('checkout'),
          registers: byType30d('register'),
        },
        visitsByDay: days,
      },
    });
  })
);

export default router;
