import { test } from 'node:test';
import assert from 'node:assert/strict';
import { estimateMarketValue, estimateMarketValueWithKm } from '../src/services/pricing';

function inRange(actual: number, min: number, max: number, label: string): void {
  assert.ok(actual >= min && actual <= max, `${label}: atteso tra ${min} e ${max}, ottenuto ${actual}`);
}

test('Fiat Panda 2018 (8 anni) → fascia realistica', () => {
  const { value, min, max } = estimateMarketValue({
    make: 'Fiat', model: 'Panda 1.2 Lounge', year: 2018, fuel: 'Benzina', body: 'Utilitaria',
  });
  inRange(value, 7000, 10500, 'Panda 2018');
  assert.ok(min < value && max > value, 'range min/max coerente');
});

test('Volkswagen Golf 2020 (6 anni) → fascia realistica', () => {
  const { value } = estimateMarketValue({
    make: 'Volkswagen', model: 'Golf VII 1.6 TDI', year: 2020, fuel: 'Diesel', body: 'Berlina',
  });
  inRange(value, 14500, 22500, 'Golf 2020');
});

test('BMW Serie 1 2016 (10 anni) → fascia realistica', () => {
  const { value } = estimateMarketValue({
    make: 'BMW', model: 'Serie 1 118d', year: 2016, fuel: 'Diesel', body: 'Berlina',
  });
  inRange(value, 11000, 18500, 'Serie 1 2016');
});

test('Tesla Model 3 2022 (4 anni) → fascia realistica', () => {
  const { value } = estimateMarketValue({
    make: 'Tesla', model: 'Model 3', year: 2022, fuel: 'Elettrica', body: 'Berlina',
  });
  inRange(value, 23000, 38000, 'Model 3 2022');
});

test('Dacia Sandero 2018 → fascia realistica', () => {
  const { value } = estimateMarketValue({
    make: 'Dacia', model: 'Sandero', year: 2018, fuel: 'Benzina', body: 'Utilitaria',
  });
  inRange(value, 5000, 9500, 'Sandero 2018');
});

test('una vettura nuova vale più di una vecchia dello stesso modello', () => {
  const nuova = estimateMarketValue({ make: 'Fiat', model: 'Panda', year: 2026, fuel: 'Benzina' });
  const vecchia = estimateMarketValue({ make: 'Fiat', model: 'Panda', year: 2013, fuel: 'Benzina' });
  assert.ok(nuova.value > vecchia.value, 'nuova > vecchia');
});

test('il chilometraggio riduce il valore con un fattore contenuto', () => {
  const base = estimateMarketValue({ make: 'Fiat', model: 'Panda', year: 2018, fuel: 'Benzina' });
  const km = estimateMarketValueWithKm({ make: 'Fiat', model: 'Panda', year: 2018, fuel: 'Benzina' }, 190000);
  assert.ok(km.adjustedForKm < base.value, 'km alti riducono il valore');
  assert.ok(km.adjustedForKm >= base.value * 0.65, 'riduzione non estrema');
});

test('500X non viene confusa con la 500 (match più lungo vince)', () => {
  const x = estimateMarketValue({ make: 'Fiat', model: '500X Cross', year: 2019, fuel: 'Diesel', body: 'SUV' });
  const cinquecento = estimateMarketValue({ make: 'Fiat', model: '500 1.2', year: 2019, fuel: 'Benzina', body: 'Utilitaria' });
  assert.ok(x.value > cinquecento.value, '500X vale più della 500');
});
