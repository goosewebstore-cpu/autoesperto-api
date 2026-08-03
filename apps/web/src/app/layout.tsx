import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import ServiceWorker from '@/components/ServiceWorker';
import CookieConsent from '@/components/CookieConsent';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.vercel.app';
const siteTitle = 'Analisi auto con AI: danni, valore e preventivo | AutoEsperto';
const siteDescription =
  'Analizza l’auto da una foto: scopri marca, modello, anno e prezzo indicativo, con un report dettagliato specifico per quel veicolo.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'AutoEsperto',
  title: {
    default: siteTitle,
    template: '%s | AutoEsperto',
  },
  description: siteDescription,
  keywords: [
    'analisi auto AI', 'scanner auto AI', 'valutazione auto', 'danni auto',
    'preventivo riparazione auto', 'valore auto usata', 'Car Health Score', 'AutoEsperto',
  ],
  category: 'automotive',
  creator: 'AutoEsperto',
  publisher: 'AutoEsperto',
  manifest: '/manifest.json',
  alternates: { canonical: '/' },
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
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'AutoEsperto — Analisi completa dell’auto con AI' }],
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
        price: '5.99',
        priceCurrency: 'EUR',
        description: 'Una analisi completa, pagamento singolo senza abbonamento',
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
      </head>
      <body className="min-h-screen">
        <JsonLd />
        <ServiceWorker />
        <CookieConsent />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
