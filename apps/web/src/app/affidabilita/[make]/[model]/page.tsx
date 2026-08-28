import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Gauge, CheckCircle2, AlertTriangle } from 'lucide-react';
import { findMakeBySlug, findModelBySlug, slugify } from '@/lib/catalogo';
import { getModelYears } from '@/lib/model-years';
import { estimateReliability } from '@/lib/affidabilita';
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

  const est = estimateReliability(make.name, model, CURRENT_YEAR);
  const title = `Affidabilità ${make.name} ${model}: punteggio e guasti`;
  const description = `Punteggio di affidabilità ${make.name} ${model}: ${est.score.toFixed(1)}/10 (${est.label}). Punti di forza, guasti frequenti e costi di manutenzione, anno per anno.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/affidabilita/${resolved.make}/${resolved.model}`,
      languages: { 'it-IT': `${siteUrl()}/affidabilita/${resolved.make}/${resolved.model}` },
    },
    openGraph: {
      type: 'website',
      locale: 'it_IT',
      title,
      description,
      url: `${siteUrl()}/affidabilita/${resolved.make}/${resolved.model}`,
      siteName: 'AutoEsperto',
      images: [{ url: `${siteUrl()}/og/${resolved.make}/${slugify(model)}`, width: 1200, height: 630, alt: `${make.name} ${model} affidabilità` }],
    },
  };
}

export default async function ReliabilityModelPage({ params }: PageProps) {
  const resolved = await params;
  const make = findMakeBySlug(resolved.make);
  if (!make) notFound();
  const model = findModelBySlug(make, resolved.model);
  if (!model) notFound();

  const latest = estimateReliability(make.name, model, CURRENT_YEAR);

  const faq = [
    {
      q: `Quanto è affidabile la ${make.name} ${model}?`,
      a: `La ${make.name} ${model} ottiene un punteggio di affidabilità stimato di ${latest.score.toFixed(1)}/10 (${latest.label}). ${latest.strengths.slice(0, 2).join('. ')}.`,
    },
    {
      q: `Quali sono i problemi più comuni di ${make.name} ${model}?`,
      a: latest.weaknesses && latest.weaknesses.length > 0
        ? `I punti da controllare con maggiore attenzione sulla ${make.name} ${model} includono: ${latest.weaknesses.join(', ')}.`
        : `Su ${make.name} ${model} si consiglia di verificare regolarmente la manutenzione ordinaria, l'impianto frenante e lo stato delle sospensioni.`,
    },
    {
      q: `Quanto costa la manutenzione annua di una ${make.name} ${model}?`,
      a: `La spesa ordinaria di manutenzione per ${make.name} ${model} è stimata tra ${latest.maintenanceMin} € e ${latest.maintenanceMax} € all'anno a seconda dell'anzianità e del chilometraggio.`,
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
    description: `Scheda di affidabilità e manutenzione per ${make.name} ${model} usata con problemi noti, richiami e punti di forza.`,
    mainEntityOfPage: `${siteUrl()}/affidabilita/${resolved.make}/${resolved.model}`,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl()}/` },
      { '@type': 'ListItem', position: 2, name: 'Affidabilità auto', item: `${siteUrl()}/affidabilita` },
      { '@type': 'ListItem', position: 3, name: make.name, item: `${siteUrl()}/affidabilita/${resolved.make}` },
      { '@type': 'ListItem', position: 4, name: model, item: `${siteUrl()}/affidabilita/${resolved.make}/${resolved.model}` },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <main className="max-w-3xl mx-auto px-5 pt-8 pb-20">
        <nav aria-label="Breadcrumb" className="text-xs text-text-tertiary mb-4 flex flex-wrap items-center gap-1.5">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <span>/</span>
          <Link href="/affidabilita" className="hover:text-accent transition-colors">Affidabilità</Link>
          <span>/</span>
          <Link href={`/affidabilita/${resolved.make}`} className="hover:text-accent transition-colors">{make.name}</Link>
          <span>/</span>
          <span className="text-text-secondary font-medium">{model}</span>
        </nav>

        <Link
          href={`/affidabilita/${resolved.make}`}
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-5"
        >
          <ArrowLeft className="h-4 w-4" />
          Tutti i modelli {make.name}
        </Link>

        <section>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-text-primary leading-[1.15]">
            Affidabilità {make.name} {model}
          </h1>
          <p className="text-text-secondary text-base leading-relaxed mt-3">
            Punteggio di affidabilità, punti di forza e punti deboli della {make.name} {model}, con i costi di
            manutenzione per ogni anno.
          </p>
        </section>

        <AdBanner />

        <section className="mt-6 rounded-2xl border border-border bg-surface-2 p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 shrink-0 rounded-2xl bg-accent flex items-center justify-center text-white">
              <Gauge className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-text-primary">
                Punteggio medio di affidabilità
              </h2>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-extrabold text-accent">{latest.score.toFixed(1)}</span>
                <span className="text-sm font-semibold text-text-secondary">/ 10 · {latest.label}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" /> Punti di forza
            </div>
            <ul className="mt-3 space-y-2 text-xs sm:text-sm text-text-primary">
              {latest.strengths.map((p) => (
                <li key={p} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
            <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" /> Punti deboli da controllare
            </div>
            <ul className="mt-3 space-y-2 text-xs sm:text-sm text-text-primary">
              {latest.weaknesses.map((c) => (
                <li key={c} className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-bold text-text-primary mb-3">Punteggio per anno</h2>
          <div className="space-y-3">
            {getModelYears(make.name, model).slice(0, 11).map((yearNum) => {
              const est = estimateReliability(make.name, model, yearNum);
              return (
                <Link
                  key={yearNum}
                  href={`/affidabilita/${resolved.make}/${resolved.model}/${yearNum}`}
                  rel="nofollow"
                  className="block rounded-xl border border-border bg-white p-4 hover:border-accent transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-bold text-text-primary">{make.name} {model} {yearNum}</span>
                    <span className="text-sm font-extrabold text-accent whitespace-nowrap">{est.score.toFixed(1)}/10</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed mt-1">
                    {est.label} · manutenzione {est.maintenanceMin}–{est.maintenanceMax} €/anno
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-8">
          <h2 className="text-lg font-bold text-text-primary mb-1">Domande frequenti sull&apos;affidabilità</h2>
          <p className="text-sm text-text-tertiary mb-4">
            Guasti comuni, punti deboli e costi di gestione di {make.name} {model}.
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

        <section className="mt-8 rounded-2xl bg-slate-950 p-6 text-white">
          <h2 className="text-lg font-extrabold tracking-tight">Hai trovato questa auto?</h2>
          <p className="mt-1.5 text-sm text-slate-300 leading-relaxed">
            Scopri se vale davvero quello che chiedono: confronta prezzo richiesto, valore di mercato e controlli da fare prima di comprarla.
          </p>
          <Link
            href={`/?make=${encodeURIComponent(make.name)}&model=${encodeURIComponent(model)}#scanner-section`}
            className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-slate-950 transition hover:bg-slate-200"
          >
            Analizza questa auto <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <h2 className="text-lg font-bold text-text-primary">Verifica valore e costi prima di comprare</h2>
          <p className="text-sm text-text-secondary leading-relaxed mt-2">
            Affidabilità e valore di mercato vanno letti insieme: controlla il prezzo medio reale della {make.name} {model},
            i consumi reali e i costi di riparazione prima di decidere.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={`/valutazione/${resolved.make}/${resolved.model}`}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
            >
              Scopri quanto vale oggi
            </Link>
            <Link
              href={`/consumi/${resolved.make}/${resolved.model}`}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold text-text-primary hover:border-accent transition-colors"
            >
              Vedi i consumi reali
            </Link>
            <Link
              href={`/riparazione/${resolved.make}/${resolved.model}`}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold text-text-primary hover:border-accent transition-colors"
            >
              Stima costi riparazione
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
