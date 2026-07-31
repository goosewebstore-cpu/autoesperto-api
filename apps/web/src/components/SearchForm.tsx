'use client';

import { useState } from 'react';
import { Search, Car, Hash, Loader2 } from 'lucide-react';
import type { AnalyzePayload } from '@/lib/api';

export type SearchPayload = AnalyzePayload;

interface SearchFormProps {
  onAnalyze: (payload: AnalyzePayload) => void;
  loading: boolean;
}

type SearchMode = 'plate' | 'model';

export default function SearchForm({ onAnalyze, loading }: SearchFormProps) {
  const [mode, setMode] = useState<SearchMode>('plate');
  const [plate, setPlate] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [km, setKm] = useState('');
  const [price, setPrice] = useState('');

  const isSubmitDisabled =
    loading ||
    (mode === 'plate' && plate.trim().length < 5) ||
    (mode === 'model' && (!make.trim() || !model.trim()));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitDisabled) return;
    onAnalyze({
      plate: mode === 'plate' ? plate.trim().toUpperCase() : undefined,
      make: mode === 'model' ? make.trim() : undefined,
      model: mode === 'model' ? model.trim() : undefined,
      km: km ? parseInt(km) : undefined,
      requestedPrice: price ? parseInt(price) : undefined,
    });
  };

  const inputClass =
    'w-full h-12 px-4 rounded-xl border border-border bg-white text-text-primary font-medium outline-none focus:border-accent input-premium transition-all placeholder:text-text-tertiary';

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <div className="bg-white rounded-2xl shadow-card border border-border p-5 sm:p-6">
        {/* Mode tabs */}
        <div className="flex gap-1 bg-surface-2 rounded-xl p-1 mb-5">
          <button
            type="button"
            onClick={() => setMode('plate')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              mode === 'plate' ? 'bg-white text-accent shadow-sm' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Hash className="w-4 h-4" />
            Cerca per targa
          </button>
          <button
            type="button"
            onClick={() => setMode('model')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              mode === 'model' ? 'bg-white text-accent shadow-sm' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Car className="w-4 h-4" />
            Cerca per modello
          </button>
        </div>

        {/* Plate or model inputs */}
        {mode === 'plate' ? (
          <div className="mb-4">
            <label htmlFor="plate" className="block text-xs font-semibold text-text-secondary mb-1.5">Targa italiana</label>
            <input
              id="plate"
              type="text"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
              placeholder="AB123CD"
              maxLength={7}
              className="w-full h-14 px-4 rounded-xl border border-border bg-white text-xl md:text-2xl font-semibold tracking-[0.2em] uppercase outline-none focus:border-accent input-premium transition-all placeholder:text-text-tertiary placeholder:tracking-normal placeholder:font-normal placeholder:text-base"
            />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label htmlFor="make" className="block text-xs font-semibold text-text-secondary mb-1.5">Marca</label>
              <input
                id="make"
                type="text"
                autoComplete="off"
                value={make}
                onChange={(e) => setMake(e.target.value)}
                placeholder="Es. BMW"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="model" className="block text-xs font-semibold text-text-secondary mb-1.5">Modello</label>
              <input
                id="model"
                type="text"
                autoComplete="off"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Es. Serie 3"
                className={inputClass}
              />
            </div>
          </div>
        )}

        {/* Optional fields */}
        <div className="grid sm:grid-cols-2 gap-3 mb-5">
          <div>
            <label htmlFor="km" className="block text-xs font-semibold text-text-secondary mb-1.5">
              Chilometri <span className="text-text-tertiary font-normal">(opzionale)</span>
            </label>
            <input
              id="km"
              type="number"
              inputMode="numeric"
              autoComplete="off"
              value={km}
              onChange={(e) => setKm(e.target.value.replace(/\D/g, ''))}
              placeholder="Es. 85000"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-xs font-semibold text-text-secondary mb-1.5">
              Prezzo richiesto <span className="text-text-tertiary font-normal">(opzionale)</span>
            </label>
            <input
              id="price"
              type="number"
              inputMode="numeric"
              autoComplete="off"
              value={price}
              onChange={(e) => setPrice(e.target.value.replace(/\D/g, ''))}
              placeholder="Es. 12000"
              className={inputClass}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="w-full h-12 rounded-xl bg-accent text-white font-semibold text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-hover active:scale-[0.99] transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analisi in corso...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Analizza veicolo
            </>
          )}
        </button>
      </div>

      <p className="text-center text-xs text-text-tertiary mt-4">
        Analisi gratuita · Nessun dato salvato
      </p>
    </form>
  );
}
