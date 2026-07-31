import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ServiceWorker from '@/components/ServiceWorker';
import CookieConsent from '@/components/CookieConsent';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'AutoEsperto — L\'esperto che controlla l\'auto prima di comprarla',
    template: '%s | AutoEsperto',
  },
  description:
    'Analizza un\'auto usata in pochi secondi: dati del veicolo, valutazione di affidabilità, stima di mercato e consigli prima dell\'acquisto.',
  keywords: [
    'auto usata', 'valutazione auto', 'controllo targa', 'affidabilità auto',
    'prezzo auto usate', 'consigli acquisto auto', 'AutoEsperto',
  ],
  manifest: '/manifest.json',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    title: 'AutoEsperto — L\'esperto che controlla l\'auto prima di comprarla',
    description:
      'Analizza un\'auto usata in pochi secondi: dati del veicolo, valutazione di affidabilità, stima di mercato e consigli prima dell\'acquisto.',
    siteName: 'AutoEsperto',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'AutoEsperto — Analisi auto usate' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AutoEsperto — L\'esperto che controlla l\'auto prima di comprarla',
    description:
      'Analizza un\'auto usata in pochi secondi: dati del veicolo, valutazione di affidabilità, stima di mercato e consigli prima dell\'acquisto.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={inter.variable}>
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="min-h-screen">
        <ServiceWorker />
        <CookieConsent />
        {children}
      </body>
    </html>
  );
}
