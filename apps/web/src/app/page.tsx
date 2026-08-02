'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Car, CheckCircle2 } from 'lucide-react';
import type { AutoReport } from '@autoesperto/types';
import ReportView from '@/components/ReportView';
import VehicleScanner from '@/components/VehicleScanner';
import { analyzeVehicle, type AnalyzePayload } from '@/lib/api';

function usePrefilled(params: URLSearchParams) {
  const ref = useRef<AnalyzePayload | null>(null);
  if (ref.current === null) {
    const make = params.get('make');
    const model = params.get('model');
    if (make && model) {
      const year = params.get('year');
      const km = params.get('km');
      const price = params.get('price');
      ref.current = { make, model, year: year ? Number(year) || undefined : undefined, km: km ? Number(km) || undefined : undefined, requestedPrice: price ? Number(price) || undefined : undefined };
    }
  }
  return ref;
}

export default function Home() {
  return <Suspense fallback={null}><HomeContent /></Suspense>;
}

function HomeContent() {
  const [report, setReport] = useState<AutoReport | null>(null);
  const [error, setError] = useState('');
  const [scannerKey, setScannerKey] = useState(0);
  const params = useSearchParams();
  const prefilledRef = usePrefilled(params);

  useEffect(() => {
    if (prefilledRef.current) {
      void handleAnalyze(prefilledRef.current);
      prefilledRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnalyze = async (payload: AnalyzePayload) => {
    setError('');
    try {
      const result = await analyzeVehicle(payload);
      if (result.success) { setReport(result.report); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    } catch (err: any) {
      setError(err.message || 'Non riesco a creare il report. Riprova tra poco.');
    }
  };

  const handleBack = () => { setReport(null); setError(''); setScannerKey((value) => value + 1); };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-white/90 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <button onClick={handleBack} className="flex items-center gap-2.5" aria-label="Torna alla home">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent"><Car className="h-4 w-4 text-white" /></span>
            <span className="text-lg font-bold tracking-tight text-text-primary">Auto<span className="text-accent">Esperto</span></span>
          </button>
          {!report && <div className="flex items-center gap-2 text-xs font-semibold text-text-tertiary"><span className="h-2 w-2 rounded-full bg-success" /> AI pronta</div>}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5">
        {report ? <div className="pt-6"><ReportView report={report} onBack={handleBack} /></div> : (
          <div className="animate-fade-in">
            <VehicleScanner key={scannerKey} />
            {error && <div role="alert" className="mb-6 rounded-xl border border-danger/20 bg-danger-light px-5 py-4 text-center text-sm font-semibold text-danger">{error}</div>}
            <section className="grid gap-4 border-y border-border/70 py-8 sm:grid-cols-3">
              {[['Una foto', 'Nessun modulo lungo da compilare.'], ['Un’analisi', 'Identità, stato e valore in un solo flusso.'], ['Risultati trasparenti', 'Stime e livello di affidabilità sempre visibili.']].map(([title, text]) => <div key={title} className="flex gap-3 px-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" /><div><p className="text-sm font-bold text-text-primary">{title}</p><p className="mt-0.5 text-sm text-text-secondary">{text}</p></div></div>)}
            </section>
          </div>
        )}
      </main>

      <footer className="mt-8 border-t border-border/70"><div className="mx-auto max-w-6xl px-5 py-7 text-center text-xs text-text-tertiary">Le stime di AutoEsperto sono indicative. Danni nascosti o meccanici richiedono sempre un controllo professionale.</div></footer>
    </div>
  );
}
