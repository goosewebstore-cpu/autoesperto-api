import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '@autoesperto/database';
import { requireAuth, type AuthRequest } from '../lib/auth';

const router = Router();

const listingSchema = z.object({
  title: z.string().min(3),
  price: z.number().min(0),
  km: z.number().min(0),
  year: z.number().min(1990),
  fuel: z.string(),
  imageUrl: z.string().optional(),
  description: z.string().optional(),
  sourceUrl: z.string().optional(),
});

router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const dealer = await prisma.dealerProfile.findUnique({
      where: { userId: req.userId! },
      include: { listings: { orderBy: { createdAt: 'desc' } } },
    });
    if (!dealer) return res.status(404).json({ success: false, error: 'Profilo concessionario non trovato' });
    res.json({ success: true, listings: dealer.listings });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const data = listingSchema.parse(req.body);
    const dealer = await prisma.dealerProfile.findUnique({ where: { userId: req.userId! } });
    if (!dealer) return res.status(404).json({ success: false, error: 'Profilo concessionario non trovato' });
    const listing = await prisma.dealerListing.create({
      data: {
        dealerId: dealer.id,
        title: data.title,
        price: data.price,
        km: data.km,
        year: data.year,
        fuel: data.fuel,
        imageUrl: data.imageUrl,
        description: data.description,
        sourceUrl: data.sourceUrl,
      },
    });
    res.json({ success: true, listing });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.put('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const data = listingSchema.partial().parse(req.body);
    const dealer = await prisma.dealerProfile.findUnique({ where: { userId: req.userId! } });
    if (!dealer) return res.status(404).json({ success: false, error: 'Profilo concessionario non trovato' });
    const listing = await prisma.dealerListing.update({
      where: { id, dealerId: dealer.id },
      data,
    });
    res.json({ success: true, listing });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const dealer = await prisma.dealerProfile.findUnique({ where: { userId: req.userId! } });
    if (!dealer) return res.status(404).json({ success: false, error: 'Profilo concessionario non trovato' });
    await prisma.dealerListing.delete({ where: { id, dealerId: dealer.id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.post('/setup', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { companyName, vatNumber, phone, address, city, website } = req.body;
    if (!companyName) return res.status(400).json({ success: false, error: 'Nome azienda richiesto' });
    const dealer = await prisma.dealerProfile.upsert({
      where: { userId: req.userId! },
      update: { companyName, vatNumber, phone, address, city, website },
      create: { userId: req.userId!, companyName, vatNumber, phone, address, city, website },
    });
    await prisma.user.update({ where: { id: req.userId! }, data: { role: 'DEALER' } });
    res.json({ success: true, dealer });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;