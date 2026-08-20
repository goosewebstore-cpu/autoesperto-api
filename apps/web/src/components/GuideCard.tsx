import Link from 'next/link';
import { BadgeEuro, Gauge, ShieldCheck, ShoppingCart, Wrench, ArrowRight } from 'lucide-react';
import { GUIDE_CATEGORIES, type Guide, type GuideCategory } from '@/lib/guides';

const CATEGORY_ICONS: Record<GuideCategory, typeof ShoppingCart> = {
  acquisto: ShoppingCart,
  vendita: BadgeEuro,
  valutazione: Gauge,
  manutenzione: Wrench,
  affidabilita: ShieldCheck,
};

const CATEGORY_STYLES: Record<GuideCategory, { badge: string; iconBg: string }> = {
  acquisto: { badge: 'bg-emerald-50 text-emerald-700', iconBg: 'bg-emerald-100 text-emerald-600' },
  vendita: { badge: 'bg-sky-50 text-sky-700', iconBg: 'bg-sky-100 text-sky-600' },
  valutazione: { badge: 'bg-violet-50 text-violet-700', iconBg: 'bg-violet-100 text-violet-600' },
  manutenzione: { badge: 'bg-amber-50 text-amber-700', iconBg: 'bg-amber-100 text-amber-600' },
  affidabilita: { badge: 'bg-rose-50 text-rose-700', iconBg: 'bg-rose-100 text-rose-600' },
};

export function formatGuideDate(published: string): string {
  return new Date(published).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
}

interface GuideCardProps {
  guide: Guide;
}

export default function GuideCard({ guide }: GuideCardProps) {
  const Icon = CATEGORY_ICONS[guide.category];
  const style = CATEGORY_STYLES[guide.category];

  return (
    <Link
      href={`/guide/${guide.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card transition-all duration-300 hover:border-blue-500/50 hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer block text-left"
    >
      <div className="flex items-center justify-between gap-3">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${style.badge}`}>
          <Icon className="h-3.5 w-3.5" />
          {GUIDE_CATEGORIES[guide.category].label}
        </span>
        <time dateTime={guide.published} className="text-xs text-text-tertiary">
          {formatGuideDate(guide.published)}
        </time>
      </div>
      <h3 className="mt-3 text-base font-bold leading-snug text-text-primary transition-colors group-hover:text-blue-600">
        {guide.title}
      </h3>
      <p className="mt-2 text-xs leading-relaxed text-text-secondary line-clamp-3">{guide.description}</p>
      <div className="mt-auto pt-4 text-xs font-bold text-blue-600 flex items-center justify-between transition-all">
        <span>Leggi la guida</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
