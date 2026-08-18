'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { hasCategory } from '@/lib/consent';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || '';
const VISITOR_KEY = 'ae_visitor_id';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

function loadGtag() {
  if (typeof window === 'undefined') return;
  if (typeof (window as unknown as { gtag?: unknown }).gtag === 'function') return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA4_ID, { anonymize_ip: true });

  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(s);
}

function getVisitorId(): string {
  if (typeof window === 'undefined') return '';
  try {
    let id = window.localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
      window.localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return '';
  }
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const sessionRef = useRef<{ path: string; start: number; leaveSent: boolean } | null>(null);
  const lastGaPage = useRef('');

  useEffect(() => {
    if (!GA4_ID || !hasCategory('analytics')) return;
    loadGtag();
    const onConsent = () => {
      if (hasCategory('analytics')) loadGtag();
    };
    window.addEventListener('ae-consent-changed', onConsent);
    return () => window.removeEventListener('ae-consent-changed', onConsent);
  }, []);

  useEffect(() => {
    if (!GA4_ID || !hasCategory('analytics')) return;
    if (lastGaPage.current === pathname) return;
    lastGaPage.current = pathname;
    loadGtag();
    window.gtag('event', 'page_view', {
      page_path: pathname,
      page_title: document.title,
    });
  }, [pathname]);

  useEffect(() => {
    const visitorId = getVisitorId();
    if (!visitorId) return;

    const track = (type: string, path: string, duration?: number) => {
      try {
        fetch(`${API_URL}/analytics/track`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, path, visitorId, duration }),
          keepalive: true,
        }).catch(() => undefined);
      } catch {
        /* privacy-first: never block the user */
      }
    };

    const closeSession = () => {
      const s = sessionRef.current;
      if (!s || s.leaveSent) return;
      s.leaveSent = true;
      track('visit', s.path, Math.round((Date.now() - s.start) / 1000));
    };

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') closeSession();
    };

    if (sessionRef.current) closeSession();
    sessionRef.current = { path: pathname, start: Date.now(), leaveSent: false };
    track('visit', pathname);

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', closeSession);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', closeSession);
      closeSession();
    };
  }, [pathname]);

  return null;
}