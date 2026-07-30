import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import { authMiddleware } from './lib/auth';
import vehicleRoutes from './routes/vehicles';
import reportRoutes from './routes/reports';
import subscriptionRoutes from './routes/subscriptions';
import authRoutes from './routes/auth';
import oauthRoutes from './routes/oauth';
import userRoutes from './routes/user';
import dealerRoutes from './routes/dealer';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

app.use('/subscriptions/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(authMiddleware);

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'autoesperto-api' });
});

app.get('/', (_req, res) => {
  res.json({ service: 'autoesperto-api', version: '0.1.0', web: process.env.WEB_URL || 'http://localhost:3000' });
});





app.use('/auth', authRoutes);
app.use('/auth', oauthRoutes);
app.use('/vehicles', vehicleRoutes);
app.use('/reports', reportRoutes);
app.use('/subscriptions', subscriptionRoutes);
app.use('/user', userRoutes);
app.use('/dealer', dealerRoutes);

app.listen(PORT, () => {
  console.log(`AutoEsperto API running on http://localhost:${PORT}`);
});