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

export function getAnalysisPrice(): { amountCents: number; currency: string } {
  const configured = Number(process.env.ANALYSIS_PRICE_CENTS || '599');
  const amountCents = Number.isInteger(configured) && configured >= 100 ? configured : 599;
  return { amountCents, currency: 'eur' };
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
