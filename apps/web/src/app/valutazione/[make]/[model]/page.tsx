import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Car, HelpCircle, Info, MessageCircle, Send, Share2, ShieldCheck } from 'lucide-react';
import { findMakeBySlug, findModelBySlug, slugify } from '@/lib/catalogo';
import { getRecentModelYears } from '@/lib/model-years';
import ModelReportCard from '@/components/ModelReportCard';
import AdBanner from '@/components/ads/AdBanner';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { getSsrReport } from '@/lib/ssrReports';
import { POPULAR_MODELS } from '@/lib/popular';

interface PageProps {
  params: Promise<{ make: string; model: string }>;
}

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';
}

export const dynamicParams = true;
export const revalidate = 86400; // 1 giorno

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const make = findMakeBySlug(resolved.make);
  if (!make) return {};
  const model = findModelBySlug(make, resolved.model);
  if (!model) return {};

  const title = `Quanto costa una ${make.name} ${model} usata? Prezzo di mercato ${new Date().getFullYear()}`;
  const description = `Prezzo medio reale di ${make.name} ${model} usata: valore dagli annunci in vendita, valutazione di affidabilità e punti critici da controllare prima dell'acquisto. Analisi gratuita.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/valutazione/${resolved.make}/${resolved.model}`,
      languages: { 'it-IT': `${siteUrl()}/valutazione/${resolved.make}/${resolved.model}` },
    },
    openGraph: {
      type: 'website',
      locale: 'it_IT',
      title,
      description,
      url: `${siteUrl()}/valutazione/${resolved.make}/${resolved.model}`,
      siteName: 'AutoEsperto',
      images: [{ url: `${siteUrl()}/og/${resolved.make}/${slugify(model)}`, width: 1200, height: 630, alt: `Valutazione ${make.name} ${model} usata` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.png'],
    },
  };
}

export default async function ModelValutazionePage({ params }: PageProps) {
  const resolved = await params;
  const make = findMakeBySlug(resolved.make);
  if (!make) notFound();
  const model = findModelBySlug(make, resolved.model);
  if (!model) notFound();

  const isPopular = POPULAR_MODELS.some((p) => slugify(p.make) === resolved.make && slugify(p.model) === resolved.model);
  const initialReport = await getSsrReport(make.name, model, undefined, isPopular);

  const year = new Date().getFullYear();
  const faq = [
    {
      q: `Quanto costa una ${make.name} ${model} usata?`,
      a: `Il prezzo di una ${make.name} ${model} usata dipende da anno, chilometri, allestimento e condizioni. AutoEsperto analizza gli annunci reali in vendita e mostra il prezzo medio di mercato aggiornato, con il range minimo e massimo.`,
    },
    {
      q: `Quali sono i problemi più comuni della ${make.name} ${model}?`,
      a: `Ogni modello ha i suoi punti critici. AutoEsperto valuta l'affidabilità della ${make.name} ${model} e indica le criticità più frequenti da controllare prima dell'acquisto, oltre alle versioni consigliate e a quelle da evitare.`,
    },
    {
      q: `Qual è il prezzo giusto per una ${make.name} ${model} usata nel ${year}?`,
      a: `Il prezzo giusto è quello in linea con la media degli annunci reali di ${make.name} ${model} in vendita oggi. Confronta il prezzo richiesto con la valutazione di AutoEsperto per capire se è un buon affare, nella media o sopra.`,
    },
    {
      q: `Vale la pena comprare una ${make.name} ${model} usata?`,
      a: `Dipende da anno, stato e chilometraggio. AutoEsperto ti dà un punteggio di affidabilità, i punti di forza del modello e i consigli da seguire prima dell'acquisto, così puoi decidere con dati reali, non a sensazione.`,
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
  const relatedModels = make.models.filter((m) => m !== model).slice(0, 8);
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl()}/` },
      { '@type': 'ListItem', position: 2, name: 'Valutazione auto', item: `${siteUrl()}/valutazione` },
      { '@type': 'ListItem', position: 3, name: make.name, item: `${siteUrl()}/valutazione/${resolved.make}` },
      { '@type': 'ListItem', position: 4, name: model, item: `${siteUrl()}/valutazione/${resolved.make}/${resolved.model}` },
    ],
  };
  const price = initialReport?.price;
  const displayedPrice = price ? (price.market?.priceAvg ?? price.estimatedValue) : undefined;
  const carSchema = {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: `${make.name} ${model} usata`,
    brand: { '@type': 'Brand', name: make.name },
    model: model,
    description: `Valutazione e prezzo di mercato della ${make.name} ${model} usata: affidabilità, punti critici e range di prezzo.`,
    ...(displayedPrice
      ? {
          offers: {
            '@type': 'Offer',
            priceCurrency: 'EUR',
            price: displayedPrice,
            availability: 'https://schema.org/InStock',
            url: `${siteUrl()}/valutazione/${resolved.make}/${resolved.model}`,
          },
        }
      : {}),
  };

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <main className="max-w-3xl mx-auto px-5 pt-8 pb-20">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-text-tertiary mb-4 flex flex-wrap items-center gap-1.5">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/valutazione/${resolved.make}`} className="hover:text-accent transition-colors">
            {make.name}
          </Link>
          <span>/</span>
          <span className="text-text-secondary font-medium">{model}</span>
        </nav>

        <Link
          href={`/valutazione/${resolved.make}`}
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-5"
        >
          <ArrowLeft className="w-4 h-4" />
          Tutti i modelli {make.name}
        </Link>

        {/* Hero */}
        <section>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-text-primary leading-[1.15]">
            Quanto costa una {make.name} {model}{" "}usata?
          </h1>
          <p className="text-text-secondary text-base leading-relaxed mt-3">
            Il prezzo medio reale di {make.name} {model}{" "}usata, calcolato dagli annunci in vendita,
            con la valutazione di affidabilità e i punti critici da controllare prima dell&apos;acquisto.
          </p>
        </section>

        <div className="mt-6">
          <ModelReportCard make={make.name} model={model} initialReport={initialReport} />
        </div>

        <section className="mt-6 rounded-2xl bg-slate-950 p-6 text-white">
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

        <section className="mt-6">
          <p className="text-sm text-text-tertiary mb-3">Condividi questa valutazione:</p>
          <div className="flex flex-wrap gap-2">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Quanto costa una ${make.name} ${model} usata?`)} ${encodeURIComponent(`${siteUrl()}/valutazione/${resolved.make}/${slugify(model)}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${siteUrl()}/valutazione/${resolved.make}/${slugify(model)}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#1877F2] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              <Share2 className="w-4 h-4" />
              Facebook
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Quanto costa una ${make.name} ${model} usata?`)}&url=${encodeURIComponent(`${siteUrl()}/valutazione/${resolved.make}/${slugify(model)}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-80 transition-opacity"
            >
              <Send className="w-4 h-4" />
              X
            </a>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-base font-bold text-text-primary mb-3">Valutazione per anno di {model}</h2>
          <p className="text-sm text-text-tertiary mb-3">Prezzi e valutazioni specifiche per gli anni di produzione di {make.name} {model}.</p>
          <div className="flex flex-wrap gap-2">
            {getRecentModelYears(make.name, model, 5).map((y) => (
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

        <AdBanner />

        {/* Altri modelli */}
        {relatedModels.length > 0 && (
          <section className="mt-8">
            <h2 className="text-base font-bold text-text-primary mb-3">Altri modelli {make.name}</h2>
            <div className="flex flex-wrap gap-2">
              {relatedModels.map((related) => (
                <Link
                  key={related}
                  href={`/valutazione/${resolved.make}/${slugify(related)}`}
                  className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm font-semibold text-text-primary hover:border-accent hover:text-accent transition-colors"
                >
                  {related}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="mt-8">
          <h2 className="text-lg font-bold text-text-primary mb-1 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-accent" />
            Domande frequenti
          </h2>
          <p className="text-sm text-text-tertiary mb-4">
            Tutto quello che devi sapere prima di comprare una {make.name} {model}{" "}usata.
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

        {/* Note */}
        <p className="text-xs text-text-tertiary mt-8 flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
          Le valutazioni si basano sugli annunci reali in vendita e sui dati disponibili. Non sostituiscono un&apos;ispezione fisica.
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
