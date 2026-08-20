import type { Metadata } from 'next';
import { Suspense } from 'react';
import GuideIndex from '@/components/GuideIndex';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';

export const metadata: Metadata = {
  title: 'Guide Auto Usata 2026: Consigli per Comprare, Vendere e Valutare | AutoEsperto',
  description:
    'Oltre 110 guide pratiche e aggiornate per l\'acquisto e la vendita di auto usate: controlli pre-acquisto, passaggio di proprietà, affidabilità motori, incentivi e quotazioni reali.',
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
    title: 'Guide Auto Usata 2026: Consigli per Comprare e Vendere | AutoEsperto',
    description: 'Oltre 110 guide pratiche con dati reali di mercato, controlli tecnici e normative aggiornate per comprare e vendere auto usate.',
    url: `${siteUrl}/guide`,
    siteName: 'AutoEsperto',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Guide AutoEsperto' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guide Auto Usata 2026 | AutoEsperto',
    description: 'Consigli pratici e dati reali di mercato per comprare e vendere auto usate.',
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
