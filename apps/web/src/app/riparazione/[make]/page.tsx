import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { } from 'lucide-react';
import { getAllMakes, slugify } from '@/lib/catalogo';
import { estimateRepair } from '@/lib/riparazione';
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

export const dynamic = 'force-static';
export const dynamicParams = true;
export const revalidate = 86400;

export function generateStaticParams() {
  const popular = ['fiat', 'volkswagen', 'ford', 'renault', 'peugeot', 'toyota', 'audi', 'bmw', 'mercedes-benz', 'jeep', 'citroen', 'dacia', 'alfa-romeo', 'lancia', 'nissan', 'hyundai', 'kia', 'opel', 'seat', 'skoda'];
  return popular.map((make) => ({ make }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const make = getAllMakes().find((m) => m.slug === resolved.make);
  if (!make) return {};

  const title = `Costi di riparazione ${make.name}: stime per modello e anno`;
  const description = `Quanto costa riparare una ${make.name}? Stime di manodopera, ricambi e guasti frequenti per tutti i modelli ${make.name}, anno per anno.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/riparazione/${resolved.make}`,
      languages: { 'it-IT': `${siteUrl()}/riparazione/${resolved.make}` },
    },
    openGraph: {
      type: 'website',
      locale: 'it_IT',
      title,
      description,
      url: `${siteUrl()}/riparazione/${resolved.make}`,
      siteName: 'AutoEsperto',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: `Costi di riparazione ${make.name}` }],
    },
  };
}

export default async function RepairMakePage({ params }: PageProps) {
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
          <Link href="/riparazione" className="hover:text-accent transition-colors">Costi riparazione</Link>
          <span>/</span>
          <span className="text-text-secondary font-medium">{make.name}</span>
        </nav>

        <section>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-text-primary leading-[1.15]">
            Costi di riparazione {make.name}
          </h1>
          <p className="text-text-secondary text-base leading-relaxed mt-3">
            Quanto costa riparare una {make.name}? Scegli il modello per vedere la stima dei costi di manodopera, i ricambi
            soggetti a usura e i guasti più frequenti, anno per anno.
          </p>
        </section>

        <AdBanner />

        <section className="mt-8">
          <h2 className="text-lg font-bold text-text-primary mb-3">Modelli {make.name}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {make.models.map((model) => {
              const est = estimateRepair(make.name, model, CURRENT_YEAR);
              return (
                <Link
                  key={model}
                  href={`/riparazione/${resolved.make}/${slugify(model)}`}
                  className="rounded-xl border border-border bg-white p-4 hover:border-accent transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-bold text-text-primary">{model}</span>
                    <span className="text-sm font-extrabold text-accent whitespace-nowrap">{est.maintenanceMin}–{est.maintenanceMax} €/anno</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed mt-1">
                    Manutenzione ordinaria indicativa · stime per ogni anno dal 2015
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
                { '@type': 'ListItem', position: 2, name: 'Costi di riparazione', item: `${siteUrl()}/riparazione` },
                { '@type': 'ListItem', position: 3, name: make.name, item: `${siteUrl()}/riparazione/${resolved.make}` },
              ],
            }),
          }}
        />
      </main>

      <SiteFooter />
    </div>
  );
}

