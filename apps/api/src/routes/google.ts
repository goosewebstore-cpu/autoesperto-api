import { Router } from 'express';
import { randomBytes } from 'node:crypto';
import { prisma } from '@autoesperto/database';
import { asyncHandler, unauthorized } from '../http';
import { signAuthToken } from '../services/auth';
import { defaultWebUrls } from '../app';

const router = Router();

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

const STATE_COOKIE = 'ae_oauth_state';
const STATE_TTL_MS = 10 * 60 * 1000;

function clientCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    throw unauthorized('Login Google non configurato sul server.');
  }
  return { clientId, clientSecret };
}

function redirectUri() {
  const envUri = process.env.GOOGLE_REDIRECT_URI?.trim();
  if (envUri && !envUri.includes('vercel.app')) {
    return envUri;
  }
  return 'https://autoesperto-api.onrender.com/auth/google/callback';
}

function frontendUrl() {
  return defaultWebUrls()[0] || 'http://localhost:3000';
}

interface GoogleUser {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
}

function setStateCookie(res: { setHeader(name: string, value: string): void }, state: string): void {
  res.setHeader(
    'Set-Cookie',
    `${STATE_COOKIE}=${state}; Path=/auth/google; HttpOnly; SameSite=Lax; Max-Age=${Math.floor(STATE_TTL_MS / 1000)}`
  );
}

function readStateCookie(req: { headers: Record<string, string | string[] | undefined> }): string | null {
  const raw = req.headers.cookie;
  if (!raw) return null;
  const list = Array.isArray(raw) ? raw.join(';') : raw;
  const match = list.split(';').map((c) => c.trim()).find((c) => c.startsWith(`${STATE_COOKIE}=`));
  if (!match) return null;
  const value = match.slice(STATE_COOKIE.length + 1);
  return value.length >= 16 && value.length <= 64 ? value : null;
}

function clearStateCookie(res: { setHeader(name: string, value: string): void }): void {
  res.setHeader('Set-Cookie', `${STATE_COOKIE}=; Path=/auth/google; HttpOnly; SameSite=Lax; Max-Age=0`);
}

router.get('/google', (_req, res) => {
  const { clientId } = clientCredentials();
  const state = randomBytes(16).toString('hex');
  setStateCookie(res, state);
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri(),
    response_type: 'code',
    scope: 'openid email profile',
    state,
    prompt: 'select_account',
    access_type: 'online',
  });
  res.redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`);
});

router.get(
  '/google/callback',
  asyncHandler(async (req, res) => {
    const code = typeof req.query.code === 'string' ? req.query.code : '';
    const state = typeof req.query.state === 'string' ? req.query.state : '';
    const expectedState = readStateCookie(req);

    if (!code || !state || !expectedState || state !== expectedState) {
      clearStateCookie(res);
      return res.redirect(`${frontendUrl()}/accesso?google=0&err=1`);
    }

    const { clientId, clientSecret } = clientCredentials();

    let tokenResponse: Response;
    try {
      tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri(),
          grant_type: 'authorization_code',
        }).toString(),
      });
    } catch {
      clearStateCookie(res);
      return res.redirect(`${frontendUrl()}/accesso?google=0&err=2`);
    }

    if (!tokenResponse.ok) {
      clearStateCookie(res);
      return res.redirect(`${frontendUrl()}/accesso?google=0&err=2`);
    }

    const tokens = (await tokenResponse.json()) as { access_token?: string; id_token?: string };
    if (!tokens.access_token) {
      clearStateCookie(res);
      return res.redirect(`${frontendUrl()}/accesso?google=0&err=2`);
    }

    let userinfoResponse: Response;
    try {
      userinfoResponse = await fetch(GOOGLE_USERINFO_URL, {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
    } catch {
      clearStateCookie(res);
      return res.redirect(`${frontendUrl()}/accesso?google=0&err=3`);
    }

    if (!userinfoResponse.ok) {
      clearStateCookie(res);
      return res.redirect(`${frontendUrl()}/accesso?google=0&err=3`);
    }

    const profile = (await userinfoResponse.json()) as GoogleUser;
    if (!profile.sub) {
      clearStateCookie(res);
      return res.redirect(`${frontendUrl()}/accesso?google=0&err=3`);
    }

    const email = profile.email?.toLowerCase();
    if (!email) {
      clearStateCookie(res);
      return res.redirect(`${frontendUrl()}/accesso?google=0&err=4`);
    }

    const existingAccount = await prisma.account.findUnique({
      where: { provider_providerId: { provider: 'google', providerId: profile.sub } },
      select: { userId: true },
    });

    let userId = existingAccount?.userId ?? null;

    if (!userId) {
      const existingUser = await prisma.user.findUnique({ where: { email }, select: { id: true } });
      if (existingUser) {
        userId = existingUser.id;
        await prisma.account.create({
          data: {
            userId,
            provider: 'google',
            providerId: profile.sub,
            email,
            name: profile.name ?? null,
            image: profile.picture ?? null,
          },
        });
      } else {
        const user = await prisma.user.create({
          data: {
            email,
            emailVerified: new Date(),
            name: profile.name ?? null,
            image: profile.picture ?? null,
            accounts: {
              create: {
                provider: 'google',
                providerId: profile.sub,
                email,
                name: profile.name ?? null,
                image: profile.picture ?? null,
              },
            },
          },
        });
        userId = user.id;
        void prisma.analyticsEvent.create({
          data: { type: 'register', path: '/accesso', userId },
        }).catch(() => undefined);
      }
    } else {
      await prisma.account.update({
        where: { provider_providerId: { provider: 'google', providerId: profile.sub } },
        data: { email, name: profile.name ?? null, image: profile.picture ?? null },
      });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { email, emailVerified: new Date() },
    });

    clearStateCookie(res);
    const token = signAuthToken(userId);
    res.redirect(`${frontendUrl()}/accesso?google=1&token=${encodeURIComponent(token)}`);
  })
);

export default router;
