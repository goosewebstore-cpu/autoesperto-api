'use client';

import { useMemo, useState } from 'react';
import { Camera, Car, Loader2, Search } from 'lucide-react';
import type { AnalyzePayload } from '@/lib/api';
import DamagePhotoAnalyzer from '@/components/DamagePhotoAnalyzer';
import catalogo from '@/lib/catalogo.json';

export type SearchPayload = AnalyzePayload;

interface SearchFormProps {
  onAnalyze: (payload: AnalyzePayload) => void;
  loading: boolean;
  initialMode?: SearchMode;
  initialMake?: string;
  initialModel?: string;
  initialYear?: string;
  initialKm?: string;
  initialPrice?: string;
}

type SearchMode = 'photo' | 'model';

export default function SearchForm({
  onAnalyze,
  loading,
  initialMode = 'photo',
  initialMake = '',
  initialModel = '',
  initialYear = '',
  initialKm = '',
  initialPrice = '',
}: SearchFormProps) {
  const [mode, setMode] = useState<SearchMode>(initialMode);
  const [make, setMake] = useState(initialMake);
  const [model, setModel] = useState(initialModel);
  const [year, setYear] = useState(initialYear);
  const [km, setKm] = useState(initialKm);
  const [price, setPrice] = useState(initialPrice);

  const brands = useMemo(
    () => Object.keys(catalogo.brands).sort((a, b) => a.localeCompare(b, 'it')),
    []
  );

  const modelsForMake = useMemo(() => {
    const normalizedMake = make.trim().toLowerCase();
    const key = brands.find((brand) => brand.toLowerCase() === normalizedMake);
    return key ? (catalogo.brands as Record<string, string[]>)[key] || [] : [];
  }, [make, brands]);

  const isSubmitDisabled = loading || !make.trim() || !model.trim() || year.length !== 4;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (mode !== 'model' || isSubmitDisabled) return;
    onAnalyze({
      make: make.trim(),
      model: model.trim(),
      year: Number.parseInt(year, 10),
      km: km ? Number.parseInt(km, 10) : undefined,
      requestedPrice: price ? Number.parseInt(price, 10) : undefined,
    });
  };

  const inputClass =
    'w-full h-12 px-4 rounded-xl border border-border bg-white text-text-primary font-medium outline-none focus:border-accent input-premium transition-all placeholder:text-text-tertiary';

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <div className="bg-white rounded-2xl shadow-card border border-border p-4 sm:p-6">
        <div className="grid grid-cols-2 gap-2 mb-5" role="tablist" aria-label="Metodo di analisi">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'photo'}
            onClick={() => setMode('photo')}
            className={`rounded-xl border px-3 py-3 text-left transition-all ${
              mode === 'photo'
                ? 'border-accent bg-accent/5 text-text-primary shadow-sm'
                : 'border-border bg-white text-text-secondary hover:border-accent/40'
            }`}
          >
            <span className="flex items-center gap-2 text-sm font-bold"><Camera className="w-4 h-4 text-accent" /> Analizza una foto</span>
            <span className="block mt-1 text-xs font-medium text-text-tertiary">Riconosci auto e danni visibili</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'model'}
            onClick={() => setMode('model')}
            className={`rounded-xl border px-3 py-3 text-left transition-all ${
              mode === 'model'
                ? 'border-accent bg-accent/5 text-text-primary shadow-sm'
                : 'border-border bg-white text-text-secondary hover:border-accent/40'
            }`}
          >
            <span className="flex items-center gap-2 text-sm font-bold"><Car className="w-4 h-4 text-accent" /> Marca e modello</span>
            <span className="block mt-1 text-xs font-medium text-text-tertiary">Prezzo, affidabilit&agrave; e confronti</span>
          </button>
        </div>

        {mode === 'photo' ? (
          <DamagePhotoAnalyzer compact />
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm font-semibold text-text-primary">Raccontaci quale auto stai valutando</p>
              <p className="text-xs text-text-secondary mt-1">L&apos;anno &egrave; necessario: cambia prezzo, generazione e controlli da fare.</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-3 mb-4">
              <div>
                <label htmlFor="make" className="block text-xs font-semibold text-text-secondary mb-1.5">Marca</label>
                <input id="make" type="text" list="auto-makes" autoComplete="off" value={make} onChange={(event) => setMake(event.target.value)} placeholder="Es. Mazda" className={inputClass} />
                <datalist id="auto-makes">{brands.map((brand) => <option key={brand} value={brand} />)}</datalist>
              </div>
              <div>
                <label htmlFor="model" className="block text-xs font-semibold text-text-secondary mb-1.5">Modello</label>
                <input id="model" type="text" list="auto-models" autoComplete="off" value={model} onChange={(event) => setModel(event.target.value)} placeholder="Es. CX-3" className={inputClass} />
                <datalist id="auto-models">{modelsForMake.map((item) => <option key={item} value={item} />)}</datalist>
              </div>
              <div>
                <label htmlFor="year" className="block text-xs font-semibold text-text-secondary mb-1.5">Anno di immatricolazione</label>
                <input id="year" type="number" inputMode="numeric" min="1950" max={new Date().getFullYear() + 1} autoComplete="off" value={year} onChange={(event) => setYear(event.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="Es. 2016" className={inputClass} />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 mb-5">
              <div>
                <label htmlFor="km" className="block text-xs font-semibold text-text-secondary mb-1.5">Chilometri <span className="text-text-tertiary font-normal">(opzionale)</span></label>
                <input id="km" type="number" inputMode="numeric" autoComplete="off" value={km} onChange={(event) => setKm(event.target.value.replace(/\D/g, ''))} placeholder="Es. 85000" className={inputClass} />
              </div>
              <div>
                <label htmlFor="price" className="block text-xs font-semibold text-text-secondary mb-1.5">Prezzo dell&apos;annuncio <span className="text-text-tertiary font-normal">(facoltativo)</span></label>
                <input id="price" type="number" inputMode="numeric" autoComplete="off" value={price} onChange={(event) => setPrice(event.target.value.replace(/\D/g, ''))} placeholder="Es. 12000" className={inputClass} />
              </div>
            </div>
            <button type="submit" disabled={isSubmitDisabled} className="w-full h-12 rounded-xl bg-accent text-white font-semibold text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-hover active:scale-[0.99] transition-all">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analisi in corso...</> : <><Search className="w-5 h-5" /> Analizza il modello</>}
            </button>
          </>
        )}
      </div>
      <p className="text-center text-xs text-text-tertiary mt-4">Analisi gratuita &middot; Nessun dato personale richiesto</p>
    </form>
  );
}
