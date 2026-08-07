'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Car, CheckCircle2, UserRound } from 'lucide-react';
import type { AutoReport } from '@autoesperto/types';
import ReportView from '@/components/ReportView';
import VehicleScanner from '@/components/VehicleScanner';
import { analyzeVehicle, type AnalyzePayload } from '@/lib/api';
import { analysisOffer } from '@/lib/pricing';
import AdSlot from '@/components/AdSlot';
import GuideCard from '@/components/GuideCard';
import SiteFooter from '@/components/SiteFooter';
import { guides } from '@/lib/guides';

export type HomeInitialPayload = AnalyzePayload | null;

interface HomeClientProps {
  initialPayload: HomeInitialPayload;
}

export default function HomeClient({ initialPayload }: HomeClientProps) {
  const offer = analysisOffer();
  const latestGuides = [...guides].sort((a, b) => b.published.localeCompare(a.published)).slice(0, 4);
  const [report, setReport] = useState<AutoReport | null>(null);
  const [error, setError] = useState('');
  const [scannerKey, setScannerKey] = useState(0);
  const prefilledRef = useRef(initialPayload);

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
      if (result.success) {
        setReport(result.report);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      setError(message || 'Non riesco a creare il report. Riprova tra poco.');
    }
  };

  const handleBack = () => {
    setReport(null);
    setError('');
    setScannerKey((value) => value + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-white/90 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <button onClick={handleBack} className="flex items-center gap-2.5" aria-label="Torna alla home">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent"><Car className="h-4 w-4 text-white" /></span>
            <span className="text-lg font-bold tracking-tight text-text-primary">Auto<span className="text-accent">Esperto</span></span>
          </button>
          {!report && <Link href="/account" className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-xs font-bold text-text-primary transition hover:border-accent hover:text-accent"><UserRound className="h-4 w-4" /> Area personale</Link>}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5">
        {report ? <div className="pt-6"><ReportView report={report} onBack={handleBack} /></div> : (
          <div className="animate-fade-in">
            <VehicleScanner key={scannerKey} />
            {error && <div role="alert" className="mb-6 rounded-xl border border-danger/20 bg-danger-light px-5 py-4 text-center text-sm font-semibold text-danger">{error}</div>}
            <section className="grid gap-4 border-y border-border/70 py-8 sm:grid-cols-3" aria-label="Come funziona">
              <h2 className="sr-only">Come funziona AutoEsperto</h2>
              {[
                ['Una foto', 'Nessun modulo lungo da compilare.'],
                ['Un’analisi', 'Identità, stato e valore in un solo flusso.'],
                ['Risultati trasparenti', 'Stime e livello di affidabilità sempre visibili.'],
              ].map(([title, text]) => (
                <div key={title} className="flex gap-3.5 p-4 rounded-xl bg-white border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                  <div><p className="text-sm font-bold text-text-primary">{title}</p><p className="mt-0.5 text-xs leading-relaxed text-text-secondary">{text}</p></div>
                </div>
              ))}
            </section>
            <section className="py-10" aria-label="Perché scegliere AutoEsperto">
              <h2 className="text-center text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">Paghi una volta, ottieni un report completo</h2>
              <p className="mx-auto mt-2.5 max-w-2xl text-center text-sm text-text-secondary leading-relaxed">La prima analisi è gratuita. Per salvarla o conservarne altre, un pagamento singolo di {offer.displayPrice}{offer.promotional ? ` in promozione fino al ${offer.promoEndsLabel}` : ''} — niente abbonamento, niente rinnovi automatici.</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/50 p-6 text-center shadow-card hover:border-blue-200 transition-all">
                  <p className="text-3xl font-extrabold text-blue-600">{offer.displayPrice}</p>
                  <p className="mt-1.5 text-xs text-text-secondary font-medium">Pagamento una tantum per report completo{offer.promotional ? ` · promozione fino al ${offer.promoEndsLabel}` : ''}</p>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/50 p-6 text-center shadow-card hover:border-blue-200 transition-all">
                  <p className="text-3xl font-extrabold text-blue-600">GDPR</p>
                  <p className="mt-1.5 text-xs text-text-secondary font-medium">Consenso cookie esplicito e privacy by design</p>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/50 p-6 text-center shadow-card hover:border-blue-200 transition-all">
                  <p className="text-3xl font-extrabold text-blue-600">Stripe</p>
                  <p className="mt-1.5 text-xs text-text-secondary font-medium">Pagamenti sicuri, dati carta mai conservati</p>
                </div>
              </div>
            </section>
            <AdSlot placement="home" className="py-6" />
            <section className="py-8" aria-label="Ultime guide">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight text-text-primary sm:text-2xl">Guide per comprare e vendere</h2>
                  <p className="mt-1 text-sm text-text-secondary">Consigli pratici per valutare, acquistare e vendere l&apos;auto usata.</p>
                </div>
                <Link href="/guide" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">Tutte le guide →</Link>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {latestGuides.map((guide) => (
                  <GuideCard key={guide.slug} guide={guide} />
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      <SiteFooter variant="full" />
    </div>
  );
}
