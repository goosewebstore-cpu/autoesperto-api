'use client';

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import type { ReliabilityAnalysis } from '@autoesperto/types';

interface Props {
  categoryScores?: ReliabilityAnalysis['categoryScores'];
}

const AXIS_LABELS: Array<[keyof NonNullable<ReliabilityAnalysis['categoryScores']>, string]> = [
  ['engine', 'Motore'],
  ['transmission', 'Cambio'],
  ['electronics', 'Elettronica'],
  ['suspension', 'Sospensioni'],
  ['body', 'Carrozzeria'],
];

export default function ReliabilityRadar({ categoryScores }: Props) {
  if (!categoryScores) return null;

  const data = AXIS_LABELS.map(([key, label]) => ({
    subject: label,
    score: categoryScores[key],
    fullMark: 10,
  }));

  return (
    <div className="w-full">
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} margin={{ top: 16, right: 24, bottom: 8, left: 24 }}>
            <PolarGrid stroke="#E2E8F0" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }} />
            <PolarRadiusAxis domain={[0, 10]} tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 13, fontWeight: 600 }}
              formatter={(value) => [`${value}/10`, 'Affidabilità']}
            />
            <Radar name="Affidabilità" dataKey="score" stroke="#2563EB" fill="#2563EB" fillOpacity={0.28} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}