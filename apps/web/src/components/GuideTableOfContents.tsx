'use client';

import { useState, useEffect } from 'react';
import { List, ChevronDown, ChevronUp } from 'lucide-react';

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
      className="my-8 rounded-3xl border border-blue-200/90 bg-gradient-to-b from-blue-50/60 via-slate-50/40 to-white dark:border-slate-800 dark:bg-slate-900/60 p-5 md:p-6 shadow-xs"
    >
      <div className="flex items-center justify-between border-b border-blue-100 dark:border-slate-800 pb-3 mb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white grid place-items-center shadow-2xs">
            <List className="w-4 h-4" />
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
            Indice della Guida ({items.length} capitoli)
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs font-bold flex items-center gap-1 sm:hidden"
        >
          <span>{isOpen ? 'Nascondi' : 'Mostra'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isOpen && (
        <ol className="space-y-2.5 animate-fade-in">
          {items.map((item, idx) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id} className="flex items-baseline gap-3">
                <span
                  className={`grid h-5 w-5 place-items-center rounded-md text-[11px] font-black shrink-0 transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-blue-100/70 text-blue-700 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {idx + 1}
                </span>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => scrollToSection(e, item.id)}
                  className={`text-sm leading-snug transition-all cursor-pointer ${
                    isActive
                      ? 'font-bold text-blue-600 dark:text-blue-400 translate-x-0.5'
                      : 'text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400'
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
