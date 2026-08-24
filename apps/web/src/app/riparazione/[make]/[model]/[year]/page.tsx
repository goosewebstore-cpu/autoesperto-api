import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Car, HelpCircle, Info, Wrench } from 'lucide-react';
import { findMakeBySlug, findModelBySlug, getAllMakes, slugify } from '@/lib/catalogo';
import { getModelYears, isValidModelYear } from '@/lib/model-years';
import { estimateRepair } from '@/lib/riparazione';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

interface PageProps {
  params: Promise<{ make: string; model: string; year: string }>;
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
  const yearNum = parseInt(resolved.year, 10);
  if (!Number.isFinite(yearNum)) return {};
  const make = findMakeBySlug(resolved.make);
  if (!make) return {};
  const model = findModelBySlug(make, resolved.model);
  if (!model) return {};
  if (!isValidModelYear(make.name, model, yearNum)) return {};

  const title = `Quanto costa riparare una ${make.name} ${model} ${yearNum}: stima dei costi`;
  const description = `Costi di riparazione ${make.name} ${model} ${yearNum}: stima di manodopera e ricambi per i guasti più frequenti, manutenzione annua e consiglio su quando conviene ripararla.`;

  return {
    title,
    description,
    robots: { index: false, follow: true },
    alternates: {
      canonical: `/riparazione/${resolved.make}/${resolved.model}`,
      languages: { 'it-IT': `${siteUrl()}/riparazione/${resolved.make}/${resolved.model}` },
    },
    openGraph: {
      type: 'website',
      locale: 'it_IT',
      title,
      description,
      url: `${siteUrl()}/riparazione/${resolved.make}/${resolved.model}/${resolved.year}`,
      siteName: 'AutoEsperto',
      images: [{ url: `${siteUrl()}/og/${resolved.make}/${slugify(model)}`, width: 1200, height: 630, alt: `${make.name} ${model} ${yearNum} costi di riparazione` }],
    },
  };
}

export default async function RepairYearPage({ params }: PageProps) {
  const resolved = await params;
  const yearNum = parseInt(resolved.year, 10);
  if (!Number.isFinite(yearNum)) notFound();
  const make = findMakeBySlug(resolved.make);
  if (!make) notFound();
  const model = findModelBySlug(make, resolved.model);
  if (!model) notFound();
  if (!isValidModelYear(make.name, model, yearNum)) notFound();

  const estimate = estimateRepair(make.name, model, yearNum);

  const faq = [
    {
      q: `Quanto costa riparare una ${make.name} ${model} ${yearNum}?`,
      a: `Per una ${make.name} ${model} del ${yearNum} la manutenzione ordinaria costa circa ${estimate.maintenanceMin}–${estimate.maintenanceMax} € all'anno. Riparazioni più importanti (freni, distribuzione, sospensioni, frizione) hanno costi che variano in base al guasto: la stima completa va da circa ${estimate.totalMin} a ${estimate.totalMax} € per rimettere a nuovo le parti più soggette a usura.`,
    },
    {
      q: `Quali sono i guasti più frequenti della ${make.name} ${model} ${yearNum}?`,
      a: estimate.commonFailures.join('; ').toLowerCase() + '.',
    },
    {
      q: `Conviene riparare una ${make.name} ${model} del ${yearNum} o rottamarla?`,
      a: `Come regola pratica conviene riparare quando il costo dell'intervento è inferiore al 50–70% del valore dell'auto. Per una ${make.name} ${model} ${yearNum}, controlla prima il valore reale di mercato: se la riparazione supera il valore dell'auto, spesso conviene cambiarla.`,
    },
    {
      q: `Quanto costa la manutenzione annuale di una ${make.name} ${model} ${yearNum}?`,
      a: `La manutenzione ordinaria di una ${make.name} ${model} del ${yearNum} costa in media ${estimate.maintenanceMin}–${estimate.maintenanceMax} € all'anno, includendo tagliando, piccoli consumabili e controlli.`,
    },
    {
      q: `Cosa controllare su una ${make.name} ${model} ${yearNum} usata per evitare riparazioni?`,
      a: `Prima di comprare una ${make.name} ${model} del ${yearNum} verifica storico tagliandi, distribuzione già fatta, usura freni e sospensioni e un chilometraggio coerente. Le pagine di valutazione AutoEsperto indicano anche i problemi noti del modello.`,
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl()}/` },
      { '@type': 'ListItem', position: 2, name: 'Costi di riparazione', item: `${siteUrl()}/riparazione` },
      { '@type': 'ListItem', position: 3, name: make.name, item: `${siteUrl()}/riparazione/${resolved.make}` },
      { '@type': 'ListItem', position: 4, name: model, item: `${siteUrl()}/riparazione/${resolved.make}/${resolved.model}` },
      { '@type': 'ListItem', position: 5, name: String(yearNum), item: `${siteUrl()}/riparazione/${resolved.make}/${resolved.model}/${resolved.year}` },
    ],
  };

  const carSchema = {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: `${make.name} ${model} ${yearNum}`,
    brand: { '@type': 'Brand', name: make.name },
    model: model,
    vehicleModelDate: String(yearNum),
  };

  const nearbyYears = getModelYears(make.name, model).filter((y) => Math.abs(y - yearNum) <= 2 && y !== yearNum).slice(0, 5);

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
          <Link href={`/riparazione/${resolved.make}/${resolved.model}`} className="hover:text-accent transition-colors">{model}</Link>
          <span>/</span>
          <span className="text-text-secondary font-medium">{yearNum}</span>
        </nav>

        <Link
          href={`/riparazione/${resolved.make}/${resolved.model}`}
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-5"
        >
          <ArrowLeft className="h-4 w-4" />
          Tutti gli anni {make.name} {model}
        </Link>

        <section>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-text-primary leading-[1.15]">
            Quanto costa riparare una {make.name} {model} {yearNum}
          </h1>
          <p className="text-text-secondary text-base leading-relaxed mt-3">
            Stima dei costi di manodopera e ricambi per la {make.name} {model} del {yearNum}: i guasti più frequenti,
            la manutenzione annua e quando conviene ripararla invece di cambiarla.
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-surface-2 p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-accent flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-text-primary">
                Stima del "rimesso a nuovo": {estimate.totalMin} € – {estimate.totalMax} €
              </h2>
              <p className="text-xs text-text-secondary leading-relaxed mt-1">
                Somma indicativa degli interventi più soggetti a usura per una {make.name} {model} {yearNum} (
                {estimate.ageLabel}). Manutenzione ordinaria: circa {estimate.maintenanceMin}–{estimate.maintenanceMax} € all&apos;anno.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-bold text-text-primary mb-1">Costi degli interventi più comuni</h2>
          <p className="text-sm text-text-tertiary mb-4">
            Prezzi indicativi in Italia per una {make.name} {model} del {yearNum}, manodopera a {estimate.segment.laborRate} €/ora.
          </p>
          <div className="space-y-3">
            {estimate.items.map((item) => (
              <div key={item.label} className="rounded-xl border border-border bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-text-primary">{item.label}</span>
                  <span className="text-sm font-extrabold text-accent whitespace-nowrap">{item.min}–{item.max} €</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed mt-1.5">{item.note}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-text-tertiary mt-3">
            Le stime sono indicative e variano in base a carrozzeria, officina e regione. Chiedi sempre un preventivo cartaceo a 2–3 officine.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-bold text-text-primary mb-3">Guasti più frequenti della {make.name} {model}</h2>
          <ul className="space-y-2">
            {estimate.commonFailures.map((failure) => (
              <li key={failure} className="flex gap-2.5 text-sm text-text-secondary leading-relaxed">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>{failure}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-text-secondary leading-relaxed mt-3">{estimate.reliabilityNote}</p>
        </section>

        <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50">
          <h2 className="text-lg font-bold text-text-primary">Riparare o rottamare? Dipende dal valore dell&apos;auto</h2>
          <p className="text-sm text-text-secondary leading-relaxed mt-2">
            Regola pratica: conviene riparare se l&apos;intervento costa meno del 50–70% del valore dell&apos;auto. Controlla
            il valore reale di mercato della {make.name} {model} {yearNum} prima di decidere.
          </p>
          <Link
            href={`/valutazione/${resolved.make}/${resolved.model}/${resolved.year}`}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
          >
            Scopri quanto vale oggi
          </Link>
        </section>

        <section className="mt-8">
          <h2 className="text-base font-bold text-text-primary mb-3">Altri anni della {make.name} {model}</h2>
          <div className="flex flex-wrap gap-2">
            {nearbyYears.map((y) => (
              <Link
                key={y}
                href={`/riparazione/${resolved.make}/${resolved.model}/${y}`}
                rel="nofollow"
                className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm font-semibold text-text-primary hover:border-accent hover:text-accent transition-colors"
              >
                {y}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-bold text-text-primary mb-1 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-accent" />
            Domande frequenti sui costi di riparazione
          </h2>
          <div className="space-y-3 mt-4">
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

        <p className="text-xs text-text-tertiary mt-8 flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
          I costi sono stime indicative basate su tariffe medie di mercato e non sostituiscono un preventivo reale. Per danni specifici, carica una foto dell&apos;auto e ottieni un&apos;analisi visiva.
        </p>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([faqSchema, breadcrumbSchema, carSchema]) }}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
