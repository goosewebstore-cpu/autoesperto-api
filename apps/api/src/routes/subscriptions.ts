import { Router } from 'express';
import { authMiddleware, requireAuth, type AuthRequest } from '../lib/auth';
import { prisma } from '@autoesperto/database';

let _stripe: any = null;
function getStripe() {
  if (_stripe) return _stripe;
  const secret = process.env.STRIPE_SECRET_KEY || '';
  if (secret && !secret.includes('mock') && !secret.includes('tuachiave')) {
    try {
      _stripe = require('stripe')(secret);
    } catch {
      console.warn('Stripe SDK non disponibile, uso mock mode');
    }
  }
  return _stripe;
}

const router = Router();
router.use(authMiddleware);

const planConfig: Record<string, { price: number; name: string; credits: number; period: string }> = {
  free: { price: 0, name: 'Free', credits: 1, period: 'mese' },
  plus: { price: 5.99, name: 'Plus', credits: 30, period: 'mese' },
  pro: { price: 14.99, name: 'Pro', credits: 9999, period: 'mese' },
  'dealer-base': { price: 99, name: 'Dealer Base', credits: 9999, period: 'mese' },
  'dealer-premium': { price: 199, name: 'Dealer Premium', credits: 9999, period: 'mese' },
};

const plans = [
  { id: 'free', name: 'Free', price: 0, period: '/mese', description: 'Inizia a conoscere AutoEsperto.', features: ['1 analisi gratuita', 'Dati base veicolo', 'Valutazione semplice'] },
  { id: 'plus', name: 'Plus', price: 5.99, period: '/mese', description: 'Per chi compra un\'auto usata con tranquillità.', features: ['30 analisi al mese', 'Nessuna pubblicità', 'Report completo', 'Prezzo di mercato', 'Problemi conosciuti', 'Report PDF'], popular: true },
  { id: 'pro', name: 'Pro', price: 14.99, period: '/mese', description: 'Per appassionati e rivenditori individuali.', features: ['Analisi illimitate', 'AI avanzata', 'Confronto auto', 'Centro conoscenza premium', 'Previsioni valore futuro', 'Report avanzati'] },
];

const dealerPlans = [
  { id: 'dealer-base', name: 'Base', price: 99, period: '/mese', description: 'Per concessionari piccoli.', features: ['Profilo aziendale', 'Fino a 20 veicoli', 'Statistiche base'] },
  { id: 'dealer-premium', name: 'Premium', price: 199, period: '/mese', description: 'Per concessionari in crescita.', features: ['Pubblicazione illimitata', 'Lead prioritari', 'Statistiche avanzate', 'Pubblicità veicoli'] },
  { id: 'dealer-enterprise', name: 'Enterprise', price: 0, period: 'personalizzato', description: 'Per gruppi e reti.', features: ['Soluzione su misura', 'API dedicata', 'Supporto priority'] },
];

router.get('/plans', (_req, res) => {
  res.json({ success: true, plans, dealerPlans });
});

router.post('/checkout', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { planId, successUrl, cancelUrl } = req.body;
    const config = planConfig[planId];
    if (!config) return res.status(400).json({ success: false, error: 'Piano non valido' });

    if (config.price === 0) {
      await prisma.subscription.upsert({
        where: { userId: req.userId! },
        update: { plan: 'FREE', credits: 1, status: 'ACTIVE' },
        create: { userId: req.userId!, plan: 'FREE', credits: 1, status: 'ACTIVE' },
      });
      return res.json({ success: true, message: 'Piano Free attivato', plan: 'FREE' });
    }

    const stripe = getStripe();
    if (!stripe) {
      return res.json({
        success: false,
        mode: 'mock',
        message: 'Stripe non configurato. Inserisci STRIPE_SECRET_KEY nel file .env per attivare i pagamenti.',
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: config.period === 'mese' ? 'subscription' : 'subscription',
      line_items: [{
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(config.price * 100),
          recurring: { interval: 'month' },
          product_data: { name: `AutoEsperto ${config.name}` },
        },
        quantity: 1,
      }],
      client_reference_id: req.userId,
      metadata: { userId: req.userId!, planId },
      success_url: successUrl || 'http://localhost:3000?checkout=success',
      cancel_url: cancelUrl || 'http://localhost:3000?checkout=cancel',
    });

    res.json({ success: true, url: session.url });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.post('/webhook', async (req, res) => {
  const stripe = getStripe();
  if (!stripe) return res.json({ received: true, mock: true });
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error('Stripe webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.client_reference_id || session.metadata?.userId;
        const planId = session.metadata?.planId;
        const config = planConfig[planId];
        if (userId && config) {
          const planName = planId.toUpperCase().replace('-', '_');
          await prisma.subscription.upsert({
            where: { userId },
            update: { plan: planName, credits: config.credits, status: 'ACTIVE', stripeSubscriptionId: session.subscription, renewsAt: new Date(Date.now() + 30 * 24 * 3600 * 1000) },
            create: { userId, plan: planName, credits: config.credits, status: 'ACTIVE', stripeSubscriptionId: session.subscription, renewsAt: new Date(Date.now() + 30 * 24 * 3600 * 1000) },
          });
          console.log(`subscription activated: ${userId} → ${planName}`);
        }
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object;
        const subId = invoice.subscription;
        const userId = invoice.metadata?.userId;
        if (userId && subId) {
          const sub = await stripe.subscriptions.retrieve(subId);
          const planId = sub.metadata?.planId;
          const config = planConfig[planId];
          if (config) {
            const planName = planId.toUpperCase().replace('-', '_');
            await prisma.subscription.upsert({
              where: { userId },
              update: { status: 'ACTIVE', credits: config.credits, renewsAt: new Date(sub.current_period_end * 1000) },
              create: { userId, plan: planName, credits: config.credits, status: 'ACTIVE', stripeSubscriptionId: subId, renewsAt: new Date(sub.current_period_end * 1000) },
            });
            console.log(`invoice paid: ${userId} → renewed until ${new Date(sub.current_period_end * 1000).toISOString()}`);
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const failedInvoice = event.data.object;
        const failedUserId = failedInvoice.metadata?.userId;
        if (failedUserId) {
          await prisma.subscription.update({
            where: { userId: failedUserId },
            data: { status: 'PAST_DUE' },
          });
          console.warn(`payment failed: ${failedUserId}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const deletedSub = event.data.object;
        const deletedUserId = deletedSub.metadata?.userId;
        if (deletedUserId) {
          await prisma.subscription.update({
            where: { userId: deletedUserId },
            data: { status: 'CANCELLED', credits: 0 },
          });
          console.log(`subscription cancelled: ${deletedUserId}`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const updatedSub = event.data.object;
        const updatedUserId = updatedSub.metadata?.userId;
        if (updatedUserId && updatedSub.status === 'past_due') {
          await prisma.subscription.update({
            where: { userId: updatedUserId },
            data: { status: 'PAST_DUE' },
          });
        }
        break;
      }

      default:
        console.log(`unhandled event: ${event.type}`);
    }
  } catch (err: any) {
    console.error('Webhook handler error:', err.message);
  }

  res.json({ received: true });
});

export default router;