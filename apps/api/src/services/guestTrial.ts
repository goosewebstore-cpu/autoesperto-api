import { randomBytes } from 'node:crypto';
import type { Request, Response } from 'express';
import { prisma } from '@autoesperto/database';

const COOKIE_NAME = 'ae_guest_trial';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function guestTrialId(req: Request): string | null {
  const raw = req.headers.cookie || '';
  const value = raw.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE_NAME}=`))?.slice(COOKIE_NAME.length + 1);
  return value && /^[a-f0-9]{64}$/.test(value) ? value : null;
}

export async function ensureGuestTrial(req: Request, res: Response) {
  const currentId = guestTrialId(req);
  if (currentId) {
    const existing = await prisma.guestTrial.findUnique({ where: { id: currentId } });
    if (existing) return existing;
  }

  const id = randomBytes(32).toString('hex');
  const trial = await prisma.guestTrial.create({ data: { id } });
  res.append('Set-Cookie', `${COOKIE_NAME}=${id}; Max-Age=${COOKIE_MAX_AGE}; Path=/; HttpOnly; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);
  return trial;
}

export async function claimGuestTrial(req: Request, userId: string): Promise<boolean> {
  const id = guestTrialId(req);
  if (!id) return false;
  const trial = await prisma.guestTrial.findUnique({ where: { id }, select: { usedAt: true } });
  if (!trial?.usedAt) return false;
  await prisma.user.updateMany({
    where: { id: userId, guestTrialUsedAt: null },
    data: { guestTrialUsedAt: trial.usedAt },
  });
  return true;
}
