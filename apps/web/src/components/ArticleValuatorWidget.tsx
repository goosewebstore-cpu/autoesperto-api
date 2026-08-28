'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Car,
  Calculator,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Fuel,
  Wrench,
  Camera,
  RefreshCw,
} from 'lucide-react';
import catalogo from '@/lib/catalogo.json';
import { buildLocalReport } from '@/lib/stima';
import { slugify } from '@/lib/catalogo';
import type { AutoReport } from '@autoesperto/types';

interface ArticleValuatorWidgetProps {
  suggestedModels?: Array<{ make: string; model: string }>;
  articleTitle?: string;
}

export default function ArticleValuatorWidget({
  suggestedModels = [],
  articleTitle,
}: ArticleValuatorWidgetProps) {
  const defaultMake = suggestedModels[0]?.make || 'Fiat';
  const defaultModel = suggestedModels[0]?.model || 'Panda';
  const defaultYear = 2019;

  const [make, setMake] = useState(defaultMake);
  const [model, setModel] = useState(defaultModel);
  const [year, setYear] = useState(String(defaultYear));
  const [km, setKm] = useState('80000');
  const [price, setPrice] = useState('');
  const [report, setReport] = useState<AutoReport | null>(() => {
    try {
      return buildLocalReport(defaultMake, defaultModel, defaultYear, undefined, 80000);
    } catch {
      return null;
    }
  });

  const brands = useMemo(
    () => Object.keys(catalogo.brands).sort((a, b) => a.localeCompare(b, 'it')),
    []
  );

  const modelsForMake = useMemo(() => {
    const normalizedMake = make.trim().toLowerCase();
    const key = brands.find((brand) => brand.toLowerCase() === normalizedMake);
    return key ? (catalogo.brands as Record<string, string[]>)[key] || [] : [];
  }, [make, brands]);

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!make.trim() || !model.trim()) return;
    const yearNum = parseInt(year, 10) || new Date().getFullYear() - 5;
    const kmNum = km ? parseInt(km.replace(/\D/g, ''), 10) : undefined;
    const priceNum = price ? parseInt(price.replace(/\D/g, ''), 10) : undefined;

    const rep = buildLocalReport(make.trim(), model.trim(), yearNum, priceNum, kmNum);
    setReport(rep);
  };

  const handleSelectSuggested = (sMake: string, sModel: string) => {
    setMake(sMake);
    setModel(sModel);
    const yearNum = parseInt(year, 10) || 2019;
    const kmNum = km ? parseInt(km.replace(/\D/g, ''), 10) : 80000;
    const rep = buildLocalReport(sMake, sModel, yearNum, undefined, kmNum);
    setReport(rep);
  };

  const formatEuro = (n: number) => {
    return n.toLocaleString('it-IT') + ' €';
  };

  const relScore = report?.reliability?.score
    ? Number(report.reliability.score) > 10
      ? Number(report.reliability.score) / 10
      : Number(report.reliability.score)
    : 7.8;

  const verdict = report?.reliability?.verdict || 'BUY';

  return (
    <div className="my-10 rounded-2xl border-2 border-blue-200/90 bg-gradient-to-b from-blue-50/70 via-white to-slate-50 p-5 md:p-7 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-100 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white shadow-xs">
            <Calculator className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-base md:text-lg font-extrabold text-slate-900 leading-tight">
              Calcola la Valutazione di un&apos;Auto Usata
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Stima immediata di valore reale, affidabilità e punti critici
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/80 px-2.5 py-1 text-xs font-bold text-emerald-800">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Gratis in 1 click
        </span>
      </div>

      {/* Suggested Models Pills */}
      {suggestedModels.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">Auto citate nell&apos;articolo:</span>
          {suggestedModels.slice(0, 5).map(({ make: sMake, model: sModel }) => {
            const isActive = make.toLowerCase() === sMake.toLowerCase() && model.toLowerCase() === sModel.toLowerCase();
            return (
              <button
                key={`${sMake}-${sModel}`}
                type="button"
                onClick={() => handleSelectSuggested(sMake, sModel)}
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50/50'
                }`}
              >
                <Car className="w-3 h-3" />
                {sMake} {sModel}
              </button>
            );
          })}
        </div>
      )}

      {/* Inputs Form */}
      <form onSubmit={handleCalculate} className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Marca
          </label>
          <input
            type="text"
            list="article-auto-makes"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            placeholder="Es. Fiat"
            className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
          />
          <datalist id="article-auto-makes">
            {brands.map((b) => (
              <option key={b} value={b} />
            ))}
          </datalist>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Modello
          </label>
          <input
            type="text"
            list="article-auto-models"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Es. Panda"
            className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
          />
          <datalist id="article-auto-models">
            {modelsForMake.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Anno
          </label>
          <input
            type="number"
            min="1995"
            max={new Date().getFullYear()}
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Es. 2019"
            className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Chilometri (km)
          </label>
          <input
            type="text"
            value={km}
            onChange={(e) => setKm(e.target.value)}
            placeholder="Es. 80000"
            className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
          />
        </div>

        <div className="col-span-2 sm:col-span-4 mt-1">
          <button
            type="submit"
            className="w-full h-10 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-xs font-bold text-white shadow-xs hover:bg-blue-700 active:scale-[0.99] transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Aggiorna valutazione per {make} {model} {year}
          </button>
        </div>
      </form>

      {/* Result Card */}
      {report && (
        <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 md:p-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="text-xs font-semibold text-slate-500">Risultato della stima per:</div>
              <div className="text-base font-extrabold text-slate-900">
                {make} {model} {year ? `(${year})` : ''}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-extrabold ${
                  verdict === 'BUY'
                    ? 'bg-emerald-100 text-emerald-800'
                    : verdict === 'NEGOTIATE'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {verdict === 'BUY' ? '✓ BUON ACQUISTO' : verdict === 'NEGOTIATE' ? '⚠️ TRATTA IL PREZZO' : '❌ ATTENZIONE'}
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Prezzo stimato */}
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
              <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                Valore stimato
              </div>
              <div className="text-lg md:text-xl font-extrabold text-slate-900 mt-1">
                {formatEuro(report.price.estimatedValue)}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Range: {formatEuro(report.price.min)} – {formatEuro(report.price.max)}
              </div>
            </div>

            {/* Indice Affidabilità */}
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
              <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Affidabilità
              </div>
              <div className="text-lg md:text-xl font-extrabold text-slate-900 mt-1">
                {relScore.toFixed(1)} <span className="text-xs text-slate-500 font-semibold">/10</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                {report.reliability.verdictLabel || 'Modello collaudato'}
              </div>
            </div>

            {/* Manutenzione annua */}
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
              <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <Wrench className="w-3.5 h-3.5 text-amber-600" />
                Manutenzione
              </div>
              <div className="text-lg md:text-xl font-extrabold text-slate-900 mt-1">
                ~{report.reliability.futureCosts?.annualMaintenance ?? 450} €
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Costo annuo stimato
              </div>
            </div>

            {/* Consumo */}
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
              <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <Fuel className="w-3.5 h-3.5 text-indigo-600" />
                Consumo medio
              </div>
              <div className="text-lg md:text-xl font-extrabold text-slate-900 mt-1">
                {report.reliability.consumption?.combined
                  ? `${report.reliability.consumption.combined} ${report.reliability.consumption.fuelType || 'l/100 km'}`
                  : '5.4 l/100km'}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Misto urbano/extra
              </div>
            </div>
          </div>

          {/* Quick Critical Checks */}
          {report.reliability.commonIssues && report.reliability.commonIssues.length > 0 && (
            <div className="mt-3.5 rounded-xl bg-amber-50/70 border border-amber-200/70 p-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Punti critici da verificare prima di comprare:</span>
              </div>
              <ul className="mt-1.5 space-y-1">
                {report.reliability.commonIssues.slice(0, 2).map((issue, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-xs text-amber-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action CTAs */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-slate-100">
            <Link
              href={`/valutazione/${slugify(make)}/${slugify(model)}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Scheda completa {make} {model} <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <div className="flex items-center gap-2">
              <Link
                href={`/?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&year=${encodeURIComponent(year)}#scanner-section`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 px-3.5 py-2 text-xs font-bold text-white transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                Controlla annuncio
              </Link>
              <Link
                href="/#scanner-section"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 transition-colors"
              >
                <Camera className="w-3.5 h-3.5 text-blue-600" />
                Analizza da foto
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
