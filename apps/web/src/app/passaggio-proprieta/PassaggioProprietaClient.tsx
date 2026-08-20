'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calculator,
  ChevronDown,
  FileText,
  HelpCircle,
  Info,
  ShieldCheck,
  Building2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Car,
} from 'lucide-react';

interface ProvinceData {
  code: string;
  name: string;
  surcharge: number; // percentage, e.g. 30 = +30%
}

const PROVINCES: ProvinceData[] = [
  { code: 'AG', name: 'Agrigento', surcharge: 30 },
  { code: 'AL', name: 'Alessandria', surcharge: 30 },
  { code: 'AN', name: 'Ancona', surcharge: 30 },
  { code: 'AO', name: 'Aosta (VDA)', surcharge: 0 },
  { code: 'AR', name: 'Arezzo', surcharge: 30 },
  { code: 'AP', name: 'Ascoli Piceno', surcharge: 30 },
  { code: 'AT', name: 'Asti', surcharge: 30 },
  { code: 'AV', name: 'Avellino', surcharge: 30 },
  { code: 'BA', name: 'Bari', surcharge: 30 },
  { code: 'BT', name: 'Barletta-Andria-Trani', surcharge: 30 },
  { code: 'BL', name: 'Belluno', surcharge: 30 },
  { code: 'BN', name: 'Benevento', surcharge: 30 },
  { code: 'BG', name: 'Bergamo', surcharge: 30 },
  { code: 'BI', name: 'Biella', surcharge: 30 },
  { code: 'BO', name: 'Bologna', surcharge: 30 },
  { code: 'BZ', name: 'Bolzano (Alto Adige)', surcharge: 0 },
  { code: 'BS', name: 'Brescia', surcharge: 30 },
  { code: 'BR', name: 'Brindisi', surcharge: 30 },
  { code: 'CA', name: 'Cagliari', surcharge: 30 },
  { code: 'CL', name: 'Caltanissetta', surcharge: 30 },
  { code: 'CB', name: 'Campobasso', surcharge: 30 },
  { code: 'CE', name: 'Caserta', surcharge: 30 },
  { code: 'CT', name: 'Catania', surcharge: 30 },
  { code: 'CZ', name: 'Catanzaro', surcharge: 30 },
  { code: 'CH', name: 'Chieti', surcharge: 30 },
  { code: 'CO', name: 'Como', surcharge: 30 },
  { code: 'CS', name: 'Cosenza', surcharge: 30 },
  { code: 'CR', name: 'Cremona', surcharge: 30 },
  { code: 'KR', name: 'Crotone', surcharge: 30 },
  { code: 'CN', name: 'Cuneo', surcharge: 30 },
  { code: 'EN', name: 'Enna', surcharge: 30 },
  { code: 'FM', name: 'Fermo', surcharge: 30 },
  { code: 'FE', name: 'Ferrara', surcharge: 30 },
  { code: 'FI', name: 'Firenze', surcharge: 30 },
  { code: 'FG', name: 'Foggia', surcharge: 30 },
  { code: 'FC', name: 'Forlì-Cesena', surcharge: 30 },
  { code: 'FR', name: 'Frosinone', surcharge: 30 },
  { code: 'GE', name: 'Genova', surcharge: 30 },
  { code: 'GO', name: 'Gorizia', surcharge: 30 },
  { code: 'GR', name: 'Grosseto', surcharge: 30 },
  { code: 'IM', name: 'Imperia', surcharge: 30 },
  { code: 'IS', name: 'Isernia', surcharge: 30 },
  { code: 'AQ', name: "L'Aquila", surcharge: 30 },
  { code: 'SP', name: 'La Spezia', surcharge: 30 },
  { code: 'LT', name: 'Latina', surcharge: 30 },
  { code: 'LE', name: 'Lecce', surcharge: 30 },
  { code: 'LC', name: 'Lecco', surcharge: 30 },
  { code: 'LI', name: 'Livorno', surcharge: 30 },
  { code: 'LO', name: 'Lodi', surcharge: 30 },
  { code: 'LU', name: 'Lucca', surcharge: 30 },
  { code: 'MC', name: 'Macerata', surcharge: 30 },
  { code: 'MN', name: 'Mantova', surcharge: 30 },
  { code: 'MS', name: 'Massa-Carrara', surcharge: 30 },
  { code: 'MT', name: 'Matera', surcharge: 30 },
  { code: 'ME', name: 'Messina', surcharge: 30 },
  { code: 'MI', name: 'Milano', surcharge: 30 },
  { code: 'MO', name: 'Modena', surcharge: 30 },
  { code: 'MB', name: 'Monza e Brianza', surcharge: 30 },
  { code: 'NA', name: 'Napoli', surcharge: 30 },
  { code: 'NO', name: 'Novara', surcharge: 30 },
  { code: 'NU', name: 'Nuoro', surcharge: 30 },
  { code: 'OR', name: 'Oristano', surcharge: 30 },
  { code: 'PD', name: 'Padova', surcharge: 30 },
  { code: 'PA', name: 'Palermo', surcharge: 30 },
  { code: 'PR', name: 'Parma', surcharge: 30 },
  { code: 'PV', name: 'Pavia', surcharge: 30 },
  { code: 'PG', name: 'Perugia', surcharge: 30 },
  { code: 'PU', name: 'Pesaro e Urbino', surcharge: 30 },
  { code: 'PE', name: 'Pescara', surcharge: 30 },
  { code: 'PC', name: 'Piacenza', surcharge: 30 },
  { code: 'PI', name: 'Pisa', surcharge: 30 },
  { code: 'PT', name: 'Pistoia', surcharge: 30 },
  { code: 'PN', name: 'Pordenone', surcharge: 30 },
  { code: 'PZ', name: 'Potenza', surcharge: 30 },
  { code: 'PO', name: 'Prato', surcharge: 30 },
  { code: 'RG', name: 'Ragusa', surcharge: 30 },
  { code: 'RA', name: 'Ravenna', surcharge: 30 },
  { code: 'RC', name: 'Reggio Calabria', surcharge: 30 },
  { code: 'RE', name: 'Reggio Emilia', surcharge: 30 },
  { code: 'RI', name: 'Rieti', surcharge: 30 },
  { code: 'RN', name: 'Rimini', surcharge: 30 },
  { code: 'RM', name: 'Roma', surcharge: 30 },
  { code: 'RO', name: 'Rovigo', surcharge: 30 },
  { code: 'SA', name: 'Salerno', surcharge: 30 },
  { code: 'SS', name: 'Sassari', surcharge: 30 },
  { code: 'SV', name: 'Savona', surcharge: 30 },
  { code: 'SI', name: 'Siena', surcharge: 30 },
  { code: 'SR', name: 'Siracusa', surcharge: 30 },
  { code: 'SO', name: 'Sondrio', surcharge: 20 },
  { code: 'SU', name: 'Sud Sardegna', surcharge: 30 },
  { code: 'TA', name: 'Taranto', surcharge: 30 },
  { code: 'TE', name: 'Teramo', surcharge: 30 },
  { code: 'TR', name: 'Terni', surcharge: 30 },
  { code: 'TO', name: 'Torino', surcharge: 30 },
  { code: 'TP', name: 'Trapani', surcharge: 30 },
  { code: 'TN', name: 'Trento', surcharge: 0 },
  { code: 'TV', name: 'Treviso', surcharge: 30 },
  { code: 'TS', name: 'Trieste', surcharge: 30 },
  { code: 'UD', name: 'Udine', surcharge: 30 },
  { code: 'VA', name: 'Varese', surcharge: 30 },
  { code: 'VE', name: 'Venezia', surcharge: 30 },
  { code: 'VB', name: 'Verbano-Cusio-Ossola', surcharge: 30 },
  { code: 'VC', name: 'Vercelli', surcharge: 30 },
  { code: 'VR', name: 'Verona', surcharge: 30 },
  { code: 'VV', name: 'Vibo Valentia', surcharge: 30 },
  { code: 'VI', name: 'Vicenza', surcharge: 30 },
  { code: 'VT', name: 'Viterbo', surcharge: 30 },
];

const FAQS = [
  {
    q: 'Chi deve sostenere le spese del passaggio di proprietà?',
    a: 'Per legge e consuetudine in Italia, le spese del passaggio di proprietà sono a carico dell\'acquirente dell\'auto usata, a meno che venditore e compratore non abbiano pattuito diversamente.',
  },
  {
    q: 'Quanto si risparmia facendo il passaggio da soli al PRA/Motorizzazione?',
    a: 'Facendo la pratica autonomamente presso uno Sportello Telematico dell\'Automobilista (STA) pubblico al PRA o alla Motorizzazione Civile si risparmiano i costi di agenzia (tra 80€ e 150€), pagando solo le imposte e i diritti statali obbligatori.',
  },
  {
    q: 'Entro quanti giorni va registrato il passaggio?',
    a: 'Dalla data di autentica della firma sull\'atto di vendita si hanno a disposizione 60 giorni di tempo per registrare il passaggio di proprietà al PRA e aggiornare la carta di circolazione (Documento Unico).',
  },
  {
    q: 'Quanto costa il passaggio per un\'auto storica o ultratrentennale?',
    a: 'I veicoli con più di 30 anni (o di particolare interesse storico iscritti nei registri ASI/Storici con apposito certificato) beneficiano di una tariffa IPT fissa agevolata di 51,64 € (totale pratica fai-da-te circa 150 €).',
  },
  {
    q: 'Quali sono i documenti obbligatori per l\'acquirente e il venditore?',
    a: 'Occorrono: 1) Carta d\'identità o patente valida e Codice Fiscale di entrambe le parti; 2) Documento Unico di Circolazione (o libretto e Certificato di Proprietà cartaceo/digitale); 3) Istanza unificata modello TT2119 compilata e firmata.',
  },
];

export default function PassaggioProprietaClient() {
  const [selectedProvinceCode, setSelectedProvinceCode] = useState('RM');
  const [powerUnit, setPowerUnit] = useState<'kw' | 'cv'>('kw');
  const [powerInput, setPowerInput] = useState<number>(70);
  const [isHistorical, setIsHistorical] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const selectedProvince = useMemo(() => {
    return PROVINCES.find((p) => p.code === selectedProvinceCode) || PROVINCES[0];
  }, [selectedProvinceCode]);

  const kw = useMemo(() => {
    if (powerUnit === 'cv') {
      return Math.round(powerInput * 0.735499);
    }
    return powerInput;
  }, [powerInput, powerUnit]);

  // Calculation Logic
  const calc = useMemo(() => {
    const fixedAci = 27.0; // Emolumenti PRA
    const fixedBollo = 32.0; // Imposta di bollo rilascio DU (o 48/64)
    const fixedDtt = 10.2; // Diritti Motorizzazione
    const fixedCosts = fixedAci + fixedBollo + fixedDtt; // 69.20€

    let ipt = 0;
    const baseIpt = 150.81;
    const multiplier = 1 + selectedProvince.surcharge / 100;

    if (isHistorical) {
      ipt = 51.64;
    } else if (kw <= 53) {
      ipt = Math.round(baseIpt * multiplier * 100) / 100;
    } else {
      // Over 53 kW: 3.5119 €/kW * multiplier * kw
      const ratePerKw = 3.5119 * multiplier;
      ipt = Math.round(kw * ratePerKw * 100) / 100;
    }

    const totalPra = Math.round((fixedCosts + ipt) * 100) / 100;
    const agencyMin = Math.round((totalPra + 80) * 100) / 100;
    const agencyMax = Math.round((totalPra + 140) * 100) / 100;

    return {
      kw,
      ipt,
      fixedAci,
      fixedBollo,
      fixedDtt,
      fixedCosts,
      totalPra,
      agencyMin,
      agencyMax,
    };
  }, [kw, selectedProvince, isHistorical]);

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-20">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-text-tertiary mb-6">
        <ol className="inline-flex items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-accent transition-colors">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <span className="text-text-secondary font-medium">Calcolo Passaggio di Proprietà</span>
          </li>
        </ol>
      </nav>

      {/* Hero Header */}
      <header className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200/80 px-3.5 py-1.5 text-xs font-bold text-emerald-700 mb-4 shadow-sm">
          <Calculator className="h-3.5 w-3.5" />
          Aggiornato con aliquote IPT 2026
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
          Calcolo Costo Passaggio di Proprietà Auto
        </h1>
        <p className="mt-3.5 text-base sm:text-lg text-slate-600 leading-relaxed">
          Calcola all&apos;istante la spesa esatta in base ai <strong>kW della vettura</strong> e alla{' '}
          <strong>provincia di residenza</strong> dell&apos;acquirente. Scopri quanto costa al PRA e in agenzia.
        </p>
      </header>

      {/* Interactive Calculator Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl shadow-slate-900/5">
          <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-600 text-white text-sm font-bold">
              1
            </span>
            Inserisci i dati del veicolo
          </h2>

          <div className="space-y-6">
            {/* Province Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Provincia di residenza dell&apos;acquirente
              </label>
              <div className="relative">
                <select
                  value={selectedProvinceCode}
                  onChange={(e) => setSelectedProvinceCode(e.target.value)}
                  className="w-full appearance-none rounded-2xl border border-slate-300 bg-slate-50/50 px-4 py-3.5 text-sm font-semibold text-slate-900 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all cursor-pointer"
                >
                  {PROVINCES.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.name} ({p.code}) — Maggiorazione IPT: +{p.surcharge}%
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
              <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
                <Info className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                L&apos;IPT viene riscossa dalla provincia dell&apos;acquirente (maggiorazione {selectedProvince.surcharge}%).
              </p>
            </div>

            {/* Power Input with Unit Toggle */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Potenza del motore
                </label>
                <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setPowerUnit('kw')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      powerUnit === 'kw' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    kW
                  </button>
                  <button
                    type="button"
                    onClick={() => setPowerUnit('cv')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      powerUnit === 'cv' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    CV (Cavalli)
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="20"
                  max="800"
                  value={powerInput}
                  onChange={(e) => setPowerInput(Math.max(1, Number(e.target.value) || 0))}
                  className="w-32 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-lg font-black text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                />
                <input
                  type="range"
                  min="30"
                  max="350"
                  value={powerInput}
                  onChange={(e) => setPowerInput(Number(e.target.value))}
                  className="flex-1 accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500 mt-2">
                <span>Valore convertito: <strong>{calc.kw} kW</strong> ({Math.round(calc.kw * 1.35962)} CV)</span>
                <span>Fino a 53 kW quota fissa</span>
              </div>
            </div>

            {/* Historical Car Toggle */}
            <div className="pt-3 border-t border-slate-100">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isHistorical}
                  onChange={(e) => setIsHistorical(e.target.checked)}
                  className="h-5 w-5 rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                />
                <div>
                  <span className="text-sm font-bold text-slate-800">Auto storica / Trentennale (&gt; 30 anni)</span>
                  <p className="text-xs text-slate-500">Gode di IPT fissa agevolata a 51,64 €</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Result Cards */}
        <div className="lg:col-span-6 space-y-5">
          {/* Main Verdict Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <span className="text-xs font-bold tracking-wider uppercase text-emerald-400 mb-1 block">
              Stima del Costo Totale
            </span>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl sm:text-5xl font-black text-white">
                {calc.totalPra.toLocaleString('it-IT', { minimumFractionDigits: 2 })} €
              </span>
              <span className="text-xs font-semibold text-slate-400">fai-da-te al PRA</span>
            </div>

            {/* Comparison Options */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-1">
                  <Building2 className="h-3.5 w-3.5 text-emerald-400" />
                  Al PRA / STA Pubblico
                </div>
                <div className="text-xl font-bold text-emerald-400">
                  {calc.totalPra.toFixed(0)} €
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Solo costi di legge</div>
              </div>

              <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-1">
                  <Building2 className="h-3.5 w-3.5 text-amber-400" />
                  In Agenzia Pratiche
                </div>
                <div className="text-xl font-bold text-amber-300">
                  {calc.agencyMin.toFixed(0)} - {calc.agencyMax.toFixed(0)} €
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Include diritti d&apos;agenzia</div>
              </div>
            </div>

            {/* Detailed Cost Breakdown */}
            <div className="border-t border-slate-800 pt-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Imposta Provinciale Trascrizione (IPT {selectedProvince.name}):</span>
                <span className="font-bold text-white">{calc.ipt.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Emolumenti PRA / ACI:</span>
                <span className="font-bold text-white">{calc.fixedAci.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Imposta di Bollo (Documento Unico):</span>
                <span className="font-bold text-white">{calc.fixedBollo.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Diritti DTT (Motorizzazione):</span>
                <span className="font-bold text-white">{calc.fixedDtt.toFixed(2)} €</span>
              </div>
            </div>
          </div>

          {/* Quick CTA to Value Car */}
          <div className="bg-emerald-50 rounded-3xl p-5 border border-emerald-200/80 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-emerald-950">Stai per acquistare o vendere quest&apos;auto?</h3>
              <p className="text-xs text-emerald-700 mt-0.5">
                Verifica se il prezzo richiesto è in linea con il mercato reale italiano.
              </p>
            </div>
            <Link
              href="/#scanner-section"
              className="inline-flex items-center gap-1.5 shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              Analizza gratis <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Guide Section: Documents & Steps */}
      <section className="mb-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Documenti necessari per il passaggio di proprietà
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            La lista completa di cosa portare per concludere la vendita senza sorprese.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700 font-bold mb-4">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">1. Documenti del Veicolo</h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Documento Unico (DU)</strong> o Carta di Circolazione (libretto)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Certificato di Proprietà (CdP)</strong> cartaceo o ricevuta CdP Digitale</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700 font-bold mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">2. Documenti Personali</h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Carta d&apos;identità</strong> o patente in corso di validità di compratore e venditore</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Codice Fiscale</strong> o Tessera Sanitaria di entrambe le parti</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700 font-bold mb-4">
              <Building2 className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">3. Moduli e Autentica</h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Atto di Vendita</strong> con firma del venditore autenticata (in Comune o allo STA)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Modello TT2119</strong> compilato per la Motorizzazione Civile</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-16 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 mb-2">
            <HelpCircle className="h-3.5 w-3.5" /> Domande Frequenti
          </div>
          <h2 className="text-2xl font-black text-slate-900">Tutto sul Passaggio di Proprietà Auto</h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div
              key={faq.q}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left font-bold text-sm text-slate-900 hover:text-emerald-700"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform ${
                    openFaq === idx ? 'rotate-180 text-emerald-600' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Internal Linking Hub */}
      <section className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 sm:p-10 text-white text-center">
        <span className="grid h-12 w-12 mx-auto place-items-center rounded-2xl bg-emerald-500/20 text-emerald-400 mb-4">
          <Sparkles className="h-6 w-6" />
        </span>
        <h2 className="text-2xl sm:text-3xl font-black mb-3">
          Verifica l&apos;auto prima del passaggio
        </h2>
        <p className="text-sm text-slate-300 max-w-xl mx-auto mb-6">
          Scopri se ci sono fermi amministrativi, quanti chilometri ha percorso e qual è il valore equo di mercato con lo strumento gratuito di AutoEsperto.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/verifica-targa"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-lg shadow-emerald-900/30"
          >
            Verifica Targa Auto
          </Link>
          <Link
            href="/calcolo-bollo"
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-5 py-3 rounded-xl transition-all border border-slate-700"
          >
            Calcola Bollo Auto
          </Link>
          <Link
            href="/valutazione"
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-5 py-3 rounded-xl transition-all border border-slate-700"
          >
            Catalogo Valutazioni
          </Link>
        </div>
      </section>
    </main>
  );
}
