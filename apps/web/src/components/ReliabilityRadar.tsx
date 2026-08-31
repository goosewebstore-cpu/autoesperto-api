'use client';

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Fuel, Cog, Zap, Activity, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { ReliabilityAnalysis } from '@autoesperto/types';

interface Props {
  categoryScores?: ReliabilityAnalysis['categoryScores'];
}

const CATEGORY_META = [
  {
    key: 'engine' as const,
    label: 'Motore & Meccanica',
    short: 'Motore',
    icon: Fuel,
    desc: 'Testata, turbina, distribuzione e iniezione',
  },
  {
    key: 'transmission' as const,
    label: 'Cambio & Frizione',
    short: 'Cambio',
    icon: Cog,
    desc: 'Frizione, volano bimassa, cambio manuale/automatico',
  },
  {
    key: 'electronics' as const,
    label: 'Elettronica & Sensori',
    short: 'Elettronica',
    icon: Zap,
    desc: 'Centraline, display, sensori e cablaggi',
  },
  {
    key: 'suspension' as const,
    label: 'Sospensioni & Freni',
    short: 'Sospensioni',
    icon: Activity,
    desc: 'Ammortizzatori, braccetti, dischi e pastiglie',
  },
  {
    key: 'body' as const,
    label: 'Carrozzeria & Struttura',
    short: 'Carrozzeria',
    icon: ShieldCheck,
    desc: 'Vernice, allineamento pannelli e ruggine/usura',
  },
];

function getScoreTone(score: number) {
  if (score >= 7.8) {
    return {
      status: 'Ottimo',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      bar: 'bg-emerald-500',
      iconColor: 'text-emerald-600',
    };
  }
  if (score >= 6.5) {
    return {
      status: 'Nella media',
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
      bar: 'bg-blue-500',
      iconColor: 'text-blue-600',
    };
  }
  if (score >= 5.0) {
    return {
      status: 'Attenzione',
      badge: 'bg-amber-50 text-amber-800 border-amber-200',
      bar: 'bg-amber-500',
      iconColor: 'text-amber-600',
    };
  }
  return {
    status: 'Rischio elevato',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    bar: 'bg-rose-500',
    iconColor: 'text-rose-600',
  };
}

export default function ReliabilityRadar({ categoryScores }: Props) {
  if (!categoryScores) return null;

  const data = CATEGORY_META.map((cat) => ({
    subject: cat.short,
    score: categoryScores[cat.key] || 7.0,
    fullMark: 10,
  }));

  const avgScore = (
    Object.values(categoryScores).reduce((a, b) => a + (b || 7), 0) /
    Math.max(1, Object.values(categoryScores).length)
  ).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header with average reliability badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            Analisi Affidabilità per Componente Meccanico
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Indice di durata, frequenza guasti storici e costi medi di ripristino su scala da 0 a 10.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 font-bold text-xs">
          <span>Media Veicolo:</span>
          <strong className="text-sm font-black text-blue-700">{avgScore}/10</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Radar Graphic Chart (5 cols) */}
        <div className="lg:col-span-5 bg-slate-50/70 rounded-2xl p-4 border border-slate-200/80 flex flex-col items-center justify-center">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Mappa Radiale Affidabilità
          </span>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data} margin={{ top: 12, right: 20, bottom: 8, left: 20 }}>
                <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#334155', fontSize: 11, fontWeight: 700 }}
                />
                <PolarRadiusAxis domain={[0, 10]} tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #e2e8f0',
                    fontSize: 12,
                    fontWeight: 700,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                  formatter={(value) => [`${value}/10`, 'Score']}
                />
                <Radar
                  name="Affidabilità"
                  dataKey="score"
                  stroke="#2563eb"
                  fill="#3b82f6"
                  fillOpacity={0.35}
                  strokeWidth={2.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5 Component Breakdown Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-2.5">
          {CATEGORY_META.map((cat) => {
            const score = categoryScores[cat.key] ?? 7.0;
            const tone = getScoreTone(score);
            const Icon = cat.icon;
            const pct = Math.min(100, Math.max(0, (score / 10) * 100));

            return (
              <div
                key={cat.key}
                className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-slate-100 grid place-items-center shrink-0">
                      <Icon className={`w-3.5 h-3.5 ${tone.iconColor}`} />
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        {cat.label}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {cat.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tone.badge}`}>
                      {tone.status}
                    </span>
                    <span className="text-sm font-black text-slate-900 number-mono">
                      {score.toFixed(1)}/10
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                  <div
                    className={`h-full rounded-full ${tone.bar} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}