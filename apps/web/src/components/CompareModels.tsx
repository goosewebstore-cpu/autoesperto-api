'use client';

import { useState } from 'react';
import { GitCompareArrows } from 'lucide-react';
import ModelReportCard from '@/components/ModelReportCard';
import { POPULAR_MODELS } from '@/lib/catalogo';

const defaultLeft = 'Fiat|Panda';
const defaultRight = 'Toyota|Yaris';

function splitModel(value: string) {
  const [make, model] = value.split('|');
  return { make, model };
}

export default function CompareModels() {
  const [left, setLeft] = useState(defaultLeft);
  const [right, setRight] = useState(defaultRight);
  const leftModel = splitModel(left);
  const rightModel = splitModel(right);

  return (
    <div>
      <div className="bg-surface-2 rounded-2xl border border-border p-5 md:p-6">
        <div className="flex items-center gap-2 text-sm font-bold text-text-primary mb-4">
          <GitCompareArrows className="w-4 h-4 text-accent" />
          Scegli due modelli
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {[{ label: 'Primo modello', value: left, onChange: setLeft }, { label: 'Secondo modello', value: right, onChange: setRight }].map((field) => (
            <label key={field.label} className="text-sm font-semibold text-text-primary">
              {field.label}
              <select value={field.value} onChange={(event) => field.onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/30">
                {POPULAR_MODELS.map((item) => (
                  <option key={`${item.make}|${item.model}`} value={`${item.make}|${item.model}`}>{item.make} {item.model}</option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-5 mt-6">
        <ModelReportCard make={leftModel.make} model={leftModel.model} />
        <ModelReportCard make={rightModel.make} model={rightModel.model} />
      </div>
    </div>
  );
}
