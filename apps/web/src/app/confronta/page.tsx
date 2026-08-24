import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import PageHero from '@/components/PageHero';
import AdBanner from '@/components/ads/AdBanner';
import CompareModels from '@/components/CompareModels';
import { analyzeVehicle } from '@/lib/api';

export const revalidate = 86400; // 1 day cache

export const metadata: Metadata = {
  title: 'Confronta modelli auto usate',
  description: 'Confronta prezzo di mercato, affidabilità e alternative tra due auto usate.',
  alternates: {
    canonical: '/confronta',
    languages: { 'it-IT': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it'}/confronta` },
  },
  openGraph: {
    title: 'Confronta modelli auto usate',
    description: 'Confronta prezzo di mercato, affidabilità e alternative tra due auto usate.',
    url: '/confronta',
  },
};

export default async function ComparePage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';
  let initialLeftReport = undefined;
  let initialRightReport = undefined;
  try {
    const [leftRes, rightRes] = await Promise.all([
      analyzeVehicle({ make: 'Fiat', model: 'Panda' }),
      analyzeVehicle({ make: 'Toyota', model: 'Yaris' })
    ]);
    if (leftRes.success && leftRes.report) initialLeftReport = leftRes.report;
    if (rightRes.success && rightRes.report) initialRightReport = rightRes.report;
  } catch (err) {
    console.warn(`Failed to fetch SSR reports for confronta page`, err);
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Confronta auto usate', item: `${siteUrl}/confronta` },
    ],
  };

  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Confronto Auto Usate — AutoEsperto',
    url: `${siteUrl}/confronta`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
    description: 'Confronta prezzo medio di mercato, affidabilità, guasti noti e costi di gestione tra due auto usate.',
  };

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <PageHero
        crumb="Confronta"
        photo="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1600&q=80"
        title="Confronta due modelli auto usate"
      >
        <p>
          Prezzi dagli annunci, affidabilità e punti da controllare. Gratis.
        </p>
      </PageHero>
      <main className="page-body">
        <AdBanner />

        <CompareModels initialLeftReport={initialLeftReport} initialRightReport={initialRightReport} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, appSchema]) }}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
