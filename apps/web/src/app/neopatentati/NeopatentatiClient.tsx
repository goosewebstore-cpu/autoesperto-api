'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Car,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Fuel,
  ShieldCheck,
  Zap,
  Filter,
} from 'lucide-react';

interface NeopatentatiCar {
  make: string;
  makeSlug: string;
  model: string;
  modelSlug: string;
  version: string;
  kw: number;
  cv: number;
  weightKg: number;
  fuel: 'Benzina' | 'Ibrida' | 'GPL' | 'Diesel';
  priceRange: string;
  consumptionKmPerL: number;
  category: 'super-economica' | 'affidabile' | 'bassi-consumi' | 'spaziosa';
  highlight: string;
}

const CARS: NeopatentatiCar[] = [
  {
    make: 'Fiat',
    makeSlug: 'fiat',
    model: 'Panda',
    modelSlug: 'panda',
    version: '1.2 Fire 69 CV / 1.0 Hybrid',
    kw: 51,
    cv: 69,
    weightKg: 980,
    fuel: 'Benzina',
    priceRange: '4.500 € - 9.500 €',
    consumptionKmPerL: 18.5,
    category: 'super-economica',
    highlight: 'Ricambi economici, indistruttibile e facile da parcheggiare.',
  },
  {
    make: 'Fiat',
    makeSlug: 'fiat',
    model: '500',
    modelSlug: '500',
    version: '1.2 Lounge 69 CV',
    kw: 51,
    cv: 69,
    weightKg: 940,
    fuel: 'Benzina',
    priceRange: '5.500 € - 11.000 €',
    consumptionKmPerL: 17.8,
    category: 'super-economica',
    highlight: 'Mantiene altissimo il valore di rivendita nel tempo.',
  },
  {
    make: 'Lancia',
    makeSlug: 'lancia',
    model: 'Ypsilon',
    modelSlug: 'ypsilon',
    version: '1.2 Elefantino / Gold 69 CV',
    kw: 51,
    cv: 69,
    weightKg: 965,
    fuel: 'Benzina',
    priceRange: '4.800 € - 10.000 €',
    consumptionKmPerL: 18.2,
    category: 'super-economica',
    highlight: 'Ottimo comfort cittadino e motore 1.2 Fire a bassa manutenzione.',
  },
  {
    make: 'Renault',
    makeSlug: 'renault',
    model: 'Clio',
    modelSlug: 'clio',
    version: '0.9 TCe / 1.0 SCe 65-75 CV',
    kw: 54,
    cv: 73,
    weightKg: 1060,
    fuel: 'Benzina',
    priceRange: '5.800 € - 11.500 €',
    consumptionKmPerL: 19.0,
    category: 'affidabile',
    highlight: 'Design moderno, interni curati e ottimo isolamento acustico.',
  },
  {
    make: 'Volkswagen',
    makeSlug: 'volkswagen',
    model: 'Polo',
    modelSlug: 'polo',
    version: '1.0 MPI Trendline / Comfortline',
    kw: 55,
    cv: 75,
    weightKg: 1105,
    fuel: 'Benzina',
    priceRange: '6.500 € - 13.000 €',
    consumptionKmPerL: 18.8,
    category: 'affidabile',
    highlight: 'Qualità costruttiva da segmento superiore e sicurezza al vertice.',
  },
  {
    make: 'Toyota',
    makeSlug: 'toyota',
    model: 'Yaris',
    modelSlug: 'yaris',
    version: '1.0 VVT-i / 1.5 Hybrid 75 CV',
    kw: 54,
    cv: 73,
    weightKg: 1040,
    fuel: 'Ibrida',
    priceRange: '6.000 € - 12.500 €',
    consumptionKmPerL: 23.5,
    category: 'bassi-consumi',
    highlight: 'Campione assoluta di affidabilità e consumi ridotti in città.',
  },
  {
    make: 'Ford',
    makeSlug: 'ford',
    model: 'Fiesta',
    modelSlug: 'fiesta',
    version: '1.1 Ti-VCT 70 CV / 1.5 TDCi 75 CV',
    kw: 52,
    cv: 71,
    weightKg: 1090,
    fuel: 'Benzina',
    priceRange: '5.200 € - 10.800 €',
    consumptionKmPerL: 18.6,
    category: 'affidabile',
    highlight: 'Dinamica di guida eccellente, sicura e divertente.',
  },
  {
    make: 'Dacia',
    makeSlug: 'dacia',
    model: 'Sandero',
    modelSlug: 'sandero',
    version: '1.0 SCe / ECO-G GPL',
    kw: 49,
    cv: 67,
    weightKg: 1010,
    fuel: 'GPL',
    priceRange: '5.000 € - 9.800 €',
    consumptionKmPerL: 16.5,
    category: 'spaziosa',
    highlight: 'Spazio da berlina compatta e costi di gestione minimi a GPL.',
  },
  {
    make: 'Citroën',
    makeSlug: 'citroen',
    model: 'C3',
    modelSlug: 'c3',
    version: '1.2 PureTech 68-83 CV / 1.4 HDi',
    kw: 50,
    cv: 68,
    weightKg: 1050,
    fuel: 'Benzina',
    priceRange: '5.000 € - 10.500 €',
    consumptionKmPerL: 19.2,
    category: 'super-economica',
    highlight: 'Assetto morbidissimo e sedili tra i più comodi della categoria.',
  },
  {
    make: 'Peugeot',
    makeSlug: 'peugeot',
    model: '208',
    modelSlug: '208',
    version: '1.2 PureTech 68-75 CV / 1.4 HDi',
    kw: 55,
    cv: 75,
    weightKg: 1060,
    fuel: 'Benzina',
    priceRange: '5.500 € - 11.500 €',
    consumptionKmPerL: 19.0,
    category: 'affidabile',
    highlight: 'Cruscotto i-Cockpit futuristico e guida agile nei percorsi urbani.',
  },
  {
    make: 'Hyundai',
    makeSlug: 'hyundai',
    model: 'i10',
    modelSlug: 'i10',
    version: '1.0 MPI Econext GPL / Benzina',
    kw: 49,
    cv: 67,
    weightKg: 925,
    fuel: 'Benzina',
    priceRange: '4.800 € - 10.000 €',
    consumptionKmPerL: 19.5,
    category: 'super-economica',
    highlight: 'Raggio di sterzata ridottissimo e grande affidabilità meccanica.',
  },
  {
    make: 'Kia',
    makeSlug: 'kia',
    model: 'Rio',
    modelSlug: 'rio',
    version: '1.2 MPI / 1.1 CRDi 75 CV',
    kw: 55,
    cv: 75,
    weightKg: 1110,
    fuel: 'Benzina',
    priceRange: '5.500 € - 11.000 €',
    consumptionKmPerL: 18.4,
    category: 'spaziosa',
    highlight: 'Garanzia e solidità costruttiva, ottima abitabilità a bordo.',
  },
];

const FAQS = [
  {
    q: 'Qual è il limite di potenza e rapporto peso/potenza per i neopatentati nel 2026?',
    a: 'Con il Nuovo Codice della Strada 2026, il limite per i neopatentati è fissato a un rapporto potenza/tara massimo di 75 kW/t (in precedenza 55 kW/t) e a una potenza massima assoluta del veicolo non superiore a 105 kW (circa 142 CV, in precedenza 70 kW). La limitazione è valida per i primi 3 anni dal conseguimento della patente B.',
  },
  {
    q: 'Dove trovo il rapporto potenza/tara sulla carta di circolazione?',
    a: 'Sul Documento Unico di Circolazione (o vecchio libretto), trovi il rapporto specifico nel riquadro 2, alla voce (P.2)/(T) espressa in kW/t. La potenza massima del motore in kW si trova invece al punto (P.2).',
  },
  {
    q: 'Posso guidare un\'auto elettrica o ibrida da neopatentato?',
    a: 'Sì, a condizione che rispetti il limite di 75 kW/t (calcolato sulla potenza omologata a libretto, non sul picco massimo istantaneo) e non superi i 105 kW totali. Molte ibride come Toyota Yaris Hybrid o Renault Clio E-Tech hanno potenze omologate a libretto compatibili con i limiti.',
  },
  {
    q: 'Quali sanzioni sono previste per chi guida un\'auto troppo potente?',
    a: 'La violazione dell\'art. 117 del Codice della Strada comporta una multa da 165 € a 660 € e la sospensione della patente di guida da 2 a 8 mesi.',
  },
  {
    q: 'Cosa controllare prima di comprare un\'auto usata per neopatentati?',
    a: 'Oltre all\'idoneità a libretto, controlla lo storico delle revisioni per verificare i km reali, lo stato della frizione e dell\'impianto frenante, e la presenza di incidenti pregressi o fermi amministrativi tramite lo strumento gratuito di AutoEsperto.',
  },
];

export default function NeopatentatiClient() {
  // Simulator inputs
  const [customKw, setCustomKw] = useState<number>(55);
  const [customWeight, setCustomWeight] = useState<number>(1050);
  const [fuelFilter, setFuelFilter] = useState<string>('Tutti');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Checker calculation
  const customRatio = useMemo(() => {
    if (!customWeight || customWeight <= 0) return 0;
    const tons = customWeight / 1000;
    return Math.round((customKw / tons) * 10) / 10;
  }, [customKw, customWeight]);

  const isDrivable = useMemo(() => {
    // 2026 limits: ratio <= 75 kW/t and power <= 105 kW
    return customRatio <= 75.0 && customKw <= 105;
  }, [customRatio, customKw]);

  // Filtered cars
  const filteredCars = useMemo(() => {
    if (fuelFilter === 'Tutti') return CARS;
    return CARS.filter((c) => c.fuel === fuelFilter);
  }, [fuelFilter]);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-20">
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
            <span className="text-text-secondary font-medium">Auto per Neopatentati 2026</span>
          </li>
        </ol>
      </nav>

      {/* Hero */}
      <header className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200/80 px-3.5 py-1.5 text-xs font-bold text-emerald-700 mb-4 shadow-sm">
          <Zap className="h-3.5 w-3.5" />
          Riforma Codice della Strada 2026 (75 kW/t e 105 kW)
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
          Guida e Verifica Auto per Neopatentati
        </h1>
        <p className="mt-3.5 text-base sm:text-lg text-slate-600 leading-relaxed">
          Verifica in tempo reale se una vettura rispetta i <strong>limiti per neopatentati</strong> ed esplora la selezione delle <strong>migliori auto usate guidabili</strong> con prezzi di mercato e consumi reali.
        </p>
      </header>

      {/* Interactive Tool / Checker */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl shadow-slate-900/5 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase">
                Calcolatore Rapporto Peso/Potenza
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                L&apos;auto che vuoi comprare è guidabile da un neopatentato?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Inserisci i kW a libretto (punto P.2) e la massa a vuoto/tara in kg (punto T).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700">Potenza Motore</label>
                  <span className="text-xs font-bold text-emerald-700">{customKw} kW ({Math.round(customKw * 1.35962)} CV)</span>
                </div>
                <input
                  type="number"
                  min="20"
                  max="300"
                  value={customKw}
                  onChange={(e) => setCustomKw(Math.max(1, Number(e.target.value) || 0))}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-base font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
                <input
                  type="range"
                  min="30"
                  max="140"
                  value={customKw}
                  onChange={(e) => setCustomKw(Number(e.target.value))}
                  className="w-full accent-emerald-600 mt-3"
                />
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700">Tara Veicolo (Massa a vuoto)</label>
                  <span className="text-xs font-bold text-emerald-700">{customWeight} kg</span>
                </div>
                <input
                  type="number"
                  min="500"
                  max="3500"
                  step="10"
                  value={customWeight}
                  onChange={(e) => setCustomWeight(Math.max(100, Number(e.target.value) || 0))}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-base font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
                <input
                  type="range"
                  min="700"
                  max="2200"
                  step="10"
                  value={customWeight}
                  onChange={(e) => setCustomWeight(Number(e.target.value))}
                  className="w-full accent-emerald-600 mt-3"
                />
              </div>
            </div>
          </div>

          {/* Verdict Box */}
          <div className="lg:col-span-5">
            <div
              className={`rounded-3xl p-6 sm:p-8 text-white border transition-all ${
                isDrivable
                  ? 'bg-slate-900 border-emerald-500/40 shadow-2xl shadow-emerald-950/20'
                  : 'bg-slate-900 border-rose-500/40 shadow-2xl shadow-rose-950/20'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                {isDrivable ? (
                  <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                ) : (
                  <XCircle className="h-6 w-6 text-rose-400" />
                )}
                <span
                  className={`text-xs font-black tracking-wider uppercase ${
                    isDrivable ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isDrivable ? 'IDONEA PER NEOPATENTATI' : 'NON GUIDABILE'}
                </span>
              </div>

              <div className="text-3xl sm:text-4xl font-black mb-1">
                {customRatio.toFixed(1)} <span className="text-xl font-medium text-slate-400">kW/t</span>
              </div>
              <p className="text-xs text-slate-400 mb-5">
                Limite massimo di legge: <strong>75,0 kW/t</strong> e max <strong>105 kW</strong>.
              </p>

              <div className="space-y-2 border-t border-slate-800 pt-4 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Rapporto potenza/tara calcolato:</span>
                  <span className={customRatio <= 75 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {customRatio.toFixed(1)} kW/t ({customRatio <= 75 ? 'OK' : 'Supera 75 kW/t'})
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Potenza massima assoluta:</span>
                  <span className={customKw <= 105 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {customKw} kW ({customKw <= 105 ? 'OK' : 'Supera 105 kW'})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog of Best Used Cars for Neopatentati */}
      <section className="mb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
              <Car className="h-4 w-4" /> I modelli consigliati dalla community
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Le migliori auto usate per neopatentati nel 2026
            </h2>
          </div>

          {/* Fuel Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
            <Filter className="h-4 w-4 text-slate-400 mr-1 shrink-0" />
            {['Tutti', 'Benzina', 'Ibrida', 'GPL'].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFuelFilter(f)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                  fuelFilter === f
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => {
            const ratio = Math.round((car.kw / (car.weightKg / 1000)) * 10) / 10;
            return (
              <div
                key={`${car.make}-${car.model}`}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {car.make}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" /> {ratio} kW/t
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900">
                    {car.make} {car.model}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 mb-4">{car.version}</p>

                  <div className="grid grid-cols-2 gap-2 bg-slate-50 rounded-2xl p-3 mb-4 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Prezzo medio usato</span>
                      <strong className="text-slate-800 font-bold">{car.priceRange}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Consumo reale</span>
                      <strong className="text-emerald-700 font-bold">{car.consumptionKmPerL} km/l</strong>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {car.highlight}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    href={`/valutazione/${car.makeSlug}/${car.modelSlug}`}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
                  >
                    Vedi quotazione reale <ArrowRight className="h-3 w-3" />
                  </Link>
                  <Link
                    href={`/affidabilita/${car.makeSlug}/${car.modelSlug}`}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Difetti noti
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Advice Section */}
      <section className="mb-16 bg-emerald-950 text-white rounded-3xl p-8 sm:p-10 relative overflow-hidden">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-2">
            <ShieldCheck className="h-4 w-4" /> Consigli degli esperti
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mb-4">
            Cosa controllare prima di firmare per la tua prima auto
          </h2>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Verifica la dicitura sul libretto:</strong> accertati che il campo P.2/(T) sia esplicitamente conforme per evitare sanzioni.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Costi assicurativi (Legge Bersani):</strong> usa l&apos;attestato di rischio di un genitore per partire dalla prima classe di merito.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Costi di manutenzione e ricambi:</strong> modelli diffusi come Fiat Panda, Clio e Yaris hanno pezzi di ricambio economici e facilmente reperibili.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* FAQs */}
      <section className="mb-16 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 mb-2">
            <HelpCircle className="h-3.5 w-3.5" /> FAQ Neopatentati
          </div>
          <h2 className="text-2xl font-black text-slate-900">Domande Frequenti sulla Guida Neopatentati</h2>
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

      {/* CTA Footer */}
      <section className="rounded-3xl bg-slate-900 p-8 sm:p-10 text-white text-center">
        <span className="grid h-12 w-12 mx-auto place-items-center rounded-2xl bg-emerald-500/20 text-emerald-400 mb-4">
          <Sparkles className="h-6 w-6" />
        </span>
        <h2 className="text-2xl sm:text-3xl font-black mb-3">
          Hai trovato un annuncio interessante?
        </h2>
        <p className="text-sm text-slate-300 max-w-xl mx-auto mb-6">
          Inserisci marca e modello per scoprire il verdetto istantaneo di AutoEsperto: prezzo giusto di mercato, affidabilità e cosa controllare.
        </p>
        <Link
          href="/#scanner-section"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-900/40"
        >
          Analizza un&apos;auto gratis <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </main>
  );
}
