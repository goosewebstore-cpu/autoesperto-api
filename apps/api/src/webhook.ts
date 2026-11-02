import type { Request, Response } from 'express';
import type Stripe from 'stripe';
import { getStripe, recordPaidCheckout, syncStripeSubscription } from './services/billing';
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
      if (session.mode === 'subscription' && session.metadata?.product === 'premium_subscription' && session.subscription) {
        const id = typeof session.subscription === 'string' ? session.subscription : session.subscription.id;
        await syncStripeSubscription(await stripe.subscriptions.retrieve(id),session.metadata?.userId);
      }
    }
    if (['customer.subscription.created','customer.subscription.updated','customer.subscription.deleted','customer.subscription.paused','customer.subscription.resumed'].includes(event.type)) {
      const sub = event.data.object as Stripe.Subscription;
      // Retrieve current state: event delivery order must not re-enable a cancelled subscription.
      if (sub.metadata?.product === 'premium_subscription') await syncStripeSubscription(await stripe.subscriptions.retrieve(sub.id));
    }
    if (['invoice.paid','invoice.payment_failed'].includes(event.type)) {
      const invoice = event.data.object as Stripe.Invoice;
      const sub = invoice.parent?.subscription_details?.subscription;
      if (sub) {const current=await stripe.subscriptions.retrieve(typeof sub === 'string' ? sub : sub.id);if(current.metadata.product==='premium_subscription')await syncStripeSubscription(current);}
    }
    res.json({received:true});
  } catch (error) {
    console.error('Stripe webhook processing failed:', error instanceof Error ? error.message : 'unknown');
    res.status(500).json({success:false,error:'Elaborazione non completata. Riprova.'});
  }
}
