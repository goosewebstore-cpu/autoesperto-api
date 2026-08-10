import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import type { Server } from 'node:http';
import type { RequestInit } from 'undici';
import { app } from '../src/app';

let BASE = process.env.TEST_API_URL || '';
let server: Server | undefined;

before(async () => {
  if (BASE) return;
  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      const addr = server?.address();
      const port = typeof addr === 'object' && addr ? addr.port : 0;
      BASE = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

after(async () => {
  if (server) await new Promise<void>((resolve) => server!.close(() => resolve()));
});

interface ReqResult {
  status: number;
  data: any;
}

function req(path: string, opts: { method?: string; body?: unknown } = {}): Promise<ReqResult> {
  const { method = 'GET', body } = opts;
  const init: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  };
  return fetch(`${BASE}${path}`, init).then(async (r) => ({
    status: r.status,
    data: await r.json().catch(() => null),
  }));
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
        body: { make: 'BMW', model: 'Serie 3', year: 2016, km: 120000, requestedPrice: 22000 },
      });
      assert.strictEqual(r.status, 200);
      assert.strictEqual(r.data.report.vehicle.dataSource, 'model');
      assert.strictEqual(r.data.report.vehicle.year, 2016);
      assert.strictEqual(r.data.report.price.inputYear, 2016);
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

    it('modello non nel database → report generico 200', async () => {
      const r = await req('/reports/analyze', {
        method: 'POST',
        body: { make: 'XYZ', model: 'Q123' },
      });
      assert.strictEqual(r.status, 200);
      assert.strictEqual(r.data.report.vehicle.make, 'XYZ');
      assert.strictEqual(r.data.report.vehicle.model, 'Q123');
      assert.strictEqual(r.data.report.vehicle.dataSource, 'model');
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

    it('payload non valida → 400', async () => {
      const r = await req('/reports/ask', { method: 'POST', body: { question: '?' } });
      assert.strictEqual(r.status, 400);
    });
  });

  describe('POST /reports/free-scan', () => {
    it('input manuale senza account (prima visita) → report completo gratuito, non salvato', async () => {
      const r = await req('/reports/free-scan', {
        method: 'POST',
        body: { make: 'BMW', model: 'Serie 3', year: 2016 },
      });
      assert.strictEqual(r.status, 200);
      assert.strictEqual(r.data.success, true);
      assert.strictEqual(r.data.recognized, true);
      assert.strictEqual(r.data.vehicle.make, 'BMW');
      assert.strictEqual(r.data.vehicle.model, 'Serie 3');
      assert.ok(r.data.report);
      assert.strictEqual(r.data.saved, false);
      assert.strictEqual(r.data.freeUsed, true);
    });

    it('input manuale senza account con freeUsed → report gated, solo analisi base con valore stimato', async () => {
      const r = await req('/reports/free-scan', {
        method: 'POST',
        body: { make: 'BMW', model: 'Serie 3', year: 2016, freeUsed: true },
      });
      assert.strictEqual(r.status, 200);
      assert.strictEqual(r.data.success, true);
      assert.strictEqual(r.data.recognized, true);
      assert.strictEqual(r.data.vehicle.make, 'BMW');
      assert.strictEqual(r.data.report, null);
      assert.strictEqual(r.data.saved, false);
      assert.strictEqual(r.data.needsUpgrade, true);
      assert.ok(r.data.value, 'la risposta gated include il valore stimato');
      assert.ok(r.data.value.estimated > 0, 'valore stimato positivo');
      assert.ok(r.data.value.min < r.data.value.estimated && r.data.value.estimated < r.data.value.max);
      assert.ok(['stima', 'market'].includes(r.data.value.source), `source valida, ottenuto ${r.data.value.source}`);
      assert.match(r.data.message, /sempre gratuita/i);
    });

    it('né foto né marca/modello → 400', async () => {
      const r = await req('/reports/free-scan', { method: 'POST', body: {} });
      assert.strictEqual(r.status, 400);
    });
  });
});