'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { guides, GUIDE_CATEGORIES, type GuideCategory } from '@/lib/guides';
import GuideCard from '@/components/GuideCard';
import AdBanner from '@/components/ads/AdBanner';

const PAGE_SIZE = 6;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';

export default function GuideIndex() {
  const searchParams = useSearchParams();
  const rawCategory = searchParams.get('categoria') || undefined;
  const category: GuideCategory | undefined =
    rawCategory && rawCategory in GUIDE_CATEGORIES ? (rawCategory as GuideCategory) : undefined;
  const rawPage = Number.parseInt(searchParams.get('pagina') || '1', 10);
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

  const filtered = category ? guides.filter((g) => g.category === category) : guides;
  const sorted = [...filtered].sort((a, b) => b.published.localeCompare(a.published));
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageItems = sorted.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const buildPageHref = (categoria?: string, pagina?: number) => {
    const params = new URLSearchParams();
    if (categoria) params.set('categoria', categoria);
    if (pagina && pagina > 1) params.set('pagina', String(pagina));
    const qs = params.toString();
    return qs ? `/guide?${qs}` : '/guide';
  };

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Guide AutoUsata AutoEsperto',
    url: `${siteUrl}/guide`,
    publisher: {
      '@type': 'Organization',
      name: 'AutoEsperto',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/og-image.png`,
      },
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: pageItems.length,
      itemListElement: pageItems.map((guide, idx) => ({
        '@type': 'ListItem',
        position: (current - 1) * PAGE_SIZE + idx + 1,
        url: `${siteUrl}/guide/${guide.slug}`,
        name: guide.title,
      })),
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Guide', item: `${siteUrl}/guide` },
    ],
  };

  const categoryChips = (
    <>
      {Object.entries(GUIDE_CATEGORIES).map(([key, { label }]) => {
        const active = category === key;
        return (
          <Link
            key={key}
            href={buildPageHref(key, 1)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              active
                ? 'border-accent bg-accent text-white'
                : 'border-border bg-white text-text-secondary hover:border-accent hover:text-accent'
            }`}
          >
            {label}
          </Link>
        );
      })}
    </>
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main className="max-w-5xl mx-auto px-5 pt-8 pb-20">
        <nav aria-label="Breadcrumb" className="text-xs text-text-tertiary mb-4">
          <ol className="inline-flex items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            </li>
            <li>/</li>
            <li>
              <span className="text-text-secondary font-medium">Guide</span>
            </li>
          </ol>
        </nav>

        <section>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-text-primary leading-[1.15]">
            Guide sull&apos;auto usata
          </h1>
          <p className="text-text-secondary text-base leading-relaxed mt-3 max-w-2xl">
            Consigli pratici basati sui dati reali del mercato per comprare, vendere e valutare
            un&apos;auto usata senza rischiare di sbagliare il prezzo.
          </p>
        </section>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Link
            href="/guide"
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              category === undefined
                ? 'border-accent bg-accent text-white'
                : 'border-border bg-white text-text-secondary hover:border-accent hover:text-accent'
            }`}
          >
            Tutte
          </Link>
          {categoryChips}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {pageItems.map((guide) => (
            <GuideCard key={guide.slug} guide={guide} />
          ))}
        </div>

        <AdBanner />

        {totalPages > 1 && (
          <nav aria-label="Paginazione guide" className="mt-10 flex items-center justify-center gap-4">
            <Link
              href={buildPageHref(category, current - 1)}
              aria-disabled={current <= 1}
              className={`inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs font-semibold transition-colors ${
                current <= 1
                  ? 'pointer-events-none text-text-tertiary'
                  : 'text-text-primary hover:border-accent hover:text-accent'
              }`}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Precedente
            </Link>
            <span className="text-xs font-semibold text-text-secondary">
              Pagina {current} di {totalPages}
            </span>
            <Link
              href={buildPageHref(category, current + 1)}
              aria-disabled={current >= totalPages}
              className={`inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs font-semibold transition-colors ${
                current >= totalPages
                  ? 'pointer-events-none text-text-tertiary'
                  : 'text-text-primary hover:border-accent hover:text-accent'
              }`}
            >
              Successiva
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </nav>
        )}

        <section className="mt-12 rounded-2xl bg-accent p-6 text-white">
          <h2 className="text-lg font-bold">Scopri quanto vale la tua auto</h2>
          <p className="text-sm text-white/85 leading-relaxed mt-2">
            Prezzo medio reale dagli annunci in vendita per marca, modello e anno. Gratis, senza registrazione.
          </p>
          <Link
            href="/valutazione"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-accent hover:bg-white/90 transition-colors"
          >
            Valuta la tua auto
          </Link>
        </section>
      </main>
    </>
  );
}
