import { prisma } from '@autoesperto/database';
import { isOwnerEmail } from './owner';

export interface AccountEntitlement {
  entitled: boolean;
  unlimited: boolean;
  freeAvailable: boolean;
  paid: boolean;
  premium: boolean;
  monthlyPremium?: boolean;
  dailyAnalysisCount?: number;
  emailVerified: boolean;
  analysisCount: number;
  needsLogin: boolean;
  needsUpgrade: boolean;
  owner: boolean;
}

export function calculateAccountEntitlement(input: {
  userId: string | null;
  email?: string | null;
  emailVerified?: boolean;
  paidPurchases: number;
  analysisCount: number;
  guestTrialUsed?: boolean;
  premium: boolean;
  monthlyPremium?: boolean;
  dailyAnalysisCount?: number;
}): AccountEntitlement {
  const owner = isOwnerEmail(input.email);
  const unlimited = owner || input.premium;
  const dailyLimit = input.monthlyPremium ? 10 : null;
  const withinDailyLimit = dailyLimit === null || (input.dailyAnalysisCount || 0) < dailyLimit;
  const freeAvailable = Boolean(input.userId) && !unlimited && !input.guestTrialUsed && input.analysisCount === 0;
  const paid = input.paidPurchases > 0;
  const paidCreditAvailable = input.paidPurchases > 0 && input.analysisCount < input.paidPurchases + (input.guestTrialUsed ? 0 : 1);
  const entitled = unlimited || (input.monthlyPremium && withinDailyLimit) || freeAvailable || paidCreditAvailable;
  return {
    entitled,
    unlimited,
    freeAvailable,
    paid,
    premium: input.premium || Boolean(input.monthlyPremium),
    emailVerified: Boolean(input.emailVerified),
    analysisCount: input.analysisCount,
    needsLogin: !input.userId,
    needsUpgrade: Boolean(input.userId) && !entitled,
    owner,
  };
}

/**
 * Regole di accesso al report completo:
 * - Annuale / owner → accesso illimitato
 * - Mensile → 10 analisi al giorno, senza pubblicità
 * - una sola analisi gratuita, come ospite o con account
 * - ogni acquisto singolo (€1,99) → sblocca UNA analisi completa:
 *   ogni pagamento PAID copre una analisi aggiuntiva
 */
export async function getAccountEntitlement(userId: string | null): Promise<AccountEntitlement> {
  if (!userId) {
    return {
      entitled: false,
      unlimited: false,
      freeAvailable: false,
      paid: false,
      premium: false,
      emailVerified: false,
      analysisCount: 0,
      needsLogin: true,
      needsUpgrade: false,
      owner: false,
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [user, analysisCount, dailyAnalysisCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        emailVerified: true,
        guestTrialUsedAt: true,
        purchases: { where: { status: 'PAID' }, select: { id: true } },
        subscription: { select: { plan: true, status: true } },
      },
    }),
    prisma.analysis.count({ where: { userId } }),
    prisma.analysis.count({ where: { userId, createdAt: { gte: today } } }),
  ]);

  if (!user) {
    return {
      entitled: false,
      unlimited: false,
      freeAvailable: false,
      paid: false,
      premium: false,
      emailVerified: false,
      analysisCount: 0,
      needsLogin: true,
      needsUpgrade: false,
      owner: false,
    };
  }

  const active = user.subscription?.status === 'ACTIVE';
  const premium = active && ['PREMIUM', 'PREMIUM_YEARLY'].includes(user.subscription?.plan || '');
  const monthlyPremium = active && user.subscription?.plan === 'PREMIUM_MONTHLY';
  return calculateAccountEntitlement({
    userId,
    email: user.email,
    emailVerified: Boolean(user.emailVerified),
    paidPurchases: user.purchases.length,
    analysisCount,
    guestTrialUsed: Boolean(user.guestTrialUsedAt),
    premium,
    monthlyPremium,
    dailyAnalysisCount,
  });
}
