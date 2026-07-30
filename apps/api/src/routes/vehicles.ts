import { Router } from 'express';
import { lookupPlate } from '../services/regcheck';
import { normalizeVehicleData } from '../services/vehicleKB';

const router = Router();

router.get('/lookup/:plate', async (req, res) => {
  try {
    const { plate } = req.params;
    const raw = await lookupPlate(plate);
    const vehicle = normalizeVehicleData(raw);
    res.json({ success: true, vehicle });
  } catch (err: any) {
    console.error('Lookup error:', err.message);
    res.status(400).json({ success: false, error: err.message });
  }
});

router.post('/vin', async (req, res) => {
  // VIN lookup is not available in the free tier; mock response.
  res.status(501).json({ success: false, error: 'VIN lookup disponibile in versione Pro.' });
});

export default router;
