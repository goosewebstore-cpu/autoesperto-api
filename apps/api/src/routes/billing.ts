import { createHash } from 'node:crypto';
import { Router } from 'express';
import { prisma } from '@autoesperto/database';
import { z } from 'zod';
import { asyncHandler, forbidden, conflict, serviceUnavailable } from '../http';
import { type AuthenticatedRequest, requireAuth } from '../services/auth';
import { getAnalysisPrice, getStripe, recordPaidCheckout, getPremiumConfig, premiumCheckoutParams, syncStripeSubscription, syncProStripeSubscription } from '../services/billing';
import { getReportForCheckout } from '../services/reportPreview';
import { PRO_BONUS_REPORTS, PRO_REPORTS_INCLUDED, PRO_REPORTS_PER_CYCLE, REPORT_PACK_TOTAL_CREDITS } from '../services/proPlans';

const router = Router();
const confirmSchema = z.object({ sessionId: z.string().trim().startsWith('cs_').max(255) });
const checkoutSchema = z.object({
  returnTo: z.string().max(300).optional().default('/account'),
});

const reportCheckoutSchema = z.object({
  product: z.enum(['single_report', 'report_pack_3']),
  reportId: z.string().uuid().optional(),
  returnTo: z.string().max(300).optional().default('/account'),
}).superRefine((value, ctx) => {
  if (value.product === 'single_report' && !value.reportId) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Seleziona il report da sbloccare.' });
  if (value.product === 'report_pack_3' && value.reportId) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Il pacchetto si acquista senza selezionare un singolo report.' });
});

router.post('/report-checkout', requireAuth, asyncHandler(async (req, res) => {
  const input = reportCheckoutSchema.parse(req.body || {});
  const { userId } = (req as AuthenticatedRequest).auth;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, phone: true } });
  if (!user) throw forbidden('Account non trovato.');
  if (input.product === 'single_report') {
    const token = req.header('x-report-access') || '';
    const report = await getReportForCheckout(input.reportId!, userId, token);
    if (!report) throw forbidden('Anteprima scaduta o non associata a questo acquisto. Rifai l’analisi per continuare.');
  }

  const amountCents = input.product === 'single_report' ? 199 : 499;
  const creditsGranted = input.product === 'report_pack_3' ? REPORT_PACK_TOTAL_CREDITS : 0;
  const currency = 'eur';
  const stripe = getStripe();
  const returnTo = input.returnTo.startsWith('/') && !input.returnTo.startsWith('//') && !input.returnTo.includes('\\') ? input.returnTo : '/account';
  const webUrl = (process.env.WEB_URL || process.env.WEB_URLS?.split(',')[0] || 'http://localhost:3000').replace(/\/$/, '');
  let purchase = input.product === 'single_report'
    ? await prisma.purchase.findUnique({ where: { generatedReportId: input.reportId! } })
    : await prisma.purchase.findFirst({ where: { userId, productType: 'REPORT_PACK_3', status: 'PENDING' }, orderBy: { createdAt: 'desc' } });
  if (purchase?.status === 'PENDING' && purchase.stripeSessionId) {
    const pendingSession = await stripe.checkout.sessions.retrieve(purchase.stripeSessionId);
    if (pendingSession.status === 'open' && pendingSession.url && (input.product !== 'report_pack_3' || purchase.creditsGranted === REPORT_PACK_TOTAL_CREDITS)) { res.json({ success: true, url: pendingSession.url, sessionId: pendingSession.id, product: input.product }); return; }
    if (pendingSession.status === 'complete' && pendingSession.payment_status === 'paid') {
      await recordPaidCheckout(pendingSession);
      throw conflict('Pagamento già ricevuto. Apri l’account per vedere il report o i crediti.');
    }
    if (pendingSession.status === 'complete') throw conflict('Il pagamento è in elaborazione. Attendi la conferma di Stripe prima di riprovare.');
    if (pendingSession.status === 'open' && input.product === 'report_pack_3' && purchase.creditsGranted !== REPORT_PACK_TOTAL_CREDITS) await stripe.checkout.sessions.expire(pendingSession.id);
    await prisma.purchase.update({ where: { id: purchase.id }, data: { status: 'FAILED', stripeSessionId: null } });
    purchase = { ...purchase, status: 'FAILED', stripeSessionId: null };
  } else if (purchase?.status === 'PENDING' && !purchase.stripeSessionId) {
    throw conflict('Checkout già in preparazione. Attendi qualche secondo e riprova.');
  }
  if (purchase && purchase.status !== 'FAILED') purchase = null;
  const isNewPurchase = !purchase;
  if (!purchase) purchase = await prisma.purchase.create({ data: { userId, amountCents, currency, productType: input.product.toUpperCase(), generatedReportId: input.reportId, creditsGranted, status: 'PENDING' } });
  else purchase = await prisma.purchase.update({ where: { id: purchase.id }, data: { status: 'PENDING', amountCents, currency, creditsGranted, stripeSessionId: null, stripePaymentIntentId: null } });
  const checkoutAttempt = await prisma.purchase.update({ where: { id: purchase.id }, data: { checkoutAttempt: { increment: 1 } } });
  try {
    const productData = { product: input.product, productType: input.product.toUpperCase(), userId, purchaseId: purchase.id, ...(input.reportId ? { reportId: input.reportId } : {}) };
    const productName = input.product === 'single_report' ? 'Report completo AutoEsperto' : 'Pacchetto AutoEsperto · 3 report + 1 omaggio';
    const productDescription = input.product === 'single_report'
      ? 'Report completo salvato nel tuo account. Pagamento singolo, senza rinnovo.'
      : 'Quattro report completi: tre acquistati e uno in omaggio. Pagamento singolo, senza rinnovo.';
    const session = await stripe.checkout.sessions.create({
      mode: 'payment', locale: 'it', client_reference_id: userId,
      ...(user.email ? { customer_email: user.email } : {}),
      line_items: [{ quantity: 1, price_data: { currency, unit_amount: amountCents, product_data: { name: productName, description: productDescription } } }],
      metadata: productData,
      payment_intent_data: { metadata: productData },
      phone_number_collection: { enabled: !user.phone },
      billing_address_collection: 'auto', automatic_tax: { enabled: process.env.STRIPE_AUTOMATIC_TAX === 'true' },
      success_url: `${webUrl}${returnTo}${returnTo.includes('?') ? '&' : '?'}report_checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${webUrl}${returnTo}${returnTo.includes('?') ? '&' : '?'}report_checkout=cancelled`,
    }, { idempotencyKey: `report-purchase:${purchase.id}:${checkoutAttempt.checkoutAttempt}` });
    if (!session.url) throw new Error('Stripe non ha restituito il link di pagamento.');
    await prisma.purchase.update({ where: { id: purchase.id }, data: { stripeSessionId: session.id } });
    await prisma.analyticsEvent.upsert({ where: { id: 'checkout:' + session.id }, update: {}, create: { id: 'checkout:' + session.id, type: 'checkout', path: returnTo, userId, meta: JSON.stringify({ product: input.product, purchaseId: purchase.id, amountCents }) } });
    await prisma.analyticsEvent.upsert({ where: { id: 'checkout-started:' + session.id }, update: {}, create: { id: 'checkout-started:' + session.id, type: 'checkout_started', path: returnTo, userId, meta: JSON.stringify({ product: input.product, purchaseId: purchase.id, amountCents }) } });
    res.status(201).json({ success: true, url: session.url, sessionId: session.id, product: input.product });
  } catch (error) {
    if (isNewPurchase) await prisma.purchase.delete({ where: { id: purchase.id } }).catch(() => undefined);
    else await prisma.purchase.update({ where: { id: purchase.id }, data: { status: 'FAILED' } }).catch(() => undefined);
    throw error;
  }
}));

router.get('/credits', requireAuth, asyncHandler(async (req, res) => {
  const { userId } = (req as AuthenticatedRequest).auth;
  const remaining = await prisma.reportCredit.count({ where: { userId, status: 'AVAILABLE', purchase: { status: 'PAID' } } });
  const consumed = await prisma.reportCredit.count({ where: { userId, status: 'CONSUMED' } });
  res.set('Cache-Control', 'no-store').json({ success: true, remaining, consumed });
}));

router.get('/reports', requireAuth, asyncHandler(async (req, res) => {
  const { userId } = (req as AuthenticatedRequest).auth;
  const reports = await prisma.generatedReport.findMany({ where: { userId, status: 'UNLOCKED' }, orderBy: { unlockedAt: 'desc' }, select: { id: true, title: true, vehicleJson: true, unlockedAt: true } });
  res.set('Cache-Control', 'no-store').json({ success: true, reports: reports.map((report) => ({ id: report.id, title: report.title, vehicle: JSON.parse(report.vehicleJson), unlockedAt: report.unlockedAt })) });
}));

router.post('/pro-checkout', requireAuth, asyncHandler(async (req, res) => {
  const { userId } = (req as AuthenticatedRequest).auth;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, subscription: { select: { stripeCustomerId: true } }, proSubscription: true } });
  if (!user) throw forbidden('Account non trovato.');
  if (user.proSubscription && ['ACTIVE', 'PAST_DUE', 'INCOMPLETE'].includes(user.proSubscription.status)) throw conflict('Hai già un abbonamento PRO. Gestiscilo dal tuo account.');
  const stripe = getStripe();
  let customerId = user.proSubscription?.stripeCustomerId || user.subscription?.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({ ...(user.email ? { email: user.email } : {}), metadata: { userId } }, { idempotencyKey: `ae-customer:${userId}` });
    customerId = customer.id;
  }
  const openSessions = await stripe.checkout.sessions.list({ customer: customerId, limit: 10 });
  const reusable = openSessions.data.find((item) => item.status === 'open' && item.mode === 'subscription' && item.metadata?.product === 'autoesperto_pro' && item.metadata?.userId === userId);
  if (reusable?.url) { res.json({ success: true, url: reusable.url, sessionId: reusable.id }); return; }
  const webUrl = (process.env.WEB_URL || process.env.WEB_URLS?.split(',')[0] || 'http://localhost:3000').replace(/\/$/, '');
  const returnTo = '/account/pro';
  const metadata = { product: 'autoesperto_pro', plan: 'AUTOESPERTO_PRO', userId };
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription', locale: 'it', customer: customerId, line_items: [{ quantity: 1, price_data: { currency: 'eur', unit_amount: 2999, recurring: { interval: 'month' }, product_data: { name: 'AutoEsperto PRO', description: `${PRO_REPORTS_INCLUDED} report completi + ${PRO_BONUS_REPORTS} omaggio per ciclo mensile.` } } }], metadata,
    subscription_data: { metadata },
    automatic_tax: { enabled: process.env.STRIPE_AUTOMATIC_TAX === 'true' },
    success_url: `${webUrl}${returnTo}?pro=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${webUrl}/prezzi-preview?pro=cancelled`,
  }, { idempotencyKey: `pro-checkout:${userId}:${Math.floor(Date.now() / 300000)}` });
  if (!session.url) throw serviceUnavailable('Stripe non ha restituito il link di pagamento.');
  await prisma.analyticsEvent.upsert({ where: { id: `checkout-started:${session.id}` }, update: {}, create: { id: `checkout-started:${session.id}`, type: 'checkout_started', userId, path: '/account/pro', meta: JSON.stringify({ product: 'autoesperto_pro', amountCents: 2999, currency: 'eur' }) } });
  res.status(201).json({ success: true, url: session.url, sessionId: session.id });
}));

router.get('/pro-status', requireAuth, asyncHandler(async (req, res) => {
  const { userId } = (req as AuthenticatedRequest).auth;
  const sub = await prisma.proSubscription.findUnique({ where: { userId } });
  res.set('Cache-Control', 'no-store').json({ success: true, subscription: sub ? {
    plan: 'AUTOESPERTO_PRO', status: sub.status, reportsUsed: sub.reportsUsed, reportsIncluded: PRO_REPORTS_INCLUDED,
    bonusReports: PRO_BONUS_REPORTS, reportsTotal: PRO_REPORTS_PER_CYCLE,
    reportsRemaining: Math.max(0, PRO_REPORTS_PER_CYCLE - sub.reportsUsed), periodStart: sub.periodStart?.toISOString() || null,
    periodEnd: sub.periodEnd?.toISOString() || null, cancelledAt: sub.cancelledAt?.toISOString() || null,
  } : null });
}));

router.post('/confirm-pro-subscription', requireAuth, asyncHandler(async (req, res) => {
  const { userId } = (req as AuthenticatedRequest).auth;
  const { sessionId } = confirmSchema.parse(req.body || {});
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.mode !== 'subscription' || session.metadata?.product !== 'autoesperto_pro' || session.metadata?.userId !== userId || session.status !== 'complete' || !session.subscription) throw forbidden('Il checkout PRO non risulta completato per questo account.');
  const sub = typeof session.subscription === 'string' ? await stripe.subscriptions.retrieve(session.subscription) : session.subscription;
  await syncProStripeSubscription(sub, userId);
  res.json({ success: true, active: sub.status === 'active' });
}));

router.post('/pro-cancel', requireAuth, asyncHandler(async (req, res) => {
  const { userId } = (req as AuthenticatedRequest).auth;
  const sub = await prisma.proSubscription.findUnique({ where: { userId } });
  if (!sub?.stripeSubscriptionId || !['ACTIVE', 'PAST_DUE'].includes(sub.status)) throw forbidden('Nessun abbonamento PRO da disdire.');
  await getStripe().subscriptions.update(sub.stripeSubscriptionId, { cancel_at_period_end: true });
  await prisma.proSubscription.update({ where: { userId }, data: { cancelledAt: sub.periodEnd || new Date() } });
  await prisma.analyticsEvent.upsert({ where: { id: `subscription-pro-cancelled:${sub.stripeSubscriptionId}` }, update: {}, create: { id: `subscription-pro-cancelled:${sub.stripeSubscriptionId}`, type: 'subscription_cancelled', userId, path: '/account/pro', meta: JSON.stringify({ plan: 'AUTOESPERTO_PRO' }) } });
  res.json({ success: true });
}));

router.post(
  '/checkout',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { returnTo: requestedReturnTo } = checkoutSchema.parse(req.body || {});
    const returnTo = requestedReturnTo.startsWith('/') && !requestedReturnTo.startsWith('//') && !requestedReturnTo.includes('\\')
      ? requestedReturnTo
      : '/account';
    const { userId } = (req as AuthenticatedRequest).auth;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
      },
    });
    if (!user) throw forbidden('Account non trovato.');

    const { amountCents, currency } = getAnalysisPrice();
    const purchase = await prisma.purchase.create({
      data: { userId, amountCents, currency, status: 'PENDING' },
    });
    const webUrl = (process.env.WEB_URL || process.env.WEB_URLS?.split(',')[0] || 'http://localhost:3000').replace(/\/$/, '');

    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        locale: 'it',
        client_reference_id: userId,
        customer_creation: 'always',
        ...(user.email ? { customer_email: user.email } : {}),
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency,
              unit_amount: amountCents,
              product_data: {
                name: 'Analisi completa AutoEsperto',
                description: 'Un’analisi completa AutoEsperto, salvata nel tuo account. Pagamento singolo, senza rinnovi.',
              },
            },
          },
        ],
        metadata: { userId, purchaseId: purchase.id, product: 'single_analysis' },
        payment_intent_data: { metadata: { userId, purchaseId: purchase.id, product: 'single_analysis' } },
        phone_number_collection: { enabled: !user.phone },
        billing_address_collection: 'auto',
        automatic_tax: { enabled: process.env.STRIPE_AUTOMATIC_TAX === 'true' },
        success_url: `${webUrl}${returnTo}${returnTo.includes('?') ? '&' : '?'}checkout=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${webUrl}${returnTo}${returnTo.includes('?') ? '&' : '?'}checkout=cancelled`,
      });
      void prisma.analyticsEvent.create({
        data: { type: 'checkout', path: '/account', userId },
      }).catch(() => undefined);
      if (!session.url) throw new Error('Stripe non ha restituito il link di pagamento.');
      await prisma.purchase.update({ where: { id: purchase.id }, data: { stripeSessionId: session.id } });
      res.status(201).json({ success: true, url: session.url });
    } catch (error) {
      await prisma.purchase.delete({ where: { id: purchase.id } }).catch(() => undefined);
      throw error;
    }
  }),
);

router.post(
  '/confirm',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { userId } = (req as AuthenticatedRequest).auth;
    const { sessionId } = confirmSchema.parse(req.body);
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    if (session.metadata?.userId !== userId) throw forbidden('Pagamento non associato a questo account.');
    await recordPaidCheckout(session);
    res.json({ success: true, paid: session.payment_status === 'paid', amountCents: session.amount_total || 0, currency: session.currency || 'eur' });
  }),
);

router.post('/subscribe', requireAuth, asyncHandler(async (req, res) => {
  const { userId } = (req as AuthenticatedRequest).auth;
  const input = z.object({ interval: z.literal('month').optional(), returnTo: z.string().max(300).optional().default('/account') }).parse(req.body || {});
  const returnTo = input.returnTo.startsWith('/') && !input.returnTo.startsWith('//') && !input.returnTo.includes('\\') ? input.returnTo.split('#')[0] : '/account';
  const user = await prisma.user.findUnique({ where: { id:userId }, select: { id:true, email:true, subscription:true } });
  if (!user) throw forbidden('Account non trovato.');
  const stripe = getStripe();
  let customerId = user.subscription?.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({ ...(user.email ? {email:user.email} : {}), metadata:{userId} }, { idempotencyKey: 'ae-customer:' + userId });
    customerId = customer.id;
    await prisma.subscription.upsert({ where:{userId}, create:{userId,plan:'FREE',status:'INACTIVE',stripeCustomerId:customerId}, update:{stripeCustomerId:customerId} });
  }
  const history = await stripe.subscriptions.list({ customer:customerId, status:'all', limit:100 });
  if (history.data.some(sub => ['active','trialing','past_due','unpaid','incomplete','paused'].includes(sub.status))) throw conflict('Hai già un abbonamento. Gestiscilo dal tuo account.');
  const open = await stripe.checkout.sessions.list({customer:customerId,limit:10});
  const reusable = open.data.find(session => session.status === 'open' && session.mode === 'subscription' && session.metadata?.offer === 'ai_monthly_v3' && session.metadata?.returnTo === returnTo);
  if (reusable?.url) { res.json({success:true,url:reusable.url,sessionId:reusable.id,trialDays:0}); return; }
  const webUrl = (process.env.WEB_URL || 'https://autoesperto.it').replace(/\/$/,'');
  const params = premiumCheckoutParams({userId,customerId,webUrl,returnTo});
  params.metadata = {...params.metadata,returnTo};
  const session = await stripe.checkout.sessions.create(params, { idempotencyKey: 'ai-v3:' + userId + ':' + Math.floor(Date.now()/1800000) + ':' + createHash('sha256').update(returnTo).digest('hex').slice(0,16) });
  if (!session.url) throw new Error('Stripe non ha restituito il link di pagamento.');
  await prisma.analyticsEvent.upsert({ where:{id:'checkout:'+session.id},update:{},create:{id:'checkout:'+session.id,type:'checkout',userId,path:returnTo,meta:JSON.stringify({product:'premium_subscription',trialDays:0})} });
  res.status(201).json({success:true,url:session.url,sessionId:session.id,trialDays:0});
}));
router.post('/confirm-subscription', requireAuth, asyncHandler(async (req,res) => {
  const {userId} = (req as AuthenticatedRequest).auth;
  const {sessionId} = confirmSchema.parse(req.body);
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.mode !== 'subscription' || session.metadata?.product !== 'premium_subscription' || session.metadata?.userId !== userId || session.status !== 'complete' || !session.subscription) throw forbidden('Attivazione non completata per questo account.');
  const sub = typeof session.subscription === 'string' ? await stripe.subscriptions.retrieve(session.subscription) : session.subscription;
  await syncStripeSubscription(sub,userId);
  res.json({success:true,active:['trialing','active'].includes(sub.status),trial:sub.status==='trialing'});
}));

// POST /billing/cancel-subscription
router.post(
  '/cancel-subscription',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { userId } = (req as AuthenticatedRequest).auth;
    const sub = await prisma.subscription.findUnique({ where: { userId } });
    if (!sub || !sub.stripeSubscriptionId) throw forbidden('Nessun abbonamento attivo.');

    const stripe = getStripe();
    await stripe.subscriptions.update(sub.stripeSubscriptionId, { cancel_at_period_end: true });
    await prisma.subscription.update({ where: { id: sub.id }, data: { cancelledAt: new Date() } });

    res.json({ success: true });
  }),
);

// GET /billing/subscription-status
router.get(
  '/subscription-status',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { userId } = (req as AuthenticatedRequest).auth;
    const sub = await prisma.subscription.findUnique({ where: { userId } });

    res.json({
      success: true,
      subscription: sub ? {
        plan: sub.plan,
        status: sub.status,
        renewsAt: sub.renewsAt?.toISOString() || null,
        cancelledAt: sub.cancelledAt?.toISOString() || null,
      } : null,
    });
  }),
);

export default router;
