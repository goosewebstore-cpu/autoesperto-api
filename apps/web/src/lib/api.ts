import type { AutoReport } from '@autoesperto/types';
import { getAuthToken } from '@/lib/auth';

// In produzione il frontend deve continuare a funzionare anche se la variabile
// Vercel non viene ereditata dopo il cambio dominio. In sviluppo resta valido
// l'override esplicito verso l'API locale.
const API_URL = process.env.NEXT_PUBLIC_API_URL || (
  process.env.NODE_ENV === 'production'
    ? 'https://autoesperto-api.onrender.com'
    : 'http://localhost:4000'
);
export { API_URL };
const TIMEOUT_MS = 30000;
const AI_TIMEOUT_MS = 120000;
const REPORT_TIMEOUT_MS = 90000;

export interface AnalyzePayload {
  plate?: string;
  make?: string;
  model?: string;
  year?: number;
  km?: number;
  requestedPrice?: number;
}

export interface PhotoAnalysis {
  vehicle: { make?: string; model?: string; generation?: string; year?: number; color?: string; bodyType?: string; confidence: 'bassa' | 'media' | 'alta' };
  damage: { visible: boolean; category: string; severity: string; description: string };
  repairRange?: { min: number; max: number };
  note: string;
}

export interface FreeScanResult {
  success: boolean;
  recognized: boolean;
  message?: string;
  vehicle?: PhotoAnalysis['vehicle'];
  report?: AutoReport;
  saved?: boolean;
  needsLogin?: boolean;
  needsUpgrade?: boolean;
  needsEmailVerification?: boolean;
}

export interface AccountUser {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  createdAt: string;
  subscription: {
    plan: string;
    status: string;
    renewsAt: string | null;
    cancelledAt: string | null;
  } | null;
  analysis: { id: string; createdAt: string } | null;
  entitlement: {
    included: number;
    used: number;
    remaining: number;
    paid: boolean;
    emailVerified: boolean;
    freeUsed: boolean;
    trialAvailable: boolean;
    purchase: { id: string; paidAt: string; amountCents: number; currency: string } | null;
  };
}

export interface StoredAnalysis {
  id: string;
  title: string;
  vehicle: PhotoAnalysis['vehicle'];
  photoAnalysis: PhotoAnalysis;
  report: AutoReport;
  sourceImageStored: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function fetchJson<T>(path: string, options?: RequestInit, timeoutMs: number = TIMEOUT_MS, retry = false): Promise<T> {
  try {
    return await doFetch<T>(path, options, timeoutMs);
  } catch (err) {
    if (retry && err instanceof Error && err.name === 'AbortError') {
      await new Promise((r) => setTimeout(r, 800));
      return doFetch<T>(path, options, timeoutMs);
    }
    throw err;
  }
}

async function doFetch<T>(path: string, options?: RequestInit, timeoutMs: number = TIMEOUT_MS): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const token = getAuthToken();
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options?.headers as Record<string, string>),
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `Errore ${res.status}` }));
      throw new Error(err.error || `Errore ${res.status}`);
    }
    return res.json();
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      const abortError = new Error('Il servizio sta impiegando troppo tempo. Riprova tra qualche istante.');
      abortError.name = 'AbortError';
      throw abortError;
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

export async function analyzeVehicle(payload: AnalyzePayload): Promise<{ success: boolean; report: AutoReport; cached?: boolean }> {
  return fetchJson('/reports/analyze', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, REPORT_TIMEOUT_MS, true);
}

export async function analyzeVehiclePhoto(imageData: string, vehicle?: { make?: string; model?: string; year?: number }): Promise<{ success: boolean; analysis: PhotoAnalysis }> {
  return fetchJson('/reports/photo-analyze', { method: 'POST', body: JSON.stringify({ imageData, vehicle }) }, AI_TIMEOUT_MS, true);
}

export async function freeScanVehiclePhoto(imageData: string): Promise<FreeScanResult> {
  return fetchJson('/reports/free-scan', { method: 'POST', body: JSON.stringify({ imageData }) }, AI_TIMEOUT_MS, true);
}

export async function freeScanManual(input: { make: string; model: string; year?: number }): Promise<FreeScanResult> {
  return fetchJson('/reports/free-scan', { method: 'POST', body: JSON.stringify(input) }, REPORT_TIMEOUT_MS, true);
}

export async function registerAccount(input: { name: string; identifier: string; password: string; termsAccepted: true }) {
  return fetchJson<{ success: true; token: string; user: AccountUser }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function loginAccount(input: { identifier: string; password: string }) {
  return fetchJson<{ success: true; token: string; user: AccountUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function verifyEmail(token: string) {
  return fetchJson<{ success: true; token: string; user: AccountUser }>('/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}

export async function resendVerification() {
  return fetchJson<{ success: true }>('/auth/resend-verification', { method: 'POST', body: '{}' });
}

export async function getMyAccount() {
  return fetchJson<{ success: true; user: AccountUser }>('/auth/me');
}

export async function createCheckout() {
  return fetchJson<{ success: true; url: string }>('/billing/checkout', { method: 'POST', body: '{}' });
}

export async function confirmCheckout(sessionId: string) {
  return fetchJson<{ success: true; paid: boolean; amountCents: number; currency: string }>('/billing/confirm', {
    method: 'POST',
    body: JSON.stringify({ sessionId }),
  });
}

export async function getMyAnalysis() {
  return fetchJson<{ success: true; analysis: StoredAnalysis | null; analyses: StoredAnalysis[] }>('/analyses/me');
}

export async function createPaidAnalysis(imageData: string) {
  return fetchJson<{ success: true; analysis: StoredAnalysis }>('/analyses', {
    method: 'POST',
    body: JSON.stringify({ imageData, immediateExecutionAccepted: true }),
  });
}

export interface AnalyticsOverview {
  success: boolean;
  overview: {
    totals: { visits: number; scans: number; analyses: number; checkouts: number; registers: number; uniqueVisitors7d: number };
    last7d: { visits: number; scans: number; analyses: number; checkouts: number; registers: number };
    last30d: { visits: number; scans: number; analyses: number; checkouts: number; registers: number };
    visitsByDay: Array<{ key: string; label: string; count: number }>;
  };
}

export async function getAnalyticsOverview() {
  return fetchJson<AnalyticsOverview>('/analytics/overview');
}

export async function createSubscription(interval: 'month' | 'year' = 'month') {
  return fetchJson<{ success: true; url: string }>('/billing/subscribe', { method: 'POST', body: JSON.stringify({ interval }) });
}

export async function cancelSubscription() {
  return fetchJson<{ success: true }>('/billing/cancel-subscription', { method: 'POST', body: '{}' });
}

export async function getSubscriptionStatus() {
  return fetchJson<{ success: true; subscription: { plan: string; status: string; renewsAt: string | null; cancelledAt: string | null } | null }>('/billing/subscription-status');
}
