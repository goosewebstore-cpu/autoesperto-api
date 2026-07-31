import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Car, HelpCircle, Info, ShieldCheck } from 'lucide-react';
import { findMakeBySlug, findModelBySlug, getAllMakes, slugify } from '@/lib/catalogo';
import ModelReportCard from '@/components/ModelReportCard';

interface PageProps {
  params: { make: string; model: string };
}

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

export function generateStaticParams() {
  return getAllMakes().flatMap((make) =>
    make.models.map((model) => ({ make: make.slug, model: slugify(model) }))
  );
}

export function generateMetadata({ params }: PageProps): Metadata {
  const make = findMakeBySlug(params.make);
  if (!make) return {};
  const model = findModelBySlug(make, params.model);
  if (!model) return {};

  const title = `Quanto costa una ${make.name} ${model} usata? Prezzo di mercato ${new Date().getFullYear()}`;
  const description = `Prezzo medio reale di ${make.name} ${model} usata: valore dagli annunci in vendita, valutazione di affidabilità e punti critici da controllare prima dell'acquisto. Analisi gratuita.`;

  return {
    title,
    description,
    alternates: { canonical: `/valutazione/${params.make}/${params.model}/` },
    openGraph: {
      type: 'website',
      locale: 'it_IT',
      title,
      description,
      url: `${siteUrl()}/valutazione/${params.make}/${params.model}/`,
      siteName: 'AutoEsperto',
    },
  };
}

export default function ModelValutazionePage({ params }: PageProps) {
  const make = findMakeBySlug(params.make);
  if (!make) notFound();
  const model = findModelBySlug(make, params.model);
  if (!model) notFound();

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
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-text-tertiary mb-4 flex flex-wrap items-center gap-1.5">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/valutazione/${params.make}/`} className="hover:text-accent transition-colors">
            {make.name}
          </Link>
          <span>/</span>
          <span className="text-text-secondary font-medium">{model}</span>
        </nav>

        <Link
          href={`/valutazione/${params.make}/`}
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-5"
        >
          <ArrowLeft className="w-4 h-4" />
          Tutti i modelli {make.name}
        </Link>

        {/* Hero */}
        <section>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-text-primary leading-[1.15]">
            Quanto costa una {make.name} {model} usata?
          </h1>
          <p className="text-text-secondary text-base leading-relaxed mt-3">
            Il prezzo medio reale di {make.name} {model} usata, calcolato dagli annunci in vendita,
            con la valutazione di affidabilità e i punti critici da controllare prima dell&apos;acquisto.
          </p>
        </section>

        <div className="mt-6">
          <ModelReportCard make={make.name} model={model} />
        </div>

        {/* FAQ */}
        <section className="mt-8">
          <h2 className="text-lg font-bold text-text-primary mb-1 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-accent" />
            Domande frequenti
          </h2>
          <p className="text-sm text-text-tertiary mb-4">
            Tutto quello che devi sapere prima di comprare una {make.name} {model} usata.
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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
          <p className="text-xs text-text-tertiary text-center mt-4">
            AutoEsperto fornisce valutazioni indicative e non sostituisce un&apos;ispezione professionale.
          </p>
        </div>
      </footer>
    </div>
  );
}
