import type { Metadata } from 'next';
import MiglioriAutoUsateClient from './MiglioriAutoUsateClient';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';

export const metadata: Metadata = {
  title: 'Migliori Auto Usate per Budget 2026: Guida sotto 5k, 10k, 15k e 20k € | AutoEsperto',
  description:
    'Classifica e guida alle migliori auto usate da comprare nel 2026 per ogni fascia di budget: sotto 5.000€, 10.000€, 15.000€ e 20.000€. SUV, citycar, ibride più affidabili e convenienti.',
  keywords: [
    'migliori auto usate 2026',
    'migliori auto usate sotto 5000 euro',
    'migliori auto usate sotto 10000 euro',
    'migliori suv usati affidabili',
    'auto ibride usate migliori',
    'migliori citycar usate',
    'guida acquisto auto usata budget',
  ],
  alternates: {
    canonical: `${siteUrl}/migliori-auto-usate`,
    languages: { 'it-IT': `${siteUrl}/migliori-auto-usate` },
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    title: 'Migliori Auto Usate per Budget 2026 | AutoEsperto',
    description:
      'I modelli usati con il miglior rapporto qualità/prezzo, affidabilità comprovata e bassi costi di gestione divisi per fascia di prezzo.',
    url: `${siteUrl}/migliori-auto-usate`,
    siteName: 'AutoEsperto',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Migliori Auto Usate 2026 — AutoEsperto' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Migliori Auto Usate per Budget 2026 | AutoEsperto',
    description: 'Guida all\'acquisto delle migliori auto usate per ogni fascia di prezzo.',
    images: ['/og-image.png'],
  },
};

function JsonLd() {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Classifica e Guida alle Migliori Auto Usate per Fascia di Prezzo nel 2026',
      description: 'Guida comparativa indipendente per acquistare la migliore auto usata con budget sotto i 5.000€, 10.000€, 15.000€ e 20.000€.',
      author: {
        '@type': 'Organization',
        name: 'AutoEsperto',
        url: siteUrl,
      },
      publisher: {
        '@type': 'Organization',
        name: 'AutoEsperto',
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/icon-192.png`,
        },
      },
      datePublished: '2026-08-10',
      dateModified: '2026-08-20',
      mainEntityOfPage: `${siteUrl}/migliori-auto-usate`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
        { '@type': 'ListItem', position: 2, name: 'Migliori Auto Usate', item: `${siteUrl}/migliori-auto-usate` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Qual è la migliore auto usata da comprare sotto i 5.000 euro?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sotto i 5.000 euro i modelli con il miglior equilibrio tra affidabilità e bassi costi di manutenzione sono la Fiat Panda 1.2 Fire, la Fiat Grande Punto 1.2/1.4, la Toyota Yaris seconda serie 1.0/1.3 benzina, la Ford Fiesta 1.2 e la Renault Clio 1.2 16V.',
          },
        },
        {
          '@type': 'Question',
          name: 'Quali sono i SUV usati più affidabili tra 10.000 e 15.000 euro?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Nella fascia tra 10.000 e 15.000 euro spiccano la Dacia Duster (1.5 dCi o 1.0 ECO-G GPL), la Renault Captur 0.9/1.0 TCe, la Suzuki Vitara 1.6 VVT/Boosterjet, la Nissan Qashqai 1.5 dCi (post-2015) e la Peugeot 2008 1.6 HDi.',
          },
        },
        {
          '@type': 'Question',
          name: 'Quale auto ibrida usata conviene comprare nel 2026?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Le ibride con la tecnologia più solida e longeva sul mercato dell\'usato sono le Toyota con sistema Full Hybrid (Yaris Hybrid, Auris Hybrid, Prius e C-HR): non hanno frizione, alternatore né motorino d\'avviamento tradizionale e godono di un\'usura freni minima grazie alla frenata rigenerativa.',
          },
        },
      ],
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function MiglioriAutoUsatePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <JsonLd />
      <MiglioriAutoUsateClient />
      <SiteFooter />
    </div>
  );
}
