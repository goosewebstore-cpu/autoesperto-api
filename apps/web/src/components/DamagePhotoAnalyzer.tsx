'use client';

import { useRef, useState } from 'react';
import { Camera, CheckCircle2, Loader2, Upload, AlertTriangle } from 'lucide-react';
import type { VehicleData } from '@autoesperto/types';
import { analyzeVehiclePhoto, type PhotoAnalysis } from '@/lib/api';

function price(value: number) {
  return value.toLocaleString('it-IT') + ' €';
}

export default function DamagePhotoAnalyzer({ vehicle, compact = false, purpose = 'recognition' }: { vehicle?: VehicleData; compact?: boolean; purpose?: 'recognition' | 'damage' }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<PhotoAnalysis | null>(null);
  const isDamageCheck = purpose === 'damage';

  const handleFile = async (file?: File) => {
    if (!file) return;
    setError('');
    setResult(null);
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Carica una foto JPG, PNG o WebP.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('La foto deve essere al massimo di 5 MB.');
      return;
    }
    const imageData = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('Impossibile leggere la foto'));
      reader.readAsDataURL(file);
    });
    setLoading(true);
    try {
      const response = await analyzeVehiclePhoto(imageData, vehicle);
      setResult(response.analysis);
    } catch (err: any) {
      setError(err.message || 'Non riesco ad analizzare la foto. Riprova con un’altra inquadratura.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={compact ? 'rounded-xl bg-surface-2 border border-border/70 p-4' : 'bg-white rounded-2xl shadow-card border border-border p-6 md:p-7'}>
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Camera className="w-4 h-4 text-accent" />
            {isDamageCheck ? 'Analizza un danno da foto' : 'Riconosci l’auto da una foto'}
          </h2>
          <p className="text-sm text-text-secondary mt-1">{isDamageCheck ? 'Valuta solo i danni esterni visibili. Non serve la targa.' : 'Marca, modello e generazione se riconoscibili. Non serve la targa.'}</p>
        </div>
      </div>

      {!result && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="w-full mt-4 rounded-xl border border-dashed border-accent/40 bg-surface-2 px-4 py-5 text-sm font-semibold text-text-primary hover:border-accent hover:bg-accent/5 transition-colors disabled:opacity-60"
        >
          {loading ? <span className="inline-flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Analisi foto in corso...</span> : <span className="inline-flex items-center gap-2"><Upload className="w-4 h-4 text-accent" /> {isDamageCheck ? 'Carica una foto del danno' : 'Carica una foto dell’auto'}</span>}
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />

      {error && <p role="alert" className="mt-3 text-sm text-danger">{error}</p>}

      {result && (
        <div className="mt-4 rounded-xl bg-surface-2 p-4">
          <div className="flex items-start gap-3">
            {isDamageCheck && result.damage.visible ? <AlertTriangle className="w-5 h-5 text-warning mt-0.5" /> : <CheckCircle2 className="w-5 h-5 text-success mt-0.5" />}
            <div className="min-w-0">
              {isDamageCheck ? <>
                <p className="text-sm font-semibold text-text-primary capitalize">{result.damage.category.replace(/_/g, ' ')} · gravità {result.damage.severity}</p>
                <p className="text-sm text-text-secondary mt-1 leading-relaxed">{result.damage.description}</p>
                {result.repairRange && <p className="text-lg font-extrabold text-text-primary number-mono mt-3">{price(result.repairRange.min)} – {price(result.repairRange.max)}</p>}
              </> : <>
                {result.vehicle.make ? <>
                  <p className="text-sm font-semibold text-text-primary">{[result.vehicle.make, result.vehicle.model, result.vehicle.generation].filter(Boolean).join(' · ')}</p>
                  <p className="text-sm text-text-secondary mt-1">Riconoscimento {result.vehicle.confidence === 'alta' ? 'ad alta confidenza' : `a confidenza ${result.vehicle.confidence}`}. Verifica sempre anno e versione nell’annuncio.</p>
                </> : <>
                  <p className="text-sm font-semibold text-text-primary">Auto non riconosciuta con sicurezza</p>
                  <p className="text-sm text-text-secondary mt-1">Prova una foto nitida di tre quarti, con frontale o posteriore ben visibili.</p>
                </>}
              </>}
            </div>
          </div>
          {isDamageCheck && <p className="text-xs text-text-tertiary mt-3">{result.note}</p>}
          <button type="button" onClick={() => { setResult(null); inputRef.current?.click(); }} className="mt-3 text-xs font-semibold text-accent hover:underline">{isDamageCheck ? 'Analizza un’altra foto' : 'Prova un’altra foto'}</button>
        </div>
      )}
      <p className="text-xs text-text-tertiary mt-3">La foto non viene salvata nel database né pubblicata: dopo la risposta il server non la conserva. Le targhe eventualmente visibili vengono ignorate e non vengono lette o mostrate.{isDamageCheck ? ' Non rileva danni interni, meccanici o nascosti.' : ''}</p>
    </section>
  );
}
