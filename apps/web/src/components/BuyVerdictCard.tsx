'use client';

import { BadgeCheck, CheckCircle2, Crown, FileText, Gauge, ShieldAlert, XCircle } from 'lucide-react';
import { getReportPricing, getPremiumPricing } from '@/lib/pricing';

export type VerdictTone = 'good' | 'fair' | 'high';
export type VerdictLabel = 'BUON AFFARE' | 'TRATTA' | 'EVITALA';

export interface VerdictData {
  label: VerdictLabel;
  tone: VerdictTone;
  score?: number;
  requestedPrice?: number;
  estimated: number;
  min: number;
  max: number;
  percent?: number;
  checks: string[];
  recommendedPrice: number;
  negotiationMin: number;
  negotiationMax: number;
  finalVerdict: string;
}

interface BuyVerdictCardProps {
  verdict: VerdictData;
  locked?: boolean;
  onBuyReport?: () => void;
  onPremium?: () => void;
}

const TONE_STYLES: Record<VerdictTone, { bg: string; text: string; ring: string; softBg: string; label: string }> = {
  good: { bg: 'bg-emerald-500', text: 'text-emerald-600', ring: 'ring-emerald-200', softBg: 'bg-emerald-50', label: 'BUON AFFARE' },
  fair: { bg: 'bg-amber-500', text: 'text-amber-600', ring: 'ring-amber-200', softBg: 'bg-amber-50', label: 'TRATTA' },
  high: { bg: 'bg-red-500', text: 'text-red-600', ring: 'ring-red-200', softBg: 'bg-red-50', label: 'EVITALA' },
};

const TONE_ICON: Record<VerdictTone, React.ElementType> = {
  good: CheckCircle2,
  fair: Gauge,
  high: XCircle,
};

const eur = (centsOrEuro: number) =>
  new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(centsOrEuro);

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <span className="text-[0.72rem] font-extrabold uppercase tracking-[0.08em] text-slate-500">{label}</span>
      <span className={`text-sm number-mono ${strong ? 'font-extrabold text-slate-950' : 'font-semibold text-slate-700'}`}>{value}</span>
    </div>
  );
}

export default function BuyVerdictCard({ verdict, locked, onBuyReport, onPremium }: BuyVerdictCardProps) {
  const tone = TONE_STYLES[verdict.tone];
  const Icon = TONE_ICON[verdict.tone];
  const reportPrice = getReportPricing().displayPrice;
  const premiumPrice = getPremiumPricing('month').displayPrice;

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div className="flex items-center gap-4">
          <div className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl ${tone.bg} text-white shadow-lg`}>
            <Icon className="h-8 w-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-[0.68rem] font-extrabold uppercase tracking-[0.12em] text-slate-400">
              Verdetto AutoEsperto
            </div>
            <div className={`mt-1 text-2xl font-extrabold tracking-tight ${tone.text}`}>
              {verdict.label}
            </div>
            <div className="mt-0.5 text-xs font-semibold text-slate-500">{verdict.finalVerdict}</div>
          </div>
        </div>
        {verdict.score != null && (
          <div className="flex shrink-0 items-baseline gap-1.5">
            <span className={`number-mono text-5xl font-extrabold tracking-tight ${tone.text}`}>{verdict.score}</span>
            <span className="text-sm font-bold text-slate-400">/100</span>
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 px-6 sm:px-7">
        <Row
          label="Prezzo richiesto"
          value={verdict.requestedPrice != null ? eur(verdict.requestedPrice) : '—'}
          strong
        />
        <Row label="Valore stimato" value={`${eur(verdict.min)} – ${eur(verdict.max)}`} strong />
        <Row
          label="Differenza"
          value={verdict.percent != null ? `${verdict.percent > 0 ? '+' : ''}${verdict.percent.toFixed(1)}%` : '—'}
        />
        <Row
          label="Prezzo consigliato"
          value={eur(verdict.recommendedPrice)}
          strong
        />
        <Row label="Obiettivo trattativa" value={`${eur(verdict.negotiationMin)} – ${eur(verdict.negotiationMax)}`} />
      </div>

      <div className="border-t border-slate-100 px-6 py-5 sm:px-7">
        <div className="flex items-center gap-2 text-[0.68rem] font-extrabold uppercase tracking-[0.1em] text-slate-400">
          <ShieldAlert className="h-3.5 w-3.5" />
          Cosa controllare prima dell&apos;acquisto
        </div>
        <ul className="mt-3 flex flex-wrap gap-2">
          {verdict.checks.map((check) => (
            <li key={check} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${tone.softBg} ${tone.text}`}>
              <BadgeCheck className="h-3.5 w-3.5" />
              {check}
            </li>
          ))}
        </ul>
      </div>

      {locked && (
        <div className="border-t border-slate-100 bg-slate-50/70 px-6 py-6 sm:px-7">
          <div className="flex items-center gap-2 text-[0.68rem] font-extrabold uppercase tracking-[0.1em] text-slate-400">
            <FileText className="h-3.5 w-3.5" />
            Scopri tutto il report
          </div>
          <p className="mt-1.5 text-sm text-slate-600">
            Clicchi, chilometraggio, costi di manutenzione e il verdetto completo su questa auto.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onBuyReport}
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(15,23,42,0.22)] transition hover:-translate-y-0.5"
            >
              <FileText className="h-4 w-4" />
              Report completo · {reportPrice}
            </button>
            <button
              type="button"
              onClick={onPremium}
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-white px-4 text-sm font-extrabold text-blue-700 transition hover:border-blue-300 hover:bg-blue-50"
            >
              <Crown className="h-4 w-4" />
              Premium · {premiumPrice}/mese
            </button>
          </div>
          <p className="mt-3 text-center text-xs font-medium text-slate-400">
            Un solo report: {reportPrice}. Analisi illimitate: Premium {premiumPrice}/mese.
          </p>
        </div>
      )}
    </div>
  );
}
