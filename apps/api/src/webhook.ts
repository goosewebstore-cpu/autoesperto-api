import type { Request, Response } from 'express';
import { getStripe, recordPaidCheckout } from './services/billing';

export async function stripeWebhook(req: Request, res: Response): Promise<void> {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  const signature = req.header('stripe-signature');
  if (!secret || !signature) {
    res.status(400).json({ success: false, error: 'Webhook Stripe non configurato.' });
    return;
  }

  try {
    const event = getStripe().webhooks.constructEvent(req.body, signature, secret);
    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      await recordPaidCheckout(event.data.object);
    }
    res.json({ received: true });
  } catch (error) {
    console.warn('Stripe webhook rejected:', error instanceof Error ? error.message : error);
    res.status(400).json({ success: false, error: 'Firma webhook non valida.' });
  }
}
