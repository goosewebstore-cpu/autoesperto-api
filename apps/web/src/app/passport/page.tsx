import type { Metadata } from 'next';
import PassportIndexClient from './PassportIndexClient';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';


export const metadata: Metadata = {
  title: 'Profilo Digitale Auto & Passaporto Veicolo: Libretto, Scadenze e Storico | AutoEsperto',
  description:
    'Crea gratis il Profilo Digitale della tua auto: libretto e documento unico, storico tagliandi, promemoria scadenze bollo/revisione, monitoraggio valore di mercato e scheda QR per la vendita.',
  alternates: {
    canonical: `${siteUrl}/passport`,
    languages: { 'it-IT': `${siteUrl}/passport` },
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: `${siteUrl}/passport`,
    title: 'Profilo Digitale Auto & Passaporto Veicolo — AutoEsperto',
    description:
      'Organizza nel browser foto, documenti e storico della tua auto; condividi solo le sezioni che scegli.',
    siteName: 'AutoEsperto',
    images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630, alt: 'Profilo Digitale Auto AutoEsperto' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Profilo Digitale Auto & Passaporto Veicolo — AutoEsperto',
    description: 'Gestisci libretto, tagliandi, scadenze e valore di mercato della tua auto in un unico posto gratuito.',
    images: [`${siteUrl}/og-image.png`],
  },
};

const passportFaqs = [
  {
    q: "Cos'è il Profilo Digitale Auto (o Passaporto Digitale Auto)?",
    a: "È una scheda gratuita della tua auto salvata nel browser. Puoi aggiungere dati del veicolo, foto, tagliandi e promemoria. Il punteggio e un eventuale valore sono indicativi, non certificazioni.",
  },
  {
    q: 'Quanto costa creare e mantenere il Profilo Digitale Auto?',
    a: 'Il servizio è 100% gratuito. Non richiede abbonamenti e ti permette di gestire tutte le auto della tua famiglia o del tuo garage.',
  },
  {
    q: 'I miei dati personali e la targa sono protetti?',
    a: 'Il profilo chiede dati dell’auto, non nome o indirizzo. La targa è esclusa dal link; km, score, stima, foto e storico si condividono solo se li selezioni. Il link va trattato come pubblico e un recapito è facoltativo in modalità vendita.',
  },
  {
    q: 'Come aiuta il Profilo Digitale Auto quando voglio vendere la macchina?',
    a: 'Una cronologia documentata può aiutare chi compra a valutare il veicolo. Mostra solo i dati che vuoi condividere e distingui quelli dichiarati dai documenti disponibili.',
  },
  {
    q: 'Posso caricare foto del libretto per compilare i dati in automatico?',
    a: 'Sì. Grazie alla tecnologia AI OCR di AutoEsperto, puoi caricare una foto o PDF del Documento Unico di Circolazione: i campi (marca, modello, potenza, anno, classe Euro, telaio) vengono compilati istantaneamente.',
  },
];

export default function PassportPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'AutoEsperto Profilo Digitale Auto',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'EUR',
        },
        description:
          'Passaporto digitale del veicolo con libretto, storico manutenzione, promemoria scadenze e andamento valore.',
      },
      {
        '@type': 'FAQPage',
        mainEntity: passportFaqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.a,
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
          { '@type': 'ListItem', position: 2, name: 'Profilo Digitale Auto', item: `${siteUrl}/passport` },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PassportIndexClient />
    </>
  );
}
