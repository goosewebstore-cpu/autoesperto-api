import { API_URL } from '@/lib/api';
import { hasCategory } from '@/lib/consent';
import { fireAdsAnalysisCompleted } from '@/components/AdsTracker';

export type AnalyticsEvent =
  | 'page_view'
  | 'page_leave'
  | 'visit'
  | 'analysis_failed'
  | 'photo_recognition_started'
  | 'photo_recognition_completed'
  | 'photo_recognition_failed'
  | 'search_car'
  | 'photo_upload'
  | 'car_selected'
  | 'car_image_uploaded'
  | 'analysis_started'
  | 'analysis_completed'
  | 'result_viewed'
  | 'premium_viewed'
  | 'premium_cta_clicked'
  | 'premium_checkout_started'
  | 'premium_subscribed'
  | 'report_offer_viewed'
  | 'preview_viewed'
  | 'unlock_clicked'
  | 'report_purchase_started'
  | 'checkout_started'
  | 'payment_completed'
  | 'report_unlocked'
  | 'credits_purchased'
  | 'subscription_started'
  | 'subscription_cancelled'
  | 'subscription_payment_failed'
  | 'purchase_completed'
  | 'pdf_requested'
  | 'share_clicked'
  | 'sell_ad_generated'
  | 'ad_impression'
  | 'compare_started'
  | 'guide_read'
  | 'account_created'
  | 'tool_click'
  | 'sell_cta'
  | 'advisor_message_sent'
  | 'natural_language_search_executed'
  | 'homepage_view'
  | 'valuation_viewed'
  | 'passport_created'
  | 'passport_shared'
  | 'passport_transferred'
  | 'document_uploaded'
  | 'document_verified'
  | 'vehicle_saved'
  | 'comparison_started'
  | 'auto_finder_started'
  | 'auto_finder_completed'
  | 'finder_started'
  | 'finder_completed'
  | 'preference_changed'
  | 'car_saved'
  | 'buy_score_viewed'
  | 'negotiator_message_copied'
  | 'listing_analyzed'
  | 'health_scan_completed'
  | 'health_score_applied';

export function trackEvent(event: AnalyticsEvent, meta?: Record<string, unknown>, eventId?: string): void {
  if (typeof window === 'undefined') return;

  if (event === 'analysis_completed') fireAdsAnalysisCompleted();
  if (!hasCategory('analytics')) return;

  try {
  const payload = {
    type: event,
    eventId: eventId || crypto.randomUUID(),
    path: window.location.pathname,
    meta: JSON.stringify({ ...meta, sessionId: getAnalyticsSessionId(), measurementVersion: 2 }),
    visitorId: getVisitorId(),
  };

  // Fire and forget - don't block UI
  fetch(`${API_URL}/analytics/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});

  // Also log in dev
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', event, meta || '');
  }
  } catch { /* Measurements must never interrupt an analysis. */ }
}

let volatileVisitor = '';
let volatileSession = '';

export function getVisitorId(): string {
  if (typeof localStorage === 'undefined') return 'ssr';
  try {
  let id = localStorage.getItem('ae-visitor-id') || localStorage.getItem('ae_visitor_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('ae-visitor-id', id);
  }
  return id;
  } catch {
    return volatileVisitor ||= crypto.randomUUID();
  }
}

export function getAnalyticsSessionId(): string {
  try {
    const raw = sessionStorage.getItem('ae-analytics-session');
    const session = raw ? JSON.parse(raw) : null;
    const id = session?.id && Date.now() - session.lastSeen < 30 * 60 * 1000 ? session.id : crypto.randomUUID();
    sessionStorage.setItem('ae-analytics-session', JSON.stringify({ id, lastSeen: Date.now() }));
    return id;
  } catch {
    return volatileSession ||= crypto.randomUUID();
  }
}
