import type { Metadata } from 'next';
import SellCheck from '@/components/SellCheck';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';

export const metadata: Metadata = {
  title: 'Quanto vale la mia auto? Valuta e crea l\u2019annuncio',
  description:
    'Scopri a quanto vendere la tua auto usata: valore stimato di mercato, prezzo per vendita veloce, prezzo consigliato e annuncio pronto da pubblicare.',
  alternates: {
    canonical: '/vendi',
    languages: { 'it-IT': `${siteUrl}/vendi` },
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    title: 'Quanto vale la mia auto? | AutoEsperto',
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
      <main className="mx-auto max-w-3xl px-5 pt-10 pb-20">
        <SellCheck />
      </main>
      <SiteFooter variant="full" />
    </div>
  );
}