'use client';

import { useState, useEffect } from 'react';
import { List, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

interface TocItem {
  id: string;
  heading: string;
}

interface Props {
  items: TocItem[];
}

export default function GuideTableOfContents({ items }: Props) {
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;

      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveId(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  function scrollToSection(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 100;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
    setActiveId(id);
    if (typeof window !== 'undefined' && window.history) {
      window.history.pushState(null, '', `#${id}`);
    }
  }

  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Indice dei contenuti"
      className="my-7 rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900 p-4 sm:p-6 shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white grid place-items-center shadow-xs">
            <List className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-black uppercase tracking-wide text-slate-900 dark:text-white block">
              Indice della Guida
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {items.length} sezioni da leggere
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1 sm:hidden transition-colors"
        >
          <span>{isOpen ? 'Comprimi' : 'Espandi'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isOpen && (
        <ol className="space-y-2 animate-fade-in">
          {items.map((item, idx) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id} className="flex items-center gap-3">
                <span
                  className={`grid h-6 w-6 place-items-center rounded-lg text-xs font-black shrink-0 transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {idx + 1}
                </span>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => scrollToSection(e, item.id)}
                  className={`text-xs sm:text-sm leading-snug py-1 transition-all cursor-pointer ${
                    isActive
                      ? 'font-bold text-blue-600 dark:text-blue-400 translate-x-0.5 underline underline-offset-4'
                      : 'text-slate-800 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400 font-medium'
                  }`}
                >
                  {item.heading.replace(/^\d+\.\s*/, '')}
                </a>
              </li>
            );
          })}
        </ol>
      )}
    </nav>
  );
}
