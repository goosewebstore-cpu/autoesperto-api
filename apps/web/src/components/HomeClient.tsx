'use client';

import { Suspense, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowRight,
  BookOpen,
  Bot,
  Camera,
  Car,
  Check,
  ChevronDown,
  Clock,
  FileText,
  Gauge,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-react';
import VehicleScanner from '@/components/VehicleScanner';
import ReportErrorBoundary from '@/components/ReportErrorBoundary';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { type AnalyzePayload } from '@/lib/api';

/* ── Configurazione Posizioni Guide (Centralizzata in src/config/guides-positions.ts) ── */
import { HOME_GUIDES_ORDER, getHomeGuidesForCategory } from '@/config/guides-positions';

/* ── App Shortcuts: I 6 bottoni strumento principali con colori originali ── */
const APP_TOOLS = [
  {
    id: 'advisor',
    title: 'Car Advisor',
    desc: 'Chiedi: "La compreresti?" o consigli personalizzati su budget e modelli.',
    href: '/ai-car-advisor',
    icon: Bot,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200/80 hover:bg-indigo-100/70',
    tag: 'Consulente AutoEsperto',
  },
  {
    id: 'targa',
    title: 'Verifica Targa',
    desc: 'Bollo, revisioni, fermo amministrativo, proprietari e storico MIT.',
    href: '/verifica-targa',
    icon: Search,
    color: 'text-blue-600 bg-blue-50 border-blue-200/80 hover:bg-blue-100/70',
    tag: 'Dati ACI & MIT',
  },
  {
    id: 'motori',
    title: 'Difetti Motori',
    desc: 'Problemi cronici, richiami ufficiali ministeriali e affidabilità modello.',
    href: '/motori-problemi',
    icon: Wrench,
    color: 'text-amber-600 bg-amber-50 border-amber-200/80 hover:bg-amber-100/70',
    tag: 'Guasti Noti',
  },
  {
    id: 'passaggio',
    title: 'Passaggio Proprietà',
    desc: 'Calcolo IPT esatto provincia per provincia, emolumenti e marca da bollo.',
    href: '/passaggio-proprieta',
    icon: FileText,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200/80 hover:bg-emerald-100/70',
    tag: 'Calcolo IPT',
  },
  {
    id: 'confronta',
    title: 'Confronta Auto',
    desc: 'Metti a confronto 2 o più modelli con TCO, consumi e costi annui.',
    href: '/confronta',
    icon: Scale,
    color: 'text-purple-600 bg-purple-50 border-purple-200/80 hover:bg-purple-100/70',
    tag: 'Fino a 4 auto',
  },
  {
    id: 'vendi',
    title: 'Quanto vale la mia?',
    desc: 'Stima del valore reale per vendere o permutare al prezzo giusto.',
    href: '/vendi',
    icon: Gauge,
    color: 'text-rose-600 bg-rose-50 border-rose-200/80 hover:bg-rose-100/70',
    tag: 'Stima Vendita',
  },
];

/* ── FAQ con trasparenza su analisi locale AutoEsperto ── */
const FAQS = [
  {
    q: 'È davvero gratuito al 100%?',
    a: 'Sì, l’analisi di AutoEsperto è completamente gratuita, gira localmente sul nostro motore dati e non richiede alcuna carta di credito né registrazione obbligatoria.',
  },
  {
    q: 'Come fa l’analisi di AutoEsperto a capire se un annuncio è un buon affare?',
    a: 'L’algoritmo locale incrocia in tempo reale oltre 150.000 annunci di vendita in Italia con lo storico dell’affidabilità del motore, i costi di manutenzione e la svalutazione per calcolare uno score oggettivo da 0 a 100.',
  },
  {
    q: 'Cosa posso caricare nello Scanner di AutoEsperto?',
    a: 'Puoi caricare foto dell’auto, screenshot di annunci da smartphone (es. da Subito.it, AutoScout24 o Facebook Marketplace) o scattare una foto direttamente dalla fotocamera per l\'analisi visiva locale.',
  },
  {
    q: 'I miei dati o il mio numero di telefono vengono ceduti a concessionari?',
    a: 'Assolutamente no. AutoEsperto è una piattaforma 100% indipendente. Non chiediamo il tuo numero di telefono, non ti chiamerà nessun venditore e non abbiamo accordi commerciali per favorire specifiche auto.',
  },
  {
    q: 'Cosa contiene il report generato dall’analisi di AutoEsperto?',
    a: 'Prezzo stimato di mercato, verdetto netto (BUON AFFARE, TRATTA IL PREZZO o EVITALA), Vehicle Health Score, calcolo del bollo regionale, consumi reali su strada e checklist di domande da fare al venditore.',
  },
];

export interface HomeClientProps {
  stats: { makes: number; models: number };
}

function optionalNumber(value: string | null) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function PrefillHandler({ onPrefill }: { onPrefill: (payload: AnalyzePayload) => void }) {
  const searchParams = useSearchParams();
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    const make = searchParams.get('make');
    const model = searchParams.get('model');
    if (make && model) {
      ranRef.current = true;
      onPrefill({
        make,
        model,
        year: optionalNumber(searchParams.get('year')),
        km: optionalNumber(searchParams.get('km')),
        requestedPrice: optionalNumber(searchParams.get('price')),
      });
    }
  }, [searchParams, onPrefill]);

  return null;
}

export default function HomeClient({ stats }: HomeClientProps) {
  const [initialPayload, setInitialPayload] = useState<AnalyzePayload | null>(null);
  const [scannerStage, setScannerStage] = useState<string>('idle');
  const [activeGuideCategory, setActiveGuideCategory] = useState<string>('tutte');

  const displayedGuides = useMemo(() => {
    return getHomeGuidesForCategory(activeGuideCategory);
  }, [activeGuideCategory]);

  const handleStageChange = useCallback((st: string) => {
    setScannerStage(st);
  }, []);

  const handlePrefill = (payload: AnalyzePayload) => {
    setInitialPayload(payload);
  };

  const isShowingResult = scannerStage === 'result';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      <Suspense fallback={null}>
        <PrefillHandler onPrefill={handlePrefill} />
      </Suspense>

      <SiteHeader />

      <main className="pb-20 relative">
        {/* ─── HERO DESKTOP BACKGROUND CON AUTO EUROPEE ─── */}
        {!isShowingResult && (
          <div className="relative overflow-hidden pt-8 sm:pt-14 pb-10">
            {/* Sfondo con auto europee (visibile con eleganza su desktop) */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/cars/segment-berlina.jpg"
                alt="Auto europee sfondo"
                className="w-full h-full object-cover object-top opacity-10 lg:opacity-15 filter blur-[0.5px] scale-105 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-50/80 via-slate-50/95 to-slate-50" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />
            </div>

            {/* ─── APP HERO (Ottimizzato per PC Desktop & Mobile) ─── */}
            <section className="relative z-10 px-4 sm:px-6 text-center max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto">
              {/* Live Status Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/90 text-blue-700 text-xs font-bold shadow-xs mb-5 animate-fadeIn">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Analisi AutoEsperto Locale · Risultato in 3 sec</span>
              </div>

              <h1 className="text-3xl sm:text-[2.85rem] lg:text-5xl xl:text-[3.25rem] font-extrabold tracking-tight text-slate-950 leading-[1.12]">
                L&apos;Analisi Locale di AutoEsperto che ti dice la verità su
                <span className="text-blue-600 block sm:inline"> quell&apos;auto usata</span>
              </h1>

              <p className="mt-4 text-sm sm:text-base lg:text-lg text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
                Prezzo reale di mercato, difetti cronici del motore, bollo e verdetto immediato: <strong className="text-slate-900">Buon Affare</strong>, <strong className="text-slate-900">Tratta</strong> o <strong className="text-slate-900">Evitala</strong>.
              </p>

              {/* App Action Badges / Pill Buttons */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-600">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-sm border border-slate-200 shadow-xs">
                  <Check className="h-4 w-4 text-emerald-500 stroke-[2.5]" /> 100% Gratis
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-sm border border-slate-200 shadow-xs">
                  <Check className="h-4 w-4 text-emerald-500 stroke-[2.5]" /> Nessuna registrazione
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-sm border border-slate-200 shadow-xs">
                  <ShieldCheck className="h-4 w-4 text-blue-600" /> Zero telemarketing
                </span>
              </div>

              {/* Badge marche europee supportate per utenti PC */}
              <div className="hidden sm:flex items-center justify-center gap-2 mt-4 text-[11px] font-medium text-slate-400">
                <span>Database attivo su oltre 80 marche:</span>
                <span className="text-slate-600 font-semibold">Fiat · Volkswagen · Audi · BMW · Mercedes · Ford · Renault · Toyota</span>
              </div>
            </section>
          </div>
        )}

        {/* ─── SCANNER AUTOESPERTO (Strumento #1 - Espanso su Desktop) ─── */}
        <section className="px-4 sm:px-6 max-w-4xl lg:max-w-5xl xl:max-w-5xl mx-auto mb-16 relative z-10" id="scanner-section">
          <div className="bg-white rounded-3xl p-3.5 sm:p-7 lg:p-9 border border-slate-200/90 shadow-xl lg:shadow-2xl shadow-slate-900/[0.06]">
            <ReportErrorBoundary onRetry={() => window.location.reload()}>
              <VehicleScanner
                embedded
                initialPayload={initialPayload ?? undefined}
                onStageChange={handleStageChange}
              />
            </ReportErrorBoundary>
          </div>
        </section>

        {!isShowingResult && (
          <>
            {/* ─── APP LAUNCHER / BOTTONI STRUMENTI (Ottimizzati per Desktop) ─── */}
            <section className="px-4 sm:px-6 max-w-5xl lg:max-w-6xl mx-auto mb-20">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 flex items-center gap-2.5">
                    <Sparkles className="w-6 h-6 text-blue-600" />
                    Strumenti Rapidi per l&apos;Auto Usata
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                    Tutto quello che ti serve per non sbagliare acquisto, progettato per desktop e smartphone.
                  </p>
                </div>
                <div className="text-xs font-semibold text-slate-400 self-start sm:self-auto">
                  {stats.makes} marche · {stats.models} modelli
                </div>
              </div>

              {/* 6 App Action Buttons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                {APP_TOOLS.map((tool) => (
                  <Link
                    key={tool.id}
                    href={tool.href}
                    className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all text-left shadow-xs active:scale-[0.99]"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className={`w-11 h-11 rounded-xl grid place-items-center ${tool.color} transition-transform group-hover:scale-110 shadow-2xs`}>
                          <tool.icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                          {tool.tag}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                        {tool.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1.5 line-clamp-2 leading-relaxed font-medium">
                        {tool.desc}
                      </p>
                    </div>

                    <span className="mt-5 pt-3 border-t border-slate-100 inline-flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700 transition-colors">
                      <span>Apri strumento</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {/* ─── ANTEPRIMA VISIVA: "Ecco cosa scopri con l'analisi" (Wider on PC) ─── */}
            <section className="px-4 sm:px-6 max-w-5xl lg:max-w-6xl mx-auto mb-20">
              <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
                
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 relative z-10">
                  <div className="space-y-4 max-w-xl text-center lg:text-left">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
                      <Sparkles className="w-3.5 h-3.5" /> Esempio Reale di Report AutoEsperto
                    </span>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                      Cosa scopri in 3 secondi quando scansioni un&apos;auto:
                    </h2>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                      Niente dati confusi o numeri senza senso. Ricevi un verdetto chiaro e le istruzioni esatte per trattare il prezzo col venditore.
                    </p>
                    <div className="pt-3">
                      <a
                        href="#scanner-section"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg hover:shadow-blue-500/25 transition-all"
                      >
                        <Camera className="w-4 h-4" /> Prova gratis la tua auto ↑
                      </a>
                    </div>
                  </div>

                  {/* Mockup Card Report Fiat Panda */}
                  <div className="w-full lg:w-96 bg-white/95 backdrop-blur-sm rounded-2xl p-5 text-slate-900 shadow-2xl border border-white/20 shrink-0">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Analisi Veicolo</div>
                        <div className="text-sm font-black text-slate-900">Fiat Panda 1.2 Lounge</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> BUON AFFARE
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs sm:text-sm">
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-500">Vehicle Health Score:</span>
                        <span className="font-extrabold text-blue-600">86 / 100</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-500">Valore reale stimato:</span>
                        <span className="font-bold text-slate-900">€ 8.900 <span className="text-emerald-600 font-semibold text-[11px]">(-€900)</span></span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-500">Bollo annuale:</span>
                        <span className="font-semibold text-slate-800">€ 152 / anno</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Difetti noti motore:</span>
                        <span className="font-bold text-emerald-600">0 guasti critici</span>
                      </div>
                    </div>

                    <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                      <span>✓ Consumi reali: 17,2 km/l</span>
                      <span className="text-blue-600 font-bold">100% Gratis</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ─── COME FUNZIONA L'ANALISI (3 Step Espansi per Desktop) ─── */}
            <section className="px-4 sm:px-6 max-w-5xl lg:max-w-6xl mx-auto mb-20">
              <div className="text-center max-w-xl mx-auto mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Come funziona l&apos;Analisi Locale di AutoEsperto
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-2">
                  3 semplici passaggi per comprare o vendere con la massima serenità da PC o smartphone.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs text-center hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 grid place-items-center mx-auto mb-4 shadow-xs font-black text-base">
                    1
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">Riconoscimento Istantaneo</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    Carica una foto, incolla un link o digita il modello. Il motore locale individua allestimento, motorizzazione e annata.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs text-center hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 grid place-items-center mx-auto mb-4 shadow-xs font-black text-base">
                    2
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">Incrocio Big Data</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    L&apos;algoritmo confronta 150.000+ annunci di mercato, storico tagliandi, guasti ricorrenti e svalutazione.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs text-center hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 grid place-items-center mx-auto mb-4 shadow-xs font-black text-base">
                    3
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">Verdetto Inequivocabile</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    Ricevi il punteggio 0-100, la stima del valore corretto e i consigli per non farti fregare durante la trattativa.
                  </p>
                </div>
              </div>
            </section>

            {/* ─── OSSERVATORIO & GUIDE EDITORIALI (Espanso per Desktop) ─── */}
            <section className="px-4 sm:px-6 max-w-5xl lg:max-w-6xl mx-auto mb-20">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200/60 px-3 py-1 text-xs font-bold text-blue-700 mb-2">
                    <BookOpen className="w-3.5 h-3.5" />
                    Osservatorio Editoriale Indipendente
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Guide Utili, Prezzi &amp; Analisi Usato</h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                    Approfondimenti tecnici curati dalla nostra redazione con dati di mercato e banche dati ufficiali.
                  </p>
                </div>
                <Link
                  href="/guide"
                  className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100/80 px-4 py-2.5 rounded-xl transition-colors shrink-0 self-start sm:self-auto"
                >
                  Tutte le guide <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Pillole categorie rapide interattive (configurate in src/config/guides-positions.ts) */}
              <div className="flex flex-wrap gap-2 mb-6">
                {Object.entries(HOME_GUIDES_ORDER).map(([catKey, catData]) => {
                  const isActive = activeGuideCategory === catKey;
                  return (
                    <button
                      key={catKey}
                      type="button"
                      onClick={() => setActiveGuideCategory(catKey)}
                      className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'border border-blue-600 bg-blue-600 text-white shadow-xs'
                          : 'border border-slate-200 bg-white text-slate-600 hover:border-blue-500 hover:text-blue-600'
                      }`}
                    >
                      {catData.label}
                    </button>
                  );
                })}
              </div>

              {/* Griglia delle guide ordinate per posizione (Posizione 1 a 6) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                {displayedGuides.map((g, idx) => (
                  <Link
                    key={g.slug}
                    href={`/guide/${g.slug}`}
                    className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 hover:border-blue-500 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                  >
                    <div>
                      {/* Top bar: Posizione #, Categoria e Tempo lettura */}
                      <div className="flex items-center justify-between gap-2 mb-3.5">
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                          <span className="font-extrabold text-blue-500">#{idx + 1}</span>
                          <span>·</span>
                          <span>{g.categoryLabel}</span>
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3 text-blue-500" /> {g.readTime}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                        {g.title}
                      </h3>
                      {g.description && (
                        <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {g.description}
                        </p>
                      )}
                    </div>
                    <span className="mt-4 pt-3 border-t border-slate-100 inline-flex items-center gap-1 text-xs font-bold text-blue-600">
                      Leggi guida <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                ))}
              </div>

              {/* Banner autorevolezza editoriale */}
              <div className="mt-6 rounded-2xl border border-slate-200/80 bg-slate-50/90 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-600">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Giornalismo e ricerca automotive indipendente:</strong> contenuti verificati con banche dati MCTC, Safety Gate UE e quotazioni reali.
                  </span>
                </div>
                <Link
                  href="/chi-siamo"
                  className="font-bold text-blue-600 hover:text-blue-700 shrink-0 hover:underline"
                >
                  Chi siamo &amp; Metodologia &rarr;
                </Link>
              </div>
            </section>

            {/* ─── FAQ (Spaziose e centrate) ─── */}
            <section className="px-4 sm:px-6 max-w-4xl lg:max-w-5xl mx-auto mb-16">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Domande Frequenti
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Tutto ciò che c&apos;è da sapere su AutoEsperto e sull&apos;analisi locale del mercato usato.
                </p>
              </div>

              <div className="space-y-3">
                {FAQS.map((faq) => (
                  <details key={faq.q} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden group shadow-xs hover:border-slate-300 transition-colors">
                    <summary className="p-4 sm:p-5 font-bold text-sm sm:text-base text-slate-900 cursor-pointer list-none flex items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors">
                      <span>{faq.q}</span>
                      <ChevronDown className="h-4 w-4 text-slate-400 group-open:rotate-180 transition-transform shrink-0" />
                    </summary>
                    <p className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
