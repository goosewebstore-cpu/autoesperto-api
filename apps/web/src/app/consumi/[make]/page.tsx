import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { } from 'lucide-react';
import { getAllMakes, slugify } from '@/lib/catalogo';
import { estimateConsumption } from '@/lib/consumi';
import AdBanner from '@/components/ads/AdBanner';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

interface PageProps {
  params: Promise<{ make: string }>;
}

const CURRENT_YEAR = new Date().getFullYear();

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';
}

export const dynamicParams = true;
export const revalidate = 86400;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const make = getAllMakes().find((m) => m.slug === resolved.make);
  if (!make) return {};

  const title = `Consumi auto ${make.name}: modelli e costo annuo`;
  const description = `Quanto consumano le auto ${make.name}? Consumi urbano, extraurbano e combinato per modello e anno, con il costo annuo di carburante.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/consumi/${resolved.make}`,
      languages: { 'it-IT': `${siteUrl()}/consumi/${resolved.make}` },
    },
    openGraph: {
      type: 'website',
      locale: 'it_IT',
      title,
      description,
      url: `${siteUrl()}/consumi/${resolved.make}`,
      siteName: 'AutoEsperto',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: `Consumi auto ${make.name}` }],
    },
  };
}

export default async function ConsumiMakePage({ params }: PageProps) {
  const resolved = await params;
  const make = getAllMakes().find((m) => m.slug === resolved.make);
  if (!make) notFound();

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <main className="max-w-3xl mx-auto px-5 pt-8 pb-20">
        <nav aria-label="Breadcrumb" className="text-xs text-text-tertiary mb-4 flex flex-wrap items-center gap-1.5">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <span>/</span>
          <Link href="/consumi" className="hover:text-accent transition-colors">Consumi</Link>
          <span>/</span>
          <span className="text-text-secondary font-medium">{make.name}</span>
        </nav>

        <section>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-text-primary leading-[1.15]">
            Consumi auto {make.name}
          </h1>
          <p className="text-text-secondary text-base leading-relaxed mt-3">
            Quanto consumano le {make.name}? Scegli il modello per vedere i consumi stimati in urbano, extraurbano e
            combinato, con il costo annuo di carburante, anno per anno.
          </p>
        </section>

        <AdBanner />

        <section className="mt-8">
          <h2 className="text-lg font-bold text-text-primary mb-3">Modelli {make.name}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {make.models.map((model) => {
              const est = estimateConsumption(make.name, model, CURRENT_YEAR);
              return (
                <Link
                  key={model}
                  href={`/consumi/${resolved.make}/${slugify(model)}`}
                  className="rounded-xl border border-border bg-white p-4 hover:border-accent transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-bold text-text-primary">{model}</span>
                    <span className="text-sm font-extrabold text-accent whitespace-nowrap">{est.combined} {est.unit === 'kWh/100 km' ? 'kWh/100km' : 'l/100km'}</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed mt-1">
                    {est.label} · circa {est.annualCost} €/anno di carburante
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl()}/` },
                { '@type': 'ListItem', position: 2, name: 'Consumi auto', item: `${siteUrl()}/consumi` },
                { '@type': 'ListItem', position: 3, name: make.name, item: `${siteUrl()}/consumi/${resolved.make}` },
              ],
            }),
          }}
        />
      </main>

      <SiteFooter variant="compact" />
    </div>
  );
}
