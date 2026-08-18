import type { Metadata } from 'next';
import Link from 'next/link';
import { Fuel, Euro, Gauge, TrendingDown, Search } from 'lucide-react';
import { getAllMakes, POPULAR_MODELS, slugify } from '@/lib/catalogo';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import PageHero from '@/components/PageHero';
import AdBanner from '@/components/ads/AdBanner';

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';
}

export const metadata: Metadata = {
  title: 'Consumi auto per marca, modello e anno',
  description:
    'Consumi stimati in urbano, extraurbano e combinato: litri per 100 km, costo per 100 km e costo annuo per modello.',
  alternates: {
    canonical: '/consumi',
    languages: { 'it-IT': `${siteUrl()}/consumi` },
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    title: 'Consumi auto per marca, modello e anno',
    description: 'Consumi urbano, extraurbano e combinato con il costo per 100 km e il costo annuo.',
    url: `${siteUrl()}/consumi`,
    siteName: 'AutoEsperto',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Consumi auto' }],
  },
};

export default function ConsumiPage() {
  const popular = POPULAR_MODELS.slice(0, 18);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <PageHero
        crumb="Consumi"
        photo="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80"
        title="Quanto consuma un'auto usata?"
      >
        <p>
          Consumi in urbano, extraurbano e combinato, con costo per 100 km e
          spesa annua di carburante.
        </p>
      </PageHero>
      <main className="page-body narrow">
        <AdBanner />

        <section className="mt-8 rounded-2xl bg-white border border-border p-6 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center">
              <Search className="w-5 h-5 text-accent" />
            </div>
            <p className="text-sm font-medium text-text-secondary">Scegli la marca e il modello per vedere i consumi stimati.</p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-bold text-text-primary mb-3">Le auto più cercate</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {popular.map(({ make, model }) => (
              <Link
                key={`${make}-${model}`}
                href={`/consumi/${slugify(make)}/${slugify(model)}`}
                className="rounded-xl border border-border bg-white p-4 hover:border-accent transition-colors"
              >
                <span className="text-sm font-bold text-text-primary">{make} {model}</span>
                <span className="block text-xs text-text-secondary mt-0.5">Consumi e costo annuo</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-bold text-text-primary mb-3">Tutte le marche</h2>
          <div className="flex flex-wrap gap-2">
            {getAllMakes().map((make) => (
              <Link
                key={make.slug}
                href={`/consumi/${make.slug}`}
                className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-text-primary hover:border-accent hover:text-accent transition-colors"
              >
                {make.name}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface-2 p-5">
            <Gauge className="w-6 h-6 text-accent" />
            <h3 className="text-sm font-bold text-text-primary mt-3">Urbano / extraurbano / combinato</h3>
            <p className="text-xs text-text-secondary leading-relaxed mt-1">
              Stima dei litri per 100 km nei tre cicli di guida, per modello e anno.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface-2 p-5">
            <Fuel className="w-6 h-6 text-accent" />
            <h3 className="text-sm font-bold text-text-primary mt-3">Costo per 100 km</h3>
            <p className="text-xs text-text-secondary leading-relaxed mt-1">
              Spesa di carburante per 100 km, calcolata sul consumo combinato.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface-2 p-5">
            <Euro className="w-6 h-6 text-accent" />
            <h3 className="text-sm font-bold text-text-primary mt-3">Costo annuo</h3>
            <p className="text-xs text-text-secondary leading-relaxed mt-1">
              La spesa stimata di carburante su 12.000 km all&apos;anno (media italiana).
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface-2 p-5">
            <TrendingDown className="w-6 h-6 text-accent" />
            <h3 className="text-sm font-bold text-text-primary mt-3">Elettriche e ibride</h3>
            <p className="text-xs text-text-secondary leading-relaxed mt-1">
              Per i modelli elettrici i consumi sono stimati in kWh/100 km con il costo di ricarica.
            </p>
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-blue-100 bg-blue-50 p-6">
          <h2 className="text-lg font-bold text-text-primary">Consumi, valore e costi di gestione</h2>
          <p className="text-sm text-text-secondary leading-relaxed mt-2">
            Consumi, manutenzione e valore definiscono il costo reale. Controlla valore e costi del modello.
          </p>
          <Link
            href="/valutazione"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
          >
            Valuta un&apos;auto gratis
          </Link>
        </section>

        <p className="text-xs text-text-tertiary mt-10 leading-relaxed">
          I consumi sono una stima indicativa basata su segmento, marca ed età del veicolo, con prezzi medi del carburante.
          I valori reali dipendono da motorizzazione, stile di guida, traffico e condizioni di manutenzione.
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
