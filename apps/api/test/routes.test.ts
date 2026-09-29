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
    it('input manuale senza account → report completo gratuito, non salvato', async () => {
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
      assert.ok(r.data.report.reliability.score > 0);
      assert.strictEqual(r.data.saved, false);
      assert.strictEqual(r.data.freeUsed, true);
    });

    it('input manuale senza account con freeUsed → report completo comunque (tutto gratis)', async () => {
      const r = await req('/reports/free-scan', {
        method: 'POST',
        body: { make: 'BMW', model: 'Serie 3', year: 2016, freeUsed: true },
      });
      assert.strictEqual(r.status, 200);
      assert.strictEqual(r.data.success, true);
      assert.strictEqual(r.data.recognized, true);
      assert.strictEqual(r.data.vehicle.make, 'BMW');
      assert.ok(r.data.report, 'il report è completo e sempre gratuito');
      assert.ok(r.data.report.reliability.score > 0);
      assert.strictEqual(r.data.saved, false);
      assert.strictEqual(r.data.needsUpgrade, undefined);
    });

    it('né foto né marca/modello → 400', async () => {
      const r = await req('/reports/free-scan', { method: 'POST', body: {} });
      assert.strictEqual(r.status, 400);
    });

    it('free-scan veicolo elettrico (Tesla/500e) → consumo in kWh/100 km, trasmissione Automatico ed esenzione bollo/manutenzione EV', async () => {
      const r = await req('/reports/free-scan', {
        method: 'POST',
        body: { make: 'Tesla', model: 'Model 3', year: 2022, fuel: 'Elettrica' },
      });
      assert.strictEqual(r.status, 200);
      assert.strictEqual(r.data.success, true);
      assert.strictEqual(r.data.report.vehicle.transmission, 'Automatico');
      assert.strictEqual(r.data.report.reliability.consumption.fuelType, 'kWh/100 km');
      assert.strictEqual(r.data.report.reliability.taxAnnual, 0);
      assert.ok(!r.data.report.reliability.engine.toLowerCase().includes('olio motore'));
      assert.ok(r.data.report.reliability.futureCosts.annualMaintenance <= 160);
    });

    it('getRepairMultiplier applica moltiplicatori corretti per Tesla ed esotiche', async () => {
      const { getRepairMultiplier } = await import('../src/services/ai.js');
      assert.strictEqual(getRepairMultiplier('Tesla', 'Model 3', 'Elettrica'), 2.2);
      assert.strictEqual(getRepairMultiplier('Porsche', '911', 'Benzina'), 2.5);
      assert.strictEqual(getRepairMultiplier('BMW', 'Serie 3', 'Diesel'), 1.6);
      assert.strictEqual(getRepairMultiplier('Fiat', 'Panda', 'Benzina'), 1.0);
    });
  });

  describe('passport share security', () => {
    const shareCode = `AE-TEST${Date.now().toString(36).toUpperCase()}`;
    const safePassport = {
      c: shareCode,
      v: { mk: 'Fiat', md: 'Panda', pl: 'AB123CD', internalNote: 'non deve uscire' },
      km: 42000,
      hs: 91,
      secret: 'non deve uscire',
    };

    it('rifiuta payload senza i campi obbligatori', async () => {
      const r = await req('/passport/share', { method: 'POST', body: { c: shareCode } });
      assert.strictEqual(r.status, 400);
    });

    it('conserva solo campi consentiti e imposta no-store', async () => {
      const saved = await req('/passport/share', { method: 'POST', body: safePassport });
      assert.strictEqual(saved.status, 200);

      const shown = await fetch(`${BASE}/passport/public/${shareCode}`);
      const payload = await shown.json() as any;
      assert.strictEqual(shown.status, 200);
      assert.strictEqual(shown.headers.get('cache-control'), 'no-store');
      assert.strictEqual(payload.payload.km, 42000);
      assert.strictEqual(payload.payload.v.mk, 'Fiat');
      assert.strictEqual(payload.payload.v.pl, undefined);
      assert.strictEqual(payload.payload.v.internalNote, undefined);
      assert.strictEqual(payload.payload.secret, undefined);
    });

    it('impedisce di sovrascrivere una scheda pubblica già condivisa', async () => {
      const r = await req('/passport/share', {
        method: 'POST',
        body: { ...safePassport, km: 43000 },
      });
      assert.strictEqual(r.status, 409);
    });

    it('non salva km, punteggio, valore e foto esclusi dalla condivisione', async () => {
      const code = `AE-HIDDEN${Date.now().toString(36).toUpperCase()}`;
      const saved = await req('/passport/share', { method: 'POST', body: {
        ...safePassport, c: code, v: { mk: 'Fiat', md: 'Panda', y: 2020, img: 'https://example.com/photo.jpg' },
        sc: { showMileage: false, showHealthScore: false, showValuation: false, showPhotos: false, showVehicleInfo: false, showTimeline: false },
        ev: 10000, ph: [{ u: 'https://example.com/photo.jpg' }], tm: [{ d: '2026-01-01', k: 42000, t: 'ALTRO', ti: 'Evento' }],
      } });
      assert.strictEqual(saved.status, 200);
      const shown = await fetch(`${BASE}/passport/public/${code}`);
      const body = await shown.json() as any;
      assert.strictEqual(body.payload.km, undefined);
      assert.strictEqual(body.payload.hs, undefined);
      assert.strictEqual(body.payload.ev, undefined);
      assert.strictEqual(body.payload.v.y, undefined);
      assert.strictEqual(body.payload.v.img, undefined);
      assert.strictEqual(body.payload.ph, undefined);
      assert.strictEqual(body.payload.tm, undefined);
    });
  });
});
