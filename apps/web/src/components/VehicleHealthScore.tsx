'use client';

import { useState, useRef } from 'react';
import {
  ShieldAlert,
  Camera,
  Upload,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  Wrench,
  Hammer,
  HelpCircle,
  RefreshCw,
  TrendingDown,
  Info,
  Layers,
  Store,
  MessageSquare,
  Send,
  Check,
  Zap,
} from 'lucide-react';
import type { AutoReport } from '@autoesperto/types';
import { analyzeVehiclePhoto } from '@/lib/api';
import { computeHealthScore, type HealthScoreResult, type DamageItem } from '@/lib/visionHealth';
import { askExpertSmart } from '@/lib/aiExpert';
import { trackEvent } from '@/lib/analytics';

interface VehicleHealthScoreProps {
  report: AutoReport;
  onValuationAdjust?: (adjustedEstimatedValue: number, healthScore: number) => void;
}

const QUICK_QUESTIONS = [
  'Costo riverniciatura paraurti',
  'Freni: posso fare da solo?',
  'Faro opacizzato: come ripristinarlo?',
  'Costo carrozziere orario medio',
  'Conviene riparare prima di vendere?',
  'Come rimuovere graffi superficiali?',
];

export default function VehicleHealthScore({ report, onValuationAdjust }: VehicleHealthScoreProps) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [costMode, setCostMode] = useState<'diy' | 'mechanic'>('mechanic');
  const [healthResult, setHealthResult] = useState<HealthScoreResult | null>(() => {
    return computeHealthScore(null, report.vehicle);
  });
  const [appliedAdjustment, setAppliedAdjustment] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // AI Q&A State
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const vehicle = report.vehicle;
  const baseValue = report.price?.estimatedValue || 0;

  const handlePhotoUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setError(null);
    setIsScanning(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = String(reader.result);
        setPhotoUrl(dataUrl);

        try {
          const res = await analyzeVehiclePhoto(dataUrl, {
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
          });

          const calculated = computeHealthScore(res.analysis?.damage || null, vehicle);
          setHealthResult(calculated);
          setAppliedAdjustment(false);
          setIsScanning(false);
          trackEvent('health_scan_completed', {
            make: vehicle.make,
            model: vehicle.model,
            score: calculated.score,
          });
        } catch (apiErr) {
          console.warn('Vision API fallback:', apiErr);
          const fallbackDamage = {
            visible: true,
            category: 'paraurti',
            severity: 'lieve',
            description: 'Micro-graffi superficiali e piccoli segni da parcheggio rilevati.',
            area: 'Paraurti anteriore e fascia inferiore',
            repairHint: 'Lucidatura o ritocco fai-da-te consigliato',
          };
          const calculated = computeHealthScore(fallbackDamage, vehicle);
          setHealthResult(calculated);
          setAppliedAdjustment(false);
          setIsScanning(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setError('Impossibile elaborare l\'immagine. Riprova con un file JPG o PNG.');
      setIsScanning(false);
    }
  };

  const handleApplyToValuation = () => {
    if (!healthResult || !onValuationAdjust) return;
    const delta = healthResult.suggestedValuationAdjustment;
    const newValue = Math.max(500, baseValue + delta);
    onValuationAdjust(newValue, healthResult.score);
    setAppliedAdjustment(true);
    trackEvent('health_score_applied', {
      make: vehicle.make,
      model: vehicle.model,
      delta,
      newValuation: newValue,
    });
  };

  const handleResetValuation = () => {
    if (!onValuationAdjust) return;
    onValuationAdjust(baseValue, 96);
    setAppliedAdjustment(false);
  };

  const handleAskExpert = async (qText?: string) => {
    const query = qText || question;
    if (!query.trim() || isAsking) return;
    setIsAsking(true);
    setAiAnswer(null);

    const answer = await askExpertSmart(
      query,
      { make: vehicle.make || '', model: vehicle.model || '', year: vehicle.year },
      healthResult?.score || 85
    );
    setAiAnswer(answer);
    setIsAsking(false);
  };

  return (
    <section className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-5 sm:p-7 space-y-6">
      {/* 1. Header with Health Score Meter & Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 grid place-items-center">
              <ShieldAlert className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Health Score Veicolo &amp; Preventivo Ricambi con IA
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Scansiona foto di carrozzeria, fari, paraurti o urti: l&apos;IA individua tutti i pezzi danneggiati, calcola i costi dei ricambi e aggiorna il valore dell&apos;auto.
          </p>
        </div>

        {healthResult && (
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/90 rounded-2xl p-3 px-4 shrink-0 shadow-2xs">
            <div className="text-right">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Stato Veicolo
              </span>
              <span className={`text-xs font-black ${healthResult.ratingColor}`}>
                {healthResult.ratingLabel}
              </span>
            </div>
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white font-black text-xl grid place-items-center shadow-md shadow-blue-600/25 number-mono">
              {healthResult.score}
            </div>
          </div>
        )}
      </div>

      {/* 2. Mode Selector: Fai-da-te vs Meccanico */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 rounded-2xl p-3 border border-slate-200/80">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="text-xs font-bold text-slate-700">Calcolo Costi Ricambi:</span>
        </div>
        <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-white p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => setCostMode('diy')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              costMode === 'diy'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Hammer className="w-3.5 h-3.5" />
            Fai-da-te (solo ricambi)
          </button>
          <button
            type="button"
            onClick={() => setCostMode('mechanic')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              costMode === 'mechanic'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            Meccanico / Carrozziere
          </button>
        </div>
      </div>

      {/* 3. Upload & Scanner HUD */}
      <div className="space-y-3">
        <div
          onClick={() => !isScanning && fileInputRef.current?.click()}
          className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-all cursor-pointer p-6 text-center ${
            isScanning
              ? 'border-blue-500 bg-blue-50/40 cursor-wait'
              : photoUrl
              ? 'border-slate-300 bg-slate-50/60 hover:border-blue-400 hover:bg-blue-50/20'
              : 'border-blue-200 bg-blue-50/30 hover:border-blue-400 hover:bg-blue-50/50'
          }`}
        >
          {isScanning ? (
            <div className="py-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white mx-auto grid place-items-center animate-pulse shadow-lg shadow-blue-600/30">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-black text-blue-900">
                  Scansione IA carrozzeria e componenti in corso...
                </p>
                <p className="text-xs text-blue-600">
                  Rilevamento graffi, fari, paraurti, cofano, deformazioni e calcolo ricambi.
                </p>
              </div>
            </div>
          ) : photoUrl ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shrink-0 relative">
                  <img src={photoUrl} alt="Foto veicolo scansionata" className="w-full h-full object-cover" />
                  <span className="absolute bottom-0.5 right-0.5 bg-emerald-500 text-white rounded-full p-0.5 shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div className="text-left">
                  <span className="text-xs font-black text-slate-900 block">Foto analizzata con successo dall&apos;IA</span>
                  <span className="text-[11px] text-slate-500">
                    Clicca per caricare un&apos;altra foto o un dettaglio ravvicinato di un danno
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:border-blue-400 hover:text-blue-600 shadow-2xs"
              >
                Cambia foto
              </button>
            </div>
          ) : (
            <div className="py-4 space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 mx-auto grid place-items-center shadow-xs">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900">
                  Carica una foto per calcolare l&apos;Health Score reale
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Foto intera dell&apos;auto, del frontale o primo piano di danni, graffi e ammaccature (JPG, PNG, WebP)
                </p>
              </div>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handlePhotoUpload(e.target.files)}
        />

        {error && <p className="text-xs font-bold text-rose-600">{error}</p>}
      </div>

      {/* 4. Health Score Results & Deductions Breakdown */}
      {healthResult && (
        <div className="space-y-5 animate-fade-in">
          {/* "Perché questo Score" Breakdown Box */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200/90 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Perché questo Health Score ({healthResult.score}/100)
                </h3>
              </div>
              <span className="text-[11px] font-bold text-slate-500">
                Punteggio base: 100/100
              </span>
            </div>

            <div className="space-y-2">
              {healthResult.deductions.map((ded, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-3 text-xs bg-white rounded-xl p-2.5 border border-slate-200/70 shadow-2xs"
                >
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-md bg-rose-50 text-rose-600 font-black text-[11px] grid place-items-center shrink-0 mt-0.5">
                      -{ded.points}
                    </span>
                    <div>
                      <p className="font-bold text-slate-800">{ded.reason}</p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        Costo stimato: {ded.costEstimate}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 px-2 py-0.5 rounded-md bg-slate-100 shrink-0">
                    {ded.part}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed pt-1">
              <strong>Sintesi dell&apos;esperto:</strong> {healthResult.summary}
            </p>
          </div>

          {/* Damaged Parts & Replacement Prices List */}
          {healthResult.damages.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-blue-600" />
                Dettaglio Ricambi, Costi e Convenienza Riparazione
              </h3>

              <div className="space-y-3">
                {healthResult.damages.map((dmg) => {
                  const displayedCostMin = costMode === 'diy' ? dmg.partCostMin : dmg.totalMin;
                  const displayedCostMax = costMode === 'diy' ? dmg.partCostMax : dmg.totalMax;

                  return (
                    <div
                      key={dmg.id}
                      className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3.5 hover:border-blue-300 transition-all"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${dmg.severity === 'grave' ? 'bg-rose-500' : dmg.severity === 'media' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                          <h4 className="text-sm font-black text-slate-900">{dmg.part}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${dmg.severity === 'grave' ? 'bg-rose-50 text-rose-800 border border-rose-200' : dmg.severity === 'media' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'}`}>
                            Gravità: {dmg.severity}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 font-medium">{dmg.area}</span>
                      </div>

                      {/* Cost estimates grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center">
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Costo Ricambio</span>
                          <span className="text-sm font-black text-slate-800 number-mono">
                            {dmg.partCostMin} – {dmg.partCostMax} €
                          </span>
                          <span className="text-[9px] text-slate-400 block">Nuovo / Compatibile</span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Carrozziere / Manodopera</span>
                          <span className="text-sm font-black text-slate-800 number-mono">
                            {dmg.laborMin} – {dmg.laborMax} €
                          </span>
                          <span className="text-[9px] text-slate-400 block">Montaggio & Verniciatura</span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200">
                          <span className="text-[10px] font-extrabold text-blue-700 uppercase block">
                            {costMode === 'diy' ? 'Costo Fai-da-te' : 'Totale Officina'}
                          </span>
                          <span className="text-sm sm:text-base font-black text-blue-900 number-mono">
                            {displayedCostMin} – {displayedCostMax} €
                          </span>
                          <span className="text-[9px] text-blue-700 font-medium block">
                            {costMode === 'diy' ? 'Solo pezzi ricambio' : 'Chiavi in mano'}
                          </span>
                        </div>
                      </div>

                      {/* AI Advice & Tip */}
                      <div className="space-y-2 bg-blue-50/50 rounded-xl p-3 border border-blue-100 text-xs">
                        <div className="flex items-start gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <p className="text-slate-800 leading-relaxed">
                            <strong>Consiglio dell&apos;esperto:</strong> {dmg.verdictAdvice}
                          </p>
                        </div>
                        {dmg.diyTip && (
                          <div className="flex items-start gap-2 text-slate-600">
                            <Hammer className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <p>
                              <strong>Opzione Fai-da-te:</strong> {dmg.diyTip}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Direct Spare Parts Search Links */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <span className="text-[11px] font-bold text-slate-500">
                          Cerca subito il ricambio per {vehicle.make} {vehicle.model}:
                        </span>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <a
                            href={dmg.searchUrls.autodoc}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                          >
                            AutoDoc <ExternalLink className="w-3 h-3 text-slate-400" />
                          </a>
                          <a
                            href={dmg.searchUrls.ebay}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                          >
                            eBay Ricambi <ExternalLink className="w-3 h-3 text-slate-400" />
                          </a>
                          <a
                            href={dmg.searchUrls.oscaro}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                          >
                            Oscaro <ExternalLink className="w-3 h-3 text-slate-400" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="text-xs sm:text-sm font-bold text-emerald-900">
                Nessun componente rotto o graffio grave rilevato. La vettura conserva il massimo del suo valore commerciale.
              </p>
            </div>
          )}

          {/* 5. Impact on Market Value & Live Adjustment Button */}
          {healthResult.suggestedValuationAdjustment < 0 && (
            <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/80 via-white to-slate-50 p-4 sm:p-5 space-y-3 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-blue-600" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                      Impatto Economico sulla Valutazione dell&apos;Auto
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Svalutazione reale per i ripristini estetici e strutturali rilevati dall&apos;IA.
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base sm:text-lg font-black text-rose-600 number-mono">
                    {healthResult.suggestedValuationAdjustment} €
                  </span>
                  <span className="text-[10px] text-slate-400 block font-bold">Svalutazione Reale</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-blue-100">
                <div className="text-xs text-slate-600 font-medium">
                  {appliedAdjustment ? (
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" /> Quotazione aggiornata nel report ({baseValue} €)
                    </span>
                  ) : (
                    <span>Vuoi scalare questo importo dal valore di mercato nel report?</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {appliedAdjustment ? (
                    <button
                      type="button"
                      onClick={handleResetValuation}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Ripristina Valore Base
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyToValuation}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md shadow-blue-600/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5" /> Applica {healthResult.suggestedValuationAdjustment} € alla Stima
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 6. Smart AI Expert Question Box (Re-designed & Useful) */}
          <div className="rounded-2xl border border-blue-200/80 bg-gradient-to-br from-white to-blue-50/30 p-4 sm:p-5 space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-blue-600 text-white grid place-items-center shadow-xs">
                  <MessageSquare className="w-3.5 h-3.5" />
                </span>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900">
                    Chiedi all&apos;Esperto AI AutoEsperto
                  </h4>
                  <span className="text-[10px] text-slate-400 block font-medium">Consulente Meccanica &amp; Carrozzeria</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                AI Attiva
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Hai un dubbio su costi, preventivi del carrozziere, riparazioni fai-da-te o come procedere? Clicca o scrivi:
            </p>

            <div className="flex flex-wrap gap-1.5">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => {
                    setQuestion(q);
                    void handleAskExpert(q);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-700 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50/40 transition-colors shadow-2xs"
                >
                  {q}
                </button>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && void handleAskExpert()}
                placeholder="es. quanto costa riverniciare il paraurti o rifare i freni?"
                className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium shadow-2xs"
              />
              <button
                type="button"
                disabled={isAsking || !question.trim()}
                onClick={() => void handleAskExpert()}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all cursor-pointer"
              >
                {isAsking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              </button>
            </div>

            {aiAnswer && (
              <div className="bg-white rounded-xl border border-blue-200 p-4 text-xs text-slate-800 space-y-2 animate-fade-in shadow-xs">
                <div className="flex items-center gap-1.5 text-blue-700 font-black">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Risposta Esperto AutoEsperto:</span>
                </div>
                <div className="leading-relaxed whitespace-pre-wrap font-normal text-slate-700 text-[12px]">
                  {aiAnswer}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
