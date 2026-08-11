'use client';

import { useState, useEffect } from 'react';
import { Share2, ThumbsUp, ThumbsDown, Check, Copy } from 'lucide-react';

interface ArticleInteractiveBarProps {
  title: string;
  url: string;
}

export default function ArticleInteractiveBar({ title, url }: ArticleInteractiveBarProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'yes' | 'no' | null>(null);

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
        // Fallback to clipboard if user cancels or share fails
      }
    }
    await handleCopyLink();
  };

  const handleCopyLink = async () => {
    if (typeof window !== 'undefined') {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <>
      {/* Scroll Progress Bar at very top of screen */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-slate-100">
        <div
          className="h-full bg-accent transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Quick Action Bar */}
      <div className="my-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface-2 p-3 text-xs">
        <div className="flex items-center gap-2 text-text-secondary font-medium">
          <span>Condividi questa guida:</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 font-semibold text-text-primary hover:border-accent hover:text-accent transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Condividi</span>
          </button>
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 font-semibold text-text-primary hover:border-accent hover:text-accent transition-colors"
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
    <div className="mt-8 rounded-2xl border border-border bg-surface-2 p-5 text-center">
      {feedback === null ? (
        <>
          <h3 className="text-sm font-bold text-text-primary">Ti è stata utile questa guida?</h3>
          <p className="text-xs text-text-secondary mt-1">Il tuo voto ci aiuta a migliorare ed aggiornare i contenuti.</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setFeedback('yes')}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2 text-xs font-semibold text-text-primary hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 transition-all"
            >
              <ThumbsUp className="w-4 h-4 text-emerald-600" />
              Sì, molto utile
            </button>
            <button
              type="button"
              onClick={() => setFeedback('no')}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2 text-xs font-semibold text-text-primary hover:border-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-all"
            >
              <ThumbsDown className="w-4 h-4 text-rose-600" />
              Potrebbe migliorare
            </button>
          </div>
        </>
      ) : (
        <div className="py-2 text-xs font-semibold text-emerald-700">
          ✓ Grazie per il tuo feedback! La nostra redazione terrà conto dei tuoi consigli.
        </div>
      )}
    </div>
  );
}
