'use client';

import { useState, useMemo, useEffect } from 'react';
import type { AutoReport } from '@autoesperto/types';
import {
  SlidersHorizontal,
  Calendar,
  Gauge,
  Cog,
  Fuel,
  Euro,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Tag,
  CheckCircle2,
  Car,
  Zap,
  Palette,
  Hash,
  Layers,
  Settings2,
} from 'lucide-react';
import { calculateBolloAccurate } from '@/lib/bollo';
import { estimateReliability } from '@/lib/affidabilita';
import { estimateConsumption } from '@/lib/consumi';

interface Props {
  report: AutoReport;
  onUpdate: (updatedReport: AutoReport) => void;
}

interface OptionalItem {
  id: string;
  label: string;
  valueAdd: number; // Valore aggiunto medio in €
  desc: string;
}

const AVAILABLE_OPTIONALS: OptionalItem[] = [
  { id: 'led', label: 'Fari Full LED / Matrix', valueAdd: 350, desc: 'Illuminazione LED avanzata' },
  { id: 'nav_carplay', label: 'Navigatore & Apple CarPlay / Android Auto', valueAdd: 300, desc: 'Infotainment con mirroring smartphone' },
  { id: 'camera_sensors', label: 'Sensori Park + Retrocamera', valueAdd: 250, desc: 'Ausilio al parcheggio anteriore/posteriore' },
  { id: 'sunroof', label: 'Tetto Panoramico / Apribile', valueAdd: 400, desc: 'Tetto in cristallo o apribile' },
  { id: 'leather', label: 'Interni in Pelle / Sedili Riscaldati', valueAdd: 350, desc: 'Rivestimenti pregiati e comfort' },
  { id: 'alloys', label: 'Cerchi in Lega Maggiorati', valueAdd: 200, desc: 'Cerchi da 17"/18"/19"' },
  { id: 'sport_pack', label: 'Pacchetto Sport (R-Line, M-Sport, AMG, ST-Line)', valueAdd: 600, desc: 'Assetto, paraurti e volante sportivo' },
  { id: 'service_history', label: 'Tagliandi Ufficiali Certificati', valueAdd: 500, desc: 'Cronologia manutenzione tracciabile' },
  { id: 'extra_wheels', label: 'Doppio treno di Gomme (Invernali)', valueAdd: 250, desc: 'Set di pneumatici termici aggiuntivo' },
  { id: 'tow_hook', label: 'Gancio Traino Omologato', valueAdd: 300, desc: 'Omologato a libretto' },
];

const CONDITION_OPTIONS = [
  { id: 'excellent', label: 'Ottima / Come Nuova', factor: 1.04, note: '+4% sul valore (nessun ripristino)' },
  { id: 'good', label: 'Buona (Normali segni d\'uso)', factor: 1.00, note: 'Allineata alla media di mercato' },
  { id: 'fair', label: 'Lievi Graffi o Usura Interna', factor: 0.94, note: '-6% per piccoli ritocchi' },
  { id: 'poor', label: 'Da Ripristinare / Difetti Evidenti', factor: 0.86, note: '-14% per carrozzeria/meccanica' },
];

const FUEL_OPTIONS = ['Diesel', 'Benzina', 'Ibrida', 'GPL', 'Metano', 'Elettrica'];
const TRANS_OPTIONS = ['Manuale', 'Automatico'];
const BODY_OPTIONS = ['Berlina', 'SUV / Crossover', 'Station Wagon', 'Coupé', 'Cabrio', 'Monovolume', 'Utilitaria', 'Furgone'];

export default function ReportQuickCustomizer({ report, onUpdate }: Props) {
  const currentYear = new Date().getFullYear();

  // Initial values from report
  const initialMake = report.vehicle?.make || '';
  const initialModel = report.vehicle?.model || '';
  const initialVersion = report.vehicle?.version || '';
  const initialYear = report.price?.inputYear || report.vehicle?.year || currentYear - 5;
  const initialKm = report.price?.inputKm || (report.vehicle as any)?.mileage || 100000;
  const initialTrans = report.vehicle?.transmission || 'Manuale';
  const initialFuel = report.vehicle?.fuel || 'Diesel';
  const initialPrice = report.price?.requestedPrice || '';
  const initialPower = report.vehicle?.power || '';
  const initialDisplacement = report.vehicle?.displacement || '';
  const initialBody = report.vehicle?.body || '';
  const initialColor = report.vehicle?.color || '';
  const initialEuroClass = report.vehicle?.euroClass || '';

  // Editable state
  const [make, setMake] = useState<string>(initialMake);
  const [model, setModel] = useState<string>(initialModel);
  const [version, setVersion] = useState<string>(initialVersion);
  const [year, setYear] = useState<number>(initialYear);
  const [km, setKm] = useState<number>(initialKm);
  const [transmission, setTransmission] = useState<string>(initialTrans);
  const [fuel, setFuel] = useState<string>(initialFuel);
  const [requestedPrice, setRequestedPrice] = useState<string>(initialPrice ? String(initialPrice) : '');
  const [power, setPower] = useState<string>(initialPower);
  const [displacement, setDisplacement] = useState<string>(initialDisplacement);
  const [body, setBody] = useState<string>(initialBody);
  const [color, setColor] = useState<string>(initialColor);
  const [euroClass, setEuroClass] = useState<string>(initialEuroClass);
  const [selectedOptionals, setSelectedOptionals] = useState<string[]>([]);
  const [condition, setCondition] = useState<string>('good');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Sync state if report vehicle changes externally
  useEffect(() => {
    if (report.vehicle?.year && report.vehicle.year !== year) {
      setYear(report.price?.inputYear || report.vehicle.year);
    }
  }, [report.vehicle?.year]);

  const toggleOptional = (id: string) => {
    setSelectedOptionals((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Calcolo dettagliato del valore di mercato
  const calculationBreakdown = useMemo(() => {
    const origVal = report.price?.estimatedValue || 15000;
    const origYear = report.price?.inputYear || report.vehicle?.year || currentYear - 5;
    const origKm = report.price?.inputKm || 100000;

    // 1. Svalutazione per Anno (~8% all'anno)
    const yearDiff = year - origYear;
    const yearFactor = Math.pow(1.08, yearDiff);

    // 2. Rettifica Chilometri (media attesa ~15.000 km/anno)
    const expectedKmForYear = Math.max(10000, (currentYear - year) * 15000);
    const kmDiff = km - expectedKmForYear;
    const kmFactor = Math.max(0.68, Math.min(1.38, 1 - (kmDiff / 100000) * 0.12));

    // 3. Cambio Automatico (+450€)
    const transBonus = transmission.toLowerCase().includes('auto') ? 450 : 0;

    // 4. Alimentazione (Ibrido +4%, Diesel Euro5/6 leggero sconto)
    let fuelFactor = 1.0;
    const fLower = fuel.toLowerCase();
    if (fLower.includes('ibrid') || fLower.includes('hybrid')) fuelFactor = 1.04;
    else if (fLower.includes('elettric')) fuelFactor = 0.97;
    else if (fLower.includes('gpl') || fLower.includes('metano')) fuelFactor = 1.02;

    // 5. Valore Aggiunto Optional
    const optionalsSum = selectedOptionals.reduce((acc, optId) => {
      const found = AVAILABLE_OPTIONALS.find((o) => o.id === optId);
      return acc + (found ? found.valueAdd : 0);
    }, 0);

    // 6. Condizione / Stato d'uso
    const condObj = CONDITION_OPTIONS.find((c) => c.id === condition) || CONDITION_OPTIONS[1];
    const conditionFactor = condObj.factor;

    // Calcolo finale aggregato
    const subtotal = (origVal * yearFactor * kmFactor * fuelFactor + transBonus) * conditionFactor;
    const finalValue = Math.max(1200, Math.round((subtotal + optionalsSum) / 50) * 50);

    return {
      finalValue,
      optionalsSum,
      kmDelta: Math.round(kmDiff),
      conditionFactor,
      min: Math.round(finalValue * 0.91),
      max: Math.round(finalValue * 1.09),
    };
  }, [report, year, km, transmission, fuel, selectedOptionals, condition, currentYear]);

  const handleApplyChanges = () => {
    const numReqPrice = requestedPrice ? parseFloat(requestedPrice.replace(/\D/g, '')) : undefined;
    const val = calculationBreakdown.finalValue;

    // Ricalcolo del verdetto prezzo
    let priceLabel: 'GOOD' | 'FAIR' | 'HIGH' = 'FAIR';
    let vsPercent = 0;
    if (numReqPrice && val > 0) {
      vsPercent = Math.round(((numReqPrice - val) / val) * 100);
      if (vsPercent <= -5) priceLabel = 'GOOD';
      else if (vsPercent >= 7) priceLabel = 'HIGH';
      else priceLabel = 'FAIR';
    }

    const kw = power ? parseInt(String(power).replace(/\D/g, '')) : (report.vehicle?.power ? parseInt(String(report.vehicle.power).replace(/\D/g, '')) : 85);
    const bolloCalc = calculateBolloAccurate(kw, fuel, year);
    const newReliability = estimateReliability(make || report.vehicle?.make || 'Auto', model || report.vehicle?.model || '', year);
    const newConsumption = estimateConsumption(make || report.vehicle?.make || 'Auto', model || report.vehicle?.model || '', year);

    const updated: AutoReport = {
      ...report,
      vehicle: {
        ...report.vehicle,
        make: make || report.vehicle?.make,
        model: model || report.vehicle?.model,
        version: version || report.vehicle?.version,
        year: year,
        transmission: transmission,
        fuel: fuel,
        power: power || report.vehicle?.power,
        displacement: displacement || report.vehicle?.displacement,
        body: body || report.vehicle?.body,
        color: color || report.vehicle?.color,
        euroClass: euroClass || report.vehicle?.euroClass,
      },
      price: {
        ...report.price,
        estimatedValue: val,
        inputYear: year,
        inputKm: km,
        requestedPrice: numReqPrice,
        priceVsMarketPercent: vsPercent,
        priceLabel,
        min: calculationBreakdown.min,
        max: calculationBreakdown.max,
      },
      reliability: {
        ...report.reliability,
        score: newReliability.score,
        taxAnnual: bolloCalc.totale,
        consumption: {
          city: newConsumption.urban,
          highway: newConsumption.extraurban,
          combined: newConsumption.combined,
          fuelType: fuel,
        },
      },
    };

    onUpdate(updated);
  };

  // Esegui aggiornamento automatico quando i parametri cambiano
  useEffect(() => {
    handleApplyChanges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, km, transmission, fuel, requestedPrice, selectedOptionals, condition, version, make, model, power, displacement, body, color, euroClass]);

  const handleReset = () => {
    setMake(initialMake);
    setModel(initialModel);
    setVersion(initialVersion);
    setYear(initialYear);
    setKm(initialKm);
    setTransmission(initialTrans);
    setFuel(initialFuel);
    setRequestedPrice(initialPrice ? String(initialPrice) : '');
    setPower(initialPower);
    setDisplacement(initialDisplacement);
    setBody(initialBody);
    setColor(initialColor);
    setEuroClass(initialEuroClass);
    setSelectedOptionals([]);
    setCondition('good');
    onUpdate(report);
  };

  return (
    <section className="rounded-3xl border-2 border-blue-200/90 bg-gradient-to-b from-blue-50/70 via-white to-slate-50 p-5 md:p-6 shadow-sm">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-blue-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20 shrink-0">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                Personalizza Dettagli & Valutazione Auto
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800">
                <Sparkles className="w-3 h-3 text-emerald-600" /> Ricalcolo Live
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Modifica marca, modello, carburante, anno, km e optional per ottenere una stima precisa al 100%.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold transition-all shadow-xs shrink-0"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          {isExpanded ? 'Riduci pannello' : 'Modifica tutti i dettagli'}
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
        </button>
      </div>

      {/* Quick Summary Badges Preview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4">
        <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Car className="w-3.5 h-3.5 text-blue-600" /> Auto
          </span>
          <span className="text-sm font-extrabold text-slate-900 truncate block mt-1">
            {make || '—'} {model || '—'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-blue-600" /> Anno / KM
          </span>
          <span className="text-sm font-extrabold text-slate-900 number-mono block mt-1">
            {year} · {km.toLocaleString('it-IT')} km
          </span>
        </div>

        <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Fuel className="w-3.5 h-3.5 text-blue-600" /> Motore
          </span>
          <span className="text-sm font-extrabold text-slate-900 truncate block mt-1">
            {fuel} · {transmission}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Euro className="w-3.5 h-3.5 text-emerald-600" /> Valore Calcolato
          </span>
          <span className="text-sm font-extrabold text-emerald-700 number-mono block mt-1">
            {calculationBreakdown.finalValue.toLocaleString('it-IT')} €
          </span>
        </div>
      </div>

      {/* Full Editing Controls */}
      {isExpanded && (
        <div className="mt-5 pt-5 border-t border-blue-100 space-y-5 animate-fade-in">

          {/* ── Section 1: Identità Veicolo ── */}
          <div>
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Car className="w-4 h-4 text-blue-600" /> Identità Veicolo
            </h4>
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Marca</label>
                <input
                  type="text"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  placeholder="Es. Volkswagen, BMW, Fiat"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Modello</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="Es. Golf, Serie 3, Panda"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Allestimento / Versione</label>
                <input
                  type="text"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="Es. R-Line, Lounge, Business"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          {/* ── Section 2: Dati Tecnici ── */}
          <div>
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Settings2 className="w-4 h-4 text-blue-600" /> Dati Tecnici
            </h4>

            <div className="space-y-4">
              {/* Carburante */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1">
                  <Fuel className="w-3.5 h-3.5 text-blue-600" /> Tipo di Carburante / Alimentazione
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {FUEL_OPTIONS.map((f) => {
                    const isSel = fuel.toLowerCase().includes(f.toLowerCase());
                    return (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFuel(f)}
                        className={`h-9 px-2.5 rounded-xl text-xs font-bold border transition-all ${
                          isSel
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/40'
                        }`}
                      >
                        {f}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cambio */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1">
                  <Cog className="w-3.5 h-3.5 text-blue-600" /> Trasmissione / Cambio
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TRANS_OPTIONS.map((t) => {
                    const isSel = transmission.toLowerCase().includes(t.toLowerCase());
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTransmission(t)}
                        className={`h-9 px-3 rounded-xl text-xs font-bold border transition-all ${
                          isSel
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/40'
                        }`}
                      >
                        {t} {t === 'Automatico' ? '(+450 €)' : ''}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Potenza, Cilindrata, Carrozzeria */}
              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-blue-600" /> Potenza (CV o kW)
                  </label>
                  <input
                    type="text"
                    value={power}
                    onChange={(e) => setPower(e.target.value)}
                    placeholder="Es. 150 CV, 110 kW"
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-blue-600" /> Cilindrata
                  </label>
                  <input
                    type="text"
                    value={displacement}
                    onChange={(e) => setDisplacement(e.target.value)}
                    placeholder="Es. 1598 cc, 2.0 TDI"
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-blue-600" /> Carrozzeria
                  </label>
                  <select
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="">Seleziona...</option>
                    {BODY_OPTIONS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Colore, Classe Euro */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                    <Palette className="w-3.5 h-3.5 text-blue-600" /> Colore
                  </label>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="Es. Nero Perla, Grigio Nardo"
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5 text-blue-600" /> Classe Euro
                  </label>
                  <select
                    value={euroClass}
                    onChange={(e) => setEuroClass(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="">Seleziona...</option>
                    <option value="Euro 6d">Euro 6d</option>
                    <option value="Euro 6d-TEMP">Euro 6d-TEMP</option>
                    <option value="Euro 6c">Euro 6c</option>
                    <option value="Euro 6b">Euro 6b</option>
                    <option value="Euro 6">Euro 6</option>
                    <option value="Euro 5">Euro 5</option>
                    <option value="Euro 4">Euro 4</option>
                    <option value="Euro 3">Euro 3</option>
                    <option value="Euro 2">Euro 2</option>
                    <option value="Euro 1">Euro 1</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 3: Anno, KM, Prezzo ── */}
          <div>
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Euro className="w-4 h-4 text-blue-600" /> Anno, Chilometri & Prezzo
            </h4>
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Anno di Immatricolazione
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value, 10))}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                >
                  {Array.from({ length: 28 }, (_, i) => currentYear - i).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Chilometri Effettivi (KM)
                </label>
                <input
                  type="number"
                  step="2500"
                  value={km}
                  onChange={(e) => setKm(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Prezzo Richiesto (€ - Opzionale)
                </label>
                <input
                  type="number"
                  placeholder="Es. 14500"
                  value={requestedPrice}
                  onChange={(e) => setRequestedPrice(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          {/* ── Section 4: Stato d'uso & Condizione ── */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Stato Generale del Veicolo
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CONDITION_OPTIONS.map((c) => {
                const isSel = condition === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCondition(c.id)}
                    className={`p-2.5 text-left rounded-xl border text-xs font-semibold transition-all ${
                      isSel
                        ? 'border-blue-600 bg-blue-50/80 text-blue-900 ring-1 ring-blue-600'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold">{c.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{c.note}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Section 5: Optional & Dotazioni ── */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-blue-600" /> Optional & Dotazioni Aggiuntive
              </label>
              {calculationBreakdown.optionalsSum > 0 && (
                <span className="text-xs font-extrabold text-emerald-700">
                  + {calculationBreakdown.optionalsSum.toLocaleString('it-IT')} € aggiunti alla stima
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              Seleziona gli accessori presenti per valorizzare l&apos;auto al prezzo reale di mercato:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {AVAILABLE_OPTIONALS.map((opt) => {
                const isChecked = selectedOptionals.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleOptional(opt.id)}
                    className={`flex items-center justify-between gap-2 p-2.5 rounded-xl border text-left text-xs transition-all ${
                      isChecked
                        ? 'border-emerald-600 bg-emerald-50/60 text-emerald-950 font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="truncate">{opt.label}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{opt.desc}</div>
                    </div>
                    <span
                      className={`shrink-0 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                        isChecked ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      +{opt.valueAdd}€
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Ripristina parametri originali
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Stima ricalcolata: {calculationBreakdown.finalValue.toLocaleString('it-IT')} €
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
