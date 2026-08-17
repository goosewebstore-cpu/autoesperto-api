'use client';

import { CheckCircle2, AlertTriangle, XCircle, Euro, Gauge, Wallet, ChevronDown } from 'lucide-react';
import type { AutoReport } from '@autoesperto/types';
import { useState } from 'react';

function euro(v: number) { return v.toLocaleString('it-IT') + ' €'; }

function getVerdictDisplay(verdict: string) {
  if (verdict === 'BUY') return { icon: CheckCircle2, label: 'Buon affare', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500' };
  if (verdict === 'NEGOTIATE') return { icon: AlertTriangle, label: 'Tratta il prezzo', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-500' };
  return { icon: XCircle, label: 'Evitala', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', dot: 'bg-red-500' };
}

function getCostLabel(annualMaintenance: number) {
  if (annualMaintenance < 400) return 'Bassi';
  if (annualMaintenance < 700) return 'Medi';
  return 'Alti';
}

export default function ReportSummary({ report }: { report: AutoReport }) {
  const [showWhy, setShowWhy] = useState(false);
  const { vehicle, reliability, price } = report;
  const v = getVerdictDisplay(reliability.verdict);
  const VIcon = v.icon;
  const costLabel = getCostLabel(reliability.futureCosts.annualMaintenance);

  // Build 3-4 key reasons
  const reasons: string[] = [];
  if (reliability.strengths.length > 0) reasons.push(reliability.strengths[0]);
  if (reliability.weaknesses.length > 0) reasons.push('Attenzione: ' + reliability.weaknesses[0]);
  if (reliability.advice.length > 0) reasons.push(reliability.advice[0]);
  if (price.priceLabel === 'GOOD') reasons.push('Il prezzo è nella fascia bassa del mercato.');
  if (price.priceLabel === 'HIGH') reasons.push('Il prezzo è sopra la media di mercato.');

  return (
    <section className="rounded-2xl border border-border bg-white shadow-card overflow-hidden">
      {/* Vehicle identity */}
      <div className="px-5 pt-5 pb-4 border-b border-border/60">
        <h2 className="text-xl font-extrabold tracking-tight text-text-primary">
          {vehicle.make} {vehicle.model}
        </h2>
        <p className="text-sm text-text-secondary mt-0.5">
          {[vehicle.version, vehicle.year, vehicle.fuel, vehicle.body].filter(Boolean).join(' · ')}
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border/60">
        <div className="p-4 text-center">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-text-tertiary">Valore</span>
          <span className="block mt-1 text-lg font-extrabold text-text-primary number-mono">
            {euro(price.estimatedValue)}
          </span>
          <span className="block text-[11px] text-text-tertiary">
            {euro(price.min)} – {euro(price.max)}
          </span>
        </div>
        <div className="p-4 text-center">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-text-tertiary">Affidabilità</span>
          <span className="block mt-1 text-lg font-extrabold text-text-primary number-mono">
            {reliability.score.toFixed(1)}<span className="text-sm text-text-tertiary">/10</span>
          </span>
        </div>
        <div className="p-4 text-center">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-text-tertiary">Costi</span>
          <span className="block mt-1 text-lg font-extrabold text-text-primary">{costLabel}</span>
        </div>
        <div className={`p-4 text-center ${v.bg}`}>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-text-tertiary">Verdetto</span>
          <div className={`mt-1 inline-flex items-center gap-1.5 text-sm font-extrabold ${v.color}`}>
            <span className={`w-2 h-2 rounded-full ${v.dot}`} />
            {v.label}
          </div>
        </div>
      </div>

      {/* Why section - expandable */}
      {reasons.length > 0 && (
        <div className="border-t border-border/60">
          <button
            onClick={() => setShowWhy(!showWhy)}
            className="w-full flex items-center justify-between px-5 py-3 text-sm font-bold text-text-primary hover:bg-surface-2 transition-colors"
          >
            <span>Perché?</span>
            <ChevronDown className={`w-4 h-4 text-text-tertiary transition-transform ${showWhy ? 'rotate-180' : ''}`} />
          </button>
          {showWhy && (
            <ul className="px-5 pb-4 space-y-2">
              {reasons.slice(0, 4).map((r, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-text-secondary leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
