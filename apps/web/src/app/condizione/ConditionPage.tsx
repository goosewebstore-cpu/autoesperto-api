'use client';

import { useMemo, useState } from 'react';
import { Car, Search } from 'lucide-react';
import ConditionAssessment from '@/components/ConditionAssessment';
import { analyzeVehicle } from '@/lib/api';
import catalogo from '@/lib/catalogo.json';
import type { AutoReport } from '@autoesperto/types';

export default function ConditionPage() {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [estimatedValue, setEstimatedValue] = useState<number | null>(null);
  const [report, setReport] = useState<AutoReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const brands = useMemo(
    () => Object.keys(catalogo.brands).sort((a, b) => a.localeCompare(b, 'it')),
    []
  );

  const modelsForMake = useMemo(() => {
    const normalizedMake = make.trim().toLowerCase();
    const key = brands.find((brand) => brand.toLowerCase() === normalizedMake);
    return key ? (catalogo.brands as Record<string, string[]>)[key] || [] : [];
  }, [make, brands]);

  const isReady = make.trim().length > 1 && model.trim().length > 0 && year.length === 4;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isReady || loading) return;
    setError('');
    setLoading(true);
    try {
      const res = await analyzeVehicle({
        make: make.trim(),
        model: model.trim(),
        year: parseInt(year, 10),
      });
      setReport(res.report);
      setEstimatedValue(res.report.price.estimatedValue);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel calcolo del valore. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full h-12 px-4 rounded-xl border border-border bg-white text-text-primary font-medium outline-none focus:border-accent input-premium transition-all placeholder:text-text-tertiary';

  if (estimatedValue != null) {
    return (
      <div className="space-y-5">
        <div className="rounded-xl border border-border bg-surface-2 p-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-text-primary">
              {make} {model} {year}
            </p>
            <p className="text-xs text-text-secondary mt-0.5">
              Valore stimato: <strong className="text-accent">{estimatedValue.toLocaleString('it-IT')} €</strong>
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setEstimatedValue(null);
              setReport(null);
              setError('');
            }}
            className="text-xs font-semibold text-accent hover:underline flex-shrink-0"
          >
            Cambia auto
          </button>
        </div>
        <ConditionAssessment
          estimatedValue={estimatedValue}
          vehicle={{ make: make.trim(), model: model.trim(), year: parseInt(year, 10) }}
          report={report || undefined}
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card border border-border p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Car className="w-5 h-5 text-accent" />
        <h2 className="text-base font-bold text-text-primary">Seleziona la tua auto</h2>
      </div>
      <p className="text-sm text-text-secondary mb-5">
        Inserisci marca, modello e anno per calcolare il valore di mercato. Poi potrai caricare le foto dei danni.
      </p>

      <div className="grid sm:grid-cols-3 gap-3 mb-5">
        <div>
          <label htmlFor="cond-make" className="block text-xs font-semibold text-text-secondary mb-1.5">
            Marca
          </label>
          <input
            id="cond-make"
            type="text"
            list="cond-makes"
            autoComplete="off"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            placeholder="Es. Fiat"
            className={inputClass}
          />
          <datalist id="cond-makes">
            {brands.map((brand) => (
              <option key={brand} value={brand} />
            ))}
          </datalist>
        </div>
        <div>
          <label htmlFor="cond-model" className="block text-xs font-semibold text-text-secondary mb-1.5">
            Modello
          </label>
          <input
            id="cond-model"
            type="text"
            list="cond-models"
            autoComplete="off"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Es. Panda"
            className={inputClass}
          />
          <datalist id="cond-models">
            {modelsForMake.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
        </div>
        <div>
          <label htmlFor="cond-year" className="block text-xs font-semibold text-text-secondary mb-1.5">
            Anno
          </label>
          <input
            id="cond-year"
            type="number"
            inputMode="numeric"
            min="1950"
            max={new Date().getFullYear() + 1}
            autoComplete="off"
            value={year}
            onChange={(e) => setYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="Es. 2018"
            className={inputClass}
          />
        </div>
      </div>

      {error && <p className="text-sm text-danger mb-3">{error}</p>}

      <button
        type="submit"
        disabled={!isReady || loading}
        className="w-full h-12 rounded-xl bg-accent text-white font-semibold text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-hover active:scale-[0.99] transition-all"
      >
        {loading ? (
          <>
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Calcolo in corso...
          </>
        ) : (
          <>
            <Search className="w-5 h-5" />
            Calcola valore e valuta condizione
          </>
        )}
      </button>
    </form>
  );
}
