'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Search, BookOpen } from 'lucide-react';
import { guides, GUIDE_CATEGORIES, type GuideCategory } from '@/lib/guides';
import GuideCard from '@/components/GuideCard';
import PageHero from '@/components/PageHero';
import AdBanner from '@/components/ads/AdBanner';

const PAGE_SIZE = 12;
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
  const initialCategory: GuideCategory | undefined =
    rawCategory && rawCategory in GUIDE_CATEGORIES ? (rawCategory as GuideCategory) : undefined;
  const rawPage = Number.parseInt(searchParams.get('pagina') || '1', 10);
  const initialPage = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

  const [category, setCategory] = useState<GuideCategory | undefined>(initialCategory);
  const [page, setPage] = useState<number>(initialPage);
  const [query, setQuery] = useState(searchParams.get('q') || '');

  useEffect(() => {
    const urlCat = searchParams.get('categoria');
    if (urlCat && urlCat in GUIDE_CATEGORIES) {
      setCategory(urlCat as GuideCategory);
    } else if (!urlCat) {
      setCategory(undefined);
    }
  }, [searchParams]);

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

  const handleCategorySelect = (newCat?: GuideCategory) => {
    setCategory(newCat);
    setPage(1);
    const params = new URLSearchParams();
    if (newCat) params.set('categoria', newCat);
    if (query) params.set('q', query);
    const qs = params.toString();
    window.history.replaceState(null, '', qs ? `/guide?${qs}` : '/guide');
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const params = new URLSearchParams();
    if (category) params.set('categoria', category);
    if (newPage > 1) params.set('pagina', String(newPage));
    if (query) params.set('q', query);
    const qs = params.toString();
    window.history.replaceState(null, '', qs ? `/guide?${qs}` : '/guide');
    window.scrollTo({ top: 300, behavior: 'smooth' });
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
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Cerca una guida… (es. cambio auto, rottamazione, assicurazione, neopatentati)"
            aria-label="Cerca una guida"
            className="w-full rounded-xl border border-border bg-white py-3 pl-11 pr-4 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>

        {/* Interactive Category Chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleCategorySelect(undefined)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              category === undefined
                ? 'border-accent bg-accent text-white shadow-sm'
                : 'border-border bg-white text-text-secondary hover:border-accent hover:text-accent'
            }`}
          >
            Tutte ({guides.length})
          </button>
          {Object.entries(GUIDE_CATEGORIES).map(([key, { label }]) => {
            const count = guides.filter((g) => g.category === key).length;
            const active = category === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleCategorySelect(key as GuideCategory)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  active
                    ? 'border-accent bg-accent text-white shadow-sm'
                    : 'border-border bg-white text-text-secondary hover:border-accent hover:text-accent'
                }`}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>

        <p className="mt-5 text-xs font-semibold text-text-secondary">
          {sorted.length} {sorted.length === 1 ? 'guida disponibile' : 'guide disponibili'}
          {category ? ` in ${GUIDE_CATEGORIES[category].label}` : ''}
          {q ? ` per "${query.trim()}"` : ''}
        </p>

        {/* Guides Grid */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {pageItems.length > 0 ? (
            pageItems.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))
          ) : (
            <div className="sm:col-span-2 rounded-2xl border border-border bg-surface-2 p-8 text-center">
              <BookOpen className="h-8 w-8 mx-auto text-slate-400 mb-2" />
              <p className="text-sm font-semibold text-text-primary">Nessuna guida trovata</p>
              <p className="mt-1 text-xs text-text-secondary">Prova con un altro termine o sfoglia tutte le categorie.</p>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setCategory(undefined);
                }}
                className="mt-3 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-text-primary hover:border-accent hover:text-accent cursor-pointer"
              >
                Mostra tutte le guide
              </button>
            </div>
          )}
        </div>

        <AdBanner />

        {totalPages > 1 && (
          <nav aria-label="Paginazione guide" className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => handlePageChange(Math.max(1, current - 1))}
              disabled={current <= 1}
              className={`inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                current <= 1
                  ? 'pointer-events-none opacity-40 text-text-tertiary'
                  : 'text-text-primary hover:border-accent hover:text-accent bg-white'
              }`}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Precedente
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - current) <= 2)
                .map((p, idx, arr) => {
                  const prev = arr[idx - 1];
                  const showEllipsis = prev && p - prev > 1;
                  return (
                    <div key={p} className="flex items-center gap-1">
                      {showEllipsis && <span className="px-1 text-slate-400">…</span>}
                      <button
                        type="button"
                        onClick={() => handlePageChange(p)}
                        className={`h-8 w-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          p === current
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-600 hover:text-blue-600'
                        }`}
                      >
                        {p}
                      </button>
                    </div>
                  );
                })}
            </div>
            <button
              type="button"
              onClick={() => handlePageChange(Math.min(totalPages, current + 1))}
              disabled={current >= totalPages}
              className={`inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                current >= totalPages
                  ? 'pointer-events-none opacity-40 text-text-tertiary'
                  : 'text-text-primary hover:border-accent hover:text-accent bg-white'
              }`}
            >
              Successiva
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
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
