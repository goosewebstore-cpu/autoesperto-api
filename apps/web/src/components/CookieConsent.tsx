'use client';

import { useEffect, useState } from 'react';
import { Cookie } from 'lucide-react';
import { getConsent, setConsent, type ConsentChoice } from '@/lib/consent';
import Link from 'next/link';

export default function CookieConsent() {
  const [choice, setChoice] = useState<ConsentChoice>(null);

  useEffect(() => {
    setChoice(getConsent());
  }, []);

  if (choice !== null) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 animate-slide-up" role="dialog" aria-label="Consenso cookie">
      <div className="max-w-3xl mx-auto bg-accent text-white rounded-2xl shadow-premium-lg p-5 md:p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <Cookie className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm leading-relaxed text-white/90">
              Usiamo cookie tecnici e, solo con il tuo consenso, cookie di terze parti per mostrarti
              annunci personalizzati (Google AdSense). Leggi la{' '}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
