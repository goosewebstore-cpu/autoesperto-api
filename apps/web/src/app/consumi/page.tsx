import type { Metadata } from 'next';
import Link from 'next/link';
import { Car, Fuel, Euro, Gauge, TrendingDown, Search } from 'lucide-react';
import { getAllMakes, POPULAR_MODELS, slugify } from '@/lib/catalogo';

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';
}

export const metadata: Metadata = {
  title: 'Consumi auto per marca, modello e anno | AutoEsperto',
  description:
    'Consumi stimati di ogni auto in urbano, extraurbano e combinato: litri per 100 km, costo per 100 km e costo annuo, per marca, modello e anno.',
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
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-border/60">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-5 h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Car className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-text-primary">
              Auto<span className="text-accent">Esperto</span>
            </span>
          </Link>
          <nav className="flex items-center gap-4 text-xs text-text-secondary">
            <Link href="/valutazione" className="hover:text-text-primary transition-colors">Valutazione</Link>
            <Link href="/riparazione" className="hover:text-text-primary transition-colors">Riparazione</Link>
            <Link href="/guide" className="hover:text-text-primary transition-colors">Guide</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 pt-10 pb-20">
        <section className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary leading-[1.15]">
            Quanto consuma la tua auto?
          </h1>
          <p className="text-text-secondary text-base leading-relaxed mt-4 max-w-xl mx-auto">
            Consumi stimati in urbano, extraurbano e combinato per marca, modello e anno, con il costo per 100 km e
            quanto spendi di carburante in un anno.
          </p>
        </section>

        <section className="mt-8 rounded-2xl bg-accent p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-white/15 flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm text-white/90">Scegli la marca e il modello per vedere i consumi stimati.</p>
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
              Quanto spendi di carburante per 100 km, calcolato sul consumo combinato.
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

        <section className="mt-12 rounded-2xl bg-accent p-6 text-white">
          <h2 className="text-lg font-bold">I consumi contano, ma anche valore e costi</h2>
          <p className="text-sm text-white/85 leading-relaxed mt-2">
            Consumi, manutenzione e valore di mercato definiscono il costo reale di un&apos;auto: controlla quanto vale il
            modello che ti interessa e quanto costa mantenerlo.
          </p>
          <Link
            href="/valutazione"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-accent hover:bg-white/90 transition-colors"
          >
            Valuta la tua auto gratis
          </Link>
        </section>

        <p className="text-xs text-text-tertiary mt-10 leading-relaxed">
          I consumi sono una stima indicativa basata su segmento, marca ed età del veicolo, con prezzi medi del carburante.
          I valori reali dipendono da motorizzazione, stile di guida, traffico e condizioni di manutenzione.
        </p>
      </main>

      <footer className="border-t border-border/60 mt-10">
        <div className="max-w-3xl mx-auto px-5 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-accent flex items-center justify-center">
                <Car className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-bold text-text-primary">AutoEsperto</span>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-text-secondary">
              <Link href="/valutazione" className="hover:text-text-primary transition-colors">Valutazione auto</Link>
              <Link href="/riparazione" className="hover:text-text-primary transition-colors">Costi riparazione</Link>
              <Link href="/guide" className="hover:text-text-primary transition-colors">Guide</Link>
              <Link href="/privacy" className="hover:text-text-primary transition-colors">Privacy</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
