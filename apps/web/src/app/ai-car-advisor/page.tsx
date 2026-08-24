import type { Metadata } from 'next';
import { Suspense } from 'react';
import AiAdvisorPageClient from './AiAdvisorPageClient';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';

export const metadata: Metadata = {
  title: 'AI Car Advisor: Il Tuo Esperto Digitale per Comprare Auto Usata | AutoEsperto',
  description:
    'Chiedi all\'AI Car Advisor di AutoEsperto: "La compreresti?", "Quanto dovrei offrire?" e "Quali difetti controllare?". Consulente automotive indipendente e gratuito.',
  alternates: {
    canonical: `${siteUrl}/ai-car-advisor`,
    languages: { 'it-IT': `${siteUrl}/ai-car-advisor` },
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: `${siteUrl}/ai-car-advisor`,
    title: 'AI Car Advisor — Il consulente per comprare auto usate',
    description: 'Consigli esperti su quotazioni, affidabilità, margini di trattativa e difetti noti.',
    siteName: 'AutoEsperto',
    images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630, alt: 'AI Car Advisor AutoEsperto' }],
  },
};

export default function AiAdvisorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Caricamento AI Advisor…</div>}>
      <AiAdvisorPageClient />
    </Suspense>
  );
}
