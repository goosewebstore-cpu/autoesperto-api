import type { Metadata } from 'next';
import BlocchiTrafficoClient from './BlocchiTrafficoClient';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import RelatedTools from '@/components/RelatedTools';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';

export const metadata: Metadata = {
  title: 'Blocchi Traffico e Classi Euro 2026: Dove Puoi Circolare (Milano, Roma, Torino) | AutoEsperto',
  description:
    'Verifica subito se la tua auto può circolare nel 2026: limitazioni per Diesel Euro 3, 4, 5 e Benzina in Area B/C Milano, Fascia Verde Roma, Piemonte, Emilia e deroghe Move-In.',
  keywords: [
    'blocchi traffico 2026',
    'blocco diesel euro 5 2026',
    'area b milano chi puo circolare',
    'fascia verde roma limitazioni',
    'deroga move in km',
    'classe ambientale euro libretto v9',
    'blocco diesel torino',
    'auto euro 4 possono circolare',
  ],
  alternates: {
    canonical: `${siteUrl}/blocchi-traffico`,
    languages: { 'it-IT': `${siteUrl}/blocchi-traffico` },
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    title: 'Blocchi Traffico e Classi Euro 2026: Verifica Circolazione | AutoEsperto',
    description:
      'Verifica immediata per classe Euro e carburante: regole di circolazione in Area B/C Milano, Fascia Verde Roma, Bacino Padano e deroghe scatola nera Move-In.',
    url: `${siteUrl}/blocchi-traffico`,
    siteName: 'AutoEsperto',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Blocchi Traffico e Classi Euro 2026 — AutoEsperto' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blocchi Traffico e Classi Euro 2026 | AutoEsperto',
    description: 'Verifica le limitazioni del traffico e scopri se puoi circolare nella tua città.',
    images: ['/og-image.png'],
  },
};

function JsonLd() {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Verifica Blocchi del Traffico e Classi Ambientali Euro',
      url: `${siteUrl}/blocchi-traffico`,
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'All',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'EUR',
      },
      description: 'Strumento per verificare le limitazioni alla circolazione urbana e i blocchi del traffico per auto Diesel, Benzina, GPL e Ibride in Italia.',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
        { '@type': 'ListItem', position: 2, name: 'Blocchi Traffico 2026', item: `${siteUrl}/blocchi-traffico` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'I diesel Euro 5 possono circolare a Milano in Area B nel 2026?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A Milano in Area B i veicoli Diesel Euro 5 sono soggetti a divieto di circolazione dal lunedì al venerdì dalle 7:30 alle 19:30. È tuttavia possibile circolare aderendo al servizio MoVe-In (con un tetto chilometrico annuo) o usufruendo delle 25 giornate di deroga per i residenti.',
          },
        },
        {
          '@type': 'Question',
          name: 'Quali auto non possono entrare nella Fascia Verde di Roma?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Nella ZTL Fascia Verde di Roma è vietata la circolazione permanente (h24, lunedì-sabato) per le auto a Benzina fino a Euro 2 e per le auto a Gasolio (Diesel) fino a Euro 3. In caso di superamento dei limiti di inquinamento (domeniche ecologiche o emergenze smog), il blocco può essere esteso anche ai Diesel Euro 4.',
          },
        },
        {
          '@type': 'Question',
          name: 'Come si verifica la classe Euro della propria auto sulla carta di circolazione?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sul libretto di circolazione o Documento Unico, controlla il riquadro 2 alla lettera (V.9): troverai indicata la direttiva comunitaria antinquinamento (es. 2003/76/CE-B indica Euro 4, 715/2007*692/2008 indica Euro 5, 2018/1832 indica Euro 6d).',
          },
        },
        {
          '@type': 'Question',
          name: 'Come funziona la deroga Move-In per le auto bloccate?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Il sistema MoVe-In (Monitoraggio Veicoli Inquinanti), attivo in Lombardia, Piemonte ed Emilia-Romagna, consente di installare una scatola nera (black box) sull\'auto per ottenere un pacchetto di chilometri annuali percorribili liberamente anche nelle aree soggette a limitazioni, ad eccezione delle giornate di blocco totale emergenziale.',
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

export default function BlocchiTrafficoPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <JsonLd />
      <BlocchiTrafficoClient />
      <div className="max-w-3xl mx-auto px-5 pb-12">
        <RelatedTools currentHref="/blocchi-traffico" />
      </div>
      <SiteFooter />
    </div>
  );
}
