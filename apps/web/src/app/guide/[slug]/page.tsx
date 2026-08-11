import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Car } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import AdInArticle from '@/components/ads/AdInArticle';
import AdBanner from '@/components/ads/AdBanner';
import { getGuide, guides, GUIDE_CATEGORIES, type Guide } from '@/lib/guides';
import { getAllMakes, getModelSlug, POPULAR_MODELS, slugify } from '@/lib/catalogo';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';

const guideCtas: Record<string, { label: string; href: string; description: string }> = {
  'auto-usata-affare': {
    label: 'Valuta il prezzo reale',
    href: '/valutazione',
    description: 'Confronta il prezzo richiesto con la media di mercato dagli annunci reali.',
  },
  'auto-svalutazione': {
    label: 'Scopri quanto vale la tua auto',
    href: '/valutazione',
    description: 'Prezzo medio aggiornato per marca, modello e anno.',
  },
  'vendere-auto': {
    label: 'Calcola il valore di vendita',
    href: '/valutazione',
    description: 'Parti da dati reali per fissare il prezzo giusto.',
  },
  'controllare-auto-usata': {
    label: 'Analizza l\'auto da foto',
    href: '/',
    description: 'Carica una foto e ottieni un report su modello, stato e valore.',
  },
  'auto-affidabili-2026': {
    label: 'Confronta l\'affidabilità',
    href: '/confronta',
    description: 'Metti a confronto due modelli su prezzo, consumi e punti deboli.',
  },
  'auto-incidentata': {
    label: 'Scansiona l\'auto da foto',
    href: '/',
    description: 'L\'analisi visiva segnala difetti, riparazioni e incongruenze.',
  },
  'valutare-danno-riparazione': {
    label: 'Valuta danni con una foto',
    href: '/',
    description: 'Carica una foto del danno e ottieni una stima indicativa.',
  },
  'stima-riparazione': {
    label: 'Stima i costi di riparazione',
    href: '/riparazione',
    description: 'Costi di manodopera e ricambi per il tuo modello e anno.',
  },
  'riparare-o-rottamare': {
    label: 'Scopri quanto vale la tua auto',
    href: '/valutazione',
    description: 'Confronta il preventivo con il valore reale di mercato.',
  },
  'prezzo-giusto': {
    label: 'Verifica il prezzo reale',
    href: '/valutazione',
    description: 'Confronta la richiesta del venditore con la media di mercato dagli annunci.',
  },
  'passaggio-proprieta': {
    label: 'Scopri quanto vale la tua auto',
    href: '/valutazione',
    description: 'Parti da un valore reale di mercato prima di avviare il passaggio.',
  },
  'elettrica-benzina': {
    label: 'Confronta i valori di mercato',
    href: '/confronta',
    description: 'Metti a confronto i modelli che ti interessano su valore e consumi.',
  },
  'consumi-auto': {
    label: 'Scopri i consumi del tuo modello',
    href: '/consumi',
    description: 'Consumi stimati urbano, extraurbano e combinato con il costo annuo.',
  },
  'assicurazione-auto': {
    label: 'Scopri quanto vale l\'auto',
    href: '/valutazione',
    description: 'Parti dal valore reale di mercato per scegliere le coperture giuste.',
  },
  'revisione-auto': {
    label: 'Stima i costi di manutenzione',
    href: '/riparazione',
    description: 'Costi di manodopera e ricambi per il tuo modello e anno.',
  },
  'garanzia-usato': {
    label: 'Controlla valore e stato dell\'auto',
    href: '/valutazione',
    description: 'Valore di mercato e analisi visiva per negoziare con dati reali.',
  },
  'trattare-prezzo': {
    label: 'Verifica il prezzo reale',
    href: '/valutazione',
    description: 'Confronta la richiesta con la media di mercato dagli annunci.',
  },
  'permuta-o-vendita': {
    label: 'Scopri quanto vale la tua auto',
    href: '/valutazione',
    description: 'Confronta la permuta con il valore reale di mercato della tua auto.',
  },
  'ibride-convengono': {
    label: 'Confronta i modelli',
    href: '/confronta',
    description: 'Metti a confronto ibrida, benzina ed elettrica su valore e consumi.',
  },
  'durata-auto': {
    label: 'Scopri quanto vale la tua auto',
    href: '/valutazione',
    description: 'Valore residuo reale e costi futuri per stimare la durata conveniente.',
  },
  'auto-estero': {
    label: 'Analizza l\'auto da foto',
    href: '/',
    description: 'Carica una foto e ottieni un report su modello, stato e valore.',
  },
  'chilometraggio-reale': {
    label: 'Analizza lo stato da foto',
    href: '/',
    description: 'L\'analisi visiva segnala usura e incongruenze con i km dichiarati.',
  },
  'valutazione-auto': {
    label: 'Scopri quanto vale la tua auto',
    href: '/valutazione',
    description: 'Prezzo medio reale dagli annunci per marca, modello e anno.',
  },
  'controllo-usato': {
    label: 'Controlla il prezzo reale dell\'usato',
    href: '/valutazione',
    description: 'Confronta la richiesta del venditore con la media di mercato dagli annunci.',
  },
  'costi-riparazione': {
    label: 'Stima i costi di manutenzione',
    href: '/riparazione',
    description: 'Costi di manodopera e ricambi per il tuo modello e anno.',
  },
  'consumi-modello': {
    label: 'Scopri i consumi del tuo modello',
    href: '/consumi',
    description: 'Consumi urbano, extraurbano e combinato con il costo annuo.',
  },
  'confronto-modelli': {
    label: 'Confronta i modelli che ti interessano',
    href: '/confronta',
    description: 'Valore e consumi a confronto per scegliere con dati reali.',
  },
  'analisi-ai': {
    label: 'Analizza l\'auto da foto',
    href: '/',
    description: 'Carica una foto e ottieni un report su modello, stato e valore.',
  },
  'affidabilita-modello': {
    label: 'Controlla l\'affidabilità del modello',
    href: '/affidabilita',
    description: 'Punteggio, punti deboli e costi di manutenzione per modello e anno.',
  },
  'valore-vendita': {
    label: 'Calcola il valore di vendita',
    href: '/valutazione',
    description: 'Parti da dati reali per fissare il prezzo giusto della tua auto.',
  },
  'permuta-valutazione': {
    label: 'Valuta la tua auto per la permuta',
    href: '/valutazione',
    description: 'Confronta la valutazione proposta con il valore reale di mercato.',
  },
};

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};

  return {
    title: guide.title,
    description: guide.description,
    alternates: {
      canonical: `/guide/${guide.slug}`,
      languages: { 'it-IT': `${siteUrl}/guide/${guide.slug}` },
    },
    openGraph: {
      type: 'article',
      locale: 'it_IT',
      title: guide.title,
      description: guide.description,
      url: `${siteUrl}/guide/${guide.slug}`,
      siteName: 'AutoEsperto',
      publishedTime: guide.published,
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: guide.title }],
    },
  };
}

function normalize(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

const MAKE_ALIASES: Record<string, string[]> = {
  Volkswagen: ['vw'],
  'Mercedes-Benz': ['mercedes'],
  'Alfa Romeo': ['alfa'],
};

const SAFE_BARE_MODELS = new Set([
  'Panda', 'Golf', 'Yaris', 'Corolla', 'RAV4', 'C-HR', 'Aygo', 'Fiesta', 'Puma', 'Kuga',
  'Clio', 'Captur', 'Megane', 'Duster', 'Sandero', 'Jogger', 'Logan', 'Picanto', 'Rio',
  'Ceed', 'Stonic', 'Qashqai', 'Juke', 'Micra', 'Swift', 'Vitara', 'Ignis', 'CX-3', 'CX-5',
  'Tiguan', 'T-Cross', 'T-Roc', 'Ibiza', 'Leon', 'Arona', 'Ateca', 'Fabia', 'Octavia',
  'Kamiq', 'Karoq', 'Kodiaq', 'Tucson', 'Kona', 'i10', 'i20', 'i30', 'Astra', 'Mokka',
  'Crossland', 'Giulia', 'Giulietta', 'Stelvio', 'Renegade', 'Compass', 'Evoque', 'Ypsilon',
  'XC40', 'XC60', 'V40', 'Model 3', 'Model Y', 'MG4', 'ZS', 'Civic', 'Jazz', 'CR-V',
  'ASX', 'Outlander', 'NX', 'Cayenne', 'Macan', 'Fortwo', '500X',
]);

function isMentioned(text: string, name: string): boolean {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^a-z0-9])${escaped}(?![a-z0-9-])`).test(text);
}

function getMentionedModels(guide: Guide): Array<{ make: string; model: string }> {
  const text = normalize(
    guide.sections
      .flatMap((section) => [section.heading, ...section.paragraphs, ...(section.list ?? [])])
      .join(' ')
  );
  const catalog = new Map(getAllMakes().map((make) => [make.slug, new Set(make.models.map(getModelSlug))]));
  return POPULAR_MODELS.filter((item) => {
    const makeSlug = slugify(item.make);
    const modelSlug = slugify(item.model);
    const inCatalog = catalog.get(makeSlug)?.has(modelSlug) ?? false;
    if (!inCatalog) return false;
    const names = [normalize(`${item.make} ${item.model}`), ...(MAKE_ALIASES[item.make] ?? []).map((alias) => normalize(`${alias} ${item.model}`))];
    if (names.some((name) => isMentioned(text, name))) return true;
    return SAFE_BARE_MODELS.has(item.model) && isMentioned(text, normalize(item.model));
  }).slice(0, 6);
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const mentionedModels = getMentionedModels(guide);
  const cta = guideCtas[guide.cta] ?? guideCtas['auto-usata-affare'];
  const otherGuides = guides.filter((g) => g.slug !== guide.slug).slice(0, 3);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    datePublished: guide.published,
    author: { '@type': 'Organization', name: 'AutoEsperto' },
    publisher: {
      '@type': 'Organization',
      name: 'AutoEsperto',
      logo: { '@type': 'ImageObject', url: `${siteUrl}/og-image.png` },
    },
    mainEntityOfPage: `${siteUrl}/guide/${guide.slug}`,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Guide', item: `${siteUrl}/guide` },
      { '@type': 'ListItem', position: 3, name: guide.title, item: `${siteUrl}/guide/${guide.slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main className="max-w-3xl mx-auto px-5 pt-8 pb-20">
        <nav aria-label="Breadcrumb" className="text-xs text-text-tertiary mb-4">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <span> / </span>
          <Link href="/guide" className="hover:text-accent transition-colors">Guide</Link>
          <span> / </span>
          <span className="text-text-secondary font-medium line-clamp-1">{guide.title}</span>
        </nav>

        <Link
          href="/guide"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-accent transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Tutte le guide
        </Link>

        <article>
          <header>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center rounded-full bg-accent-light px-2.5 py-1 text-xs font-bold text-accent">
                {GUIDE_CATEGORIES[guide.category].label}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                Di Redazione AutoEsperto
              </span>
              <span className="text-text-tertiary">·</span>
              <time dateTime={guide.published} className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                {new Date(guide.published).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
              </time>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-text-primary leading-[1.15] mt-4">
              {guide.title}
            </h1>
            <p className="text-text-secondary text-base leading-relaxed mt-4">{guide.description}</p>
          </header>

          <div className="mt-10 space-y-10">
            {guide.sections.map((section, index) => (
              <section key={section.heading}>
                <h2 className="text-xl font-bold text-text-primary">{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="text-text-secondary text-base leading-relaxed mt-3">
                    {paragraph}
                  </p>
                ))}
                {section.list && (
                  <ul className="mt-4 space-y-2">
                    {section.list.map((item) => (
                      <li key={item.slice(0, 40)} className="flex gap-2.5 text-sm text-text-secondary leading-relaxed">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {index === 1 && guide.sections.length > 3 && <AdInArticle />}
              </section>
            ))}
          </div>

          <div className="mt-12 rounded-2xl bg-surface-2 border border-border p-5">
            <h2 className="text-sm font-bold text-text-primary uppercase tracking-wide">Metodologia e Fonti</h2>
            <p className="text-xs text-text-secondary leading-relaxed mt-2">
              Questa guida è stata redatta dal team di esperti di <strong>AutoEsperto</strong>. I dati riportati sulle quotazioni, sull'affidabilità e sui costi di riparazione sono elaborati dal nostro algoritmo proprietario che analizza quotidianamente decine di migliaia di annunci reali, incrociandoli con database di richiami ufficiali (es. Safety Gate UE, NHTSA) e storici di manutenzione.
            </p>
          </div>
        </article>

        {mentionedModels.length > 0 && (
          <section className="mt-12" aria-label="Auto citate in questa guida">
            <h2 className="text-lg font-bold text-text-primary">Auto citate in questa guida</h2>
            <p className="text-sm text-text-secondary mt-1">Approfondisci valore di mercato, affidabilità e costi dei modelli citati.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {mentionedModels.map(({ make, model }) => {
                const makeSlug = slugify(make);
                const modelSlug = slugify(model);
                return (
                  <div key={`${makeSlug}/${modelSlug}`} className="rounded-xl border border-border bg-surface-2 p-4">
                    <h3 className="text-sm font-bold text-text-primary">{make} {model}</h3>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-accent">
                      <Link href={`/valutazione/${makeSlug}/${modelSlug}`} className="hover:underline">Valutazione</Link>
                      <Link href={`/affidabilita/${makeSlug}/${modelSlug}`} className="hover:underline">Affidabilità</Link>
                      <Link href={`/riparazione/${makeSlug}/${modelSlug}`} className="hover:underline">Costi di riparazione</Link>
                      <Link href={`/consumi/${makeSlug}/${modelSlug}`} className="hover:underline">Consumi</Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section className="mt-12 rounded-2xl bg-accent p-6 text-white">
          <h2 className="text-lg font-bold">{cta.label}</h2>
          <p className="text-sm text-white/85 leading-relaxed mt-2">{cta.description}</p>
          <Link
            href={cta.href}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-accent hover:bg-white/90 transition-colors"
          >
            {cta.label}
          </Link>
        </section>

        {otherGuides.length > 0 && (
          <section className="mt-12">
            <AdBanner />
            <h2 className="text-lg font-bold text-text-primary mt-8">Altre guide</h2>
            <div className="mt-4 grid gap-3">
              {otherGuides.map((other) => (
                <Link
                  key={other.slug}
                  href={`/guide/${other.slug}`}
                  className="rounded-xl border border-border bg-surface-2 p-4 hover:border-accent transition-colors"
                >
                  <h3 className="text-sm font-bold text-text-primary">{other.title}</h3>
                  <p className="text-xs text-text-secondary mt-1 line-clamp-2">{other.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter variant="full" />
    </div>
  );
}


