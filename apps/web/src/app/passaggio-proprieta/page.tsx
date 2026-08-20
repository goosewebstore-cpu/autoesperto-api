import type { Metadata } from 'next';
import PassaggioProprietaClient from './PassaggioProprietaClient';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';

export const metadata: Metadata = {
  title: 'Calcolo Passaggio di Proprietà Auto 2026: Costo per kW e Provincia | AutoEsperto',
  description:
    'Calcola subito il costo esatto del passaggio di proprietà auto in base a kW e Provincia. Tabella IPT 2026, costi fissi ACI/PRA, confronto fai-da-te vs agenzia e documenti necessari.',
  keywords: [
    'calcolo passaggio di proprietà',
    'costo passaggio auto usata',
    'passaggio di proprietà auto per kw',
    'tabella ipt 2026',
    'costo passaggio pra aci',
    'documenti passaggio di proprietà',
    'passaggio proprietà agenzia costo',
  ],
  alternates: {
    canonical: `${siteUrl}/passaggio-proprieta`,
    languages: { 'it-IT': `${siteUrl}/passaggio-proprieta` },
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    title: 'Calcolo Passaggio di Proprietà Auto 2026 | AutoEsperto',
    description:
      'Calcola in pochi secondi il costo totale del passaggio di proprietà della tua auto usata: IPT provinciale, costi ACI, Motorizzazione e confronto agenzia.',
    url: `${siteUrl}/passaggio-proprieta`,
    siteName: 'AutoEsperto',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Calcolo Passaggio Proprietà Auto — AutoEsperto' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calcolo Passaggio di Proprietà Auto 2026 | AutoEsperto',
    description: 'Calcolatore istantaneo IPT e costi passaggio di proprietà per marca, kW e provincia.',
    images: ['/og-image.png'],
  },
};

function JsonLd() {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Calcolo Passaggio di Proprietà Auto',
      url: `${siteUrl}/passaggio-proprieta`,
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'All',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'EUR',
      },
      description: 'Strumento gratuito per il calcolo del passaggio di proprietà auto in Italia in base a potenza (kW) e provincia di residenza.',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
        { '@type': 'ListItem', position: 2, name: 'Passaggio di Proprietà', item: `${siteUrl}/passaggio-proprieta` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Come si calcola il costo del passaggio di proprietà di un\'auto?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Il costo si calcola sommando i costi fissi (Emolumenti ACI di 27€, Imposta di Bollo di 32€/64€, Diritti Motorizzazione di 10,20€) all\'Imposta Provinciale di Trascrizione (IPT). Fino a 53 kW l\'IPT è fissa (da 150,81€ a 196,05€ a seconda della provincia); oltre i 53 kW si moltiplica ogni singolo kW per la tariffa provinciale (circa 4,56€/kW nella maggior parte delle province).',
          },
        },
        {
          '@type': 'Question',
          name: 'Quanto costa fare il passaggio di proprietà al PRA rispetto a un\'agenzia?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Effettuando il passaggio direttamente al PRA (STA pubblico) si pagano solo i costi vivi di legge (in media tra i 250€ e i 600€ a seconda dei kW). Rivolgendosi a un\'agenzia di pratiche auto o delegazione ACI privata si aggiunge il costo del servizio di intermediazione, che varia solitamente tra gli 80€ e i 150€.',
          },
        },
        {
          '@type': 'Question',
          name: 'Quali documenti servono per il passaggio di proprietà?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Servono: 1) Documento Unico di Circolazione e Proprietà (o vecchio Libretto + CdP cartaceo/digitale); 2) Documento d\'identità e Codice Fiscale dell\'acquirente e del venditore; 3) Atto di vendita firmato (autenticato in Comune, al PRA o in agenzia); 4) Modello TT2119 compilato per la Motorizzazione.',
          },
        },
        {
          '@type': 'Question',
          name: 'Chi deve pagare il passaggio di proprietà?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Per legge e consuetudine in Italia le spese del passaggio di proprietà sono a carico dell\'acquirente, salvo diversi accordi privati tra le parti stabiliti prima della vendita.',
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

export default function PassaggioProprietaPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <JsonLd />
      <PassaggioProprietaClient />
      <SiteFooter />
    </div>
  );
}
