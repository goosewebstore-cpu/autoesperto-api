'use client';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { PriceAnalysis, ReliabilityAnalysis } from '@autoesperto/types';

interface Props {
  price: PriceAnalysis;
  reliability: ReliabilityAnalysis;
}

export default function DepreciationChart({ price, reliability }: Props) {
  const startValue = price.estimatedValue;
  const v1 = Math.max(0, startValue - reliability.futureCosts.depreciation1Year);
  const v3 = Math.max(0, startValue - reliability.futureCosts.depreciation3Years);
  const v5 = Math.max(0, startValue - reliability.futureCosts.depreciation5Years);

  const data = [
    { label: 'Oggi', value: startValue },
    { label: '+1 anno', value: v1 },
    { label: '+3 anni', value: v3 },
    { label: '+5 anni', value: v5 },
  ];

  const fmt = (v: number) => v.toLocaleString('it-IT');

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 16, right: 24, left: 8, bottom: 8 }}>
          <defs>
            <linearGradient id="depreciationGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.45} />
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${Number(v).toLocaleString('it-IT')}`} width={56} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 13, fontWeight: 600 }}
            formatter={(value) => [`${fmt(Number(value))} €`, 'Valore stimato']}
            labelFormatter={(label) => `Attualizzato: ${label}`}
          />
          <Area type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={2} fill="url(#depreciationGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}