import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { prisma } from '@autoesperto/database';
import { createUnlockedReportShare, readSharedReport, unlockReportWithPro } from '../src/services/reportPreview';
import { syncProStripeSubscription } from '../src/services/billing';
import { PRO_REPORTS_PER_CYCLE } from '../src/services/proPlans';

const userId = 'autoesperto-pro-quota-test';
const restores: Array<() => void> = [];
const reports = new Map<string, any>();
const subscriptions = new Map<string, any>();
const usages = new Map<string, any>();
const events = new Map<string, any>();
function stub(target: any, key: string, value: any) { const original = target[key]; restores.push(() => { target[key] = original; }); target[key] = value; }

before(() => {
  stub(prisma.generatedReport, 'findUnique', async ({ where }: any) => where.shareTokenHash ? [...reports.values()].find((row) => row.shareTokenHash === where.shareTokenHash) || null : reports.get(where.id) || null);
  stub(prisma.generatedReport, 'findFirst', async ({ where }: any) => { const row = reports.get(where.id); return row?.userId === where.userId && row.status === where.status ? row : null; });
  stub(prisma.generatedReport, 'update', async ({ where, data }: any) => { const row = reports.get(where.id); Object.assign(row, data); return row; });
  stub(prisma.generatedReport, 'updateMany', async ({ where, data }: any) => { const row = reports.get(where.id); if (!row || row.status !== where.status) return { count: 0 }; Object.assign(row, data); return { count: 1 }; });
  stub(prisma.proSubscription, 'findUnique', async ({ where }: any) => subscriptions.get(where.userId) || null);
  stub(prisma.proSubscription, 'upsert', async ({ where, create, update }: any) => { const row = subscriptions.get(where.userId); if (row) Object.assign(row, update); else subscriptions.set(where.userId, create); return subscriptions.get(where.userId); });
  stub(prisma.proSubscription, 'updateMany', async ({ where, data }: any) => { const row = [...subscriptions.values()].find((s) => s.id === where.id); if (!row || row.status !== where.status || row.reportsUsed >= PRO_REPORTS_PER_CYCLE || row.periodEnd <= new Date()) return { count: 0 }; row.reportsUsed += data.reportsUsed.increment; return { count: 1 }; });
  stub(prisma.proReportUsage, 'create', async ({ data }: any) => { const row = { id: randomUUID(), ...data }; usages.set(row.generatedReportId, row); return row; });
  stub(prisma.analyticsEvent, 'upsert', async ({ where, create }: any) => { if (!events.has(where.id)) events.set(where.id, create); return events.get(where.id); });
  stub(prisma, '$transaction', async (fn: any) => fn(prisma));
});
after(() => { for (const restore of restores.reverse()) restore(); });

function preview(remaining: number) {
  const id = randomUUID(); const token = randomBytes(32).toString('base64url');
  reports.set(id, { id, userId: null, status: 'PREVIEW', expiresAt: new Date(Date.now() + 60_000), accessTokenHash: createHash('sha256').update(token).digest('hex'), reportJson: JSON.stringify({ vehicle: { make: 'Fiat', model: 'Panda' } }) });
  const subscription = { id: randomUUID(), userId, status: 'ACTIVE', periodStart: new Date(Date.now() - 1000), periodEnd: new Date(Date.now() + 30 * 86400000), reportsUsed: PRO_REPORTS_PER_CYCLE - remaining };
  subscriptions.set(userId, subscription);
  return { id, token, subscription };
}

test('PRO 30+3 omaggio usa una sola quota per report e una ripetizione non scala il contatore', async () => {
  const { id, token, subscription } = preview(1);
  const first = await unlockReportWithPro(id, userId, token);
  const repeated = await unlockReportWithPro(id, userId, token);
  assert.equal((first as any)?.vehicle.model, 'Panda');
  assert.equal((repeated as any)?.vehicle.model, 'Panda');
  assert.equal(subscription.reportsUsed, PRO_REPORTS_PER_CYCLE);
  assert.equal(usages.size, 1);
});

test('PRO rifiuta il 34° report del ciclo e mantiene l’anteprima protetta', async () => {
  const { id, token, subscription } = preview(0);
  const result = await unlockReportWithPro(id, userId, token);
  assert.equal(result, null);
  assert.equal(subscription.reportsUsed, PRO_REPORTS_PER_CYCLE);
  assert.equal(reports.get(id).status, 'PREVIEW');
});

test('PRO rifiuta un report quando l’abbonamento è scaduto o in pagamento fallito', async () => {
  const { id, token, subscription } = preview(5);
  subscription.status = 'PAST_DUE';
  assert.equal(await unlockReportWithPro(id, userId, token), null);
  assert.equal(subscription.reportsUsed, PRO_REPORTS_PER_CYCLE - 5);
  assert.equal(reports.get(id).status, 'PREVIEW');
});

test('rinnovo PRO azzera la quota soltanto quando inizia un nuovo ciclo e conserva la disdetta fino a fine periodo', async () => {
  preview(8);
  const firstStart = Math.floor(Date.now() / 1000);
  const firstEnd = firstStart + 30 * 86400;
  const sub: any = { id: 'sub_pro_test', customer: 'cus_pro_test', status: 'active', cancel_at_period_end: false, metadata: { product: 'autoesperto_pro', userId }, items: { data: [{ price: { id: 'price_pro_test' }, current_period_start: firstStart, current_period_end: firstEnd }] } };
  await syncProStripeSubscription(sub);
  const saved = subscriptions.get(userId);
  assert.equal(saved.reportsUsed, 0);
  saved.reportsUsed = 4;
  const scheduledCancel: any = { ...sub, cancel_at_period_end: true, canceled_at: firstStart + 60 };
  await syncProStripeSubscription(scheduledCancel);
  assert.equal(saved.reportsUsed, 4);
  assert.equal(saved.status, 'ACTIVE');
  assert.ok(saved.cancelledAt);
  const nextCycle: any = { ...sub, items: { data: [{ price: { id: 'price_pro_test' }, current_period_start: firstEnd, current_period_end: firstEnd + 30 * 86400 }] } };
  await syncProStripeSubscription(nextCycle);
  assert.equal(saved.reportsUsed, 0);
  assert.equal(saved.status, 'ACTIVE');
  assert.equal(saved.cancelledAt, null);
});

test('link report PRO usa un token non indovinabile, salva solo hash e rifiuta il link scaduto', async () => {
  const id = randomUUID();
  const row: any = { id, userId, status: 'UNLOCKED', title: 'Fiat Panda', reportJson: JSON.stringify({ vehicle: { make: 'Fiat', model: 'Panda' } }), shareTokenHash: null, shareExpiresAt: null };
  reports.set(id, row);
  const shared = await createUnlockedReportShare(id, userId);
  assert.ok(shared);
  assert.equal(row.shareTokenHash, createHash('sha256').update(shared!.token).digest('hex'));
  assert.notEqual(row.shareTokenHash, shared!.token);
  assert.equal((await readSharedReport(shared!.token))?.title, 'Fiat Panda');
  row.shareExpiresAt = new Date(Date.now() - 1000);
  assert.equal(await readSharedReport(shared!.token), null);
});
