'use client';

import { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
  className?: string;
}

export function ShareButton({ title, text, url, className = '' }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = url || window.location.href;
    trackEvent('share_clicked', { title });

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
        return;
      } catch {}
    }

    // Fallback: copy link
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-text-primary shadow-card hover:shadow-card-hover hover:border-accent/30 transition-all ${className}`}
    >
      {copied ? (
        <><Check className="h-4 w-4 text-success" /> Link copiato!</>
      ) : (
        <><Share2 className="h-4 w-4" /> Condividi analisi</>
      )}
    </button>
  );
}
