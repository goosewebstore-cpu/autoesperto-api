import { Router } from 'express';
import { prisma } from '@autoesperto/database';
import { z } from 'zod';
import { asyncHandler, badRequest, forbidden, notFound } from '../http';
import { type AuthenticatedRequest, requireAuth } from '../services/auth';
import { isOwnerEmail } from '../services/owner';

const router = Router();
const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(160);
const commentSchema = z.object({
  body: z.string().trim().min(10, 'Scrivi almeno 10 caratteri.').max(1500, 'Il commento è troppo lungo.'),
});
const moderationSchema = z.object({ status: z.enum(['APPROVED', 'REJECTED']) });

function publicComment(comment: { id: string; body: string; createdAt: Date; guideSlug: string; user: { name: string | null } }) {
  return {
    id: comment.id,
    guideSlug: comment.guideSlug,
    body: comment.body,
    createdAt: comment.createdAt.toISOString(),
    author: comment.user.name?.trim().split(/\s+/)[0]?.slice(0, 40) || 'Utente AutoEsperto',
  };
}

async function requireModerator(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, role: true } });
  if (!user || (user.role !== 'ADMIN' && !isOwnerEmail(user.email))) throw forbidden('Moderazione riservata alla redazione.');
}

router.get('/pending', requireAuth, asyncHandler(async (req, res) => {
  await requireModerator((req as AuthenticatedRequest).auth.userId);
  const comments = await prisma.guideComment.findMany({
    where: { status: 'PENDING' },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: 'asc' },
    take: 100,
  });
  res.set('Cache-Control', 'no-store');
  res.json({ success: true, comments: comments.map(publicComment) });
}));

router.post('/:id/moderate', requireAuth, asyncHandler(async (req, res) => {
  await requireModerator((req as AuthenticatedRequest).auth.userId);
  const { status } = moderationSchema.parse(req.body);
  const id = z.string().min(10).max(50).parse(req.params.id);
  const existing = await prisma.guideComment.findUnique({ where: { id }, select: { id: true } });
  if (!existing) throw notFound('Commento non trovato.');
  await prisma.guideComment.update({ where: { id }, data: { status } });
  res.json({ success: true });
}));

router.get('/guide/:slug', asyncHandler(async (req, res) => {
  const guideSlug = slugSchema.parse(req.params.slug);
  const comments = await prisma.guideComment.findMany({
    where: { guideSlug, status: 'APPROVED' },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  res.set('Cache-Control', 'no-store');
  res.json({ success: true, comments: comments.map(publicComment) });
}));

router.post('/guide/:slug', requireAuth, asyncHandler(async (req, res) => {
  const guideSlug = slugSchema.parse(req.params.slug);
  const { body } = commentSchema.parse(req.body);
  if (/https?:\/\/|www\.|@/i.test(body)) throw badRequest('Non inserire link o indirizzi email nel commento.');
  const { userId } = (req as AuthenticatedRequest).auth;
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentCount = await prisma.guideComment.count({ where: { userId, createdAt: { gte: since } } });
  if (recentCount >= 3) throw badRequest('Hai raggiunto il limite di 3 commenti al giorno.');
  await prisma.guideComment.create({ data: { guideSlug, userId, body, status: 'PENDING' } });
  res.status(201).json({ success: true, message: 'Commento inviato. Sarà visibile dopo la revisione.' });
}));

export default router;
