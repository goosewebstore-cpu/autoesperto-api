'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { guides, GUIDE_CATEGORIES, type GuideCategory } from '@/lib/guides';
import GuideCard from '@/components/GuideCard';
import PageHero from '@/components/PageHero';
import AdBanner from '@/components/ads/AdBanner';

const PAGE_SIZE = 6;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export default function GuideIndex() {
  const searchParams = useSearchParams();
  const rawCategory = searchParams.get('categoria') || undefined;
  const category: GuideCategory | undefined =
    rawCategory && rawCategory in GUIDE_CATEGORIES ? (rawCategory as GuideCategory) : undefined;
  const rawPage = Number.parseInt(searchParams.get('pagina') || '1', 10);
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const q = normalize(query.trim());
  const filtered = guides.filter((g) => {
    if (category && g.category !== category) return false;
    if (q) {
      const haystack = normalize(`${g.title} ${g.description} ${g.category}`);
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
  const sorted = [...filtered].sort((a, b) => b.published.localeCompare(a.published));
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const current = q ? 1 : Math.min(page, totalPages);
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

      <PageHero
        crumb="Guide"
        photo="https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=80"
        title="Guide sull'auto usata"
      >
        <p>
          Consigli pratici per comprare, vendere e valutare un&apos;auto usata con dati reali di mercato.
        </p>
      </PageHero>

      <main className="page-body">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cerca una guida… (es. cambio auto, rottamazione, assicurazione)"
            aria-label="Cerca una guida"
            className="w-full rounded-xl border border-border bg-white py-3 pl-11 pr-4 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
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

        <p className="mt-5 text-xs font-semibold text-text-secondary">
          {pageItems.length} {pageItems.length === 1 ? 'guida trovata' : 'guide trovate'}
          {category ? ` in ${GUIDE_CATEGORIES[category].label}` : ''}
          {q ? ` per "${query.trim()}"` : ''}
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {pageItems.length > 0 ? (
            pageItems.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))
          ) : (
            <div className="sm:col-span-2 rounded-2xl border border-border bg-surface-2 p-8 text-center">
              <p className="text-sm font-semibold text-text-primary">Nessuna guida trovata</p>
              <p className="mt-1 text-xs text-text-secondary">Prova con un altro termine o sfoglia tutte le categorie.</p>
              <button
                type="button"
                onClick={() => { setQuery(''); }}
                className="mt-3 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-text-primary hover:border-accent hover:text-accent"
              >
                Mostra tutte le guide
              </button>
            </div>
          )}
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

        <section className="mt-12 rounded-2xl border border-blue-100 bg-blue-50 p-6">
          <h2 className="text-lg font-bold text-text-primary">Quanto vale un&apos;auto usata?</h2>
          <p className="text-sm text-text-secondary leading-relaxed mt-2">
            Prezzo medio reale dagli annunci in vendita per marca, modello e anno. Gratis, senza registrazione.
          </p>
          <Link
            href="/valutazione"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
          >
            Valuta un&apos;auto
          </Link>
        </section>
      </main>
    </>
  );
}
