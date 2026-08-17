'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Car, CheckCircle2, Loader2, RotateCcw, Search } from 'lucide-react';
import type { AutoReport } from '@autoesperto/types';
import { analyzeVehicle } from '@/lib/api';
import { getAllMakes } from '@/lib/catalogo';
import { SellAdGenerator } from '@/components/SellAdGenerator';

function euro(v: number) {
  return v.toLocaleString('it-IT') + ' €';
}

function roundTo100(v: number) {
  return Math.max(0, Math.round(v / 100) * 100);
}

const PHASES = [
  'Dati ricevuti',
  'Identificazione del modello',
  'Valutazione del mercato',
  'Calcolo della fascia di vendita',
  'Preparazione dell\u2019annuncio',
];

const inputClass =
  'w-full h-12 px-4 rounded-xl border border-border bg-white text-text-primary font-medium outline-none focus:border-accent input-premium transition-all placeholder:text-text-tertiary';

export default function SellCheck() {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [km, setKm] = useState('');

  const [loading, setLoading] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [error, setError] = useState('');
  const [report, setReport] = useState<AutoReport | null>(null);

  const brands = useMemo(() => getAllMakes(), []);

  const modelsForMake = useMemo(() => {
    const found = brands.find((b) => b.name.toLowerCase() === make.trim().toLowerCase());
    return found ? found.models : [];
  }, [brands, make]);

  const canSubmit =
    !loading &&
    make.trim().length >= 2 &&
    model.trim().length >= 1 &&
    year.length === 4 &&
    km.trim().length > 0;

  useEffect(() => {
    if (!loading) return;
    const timers = PHASES.map((_, i) => setTimeout(() => setPhaseIndex(i + 1), 550 * (i + 1)));
    return () => timers.forEach(clearTimeout);
  }, [loading]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    setError('');
    setReport(null);
    setPhaseIndex(0);
    setLoading(true);
    try {
      const result = await analyzeVehicle({
        make: make.trim(),
        model: model.trim(),
        year: Number.parseInt(year, 10),
        km: Number.parseInt(km, 10),
      });
      if (result.success && result.report) {
        setReport(result.report);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setError('Non siamo riusciti a calcolare il valore. Riprova.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      setError(
        message || 'Non siamo riusciti a completare la valutazione. Controlla i dati e riprova.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setReport(null);
    setError('');
    setPhaseIndex(0);
  };

  if (report) {
    const { price: p, vehicle } = report;

    const fastSell = roundTo100(p.min);
    const recommended = roundTo100(p.estimatedValue);
    const maxAsk = roundTo100(Math.max(p.max, Math.round(p.estimatedValue * 1.05)));

    return (
      <div className="animate-fade-in space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-accent">
              Voglio vendere la mia auto
            </p>
            <h1 className="mt-1 text-2xl md:text-3xl font-extrabold tracking-tight text-text-primary">
              {vehicle.make} {vehicle.model}
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              {[vehicle.year, vehicle.fuel, vehicle.body].filter(Boolean).join(' · ')}
              {p.inputKm ? ` · ${p.inputKm.toLocaleString('it-IT')} km` : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-text-secondary hover:border-accent hover:text-accent transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Nuova stima
          </button>
        </div>

        {/* Valore stimato */}
        <div className="rounded-2xl border border-border bg-white p-5 md:p-6 shadow-card">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-text-tertiary">
                Valore stimato di mercato
              </div>
              <div className="mt-1 text-3xl font-extrabold text-text-primary number-mono">
                {euro(p.min)} – {euro(p.max)}
              </div>
            </div>
          </div>
          {p.market?.total ? (
            <p className="mt-2 text-[11px] text-text-tertiary">
              Basato su {p.market.total} annunci simili.
              {p.market.fetchedAt
                ? ` Ultimo aggiornamento: ${new Date(p.market.fetchedAt).toLocaleDateString('it-IT')}.`
                : ''}
            </p>
          ) : (
            <p className="mt-2 text-[11px] text-text-tertiary">
              Stima indicativa basata sui dati di mercato disponibili.
            </p>
          )}
        </div>

        {/* Fascia di vendita */}
        <div className="rounded-2xl border border-border bg-white p-5 md:p-6 shadow-card">
          <h2 className="mb-4 text-sm font-bold text-text-primary">A che prezzo metterla in vendita?</h2>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-surface-2 p-4">
              <div className="text-lg font-extrabold text-text-primary number-mono">{euro(fastSell)}</div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
                Vendita veloce
              </div>
              <p className="mt-1 text-[11px] leading-snug text-text-tertiary">
                Per chiudere in fretta e attirare contatti
              </p>
            </div>
            <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
              <div className="text-lg font-extrabold text-accent number-mono">{euro(recommended)}</div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-accent">
                Prezzo consigliato
              </div>
              <p className="mt-1 text-[11px] leading-snug text-text-tertiary">
                In linea con la media del mercato
              </p>
            </div>
            <div className="rounded-xl bg-surface-2 p-4">
              <div className="text-lg font-extrabold text-text-primary number-mono">{euro(maxAsk)}</div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
                Massimo da provare
              </div>
              <p className="mt-1 text-[11px] leading-snug text-text-tertiary">
                Prezzo di partenza, lascia spazio alla trattativa
              </p>
            </div>
          </div>
          <p className="mt-4 text-[11px] text-text-tertiary leading-relaxed">
            La stima è basata sui prezzi pubblicati negli annunci disponibili. Condizioni, optional e
            storico dei tagliandi possono alzare o abbassare il valore reale dell&apos;esemplare.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 md:p-6 shadow-card">
          <SellAdGenerator report={report} />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <p className="text-xs font-bold uppercase tracking-wider text-accent">A quanto posso venderla?</p>
      <h1 className="mt-1 text-2xl md:text-3xl font-extrabold tracking-tight text-text-primary">
        Voglio vendere la mia auto
      </h1>
      <p className="mt-2 text-sm text-text-secondary leading-relaxed">
        Inserisci i dati: valore, prezzo da impostare e annuncio pronto.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-2xl border border-border bg-white p-5 md:p-6 shadow-card"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="sell-make" className="block text-xs font-semibold text-text-secondary mb-1.5">
              Marca
            </label>
            <input
              id="sell-make"
              type="text"
              list="sell-makes"
              autoComplete="off"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              placeholder="Es. Fiat"
              className={inputClass}
            />
            <datalist id="sell-makes">
              {brands.map((b) => <option key={b.name} value={b.name} />)}
            </datalist>
          </div>
          <div>
            <label htmlFor="sell-model" className="block text-xs font-semibold text-text-secondary mb-1.5">
              Modello
            </label>
            <input
              id="sell-model"
              type="text"
              list="sell-models"
              autoComplete="off"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Es. 500"
              className={inputClass}
            />
            <datalist id="sell-models">
              {modelsForMake.map((m) => <option key={m} value={m} />)}
            </datalist>
          </div>
          <div>
            <label htmlFor="sell-year" className="block text-xs font-semibold text-text-secondary mb-1.5">
              Anno
            </label>
            <input
              id="sell-year"
              type="number"
              inputMode="numeric"
              min="1950"
              max={new Date().getFullYear() + 1}
              value={year}
              onChange={(e) => setYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="Es. 2018"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="sell-km" className="block text-xs font-semibold text-text-secondary mb-1.5">
              Chilometri
            </label>
            <input
              id="sell-km"
              type="number"
              inputMode="numeric"
              value={km}
              onChange={(e) => setKm(e.target.value.replace(/\D/g, ''))}
              placeholder="Es. 87000"
              className={inputClass}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent text-sm font-bold text-white hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Calcolo in corso…</>
          ) : (
            <><Search className="h-4 w-4" /> Quanto vale la mia auto?</>
          )}
        </button>
      </form>

      {loading && (
        <div className="mt-5 rounded-2xl border border-border bg-white p-5 shadow-card">
          <p className="flex items-center gap-2 text-sm font-extrabold text-text-primary">
            <Loader2 className="h-4 w-4 animate-spin text-accent" /> Analisi in corso…
          </p>
          <div className="mt-4 space-y-2.5">
            {PHASES.map((phase, i) => (
              <div
                key={phase}
                className={`flex items-center gap-2.5 text-sm transition-all duration-300 ${i < phaseIndex ? 'text-text-primary' : 'text-text-tertiary'}`}
              >
                <span className={`grid h-6 w-6 place-items-center rounded-full ${i < phaseIndex ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                  {i < phaseIndex ? <CheckCircle2 className="h-3.5 w-3.5" /> : <span className="h-2 w-2 rounded-full bg-current" />}
                </span>
                {phase}
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div role="alert" className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-900">Non siamo riusciti a completare la valutazione</p>
            <p className="mt-1 text-sm text-amber-800 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center gap-3 rounded-2xl border border-border bg-white p-4 text-sm text-text-secondary">
        <Car className="h-5 w-5 text-accent shrink-0" />
        <p>
          La stima usa i prezzi degli annunci in vendita come riferimento. Condizioni ed equipaggiamento
          reali possono cambiare il valore finale.
        </p>
      </div>
    </div>
  );
}