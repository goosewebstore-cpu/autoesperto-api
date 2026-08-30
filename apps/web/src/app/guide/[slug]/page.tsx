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
import GuideTableOfContents from '@/components/GuideTableOfContents';
import ArticleValuatorWidget from '@/components/ArticleValuatorWidget';
import GuideCard from '@/components/GuideCard';


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
  'analizza-annuncio': {
    label: 'Analizza annuncio con AutoEsperto',
    href: '/analizza-annuncio',
    description: 'Incolla il link o carica una foto: calcola Trust Score, prezzo reale e controlli da fare prima di comprare.',
  },
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
  'truffa-km': {
    label: 'Verifica chilometri e usura',
    href: '/',
    description: 'Scansiona foto e documenti per individuare incongruenze sul chilometraggio.',
  },
  'auto-neopatentati': {
    label: 'Guida auto per neopatentati',
    href: '/neopatentati',
    description: 'Consulta i modelli conformi ai limiti di potenza e neopatentati 2026.',
  },
  'calcolo-bollo': {
    label: 'Calcola il bollo auto',
    href: '/calcolo-bollo',
    description: 'Calcola la tassa automobilistica per kW, regione ed esenzioni ibride/elettriche.',
  },
  'migliori-suv': {
    label: 'Confronta i migliori SUV',
    href: '/confronta',
    description: 'Metti a confronto affidabilità, consumi e quotazioni dei SUV sul mercato.',
  },
  'incentivi-usato': {
    label: 'Verifica incentivi ed esenzioni',
    href: '/incentivi-auto',
    description: 'Scopri le agevolazioni fiscali, sconti ed ecobonus attivi per l\'auto.',
  },
  'profilo-digitale': {
    label: 'Crea il Profilo Digitale auto',
    href: '/passport',
    description: 'Digitalizza lo storico di tagliandi, manutenzioni e scadenze del tuo veicolo.',
  },
};

const DEFAULT_CTA = {
  label: 'Valuta il prezzo reale',
  href: '/valutazione',
  description: 'Confronta il prezzo richiesto con la media di mercato dagli annunci reali.',
};

function getGuideCta(ctaKey?: string): { label: string; href: string; description: string } {
  if (!ctaKey) return DEFAULT_CTA;
  if (guideCtas[ctaKey]) return guideCtas[ctaKey];
  if (ctaKey.length > 25) {
    return {
      label: 'Analizza la tua auto gratis',
      href: '/',
      description: ctaKey,
    };
  }
  return DEFAULT_CTA;
}

export const dynamic = 'force-static';
export const dynamicParams = true;


export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const rawSlug = resolvedParams?.slug || '';
  const guide = getGuide(rawSlug);
  if (!guide) return {};

  const fullUrl = `${siteUrl}/guide/${guide.slug}`;
  const guideImageUrl = guide.image
    ? (guide.image.startsWith('http') ? guide.image : `${siteUrl}${guide.image.startsWith('/') ? '' : '/'}${guide.image}`)
    : `${siteUrl}/og-image.png`;

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
      title: `${guide.title} | AutoEsperto`,
      description: guide.description,
      url: fullUrl,
      siteName: 'AutoEsperto',
      publishedTime: guide.published,
      modifiedTime: getDateModified(guide.published),
      authors: ['Redazione AutoEsperto'],
      section: GUIDE_CATEGORIES[guide.category].label,
      images: [
        {
          url: guideImageUrl,
          secureUrl: guideImageUrl,
          width: 1200,
          height: 630,
          type: guideImageUrl.endsWith('.png') ? 'image/png' : 'image/jpeg',
          alt: guide.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.title,
      description: guide.description,
      images: [guideImageUrl],
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

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[-\s]+/g, '-')
    .replace(/^-+|-+$/g, '');
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
    if (s.paragraphs) {
      for (const p of s.paragraphs) {
        count += p.split(/\s+/).length;
      }
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

    if (isQuestion && section.paragraphs && section.paragraphs.length > 0) {
      const answer = section.paragraphs.join(' ') + (section.list ? ' ' + section.list.join('. ') : '');
      faqs.push({
        question: heading.replace(/^\d+\.\s*/, ''),
        answer: answer.replace(/\s+/g, ' ').trim(),
      });
    }
  }
  return faqs;
}

const POPULAR_MENTIONS = [
  { make: 'Fiat', model: 'Panda' },
  { make: 'Fiat', model: '500' },
  { make: 'Fiat', model: 'Punto' },
  { make: 'Fiat', model: 'Tipo' },
  { make: 'Volkswagen', model: 'Golf' },
  { make: 'Volkswagen', model: 'Polo' },
  { make: 'Volkswagen', model: 'T-Roc' },
  { make: 'Volkswagen', model: 'Tiguan' },
  { make: 'Toyota', model: 'Yaris' },
  { make: 'Toyota', model: 'Corolla' },
  { make: 'Ford', model: 'Fiesta' },
  { make: 'Ford', model: 'Focus' },
  { make: 'Ford', model: 'Puma' },
  { make: 'Renault', model: 'Clio' },
  { make: 'Renault', model: 'Captur' },
  { make: 'Peugeot', model: '208' },
  { make: 'Peugeot', model: '2008' },
  { make: 'Citroën', model: 'C3' },
  { make: 'Opel', model: 'Corsa' },
  { make: 'Dacia', model: 'Sandero' },
  { make: 'Dacia', model: 'Duster' },
  { make: 'Hyundai', model: 'i10' },
  { make: 'Hyundai', model: 'Tucson' },
  { make: 'Kia', model: 'Picanto' },
  { make: 'Kia', model: 'Sportage' },
  { make: 'Nissan', model: 'Qashqai' },
  { make: 'BMW', model: 'Serie 1' },
  { make: 'BMW', model: 'Serie 3' },
  { make: 'Audi', model: 'A3' },
  { make: 'Mercedes-Benz', model: 'Classe A' },
  { make: 'Jeep', model: 'Renegade' },
  { make: 'Alfa Romeo', model: 'Giulietta' },
  { make: 'Lancia', model: 'Ypsilon' },
];

const PRECOMPUTED_MENTIONS = POPULAR_MENTIONS.map((item) => ({
  ...item,
  normFull: normalize(`${item.make} ${item.model}`),
  normModel: ` ${normalize(item.model)} `,
}));

function getMentionedModels(guide: Guide): Array<{ make: string; model: string }> {
  let fullText = guide.title + ' ' + guide.description + ' ';
  for (const s of guide.sections) {
    fullText += s.heading + ' ';
    if (s.paragraphs) fullText += s.paragraphs.join(' ') + ' ';
  }
  const normText = normalize(fullText);
  const result: Array<{ make: string; model: string }> = [];
  for (const item of PRECOMPUTED_MENTIONS) {
    if (normText.includes(item.normFull) || normText.includes(item.normModel)) {
      result.push({ make: item.make, model: item.model });
      if (result.length >= 6) break;
    }
  }
  return result;
}

function cleanHeadingTopic(heading: string): string {
  let h = heading.replace(/^\d+[\.\)]\s*/, '').trim();
  h = h.replace(/^Cos['’]è\s+(?:lo\s+|la\s+|il\s+|l['’])?/i, '');
  h = h.replace(/^Cosa prevede\s+(?:lo\s+|la\s+|il\s+|l['’])?/i, '');
  h = h.replace(/^Come\s+/i, '');
  h = h.replace(/:\s*cosa succede$/i, '');
  h = h.trim();
  return h.charAt(0).toUpperCase() + h.slice(1);
}

function extractFirstSmartSentence(text?: string): string {
  if (!text) return '';
  let cleaned = text.replace(/^[•\-\*\d\.\)\s]+/, '').trim();
  if (cleaned.length < 10) return '';

  const dotIdx = cleaned.indexOf('. ');
  let sentence = dotIdx !== -1 ? cleaned.slice(0, dotIdx + 1).trim() : cleaned;
  if (sentence.length < 30 && cleaned.length > sentence.length) {
    sentence = cleaned;
  }
  if (sentence.length > 175) {
    const truncated = sentence.slice(0, 170);
    const lastSpace = truncated.lastIndexOf(' ');
    sentence = (lastSpace > 90 ? truncated.slice(0, lastSpace) : truncated).trim() + '...';
  }

  return sentence;
}

function extractGuideTakeaways(guide: Guide): Array<{ topic: string; summary: string }> {
  const takeaways: Array<{ topic: string; summary: string }> = [];
  const validSections = guide.sections.filter((s) => {
    const lower = s.heading.toLowerCase();
    return !lower.includes('domande frequenti') &&
           !lower.includes('faq') &&
           !lower.includes('fonti') &&
           !lower.includes('metodologia') &&
           !lower.includes('chi siamo');
  });

  for (const sec of validSections) {
    if (takeaways.length >= 4) break;

    const topic = cleanHeadingTopic(sec.heading);
    let summary = '';

    for (const p of sec.paragraphs || []) {
      const s = extractFirstSmartSentence(p);
      if (s && !s.toLowerCase().startsWith('ecco ') && !s.toLowerCase().startsWith('di seguito')) {
        summary = s;
        break;
      }
    }

    if (!summary && sec.list && sec.list.length > 0) {
      for (const item of sec.list) {
        const s = extractFirstSmartSentence(item);
        if (s) {
          summary = s;
          break;
        }
      }
    }

    if (summary) {
      takeaways.push({ topic, summary });
    }
  }

  if (takeaways.length === 0) {
    takeaways.push({
      topic: 'Panoramica',
      summary: guide.description,
    });
  }

  return takeaways;
}

export default async function GuidePage({ params }: PageProps) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams?.slug || '';
  const guide = getGuide(rawSlug);
  if (!guide) notFound();

  const mentionedModels = getMentionedModels(guide);
  const cta = getGuideCta(guide.cta);
  const takeaways = extractGuideTakeaways(guide);
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
      name: 'Redazione Tecnica & Giornalismo Automotive AutoEsperto',
      url: `${siteUrl}/guide`,
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
    image: [
      guide.image
        ? (guide.image.startsWith('http') ? guide.image : `${siteUrl}${guide.image.startsWith('/') ? '' : '/'}${guide.image}`)
        : `${siteUrl}/og-image.png`
    ],
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
              <span className="text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5 bg-slate-100/90 rounded-full px-2.5 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                A cura della Redazione Automotive
              </span>
              <span className="text-text-tertiary">·</span>
              <div className="flex items-center gap-1 text-xs text-text-tertiary font-medium">
                <Calendar className="w-3.5 h-3.5" />
                <time dateTime={guide.published} itemProp="datePublished">
                  {new Date(guide.published).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
                </time>
              </div>
              <span className="text-slate-300">·</span>
              <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>{readingTimeMinutes} min lettura</span>
              </div>
              <span className="text-slate-300">·</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[11px] font-bold">
                ✓ Aggiornato {new Date(getDateModified(guide.published)).toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
              </span>
            </div>

            <h1 itemProp="headline" className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-[1.2] mt-4">
              {guide.title}
            </h1>
            <p itemProp="description" className="article-summary text-slate-600 text-base leading-relaxed mt-4">
              {guide.description}
            </p>

            {guide.image && (
              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200/80 shadow-md bg-slate-950">
                <img
                  src={guide.image}
                  alt={guide.title}
                  className="w-full h-auto object-cover max-h-[500px]"
                  loading="eager"
                  itemProp="image"
                />
              </div>
            )}
          </header>

          <ArticleInteractiveBar title={guide.title} url={fullUrl} />

          {/* Indice della guida — link funzionanti con scroll client-side */}
          {tocItems.length > 1 && (
            <GuideTableOfContents items={tocItems} />
          )}

          <div itemProp="articleBody" className="mt-8 space-y-10">
            {guide.sections.map((section, index) => {
              const sectionId = slugifyHeading(section.heading);
              return (
                <section key={section.heading} id={sectionId} className="scroll-mt-28">
                  <h2 className="text-xl font-bold text-slate-900">
                    {section.heading}
                  </h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)} className="text-slate-600 text-base leading-relaxed mt-3">
                      {renderParagraphWithLinks(paragraph)}
                    </p>
                  ))}
                  {section.list && (
                    <ul className="mt-4 space-y-2">
                      {section.list.map((item) => (
                        <li key={item.slice(0, 40)} className="flex gap-2.5 text-sm text-slate-600 leading-relaxed">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                          <span>{renderParagraphWithLinks(item)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {index === 1 && guide.sections.length > 3 && <AdInArticle />}
                </section>
              );
            })}

            {/* Highlights / Key Takeaways Box — Sintesi conclusiva dell'esperto a fine articolo */}
            {takeaways.length > 0 && (
              <div className="key-takeaways my-10 rounded-2xl bg-gradient-to-br from-blue-50/90 via-sky-50/30 to-slate-50 border border-blue-200/90 p-5 md:p-6 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-200/60 pb-3 mb-4">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-blue-800 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>In sintesi — Punti chiave & Conclusioni</span>
                  </div>
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-100/70 rounded-full px-2.5 py-0.5">
                    Riepilogo finale dell&apos;esperto
                  </span>
                </div>
                <ul className="space-y-3.5">
                  {takeaways.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blue-600 text-white shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                      <div className="text-sm leading-relaxed text-slate-800">
                        <strong className="font-bold text-slate-900">{item.topic}:</strong>{' '}
                        <span className="text-slate-700">{item.summary}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <ArticleValuatorWidget suggestedModels={mentionedModels} articleTitle={guide.title} />

          <ArticleFeedbackBox />

          <div className="mt-10 rounded-2xl bg-slate-50 border border-slate-200 p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Metodologia Giornalistica & Fonti Tecniche</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mt-2.5">
              Questa guida e analisi di mercato è redatta dalla <strong>Redazione Tecnica di AutoEsperto</strong> con approccio da giornalismo automotive indipendente ed esperienza sul campo. I dati su quotazioni, difettosità e costi di gestione sono elaborati incrociando l&apos;osservatorio annunci italiano con banche dati ufficiali (Safety Gate UE, NHTSA, bollettini tecnici ministeriali).
            </p>
          </div>
        </article>

        {mentionedModels.length > 0 && (
          <section className="mt-12" aria-label="Auto citate in questa guida">
            <h2 className="text-lg font-bold text-slate-900">Auto citate in questa guida</h2>
            <p className="text-sm text-slate-600 mt-1">Approfondisci valore di mercato, affidabilità e costi dei modelli citati.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {mentionedModels.map(({ make, model }) => {
                const makeSlug = slugify(make);
                const modelSlug = slugify(model);
                return (
                  <div key={`${makeSlug}/${modelSlug}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <h3 className="text-sm font-bold text-slate-900">{make} {model}</h3>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-blue-600">
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

        <section className="mt-12 rounded-2xl bg-blue-50/70 border border-blue-200/80 p-6 text-center">
          <div className="flex justify-center mb-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
              <ScanSearch className="h-6 w-6" />
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">{cta.label}</h2>
          <p className="text-sm text-slate-600 leading-relaxed mt-2 max-w-md mx-auto">
            {cta.description}
          </p>
          <Link
            href={cta.href}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-colors"
          >
            {cta.label} <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-3 text-xs text-slate-400">
            Gratis · senza registrazione · risultato in pochi secondi
          </p>
        </section>

        {otherGuides.length > 0 && (
          <section className="mt-14">
            <AdBanner />
            <h2 className="text-xl font-black text-slate-900 mt-8 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Altre guide correlate
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {otherGuides.map((other) => (
                <GuideCard key={other.slug} guide={other} />
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}


