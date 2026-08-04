'use client';

import { Camera, Loader2, Search, Calculator } from 'lucide-react';

const PHASES = [
  { icon: Camera, label: 'Analizzo l\'immagine…' },
  { icon: Search, label: 'Cerco annunci simili sul mercato…' },
  { icon: Calculator, label: 'Calcolo costi e affidabilità…' },
];

export default function AnalysisSkeleton() {
  return (
    <div className="mx-auto animate-fade-in px-5 py-8">
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          <div>
            <p className="text-sm font-extrabold text-slate-950">Stiamo analizzando l'auto</p>
            <p className="text-xs text-slate-500">Qualche secondo e avrai il report completo.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="h-3 w-1/2 rounded bg-slate-200 animate-pulse" />
            <div className="mt-4 h-6 w-2/3 rounded bg-slate-100 animate-pulse" />
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="h-72 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="h-4 w-1/3 rounded bg-slate-200 animate-pulse" />
          <div className="mt-6 h-56 rounded-xl bg-slate-100 animate-pulse" />
        </div>
        <div className="h-72 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="h-4 w-1/2 rounded bg-slate-200 animate-pulse" />
          <div className="mt-6 space-y-3">
            {PHASES.map((phase, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-500">
                <phase.icon className="h-3.5 w-3.5 animate-pulse text-slate-400" />
                <span className={`animate-pulse ${idx === 0 ? 'font-semibold' : 'opacity-60'}`}>{phase.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}