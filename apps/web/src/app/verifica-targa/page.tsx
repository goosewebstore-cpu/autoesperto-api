import type { Metadata } from 'next';
import Link from 'next/link';
import { Search, ShieldCheck, HelpCircle, ArrowRight, FileCheck, AlertTriangle } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import VerificaTargaClient from './VerificaTargaClient';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';

export const metadata: Metadata = {
  title: 'Verifica targa auto gratis — trova modello e valore | AutoEsperto',
  description:
    'Verifica la targa di un\'auto usata gratis: controlla il formato, scopri le informazioni disponibili, calcola il valore di mercato e controlla la revisione senza registrazione.',
  alternates: {
    canonical: `${siteUrl}/verifica-targa`,
    languages: { 'it-IT': `${siteUrl}/verifica-targa` },
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    title: 'Verifica targa auto gratis — trova modello e valore | AutoEsperto',
    description:
      'Verifica la targa di un\'auto usata gratis: scopri cosa controllare prima di comprare con AutoEsperto.',
    url: `${siteUrl}/verifica-targa`,
    siteName: 'AutoEsperto',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Verifica targa auto gratis' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Verifica targa auto gratis | AutoEsperto',
    description: 'Verifica formato targa, controlli e valore di mercato prima di comprare un\'auto usata.',
    images: ['/og-image.png'],
  },
};

const FAQS = [
  {
    q: 'Cosa posso verificare a partire dalla targa di un\'auto?',
    a: 'Dalla targa puoi verificare la regolarità della revisione periodica, la copertura assicurativa RCA, la presenza di fermi amministrativi o gravami (tramite visura PRA ACI) e risalire alla potenza in kW per calcolare il bollo.',
  },
  {
    q: 'Come faccio a controllare se i chilometri sono stati scalati?',
    a: 'Sul Portale dell\'Automobilista (servizio gratuito del MIT) puoi inserire la targa e verificare i chilometri registrati durante le ultime revisioni biennali obbligatorie.',
  },
  {
    q: 'La verifica targa su AutoEsperto è davvero gratuita?',
    a: 'Sì, lo strumento di AutoEsperto è gratuito al 100% e non richiede alcuna registrazione né inserimento di dati di pagamento.',
  },
  {
    q: 'Come calcolo il prezzo di mercato dell\'auto dopo aver verificato la targa?',
    a: 'Una volta identificati marca, modello e anno, puoi utilizzare lo Scanner Gratuito di AutoEsperto per confrontare il prezzo richiesto dal venditore con migliaia di annunci reali in vendita in Italia.',
  },
];

function JsonLd() {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Verifica Targa Auto Gratis — AutoEsperto',
      url: `${siteUrl}/verifica-targa`,
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Web',
      inLanguage: 'it-IT',
      description: 'Strumento online gratuito per la verifica della targa di autoveicoli e motoveicoli in Italia.',
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
        { '@type': 'ListItem', position: 2, name: 'Verifica targa', item: `${siteUrl}/verifica-targa` },
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

export default function VerificaTargaPage() {
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
              <span className="text-text-secondary font-medium">Verifica targa</span>
            </li>
          </ol>
        </nav>

        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-3.5 py-1.5 text-xs font-bold text-blue-700 mb-4">
            <Search className="h-3.5 w-3.5" />
            Controllo Targa Online
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Verifica targa auto gratis
          </h1>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Inserisci la targa per verificare il formato, scoprire cosa controllare prima dell&apos;acquisto e confrontare il prezzo di mercato con gli annunci reali.
          </p>
        </div>

        {/* Client Interactive Tool */}
        <VerificaTargaClient />

        {/* Guida informativa sui controlli via targa */}
        <section className="mt-16 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-4">
              Cosa puoi scoprire inserendo la targa di un&apos;auto usata
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              La targa automobilistica è la chiave di accesso a tutti i registri pubblici ufficiali italiani. Prima di versare un acconto o firmare una proposta di acquisto per un&apos;auto usata, è fondamentale eseguire una serie di controlli incrociati.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Ultima Revisione & Km</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dal 2018 i centri di revisione registrano i km sul Portale dell&apos;Automobilista. Verifica che non ci siano scalate di chilometraggio rispetto all&apos;ultimo collaudo.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Fermi Amministrativi (PRA)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Un veicolo con fermo fiscale dell&apos;Agenzia delle Entrate non può circolare su strada pubblica né essere radiato. Controlla sempre prima del passaggio di proprietà.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Valore Reale di Mercato</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Usa lo scanner di AutoEsperto per vedere a che prezzo vengono effettivamente venduti modelli identici per anno e chilometraggio.
              </p>
            </div>
          </div>

          {/* Banner Calcolo Bollo */}
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-600/10">
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-xl font-bold">Vuoi calcolare il bollo di quest&apos;auto?</h3>
              <p className="text-xs text-blue-100 max-w-lg leading-relaxed">
                Inserisci la potenza in kW o CV e la tua regione per conoscere l&apos;importo esatto del bollo auto 2026 e verificare l&apos;eventuale superbollo.
              </p>
            </div>
            <Link
              href="/calcolo-bollo"
              className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-white text-blue-700 px-5 py-3 text-sm font-bold shadow-md hover:bg-blue-50 transition-colors"
            >
              Calcola Bollo Gratis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Domande Frequenti FAQ */}
          <div className="pt-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              Domande frequenti sulla verifica targa
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
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
