import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Car, Fuel, Euro, HelpCircle, Info } from 'lucide-react';
import { findMakeBySlug, findModelBySlug, slugify } from '@/lib/catalogo';
import { getModelYears, isValidModelYear } from '@/lib/model-years';
import { estimateConsumption } from '@/lib/consumi';
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

  const est = estimateConsumption(make.name, model, yearNum);
  const unit = est.isElectric ? 'kWh' : 'l';
  const title = `Consumi ${make.name} ${model} ${yearNum}: ${est.combined} ${unit}/100 km`;
  const description = `Consumi ${make.name} ${model} ${yearNum}: ${est.combined} ${unit}/100 km in ciclo combinato (${est.label.toLowerCase()}). Urbano, extraurbano e costo annuo di carburante.`;

  return {
    title,
    description,
    robots: { index: false, follow: true },
    alternates: {
      canonical: `/consumi/${resolved.make}/${resolved.model}/${resolved.year}`,
      languages: { 'it-IT': `${siteUrl()}/consumi/${resolved.make}/${resolved.model}/${resolved.year}` },
    },
    openGraph: {
      type: 'website',
      locale: 'it_IT',
      title,
      description,
      url: `${siteUrl()}/consumi/${resolved.make}/${resolved.model}/${resolved.year}`,
      siteName: 'AutoEsperto',
      images: [{ url: `${siteUrl()}/og/${resolved.make}/${slugify(model)}`, width: 1200, height: 630, alt: `${make.name} ${model} ${yearNum} consumi` }],
    },
  };
}

export default async function ConsumiYearPage({ params }: PageProps) {
  const resolved = await params;
  const yearNum = parseInt(resolved.year, 10);
  if (!Number.isFinite(yearNum)) notFound();
  const make = findMakeBySlug(resolved.make);
  if (!make) notFound();
  const model = findModelBySlug(make, resolved.model);
  if (!model) notFound();
  if (!isValidModelYear(make.name, model, yearNum)) notFound();

  const est = estimateConsumption(make.name, model, yearNum);
  const unit = est.unit === 'kWh/100 km' ? 'kWh/100 km' : 'l/100 km';

  const faq = [
    {
      q: `Quanto consuma una ${make.name} ${model} ${yearNum}?`,
      a: `La ${make.name} ${model} del ${yearNum} consuma in media ${est.combined} ${est.unit === 'kWh/100 km' ? 'kWh' : 'l'} per 100 km in ciclo combinato, ${est.urban} ${est.unit === 'kWh/100 km' ? 'kWh' : 'l'} in urbano e ${est.extraurban} ${est.unit === 'kWh/100 km' ? 'kWh' : 'l'} in extraurbano. Il giudizio è ${est.label.toLowerCase()}: la stima si basa su segmento (${est.segment}), marca ed età del veicolo.`,
    },
    {
      q: `Quanto costa percorrere 100 km con una ${make.name} ${model} ${yearNum}?`,
      a: `Con la ${make.name} ${model} del ${yearNum} si spendono circa ${est.costPer100km} € ogni 100 km, calcolati sul consumo combinato e sui prezzi medi del ${est.isElectric ? 'kWh domestico' : 'carburante'}.`,
    },
    {
      q: `Quanto costa di ${est.isElectric ? 'ricarica' : 'carburante'} in un anno una ${make.name} ${model} ${yearNum}?`,
      a: `Su una percorrenza media di 12.000 km all'anno, una ${make.name} ${model} del ${yearNum} costa circa ${est.annualCost} € di ${est.isElectric ? 'ricarica' : 'carburante'} ogni anno.`,
    },
    {
      q: `Come si confrontano i consumi della ${make.name} ${model} ${yearNum} con la media?`,
      a: `Il consumo combinato di ${est.combined} ${est.unit === 'kWh/100 km' ? 'kWh' : 'l'}/100 km è ${est.label.toLowerCase()} rispetto alla media del segmento ${est.segment}. Valuta il costo annuo stimato di ${est.annualCost} € per capire quanto incide il carburante sul costo di proprietà.`,
    },
    {
      q: `Vale la pena la ${make.name} ${model} ${yearNum} per i consumi?`,
      a: `La ${make.name} ${model} del ${yearNum} ha consumi ${est.label.toLowerCase()} (${est.combined} ${est.unit === 'kWh/100 km' ? 'kWh' : 'l'}/100 km in combinato). La risposta dipende dal tuo utilizzo: i consumi incidono tanto quanto la manutenzione e il valore di mercato, quindi confronta il costo totale di proprietà prima di decidere.`,
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
      { '@type': 'ListItem', position: 2, name: 'Consumi auto', item: `${siteUrl()}/consumi` },
      { '@type': 'ListItem', position: 3, name: make.name, item: `${siteUrl()}/consumi/${resolved.make}` },
      { '@type': 'ListItem', position: 4, name: model, item: `${siteUrl()}/consumi/${resolved.make}/${resolved.model}` },
      { '@type': 'ListItem', position: 5, name: String(yearNum), item: `${siteUrl()}/consumi/${resolved.make}/${resolved.model}/${resolved.year}` },
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
          <Link href="/consumi" className="hover:text-accent transition-colors">Consumi</Link>
          <span>/</span>
          <Link href={`/consumi/${resolved.make}`} className="hover:text-accent transition-colors">{make.name}</Link>
          <span>/</span>
          <Link href={`/consumi/${resolved.make}/${resolved.model}`} className="hover:text-accent transition-colors">{model}</Link>
          <span>/</span>
          <span className="text-text-secondary font-medium">{yearNum}</span>
        </nav>

        <Link
          href={`/consumi/${resolved.make}/${resolved.model}`}
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-5"
        >
          <ArrowLeft className="h-4 w-4" />
          Tutti gli anni {make.name} {model}
        </Link>

        <section>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-text-primary leading-[1.15]">
            Consumi {make.name} {model} {yearNum}
          </h1>
          <p className="text-text-secondary text-base leading-relaxed mt-3">
            Consumi stimati della {make.name} {model} del {yearNum} in urbano, extraurbano e combinato, con il costo
            per 100 km e il costo annuo di {est.isElectric ? 'ricarica' : 'carburante'}.
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-surface-2 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-text-primary">
                Consumo combinato: {est.combined} {unit}
              </h2>
              <p className="text-xs text-text-secondary leading-relaxed mt-1">
                {est.label} rispetto al segmento ({est.segment}). {est.note}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-white p-5">
            <Fuel className="w-6 h-6 text-accent" />
            <h2 className="text-sm font-bold text-text-primary mt-3">Urbano</h2>
            <p className="text-2xl font-extrabold text-text-primary mt-1">{est.urban} {unit}</p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-5">
            <Fuel className="w-6 h-6 text-accent" />
            <h2 className="text-sm font-bold text-text-primary mt-3">Extraurbano</h2>
            <p className="text-2xl font-extrabold text-text-primary mt-1">{est.extraurban} {unit}</p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-5">
            <Fuel className="w-6 h-6 text-accent" />
            <h2 className="text-sm font-bold text-text-primary mt-3">Combinato</h2>
            <p className="text-2xl font-extrabold text-text-primary mt-1">{est.combined} {unit}</p>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-white p-5">
            <Euro className="w-6 h-6 text-accent" />
            <h2 className="text-sm font-bold text-text-primary mt-3">Costo per 100 km</h2>
            <p className="text-2xl font-extrabold text-text-primary mt-1">≈ {est.costPer100km} €</p>
            <p className="text-xs text-text-secondary leading-relaxed mt-1">
              {est.isElectric ? 'Costo medio di ricarica domestica.' : 'Calcolato sul prezzo medio della benzina.'}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-5">
            <Euro className="w-6 h-6 text-accent" />
            <h2 className="text-sm font-bold text-text-primary mt-3">Costo annuo (12.000 km)</h2>
            <p className="text-2xl font-extrabold text-text-primary mt-1">≈ {est.annualCost} €</p>
            <p className="text-xs text-text-secondary leading-relaxed mt-1">
              Spesa stimata di {est.isElectric ? 'ricarica' : 'carburante'} su 12.000 km all&apos;anno.
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50">
          <h2 className="text-lg font-bold text-text-primary">Valore e costi totali prima di comprare</h2>
          <p className="text-sm text-text-secondary leading-relaxed mt-2">
            I consumi sono solo una parte del costo di proprietà: confrontali con il valore reale di mercato e la
            manutenzione della {make.name} {model} {yearNum}.
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
                href={`/consumi/${resolved.make}/${resolved.model}/${y}`}
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
            Domande frequenti sui consumi
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
          I consumi sono una stima indicativa basata su segmento, marca ed età del veicolo, con prezzi medi del
          carburante. I valori reali dipendono da motorizzazione, stile di guida e condizioni d&apos;uso.
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
