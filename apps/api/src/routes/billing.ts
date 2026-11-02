import { createHash } from 'node:crypto';
import { Router } from 'express';
import { prisma } from '@autoesperto/database';
import { z } from 'zod';
import { asyncHandler, forbidden, conflict } from '../http';
import { type AuthenticatedRequest, requireAuth } from '../services/auth';
import { getAnalysisPrice, getStripe, recordPaidCheckout, getPremiumConfig, premiumCheckoutParams, syncStripeSubscription } from '../services/billing';

const router = Router();
const confirmSchema = z.object({ sessionId: z.string().trim().startsWith('cs_').max(255) });
const checkoutSchema = z.object({
  returnTo: z.string().max(300).optional().default('/account'),
});

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
  const trialEligible = !user.subscription?.stripeSubscriptionId && history.data.length === 0;
  const open = await stripe.checkout.sessions.list({customer:customerId,limit:10});
  const reusable = open.data.find(session => session.status === 'open' && session.mode === 'subscription' && session.metadata?.offer === 'ai_7days_v2' && session.metadata?.returnTo === returnTo);
  if (reusable?.url) { res.json({success:true,url:reusable.url,sessionId:reusable.id,trialDays:trialEligible?7:0}); return; }
  const webUrl = (process.env.WEB_URL || 'https://autoesperto.it').replace(/\/$/,'');
  const params = premiumCheckoutParams({userId,customerId,webUrl,returnTo,trialEligible});
  params.metadata = {...params.metadata,returnTo};
  const configurations = await stripe.paymentMethodConfigurations.list({limit:100});
  const wallets = configurations.data.find(item => item.active && item.apple_pay?.display_preference.value === 'on' && item.google_pay?.display_preference.value === 'on');
  if (wallets) {params.payment_method_configuration=wallets.id;delete params.payment_method_types;}
  const session = await stripe.checkout.sessions.create(params, { idempotencyKey: 'ai-v2:' + userId + ':' + (trialEligible?'trial':'paid') + ':' + Math.floor(Date.now()/1800000) + ':' + createHash('sha256').update(returnTo).digest('hex').slice(0,16) });
  if (!session.url) throw new Error('Stripe non ha restituito il link di pagamento.');
  await prisma.analyticsEvent.upsert({ where:{id:'checkout:'+session.id},update:{},create:{id:'checkout:'+session.id,type:'checkout',userId,path:returnTo,meta:JSON.stringify({product:'premium_subscription',trialDays:trialEligible?7:0})} });
  res.status(201).json({success:true,url:session.url,sessionId:session.id,trialDays:trialEligible?7:0});
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
