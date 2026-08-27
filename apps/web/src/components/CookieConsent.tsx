'use client';

import { useEffect, useState } from 'react';
import { Cookie, X, Shield, BarChart3, Megaphone, ChevronDown } from 'lucide-react';
import {
  getConsentPreferences,
  acceptAll,
  refuseAll,
  setConsentPreferences,
  updateGtagConsent,
  type ConsentPreferences,
} from '@/lib/consent';
import Link from 'next/link';

type View = 'closed' | 'banner' | 'preferences';

const CATEGORIES = [
  {
    key: 'necessary' as const,
    label: 'Cookie necessari',
    icon: Shield,
    description:
      'Indispensabili per il funzionamento del sito: sessione, preferenze, sicurezza. Sempre attivi.',
    alwaysOn: true,
  },
  {
    key: 'analytics' as const,
    label: 'Cookie statistici',
    icon: BarChart3,
    description:
      'Ci aiutano a capire come viene usato il sito (visite, pagine più viste, tempi) per migliorare il servizio. Dati anonimizzati.',
    alwaysOn: false,
  },
  {
    key: 'marketing' as const,
    label: 'Cookie di marketing',
    icon: Megaphone,
    description:
      'Usati per mostrare annunci pertinenti tramite Google AdSense. Puoi navigare senza di essi.',
    alwaysOn: false,
  },
] as const;

export default function CookieConsent() {
  const [view, setView] = useState<View>('closed');
  const [mounted, setMounted] = useState(false);
  const [prefs, setPrefs] = useState<{ analytics: boolean; marketing: boolean }>({
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    setMounted(true);
    const stored = getConsentPreferences();
    if (stored) {
      setPrefs({ analytics: stored.analytics, marketing: stored.marketing });
      updateGtagConsent({ analytics: stored.analytics, marketing: stored.marketing });
      setView('closed');
    } else {
      setView('banner');
    }

    const openPreferences = () => {
      const current = getConsentPreferences();
      if (current) {
        setPrefs({ analytics: current.analytics, marketing: current.marketing });
      }
      setView('preferences');
    };
    window.addEventListener('ae-open-cookie-preferences', openPreferences);
    return () => window.removeEventListener('ae-open-cookie-preferences', openPreferences);
  }, []);

  if (!mounted) return null;

  // ── Mini button (bottom-left) when banner is dismissed ──
  if (view === 'closed') {
    return (
      <button
        type="button"
        onClick={() => {
          const current = getConsentPreferences();
          if (current) setPrefs({ analytics: current.analytics, marketing: current.marketing });
          setView('preferences');
        }}
        className="fixed bottom-3 left-3 z-40 inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-2 text-[11px] font-bold text-slate-600 shadow-sm hover:text-slate-950 transition-colors"
        aria-label="Modifica preferenze cookie"
      >
        <Cookie className="h-3.5 w-3.5" /> Cookie
      </button>
    );
  }

  const handleAcceptAll = () => {
    acceptAll();
    setPrefs({ analytics: true, marketing: true });
    setView('closed');
  };

  const handleRefuseAll = () => {
    refuseAll();
    setPrefs({ analytics: false, marketing: false });
    setView('closed');
  };

  const handleSavePreferences = () => {
    setConsentPreferences(prefs);
    setView('closed');
  };

  // ── Main banner ──
  if (view === 'banner') {
    return (
      <div
        className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 animate-slide-up"
        role="dialog"
        aria-label="Consenso cookie"
      >
        <div className="relative max-w-3xl mx-auto bg-slate-900/95 text-white backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl p-5 md:p-6">
          <button
            type="button"
            onClick={handleRefuseAll}
            className="absolute right-3.5 top-3.5 grid h-8 w-8 place-items-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Chiudi e usa solo cookie necessari"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
              <Cookie className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0 pr-6">
              <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
                Usiamo cookie tecnici necessari e, solo con il tuo consenso, cookie statistici e
                di marketing (Google AdSense). Puoi accettare, rifiutare o personalizzare le tue
                scelte. Leggi la{' '}
                <Link
                  href="/cookie-policy"
                  className="underline hover:text-white transition-colors text-blue-400 font-semibold"
                >
                  Cookie Policy
                </Link>
                .
              </p>
              <div className="flex flex-wrap gap-2.5 mt-4">
                <button
                  onClick={handleAcceptAll}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 shadow-md transition-colors"
                >
                  Accetta tutti
                </button>
                <button
                  onClick={handleRefuseAll}
                  className="px-5 py-2.5 rounded-xl bg-white/10 text-slate-200 font-bold text-xs hover:bg-white/20 transition-colors"
                >
                  Rifiuta tutti
                </button>
                <button
                  onClick={() => setView('preferences')}
                  className="px-4 py-2.5 rounded-xl bg-white/5 text-slate-300 font-bold text-xs hover:bg-white/10 transition-colors flex items-center gap-1.5"
                >
                  Personalizza
                  <ChevronDown className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Preferences panel ──
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-label="Preferenze cookie"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-slate-900/95 text-white backdrop-blur-xl rounded-t-2xl sm:rounded-2xl border border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 px-5 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Cookie className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-sm font-bold">Preferenze cookie</h2>
              <p className="text-[11px] text-slate-400">Scegli quali cookie attivare</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const stored = getConsentPreferences();
              setView(stored ? 'closed' : 'banner');
            }}
            className="grid h-8 w-8 place-items-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Chiudi preferenze"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-3">
          {CATEGORIES.map((cat) => {
            const isOn = cat.alwaysOn || prefs[cat.key as keyof typeof prefs];
            const Icon = cat.icon;
            return (
              <div
                key={cat.key}
                className={`rounded-xl border p-4 transition-colors ${
                  isOn
                    ? 'border-blue-500/30 bg-blue-600/10'
                    : 'border-slate-700 bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`h-4 w-4 shrink-0 ${isOn ? 'text-blue-400' : 'text-slate-500'}`} />
                    <span className="text-sm font-bold truncate">{cat.label}</span>
                  </div>
                  {cat.alwaysOn ? (
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
                      Sempre attivi
                    </span>
                  ) : (
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isOn}
                      aria-label={`${isOn ? 'Disattiva' : 'Attiva'} ${cat.label}`}
                      onClick={() =>
                        setPrefs((prev) => ({
                          ...prev,
                          [cat.key]: !prev[cat.key as keyof typeof prev],
                        }))
                      }
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
                        isOn ? 'bg-blue-600 border-blue-600' : 'bg-slate-700 border-slate-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          isOn ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-2">{cat.description}</p>
              </div>
            );
          })}
        </div>

        <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-5 py-4 flex flex-wrap gap-2.5">
          <button
            onClick={handleSavePreferences}
            className="flex-1 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 shadow-md transition-colors"
          >
            Salva preferenze
          </button>
          <button
            onClick={handleAcceptAll}
            className="px-5 py-2.5 rounded-xl bg-white/10 text-slate-200 font-bold text-xs hover:bg-white/20 transition-colors"
          >
            Accetta tutti
          </button>
          <button
            onClick={handleRefuseAll}
            className="px-5 py-2.5 rounded-xl bg-white/5 text-slate-400 font-bold text-xs hover:bg-white/10 transition-colors"
          >
            Rifiuta tutti
          </button>
        </div>

        <p className="px-5 pb-4 text-[10px] text-slate-500 leading-relaxed">
          Conforme al provvedimento del Garante Privacy del 10 giugno 2021.{' '}
          <Link href="/cookie-policy" className="underline hover:text-slate-300 transition-colors">
            Cookie Policy completa
          </Link>{' '}
          ·{' '}
          <Link href="/privacy" className="underline hover:text-slate-300 transition-colors">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
