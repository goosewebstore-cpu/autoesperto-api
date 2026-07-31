'use client';

import { useState } from 'react';
import { Car, Search, Download, Sparkles, Scale } from 'lucide-react';
import type { AutoReport } from '@autoesperto/types';
import SearchForm from '@/components/SearchForm';
import ReportView from '@/components/ReportView';
import AdSlot from '@/components/AdSlot';
import { analyzeVehicle, type AnalyzePayload } from '@/lib/api';

export default function Home() {
  const [report, setReport] = useState<AutoReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async (payload: AnalyzePayload) => {
    setLoading(true);
    setError('');
    try {
      const res = await analyzeVehicle(payload);
      if (res.success) {
        setReport(res.report);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      setError(err.message || 'Veicolo non trovato. Controlla i dati inseriti.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setReport(null);
    setError('');
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
              <SearchForm onAnalyze={handleAnalyze} loading={loading} />

              {error && (
                <div role="alert" className="mt-4 bg-danger-light border border-danger/20 rounded-2xl p-5 text-center animate-fade-in">
                  <div className="text-sm font-semibold text-danger mb-3">{error}</div>
                  <button
                    onClick={() => setError('')}
                    className="px-5 py-2 rounded-lg bg-danger text-white font-semibold text-sm hover:bg-red-600 transition-colors"
                  >
                    Riprova
                  </button>
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
