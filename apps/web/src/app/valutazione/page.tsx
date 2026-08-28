import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import PageHero from '@/components/PageHero';
import AdBanner from '@/components/ads/AdBanner';
import { HelpCircle, Search, Sparkles } from 'lucide-react';
import { getAllMakes } from '@/lib/catalogo';
import ValutazioneHubClient from './ValutazioneHubClient';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';

export const metadata: Metadata = {
  title: 'Valutazione Auto Usate: Prezzi Reali di Mercato 2026',
  description:
    'Calcola la valutazione reale della tua auto usata o confronta i prezzi medi di mercato di oltre 200 marche e 4.000 modelli. Stima istantanea gratuita con affidabilità e costi.',
  alternates: {
    canonical: `${siteUrl}/valutazione`,
    languages: { 'it-IT': `${siteUrl}/valutazione` },
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    title: 'Valutazione Auto Usate: Prezzi Reali di Mercato 2026 | AutoEsperto',
    description: 'Prezzi, affidabilità e punti critici delle auto usate per marca e modello.',
    url: `${siteUrl}/valutazione`,
    siteName: 'AutoEsperto',
    images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630, alt: 'Valutazione auto usate con AutoEsperto' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Valutazione Auto Usate: Prezzi Reali di Mercato 2026 | AutoEsperto',
    description: 'Prezzi, affidabilità e punti critici delle auto usate per marca e modello.',
    images: [`${siteUrl}/og-image.png`],
  },
};

export default function ValutazioneIndexPage() {
  const makes = getAllMakes();

  const faq = [
    {
      q: 'Come si calcola il valore di un\'auto usata?',
      a: 'Si stima confrontando gli annunci reali per lo stesso modello, correggendo per anno, chilometraggio, allestimento e condizioni con curve di svalutazione italiana 2026.',
    },
    {
      q: 'Quanto costa un\'auto usata oggi in Italia?',
      a: 'Dipende da marca, modello, anno e chilometri. Nel catalogo trovi il prezzo medio reale calcolato su migliaia di annunci con range minimo e massimo.',
    },
    {
      q: 'Perché il prezzo reale di mercato differisce dal listino eurotax?',
      a: 'I listini sono valori teorici tabellari. Il valore reale di mercato dipende dalla reale domanda e offerta, dalla reperibilità dei ricambi e dalle condizioni dell\'esemplare.',
    },
    {
      q: 'Le valutazioni di AutoEsperto sono gratuite?',
      a: 'Sì, tutte le valutazioni per marca, modello, anno e chilometri sono 100% gratuite e senza registrazione.',
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
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Valutazione auto', item: `${siteUrl}/valutazione` },
    ],
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

      <main className="max-w-5xl mx-auto px-5 pt-8 pb-20">
        <ValutazioneHubClient makes={makes} />

        <div className="mt-12">
          <AdBanner />
        </div>

        <section className="mt-12">
          <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-600" />
            Come funziona la valutazione
          </h2>
          <div className="grid sm:grid-cols-3 gap-3.5 mt-4">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
              <h3 className="text-sm font-bold text-slate-900">1. Scegli marca e modello</h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                Seleziona un modello dal catalogo o inseriscilo nel calcolatore in alto.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
              <h3 className="text-sm font-bold text-slate-900">2. Confronta con gli annunci reali</h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                Prezzo medio stimato dagli annunci in vendita, con range minimo e massimo.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
              <h3 className="text-sm font-bold text-slate-900">3. Controlla affidabilità e punti critici</h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                Affidabilità, costi di manutenzione e problemi più frequenti prima di comprare.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            Domande frequenti sulla valutazione auto
          </h2>
          <div className="space-y-3 mt-4">
            {faq.map((f) => (
              <details key={f.q} className="group bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
                <summary className="flex items-start justify-between gap-3 text-sm font-semibold text-slate-900 cursor-pointer list-none">
                  {f.q}
                  <span className="text-blue-600 text-lg leading-none group-open:rotate-45 transition-transform flex-shrink-0">+</span>
                </summary>
                <p className="text-xs text-slate-600 leading-relaxed mt-3">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <p className="text-xs text-slate-400 mt-8">
          Le valutazioni sono indicative e basate sui dati di mercato disponibili. Non sostituiscono un&apos;ispezione professionale.
        </p>
      </main>

      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([faqSchema, breadcrumbSchema]) }}
      />
    </div>
  );
}
