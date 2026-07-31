'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Car, Search, Download, Sparkles, Scale, ChevronRight } from 'lucide-react';
import type { AutoReport } from '@autoesperto/types';
import SearchForm from '@/components/SearchForm';
import ReportView from '@/components/ReportView';
import AdSlot from '@/components/AdSlot';
import { analyzeVehicle, type AnalyzePayload } from '@/lib/api';
import { POPULAR_MODELS, slugify } from '@/lib/catalogo';

function usePrefilled(params: URLSearchParams) {
  const ref = useRef<AnalyzePayload | null>(null);
  if (ref.current === null) {
    const make = params.get('make');
    const model = params.get('model');
    if (make && model) {
      const km = params.get('km');
      const price = params.get('price');
      ref.current = {
        make,
        model,
        km: km && !Number.isNaN(Number(km)) ? Number(km) : undefined,
        requestedPrice: price && !Number.isNaN(Number(price)) ? Number(price) : undefined,
      };
    }
  }
  return ref;
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const [report, setReport] = useState<AutoReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [plateLookupUnavailable, setPlateLookupUnavailable] = useState(false);
  const [prefill, setPrefill] = useState<AnalyzePayload | null>(null);
  const params = useSearchParams();
  const prefilledRef = usePrefilled(params);

  useEffect(() => {
    if (prefilledRef.current) {
      setPrefill(prefilledRef.current);
      handleAnalyze(prefilledRef.current);
      prefilledRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnalyze = async (payload: AnalyzePayload) => {
    setLoading(true);
    setError('');
    setPlateLookupUnavailable(false);
    try {
      const res = await analyzeVehicle(payload);
      if (res.success) {
        setReport(res.report);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      const message = err.message || 'Veicolo non trovato. Controlla i dati inseriti.';
      const lookupUnavailable = Boolean(payload.plate) && /ricerca veicoli|temporaneamente non disponibile|servizio/i.test(message);
      setPlateLookupUnavailable(lookupUnavailable);
      setError(
        lookupUnavailable
          ? 'La ricerca automatica della targa non è disponibile in questo momento.'
          : message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setReport(null);
    setError('');
    setPlateLookupUnavailable(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-border/60">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-5 h-16">
          <button onClick={handleBack} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Car className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-text-primary">
              Auto<span className="text-accent">Esperto</span>
            </span>
          </button>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-text-secondary">
            {!report && (
              <>
                <a href="#come-funziona" className="hover:text-text-primary transition-colors">Come funziona</a>
                <a href="#vantaggi" className="hover:text-text-primary transition-colors">Vantaggi</a>
                <a href="#prezzi" className="hover:text-text-primary transition-colors">Prezzi</a>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5">
        {!report ? (
          <div className="animate-fade-in">
            {/* Hero */}
            <section className="text-center pt-12 md:pt-16 pb-10">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-violet-600/10 to-indigo-600/10 border border-indigo-500/20 text-indigo-700 text-xs font-semibold mb-5">
                <Sparkles className="w-3.5 h-3.5" />
                Analisi potenziata con l&apos;intelligenza artificiale
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary leading-[1.1] max-w-3xl mx-auto">
                L&apos;esperto che controlla l&apos;auto prima di comprarla
              </h1>
              <p className="text-base md:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed mt-4 px-2">
                In pochi secondi analizza un&apos;auto usata con l&apos;AI, confronta il prezzo con
                modelli simili e scopri cosa controllare prima dell&apos;acquisto.
              </p>
            </section>

            {/* Search */}
            <section className="max-w-xl mx-auto pb-6" id="ricerca">
              <SearchForm
                key={prefill ? 'prefilled' : plateLookupUnavailable ? 'model-fallback' : 'initial'}
                onAnalyze={handleAnalyze}
                loading={loading}
                initialMode={prefill || plateLookupUnavailable ? 'model' : 'plate'}
                initialMake={prefill?.make}
                initialModel={prefill?.model}
                initialKm={prefill?.km ? String(prefill.km) : undefined}
                initialPrice={prefill?.requestedPrice ? String(prefill.requestedPrice) : undefined}
              />

              {error && (
                <div role="alert" className={`mt-4 rounded-2xl p-5 text-center animate-fade-in ${plateLookupUnavailable ? 'bg-warning-light border border-warning/20' : 'bg-danger-light border border-danger/20'}`}>
                  <div className={`text-sm font-semibold mb-3 ${plateLookupUnavailable ? 'text-warning' : 'text-danger'}`}>{error}</div>
                  {plateLookupUnavailable ? (
                    <>
                      <p className="text-sm text-text-secondary mb-3">
                        Puoi continuare subito inserendo marca e modello: il report include affidabilità, alternative e prezzi dagli annunci in vendita.
                      </p>
                      <button
                        onClick={() => { setError(''); setPlateLookupUnavailable(true); }}
                        className="px-5 py-2 rounded-lg bg-warning text-white font-semibold text-sm hover:brightness-95 transition-colors"
                      >
                        Cerca per marca e modello
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setError('')}
                      className="px-5 py-2 rounded-lg bg-danger text-white font-semibold text-sm hover:bg-red-600 transition-colors"
                    >
                      Riprova
                    </button>
                  )}
                </div>
              )}
            </section>

            {/* How it works */}
            <section id="come-funziona" className="py-14 md:py-16">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-text-primary">Come funziona</h2>
                <p className="text-text-secondary mt-1 text-sm md:text-base">Tre semplici passi per un acquisto consapevole</p>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { step: '01', title: 'Inserisci i dati', desc: 'Targa oppure marca e modello. Aggiungi chilometri e prezzo se li conosci.' },
                  { step: '02', title: 'Analisi automatica', desc: 'Otteni dati del veicolo, valutazione di affidabilità e stima di mercato.' },
                  { step: '03', title: 'Scegli informato', desc: 'Consigli specifici, punti critici e link agli annunci reali in vendita.' },
                ].map((item) => (
                  <div key={item.step} className="bg-surface-2 rounded-2xl p-6">
                    <div className="text-sm font-bold text-text-tertiary mb-3">{item.step}</div>
                    <h3 className="font-bold text-text-primary mb-1.5">{item.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Features */}
            <section id="vantaggi" className="py-10 md:py-14 border-t border-border/60">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-text-primary">Perché AutoEsperto</h2>
                <p className="text-text-secondary mt-1 text-sm md:text-base">
                  L&apos;AI analizza il modello, confronta i prezzi e ti dà risposte specifiche, non generiche.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { icon: <Sparkles className="w-5 h-5" />, title: 'Analisi potenziata con AI', desc: 'Punti di forza, criticità e consigli specifici del modello, generati dall\'AI su forum e recensioni reali — non da sensazioni.' },
                  { icon: <Scale className="w-5 h-5" />, title: 'Confronto con auto simili', desc: 'Vedi la stima di mercato del modello e di alternative paragonabili, per capire se il prezzo richiesto è onesto.' },
                  { icon: <Download className="w-5 h-5" />, title: 'Report scaricabile', desc: 'Il PDF di AutoEsperto ti accompagna in concessionaria per contrattare con dati alla mano.' },
                ].map((f) => (
                  <div key={f.title} className="bg-white rounded-2xl border border-border p-6">
                    <div className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center text-accent mb-4">
                      {f.icon}
                    </div>
                    <h3 className="font-bold text-text-primary mb-1.5">{f.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Ad slot (attivo solo se NEXT_PUBLIC_ADSENSE_CLIENT è configurato) */}
            <section id="prezzi" className="py-12 md:py-16 border-t border-border/60">
              <div className="text-center mb-8">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent mb-2">Prezzi di lancio</p>
                <h2 className="text-2xl md:text-3xl font-bold text-text-primary">Prima capisci l&apos;auto. Poi scegli se approfondire.</h2>
                <p className="text-text-secondary mt-2 text-sm md:text-base max-w-2xl mx-auto">
                  L&apos;analisi con prezzi reali, affidabilità e alternative resta gratuita. I controlli targa saranno sempre opzionali e con un prezzo chiaro.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl border-2 border-accent p-6 relative shadow-card">
                  <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">Disponibile ora</span>
                  <h3 className="font-bold text-text-primary text-lg">Beta gratuita</h3>
                  <p className="mt-3 text-3xl font-extrabold text-text-primary">€0</p>
                  <p className="text-sm text-text-secondary mt-1">Nessuna carta richiesta</p>
                  <ul className="mt-5 space-y-2.5 text-sm text-text-secondary">
                    <li>Analisi marca e modello</li>
                    <li>Prezzi medi dagli annunci</li>
                    <li>Affidabilità e punti critici</li>
                    <li>Alternative nella stessa fascia</li>
                  </ul>
                  <a href="#ricerca" className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white hover:brightness-95 transition-colors">Inizia gratis</a>
                </div>
                <div className="bg-surface-2 rounded-2xl border border-border p-6">
                  <div className="text-xs font-bold text-text-tertiary">IN ARRIVO</div>
                  <h3 className="font-bold text-text-primary text-lg mt-2">Report Targa</h3>
                  <p className="mt-3 text-3xl font-extrabold text-text-primary">€1,99</p>
                  <p className="text-sm text-text-secondary mt-1">Una sola verifica, senza abbonamento</p>
                  <ul className="mt-5 space-y-2.5 text-sm text-text-secondary">
                    <li>Riconoscimento automatico veicolo</li>
                    <li>Report AutoEsperto completo</li>
                    <li>Pagamento solo quando ti serve</li>
                  </ul>
                  <div className="mt-6 text-center rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-text-tertiary">In preparazione</div>
                </div>
                <div className="bg-surface-2 rounded-2xl border border-border p-6">
                  <div className="text-xs font-bold text-text-tertiary">IN ARRIVO</div>
                  <h3 className="font-bold text-text-primary text-lg mt-2">Plus</h3>
                  <p className="mt-3 text-3xl font-extrabold text-text-primary">€4,99<span className="text-base font-semibold text-text-secondary">/mese</span></p>
                  <p className="text-sm text-text-secondary mt-1">Per chi sta cercando più auto</p>
                  <ul className="mt-5 space-y-2.5 text-sm text-text-secondary">
                    <li>3 verifiche targa al mese</li>
                    <li>Report completi inclusi</li>
                    <li>Disdici quando vuoi</li>
                  </ul>
                  <div className="mt-6 text-center rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-text-tertiary">In preparazione</div>
                </div>
              </div>
              <p className="max-w-3xl mx-auto mt-6 text-center text-xs text-text-tertiary leading-relaxed">
                Le verifiche targa saranno attivate solo con una fonte dati autorizzata. Per il controllo dello storico chilometrico, AutoEsperto indica sempre la verifica pubblica disponibile.
              </p>
            </section>

            <AdSlot slot="0000000000" className="mt-6" />

            {/* Trust strip */}
            <section className="py-8">
              <div className="bg-accent rounded-2xl px-6 py-8 md:py-10 text-center text-white">
                <p className="text-lg md:text-xl font-semibold max-w-2xl mx-auto leading-relaxed">
                  Prima di comprare, fai la scelta che fanno gli esperti: analizza con l&apos;AI.
                </p>
                <a
                  href="#ricerca"
                  className="inline-flex items-center gap-2 mt-5 px-6 py-3 rounded-xl bg-white text-accent font-semibold text-sm hover:bg-zinc-100 transition-colors"
                >
                  <Search className="w-4 h-4" />
                  Analizza un veicolo
                </a>
              </div>
            </section>

            {/* Popular models */}
            <section className="py-10 md:py-14 border-t border-border/60">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-text-primary">I modelli più cercati</h2>
                <p className="text-text-secondary mt-1 text-sm md:text-base">
                  Quanto costa un&apos;auto usata? Vedi i prezzi reali dagli annunci in vendita.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {POPULAR_MODELS.map((p) => (
                  <a
                    key={`${p.make}-${p.model}`}
                    href={`/valutazione/${slugify(p.make)}/${slugify(p.model)}/`}
                    className="bg-surface-2 hover:bg-border/50 rounded-xl px-3.5 py-3 text-sm font-semibold text-text-primary flex items-center justify-between gap-2 transition-colors"
                  >
                    <span className="truncate">{p.make} {p.model}</span>
                    <ChevronRight className="w-4 h-4 text-text-tertiary flex-shrink-0" />
                  </a>
                ))}
              </div>
              <div className="text-center mt-6">
                <a href="/valutazione/" className="text-sm font-semibold text-accent hover:underline">
                  Vedi tutte le marche →
                </a>
              </div>
            </section>
          </div>
        ) : (
          <div className="pt-6">
            <ReportView report={report} onBack={handleBack} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 mt-10">
        <div className="max-w-5xl mx-auto px-5 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-accent flex items-center justify-center">
                <Car className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-bold text-text-primary">AutoEsperto</span>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-text-secondary">
              <a href="/valutazione/" className="hover:text-text-primary transition-colors">Valutazione</a>
              <a href="/privacy" className="hover:text-text-primary transition-colors">Privacy</a>
              <a href="/cookie-policy" className="hover:text-text-primary transition-colors">Cookie</a>
              <a href="/terms" className="hover:text-text-primary transition-colors">Termini</a>
              <a href="/contatti" className="hover:text-text-primary transition-colors">Contatti</a>
            </nav>
          </div>
          <p className="text-xs text-text-tertiary text-center mt-4">
            AutoEsperto fornisce valutazioni indicative e non sostituisce un&apos;ispezione professionale.
            <br />© {new Date().getFullYear()} AutoEsperto. Tutti i diritti riservati.
          </p>
        </div>
      </footer>
    </div>
  );
}
