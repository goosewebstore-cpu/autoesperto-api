import { prisma } from '@autoesperto/database';
import { isOwnerEmail } from './owner';

export interface AccountEntitlement {
  entitled: boolean;
  unlimited: boolean;
  freeAvailable: boolean;
  paid: boolean;
  premium: boolean;
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
  premium: boolean;
}): AccountEntitlement {
  const owner = isOwnerEmail(input.email);
  const unlimited = owner || input.premium;
  const freeAvailable = Boolean(input.userId) && !unlimited && input.analysisCount === 0;
  const paid = input.paidPurchases > 0;
  const paidCreditAvailable = input.paidPurchases > 0 && input.analysisCount <= input.paidPurchases;
  const entitled = unlimited || freeAvailable || paidCreditAvailable;
  return {
    entitled,
    unlimited,
    freeAvailable,
    paid,
    premium: input.premium,
    emailVerified: Boolean(input.emailVerified),
    analysisCount: input.analysisCount,
    needsLogin: !input.userId,
    needsUpgrade: Boolean(input.userId) && !entitled,
    owner,
  };
}

/**
 * Regole di accesso al report completo:
 * - Premium / owner → accesso illimitato
 * - primo account registrato (analysisCount === 0) → 1 analisi completa gratuita
 *   (nessuna verifica email richiesta per usarla)
 * - ogni acquisto singolo (€1,99) → sblocca UNA analisi completa:
 *   ogni pagamento PAID copre una analisi (analysisCount <= paidPurchases)
 * - serve un account per usare la prova gratuita e collegare i pagamenti alle analisi
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

  const [user, analysisCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        emailVerified: true,
        purchases: { where: { status: 'PAID' }, select: { id: true } },
        subscription: { select: { plan: true, status: true } },
      },
    }),
    prisma.analysis.count({ where: { userId } }),
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

  const premium = user.subscription?.plan === 'PREMIUM' && user.subscription?.status === 'ACTIVE';
  return calculateAccountEntitlement({
    userId,
    email: user.email,
    emailVerified: Boolean(user.emailVerified),
    paidPurchases: user.purchases.length,
    analysisCount,
    premium,
  });
}
