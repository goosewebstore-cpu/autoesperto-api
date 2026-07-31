'use client';

import { useEffect, useRef } from 'react';
import { getConsent } from '@/lib/consent';

const CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '';

interface AdSlotProps {
  slot: string;
  className?: string;
}

export default function AdSlot({ slot, className }: AdSlotProps) {
  const inserted = useRef(false);

  useEffect(() => {
    if (!CLIENT_ID) return;
    if (getConsent() !== 'accepted') return;

    if (!inserted.current) {
      inserted.current = true;
      const s = document.createElement('script');
      s.async = true;
      s.crossOrigin = 'anonymous';
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT_ID}`;
      document.head.appendChild(s);
    }

    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      /* annuncio non pronto */
    }
  }, []);

  if (!CLIENT_ID) return null;

  return (
    <div className={`flex justify-center ${className || ''}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
