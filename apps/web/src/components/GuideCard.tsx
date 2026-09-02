import Link from 'next/link';
import {
  BadgeEuro,
  Gauge,
  ShieldCheck,
  ShoppingCart,
  Wrench,
  ArrowRight,
  Clock,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { GUIDE_CATEGORIES, type Guide, type GuideCategory } from '@/lib/guide-types';

const CATEGORY_ICONS: Record<GuideCategory, typeof ShoppingCart> = {
  acquisto: ShoppingCart,
  vendita: BadgeEuro,
  valutazione: Gauge,
  manutenzione: Wrench,
  affidabilita: ShieldCheck,
};

const CATEGORY_STYLES: Record<GuideCategory, { badge: string; borderHover: string; glow: string }> = {
  acquisto: {
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
    borderHover: 'hover:border-emerald-500/80',
    glow: 'group-hover:shadow-emerald-500/10',
  },
  vendita: {
    badge: 'bg-sky-50 text-sky-800 border-sky-200/80 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/60',
    borderHover: 'hover:border-sky-500/80',
    glow: 'group-hover:shadow-sky-500/10',
  },
  valutazione: {
    badge: 'bg-indigo-50 text-indigo-800 border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60',
    borderHover: 'hover:border-indigo-500/80',
    glow: 'group-hover:shadow-indigo-500/10',
  },
  manutenzione: {
    badge: 'bg-amber-50 text-amber-800 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
    borderHover: 'hover:border-amber-500/80',
    glow: 'group-hover:shadow-amber-500/10',
  },
  affidabilita: {
    badge: 'bg-rose-50 text-rose-800 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60',
    borderHover: 'hover:border-rose-500/80',
    glow: 'group-hover:shadow-rose-500/10',
  },
};

export function formatGuideDate(published: string): string {
  try {
    return new Date(published).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return published;
  }
}

function estimateReadingTime(guide: Guide): number {
  let words = (guide.title?.split(/\s+/).length || 0) + (guide.description?.split(/\s+/).length || 0);
  for (const s of guide.sections || []) {
    words += (s.heading?.split(/\s+/).length || 0);
    for (const p of s.paragraphs || []) {
      words += (p?.split(/\s+/).length || 0);
    }
    if (s.list) {
      for (const item of s.list) {
        words += (item?.split(/\s+/).length || 0);
      }
    }
  }
  return Math.max(3, Math.ceil(words / 190));
}

interface GuideCardProps {
  guide: Guide;
  featured?: boolean;
}

export default function GuideCard({ guide, featured = false }: GuideCardProps) {
  const Icon = CATEGORY_ICONS[guide.category] || BookOpen;
  const style = CATEGORY_STYLES[guide.category] || CATEGORY_STYLES.acquisto;
  const readTime = estimateReadingTime(guide);

  return (
    <Link
      href={`/guide/${guide.slug}`}
      className={`
        group relative flex h-full flex-col justify-between rounded-3xl border bg-white p-5 sm:p-6
        transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl
        cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-blue-600/30
        border-slate-200/80 dark:border-slate-800 dark:bg-slate-900
        ${style.borderHover} ${style.glow}
        ${featured ? 'ring-1 ring-blue-500/30 bg-gradient-to-b from-blue-50/20 to-white' : ''}
      `}
    >
      <div>
        {/* Top Badges: Category & Read Time / Date */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold tracking-tight shadow-2xs ${style.badge}`}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            {GUIDE_CATEGORIES[guide.category]?.label || 'Guida'}
          </span>

          <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 dark:text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3 text-blue-500 shrink-0" />
              {readTime} min
            </span>
            <span>·</span>
            <time dateTime={guide.published}>
              {formatGuideDate(guide.published)}
            </time>
          </div>
        </div>

        {/* Image thumbnail if present */}
        {guide.image && (
          <div className="relative mt-3.5 h-44 w-full overflow-hidden rounded-2xl bg-slate-950 shadow-xs">
            <img
              src={guide.image}
              alt={guide.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
              loading="lazy"
            />
          </div>
        )}

        {/* Title */}
        <h3 className="mt-3.5 text-base sm:text-lg font-black leading-snug text-slate-900 dark:text-white transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
          {guide.title}
        </h3>

        {/* Description */}
        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-3">
          {guide.description}
        </p>
      </div>

      {/* Footer Action */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 flex items-center gap-1">
          Leggi la guida completa
        </span>
        <span className="grid h-7 w-7 place-items-center rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200">
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </Link>
  );
}
