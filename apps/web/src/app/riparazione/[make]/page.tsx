import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Car } from 'lucide-react';
import { getAllMakes, slugify } from '@/lib/catalogo';
import { estimateRepair } from '@/lib/riparazione';
import AdBanner from '@/components/ads/AdBanner';

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
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-border/60">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-5 h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Car className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-text-primary">
              Auto<span className="text-accent">Esperto</span>
            </span>
          </Link>
        </div>
      </header>

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

      <footer className="border-t border-border/60 mt-10">
        <div className="max-w-3xl mx-auto px-5 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-accent flex items-center justify-center">
                <Car className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-bold text-text-primary">AutoEsperto</span>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-text-secondary">
              <Link href="/valutazione" className="hover:text-text-primary transition-colors">Valutazione auto</Link>
              <Link href="/riparazione" className="hover:text-text-primary transition-colors">Costi riparazione</Link>
              <Link href="/guide" className="hover:text-text-primary transition-colors">Guide</Link>
              <Link href="/privacy" className="hover:text-text-primary transition-colors">Privacy</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}

