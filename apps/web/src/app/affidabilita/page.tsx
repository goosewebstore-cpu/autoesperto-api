import type { Metadata } from 'next';
import Link from 'next/link';
import { Gauge, ShieldCheck, Euro, AlertTriangle, Search } from 'lucide-react';
import { getAllMakes, POPULAR_MODELS, slugify } from '@/lib/catalogo';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import PageHero from '@/components/PageHero';
import AdBanner from '@/components/ads/AdBanner';

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';
}

export const metadata: Metadata = {
  title: 'Affidabilità auto per marca, modello e anno',
  description:
    'Punteggio di affidabilità per marca, modello e anno: guasti frequenti, punti di forza e costi di manutenzione.',
  alternates: {
    canonical: '/affidabilita',
    languages: { 'it-IT': `${siteUrl()}/affidabilita` },
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    title: 'Affidabilità auto per marca, modello e anno',
    description: 'Punteggio di affidabilità, punti deboli e costi di manutenzione per ogni modello.',
    url: `${siteUrl()}/affidabilita`,
    siteName: 'AutoEsperto',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Affidabilità auto' }],
  },
};

export default function AffidabilitaPage() {
  const popular = POPULAR_MODELS.slice(0, 18);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <PageHero
        crumb="Affidabilità"
        photo="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1600&q=80"
        title="Quanto è affidabile un'auto usata?"
      >
        <p>
          Punteggio per marca, modello e anno: punti di forza, guasti frequenti, manutenzione
          e controlli prima dell&apos;acquisto.
        </p>
      </PageHero>
      <main className="page-body narrow">
        <AdBanner />

        <section className="mt-8 rounded-2xl bg-white border border-border p-6 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center">
              <Search className="w-5 h-5 text-accent" />
            </div>
            <p className="text-sm font-medium text-text-secondary">Scegli la marca e il modello per vedere il punteggio di affidabilità.</p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-bold text-text-primary mb-3">Le auto più cercate</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {popular.map(({ make, model }) => (
              <Link
                key={`${make}-${model}`}
                href={`/affidabilita/${slugify(make)}/${slugify(model)}`}
                className="rounded-xl border border-border bg-white p-4 hover:border-accent transition-colors"
              >
                <span className="text-sm font-bold text-text-primary">{make} {model}</span>
                <span className="block text-xs text-text-secondary mt-0.5">Punteggio di affidabilità</span>
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
                href={`/affidabilita/${make.slug}`}
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
            <h3 className="text-sm font-bold text-text-primary mt-3">Punteggio 0–10</h3>
            <p className="text-xs text-text-secondary leading-relaxed mt-1">
              Un voto per modello e anno basato su segmento, marca ed età del veicolo.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface-2 p-5">
            <AlertTriangle className="w-6 h-6 text-accent" />
            <h3 className="text-sm font-bold text-text-primary mt-3">Guasti frequenti</h3>
            <p className="text-xs text-text-secondary leading-relaxed mt-1">
              I punti deboli noti di ogni costruttore: cosa controllare prima di comprare.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface-2 p-5">
            <ShieldCheck className="w-6 h-6 text-accent" />
            <h3 className="text-sm font-bold text-text-primary mt-3">Punti di forza</h3>
            <p className="text-xs text-text-secondary leading-relaxed mt-1">
              I motivi per cui un modello tiene bene nel tempo e costa meno da mantenere.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface-2 p-5">
            <Euro className="w-6 h-6 text-accent" />
            <h3 className="text-sm font-bold text-text-primary mt-3">Manutenzione annua</h3>
            <p className="text-xs text-text-secondary leading-relaxed mt-1">
              Spesa media annua per tagliandi, consumabili e piccoli interventi.
            </p>
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-blue-100 bg-blue-50 p-6">
          <h2 className="text-lg font-bold text-text-primary">Verifica anche il valore di mercato</h2>
          <p className="text-sm text-text-secondary leading-relaxed mt-2">
            Controlla il prezzo medio reale del modello, calcolato dagli annunci in vendita.
          </p>
          <Link
            href="/valutazione"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
          >
            Valuta un&apos;auto gratis
          </Link>
        </section>

        <p className="text-xs text-text-tertiary mt-10 leading-relaxed">
          Il punteggio di affidabilità è una stima indicativa basata su segmento, marca, età e problemi noti del modello.
          Non sostituisce un&apos;ispezione meccanica: per valutare lo stato reale di un&apos;auto, carica una foto e ottieni
          un&apos;analisi visiva.
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
