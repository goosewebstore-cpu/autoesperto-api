'use client';

import { useState, useMemo, useEffect } from 'react';
import type { AutoReport } from '@autoesperto/types';
import {
  CheckCircle2,
  AlertTriangle,
  Euro,
  Gauge,
  Fuel,
  ShieldCheck,
  Car,
  ExternalLink,
  FileText,
  Check,
  Wrench,
  Scale,
  ShieldAlert,
  MapPin,
  ChevronDown,
  Tag,
  ShoppingBag,
  Clock,
  Sparkles,
} from 'lucide-react';
import { calculateBolloAccurate, REGIONS_CONFIG, type RegionBolloConfig } from '@/lib/bollo';

interface Props {
  report: AutoReport;
  onUpdateReport?: (updated: AutoReport) => void;
}

function eur(v: number): string {
  return Math.round(v).toLocaleString('it-IT') + ' €';
}

const TOP_REGIONS: Array<{ id: string; name: string; deltaTag: string }> = [
  { id: 'lombardia', name: 'Lombardia', deltaTag: '+2%' },
  { id: 'lazio', name: 'Lazio', deltaTag: '0%' },
  { id: 'campania', name: 'Campania', deltaTag: '-5%' },
  { id: 'veneto', name: 'Veneto', deltaTag: '+2%' },
  { id: 'piemonte', name: 'Piemonte', deltaTag: '+1%' },
  { id: 'emilia_romagna', name: 'Emilia-Rom.', deltaTag: '+1%' },
  { id: 'sicilia', name: 'Sicilia', deltaTag: '-4%' },
  { id: 'puglia', name: 'Puglia', deltaTag: '-3%' },
  { id: 'trentino_alto_adige', name: 'Trentino', deltaTag: '+3%' },
];

function normalizeRegionId(input?: string): string {
  if (!input) return 'lombardia';
  const clean = input.toLowerCase().trim().replace(/[-\s]+/g, '_');
  if (REGIONS_CONFIG[clean]) return clean;
  for (const [k, v] of Object.entries(REGIONS_CONFIG)) {
    if (v.name.toLowerCase() === input.toLowerCase().trim() || clean.includes(k) || k.includes(clean)) {
      return k;
    }
  }
  return 'lombardia';
}

export default function ReportDeepAnalysis({ report, onUpdateReport }: Props) {
  const vehicle = report?.vehicle || ({} as any);
  const price = report?.price || ({} as any);

  const make = vehicle.make || 'Veicolo';
  const year = Number(vehicle.year) || new Date().getFullYear() - 5;
  const currentYear = new Date().getFullYear();
  const age = Math.max(1, currentYear - year);
  const km = Number(price.inputKm || (vehicle as any).km || (vehicle as any).mileage) || 75000;
  const requestedPrice = price.requestedPrice ? Number(price.requestedPrice) : undefined;

  // Ruolo utente: 'buy' = Sto Comprando, 'sell' = Sto Vendendo
  const [actionMode, setActionMode] = useState<'buy' | 'sell'>('buy');

  // Initial region from report
  const initialRegionId = useMemo(() => {
    const fromLoc = vehicle.location?.region || (vehicle.location as any)?.regionId;
    return normalizeRegionId(fromLoc);
  }, [vehicle.location]);

  const [selectedRegion, setSelectedRegion] = useState<string>(initialRegionId);

  // Sync if vehicle location changes externally
  useEffect(() => {
    const fromLoc = vehicle.location?.region || (vehicle.location as any)?.regionId;
    if (fromLoc) {
      const norm = normalizeRegionId(fromLoc);
      if (norm !== selectedRegion) {
        setSelectedRegion(norm);
      }
    }
  }, [vehicle.location]);

  const regConfig: RegionBolloConfig = REGIONS_CONFIG[selectedRegion] || REGIONS_CONFIG.lombardia;
  const regionalFactor = regConfig.marketFactor || 1.0;

  // Base estimated value without regional multiplier
  const baseEstimated = useMemo(() => {
    const rawVal = Number(price.estimatedValue) || 12000;
    const currentRegFactor = REGIONS_CONFIG[initialRegionId]?.marketFactor || 1.0;
    return Math.round(rawVal / currentRegFactor);
  }, [price.estimatedValue, initialRegionId]);

  // Dynamically adjusted values based on current selected region
  const adjustedEstimatedValue = useMemo(() => {
    return Math.round((baseEstimated * regionalFactor) / 50) * 50;
  }, [baseEstimated, regionalFactor]);

  const adjustedMin = useMemo(() => Math.round((adjustedEstimatedValue * 0.90) / 50) * 50, [adjustedEstimatedValue]);
  const adjustedMax = useMemo(() => Math.round((adjustedEstimatedValue * 1.10) / 50) * 50, [adjustedEstimatedValue]);

  // Fuel type detection
  const fuel = (vehicle.fuel || 'Benzina').toLowerCase();
  const isDiesel = fuel.includes('diesel') || fuel.includes('jtd') || fuel.includes('tdi') || fuel.includes('dci') || fuel.includes('hdi');
  const isHybrid = fuel.includes('ibrid') || fuel.includes('hybrid');
  const isElectric = fuel.includes('elettr') || fuel.includes('ev') || fuel.includes('bev') || /tesla|polestar|byd/.test(make.toLowerCase());
  const isGpl = fuel.includes('gpl') || fuel.includes('lpg');
  const isMetano = fuel.includes('metano') || fuel.includes('cng');

  // Bollo calculation for the selected region
  const bolloCalc = useMemo(() => {
    return calculateBolloAccurate(vehicle.power, vehicle.fuel, vehicle.year, selectedRegion, vehicle.euroClass);
  }, [vehicle.power, vehicle.fuel, vehicle.year, selectedRegion, vehicle.euroClass]);

  // Handler for region change
  const handleRegionChange = (newRegionId: string) => {
    setSelectedRegion(newRegionId);
    const targetConfig = REGIONS_CONFIG[newRegionId] || REGIONS_CONFIG.lombardia;
    const newFactor = targetConfig.marketFactor || 1.0;
    const newVal = Math.round((baseEstimated * newFactor) / 50) * 50;
    const newMin = Math.round((newVal * 0.90) / 50) * 50;
    const newMax = Math.round((newVal * 1.10) / 50) * 50;
    const newBollo = calculateBolloAccurate(vehicle.power, vehicle.fuel, vehicle.year, newRegionId, vehicle.euroClass);

    let newPriceLabel: 'GOOD' | 'FAIR' | 'HIGH' = 'FAIR';
    let newVsPercent = 0;
    if (requestedPrice && newVal > 0) {
      newVsPercent = Math.round(((requestedPrice - newVal) / newVal) * 100);
      if (newVsPercent <= -5) newPriceLabel = 'GOOD';
      else if (newVsPercent >= 7) newPriceLabel = 'HIGH';
    }

    if (onUpdateReport) {
      onUpdateReport({
        ...report,
        vehicle: {
          ...report.vehicle,
          location: {
            ...report.vehicle?.location,
            region: targetConfig.name,
            city: targetConfig.name,
          },
        },
        price: {
          ...report.price,
          estimatedValue: newVal,
          min: newMin,
          max: newMax,
          priceLabel: requestedPrice ? newPriceLabel : report.price?.priceLabel,
          priceVsMarketPercent: requestedPrice ? newVsPercent : report.price?.priceVsMarketPercent,
        },
        reliability: {
          ...report.reliability,
          taxAnnual: newBollo.totale,
        },
      });
    }
  };

  // 1. STRATEGIA DI TRATTATIVA: ACQUIRENTE vs VENDITORE
  const targetClosePrice = adjustedEstimatedValue;

  // Scenario ACQUIRENTE
  const startingOffer = Math.max(800, Math.round((adjustedEstimatedValue * 0.89) / 50) * 50);
  const maxCeilingPrice = adjustedMax;
  const savingsVsAsking = requestedPrice && requestedPrice > targetClosePrice
    ? Math.round(requestedPrice - targetClosePrice)
    : Math.round(adjustedEstimatedValue * 0.11);

  // Scenario VENDITORE
  const sellerListingPrice = Math.round((adjustedEstimatedValue * 1.09) / 50) * 50; // +9% per margine di trattativa
  const sellerFloorPrice = Math.max(500, Math.round((adjustedEstimatedValue * 0.90) / 50) * 50); // Minimo di riserva
  const negotiationBuffer = sellerListingPrice - targetClosePrice;

  // 2. COERENZA CHILOMETRICA
  const kmPerYear = Math.round(km / age);
  const expectedAverageKmPerYear = isDiesel ? 17500 : isGpl || isMetano ? 15000 : isHybrid ? 13000 : 10000;

  const kmAudit = useMemo(() => {
    if (isDiesel && kmPerYear < 6000 && age >= 4) {
      return {
        tone: 'warning' as const,
        label: 'Percorrenza Anomala (Verificare Revisioni)',
        desc: `Solo ${kmPerYear.toLocaleString('it-IT')} km/anno per un motore Diesel sono statisticamente rari. Verifica il Portale dell'Automobilista per escludere contachilometri scalato o problemi al filtro antiparticolato (FAP/DPF) intasato per tragitti brevi.`,
      };
    }
    if (kmPerYear > 32000) {
      return {
        tone: 'info' as const,
        label: 'Uso Intensivo / Flotta Autostradale',
        desc: `Media di ${kmPerYear.toLocaleString('it-IT')} km/anno: vettura utilizzata prevalentemente in autostrada. Se i tagliandi sono documentati con fattura, l'usura di frizione e cambio è spesso inferiore rispetto a un uso cittadino.`,
      };
    }
    return {
      tone: 'good' as const,
      label: 'Chilometraggio Coerente con l\'Età',
      desc: `La media di ${kmPerYear.toLocaleString('it-IT')} km/anno è in linea con le statistiche nazionali italiane per questa motorizzazione (${expectedAverageKmPerYear.toLocaleString('it-IT')} km/anno previsti).`,
    };
  }, [isDiesel, kmPerYear, age, expectedAverageKmPerYear]);

  // 3. COSTI DI GESTIONE MENSILIZZATI E COSTO AL KM (TCO)
  const annualKm = 10000;
  let annualFuelCost = 1450;
  if (isElectric) annualFuelCost = 420;
  else if (isGpl) annualFuelCost = 680;
  else if (isMetano) annualFuelCost = 720;
  else if (isDiesel) annualFuelCost = 980;
  else if (isHybrid) annualFuelCost = 920;
  else annualFuelCost = 1280;

  const annualBollo = bolloCalc.totale;
  const annualInsurance = isElectric || make.toLowerCase().includes('bmw') || make.toLowerCase().includes('audi') || make.toLowerCase().includes('mercedes') ? 580 : 420;
  const annualService = isElectric ? 110 : age > 8 ? 320 : 220;
  const annualTiresWear = 120;

  const totalAnnualCost = annualFuelCost + annualBollo + annualInsurance + annualService + annualTiresWear;
  const monthlyCost = Math.round(totalAnnualCost / 12);
  const costPerKm = (totalAnnualCost / annualKm).toFixed(2);

  // 4. NORMATIVE AMBIENTALI ZTL
  const euroClass = (vehicle.euroClass || '').toUpperCase() || (year >= 2021 ? 'EURO 6D' : year >= 2018 ? 'EURO 6C' : year >= 2015 ? 'EURO 6' : year >= 2010 ? 'EURO 5' : 'EURO 4');
  const ztlAudit = useMemo(() => {
    if (isElectric) {
      return {
        status: 'Accesso Totale Illimitato',
        color: 'text-emerald-800 bg-emerald-50/80 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800',
        detail: 'Nessun blocco a Milano (Area B/C gratuita), Roma Fascia Verde, ZTL Bologna e Firenze. Parcheggio gratuito sulle strisce blu in gran parte dei comuni italiani.',
      };
    }
    if (isHybrid) {
      return {
        status: 'Accesso Agevolato / Nessun Blocco Attivo',
        color: 'text-emerald-800 bg-emerald-50/80 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800',
        detail: `Omologazione ${euroClass} Ibrida: libera circolazione a Milano Area B (nessun blocco fino a oltre il 2030), libera a Roma Fascia Verde e nelle domeniche ecologiche.`,
      };
    }
    if (isDiesel) {
      if (euroClass.includes('6D')) {
        return {
          status: 'Circolazione Libera fino a Ottobre 2030',
          color: 'text-blue-800 bg-blue-50/80 border-blue-200 dark:text-blue-300 dark:bg-blue-950/40 dark:border-blue-800',
          detail: 'Diesel Euro 6d: circola liberamente a Milano Area B fino a Ottobre 2030. Nessuna restrizione ordinaria a Roma o nel Bacino Padano.',
        };
      }
      if (euroClass.includes('6')) {
        return {
          status: 'Circolazione Libera fino a Ottobre 2028',
          color: 'text-amber-800 bg-amber-50/80 border-amber-200 dark:text-amber-300 dark:bg-amber-950/40 dark:border-amber-800',
          detail: 'Diesel Euro 6 (A/B/C): circolazione regolare a Milano Area B fino a Ottobre 2028. A Roma e Torino consentita nei giorni ordinari con possibili stop emergenziali smog.',
        };
      }
      return {
        status: 'Attenzione: Blocchi Feriali Attivi',
        color: 'text-rose-800 bg-rose-50/80 border-rose-200 dark:text-rose-300 dark:bg-rose-950/40 dark:border-rose-800',
        detail: `${euroClass} Diesel: soggetto a stop feriale a Milano Area B e nei comuni di pianura sopra i 30.000 ab. (lun-ven 7:30-19:30). Richiede servizio MoVe-In per circolare con tetto km.`,
      };
    }
    // Benzina
    if (euroClass.includes('6') || euroClass.includes('5')) {
      return {
        status: 'Circolazione Libera e Senza Scadenza Vicina',
        color: 'text-emerald-800 bg-emerald-50/80 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800',
        detail: `${euroClass} Benzina: nessun blocco a Milano Area B (i motori benzina Euro 5/6 possono circolare oltre il 2030). Libera a Roma e nei capoluoghi.`,
      };
    }
    return {
      status: 'Limitazioni Feriali Invernali',
      color: 'text-amber-800 bg-amber-50/80 border-amber-200 dark:text-amber-300 dark:bg-amber-950/40 dark:border-amber-800',
      detail: `${euroClass} Benzina: possibili limitazioni feriali invernali nei centri storici di alcune grandi città del nord Italia.`,
    };
  }, [isElectric, isHybrid, isDiesel, euroClass]);

  // 5. CHECKLIST INTERATTIVE SEPARATE: BUYER & SELLER
  const [buyerCheckedItems, setBuyerCheckedItems] = useState<Record<number, boolean>>({});
  const [sellerCheckedItems, setSellerCheckedItems] = useState<Record<number, boolean>>({});

  const buyChecklistItems = [
    {
      title: 'Vano Motore e Liquidi a Freddo',
      desc: 'Estrai l\'astina dell\'olio (deve essere limpido, tra Min e Max). Svita il tappo di rabbocco: nessuna schiuma o morchia biancastra (sintomo di guarnizione testata usurata).',
    },
    {
      title: 'Pneumatici e Data di Produzione (DOT)',
      desc: 'Cerca la sigla "DOT" con 4 cifre (es. "3821" = settembre 2021). Se hanno oltre 5 anni la gomma è cristallizzata e va sostituita anche con battistrada residuo.',
    },
    {
      title: 'Carrozzeria e Allineamento Fari',
      desc: 'Controlla che le fessure tra cofano, paraurti e parafanghi siano simmetriche su entrambi i lati. Fari con plastiche di usura diversa indicano una sostituzione post-incidente.',
    },
    {
      title: 'Interni, Volante e Coerenza Pedali',
      desc: 'Confronta la corona del volante, il pomello del cambio e la gomma dei pedali con i km indicati. Pedali lisci su un\'auto con 40.000 km indicano un chilometraggio scalato.',
    },
    {
      title: 'Test Drive Dinamico (Almeno 15 minuti)',
      desc: 'Sterza a fondo a passo d\'uomo in parcheggio (nessun rumore "clac-clac" dai semiassi). In rettilineo, togli leggermente le mani dal volante: l\'auto deve proseguire perfettamente dritta.',
    },
    {
      title: 'Corrispondenza Telaio (VIN) e Libretto',
      desc: 'Controlla che il telaio a 17 caratteri sul libretto coincida con quello stampigliato sul telaio (sotto il cofano o alla base del parabrezza). Chiedi copia delle ultime revisioni.',
    },
  ];

  const sellChecklistItems = [
    {
      title: 'Documenti e Titolo di Proprietà',
      desc: 'Prepara Carta di Circolazione originale (Libretto), Certificato di Proprietà (CDP cartaceo o codice CDP digitale) e ricevuta dell\'ultimo bollo auto pagato.',
    },
    {
      title: 'Lavaggio Professionale e Detailing Interni',
      desc: 'Lava carrozzeria e cerchi, aspira moquette e sedili, sgrassa i vetri ed elimina odori. Un\'auto pulita e profumata si vende fino al 10% in più.',
    },
    {
      title: 'Set Fotografico Professionale (12-15 Foto)',
      desc: 'Scatta di giorno con luce naturale: 4 angoli carrozzeria, dettagli cerchi e battistrada gomme, interni (sedili, cruscotto a motore acceso senza spie d\'errore) e bagagliaio.',
    },
    {
      title: 'Annuncio Trasparente e Scheda Tecnica',
      desc: 'Indica allestimento esatto, km certificati, storico tagliandi documentato e disponibilità a qualsiasi verifica col meccanico di fiducia dell\'acquirente.',
    },
    {
      title: 'Prova su Strada con Te a Bordo',
      desc: 'Accompagna sempre il potenziale acquirente sedendoti al lato passeggero. Non cedere mai il possesso delle chiavi prima di essere salito a bordo.',
    },
    {
      title: 'Pagamento Sicuro e Voltura al PRA',
      desc: 'Accetta solo Bonifico Istantaneo con accredito confermato sulla tua app bancaria prima di autenticare l\'atto di vendita in Comune o presso agenzia STA/PRA.',
    },
  ];

  const activeChecklist = actionMode === 'buy' ? buyChecklistItems : sellChecklistItems;
  const activeCheckedMap = actionMode === 'buy' ? buyerCheckedItems : sellerCheckedItems;

  const toggleCheck = (idx: number) => {
    if (actionMode === 'buy') {
      setBuyerCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
    } else {
      setSellerCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
    }
  };

  const completedCount = Object.values(activeCheckedMap).filter(Boolean).length;

  const deltaPercentStr = Math.round((regionalFactor - 1.0) * 100);
  const deltaFormatted = deltaPercentStr > 0 ? `+${deltaPercentStr}%` : deltaPercentStr < 0 ? `${deltaPercentStr}%` : 'Allineato';

  return (
    <div className="space-y-3 pt-1">
      {/* ─── 0. SELETTORE REGIONE & MERCATO LOCALE (COLLASSABILE) ─── */}
      <section className="bg-surface rounded-2xl shadow-card border border-border overflow-hidden">
        <details className="group" open>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 sm:p-5 text-xs sm:text-sm font-bold text-text-primary hover:bg-surface-2/50 transition-colors">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-blue-600 text-white shrink-0">
                <MapPin className="w-4 h-4" />
              </span>
              <span>
                Regione di Mercato: <span className="text-blue-600 font-extrabold">{regConfig.name}</span>
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {deltaFormatted} vs media ITA
              </span>
              <ChevronDown className="h-4 w-4 text-text-tertiary transition-transform group-open:rotate-180 shrink-0" />
            </div>
          </summary>

          <div className="border-t border-border p-4 sm:p-5 space-y-3 bg-surface">
            <p className="text-xs text-text-secondary">
              Il prezzo medio di transazione dell&apos;usato e l&apos;importo del bollo variano sensibilmente in base alla regione. Tocca una regione per ricalcolare istantaneamente:
            </p>

            {/* Quick Touch Region Pills */}
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-1.5">
              {TOP_REGIONS.map((reg) => {
                const isSelected = selectedRegion === reg.id;
                return (
                  <button
                    key={reg.id}
                    type="button"
                    onClick={() => handleRegionChange(reg.id)}
                    className={`py-2 px-1.5 rounded-xl text-xs font-extrabold transition-all text-center flex flex-col items-center justify-center cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500 ring-offset-1'
                        : 'bg-surface-2 hover:bg-border/70 text-text-secondary border border-border'
                    }`}
                  >
                    <span className="truncate w-full">{reg.name}</span>
                    <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-blue-100 font-black' : 'text-text-tertiary font-semibold'}`}>
                      {reg.deltaTag}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Dropdown for all 20 Italian Regions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2.5 border-t border-border text-xs">
              <label className="flex items-center gap-2 font-bold text-text-primary shrink-0">
                <span>Tutte le 20 Regioni:</span>
                <select
                  value={selectedRegion}
                  onChange={(e) => handleRegionChange(e.target.value)}
                  className="bg-surface-2 border border-border rounded-xl px-3 py-1.5 text-xs font-extrabold text-text-primary focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {Object.values(REGIONS_CONFIG).map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({Math.round((r.marketFactor - 1.0) * 100) > 0 ? `+${Math.round((r.marketFactor - 1.0) * 100)}%` : Math.round((r.marketFactor - 1.0) * 100) < 0 ? `${Math.round((r.marketFactor - 1.0) * 100)}%` : '0%'})
                    </option>
                  ))}
                </select>
              </label>

              <div className="text-[11px] text-text-secondary leading-tight">
                📍 <strong>{regConfig.name}</strong>: {regConfig.note}
              </div>
            </div>
          </div>
        </details>
      </section>

      {/* ─── 1. GUIDA TATTICA: COMPRARE vs VENDERE (COLLASSABILE & INTERATTIVA) ─── */}
      <section id="modulo-trattativa" className="bg-surface rounded-2xl shadow-card border border-border overflow-hidden">
        <details className="group" open>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 sm:p-5 text-xs sm:text-sm font-bold text-text-primary hover:bg-surface-2/50 transition-colors">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-brand shrink-0" />
              <span>
                Guida Tattica {actionMode === 'buy' ? 'all\'Acquisto' : 'alla Vendita'} in {regConfig.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                actionMode === 'buy'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
              }`}>
                {actionMode === 'buy' ? `Risparmio trattabile: -${eur(savingsVsAsking)}` : `Margine trattativa: +${eur(negotiationBuffer)}`}
              </span>
              <ChevronDown className="h-4 w-4 text-text-tertiary transition-transform group-open:rotate-180 shrink-0" />
            </div>
          </summary>

          <div className="border-t border-border p-4 sm:p-5 space-y-4 bg-surface">
            {/* SEGMENTED CONTROL: STO COMPRANDO vs STO VENDENDO */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-surface-2 border border-border">
              <div>
                <span className="text-xs font-black text-text-primary block">
                  Qual è il tuo obiettivo con quest&apos;auto?
                </span>
                <p className="text-[11px] text-text-secondary mt-0.5">
                  Seleziona il tuo ruolo per adattare la strategia, i target di prezzo e la checklist:
                </p>
              </div>

              <div className="inline-flex p-1 bg-surface rounded-xl border border-border shrink-0">
                <button
                  type="button"
                  onClick={() => setActionMode('buy')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    actionMode === 'buy'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Sto Comprando</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActionMode('sell')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    actionMode === 'sell'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>Sto Vendendo</span>
                </button>
              </div>
            </div>

            {/* COCKPIT PREZZI TARGET (BUYER vs SELLER) */}
            {actionMode === 'buy' ? (
              /* MODALITÀ COMPRA */
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-surface-2 border border-border text-center">
                    <span className="text-[10px] font-extrabold text-text-tertiary uppercase tracking-wider block">
                      1. Offerta di Partenza
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-text-primary number-mono mt-1 block">
                      {eur(startingOffer)}
                    </span>
                    <span className="text-[11px] text-text-secondary mt-1 block leading-tight">
                      La prima proposta per avviare la trattativa al ribasso
                    </span>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border-2 border-blue-400 dark:border-blue-700 text-center shadow-xs">
                    <span className="inline-block text-[10px] font-black text-blue-700 dark:text-blue-300 uppercase tracking-wider bg-white dark:bg-blue-900/60 px-2 py-0.5 rounded-md mb-1">
                      Prezzo Consigliato
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-blue-700 dark:text-blue-300 number-mono block">
                      {eur(targetClosePrice)}
                    </span>
                    <span className="text-[11px] text-blue-800/80 dark:text-blue-300/80 mt-1 block leading-tight font-medium">
                      Valore equo di mercato per chiudere l&apos;affare in {regConfig.name}
                    </span>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-2xl bg-surface-2 border border-border text-center">
                    <span className="text-[10px] font-extrabold text-text-tertiary uppercase tracking-wider block">
                      3. Limite Massimo
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-text-secondary number-mono mt-1 block">
                      {eur(maxCeilingPrice)}
                    </span>
                    <span className="text-[11px] text-text-secondary mt-1 block leading-tight">
                      Oltre questa cifra l&apos;auto è cara: meglio lasciar perdere
                    </span>
                  </div>
                </div>

                {/* 4 Leve Negoziali per Chi Compra */}
                <div className="pt-2 border-t border-border">
                  <span className="text-xs font-extrabold text-text-primary block mb-2.5">
                    Le 4 leve concrete per negoziare e pretendere uno sconto:
                  </span>
                  <div className="grid sm:grid-cols-2 gap-2.5 text-xs">
                    <div className="p-3 rounded-xl bg-surface-2 border border-border flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-text-primary block font-bold">Cinghia o Catena di Distribuzione:</strong>
                        <span className="text-text-secondary">Se l&apos;auto ha oltre 5 anni o 90.000 km senza ricevuta del cambio, chiedi uno sconto di <strong>€ 400 - € 600</strong>.</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-surface-2 border border-border flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-text-primary block font-bold">Stato Pneumatici e Data DOT:</strong>
                        <span className="text-text-secondary">Gomme con DOT superiore a 4 anni o battistrada sotto 3 mm: scala <strong>€ 300 - € 450</strong> per il cambio treno.</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-surface-2 border border-border flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-text-primary block font-bold">Tagliando Ordinario e Filtri:</strong>
                        <span className="text-text-secondary">Se l&apos;ultimo tagliando risale a oltre 12 mesi fa, scala <strong>€ 180 - € 250</strong> per la manutenzione obbligatoria immediata.</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-surface-2 border border-border flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-text-primary block font-bold">Spese Passaggio al PRA:</strong>
                        <span className="text-text-secondary">Proponi al venditore di dividere al 50% il costo della voltura al PRA (risparmio netto per te di <strong>€ 180 - € 280</strong>).</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* MODALITÀ VENDI */
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-surface-2 border border-border text-center">
                    <span className="text-[10px] font-extrabold text-text-tertiary uppercase tracking-wider block">
                      1. Prezzo Annuncio in Vetrina
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-text-primary number-mono mt-1 block">
                      {eur(sellerListingPrice)}
                    </span>
                    <span className="text-[11px] text-text-secondary mt-1 block leading-tight">
                      Pubblica a questa cifra per avere margine di trattativa (-{eur(negotiationBuffer)})
                    </span>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border-2 border-emerald-400 dark:border-emerald-700 text-center shadow-xs">
                    <span className="inline-block text-[10px] font-black text-emerald-700 dark:text-emerald-300 uppercase tracking-wider bg-white dark:bg-emerald-900/60 px-2 py-0.5 rounded-md mb-1">
                      Prezzo Target Incasso
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-300 number-mono block">
                      {eur(targetClosePrice)}
                    </span>
                    <span className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80 mt-1 block leading-tight font-medium">
                      L&apos;importo ideale a cui chiudere la vendita entro 15-20 giorni in {regConfig.name}
                    </span>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-2xl bg-surface-2 border border-border text-center">
                    <span className="text-[10px] font-extrabold text-text-tertiary uppercase tracking-wider block">
                      3. Minimo di Riserva (Pavimento)
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400 number-mono mt-1 block">
                      {eur(sellerFloorPrice)}
                    </span>
                    <span className="text-[11px] text-text-secondary mt-1 block leading-tight">
                      Sotto questa cifra non scendere: sarebbe una svendita ingiustificata
                    </span>
                  </div>
                </div>

                {/* 4 Punti di Forza per Chi Vende per Difendere il Prezzo */}
                <div className="pt-2 border-t border-border">
                  <span className="text-xs font-extrabold text-text-primary block mb-2.5">
                    I 4 argomenti chiave per difendere il prezzo e non farti svalutare l&apos;auto:
                  </span>
                  <div className="grid sm:grid-cols-2 gap-2.5 text-xs">
                    <div className="p-3 rounded-xl bg-surface-2 border border-border flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-text-primary block font-bold">Storico Tagliandi e Fatture:</strong>
                        <span className="text-text-secondary">Mostra le ricevute della manutenzione: dimostrare la cura maniacale giustifica il tuo prezzo pieno (+<strong>€ 400 - € 600</strong> di valore percepito).</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-surface-2 border border-border flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-text-primary block font-bold">Revisione e Collaudo Recente:</strong>
                        <span className="text-text-secondary">Se la revisione è fresca, evidenzialo: l&apos;acquirente sa che circolerà per 18-24 mesi a zero spese di revisione ministeriale.</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-surface-2 border border-border flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-text-primary block font-bold">Trasparenza sui Piccoli Segni:</strong>
                        <span className="text-text-secondary">Mostra foto chiare dei dettagli carrozzeria nell&apos;annuncio: togli all&apos;acquirente l&apos;alibi per trattare al ribasso di persona.</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-surface-2 border border-border flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-text-primary block font-bold">Passaggio PRA a Carico Acquirente:</strong>
                        <span className="text-text-secondary">Ribadisci che per legge il passaggio è a carico dell&apos;acquirente: evita di farti scalare <strong>€ 250 - € 450</strong> dalla cifra concordata.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </details>
      </section>

      {/* ─── 2. AUDIT CHILOMETRICO & RISCHIO SCHILOMETRATA (COLLASSABILE) ─── */}
      <section id="modulo-km" className="bg-surface rounded-2xl shadow-card border border-border overflow-hidden">
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 sm:p-5 text-xs sm:text-sm font-bold text-text-primary hover:bg-surface-2/50 transition-colors">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                Audit Chilometrico &amp; Controllo Manomissione ({kmAudit.label})
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-text-tertiary transition-transform group-open:rotate-180 shrink-0" />
          </summary>

          <div className="border-t border-border p-4 sm:p-5 bg-surface">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-surface-2 border border-border mb-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border pb-3 mb-3">
                <div>
                  <span className="text-xs font-black text-text-primary flex items-center gap-1.5">
                    {kmAudit.tone === 'good' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                    {kmAudit.label}
                  </span>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                    {kmAudit.desc}
                  </p>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[10px] font-bold text-text-tertiary uppercase block">Media Annua Calcolata</span>
                  <span className="text-base font-black text-text-primary number-mono">{kmPerYear.toLocaleString('it-IT')} km / anno</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-surface border border-border">
                  <span className="text-[10px] text-text-tertiary font-medium block">Età Veicolo</span>
                  <span className="font-bold text-text-primary">{age} {age === 1 ? 'anno' : 'anni'} ({year})</span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface border border-border">
                  <span className="text-[10px] text-text-tertiary font-medium block">Km Riferiti</span>
                  <span className="font-bold text-text-primary">{km.toLocaleString('it-IT')} km</span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface border border-border">
                  <span className="text-[10px] text-text-tertiary font-medium block">Media Standard ITA</span>
                  <span className="font-bold text-text-primary">~{expectedAverageKmPerYear.toLocaleString('it-IT')} km/anno</span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface border border-border">
                  <span className="text-[10px] text-text-tertiary font-medium block">Verifica Ufficiale Revisioni</span>
                  <a
                    href="https://www.ilportaledellautomobilista.it/interrogazionistoricorevisioni/spa/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    Portale MIT <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </details>
      </section>

      {/* ─── 3. COSTI ANNUALI & MENSILI REALI TCO (COLLASSABILE) ─── */}
      <section id="modulo-tco" className="bg-surface rounded-2xl shadow-card border border-border overflow-hidden">
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 sm:p-5 text-xs sm:text-sm font-bold text-text-primary hover:bg-surface-2/50 transition-colors">
            <div className="flex items-center gap-2">
              <Euro className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Costi di Gestione Reali ({eur(monthlyCost)} / mese in {regConfig.name})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold text-emerald-600 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
                {costPerKm} € / km
              </span>
              <ChevronDown className="h-4 w-4 text-text-tertiary transition-transform group-open:rotate-180 shrink-0" />
            </div>
          </summary>

          <div className="border-t border-border p-4 sm:p-5 bg-surface space-y-3">
            <p className="text-xs text-text-secondary">
              Stima del Costo Totale di Possesso (TCO) parametrata su una percorrenza di 10.000 km/anno e sulle tariffe fiscali ed energetiche della regione {regConfig.name}:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3.5 rounded-xl bg-surface-2 border border-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-text-primary">Carburante</span>
                  <Fuel className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <span className="text-sm sm:text-base font-black text-text-primary number-mono block">
                  {eur(Math.round(annualFuelCost / 12))} / mese
                </span>
                <span className="text-[10px] text-text-secondary block mt-0.5">{eur(annualFuelCost)} / anno (10.000 km)</span>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-2 border border-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-text-primary">Bollo Auto ({regConfig.name})</span>
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <span className="text-sm sm:text-base font-black text-text-primary number-mono block">
                  {annualBollo === 0 ? '0 €' : `${eur(Math.round(annualBollo / 12))} / mese`}
                </span>
                <span className="text-[10px] text-text-secondary block mt-0.5">
                  {annualBollo === 0 ? 'Esente per legge' : `${eur(annualBollo)} / anno`}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-2 border border-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-text-primary">Tagliandi &amp; Usura</span>
                  <Wrench className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <span className="text-sm sm:text-base font-black text-text-primary number-mono block">
                  {eur(Math.round((annualService + annualTiresWear) / 12))} / mese
                </span>
                <span className="text-[10px] text-text-secondary block mt-0.5">{eur(annualService + annualTiresWear)} / anno stimati</span>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-2 border border-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-text-primary">Assicurazione RC</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                <span className="text-sm sm:text-base font-black text-text-primary number-mono block">
                  {eur(Math.round(annualInsurance / 12))} / mese
                </span>
                <span className="text-[10px] text-text-secondary block mt-0.5">~{eur(annualInsurance)} / anno (stima media)</span>
              </div>
            </div>
          </div>
        </details>
      </section>

      {/* ─── 4. CIRCOLAZIONE ZTL & NORMATIVA AMBIENTALE (COLLASSABILE) ─── */}
      <section id="modulo-ztl" className="bg-surface rounded-2xl shadow-card border border-border overflow-hidden">
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 sm:p-5 text-xs sm:text-sm font-bold text-text-primary hover:bg-surface-2/50 transition-colors">
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                Normativa Ambientale ({euroClass}) &amp; Zone ZTL
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {ztlAudit.status}
              </span>
              <ChevronDown className="h-4 w-4 text-text-tertiary transition-transform group-open:rotate-180 shrink-0" />
            </div>
          </summary>

          <div className="border-t border-border p-4 sm:p-5 bg-surface space-y-3">
            <div className={`p-4 rounded-2xl border ${ztlAudit.color} space-y-2`}>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-current" />
                <strong className="text-sm font-black">{ztlAudit.status}</strong>
              </div>
              <p className="text-xs leading-relaxed">
                {ztlAudit.detail}
              </p>
              <div className="pt-2 border-t border-current/20 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-bold">
                <span>• Milano Area B: {isElectric || !isDiesel ? 'Nessun blocco fino al 2030+' : 'Verificare data immatricolazione'}</span>
                <span>• Roma Fascia Verde: {euroClass.includes('6') || isHybrid || isElectric ? 'Circolazione libera' : 'Possibili stop feriali'}</span>
                <span>• Servizio MoVe-In: Attivo nei comuni del bacino padano</span>
              </div>
            </div>
          </div>
        </details>
      </section>

      {/* ─── 5. CHECKLIST INTERATTIVA (COLLASSABILE & RUOLO DINAMICO) ─── */}
      <section id="modulo-checklist" className="bg-surface rounded-2xl shadow-card border border-border overflow-hidden">
        <details className="group" open>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 sm:p-5 text-xs sm:text-sm font-bold text-text-primary hover:bg-surface-2/50 transition-colors">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Checklist Interattiva ({actionMode === 'buy' ? '6 Controlli Pre-Acquisto' : '6 Passi Pre-Vendita'})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-text-secondary bg-surface-2 px-2.5 py-0.5 rounded-full border border-border">
                {completedCount} di {activeChecklist.length} verificati
              </span>
              <ChevronDown className="h-4 w-4 text-text-tertiary transition-transform group-open:rotate-180 shrink-0" />
            </div>
          </summary>

          <div className="border-t border-border p-4 sm:p-5 bg-surface space-y-3">
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span>
                {actionMode === 'buy'
                  ? 'Usa questa checklist dal vivo durante la visita dell\'auto prima di firmare o versare acconti:'
                  : 'Completa questi 6 passaggi prima di pubblicare l\'annuncio per massimizzare il prezzo di vendita:'}
              </span>
            </div>

            {/* Dynamic Progress Bar */}
            <div className="w-full bg-surface-2 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  actionMode === 'buy' ? 'bg-blue-600' : 'bg-emerald-600'
                }`}
                style={{ width: `${(completedCount / activeChecklist.length) * 100}%` }}
              />
            </div>

            <div className="space-y-2.5 pt-1">
              {activeChecklist.map((item, idx) => {
                const isChecked = Boolean(activeCheckedMap[idx]);
                return (
                  <label
                    key={`${actionMode}-${idx}`}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                      isChecked
                        ? actionMode === 'buy'
                          ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800 text-text-primary'
                          : 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-text-primary'
                        : 'bg-surface-2 hover:bg-surface border-border text-text-secondary'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleCheck(idx)}
                      className={`mt-1 h-4 w-4 rounded border-border cursor-pointer shrink-0 ${
                        actionMode === 'buy' ? 'text-blue-600 focus:ring-blue-500' : 'text-emerald-600 focus:ring-emerald-500'
                      }`}
                    />
                    <div className="min-w-0 flex-1 text-xs">
                      <div className="font-bold flex items-center gap-2">
                        <span className={`text-[11px] font-black ${
                          isChecked
                            ? actionMode === 'buy' ? 'text-blue-600' : 'text-emerald-600'
                            : 'text-text-tertiary'
                        }`}>
                          Passo {idx + 1}:
                        </span>
                        <span className={isChecked ? 'line-through text-text-tertiary' : 'text-text-primary font-extrabold'}>
                          {item.title}
                        </span>
                      </div>
                      <p className="text-text-secondary mt-0.5 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </details>
      </section>
    </div>
  );
}
