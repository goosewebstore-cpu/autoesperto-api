'use client';

import { useMemo } from 'react';
import type { AutoReport } from '@autoesperto/types';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Wrench,
  Zap,
  Gauge,
  Sliders,
  Car,
  ChevronRight,
  Info,
} from 'lucide-react';
import { computeVehicleHealth, type VehicleHealthData } from '@/lib/healthScore';

interface Props {
  report: AutoReport;
}

export default function VehicleHealthScore({ report }: Props) {
  const health = useMemo<VehicleHealthData>(() => computeVehicleHealth(report), [report]);

  const toneBarColor: Record<string, string> = {
    good: 'bg-emerald-500',
    fair: 'bg-amber-500',
    warn: 'bg-rose-500',
  };

  const toneBadgeColor: Record<string, string> = {
    good: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    fair: 'bg-amber-50 text-amber-800 border-amber-200',
    warn: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const getSubsystemIcon = (key: string) => {
    switch (key) {
      case 'engine':
        return Wrench;
      case 'transmission':
        return Sliders;
      case 'brakes':
        return Gauge;
      case 'electric':
        return Zap;
      default:
        return Car;
    }
  };

  return (
    <section className="bg-surface rounded-2xl shadow-card border border-border p-4 sm:p-6" aria-label="Health Score del Veicolo">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 grid place-items-center shrink-0">
              <Activity className="w-4.5 h-4.5" />
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-text-primary flex items-center gap-2">
                Health Score Veicolo
              </h2>
              <p className="text-xs text-text-secondary">
                Diagnosi dello stato di salute meccanica e usura dei componenti
              </p>
            </div>
          </div>
        </div>

        {/* Global Health Badge */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          <div className="text-right">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Indice di salute</span>
            <span className="text-xl sm:text-2xl font-black text-text-primary number-mono">
              {health.overallScore}<span className="text-xs text-text-tertiary font-bold">/100</span>
            </span>
          </div>
          <span className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border shadow-2xs ${health.badgeColor} flex items-center gap-1.5`}>
            <span className={`w-2 h-2 rounded-full ${health.tone === 'good' ? 'bg-emerald-500' : health.tone === 'fair' ? 'bg-amber-500' : 'bg-rose-500'} animate-pulse`} />
            {health.statusLabel}
          </span>
        </div>
      </div>

      {/* Diagnostic summary */}
      <div className="mt-4 p-3.5 rounded-xl bg-surface-2/70 border border-border text-xs text-text-secondary leading-relaxed">
        <strong className="text-text-primary font-bold">Diagnosi sintetica: </strong>
        {health.summary}
      </div>

      {/* Subsystem Health Progress Bars */}
      <div className="mt-5 space-y-3">
        <span className="block text-xs font-extrabold uppercase tracking-wider text-text-tertiary">
          Stato di salute per sottosistema
        </span>

        <div className="grid gap-2.5 sm:grid-cols-2">
          {health.subsystems.map((sub) => {
            const Icon = getSubsystemIcon(sub.key);
            const barColor = toneBarColor[sub.tone];
            const badgeColor = toneBadgeColor[sub.tone];

            return (
              <div
                key={sub.key}
                className="rounded-xl p-3 border border-border bg-surface-2/40 hover:bg-surface-2/80 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon className="w-3.5 h-3.5 text-brand shrink-0" />
                    <span className="text-xs font-bold text-text-primary truncate">{sub.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-extrabold text-text-primary number-mono">{sub.score}%</span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${badgeColor}`}>
                      {sub.status}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
                  <div
                    className={`h-full rounded-full ${barColor} transition-all duration-700 ease-out`}
                    style={{ width: `${Math.max(8, sub.score)}%` }}
                  />
                </div>

                <p className="text-[11px] text-text-secondary mt-1.5 truncate">
                  {sub.note}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommended Check Alert */}
      <div className="mt-4 flex items-start gap-2.5 p-3 rounded-xl bg-blue-50/70 border border-blue-200/70 text-xs text-blue-950">
        <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong>Controllo preventivo consigliato: </strong>
          <span>{health.recommendedCheck}</span>
        </div>
      </div>
    </section>
  );
}
