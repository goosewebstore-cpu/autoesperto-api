import type { Metadata } from 'next';
import IncentiviAutoClient from './IncentiviAutoClient';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';

export const metadata: Metadata = {
  title: 'Incentivi Auto ed Ecobonus 2026: Calcolo Contributo e Fasce Rottamazione | AutoEsperto',
  description:
    'Calcola subito quanto sconto ti spetta con gli Incentivi Auto ed Ecobonus 2026: fasce CO2 (0-20, 21-60, 61-135 g/km), rottamazione Euro 0-5, maggiorazione ISEE e incentivo auto usate.',
  keywords: [
    'incentivi auto 2026',
    'ecobonus 2026',
    'calcolo incentivi rottamazione',
    'bonus isee auto 2026',
    'incentivi auto elettriche',
    'incentivi ibride plug in',
    'incentivi auto usate euro 6',
    'tabella ecobonus',
  ],
  alternates: {
    canonical: `${siteUrl}/incentivi-auto`,
    languages: { 'it-IT': `${siteUrl}/incentivi-auto` },
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    title: 'Incentivi Auto ed Ecobonus 2026: Calcolatore Ufficiale | AutoEsperto',
    description:
      'Scopri a quanto ammonta il tuo incentivo statale con il simulatore aggiornato: fasce di emissioni, rottamazione e bonus ISEE fino a 13.750 €.',
    url: `${siteUrl}/incentivi-auto`,
    siteName: 'AutoEsperto',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Incentivi Auto ed Ecobonus 2026 — AutoEsperto' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Incentivi Auto ed Ecobonus 2026 | AutoEsperto',
    description: 'Calcola il bonus rottamazione ed ecobonus statale per la tua nuova auto.',
    images: ['/og-image.png'],
  },
};

function JsonLd() {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Calcolo Incentivi Auto ed Ecobonus',
      url: `${siteUrl}/incentivi-auto`,
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'All',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'EUR',
      },
      description: 'Simulatore per il calcolo dei contributi statali Ecobonus ed incentivi rottamazione auto in Italia.',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
        { '@type': 'ListItem', position: 2, name: 'Incentivi Auto 2026', item: `${siteUrl}/incentivi-auto` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Come funzionano le fasce degli incentivi auto nel 2026?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Gli incentivi si dividono in tre fasce principali di emissioni CO2: 1) 0-20 g/km (auto 100% elettriche) con contributo da 6.000€ a 13.750€; 2) 21-60 g/km (ibride plug-in) con contributo da 4.000€ a 10.000€; 3) 61-135 g/km (benzina, diesel, GPL, mild/full hybrid Euro 6) con contributo da 1.500€ a 3.000€ (solo con rottamazione).',
          },
        },
        {
          '@type': 'Question',
          name: 'Come funziona la maggiorazione con ISEE sotto i 30.000€?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Per le persone fisiche con indicatore ISEE del nucleo familiare inferiore a 30.000 €, il contributo statale sulle fasce 0-20 g/km ed 21-60 g/km è maggiorato del +25%, portando l\'incentivo massimo per un\'auto elettrica con rottamazione Euro 0-2 fino a 13.750 €.',
          },
        },
        {
          '@type': 'Question',
          name: 'Ci sono incentivi per l\'acquisto di auto usate?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sì, è previsto un contributo fino a 2.000 € per l\'acquisto di un\'auto usata di classe non inferiore a Euro 6 con emissioni fino a 160 g/km e prezzo massimo di 25.000 € + IVA, a fronte della rottamazione di un veicolo fino a Euro 4 di proprietà da almeno 12 mesi.',
          },
        },
        {
          '@type': 'Question',
          name: 'Chi può richiedere l\'ecobonus e quali sono i tetti massimi di prezzo?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'L\'incentivo viene applicato direttamente dal concessionario come sconto sul prezzo di vendita. Il tetto massimo di listino (accessori inclusi, IVA esclusa) è di 35.000 € per le fasce 0-20 e 61-135 g/km (42.700 € IVA inclusa) e di 45.000 € per la fascia 21-60 g/km (54.900 € IVA inclusa).',
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

export default function IncentiviAutoPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <JsonLd />
      <IncentiviAutoClient />
      <SiteFooter />
    </div>
  );
}
