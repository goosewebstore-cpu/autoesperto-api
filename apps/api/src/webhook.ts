import type { Request, Response } from 'express';
import type Stripe from 'stripe';
import { prisma } from '@autoesperto/database';
import { getStripe, markReportCheckoutFailed, recordPaidCheckout, recordReportRefund, syncStripeSubscription, syncProStripeSubscription } from './services/billing';
export async function stripeWebhook(req: Request, res: Response): Promise<void> {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  const signature = req.header('stripe-signature');
  if (!secret || !signature) { res.status(400).json({success:false,error:'Webhook Stripe non configurato.'}); return; }
  let event: Stripe.Event;
  try { event = getStripe().webhooks.constructEvent(req.body,signature,secret); }
  catch { res.status(400).json({success:false,error:'Firma webhook non valida.'}); return; }
  try {
    const stripe = getStripe();
    if (['checkout.session.completed','checkout.session.async_payment_succeeded'].includes(event.type)) {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode === 'payment' && session.metadata?.product === 'single_analysis') await recordPaidCheckout(session);
      if (session.mode === 'subscription' && session.metadata?.product === 'autoesperto_pro' && session.subscription) {
        const sub = typeof session.subscription === 'string' ? await stripe.subscriptions.retrieve(session.subscription) : session.subscription;
        await syncProStripeSubscription(sub, session.metadata.userId);
      }
      if (session.mode === 'subscription' && session.metadata?.product === 'premium_subscription' && session.subscription) {
        const id = typeof session.subscription === 'string' ? session.subscription : session.subscription.id;
        await syncStripeSubscription(await stripe.subscriptions.retrieve(id),session.metadata?.userId);
      }
    }
    if (['checkout.session.async_payment_failed', 'checkout.session.expired'].includes(event.type)) {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.metadata?.product === 'single_report' || session.metadata?.product === 'report_pack_3') await markReportCheckoutFailed(session.id);
    }
    if (event.type === 'charge.refunded') {
      const charge = event.data.object as Stripe.Charge;
      const paymentIntent = typeof charge.payment_intent === 'string' ? charge.payment_intent : charge.payment_intent?.id;
      if (paymentIntent) await recordReportRefund(paymentIntent);
    }
    if (['customer.subscription.created','customer.subscription.updated','customer.subscription.deleted','customer.subscription.paused','customer.subscription.resumed'].includes(event.type)) {
      const sub = event.data.object as Stripe.Subscription;
      // Retrieve current state: event delivery order must not re-enable a cancelled subscription.
      if (sub.metadata?.product === 'premium_subscription') await syncStripeSubscription(await stripe.subscriptions.retrieve(sub.id));
      if (sub.metadata?.product === 'autoesperto_pro') await syncProStripeSubscription(await stripe.subscriptions.retrieve(sub.id));
    }
    if (['invoice.paid','invoice.payment_failed'].includes(event.type)) {
      const invoice = event.data.object as Stripe.Invoice;
      const sub = invoice.parent?.subscription_details?.subscription;
      if (sub) {
        const current=await stripe.subscriptions.retrieve(typeof sub === 'string' ? sub : sub.id);
        if(current.metadata.product==='premium_subscription') await syncStripeSubscription(current);
        if(current.metadata.product==='autoesperto_pro') {
          await syncProStripeSubscription(current);
          if (event.type === 'invoice.paid') await prisma.analyticsEvent.upsert({
            where: { id: `pro-invoice-paid:${invoice.id}` }, update: {},
            create: { id: `pro-invoice-paid:${invoice.id}`, type: 'payment_completed', userId: current.metadata.userId, path: '/account/pro', meta: JSON.stringify({ invoiceId: invoice.id, subscriptionId: current.id, product: 'autoesperto_pro', amountCents: invoice.amount_paid, currency: invoice.currency }) },
          });
          if (event.type === 'invoice.payment_failed') await prisma.analyticsEvent.upsert({
            where: { id: `pro-invoice-failed:${invoice.id}` }, update: {},
            create: { id: `pro-invoice-failed:${invoice.id}`, type: 'subscription_payment_failed', userId: current.metadata.userId, path: '/account/pro', meta: JSON.stringify({ invoiceId: invoice.id, product: 'autoesperto_pro', reason: 'subscription_payment_failed' }) },
          });
        }
      }
    }
    res.json({received:true});
  } catch (error) {
    console.error('Stripe webhook processing failed:', error instanceof Error ? error.message : 'unknown');
    res.status(500).json({success:false,error:'Elaborazione non completata. Riprova.'});
  }
}
