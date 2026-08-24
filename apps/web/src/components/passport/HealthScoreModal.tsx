'use client';

import {
  Gauge,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Wrench,
  ShieldCheck,
  Info,
  X,
  Sparkles,
} from 'lucide-react';
import type { VehicleHealthBreakdown } from '@autoesperto/types';

interface HealthScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  breakdown: VehicleHealthBreakdown;
  carName: string;
}

export default function HealthScoreModal({
  isOpen,
  onClose,
  breakdown,
  carName,
}: HealthScoreModalProps) {
  if (!isOpen) return null;

  const categories = [
    { label: 'Manutenzione Ordinaria', score: breakdown.maintenanceScore, desc: 'Fatture e regolarità degli interventi eseguiti' },
    { label: 'Documentazione & Libretto', score: breakdown.documentationScore, desc: 'Presenza Documento Unico e polizze verificate' },
    { label: 'Chilometraggio & Anzianità', score: breakdown.mileageScore, desc: 'Percorrenza chilometrica ponderata per anno' },
    { label: 'Carrozzeria & Danni', score: breakdown.bodyConditionScore, desc: 'Stato vernice, assenza graffi profondi e ammaccature' },
    { label: 'Interni & Rivestimenti', score: breakdown.interiorScore, desc: 'Stato sedili, volante, plastiche e comandi' },
    { label: 'Pneumatici & Freni', score: breakdown.tiresScore, desc: 'Usura battistrada e sostituzioni registrate' },
    { label: 'Affidabilità Storica Modello', score: breakdown.modelReliabilityScore, desc: 'Banca dati AutoEsperto su frequenza guasti' },
    { label: 'Scadenze & Revisione', score: breakdown.deadlinesScore, desc: 'Stato bollo, revisione e assicurazione in regola' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-blue-600 text-white shadow-xs">
              <Gauge className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Vehicle Health Score™ — Dettaglio Punteggio
              </h2>
              <p className="text-[11px] text-slate-500">{carName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Main Score Hero */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md shadow-blue-600/20">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200">
                Punteggio Complessivo Stato
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-4xl font-black">{breakdown.totalScore}</span>
                <span className="text-sm font-bold text-blue-200">/ 100 · {breakdown.label}</span>
              </div>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-white/15 backdrop-blur-xs text-xs font-bold border border-white/20">
              {breakdown.label === 'OTTIMO' ? '🌟 Condizioni Top' : '✅ Buono Stato'}
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {breakdown.verdictNote}
          </p>

          {/* Breakdown Rows */}
          <div className="space-y-3 pt-1">
            {categories.map((cat) => (
              <div key={cat.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span>{cat.label}</span>
                  <span className="text-blue-600 dark:text-blue-400 font-mono">{cat.score}/100</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      cat.score >= 85
                        ? 'bg-emerald-500'
                        : cat.score >= 70
                        ? 'bg-blue-600'
                        : cat.score >= 55
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${cat.score}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400">{cat.desc}</p>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-3.5 border border-slate-200/80 dark:border-slate-700 flex items-start gap-2 text-[11px] text-slate-500 leading-relaxed">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              Il punteggio è una stima algoritmica AutoEsperto basata sui dati inseriti, scansioni visive e storico disponibile.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
}
