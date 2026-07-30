'use client';

import { useState } from 'react';
import { Camera, Search, Loader2 } from 'lucide-react';

interface SearchFormProps {
  onAnalyze: (plate: string, km: string, price: string) => void;
  loading: boolean;
}

export default function SearchForm({ onAnalyze, loading }: SearchFormProps) {
  const [plate, setPlate] = useState('');
  const [km, setKm] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (plate.trim().length < 5) return;
    onAnalyze(plate.trim().toUpperCase(), km, price);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface rounded-3xl shadow-card p-6 md:p-8">
      <label className="block text-sm font-semibold text-text-secondary mb-3">Targa italiana</label>
      <div className="flex gap-3 mb-4">
        <div className="flex-1">
          <input
            type="text"
            value={plate}
            onChange={(e) => setPlate(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
            placeholder="Es. AB123CD"
            maxLength={7}
            className="w-full h-14 md:h-16 px-5 rounded-2xl border border-border bg-surface-2 text-text-primary text-xl md:text-2xl font-semibold tracking-widest uppercase outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all placeholder:text-text-tertiary placeholder:tracking-normal placeholder:font-normal placeholder:text-base"
          />
        </div>
        <button
          type="submit"
          disabled={loading || plate.trim().length < 5}
          className="h-14 md:h-16 px-6 md:px-8 rounded-2xl bg-accent text-white font-semibold text-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-hover active:scale-[0.98] transition-all"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          <span className="hidden md:inline">Cerca</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <input
          type="number"
          value={km}
          onChange={(e) => setKm(e.target.value)}
          placeholder="Km"
          className="w-full h-12 px-4 rounded-xl border border-border bg-surface-2 text-text-primary font-medium outline-none focus:border-accent transition-all placeholder:text-text-tertiary"
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Prezzo richiesto €"
          className="w-full h-12 px-4 rounded-xl border border-border bg-surface-2 text-text-primary font-medium outline-none focus:border-accent transition-all placeholder:text-text-tertiary"
        />
      </div>

      <button
        type="button"
        onClick={() => alert('Carica foto targa (funzione da integrare con OCR in versione Pro).')}
        className="w-full h-12 rounded-xl border border-dashed border-border bg-surface-2 text-text-secondary font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
      >
        <Camera className="w-5 h-5" />
        Scatta o carica foto targa
      </button>
    </form>
  );
}
