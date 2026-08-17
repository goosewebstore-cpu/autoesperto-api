import type { Metadata } from 'next';
import BuyCheck from '@/components/BuyCheck';
import SiteHeader from '@/components/SiteHeader';
import PageHero from '@/components/PageHero';
import AdBanner from '@/components/ads/AdBanner';
import SiteFooter from '@/components/SiteFooter';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';

export const metadata: Metadata = {
  title: 'Comprare auto usata: verdetto sul prezzo',
  description:
    'Verdetto su conviene comprare: prezzo, valore di mercato e punti da controllare prima dell\u2019acquisto. Gratis.',
  alternates: {
    canonical: '/compra',
    languages: { 'it-IT': `${siteUrl}/compra` },
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    title: 'Comprare auto usata: verdetto sul prezzo',
    description: 'Verdetto su conviene comprare: prezzo, valore di mercato e punti da controllare. Gratis.',
    url: `${siteUrl}/compra`,
    siteName: 'AutoEsperto',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'AutoEsperto — mi conviene comprarla?' }],
  },
};

export default function CompraPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <PageHero
        crumb="Comprare"
        photo="https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=80"
        title="Mi conviene comprarla?"
      >
        <p>
          Prezzo, chilometri e dati dell&apos;auto. Verdetto, valore di mercato e punti da controllare.
        </p>
      </PageHero>
      <main className="page-body narrow">
        <AdBanner />
        <BuyCheck />
      </main>
      <SiteFooter variant="full" />
    </div>
  );
}