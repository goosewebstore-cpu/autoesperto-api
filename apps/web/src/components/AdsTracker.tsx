'use client';

import { useEffect } from 'react';
import { hasCategory, updateGtagConsent } from '@/lib/consent';

const DEFAULT_CONVERSION_ID = 'AW-18544133354';
const DEFAULT_ANALYSIS_LABEL = 'oxMsCLqqnq8dEOqJxIpF';

const RAW_CONVERSION_ID = process.env.NEXT_PUBLIC_GA_ADS_CONVERSION_ID || DEFAULT_CONVERSION_ID;
const RAW_LABEL = process.env.NEXT_PUBLIC_GA_ADS_PURCHASE_LABEL || '';
const RAW_ANALYSIS_LABEL = process.env.NEXT_PUBLIC_GA_ADS_ANALYSIS_LABEL || DEFAULT_ANALYSIS_LABEL;
const CONVERSION_ID = /^AW-\d{7,12}$/.test(RAW_CONVERSION_ID) ? RAW_CONVERSION_ID : DEFAULT_CONVERSION_ID;
const CONVERSION_LABEL = /^[A-Za-z0-9_-]{6,}$/.test(RAW_LABEL) ? RAW_LABEL : '';
const ANALYSIS_LABEL = /^[A-Za-z0-9_-]{6,}$/.test(RAW_ANALYSIS_LABEL) ? RAW_ANALYSIS_LABEL : DEFAULT_ANALYSIS_LABEL;
let adsTagLoaded = false;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

function loadGtag() {
  if (typeof window === 'undefined' || !CONVERSION_ID || adsTagLoaded) return;

  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };
  }
  updateGtagConsent({ analytics: hasCategory('analytics'), marketing: true });
  window.gtag('js', new Date());
  window.gtag('config', CONVERSION_ID);

  if (!document.querySelector('script[src^="https://www.googletagmanager.com/gtag/js?id="]')) {
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${CONVERSION_ID}`;
    document.head.appendChild(s);
  }
  adsTagLoaded = true;
}

export function fireAdsAnalysisCompleted() {
  if (typeof window === 'undefined' || !CONVERSION_ID || !ANALYSIS_LABEL) return;
  if (!hasCategory('marketing')) return;
  loadGtag();
  window.gtag('event', 'conversion', {
    send_to: `${CONVERSION_ID}/${ANALYSIS_LABEL}`,
  });
}

function trackPurchase(value: number, currency: string, transactionId?: string) {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;
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
  if (!hasCategory('marketing')) return;
  loadGtag();
  trackPurchase(value, currency, transactionId);
}

export default function AdsTracker() {
  useEffect(() => {
    if (!CONVERSION_ID) return;
    if (hasCategory('marketing')) loadGtag();
    const onConsent = () => {
      if (hasCategory('marketing')) loadGtag();
    };
    window.addEventListener('ae-consent-changed', onConsent);
    return () => window.removeEventListener('ae-consent-changed', onConsent);
  }, []);

  return null;
}
