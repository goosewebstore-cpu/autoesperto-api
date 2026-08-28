'use client';

import { useState, useEffect } from 'react';
import { Share2, ThumbsUp, ThumbsDown, Check, Copy, Send, Sparkles } from 'lucide-react';

interface ArticleInteractiveBarProps {
  title: string;
  url: string;
}

export default function ArticleInteractiveBar({ title, url }: ArticleInteractiveBarProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = async () => {
    if (typeof window !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    await handleCopyLink();
  };

  const handleCopyLink = async () => {
    if (typeof window !== 'undefined') {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch {
        // clipboard write error fallback
      }
    }
  };

  return (
    <>
      {/* Scroll Progress Bar at very top of screen */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-slate-100 dark:bg-slate-800 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-150 ease-out shadow-xs"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Quick Action Bar */}
      <div className="my-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 p-3 text-xs shadow-2xs">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-bold">
          <Share2 className="w-3.5 h-3.5 text-blue-600" />
          <span>Condividi questa guida:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {/* WhatsApp */}
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} — ${url}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-800 px-3 py-1.5 font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors"
            aria-label="Condividi su WhatsApp"
          >
            <span>WhatsApp</span>
          </a>

          {/* Telegram */}
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-xl border border-sky-200 bg-sky-50 dark:bg-sky-950/40 dark:border-sky-800 px-3 py-1.5 font-bold text-sky-700 dark:text-sky-300 hover:bg-sky-100 transition-colors"
            aria-label="Condividi su Telegram"
          >
            <Send className="w-3 h-3" />
            <span>Telegram</span>
          </a>

          {/* Facebook */}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-xl border border-blue-200 bg-blue-50 dark:bg-blue-950/40 dark:border-blue-800 px-3 py-1.5 font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition-colors"
            aria-label="Condividi su Facebook"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>Facebook</span>
          </a>

          {/* Native Web Share */}
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 px-3 py-1.5 font-bold text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Altro</span>
          </button>

          {/* Copy link */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 px-3 py-1.5 font-bold text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copiato!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copia Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export function ArticleFeedbackBox() {
  const [feedback, setFeedback] = useState<'yes' | 'no' | null>(null);

  return (
    <div className="mt-10 rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50/70 via-white to-slate-50 dark:border-slate-800 dark:bg-slate-900 p-6 text-center shadow-xs">
      {feedback === null ? (
        <>
          <div className="flex justify-center mb-2">
            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 grid place-items-center">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
            Ti è stata utile questa guida?
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Il tuo voto anonimo aiuta la nostra redazione ad aggiornare le normative e migliorare i contenuti.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setFeedback('yes')}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 px-5 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 shadow-2xs transition-all cursor-pointer"
            >
              <ThumbsUp className="w-4 h-4 text-emerald-600" />
              Sì, molto chiara
            </button>
            <button
              type="button"
              onClick={() => setFeedback('no')}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 px-5 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-rose-500 hover:bg-rose-50 hover:text-rose-700 shadow-2xs transition-all cursor-pointer"
            >
              <ThumbsDown className="w-4 h-4 text-rose-600" />
              Da migliorare
            </button>
          </div>
        </>
      ) : (
        <div className="py-2 text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400 flex items-center justify-center gap-2">
          <Check className="w-4 h-4" />
          <span>Grazie per il tuo feedback! Il tuo voto è stato registrato.</span>
        </div>
      )}
    </div>
  );
}
