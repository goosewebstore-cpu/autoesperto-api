import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Fuel, Euro } from 'lucide-react';
import { findMakeBySlug, findModelBySlug, slugify } from '@/lib/catalogo';
import { getModelYears } from '@/lib/model-years';
import { estimateConsumption } from '@/lib/consumi';
import AdBanner from '@/components/ads/AdBanner';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

interface PageProps {
  params: Promise<{ make: string; model: string }>;
}

const CURRENT_YEAR = new Date().getFullYear();

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

  const unitLabel = latest.unit === 'kWh/100 km' ? 'kWh/100km' : 'L/100 km';
  const faq = [
    {
      q: `Quanto consuma la ${make.name} ${model}?`,
      a: `In ciclo combinato medio, la ${make.name} ${model} consuma circa ${latest.combined} ${unitLabel} (${latest.label.toLowerCase()}). In città il consumo è di circa ${latest.urban} ${unitLabel}, mentre in extraurbano è di circa ${latest.extraurban} ${unitLabel}.`,
    },
    {
      q: `Quanto costa il carburante all'anno per una ${make.name} ${model}?`,
      a: `Su una percorrenza tipica di 12.000 km/anno, la spesa stimata per ${latest.isElectric ? 'la ricarica elettrica' : 'il carburante'} è di circa ${latest.annualCost} € all'anno (circa ${latest.costPer100km} € ogni 100 km).`,
    },
    {
      q: `Come ridurre i consumi su ${make.name} ${model}?`,
      a: `Mantenere la corretta pressione degli pneumatici, effettuare tagliandi regolari (cambio filtri ed olio) e adottare uno stile di guida fluido riduce i consumi reali fino al 15-20%.`,
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  const carSchema = {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: `${make.name} ${model}`,
    brand: {
      '@type': 'Brand',
      name: make.name,
    },
    fuelConsumption: `${latest.combined} ${unitLabel}`,
  };

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
      <SiteHeader />

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

        <AdBanner />

        <section className="mt-6 rounded-2xl border border-border bg-surface-2 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-text-primary">
                Consumo combinato: {latest.combined} {unitLabel}
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
            <p className="text-2xl font-extrabold text-text-primary mt-1">{latest.urban} {unitLabel}</p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-5">
            <Fuel className="w-6 h-6 text-accent" />
            <h2 className="text-sm font-bold text-text-primary mt-3">Extraurbano</h2>
            <p className="text-2xl font-extrabold text-text-primary mt-1">{latest.extraurban} {unitLabel}</p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-5">
            <Fuel className="w-6 h-6 text-accent" />
            <h2 className="text-sm font-bold text-text-primary mt-3">Combinato</h2>
            <p className="text-2xl font-extrabold text-text-primary mt-1">{latest.combined} {unitLabel}</p>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-white p-5">
            <Euro className="w-6 h-6 text-accent" />
            <h2 className="text-sm font-bold text-text-primary mt-3">Costo per 100 km</h2>
            <p className="text-2xl font-extrabold text-text-primary mt-1">≈ {latest.costPer100km} €</p>
            <p className="text-xs text-text-secondary leading-relaxed mt-1">
              {latest.isElectric ? 'Costo medio di ricarica domestica.' : 'Calcolato sul prezzo medio della benzina/gasolio.'}
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
            {getModelYears(make.name, model).slice(0, 11).map((yearNum) => {
              const est = estimateConsumption(make.name, model, yearNum);
              return (
                <Link
                  key={yearNum}
                  href={`/consumi/${resolved.make}/${resolved.model}/${yearNum}`}
                  rel="nofollow"
                  className="block rounded-xl border border-border bg-white p-4 hover:border-accent transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-bold text-text-primary">{make.name} {model} {yearNum}</span>
                    <span className="text-sm font-extrabold text-accent whitespace-nowrap">{est.combined} {unitLabel}</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed mt-1">
                    {est.label} · circa {est.annualCost} €/anno di {est.isElectric ? 'ricarica' : 'carburante'}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-bold text-text-primary mb-1">Domande frequenti sui consumi</h2>
          <p className="text-sm text-text-tertiary mb-4">
            Consumi reali, autonomia e costi chilometrici di {make.name} {model}.
          </p>
          <div className="space-y-3">
            {faq.map((f) => (
              <details key={f.q} className="group bg-surface-2 rounded-xl p-4">
                <summary className="flex items-start justify-between gap-3 text-sm font-semibold text-text-primary cursor-pointer list-none">
                  {f.q}
                  <span className="text-accent text-lg leading-none group-open:rotate-45 transition-transform flex-shrink-0">+</span>
                </summary>
                <p className="text-sm text-text-secondary leading-relaxed mt-3">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <h2 className="text-lg font-bold text-text-primary">Valore e costi totali prima di comprare</h2>
          <p className="text-sm text-text-secondary leading-relaxed mt-2">
            I consumi sono una parte del costo di proprietà: confrontali con il valore reale di mercato, l&apos;affidabilità e i costi di manutenzione
            della {make.name} {model}.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={`/valutazione/${resolved.make}/${resolved.model}`}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
            >
              Scopri quanto vale oggi
            </Link>
            <Link
              href={`/affidabilita/${resolved.make}/${resolved.model}`}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold text-text-primary hover:border-accent transition-colors"
            >
              Vedi l&apos;affidabilità
            </Link>
            <Link
              href={`/riparazione/${resolved.make}/${resolved.model}`}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold text-text-primary hover:border-accent transition-colors"
            >
              Stima i costi di riparazione
            </Link>
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, faqSchema, carSchema]) }}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
