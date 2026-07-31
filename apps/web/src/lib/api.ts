import type { AutoReport } from '@autoesperto/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const TIMEOUT_MS = 30000;

export interface AnalyzePayload {
  plate?: string;
  make?: string;
  model?: string;
  km?: number;
  requestedPrice?: number;
}

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
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
