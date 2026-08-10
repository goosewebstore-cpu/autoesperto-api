import { Router } from 'express';
import { randomBytes } from 'node:crypto';
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
import { sendVerificationEmail } from '../services/email';

const router = Router();

const VERIFY_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

function newVerifyToken(): string {
  return randomBytes(32).toString('hex');
}

function getSignupIp(req: { ip: string | undefined; headers: Record<string, string | string[] | undefined> }): string | undefined {
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string') return xff.split(',')[0].trim();
  if (Array.isArray(xff) && xff.length) return xff[0].trim();
  return req.ip;
}

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
        emailVerified: true,
        subscription: true,
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
  const emailVerified = !!user.emailVerified;
  const trialAvailable = !paid && analysisCount === 0;
  return {
    ...user,
    subscription: user.subscription ? {
      plan: user.subscription.plan,
      status: user.subscription.status,
      renewsAt: user.subscription.renewsAt?.toISOString() || null,
      cancelledAt: user.subscription.cancelledAt?.toISOString() || null,
    } : null,
    purchases: undefined,
    analyses: undefined,
    analysis: user.analyses[0] || null,
    entitlement: {
      included: 1,
      used: analysisCount,
      remaining: Math.max(0, (paid ? 999 : 1) - analysisCount),
      paid,
      emailVerified,
      freeUsed: !trialAvailable && !paid,
      trialAvailable,
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
    const verifyToken = newVerifyToken();
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: identity.email,
        phone: identity.phone,
        passwordHash,
        termsAcceptedAt: new Date(),
        termsVersion: '2026-08-02',
        emailVerifyToken: verifyToken,
        signupIp: getSignupIp(req) || null,
      },
    });
    if (identity.email) {
      void sendVerificationEmail(identity.email, verifyToken).catch(() => undefined);
    }
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

const verifyEmailSchema = z.object({
  token: z.string().min(16).max(128),
});

router.post(
  '/verify-email',
  asyncHandler(async (req, res) => {
    const { token } = verifyEmailSchema.parse(req.body);
    const user = await prisma.user.findFirst({
      where: { emailVerifyToken: token },
      select: { id: true, email: true, emailVerified: true, createdAt: true },
    });
    if (!user) throw badRequest('Token non valido o scaduto.');
    if (user.emailVerified) throw badRequest('Email già verificata.');
    if (Date.now() - user.createdAt.getTime() > VERIFY_TOKEN_TTL_MS) {
      throw badRequest('Token scaduto. Richiedi un nuovo link di verifica.');
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date(), emailVerifyToken: null },
    });
    const authToken = signAuthToken(user.id);
    res.json({ success: true, token: authToken, user: await accountSummary(user.id) });
  })
);

router.post(
  '/resend-verification',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { userId } = (req as AuthenticatedRequest).auth;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, emailVerified: true, emailVerifyToken: true, createdAt: true },
    });
    if (!user) throw unauthorized('Account non trovato');
    if (user.emailVerified) throw badRequest('Email già verificata.');
    if (!user.email) throw badRequest('Nessuna email associata a questo account.');
    const token = user.emailVerifyToken || newVerifyToken();
    if (!user.emailVerifyToken) {
      await prisma.user.update({ where: { id: userId }, data: { emailVerifyToken: token } });
    }
    void sendVerificationEmail(user.email, token).catch(() => undefined);
    res.json({ success: true });
  })
);

export { accountSummary };
export default router;
