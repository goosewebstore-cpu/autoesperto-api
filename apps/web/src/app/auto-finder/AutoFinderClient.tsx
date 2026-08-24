'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Car,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  SlidersHorizontal,
  Bookmark,
  Share2,
  ShieldCheck,
  Gauge,
  Wallet,
  Fuel,
  Compass,
  MessageCircle,
  HelpCircle,
  TrendingDown,
  Info,
  MapPin,
  Flame,
  Search,
  ExternalLink,
  ChevronRight,
  Bell,
  Heart,
} from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import type { FinderCriteria, FinderMatchResult, BodyType, FuelType, TransmissionType, UsageType, PriorityType } from '@/lib/finderEngine';
import { runAutoFinder, quickTweakCriteria } from '@/lib/finderEngine';
import { saveAdvisorContext } from '@/lib/aiAdvisor';
import { saveSearch, toggleSaveFavorite, getSavedFavorites } from '@/lib/savedSearches';
import { trackEvent } from '@/lib/analytics';

const BUDGET_PRESETS = [5000, 7500, 10000, 12500, 15000, 20000, 30000];

const USAGE_OPTIONS: { id: UsageType; label: string; desc: string; icon: string }[] = [
  { id: 'citta', label: 'Città & Traffico', desc: 'Spostamenti urbani, manovre e parcheggi stretti', icon: '🏙️' },
  { id: 'misto', label: 'Percorso Misto', desc: 'Un po\' di città, tangenziali e strade provinciali', icon: '🛣️' },
  { id: 'extraurbano', label: 'Statali & Collina', desc: 'Strade secondarie e curve', icon: '🌄' },
  { id: 'autostrada', label: 'Autostrada & Lunghi Viaggi', desc: 'Tratte veloci oltre i 110-130 km/h', icon: '✈️' },
  { id: 'famiglia', label: 'Famiglia & Bambini', desc: 'Spazio per passeggini, seggiolini e spesa', icon: '👨‍👩‍👧‍👦' },
  { id: 'lavoro', label: 'Lavoro & Spostamenti Quotidiani', desc: 'Affidabilità e bassi costi chilometrici', icon: '💼' },
  { id: 'viaggi', label: 'Vacanze & Weekend', desc: 'Capacità di carico e comfort di marcia', icon: '🧳' },
  { id: 'sportivo', label: 'Guida Dinamica & Piacere', desc: 'Assetto reattivo e buone prestazioni', icon: '🏎️' },
];

const KM_ANNUAL_OPTIONS = [
  { value: 8000, label: 'Meno di 10.000 km/anno', desc: 'Uso saltuario o prevalentemente cittadino' },
  { value: 12000, label: '10.000 – 15.000 km/anno', desc: 'Media italiana per uso privato' },
  { value: 18000, label: '15.000 – 20.000 km/anno', desc: 'Pendolari e viaggi frequenti' },
  { value: 25000, label: '20.000 – 30.000 km/anno', desc: 'Uso intenso: diesel, GPL o ibrido consigliati' },
  { value: 35000, label: 'Oltre 30.000 km/anno', desc: 'Grandi percorrenze autostradali' },
];

const FUEL_OPTIONS: { id: FuelType; label: string; desc: string }[] = [
  { id: 'indifferente', label: 'Indifferente (Consigliami tu)', desc: 'Il sistema sceglie in base ai tuoi km' },
  { id: 'hybrid', label: 'Full Hybrid / Ibrida', desc: 'Consumi bassi senza ricarica alla presa' },
  { id: 'benzina', label: 'Benzina', desc: 'Ideale per pochi km e città' },
  { id: 'diesel', label: 'Diesel', desc: 'Imbattibile per oltre 15-20.000 km/anno' },
  { id: 'gpl', label: 'GPL', desc: 'Costo al km più basso con impianto a gas' },
  { id: 'plugin', label: 'Plug-in Hybrid', desc: 'Ricaricabile per 40-60 km in elettrico puro' },
  { id: 'elettrica', label: '100% Elettrica (BEV)', desc: 'Zero emissioni e zero bollo per 5 anni' },
];

const BODY_OPTIONS: { id: BodyType; label: string; desc: string; icon: string }[] = [
  { id: 'indifferente', label: 'Qualsiasi carrozzeria', desc: 'Valuta tutti i modelli adatti', icon: '🚗' },
  { id: 'citycar', label: 'City car (Piccola)', desc: 'Sotto i 3,7 metri (Panda, 500, i10)', icon: '🚙' },
  { id: 'compatta', label: 'Compatta (2 volumi)', desc: '3,9 - 4,3 metri (Yaris, Clio, Golf)', icon: '🚗' },
  { id: 'suv', label: 'SUV & Crossover', desc: 'Guida alta e look robusto (Puma, Renegade, Duster)', icon: '🚙' },
  { id: 'station_wagon', label: 'Station Wagon', desc: 'Bagagliaio enorme per famiglia (Focus SW, Octavia)', icon: '🚐' },
  { id: 'berlina', label: 'Berlina (3 volumi)', desc: 'Eleganza e comfort di viaggio', icon: '🚘' },
  { id: 'monovolume', label: 'Monovolume / Multispazio', desc: 'Massima abitabilità verticale (Jazz)', icon: '🚐' },
];

const PRIORITY_OPTIONS: { id: PriorityType; label: string; icon: string }[] = [
  { id: 'affidabilita', label: 'Massima Affidabilità (Zero Guasti)', icon: '🛡️' },
  { id: 'prezzo', label: 'Prezzo d\'acquisto più basso', icon: '💶' },
  { id: 'consumi', label: 'Consumi ridotti al minimo', icon: '⛽' },
  { id: 'manutenzione', label: 'Manutenzione e tagliandi economici', icon: '🔧' },
  { id: 'spazio', label: 'Grande spazio interno e bagagliaio', icon: '📦' },
  { id: 'comfort', label: 'Comfort di marcia e insonorizzazione', icon: '🛋️' },
  { id: 'sicurezza', label: 'Sicurezza attiva e punteggio crash-test', icon: '⭐' },
  { id: 'rivendibilita', label: 'Facile da rivendere senza perdere valore', icon: '📈' },
  { id: 'prestazioni', label: 'Guida brillante e scattante', icon: '⚡' },
];

export default function AutoFinderClient() {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 6; // Compacted progressive flow

  // Criteria State
  const [budgetMax, setBudgetMax] = useState<number>(12000);
  const [customBudget, setCustomBudget] = useState<string>('');
  const [selectedUsages, setSelectedUsages] = useState<UsageType[]>(['misto']);
  const [annualKm, setAnnualKm] = useState<number>(12000);
  const [fuel, setFuel] = useState<FuelType>('indifferente');
  const [transmission, setTransmission] = useState<TransmissionType>('indifferente');
  const [bodyTypes, setBodyTypes] = useState<BodyType[]>(['indifferente']);
  const [priorities, setPriorities] = useState<PriorityType[]>(['affidabilita', 'consumi']);
  const [locationCity, setLocationCity] = useState<string>('');
  const [freeText, setFreeText] = useState<string>('');

  const [activeTweak, setActiveTweak] = useState<string | null>(null);
  const [savedFavorites, setSavedFavorites] = useState<string[]>(() =>
    getSavedFavorites().map((f) => `${f.make}-${f.model}`)
  );
  const [searchSavedToast, setSearchSavedToast] = useState<boolean>(false);

  const criteria: FinderCriteria = useMemo(
    () => ({
      budgetMax: customBudget ? Number(customBudget) : budgetMax,
      usages: selectedUsages,
      annualKm,
      fuel,
      transmission,
      bodyTypes,
      priorities,
      location: locationCity ? { city: locationCity } : undefined,
      freeText,
    }),
    [budgetMax, customBudget, selectedUsages, annualKm, fuel, transmission, bodyTypes, priorities, locationCity, freeText]
  );

  const result = useMemo(() => runAutoFinder(criteria), [criteria]);

  const handleNext = () => {
    if (step < totalSteps) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Finished
      setStep(totalSteps + 1);
      saveAdvisorContext({ criteria, lastFinderResults: result.matches.slice(0, 5) });
      trackEvent('finder_completed', { budgetMax: criteria.budgetMax, topMatch: result.matches[0]?.vehicle.model });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleToggleUsage = (u: UsageType) => {
    setSelectedUsages((prev) =>
      prev.includes(u) ? (prev.length > 1 ? prev.filter((item) => item !== u) : prev) : [...prev, u]
    );
  };

  const handleTogglePriority = (p: PriorityType) => {
    setPriorities((prev) => {
      if (prev.includes(p)) {
        return prev.filter((item) => item !== p);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), p];
      }
      return [...prev, p];
    });
  };

  const handleApplyTweak = (tweak: 'spend_less' | 'more_space' | 'want_suv' | 'lower_consumption' | 'max_reliability') => {
    setActiveTweak(tweak);
    const updated = quickTweakCriteria(criteria, tweak);
    setBudgetMax(updated.budgetMax);
    setBodyTypes(updated.bodyTypes);
    setFuel(updated.fuel);
    setPriorities(updated.priorities);
    trackEvent('preference_changed', { tweak });
  };

  const handleSaveSearch = () => {
    saveSearch(criteria);
    setSearchSavedToast(true);
    setTimeout(() => setSearchSavedToast(false), 3500);
    trackEvent('car_saved', { type: 'search', budget: criteria.budgetMax });
  };

  const handleToggleFav = (match: FinderMatchResult) => {
    const key = `${match.vehicle.make}-${match.vehicle.model}`;
    toggleSaveFavorite({
      make: match.vehicle.make,
      model: match.vehicle.model,
      price: match.vehicle.priceAvg,
      matchScore: match.matchScore,
      imageUrl: match.vehicle.imageUrl,
    });
    setSavedFavorites((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const isShowingResults = step > totalSteps;

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-white">
      <SiteHeader />

      <main className="flex-1 pb-20">
        {!isShowingResults ? (
          /* ─── WIZARD CONTAINER ─── */
          <div className="max-w-2xl mx-auto px-4 pt-6 sm:pt-10">
            {/* Header / Intro */}
            <div className="text-center space-y-2 mb-6 sm:mb-8">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-black border border-blue-200/80 dark:border-blue-800 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5" /> Auto Finder Intelligente
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                Trova l&apos;auto perfetta per te
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Non serve conoscere modelli o cilindrate: rispondi a poche domande e il Matching Engine seleziona le migliori auto usate sul mercato.
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Passo {step} di {totalSteps}</span>
                <span>{Math.round((step / totalSteps) * 100)}% completato</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
                  style={{ width: `${(step / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            {/* Wizard Card Box */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/5 space-y-6">
              {/* ── STEP 1: BUDGET ── */}
              {step === 1 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      Passaggio 1 · Budget
                    </span>
                    <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">
                      Quanto vuoi spendere al massimo?
                    </h2>
                    <p className="text-xs text-slate-500">
                      Indica la cifra massima che vorresti investire per l&apos;auto usata.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {BUDGET_PRESETS.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => {
                          setBudgetMax(b);
                          setCustomBudget('');
                        }}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          budgetMax === b && !customBudget
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-[1.02]'
                            : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:border-blue-400'
                        }`}
                      >
                        <span className="text-xs text-slate-400 dark:text-slate-400 block">Fino a</span>
                        <span className="text-base font-black">€{b.toLocaleString('it-IT')}</span>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Oppure inserisci una cifra personalizzata:
                    </label>
                    <div className="relative max-w-xs">
                      <input
                        type="number"
                        inputMode="numeric"
                        value={customBudget}
                        onChange={(e) => setCustomBudget(e.target.value)}
                        placeholder="es. 11500"
                        className="w-full h-11 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-blue-600"
                      />
                      <span className="absolute right-3.5 top-3 text-xs font-bold text-slate-400">€</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 2: UTILIZZO & KM ── */}
              {step === 2 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      Passaggio 2 · Utilizzo e Chilometri
                    </span>
                    <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">
                      Come userai principalmente l&apos;auto?
                    </h2>
                    <p className="text-xs text-slate-500">
                      Puoi selezionare più opzioni per definire i tuoi scenari d&apos;uso reali.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {USAGE_OPTIONS.map((u) => {
                      const isSelected = selectedUsages.includes(u.id);
                      return (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => handleToggleUsage(u.id)}
                          className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                            isSelected
                              ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 text-slate-900 dark:text-white ring-1 ring-blue-600'
                              : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                          }`}
                        >
                          <span className="text-xl shrink-0 mt-0.5">{u.icon}</span>
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-extrabold block">{u.label}</span>
                            <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">{u.desc}</span>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Annual km select */}
                  <div className="pt-2 space-y-2 border-t border-slate-100 dark:border-slate-800">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                      Quanti chilometri stimi di percorrere in un anno?
                    </label>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {KM_ANNUAL_OPTIONS.map((kmOpt) => (
                        <button
                          key={kmOpt.value}
                          type="button"
                          onClick={() => setAnnualKm(kmOpt.value)}
                          className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                            annualKm === kmOpt.value
                              ? 'bg-blue-600 text-white border-blue-600 font-bold'
                              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span className="block font-bold">{kmOpt.label}</span>
                          <span className="text-[10px] opacity-80 block">{kmOpt.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 3: ALIMENTAZIONE & CAMBIO ── */}
              {step === 3 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      Passaggio 3 · Motore e Cambio
                    </span>
                    <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">
                      Hai preferenze sul tipo di carburante?
                    </h2>
                    <p className="text-xs text-slate-500">
                      Se non hai vincoli di ZTL, ti consigliamo di lasciare &quot;Indifferente&quot; per trovare le migliori occasioni.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2">
                    {FUEL_OPTIONS.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFuel(f.id)}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          fuel === f.id
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:border-blue-400'
                        }`}
                      >
                        <span className="text-xs font-bold block">{f.label}</span>
                        <span className={`text-[11px] block mt-0.5 ${fuel === f.id ? 'text-blue-100' : 'text-slate-500'}`}>
                          {f.desc}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Transmission preference */}
                  <div className="pt-2 space-y-2 border-t border-slate-100 dark:border-slate-800">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                      Tipo di cambio:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'indifferente', label: 'Indifferente' },
                        { id: 'manuale', label: 'Manuale' },
                        { id: 'automatico', label: 'Automatico' },
                      ].map((tr) => (
                        <button
                          key={tr.id}
                          type="button"
                          onClick={() => setTransmission(tr.id as TransmissionType)}
                          className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                            transmission === tr.id
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {tr.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 4: CARROZZERIA & DIMENSIONE ── */}
              {step === 4 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      Passaggio 4 · Dimensione e Spazio
                    </span>
                    <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">
                      Che tipo di carrozzeria cerchi?
                    </h2>
                    <p className="text-xs text-slate-500">
                      Seleziona una o più categorie gradite.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {BODY_OPTIONS.map((b) => {
                      const isSelected = bodyTypes.includes(b.id);
                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => {
                            if (b.id === 'indifferente') {
                              setBodyTypes(['indifferente']);
                            } else {
                              const cleaned = bodyTypes.filter((x) => x !== 'indifferente');
                              setBodyTypes(
                                cleaned.includes(b.id)
                                  ? cleaned.length > 1
                                    ? cleaned.filter((x) => x !== b.id)
                                    : ['indifferente']
                                  : [...cleaned, b.id]
                              );
                            }
                          }}
                          className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                            isSelected
                              ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 text-slate-900 dark:text-white ring-1 ring-blue-600'
                              : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                          }`}
                        >
                          <span className="text-xl shrink-0 mt-0.5">{b.icon}</span>
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-extrabold block">{b.label}</span>
                            <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">{b.desc}</span>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── STEP 5: PRIORITÀ CHIAVE ── */}
              {step === 5 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      Passaggio 5 · Priorità Assolute
                    </span>
                    <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">
                      Cosa conta di più per te? (Scegli fino a 3)
                    </h2>
                    <p className="text-xs text-slate-500">
                      Questo guiderà l&apos;algoritmo di Match Score per premiare le auto più adatte a te.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {PRIORITY_OPTIONS.map((p) => {
                      const isSelected = priorities.includes(p.id);
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleTogglePriority(p.id)}
                          className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-2 ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                              : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-blue-400'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-base">{p.icon}</span>
                            <span className="text-xs font-bold">{p.label}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── STEP 6: ZONA & DESCRIZIONE LIBERA ── */}
              {step === 6 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      Passaggio 6 · Zona e Dettagli Aggiuntivi
                    </span>
                    <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">
                      Ultimi dettagli per perfezionare il Match
                    </h2>
                    <p className="text-xs text-slate-500">
                      Indica la tua zona o descrivi a parole tue eventuali altre esigenze particolari.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      Città o Provincia di ricerca (opzionale):
                    </label>
                    <input
                      type="text"
                      value={locationCity}
                      onChange={(e) => setLocationCity(e.target.value)}
                      placeholder="es. Milano, Roma, Siracusa, Torino..."
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-blue-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5 text-blue-600" />
                      Hai altre esigenze particolari? (Descrizione libera AI):
                    </label>
                    <textarea
                      rows={3}
                      value={freeText}
                      onChange={(e) => setFreeText(e.target.value)}
                      placeholder="es. 'Siamo in 4 con due bambini, faccio tanta città ma d'estate andiamo in montagna e vorrei spendere poco di bollo e tagliandi...'"
                      className="w-full p-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-blue-600 resize-none"
                    />
                    <p className="text-[11px] text-slate-400">
                      L&apos;AI analizzerà il tuo testo per adattare il punteggio delle auto consigliate.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-all flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Indietro
                  </button>
                ) : (
                  <div />
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-black text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all flex items-center gap-2"
                >
                  {step === totalSteps ? (
                    <>Calcola i Migliori Match <Sparkles className="w-4 h-4" /></>
                  ) : (
                    <>Continua <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ─── RESULTS VIEW CONTAINER ─── */
          <div className="max-w-5xl mx-auto px-4 pt-6 space-y-6 animate-fade-in">
            {/* Top Bar with Actions & Restart */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div>
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Risultati Personalizzati
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Le migliori auto usate per te
                </h1>
                <p className="text-xs text-slate-500">
                  Budget: <strong>€{criteria.budgetMax.toLocaleString('it-IT')}</strong> · {criteria.annualKm.toLocaleString('it-IT')} km/anno · Uso: {criteria.usages.join(', ')}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveSearch}
                  className="px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center gap-1.5 hover:bg-blue-100 transition-all"
                >
                  <Bell className="w-3.5 h-3.5" /> Salva Ricerca &amp; Alert
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Modifica filtri
                </button>
              </div>
            </div>

            {searchSavedToast && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-300 text-xs font-bold flex items-center gap-2 animate-slide-up">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Ricerca salvata con successo! Riceverai notifiche quando compariranno nuove occasioni compatibili.
              </div>
            )}

            {/* Infeasible Criteria Warning Notice if Any */}
            {result.infeasibleNotice && (
              <div className="p-4 sm:p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800/80 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-extrabold text-xs sm:text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Avviso compatibilità filtri</span>
                </div>
                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                  {result.infeasibleNotice.reason}
                </p>
                <p className="text-xs font-semibold text-amber-950 dark:text-amber-100">
                  💡 {result.infeasibleNotice.suggestion}
                </p>
              </div>
            )}

            {/* ─── DYNAMIC TWEAK MODIFIER PILLS ─── */}
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" /> Modifica al volo le tue preferenze:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'spend_less', label: '💶 Preferisco spendere meno' },
                  { id: 'more_space', label: '📦 Voglio più spazio a bordo' },
                  { id: 'want_suv', label: '🚙 Voglio solo SUV / Crossover' },
                  { id: 'lower_consumption', label: '⛽ Voglio consumare meno (Ibrida)' },
                  { id: 'max_reliability', label: '🛡️ Massima affidabilità' },
                ].map((pill) => (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => handleApplyTweak(pill.id as any)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      activeTweak === pill.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ─── RESULTS CARDS LIST ─── */}
            <div className="space-y-5">
              {result.matches.slice(0, 6).map((match, idx) => {
                const v = match.vehicle;
                const isFav = savedFavorites.includes(`${v.make}-${v.model}`);

                return (
                  <div
                    key={v.id}
                    className={`bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border transition-all shadow-sm ${
                      match.badgeCategory === 'best_overall'
                        ? 'border-blue-500 dark:border-blue-500/80 ring-2 ring-blue-500/15'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {/* Top Badge & Match Score Donut */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex flex-wrap items-center gap-2">
                        {match.badgeCategory === 'best_overall' && (
                          <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-xs">
                            🥇 Migliore per te
                          </span>
                        )}
                        {match.badgeCategory === 'best_value' && (
                          <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-xs">
                            🥈 Miglior rapporto qualità/prezzo
                          </span>
                        )}
                        {match.badgeCategory === 'best_reliability' && (
                          <span className="px-3 py-1 rounded-full bg-amber-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-xs">
                            🥉 Top per affidabilità
                          </span>
                        )}
                        <span className="text-xs font-semibold text-slate-500">
                          Segmento {v.segment} · {v.bodyType.toUpperCase()}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleToggleFav(match)}
                          className={`p-2 rounded-xl border transition-all ${
                            isFav
                              ? 'bg-rose-50 text-rose-600 border-rose-200'
                              : 'text-slate-400 hover:text-rose-500 border-slate-200 dark:border-slate-700'
                          }`}
                          title="Salva nei preferiti"
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                        </button>

                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900">
                          <span className="text-xs font-black text-blue-900 dark:text-blue-200">
                            Match Score:
                          </span>
                          <span className="text-lg font-black text-blue-600 dark:text-blue-400 number-mono">
                            {match.matchScore}/100
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Main Vehicle Grid */}
                    <div className="grid md:grid-cols-[1.4fr_1fr] gap-6 pt-5 items-start">
                      <div className="space-y-4">
                        <div>
                          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                            {v.make} {v.model}
                          </h2>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                            <span>Prezzo medio usato: <strong className="text-slate-900 dark:text-white font-mono">€{v.priceAvg.toLocaleString('it-IT')}</strong></span>
                            <span>·</span>
                            <span>Forbice tipica: €{match.estimatedPriceRange[0].toLocaleString('it-IT')} – €{match.estimatedPriceRange[1].toLocaleString('it-IT')}</span>
                          </div>
                        </div>

                        {/* Why Suits You Section */}
                        <div className="space-y-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Perché è adatta alle tue esigenze:
                          </span>
                          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                            {match.whySuitsYou.map((reason, rIdx) => (
                              <li key={rIdx} className="flex items-start gap-2">
                                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Warning Box if any */}
                        {match.warning && (
                          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200">
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <strong>Cosa considerare:</strong> {match.warning}
                            </div>
                          </div>
                        )}

                        {/* Subscores Grid */}
                        <div className="pt-2">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                            Punteggi Dettagliati per Categoria:
                          </span>
                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
                            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                              <span className="text-[10px] text-slate-500 block">Budget</span>
                              <span className="font-extrabold text-slate-900 dark:text-white">{match.subScores.budget}%</span>
                            </div>
                            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                              <span className="text-[10px] text-slate-500 block">Utilizzo</span>
                              <span className="font-extrabold text-slate-900 dark:text-white">{match.subScores.usage}%</span>
                            </div>
                            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                              <span className="text-[10px] text-slate-500 block">Affidabilità</span>
                              <span className="font-extrabold text-slate-900 dark:text-white">{match.subScores.reliability}%</span>
                            </div>
                            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                              <span className="text-[10px] text-slate-500 block">Consumi</span>
                              <span className="font-extrabold text-slate-900 dark:text-white">{match.subScores.consumption}%</span>
                            </div>
                            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                              <span className="text-[10px] text-slate-500 block">Manutenz.</span>
                              <span className="font-extrabold text-slate-900 dark:text-white">{match.subScores.maintenance}%</span>
                            </div>
                            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                              <span className="text-[10px] text-slate-500 block">Spazio</span>
                              <span className="font-extrabold text-slate-900 dark:text-white">{match.subScores.space}%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Photo & Action CTAs */}
                      <div className="space-y-4">
                        <div className="relative rounded-2xl overflow-hidden aspect-16/10 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          <img
                            src={v.imageUrl}
                            alt={`${v.make} ${v.model}`}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Offer Price Suggestion Box */}
                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-xs space-y-1">
                          <span className="font-bold text-slate-600 dark:text-slate-300 block">
                            💬 Consiglio di Trattativa AutoEsperto:
                          </span>
                          <p className="text-slate-700 dark:text-slate-200">
                            Per un buon esemplare avvia la trattativa da circa <strong>€{match.suggestedOfferRange[0].toLocaleString('it-IT')}</strong> con l&apos;obiettivo di chiudere a <strong>€{match.suggestedOfferRange[1].toLocaleString('it-IT')}</strong>.
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2">
                          <a
                            href={`https://www.autoscout24.it/lst/${encodeURIComponent(v.make.toLowerCase())}/${encodeURIComponent(v.model.toLowerCase())}?pricefrom=0&priceto=${criteria.budgetMax}`}
                            target="_blank"
                            rel="noopener noreferrer sponsored"
                            className="w-full h-11 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                          >
                            <Search className="w-4 h-4" /> Trova Annunci {v.model} <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                          </a>

                          <div className="grid grid-cols-2 gap-2">
                            <Link
                              href={`/analizza-annuncio?make=${encodeURIComponent(v.make)}&model=${encodeURIComponent(v.model)}`}
                              className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all text-center"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Controlla annuncio
                            </Link>

                            <Link
                              href={`/ai-car-advisor?ask=${encodeURIComponent(`Cosa ne pensi della ${v.make} ${v.model} con il mio budget di ${criteria.budgetMax}€?`)}`}
                              className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all text-center"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-indigo-600" /> Chiedi all&apos;Advisor
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Next Step Callout */}
            <section className="mt-8 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 sm:p-8 text-center space-y-4 shadow-xl shadow-blue-600/15">
              <h2 className="text-xl sm:text-3xl font-black tracking-tight">
                Hai già individuato un annuncio online?
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto">
                Incolla il link di AutoScout24 o Subito.it per scoprire il Trust Score, il valore reale e quanto offrire al venditore.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <Link
                  href="/analizza-annuncio"
                  className="px-6 py-3.5 rounded-2xl bg-white text-blue-600 font-extrabold text-xs sm:text-sm shadow-md hover:bg-blue-50 active:scale-98 transition-all flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" /> Analizza Annuncio con Trust Score
                </Link>
              </div>
            </section>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
