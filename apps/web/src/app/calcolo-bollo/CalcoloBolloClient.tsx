'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calculator, Euro, Zap, AlertTriangle, ArrowRight, CheckCircle2, Info } from 'lucide-react';

// Tariffe base ACI per regione (€ al kW)
// Scaglione standard fino a 100 kW / oltre 100 kW per Euro 4, 5, 6
interface RegionRate {
  basePerKw: number;       // fino a 100 kW (Euro 4+)
  extraPerKw: number;      // oltre 100 kW
  euro3Multiplier: number;
  euro2Multiplier: number;
  euro01Multiplier: number;
}

const REGION_RATES: Record<string, { name: string; rate: RegionRate }> = {
  abruzzo: { name: 'Abruzzo', rate: { basePerKw: 3.12, extraPerKw: 4.68, euro3Multiplier: 1.1, euro2Multiplier: 1.2, euro01Multiplier: 1.3 } },
  basilicata: { name: 'Basilicata', rate: { basePerKw: 2.58, extraPerKw: 3.87, euro3Multiplier: 1.1, euro2Multiplier: 1.2, euro01Multiplier: 1.3 } },
  calabria: { name: 'Calabria', rate: { basePerKw: 2.84, extraPerKw: 4.26, euro3Multiplier: 1.1, euro2Multiplier: 1.2, euro01Multiplier: 1.3 } },
  campania: { name: 'Campania', rate: { basePerKw: 3.35, extraPerKw: 5.03, euro3Multiplier: 1.1, euro2Multiplier: 1.2, euro01Multiplier: 1.3 } },
  emilia_romagna: { name: 'Emilia-Romagna', rate: { basePerKw: 2.58, extraPerKw: 3.87, euro3Multiplier: 1.1, euro2Multiplier: 1.2, euro01Multiplier: 1.3 } },
  friuli_venezia_giulia: { name: 'Friuli Venezia Giulia', rate: { basePerKw: 2.58, extraPerKw: 3.87, euro3Multiplier: 1.1, euro2Multiplier: 1.2, euro01Multiplier: 1.3 } },
  lazio: { name: 'Lazio', rate: { basePerKw: 2.84, extraPerKw: 4.26, euro3Multiplier: 1.1, euro2Multiplier: 1.2, euro01Multiplier: 1.3 } },
  liguria: { name: 'Liguria', rate: { basePerKw: 2.84, extraPerKw: 4.26, euro3Multiplier: 1.1, euro2Multiplier: 1.2, euro01Multiplier: 1.3 } },
  lombardia: { name: 'Lombardia', rate: { basePerKw: 2.58, extraPerKw: 3.87, euro3Multiplier: 1.1, euro2Multiplier: 1.2, euro01Multiplier: 1.3 } },
  marche: { name: 'Marche', rate: { basePerKw: 2.79, extraPerKw: 4.18, euro3Multiplier: 1.1, euro2Multiplier: 1.2, euro01Multiplier: 1.3 } },
  molise: { name: 'Molise', rate: { basePerKw: 2.76, extraPerKw: 4.14, euro3Multiplier: 1.1, euro2Multiplier: 1.2, euro01Multiplier: 1.3 } },
  piemonte: { name: 'Piemonte', rate: { basePerKw: 2.58, extraPerKw: 3.87, euro3Multiplier: 1.1, euro2Multiplier: 1.2, euro01Multiplier: 1.3 } },
  puglia: { name: 'Puglia', rate: { basePerKw: 2.58, extraPerKw: 3.87, euro3Multiplier: 1.1, euro2Multiplier: 1.2, euro01Multiplier: 1.3 } },
  sardegna: { name: 'Sardegna', rate: { basePerKw: 2.58, extraPerKw: 3.87, euro3Multiplier: 1.1, euro2Multiplier: 1.2, euro01Multiplier: 1.3 } },
  sicilia: { name: 'Sicilia', rate: { basePerKw: 2.58, extraPerKw: 3.87, euro3Multiplier: 1.1, euro2Multiplier: 1.2, euro01Multiplier: 1.3 } },
  toscana: { name: 'Toscana', rate: { basePerKw: 2.71, extraPerKw: 4.07, euro3Multiplier: 1.1, euro2Multiplier: 1.2, euro01Multiplier: 1.3 } },
  trentino_alto_adige: { name: 'Trentino-Alto Adige (Bolzano/Trento)', rate: { basePerKw: 2.06, extraPerKw: 3.10, euro3Multiplier: 1.1, euro2Multiplier: 1.2, euro01Multiplier: 1.3 } },
  umbria: { name: 'Umbria', rate: { basePerKw: 2.58, extraPerKw: 3.87, euro3Multiplier: 1.1, euro2Multiplier: 1.2, euro01Multiplier: 1.3 } },
  valle_d_aosta: { name: 'Valle d\'Aosta', rate: { basePerKw: 2.58, extraPerKw: 3.87, euro3Multiplier: 1.1, euro2Multiplier: 1.2, euro01Multiplier: 1.3 } },
  veneto: { name: 'Veneto', rate: { basePerKw: 2.58, extraPerKw: 3.87, euro3Multiplier: 1.1, euro2Multiplier: 1.2, euro01Multiplier: 1.3 } },
};

export default function CalcoloBolloClient() {
  const [powerType, setPowerType] = useState<'kw' | 'cv'>('kw');
  const [powerValue, setPowerValue] = useState<number | ''>(75);
  const [region, setRegion] = useState<string>('lombardia');
  const [euroClass, setEuroClass] = useState<string>('euro6');
  const [fuelType, setFuelType] = useState<string>('benzina');
  const [autoAge, setAutoAge] = useState<number>(3); // anni del veicolo per superbollo

  const kw = powerType === 'kw' ? (Number(powerValue) || 0) : Math.round((Number(powerValue) || 0) * 0.735499);
  const cv = powerType === 'cv' ? (Number(powerValue) || 0) : Math.round((Number(powerValue) || 0) * 1.35962);

  const calculateBollo = () => {
    if (kw <= 0) return { bolloBase: 0, superbollo: 0, totale: 0, isElectricExempt: false };

    // Esenzione elettrica (in quasi tutte le regioni esenti per i primi 5 anni, poi 25% della tariffa)
    if (fuelType === 'elettrica') {
      if (autoAge <= 5) {
        return { bolloBase: 0, superbollo: 0, totale: 0, isElectricExempt: true };
      }
    }

    const regData = REGION_RATES[region] || REGION_RATES.lombardia;
    let baseRate = regData.rate.basePerKw;
    let extraRate = regData.rate.extraPerKw;

    // Aggiustamenti per classe Euro
    if (euroClass === 'euro3') {
      baseRate *= regData.rate.euro3Multiplier;
      extraRate *= regData.rate.euro3Multiplier;
    } else if (euroClass === 'euro2') {
      baseRate *= regData.rate.euro2Multiplier;
      extraRate *= regData.rate.euro2Multiplier;
    } else if (euroClass === 'euro0' || euroClass === 'euro1') {
      baseRate *= regData.rate.euro01Multiplier;
      extraRate *= regData.rate.euro01Multiplier;
    }

    // Calcolo bollo ordinario
    let bolloBase = 0;
    if (kw <= 100) {
      bolloBase = kw * baseRate;
    } else {
      bolloBase = 100 * baseRate + (kw - 100) * extraRate;
    }

    // Se elettrica dopo i 5 anni: 25%
    if (fuelType === 'elettrica') {
      bolloBase *= 0.25;
    }

    // Se ibrida: molte regioni hanno sconti (es. 50% o esenzione 3-5 anni)
    if (fuelType === 'ibrida' && autoAge <= 3) {
      bolloBase *= 0.5; // Stima media agevolazioni regionali
    }

    // Calcolo Superbollo per potenze > 185 kW (20€ per ogni kW oltre i 185 kW)
    let superbollo = 0;
    if (kw > 185 && fuelType !== 'elettrica') {
      const extraSuperKw = kw - 185;
      let superRate = 20;
      // Riduzioni per anzianità superbollo
      if (autoAge > 15) {
        superRate = 3; // -85%
      } else if (autoAge > 10) {
        superRate = 6; // -70%
      } else if (autoAge > 5) {
        superRate = 12; // -40%
      }
      superbollo = extraSuperKw * superRate;
    }

    return {
      bolloBase: Math.round(bolloBase),
      superbollo: Math.round(superbollo),
      totale: Math.round(bolloBase + superbollo),
      isElectricExempt: false,
    };
  };

  const result = calculateBollo();

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl shadow-slate-100">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Form parametri */}
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Potenza del veicolo
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    min="1"
                    max="1500"
                    value={powerValue}
                    onChange={(e) => setPowerValue(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full h-12 px-4 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold text-lg focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                  <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400">
                    {powerType === 'kw' ? 'kW' : 'CV'}
                  </span>
                </div>
                <div className="inline-flex rounded-xl border border-slate-300 bg-slate-100 p-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (powerType === 'cv') {
                        setPowerValue(kw);
                        setPowerType('kw');
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      powerType === 'kw' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
                    }`}
                  >
                    kW
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (powerType === 'kw') {
                        setPowerValue(cv);
                        setPowerType('cv');
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      powerType === 'cv' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
                    }`}
                  >
                    CV
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                Corrisponde a: <strong>{kw} kW</strong> ({cv} CV)
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Regione di residenza
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-medium text-sm focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              >
                {Object.entries(REGION_RATES).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Alimentazione
                </label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:outline-none"
                >
                  <option value="benzina">Benzina</option>
                  <option value="diesel">Diesel</option>
                  <option value="ibrida">Ibrida (MHEV/HEV/PHEV)</option>
                  <option value="elettrica">100% Elettrica (BEV)</option>
                  <option value="gpl">GPL / Metano</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Classe Euro
                </label>
                <select
                  value={euroClass}
                  onChange={(e) => setEuroClass(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:outline-none"
                >
                  <option value="euro6">Euro 6 / Euro 6d</option>
                  <option value="euro5">Euro 5</option>
                  <option value="euro4">Euro 4</option>
                  <option value="euro3">Euro 3</option>
                  <option value="euro2">Euro 2</option>
                  <option value="euro1">Euro 0 - 1</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Anzianità del veicolo (anni dall&apos;immatricolazione)
              </label>
              <input
                type="range"
                min="0"
                max="25"
                value={autoAge}
                onChange={(e) => setAutoAge(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1 font-medium">
                <span>Nuova (0 anni)</span>
                <span>{autoAge} anni</span>
                <span>Storica (20+ anni)</span>
              </div>
            </div>
          </div>

          {/* Box Risultato Stima */}
          <div className="flex flex-col justify-between rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 text-white p-6 sm:p-8">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Importo Stimato Annuo
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 font-mono">
                  Anno 2026
                </span>
              </div>

              <div className="text-center py-4">
                {result.isElectricExempt ? (
                  <div>
                    <div className="text-4xl font-extrabold text-emerald-400 mb-2">
                      0 € / anno
                    </div>
                    <div className="text-xs text-emerald-300 flex items-center justify-center gap-1.5">
                      <Zap className="w-4 h-4" />
                      Esenzione totale per i primi 5 anni (auto elettrica)
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-5xl font-extrabold tracking-tight text-white mb-2 font-mono">
                      {result.totale.toLocaleString('it-IT')} €
                    </div>
                    <p className="text-xs text-slate-400">
                      Tassa automobilistica regionale annua
                    </p>
                  </div>
                )}
              </div>

              {/* Dettaglio quote */}
              <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Bollo ordinario:</span>
                  <span className="font-bold text-white font-mono">{result.bolloBase} €</span>
                </div>
                {result.superbollo > 0 && (
                  <div className="flex justify-between text-amber-300 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Superbollo (&gt;185 kW):
                    </span>
                    <span className="font-bold font-mono">+{result.superbollo} €</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400 text-[11px] pt-1">
                  <span>Regione:</span>
                  <span>{REGION_RATES[region]?.name}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800">
              <Link
                href="/#scanner-section"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 p-3 text-xs font-bold text-white transition-colors shadow-lg shadow-blue-600/30"
              >
                Valuta il prezzo di quest&apos;auto sullo Scanner
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
