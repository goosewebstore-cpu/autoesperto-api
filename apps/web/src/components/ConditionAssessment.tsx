'use client';

import { useRef, useState } from 'react';
import {
  AlertTriangle,
  Bot,
  Camera,
  CheckCircle2,
  Clock,
  ExternalLink,
  Gauge,
  Hammer,
  HelpCircle,
  Loader2,
  MapPin,
  MessageSquare,
  Plus,
  Send,
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
  return Math.round(value).toLocaleString('it-IT') + ' €';
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
    return { label: 'Lieve', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  if (severity === 'media')
    return { label: 'Media', badge: 'bg-amber-50 text-amber-700 border-amber-200' };
  return { label: 'Alta', badge: 'bg-rose-50 text-rose-700 border-rose-200' };
}

type Verdict = 'repair' | 'evaluate' | 'sell';

function getVerdict(totalMin: number, totalMax: number, carValue: number): { verdict: Verdict; label: string; description: string; color: string; bgColor: string; borderColor: string } {
  const avgCost = (totalMin + totalMax) / 2;
  const ratio = carValue > 0 ? avgCost / carValue : 0;

  if (ratio < 0.30) {
    return {
      verdict: 'repair',
      label: 'Conviene riparare',
      description: `Il costo stimato (${price(totalMin)}–${price(totalMax)}) è ampiamente sostenibile rispetto al valore dell'auto (${price(carValue)}). Conviene riparare e continuare ad usarla.`,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
    };
  }
  if (ratio < 0.55) {
    return {
      verdict: 'evaluate',
      label: 'Valuta con attenzione',
      description: `Il costo stimato (${price(totalMin)}–${price(totalMax)}) incide in modo significativo sul valore dell'auto (${price(carValue)}). Richiedi preventivi precisi per decidere.`,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
    };
  }
  return {
    verdict: 'sell',
    label: 'Meglio vendere nello stato di fatto',
    description: `I costi di riparazione e ricambi (${price(totalMin)}–${price(totalMax)}) superano il ${Math.round(ratio * 100)}% del valore attuale dell'auto (${price(carValue)}). Conviene venderla così com'è.`,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
  };
}

function getEbaySearchUrl(category: string, make?: string, model?: string) {
  const label = categoryLabel(category);
  const query = `ricambi ${label} ${make || ''} ${model || ''}`.trim();
  return `https://www.ebay.it/sch/i.html?_nkw=${encodeURIComponent(query)}`;
}

interface DamageResult {
  id: string;
  analysis: PhotoAnalysis;
}

interface ConditionAssessmentProps {
  /** Estimated vehicle market value (used for repair-vs-sell verdict) */
  estimatedValue: number;
  /** Vehicle info for context */
  vehicle?: { make?: string; model?: string; year?: number; km?: number };
}

const DASHBOARD_LIGHTS_OPTIONS = [
  { id: 'spia_motore', label: 'Spia Motore (Check Engine)' },
  { id: 'spia_abs', label: 'Spia ABS / ESP' },
  { id: 'spia_freni', label: 'Spia Freni / Usura Pastiglie' },
  { id: 'spia_airbag', label: 'Spia Airbag' },
  { id: 'spia_fap', label: 'Spia DPF / FAP intasato' },
  { id: 'spia_batteria', label: 'Spia Batteria / Alternatore' },
];

export default function ConditionAssessment({ estimatedValue, vehicle }: ConditionAssessmentProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [results, setResults] = useState<DamageResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Refinement fields
  const [year, setYear] = useState<number>(vehicle?.year || new Date().getFullYear() - 5);
  const [km, setKm] = useState<number>(vehicle?.km || 120000);
  const [selectedLights, setSelectedLights] = useState<string[]>([]);
  const [accidentHistory, setAccidentHistory] = useState<string>('none');

  // AI Assistant Widget state
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Recalculate adjusted car value based on inputs
  let valueMultiplier = 1.0;
  const currentYear = new Date().getFullYear();
  const age = Math.max(0, currentYear - year);
  const expectedKm = age * 15000;
  const kmDiff = km - expectedKm;

  if (kmDiff > 0) {
    valueMultiplier -= Math.min(0.25, (kmDiff / 10000) * 0.015);
  } else if (kmDiff < 0) {
    valueMultiplier += Math.min(0.15, (Math.abs(kmDiff) / 10000) * 0.01);
  }

  // Penalty for warning lights
  if (selectedLights.length > 0) {
    valueMultiplier -= Math.min(0.20, selectedLights.length * 0.04);
  }

  // Penalty for accident history
  if (accidentHistory === 'minor') valueMultiplier -= 0.08;
  if (accidentHistory === 'medium') valueMultiplier -= 0.16;
  if (accidentHistory === 'severe') valueMultiplier -= 0.28;

  const adjustedValue = Math.max(500, Math.round(estimatedValue * Math.max(0.35, valueMultiplier)));

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
      const response = await analyzeVehiclePhoto(imageData, { make: vehicle?.make, model: vehicle?.model, year });
      setResults((prev) => [
        ...prev,
        { id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, analysis: response.analysis },
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      setError(message || 'Non riesco ad analizzare la foto. Riprova con un\'altra inquadratura.');
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const toggleLight = (id: string) => {
    setSelectedLights((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const askAiAssistant = async (customQ?: string) => {
    const q = customQ || aiQuestion;
    if (!q.trim()) return;
    setAiLoading(true);
    setAiAnswer(null);
    try {
      const res = await fetch('/api/assistant/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          vehicle: { make: vehicle?.make, model: vehicle?.model, year, km },
          condition: {
            dashboardLights: selectedLights,
            accidentHistory,
            damages: results.map((r) => r.analysis.damage.category),
          },
        }),
      });
      const data = await res.json();
      if (data.answer) {
        setAiAnswer(data.answer);
      } else {
        setAiAnswer('Per ' + (vehicle?.make || 'questo veicolo') + ', ti consigliamo un controllo in officina specializzata per valutare attentamente il ricambio e la manodopera.');
      }
    } catch {
      setAiAnswer('Consiglio dell\'Esperto AI: Per guasti specifici o componenti usurati, confronta sempre i codici ricambio OEM su eBay prima di acquistare in concessionaria.');
    } finally {
      setAiLoading(false);
    }
  };

  const damagedResults = results.filter((r) => r.analysis.damage.visible);
  const totalMin = damagedResults.reduce((sum, r) => sum + (r.analysis.repairRange?.min ?? 0), 0);
  const totalMax = damagedResults.reduce((sum, r) => sum + (r.analysis.repairRange?.max ?? 0), 0);
  const totalDays = damagedResults.reduce((sum, r) => sum + (r.analysis.estimatedTimeDays ?? 0), 0);
  const hasDamages = damagedResults.length > 0;
  const canAddMore = results.length < MAX_PHOTOS;

  const verdictInfo = adjustedValue > 0
    ? getVerdict(totalMin, totalMax, adjustedValue)
    : null;

  const VerdictIcon = verdictInfo?.verdict === 'repair' ? CheckCircle2 : verdictInfo?.verdict === 'evaluate' ? AlertTriangle : ShieldAlert;

  return (
    <section className="bg-white rounded-2xl shadow-card border border-border p-6 md:p-7 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-accent" />
            Valutazione Condizione & Stima Ricambi
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Personalizza anno e km, seleziona spie o incidenti, carica foto dei danni e trova subito i ricambi su eBay.
          </p>
        </div>
      </div>

      {/* Vehicle Refinement Controls */}
      <div className="bg-surface-2 rounded-xl p-4 border border-border space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-wide text-text-secondary flex items-center gap-1.5">
          <Gauge className="w-4 h-4 text-accent" />
          Affinamento Dati Veicolo per Valutazione Accurata
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">Anno Immatricolazione</label>
            <input
              type="number"
              min="1990"
              max={currentYear}
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full text-sm font-semibold border border-border rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">Chilometraggio (KM Reali)</label>
            <input
              type="number"
              step="5000"
              value={km}
              onChange={(e) => setKm(Number(e.target.value))}
              className="w-full text-sm font-semibold border border-border rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* Dashboard Lights */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1.5">Spie del Cruscotto Accese</label>
          <div className="flex flex-wrap gap-2">
            {DASHBOARD_LIGHTS_OPTIONS.map((light) => {
              const active = selectedLights.includes(light.id);
              return (
                <button
                  key={light.id}
                  type="button"
                  onClick={() => toggleLight(light.id)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors ${active ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold' : 'bg-white text-text-secondary border-border hover:bg-slate-50'}`}
                >
                  {light.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Incident History */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1">Storico Incidenti</label>
          <select
            value={accidentHistory}
            onChange={(e) => setAccidentHistory(e.target.value)}
            className="w-full text-sm font-semibold border border-border rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-accent"
          >
            <option value="none">Nessun incidente rilevato</option>
            <option value="minor">Lievi urti (Graffi o piccoli urti da parcheggio)</option>
            <option value="medium">Medio (Sostituzione paraurti/lamiere esterne)</option>
            <option value="severe">Grave (Strutturale / Airbag esplosi)</option>
          </select>
        </div>

        {/* Dynamic Adjusted Market Value Banner */}
        <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-border">
          <span className="text-xs font-bold text-text-secondary">Valore stimato ricalcolato (con KM e stato):</span>
          <span className="text-base font-black text-accent">{price(adjustedValue)}</span>
        </div>
      </div>

      {/* Upload area */}
      {canAddMore && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="w-full rounded-xl border border-dashed border-accent/40 bg-surface-2 px-4 py-6 text-sm font-semibold text-text-primary hover:border-accent hover:bg-accent/5 transition-colors disabled:opacity-60"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Riconoscimento ed analisi del danno in corso...
            </span>
          ) : results.length === 0 ? (
            <span className="inline-flex items-center gap-2">
              <Upload className="w-4 h-4 text-accent" /> Carica una foto del danno o componente
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

      {error && <p role="alert" className="mt-3 text-sm text-rose-600">{error}</p>}

      {/* Individual damage results with eBay Spare Parts Link */}
      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((r, idx) => {
            const isDamaged = r.analysis.damage.visible;
            const sev = severityConfig(r.analysis.damage.severity);
            const ebayUrl = getEbaySearchUrl(r.analysis.damage.category, vehicle?.make, vehicle?.model);
            return (
              <div key={r.id} className={`rounded-xl border p-4 ${isDamaged ? 'border-amber-200 bg-amber-50/50' : 'border-border bg-surface-2'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${isDamaged ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                      {idx + 1}
                    </div>
                    <div className="min-w-0">
                      {isDamaged ? (
                        <>
                          <p className="text-sm font-bold text-text-primary">
                            {categoryLabel(r.analysis.damage.category)}
                            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full border ${sev.badge}`}>{sev.label}</span>
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

                          {/* eBay Spare Parts Link Button */}
                          <div className="mt-3">
                            <a
                              href={ebayUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm"
                            >
                              Trova ricambio su eBay <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <p className="text-sm font-semibold text-emerald-700">Nessun danno esterno evidente</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setResults((prev) => prev.filter((item) => item.id !== r.id))}
                    className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-text-tertiary hover:text-rose-600 hover:bg-rose-50 transition-colors"
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
      {verdictInfo && (
        <div className={`rounded-2xl border ${verdictInfo.borderColor} ${verdictInfo.bgColor} p-5 space-y-4`}>
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${verdictInfo.verdict === 'repair' ? 'bg-emerald-600 text-white' : verdictInfo.verdict === 'evaluate' ? 'bg-amber-500 text-white' : 'bg-rose-600 text-white'}`}>
              <VerdictIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold uppercase tracking-wider text-text-tertiary">Verdetto Conconvenienza</div>
              <div className={`mt-0.5 text-lg font-extrabold ${verdictInfo.color}`}>{verdictInfo.label}</div>
              <p className="mt-1 text-sm text-text-secondary leading-relaxed">{verdictInfo.description}</p>
            </div>
          </div>

          <div className="border-t border-black/5 pt-3">
            <p className="text-xs text-text-tertiary">
              <strong className="text-text-secondary">Nota Manodopera & Meccanica:</strong> Le stime coprono il valore medio dei pezzi di ricambio. Per interventi alla meccanica o al motore, è necessario calcolare anche la manodopera specializzata dell&apos;officina.
            </p>
          </div>
        </div>
      )}

      {/* Interactive AI Assistant Widget */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-bold text-blue-900">Chiedi all&apos;Esperto AI AutoEsperto</h3>
        </div>
        <p className="text-xs text-blue-700">
          Hai un dubbio su costi, sostituzione componenti o su come procedere? Fai una domanda live all&apos;AI:
        </p>

        {/* Quick chip buttons */}
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => askAiAssistant('Come posso capire se il faro va sostituito o solo lucidato?')}
            className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-blue-200 text-blue-800 hover:bg-blue-100 font-medium"
          >
            Faro opaco vs rotto
          </button>
          <button
            type="button"
            onClick={() => askAiAssistant('Come posso trovare il codice ricambio OEM esatto su eBay?')}
            className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-blue-200 text-blue-800 hover:bg-blue-100 font-medium"
          >
            Ricerca codici OEM eBay
          </button>
          <button
            type="button"
            onClick={() => askAiAssistant('Quali spie del cruscotto richiedono stop immediato?')}
            className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-blue-200 text-blue-800 hover:bg-blue-100 font-medium"
          >
            Spie pericolose
          </button>
        </div>

        {/* Input form */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Scrivi qui la tua domanda (es. quanto costa la manodopera?)"
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && askAiAssistant()}
            className="flex-1 text-xs px-3 py-2 rounded-lg border border-blue-200 bg-white focus:outline-none focus:border-blue-500"
          />
          <button
            type="button"
            onClick={() => askAiAssistant()}
            disabled={aiLoading}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors disabled:opacity-50"
          >
            {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* AI Answer Box */}
        {aiAnswer && (
          <div className="rounded-lg bg-white p-3 border border-blue-200 text-xs text-slate-800 space-y-1">
            <p className="font-bold text-blue-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Risposta dell&apos;Esperto:
            </p>
            <p className="leading-relaxed">{aiAnswer}</p>
          </div>
        )}
      </div>

      <p className="text-xs text-text-tertiary">
        Le foto non vengono pubblicate. I dati ricalcolati sono a scopo informativo e forniscono una stima di mercato indicativa.
      </p>
    </section>
  );
}
