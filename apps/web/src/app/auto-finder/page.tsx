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

export default function AutoFinderPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AutoEsperto Auto Finder',
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AutoFinderClient />
    </>
  );
}
