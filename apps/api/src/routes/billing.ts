import { Router } from 'express';
import { prisma } from '@autoesperto/database';
import { z } from 'zod';
import { asyncHandler, conflict, forbidden } from '../http';
import { type AuthenticatedRequest, requireAuth } from '../services/auth';
import { getAnalysisPrice, getStripe, recordPaidCheckout } from '../services/billing';

const router = Router();
const confirmSchema = z.object({ sessionId: z.string().trim().startsWith('cs_').max(255) });

router.post(
  '/checkout',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { userId } = (req as AuthenticatedRequest).auth;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        analysis: { select: { id: true } },
        purchases: { where: { status: 'PAID' }, take: 1, select: { id: true } },
      },
    });
    if (!user) throw forbidden('Account non trovato.');
    if (user.analysis || user.purchases.length) {
      throw conflict(user.analysis ? 'Hai già utilizzato la tua analisi.' : 'La tua analisi è già stata acquistata.');
    }

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
                description: 'Una analisi AI dettagliata, salvata nel tuo account.',
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
    res.json({ success: true, paid: session.payment_status === 'paid' });
  })
);

export default router;
