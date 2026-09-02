import type { Metadata } from 'next';
import AutoFinderClient from './AutoFinderClient';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';

export const metadata: Metadata = {
  title: 'Auto Finder: Trova l\'Auto Usata Giusta per Te (Budget & Esigenze) | AutoEsperto',
  description:
    'Non sai quale auto usata comprare? Imposta budget, utilizzo e chilometri: il Matching Engine di AutoEsperto seleziona le migliori auto con Match Score / 100, affidabilità e consigli di trattativa.',
  alternates: {
    canonical: `${siteUrl}/auto-finder`,
    languages: { 'it-IT': `${siteUrl}/auto-finder` },
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: `${siteUrl}/auto-finder`,
    title: 'Auto Finder — Trova l\'auto usata ideale per il tuo budget',
    description: 'Matching Engine intelligente per trovare l\'auto perfetta in base a budget, consumi, affidabilità e costi di gestione.',
    siteName: 'AutoEsperto',
    images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630, alt: 'Auto Finder AutoEsperto' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Auto Finder: Trova l\'Auto Usata Giusta per Te | AutoEsperto',
    description: 'Matching Engine per auto usate con Match Score personalizzato.',
    images: [`${siteUrl}/og-image.png`],
  },
};

export const revalidate = 86400; // 1 giorno di cache ISR

const FAQS = [
  {
    q: 'Come funziona l\'Auto Finder di AutoEsperto?',
    a: 'Imposti il tuo budget massimo, i chilometri annui previsti e il tipo di utilizzo (città, famiglia, autostrada, lavoro). Il Matching Engine incrocia i dati di affidabilità, consumi e costi di gestione per calcolare un Match Score da 0 a 100.',
  },
  {
    q: 'I risultati considerano i costi reali di mantenimento (TCO)?',
    a: 'Sì. Per ogni vettura proposta calcoliamo il Total Cost of Ownership: stima del bollo auto, consumo reale di carburante sui km indicati, assicurazione RCA indicativa e manutenzione ordinaria.',
  },
  {
    q: 'Posso salvare le mie auto preferite?',
    a: 'Sì, puoi aggiungere qualsiasi vettura alla tua Buying Room personale per confrontarla e monitorarla prima dell\'acquisto.',
  },
];

export default function AutoFinderPage() {
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
      { '@type': 'ListItem', position: 2, name: 'Auto Finder', item: `${siteUrl}/auto-finder` },
    ],
  };

  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'AutoEsperto Auto Finder',
    url: `${siteUrl}/auto-finder`,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
    description: 'Matching engine per la ricerca personalizzata di auto usate in base a budget, affidabilità e costi reali.',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([faqSchema, breadcrumbSchema, appSchema]) }}
      />
      <AutoFinderClient />
    </>
  );
}
