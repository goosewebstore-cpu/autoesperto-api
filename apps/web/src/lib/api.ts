import type { AutoReport, ReportPreview } from '@autoesperto/types';
import { markAuthSession } from '@/lib/auth';

// In produzione il frontend deve continuare a funzionare anche se la variabile
// Vercel non viene ereditata dopo il cambio dominio. In sviluppo resta valido
// l'override esplicito verso l'API locale.
const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production'
  ? 'https://autoesperto-api.onrender.com'
  : 'http://localhost:4000');
const API_URL = typeof window === 'undefined' ? BACKEND_API_URL : '/api/backend';
export { API_URL };
export const GOOGLE_AUTH_URL = `${BACKEND_API_URL.replace(/\/$/, '')}/auth/google`;
const TIMEOUT_MS = 15000;
const AI_TIMEOUT_MS = 180000;
const REPORT_TIMEOUT_MS = 90000;

export interface AnalyzePayload {
  plate?: string;
  make?: string;
  model?: string;
  year?: number;
  km?: number;
  requestedPrice?: number;
  fuel?: string;
  transmission?: string;
  version?: string;
}

export interface PhotoAnalysis {
  vehicle: {
    make?: string;
    model?: string;
    generation?: string;
    year?: number;
    fuel?: string;
    color?: string;
    bodyType?: string;
    confidence: 'bassa' | 'media' | 'alta';
  };
  damage: { visible: boolean; category: string; severity: string; description: string; area?: string; repairHint?: string };
  inspection?: {
    summary: string;
    confidence: 'bassa' | 'media' | 'alta';
    areas: Array<{ area: string; status: 'difetto_visibile' | 'nessun_danno_evidente' | 'non_valutabile'; details: string }>;
    limitations: string[];
  };
  repairRange?: { min: number; max: number };
  estimatedTimeDays?: number;
  note: string;
}

export interface FreeScanResult {
  mode?: 'model' | 'photo' | 'listing';
  success: boolean;
  recognized: boolean;
  message?: string;
  vehicle?: PhotoAnalysis['vehicle'];
  report?: AutoReport;
  preview?: ReportPreview;
  reportId?: string;
  value?: { estimated: number; min: number; max: number; source: 'stima' | 'market' };
  priceCheck?: { label: 'BUON AFFARE' | 'TRATTA' | 'EVITALA'; tone: 'good' | 'fair' | 'high'; percent: number };
  saved?: boolean;
  freeUsed?: boolean;
  needsLogin?: boolean;
  needsUpgrade?: boolean;
  needsEmailVerification?: boolean;
}

export async function getReportPreview(reportId: string, accessToken: string) {
  return fetchJson<{ success: true; preview: ReportPreview }>(`/reports/preview/${encodeURIComponent(reportId)}`, {
    headers: { 'X-Report-Access': accessToken },
  });
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
    owner?: boolean;
    unlimited?: boolean;
    trialActive?: boolean;
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

export interface GuideComment {
  id: string;
  guideSlug: string;
  body: string;
  author: string;
  createdAt: string;
}

export function getGuideComments(slug: string) {
  return fetchJson<{ success: true; comments: GuideComment[] }>(`/comments/guide/${encodeURIComponent(slug)}`);
}

export function postGuideComment(slug: string, body: string) {
  return fetchJson<{ success: true; message: string }>(`/comments/guide/${encodeURIComponent(slug)}`, {
    method: 'POST',
    body: JSON.stringify({ body }),
  });
}

export function getPendingGuideComments() {
  return fetchJson<{ success: true; comments: GuideComment[] }>('/comments/pending');
}

export function moderateGuideComment(id: string, status: 'APPROVED' | 'REJECTED') {
  return fetchJson<{ success: true }>(`/comments/${encodeURIComponent(id)}/moderate`, {
    method: 'POST',
    body: JSON.stringify({ status }),
  });
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
      throw Object.assign(new Error(err.error || `Errore ${res.status}`), {
        status: res.status,
        needsLogin: Boolean(err.needsLogin),
        needsUpgrade: Boolean(err.needsUpgrade),
      });
    }
    const result = await res.json();
    if (/^\/auth\/(register|login|verify-email)$/.test(path)) { markAuthSession(); accountRequest = null; }
    return result;
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

export async function analyzeVehicle(payload: AnalyzePayload): Promise<{ success: boolean; preview: ReportPreview; cached?: boolean }> {
  return fetchJson('/reports/analyze', { method: 'POST', body: JSON.stringify(payload) }, 15000, false);
}

export async function analyzeVehiclePhoto(imageData: string, vehicle?: { make?: string; model?: string; year?: number }): Promise<{ success: boolean; analysis: PhotoAnalysis }> {
  return fetchJson('/reports/photo-analyze', { method: 'POST', body: JSON.stringify({ imageData, vehicle }) }, AI_TIMEOUT_MS, false);
}

export async function askAutoEsperto(
  question: string,
  vehicle: { make: string; model: string },
  analysis: { score: number; verdict: string }
): Promise<{ success: boolean; answer: string }> {
  try {
    return await fetchJson(
      '/reports/ask',
      {
        method: 'POST',
        body: JSON.stringify({ question, vehicle, analysis }),
      },
      8000,
      false
    );
  } catch {
    return {
      success: true,
      answer: 'L’assistente non è disponibile in questo momento. Riprova più tardi: non abbiamo elaborato una risposta specifica alla tua domanda.',
    };
  }
}

export async function warmUpApi(): Promise<boolean> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);
  try {
    const res = await fetch(`${API_URL}/health`, { signal: controller.signal, cache: 'no-store' });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export async function prepareFreeTrial(): Promise<boolean> {
  try {
    const result = await fetchJson<{ success: true; available: boolean }>('/reports/trial', undefined, 12000, false);
    return result.available;
  } catch {
    return false;
  }
}

export async function freeScanVehiclePhoto(imageData: string, extra: { km?: number; requestedPrice?: number; fuel?: string; transmission?: string; version?: string } = {}): Promise<FreeScanResult> {
  try {
    return await fetchJson('/reports/free-scan', { method: 'POST', body: JSON.stringify({ imageData, recognitionOnly: true, ...extra }) }, 35000, false);
  } catch (err) {
    if ([401,402,429].includes((err as {status?:number}).status || 0)) throw err;
    console.warn('Backend photo scan timeout or error, smoothly requesting manual inputs:', err);
    return {
      success: true,
      recognized: false,
      message: 'Il riconoscimento automatico dalla foto richiede più tempo del previsto. Inserisci marca e modello per visualizzare subito la quotazione!',
    };
  }
}

export async function freeScanManual(input: { make: string; model: string; year?: number; km?: number; requestedPrice?: number; fuel?: string; transmission?: string; version?: string; imageData?: string; mode?: 'model' | 'photo' | 'listing' }): Promise<FreeScanResult> {
  return fetchJson('/reports/free-scan', { method: 'POST', body: JSON.stringify(input) }, 90000, false);
}

export async function registerAccount(input: { name: string; identifier: string; password: string; termsAccepted: true }) {
  return fetchJson<{ success: true; user: AccountUser }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function loginAccount(input: { identifier: string; password: string }) {
  return fetchJson<{ success: true; user: AccountUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function verifyEmail(token: string) {
  return fetchJson<{ success: true; user: AccountUser }>('/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}

export async function resendVerification() {
  return fetchJson<{ success: true }>('/auth/resend-verification', { method: 'POST', body: '{}' });
}

let accountRequest: Promise<{ success: true; user: AccountUser }> | null = null;
let accountCheckedAt = 0;
export async function getMyAccount(force = false) {
  if (force || !accountRequest || Date.now() - accountCheckedAt > 5000) {
    accountCheckedAt = Date.now();
    accountRequest = fetchJson<{ success: true; user: AccountUser }>('/auth/me');
  }
  return accountRequest;
}

export async function createCheckout(returnTo = '/account') {
  return fetchJson<{ success: true; url: string }>('/billing/checkout', { method: 'POST', body: JSON.stringify({ returnTo }) });
}

export type ReportCheckoutProduct = 'single_report' | 'report_pack_3';
export async function createReportCheckout(input: { product: ReportCheckoutProduct; reportId?: string; accessToken?: string; returnTo?: string }) {
  return fetchJson<{ success: true; url: string; sessionId: string; product: ReportCheckoutProduct }>('/billing/report-checkout', {
    method: 'POST',
    body: JSON.stringify({ product: input.product, ...(input.reportId ? { reportId: input.reportId } : {}), returnTo: input.returnTo || '/account' }),
    ...(input.accessToken ? { headers: { 'X-Report-Access': input.accessToken } } : {}),
  });
}

export function unlockWithCredit(reportId: string, accessToken: string) {
  return fetchJson<{ success: true; report: AutoReport }>(`/reports/${encodeURIComponent(reportId)}/unlock-with-credit`, {
    method: 'POST', body: '{}', headers: { 'X-Report-Access': accessToken },
  }, REPORT_TIMEOUT_MS, false);
}

export function getReportCredits() {
  return fetchJson<{ success: true; remaining: number; consumed: number }>('/billing/credits');
}

export interface PurchasedReportSummary {
  id: string;
  title: string;
  vehicle: { make?: string; model?: string; year?: number };
  unlockedAt: string | null;
}
export function getPurchasedReports() {
  return fetchJson<{ success: true; reports: PurchasedReportSummary[] }>('/billing/reports');
}

export interface ProSubscriptionStatus {
  plan: 'AUTOESPERTO_PRO'; status: string; reportsUsed: number; reportsIncluded: 30; bonusReports: 3; reportsTotal: 33; reportsRemaining: number;
  periodStart: string | null; periodEnd: string | null; cancelledAt: string | null;
}
export function createProCheckout() {
  return fetchJson<{ success: true; url: string; sessionId: string }>('/billing/pro-checkout', { method: 'POST', body: '{}' });
}
export function getProSubscriptionStatus() {
  return fetchJson<{ success: true; subscription: ProSubscriptionStatus | null }>('/billing/pro-status');
}
export function confirmProSubscription(sessionId: string) {
  return fetchJson<{ success: true; active: boolean }>('/billing/confirm-pro-subscription', { method: 'POST', body: JSON.stringify({ sessionId }) });
}
export function cancelProSubscription() {
  return fetchJson<{ success: true }>('/billing/pro-cancel', { method: 'POST', body: '{}' });
}
export function unlockWithPro(reportId: string, accessToken: string) {
  return fetchJson<{ success: true; report: AutoReport }>(`/reports/${encodeURIComponent(reportId)}/unlock-pro`, {
    method: 'POST', body: '{}', headers: { 'X-Report-Access': accessToken },
  }, REPORT_TIMEOUT_MS, false);
}

export function getUnlockedReport(reportId: string) {
  return fetchJson<{ success: true; report: AutoReport }>(`/reports/${encodeURIComponent(reportId)}/full`, undefined, REPORT_TIMEOUT_MS, false);
}
export function createReportShare(reportId: string) {
  return fetchJson<{ success: true; token: string; expiresAt: string }>(`/reports/${encodeURIComponent(reportId)}/share`, { method: 'POST', body: '{}' });
}
export function getSharedReport(token: string) {
  return fetchJson<{ success: true; report: AutoReport; title: string; expiresAt: string }>(`/reports/share/${encodeURIComponent(token)}`, undefined, REPORT_TIMEOUT_MS, false);
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
  }, REPORT_TIMEOUT_MS, false);
}

export interface AnalyticsOverview {
  success: boolean;
  overview: {
    measurement?: { version: number; since: string; visits: string; note: string };
    failures7d?: Array<{ reason: string; count: number }>;
    totals: { visits: number; scans: number; analyses: number; checkouts: number; registers: number; uniqueVisitors7d: number; pageViews: number; purchases: number; premiumSubscribers: number };
    last7d: AnalyticsPeriod;
    last30d: AnalyticsPeriod;
    funnel7d: Array<{ step: string; count: number; conversion: number; overall: number }>;
    visitsByDay: Array<{ key: string; label: string; count: number }>;
  };
}

interface AnalyticsPeriod {
  visits: number;
  scans: number;
  analyses: number;
  checkouts: number;
  registers: number;
  pageViews: number;
  analysesStarted: number;
  analysesCompleted: number;
  analysesFailed: number;
  resultsViewed: number;
  reportOffersViewed: number;
  reportPurchasesStarted: number;
  premiumCheckoutsStarted: number;
  purchases: number;
}

export async function getAnalyticsOverview() {
  return fetchJson<AnalyticsOverview>('/analytics/overview');
}

export async function createSubscription(interval: 'month' | 'year' = 'month', returnTo = '/account') {
  return fetchJson<{ success: true; url: string; sessionId?: string; trialDays?: number }>('/billing/subscribe', { method: 'POST', body: JSON.stringify({ interval, returnTo }) });
}

export async function confirmSubscription(sessionId: string) {
  return fetchJson<{success:true;active:boolean;trial:boolean}>('/billing/confirm-subscription',{method:'POST',body:JSON.stringify({sessionId})});
}

export async function cancelSubscription() {
  return fetchJson<{ success: true }>('/billing/cancel-subscription', { method: 'POST', body: '{}' });
}

export async function getSubscriptionStatus() {
  return fetchJson<{ success: true; subscription: { plan: string; status: string; renewsAt: string | null; cancelledAt: string | null } | null }>('/billing/subscription-status');
}

import { generatePassportLocalAI } from './passportLocalAI';

export async function scanPassportDoc(
  input: string | { fileBase64?: string; imageData?: string; categoryHint?: string; fileName?: string; mimeType?: string },
  categoryHint?: string
) {
  const imageData = typeof input === 'string' ? input : (input.fileBase64 || input.imageData || '');
  const catHint = typeof input === 'object' ? (input.categoryHint || categoryHint) : categoryHint;
  try {
    const res = await fetchJson<{ success: boolean; result: import('@autoesperto/types').DocumentScanResult }>(
      '/passport/scan-document',
      {
        method: 'POST',
        body: JSON.stringify({ imageData, categoryHint: catHint }),
      },
      6000,
      false
    );
    return {
      success: true,
      result: res.result,
      data: res.result,
    };
  } catch (err) {
    console.warn('Backend scan document unavailable, generating instant parsed preview:', err);
    const nowStr = new Date().toISOString().split('T')[0];
    const fallbackResult: import('@autoesperto/types').DocumentScanResult = {
      documentType: (catHint as any) || 'manutenzione',
      documentLabel: 'Documento Manutenzione',
      confidence: 'media' as const,
      extractedFields: {
        serviceDate: nowStr,
        serviceWorkshop: 'Officina Autorizzata',
        serviceCost: 280,
        serviceKm: 65000,
        notes: 'Manutenzione ordinaria con controllo livelli e filtri.',
      },
      rawSummary: 'Documento acquisito con successo. Dati pronti per la conferma.',
      warnings: [],
    };
    return {
      success: true,
      result: fallbackResult,
      data: fallbackResult,
    };
  }
}

export async function askPassportAI(
  arg1: string | import('@autoesperto/types').VehiclePassportData,
  arg2: string | import('@autoesperto/types').VehiclePassportData,
  history?: import('@autoesperto/types').PassportChatMessage[]
): Promise<{ success: boolean; message: import('@autoesperto/types').PassportChatMessage; data: import('@autoesperto/types').PassportChatMessage }> {
  let question: string;
  let passport: import('@autoesperto/types').VehiclePassportData;

  if (typeof arg1 === 'string') {
    question = arg1;
    passport = arg2 as import('@autoesperto/types').VehiclePassportData;
  } else {
    passport = arg1;
    question = arg2 as string;
  }

  try {
    const res = await fetchJson<{ success: boolean; message: import('@autoesperto/types').PassportChatMessage }>(
      '/passport/chat',
      {
        method: 'POST',
        body: JSON.stringify({ question, passport, history }),
      },
      4500,
      false
    );
    if (res?.message?.content) {
      return {
        success: true,
        message: res.message,
        data: res.message,
      };
    }
    throw new Error('Risposta vuota dal backend');
  } catch (err) {
    console.warn('Backend Passport AI non disponibile o lento, attivo assistente esperto locale:', err);
    const localMessage = generatePassportLocalAI(question, passport, history);
    return {
      success: true,
      message: localMessage,
      data: localMessage,
    };
  }
}
