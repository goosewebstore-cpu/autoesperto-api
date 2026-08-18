import type { Metadata } from 'next';
import SellCheck from '@/components/SellCheck';
import SiteHeader from '@/components/SiteHeader';
import PageHero from '@/components/PageHero';
import AdBanner from '@/components/ads/AdBanner';
import SiteFooter from '@/components/SiteFooter';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';

export const metadata: Metadata = {
  title: 'Quanto vale la mia auto? Valutazione gratis',
  description:
    'Valore stimato di mercato, prezzo per vendita veloce, prezzo consigliato e annuncio pronto da pubblicare. Gratis.',
  alternates: {
    canonical: '/vendi',
    languages: { 'it-IT': `${siteUrl}/vendi` },
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    title: 'Quanto vale la mia auto? Valutazione gratis',
    description: 'Valore stimato di mercato e annuncio di vendita pronto. Gratis.',
    url: `${siteUrl}/vendi`,
    siteName: 'AutoEsperto',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'AutoEsperto — quanto vale la mia auto?' }],
  },
};

export default function VendiPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <PageHero
        crumb="Vendere"
        photo="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1600&q=80"
        title="Quanto vale la mia auto?"
      >
        <p>
          Valore stimato di mercato, prezzo per una vendita veloce, prezzo consigliato
          e annuncio pronto da pubblicare. Gratis e senza registrazione.
        </p>
      </PageHero>
      <main className="page-body narrow">
        <AdBanner />
        <SellCheck />
      </main>
      <SiteFooter />
    </div>
  );
}