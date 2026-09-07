'use client';

import { Suspense, useEffect, useRef, useState, useCallback } from 'react';
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
  CreditCard,
  FileText,
  Gauge,
  HelpCircle,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wrench,
  Zap,
} from 'lucide-react';
import VehicleScanner from '@/components/VehicleScanner';
import ReportErrorBoundary from '@/components/ReportErrorBoundary';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { trackEvent } from '@/lib/analytics';
import { type AnalyzePayload } from '@/lib/api';

/* ── Guide in evidenza (100% link verificati e attivi) ── */
const FEATURED_GUIDES = [
  {
    slug: 'auto-usata-10-segnali-problema-annuncio',
    title: 'Auto usata: 10 segnali che l’annuncio nasconde un problema',
    tag: 'Controllo Annuncio',
    readTime: '6 min',
  },
  {
    slug: '5-cose-da-controllare-prima-comprare-auto-usata',
    title: '5 cose da controllare assolutamente prima di comprare un’auto usata',
    tag: 'Guida Acquisto',
    readTime: '7 min',
  },
  {
    slug: 'aria-condizionata-auto-salva-motore-batteria-caldo-2026',
    title: 'Aria condizionata e caldo record: come salvare compressore e motore',
    tag: 'Manutenzione',
    readTime: '8 min',
  },
  {
    slug: 'benzina-quasi-da-record-guida-risparmiare-1500-euro',
    title: 'Carburanti e rincari: guida pratica per risparmiare fino a 1.500€/anno',
    tag: 'Consumi & Costi',
    readTime: '7 min',
  },
  {
    slug: 'quanto-vale-fiat-500-usata-2026-prezzi-controlli',
    title: 'Quanto vale una Fiat 500 usata nel 2026: prezzi reali e difetti noti',
    tag: 'Valutazione',
    readTime: '6 min',
  },
  {
    slug: 'autoesperto-freelance-siciliano-dati-reali-mercato-usato',
    title: 'Perché è nato AutoEsperto: trasparenza e dati reali senza intermediari',
    tag: 'Osservatorio',
    readTime: '5 min',
  },
];

/* ── App Shortcuts: I 6 bottoni strumento principali ── */
const APP_TOOLS = [
  {
    id: 'advisor',
    title: 'AI Car Advisor',
    desc: 'Chiedi: "La compreresti?" o consigli su budget',
    href: '/ai-car-advisor',
    icon: Bot,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200/80 hover:bg-indigo-100/70',
    tag: 'Consulente IA',
  },
  {
    id: 'targa',
    title: 'Verifica Targa',
    desc: 'Bollo, revisioni, fermo amministrativo e storico',
    href: '/verifica-targa',
    icon: Search,
    color: 'text-blue-600 bg-blue-50 border-blue-200/80 hover:bg-blue-100/70',
    tag: 'Dati ACI & MIT',
  },
  {
    id: 'motori',
    title: 'Difetti Motori',
    desc: 'Problemi cronici, richiami e affidabilità modello',
    href: '/motori-problemi',
    icon: Wrench,
    color: 'text-amber-600 bg-amber-50 border-amber-200/80 hover:bg-amber-100/70',
    tag: 'Guasti Noti',
  },
  {
    id: 'passaggio',
    title: 'Passaggio Proprietà',
    desc: 'Calcolo IPT esatto provincia per provincia e costi',
    href: '/passaggio-proprieta',
    icon: FileText,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200/80 hover:bg-emerald-100/70',
    tag: 'Calcolo IPT',
  },
  {
    id: 'confronta',
    title: 'Confronta Auto',
    desc: 'Metti a confronto 2 o più modelli con TCO e costi',
    href: '/confronta',
    icon: Scale,
    color: 'text-purple-600 bg-purple-50 border-purple-200/80 hover:bg-purple-100/70',
    tag: 'Fino a 4 auto',
  },
  {
    id: 'vendi',
    title: 'Quanto vale la mia?',
    desc: 'Stima del valore reale per vendere al prezzo giusto',
    href: '/vendi',
    icon: Gauge,
    color: 'text-rose-600 bg-rose-50 border-rose-200/80 hover:bg-rose-100/70',
    tag: 'Stima Vendita',
  },
];

/* ── FAQ ── */
const FAQS = [
  {
    q: 'È davvero gratuito al 100%?',
    a: 'Sì, l’analisi con Intelligenza Artificiale è completamente gratuita e non richiede alcuna carta di credito né registrazione obbligatoria.',
  },
  {
    q: 'Come fa l’IA a capire se un annuncio è un buon affare?',
    a: 'L’algoritmo incrocia in tempo reale oltre 150.000 annunci di vendita in Italia con lo storico dell’affidabilità del motore, i costi di manutenzione e la svalutazione per calcolare uno score oggettivo da 0 a 100.',
  },
  {
    q: 'Cosa posso caricare nello Scanner Foto IA?',
    a: 'Puoi caricare foto dell’auto, screenshot di annunci da smartphone (es. da Subito.it, AutoScout24 o Facebook Marketplace) o scattare una foto direttamente dalla fotocamera.',
  },
  {
    q: 'I miei dati o il mio numero di telefono vengono ceduti a concessionari?',
    a: 'Assolutamente no. AutoEsperto è una piattaforma 100% indipendente. Non chiediamo il tuo numero di telefono, non ti chiamerà nessun venditore e non abbiamo accordi commerciali per favorire specifiche auto.',
  },
  {
    q: 'Cosa contiene il report generato dall’IA?',
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

  const handleStageChange = useCallback((st: string) => {
    setScannerStage(st);
  }, []);

  const handlePrefill = (payload: AnalyzePayload) => {
    setInitialPayload(payload);
  };

  const isShowingResult = scannerStage === 'result';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Suspense fallback={null}>
        <PrefillHandler onPrefill={handlePrefill} />
      </Suspense>

      <SiteHeader />

      <main className="pb-16">
        {/* ─── APP HERO ─── */}
        {!isShowingResult && (
          <section className="pt-10 sm:pt-14 pb-6 px-4 text-center max-w-3xl mx-auto">
            {/* Live AI Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold shadow-xs mb-4 animate-fadeIn">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>IA AutoEsperto Attiva · Risultato in 3 sec</span>
            </div>

            <h1 className="text-3xl sm:text-[2.85rem] font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              L&apos;Intelligenza Artificiale che ti dice la verità su
              <span className="text-blue-600 block sm:inline"> quell&apos;auto usata</span>
            </h1>

            <p className="mt-3.5 text-sm sm:text-base text-slate-600 font-medium max-w-xl mx-auto leading-relaxed">
              Prezzo reale di mercato, difetti cronici del motore, bollo e verdetto immediato: <strong className="text-slate-900">Buon Affare</strong>, <strong className="text-slate-900">Tratta</strong> o <strong className="text-slate-900">Evitala</strong>.
            </p>

            {/* App Action Badges / Pill Buttons */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-slate-600">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-xs">
                <Check className="h-3.5 w-3.5 text-emerald-500" /> 100% Gratis
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-xs">
                <Check className="h-3.5 w-3.5 text-emerald-500" /> Nessuna registrazione
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-xs">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-600" /> Zero telemarketing
              </span>
            </div>
          </section>
        )}

        {/* ─── SCANNER IA (Strumento #1) ─── */}
        <section className="px-4 max-w-4xl mx-auto mb-12" id="scanner-section">
          <div className="bg-white rounded-3xl p-3.5 sm:p-7 border border-slate-200/90 shadow-xl shadow-slate-900/[0.05]">
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
            {/* ─── APP LAUNCHER / BOTTONI STRUMENTI ─── */}
            <section className="px-4 max-w-5xl mx-auto mb-16">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    Strumenti Rapidi per l&apos;Auto Usata
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Tutto quello che ti serve per non sbagliare acquisto, a portata di tocco.
                  </p>
                </div>
              </div>

              {/* 6 App Action Buttons Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {APP_TOOLS.map((tool) => (
                  <Link
                    key={tool.id}
                    href={tool.href}
                    className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-500 hover:shadow-lg transition-all text-left shadow-xs active:scale-98"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className={`w-10 h-10 rounded-xl grid place-items-center ${tool.color} transition-transform group-hover:scale-110`}>
                          <tool.icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                          {tool.tag}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                        {tool.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed font-medium">
                        {tool.desc}
                      </p>
                    </div>

                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                      Apri strumento <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {/* ─── ANTEPRIMA VISIVA: "Ecco cosa scopri con l'IA" ─── */}
            <section className="px-4 max-w-4xl mx-auto mb-16">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-9 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-56 h-56 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                  <div className="space-y-3 max-w-md text-center md:text-left">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
                      <Sparkles className="w-3.5 h-3.5" /> Esempio Reale di Report IA
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                      Cosa scopri in 3 secondi quando scansioni un&apos;auto:
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Niente dati confusi o numeri senza senso. Ricevi un verdetto chiaro e le istruzioni esatte per trattare il prezzo col venditore.
                    </p>
                    <div className="pt-2">
                      <a
                        href="#scanner-section"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
                      >
                        <Camera className="w-4 h-4" /> Prova gratis la tua auto ↑
                      </a>
                    </div>
                  </div>

                  {/* Mockup Card Report */}
                  <div className="w-full md:w-80 bg-white/95 backdrop-blur-sm rounded-2xl p-4 text-slate-900 shadow-2xl border border-white/20">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Analisi Veicolo</div>
                        <div className="text-xs font-black text-slate-900">Fiat Panda 1.2 Lounge</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-extrabold flex items-center gap-1">
                        <Check className="w-3 h-3" /> BUON AFFARE
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-500">Vehicle Health Score:</span>
                        <span className="font-extrabold text-blue-600">86 / 100</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-500">Valore reale stimato:</span>
                        <span className="font-bold text-slate-900">€ 8.900 <span className="text-emerald-600 font-semibold text-[10px]">(-€900)</span></span>
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

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                      <span>✓ Consumi reali: 17,2 km/l</span>
                      <span className="text-blue-600 font-bold">100% Gratis</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ─── COME FUNZIONA L'IA (3 Step App) ─── */}
            <section className="px-4 max-w-4xl mx-auto mb-16">
              <h2 className="text-center text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                Come funziona l&apos;Intelligenza Artificiale
              </h2>
              <p className="text-center text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mb-8">
                3 semplici passaggi per comprare o vendere con la massima serenità.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs text-center">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 grid place-items-center mx-auto mb-3 shadow-xs font-black text-sm">
                    1
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Riconoscimento Istantaneo</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Carica una foto, incolla un link o digita il modello. L&apos;IA individua allestimento, motorizzazione e annata.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs text-center">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 grid place-items-center mx-auto mb-3 shadow-xs font-black text-sm">
                    2
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Incrocio Big Data</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    L&apos;algoritmo confronta 150.000+ annunci di mercato, storico tagliandi, guasti ricorrenti e svalutazione.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs text-center">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 grid place-items-center mx-auto mb-3 shadow-xs font-black text-sm">
                    3
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Verdetto Inequivocabile</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Ricevi il punteggio 0-100, la stima del valore corretto e i consigli per non farti fregare durante la trattativa.
                  </p>
                </div>
              </div>
            </section>

            {/* ─── OSSERVATORIO & GUIDE EDITORIALI (Massima Autorevolezza) ─── */}
            <section className="px-4 max-w-4xl mx-auto mb-16">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200/60 px-3 py-1 text-xs font-bold text-blue-700 mb-2">
                    <BookOpen className="w-3.5 h-3.5" />
                    Osservatorio Editoriale Indipendente
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Guide Utili, Prezzi &amp; Analisi Usato</h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                    194 approfondimenti tecnici curati dalla nostra redazione con dati di mercato e banche dati ufficiali.
                  </p>
                </div>
                <Link
                  href="/guide"
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100/80 px-4 py-2 rounded-xl transition-colors shrink-0 self-start sm:self-auto"
                >
                  Tutte le 194 guide <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Pillole categorie rapide */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Link
                  href="/guide"
                  className="rounded-full border border-blue-600 bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow-xs"
                >
                  Tutte (194)
                </Link>
                <Link
                  href="/guide?categoria=acquisto"
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
                >
                  Acquisto Usato
                </Link>
                <Link
                  href="/guide?categoria=valutazione"
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
                >
                  Valutazioni &amp; Prezzi
                </Link>
                <Link
                  href="/guide?categoria=affidabilita"
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
                >
                  Affidabilità &amp; Difetti
                </Link>
                <Link
                  href="/guide?categoria=manutenzione"
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
                >
                  Manutenzione &amp; Costi
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {FEATURED_GUIDES.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/guide/${g.slug}`}
                    className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 hover:border-blue-500 hover:shadow-lg transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="inline-block rounded-md bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                          {g.tag}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {g.readTime}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                        {g.title}
                      </h3>
                    </div>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-blue-600">
                      Leggi guida <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </Link>
                ))}
              </div>

              {/* Banner autorevolezza editoriale */}
              <div className="mt-6 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
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

            {/* ─── FAQ ─── */}
            <section className="px-4 max-w-3xl mx-auto mb-14">
              <h2 className="text-center text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                Domande Frequenti
              </h2>
              <p className="text-center text-xs text-slate-500 mb-6">
                Tutto ciò che c&apos;è da sapere su AutoEsperto e l&apos;Intelligenza Artificiale.
              </p>

              <div className="space-y-2.5">
                {FAQS.map((faq) => (
                  <details key={faq.q} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden group shadow-xs">
                    <summary className="p-4 font-bold text-sm text-slate-900 cursor-pointer list-none flex items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors">
                      <span>{faq.q}</span>
                      <ChevronDown className="h-4 w-4 text-slate-400 group-open:rotate-180 transition-transform shrink-0" />
                    </summary>
                    <p className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
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
