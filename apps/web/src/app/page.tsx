import type { Metadata } from 'next';
import { guides, GUIDE_CATEGORIES } from '@/lib/guides';
import { GUIDE_PAGE_FEATURED } from '@/config/guides-positions';
import HomeClient from '@/components/HomeClient';
import { getAllMakes } from '@/lib/catalogo';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';

export const metadata: Metadata = {
  title: 'Valuta un’auto gratis | Report AutoEsperto da 1,99 €',
  description:
    'Ottieni un’anteprima gratuita da modello, foto o annuncio. Sblocca il report completo da 1,99 €, senza abbonamento.',
  keywords: [
    'analisi auto usata',
    'valutazione auto usata gratis',
    'verifica chilometri scalati',
    'controllo auto usata',
    'valore auto usata 2026',
    'comprare auto usata sicuro',
    'vendere auto usata prezzo giusto',
    'report auto usata',
  ],
  alternates: {
    canonical: '/',
    languages: { 'it-IT': `${siteUrl}/` },
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    title: 'Valuta un’auto gratis | Report AutoEsperto da 1,99 €',
    description:
      'Anteprima gratuita da modello, foto o annuncio; report completo da 1,99 € e pacchetto da 4 report (3 + 1 omaggio) a 4,99 €, senza rinnovo.',
    url: siteUrl,
    siteName: 'AutoEsperto',
    images: [{ url: '/images/guide/analisi-auto-report-comprare-vendere.jpg', width: 1200, height: 630, type: 'image/jpeg', alt: 'AutoEsperto - Analisi auto usata gratis 2026' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anteprima Auto gratuita e report completi | AutoEsperto',
    description: 'Valuta un’auto gratis e sblocca un report completo da 1,99 €. Pagamento una tantum, senza rinnovo.',
    images: ['/images/guide/analisi-auto-report-comprare-vendere.jpg'],
  },
};

export const revalidate = 86400;

const homeFaqs = [
  {
    q: 'E davvero gratis analizzare la mia auto usata?',
    a: 'L’anteprima è gratuita: puoi partire da modello, foto o annuncio. Il report completo costa 1,99 €; il pacchetto da 4,99 € include 3 report acquistati e 1 in omaggio. AutoEsperto PRO per professionisti include 30 report + 3 omaggio per ciclo a 29,99 €/mese.',
  },
  {
    q: 'Come capisco se i chilometri di un annuncio auto usata sono stati scalati?',
    a: "L’età e i chilometri dichiarati possono suggerire controlli da fare, ma non certificano i chilometri reali. Per verificare lo storico servono documenti e fonti ufficiali.",
  },
  {
    q: 'Mi conviene comprare o vendere questa auto usata?',
    a: "L’analisi combina i dati che confermi, stime e annunci comparabili quando disponibili, per preparare i controlli pre-acquisto.",
  },
  {
    q: 'Come capisco se un annuncio auto usata e un buon prezzo?',
    a: "Carica la foto o lo screenshot dell'annuncio (Subito.it, AutoScout24, Facebook Marketplace): AutoEsperto prova a riconoscere il veicolo e confronta il prezzo richiesto con una stima indicativa e con i dati disponibili.",
  },
  {
    q: 'Vendere la mia auto: qual e il prezzo giusto per non rimetterci?',
    a: "Nella stima vendita trovi il valore di mercato, il prezzo per una vendita veloce e il prezzo consigliato, piu l'annuncio pronto da pubblicare. Gratis.",
  },
  {
    q: 'Quali difetti ha il motore di questa auto?',
    a: "Nella sezione Difetti Motori puoi cercare il modello e scoprire i problemi piu frequenti segnalati dagli utenti, i recall ufficiali e i costi medi di riparazione.",
  },
];

function HomeJsonLd({ stats }: { stats: { makes: number; models: number } }) {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'AutoEsperto',
      url: `${siteUrl}/`,
      applicationCategory: 'AutomotiveApplication',
      operatingSystem: 'All',
      inLanguage: 'it-IT',
      description: 'Analisi auto usata con AI: valore di mercato, difetti del modello, verifica km e report completo.',
      offers: [
        { '@type': 'Offer', name: 'Anteprima gratuita', price: '0', priceCurrency: 'EUR' },
        { '@type': 'Offer', name: 'Report singolo', price: '1.99', priceCurrency: 'EUR', description: 'Pagamento una tantum, senza rinnovo.' },
        { '@type': 'Offer', name: 'Pacchetto 3 report + 1 omaggio', price: '4.99', priceCurrency: 'EUR', description: '4 crediti totali, pagamento una tantum, senza rinnovo.' },
        { '@type': 'Offer', name: 'AutoEsperto PRO', price: '29.99', priceCurrency: 'EUR', description: '33 report per ciclo mensile (30 inclusi + 3 omaggio). Abbonamento per professionisti.' },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${siteUrl}/`,
      url: `${siteUrl}/`,
      name: 'Analisi Auto Usata Gratis 2026 | AutoEsperto',
      inLanguage: 'it-IT',
      isPartOf: { '@type': 'WebSite', name: 'AutoEsperto', url: siteUrl },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: homeFaqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Strumenti gratuiti per comprare e vendere auto usate',
      numberOfItems: 6,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Car Advisor AI', url: `${siteUrl}/ai-car-advisor` },
        { '@type': 'ListItem', position: 2, name: 'Verifica Targa', url: `${siteUrl}/verifica-targa` },
        { '@type': 'ListItem', position: 3, name: 'Difetti Motori', url: `${siteUrl}/motori-problemi` },
        { '@type': 'ListItem', position: 4, name: 'Passaggio Proprieta', url: `${siteUrl}/passaggio-proprieta` },
        { '@type': 'ListItem', position: 5, name: 'Confronta Auto', url: `${siteUrl}/confronta` },
        { '@type': 'ListItem', position: 6, name: 'Valore Auto Usata', url: `${siteUrl}/vendi` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` }],
    },
  ];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function Home() {
  let makes: ReturnType<typeof getAllMakes> = [];
  try {
    makes = getAllMakes();
  } catch (err) {
    console.error(`[Home SSR Error] ${new Date().toISOString()}:`, err);
  }

  const stats = {
    makes: makes.length || 80,
    models: makes.reduce((total, make) => total + (make.models?.length || 0), 0) || 1200,
  };

  return (
    <>
      <HomeJsonLd stats={stats} />
      <HomeClient stats={stats} homeGuides={guides.filter(g => g.published <= new Date().toISOString().slice(0, 10)).sort((a,b) => b.published.localeCompare(a.published)).slice(0,48).map(g => ({ slug:g.slug, title:g.title, description:g.description, published:g.published, category:GUIDE_CATEGORIES[g.category]?.label || 'Guida', image:g.image || '/og-image.png', featured:GUIDE_PAGE_FEATURED.includes(g.slug) }))} />
    </>
  );
}
