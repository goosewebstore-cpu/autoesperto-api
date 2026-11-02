import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateCustomizedEstimate } from '../src/lib/valuationAdjustments';

const base = { baseValue: 10_000, baseYear: 2020, baseKm: 100_000, year: 2020, km: 100_000, conditionFactor: 1 };

test('optional Full LED e CarPlay non raddoppiano una stima da 10.000 euro', () => {
  const result = calculateCustomizedEstimate({ ...base, rawOptionalValue: 210 });
  assert.equal(result.finalValue, 10_200);
  assert.equal(result.optionalsSum, 200);
  assert.deepEqual(result, calculateCustomizedEstimate({ ...base, rawOptionalValue: 210 }));
});

test('tutti gli optional restano sotto il tetto di 400 euro', () => {
  const result = calculateCustomizedEstimate({ ...base, baseValue: 40_000, rawOptionalValue: 5_000 });
  assert.equal(result.optionalsSum, 400);
  assert.equal(result.finalValue, 40_400);
});

test('senza modifiche il valore e i km di partenza restano invariati', () => {
  const result = calculateCustomizedEstimate({ ...base, rawOptionalValue: 0 });
  assert.equal(result.finalValue, 10_000);
  assert.equal(result.kmDelta, 0);
});
