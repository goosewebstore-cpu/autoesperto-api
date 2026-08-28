'use client';

import { List } from 'lucide-react';

interface TocItem {
  id: string;
  heading: string;
}

interface Props {
  items: TocItem[];
}

export default function GuideTableOfContents({ items }: Props) {
  function scrollToSection(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 112; // altezza header sticky
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
    // aggiorna l'URL senza jump brusco
    history.pushState(null, '', `#${id}`);
  }

  return (
    <nav aria-label="Indice dei contenuti" className="my-8 rounded-2xl bg-slate-50 border border-slate-200 p-5">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-3 mb-3">
        <List className="w-3.5 h-3.5 text-blue-600 shrink-0" />
        <span>Indice della guida</span>
      </div>
      <ol className="space-y-2">
        {items.map((item, idx) => (
          <li key={item.id} className="flex items-baseline gap-2.5">
            <span className="font-bold text-blue-600 text-xs shrink-0 w-4 text-right">{idx + 1}.</span>
            <a
              href={`#${item.id}`}
              onClick={(e) => scrollToSection(e, item.id)}
              className="text-sm text-slate-700 hover:text-blue-600 hover:underline transition-colors leading-snug cursor-pointer"
            >
              {item.heading.replace(/^\d+\.\s*/, '')}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
