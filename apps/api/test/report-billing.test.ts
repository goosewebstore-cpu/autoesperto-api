import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import type { Server } from 'node:http';
import { prisma } from '@autoesperto/database';
import { createApp } from '../src/app';
import { signAuthToken } from '../src/services/auth';
import { getStripe, recordPaidCheckout, recordReportRefund } from '../src/services/billing';
import { unlockReportWithCredit } from '../src/services/reportPreview';

const userId = 'report-billing-test-user';
const purchases = new Map<string, any>();
const reports = new Map<string, any>();
const credits = new Map<string, any>();
const events = new Map<string, any>();
const restores: Array<() => void> = [];
let server: Server;
let base = '';
let createdParams: any;
let checkoutCount = 0;
let expiredCheckoutCount = 0;
let oldEnv: Record<string, string | undefined> = {};

function stub(target: any, key: string, value: any) {
  const original = target[key];
  restores.push(() => { target[key] = original; });
  target[key] = value;
}

before(async () => {
  for (const key of ['JWT_SECRET', 'STRIPE_SECRET_KEY', 'WEB_URL']) oldEnv[key] = process.env[key];
  process.env.JWT_SECRET = 'phase-two-test-secret-only-32-characters-long';
  process.env.STRIPE_SECRET_KEY = 'sk_test_phase_two_only';
  process.env.WEB_URL = 'http://localhost:3000';
  stub(prisma.user, 'findUnique', async () => ({ id: userId, email: 'test@example.invalid', phone: null }));
  stub(prisma.purchase, 'create', async ({ data }: any) => { const purchase = { id: randomUUID(), status: 'PENDING', ...data }; purchases.set(purchase.id, purchase); return purchase; });
  stub(prisma.purchase, 'findUnique', async ({ where }: any) => where.id ? purchases.get(where.id) || null : [...purchases.values()].find((item) => item.stripePaymentIntentId === where.stripePaymentIntentId) || null);
  stub(prisma.purchase, 'findFirst', async ({ where }: any) => [...purchases.values()].find((item) => where.generatedReportId ? item.generatedReportId === where.generatedReportId && where.status.in.includes(item.status) : item.userId === where.userId && item.productType === where.productType && item.status === where.status) || null);
  stub(prisma.purchase, 'update', async ({ where, data }: any) => { const row = purchases.get(where.id); for (const [key,value] of Object.entries(data)) (row as any)[key] = key === 'checkoutAttempt' && (value as any)?.increment ? (row.checkoutAttempt || 0) + (value as any).increment : value; return row; });
  stub(prisma.purchase, 'updateMany', async ({ where, data }: any) => { const row = purchases.get(where.id); if (!row || (typeof where.status === 'string' && row.status !== where.status) || (where.status?.not && row.status === where.status.not) || (where.productType && row.productType !== where.productType)) return { count: 0 }; Object.assign(row, data); return { count: 1 }; });
  stub(prisma.purchase, 'delete', async ({ where }: any) => { const row = purchases.get(where.id); purchases.delete(where.id); return row; });
  stub(prisma.generatedReport, 'findUnique', async ({ where }: any) => reports.get(where.id) || null);
  stub(prisma.generatedReport, 'findFirst', async ({ where }: any) => { const row = reports.get(where.id); return row?.status === where.status && row.userId === where.userId ? row : null; });
  stub(prisma.generatedReport, 'updateMany', async ({ where, data }: any) => {
    const row = reports.get(where.id);
    if (!row || (where.status && row.status !== where.status) || (where.userId && row.userId !== where.userId) || (where.OR && row.userId !== null && row.userId !== userId)) return { count: 0 };
    Object.assign(row, data); return { count: 1 };
  });
  stub(prisma.reportCredit, 'createMany', async ({ data }: any) => { for (const row of data) if (!credits.has(row.id)) credits.set(row.id, { status: 'AVAILABLE', ...row }); return { count: data.length }; });
  stub(prisma.reportCredit, 'findFirst', async ({ where }: any) => [...credits.values()].find((row) => row.userId === where.userId && row.status === where.status && purchases.get(row.purchaseId)?.status === 'PAID') || null);
  stub(prisma.reportCredit, 'updateMany', async ({ where, data }: any) => { const matched = [...credits.values()].filter((credit) => (!where.id || credit.id === where.id) && (!where.purchaseId || credit.purchaseId === where.purchaseId) && (!where.userId || credit.userId === where.userId) && (!where.status || credit.status === where.status)); for (const row of matched) Object.assign(row, data); return { count: matched.length }; });
  stub(prisma.reportCredit, 'count', async ({ where }: any) => [...credits.values()].filter((row) => row.userId === where.userId && row.status === where.status && (!where.purchase || purchases.get(row.purchaseId)?.status === where.purchase.status)).length);
  stub(prisma.analyticsEvent, 'upsert', async ({ where, create }: any) => { if (!events.has(where.id)) events.set(where.id, create); return events.get(where.id); });
  stub(prisma, '$transaction', async (fn: any) => fn(prisma));
  const stripe = getStripe();
  stub(stripe.checkout.sessions, 'create', async (params: any) => { createdParams = params; checkoutCount++; return { id: 'cs_phase2_' + checkoutCount, url: 'https://checkout.stripe.test/session/' + checkoutCount }; });
  stub(stripe.checkout.sessions, 'retrieve', async (id: string) => ({ id, status: 'open', payment_status: 'unpaid', url: 'https://checkout.stripe.test/session/reused' }));
  stub(stripe.checkout.sessions, 'expire', async (id: string) => { expiredCheckoutCount++; return { id, status: 'expired' }; });
  await new Promise<void>((resolve) => { server = createApp().listen(0, () => { base = 'http://127.0.0.1:' + (server.address() as any).port; resolve(); }); });
});

after(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
  for (const restore of restores.reverse()) restore();
  for (const [key, value] of Object.entries(oldEnv)) { if (value === undefined) delete process.env[key]; else process.env[key] = value; }
});

async function post(path: string, body: unknown, auth = true, extraHeaders: Record<string, string> = {}) {
  return fetch(base + path, { method: 'POST', headers: { 'Content-Type': 'application/json', ...extraHeaders, ...(auth ? { Authorization: 'Bearer ' + signAuthToken(userId) } : {}) }, body: JSON.stringify(body) });
}

test('checkout 3 report riusa il pagamento aperto e lascia a Stripe i metodi dinamici', async () => {
  assert.equal((await post('/billing/report-checkout', { product: 'report_pack_3' }, false)).status, 401);
  const legacyPurchase = { id: randomUUID(), userId, productType: 'REPORT_PACK_3', creditsGranted: 3, amountCents: 499, currency: 'eur', status: 'PENDING', stripeSessionId: 'cs_legacy_pack_3', checkoutAttempt: 0 };
  purchases.set(legacyPurchase.id, legacyPurchase);
  const response = await post('/billing/report-checkout', { product: 'report_pack_3', returnTo: '/account?credits=success' });
  assert.equal(response.status, 201);
  const body = await response.json() as any;
  assert.equal(body.product, 'report_pack_3');
  assert.equal(createdParams.line_items[0].price_data.unit_amount, 499);
  assert.equal(createdParams.line_items[0].price_data.currency, 'eur');
  assert.match(createdParams.line_items[0].price_data.product_data.description, /tre acquistati e uno in omaggio/);
  assert.equal(createdParams.payment_method_types, undefined);
  assert.equal(createdParams.metadata.product, 'report_pack_3');
  assert.equal(createdParams.mode, 'payment');
  assert.equal(legacyPurchase.creditsGranted, 4);
  assert.equal(expiredCheckoutCount, 1);
  const before = checkoutCount;
  assert.equal((await post('/billing/report-checkout', { product: 'report_pack_3' })).status, 200);
  assert.equal(checkoutCount, before);
});

test('checkout report accetta la modalità live e mantiene prezzo fisso lato server', async () => {
  const before = purchases.size;
  const id = randomUUID(); const token = randomBytes(32).toString('base64url');
  reports.set(id, { id, userId: null, status: 'PREVIEW', expiresAt: new Date(Date.now() + 60_000), accessTokenHash: createHash('sha256').update(token).digest('hex') });
  const previousKey = process.env.STRIPE_SECRET_KEY;
  process.env.STRIPE_SECRET_KEY = 'sk_live_checkout_test_only';
  try {
    const response = await post('/billing/report-checkout', { product: 'single_report', reportId: id }, true, { 'X-Report-Access': token });
    assert.equal(response.status, 201);
    assert.equal(createdParams.line_items[0].price_data.unit_amount, 199);
    assert.equal(purchases.size, before + 1);
  } finally { process.env.STRIPE_SECRET_KEY = previousKey; }
});

test('single report richiede un token valido e lega Checkout al report specifico', async () => {
  const id = randomUUID();
  const token = randomBytes(32).toString('base64url');
  reports.set(id, { id, userId: null, status: 'PREVIEW', expiresAt: new Date(Date.now() + 60_000), accessTokenHash: createHash('sha256').update(token).digest('hex'), reportJson: JSON.stringify({ vehicle: { make: 'Fiat', model: 'Panda' } }) });
  assert.equal((await post('/billing/report-checkout', { product: 'single_report', reportId: id })).status, 403);
  const response = await post('/billing/report-checkout', { product: 'single_report', reportId: id }, true, { 'X-Report-Access': token });
  assert.equal(response.status, 201);
  assert.equal(createdParams.line_items[0].price_data.unit_amount, 199);
  assert.equal(createdParams.line_items[0].price_data.currency, 'eur');
  assert.equal(createdParams.metadata.reportId, id);
  assert.equal([...purchases.values()][purchases.size - 1].generatedReportId, id);
  const before = checkoutCount;
  assert.equal((await post('/billing/report-checkout', { product: 'single_report', reportId: id }, true, { 'X-Report-Access': token })).status, 200);
  assert.equal(checkoutCount, before);
});

test('webhook fulfillment is idempotent, preserves old 3-credit purchases, grants the new 4-credit bonus pack, and checks the paid amount', async () => {
  const purchase = { id: randomUUID(), userId, productType: 'REPORT_PACK_3', creditsGranted: 3, amountCents: 499, currency: 'eur', status: 'PENDING', stripeSessionId: 'cs_credits_test', stripePaymentIntentId: null };
  purchases.set(purchase.id, purchase);
  const session: any = { id: purchase.stripeSessionId, mode: 'payment', status: 'complete', payment_status: 'paid', metadata: { userId, purchaseId: purchase.id, product: 'report_pack_3' }, amount_total: 499, currency: 'eur', payment_intent: 'pi_credits_test' };
  await recordPaidCheckout(session); await recordPaidCheckout(session);
  assert.equal(purchase.status, 'PAID');
  assert.equal([...credits.values()].filter((credit) => credit.purchaseId === purchase.id).length, 3);
  const bonusPurchase = { ...purchase, id: randomUUID(), creditsGranted: 4, status: 'PENDING', stripeSessionId: 'cs_bonus_4', stripePaymentIntentId: null };
  purchases.set(bonusPurchase.id, bonusPurchase);
  await recordPaidCheckout({ ...session, id: bonusPurchase.stripeSessionId, payment_intent: 'pi_bonus_4', metadata: { ...session.metadata, purchaseId: bonusPurchase.id } });
  assert.equal([...credits.values()].filter((credit) => credit.purchaseId === bonusPurchase.id).length, 4);
  const badPurchase = { id: randomUUID(), userId, productType: 'REPORT_PACK_3', creditsGranted: 3, amountCents: 499, currency: 'eur', status: 'PENDING', stripeSessionId: 'cs_bad_total' };
  purchases.set(badPurchase.id, badPurchase);
  await assert.rejects(recordPaidCheckout({ ...session, id: 'cs_bad_total', metadata: { ...session.metadata, purchaseId: badPurchase.id }, amount_total: 1 } as any), /Importo/);
  assert.equal([...credits.values()].filter((credit) => credit.purchaseId === badPurchase.id).length, 0);
});

test('un credito sblocca un solo report, ripetere sullo stesso report non consuma ancora', async () => {
  const credit = [...credits.values()].find((item) => item.status === 'AVAILABLE')!;
  const id = randomUUID(); const token = randomBytes(32).toString('base64url');
  const row = { id, userId: null, status: 'PREVIEW', expiresAt: new Date(Date.now() + 60_000), accessTokenHash: createHash('sha256').update(token).digest('hex'), reportJson: JSON.stringify({ vehicle: { make: 'Fiat', model: 'Panda' } }) };
  reports.set(id, row);
  const [first, repeated] = await Promise.all([unlockReportWithCredit(id, userId, token), unlockReportWithCredit(id, userId, token)]);
  assert.ok(first || repeated);
  assert.equal(row.status, 'UNLOCKED');
  assert.equal(credit.status, 'CONSUMED');
  assert.equal(credit.generatedReportId, id);
  assert.ok((await unlockReportWithCredit(id, userId, token))?.vehicle);
  assert.equal(credit.generatedReportId, id);
});

test('rimborso disattiva crediti non usati ma conserva lo storico dei consumati', async () => {
  const pack = [...purchases.values()].find((item) => item.productType === 'REPORT_PACK_3' && item.status === 'PAID');
  assert.ok(pack);
  const ledger = [...credits.values()].filter((credit) => credit.purchaseId === pack.id);
  const used = ledger.find((credit) => credit.status === 'CONSUMED');
  const unused = ledger.filter((credit) => credit.status === 'AVAILABLE');
  pack.stripePaymentIntentId = 'pi_refund_test';
  await recordReportRefund('pi_refund_test');
  assert.equal(pack.status, 'REFUNDED');
  assert.equal(used.status, 'CONSUMED');
  assert.ok(unused.every((credit) => credit.status === 'REVOKED'));
});
