import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { Bot, Sparkles, MessageCircle, HelpCircle, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import AiAdvisorPageClient from './AiAdvisorPageClient';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';

export const revalidate = 86400; // 1 giorno di cache ISR

export const metadata: Metadata = {
  title: 'AI Car Advisor: Il Tuo Esperto Digitale per Comprare Auto Usata | AutoEsperto',
  description:
    'Chiedi all\'AI Car Advisor di AutoEsperto: "La compreresti?", "Quanto dovrei offrire?" e "Quali difetti controllare?". Consulente automotive indipendente e gratuito.',
  alternates: {
    canonical: `${siteUrl}/ai-car-advisor`,
    languages: { 'it-IT': `${siteUrl}/ai-car-advisor` },
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: `${siteUrl}/ai-car-advisor`,
    title: 'AI Car Advisor — Il consulente per comprare auto usate',
    description: 'Consigli esperti su quotazioni, affidabilità, margini di trattativa e difetti noti.',
    siteName: 'AutoEsperto',
    images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630, alt: 'AI Car Advisor AutoEsperto' }],
  },
};

const FAQS = [
  {
    q: 'Cosa posso chiedere all\'AI Car Advisor?',
    a: 'Puoi chiedere consigli su budget (es. "Migliore auto a 10.000€ per fare 15.000 km/anno"), valutazioni di annunci specifici ("La compreresti questa Panda a 9.500€?"), differenze tra motorizzazioni e controlli pre-acquisto.',
  },
  {
    q: 'L\'AI Car Advisor è imparziale?',
    a: 'Sì. AutoEsperto non è una concessionaria e non riceve provvigioni sulle vendite. Le risposte si basano esclusivamente su dati oggettivi di mercato, statistiche di affidabilità e costi reali di manutenzione.',
  },
  {
    q: 'Come calcola la strategia di offerta?',
    a: 'L\'algoritmo confronta il prezzo richiesto dall\'annuncio con la mediana dei prezzi reali in Italia, tenendo conto di anno, chilometraggio e svalutazione per suggerire un margine di trattativa realistico.',
  },
  {
    q: 'Il servizio di consulenza AI è a pagamento?',
    a: 'No, l\'AI Car Advisor è accessibile gratuitamente e senza obbligo di registrazione.',
  },
];

function AiAdvisorFallback() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <SiteHeader />
      <main className="flex-1 pb-16">
        <section className="bg-slate-900 text-white pt-10 pb-14 px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
              <Bot className="w-4 h-4 text-blue-400" /> Consulente Digitale Indipendente
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              AI Car Advisor: Il Tuo Esperto per Comprare Auto Usata
            </h1>
            <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto">
              Chiedi a un consulente imparziale: &quot;La compreresti?&quot;, &quot;Quanto dovrei offrire?&quot; e &quot;Quali difetti controllare?&quot;.
            </p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 -mt-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-4">
            <div className="h-48 w-full rounded-2xl bg-slate-100 animate-pulse border border-slate-200 flex items-center justify-center text-xs text-slate-500">
              Caricamento chat assistente…
            </div>
          </div>
        </div>

        {/* 3 Advisor Capabilities */}
        <section className="max-w-4xl mx-auto px-4 mt-16">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 text-center mb-8">
            Come ti aiuta l&apos;AI Car Advisor
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-center">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 grid place-items-center mx-auto mb-3 font-bold">1</div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">&quot;La compreresti?&quot;</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Verdetto immediato sul rapporto qualità/prezzo incrociando quotazione di mercato e affidabilità del modello.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-center">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 grid place-items-center mx-auto mb-3 font-bold">2</div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">&quot;Quanto dovrei offrire?&quot;</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Strategia di trattativa con margine stimato e controproposta calibrata sui difetti e prezzi concorrenti.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-center">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 grid place-items-center mx-auto mb-3 font-bold">3</div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">&quot;Quali difetti controllare?&quot;</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Checklist mirata per quella specifica motorizzazione (cinghia, catena, iniettori, consumi d&apos;olio, richiami).
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto px-4 mt-16">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            Domande frequenti sull&apos;AI Car Advisor
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

export default function AiAdvisorPage() {
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
      { '@type': 'ListItem', position: 2, name: 'AI Car Advisor', item: `${siteUrl}/ai-car-advisor` },
    ],
  };

  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'AI Car Advisor — AutoEsperto',
    url: `${siteUrl}/ai-car-advisor`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
    description: 'Consulente virtuale indipendente per acquisto auto usate: verifica quotazioni, suggerimenti di trattativa e difetti noti.',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([faqSchema, breadcrumbSchema, appSchema]) }}
      />
      <Suspense fallback={<AiAdvisorFallback />}>
        <AiAdvisorPageClient />
      </Suspense>
    </>
  );
}
