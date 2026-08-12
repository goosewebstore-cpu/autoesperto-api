import Stripe from 'stripe';
import { prisma } from '@autoesperto/database';
import { forbidden, serviceUnavailable } from '../http';

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) throw serviceUnavailable('Pagamenti non ancora configurati.');
  if (!stripeClient) stripeClient = new Stripe(key);
  return stripeClient;
}

const STANDARD_ANALYSIS_PRICE_CENTS = 599;
const DEFAULT_PROMO_PRICE_CENTS = 199;
const DEFAULT_PROMO_END_AT = '2026-08-13T21:59:59.999Z'; // 23:59:59 in Italia (CEST)

export function getAnalysisPrice(now = new Date()): { amountCents: number; currency: string; promotional: boolean } {
  const standardConfigured = Number(process.env.ANALYSIS_PRICE_CENTS || STANDARD_ANALYSIS_PRICE_CENTS);
  const standardAmountCents = Number.isInteger(standardConfigured) && standardConfigured >= 100
    ? standardConfigured
    : STANDARD_ANALYSIS_PRICE_CENTS;
  const promoEndAt = new Date(process.env.ANALYSIS_PROMO_END_AT || DEFAULT_PROMO_END_AT);
  const promoConfigured = Number(process.env.ANALYSIS_PROMO_PRICE_CENTS || DEFAULT_PROMO_PRICE_CENTS);
  const promoAmountCents = Number.isInteger(promoConfigured) && promoConfigured >= 100
    ? promoConfigured
    : DEFAULT_PROMO_PRICE_CENTS;
  const promotional = !Number.isNaN(promoEndAt.getTime()) && now <= promoEndAt;

  return { amountCents: promotional ? promoAmountCents : standardAmountCents, currency: 'eur', promotional };
}

export async function recordPaidCheckout(session: Stripe.Checkout.Session): Promise<void> {
  if (session.payment_status !== 'paid') return;
  const userId = session.metadata?.userId;
  const purchaseId = session.metadata?.purchaseId;
  if (!userId || !purchaseId) throw forbidden('Pagamento non associato a un account AutoEsperto.');

  const purchase = await prisma.purchase.findUnique({ where: { id: purchaseId } });
  if (!purchase || purchase.userId !== userId) throw forbidden('Pagamento non associato a questo account.');

  const paymentIntent = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id;
  await prisma.purchase.update({
    where: { id: purchaseId },
    data: {
      status: 'PAID',
      stripeSessionId: session.id,
      stripePaymentIntentId: paymentIntent || undefined,
      paidAt: purchase.paidAt || new Date(),
    },
  });
}

// Premium subscription config
const PREMIUM_PRICE_CENTS_MONTHLY = 499; // 4,99 € / mese
const PREMIUM_PRICE_CENTS_ANNUAL = 4190;  // 41,90 € / anno (~30% sconto)
const PREMIUM_CURRENCY = 'eur';

export function getPremiumConfig(interval: 'month' | 'year' = 'month') {
  return {
    amountCents: interval === 'year' ? PREMIUM_PRICE_CENTS_ANNUAL : PREMIUM_PRICE_CENTS_MONTHLY,
    currency: PREMIUM_CURRENCY,
    interval: interval,
  };
}

export async function activatePremium(userId: string, stripeSubscriptionId: string, stripeCustomerId: string, stripePriceId: string, renewsAt: Date): Promise<void> {
  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      plan: 'PREMIUM',
      status: 'ACTIVE',
      credits: 0,
      stripeCustomerId,
      stripeSubscriptionId,
      stripePriceId,
      renewsAt,
    },
    update: {
      plan: 'PREMIUM',
      status: 'ACTIVE',
      stripeCustomerId,
      stripeSubscriptionId,
      stripePriceId,
      renewsAt,
      cancelledAt: null,
    },
  });
}

export async function deactivatePremium(stripeSubscriptionId: string): Promise<void> {
  const sub = await prisma.subscription.findFirst({ where: { stripeSubscriptionId } });
  if (sub) {
    await prisma.subscription.update({
      where: { id: sub.id },
      data: { plan: 'FREE', status: 'CANCELLED', cancelledAt: new Date() },
    });
  }
}
