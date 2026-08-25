'use client';

import { useState, useMemo } from 'react';
import type { AutoReport } from '@autoesperto/types';
import { SlidersHorizontal, Calendar, Gauge, Cog, Fuel, Euro, RotateCcw, Check, Sparkles } from 'lucide-react';
import { calculateBolloAccurate } from '@/lib/bollo';

interface Props {
  report: AutoReport;
  onUpdate: (updatedReport: AutoReport) => void;
}

export default function ReportQuickCustomizer({ report, onUpdate }: Props) {
  const currentYear = new Date().getFullYear();
  const initialYear = report.price?.inputYear || report.vehicle?.year || currentYear - 5;
  const initialKm = report.price?.inputKm || (report.vehicle as any)?.mileage || 100000;
  const initialTrans = report.vehicle?.transmission || 'Manuale';
  const initialFuel = report.vehicle?.fuel || 'Diesel';
  const initialPrice = report.price?.requestedPrice || '';

  const [year, setYear] = useState<number>(initialYear);
  const [km, setKm] = useState<number>(initialKm);
  const [transmission, setTransmission] = useState<string>(initialTrans);
  const [fuel, setFuel] = useState<string>(initialFuel);
  const [requestedPrice, setRequestedPrice] = useState<string>(initialPrice ? String(initialPrice) : '');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const baseValuation = useMemo(() => {
    // Base estimated market value from report
    const origVal = report.price?.estimatedValue || 15000;
    const origYear = report.price?.inputYear || report.vehicle?.year || currentYear - 5;
    const origKm = report.price?.inputKm || 100000;

    // Age difference adjustment (~8% per year)
    const yearDiff = year - origYear;
    const yearFactor = Math.pow(1.08, yearDiff);

    // Km difference adjustment (~4% per 20.000 km)
    const kmDiff = km - origKm;
    const kmFactor = Math.max(0.65, Math.min(1.45, 1 - (kmDiff / 20000) * 0.04));

    // Transmission adjustment (+600€ for automatic)
    const transBonus = transmission.toLowerCase().includes('auto') ? 450 : 0;

    let computed = Math.round(origVal * yearFactor * kmFactor + transBonus);
    return Math.max(1200, Math.round(computed / 50) * 50);
  }, [report, year, km, transmission, currentYear]);

  const handleApplyChanges = (newYear = year, newKm = km, newTrans = transmission, newFuel = fuel, newPriceStr = requestedPrice) => {
    const numReqPrice = newPriceStr ? parseFloat(newPriceStr.replace(/\D/g, '')) : undefined;

    // Recalculate price label
    let priceLabel: 'GOOD' | 'FAIR' | 'HIGH' = 'FAIR';
    let vsPercent = 0;
    if (numReqPrice && baseValuation > 0) {
      vsPercent = Math.round(((numReqPrice - baseValuation) / baseValuation) * 100);
      if (vsPercent <= -5) priceLabel = 'GOOD';
      else if (vsPercent >= 8) priceLabel = 'HIGH';
      else priceLabel = 'FAIR';
    }

    const kw = report.vehicle?.power ? parseInt(String(report.vehicle.power).replace(/\D/g, '')) : 100;
    const bolloCalc = calculateBolloAccurate(kw, newFuel, newYear);

    const updated: AutoReport = {
      ...report,
      vehicle: {
        ...report.vehicle,
        year: newYear,
        transmission: newTrans,
        fuel: newFuel,
      },
      price: {
        ...report.price,
        estimatedValue: baseValuation,
        inputYear: newYear,
        inputKm: newKm,
        requestedPrice: numReqPrice,
        priceVsMarketPercent: vsPercent,
        priceLabel,
        min: Math.round(baseValuation * 0.92),
        max: Math.round(baseValuation * 1.08),
      },
      reliability: {
        ...report.reliability,
        taxAnnual: bolloCalc.totale,
      },
    };

    onUpdate(updated);
  };

  const handleReset = () => {
    setYear(initialYear);
    setKm(initialKm);
    setTransmission(initialTrans);
    setFuel(initialFuel);
    setRequestedPrice(initialPrice ? String(initialPrice) : '');
    onUpdate(report);
  };

  return (
    <section className="rounded-2xl border border-border bg-surface p-4 sm:p-5 shadow-2xs">
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-brand flex items-center justify-center shrink-0">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-text-primary flex items-center gap-1.5 uppercase tracking-wide">
              Parametri Veicolo Analizzato
            </h3>
            <p className="text-[11px] text-text-secondary">
              Valori considerati per il calcolo della quotazione e dei costi di gestione.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-xs font-bold text-brand transition-colors shrink-0"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          {isExpanded ? 'Chiudi' : 'Modifica parametri'}
        </button>
      </div>

      {/* Quick summary badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3">
        <div className="p-2.5 rounded-xl bg-surface-2 border border-border">
          <span className="text-[10px] font-bold text-text-tertiary uppercase flex items-center gap-1">
            <Calendar className="w-3 h-3 text-brand" /> Anno
          </span>
          <span className="text-xs sm:text-sm font-extrabold text-text-primary number-mono block mt-0.5">{year}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-surface-2 border border-border">
          <span className="text-[10px] font-bold text-text-tertiary uppercase flex items-center gap-1">
            <Gauge className="w-3 h-3 text-brand" /> Chilometri
          </span>
          <span className="text-xs sm:text-sm font-extrabold text-text-primary number-mono block mt-0.5">{km.toLocaleString('it-IT')} km</span>
        </div>

        <div className="p-2.5 rounded-xl bg-surface-2 border border-border">
          <span className="text-[10px] font-bold text-text-tertiary uppercase flex items-center gap-1">
            <Cog className="w-3 h-3 text-brand" /> Cambio
          </span>
          <span className="text-xs sm:text-sm font-extrabold text-text-primary truncate block mt-0.5">{transmission}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-surface-2 border border-border">
          <span className="text-[10px] font-bold text-text-tertiary uppercase flex items-center gap-1">
            <Fuel className="w-3 h-3 text-brand" /> Alimentazione
          </span>
          <span className="text-xs sm:text-sm font-extrabold text-text-primary truncate block mt-0.5">{fuel}</span>
        </div>
      </div>

      {/* Expandable editing controls */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-border space-y-4 animate-fadeIn">
          <div className="grid sm:grid-cols-3 gap-3">
            {/* Anno */}
            <div>
              <label className="text-xs font-bold text-text-secondary block mb-1">Anno Immatricolazione</label>
              <select
                value={year}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setYear(val);
                  handleApplyChanges(val, km, transmission, fuel, requestedPrice);
                }}
                className="w-full h-10 px-3 rounded-xl border border-border bg-surface text-xs sm:text-sm font-bold text-text-primary focus:outline-none focus:border-brand"
              >
                {Array.from({ length: 25 }, (_, i) => currentYear - i).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* Chilometraggio */}
            <div>
              <label className="text-xs font-bold text-text-secondary block mb-1">Chilometraggio (KM)</label>
              <input
                type="number"
                step="5000"
                value={km}
                onChange={(e) => {
                  const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                  setKm(val);
                  handleApplyChanges(year, val, transmission, fuel, requestedPrice);
                }}
                className="w-full h-10 px-3 rounded-xl border border-border bg-surface text-xs sm:text-sm font-bold text-text-primary focus:outline-none focus:border-brand"
              />
            </div>

            {/* Prezzo desiderato / richiesto */}
            <div>
              <label className="text-xs font-bold text-text-secondary block mb-1">Prezzo Richiesto (€ - Opzionale)</label>
              <input
                type="number"
                placeholder="Es. 8000"
                value={requestedPrice}
                onChange={(e) => {
                  setRequestedPrice(e.target.value);
                  handleApplyChanges(year, km, transmission, fuel, e.target.value);
                }}
                className="w-full h-10 px-3 rounded-xl border border-border bg-surface text-xs sm:text-sm font-bold text-text-primary focus:outline-none focus:border-brand"
              />
            </div>
          </div>

          {/* Cambio & Alimentazione buttons */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-text-secondary block mb-1.5">Tipo di Cambio</label>
              <div className="grid grid-cols-2 gap-2">
                {['Manuale', 'Automatico'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setTransmission(t);
                      handleApplyChanges(year, km, t, fuel, requestedPrice);
                    }}
                    className={`h-9 px-3 rounded-xl text-xs font-bold border transition-all ${
                      transmission.toLowerCase().includes(t.toLowerCase())
                        ? 'bg-brand text-white border-brand shadow-xs'
                        : 'bg-surface-2 text-text-secondary border-border hover:bg-surface'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-text-secondary block mb-1.5">Alimentazione</label>
              <div className="grid grid-cols-3 gap-1.5">
                {['Diesel', 'Benzina', 'Ibrida', 'GPL', 'Metano', 'Elettrica'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => {
                      setFuel(f);
                      handleApplyChanges(year, km, transmission, f, requestedPrice);
                    }}
                    className={`h-8 px-2 rounded-lg text-[11px] font-bold border truncate transition-all ${
                      fuel.toLowerCase().includes(f.toLowerCase())
                        ? 'bg-brand text-white border-brand shadow-xs'
                        : 'bg-surface-2 text-text-secondary border-border hover:bg-surface'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs font-semibold text-text-tertiary hover:text-text-primary"
            >
              <RotateCcw className="w-3 h-3" /> Ripristina originali
            </button>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Dati aggiornati in tempo reale
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
