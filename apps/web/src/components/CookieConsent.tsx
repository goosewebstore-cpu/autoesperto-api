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
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 animate-slide-up" role="dialog" aria-label="Consenso cookie">
      <div className="relative max-w-3xl mx-auto bg-accent text-white rounded-2xl shadow-premium-lg p-5 md:p-6">
        <button type="button" onClick={() => { setConsent('refused'); setChoice('refused'); }} className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-white hover:bg-white/20" aria-label="Chiudi e usa solo cookie necessari"><X className="h-4 w-4" /></button>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <Cookie className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm leading-relaxed text-white/90">
              Usiamo strumenti tecnici necessari e, solo con il tuo consenso e dopo l’attivazione di una CMP certificata, Google AdSense sulle pagine pubbliche. Puoi rifiutare senza perdere le funzioni del servizio. Leggi la{' '}
              <Link href="/cookie-policy" className="underline hover:text-white transition-colors">
                Cookie Policy
              </Link>
              .
            </p>
            <div className="flex flex-wrap gap-2.5 mt-4">
              <button
                onClick={() => { setConsent('accepted'); setChoice('accepted'); }}
                className="px-5 py-2.5 rounded-xl bg-white text-accent font-semibold text-sm hover:bg-zinc-100 transition-colors"
              >
                Accetta tutti
              </button>
              <button
                onClick={() => { setConsent('refused'); setChoice('refused'); }}
                className="px-5 py-2.5 rounded-xl bg-white/10 text-white font-semibold text-sm hover:bg-white/20 transition-colors"
              >
                Solo necessari
              </button>
              <Link href="/cookie-policy" className="px-3 py-2.5 text-sm font-semibold text-white/90 underline hover:text-white">Gestisci e scopri di più</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
