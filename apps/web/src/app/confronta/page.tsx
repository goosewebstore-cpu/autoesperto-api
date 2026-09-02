import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import PageHero from '@/components/PageHero';
import AdBanner from '@/components/ads/AdBanner';
import CompareModels from '@/components/CompareModels';
import { buildLocalReport } from '@/lib/stima';

export const revalidate = 86400; // 1 day cache

export const metadata: Metadata = {
  title: 'Confronta modelli auto usate: Prezzi, Affidabilità e TCO',
  description: 'Confronta prezzo di mercato, affidabilità, consumi reali, costi di manutenzione e verdetto tra modelli di auto usate.',
  alternates: {
    canonical: '/confronta',
    languages: { 'it-IT': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it'}/confronta` },
  },
  openGraph: {
    title: 'Confronta modelli auto usate — AutoEsperto',
    description: 'Confronta prezzo di mercato, affidabilità e alternative tra due auto usate.',
    url: '/confronta',
  },
};

export default async function ComparePage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';
  let initialLeftReport = undefined;
  let initialRightReport = undefined;
  try {
    // Generazione locale deterministica e istantanea (<1ms) senza dipendenze di rete esterne
    initialLeftReport = buildLocalReport('Fiat', 'Panda');
    initialRightReport = buildLocalReport('Toyota', 'Yaris');
  } catch (err) {
    console.error(`[Confronta SSR Error] ${new Date().toISOString()}:`, err);
  }

  const faqs = [
    {
      q: 'Come vengono confrontati i modelli su AutoEsperto?',
      a: 'Confrontiamo i prezzi medi reali dagli annunci, i costi totali di gestione (TCO: bollo, consumi, manutenzione stimata), l\'affidabilità per codice motore e i punti critici prima dell\'acquisto.',
    },
    {
      q: 'Come si calcola il verdetto "La Nostra Scelta"?',
      a: 'L\'algoritmo assegna un punteggio comparativo oggettivo basato sul rapporto qualità/prezzo, sui costi chilometrici stimati e sulla difettosità storica di ciascun modello.',
    },
    {
      q: 'Posso confrontare auto di categorie diverse?',
      a: 'Sì, puoi aggiungere fino a 4 modelli per confrontare citycar, SUV, berline o auto ibride ed elettriche.',
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

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
    description: 'Confronta prezzo medio di mercato, affidabilità, guasti noti e costi di gestione tra due o più auto usate.',
  };

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <PageHero
        crumb="Confronta"
        photo="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1600&q=80"
        title="Confronta modelli auto usate"
      >
        <p>
          Prezzi dagli annunci, affidabilità, costi di gestione reali e punti da controllare. Gratis.
        </p>
      </PageHero>
      <main className="page-body">
        <AdBanner />

        <CompareModels initialLeftReport={initialLeftReport} initialRightReport={initialRightReport} />

        {/* FAQ Section */}
        <section className="mt-14 max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Domande frequenti sul confronto auto usate
          </h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details key={faq.q} className="bg-slate-50 rounded-2xl border border-slate-200/80 p-4 group">
                <summary className="font-semibold text-sm text-slate-900 cursor-pointer list-none flex items-center justify-between gap-3">
                  <span>{faq.q}</span>
                  <span className="text-blue-600 group-open:rotate-45 transition-transform text-lg leading-none shrink-0">+</span>
                </summary>
                <p className="text-xs text-slate-600 leading-relaxed mt-2.5 pt-2.5 border-t border-slate-200">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, appSchema, faqSchema]) }}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
