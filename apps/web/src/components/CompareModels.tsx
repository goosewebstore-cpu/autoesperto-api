'use client';

import { useState, useMemo } from 'react';
import { GitCompareArrows } from 'lucide-react';
import ModelReportCard from '@/components/ModelReportCard';
import { getAllMakes } from '@/lib/catalogo';
import type { AutoReport } from '@autoesperto/types';

const defaultLeft = 'Fiat|Panda';
const defaultRight = 'Toyota|Yaris';

function splitModel(value: string) {
  const [make, model] = value.split('|');
  return { make, model };
}

function modelLabel(make: string, model: string) {
  return model.toLowerCase().startsWith(make.toLowerCase()) ? model : `${make} ${model}`;
}

export default function CompareModels({
  initialLeftReport,
  initialRightReport
}: {
  initialLeftReport?: AutoReport;
  initialRightReport?: AutoReport;
}) {
  const [left, setLeft] = useState(defaultLeft);
  const [right, setRight] = useState(defaultRight);
  const leftModel = splitModel(left);
  const rightModel = splitModel(right);

  const allModels = useMemo(() => {
    const list: { make: string; model: string; label: string }[] = [];
    getAllMakes().forEach((m) => {
      m.models.forEach((mod) => {
        list.push({ make: m.name, model: mod, label: modelLabel(m.name, mod) });
      });
    });
    // Sort alphabetically by label
    return list.sort((a, b) => a.label.localeCompare(b.label));
  }, []);

  return (
    <div>
      <div className="bg-surface-2 rounded-2xl border border-border p-5 md:p-6">
        <div className="flex items-center gap-2 text-sm font-bold text-text-primary mb-4">
          <GitCompareArrows className="w-4 h-4 text-accent" />
          Scegli due modelli
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {[{ label: 'Primo modello', value: left, onChange: setLeft }, { label: 'Secondo modello', value: right, onChange: setRight }].map((field) => (
            <label key={field.label} className="text-sm font-semibold text-text-primary flex flex-col">
              {field.label}
              <select value={field.value} onChange={(event) => field.onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/30 max-h-48 overflow-y-auto">
                {allModels.map((item) => (
                  <option key={`${item.make}|${item.model}`} value={`${item.make}|${item.model}`}>{item.label}</option>
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
