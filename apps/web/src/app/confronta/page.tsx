import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
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
    title: 'Confronta modelli auto usate | AutoEsperto',
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
      <main className="max-w-5xl mx-auto px-5 pt-12 pb-16">
        <a href="/" className="text-sm font-semibold text-accent hover:underline">← AutoEsperto</a>
        <div className="max-w-2xl mt-7 mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent mb-2">Confronto auto</p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary">Confronta due modelli prima di scegliere</h1>
          <p className="text-text-secondary mt-3 leading-relaxed">Metti a confronto prezzi reali dagli annunci, affidabilità e punti da controllare. È gratuito.</p>
        </div>

        <AdBanner />

        <CompareModels initialLeftReport={initialLeftReport} initialRightReport={initialRightReport} />
      </main>
      <SiteFooter variant="full" />
    </div>
  );
}
