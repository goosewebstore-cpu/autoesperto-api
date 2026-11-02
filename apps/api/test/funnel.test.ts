import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import type { Server } from 'node:http';
import { prisma } from '@autoesperto/database';
import { createApp } from '../src/app';
import { recordPaidCheckout } from '../src/services/billing';

let server: Server;
let base = '';
const trials = new Map<string, any>();
const events = new Map<string, any>();
const generatedReports = new Map<string, any>();
const saved: Array<() => void> = [];
function stub(target: any, name: string, fn: any) {
  const original = target[name]; saved.push(() => { target[name] = original; }); target[name] = fn;
}
before(async () => {
  stub(prisma.guestTrial, 'findUnique', async ({ where }: any) => trials.get(where.id) || null);
  stub(prisma.guestTrial, 'create', async ({ data }: any) => { const trial = { ...data, usedAt: null }; trials.set(data.id, trial); return trial; });
  stub(prisma.guestTrial, 'updateMany', async ({ where, data }: any) => { const trial = trials.get(where.id); if (!trial || trial.usedAt) return { count: 0 }; Object.assign(trial, data); return { count: 1 }; });
  stub(prisma.analyticsEvent, 'create', async ({ data }: any) => { const id = data.id || randomUUID(); if (events.has(id)) throw Object.assign(new Error('duplicate'), { code: 'P2002' }); events.set(id, data); return { ...data, id }; });
  stub(prisma.analyticsEvent, 'upsert', async ({ where, create }: any) => { if (!events.has(where.id)) events.set(where.id, create); return events.get(where.id); });
  stub(prisma.generatedReport, 'create', async ({ data }: any) => { const row = { ...data }; generatedReports.set(data.id, row); return row; });
  stub(prisma.generatedReport, 'findUnique', async ({ where }: any) => generatedReports.get(where.id) || null);
  await new Promise<void>((resolve) => { server = createApp().listen(0, () => { const addr = server.address() as any; base = 'http://127.0.0.1:' + addr.port; resolve(); }); });
});
after(async () => { for (const restore of saved.reverse()) restore(); await new Promise<void>((resolve) => server.close(() => resolve())); });

async function post(path: string, body: unknown, cookie?: string) {
  return fetch(base + path, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(cookie ? { cookie } : {}) }, body: JSON.stringify(body) });
}
test('anonymous model and listing scans return only a useful preview, never the full report', async () => {
  const input = { mode:'model', make:'Fiat', model:'Panda', year:2019, km:75000, requestedPrice:9500, fuel:'Benzina' };
  for (const model of ['Panda','500','Panda']) {
    const report = await post('/reports/free-scan',{...input,model});
    assert.equal(report.status,200);
    const result = await report.json() as any;
    assert.ok(result.preview?.reportId);
    assert.equal(result.report, undefined);
    assert.ok(result.preview.firstCheck);
    assert.ok(result.preview.accessToken);
    assert.equal(result.saved,false);
  }
  const listing = await post('/reports/free-scan',{...input,mode:'listing'});
  assert.equal(listing.status,200);
  const listingResult = await listing.json() as any;
  assert.ok(listingResult.preview?.reportId);
  assert.equal(listingResult.report, undefined);
  const config = await (await fetch(base+'/reports/trial')).json() as any;
  assert.equal(config.available,false); assert.equal(config.modelFree,true);
});
test('preview bearer token can recover only the preview and cannot be omitted or forged', async () => {
  const response = await post('/reports/free-scan',{mode:'model',make:'Fiat',model:'Panda',year:2019,km:75000,requestedPrice:9500,fuel:'Benzina'});
  assert.equal(response.status, 200);
  const { preview } = await response.json() as any;
  const url = `${base}/reports/preview/${preview.reportId}`;
  assert.equal((await fetch(url)).status, 404);
  assert.equal((await fetch(url, { headers: { 'X-Report-Access': 'x'.repeat(48) } })).status, 404);
  const recovered = await fetch(url, { headers: { 'X-Report-Access': preview.accessToken } });
  assert.equal(recovered.status, 200);
  const body = await recovered.json() as any;
  assert.ok(body.preview.firstCheck);
  assert.equal(body.preview.report, undefined);
  assert.equal(body.preview.price, undefined);
});
test('new funnel events are accepted, repeated delivery is counted once and unknown events are rejected', async () => {
  const id = randomUUID();
  const body = { type: 'analysis_failed', eventId: id, visitorId: 'test', meta: JSON.stringify({ sessionId: 'test', reason: 'timeout' }) };
  assert.equal((await post('/analytics/track', body)).status, 200);
  assert.equal((await post('/analytics/track', body)).status, 200);
  assert.equal([...events.keys()].filter((key) => key === id).length, 1);
  assert.equal((await post('/analytics/track', { type: 'unknown_event' })).status, 400);
  for (const type of ['page_view', 'page_leave', 'photo_recognition_started', 'photo_recognition_completed', 'homepage_view', 'listing_analyzed', 'preview_viewed', 'unlock_clicked', 'subscription_started', 'subscription_cancelled', 'subscription_payment_failed']) assert.equal((await post('/analytics/track', { type })).status, 200, type);
});
test('anonymous session checks do not exhaust the credential-attempt budget', async () => {
  for (let i = 0; i < 25; i++) assert.equal((await fetch(base + '/auth/me')).status, 401);
  assert.equal((await post('/auth/login', {})).status, 400);
});
test('Stripe confirmation and webhook count one verified payment and reject incorrect totals', async () => {
  const purchase = { id: 'purchase-test', userId: 'test-user', amountCents: 199, currency: 'eur', stripeSessionId: 'cs_funnel_test', paidAt: null };
  stub(prisma.purchase, 'findUnique', async () => purchase);
  stub(prisma.purchase, 'update', async ({ data }: any) => Object.assign(purchase, data));
  const session: any = { id: 'cs_funnel_test', payment_status: 'paid', metadata: { userId: 'test-user', purchaseId: purchase.id }, amount_total: 199, currency: 'eur' };
  await recordPaidCheckout(session); await recordPaidCheckout(session);
  assert.equal([...events.values()].filter((event) => event.type === 'purchase_completed').length, 1);
  await assert.rejects(recordPaidCheckout({ ...session, amount_total: 1 }), /Importo/);
  await assert.rejects(recordPaidCheckout({ ...session, id: 'cs_wrong' }), /Sessione/);
  const before = events.size;
  await recordPaidCheckout({ ...session, payment_status: 'unpaid' });
  assert.equal(events.size, before);
});
