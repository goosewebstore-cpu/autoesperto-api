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
      className={`rounded-2xl sm:rounded-3xl border ${verdict.borderAccent} bg-surface shadow-card overflow-hidden transition-all duration-300`}
      aria-label={`Verdetto AutoEsperto: ${verdict.label}`}
    >
      {/* Top Identity & Verdict Header */}
      <div className={`relative px-4 py-5 sm:px-6 sm:py-6 ${verdict.cardHeaderGlow} border-b border-border/80`}>
        {/* Badges row */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border shadow-2xs ${verdict.badgeBg} ${verdict.badgeShadow}`}
            >
              <span className={`w-2 h-2 rounded-full animate-pulse ${verdict.badgeDot}`} />
              <VerdictIcon className="w-4 h-4 shrink-0" />
              {verdict.label}
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Affidabilità Stima: <strong>ALTA</strong>
            </span>

            {isModelData ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-surface-2 text-text-secondary border border-border">
                <Info className="w-3.5 h-3.5 shrink-0" />
                Dati indicativi modello
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                Dati reali di mercato
              </span>
            )}
          </div>

          <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-brand shrink-0" />
            AutoEsperto Score
          </span>
        </div>

        {/* Vehicle title and Score Ring Gauge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-text-primary tracking-tight leading-tight">
              {vehicleTitle}
            </h1>
            {vehicleSubtitle && (
              <p className="mt-1 text-xs sm:text-sm font-medium text-text-secondary truncate">
                {vehicleSubtitle}
              </p>
            )}

            <p className="mt-2.5 text-xs sm:text-sm font-medium text-text-secondary leading-relaxed max-w-2xl">
              {reliability.summary || verdict.note}
            </p>
          </div>

          {/* Compact Score Donut Gauge */}
          <div className="flex items-center gap-3.5 p-3 sm:p-3.5 rounded-2xl bg-surface-2/80 border border-border shadow-2xs shrink-0 self-start sm:self-center">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <defs>
                  <linearGradient id={`scoreGrad-${verdict.key}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={verdict.ringGradient[0]} />
                    <stop offset="100%" stopColor={verdict.ringGradient[1]} />
                  </linearGradient>
                </defs>
                {/* Background track */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke="var(--border)"
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
                <span className="text-xl sm:text-2xl font-black text-text-primary tracking-tight number-mono leading-none">
                  {scores.overall}
                </span>
                <span className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest mt-0.5">
                  /100
                </span>
              </div>
            </div>

            <div className="pr-1">
              <span className="block text-[10px] font-black uppercase tracking-wider text-text-tertiary">
                Score
              </span>
              <strong className="block text-xs sm:text-sm font-extrabold text-text-primary mt-0.5">
                {verdict.title}
              </strong>
              <span className="block text-[11px] font-medium text-text-secondary mt-0.5">
                Affidabilità {relOutOfTen}/10
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Body: Subscores Breakdown & Price Comparator */}
      <div className="p-4 sm:p-6 space-y-5">
        {/* Section: Subscores Breakdown (Concise visual bars) */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-xs sm:text-sm font-extrabold text-text-primary flex items-center gap-1.5 uppercase tracking-wide">
              <Gauge className="w-4 h-4 text-brand" />
              Punteggi per Categoria
            </h2>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {subScores.map((item) => {
              const barColor =
                item.tone === 'good'
                  ? 'bg-emerald-500'
                  : item.tone === 'fair'
                  ? 'bg-amber-500'
                  : 'bg-rose-500';

              const badgeColor =
                item.tone === 'good'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : item.tone === 'fair'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200';

              return (
                <div
                  key={item.key}
                  className="rounded-xl p-3 border border-border bg-surface-2/60 hover:bg-surface hover:border-border-strong hover:shadow-2xs transition-all"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-text-primary truncate">{item.label}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-extrabold border shrink-0 ${badgeColor}`}>
                      {item.value}/100
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2 h-1.5 w-full rounded-full bg-border overflow-hidden">
                    <div
                      className={`h-full rounded-full ${barColor} transition-all duration-700 ease-out`}
                      style={{ width: `${Math.max(6, item.value)}%` }}
                    />
                  </div>

                  <div className="mt-1.5 flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-text-secondary">{item.statusLabel}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section: Price vs Market Comparator */}
        <div className="rounded-xl p-4 sm:p-5 border border-border bg-surface-2/40 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h3 className="text-xs sm:text-sm font-extrabold text-text-primary flex items-center gap-1.5 uppercase tracking-wide">
              <Euro className="w-4 h-4 text-brand" />
              Prezzo vs Mercato Reale
            </h3>
            {price.market?.total ? (
              <span className="text-[11px] font-semibold text-text-secondary bg-surface px-2.5 py-0.5 rounded-full border border-border">
                {price.market.total} annunci analizzati
              </span>
            ) : null}
          </div>

          {requestedPrice != null ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl bg-surface border border-border shadow-2xs">
                  <span className="block text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
                    Prezzo Richiesto
                  </span>
                  <strong className="block mt-0.5 text-base sm:text-lg font-black text-text-primary number-mono">
                    {formatPrice(requestedPrice)}
                  </strong>
                </div>

                <div className="p-3 rounded-xl bg-surface border border-border shadow-2xs">
                  <span className="block text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
                    Valore di Mercato
                  </span>
                  <strong className="block mt-0.5 text-base sm:text-lg font-black text-brand number-mono">
                    {formatPrice(estimatedPrice)}
                  </strong>
                </div>

                <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-surface border border-border shadow-2xs">
                  <span className="block text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
                    Differenza
                  </span>
                  <strong
                    className={`block mt-0.5 text-base sm:text-lg font-black number-mono ${
                      requestedPrice > maxPrice
                        ? 'text-danger'
                        : requestedPrice < minPrice
                        ? 'text-success'
                        : 'text-text-primary'
                    }`}
                  >
                    {requestedPrice > estimatedPrice ? '+' : ''}
                    {formatPrice(requestedPrice - estimatedPrice)}
                  </strong>
                </div>
              </div>

              {/* Visual Range Indicator Bar */}
              <div className="pt-1">
                <div className="relative h-2.5 w-full rounded-full bg-border overflow-visible my-2">
                  <div className="absolute inset-y-0 left-0 right-0 rounded-full bg-gradient-to-r from-emerald-400 via-brand to-rose-400 opacity-70" />
                  {/* Pin marker for requested price */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center z-10"
                    style={{ left: `${barPos}%` }}
                  >
                    <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-brand shadow-md" />
                  </div>
                </div>

                <div className="flex justify-between text-[11px] font-semibold text-text-secondary px-0.5">
                  <span>Min: {formatPrice(minPrice)}</span>
                  <span className="text-brand font-bold">Stima: {formatPrice(estimatedPrice)}</span>
                  <span>Max: {formatPrice(maxPrice)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-brand/5 border border-brand/20 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-text-primary block">
                  Stima indicativa: {formatPrice(estimatedPrice)}
                </span>
                <span className="text-[11px] text-text-secondary block mt-0.5">
                  Fascia compresa tra {formatPrice(minPrice)} e {formatPrice(maxPrice)}
                </span>
              </div>
              <span className="text-xs font-bold text-brand shrink-0">
                Mercato
              </span>
            </div>
          )}
        </div>

        {/* Section: Actionable Checklist */}
        {checklist.length > 0 && (
          <div className="rounded-xl p-4 sm:p-5 border border-border bg-surface">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand" />
                <h3 className="text-xs sm:text-sm font-extrabold text-text-primary uppercase tracking-wide">
                  Prima di comprarla: Controlli chiave
                </h3>
              </div>
              {checklist.length > 3 && (
                <button
                  type="button"
                  onClick={() => setShowAllAdvice(!showAllAdvice)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:underline p-1 min-h-[36px]"
                >
                  {showAllAdvice ? 'Mostra meno' : `Tutti (${checklist.length})`}
                  {showAllAdvice ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-2">
              {(showAllAdvice ? checklist : checklist.slice(0, 3)).map((item, i) => {
                const cat = categorizeChecklistItem(item);
                const ItemIcon = cat.icon;

                return (
                  <div
                    key={`${item}-${i}`}
                    className="flex items-start gap-2.5 p-2.5 sm:p-3 rounded-lg border border-border bg-surface-2/40 hover:bg-surface-2/80 transition-colors"
                  >
                    <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md ${cat.iconClass}`}>
                      <ItemIcon className="h-3 w-3" />
                    </span>
                    <p className="text-xs font-medium text-text-primary leading-relaxed">
                      {item}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
