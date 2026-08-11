import { type AccountUser } from '@/lib/api';

export type UserTier = 'anonymous' | 'registered' | 'premium';

export interface SubscriptionStatus {
  tier: UserTier;
  active: boolean;
  expiresAt?: string;
}

// Assumes we will add subscription details to AccountUser
export function getUserTier(user: AccountUser | null, hasFreeScan: boolean): UserTier {
  if (!user) return hasFreeScan ? 'anonymous' : 'anonymous'; // First scan is free
  // We need to extend AccountUser type to include subscription, which we'll do when modifying api.ts/types
  // For now we cast to any or assume it's there
  const u = user as any;
  if ((u.subscription?.plan === 'PREMIUM' && u.subscription?.status === 'ACTIVE') || u.entitlement?.owner) return 'premium';
  return 'registered';
}

export function canSeeFullReport(tier: UserTier, isFirstScan: boolean): boolean {
  if (isFirstScan && tier === 'anonymous') return true; // 1st scan is free and complete
  return tier === 'premium';
}
