'use client';

import { useState } from 'react';
import { Search, Camera, Car, Gauge, Euro, Loader2, Sparkles, Hash } from 'lucide-react';

interface SearchFormProps {
  onAnalyze: (plate: string, km: string, price: string) => void;
  loading: boolean;
}

type SearchMode = 'plate' | 'model';

export default function SearchForm({ onAnalyze, loading }: SearchFormProps) {
  const [mode, setMode] = useState<SearchMode>('plate');
  const [plate, setPlate] = useState('');
  const [km, setKm] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'plate' && plate.trim().length < 5) return;
    if (mode === 'model') {
      // For model search, use a placeholder plate that the backend will recognize
      onAnalyze('SEARCH', km, price);
      return;
    }
    onAnalyze(plate.trim().toUpperCase(), km, price);
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <div className="bg-white rounded-3xl shadow-premium p-5 sm:p-6 md:p-8 border border-border/40">
        {/* Mode Tabs */}
        <div className="flex gap-1.5 bg-surface-2 rounded-xl p-1 mb-6">
          <button
            type="button"
            onClick={() => { setMode('plate'); setPlate(''); }}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              mode === 'plate'
                ? 'bg-white text-accent shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Hash className="w-4 h-4" />
            Cerca per Targa
          </button>
          <button
            type="button"
            onClick={() => { setMode('model'); setPlate(''); }}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              mode === 'model'
                ? 'bg-white text-accent shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Car className="w-4 h-4" />
            Cerca per Modello
          </button>
        </div>

        {/* Plate Input */}
        {mode === 'plate' && (
          <div className="mb-5">
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
              Targa italiana
            </label>
            <div className="relative">
              <input
                type="text"
                value={plate}
                onChange={(e) => setPlate(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                placeholder="AB123CD"
                maxLength={7}
                className="w-full h-14 md:h-16 px-5 rounded-2xl border-2 border-border bg-surface-2 text-text-primary text-xl md:text-2xl font-semibold tracking-[0.2em] uppercase outline-none focus:border-accent focus:bg-white input-premium transition-all placeholder:text-text-tertiary placeholder:tracking-normal placeholder:font-normal placeholder:text-base"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="hidden md:flex text-xs text-text-tertiary bg-surface-2 px-2 py-1 rounded-lg font-medium">
                  ITA
                </span>
              </div>
            </div>
            {plate.length > 0 && plate.length < 5 && (
              <p className="text-xs text-warning mt-2 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-warning" />
                Inserisci almeno 5 caratteri
              </p>
            )}
          </div>
        )}

        {/* Model Search Banner */}
        {mode === 'model' && (
          <div className="mb-5 bg-accent-light rounded-2xl p-5 border border-accent/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="font-bold text-text-primary text-sm">Ricerca per Modello</div>
                <div className="text-xs text-text-secondary">Inserisci le caratteristiche dell&apos;auto</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <input
                  type="text"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value)}
                  placeholder="Es. BMW Serie 3, Volkswagen Golf..."
                  className="w-full h-12 px-4 rounded-xl border-2 border-border bg-white text-text-primary font-medium outline-none focus:border-accent input-premium transition-all placeholder:text-text-tertiary"
                />
              </div>
            </div>
          </div>
        )}

        {/* KM and Price */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
              <Gauge className="w-3 h-3 inline mr-1" />
              Km
            </label>
            <div className="relative">
              <input
                type="number"
                value={km}
                onChange={(e) => setKm(e.target.value)}
                placeholder="Es. 75000"
                className="w-full h-12 px-4 rounded-xl border-2 border-border bg-surface-2 text-text-primary font-medium outline-none focus:border-accent focus:bg-white input-premium transition-all placeholder:text-text-tertiary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
              <Euro className="w-3 h-3 inline mr-1" />
              Prezzo richiesto
            </label>
            <div className="relative">
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Es. 15000"
                className="w-full h-12 px-4 rounded-xl border-2 border-border bg-surface-2 text-text-primary font-medium outline-none focus:border-accent focus:bg-white input-premium transition-all placeholder:text-text-tertiary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || (mode === 'plate' && plate.trim().length < 5)}
          className="w-full h-14 rounded-2xl gradient-bg text-white font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-premium-lg active:scale-[0.99] transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analisi in corso...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              {mode === 'plate' ? 'Analizza Veicolo' : 'Cerca Modello'}
            </>
          )}
        </button>

        {/* OCR Button */}
        {mode === 'plate' && (
          <button
            type="button"
            onClick={() => alert('Carica foto targa (funzione da integrare con OCR in versione Pro).')}
            className="w-full h-12 mt-3 rounded-xl border-2 border-dashed border-border bg-surface-2 text-text-secondary font-medium flex items-center justify-center gap-2 hover:bg-white hover:border-accent/30 transition-all"
          >
            <Camera className="w-4 h-4" />
            Scatta o carica foto targa
          </button>
        )}
      </div>

      {/* Trust indicators */}
      <div className="flex items-center justify-center gap-6 mt-5 text-xs text-text-tertiary">
        <span className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-success" />
          Dati ACI
        </span>
        <span className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-success" />
          Analisi AI
        </span>
        <span className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-success" />
          Prezzi mercato
        </span>
      </div>
    </form>
  );
}
