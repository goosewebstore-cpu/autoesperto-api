import type { Request, Response } from 'express';
import { getStripe, recordPaidCheckout, activatePremium, deactivatePremium } from './services/billing';
import { prisma } from '@autoesperto/database';

export async function stripeWebhook(req: Request, res: Response): Promise<void> {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  const signature = req.header('stripe-signature');
  if (!secret || !signature) {
    res.status(400).json({ success: false, error: 'Webhook Stripe non configurato.' });
    return;
  }

  try {
    const event = getStripe().webhooks.constructEvent(req.body, signature, secret);

    // Existing: single-payment checkout
    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      const session = event.data.object;
      if (session.mode === 'payment') {
        await recordPaidCheckout(session);
      } else if (session.mode === 'subscription' && session.subscription && session.metadata?.userId) {
        const subId = typeof session.subscription === 'string' ? session.subscription : session.subscription.id;
        const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id || '';
        const sub = await getStripe().subscriptions.retrieve(subId) as any;
        const renewsAt = new Date(sub.current_period_end * 1000);
        const priceId = sub.items.data[0]?.price.id || '';
        await activatePremium(session.metadata.userId, subId, customerId, priceId, renewsAt);
      }
    }

    // Subscription lifecycle events
    if (event.type === 'customer.subscription.updated') {
      const sub = event.data.object as any;
      const subId = sub.id;
      if (sub.status === 'active') {
        const dbSub = await prisma.subscription.findFirst({ where: { stripeSubscriptionId: subId } });
        if (dbSub) {
          await prisma.subscription.update({
            where: { id: dbSub.id },
            data: { renewsAt: new Date(sub.current_period_end * 1000), status: 'ACTIVE', plan: 'PREMIUM' },
          });
        }
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      await deactivatePremium((event.data.object as any).id);
    }

    if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object as any;
      const subId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id;
      if (subId) {
        const dbSub = await prisma.subscription.findFirst({ where: { stripeSubscriptionId: subId } });
        if (dbSub) {
          await prisma.subscription.update({
            where: { id: dbSub.id },
            data: { status: 'PAST_DUE' },
          });
        }
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.warn('Stripe webhook rejected:', error instanceof Error ? error.message : error);
    res.status(400).json({ success: false, error: 'Firma webhook non valida.' });
  }
}
