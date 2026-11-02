import type { AccountUser } from '@/lib/api';
export type PdfEdition = 'basic' | 'premium';
export function canExportPremiumPdf(user: Pick<AccountUser, 'subscription' | 'entitlement'> | null, now = Date.now()): boolean {
  if (!user) return false;
  if (user.entitlement?.owner) return true;
  const sub = user.subscription;
  return !!sub && ['PREMIUM', 'PREMIUM_MONTHLY', 'PREMIUM_YEARLY'].includes(sub.plan)
    && ['ACTIVE', 'TRIALING'].includes(sub.status)
    && !!sub.renewsAt && Number.isFinite(Date.parse(sub.renewsAt)) && Date.parse(sub.renewsAt) > now;
}
