import { useState } from 'react';
import { Euro, Gauge, Wallet, Fuel, Calendar, HelpCircle, X, CheckCircle2, ChevronRight, Info } from 'lucide-react';
import type { AutoReport } from '@autoesperto/types';
import { calculateBolloAccurate, extractKw } from '@/lib/bollo';

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
  annualKm: number;
  litersPer100Km: number;
  fuelTypeLabel: string;
} {
  const vehicle = report?.vehicle || ({} as any);
  const rel = report?.reliability || ({} as any);
  const fuel = (vehicle.fuel || '').toLowerCase();
  const make = (vehicle.make || '').toLowerCase();
  const model = (vehicle.model || '').toLowerCase();
  
  // 1. Estrazione accurata potenza in kW (converte correttamente CV se necessario)
  const kw = extractKw(vehicle.power);
  const currentYear = new Date().getFullYear();
  const age = Math.max(1, currentYear - (vehicle.year || currentYear - 5));

  // 2. Bollo esatto con esenzioni regionali (elettrico 0€ per 5 anni, ibrido sconto, GPL -25%)
  const bolloCalc = calculateBolloAccurate(vehicle.power || kw, vehicle.fuel, vehicle.year);
  const tax = rel.taxAnnual !== undefined ? rel.taxAnnual : bolloCalc.totale;

  // 3. Tipologia motore & consumi reali su percorrenza media italiana (10.000 km/anno)
  const isElectric = fuel.includes('elettr') || fuel.includes('ev') || fuel.includes('bev');
  const isHybrid = fuel.includes('ibrid') || fuel.includes('hybrid') || fuel.includes('phev') || fuel.includes('hev');
  const isDiesel = fuel.includes('diesel') || fuel.includes('jtd') || fuel.includes('tdi') || fuel.includes('dci') || fuel.includes('hdi') || fuel.includes('cdti');
  const isGpl = fuel.includes('gpl') || fuel.includes('lpg');
  const isMetano = fuel.includes('metano') || fuel.includes('cng');

  const annualKm = 10000; // Media statistica italiana di percorrenza privata annuale

  let combL100 = 5.4;
  let rawComb = rel.consumption?.combined;
  if (rawComb && rawComb > 0 && rawComb < 22) {
    combL100 = rel.consumption?.fuelType?.toLowerCase().includes('km/l')
      ? 100 / Math.max(1, rawComb)
      : rawComb;
    
    // Normalizzazione consumi realistici per classe
    if (combL100 > 9.5 && !/porsche|ferrari|lamborghini|maserati|v8|amg|m3|m5|rs[4-7]|quadrifoglio/.test(model)) {
      combL100 = isDiesel ? 4.9 : isHybrid ? 4.2 : isElectric ? 14.5 : isGpl ? 7.2 : 5.8;
    }
  } else {
    combL100 = isDiesel ? 4.9 : isHybrid ? 4.2 : isElectric ? 14.5 : isGpl ? 7.2 : isMetano ? 4.2 : 5.8;
  }

  // Prezzi carburanti medi Italia 2026
  let fuelCost = 0;
  let fuelTypeLabel = 'Benzina';
  if (isElectric) {
    fuelCost = Math.round((annualKm / 100) * combL100 * 0.24); // ~0.24 €/kWh misto domestico/colonnina
    fuelTypeLabel = 'Elettrico';
  } else if (isDiesel) {
    fuelCost = Math.round((annualKm / 100) * combL100 * 1.70); // ~1.70 €/L
    fuelTypeLabel = 'Diesel';
  } else if (isGpl) {
    fuelCost = Math.round((annualKm / 100) * combL100 * 0.70); // ~0.70 €/L
    fuelTypeLabel = 'GPL';
  } else if (isMetano) {
    fuelCost = Math.round((annualKm / 100) * combL100 * 1.30); // ~1.30 €/kg
    fuelTypeLabel = 'Metano';
  } else if (isHybrid) {
    fuelCost = Math.round((annualKm / 100) * combL100 * 1.78); // ~1.78 €/L
    fuelTypeLabel = 'Ibrida';
  } else {
    fuelCost = Math.round((annualKm / 100) * combL100 * 1.78); // ~1.78 €/L
    fuelTypeLabel = 'Benzina';
  }

  // 4. Manutenzione ordinaria realistica proporzionata al segmento (1 tagliando annuo o biennale + materiali usura)
  const isSupercar = /porsche|ferrari|maserati|lamborghini|aston martin|bentley/.test(make);
  const isPremium = /bmw|mercedes|audi|land rover|jaguar|volvo|alfa romeo|lexus/.test(make);
  const isCityCar = /panda|500|ypsilon|aygo|c1|c3|clio|208|i10|i20|picanto|polo|fiesta|micra|twingo|up|smart|yaris/.test(model);
  
  let maintenance = 180; // Default compatta standard (es. Golf, Focus, Tipo)
  if (isSupercar) {
    maintenance = 650;
  } else if (isPremium) {
    maintenance = age > 8 ? 340 : 280;
  } else if (isCityCar) {
    maintenance = 160;
  } else {
    maintenance = 210;
  }

  // 5. Assicurazione RC base standard indicativa (classe di merito media con comparatore online)
  let insurance = 290;
  if (kw <= 55) {
    insurance = 240; // Piccole utilitarie (< 75 CV)
  } else if (kw <= 85) {
    insurance = 290; // Compatte e medie (75 - 115 CV)
  } else if (kw <= 125) {
    insurance = 350; // Medie e SUV (115 - 170 CV)
  } else {
    insurance = isSupercar ? 680 : 460; // Alte potenze (> 170 CV)
  }

  const total = fuelCost + maintenance + insurance + tax;
  return {
    total,
    fuel: fuelCost,
    maintenance,
    insurance,
    tax,
    annualKm,
    litersPer100Km: Math.round(combL100 * 10) / 10,
    fuelTypeLabel,
  };
}

export default function KpiCards({ report }: Props) {
  const [showCostModal, setShowCostModal] = useState(false);
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
      combVal = (report?.vehicle?.fuel || '').toLowerCase().includes('diesel') ? 4.9 : 5.8;
    }
    const unit = isElectric ? 'kWh/100 km' : isKmL ? 'km/L' : 'L/100 km';
    consumptionDisplay = `${combVal} ${unit}`;
  }

  const costBreakdown = calculateRealisticAnnualCost(report);

  const kpis = [
    {
      icon: Euro,
      label: 'Valore di Mercato',
      value: `${euro(pr.estimatedValue || 0)} €`,
      desc: 'Stima prezzo reale',
      tone: 'indigo',
    },
    {
      icon: Gauge,
      label: 'Affidabilità',
      value: `${normalizedScore}/10`,
      desc: rel.verdict === 'BUY' ? 'Affidabilità elevata' : rel.verdict === 'NEGOTIATE' ? 'Nella media' : 'Rischio guasti',
      tone: rel.verdict === 'BUY' ? 'emerald' : rel.verdict === 'NEGOTIATE' ? 'amber' : 'red',
    },
    {
      icon: Wallet,
      label: 'Costo Annuo Totale',
      value: `${euro(costBreakdown.total)} €`,
      sub: '≈ ' + euro(costBreakdown.total / 12) + ' €/mese',
      desc: 'Carburante + Bollo + Manutenz.',
      tone: 'slate',
      clickable: true,
    },
    {
      icon: Fuel,
      label: 'Consumo Medio',
      value: consumptionDisplay,
      desc: 'Ciclo combinato',
      tone: 'sky',
    },
  ];

  if (rel.taxAnnual !== undefined || costBreakdown.tax !== undefined) {
    kpis.push({
      icon: Calendar,
      label: 'Bollo Annuo',
      value: costBreakdown.tax === 0 ? '0 € (Esente)' : `${euro(costBreakdown.tax)} €`,
      desc: 'Tassa regionale',
      tone: 'violet',
    });
  }

  const toneMap: Record<string, { bg: string; text: string; badge: string }> = {
    indigo: { bg: 'bg-blue-50 text-blue-700', text: 'text-blue-900', badge: 'bg-blue-100 text-blue-800' },
    emerald: { bg: 'bg-emerald-50 text-emerald-700', text: 'text-emerald-900', badge: 'bg-emerald-100 text-emerald-800' },
    amber: { bg: 'bg-amber-50 text-amber-800', text: 'text-amber-900', badge: 'bg-amber-100 text-amber-800' },
    red: { bg: 'bg-rose-50 text-rose-700', text: 'text-rose-900', badge: 'bg-rose-100 text-rose-800' },
    slate: { bg: 'bg-slate-100 text-slate-700', text: 'text-slate-900', badge: 'bg-slate-200 text-slate-800' },
    sky: { bg: 'bg-sky-50 text-sky-700', text: 'text-sky-900', badge: 'bg-sky-100 text-sky-800' },
    violet: { bg: 'bg-purple-50 text-purple-700', text: 'text-purple-900', badge: 'bg-purple-100 text-purple-800' },
  };

  return (
    <>
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3" aria-label="KPI principali">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          const tone = toneMap[kpi.tone] || toneMap.slate;
          return (
            <div
              key={kpi.label}
              onClick={() => kpi.clickable && setShowCostModal(true)}
              className={`rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs transition-all flex flex-col justify-between ${
                kpi.clickable ? 'cursor-pointer hover:border-blue-400 hover:shadow-md group' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1.5 mb-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wide text-slate-500 leading-tight flex items-center gap-1">
                    {kpi.label}
                    {kpi.clickable && <Info className="w-3 h-3 text-blue-500 opacity-70 group-hover:opacity-100 shrink-0" />}
                  </span>
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-xl ${tone.bg}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                </div>

                <div className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 number-mono">
                  {kpi.value}
                </div>

                {kpi.sub && (
                  <div className="text-xs font-bold text-blue-600 mt-0.5">
                    {kpi.sub}
                  </div>
                )}
              </div>

              {kpi.desc && (
                <div className="text-[11px] text-slate-400 font-medium pt-2 mt-2 border-t border-slate-100">
                  {kpi.desc}
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Dettaglio Costo Annuo Modal */}
      {showCostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 grid place-items-center">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Dettaglio Costo di Gestione Annuo
                  </h3>
                  <p className="text-[11px] text-slate-500">Stima basata su 10.000 km/anno</p>
                </div>
              </div>
              <button
                onClick={() => setShowCostModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Fuel className="w-3.5 h-3.5 text-sky-500" />
                  Carburante ({costBreakdown.fuelTypeLabel})
                </span>
                <span className="font-bold text-slate-900 dark:text-white number-mono">
                  {euro(costBreakdown.fuel)} € / anno
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-violet-500" />
                  Bollo Auto (tassa di possesso)
                </span>
                <span className="font-bold text-slate-900 dark:text-white number-mono">
                  {costBreakdown.tax === 0 ? '0 € (Esente)' : `${euro(costBreakdown.tax)} € / anno`}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Gauge className="w-3.5 h-3.5 text-emerald-500" />
                  Assicurazione RC Auto (stima base)
                </span>
                <span className="font-bold text-slate-900 dark:text-white number-mono">
                  {euro(costBreakdown.insurance)} € / anno
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Wallet className="w-3.5 h-3.5 text-amber-500" />
                  Manutenzione ordinaria & tagliando
                </span>
                <span className="font-bold text-slate-900 dark:text-white number-mono">
                  {euro(costBreakdown.maintenance)} € / anno
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                  Totale stimato
                </span>
                <p className="text-base sm:text-lg font-black text-blue-900 dark:text-blue-100">
                  {euro(costBreakdown.total)} € <span className="text-xs font-normal">/ anno</span>
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                  Al mese
                </span>
                <p className="text-sm sm:text-base font-bold text-blue-900 dark:text-blue-100 number-mono">
                  ≈ {euro(costBreakdown.total / 12)} € / mese
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowCostModal(false)}
              className="w-full h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all"
            >
              Chiudi
            </button>
          </div>
        </div>
      )}
    </>
  );
}