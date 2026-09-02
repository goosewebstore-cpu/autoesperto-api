import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, Search, Link2, Sparkles, HelpCircle, ChevronRight } from 'lucide-react';
import AdAnalysisLandingClient from './AdAnalysisLandingClient';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';

export const revalidate = 86400; // 1 giorno di cache ISR

export const metadata: Metadata = {
  title: 'Controlla Annuncio Auto Usata: Trust Score e Valore Reale | AutoEsperto',
  description:
    'Incolla il link dell\'annuncio di AutoScout24, Subito o Facebook: scopri il Trust Score (0-100), il verdetto "La compreresti?", il valore reale e quanto offrire al venditore.',
  alternates: {
    canonical: `${siteUrl}/analizza-annuncio`,
    languages: { 'it-IT': `${siteUrl}/analizza-annuncio` },
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: `${siteUrl}/analizza-annuncio`,
    title: 'Controlla Annuncio Auto Usata — Trust Score & Verdetto',
    description: 'Analizza annunci auto da link o testo: calcola Trust Score, affidabilità e strategia di trattativa.',
    siteName: 'AutoEsperto',
    images: [{ url: `${siteUrl}/images/guide/10-segnali-annuncio-auto-usata.jpg`, width: 1200, height: 630, alt: 'Controlla Annuncio Auto Usata - AutoEsperto' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Controlla Annuncio Auto Usata: Trust Score e Valore Reale | AutoEsperto',
    description: 'Incolla il link dell\'annuncio: scopri Trust Score, verdetto, valore reale e quanto offrire al venditore.',
    images: [`${siteUrl}/images/guide/10-segnali-annuncio-auto-usata.jpg`],
  },
};

const FAQS = [
  {
    q: 'Quali portali di annunci sono supportati?',
    a: 'Puoi incollare link o testo di annunci provenienti da AutoScout24, Subito.it, Automobile.it, Facebook Marketplace o annunci inseriti da concessionari e privati.',
  },
  {
    q: 'Come viene calcolato il Trust Score (0-100)?',
    a: 'Il Trust Score valuta la coerenza tra chilometraggio dichiarato ed età del veicolo, allineamento del prezzo con le quotazioni di mercato reale, completezza delle informazioni e trasparenza dello storico manutentivo.',
  },
  {
    q: 'Come mi aiuta nella trattativa con il venditore?',
    a: 'AutoEsperto stima il margine di trattativa consigliato e genera le domande tecniche specifiche da porre al venditore (stato frizione, cinghia/catena, interventi documentati) prima di fissare l\'appuntamento.',
  },
  {
    q: 'Il controllo dell\'annuncio è gratuito?',
    a: 'Sì, l\'analisi è completamente gratuita, immediata e non richiede alcuna registrazione.',
  },
];

function AnalizzaAnnuncioFallback() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <SiteHeader />
      <main className="flex-1 pb-16">
        <section className="bg-slate-900 text-white pt-10 pb-14 px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
              <ShieldCheck className="w-4 h-4 text-blue-400" /> Analisi Annuncio &amp; Copilot Pre-Acquisto
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Controlla Annuncio Auto Usata: Trust Score e Valore Reale
            </h1>
            <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto">
              Incolla il link dell&apos;annuncio o il testo. AutoEsperto analizza Deal Score, Trust Score, rischi noti e ti genera le domande esatte da fare al venditore.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 -mt-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Link2 className="w-4 h-4 text-blue-600" />
              Incolla link AutoScout24, Subito.it o testo dell&apos;annuncio:
            </div>
            <div className="h-28 w-full rounded-2xl bg-slate-100 animate-pulse border border-slate-200 flex items-center justify-center text-xs text-slate-500">
              Caricamento strumento interattivo…
            </div>
          </div>
        </div>

        {/* 3 Step Guide */}
        <section className="max-w-4xl mx-auto px-4 mt-16">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 text-center mb-8">
            Come funziona l&apos;analisi annuncio
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-center">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 grid place-items-center mx-auto mb-3 font-bold">1</div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">Incolla link o testo</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Inserisci l&apos;URL di AutoScout24, Subito o il testo dell&apos;annuncio con marca, modello, anno e km.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-center">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 grid place-items-center mx-auto mb-3 font-bold">2</div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">Calcolo Trust Score</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                L&apos;algoritmo incrocia prezzo, km medi, difetti noti e congruenza dei dati per assegnare un punteggio 0-100.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-center">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 grid place-items-center mx-auto mb-3 font-bold">3</div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">Verdetto e Trattativa</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ottieni il prezzo consigliato per l&apos;offerta, le domande da fare al venditore e la checklist pre-acquisto.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto px-4 mt-16">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            Domande frequenti sul controllo annunci
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <details key={faq.q} className="bg-white rounded-2xl border border-slate-200/80 p-4 group">
                <summary className="font-semibold text-sm text-slate-900 cursor-pointer list-none flex items-center justify-between gap-3">
                  <span>{faq.q}</span>
                  <span className="text-blue-600 group-open:rotate-45 transition-transform text-lg leading-none shrink-0">+</span>
                </summary>
                <p className="text-xs text-slate-600 leading-relaxed mt-2.5 pt-2.5 border-t border-slate-100">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

export default function AnalizzaAnnuncioPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
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
      { '@type': 'ListItem', position: 2, name: 'Controlla annuncio auto usata', item: `${siteUrl}/analizza-annuncio` },
    ],
  };

  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Controllo Annunci Auto Usate — AutoEsperto',
    url: `${siteUrl}/analizza-annuncio`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
    description: 'Verifica annunci auto usate da link o testo: calcola Trust Score, Deal Score, valore reale di mercato e domande per il venditore.',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([faqSchema, breadcrumbSchema, appSchema]) }}
      />
      <Suspense fallback={<AnalizzaAnnuncioFallback />}>
        <AdAnalysisLandingClient />
      </Suspense>
    </>
  );
}
