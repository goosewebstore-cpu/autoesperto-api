import type { Metadata } from 'next';
import { Suspense } from 'react';
import GuideIndex from '@/components/GuideIndex';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';

export const metadata: Metadata = {
  title: 'Guide auto usata: quotazioni e acquisto',
  description:
    'Guide pratiche per comprare e vendere auto usate: checklist pre-acquisto, modelli affidabili e costi di riparazione.',
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
  alternates: {
    canonical: `${siteUrl}/guide`,
    languages: { 'it-IT': `${siteUrl}/guide` },
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    title: 'Guide auto usata: quotazioni e acquisto',
    description: 'Guide pratiche e dati reali di mercato per comprare e vendere auto usate.',
    url: `${siteUrl}/guide`,
    siteName: 'AutoEsperto',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Guide AutoEsperto' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guide auto usata: quotazioni e acquisto',
    description: 'Guide pratiche e dati reali di mercato per comprare e vendere auto usate.',
    images: ['/og-image.png'],
  },
};

export default function GuideIndexPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <Suspense fallback={<div className="min-h-[40vh]" />}>
        <GuideIndex />
      </Suspense>
      <SiteFooter />
    </div>
  );
}
