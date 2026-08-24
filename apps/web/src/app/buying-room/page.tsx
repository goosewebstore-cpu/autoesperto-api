import type { Metadata } from 'next';
import BuyingRoomClient from './BuyingRoomClient';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';

export const metadata: Metadata = {
  title: 'Buying Room: Il Tuo Spazio Personale per Comprare Auto Usata | AutoEsperto',
  description:
    'Segui, confronta e gestisci le auto usate che ti interessano: dalla scoperta alla trattativa fino al passaggio nel tuo Vehicle Passport.',
  alternates: {
    canonical: `${siteUrl}/buying-room`,
    languages: { 'it-IT': `${siteUrl}/buying-room` },
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: `${siteUrl}/buying-room`,
    title: 'AutoEsperto Buying Room — Spazio Decisionale Auto',
    description: 'Gestisci le tue auto salvate, confrontale e traccia la trattativa fino all\'acquisto.',
    siteName: 'AutoEsperto',
    images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630, alt: 'Buying Room AutoEsperto' }],
  },
};

export default function BuyingRoomPage() {
  return <BuyingRoomClient />;
}
