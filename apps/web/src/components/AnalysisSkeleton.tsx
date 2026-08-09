'use client';

import { useState, useEffect } from 'react';
import { Camera, Search, Calculator, Shield, Check, Loader2 } from 'lucide-react';

const PHASES = [
  { icon: Camera, label: 'Foto ricevuta', delay: 0 },
  { icon: Search, label: 'Identificazione del veicolo', delay: 1200 },
  { icon: Calculator, label: 'Valutazione del mercato', delay: 2800 },
  { icon: Shield, label: 'Controllo affidabilità', delay: 4200 },
];

export default function AnalysisSkeleton() {
  const [completedPhases, setCompletedPhases] = useState(0);

  useEffect(() => {
    const timers = PHASES.map((phase, index) =>
      setTimeout(() => setCompletedPhases(index + 1), phase.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="mx-auto max-w-md animate-fade-in px-5 py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <div className="flex items-center gap-3 mb-6">
          <Loader2 className="h-5 w-5 animate-spin text-accent" />
          <div>
            <p className="text-sm font-extrabold text-slate-950">Analisi in corso…</p>
            <p className="text-xs text-slate-500">Qualche secondo e avrai il risultato.</p>
          </div>
        </div>

        <div className="space-y-3">
          {PHASES.map((phase, index) => {
            const Icon = phase.icon;
            const isDone = index < completedPhases;
            const isCurrent = index === completedPhases - 1 && completedPhases < PHASES.length;
            return (
              <div
                key={index}
                className={`flex items-center gap-3 text-sm transition-all duration-300 ${
                  isDone ? 'text-text-primary' : 'text-text-tertiary'
                }`}
              >
                <span className={`grid h-7 w-7 place-items-center rounded-full transition-all duration-300 ${
                  isDone ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                }`}>
                  {isDone ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                </span>
                <span className={`font-semibold ${isDone ? 'text-text-primary' : ''}`}>
                  {isDone ? '✓ ' : ''}{phase.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}