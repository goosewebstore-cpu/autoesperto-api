import type { Metadata } from 'next';
import Link from 'next/link';
import { Wrench, ShieldCheck, Euro, Timer, Search } from 'lucide-react';
import { getAllMakes, POPULAR_MODELS, slugify } from '@/lib/catalogo';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import PageHero from '@/components/PageHero';
import AdBanner from '@/components/ads/AdBanner';

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';
}

export const metadata: Metadata = {
  title: 'Costi riparazione auto usata per modello',
  description:
    'Stime di manodopera e ricambi per marca, modello e anno: guasti frequenti, manutenzione ordinaria e quando conviene riparare.',
  alternates: {
    canonical: '/riparazione',
    languages: { 'it-IT': `${siteUrl()}/riparazione` },
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    title: 'Costi riparazione auto usata per modello',
    description: 'Stime di manodopera e ricambi per marca, modello e anno, con i guasti più frequenti.',
    url: `${siteUrl()}/riparazione`,
    siteName: 'AutoEsperto',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Costi di riparazione auto' }],
  },
};

export default function RiparazionePage() {
  const popular = POPULAR_MODELS.slice(0, 18);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <PageHero
        crumb="Costi riparazione"
        photo="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1600&q=80"
        title="Quanto costa riparare un'auto?"
      >
        <p>
          Stime di manodopera e ricambi per marca, modello e anno, con guasti frequenti
          e quando conviene riparare.
        </p>
      </PageHero>
      <main className="page-body narrow">
        <AdBanner />

        <section className="mt-8 rounded-2xl bg-white border border-border p-6 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center">
              <Search className="w-5 h-5 text-accent" />
            </div>
            <p className="text-sm font-medium text-text-secondary">Scegli la marca e il modello per vedere la stima dettagliata.</p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-bold text-text-primary mb-3">Le auto più cercate</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {popular.map(({ make, model }) => (
              <Link
                key={`${make}-${model}`}
                href={`/riparazione/${slugify(make)}/${slugify(model)}`}
                className="rounded-xl border border-border bg-white p-4 hover:border-accent transition-colors"
              >
                <span className="text-sm font-bold text-text-primary">{make} {model}</span>
                <span className="block text-xs text-text-secondary mt-0.5">Stima costi di riparazione</span>
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
                href={`/riparazione/${make.slug}`}
                className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-text-primary hover:border-accent hover:text-accent transition-colors"
              >
                {make.name}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface-2 p-5">
            <Wrench className="w-6 h-6 text-accent" />
            <h3 className="text-sm font-bold text-text-primary mt-3">Stime per intervento</h3>
            <p className="text-xs text-text-secondary leading-relaxed mt-1">
              Freni, distribuzione, frizione, sospensioni, turbo: il costo indicativo di ogni riparazione per modello e anno.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface-2 p-5">
            <Euro className="w-6 h-6 text-accent" />
            <h3 className="text-sm font-bold text-text-primary mt-3">Manutenzione annua</h3>
            <p className="text-xs text-text-secondary leading-relaxed mt-1">
              Spesa media annua per tagliandi, consumabili e interventi, in base a segmento ed età.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface-2 p-5">
            <ShieldCheck className="w-6 h-6 text-accent" />
            <h3 className="text-sm font-bold text-text-primary mt-3">Guasti frequenti per marca</h3>
            <p className="text-xs text-text-secondary leading-relaxed mt-1">
              I problemi più comuni di ogni costruttore: cosa controllare prima di comprare usato.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface-2 p-5">
            <Timer className="w-6 h-6 text-accent" />
            <h3 className="text-sm font-bold text-text-primary mt-3">Riparare o cambiare?</h3>
            <p className="text-xs text-text-secondary leading-relaxed mt-1">
              Confronta il costo dell&apos;intervento con il valore di mercato per decidere.
            </p>
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-blue-100 bg-blue-50 p-6">
          <h2 className="text-lg font-bold text-text-primary">Prima di riparare, controlla il valore</h2>
          <p className="text-sm text-text-secondary leading-relaxed mt-2">
            Se l&apos;intervento costa più della metà del valore, spesso conviene cambiare auto. Verifica il prezzo
            medio dagli annunci.
          </p>
          <Link
            href="/valutazione"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
          >
            Valuta un&apos;auto gratis
          </Link>
        </section>

        <p className="text-xs text-text-tertiary mt-10 leading-relaxed">
          Le stime sono indicative e basate su tariffe medie di mercato per manodopera e ricambi. I costi reali variano in
          base a carrozzeria, officina, regione e condizioni del veicolo. Per una valutazione precisa, chiedi sempre un
          preventivo a 2–3 officine.
        </p>
      </main>

      <SiteFooter variant="full" />
    </div>
  );
}
