'use client';

import { useEffect, useState } from 'react';
import { Cookie, X } from 'lucide-react';
import { getConsent, setConsent, type ConsentChoice } from '@/lib/consent';
import Link from 'next/link';

export default function CookieConsent() {
  const [choice, setChoice] = useState<ConsentChoice>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setChoice(getConsent());
    const openPreferences = () => setChoice(null);
    window.addEventListener('ae-open-cookie-preferences', openPreferences);
    return () => window.removeEventListener('ae-open-cookie-preferences', openPreferences);
  }, []);

  if (!mounted) return null;

  if (choice !== null) {
    return (
      <button
        type="button"
        onClick={() => setChoice(null)}
        className="fixed bottom-3 left-3 z-40 inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-2 text-[11px] font-bold text-slate-600 shadow-sm hover:text-slate-950"
        aria-label="Modifica preferenze cookie"
      >
        <Cookie className="h-3.5 w-3.5" /> Cookie
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 animate-slide-up" role="dialog" aria-label="Consenso cookie">
      <div className="relative max-w-3xl mx-auto bg-slate-900/95 text-white backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl p-5 md:p-6">
        <button type="button" onClick={() => { setConsent('refused'); setChoice('refused'); }} className="absolute right-3.5 top-3.5 grid h-8 w-8 place-items-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors" aria-label="Chiudi e usa solo cookie necessari"><X className="h-4 w-4" /></button>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
            <Cookie className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0 pr-6">
            <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
              Usiamo strumenti tecnici necessari e, solo con il tuo consenso e dopo l’attivazione di una CMP certificata, Google AdSense sulle pagine pubbliche. Puoi rifiutare senza perdere le funzioni del servizio. Leggi la{' '}
              <Link href="/cookie-policy" className="underline hover:text-white transition-colors text-blue-400 font-semibold">
                Cookie Policy
              </Link>
              .
            </p>
            <div className="flex flex-wrap gap-2.5 mt-4">
              <button
                onClick={() => { setConsent('accepted'); setChoice('accepted'); }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 shadow-md transition-colors"
              >
                Accetta tutti
              </button>
              <button
                onClick={() => { setConsent('refused'); setChoice('refused'); }}
                className="px-5 py-2.5 rounded-xl bg-white/10 text-slate-200 font-bold text-xs hover:bg-white/20 transition-colors"
              >
                Solo necessari
              </button>
              <Link href="/cookie-policy" className="px-3 py-2.5 text-xs font-semibold text-slate-400 underline hover:text-white transition-colors">Gestisci</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
