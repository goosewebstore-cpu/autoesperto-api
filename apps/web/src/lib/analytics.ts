import { API_URL } from '@/lib/api';

export type AnalyticsEvent =
  | 'page_view'
  | 'search_car'
  | 'photo_upload'
  | 'analysis_started'
  | 'analysis_completed'
  | 'result_viewed'
  | 'premium_cta_clicked'
  | 'premium_subscribed'
  | 'pdf_requested'
  | 'share_clicked'
  | 'sell_ad_generated'
  | 'ad_impression'
  | 'compare_started'
  | 'guide_read'
  | 'account_created';

export function trackEvent(event: AnalyticsEvent, meta?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;

  const payload = {
    type: event,
    path: window.location.pathname,
    meta: meta ? JSON.stringify(meta) : undefined,
    visitorId: getVisitorId(),
  };

  // Fire and forget - don't block UI
  fetch(`${API_URL}/analytics/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {});

  // Also log in dev
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', event, meta || '');
  }
}

function getVisitorId(): string {
  if (typeof localStorage === 'undefined') return 'ssr';
  let id = localStorage.getItem('ae-visitor-id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('ae-visitor-id', id);
  }
  return id;
}
