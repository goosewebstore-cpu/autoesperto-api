import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateAccountEntitlement } from '../src/services/entitlement';
import { getAnalysisPrice } from '../src/services/billing';

test('un account riceve una sola analisi gratuita', () => {
  const first = calculateAccountEntitlement({ userId: 'user-1', paidPurchases: 0, analysisCount: 0, premium: false });
  const next = calculateAccountEntitlement({ userId: 'user-1', paidPurchases: 0, analysisCount: 1, premium: false });
  assert.equal(first.entitled, true);
  assert.equal(first.freeAvailable, true);
  assert.equal(next.entitled, false);
  assert.equal(next.needsUpgrade, true);
});

test('ogni acquisto copre esattamente una analisi successiva alla prova gratuita', () => {
  const afterFree = calculateAccountEntitlement({ userId: 'user-1', paidPurchases: 1, analysisCount: 1, premium: false });
  const exhausted = calculateAccountEntitlement({ userId: 'user-1', paidPurchases: 1, analysisCount: 2, premium: false });
  const twoCredits = calculateAccountEntitlement({ userId: 'user-1', paidPurchases: 2, analysisCount: 2, premium: false });
  assert.equal(afterFree.entitled, true);
  assert.equal(exhausted.entitled, false);
  assert.equal(twoCredits.entitled, true);
});

test('account senza sessione non riceve crediti gratuiti e premium resta illimitato', () => {
  const anonymous = calculateAccountEntitlement({ userId: null, paidPurchases: 0, analysisCount: 0, premium: false });
  const premium = calculateAccountEntitlement({ userId: 'user-2', paidPurchases: 0, analysisCount: 30, premium: true });
  assert.equal(anonymous.entitled, false);
  assert.equal(anonymous.needsLogin, true);
  assert.equal(premium.entitled, true);
  assert.equal(premium.unlimited, true);
});

test('il prezzo singolo è 1,99 € e ignora le vecchie variabili promozionali', () => {
  assert.deepEqual(getAnalysisPrice(), { amountCents: 199, currency: 'eur', promotional: false });
});
