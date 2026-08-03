'use client';

import { useEffect, useRef, useState } from 'react';
import { getConsent, type ConsentChoice } from '@/lib/consent';

const CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '';
const ENABLED = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true';
const HOME_SLOT = process.env.NEXT_PUBLIC_ADSENSE_HOME_SLOT || '';
const REPORT_SLOT = process.env.NEXT_PUBLIC_ADSENSE_REPORT_SLOT || '';

interface AdSlotProps {
  slot?: string;
  placement?: 'home' | 'report';
  className?: string;
}

export default function AdSlot({ slot, placement = 'report', className }: AdSlotProps) {
  const inserted = useRef(false);
  const resolvedSlot = slot || (placement === 'home' ? HOME_SLOT : REPORT_SLOT);
  const [consent, setConsentState] = useState<ConsentChoice>(null);

  useEffect(() => {
    setConsentState(getConsent());
    const onConsent = (event: Event) => setConsentState((event as CustomEvent<ConsentChoice>).detail);
    window.addEventListener('ae-consent-changed', onConsent);
    return () => window.removeEventListener('ae-consent-changed', onConsent);
  }, []);

  useEffect(() => {
    if (!ENABLED || !CLIENT_ID || !resolvedSlot) return;

    if (consent !== 'accepted') {
      const existing = document.querySelector('script[data-autoesperto-adsense]');
      if (existing) existing.remove();
      inserted.current = false;
      return;
    }

    if (!inserted.current) {
      inserted.current = true;
      if (!document.querySelector('script[data-autoesperto-adsense]')) {
        const s = document.createElement('script');
        s.async = true;
        s.crossOrigin = 'anonymous';
        s.dataset.autoespertoAdsense = 'true';
        s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT_ID}`;
        document.head.appendChild(s);
      }
    }

    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      /* annuncio non pronto */
    }
  }, [consent, resolvedSlot]);

  if (!ENABLED || !CLIENT_ID || !resolvedSlot || consent !== 'accepted') return null;

  return (
    <div className={`flex justify-center ${className || ''}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={CLIENT_ID}
        data-ad-slot={resolvedSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
