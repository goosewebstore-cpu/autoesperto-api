import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Car, Gauge, HelpCircle, Info } from 'lucide-react';
import { findMakeBySlug, findModelBySlug, slugify } from '@/lib/catalogo';
import { getModelYears, isValidModelYear } from '@/lib/model-years';
import { estimateReliability } from '@/lib/affidabilita';
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

  const est = estimateReliability(make.name, model, yearNum);
  const title = `Affidabilità ${make.name} ${model} ${yearNum}: punteggio e guasti`;
  const description = `Punteggio di affidabilità ${make.name} ${model} ${yearNum}: ${est.score.toFixed(1)}/10 (${est.label}). Punti deboli, guasti frequenti e costi di manutenzione annui.`;

  return {
    title,
    description,
    robots: { index: false, follow: true },
    alternates: {
      canonical: `/affidabilita/${resolved.make}/${resolved.model}/${resolved.year}`,
      languages: { 'it-IT': `${siteUrl()}/affidabilita/${resolved.make}/${resolved.model}/${resolved.year}` },
    },
    openGraph: {
      type: 'website',
      locale: 'it_IT',
      title,
      description,
      url: `${siteUrl()}/affidabilita/${resolved.make}/${resolved.model}/${resolved.year}`,
      siteName: 'AutoEsperto',
      images: [{ url: `${siteUrl()}/og/${resolved.make}/${slugify(model)}`, width: 1200, height: 630, alt: `${make.name} ${model} ${yearNum} affidabilità` }],
    },
  };
}

export default async function ReliabilityYearPage({ params }: PageProps) {
  const resolved = await params;
  const yearNum = parseInt(resolved.year, 10);
  if (!Number.isFinite(yearNum)) notFound();
  const make = findMakeBySlug(resolved.make);
  if (!make) notFound();
  const model = findModelBySlug(make, resolved.model);
  if (!model) notFound();
  if (!isValidModelYear(make.name, model, yearNum)) notFound();

  const est = estimateReliability(make.name, model, yearNum);

  const faq = [
    {
      q: `Quanto è affidabile una ${make.name} ${model} ${yearNum}?`,
      a: `La ${make.name} ${model} del ${yearNum} ottiene un punteggio di affidabilità di ${est.score.toFixed(1)} su 10, giudicata ${est.label.toLowerCase()}. Il giudizio tiene conto di segmento, marca ed età del veicolo: per le versioni del ${yearNum} l'età conta ${est.age <= 3 ? 'a favore: la manutenzione ordinaria è tutto ciò che serve' : est.age <= 7 ? 'in modo contenuto: compaiono le prime usure prevedibili (freni, sospensioni, distribuzione)' : 'molto: le riparazioni aumentano e vanno previste con attenzione'}.`,
    },
    {
      q: `Quali sono i problemi noti della ${make.name} ${model} ${yearNum}?`,
      a: est.weaknesses.length > 0
        ? `I punti deboli più citati per ${make.name} ${model} del ${yearNum} sono: ${est.weaknesses.join('; ').toLowerCase()}. Sono segnali da controllare soprattutto sull'usato.`
        : `Per la ${make.name} ${model} del ${yearNum} non risultano problemi cronici particolari: l'affidabilità dipende soprattutto dalla regolarità della manutenzione.`,
    },
    {
      q: `Quanto costa mantenere una ${make.name} ${model} ${yearNum} ogni anno?`,
      a: `La manutenzione ordinaria di una ${make.name} ${model} del ${yearNum} costa in media ${est.maintenanceMin}–${est.maintenanceMax} € all'anno, includendo tagliando, consumabili e piccoli controlli.`,
    },
    {
      q: `Vale la pena comprare una ${make.name} ${model} ${yearNum} usata?`,
      a: `Una ${make.name} ${model} del ${yearNum} con punteggio ${est.score.toFixed(1)}/10 è una scelta ${est.score >= 8 ? 'molto solida' : est.score >= 7 ? 'equilibrata' : 'da valutare con attenzione'}: prima di comprare verifica storico tagliandi, km coerenti, distribuzione già fatta e assenza di incidenti. Controlla poi il valore reale di mercato per non pagare sopra la media.`,
    },
    {
      q: `Cosa controllare su una ${make.name} ${model} ${yearNum} prima dell'acquisto?`,
      a: `Per una ${make.name} ${model} del ${yearNum} controlla prima di tutto i punti deboli segnalati (${est.weaknesses.slice(0, 2).map((w) => w.toLowerCase()).join(' e ') || 'meccanica e sospensioni'}), poi storico tagliandi, chilometraggio, usura freni e gomme, e fai sempre una prova su strada di almeno 15–20 minuti.`,
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
      { '@type': 'ListItem', position: 2, name: 'Affidabilità auto', item: `${siteUrl()}/affidabilita` },
      { '@type': 'ListItem', position: 3, name: make.name, item: `${siteUrl()}/affidabilita/${resolved.make}` },
      { '@type': 'ListItem', position: 4, name: model, item: `${siteUrl()}/affidabilita/${resolved.make}/${resolved.model}` },
      { '@type': 'ListItem', position: 5, name: String(yearNum), item: `${siteUrl()}/affidabilita/${resolved.make}/${resolved.model}/${resolved.year}` },
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
          <Link href="/affidabilita" className="hover:text-accent transition-colors">Affidabilità</Link>
          <span>/</span>
          <Link href={`/affidabilita/${resolved.make}`} className="hover:text-accent transition-colors">{make.name}</Link>
          <span>/</span>
          <Link href={`/affidabilita/${resolved.make}/${resolved.model}`} className="hover:text-accent transition-colors">{model}</Link>
          <span>/</span>
          <span className="text-text-secondary font-medium">{yearNum}</span>
        </nav>

        <Link
          href={`/affidabilita/${resolved.make}/${resolved.model}`}
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-5"
        >
          <ArrowLeft className="h-4 w-4" />
          Tutti gli anni {make.name} {model}
        </Link>

        <section>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-text-primary leading-[1.15]">
            Affidabilità {make.name} {model} {yearNum}
          </h1>
          <p className="text-text-secondary text-base leading-relaxed mt-3">
            Punteggio di affidabilità della {make.name} {model} del {yearNum}: punti di forza, punti deboli, guasti
            frequenti e costi di manutenzione annui.
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-surface-2 p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 shrink-0 rounded-2xl bg-accent flex items-center justify-center text-white">
              <Gauge className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-text-primary">
                Punteggio: {est.score.toFixed(1)}/10 · {est.label}
              </h2>
              <p className="text-xs text-text-secondary leading-relaxed mt-1">
                {est.verdictNote} Manutenzione ordinaria: circa {est.maintenanceMin}–{est.maintenanceMax} € all&apos;anno.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-text-tertiary leading-relaxed">
              <strong>Nota metodologica:</strong> le valutazioni sono stime basate sull'incrocio di dati di richiami ufficiali, frequenza guasti e recensioni utenti. Non sostituiscono il parere di un meccanico sul singolo veicolo.
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-white p-5">
            <h2 className="text-sm font-bold text-text-primary">Punti di forza</h2>
            <ul className="mt-3 space-y-2">
              {est.strengths.map((strength) => (
                <li key={strength} className="flex gap-2.5 text-sm text-text-secondary leading-relaxed">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-white p-5">
            <h2 className="text-sm font-bold text-text-primary">Punti deboli noti</h2>
            <ul className="mt-3 space-y-2">
              {est.weaknesses.length > 0 ? (
                est.weaknesses.map((weakness) => (
                  <li key={weakness} className="flex gap-2.5 text-sm text-text-secondary leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                    <span>{weakness}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-text-secondary leading-relaxed">
                  Nessun problema noto particolare: la manutenzione ordinaria è la chiave per la longevità.
                </li>
              )}
            </ul>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50">
          <h2 className="text-lg font-bold text-text-primary">Prima di comprare: valore e costi</h2>
          <p className="text-sm text-text-secondary leading-relaxed mt-2">
            L&apos;affidabilità è solo metà della decisione: controlla il valore reale di mercato e i costi di riparazione
            della {make.name} {model} {yearNum}.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={`/valutazione/${resolved.make}/${resolved.model}/${resolved.year}`}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
            >
              Scopri quanto vale oggi
            </Link>
            <Link
              href={`/riparazione/${resolved.make}/${resolved.model}/${resolved.year}`}
              className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Stima i costi di riparazione
            </Link>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-base font-bold text-text-primary mb-3">Altri anni della {make.name} {model}</h2>
          <div className="flex flex-wrap gap-2">
            {nearbyYears.map((y) => (
              <Link
                key={y}
                href={`/affidabilita/${resolved.make}/${resolved.model}/${y}`}
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
            Domande frequenti sull&apos;affidabilità
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
          Il punteggio di affidabilità è una stima indicativa basata su segmento, marca, età e problemi noti. Non
          sostituisce un&apos;ispezione meccanica: per valutare lo stato reale, carica una foto dell&apos;auto.
        </p>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([faqSchema, breadcrumbSchema, carSchema]) }}
        />
      </main>

      <SiteFooter variant="compact" />
    </div>
  );
}
