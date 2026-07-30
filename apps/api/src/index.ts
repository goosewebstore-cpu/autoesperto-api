import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import vehicleRoutes from './routes/vehicles';
import reportRoutes from './routes/reports';
import subscriptionRoutes from './routes/subscriptions';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'autoesperto-api' });
});

app.use('/vehicles', vehicleRoutes);
app.use('/reports', reportRoutes);
app.use('/subscriptions', subscriptionRoutes);

app.listen(PORT, () => {
  console.log(`AutoEsperto API running on http://localhost:${PORT}`);
});
