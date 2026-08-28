import type { Metadata } from 'next';
import { Suspense } from 'react';
import GuideIndex from '@/components/GuideIndex';
import GuideCard from '@/components/GuideCard';
import PageHero from '@/components/PageHero';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { guides, GUIDE_CATEGORIES } from '@/lib/guides';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';

export const metadata: Metadata = {
  title: 'Guide Auto Usata 2026: Consigli per Comprare, Vendere e Valutare | AutoEsperto',
  description:
    'Oltre 130 guide pratiche e aggiornate per l\'acquisto e la vendita di auto usate: controlli pre-acquisto, passaggio di proprietà, affidabilità motori, incentivi e quotazioni reali.',
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
    description: 'Oltre 130 guide pratiche con dati reali di mercato, controlli tecnici e normative aggiornate per comprare e vendere auto usate.',
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

import Link from 'next/link';

function GuideSsrFallback() {
  const initialGuides = guides.slice(0, 12);
  return (
    <div>
      <PageHero
        crumb="Guide"
        photo="https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=80"
        title="Guide sull'auto usata"
      >
        <p>Consigli pratici per comprare, vendere e valutare un&apos;auto usata con dati reali di mercato.</p>
      </PageHero>
      <main className="page-body">
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Link
            href="/guide"
            className="rounded-full border border-blue-600 bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm"
          >
            Tutte ({guides.length})
          </Link>
          {Object.entries(GUIDE_CATEGORIES).map(([key, { label }]) => (
            <Link
              key={key}
              href={`/guide?categoria=${key}`}
              className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:border-blue-600 hover:text-blue-600 transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {initialGuides.map((guide) => (
            <GuideCard key={guide.slug} guide={guide} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default function GuideIndexPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <Suspense fallback={<GuideSsrFallback />}>
        <GuideIndex />
      </Suspense>
      <SiteFooter />
    </div>
  );
}
