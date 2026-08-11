import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';

import reportRoutes from './routes/reports';
import authRoutes from './routes/auth';
import googleRoutes from './routes/google';
import billingRoutes from './routes/billing';
import analysisRoutes from './routes/analyses';
import analyticsRoutes from './routes/analytics';
import { HttpError } from './http';
import { stripeWebhook } from './webhook';

export interface AppOptions {
  webUrls?: string[];
}

export function createApp(options: AppOptions = {}) {
  const webUrls = options.webUrls ?? defaultWebUrls();

  const app = express();
  app.set('trust proxy', 1);

  app.use(helmet({ contentSecurityPolicy: false }));
  const isAllowedOrigin = (origin: string) => {
    if (!origin || webUrls.includes(origin)) return true;
    // I deploy di anteprima di Vercel usano sottodomini *.vercel.app
    // (es. autoesperto-xxxxx-goosewebstore-3988s-projects.vercel.app).
    // Li autorizziamo solo quando il sottodominio appartiene a questo progetto,
    // così anteprime e preview non rompono il riconoscimento foto.
    if (origin.endsWith('-goosewebstore-3988s-projects.vercel.app')) return true;
    return false;
  };

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || isAllowedOrigin(origin)) return callback(null, true);
        return callback(new HttpError(403, 'Origine non consentita'));
      },
      methods: ['GET', 'POST'],
    })
  );

  app.post('/billing/webhook', express.raw({ type: 'application/json' }), stripeWebhook);
  app.use(express.json({ limit: '8mb' }));

  const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: 'Troppe richieste. Riprova tra un minuto.' },
  });
  app.use('/reports', apiLimiter);
  app.use('/analyses', apiLimiter);

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: 'Troppi tentativi. Riprova tra qualche minuto.' },
  });
  app.use('/auth', authLimiter);

  const startedAt = Date.now();
  app.get('/health', (_req, res) => {
    res.set('Cache-Control', 'no-store');
    res.json({
      ok: true,
      service: 'autoesperto-api',
      uptime: Math.round((Date.now() - startedAt) / 1000),
    });
  });

  app.get('/', (_req, res) => {
    res.json({
      service: 'autoesperto-api',
      version: '1.0.0',
      web: webUrls[0] || 'http://localhost:3000',
    });
  });

  app.use('/reports', reportRoutes);
  app.use('/auth', authRoutes);
  app.use('/auth', googleRoutes);
  app.use('/billing', billingRoutes);
  app.use('/analyses', analysisRoutes);
  app.use('/analytics', analyticsRoutes);

  app.use((_req, res) => {
    res.status(404).json({ success: false, error: 'Risorsa non trovata' });
  });

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof HttpError) {
      return res.status(err.status).json({ success: false, error: err.message });
    }
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: err.issues[0]?.message || 'Dati non validi' });
    }
    console.error('Server error:', err instanceof Error ? err.message : err);
    res.status(500).json({ success: false, error: 'Errore interno del server' });
  });

  return app;
}

export const app = createApp();

export function defaultWebUrls(): string[] {
  const configured = (process.env.WEB_URLS || process.env.WEB_URL || '')
    .split(',')
    .map((u) => u.trim())
    .filter(Boolean);

  // Mantieni il nuovo dominio autorizzato anche durante una transizione in cui
  // WEB_URLS su Render contiene ancora solo il vecchio host Vercel.
  const productionUrls = ['https://autoesperto.it', 'https://www.autoesperto.it'];
  return Array.from(new Set([...configured, ...productionUrls, ...(configured.length ? [] : ['http://localhost:3000'])]));
}
