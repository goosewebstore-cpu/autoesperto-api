import Stripe from 'stripe';
import { randomUUID } from 'node:crypto';
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
  if (['single_report', 'report_pack_3'].includes(session.metadata?.product || '')) {
    await recordPaidReportCheckout(session);
    return;
  }
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

export async function recordPaidReportCheckout(session: Stripe.Checkout.Session): Promise<void> {
  if (session.payment_status !== 'paid') return;
  if (session.mode !== 'payment' || session.status !== 'complete') throw forbidden('Checkout report non completato.');
  const userId = session.metadata?.userId;
  const purchaseId = session.metadata?.purchaseId;
  const product = session.metadata?.product;
  if (!userId || !purchaseId || !product || !['single_report', 'report_pack_3'].includes(product)) throw forbidden('Acquisto AutoEsperto non valido.');

  await prisma.$transaction(async (tx) => {
    const purchase = await tx.purchase.findUnique({ where: { id: purchaseId } });
    if (!purchase || purchase.userId !== userId || purchase.productType !== product.toUpperCase()) throw forbidden('Acquisto non associato a questo account.');
    if (session.amount_total !== purchase.amountCents || session.currency?.toLowerCase() !== purchase.currency.toLowerCase()) throw forbidden('Importo o valuta del pagamento non corrispondenti.');
    if (purchase.stripeSessionId && purchase.stripeSessionId !== session.id) throw forbidden('Sessione di pagamento non corrispondente.');
    if (purchase.status === 'REFUNDED') throw forbidden('Questo acquisto è stato rimborsato.');
    if (purchase.status === 'PAID') return;

    if (product === 'single_report') {
      if (!purchase.generatedReportId) throw forbidden('Report da sbloccare non specificato.');
      if (session.metadata?.reportId !== purchase.generatedReportId) throw forbidden('Report non corrispondente all’acquisto.');
      const unlocked = await tx.generatedReport.updateMany({
        where: { id: purchase.generatedReportId, status: 'PREVIEW', OR: [{ userId: null }, { userId }] },
        data: { status: 'UNLOCKED', userId, unlockedAt: new Date(), expiresAt: null },
      });
      if (unlocked.count !== 1) {
        const existing = await tx.generatedReport.findFirst({ where: { id: purchase.generatedReportId, status: 'UNLOCKED', userId } });
        if (!existing) throw forbidden('Il report non è più disponibile per lo sblocco.');
      }
    } else {
      if (![3, 4].includes(purchase.creditsGranted)) throw forbidden('Quantità di crediti non valida.');
      await tx.reportCredit.createMany({
        data: Array.from({ length: purchase.creditsGranted }, (_, index) => ({ id: randomUUID(), userId, purchaseId, sequence: index + 1 })),
        skipDuplicates: true,
      });
    }

    const paymentIntent = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id;
    await tx.purchase.update({ where: { id: purchaseId }, data: { status: 'PAID', stripeSessionId: session.id, stripePaymentIntentId: paymentIntent || undefined, paidAt: purchase.paidAt || new Date() } });
    await tx.analyticsEvent.upsert({
      where: { id: 'payment:' + session.id }, update: {},
      create: { id: 'payment:' + session.id, type: 'purchase_completed', userId, path: '/account', meta: JSON.stringify({ transactionId: session.id, product, amountCents: purchase.amountCents, currency: purchase.currency, source: 'stripe' }) },
    });
    await tx.analyticsEvent.upsert({ where: { id: 'payment-completed:' + session.id }, update: {}, create: { id: 'payment-completed:' + session.id, type: 'payment_completed', userId, path: '/account', meta: JSON.stringify({ transactionId: session.id, product, amountCents: purchase.amountCents, currency: purchase.currency }) } });
    if (product === 'single_report') await tx.analyticsEvent.upsert({ where: { id: 'report-unlocked:' + purchase.generatedReportId }, update: {}, create: { id: 'report-unlocked:' + purchase.generatedReportId, type: 'report_unlocked', userId, path: '/account', meta: JSON.stringify({ reportId: purchase.generatedReportId, source: 'single_purchase' }) } });
    if (product === 'report_pack_3') await tx.analyticsEvent.upsert({ where: { id: 'credits-purchased:' + session.id }, update: {}, create: { id: 'credits-purchased:' + session.id, type: 'credits_purchased', userId, path: '/account', meta: JSON.stringify({ purchaseId: purchase.id, credits: purchase.creditsGranted }) } });
  });
}

export async function markReportCheckoutFailed(sessionId: string): Promise<void> {
  await prisma.purchase.updateMany({ where: { stripeSessionId: sessionId, status: 'PENDING', productType: { in: ['SINGLE_REPORT', 'REPORT_PACK_3'] } }, data: { status: 'FAILED' } });
}

export async function recordReportRefund(paymentIntentId: string): Promise<void> {
  const purchase = await prisma.purchase.findUnique({ where: { stripePaymentIntentId: paymentIntentId } });
  if (!purchase || !['SINGLE_REPORT', 'REPORT_PACK_3'].includes(purchase.productType)) return;
  await prisma.$transaction(async (tx) => {
    await tx.purchase.updateMany({ where: { id: purchase.id, status: { not: 'REFUNDED' } }, data: { status: 'REFUNDED' } });
    await tx.reportCredit.updateMany({ where: { purchaseId: purchase.id, status: 'AVAILABLE' }, data: { status: 'REVOKED' } });
    if (purchase.productType === 'SINGLE_REPORT' && purchase.generatedReportId) {
      await tx.generatedReport.updateMany({ where: { id: purchase.generatedReportId, userId: purchase.userId, status: 'UNLOCKED' }, data: { status: 'REFUNDED' } });
    }
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

export function premiumCheckoutParams(input: { userId: string; customerId: string; webUrl: string; returnTo: string }): Stripe.Checkout.SessionCreateParams {
  const metadata = { userId: input.userId, product: 'premium_subscription', interval: 'month', plan: 'PREMIUM_MONTHLY', offer: 'ai_monthly_v3' };
  return {
    mode: 'subscription', locale: 'it', customer: input.customerId, client_reference_id: input.userId,
    payment_method_collection: 'always',
    line_items: [{ quantity: 1, price_data: { currency: 'eur', unit_amount: 399, recurring: { interval: 'month' }, product_data: { name: 'AutoEsperto AI', description: 'Foto AI e analisi annunci illimitate. Valutazione per modello sempre gratuita.' } } }],
    metadata,
    subscription_data: { metadata },
    custom_text: { submit: { message: '3,99 €/mese con rinnovo automatico. L’abbonamento parte subito; puoi disdirlo dall’account.' } },
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

export async function syncProStripeSubscription(sub: Stripe.Subscription, expectedUserId?: string): Promise<void> {
  const userId = sub.metadata.userId;
  if (sub.metadata.product !== 'autoesperto_pro' || !userId || (expectedUserId && expectedUserId !== userId)) throw forbidden('Abbonamento PRO non associato a questo account.');
  const item = sub.items.data[0];
  const start = item?.current_period_start ? new Date(item.current_period_start * 1000) : null;
  const end = item?.current_period_end ? new Date(item.current_period_end * 1000) : null;
  const existing = await prisma.proSubscription.findUnique({ where: { userId } });
  const status = sub.status === 'active' ? 'ACTIVE' : sub.status === 'past_due' ? 'PAST_DUE' : sub.status === 'incomplete' ? 'INCOMPLETE' : 'CANCELLED';
  const data = {
    status,
    stripeCustomerId: typeof sub.customer === 'string' ? sub.customer : sub.customer.id,
    stripeSubscriptionId: sub.id,
    stripePriceId: item?.price.id || null,
    periodStart: start,
    periodEnd: end,
    cancelledAt: sub.cancel_at_period_end || sub.status === 'canceled' ? new Date((sub.canceled_at || Math.floor(Date.now() / 1000)) * 1000) : null,
    reportsUsed: existing && existing.periodStart?.getTime() === start?.getTime() ? existing.reportsUsed : 0,
  };
  await prisma.proSubscription.upsert({ where: { userId }, create: { userId, ...data }, update: data });
  if (sub.status === 'active') await prisma.analyticsEvent.upsert({
    where: { id: `subscription-pro-started:${sub.id}` }, update: {},
    create: { id: `subscription-pro-started:${sub.id}`, type: 'subscription_started', userId, path: '/account/pro', meta: JSON.stringify({ source: 'stripe', subscriptionId: sub.id, plan: 'AUTOESPERTO_PRO', periodStart: start?.toISOString() }) },
  });
}
