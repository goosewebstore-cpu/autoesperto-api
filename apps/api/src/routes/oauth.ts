import { Router } from 'express';
import { prisma } from '@autoesperto/database';
import { signToken } from '../lib/auth';

const router = Router();
const WEB_URL = process.env.WEB_URL || 'http://localhost:3000';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  const API_URL = process.env.API_URL || 'http://localhost:4000';

  import('passport').then(passport => {
    import('passport-google-oauth20').then(({ Strategy }) => {
      passport.default.use(new Strategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${API_URL}/auth/google/callback`,
      }, async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value || `${profile.id}@google.com`;
          const name = profile.displayName;
          const image = profile.photos?.[0]?.value;
          const providerId = profile.id;

          let account = await prisma.account.findUnique({
            where: { provider_providerId: { provider: 'google', providerId } },
            include: { user: true },
          });

          if (account) {
            await prisma.account.update({ where: { id: account.id }, data: { accessToken, name, image, email } });
            return done(null, account.user);
          }

          let user = await prisma.user.findUnique({ where: { email } });
          if (user) {
            await prisma.account.create({ data: { userId: user.id, provider: 'google', providerId, email, name, image, accessToken } });
          } else {
            user = await prisma.user.create({
              data: { email, name, image, passwordHash: null, subscription: { create: { plan: 'FREE', credits: 1 } } },
            });
            await prisma.account.create({ data: { userId: user.id, provider: 'google', providerId, email, name, image, accessToken } });
          }
          done(null, user);
        } catch (err) { done(err); }
      }));
    });
  });
}

router.get('/google', (_req, res) => {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return res.status(400).json({ error: 'Google OAuth non configurato. Imposta GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET nel .env' });
  }
  const redirectUri = encodeURIComponent(`${process.env.API_URL || 'http://localhost:4000'}/auth/google/callback`);
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=profile%20email&access_type=offline`;
  res.redirect(url);
});

router.get('/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code || typeof code !== 'string') {
      return res.redirect(`${WEB_URL}/?auth=error`);
    }

    const API_URL = process.env.API_URL || 'http://localhost:4000';
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: `${API_URL}/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenRes.json() as any;
    if (!tokens.access_token) throw new Error('No access token');

    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const profile = await profileRes.json() as any;

    const email = profile.email;
    const name = profile.name;
    const image = profile.picture;
    const providerId = profile.id;

    // Find or create user
    let account = await prisma.account.findUnique({
      where: { provider_providerId: { provider: 'google', providerId } },
      include: { user: { include: { subscription: true } } },
    });

    if (account) {
      await prisma.account.update({ where: { id: account.id }, data: { accessToken: tokens.access_token, name, image, email } });
      const token = signToken(account.user.id, account.user.role);
      const userData = JSON.stringify({
        id: account.user.id, email: account.user.email, name: account.user.name, image: account.user.image,
        role: account.user.role, plan: account.user.subscription?.plan || 'FREE',
      });
      return res.redirect(`${WEB_URL}/auth/callback?token=${token}&user=${encodeURIComponent(userData)}`);
    }

    let user = await prisma.user.findUnique({ where: { email }, include: { subscription: true } });

    if (user) {
      await prisma.account.create({ data: { userId: user.id, provider: 'google', providerId, email, name, image, accessToken: tokens.access_token } });
    } else {
      user = await prisma.user.create({
        data: { email, name, image, passwordHash: null, subscription: { create: { plan: 'FREE', credits: 1 } } },
        include: { subscription: true },
      });
      await prisma.account.create({ data: { userId: user.id, provider: 'google', providerId, email, name, image, accessToken: tokens.access_token } });
    }

    if (!user) throw new Error('User creation failed');
    const token = signToken(user.id, user.role);
    const userData = JSON.stringify({
      id: user.id, email: user.email, name: user.name, image: user.image,
      role: user.role, plan: user.subscription?.plan || 'FREE',
    });
    res.redirect(`${WEB_URL}/auth/callback?token=${token}&user=${encodeURIComponent(userData)}`);
  } catch (err: any) {
    console.error('Google OAuth error:', err.message);
    res.redirect(`${WEB_URL}/?auth=error`);
  }
});

export default router;
