import { Router } from 'express';
import { prisma } from '@autoesperto/database';
import { z } from 'zod';
import { asyncHandler, conflict, forbidden } from '../http';
import { type AuthenticatedRequest, requireAuth } from '../services/auth';
import { getAnalysisPrice, getStripe, recordPaidCheckout, getPremiumConfig } from '../services/billing';

const router = Router();
const confirmSchema = z.object({ sessionId: z.string().trim().startsWith('cs_').max(255) });

router.post(
  '/checkout',
  requireAuth,
  asyncHandler(async (req, res) => {
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

    const { amountCents, currency, promotional } = getAnalysisPrice();
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
                name: promotional ? 'Analisi completa AutoEsperto — prezzo promozionale' : 'Analisi completa AutoEsperto',
                description: promotional
                  ? 'Una analisi AI dettagliata, salvata nel tuo account. Promozione a tempo limitato.'
                  : 'Una analisi AI dettagliata, salvata nel tuo account.',
              },
            },
          },
        ],
        metadata: { userId, purchaseId: purchase.id, product: 'single_analysis' },
        payment_intent_data: { metadata: { userId, purchaseId: purchase.id, product: 'single_analysis' } },
        phone_number_collection: { enabled: !user.phone },
        billing_address_collection: 'auto',
        automatic_tax: { enabled: process.env.STRIPE_AUTOMATIC_TAX === 'true' },
        success_url: `${webUrl}/account?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${webUrl}/account?checkout=cancelled`,
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
  })
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
  })
});

// POST /billing/subscribe - Create Stripe subscription checkout
router.post(
  '/subscribe',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { userId } = (req as AuthenticatedRequest).auth;
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true } });
    if (!user) throw forbidden('Account non trovato.');

    const stripe = getStripe();
    const config = getPremiumConfig();
    const webUrl = (process.env.WEB_URL || process.env.WEB_URLS?.split(',')[0] || 'http://localhost:3000').replace(/\/$/, '');

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      locale: 'it',
      client_reference_id: userId,
      ...(user.email ? { customer_email: user.email } : {}),
      line_items: [{
        quantity: 1,
        price_data: {
          currency: config.currency,
          unit_amount: config.amountCents,
          recurring: { interval: config.interval },
          product_data: {
            name: 'AutoEsperto Premium',
            description: 'Analisi complete illimitate, prezzi di mercato reali, nessuna pubblicità.',
          },
        },
      }],
      metadata: { userId, product: 'premium_subscription' },
      subscription_data: { metadata: { userId, product: 'premium_subscription' } },
      success_url: `${webUrl}/account?subscription=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${webUrl}/account?subscription=cancelled`,
    });

    if (!session.url) throw new Error('Stripe non ha restituito il link di pagamento.');
    res.status(201).json({ success: true, url: session.url });
  })
);

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
  })
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
  })
);

export default router;
