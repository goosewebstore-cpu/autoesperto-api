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
      </main>
      <SiteFooter />
    </div>
  );
}
