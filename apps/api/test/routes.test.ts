import { describe, it } from 'node:test';
import assert from 'node:assert';

const BASE = process.env.TEST_API_URL || 'http://localhost:4000';

function req(path: string, opts: any = {}) {
  const headers: any = { 'Content-Type': 'application/json' };
  return fetch(`${BASE}${path}`, {
    method: opts.method || 'GET',
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  }).then(async (r) => ({ status: r.status, data: await r.json().catch(() => null) }));
}

describe('AutoEsperto API (MVP)', () => {
  it('GET /health', async () => {
    const r = await req('/health');
    assert.strictEqual(r.status, 200);
    assert.ok(r.data.ok);
    assert.strictEqual(r.data.service, 'autoesperto-api');
  });

  it('percorso sconosciuto → 404 JSON', async () => {
    const r = await req('/nonexistent');
    assert.strictEqual(r.status, 404);
    assert.strictEqual(r.data.success, false);
  });

  describe('POST /reports/analyze', () => {
    it('targa valida → report completo', async () => {
      const r = await req('/reports/analyze', {
        method: 'POST',
        body: { plate: 'FE120KD', km: 85000, requestedPrice: 14500 },
      });
      assert.strictEqual(r.status, 200);
      assert.ok(r.data.success);
      assert.ok(r.data.report.vehicle.make);
      assert.strictEqual(r.data.report.vehicle.dataSource, 'plate');
      assert.ok(r.data.report.reliability.score > 0);
      assert.ok(r.data.report.price.estimatedValue > 0);
      assert.ok(Array.isArray(r.data.report.price.marketUrls));
      assert.ok(r.data.report.price.marketUrls.length > 0);
    });

    it('ricerca per modello → report con dataSource model', async () => {
      const r = await req('/reports/analyze', {
        method: 'POST',
        body: { make: 'BMW', model: 'Serie 3', km: 120000, requestedPrice: 22000 },
      });
      assert.strictEqual(r.status, 200);
      assert.strictEqual(r.data.report.vehicle.dataSource, 'model');
      assert.ok(r.data.report.reliability.advice.length > 0);
    });

    it('targa in formato non valido → 400 con messaggio', async () => {
      const r = await req('/reports/analyze', {
        method: 'POST',
        body: { plate: '1234' },
      });
      assert.strictEqual(r.status, 400);
      assert.match(r.data.error, /Targa non valida/i);
    });

    it('né targa né modello → 400', async () => {
      const r = await req('/reports/analyze', { method: 'POST', body: { km: 1000 } });
      assert.strictEqual(r.status, 400);
    });

    it('modello non presente nel database → 404', async () => {
      const r = await req('/reports/analyze', {
        method: 'POST',
        body: { make: 'XYZ', model: 'Q123' },
      });
      assert.strictEqual(r.status, 404);
    });

    it('richieste ripetute → risposta in cache', async () => {
      const body = { plate: 'AB123CD', km: 50000, requestedPrice: 9000 };
      const first = await req('/reports/analyze', { method: 'POST', body });
      const second = await req('/reports/analyze', { method: 'POST', body });
      assert.strictEqual(first.status, 200);
      assert.strictEqual(second.status, 200);
      assert.strictEqual(second.data.cached, true);
    });
  });

  describe('POST /reports/ask', () => {
    it('risponde a una domanda sul veicolo', async () => {
      const r = await req('/reports/ask', {
        method: 'POST',
        body: {
          question: 'Il motore è affidabile?',
          vehicle: { make: 'Mazda', model: 'CX-3', year: 2016 },
          analysis: { score: 7.9, verdict: 'BUY', summary: 'Affidabile.' },
        },
      });
      assert.strictEqual(r.status, 200);
      assert.ok(r.data.answer.length > 20);
    });

    it('payload non valido → 400', async () => {
      const r = await req('/reports/ask', { method: 'POST', body: { question: '?' } });
      assert.strictEqual(r.status, 400);
    });
  });
});
