import type { Metadata } from 'next';
import NeopatentatiClient from './NeopatentatiClient';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';

export const metadata: Metadata = {
  title: 'Auto per Neopatentati 2026: Limiti kW, Verifica e Migliori Modelli Usati | AutoEsperto',
  description:
    'Guida completa e strumento di calcolo per auto neopatentati 2026: verifica limiti rapporto potenza/tara (kW/t), potenza massima (105 kW) e scopri le migliori auto usate guidabili con prezzi reali.',
  keywords: [
    'auto per neopatentati',
    'limiti neopatentati 2026',
    'calcolo rapporto potenza tara',
    'migliori auto usate neopatentati',
    'auto neopatentati economiche',
    'fiat panda neopatentati',
    'clio neopatentati',
    'polo neopatentati',
    'nuovo codice della strada neopatentati',
  ],
  alternates: {
    canonical: `${siteUrl}/neopatentati`,
    languages: { 'it-IT': `${siteUrl}/neopatentati` },
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    title: 'Auto per Neopatentati 2026: Limiti e Migliori Modelli Usati | AutoEsperto',
    description:
      'Calcola se un\'auto è guidabile da un neopatentato (limiti 75 kW/t e 105 kW) ed esplora la lista delle migliori auto usate per neopatentati con quotazioni di mercato reali.',
    url: `${siteUrl}/neopatentati`,
    siteName: 'AutoEsperto',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Auto per Neopatentati 2026 — AutoEsperto' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Auto per Neopatentati 2026: Limiti kW e Modelli Usati',
    description: 'Verifica subito se l\'auto è guidabile da neopatentati con il calcolatore e la guida aggiornata 2026.',
    images: ['/og-image.png'],
  },
};

function JsonLd() {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Verifica e Calcolo Auto Neopatentati',
      url: `${siteUrl}/neopatentati`,
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'All',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'EUR',
      },
      description: 'Strumento per il calcolo del rapporto potenza/tara (kW/t) e verifica idoneità guida per neopatentati secondo il Codice della Strada.',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
        { '@type': 'ListItem', position: 2, name: 'Auto per Neopatentati', item: `${siteUrl}/neopatentati` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Quali sono i nuovi limiti per i neopatentati nel 2026?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Con la riforma del Codice della Strada, i neopatentati possono guidare veicoli con un rapporto potenza/tara fino a 75 kW per tonnellata (kW/t) e una potenza massima complessiva non superiore a 105 kW (circa 142 CV). Il limite dura per i primi 3 anni dal conseguimento della patente B.',
          },
        },
        {
          '@type': 'Question',
          name: 'Come si calcola il rapporto potenza/tara sul libretto?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sul Documento Unico o Carta di Circolazione, controlla il riquadro 2: il valore del rapporto potenza/tara è indicato alla riga (P.2)/(T) in kW/t. In alternativa, puoi dividere la potenza in kW (campo P.2) per la massa a vuoto espressa in tonnellate.',
          },
        },
        {
          '@type': 'Question',
          name: 'Quali sono le migliori auto usate per neopatentati sotto i 10.000€?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Tra i modelli più affidabili ed economici sul mercato dell\'usato figurano Fiat Panda 1.2 Fire, Fiat 500 1.2, Renault Clio 0.9 TCe / 1.0 SCe, Volkswagen Polo 1.0 MPI, Toyota Yaris 1.0 VVT-i o Hybrid, Ford Fiesta 1.1 e Lancia Ypsilon 1.2.',
          },
        },
        {
          '@type': 'Question',
          name: 'Cosa rischia chi guida un\'auto non idonea per neopatentati?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Guidare un veicolo superiore ai limiti per neopatentati comporta una sanzione amministrativa pecuniaria da circa 165 € a 660 € e la sospensione della patente di guida da 2 a 8 mesi.',
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

export default function NeopatentatiPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <JsonLd />
      <NeopatentatiClient />
      <SiteFooter />
    </div>
  );
}
