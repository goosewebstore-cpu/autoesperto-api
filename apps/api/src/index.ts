import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { execSync } from 'child_process';
import { z } from 'zod';

import reportRoutes from './routes/reports';
import authRoutes from './routes/auth';
import billingRoutes from './routes/billing';
import analysisRoutes from './routes/analyses';
import { HttpError } from './http';
import { stripeWebhook } from './webhook';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
const PORT = process.env.PORT || 4000;

const WEB_URLS = (process.env.WEB_URLS || process.env.WEB_URL || 'http://localhost:3000')
  .split(',')
  .map((u) => u.trim())
  .filter(Boolean);

if (WEB_URLS.length === 1 && WEB_URLS[0] === 'http://localhost:3000') {
  console.warn('[CORS] WEB_URLS non configurato: in produzione imposta WEB_URLS con l\'URL pubblico del sito (es. https://autoesperto.it).');
}

try {
  if (process.env.DATABASE_URL && (process.env.DATABASE_SCHEMA_SYNC ?? 'true') !== 'false') {
    console.log('Synchronizing database schema...');
    execSync('npx prisma db push --schema=packages/database/prisma/schema.prisma --skip-generate --accept-data-loss', {
      stdio: 'inherit',
      timeout: 60000,
    });
    console.log('Database schema synchronized.');
  }
} catch (error) {
  console.error('Database schema sync failed:', error instanceof Error ? error.message : error);
}

app.set('trust proxy', 1);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || WEB_URLS.includes(origin)) return callback(null, true);
      return callback(new HttpError(403, 'Origine non consentita'));
    },
    methods: ['GET', 'POST'],
  })
);
app.post('/billing/webhook', express.raw({ type: 'application/json' }), stripeWebhook);
app.use(express.json({ limit: '8mb' }));

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
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

app.get('/health', (_req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({ ok: true, service: 'autoesperto-api' });
});

app.get('/', (_req, res) => {
  res.json({ service: 'autoesperto-api', version: '1.0.0', web: WEB_URLS[0] || 'http://localhost:3000' });
});

app.use('/reports', reportRoutes);
app.use('/auth', authRoutes);
app.use('/billing', billingRoutes);
app.use('/analyses', analysisRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Risorsa non trovata' });
});

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ success: false, error: err.message });
  }
  if (err instanceof z.ZodError) {
    return res.status(400).json({ success: false, error: err.issues[0]?.message || 'Dati non validi' });
  }
  console.error('Server error:', err instanceof Error ? err.message : err);
  res.status(500).json({ success: false, error: 'Errore interno del server' });
});

app.listen(PORT, () => {
  console.log(`AutoEsperto API running on http://localhost:${PORT}`);
});
