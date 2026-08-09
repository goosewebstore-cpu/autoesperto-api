import { prisma } from '@autoesperto/database';

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
}

/**
 * L'analisi completa richiede un account con email verificata e, per la
 * prima analisi gratuita, un solo salvataggio. Chi ha pagato o è Premium ha
 * accesso illimitato. Chi non è autenticato o non ha più slot gratuiti deve
 * accedere / fare upgrade prima di vedere il report completo.
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
    };
  }

  const [user, analysisCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        emailVerified: true,
        purchases: { where: { status: 'PAID' }, select: { id: true }, take: 1 },
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
    };
  }

  const paid = user.purchases.length > 0;
  const premium = user.subscription?.plan === 'PREMIUM' && user.subscription?.status === 'ACTIVE';
  const emailVerified = !!user.emailVerified;
  const unlimited = paid || premium;
  const freeAvailable = emailVerified && !unlimited && analysisCount === 0;
  const entitled = unlimited || freeAvailable;

  return {
    entitled,
    unlimited,
    freeAvailable,
    paid,
    premium,
    emailVerified,
    analysisCount,
    needsLogin: false,
    needsUpgrade: !entitled,
  };
}
