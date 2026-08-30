'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  BookOpen,
  Sparkles,
  X,
  TrendingUp,
  Compass,
  CheckCircle2,
  ScanSearch,
  Calculator,
} from 'lucide-react';
import { guides, GUIDE_CATEGORIES, type GuideCategory, type Guide } from '@/lib/guides';
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

// Slugs of top featured trending guides
const FEATURED_SLUGS = [
  'auto-usata-10-segnali-problema-annuncio',
  'straccia-bollo-sicilia-2026-chi-puo-farlo-norme',
  'blocco-diesel-euro-5-2026-citta-deroghe-multe',
];

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

  const filtered = useMemo(() => {
    return guides.filter((g) => {
      if (category && g.category !== category) return false;
      if (q) {
        const haystack = normalize(`${g.title} ${g.description} ${g.category}`);
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [category, q]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => b.published.localeCompare(a.published));
  }, [filtered]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const current = q ? 1 : Math.min(page, totalPages);
  const pageItems = sorted.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const featuredGuides = useMemo(() => {
    return FEATURED_SLUGS.map((slug) => guides.find((g) => g.slug === slug)).filter(Boolean) as Guide[];
  }, []);

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
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  const handleClearSearch = () => {
    setQuery('');
    setPage(1);
    const params = new URLSearchParams();
    if (category) params.set('categoria', category);
    const qs = params.toString();
    window.history.replaceState(null, '', qs ? `/guide?${qs}` : '/guide');
  };

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Guide Auto Usata AutoEsperto 2026',
    description: 'Oltre 140 guide pratiche e aggiornate per comprare, vendere e valutare auto usate.',
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
        title="Guide & Consigli Auto Usata 2026"
      >
        <p>
          Oltre 140 approfondimenti tecnici, normative aggiornate, consigli per trattare il prezzo ed evitare truffe.
        </p>
      </PageHero>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* ── Featured Top 3 Section (when not searching and on page 1) ── */}
        {!q && current === 1 && !category && featuredGuides.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <span className="grid h-7 w-7 place-items-center rounded-xl bg-blue-600 text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  Guide in Primo Piano — Trending 2026
                </h2>
                <p className="text-xs text-slate-500">I temi più letti e discussi dagli automobilisti questo mese</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {featuredGuides.map((guide) => (
                <GuideCard key={`feat-${guide.slug}`} guide={guide} featured={true} />
              ))}
            </div>
          </section>
        )}

        {/* ── Search & Filter Hub ── */}
        <section className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 shadow-xs mb-8">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Cerca una guida… (es. blocco diesel, bollo, passaggio, cambio automatico, neopatentati)"
              aria-label="Cerca una guida"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 dark:border-slate-700 dark:bg-slate-800/60 py-3.5 pl-12 pr-10 text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-600 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Cancella ricerca"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => handleCategorySelect(undefined)}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                category === undefined
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Tutte le categorie ({guides.length})
            </button>
            {Object.entries(GUIDE_CATEGORIES).map(([key, { label }]) => {
              const count = guides.filter((g) => g.category === key).length;
              const active = category === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleCategorySelect(key as GuideCategory)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {label} ({count})
                </button>
              );
            })}
          </div>
        </section>

        {/* Counter Info */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>
              {sorted.length} {sorted.length === 1 ? 'guida disponibile' : 'guide disponibili'}
              {category ? ` nella categoria "${GUIDE_CATEGORIES[category]?.label}"` : ''}
              {q ? ` per "${query.trim()}"` : ''}
            </span>
          </p>
          {totalPages > 1 && (
            <span className="text-xs text-slate-400 font-semibold">
              Pagina {current} di {totalPages}
            </span>
          )}
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pageItems.length > 0 ? (
            pageItems.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))
          ) : (
            <div className="col-span-full rounded-3xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 p-12 text-center">
              <BookOpen className="h-10 w-10 mx-auto text-slate-400 mb-3" />
              <p className="text-base font-extrabold text-slate-900 dark:text-white">Nessuna guida trovata</p>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                Non abbiamo trovato guide per &quot;{query}&quot;. Prova con un altro termine o sfoglia tutte le categorie.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setCategory(undefined);
                }}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 cursor-pointer transition-all"
              >
                <Compass className="w-3.5 h-3.5" /> Mostra tutte le 140+ guide
              </button>
            </div>
          )}
        </div>

        <div className="my-10">
          <AdBanner />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav aria-label="Paginazione guide" className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => handlePageChange(Math.max(1, current - 1))}
              disabled={current <= 1}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                current <= 1
                  ? 'pointer-events-none opacity-40 border-slate-200 text-slate-400 dark:border-slate-800'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-blue-600 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
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
                      {showEllipsis && <span className="px-1 text-slate-400 font-bold">…</span>}
                      <button
                        type="button"
                        onClick={() => handlePageChange(p)}
                        className={`h-9 w-9 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          p === current
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                            : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-600 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
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
              className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                current >= totalPages
                  ? 'pointer-events-none opacity-40 border-slate-200 text-slate-400 dark:border-slate-800'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-blue-600 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
              }`}
            >
              Successiva
              <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
        )}

        {/* Bottom Banner Tools Callouts */}
        <section className="mt-14 grid sm:grid-cols-2 gap-4">
          <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50/80 via-sky-50/30 to-white dark:border-blue-900/60 dark:bg-slate-900 p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white grid place-items-center mb-3 shadow-md shadow-blue-600/20">
                <Calculator className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Quanto vale la tua auto usata?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                Calcola la quotazione di mercato istantanea basata sull&apos;analisi di oltre 10.000 annunci reali.
              </p>
            </div>
            <Link
              href="/valutazione"
              className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-xs"
            >
              Calcola Valore Gratis
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:border-slate-800 dark:bg-slate-900 p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 grid place-items-center mb-3 shadow-md">
                <ScanSearch className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Scansiona un annuncio da link o foto
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                Incolla il link di AutoScout24 o Subito per ottenere il report su prezzo, difetti noti e affidabilità.
              </p>
            </div>
            <Link
              href="/analizza-annuncio"
              className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2.5 text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs"
            >
              Controlla Annuncio
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
