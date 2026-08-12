'use client';

import { useRef, useState } from 'react';
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Clock,
  Hammer,
  Loader2,
  MapPin,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  Wrench,
  X,
} from 'lucide-react';
import { analyzeVehiclePhoto, type PhotoAnalysis } from '@/lib/api';

const MAX_PHOTOS = 4;

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
  if (severity === 'lieve')
    return { label: 'Lieve', badge: 'bg-success-light text-success', bar: 'bg-success', width: '33%' };
  if (severity === 'media')
    return { label: 'Media', badge: 'bg-warning-light text-warning', bar: 'bg-warning', width: '66%' };
  return { label: 'Alta', badge: 'bg-danger-light text-danger', bar: 'bg-danger', width: '100%' };
}

function severityScore(severity: string) {
  if (severity === 'lieve') return 1;
  if (severity === 'media') return 2;
  return 3;
}

type Verdict = 'repair' | 'evaluate' | 'sell';

function getVerdict(totalMin: number, totalMax: number, carValue: number): { verdict: Verdict; label: string; description: string; color: string; bgColor: string; borderColor: string } {
  const avgCost = (totalMin + totalMax) / 2;
  const ratio = avgCost / carValue;

  if (ratio < 0.30) {
    return {
      verdict: 'repair',
      label: 'Conviene riparare',
      description: `Il costo di riparazione (${price(totalMin)}–${price(totalMax)}) è contenuto rispetto al valore dell'auto (${price(carValue)}). Ripara e continua a usarla: è un investimento ragionevole.`,
      color: 'text-success',
      bgColor: 'bg-success-light',
      borderColor: 'border-success/30',
    };
  }
  if (ratio < 0.60) {
    return {
      verdict: 'evaluate',
      label: 'Valuta con attenzione',
      description: `Il costo di riparazione (${price(totalMin)}–${price(totalMax)}) è significativo rispetto al valore dell'auto (${price(carValue)}). Chiedi 2-3 preventivi e valuta se i danni influiscono sulla sicurezza.`,
      color: 'text-warning',
      bgColor: 'bg-warning-light',
      borderColor: 'border-warning/30',
    };
  }
  return {
    verdict: 'sell',
    label: 'Meglio vendere',
    description: `Il costo di riparazione (${price(totalMin)}–${price(totalMax)}) supera il ${Math.round(ratio * 100)}% del valore dell'auto (${price(carValue)}). Spesso conviene vendere l'auto e usare il budget per una migliore.`,
    color: 'text-danger',
    bgColor: 'bg-danger-light',
    borderColor: 'border-danger/30',
  };
}

interface DamageResult {
  id: string;
  analysis: PhotoAnalysis;
}

interface ConditionAssessmentProps {
  /** Estimated vehicle market value (used for repair-vs-sell verdict) */
  estimatedValue: number;
  /** Vehicle info for context */
  vehicle?: { make?: string; model?: string; year?: number };
}

export default function ConditionAssessment({ estimatedValue, vehicle }: ConditionAssessmentProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [results, setResults] = useState<DamageResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file?: File) => {
    if (!file) return;
    setError('');
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
      setResults((prev) => [
        ...prev,
        { id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, analysis: response.analysis },
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      setError(message || 'Non riesco ad analizzare la foto. Riprova con un\'altra inquadratura.');
    } finally {
      setLoading(false);
      // Reset input so the same file can be re-selected
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removeResult = (id: string) => {
    setResults((prev) => prev.filter((r) => r.id !== id));
  };

  const damagedResults = results.filter((r) => r.analysis.damage.visible);
  const totalMin = damagedResults.reduce((sum, r) => sum + (r.analysis.repairRange?.min ?? 0), 0);
  const totalMax = damagedResults.reduce((sum, r) => sum + (r.analysis.repairRange?.max ?? 0), 0);
  const totalDays = damagedResults.reduce((sum, r) => sum + (r.analysis.estimatedTimeDays ?? 0), 0);
  const hasDamages = damagedResults.length > 0;
  const canAddMore = results.length < MAX_PHOTOS;

  const verdictInfo = hasDamages && estimatedValue > 0
    ? getVerdict(totalMin, totalMax, estimatedValue)
    : null;

  const VerdictIcon = verdictInfo?.verdict === 'repair' ? CheckCircle2 : verdictInfo?.verdict === 'evaluate' ? AlertTriangle : ShieldAlert;

  return (
    <section className="bg-white rounded-2xl shadow-card border border-border p-6 md:p-7">
      <div className="flex items-start justify-between gap-4 mb-1">
        <div>
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-accent" />
            Valuta la condizione dell&apos;auto
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Carica fino a {MAX_PHOTOS} foto dei danni: valutiamo gravità, costi e se conviene riparare o vendere.
          </p>
        </div>
      </div>

      {/* Upload area */}
      {canAddMore && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="w-full mt-5 rounded-xl border border-dashed border-accent/40 bg-surface-2 px-4 py-6 text-sm font-semibold text-text-primary hover:border-accent hover:bg-accent/5 transition-colors disabled:opacity-60"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Analisi del danno in corso...
            </span>
          ) : results.length === 0 ? (
            <span className="inline-flex items-center gap-2">
              <Upload className="w-4 h-4 text-accent" /> Carica una foto del danno
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <Plus className="w-4 h-4 text-accent" /> Aggiungi un&apos;altra foto ({results.length}/{MAX_PHOTOS})
            </span>
          )}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {error && <p role="alert" className="mt-3 text-sm text-danger">{error}</p>}

      {/* Individual damage results */}
      {results.length > 0 && (
        <div className="mt-5 space-y-3">
          {results.map((r, idx) => {
            const isDamaged = r.analysis.damage.visible;
            const sev = severityConfig(r.analysis.damage.severity);
            return (
              <div key={r.id} className={`rounded-xl border p-4 ${isDamaged ? 'border-warning/30 bg-warning-light/30' : 'border-border bg-surface-2'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${isDamaged ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'}`}>
                      {idx + 1}
                    </div>
                    <div className="min-w-0">
                      {isDamaged ? (
                        <>
                          <p className="text-sm font-bold text-text-primary">
                            {categoryLabel(r.analysis.damage.category)}
                            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${sev.badge}`}>{sev.label}</span>
                          </p>
                          {r.analysis.damage.area && (
                            <p className="text-xs text-text-secondary mt-1 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-text-tertiary flex-shrink-0" />
                              {r.analysis.damage.area}
                            </p>
                          )}
                          <p className="text-xs text-text-secondary mt-1">{r.analysis.damage.description}</p>
                          <div className="flex flex-wrap items-center gap-3 mt-2">
                            {r.analysis.repairRange && (
                              <span className="inline-flex items-center gap-1 text-sm font-extrabold text-text-primary">
                                <Wrench className="w-3.5 h-3.5 text-accent" />
                                {price(r.analysis.repairRange.min)}–{price(r.analysis.repairRange.max)}
                              </span>
                            )}
                            {r.analysis.estimatedTimeDays != null && r.analysis.estimatedTimeDays > 0 && (
                              <span className="inline-flex items-center gap-1 text-xs text-text-secondary">
                                <Clock className="w-3 h-3" />
                                {r.analysis.estimatedTimeDays} giorno{r.analysis.estimatedTimeDays > 1 ? 'i' : ''}
                              </span>
                            )}
                          </div>
                          {r.analysis.damage.repairHint && (
                            <p className="text-xs text-accent mt-1.5 flex items-center gap-1">
                              <Hammer className="w-3 h-3" /> {r.analysis.damage.repairHint}
                            </p>
                          )}
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                          <p className="text-sm font-semibold text-success">Nessun danno esterno evidente</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeResult(r.id)}
                    className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-text-tertiary hover:text-danger hover:bg-danger-light transition-colors"
                    aria-label="Rimuovi"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary + Verdict */}
      {results.length > 0 && (
        <div className="mt-5 space-y-4">
          {/* Totals */}
          <div className="rounded-xl border border-border bg-surface-2 p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">Foto analizzate</p>
                <p className="text-lg font-extrabold text-text-primary mt-0.5">{results.length}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">Danni trovati</p>
                <p className="text-lg font-extrabold text-text-primary mt-0.5">{damagedResults.length}</p>
              </div>
              {hasDamages && (
                <>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary flex items-center gap-1">
                      <Wrench className="w-3 h-3" /> Costo totale
                    </p>
                    <p className="text-lg font-extrabold text-accent mt-0.5">{price(totalMin)}–{price(totalMax)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Tempo totale
                    </p>
                    <p className="text-lg font-extrabold text-text-primary mt-0.5">
                      {totalDays > 0 ? `${totalDays} giorn${totalDays > 1 ? 'i' : 'o'}` : '—'}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Verdict */}
          {verdictInfo && (
            <div className={`rounded-2xl border ${verdictInfo.borderColor} ${verdictInfo.bgColor} p-5`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${verdictInfo.verdict === 'repair' ? 'bg-success text-white' : verdictInfo.verdict === 'evaluate' ? 'bg-warning text-white' : 'bg-danger text-white'}`}>
                  <VerdictIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold uppercase tracking-wider text-text-tertiary">Conviene riparare?</div>
                  <div className={`mt-0.5 text-lg font-extrabold ${verdictInfo.color}`}>{verdictInfo.label}</div>
                  <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">{verdictInfo.description}</p>
                  
                  {/* Breakdown bar */}
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-secondary">Costo riparazione</span>
                      <span className="font-bold text-text-primary">{price(totalMin)}–{price(totalMax)}</span>
                    </div>
                    <div className="h-3 rounded-full bg-white/80 overflow-hidden relative">
                      <div
                        className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ${verdictInfo.verdict === 'repair' ? 'bg-success' : verdictInfo.verdict === 'evaluate' ? 'bg-warning' : 'bg-danger'}`}
                        style={{ width: `${Math.min(100, Math.round(((totalMin + totalMax) / 2 / estimatedValue) * 100))}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-secondary">Valore auto stimato</span>
                      <span className="font-bold text-text-primary">{price(estimatedValue)}</span>
                    </div>
                    <div className="text-center">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${verdictInfo.bgColor} ${verdictInfo.color}`}>
                        Incidenza: {Math.round((totalMin / estimatedValue) * 100)}–{Math.round((totalMax / estimatedValue) * 100)}% del valore
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* No damages found */}
          {!hasDamages && results.length > 0 && (
            <div className="rounded-2xl border border-success/30 bg-success-light p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-success flex items-center justify-center flex-shrink-0 text-white">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold uppercase tracking-wider text-text-tertiary">Condizione esterna</div>
                  <div className="mt-0.5 text-lg font-extrabold text-success">Nessun danno rilevato</div>
                  <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
                    Dalle foto analizzate non risultano danni esterni evidenti. L&apos;auto sembra in buone condizioni esterne.
                    Verifica comunque di persona e controlla anche gli interni e la meccanica.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tips */}
          {hasDamages && (
            <div className="rounded-xl bg-surface-2 p-4">
              <p className="text-xs font-bold text-text-tertiary uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent" /> Consigli pratici
              </p>
              <ul className="space-y-1.5">
                {[
                  'Chiedi almeno 2-3 preventivi a carrozzieri diversi prima di decidere.',
                  'Verifica se i danni influiscono sulla sicurezza (struttura, airbag, fari).',
                  verdictInfo?.verdict === 'sell'
                    ? 'Se decidi di vendere, dichiara i danni: aumenta la fiducia dell\'acquirente.'
                    : 'Se ripari, chiedi la garanzia scritta sull\'intervento al carrozziere.',
                  'Per danni da incidente, verifica sempre se la struttura è compromessa con un controllo in officina.',
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-sm text-text-secondary leading-relaxed">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0 mt-0.5" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Reset */}
          <button
            type="button"
            onClick={() => setResults([])}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-tertiary hover:text-danger transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Ricomincia l&apos;analisi
          </button>
        </div>
      )}

      <p className="text-xs text-text-tertiary mt-3">
        Le foto non vengono salvate nel database né pubblicate. Le targhe eventualmente visibili vengono ignorate. Non rileva danni interni, meccanici o nascosti. Stima indicativa: chiedi sempre un preventivo reale.
      </p>
    </section>
  );
}
