'use client';

import { useEffect, useState } from 'react';
import { hasCategory, getConsentPreferences } from '@/lib/consent';

const CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '';
const ENABLED = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true';

const SLOTS = {
  banner: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER || process.env.NEXT_PUBLIC_ADSENSE_HOME_SLOT || '',
  in_article: process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE || '',
  sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || '',
  result: process.env.NEXT_PUBLIC_ADSENSE_SLOT_RESULT || process.env.NEXT_PUBLIC_ADSENSE_REPORT_SLOT || '',
};

let adsenseScriptLoaded = false;

/** Dynamically load the AdSense script — only after marketing consent. */
function ensureAdSenseScript(): void {
  if (adsenseScriptLoaded) return;
  if (typeof window === 'undefined' || !CLIENT_ID) return;

  adsenseScriptLoaded = true;
  const s = document.createElement('script');
  s.async = true;
  s.crossOrigin = 'anonymous';
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT_ID}`;
  document.head.appendChild(s);
}

interface AdSlotProps {
  slot?: string;
  placement?: keyof typeof SLOTS;
  className?: string;
}

export default function AdSlot({ slot, placement = 'result', className }: AdSlotProps) {
  const resolvedSlot = slot || SLOTS[placement];
  const [marketingAllowed, setMarketingAllowed] = useState(false);

  useEffect(() => {
    setMarketingAllowed(hasCategory('marketing'));
    const onConsent = () => {
      setMarketingAllowed(hasCategory('marketing'));
    };
    window.addEventListener('ae-consent-changed', onConsent);
    return () => window.removeEventListener('ae-consent-changed', onConsent);
  }, []);

  useEffect(() => {
    if (!ENABLED || !CLIENT_ID || !resolvedSlot) return;
    if (!marketingAllowed) return;

    ensureAdSenseScript();

    try {
      ((window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle =
        (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle || []).push({});
    } catch {
      /* annuncio non pronto */
    }
  }, [marketingAllowed, resolvedSlot]);

  if (!ENABLED || !CLIENT_ID || !resolvedSlot || !marketingAllowed) return null;

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
