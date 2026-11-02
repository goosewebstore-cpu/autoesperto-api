'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { hasCategory } from '@/lib/consent';
import { getAnalyticsSessionId, trackEvent } from '@/lib/analytics';
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || '';
let gaConfigured = false;
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}
function loadGtag() {
  if (!GA4_ID || gaConfigured) return;
  window.dataLayer ||= [];
  window.gtag ||= (...args: unknown[]) => { window.dataLayer.push(args); };
  window.gtag('js', new Date());
  window.gtag('config', GA4_ID, { send_page_view: false });
  if (!document.querySelector('script[src^="https://www.googletagmanager.com/gtag/js?id="]')) {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
    document.head.appendChild(script);
  }
  gaConfigured = true;
}
export default function AnalyticsTracker() {
  const pathname = usePathname();
  const page = useRef<{ path: string; id: string; start: number; sent: boolean; closed: boolean } | null>(null);
  useEffect(() => {
    if (page.current?.path !== pathname) {
      page.current = { path: pathname, id: crypto.randomUUID(), start: Date.now(), sent: false, closed: false };
    }
    const current = page.current!;
    const recordPage = () => {
      if (!hasCategory('analytics') || current.sent) return;
      current.sent = true;
      trackEvent('visit', undefined, getAnalyticsSessionId());
      trackEvent('page_view', undefined, current.id);
      loadGtag();
      if (GA4_ID) window.gtag('event', 'page_view', { page_path: pathname, page_title: document.title });
    };
    const closePage = () => {
      if (!current.sent || current.closed || !hasCategory('analytics')) return;
      current.closed = true;
      trackEvent('page_leave', { duration: Math.round((Date.now() - current.start) / 1000), pageId: current.id });
    };
    const onVisibility = () => { if (document.visibilityState === 'hidden') closePage(); };
    recordPage();
    window.addEventListener('ae-consent-changed', recordPage);
    window.addEventListener('pagehide', closePage);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('ae-consent-changed', recordPage);
      window.removeEventListener('pagehide', closePage);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [pathname]);
  return null;
}
