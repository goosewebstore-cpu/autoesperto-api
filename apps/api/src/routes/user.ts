import { Router } from 'express';
import { prisma } from '@autoesperto/database';
import { requireAuth, type AuthRequest } from '../lib/auth';

const router = Router();

router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId! },
      include: { subscription: true, dealerProfile: true },
    });
    if (!user) return res.status(404).json({ success: false, error: 'Utente non trovato' });
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        plan: user.subscription?.plan,
        credits: user.subscription?.credits,
        dealer: user.dealerProfile ? { companyName: user.dealerProfile.companyName } : null,
      },
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.get('/reports', requireAuth, async (req: AuthRequest, res) => {
  try {
    const reports = await prisma.report.findMany({
      where: { userId: req.userId! },
      include: { vehicle: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({
      success: true,
      reports: reports.map((r) => ({
        id: r.id,
        vehicleDisplay: `${r.vehicle.make} ${r.vehicle.model}`,
        plate: r.vehicle.plate,
        reliabilityScore: r.reliabilityScore,
        verdict: r.verdict,
        marketValue: r.marketValue,
        createdAt: r.createdAt.toISOString(),
      })),
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.get('/saved', requireAuth, async (req: AuthRequest, res) => {
  try {
    const saved = await prisma.savedVehicle.findMany({
      where: { userId: req.userId! },
      include: { vehicle: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({
      success: true,
      saved: saved.map((s) => ({
        id: s.id,
        vehicle: {
          make: s.vehicle.make,
          model: s.vehicle.model,
          version: s.vehicle.version,
          year: s.vehicle.year,
          plate: s.vehicle.plate,
          imageUrl: s.vehicle.imageUrl,
        },
        notes: s.notes,
        createdAt: s.createdAt.toISOString(),
      })),
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.post('/saved', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { vehicleId, notes } = req.body;
    const saved = await prisma.savedVehicle.upsert({
      where: { userId_vehicleId: { userId: req.userId!, vehicleId } },
      update: { notes },
      create: { userId: req.userId!, vehicleId, notes },
    });
    res.json({ success: true, saved: { id: saved.id } });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.delete('/saved/:vehicleId', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { vehicleId } = req.params;
    await prisma.savedVehicle.deleteMany({
      where: { userId: req.userId!, vehicleId },
    });
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;