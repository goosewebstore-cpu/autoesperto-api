import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import PageHero from '@/components/PageHero';
import AdBanner from '@/components/ads/AdBanner';
import { HelpCircle, Search } from 'lucide-react';
import { getAllMakes } from '@/lib/catalogo';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';

export const metadata: Metadata = {
  title: 'Valutazione auto usate: prezzi per modello',
  description:
    'Prezzi medi reali dagli annunci per ogni marca e modello, con affidabilità e punti critici da controllare prima dell\'acquisto.',
  alternates: {
    canonical: '/valutazione',
    languages: { 'it-IT': `${siteUrl}/valutazione` },
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    title: 'Valutazione auto usate: prezzi per modello',
    description: 'Prezzi, affidabilità e punti critici delle auto usate per marca e modello.',
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
      a: 'Si stima confrontando gli annunci reali per lo stesso modello, correggendo per anno, chilometraggio, allestimento e condizioni.',
    },
    {
      q: 'Quanto costa un\'auto usata oggi?',
      a: 'Dipende da marca, modello, anno e chilometri. Nel catalogo trovi il prezzo medio reale con range minimo e massimo.',
    },
    {
      q: 'Perché il prezzo indicato può differire dal listino?',
      a: 'Il listino è un valore teorico. Il prezzo di mercato dipende da domanda, offerta, condizioni e chilometraggio.',
    },
    {
      q: 'Le valutazioni di AutoEsperto sono gratuite?',
      a: 'Sì, per marca, modello e anno sono gratuite, senza registrazione. Con una foto ottieni un report più dettagliato.',
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

      <PageHero
        crumb="Valutazione"
        photo="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1600&q=80"
        title="Valutazione auto usate: prezzi di mercato"
      >
        <p>
          Prezzo medio reale per ogni modello, calcolato dagli annunci in vendita,
          con affidabilità e punti critici.
        </p>
      </PageHero>

      <main className="page-body narrow">
        <AdBanner />

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
                Seleziona un modello dal catalogo. Ogni scheda mostra i prezzi per anno di produzione.
              </p>
            </div>
            <div className="bg-surface-2 rounded-xl p-4">
              <h3 className="text-sm font-bold text-text-primary">2. Confronta con gli annunci reali</h3>
              <p className="text-sm text-text-secondary leading-relaxed mt-1.5">
                Prezzo medio dagli annunci in vendita, con range minimo e massimo.
              </p>
            </div>
            <div className="bg-surface-2 rounded-xl p-4">
              <h3 className="text-sm font-bold text-text-primary">3. Controlla affidabilità e punti critici</h3>
              <p className="text-sm text-text-secondary leading-relaxed mt-1.5">
                Affidabilità e problemi più frequenti da verificare prima dell&apos;acquisto.
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
