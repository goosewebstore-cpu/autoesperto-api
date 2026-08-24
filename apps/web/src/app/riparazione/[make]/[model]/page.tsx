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
  const faq = [
    {
      q: `Quanto costa mantenere una ${make.name} ${model}?`,
      a: `Il costo stimato di manutenzione ordinaria annuale per ${make.name} ${model} varia tra ${latest.maintenanceMin} € e ${latest.maintenanceMax} €. I costi totali di ripristino per un esemplare usato sono stimati tra ${latest.totalMin} € e ${latest.totalMax} €.`,
    },
    {
      q: `Quali sono gli interventi più frequenti su ${make.name} ${model}?`,
      a: `Gli interventi più comuni includono tagliando completo (olio e filtri), dischi e pastiglie freni, cinghia/catena di distribuzione e verifica sospensioni/ammortizzatori in base al chilometraggio.`,
    },
    {
      q: `Conviene riparare una ${make.name} ${model} o cambiarla?`,
      a: `Se il preventivo di riparazione supera il 50-60% del valore commerciale residuo dell'auto, è consigliabile valutare la sostituzione. Confronta sempre il costo con la valutazione di mercato aggiornata.`,
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
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'EUR',
      lowPrice: String(latest.totalMin),
      highPrice: String(latest.totalMax),
    },
  };

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
            Guida ai costi di manutenzione e riparazione per {make.name} {model}. Scopri quanto costa mantenere
            quest&apos;auto e le stime per ogni anno di produzione.
          </p>
        </section>

        <AdBanner />

        <section className="mt-6 rounded-2xl border border-border bg-surface-2 p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 shrink-0 rounded-2xl bg-accent flex items-center justify-center text-white">
              <Wrench className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-text-primary">
                Costo stimato rimessa a nuovo: {latest.totalMin}–{latest.totalMax} €
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
                  rel="nofollow"
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

        <section className="mt-8">
          <h2 className="text-lg font-bold text-text-primary mb-1">Domande frequenti sui costi di riparazione</h2>
          <p className="text-sm text-text-tertiary mb-4">
            Prezzi medi in officina e consigli per risparmiare su {make.name} {model}.
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
          <h2 className="text-lg font-bold text-text-primary">Valuta prima di riparare</h2>
          <p className="text-sm text-text-secondary leading-relaxed mt-2">
            Se il costo della riparazione si avvicina al valore dell&apos;auto, spesso conviene cambiarla. Controlla il prezzo
            reale di mercato, i consumi e il punteggio di affidabilità della {make.name} {model} prima di spendere in officina.
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
              href={`/consumi/${resolved.make}/${resolved.model}`}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold text-text-primary hover:border-accent transition-colors"
            >
              Controlla i consumi
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
