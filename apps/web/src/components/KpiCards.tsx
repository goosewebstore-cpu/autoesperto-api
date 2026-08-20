'use client';

import { Euro, Gauge, Wallet, Fuel, Calendar } from 'lucide-react';
import type { AutoReport } from '@autoesperto/types';

interface Props {
  report: AutoReport;
}

function euro(v: number): string {
  return v.toLocaleString('it-IT', { maximumFractionDigits: 0 });
}

export default function KpiCards({ report }: Props) {
  const rel = report?.reliability || ({} as any);
  const pr = report?.price || ({} as any);
  const scoreNum = Number(rel.score) || 7.5;
  const normalizedScore = (scoreNum > 10 ? scoreNum / 10 : scoreNum).toFixed(1);

  const kpis = [
    { icon: Euro, label: 'Valore stimato', value: `${euro(pr.estimatedValue || 0)} €`, tone: 'indigo' },
    { icon: Gauge, label: 'Affidabilità', value: `${normalizedScore}/10`, tone: rel.verdict === 'BUY' ? 'emerald' : rel.verdict === 'NEGOTIATE' ? 'amber' : 'red' },
    { icon: Wallet, label: 'Costo annuo', value: `${euro(annualCost(report))} €`, tone: 'slate' },
    { icon: Fuel, label: 'Consumo comb.', value: rel.consumption?.combined ? `${rel.consumption.combined} km/L` : '—', tone: 'sky' },
  ];

  if (rel.taxAnnual) {
    kpis.push({ icon: Calendar, label: 'Bollo annuo', value: `${euro(rel.taxAnnual)} €`, tone: 'violet' });
  }

  const toneMap: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-800',
    red: 'bg-rose-50 text-rose-700',
    slate: 'bg-slate-100 text-slate-700',
    sky: 'bg-sky-50 text-sky-700',
    violet: 'bg-violet-50 text-violet-700',
  };

  return (
    <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-3" aria-label="KPI principali">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div key={kpi.label} className="rounded-xl sm:rounded-2xl border border-border bg-surface p-3 sm:p-4 shadow-2xs">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-text-secondary truncate">{kpi.label}</span>
              <span className={`grid h-7 w-7 sm:h-8 sm:w-8 shrink-0 place-items-center rounded-lg ${toneMap[kpi.tone]}`}><Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" /></span>
            </div>
            <div className="mt-2 text-lg sm:text-2xl font-extrabold tracking-tight text-text-primary number-mono">{kpi.value}</div>
          </div>
        );
      })}
    </section>
  );
}

function annualCost(report: AutoReport): number {
  const c = report?.reliability?.futureCosts;
  let total = (c?.annualMaintenance ?? 350) + (c?.insuranceEstimate ?? 450);
  if (report?.reliability?.taxAnnual) total += report.reliability.taxAnnual;
  if (report?.reliability?.consumption?.combined) {
    const kmAnno = 12000;
    const litriAnno = kmAnno / report.reliability.consumption.combined;
    const prezzoBenzina = 1.85;
    total += Math.round(litriAnno * prezzoBenzina);
  } else if (c?.fuelCostPer100Km) {
    total += c.fuelCostPer100Km * 120;
  }
  return total;
}