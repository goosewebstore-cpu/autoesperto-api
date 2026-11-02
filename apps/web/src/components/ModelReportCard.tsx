'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, ArrowRight, Check, Loader2, Search } from 'lucide-react';
import type { ReportPreview } from '@autoesperto/types';
import { analyzeVehicle } from '@/lib/api';

interface ModelReportCardProps {
  make: string;
  model: string;
  year?: number;
  isLoading?: boolean;
  hasError?: boolean;
}

function euro(value: number) { return value.toLocaleString('it-IT') + ' €'; }

export default function ModelReportCard({ make, model, year, isLoading, hasError }: ModelReportCardProps) {
  const [preview, setPreview] = useState<ReportPreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    if (isLoading || hasError) { setPreview(null); setLoading(false); return; }
    setLoading(true); setError(false); setPreview(null);
    analyzeVehicle({ make, model, ...(year ? { year } : {}) })
      .then(({ preview: result }) => { if (active) setPreview(result); })
      .catch(() => { if (active) setError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [make, model, year, isLoading, hasError]);

  if (error || hasError) return null;
  return (
    <section className="rounded-2xl border border-border bg-white p-5 shadow-card sm:p-6" aria-label={`Anteprima gratuita per ${make} ${model}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><p className="text-xs font-bold uppercase tracking-widest text-blue-700">Anteprima gratuita</p><h2 className="mt-1 text-lg font-extrabold text-text-primary">{make} {model}{year ? ` ${year}` : ''}</h2><p className="mt-1 text-sm text-text-secondary">Una prima indicazione sui dati disponibili. Il report completo aggiunge l’approfondimento.</p></div>
        {!loading && preview && <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">Affidabilità {preview.confidence}</span>}
      </div>
      {loading ? <div className="flex items-center gap-2 py-8 text-sm text-text-secondary"><Loader2 className="h-4 w-4 animate-spin text-accent" />Preparo l’anteprima…</div> : preview ? <div className="mt-5 space-y-4">
        {preview.marketRange ? <div className="rounded-xl border border-blue-100 bg-blue-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-blue-800">Fascia degli annunci comparabili</p><p className="mt-1 text-2xl font-black text-slate-950">{euro(preview.marketRange.min)} – {euro(preview.marketRange.max)}</p><p className="mt-1 text-xs leading-5 text-slate-600">La fascia compare solo quando anno e annunci disponibili sono sufficientemente confrontabili.</p></div> : <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"><p className="font-bold">Non ho abbastanza confronti affidabili per indicare una fascia.</p><p className="mt-1">Aggiungi prezzo, anno e chilometri quando analizzi un’auto specifica.</p></div>}
        {preview.firstCheck && <p className="flex items-start gap-2 text-sm leading-6 text-text-secondary"><Check className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />{preview.firstCheck}</p>}
        {preview.limitations.map((item) => <p key={item} className="flex items-start gap-2 text-xs leading-5 text-text-tertiary"><AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />{item}</p>)}
        <a href="/#scanner-section" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-700 px-4 text-sm font-bold text-white">Controlla un’auto specifica <Search className="h-4 w-4" /><ArrowRight className="h-4 w-4" /></a>
      </div> : null}
    </section>
  );
}
