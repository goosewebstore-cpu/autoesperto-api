import { getMyAccount } from '@/lib/api';

let cached: { checkedAt: number; request: Promise<boolean> } | null = null;

export function hasNoAdsSubscription(): Promise<boolean> {
  if (cached && Date.now() - cached.checkedAt < 30_000) return cached.request;
  const request = getMyAccount()
    .then(({ user }) => ['ACTIVE','TRIALING'].includes(user.subscription?.status || '') && ['PREMIUM', 'PREMIUM_MONTHLY', 'PREMIUM_YEARLY'].includes(user.subscription?.plan || ''))
    .catch(() => false);
  cached = { checkedAt: Date.now(), request };
  return request;
}
