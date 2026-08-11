import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import ServiceWorker from '@/components/ServiceWorker';
import CookieConsent from '@/components/CookieConsent';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import AdsTracker from '@/components/AdsTracker';
import { getPremiumPricing } from '@/lib/pricing';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';
const siteTitle = 'AutoEsperto — Il tuo secondo parere prima di comprare o vendere un\'auto usata';
const siteDescription =
  'Scopri quanto vale un\'auto usata, se il prezzo è giusto e cosa controllare prima di comprarla. Analisi gratuita e veloce.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'AutoEsperto',
  title: {
    default: siteTitle,
    template: '%s | AutoEsperto',
  },
  description: siteDescription,
  keywords: [
    'valutazione auto usata', 'comprare auto usata', 'valutazione auto', 'danni auto',
    'preventivo riparazione auto', 'valore auto usata', 'Car Health Score', 'AutoEsperto',
  ],
  category: 'automotive',
  creator: 'AutoEsperto',
  publisher: 'AutoEsperto',
  manifest: '/manifest.json',
  alternates: {
    canonical: '/',
    languages: { 'it-IT': siteUrl },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: siteUrl,
    title: siteTitle,
    description: siteDescription,
    siteName: 'AutoEsperto',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'AutoEsperto — Analisi completa del valore e affidabilità dell\'auto' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AutoEsperto',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0F172A',
};

function JsonLd() {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'AutoEsperto',
      alternateName: 'Auto Esperto',
      url: siteUrl,
      description: siteDescription,
      inLanguage: 'it-IT',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'AutoEsperto',
      url: siteUrl,
      logo: `${siteUrl}/icon-192.png`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'AutoEsperto',
      url: siteUrl,
      description: siteDescription,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      inLanguage: 'it-IT',
      image: `${siteUrl}/og-image.png`,
      offers: {
        '@type': 'Offer',
        price: (getPremiumPricing().amountCents / 100).toFixed(2),
        priceCurrency: 'EUR',
        priceValidUntil: '2027-01-01',
        description: 'Abbonamento mensile per analisi illimitate e funzioni Premium',
      },
    },
  ];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={inter.variable} data-scroll-behavior="smooth">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
        {process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true' && process.env.NEXT_PUBLIC_ADSENSE_CLIENT && (
          <>
            <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
            <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
            <Script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
              crossOrigin="anonymous"
              strategy="afterInteractive"
            />
          </>
        )}
      </head>
      <body className="min-h-screen">
        <JsonLd />
        <ServiceWorker />
        <CookieConsent />
        <AnalyticsTracker />
        <AdsTracker />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
