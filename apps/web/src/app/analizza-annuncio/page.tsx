import type { Metadata } from 'next';
import { Suspense } from 'react';
import AdAnalysisLandingClient from './AdAnalysisLandingClient';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';

export const metadata: Metadata = {
  title: 'Controlla Annuncio Auto Usata: Trust Score e Valore Reale | AutoEsperto',
  description:
    'Incolla il link dell\'annuncio di AutoScout24, Subito o Facebook: scopri il Trust Score (0-100), il verdetto "La compreresti?", il valore reale e quanto offrire al venditore.',
  alternates: {
    canonical: `${siteUrl}/analizza-annuncio`,
    languages: { 'it-IT': `${siteUrl}/analizza-annuncio` },
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: `${siteUrl}/analizza-annuncio`,
    title: 'Controlla Annuncio Auto Usata — Trust Score & Verdetto',
    description: 'Analizza annunci auto da link o testo: calcola Trust Score, affidabilità e strategia di trattativa.',
    siteName: 'AutoEsperto',
    images: [{ url: `${siteUrl}/images/guide/10-segnali-annuncio-auto-usata.jpg`, width: 1200, height: 630, alt: 'Controlla Annuncio Auto Usata - AutoEsperto' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Controlla Annuncio Auto Usata: Trust Score e Valore Reale | AutoEsperto',
    description: 'Incolla il link dell\'annuncio: scopri Trust Score, verdetto, valore reale e quanto offrire al venditore.',
    images: [`${siteUrl}/images/guide/10-segnali-annuncio-auto-usata.jpg`],
  },
};

export default function AnalizzaAnnuncioPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Caricamento Analisi Annuncio…</div>}>
      <AdAnalysisLandingClient />
    </Suspense>
  );
}
