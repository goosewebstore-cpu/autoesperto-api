'use client';

import { Euro, Gauge, Wallet, Fuel, Calendar } from 'lucide-react';
import type { AutoReport } from '@autoesperto/types';

interface Props {
  report: AutoReport;
}

function euro(v: number): string {
  return Math.round(v).toLocaleString('it-IT', { maximumFractionDigits: 0 });
}

export function calculateRealisticAnnualCost(report: AutoReport): {
  total: number;
  fuel: number;
  maintenance: number;
  insurance: number;
  tax: number;
} {
  const vehicle = report?.vehicle || ({} as any);
  const rel = report?.reliability || ({} as any);
  const fuel = (vehicle.fuel || '').toLowerCase();
  const powerNum = parseInt(String(vehicle.power || '').replace(/\D/g, '')) || 100;
  const kw = powerNum > 170 ? Math.round(powerNum * 0.735499) : powerNum;
  const currentYear = new Date().getFullYear();
  const age = Math.max(1, currentYear - (vehicle.year || currentYear - 5));

  // 1. Bollo annuo esatto
  const tax = rel.taxAnnual || Math.round(kw <= 53 ? kw * 2.58 : 53 * 2.58 + (kw - 53) * 3.87);

  // 2. Carburante su 12.000 km/anno standard
  const isElectric = fuel.includes('elettr') || fuel.includes('ev');
  const isHybrid = fuel.includes('ibrid') || fuel.includes('hybrid');
  const isDiesel = fuel.includes('diesel') || fuel.includes('jtd') || fuel.includes('tdi') || fuel.includes('dci') || fuel.includes('hdi');
  const isGpl = fuel.includes('gpl') || fuel.includes('metano');

  let rawComb = rel.consumption?.combined;
  // Sanitize comb if it was unrealistically high (e.g. from bug in cc parsing)
  let combL100 = 5.4;
  if (rawComb && rawComb > 0 && rawComb < 20) {
    combL100 = rel.consumption?.fuelType?.toLowerCase().includes('km/l')
      ? 100 / Math.max(1, rawComb)
      : rawComb;
    if (combL100 > 9.5 && !/porsche|ferrari|lamborghini|maserati|v8|amg|m3|m5/.test((vehicle.model || '').toLowerCase())) {
      combL100 = isDiesel ? 5.2 : isHybrid ? 4.5 : isElectric ? 15 : isGpl ? 7.2 : 6.2;
    }
  } else {
    combL100 = isDiesel ? 5.2 : isHybrid ? 4.5 : isElectric ? 15 : isGpl ? 7.2 : 6.2;
  }

  let fuelCost = 0;
  if (isElectric) {
    fuelCost = Math.round((12000 / 100) * combL100 * 0.28); // ~0.28 €/kWh
  } else if (isDiesel) {
    fuelCost = Math.round((12000 / 100) * combL100 * 1.74); // ~1.74 €/L
  } else if (isGpl) {
    fuelCost = Math.round((12000 / 100) * combL100 * 0.72); // ~0.72 €/L
  } else {
    fuelCost = Math.round((12000 / 100) * combL100 * 1.82); // ~1.82 €/L
  }

  // 3. Manutenzione ordinaria realistica annuale (1 tagliando all'anno + usura filtri/freni)
  const isPremium = /bmw|mercedes|audi|porsche|maserati|land rover|jaguar/.test((vehicle.make || '').toLowerCase());
  const maintenance = isPremium ? 420 : age > 8 ? 340 : 280;

  // 4. Assicurazione RC base standard indicativa
  const insurance = powerNum < 80 ? 340 : powerNum < 120 ? 420 : powerNum < 160 ? 490 : 620;

  const total = fuelCost + maintenance + insurance + tax;
  return { total, fuel: fuelCost, maintenance, insurance, tax };
}

export default function KpiCards({ report }: Props) {
  const rel = report?.reliability || ({} as any);
  const pr = report?.price || ({} as any);
  const scoreNum = Number(rel.score) || 7.5;
  const normalizedScore = (scoreNum > 10 ? scoreNum / 10 : scoreNum).toFixed(1);

  const rawUnit = (rel.consumption?.fuelType || '').toLowerCase();
  const isElectric = rawUnit.includes('kwh') || rawUnit.includes('elettr') || (report?.vehicle?.fuel || '').toLowerCase().includes('elettr');
  const isKmL = rawUnit.includes('km/l') || rawUnit.includes('km/litro');

  let consumptionDisplay = '5.2 L/100 km';
  if (rel.consumption?.combined) {
    let combVal = rel.consumption.combined;
    if (combVal > 9.5 && !/porsche|ferrari|maserati|v8|amg|m3|m5/.test((report?.vehicle?.model || '').toLowerCase())) {
      combVal = (report?.vehicle?.fuel || '').toLowerCase().includes('diesel') ? 5.2 : 6.0;
    }
    const unit = isElectric ? 'kWh/100 km' : isKmL ? 'km/L' : 'L/100 km';
    consumptionDisplay = `${combVal} ${unit}`;
  }

  const costBreakdown = calculateRealisticAnnualCost(report);

  const kpis = [
    { icon: Euro, label: 'Valore stimato', value: `${euro(pr.estimatedValue || 0)} €`, tone: 'indigo' },
    { icon: Gauge, label: 'Affidabilità', value: `${normalizedScore}/10`, tone: rel.verdict === 'BUY' ? 'emerald' : rel.verdict === 'NEGOTIATE' ? 'amber' : 'red' },
    { icon: Wallet, label: 'Costo annuo', value: `${euro(costBreakdown.total)} €`, tone: 'slate' },
    { icon: Fuel, label: 'Consumo comb.', value: consumptionDisplay, tone: 'sky' },
  ];

  if (rel.taxAnnual || costBreakdown.tax) {
    kpis.push({ icon: Calendar, label: 'Bollo annuo', value: `${euro(rel.taxAnnual || costBreakdown.tax)} €`, tone: 'violet' });
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