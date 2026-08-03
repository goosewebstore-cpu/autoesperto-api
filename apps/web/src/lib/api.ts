import type { AutoReport } from '@autoesperto/types';
import { getAuthToken } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const TIMEOUT_MS = 30000;
const AI_TIMEOUT_MS = 120000;

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
  price?: {
    estimatedValue: number;
    min: number;
    max: number;
    market?: { priceAvg?: number; priceMin?: number; priceMax?: number; total?: number };
  };
}

export interface AccountUser {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  createdAt: string;
  analysis: { id: string; createdAt: string } | null;
  entitlement: {
    included: number;
    used: number;
    remaining: number;
    paid: boolean;
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

export async function fetchJson<T>(path: string, options?: RequestInit, timeoutMs: number = TIMEOUT_MS): Promise<T> {
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
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error('Il servizio sta impiegando troppo tempo. Riprova tra qualche istante.');
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
  });
}

export async function analyzeVehiclePhoto(imageData: string, vehicle?: { make?: string; model?: string; year?: number }): Promise<{ success: boolean; analysis: PhotoAnalysis }> {
  return fetchJson('/reports/photo-analyze', { method: 'POST', body: JSON.stringify({ imageData, vehicle }) }, AI_TIMEOUT_MS);
}

export async function freeScanVehiclePhoto(imageData: string): Promise<FreeScanResult> {
  return fetchJson('/reports/free-scan', { method: 'POST', body: JSON.stringify({ imageData }) }, AI_TIMEOUT_MS);
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

export async function getMyAccount() {
  return fetchJson<{ success: true; user: AccountUser }>('/auth/me');
}

export async function createCheckout() {
  return fetchJson<{ success: true; url: string }>('/billing/checkout', { method: 'POST', body: '{}' });
}

export async function confirmCheckout(sessionId: string) {
  return fetchJson<{ success: true; paid: boolean }>('/billing/confirm', {
    method: 'POST',
    body: JSON.stringify({ sessionId }),
  });
}

export async function getMyAnalysis() {
  return fetchJson<{ success: true; analysis: StoredAnalysis | null }>('/analyses/me');
}

export async function createPaidAnalysis(imageData: string) {
  return fetchJson<{ success: true; analysis: StoredAnalysis }>('/analyses', {
    method: 'POST',
    body: JSON.stringify({ imageData, immediateExecutionAccepted: true }),
  });
}
