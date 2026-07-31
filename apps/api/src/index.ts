import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

import reportRoutes from './routes/reports';
import { HttpError } from './http';

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
app.use(express.json({ limit: '20kb' }));

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Troppe richieste. Riprova tra un minuto.' },
});
app.use('/reports', apiLimiter);

app.get('/health', (_req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({ ok: true, service: 'autoesperto-api' });
});

app.get('/', (_req, res) => {
  res.json({ service: 'autoesperto-api', version: '1.0.0', web: WEB_URLS[0] || 'http://localhost:3000' });
});

app.use('/reports', reportRoutes);

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
