'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const VISITOR_KEY = 'ae_visitor_id';

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