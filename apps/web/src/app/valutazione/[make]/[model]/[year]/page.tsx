import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Car, HelpCircle, Info } from 'lucide-react';
import { findMakeBySlug, findModelBySlug, getAllMakes, slugify } from '@/lib/catalogo';
import ModelReportCard from '@/components/ModelReportCard';

interface PageProps {
  params: Promise<{ make: string; model: string; year: string }>;
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
  const yearNum = parseInt(resolved.year, 10);
  if (!Number.isFinite(yearNum) || yearNum < 2010 || yearNum > CURRENT_YEAR + 1) return {};
  const make = findMakeBySlug(resolved.make);
  if (!make) return {};
  const model = findModelBySlug(make, resolved.model);
  if (!model) return {};

  const title = `${make.name} ${model} ${yearNum} usata: prezzo e valutazione`;
  const description = `Quanto costa una ${make.name} ${model} ${yearNum} usata? Prezzo medio di mercato, affidabilità e punti critici da controllare prima di comprare una ${make.name} ${model} del ${yearNum}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/valutazione/${resolved.make}/${resolved.model}/${resolved.year}`,
      languages: { 'it-IT': `${siteUrl()}/valutazione/${resolved.make}/${resolved.model}/${resolved.year}` },
    },
    openGraph: {
      type: 'website',
      locale: 'it_IT',
      title,
      description,
      url: `${siteUrl()}/valutazione/${resolved.make}/${resolved.model}/${resolved.year}`,
      siteName: 'AutoEsperto',
      images: [{ url: `${siteUrl()}/og/${resolved.make}/${slugify(model)}`, width: 1200, height: 630, alt: `${make.name} ${model} ${yearNum} usata` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.png'],
    },
  };
}

export default async function ModelYearValutazionePage({ params }: PageProps) {
  const resolved = await params;
  const yearNum = parseInt(resolved.year, 10);
  if (!Number.isFinite(yearNum) || yearNum < 2010 || yearNum > CURRENT_YEAR + 1) notFound();
  const make = findMakeBySlug(resolved.make);
  if (!make) notFound();
  const model = findModelBySlug(make, resolved.model);
  if (!model) notFound();

  const faq = [
    {
      q: `Quanto costa una ${make.name} ${model} ${yearNum} usata?`,
      a: `Il prezzo di una ${make.name} ${model} ${yearNum} usata dipende dai chilometri, dall'allestimento e dalle condizioni. AutoEsperto mostra il prezzo medio di mercato aggiornato agli annunci reali in vendita oggi, con range minimo e massimo.`,
    },
    {
      q: `Qual è il valore di mercato di una ${make.name} ${model} del ${yearNum}?`,
      a: `Il valore di mercato si calcola confrontando gli annunci reali di ${make.name} ${model} ${yearNum} in vendita. AutoEsperto aggrega questi dati e applica correzioni per chilometri e condizioni, fornendo una stima indicativa trasparente.`,
    },
    {
      q: `Cosa controllare prima di comprare una ${make.name} ${model} ${yearNum} usata?`,
      a: ` Prima di comprare una ${make.name} ${model} del ${yearNum}, verifica: storico tagliandi, revisioni regolari, km coerenti con l'età, usura interna, stato gomme e freni. AutoEsperto segnala anche i problemi noti specifici di questo modello.`,
    },
    {
      q: `La ${make.name} ${model} ${yearNum} è affidabile?`,
      a: `L'affidabilità dipende dal motore, dal cambio e dalla manutenzione ricevuta. AutoEsperto assegna un punteggio di affidabilità alla ${make.name} ${model} ${yearNum} e indica i punti di forza e le criticità più frequenti.`,
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
      { '@type': 'ListItem', position: 2, name: 'Valutazione auto', item: `${siteUrl()}/valutazione` },
      { '@type': 'ListItem', position: 3, name: make.name, item: `${siteUrl()}/valutazione/${resolved.make}` },
      { '@type': 'ListItem', position: 4, name: model, item: `${siteUrl()}/valutazione/${resolved.make}/${resolved.model}` },
      { '@type': 'ListItem', position: 5, name: String(yearNum), item: `${siteUrl()}/valutazione/${resolved.make}/${resolved.model}/${resolved.year}` },
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

  const nearbyYears = YEAR_RANGE.filter((y) => Math.abs(y - yearNum) <= 2 && y !== yearNum).slice(0, 5);

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
          <Link href="/valutazione" className="hover:text-accent transition-colors">Valutazione</Link>
          <span>/</span>
          <Link href={`/valutazione/${resolved.make}`} className="hover:text-accent transition-colors">{make.name}</Link>
          <span>/</span>
          <Link href={`/valutazione/${resolved.make}/${resolved.model}`} className="hover:text-accent transition-colors">{model}</Link>
          <span>/</span>
          <span className="text-text-secondary font-medium">{yearNum}</span>
        </nav>

        <Link
          href={`/valutazione/${resolved.make}/${resolved.model}`}
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-5"
        >
          <ArrowLeft className="h-4 w-4" />
          Tutti gli anni {make.name} {model}
        </Link>

        <section>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-text-primary leading-[1.15]">
            {make.name} {model} {yearNum} usata: prezzo e valutazione
          </h1>
          <p className="text-text-secondary text-base leading-relaxed mt-3">
            Quanto costa una {make.name} {model} del {yearNum} usata? Ecco il prezzo medio di mercato,
            l&apos;affidabilità del modello e i punti critici da controllare prima dell&apos;acquisto.
          </p>
        </section>

        <div className="mt-6">
          <ModelReportCard make={make.name} model={model} year={yearNum} />
        </div>

        <Link
          href={`/riparazione/${resolved.make}/${resolved.model}/${resolved.year}`}
          className="mt-4 flex items-center justify-between rounded-xl border border-border bg-surface-2 p-4 hover:border-accent transition-colors"
        >
          <span className="text-sm font-bold text-text-primary">
            Quanto costa riparare la {make.name} {model} {yearNum}?
          </span>
          <span className="text-accent text-sm font-bold">Stima costi →</span>
        </Link>

        <section className="mt-8">
          <h2 className="text-base font-bold text-text-primary mb-3">Altri anni della {make.name} {model}</h2>
          <div className="flex flex-wrap gap-2">
            {nearbyYears.map((y) => (
              <Link
                key={y}
                href={`/valutazione/${resolved.make}/${resolved.model}/${y}`}
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
            Domande frequenti sulla {make.name} {model} {yearNum}
          </h2>
          <p className="text-sm text-text-tertiary mb-4">
            Tutto quello che devi sapere prima di comprare una {make.name} {model} del {yearNum}.
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

        <p className="text-xs text-text-tertiary mt-8 flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
          Le valutazioni sono indicative e basate sui dati di mercato disponibili. Non sostituiscono un&apos;ispezione fisica del veicolo.
        </p>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([faqSchema, breadcrumbSchema]) }}
        />
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
              <Link href="/privacy" className="hover:text-text-primary transition-colors">Privacy</Link>
              <Link href="/cookie-policy" className="hover:text-text-primary transition-colors">Cookie</Link>
              <Link href="/terms" className="hover:text-text-primary transition-colors">Termini</Link>
              <Link href="/contatti" className="hover:text-text-primary transition-colors">Contatti</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
