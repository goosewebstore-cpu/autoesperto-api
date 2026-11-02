import type { Metadata } from 'next';
import Link from 'next/link';
import { Calculator, HelpCircle, ArrowRight, ShieldCheck, Zap, Info } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import RelatedTools from '@/components/RelatedTools';
import CalcoloBolloClient from './CalcoloBolloClient';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';

export const metadata: Metadata = {
  title: 'Calcolo bollo auto 2026: quanto paghi? | AutoEsperto',
  description:
    'Stima indicativa del bollo auto da potenza, regione e classe Euro. Per l’importo dovuto inserisci la targa nel calcolatore ufficiale ACI.',
  alternates: {
    canonical: `${siteUrl}/calcolo-bollo`,
    languages: { 'it-IT': `${siteUrl}/calcolo-bollo` },
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    title: 'Calcolo bollo auto 2026: quanto paghi? | AutoEsperto',
    description:
      'Stima indicativa del bollo auto e collegamento al calcolatore ufficiale ACI per la verifica con targa.',
    url: `${siteUrl}/calcolo-bollo`,
    siteName: 'AutoEsperto',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Calcolo bollo auto 2026' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calcolo bollo auto 2026 | AutoEsperto',
    description: 'Calcola il bollo auto per kW o CV e regione.',
    images: ['/og-image.png'],
  },
};

const FAQS = [
  {
    q: 'Come si calcola il bollo auto?',
    a: 'La stima usa potenza in kW, classe ambientale e regione. Tariffe, riduzioni e scadenze possono variare: per conoscere l’importo dovuto verifica la targa sul sito ACI o della tua regione.',
  },
  {
    q: 'Che cos\'è il Superbollo e chi lo paga?',
    a: 'Il superbollo è un\'addizionale erariale pari a 20 € per ogni kW di potenza del motore eccedente la soglia dei 185 kW (circa 252 CV). L\'importo si riduce progressivamente al 60% dopo 5 anni dalla costruzione, al 30% dopo 10 anni, al 15% dopo 15 anni e si azzera dopo 20 anni.',
  },
  {
    q: 'Le auto ibride ed elettriche pagano il bollo?',
    a: 'Le agevolazioni per veicoli elettrici e ibridi variano per regione, tipo di veicolo e data di immatricolazione. Verifica la regola applicabile sul sito ACI o della tua regione.',
  },
  {
    q: 'Quando scade e come si paga il bollo auto?',
    a: 'La scadenza del bollo coincide solitamente con il mese successivo a quello di immatricolazione o alla scadenza del pagamento precedente. Può essere saldato tramite PagoPA, app IO, sportelli ACI, tabaccherie convenzionate o home banking.',
  },
];

function JsonLd() {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Calcolo Bollo Auto 2026 — AutoEsperto',
      url: `${siteUrl}/calcolo-bollo`,
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web',
      inLanguage: 'it-IT',
      description: 'Calcolatore online gratuito del bollo auto e superbollo per regione e classe Euro in Italia.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'EUR',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
        { '@type': 'ListItem', position: 2, name: 'Calcolo bollo auto', item: `${siteUrl}/calcolo-bollo` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.a,
        },
      })),
    },
  ];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function CalcoloBolloPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <JsonLd />

      <main className="max-w-4xl mx-auto px-5 pt-8 pb-20">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-text-tertiary mb-6">
          <ol className="inline-flex items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            </li>
            <li>/</li>
            <li>
              <span className="text-text-secondary font-medium">Calcolo bollo auto</span>
            </li>
          </ol>
        </nav>

        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-3.5 py-1.5 text-xs font-bold text-blue-700 mb-4">
            <Calculator className="h-3.5 w-3.5" />
            Stima indicativa · verifica ACI
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Calcolo bollo auto 2026
          </h1>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Inserisci i dati reali del libretto per una stima. L'importo dovuto si verifica con la targa sul sito ACI.
          </p>
        </div>

        {/* Calcolatore interattivo */}
        <CalcoloBolloClient />

        {/* Approfondimenti normativi ed esenzioni */}
        <section className="mt-16 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-4">
              Come funziona il calcolo del bollo auto in Italia
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Il bollo auto è un tributo regionale legato al possesso di un veicolo iscritto al Pubblico Registro Automobilistico (PRA). L&apos;importo non dipende dal valore di mercato dell&apos;auto, ma esclusivamente da parametri tecnici e geografici.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center">
                <Info className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Scaglioni di Potenza (100 kW)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                La tariffa standard applica un costo fisso al kW fino a 100 kW (circa 136 CV). I kW che superano questa soglia pagano una tariffa maggiorata del 50%.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Esenzioni Ecologiche</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Le agevolazioni per elettriche e ibride dipendono dalla regione e dalla prima immatricolazione. Controlla il caso specifico sul sito ACI.
              </p>
            </div>
          </div>

          {/* CTA Scanner */}
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-600/10">
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-xl font-bold">Stai valutando di comprare quest&apos;auto usata?</h3>
              <p className="text-xs text-blue-100 max-w-lg leading-relaxed">
                Oltre al bollo, confronta la stima del prezzo con gli annunci disponibili e controlla affidabilità e difetti noti del modello.
              </p>
            </div>
            <Link
              href="/#scanner-section"
              className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-white text-blue-700 px-5 py-3 text-sm font-bold shadow-md hover:bg-blue-50 transition-colors"
            >
              Analizza l&apos;auto gratis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* FAQ */}
          <div className="pt-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              Domande frequenti sul bollo auto
            </h2>
            <div className="space-y-4">
              {FAQS.map((f) => (
                <details key={f.q} className="group rounded-xl border border-slate-200 bg-slate-50 p-5 open:bg-white transition-colors">
                  <summary className="font-semibold text-sm text-slate-900 cursor-pointer list-none flex items-center justify-between">
                    {f.q}
                    <span className="text-blue-600 text-lg leading-none group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="text-xs text-slate-600 leading-relaxed mt-3 pt-3 border-t border-slate-200/60">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>

          <RelatedTools currentHref="/calcolo-bollo" />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
