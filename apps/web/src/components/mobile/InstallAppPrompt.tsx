'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Download, X, Share2, PlusSquare, Sparkles, CheckCircle2 } from 'lucide-react';
import { isIOS, isPWA, isMobileDevice, triggerHaptic } from '@/lib/nativeBridge';

const STORAGE_KEY = 'ae_app_prompt_dismissed_v1';

export default function InstallAppPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const [isApple, setIsApple] = useState<boolean>(false);
  const [showIosGuide, setShowIosGuide] = useState<boolean>(false);

  useEffect(() => {
    // Non mostrare se è già installata o se non siamo su mobile
    if (isPWA() || !isMobileDevice()) return;

    // Controlla se l'utente ha già chiuso il banner di recente
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed && Date.now() - parseInt(dismissed, 10) < 7 * 24 * 60 * 60 * 1000) {
      return;
    }

    setIsApple(isIOS());

    // Ascolta l'evento prima dell'installazione su Android/Chrome
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Su iOS mostra il banner dopo qualche secondo di navigazione
    if (isIOS()) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 4000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    triggerHaptic('medium');

    if (isApple) {
      setShowIosGuide(true);
      return;
    }

    if (!deferredPrompt) {
      setShowIosGuide(true);
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } catch {
      setShowIosGuide(true);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIosGuide(false);
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-3 right-3 z-40 md:hidden animate-fade-in">
      <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-4 border border-blue-500/30 shadow-2xl shadow-blue-950/50">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600 p-2 shrink-0 flex items-center justify-center shadow-md shadow-blue-600/30">
              <Image
                src="/icon-192.png"
                alt="AutoEsperto App Icon"
                width={36}
                height={36}
                className="rounded-lg"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-extrabold tracking-tight">Installa AutoEsperto App</h4>
                <span className="bg-blue-500/20 text-blue-300 text-[10px] font-extrabold px-1.5 py-0.2 rounded">
                  Gratis
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-1">
                Accesso rapido da smartphone & fotocamera per scansionare auto al volo.
              </p>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors -mr-1 -mt-1"
            aria-label="Chiudi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* iOS Guided Steps Modal inside card */}
        {showIosGuide && (
          <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300 space-y-2 bg-slate-800/60 p-3 rounded-xl">
            <p className="font-bold text-white flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Come installare su iPhone/iPad:
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-[11px]">
              <li className="flex items-center gap-1.5">
                1. Tocca il pulsante <Share2 className="w-3.5 h-3.5 text-blue-400 shrink-0" /> <b className="text-white">Condividi</b> in basso su Safari
              </li>
              <li className="flex items-center gap-1.5">
                2. Scorri e seleziona <PlusSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> <b className="text-white">Aggiungi a schermata Home</b>
              </li>
            </ol>
          </div>
        )}

        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="flex-1 h-9 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-600/30"
          >
            <Download className="w-3.5 h-3.5" />
            {isApple ? 'Come installare' : 'Installa sul Telefono'}
          </button>
          <button
            onClick={handleDismiss}
            className="px-3 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Più tardi
          </button>
        </div>
      </div>
    </div>
  );
}
