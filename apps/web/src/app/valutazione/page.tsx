import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { Car, HelpCircle, Search } from 'lucide-react';
import { getAllMakes } from '@/lib/catalogo';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';

export const metadata: Metadata = {
  title: 'Valutazione auto usate: prezzi di mercato per marca e modello',
  description:
    'Quanto costa un\'auto usata? Prezzi medi reali dagli annunci in vendita per ogni marca e modello, con valutazione di affidabilità e punti critici da controllare.',
  alternates: {
    canonical: '/valutazione',
    languages: { 'it-IT': `${siteUrl}/valutazione` },
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    title: 'Valutazione auto usate per marca e modello | AutoEsperto',
    description: 'Consulta prezzi indicativi, affidabilità e punti critici delle auto usate per marca e modello.',
    url: '/valutazione',
    siteName: 'AutoEsperto',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Valutazione auto usate con AutoEsperto' }],
  },
};

export default function ValutazioneIndexPage() {
  const makes = getAllMakes();

  const faq = [
    {
      q: 'Come si calcola il valore di un\'auto usata?',
      a: 'Il valore di un\'auto usata si stima confrontando gli annunci reali in vendita per lo stesso modello, correggendo per anno, chilometraggio, allestimento e condizioni. AutoEsperto aggrega questi dati e mostra un prezzo medio di mercato aggiornato.',
    },
    {
      q: 'Quanto costa un\'auto usata oggi?',
      a: 'Il prezzo dipende molto da marca, modello, anno e chilometri. Scegli la tua auto nel catalogo per vedere il prezzo medio reale calcolato dagli annunci in vendita, con il range minimo e massimo.',
    },
    {
      q: 'Perché il prezzo indicato può differire dal listino?',
      a: 'Il listino è un valore di riferimento teorico. Il prezzo di mercato reale cambia in base a domanda e offerta, stato di conservazione, optional e chilometraggio. AutoEsperto usa gli annunci reali, non solo il listino.',
    },
    {
      q: 'Le valutazioni di AutoEsperto sono gratuite?',
      a: 'Sì, le valutazioni per marca, modello e anno sono gratuite e consultabili senza registrazione. Puoi anche analizzare una foto della tua auto per un report più dettagliato.',
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
      <SiteHeader />

      <main className="max-w-3xl mx-auto px-5 pt-8 pb-20">
        <nav aria-label="Breadcrumb" className="text-xs text-text-tertiary mb-4 flex items-center gap-1.5">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <span>/</span>
          <span className="text-text-secondary font-medium">Valutazione</span>
        </nav>

        <section>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-text-primary leading-[1.15]">
            Valutazione auto usate: prezzi di mercato
          </h1>
          <p className="text-text-secondary text-base leading-relaxed mt-3">
            Scegli la marca per vedere il prezzo medio reale di ogni modello, calcolato
            dagli annunci in vendita, con affidabilità e punti critici da controllare.
          </p>
        </section>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {makes.map((make) => (
            <Link
              key={make.name}
              href={`/valutazione/${make.slug}`}
              className="bg-surface-2 hover:bg-border/50 rounded-xl px-3.5 py-3 text-sm font-semibold text-text-primary transition-colors"
            >
              {make.name}
            </Link>
          ))}
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-bold text-text-primary mb-1 flex items-center gap-2">
            <Search className="w-5 h-5 text-accent" />
            Come funziona la valutazione
          </h2>
          <div className="space-y-3 mt-4">
            <div className="bg-surface-2 rounded-xl p-4">
              <h3 className="text-sm font-bold text-text-primary">1. Scegli marca e modello</h3>
              <p className="text-sm text-text-secondary leading-relaxed mt-1.5">
                Seleziona la tua auto dal catalogo per accedere alla scheda dedicata con prezzi per ogni anno di produzione.
              </p>
            </div>
            <div className="bg-surface-2 rounded-xl p-4">
              <h3 className="text-sm font-bold text-text-primary">2. Confronta con gli annunci reali</h3>
              <p className="text-sm text-text-secondary leading-relaxed mt-1.5">
                Il prezzo medio è calcolato dagli annunci in vendita, con range minimo e massimo per avere un&apos;idea realistica del mercato.
              </p>
            </div>
            <div className="bg-surface-2 rounded-xl p-4">
              <h3 className="text-sm font-bold text-text-primary">3. Controlla affidabilità e punti critici</h3>
              <p className="text-sm text-text-secondary leading-relaxed mt-1.5">
                Ogni modello include la valutazione di affidabilità e i problemi più frequenti da verificare prima dell&apos;acquisto.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-bold text-text-primary mb-1 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-accent" />
            Domande frequenti sulla valutazione auto
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

        <p className="text-xs text-text-tertiary mt-8">
          Le valutazioni sono indicative e basate sui dati di mercato disponibili. Non sostituiscono un&apos;ispezione professionale.
        </p>
      </main>

      <SiteFooter variant="full" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  );
}
