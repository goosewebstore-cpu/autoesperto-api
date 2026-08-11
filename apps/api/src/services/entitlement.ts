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

/**
 * Regole di accesso al report completo:
 * - Premium / acquisti → accesso illimitato
 * - primo account registrato (analysisCount === 0) → 1 analisi completa gratuita
 *   (nessuna verifica email richiesta per usarla)
 * - anonimo → la prima analisi completa è gratuita (tracciata dal client),
 *   poi solo analisi base finché non si abbonano
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
      owner: false,
    };
  }

  const owner = isOwnerEmail(user.email);
  const paid = user.purchases.length > 0;
  const premium = user.subscription?.plan === 'PREMIUM' && user.subscription?.status === 'ACTIVE';
  const emailVerified = !!user.emailVerified;
  const unlimited = owner || paid || premium;
  const freeAvailable = !unlimited && analysisCount === 0;
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
    owner,
  };
}
