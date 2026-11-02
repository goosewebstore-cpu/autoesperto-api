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

const ANALYSIS_PRICE_CENTS = 199;

export function getAnalysisPrice(): { amountCents: number; currency: string; promotional: false } {
  return { amountCents: ANALYSIS_PRICE_CENTS, currency: 'eur', promotional: false };
}

export async function recordPaidCheckout(session: Stripe.Checkout.Session): Promise<void> {
  if (session.payment_status !== 'paid') return;
  const userId = session.metadata?.userId;
  const purchaseId = session.metadata?.purchaseId;
  if (!userId || !purchaseId) throw forbidden('Pagamento non associato a un account AutoEsperto.');

  const purchase = await prisma.purchase.findUnique({ where: { id: purchaseId } });
  if (!purchase || purchase.userId !== userId) throw forbidden('Pagamento non associato a questo account.');

  if (session.amount_total !== purchase.amountCents || session.currency?.toLowerCase() !== purchase.currency.toLowerCase()) {
    throw forbidden('Importo o valuta del pagamento non corrispondenti.');
  }
  if (purchase.stripeSessionId && purchase.stripeSessionId !== session.id) throw forbidden('Sessione di pagamento non corrispondente.');
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
  await prisma.analyticsEvent.upsert({
    where: { id: 'payment:' + session.id }, update: {},
    create: { id: 'payment:' + session.id, type: 'purchase_completed', userId, path: '/account', meta: JSON.stringify({ transactionId: session.id, amountCents: purchase.amountCents, currency: purchase.currency, source: 'stripe' }) },
  });
}

// Premium subscription config
const PREMIUM_PRICE_CENTS_MONTHLY = 399; // 3,99 € / mese
const PREMIUM_PRICE_CENTS_ANNUAL = 2999;  // 29,99 € / anno
const PREMIUM_CURRENCY = 'eur';

export function getPremiumConfig(interval: 'month' | 'year' = 'month') {
  return {
    amountCents: interval === 'year' ? PREMIUM_PRICE_CENTS_ANNUAL : PREMIUM_PRICE_CENTS_MONTHLY,
    currency: PREMIUM_CURRENCY,
    interval: interval,
  };
}

export async function activatePremium(userId: string, stripeSubscriptionId: string, stripeCustomerId: string, stripePriceId: string, renewsAt: Date, interval: 'month' | 'year' = 'month'): Promise<void> {
  const plan = interval === 'year' ? 'PREMIUM_YEARLY' : 'PREMIUM_MONTHLY';
  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      plan,
      status: 'ACTIVE',
      credits: 0,
      stripeCustomerId,
      stripeSubscriptionId,
      stripePriceId,
      renewsAt,
    },
    update: {
      plan,
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

export function premiumCheckoutParams(input: { userId: string; customerId: string; webUrl: string; returnTo: string; trialEligible: boolean }): Stripe.Checkout.SessionCreateParams {
  const metadata = { userId: input.userId, product: 'premium_subscription', interval: 'month', plan: 'PREMIUM_MONTHLY', offer: 'ai_7days_v2' };
  const trialDays = input.trialEligible ? 7 : 0;
  return {
    mode: 'subscription', locale: 'it', customer: input.customerId, client_reference_id: input.userId,
    payment_method_types: ['card'], payment_method_collection: 'always',
    line_items: [{ quantity: 1, price_data: { currency: 'eur', unit_amount: 399, recurring: { interval: 'month' }, product_data: { name: 'AutoEsperto AI', description: 'Foto AI e analisi annunci illimitate. Valutazione per modello sempre gratuita.' } } }],
    metadata,
    subscription_data: { metadata, ...(trialDays ? { trial_period_days: 7, trial_settings: { end_behavior: { missing_payment_method: 'cancel' } } } : {}) },
    custom_text: { submit: { message: trialDays ? 'Oggi 0 €. Dopo 7 giorni, 3,99 €/mese con rinnovo automatico. Disdici dal tuo account prima della fine della prova per evitare il primo addebito.' : '3,99 €/mese con rinnovo automatico. La prova di 7 giorni è riservata alla prima attivazione. Disdici dal tuo account.' } },
    success_url: input.webUrl + input.returnTo + (input.returnTo.includes('?') ? '&' : '?') + 'subscription=success&session_id={CHECKOUT_SESSION_ID}',
    cancel_url: input.webUrl + input.returnTo + (input.returnTo.includes('?') ? '&' : '?') + 'subscription=cancelled',
  };
}

export async function syncStripeSubscription(sub: Stripe.Subscription, expectedUserId?: string): Promise<void> {
  const userId = sub.metadata.userId;
  if (!userId || (expectedUserId && userId !== expectedUserId)) throw forbidden('Abbonamento non associato a questo account.');
  const current = await prisma.subscription.findUnique({ where: { userId } });
  // A delayed event for an old subscription must not overwrite a newer one.
  if (current?.stripeSubscriptionId && current.stripeSubscriptionId !== sub.id && !['canceled', 'incomplete_expired'].includes(sub.status)) {
    const existing = await getStripe().subscriptions.retrieve(current.stripeSubscriptionId);
    if (['active', 'trialing'].includes(existing.status)) throw forbidden('Esiste già un abbonamento attivo.');
  } else if (current?.stripeSubscriptionId && current.stripeSubscriptionId !== sub.id) return;
  const item = sub.items.data[0];
  const periodEnd = sub.status === 'trialing' ? sub.trial_end : item?.current_period_end;
  const endsAt = periodEnd ? new Date(periodEnd * 1000) : null;
  const status = sub.status === 'trialing' ? 'TRIALING' : sub.status === 'active' ? 'ACTIVE' : sub.status === 'past_due' ? 'PAST_DUE' : 'CANCELLED';
  const data = { plan: sub.metadata.plan === 'PREMIUM_YEARLY' ? 'PREMIUM_YEARLY' : 'PREMIUM_MONTHLY', status, credits: 0, stripeCustomerId: typeof sub.customer === 'string' ? sub.customer : sub.customer.id, stripeSubscriptionId: sub.id, stripePriceId: item?.price.id || null, renewsAt: endsAt, cancelledAt: sub.cancel_at_period_end || sub.status === 'canceled' ? new Date((sub.canceled_at || Math.floor(Date.now()/1000)) * 1000) : null };
  await prisma.subscription.upsert({ where: { userId }, create: { userId, ...data }, update: data });
  if (['active', 'trialing'].includes(sub.status)) await prisma.analyticsEvent.upsert({
    where: { id: 'subscription:' + sub.id + ':' + sub.status }, update: {},
    create: { id: 'subscription:' + sub.id + ':' + sub.status, type: sub.status === 'trialing' ? 'trial_started' : 'premium_subscribed', userId, path: '/account', meta: JSON.stringify({ source:'stripe', subscriptionId:sub.id, status:sub.status }) },
  });
}
