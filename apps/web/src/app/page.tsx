'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Car, CheckCircle2, ChevronRight, Search } from 'lucide-react';
import type { AutoReport } from '@autoesperto/types';
import SearchForm from '@/components/SearchForm';
import ReportView from '@/components/ReportView';
import CarFinder from '@/components/CarFinder';
import { analyzeVehicle, type AnalyzePayload } from '@/lib/api';
import { POPULAR_MODELS, slugify } from '@/lib/catalogo';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [prefill, setPrefill] = useState<AnalyzePayload | null>(null);
  const params = useSearchParams();
  const prefilledRef = usePrefilled(params);

  useEffect(() => {
    if (prefilledRef.current) {
      setPrefill(prefilledRef.current);
      void handleAnalyze(prefilledRef.current);
      prefilledRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnalyze = async (payload: AnalyzePayload) => {
    setLoading(true); setError('');
    try {
      const result = await analyzeVehicle(payload);
      if (result.success) { setReport(result.report); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    } catch (err: any) {
      setError(err.message || 'Non riesco a creare il report. Riprova tra poco.');
    } finally { setLoading(false); }
  };

  const handleBack = () => { setReport(null); setError(''); };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-white/90 backdrop-blur-lg">
        <div className="max-w-5xl mx-auto flex h-16 items-center justify-between px-5">
          <button onClick={handleBack} className="flex items-center gap-2.5" aria-label="Torna alla ricerca">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent"><Car className="h-4 w-4 text-white" /></span>
            <span className="text-lg font-bold tracking-tight text-text-primary">Auto<span className="text-accent">Esperto</span></span>
          </button>
          {!report && <nav className="hidden sm:flex items-center gap-5 text-sm font-semibold text-text-secondary"><a href="#ricerca" className="hover:text-accent">Analizza</a><a href="#trova-auto" className="hover:text-accent">Trova un’auto</a><a href="#modelli" className="hover:text-accent">Modelli</a></nav>}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5">
        {report ? <div className="pt-6"><ReportView report={report} onBack={handleBack} /></div> : (
          <div className="animate-fade-in">
            <section className="mx-auto max-w-2xl pt-14 pb-8 text-center md:pt-20">
              <p className="mb-3 text-sm font-bold text-accent">AUTOESPERTO</p>
              <h1 className="text-4xl font-extrabold tracking-tight text-text-primary md:text-5xl">Sai cosa stai comprando.</h1>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-text-secondary md:text-lg">Riconosci l’auto da una foto oppure analizza marca e modello prima di chiamare il venditore.</p>
            </section>

            <section id="ricerca" className="mx-auto max-w-2xl pb-8"><SearchForm key={prefill ? 'prefilled' : 'initial'} onAnalyze={handleAnalyze} loading={loading} initialMode={prefill ? 'model' : 'photo'} initialMake={prefill?.make} initialModel={prefill?.model} initialYear={prefill?.year ? String(prefill.year) : undefined} initialKm={prefill?.km ? String(prefill.km) : undefined} initialPrice={prefill?.requestedPrice ? String(prefill.requestedPrice) : undefined} />
              {error && <div role="alert" className="mt-4 rounded-xl border border-danger/20 bg-danger-light px-5 py-4 text-center text-sm font-semibold text-danger">{error}</div>}
            </section>

            <section className="grid gap-3 border-y border-border/70 py-7 sm:grid-cols-3">
              {[['Prezzo', 'Capisci se l’annuncio è in linea.'], ['Problemi', 'Sai cosa chiedere al venditore.'], ['Alternative', 'Confronta auto nella stessa fascia.']].map(([title, text]) => <div key={title} className="flex gap-3 px-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" /><div><p className="text-sm font-bold text-text-primary">{title}</p><p className="mt-0.5 text-sm text-text-secondary">{text}</p></div></div>)}
            </section>

            <div id="trova-auto"><CarFinder /></div>

            <section id="modelli" className="border-t border-border/70 py-12 md:py-16">
              <div className="mb-6 flex items-end justify-between gap-4"><div><h2 className="text-2xl font-bold text-text-primary">Esplora per modello</h2><p className="mt-1 text-sm text-text-secondary">Apri il report del modello che stai valutando.</p></div><a href="/valutazione/" className="hidden text-sm font-semibold text-accent hover:underline sm:block">Tutte le marche</a></div>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">{POPULAR_MODELS.slice(0, 18).map((item) => <a key={`${item.make}-${item.model}`} href={`/valutazione/${slugify(item.make)}/${slugify(item.model)}/`} className="flex items-center justify-between gap-2 rounded-xl border border-border bg-white px-3.5 py-3 text-sm font-semibold text-text-primary transition-colors hover:border-accent/40 hover:bg-accent-light"><span className="truncate">{item.model.toLowerCase().startsWith(item.make.toLowerCase()) ? item.model : `${item.make} ${item.model}`}</span><ChevronRight className="h-4 w-4 shrink-0 text-text-tertiary" /></a>)}</div>
              <a href="/valutazione/" className="mt-5 inline-flex text-sm font-semibold text-accent hover:underline sm:hidden">Tutte le marche</a>
            </section>
          </div>
        )}
      </main>

      <footer className="mt-10 border-t border-border/70"><div className="max-w-5xl mx-auto px-5 py-7 text-center text-xs text-text-tertiary">AutoEsperto fornisce indicazioni sul modello: controlla sempre l’esemplare specifico prima dell’acquisto.</div></footer>
    </div>
  );
}
