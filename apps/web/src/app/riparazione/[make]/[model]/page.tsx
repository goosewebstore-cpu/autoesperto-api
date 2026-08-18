import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Wrench } from 'lucide-react';
import { findMakeBySlug, findModelBySlug, slugify } from '@/lib/catalogo';
import { getModelYears } from '@/lib/model-years';
import { estimateRepair } from '@/lib/riparazione';
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

  const title = `Costi di riparazione ${make.name} ${model}: stima per anno`;
  const description = `Quanto costa riparare una ${make.name} ${model}? Stime di manodopera, ricambi e guasti frequenti, anno per anno, dal 2015 a oggi.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/riparazione/${resolved.make}/${resolved.model}`,
      languages: { 'it-IT': `${siteUrl()}/riparazione/${resolved.make}/${resolved.model}` },
    },
    openGraph: {
      type: 'website',
      locale: 'it_IT',
      title,
      description,
      url: `${siteUrl()}/riparazione/${resolved.make}/${resolved.model}`,
      siteName: 'AutoEsperto',
      images: [{ url: `${siteUrl()}/og/${resolved.make}/${slugify(model)}`, width: 1200, height: 630, alt: `${make.name} ${model} costi di riparazione` }],
    },
  };
}

export default async function RepairModelPage({ params }: PageProps) {
  const resolved = await params;
  const make = findMakeBySlug(resolved.make);
  if (!make) notFound();
  const model = findModelBySlug(make, resolved.model);
  if (!model) notFound();

  const latest = estimateRepair(make.name, model, CURRENT_YEAR);
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl()}/` },
      { '@type': 'ListItem', position: 2, name: 'Costi di riparazione', item: `${siteUrl()}/riparazione` },
      { '@type': 'ListItem', position: 3, name: make.name, item: `${siteUrl()}/riparazione/${resolved.make}` },
      { '@type': 'ListItem', position: 4, name: model, item: `${siteUrl()}/riparazione/${resolved.make}/${resolved.model}` },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <main className="max-w-3xl mx-auto px-5 pt-8 pb-20">
        <nav aria-label="Breadcrumb" className="text-xs text-text-tertiary mb-4 flex flex-wrap items-center gap-1.5">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <span>/</span>
          <Link href="/riparazione" className="hover:text-accent transition-colors">Costi riparazione</Link>
          <span>/</span>
          <Link href={`/riparazione/${resolved.make}`} className="hover:text-accent transition-colors">{make.name}</Link>
          <span>/</span>
          <span className="text-text-secondary font-medium">{model}</span>
        </nav>

        <Link
          href={`/riparazione/${resolved.make}`}
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-5"
        >
          <ArrowLeft className="h-4 w-4" />
          Tutti i modelli {make.name}
        </Link>

        <section>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-text-primary leading-[1.15]">
            Costi di riparazione {make.name} {model}
          </h1>
          <p className="text-text-secondary text-base leading-relaxed mt-3">
            Quanto costa riparare una {make.name} {model}? Stima di manodopera e ricambi per ogni anno, con i guasti più frequenti
            e i costi di manutenzione ordinaria.
          </p>
        </section>

        <AdBanner />

        <section className="mt-6 rounded-2xl border border-border bg-surface-2 p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-accent flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-text-primary">
                Manutenzione ordinaria: circa {latest.maintenanceMin}–{latest.maintenanceMax} € all&apos;anno
              </h2>
              <p className="text-xs text-text-secondary leading-relaxed mt-1">
                {latest.reliabilityNote} I costi crescono con l&apos;età del veicolo: scegli l&apos;anno per la stima dettagliata.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-bold text-text-primary mb-3">Stima per anno</h2>
          <div className="space-y-3">
            {getModelYears(make.name, model).slice(0, 11).map((yearNum) => {
              const est = estimateRepair(make.name, model, yearNum);
              return (
                <Link
                  key={yearNum}
                  href={`/riparazione/${resolved.make}/${resolved.model}/${yearNum}`}
                  className="block rounded-xl border border-border bg-white p-4 hover:border-accent transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-bold text-text-primary">{make.name} {model} {yearNum}</span>
                    <span className="text-sm font-extrabold text-accent whitespace-nowrap">{est.totalMin}–{est.totalMax} €</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed mt-1">
                    Rimessa a nuovo indicativa · manutenzione {est.maintenanceMin}–{est.maintenanceMax} €/anno
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50">
          <h2 className="text-lg font-bold text-text-primary">Valuta prima di riparare</h2>
          <p className="text-sm text-text-secondary leading-relaxed mt-2">
            Se il costo della riparazione si avvicina al valore dell&apos;auto, spesso conviene cambiarla. Controlla il prezzo
            reale di mercato e il punteggio di affidabilità della {make.name} {model} prima di spendere in officina.
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
              className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Vedi l&apos;affidabilità
            </Link>
          </div>
        </section>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      </main>

      <SiteFooter />
    </div>
  );
}
