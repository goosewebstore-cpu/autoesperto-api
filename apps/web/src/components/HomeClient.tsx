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

export type HomeInitialPayload = AnalyzePayload | null;

interface HomeClientProps {
  initialPayload: HomeInitialPayload;
}

export default function HomeClient({ initialPayload }: HomeClientProps) {
  const offer = analysisOffer();
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
                <div key={title} className="flex gap-3 px-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <div><p className="text-sm font-bold text-text-primary">{title}</p><p className="mt-0.5 text-sm text-text-secondary">{text}</p></div>
                </div>
              ))}
            </section>
            <section className="py-8" aria-label="Perché scegliere AutoEsperto">
              <h2 className="text-center text-2xl font-extrabold tracking-tight text-text-primary">Paghi una volta, ottieni un report completo</h2>
              <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-text-secondary">La prima analisi è gratuita. Per salvarla o conservarne altre, un pagamento singolo di {offer.displayPrice}{offer.promotional ? ` in promozione fino al ${offer.promoEndsLabel}` : ''} — niente abbonamento, niente rinnovi automatici.</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-border/70 bg-white p-5 text-center">
                  <p className="text-3xl font-extrabold text-accent">{offer.displayPrice}</p>
                  <p className="mt-1 text-xs text-text-secondary">Pagamento una tantum per report completo{offer.promotional ? ` · promozione fino al ${offer.promoEndsLabel}` : ''}</p>
                </div>
                <div className="rounded-xl border border-border/70 bg-white p-5 text-center">
                  <p className="text-3xl font-extrabold text-accent">GDPR</p>
                  <p className="mt-1 text-xs text-text-secondary">Consenso cookie esplicito e privacy by design</p>
                </div>
                <div className="rounded-xl border border-border/70 bg-white p-5 text-center">
                  <p className="text-3xl font-extrabold text-accent">Stripe</p>
                  <p className="mt-1 text-xs text-text-secondary">Pagamenti sicuri, dati carta mai conservati</p>
                </div>
              </div>
            </section>
            <AdSlot placement="home" className="py-6" />
          </div>
        )}
      </main>

      <footer className="mt-8 border-t border-border/70">
        <div className="mx-auto max-w-6xl px-5 py-7 text-center text-xs text-text-tertiary">
          <nav aria-label="Link principali" className="mb-4 flex flex-wrap justify-center gap-x-5 gap-y-2 font-semibold text-text-secondary">
            <Link href="/valutazione" className="hover:text-accent">Valutazione auto</Link>
            <Link href="/guide" className="hover:text-accent">Guide</Link>
            <Link href="/confronta" className="hover:text-accent">Confronta modelli</Link>
            <Link href="/privacy" className="hover:text-accent">Privacy</Link>
            <Link href="/cookie-policy" className="hover:text-accent">Cookie</Link>
            <Link href="/contatti" className="hover:text-accent">Contatti</Link>
            <Link href="/lavora-con-noi" className="hover:text-accent">Lavora con noi</Link>
            <Link href="/terms" className="hover:text-accent">Termini</Link>
          </nav>
          Le stime di AutoEsperto sono indicative. Danni nascosti o meccanici richiedono sempre un controllo professionale.
          <div className="mt-5 flex justify-center">
            <a
              href="https://www.directorysiti.it"
              target="_blank"
              rel="noopener"
              aria-label="Sito web segnalato da directorysiti.it"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://www.directorysiti.it/wp-content/uploads/2019/01/logoDirectorySitoSegnalato.png"
                alt="sito web segnalato da directorysiti.it"
                width={200}
                height={150}
                className="opacity-80 hover:opacity-100"
              />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
