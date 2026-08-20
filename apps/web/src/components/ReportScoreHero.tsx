'use client';

import { useState } from 'react';
import type { AutoReport } from '@autoesperto/types';
import {
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Info,
  ShieldCheck,
  Euro,
  Gauge,
  Wallet,
  Fuel,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Car,
  Search,
  Check,
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  Wrench,
  HelpCircle,
} from 'lucide-react';
import { computeScores } from '@/lib/score';

type Tone = 'good' | 'fair' | 'bad';

interface SubScoreItem {
  key: string;
  label: string;
  value: number;
  tone: Tone;
  statusLabel: string;
  description: string;
}

function formatPrice(n: number | undefined | null) {
  return Math.round(n ?? 0).toLocaleString('it-IT') + ' €';
}

function roundTo100(n: number | undefined | null) {
  return Math.round((n ?? 0) / 100) * 100;
}

function toneOf(value: number): Tone {
  if (value >= 70) return 'good';
  if (value >= 45) return 'fair';
  return 'bad';
}

function getVerdictTheme(verdictStr: string | undefined, priceScore: number) {
  if (verdictStr === 'AVOID') {
    return {
      key: 'bad' as Tone,
      label: 'EVITALA',
      badgeBg: 'bg-rose-50 border-rose-200 text-rose-700',
      badgeDot: 'bg-rose-500',
      badgeShadow: 'shadow-rose-100',
      borderAccent: 'border-rose-200',
      cardHeaderGlow: 'bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-transparent',
      ringColor: '#f43f5e',
      ringGradient: ['#fb7185', '#e11d48'],
      icon: AlertOctagon,
      title: 'Attenzione: Rischi o costi elevati',
      note: 'Questo modello presenta criticità note su affidabilità o costi di manutenzione importanti: valuta con estrema attenzione o considera alternative.',
    };
  }
  if (verdictStr === 'NEGOTIATE') {
    return {
      key: 'fair' as Tone,
      label: 'TRATTA IL PREZZO',
      badgeBg: 'bg-amber-50 border-amber-200 text-amber-800',
      badgeDot: 'bg-amber-500',
      badgeShadow: 'shadow-amber-100',
      borderAccent: 'border-amber-200',
      cardHeaderGlow: 'bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent',
      ringColor: '#f59e0b',
      ringGradient: ['#fbbf24', '#d97706'],
      icon: AlertTriangle,
      title: 'Auto interessante con riserva',
      note: 'Il modello ha buone caratteristiche, ma il prezzo o lo stato richiedono una trattativa decisa e controlli mirati.',
    };
  }
  return {
    key: 'good' as Tone,
    label: 'BUON AFFARE',
    badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    badgeDot: 'bg-emerald-500',
    badgeShadow: 'shadow-emerald-100',
    borderAccent: 'border-emerald-200',
    cardHeaderGlow: 'bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent',
    ringColor: '#10b981',
    ringGradient: ['#34d399', '#059669'],
    icon: CheckCircle2,
    title: 'Consigliata all\'acquisto',
    note: 'Quotazione competitiva rispetto al mercato e solida affidabilità generale del modello.',
  };
}

function getCostLabel(annualMaintenance: number) {
  if (annualMaintenance < 400) return { label: 'Bassi', tone: 'good' as Tone, desc: 'Economica da mantenere' };
  if (annualMaintenance < 700) return { label: 'Medi', tone: 'fair' as Tone, desc: 'Manutenzione standard' };
  return { label: 'Alti', tone: 'bad' as Tone, desc: 'Manutenzione onerosa' };
}

function categorizeChecklistItem(item: string) {
  const lower = item.toLowerCase();
  if (
    lower.startsWith('evita') ||
    lower.includes('evita:') ||
    lower.includes('difetto') ||
    lower.includes('criticit') ||
    lower.includes('problema') ||
    lower.includes('rottura') ||
    lower.includes('attenzione') ||
    lower.includes('rischi') ||
    lower.includes('fragil') ||
    lower.includes('guast') ||
    lower.includes('sconsigliat') ||
    lower.includes('perdite') ||
    lower.includes('usura precoce')
  ) {
    return {
      type: 'avoid',
      tag: 'Da evitare',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: X,
      iconClass: 'text-rose-600 bg-rose-100',
    };
  }
  if (
    lower.startsWith('preferisci') ||
    lower.includes('preferisci:') ||
    lower.includes('consigliat') ||
    lower.includes('affidabile') ||
    lower.includes('vantaggio') ||
    lower.includes('punto di forza') ||
    lower.includes('ottim')
  ) {
    return {
      type: 'prefer',
      tag: 'Consigliato',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: Check,
      iconClass: 'text-emerald-600 bg-emerald-100',
    };
  }
  if (
    lower.includes('test drive') ||
    lower.includes('controlla') ||
    lower.includes('verifica') ||
    lower.includes('prova') ||
    lower.includes('freni') ||
    lower.includes('cinghia') ||
    lower.includes('distribuzione') ||
    lower.includes('olio') ||
    lower.includes('tagliandi') ||
    lower.includes('revisione') ||
    lower.includes('ispezione')
  ) {
    return {
      type: 'check',
      tag: 'Controllo',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Wrench,
      iconClass: 'text-blue-600 bg-blue-100',
    };
  }
  return {
    type: 'info',
    tag: 'Nota modello',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: Info,
    iconClass: 'text-slate-600 bg-slate-100',
  };
}

export default function ReportScoreHero({
  report,
  isModelData = false,
}: {
  report: AutoReport;
  isModelData?: boolean;
}) {
  const [showAllAdvice, setShowAllAdvice] = useState(false);
  const [showMethodology, setShowMethodology] = useState(false);

  const vehicle = report?.vehicle || ({} as any);
  const reliability = report?.reliability || ({} as any);
  const price = report?.price || ({} as any);
  const scores = computeScores(report);

  const verdict = getVerdictTheme(reliability.verdict, scores.priceScore);
  const VerdictIcon = verdict.icon;

  const vehicleTitle = [vehicle.make, vehicle.model].filter(Boolean).join(' ') || 'Veicolo';
  const vehicleSubtitle = [vehicle.version, vehicle.year, vehicle.fuel, vehicle.body].filter(Boolean).join(' · ');

  // KPI calculations
  const estimatedPrice = price.estimatedValue || 0;
  const minPrice = price.min || Math.round(estimatedPrice * 0.85);
  const maxPrice = price.max || Math.round(estimatedPrice * 1.15);
  const requestedPrice = price.requestedPrice;

  const rawRelScore = Number(reliability.score) || 7.5;
  const relOutOfTen = (rawRelScore > 10 ? rawRelScore / 10 : rawRelScore).toFixed(1);

  const annualMaint = reliability.futureCosts?.annualMaintenance ?? 450;
  const costInfo = getCostLabel(annualMaint);

  // Subscores structured data with intuitive, unambiguous labels
  const subScores: SubScoreItem[] = [
    {
      key: 'price',
      label: 'Prezzo vs Mercato',
      value: scores.priceScore,
      tone: toneOf(scores.priceScore),
      statusLabel: scores.priceScore >= 75 ? 'Conveniente' : scores.priceScore >= 50 ? 'In linea' : 'Sopra media',
      description: 'Confronto con le quotazioni reali di mercato',
    },
    {
      key: 'reliability',
      label: 'Affidabilità Meccanica',
      value: scores.reliabilityScore,
      tone: toneOf(scores.reliabilityScore),
      statusLabel: scores.reliabilityScore >= 75 ? 'Ottima' : scores.reliabilityScore >= 50 ? 'Nella media' : 'Criticità note',
      description: 'Motore, cambio ed elettronica del modello',
    },
    {
      key: 'costs',
      label: 'Costi di Gestione',
      value: scores.costScore,
      tone: toneOf(scores.costScore),
      statusLabel: scores.costScore >= 75 ? 'Economica' : scores.costScore >= 50 ? 'Nella media' : 'Costi elevati',
      description: 'Tagliandi, bollo e manutenzione periodica',
    },
    {
      key: 'consumption',
      label: 'Consumi ed Efficienza',
      value: scores.consumptionScore,
      tone: toneOf(scores.consumptionScore),
      statusLabel: scores.consumptionScore >= 75 ? 'Molto efficiente' : scores.consumptionScore >= 50 ? 'Buoni consumi' : 'Consumi alti',
      description: 'Chilometri per litro e carburante',
    },
    {
      key: 'risk',
      label: 'Indice di Sicurezza Acquisto',
      value: scores.riskScore,
      tone: toneOf(scores.riskScore),
      statusLabel: scores.riskScore >= 75 ? 'Basso rischio' : scores.riskScore >= 50 ? 'Attenzione' : 'Rischio elevato',
      description: 'Fattore di rischio complessivo sull\'acquisto',
    },
  ];

  // Price bar position
  const marketRef = (price.market?.priceAvg ?? estimatedPrice) || 0;
  const barPos = requestedPrice != null && maxPrice > minPrice
    ? Math.max(4, Math.min(96, ((requestedPrice - minPrice) / (maxPrice - minPrice)) * 100))
    : 50;

  const offerMin = roundTo100(marketRef * 0.95);
  const offerMax = roundTo100(marketRef * 1.02);
  const maxPay = roundTo100(marketRef);
  const overpaid = requestedPrice != null && requestedPrice > maxPrice
    ? Math.round(requestedPrice - maxPrice)
    : null;

  // Checklist items
  const rawAdviceList = ((reliability.advice?.length ? reliability.advice : reliability.commonIssues) || []) as string[];
  const checklist = rawAdviceList.length > 0
    ? rawAdviceList
    : [
        'Verifica lo storico dei tagliandi e delle manutenzioni eseguite.',
        'Fai un test drive completo di almeno 20 minuti controllando rumorosità e frenata.',
        'Controlla l\'assenza di perdite o usura anomala su pneumatici e sospensioni.',
        'Verifica corrispondenza chilometri su revisioni e documenti ufficiali.',
      ];

  const visibleChecklist = showAllAdvice ? checklist : checklist.slice(0, 4);

  // SVG Gauge calculations
  const strokeWidth = 9;
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const scorePercent = Math.min(100, Math.max(0, scores.overall));
  const strokeDashoffset = circumference - (scorePercent / 100) * circumference;

  return (
    <section
      className={`rounded-3xl border ${verdict.borderAccent} bg-white shadow-xl shadow-slate-200/50 overflow-hidden transition-all duration-300`}
      aria-label={`Verdetto AutoEsperto: ${verdict.label}`}
    >
      {/* Top Identity & Verdict Header */}
      <div className={`relative px-5 py-6 sm:px-8 sm:py-7 ${verdict.cardHeaderGlow} border-b border-slate-100`}>
        {/* Badges row */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border shadow-sm ${verdict.badgeBg} ${verdict.badgeShadow}`}
            >
              <span className={`w-2 h-2 rounded-full animate-pulse ${verdict.badgeDot}`} />
              <VerdictIcon className="w-4 h-4" />
              {verdict.label}
            </span>

            {isModelData && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                <Info className="w-3.5 h-3.5" />
                Dati indicativi modello
              </span>
            )}
          </div>

          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            Report Intelligente AutoEsperto
          </span>
        </div>

        {/* Vehicle title and main summary */}
        <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              {vehicleTitle}
            </h1>
            {vehicleSubtitle && (
              <p className="mt-1 text-sm font-medium text-slate-500">
                {vehicleSubtitle}
              </p>
            )}

            <p className="mt-3 text-sm sm:text-base font-medium text-slate-700 leading-relaxed max-w-2xl">
              {reliability.summary || verdict.note}
            </p>
          </div>

          {/* Score Donut Gauge */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-sm backdrop-blur-sm shrink-0">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <defs>
                  <linearGradient id={`scoreGrad-${verdict.key}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={verdict.ringGradient[0]} />
                    <stop offset="100%" stopColor={verdict.ringGradient[1]} />
                  </linearGradient>
                </defs>
                {/* Background track (soft slate, never black!) */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke="#f1f5f9"
                  strokeWidth={strokeWidth}
                  fill="none"
                />
                {/* Colored progress arc */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke={`url(#scoreGrad-${verdict.key})`}
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight number-mono leading-none">
                  {scores.overall}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  / 100
                </span>
              </div>
            </div>

            <div className="pr-2">
              <span className="block text-[11px] font-black uppercase tracking-wider text-slate-400">
                Score Totale
              </span>
              <strong className="block text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">
                {verdict.title}
              </strong>
              <span className="block text-xs font-semibold text-slate-500 mt-0.5">
                Indice ponderato
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Essential Quick KPI Pillars */}
      <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 sm:divide-x divide-slate-100 border-b border-slate-100 bg-slate-50/50">
        {/* 1. Valore */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Euro className="w-3.5 h-3.5 text-blue-600" />
            Valore Stimato
          </div>
          <div className="mt-1.5 text-xl sm:text-2xl font-black text-slate-900 number-mono">
            {formatPrice(estimatedPrice)}
          </div>
          <div className="mt-0.5 text-xs font-medium text-slate-500">
            Fascia: {formatPrice(minPrice)} – {formatPrice(maxPrice)}
          </div>
        </div>

        {/* 2. Affidabilità */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Gauge className="w-3.5 h-3.5 text-emerald-600" />
            Affidabilità
          </div>
          <div className="mt-1.5 text-xl sm:text-2xl font-black text-slate-900 number-mono">
            {relOutOfTen} <span className="text-sm font-bold text-slate-400">/10</span>
          </div>
          <div className="mt-0.5 text-xs font-semibold text-slate-600 flex items-center gap-1">
            <span
              className={`w-2 h-2 rounded-full ${
                scores.reliabilityScore >= 70 ? 'bg-emerald-500' : scores.reliabilityScore >= 45 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
            />
            {scores.reliabilityScore >= 70 ? 'Ottima meccanica' : scores.reliabilityScore >= 45 ? 'Nella media' : 'Criticità note'}
          </div>
        </div>

        {/* 3. Costi di gestione */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Wallet className="w-3.5 h-3.5 text-indigo-600" />
            Costi di Gestione
          </div>
          <div className="mt-1.5 text-xl sm:text-2xl font-black text-slate-900">
            {costInfo.label}
          </div>
          <div className="mt-0.5 text-xs font-medium text-slate-500">
            ~{formatPrice(annualMaint)}/anno manutenzione
          </div>
        </div>

        {/* 4. Sicurezza / Rischio */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-violet-600" />
            Sicurezza Acquisto
          </div>
          <div className="mt-1.5 text-xl sm:text-2xl font-black text-slate-900">
            {scores.riskScore >= 70 ? 'Basso Rischio' : scores.riskScore >= 45 ? 'Moderato' : 'Attenzione'}
          </div>
          <div className="mt-0.5 text-xs font-semibold text-slate-600">
            Punteggio sicurezza {scores.riskScore}/100
          </div>
        </div>
      </div>

      {/* Main Body: Subscores Breakdown & Price Comparator */}
      <div className="p-5 sm:p-8 space-y-7">
        {/* Section: Subscores Breakdown */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-blue-600" />
                Punteggi Dettagliati per Categoria
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Valutazione oggettiva su 100 punti per ogni singolo fattore decisionale.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {subScores.map((item) => {
              const barColor =
                item.tone === 'good'
                  ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                  : item.tone === 'fair'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                  : 'bg-gradient-to-r from-rose-400 to-rose-500';

              const badgeColor =
                item.tone === 'good'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : item.tone === 'fair'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200';

              return (
                <div
                  key={item.key}
                  className="rounded-2xl p-4 border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-800">{item.label}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-extrabold border ${badgeColor}`}>
                      {item.value}/100
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2.5 h-2 w-full rounded-full bg-slate-200/80 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${barColor} transition-all duration-700 ease-out`}
                      style={{ width: `${Math.max(6, item.value)}%` }}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-600">{item.statusLabel}</span>
                    <span className="text-slate-400 truncate max-w-[150px]">{item.description}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section: Price vs Market Comparator */}
        <div className="rounded-2xl p-5 border border-slate-200 bg-gradient-to-b from-white to-slate-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Euro className="w-4 h-4 text-blue-600" />
                Confronto Prezzo vs Valore di Mercato
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Stima calcolata incrociando annunci reali per lo stesso modello, anno e allestimento.
              </p>
            </div>
            {price.market?.total ? (
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                Basato su {price.market.total} annunci
              </span>
            ) : null}
          </div>

          {requestedPrice != null ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Prezzo Richiesto
                  </span>
                  <strong className="block mt-1 text-lg sm:text-xl font-black text-slate-900 number-mono">
                    {formatPrice(requestedPrice)}
                  </strong>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Valore di Mercato
                  </span>
                  <strong className="block mt-1 text-lg sm:text-xl font-black text-blue-700 number-mono">
                    {formatPrice(estimatedPrice)}
                  </strong>
                  <span className="block text-[11px] text-slate-500 mt-0.5">
                    Range: {formatPrice(minPrice)} – {formatPrice(maxPrice)}
                  </span>
                </div>

                <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Differenza
                  </span>
                  <strong
                    className={`block mt-1 text-lg sm:text-xl font-black number-mono ${
                      requestedPrice > maxPrice
                        ? 'text-rose-600'
                        : requestedPrice < minPrice
                        ? 'text-emerald-600'
                        : 'text-slate-700'
                    }`}
                  >
                    {requestedPrice > estimatedPrice ? '+' : ''}
                    {formatPrice(requestedPrice - estimatedPrice)}
                  </strong>
                  <span className="block text-[11px] font-semibold text-slate-500 mt-0.5">
                    {requestedPrice > maxPrice ? 'Sopra la fascia max' : requestedPrice < minPrice ? 'Sotto la fascia min' : 'Nel range di mercato'}
                  </span>
                </div>
              </div>

              {/* Visual Range Indicator Bar */}
              <div className="pt-2">
                <div className="relative h-3 w-full rounded-full bg-slate-200 overflow-visible my-3">
                  <div className="absolute inset-y-0 left-0 right-0 rounded-full bg-gradient-to-r from-emerald-200 via-blue-200 to-rose-200" />
                  {/* Pin marker for requested price */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center group cursor-pointer z-10"
                    style={{ left: `${barPos}%` }}
                  >
                    <div className="w-4 h-4 rounded-full bg-white border-3 border-blue-600 shadow-md ring-2 ring-blue-200" />
                    <span className="absolute -top-7 whitespace-nowrap text-[10px] font-black bg-slate-900 text-white px-2 py-0.5 rounded-md shadow-md">
                      {formatPrice(requestedPrice)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-xs font-semibold text-slate-500 px-1">
                  <span>Min: {formatPrice(minPrice)}</span>
                  <span className="text-blue-700 font-bold">Stima: {formatPrice(estimatedPrice)}</span>
                  <span>Max: {formatPrice(maxPrice)}</span>
                </div>
              </div>

              {/* Negotiation Advice Box */}
              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80">
                  <span className="text-xs font-bold text-blue-900 block">Offerta consigliata di partenza</span>
                  <strong className="text-base font-black text-blue-700 number-mono block mt-0.5">
                    {formatPrice(offerMin)} – {formatPrice(offerMax)}
                  </strong>
                  <p className="text-[11px] text-blue-800/80 mt-1">
                    Margine ragionevole per avviare una trattativa basata sui dati di mercato.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-slate-800 block">Massimo raccomandato da pagare</span>
                  <strong className="text-base font-black text-slate-900 number-mono block mt-0.5">
                    {formatPrice(maxPay)}
                  </strong>
                  <p className="text-[11px] text-slate-600 mt-1">
                    {overpaid != null
                      ? `A ${formatPrice(requestedPrice)} pagheresti circa ${formatPrice(overpaid)} oltre la soglia prudente.`
                      : 'Prezzo equo se l\'auto è in condizioni meccaniche e carrozzeria impeccabili.'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex items-start gap-3.5">
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-sm font-bold text-blue-950 block">
                  Valutazione stimata: {formatPrice(estimatedPrice)} (range {formatPrice(minPrice)} – {formatPrice(maxPrice)})
                </strong>
                <p className="text-xs text-blue-900/80 mt-1 leading-relaxed">
                  Non hai inserito il prezzo richiesto dal venditore. Durante l&apos;analisi puoi specificarlo per calcolare automaticamente il potenziale di trattativa e l&apos;offerta ideale.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Section: "Prima di comprarla" - Actionable Checklist with Contextual Badges */}
        {checklist.length > 0 && (
          <div className="rounded-2xl p-5 border border-slate-200/90 bg-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Prima di comprarla: Controlli e Consigli del Modello
                </h3>
              </div>
              {checklist.length > 4 && (
                <button
                  type="button"
                  onClick={() => setShowAllAdvice(!showAllAdvice)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {showAllAdvice ? 'Mostra meno' : `Vedi tutti (${checklist.length})`}
                  {showAllAdvice ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {visibleChecklist.map((item, i) => {
                const cat = categorizeChecklistItem(item);
                const ItemIcon = cat.icon;

                return (
                  <div
                    key={`${item}-${i}`}
                    className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-slate-200 transition-colors"
                  >
                    <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg ${cat.iconClass}`}>
                      <ItemIcon className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${cat.badgeClass}`}>
                          {cat.tag}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
                        {item}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Methodological Disclaimer */}
        <div className="pt-2 border-t border-slate-100 flex items-start gap-2.5 text-xs text-slate-500 leading-relaxed">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p>
            <strong>Nota di trasparenza:</strong> Questa analisi è generata automaticamente incrociando dati di mercato reali e statistiche tecniche del modello. È uno strumento di orientamento e supporto alla trattativa: richiedi sempre una prova su strada e un controllo professionale prima dell&apos;acquisto definitivo.
          </p>
        </div>
      </div>
    </section>
  );
}
