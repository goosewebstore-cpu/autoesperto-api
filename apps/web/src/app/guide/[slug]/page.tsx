import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, BookOpen, Calendar, CheckCircle2, Clock, List, ScanSearch, Share2, ShieldCheck, Sparkles } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import AdInArticle from '@/components/ads/AdInArticle';
import AdBanner from '@/components/ads/AdBanner';
import ArticleInteractiveBar, { ArticleFeedbackBox } from '@/components/ArticleInteractiveBar';
import { getGuide, guides, GUIDE_CATEGORIES, type Guide } from '@/lib/guides';
import { getAllMakes, getModelSlug, POPULAR_MODELS, slugify } from '@/lib/catalogo';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';

/** Compute a realistic dateModified for freshness signals.
 *  Returns the 1st of the current month, or the published date if it's more recent. */
function getDateModified(published: string): string {
  const pub = new Date(published);
  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  return pub > firstOfMonth ? published : firstOfMonth.toISOString().slice(0, 10);
}

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

export const dynamic = 'force-static';
export const dynamicParams = true;

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};

  const fullUrl = `${siteUrl}/guide/${guide.slug}`;

  return {
    title: `${guide.title} | AutoEsperto`,
    description: guide.description,
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
    alternates: {
      canonical: fullUrl,
      languages: { 'it-IT': fullUrl },
    },
    openGraph: {
      type: 'article',
      locale: 'it_IT',
      title: guide.title,
      description: guide.description,
      url: fullUrl,
      siteName: 'AutoEsperto',
      publishedTime: guide.published,
      modifiedTime: getDateModified(guide.published),
      authors: ['Redazione AutoEsperto'],
      section: GUIDE_CATEGORIES[guide.category].label,
      images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630, alt: guide.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.title,
      description: guide.description,
      images: [`${siteUrl}/og-image.png`],
    },
  };
}

function normalize(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function renderParagraphWithLinks(text: string) {
  const markdownRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = markdownRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const label = match[1];
    const href = match[2];
    if (href.startsWith('/')) {
      parts.push(
        <Link key={`${href}-${match.index}`} href={href} className="font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2">
          {label}
        </Link>
      );
    } else {
      parts.push(
        <a key={`${href}-${match.index}`} href={href} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2">
          {label}
        </a>
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

function countWords(guide: Guide): number {
  let count = guide.title.split(/\s+/).length + guide.description.split(/\s+/).length;
  for (const s of guide.sections) {
    count += s.heading.split(/\s+/).length;
    for (const p of s.paragraphs) {
      count += p.split(/\s+/).length;
    }
    if (s.list) {
      for (const item of s.list) {
        count += item.split(/\s+/).length;
      }
    }
  }
  return count;
}

function extractFaqs(guide: Guide): Array<{ question: string; answer: string }> {
  const faqs: Array<{ question: string; answer: string }> = [];
  const questionStarters = ['come', 'quanto', 'perché', 'perche', 'quale', 'cosa', 'quando', 'chi', 'dove'];

  for (const section of guide.sections) {
    const heading = section.heading.trim();
    const lower = heading.toLowerCase();
    const isQuestion = heading.endsWith('?') || questionStarters.some((starter) => lower.startsWith(starter));

    if (isQuestion && section.paragraphs.length > 0) {
      const answer = section.paragraphs.join(' ') + (section.list ? ' ' + section.list.join('. ') : '');
      faqs.push({
        question: heading.replace(/^\d+\.\s*/, ''),
        answer: answer.replace(/\s+/g, ' ').trim(),
      });
    }
  }
  return faqs;
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
  const wordCount = countWords(guide);
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
  const faqs = extractFaqs(guide);
  const fullUrl = `${siteUrl}/guide/${guide.slug}`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    datePublished: guide.published,
    dateModified: getDateModified(guide.published),
    inLanguage: 'it-IT',
    wordCount,
    timeRequired: `PT${readingTimeMinutes}M`,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.article-summary', 'h1', '.key-takeaways'],
    },
    about: [
      { '@type': 'Thing', name: 'Auto usata', sameAs: 'https://it.wikipedia.org/wiki/Autovettura' },
      { '@type': 'Thing', name: 'Quotazione automobile', sameAs: 'https://it.wikipedia.org/wiki/Valutazione' },
    ],
    isBasedOn: [
      'https://www.mit.gov.it/',
      'https://ec.europa.eu/safety-gate',
    ],
    author: {
      '@type': 'Organization',
      name: 'Redazione AutoEsperto',
      url: `${siteUrl}/lavora-con-noi`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'AutoEsperto',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': fullUrl,
    },
    image: [`${siteUrl}/og-image.png`],
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Guide', item: `${siteUrl}/guide` },
      { '@type': 'ListItem', position: 3, name: guide.title, item: fullUrl },
    ],
  };

  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : null;

  const tocItems = guide.sections.map((sec) => ({
    heading: sec.heading,
    id: slugifyHeading(sec.heading),
  }));

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <ArticleInteractiveBar title={guide.title} url={fullUrl} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      <main className="max-w-3xl mx-auto px-5 pt-8 pb-20">
        <nav aria-label="Breadcrumb" className="text-xs text-text-tertiary mb-4">
          <ol className="inline-flex items-center gap-1.5 flex-wrap">
            <li>
              <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/guide" className="hover:text-accent transition-colors">Guide</Link>
            </li>
            <li>/</li>
            <li>
              <span className="text-text-secondary font-medium line-clamp-1">{guide.title}</span>
            </li>
          </ol>
        </nav>

        <Link
          href="/guide"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-accent transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Tutte le guide
        </Link>

        <article itemScope itemType="https://schema.org/Article">
          <header className="border-b border-border/60 pb-6 mb-8">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center rounded-full bg-accent-light px-2.5 py-1 text-xs font-bold text-accent">
                {GUIDE_CATEGORIES[guide.category].label}
              </span>
              <span className="text-xs font-semibold text-text-tertiary">
                Di Redazione AutoEsperto
              </span>
              <span className="text-text-tertiary">·</span>
              <div className="flex items-center gap-1 text-xs text-text-tertiary font-medium">
                <Calendar className="w-3.5 h-3.5" />
                <time dateTime={guide.published} itemProp="datePublished">
                  {new Date(guide.published).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
                </time>
              </div>
              <span className="text-text-tertiary">·</span>
              <div className="flex items-center gap-1 text-xs text-text-tertiary font-medium">
                <Clock className="w-3.5 h-3.5 text-accent" />
                <span>{readingTimeMinutes} min lettura</span>
              </div>
              <span className="text-text-tertiary">·</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[11px] font-bold">
                ✓ Aggiornato {new Date(getDateModified(guide.published)).toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
              </span>
            </div>

            <h1 itemProp="headline" className="text-2xl md:text-4xl font-extrabold tracking-tight text-text-primary leading-[1.15] mt-4">
              {guide.title}
            </h1>
            <p itemProp="description" className="article-summary text-text-secondary text-base leading-relaxed mt-4">
              {guide.description}
            </p>
          </header>

          {/* Highlights / Key Takeaways Box for Featured Snippet & GEO AI Overviews */}
          {guide.sections.length > 0 && (
            <div className="key-takeaways my-6 rounded-2xl bg-accent-light/40 border border-accent/20 p-5">
              <div className="flex items-center gap-2 text-sm font-bold text-accent uppercase tracking-wide mb-3">
                <Sparkles className="w-4 h-4" />
                <span>In sintesi - Punti chiave per la ricerca</span>
              </div>
              <ul className="space-y-2.5 text-sm text-text-primary leading-relaxed">
                {guide.sections.slice(0, 4).map((sec) => (
                  <li key={sec.heading} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>
                      <strong className="font-semibold">{sec.heading.replace(/^\d+\.\s*/, '')}:</strong>{' '}
                      {sec.paragraphs[0] ? sec.paragraphs[0] : ''}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Table of Contents / Indice dei contenuti for SERP Anchor Jump Links */}
          {tocItems.length > 1 && (
            <nav aria-label="Indice dei contenuti" className="my-8 rounded-2xl bg-surface-2 border border-border p-5">
              <div className="flex items-center gap-2 text-sm font-bold text-text-primary uppercase tracking-wide border-b border-border/60 pb-3 mb-3">
                <List className="w-4 h-4 text-accent" />
                <span>Indice della guida</span>
              </div>
              <ol className="space-y-2 text-sm text-text-secondary">
                {tocItems.map((item, idx) => (
                  <li key={item.id} className="flex items-start gap-2.5">
                    <span className="font-semibold text-accent/90 text-xs shrink-0 mt-0.5">{idx + 1}.</span>
                    <a
                      href={`#${item.id}`}
                      className="hover:text-accent hover:underline transition-colors leading-snug"
                    >
                      {item.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div itemProp="articleBody" className="mt-8 space-y-10">
            {guide.sections.map((section, index) => {
              const sectionId = slugifyHeading(section.heading);
              return (
                <section key={section.heading} id={sectionId} className="scroll-mt-20">
                  <h2 className="text-xl font-bold text-text-primary">
                    <a href={`#${sectionId}`} className="hover:text-accent transition-colors">
                      {section.heading}
                    </a>
                  </h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)} className="text-text-secondary text-base leading-relaxed mt-3">
                      {renderParagraphWithLinks(paragraph)}
                    </p>
                  ))}
                  {section.list && (
                    <ul className="mt-4 space-y-2">
                      {section.list.map((item) => (
                        <li key={item.slice(0, 40)} className="flex gap-2.5 text-sm text-text-secondary leading-relaxed">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          <span>{renderParagraphWithLinks(item)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {index === 1 && guide.sections.length > 3 && <AdInArticle />}
                </section>
              );
            })}
          </div>

          <ArticleFeedbackBox />

          <div className="mt-10 rounded-2xl bg-surface-2 border border-border p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-text-primary uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>Metodologia & Fonti Ufficiali</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed mt-2.5">
              Questa guida è stata redatta dal team di esperti di <strong>AutoEsperto</strong> e verificata sul mercato automotive italiano 2026. I dati sulle quotazioni, sull&apos;affidabilità e sui costi di riparazione sono elaborati dal nostro algoritmo proprietario che analizza quotidianamente oltre 10.000+ annunci reali, incrociandoli con banche dati di richiami ufficiali (Safety Gate UE, NHTSA) e storici di manutenzione.
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

        <section className="mt-12 rounded-2xl bg-accent-light border border-accent/20 p-6 text-center">
          <div className="flex justify-center mb-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-white shadow-md shadow-accent/20">
              <ScanSearch className="h-6 w-6" />
            </span>
          </div>
          <h2 className="text-lg font-bold text-text-primary">Vuoi controllare un&apos;auto specifica?</h2>
          <p className="text-sm text-text-secondary leading-relaxed mt-2 max-w-md mx-auto">
            Usa lo scanner gratuito di AutoEsperto: prezzo di mercato, affidabilità e cosa controllare prima di comprarla.
          </p>
          <Link
            href="/#scanner-section"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-accent/20 hover:bg-accent-hover transition-colors"
          >
            Analizza un&apos;auto gratis <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-3 text-xs text-text-tertiary">
            Gratis · senza registrazione · risultato in pochi secondi
          </p>
        </section>

        {otherGuides.length > 0 && (
          <section className="mt-12">
            <AdBanner />
            <h2 className="text-lg font-bold text-text-primary mt-8">Altre guide correlate</h2>
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

      <SiteFooter />
    </div>
  );
}


