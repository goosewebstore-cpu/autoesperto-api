'use client';

import { useRef, useState } from 'react';
import { Camera, CheckCircle2, Clock, Hammer, Loader2, MapPin, ShieldAlert, Sparkles, Upload, Wrench, AlertTriangle } from 'lucide-react';
import type { VehicleData } from '@autoesperto/types';
import { analyzeVehiclePhoto, type PhotoAnalysis } from '@/lib/api';

function price(value: number) {
  return value.toLocaleString('it-IT') + ' €';
}

function categoryLabel(category: string) {
  const labels: Record<string, string> = {
    graffio: 'Graffio',
    ammaccatura: 'Ammaccatura',
    paraurti: 'Danno al paraurti',
    fanale: 'Danno al fanale',
    specchietto: 'Danno allo specchietto',
    cerchio_gomma: 'Danno a cerchio/gomma',
    vetro: 'Danno al vetro',
    carrozzeria: 'Danno alla carrozzeria',
    nessun_danno_evidente: 'Nessun danno evidente',
    non_chiaro: 'Non chiaro',
  };
  return labels[category] || category.replace(/_/g, ' ');
}

function severityConfig(severity: string) {
  if (severity === 'lieve') return { label: 'Gravità lieve', badge: 'bg-success-light text-success', bar: 'bg-success', width: '33%' };
  if (severity === 'media') return { label: 'Gravità media', badge: 'bg-warning-light text-warning', bar: 'bg-warning', width: '66%' };
  return { label: 'Gravità alta', badge: 'bg-danger-light text-danger', bar: 'bg-danger', width: '100%' };
}

function severityScore(severity: string) {
  if (severity === 'lieve') return 1;
  if (severity === 'media') return 2;
  return 3;
}

export default function DamageCheckTool({ vehicle }: { vehicle?: VehicleData }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<PhotoAnalysis | null>(null);

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
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      setError(message || 'Non riesco ad analizzare la foto. Riprova con un’altra inquadratura.');
    } finally {
      setLoading(false);
    }
  };

  const isDamaged = Boolean(result?.damage?.visible);
  const sev = result ? severityConfig(result.damage.severity) : null;

  return (
    <section className="bg-white rounded-2xl shadow-card border border-border p-6 md:p-7">
      <div className="flex items-start justify-between gap-4 mb-1">
        <div>
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-accent" />
            Controllo danni da foto
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Carica una foto ravvicinata del danno: valuto zona, gravità, intervento consigliato e costi indicativi di riparazione.
          </p>
        </div>
      </div>

      {!result && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="w-full mt-5 rounded-xl border border-dashed border-accent/40 bg-surface-2 px-4 py-6 text-sm font-semibold text-text-primary hover:border-accent hover:bg-accent/5 transition-colors disabled:opacity-60"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Analisi del danno in corso...</span>
          ) : (
            <span className="inline-flex items-center gap-2"><Upload className="w-4 h-4 text-accent" /> Carica una foto del danno</span>
          )}
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />

      {error && <p role="alert" className="mt-3 text-sm text-danger">{error}</p>}

      {result && (
        <div className="mt-5 space-y-4">
          {isDamaged ? (
            <>
              <div className="rounded-xl border border-warning/30 bg-warning-light/60 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-warning">{categoryLabel(result.damage.category)} · {sev?.label}</p>
                    {result.damage.area && (
                      <p className="text-sm text-text-secondary mt-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-text-tertiary flex-shrink-0" />
                        {result.damage.area}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-surface-2 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary mb-1.5">Descrizione</p>
                <p className="text-sm text-text-primary leading-relaxed">{result.damage.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl bg-surface-2 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Gravità
                  </p>
                  {sev && (
                    <div>
                      <div className="flex gap-1">
                        {[1, 2, 3].map((n) => (
                          <span key={n} className={`h-1.5 flex-1 rounded-full ${n <= severityScore(result.damage.severity) ? sev.bar : 'bg-border'}`} />
                        ))}
                      </div>
                      <p className="mt-2 text-sm font-semibold text-text-primary capitalize">{sev.label}</p>
                    </div>
                  )}
                </div>
                {result.repairRange && (
                  <div className="rounded-xl bg-surface-2 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary mb-1.5 flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5" /> Costo indicativo
                    </p>
                    <p className="text-xl font-extrabold text-text-primary number-mono">{price(result.repairRange.min)} – {price(result.repairRange.max)}</p>
                    <p className="text-xs text-text-tertiary mt-1">Inclusi ricambi e manodopera</p>
                  </div>
                )}
                {result.estimatedTimeDays !== undefined && (
                  <div className="rounded-xl bg-surface-2 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary mb-1.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Tempo in officina
                    </p>
                    <p className="text-xl font-extrabold text-text-primary number-mono">
                      {result.estimatedTimeDays === 0 ? '—' : `${result.estimatedTimeDays} giorno${result.estimatedTimeDays > 1 ? 'i' : ''}`}
                    </p>
                    <p className="text-xs text-text-tertiary mt-1">Stima indicativa</p>
                  </div>
                )}
              </div>

              {result.damage.repairHint && (
                <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary mb-1.5 flex items-center gap-1.5">
                    <Hammer className="w-3.5 h-3.5 text-accent" /> Intervento consigliato
                  </p>
                  <p className="text-sm text-text-primary leading-relaxed">{result.damage.repairHint}</p>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-xl bg-surface-2 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-success">Nessun danno esterno evidente</p>
                  <p className="text-sm text-text-secondary mt-1 leading-relaxed">{result.damage.description}</p>
                </div>
              </div>
            </div>
          )}

          <button type="button" onClick={() => { setResult(null); inputRef.current?.click(); }} className="text-xs font-semibold text-accent hover:underline">
            Analizza un’altra foto
          </button>

          <p className="text-xs text-text-tertiary border-t border-border pt-3">{result.note}</p>
        </div>
      )}

      <p className="text-xs text-text-tertiary mt-3">
        La foto non viene salvata nel database né pubblicata: dopo la risposta il server non la conserva. Le targhe eventualmente visibili vengono ignorate e non vengono lette o mostrate. Non rileva danni interni, meccanici o nascosti.
      </p>
    </section>
  );
}
