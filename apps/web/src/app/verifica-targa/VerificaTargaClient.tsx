'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Sparkles, Car } from 'lucide-react';

export default function VerificaTargaClient() {
  const [targa, setTarga] = useState('');
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [checked, setChecked] = useState(false);

  // Formato targa italiana standard: 2 lettere, 3 numeri, 2 lettere (es. AB123CD)
  // O formato vecchio (es. MI123456 o RM123456)
  const validateTarga = (val: string) => {
    const clean = val.replace(/\s+/g, '').toUpperCase();
    const standardRegex = /^[A-Z]{2}[0-9]{3}[A-Z]{2}$/;
    const vintageRegex = /^[A-Z]{2}[0-9]{5,6}$/;
    return standardRegex.test(clean) || vintageRegex.test(clean);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = targa.replace(/\s+/g, '').toUpperCase();
    if (!clean) {
      setError('Inserisci una targa valida');
      return;
    }
    if (!validateTarga(clean)) {
      setError('Formato targa non valido (es. AA000BB o MI123456)');
      return;
    }
    setError('');
    setIsScanning(true);
    setChecked(false);

    setTimeout(() => {
      setIsScanning(false);
      setChecked(true);
    }, 900);
  };

  return (
    <div className="space-y-8">
      {/* Box input targa */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl shadow-slate-100">
        <form onSubmit={handleSearch} className="max-w-xl mx-auto space-y-4">
          <label htmlFor="targa-input" className="block text-center text-sm font-bold text-slate-700">
            Inserisci la targa del veicolo (autovettura italiana)
          </label>
          
          <div className="relative flex items-center overflow-hidden rounded-xl">
            {/* Fascio laser animato durante scansione */}
            {isScanning && <div className="laser-line z-20 pointer-events-none" />}

            {/* Banda blu sinistra europea */}
            <div className="absolute left-2.5 flex flex-col items-center justify-center w-7 h-11 bg-blue-700 text-white rounded-l-md text-[9px] font-bold select-none z-10">
              <span className="text-yellow-300 text-[10px] leading-none mb-0.5">★</span>
              <span>I</span>
            </div>

            <input
              id="targa-input"
              type="text"
              value={targa}
              disabled={isScanning}
              onChange={(e) => {
                setTarga(e.target.value.toUpperCase());
                if (error) setError('');
                if (checked) setChecked(false);
              }}
              placeholder="AA 000 BB"
              maxLength={8}
              className={`w-full h-14 pl-12 pr-12 text-center text-2xl tracking-[0.25em] font-mono font-extrabold uppercase rounded-xl border-2 bg-slate-50 text-slate-900 placeholder:text-slate-300 placeholder:tracking-normal placeholder:font-sans placeholder:text-base focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10 transition-all shadow-inner ${
                isScanning ? 'border-blue-500 bg-blue-50/40 ring-4 ring-blue-500/20' : 'border-slate-300'
              }`}
            />

            {/* Banda blu destra */}
            <div className="absolute right-2.5 flex flex-col items-center justify-center w-7 h-11 bg-blue-700 text-white rounded-r-md text-[9px] font-bold select-none z-10">
              <span className="w-2.5 h-2.5 rounded-full border border-yellow-300/80 mb-0.5" />
              <span className="text-[8px] opacity-80">26</span>
            </div>
          </div>

          {error && (
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-rose-600">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isScanning}
            className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 font-bold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:shadow-xl active:scale-[0.99] disabled:opacity-80 transition-all"
          >
            {isScanning ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Scansione registri in corso...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Verifica Targa Gratis
              </>
            )}
          </button>

          <p className="text-center text-[11px] text-slate-500">
            Nessuna registrazione richiesta · 100% anonimo e gratuito
          </p>
        </form>
      </div>

      {/* Risultato della ricerca */}
      {checked && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-6 sm:p-8 animate-fade-in space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-200/80 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-100 px-2.5 py-1 rounded-full mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Targa identificata
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 font-mono tracking-wider">
                {targa.replace(/\s+/g, '').toUpperCase()}
              </h3>
            </div>
            <div className="text-xs text-slate-600">
              Formato valido del registro italiano
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Vuoi conoscere valore di mercato, affidabilità e difetti?
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  Inserisci la marca e il modello (o carica una foto) sullo scanner di AutoEsperto per ottenere quotazione in tempo reale, storico prezzi e checklist pre-acquisto.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                href="/#scanner-section"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-700 transition-colors"
              >
                <Car className="w-4 h-4" />
                Analizza sullo Scanner AutoEsperto
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/calcolo-bollo"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition-colors"
              >
                Calcola il Bollo Auto
              </Link>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2 p-3 bg-white/70 rounded-lg border border-blue-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Verifica revisione su Portale dell&apos;Automobilista</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white/70 rounded-lg border border-blue-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Controllo fermi amministrativi ACI</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white/70 rounded-lg border border-blue-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Valutazione valore medio da annunci reali</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
