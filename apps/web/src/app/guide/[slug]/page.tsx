import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Car } from 'lucide-react';
import { getGuide, guides, GUIDE_CATEGORIES } from '@/lib/guides';

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
    label: 'Analizza l\'auto con l\'AI',
    href: '/',
    description: 'Carica una foto e ottieni un report su modello, stato e valore.',
  },
  'auto-affidabili-2026': {
    label: 'Confronta l\'affidabilità',
    href: '/confronta',
    description: 'Metti a confronto due modelli su prezzo, consumi e punti deboli.',
  },
  'auto-incidentata': {
    label: 'Scansiona l\'auto con l\'AI',
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
    label: 'Analizza l\'auto con l\'AI',
    href: '/',
    description: 'Carica una foto e ottieni un report su modello, stato e valore.',
  },
  'chilometraggio-reale': {
    label: 'Analizza lo stato con l\'AI',
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
    label: 'Analizza l\'auto con l\'AI',
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

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

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
            {guide.sections.map((section) => (
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
            <h2 className="text-lg font-bold text-text-primary">Altre guide</h2>
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
              <Link href="/guide" className="hover:text-text-primary transition-colors">Guide</Link>
              <Link href="/privacy" className="hover:text-text-primary transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-text-primary transition-colors">Termini</Link>
            </nav>
          </div>
          <p className="text-xs text-text-tertiary text-center mt-4">
            AutoEsperto fornisce valutazioni indicative e non sostituisce un&apos;ispezione professionale.
          </p>
        </div>
      </footer>
    </div>
  );
}
