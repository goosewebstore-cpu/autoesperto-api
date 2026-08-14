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
 * - Premium / owner → accesso illimitato
 * - primo account registrato (analysisCount === 0) → 1 analisi completa gratuita
 *   (nessuna verifica email richiesta per usarla)
 * - un acquisto singolo (report €3,99) → sblocca UNA analisi completa:
 *   ogni pagamento PAID copre una analisi (analysisCount <= paidPurchases)
 * - anonimo → la prima analisi completa è gratuita (tracciata dal client),
 *   poi solo analisi base finché non acquistano un report o si abbonano
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

  const owner = isOwnerEmail(user.email);
  const paidPurchases = user.purchases.length;
  const paid = paidPurchases > 0;
  const premium = user.subscription?.plan === 'PREMIUM' && user.subscription?.status === 'ACTIVE';
  const emailVerified = !!user.emailVerified;
  const unlimited = owner || premium;
  const freeAvailable = !unlimited && analysisCount === 0;
  // Un report acquistato copre una analisi: con 0 analisi il primo slot è gratuito,
  // poi ogni analisi completa consuma un report pagato.
  const entitled = unlimited || freeAvailable || (paidPurchases > 0 && analysisCount <= paidPurchases);

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
