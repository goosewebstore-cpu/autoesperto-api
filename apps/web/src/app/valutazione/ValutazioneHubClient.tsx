'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Car,
  Calculator,
  ShieldCheck,
  TrendingUp,
  Fuel,
  Wrench,
  ArrowRight,
  Sparkles,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import catalogo from '@/lib/catalogo.json';
import { buildLocalReport } from '@/lib/stima';
import { slugify } from '@/lib/catalogo';
import type { AutoReport } from '@autoesperto/types';

interface MakeItem {
  name: string;
  slug: string;
  models: string[];
}

interface ValutazioneHubClientProps {
  makes: MakeItem[];
}

const POPULAR_CARS = [
  { make: 'Fiat', model: 'Panda', year: 2019, km: '75.000', price: '9.200 €', badge: 'Più venduta' },
  { make: 'Fiat', model: '500', year: 2020, km: '60.000', price: '11.500 €', badge: 'Icona citycar' },
  { make: 'Volkswagen', model: 'Golf', year: 2019, km: '85.000', price: '16.800 €', badge: 'Top affidabile' },
  { make: 'Toyota', model: 'Yaris', year: 2021, km: '50.000', price: '14.900 €', badge: 'Ibrida top' },
  { make: 'Dacia', model: 'Sandero', year: 2021, km: '45.000', price: '10.800 €', badge: 'Miglior TCO' },
  { make: 'Renault', model: 'Clio', year: 2020, km: '65.000', price: '12.400 €', badge: 'Economica' },
  { make: 'Jeep', model: 'Renegade', year: 2019, km: '80.000', price: '15.500 €', badge: 'SUV compatto' },
  { make: 'Peugeot', model: '208', year: 2020, km: '55.000', price: '13.200 €', badge: 'Design moderno' },
  { make: 'Ford', model: 'Puma', year: 2021, km: '50.000', price: '17.300 €', badge: 'Crossover' },
  { make: 'Citroën', model: 'C3', year: 2020, km: '60.000', price: '11.200 €', badge: 'Comfort' },
  { make: 'Audi', model: 'A3', year: 2019, km: '90.000', price: '19.500 €', badge: 'Premium' },
  { make: 'BMW', model: 'Serie 1', year: 2020, km: '70.000', price: '21.000 €', badge: 'Sportiva' },
];

export default function ValutazioneHubClient({ makes }: ValutazioneHubClientProps) {
  const [selectedMake, setSelectedMake] = useState('Fiat');
  const [selectedModel, setSelectedModel] = useState('Panda');
  const [selectedYear, setSelectedYear] = useState('2019');
  const [selectedKm, setSelectedKm] = useState('80000');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [brandSearch, setBrandSearch] = useState('');

  const [report, setReport] = useState<AutoReport | null>(() => {
    try {
      return buildLocalReport('Fiat', 'Panda', 2019, undefined, 80000);
    } catch {
      return null;
    }
  });

  const brands = useMemo(
    () => Object.keys(catalogo.brands).sort((a, b) => a.localeCompare(b, 'it')),
    []
  );

  const modelsForMake = useMemo(() => {
    const normalizedMake = selectedMake.trim().toLowerCase();
    const key = brands.find((brand) => brand.toLowerCase() === normalizedMake);
    return key ? (catalogo.brands as Record<string, string[]>)[key] || [] : [];
  }, [selectedMake, brands]);

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedMake.trim() || !selectedModel.trim()) return;
    const yearNum = parseInt(selectedYear, 10) || 2019;
    const kmNum = selectedKm ? parseInt(selectedKm.replace(/\D/g, ''), 10) : undefined;
    const priceNum = selectedPrice ? parseInt(selectedPrice.replace(/\D/g, ''), 10) : undefined;

    const rep = buildLocalReport(selectedMake.trim(), selectedModel.trim(), yearNum, priceNum, kmNum);
    setReport(rep);
  };

  const handleSelectQuickCar = (carMake: string, carModel: string, carYear: number) => {
    setSelectedMake(carMake);
    setSelectedModel(carModel);
    setSelectedYear(String(carYear));
    const rep = buildLocalReport(carMake, carModel, carYear, undefined, 75000);
    setReport(rep);
  };

  const filteredMakes = useMemo(() => {
    if (!brandSearch.trim()) return makes;
    const q = brandSearch.toLowerCase().trim();
    return makes.filter(
      (m) => m.name.toLowerCase().includes(q) || m.models.some((mod) => mod.toLowerCase().includes(q))
    );
  }, [makes, brandSearch]);

  const formatEuro = (n: number) => n.toLocaleString('it-IT') + ' €';

  const relScore = report?.reliability?.score
    ? Number(report.reliability.score) > 10
      ? Number(report.reliability.score) / 10
      : Number(report.reliability.score)
    : 7.8;

  const verdict = report?.reliability?.verdict || 'BUY';

  return (
    <div className="space-y-12">
      {/* Live Interactive Valuator Card */}
      <section className="rounded-3xl border border-blue-200/90 bg-gradient-to-br from-blue-50/80 via-white to-sky-50/40 p-6 md:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
              <Calculator className="h-6 w-6" />
            </span>
            <div>
              <h2 className="text-lg md:text-xl font-extrabold text-slate-900 leading-tight">
                Calcolatore Valutazione Auto Istantanea
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Calcola subito valore di mercato reale, affidabilità e costi di gestione
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Algoritmo 2026 Aggiornato
          </span>
        </div>

        {/* Inputs */}
        <form onSubmit={handleCalculate} className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Marca
            </label>
            <input
              type="text"
              list="hub-auto-makes"
              value={selectedMake}
              onChange={(e) => setSelectedMake(e.target.value)}
              placeholder="Es. Volkswagen"
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
            />
            <datalist id="hub-auto-makes">
              {brands.map((b) => (
                <option key={b} value={b} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Modello
            </label>
            <input
              type="text"
              list="hub-auto-models"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              placeholder="Es. Golf"
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
            />
            <datalist id="hub-auto-models">
              {modelsForMake.map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Anno Immatricolazione
            </label>
            <input
              type="number"
              min="1995"
              max={new Date().getFullYear()}
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              placeholder="Es. 2019"
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Chilometraggio (km)
            </label>
            <input
              type="text"
              value={selectedKm}
              onChange={(e) => setSelectedKm(e.target.value)}
              placeholder="Es. 80000"
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
            />
          </div>

          <div className="col-span-2 sm:col-span-4 flex flex-col sm:flex-row items-center gap-3 mt-1">
            <button
              type="submit"
              className="w-full sm:w-auto flex-1 h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.99] transition-all"
            >
              <Calculator className="w-4 h-4" />
              Calcola Valutazione di {selectedMake} {selectedModel} {selectedYear}
            </button>
            <Link
              href={`/valutazione/${slugify(selectedMake)}/${slugify(selectedModel)}`}
              className="w-full sm:w-auto h-11 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-5 text-xs font-bold text-slate-700 transition-colors"
            >
              Vedi Scheda Modello Completa <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </form>

        {/* Live Calculation Output Card */}
        {report && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
              <div>
                <span className="text-xs font-semibold text-slate-500">Valutazione di mercato:</span>
                <div className="text-xl font-extrabold text-slate-900">
                  {selectedMake} {selectedModel} {selectedYear ? `(${selectedYear})` : ''}
                </div>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold ${
                  verdict === 'BUY'
                    ? 'bg-emerald-100 text-emerald-800'
                    : verdict === 'NEGOTIATE'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {verdict === 'BUY' ? '✓ BUON AFFARE' : verdict === 'NEGOTIATE' ? '⚠️ TRATTA IL PREZZO' : '❌ ATTENZIONE'}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3.5">
                <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                  Prezzo medio
                </div>
                <div className="text-xl font-extrabold text-slate-900 mt-1">
                  {formatEuro(report.price.estimatedValue)}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Range: {formatEuro(report.price.min)} – {formatEuro(report.price.max)}
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3.5">
                <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Affidabilità
                </div>
                <div className="text-xl font-extrabold text-slate-900 mt-1">
                  {relScore.toFixed(1)} <span className="text-xs text-slate-500 font-semibold">/10</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                  {report.reliability.verdictLabel || 'Consigliata'}
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3.5">
                <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <Wrench className="w-3.5 h-3.5 text-amber-600" />
                  Manutenzione
                </div>
                <div className="text-xl font-extrabold text-slate-900 mt-1">
                  ~{report.reliability.futureCosts?.annualMaintenance ?? 420} €
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Spesa ordinaria annua
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3.5">
                <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <Fuel className="w-3.5 h-3.5 text-indigo-600" />
                  Consumo medio
                </div>
                <div className="text-xl font-extrabold text-slate-900 mt-1">
                  {report.reliability.consumption?.combined
                    ? `${report.reliability.consumption.combined} ${report.reliability.consumption.fuelType || 'l/100 km'}`
                    : '5.2 l/100km'}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Ciclo misto reale
                </div>
              </div>
            </div>

            {report.reliability.commonIssues && report.reliability.commonIssues.length > 0 && (
              <div className="mt-4 rounded-xl bg-amber-50/80 border border-amber-200/80 p-3.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Controlli essenziali prima di acquistare:</span>
                </div>
                <ul className="mt-1.5 space-y-1">
                  {report.reliability.commonIssues.slice(0, 3).map((iss, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-amber-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                      <span>{iss}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3.5 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Link
                  href={`/?make=${encodeURIComponent(selectedMake)}&model=${encodeURIComponent(selectedModel)}&year=${encodeURIComponent(selectedYear)}#scanner-section`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2.5 text-xs font-bold text-white transition-colors"
                >
                  <Search className="w-3.5 h-3.5" />
                  Controlla annuncio in vendita
                </Link>
                <Link
                  href="/#scanner-section"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5 text-blue-600" />
                  Analizza foto veicolo
                </Link>
              </div>

              <Link
                href={`/valutazione/${slugify(selectedMake)}/${slugify(selectedModel)}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
              >
                Approfondisci tutti gli allestimenti <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Popular Models Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-extrabold text-slate-900">
              Auto Più Valutate in Italia
            </h2>
          </div>
          <span className="text-xs text-slate-500">Quotazioni aggiornate</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {POPULAR_CARS.map((car) => (
            <button
              key={`${car.make}-${car.model}`}
              type="button"
              onClick={() => handleSelectQuickCar(car.make, car.model, car.year)}
              className="text-left rounded-2xl border border-slate-200 bg-white hover:border-blue-500 hover:shadow-sm p-4 transition-all group"
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 rounded-md px-2 py-0.5">
                  {car.badge}
                </span>
                <span className="text-xs font-semibold text-slate-400">{car.year}</span>
              </div>
              <div className="font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors text-sm">
                {car.make} {car.model}
              </div>
              <div className="text-xs font-bold text-emerald-700 mt-1">
                Media ~{car.price}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Rif. {car.km} km
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Complete Brands Directory with Fast Filter */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Tutte le Marche nel Catalogo
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Seleziona una marca per consultare le quotazioni e i problemi noti di ogni singolo modello
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              placeholder="Cerca marca..."
              className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:border-blue-600 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {filteredMakes.map((make) => (
            <Link
              key={make.name}
              href={`/valutazione/${make.slug}`}
              className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white hover:border-blue-500 hover:bg-blue-50/30 px-3.5 py-3 transition-all group"
            >
              <span className="text-xs md:text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                {make.name}
              </span>
              <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 rounded-md px-1.5 py-0.5 group-hover:bg-blue-100 group-hover:text-blue-700">
                {make.models.length}
              </span>
            </Link>
          ))}
        </div>

        {filteredMakes.length === 0 && (
          <div className="text-center py-8 text-xs text-slate-500">
            Nessuna marca trovata per &quot;{brandSearch}&quot;.
          </div>
        )}
      </section>
    </div>
  );
}
