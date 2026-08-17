import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Search } from 'lucide-react';
import { findMakeBySlug, getAllMakes, slugify } from '@/lib/catalogo';
import AdBanner from '@/components/ads/AdBanner';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

interface PageProps {
  params: Promise<{ make: string }>;
}

export function generateStaticParams() {
  return getAllMakes().map((make) => ({ make: make.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const make = findMakeBySlug(resolved.make);
  if (!make) return {};
  const title = `Valutazione ${make.name} usata — prezzi di mercato per modello`;
  const description = `Quanto costa una ${make.name} usata? Prezzi medi reali per ogni modello ${make.name}, affidabilità e punti critici da controllare prima dell'acquisto.`;
  return {
    title,
    description,
    alternates: {
      canonical: `/valutazione/${resolved.make}`,
      languages: { 'it-IT': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it'}/valutazione/${resolved.make}` },
    },
    openGraph: {
      type: 'website',
      locale: 'it_IT',
      title: `${title} | AutoEsperto`,
      description,
      url: `/valutazione/${resolved.make}`,
      siteName: 'AutoEsperto',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: `Valutazione ${make.name} usate` }],
    },
  };
}

export default async function MakeValutazionePage({ params }: PageProps) {
  const resolved = await params;
  const make = findMakeBySlug(resolved.make);
  if (!make) notFound();

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://autoesperto.it/' },
      { '@type': 'ListItem', position: 2, name: 'Valutazione auto', item: 'https://autoesperto.it/valutazione' },
      { '@type': 'ListItem', position: 3, name: make.name, item: `https://autoesperto.it/valutazione/${resolved.make}` },
    ],
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Modelli ${make.name}`,
    itemListElement: make.models.map((model, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: `${make.name} ${model}`,
      url: `https://autoesperto.it/valutazione/${resolved.make}/${slugify(model)}`,
    })),
  };

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <main className="max-w-3xl mx-auto px-5 pt-8 pb-20">
        <nav aria-label="Breadcrumb" className="text-xs text-text-tertiary mb-4 flex items-center gap-1.5">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <span>/</span>
          <Link href="/valutazione" className="hover:text-accent transition-colors">Valutazione</Link>
          <span>/</span>
          <span className="text-text-secondary font-medium">{make.name}</span>
        </nav>

        <section>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-text-primary leading-[1.15]">
            Valutazione {make.name}{" "}usata
          </h1>
          <p className="text-text-secondary text-base leading-relaxed mt-3">
            Quanto costa una {make.name}{" "}usata? Scegli il modello per vedere il prezzo medio
            reale dagli annunci in vendita e la valutazione di affidabilità.
          </p>
        </section>

        <AdBanner />

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {make.models.map((model) => (
            <Link
              key={model}
              href={`/valutazione/${resolved.make}/${slugify(model)}`}
              className="bg-surface-2 hover:bg-border/50 rounded-xl px-3.5 py-3 text-sm font-semibold text-text-primary truncate transition-colors"
            >
              {model}
            </Link>
          ))}
        </div>

        <Link
          href="/valutazione"
          className="inline-flex items-center gap-1.5 mt-8 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Tutte le marche
        </Link>
      </main>

      <SiteFooter variant="compact" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, itemListSchema]) }}
      />
    </div>
  );
}
