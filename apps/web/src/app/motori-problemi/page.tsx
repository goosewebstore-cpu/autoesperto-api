import type { Metadata } from 'next';
import MotoriProblemiClient from './MotoriProblemiClient';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import RelatedTools from '@/components/RelatedTools';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';

export const metadata: Metadata = {
  title: 'Guida Problemi e Difetti Motori Auto: Quali Evitare sull\'Usato | AutoEsperto',
  description:
    'Guida completa ai problemi noti dei motori più diffusi sul mercato dell\'usato: 1.2 PureTech, 1.3 Multijet, 1.5 BlueHDi, 1.0 EcoBoost, 1.6 TDI, Cambio DSG DQ200. Sintomi, richiami e costi di riparazione.',
  keywords: [
    'problemi motori auto usate',
    'difetti 1.2 puretech cinghia',
    'problemi 1.3 multijet catena',
    'problemi 1.5 bluehdi albero camme',
    '1.0 ecoboost difetti',
    'problemi 1.6 tdi iniettori',
    'difetti cambio dsg dq200',
    'motori da evitare auto usate',
    'richiami ufficiali auto',
  ],
  alternates: {
    canonical: `${siteUrl}/motori-problemi`,
    languages: { 'it-IT': `${siteUrl}/motori-problemi` },
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    title: 'Guida Problemi e Difetti Motori Auto Usate | AutoEsperto',
    description:
      'I motori e cambi con difetti storici noti: analisi dettagliata dei guasti (PureTech, Multijet, BlueHDi, EcoBoost, TDI, DSG), sintomi premonitori e costi medi di riparazione.',
    url: `${siteUrl}/motori-problemi`,
    siteName: 'AutoEsperto',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Guida Problemi Motori Auto — AutoEsperto' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guida Problemi e Difetti Motori Auto Usate | AutoEsperto',
    description: 'Analisi dei motori con difetti noti e cosa controllare prima di comprare un\'auto usata.',
    images: ['/og-image.png'],
  },
};

function JsonLd() {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Guida ai Problemi e Difetti Noti dei Motori Auto più Diffusi',
      description: 'Analisi tecnica dei difetti ricorrenti su motori 1.2 PureTech, 1.3 Multijet, 1.5 BlueHDi, 1.0 EcoBoost, 1.6 TDI e cambi automatici DSG.',
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
      datePublished: '2026-08-15',
      dateModified: '2026-08-20',
      mainEntityOfPage: `${siteUrl}/motori-problemi`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
        { '@type': 'ListItem', position: 2, name: 'Problemi Motori Noti', item: `${siteUrl}/motori-problemi` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Qual è il problema principale del motore 1.2 PureTech?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Il problema principale del motore 1.2 PureTech (3 cilindri benzina) è la cinghia di distribuzione a bagno d\'olio: con il tempo la gomma si sfalda a contatto con il carburante nell\'olio, rilasciando detriti che intasano la succhieruola della pompa dell\'olio, provocando cali di pressione e possibile rottura del motore.',
          },
        },
        {
          '@type': 'Question',
          name: 'Perché la catena del 1.3 Multijet si rompe prima del previsto?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sui motori 1.3 Multijet usati prevalentemente in città o con cambi d\'olio ritardati (oltre i 15.000-20.000 km), la diluizione dell\'olio causata dalle rigenerazioni del DPF riduce la lubrificazione, accelerando l\'usura del tendicatena e provocando lo scavalcamento o la rottura della catena.',
          },
        },
        {
          '@type': 'Question',
          name: 'Come riconoscere se un cambio automatico DSG DQ200 è difettoso?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'I sintomi tipici del cambio DSG a secco DQ200 a 7 rapporti includono: strappi e vibrazioni in partenza o nel passaggio 1a-2a marcia a caldo, rumori metallici su asfalto sconnesso, e ritardo o blocco nell\'inserimento delle marce (spia chiave inglese o dicitura Anomalia Cambio).',
          },
        },
        {
          '@type': 'Question',
          name: 'Cosa controllare prima di acquistare un\'auto con motore a rischio?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Verifica sempre: 1) Storico certificato dei tagliandi con olio conforme alle specifiche del costruttore; 2) Presenza di fumo bianco/azzurro allo scarico o consumi anomali d\'olio; 3) Eventuali richiami ufficiali eseguiti presso la rete ufficiale tramite numero di telaio o targa.',
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

export default function MotoriProblemiPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <JsonLd />
      <MotoriProblemiClient />
      <div className="max-w-3xl mx-auto px-5 pb-12">
        <RelatedTools currentHref="/motori-problemi" />
      </div>
      <SiteFooter />
    </div>
  );
}
