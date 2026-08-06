'use client';

import { useEffect } from 'react';
import { getConsent } from '@/lib/consent';

const RAW_CONVERSION_ID = process.env.NEXT_PUBLIC_GA_ADS_CONVERSION_ID || '';
const RAW_LABEL = process.env.NEXT_PUBLIC_GA_ADS_PURCHASE_LABEL || '';
const CONVERSION_ID = /^AW-\d{7,12}$/.test(RAW_CONVERSION_ID) ? RAW_CONVERSION_ID : '';
const CONVERSION_LABEL = /^[A-Za-z0-9_-]{6,}$/.test(RAW_LABEL) ? RAW_LABEL : '';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

function loadGtag() {
  if (typeof window === 'undefined') return;
  if ((window as unknown as { gtag?: unknown }).gtag) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag('js', new Date());
  window.gtag(
    'config',
    CONVERSION_ID,
    CONVERSION_LABEL ? { send_to: `${CONVERSION_ID}/${CONVERSION_LABEL}` } : {},
  );

  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${CONVERSION_ID}`;
  document.head.appendChild(s);
}

function trackPurchase(value: number, currency: string, transactionId?: string) {
  if (typeof window === 'undefined') return;
  if (!(window as unknown as { gtag?: unknown }).gtag) return;
  if (!CONVERSION_ID || !CONVERSION_LABEL) return;
  window.gtag('event', 'purchase', {
    send_to: `${CONVERSION_ID}/${CONVERSION_LABEL}`,
    transaction_id: transactionId || `ae_${Date.now()}`,
    value,
    currency,
  });
}

export function fireAdsPurchase(value = 1.99, currency = 'EUR', transactionId?: string) {
  if (typeof window === 'undefined') return;
  if (!CONVERSION_ID) return;
  if (getConsent() !== 'accepted') return;
  loadGtag();
  trackPurchase(value, currency, transactionId);
}

export default function AdsTracker() {
  useEffect(() => {
    if (!CONVERSION_ID) return;
    if (getConsent() !== 'accepted') return;
    loadGtag();
    const onConsent = (event: Event) => {
      if ((event as CustomEvent<string>).detail !== 'accepted') return;
      loadGtag();
    };
    window.addEventListener('ae-consent-changed', onConsent);
    return () => window.removeEventListener('ae-consent-changed', onConsent);
  }, []);

  return null;
}