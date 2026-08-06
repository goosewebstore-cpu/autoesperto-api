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
