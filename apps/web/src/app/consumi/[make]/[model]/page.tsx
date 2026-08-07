import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Car, Fuel, Euro } from 'lucide-react';
import { findMakeBySlug, findModelBySlug, slugify } from '@/lib/catalogo';
import { estimateConsumption } from '@/lib/consumi';

interface PageProps {
  params: Promise<{ make: string; model: string }>;
}

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_RANGE: number[] = [];
for (let y = CURRENT_YEAR; y >= 2015; y--) YEAR_RANGE.push(y);

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';
}

export const dynamicParams = true;
export const revalidate = 86400;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const make = findMakeBySlug(resolved.make);
  if (!make) return {};
  const model = findModelBySlug(make, resolved.model);
  if (!model) return {};

  const est = estimateConsumption(make.name, model, CURRENT_YEAR);
  const title = `Consumi ${make.name} ${model}: litri per 100 km`;
  const description = `Consumi ${make.name} ${model}: ${est.combined} ${est.unit === 'kWh/100 km' ? 'kWh' : 'l'}/100 km combinati (${est.label.toLowerCase()}). Urbano, extraurbano e costo annuo, anno per anno.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/consumi/${resolved.make}/${resolved.model}`,
      languages: { 'it-IT': `${siteUrl()}/consumi/${resolved.make}/${resolved.model}` },
    },
    openGraph: {
      type: 'website',
      locale: 'it_IT',
      title,
      description,
      url: `${siteUrl()}/consumi/${resolved.make}/${resolved.model}`,
      siteName: 'AutoEsperto',
      images: [{ url: `${siteUrl()}/og/${resolved.make}/${slugify(model)}`, width: 1200, height: 630, alt: `${make.name} ${model} consumi` }],
    },
  };
}

export default async function ConsumiModelPage({ params }: PageProps) {
  const resolved = await params;
  const make = findMakeBySlug(resolved.make);
  if (!make) notFound();
  const model = findModelBySlug(make, resolved.model);
  if (!model) notFound();

  const latest = estimateConsumption(make.name, model, CURRENT_YEAR);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl()}/` },
      { '@type': 'ListItem', position: 2, name: 'Consumi auto', item: `${siteUrl()}/consumi` },
      { '@type': 'ListItem', position: 3, name: make.name, item: `${siteUrl()}/consumi/${resolved.make}` },
      { '@type': 'ListItem', position: 4, name: model, item: `${siteUrl()}/consumi/${resolved.make}/${resolved.model}` },
    ],
  };

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
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 pt-8 pb-20">
        <nav aria-label="Breadcrumb" className="text-xs text-text-tertiary mb-4 flex flex-wrap items-center gap-1.5">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <span>/</span>
          <Link href="/consumi" className="hover:text-accent transition-colors">Consumi</Link>
          <span>/</span>
          <Link href={`/consumi/${resolved.make}`} className="hover:text-accent transition-colors">{make.name}</Link>
          <span>/</span>
          <span className="text-text-secondary font-medium">{model}</span>
        </nav>

        <Link
          href={`/consumi/${resolved.make}`}
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-5"
        >
          <ArrowLeft className="h-4 w-4" />
          Tutti i modelli {make.name}
        </Link>

        <section>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-text-primary leading-[1.15]">
            Consumi {make.name} {model}
          </h1>
          <p className="text-text-secondary text-base leading-relaxed mt-3">
            Consumi stimati della {make.name} {model} in urbano, extraurbano e combinato, con il costo del carburante
            per 100 km e il costo annuo, anno per anno.
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-surface-2 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-text-primary">
                Consumo combinato: {latest.combined} {latest.unit === 'kWh/100 km' ? 'kWh/100 km' : 'l/100 km'}
              </h2>
              <p className="text-xs text-text-secondary leading-relaxed mt-1">
                {latest.label.toLowerCase()} rispetto al segmento ({latest.segment}). {latest.note}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-white p-5">
            <Fuel className="w-6 h-6 text-accent" />
            <h2 className="text-sm font-bold text-text-primary mt-3">Urbano</h2>
            <p className="text-2xl font-extrabold text-text-primary mt-1">{latest.urban} {latest.unit === 'kWh/100 km' ? 'kWh/100km' : 'l/100km'}</p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-5">
            <Fuel className="w-6 h-6 text-accent" />
            <h2 className="text-sm font-bold text-text-primary mt-3">Extraurbano</h2>
            <p className="text-2xl font-extrabold text-text-primary mt-1">{latest.extraurban} {latest.unit === 'kWh/100 km' ? 'kWh/100km' : 'l/100km'}</p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-5">
            <Fuel className="w-6 h-6 text-accent" />
            <h2 className="text-sm font-bold text-text-primary mt-3">Combinato</h2>
            <p className="text-2xl font-extrabold text-text-primary mt-1">{latest.combined} {latest.unit === 'kWh/100 km' ? 'kWh/100km' : 'l/100km'}</p>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-white p-5">
            <Euro className="w-6 h-6 text-accent" />
            <h2 className="text-sm font-bold text-text-primary mt-3">Costo per 100 km</h2>
            <p className="text-2xl font-extrabold text-text-primary mt-1">≈ {latest.costPer100km} €</p>
            <p className="text-xs text-text-secondary leading-relaxed mt-1">
              {latest.isElectric ? 'Costo medio di ricarica domestica.' : 'Calcolato sul prezzo medio della benzina.'}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-5">
            <Euro className="w-6 h-6 text-accent" />
            <h2 className="text-sm font-bold text-text-primary mt-3">Costo annuo (12.000 km)</h2>
            <p className="text-2xl font-extrabold text-text-primary mt-1">≈ {latest.annualCost} €</p>
            <p className="text-xs text-text-secondary leading-relaxed mt-1">
              Spesa stimata di {latest.isElectric ? 'ricarica' : 'carburante'} su 12.000 km all&apos;anno.
            </p>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-bold text-text-primary mb-3">Consumi per anno</h2>
          <div className="space-y-3">
            {YEAR_RANGE.map((yearNum) => {
              const est = estimateConsumption(make.name, model, yearNum);
              return (
                <Link
                  key={yearNum}
                  href={`/consumi/${resolved.make}/${resolved.model}/${yearNum}`}
                  className="block rounded-xl border border-border bg-white p-4 hover:border-accent transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-bold text-text-primary">{make.name} {model} {yearNum}</span>
                    <span className="text-sm font-extrabold text-accent whitespace-nowrap">{est.combined} {est.unit === 'kWh/100 km' ? 'kWh/100km' : 'l/100km'}</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed mt-1">
                    {est.label} · circa {est.annualCost} €/anno di {est.isElectric ? 'ricarica' : 'carburante'}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-8 rounded-2xl bg-accent p-6 text-white">
          <h2 className="text-lg font-bold">Valore e costi totali prima di comprare</h2>
          <p className="text-sm text-white/85 leading-relaxed mt-2">
            I consumi sono una parte del costo di proprietà: confrontali con il valore reale di mercato e la manutenzione
            della {make.name} {model}.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={`/valutazione/${resolved.make}/${resolved.model}`}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-accent hover:bg-white/90 transition-colors"
            >
              Scopri quanto vale oggi
            </Link>
            <Link
              href={`/riparazione/${resolved.make}/${resolved.model}`}
              className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Stima i costi di riparazione
            </Link>
          </div>
        </section>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
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
