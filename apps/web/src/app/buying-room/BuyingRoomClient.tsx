'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bookmark,
  Car,
  CheckCircle2,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Tag,
  MessageCircle,
  Share2,
  Sparkles,
  GitCompare,
  Plus,
} from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import type { ShortlistedCar, BuyingStage } from '@/lib/buyingRoom';
import {
  getShortlistedCars,
  updateBuyingStage,
  removeFromBuyingRoom,
  STAGE_CONFIG,
} from '@/lib/buyingRoom';

export default function BuyingRoomClient() {
  const [cars, setCars] = useState<ShortlistedCar[]>([]);

  useEffect(() => {
    setCars(getShortlistedCars());
  }, []);

  const handleStageChange = (id: string, newStage: BuyingStage) => {
    const updated = updateBuyingStage(id, newStage);
    if (updated) {
      setCars(getShortlistedCars());
    }
  };

  const handleRemove = (id: string) => {
    removeFromBuyingRoom(id);
    setCars(getShortlistedCars());
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-white">
      <SiteHeader />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 space-y-6">
        {/* Top Intro */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <Bookmark className="w-4 h-4" /> Spazio Personale Acquisto
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              AutoEsperto Buying Room
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Segui e confronta le auto che ti interessano, dalla prima scoperta fino all&apos;acquisto e al passaggio nel tuo Vehicle Passport.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/confronta"
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <GitCompare className="w-4 h-4" /> Confronta Modelli
            </Link>

            <Link
              href="/auto-finder"
              className="px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Trova altre auto
            </Link>
          </div>
        </div>

        {/* Cars List or Empty State */}
        {cars.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 grid place-items-center mx-auto">
              <Car className="w-7 h-7" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Nessuna auto salvata al momento
              </h2>
              <p className="text-xs text-slate-500">
                Usa l&apos;Auto Finder o l&apos;Analisi Annuncio per salvare le migliori occasioni e seguirne la trattativa qui.
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                href="/auto-finder"
                className="px-5 py-3 rounded-2xl bg-blue-600 text-white font-bold text-xs shadow-md hover:bg-blue-500 transition-all"
              >
                Avvia Auto Finder
              </Link>
              <Link
                href="/analizza-annuncio"
                className="px-5 py-3 rounded-2xl bg-slate-100 text-slate-800 font-bold text-xs hover:bg-slate-200 transition-all"
              >
                Analizza un Annuncio
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {cars.map((car) => {
              const currentStageConfig = STAGE_CONFIG[car.stage] || STAGE_CONFIG.salvata;

              return (
                <div
                  key={car.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-all"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${currentStageConfig.badgeColor}`}>
                          Fase {currentStageConfig.stepNumber}: {currentStageConfig.label}
                        </span>
                        {car.askingPrice && (
                          <span className="text-xs font-bold text-slate-500">
                            Prezzo: <strong>€{car.askingPrice.toLocaleString('it-IT')}</strong>
                          </span>
                        )}
                      </div>

                      <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                        {car.make} {car.model} {car.year ? `(${car.year})` : ''}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      {car.trustScore && (
                        <span className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200">
                          Trust: {car.trustScore}/100
                        </span>
                      )}
                      {car.dealScore && (
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200">
                          Deal: {car.dealScore}/100
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemove(car.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                        title="Rimuovi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Decision Timeline Progression Bar */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Avanzamento Decisionale:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-7 gap-1 text-[11px] font-bold text-center">
                      {(Object.keys(STAGE_CONFIG) as BuyingStage[]).map((st) => {
                        const conf = STAGE_CONFIG[st];
                        const isCurrent = car.stage === st;
                        const isPassed = conf.stepNumber <= currentStageConfig.stepNumber;

                        return (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleStageChange(car.id, st)}
                            className={`p-2 rounded-xl border transition-all text-left sm:text-center ${
                              isCurrent
                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                : isPassed
                                ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200'
                                : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            <span className="text-[9px] opacity-70 block">{conf.stepNumber}.</span>
                            <span className="truncate block">{conf.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action CTAs */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="text-xs text-slate-500">
                      Prossima azione suggerita: <strong>{currentStageConfig.nextAction}</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/analizza-annuncio?make=${encodeURIComponent(car.make)}&model=${encodeURIComponent(car.model)}`}
                        className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Riesamina
                      </Link>

                      {car.stage === 'acquistata' ? (
                        <Link
                          href="/passport"
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                        >
                          <Car className="w-3.5 h-3.5" /> Gestisci nel Vehicle Passport
                        </Link>
                      ) : (
                        <Link
                          href={`/ai-car-advisor?ask=${encodeURIComponent(`Ho in trattativa una ${car.make} ${car.model}. Come posso chiudere al miglior prezzo?`)}`}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5" /> Chiedi consigli trattativa
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
