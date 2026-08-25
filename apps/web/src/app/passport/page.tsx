import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const PassportIndexClient = dynamic(() => import('./PassportIndexClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-3 p-6 text-center">
        <div className="w-9 h-9 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Caricamento Garage Digitale...</p>
      </div>
    </div>
  ),
});

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
      'Il passaporto permanente della tua auto: conserva analisi, foto, documenti, valore di mercato, cronologia tagliandi e scadenze.',
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
    a: "È il passaporto permanente e gratuito della tua macchina su AutoEsperto. Raccoglie in un unico luogo digitale tutti i dati del libretto, la cronologia dei tagliandi, lo stato di salute meccanica (Vehicle Health Score), le scadenze di bollo e revisione, le foto e l'andamento del valore di mercato.",
  },
  {
    q: 'Quanto costa creare e mantenere il Profilo Digitale Auto?',
    a: 'Il servizio è 100% gratuito. Non richiede abbonamenti e ti permette di gestire tutte le auto della tua famiglia o del tuo garage.',
  },
  {
    q: 'I miei dati personali e la targa sono protetti?',
    a: 'Sì. Tutti i dati del tuo veicolo vengono salvati in modo sicuro e privato sul tuo dispositivo. Quando decidi di condividere la scheda della tua auto con un potenziale acquirente tramite QR code o link pubblico, i tuoi dati personali sensibili rimangono protetti.',
  },
  {
    q: 'Come aiuta il Profilo Digitale Auto quando voglio vendere la macchina?',
    a: 'Un veicolo con cronologia tagliandi documentata, scadenze in regola e analisi trasparente di mercato si vende fino al 40% più velocemente e permette di difendere il prezzo richiesto, offrendo massima fiducia a chi compra.',
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
