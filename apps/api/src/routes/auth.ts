import { Router } from 'express';
import { prisma } from '@autoesperto/database';
import { z } from 'zod';
import { asyncHandler, badRequest, conflict, unauthorized } from '../http';
import {
  type AuthenticatedRequest,
  hashPassword,
  normalizeIdentifier,
  requireAuth,
  signAuthToken,
  verifyPassword,
} from '../services/auth';

const router = Router();

const credentialsSchema = z.object({
  identifier: z.string().trim().min(5).max(160),
  password: z.string().min(8, 'La password deve contenere almeno 8 caratteri').max(72),
});

const registerSchema = credentialsSchema.extend({
  name: z.string().trim().min(2, 'Inserisci il tuo nome').max(80),
  termsAccepted: z.literal(true, { errorMap: () => ({ message: 'Accetta i Termini e la Privacy Policy' }) }),
});

async function accountSummary(userId: string) {
  const [user, analysisCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        analyses: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { id: true, createdAt: true },
        },
        purchases: {
          where: { status: 'PAID' },
          orderBy: { paidAt: 'desc' },
          take: 1,
          select: { id: true, paidAt: true, amountCents: true, currency: true },
        },
      },
    }),
    prisma.analysis.count({ where: { userId } }),
  ]);
  if (!user) throw unauthorized('Account non trovato');
  const paid = user.purchases.length > 0;
  return {
    ...user,
    purchases: undefined,
    analyses: undefined,
    analysis: user.analyses[0] || null,
    entitlement: {
      included: 1,
      used: analysisCount,
      remaining: Math.max(0, (paid ? 999 : 1) - analysisCount),
      paid,
      freeUsed: analysisCount > 0,
      purchase: user.purchases[0] || null,
    },
  };
}

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const input = registerSchema.parse(req.body);
    let identity;
    try {
      identity = normalizeIdentifier(input.identifier);
    } catch (error) {
      throw badRequest(error instanceof Error ? error.message : 'Email o telefono non valido');
    }

    const existing = await prisma.user.findFirst({
      where: identity.email ? { email: identity.email } : { phone: identity.phone },
      select: { id: true },
    });
    if (existing) throw conflict('Esiste già un account con questa email o questo numero.');

    const passwordHash = await hashPassword(input.password);
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: identity.email,
        phone: identity.phone,
        passwordHash,
        termsAcceptedAt: new Date(),
        termsVersion: '2026-08-02',
      },
    });
    const token = signAuthToken(user.id);
    void prisma.analyticsEvent.create({
      data: { type: 'register', path: '/accesso', userId: user.id },
    }).catch(() => undefined);
    res.status(201).json({ success: true, token, user: await accountSummary(user.id) });
  })
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const input = credentialsSchema.parse(req.body);
    let identity;
    try {
      identity = normalizeIdentifier(input.identifier);
    } catch {
      throw unauthorized('Credenziali non corrette');
    }
    const user = await prisma.user.findFirst({
      where: identity.email ? { email: identity.email } : { phone: identity.phone },
    });
    const DUMMY_HASH = 'scrypt$00000000000000000000000000000000$0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
    const storedHashForTiming = user?.passwordHash ?? DUMMY_HASH;
    const passwordOk = await verifyPassword(input.password, storedHashForTiming);
    if (!user || !passwordOk) {
      throw unauthorized('Credenziali non corrette');
    }
    const token = signAuthToken(user.id);
    res.json({ success: true, token, user: await accountSummary(user.id) });
  })
);

router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { userId } = (req as AuthenticatedRequest).auth;
    res.set('Cache-Control', 'no-store');
    res.json({ success: true, user: await accountSummary(userId) });
  })
);

export { accountSummary };
export default router;
