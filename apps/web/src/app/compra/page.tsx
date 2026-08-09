import type { Metadata } from 'next';
import BuyCheck from '@/components/BuyCheck';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';

export const metadata: Metadata = {
  title: 'Mi conviene comprarla? Verifica il prezzo prima dell\u2019acquisto',
  description:
    'Inserisci prezzo, chilometri e dati dell\u2019auto che vuoi comprare. Scopri se conviene, il valore stimato di mercato e i punti da controllare prima di concludere.',
  alternates: {
    canonical: '/compra',
    languages: { 'it-IT': `${siteUrl}/compra` },
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    title: 'Mi conviene comprarla? | AutoEsperto',
    description: 'Verifica se il prezzo dell\u2019auto è giusto prima di comprarla. Gratis.',
    url: `${siteUrl}/compra`,
    siteName: 'AutoEsperto',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'AutoEsperto — mi conviene comprarla?' }],
  },
};

export default function CompraPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 pt-10 pb-20">
        <BuyCheck />
      </main>
      <SiteFooter variant="full" />
    </div>
  );
}