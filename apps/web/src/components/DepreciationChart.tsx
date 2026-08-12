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
    <div className="h-60 w-full bg-white p-3 rounded-xl border border-border shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 16, right: 24, left: 12, bottom: 8 }}>
          <defs>
            <linearGradient id="depreciationGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4285F4" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#4285F4" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: '#334155', fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${Number(v).toLocaleString('it-IT')} €`} width={65} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: 13, fontWeight: 700, backgroundColor: '#FFFFFF' }}
            formatter={(value) => [`${fmt(Number(value))} €`, 'Valore stimato']}
            labelFormatter={(label) => `Orizzonte temporale: ${label}`}
          />
          <Area type="monotone" dataKey="value" stroke="#4285F4" strokeWidth={3} activeDot={{ r: 6, fill: '#4285F4', stroke: '#FFFFFF', strokeWidth: 2 }} fill="url(#depreciationGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}