import { describe, it, before } from 'node:test';
import assert from 'node:assert';

const BASE = 'http://localhost:4000';
let token = '';
let dupEmail = '';

function req(path: string, opts: any = {}) {
  const headers: any = { 'Content-Type': 'application/json' };
  if (opts.token !== false && token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return fetch(`${BASE}${path}`, {
    method: opts.method || 'GET',
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  }).then(async (r) => ({ status: r.status, data: await r.json() }));
}

describe('AutoEsperto API', () => {
  it('GET /health', async () => {
    const r = await req('/health');
    assert.strictEqual(r.status, 200);
    assert.ok(r.data.ok);
    assert.strictEqual(r.data.service, 'autoesperto-api');
  });

  it('POST /auth/register — creazione utente', async () => {
    const r = await req('/auth/register', {
      method: 'POST',
      body: { email: `test-${Date.now()}@autoesperto.it`, password: 'test123456', name: 'Tester' },
    });
    assert.strictEqual(r.status, 200);
    assert.ok(r.data.success);
    assert.ok(r.data.token);
    token = r.data.token;
  });

  it('POST /auth/register — 409 su email duplicata', async () => {
    dupEmail = `dup-${Date.now()}@autoesperto.it`;
    const r1 = await req('/auth/register', {
      method: 'POST', body: { email: dupEmail, password: 'test123456' },
    });
    assert.strictEqual(r1.status, 200);
    const r2 = await req('/auth/register', {
      method: 'POST', body: { email: dupEmail, password: 'test123456' },
    });
    assert.strictEqual(r2.status, 409);
  });

  it('POST /auth/login — login valido', async () => {
    const r = await req('/auth/login', {
      method: 'POST', body: { email: dupEmail, password: 'test123456' },
    });
    assert.strictEqual(r.status, 200);
    assert.ok(r.data.success);
    assert.ok(r.data.token);
    token = r.data.token;
  });

  it('POST /auth/login — 401 su password errata', async () => {
    const r = await req('/auth/login', {
      method: 'POST', body: { email: dupEmail, password: 'wrongpass' },
    });
    assert.strictEqual(r.status, 401);
  });

  it('POST /auth/login — 400 su email mancante', async () => {
    const r = await req('/auth/login', {
      method: 'POST', body: { password: 'test123456' },
    });
    assert.strictEqual(r.status, 400);
  });

  describe('Flusso autenticato', () => {
    before(async () => {
      const r = await req('/auth/register', {
        method: 'POST',
        body: { email: `flow-${Date.now()}@autoesperto.it`, password: 'test123456' },
      });
      token = r.data.token;
    });

    it('GET /user/me', async () => {
      const r = await req('/user/me');
      assert.strictEqual(r.status, 200);
      assert.ok(r.data.user.email);
      assert.ok(r.data.user.plan);
    });

    it('GET /vehicles/lookup/FE120KD', async () => {
      const r = await req('/vehicles/lookup/FE120KD');
      assert.strictEqual(r.status, 200);
      assert.ok(r.data.vehicle?.make);
    });

    it('POST /reports/analyze', async () => {
      const r = await req('/reports/analyze', {
        method: 'POST',
        body: { plate: 'FE120KD', km: 85000, requestedPrice: 12000 },
      });
      assert.strictEqual(r.status, 200);
      assert.ok(r.data.report.vehicle);
      assert.ok(r.data.report.reliability.score > 0);
      assert.ok(r.data.report.price.estimatedValue > 0);
      assert.ok(Array.isArray(r.data.report.alternatives));
    });

    it('GET /user/reports', async () => {
      const r = await req('/user/reports');
      assert.strictEqual(r.status, 200);
      assert.ok(Array.isArray(r.data.reports));
    });

    it('POST /reports/ask — AI chat', async () => {
      const report = await req('/reports/analyze', {
        method: 'POST',
        body: { plate: 'FE120KD', km: 85000, requestedPrice: 12000 },
      });
      const r = await req('/reports/ask', {
        method: 'POST',
        body: {
          question: 'Conviene comprare questa auto?',
          vehicle: report.data.report.vehicle,
          analysis: report.data.report.reliability,
        },
      });
      assert.strictEqual(r.status, 200);
      assert.ok(r.data.answer);
    });

    it('POST /dealer/setup', async () => {
      const r = await req('/dealer/setup', {
        method: 'POST',
        body: { companyName: 'Auto Test Srl', vatNumber: 'IT12345678901', phone: '+39 333 1234567', city: 'Milano' },
      });
      assert.strictEqual(r.status, 200);
      assert.ok(r.data.dealer);
    });

    it('POST /dealer — crea listing', async () => {
      const r = await req('/dealer', {
        method: 'POST',
        body: { title: 'Fiat 500 2018', price: 10500, km: 65000, year: 2018, fuel: 'Benzina' },
      });
      assert.strictEqual(r.status, 200);
      assert.ok(r.data.listing);
    });

    it('GET /dealer — lista listing', async () => {
      const r = await req('/dealer');
      assert.strictEqual(r.status, 200);
      assert.ok(Array.isArray(r.data.listings));
    });

    it('GET /subscriptions/plans', async () => {
      const r = await req('/subscriptions/plans');
      assert.strictEqual(r.status, 200);
      assert.ok(Array.isArray(r.data.plans));
      assert.ok(Array.isArray(r.data.dealerPlans));
    });

    it('POST /subscriptions/checkout — piano free', async () => {
      const r = await req('/subscriptions/checkout', {
        method: 'POST', body: { planId: 'free' },
      });
      assert.strictEqual(r.status, 200);
      assert.ok(r.data.success);
    });
  });

  describe('Senza autenticazione', () => {
    it('GET /user/me → 401', async () => {
      const r = await req('/user/me', { token: false });
      assert.strictEqual(r.status, 401);
    });

    it('POST /dealer → 401', async () => {
      const r = await req('/dealer', {
        method: 'POST', token: false,
        body: { title: 'Test', price: 1000, km: 50000, year: 2020, fuel: 'Diesel' },
      });
      assert.strictEqual(r.status, 401);
    });
  });
});
