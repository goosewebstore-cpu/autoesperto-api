import type { AutoReport } from '@autoesperto/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options?.headers as Record<string, string>),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Errore di rete' }));
    throw new Error(err.error || `Errore ${res.status}`);
  }
  return res.json();
}

export async function analyzeVehicle(payload: {
  plate?: string;
  vin?: string;
  km?: number;
  requestedPrice?: number;
}): Promise<{ success: boolean; report: AutoReport }> {
  return fetchJson('/reports/analyze', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function askAutoEsperto(
  question: string,
  vehicle: AutoReport['vehicle'],
  analysis: AutoReport['reliability']
): Promise<{ success: boolean; answer: string }> {
  return fetchJson('/reports/ask', {
    method: 'POST',
    body: JSON.stringify({ question, vehicle, analysis }),
  });
}

export async function getPlans() {
  return fetchJson('/subscriptions/plans');
}
