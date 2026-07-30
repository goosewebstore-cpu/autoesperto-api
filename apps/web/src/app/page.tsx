'use client';

import { useState } from 'react';
import { Car, Menu, X } from 'lucide-react';
import type { AutoReport } from '@autoesperto/types';
import SearchForm from '@/components/SearchForm';
import ReportView from '@/components/ReportView';
import SubscriptionPlans from '@/components/SubscriptionPlans';
import KnowledgeCenter from '@/components/KnowledgeCenter';
import { analyzeVehicle } from '@/lib/api';

type View = 'home' | 'report' | 'plans' | 'knowledge';

export default function Home() {
  const [view, setView] = useState<View>('home');
  const [report, setReport] = useState<AutoReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAnalyze = async (plate: string, km: string, price: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await analyzeVehicle({
        plate,
        km: km ? parseInt(km) : undefined,
        requestedPrice: price ? parseInt(price) : undefined,
      });
      if (res.success) {
        setReport(res.report);
        setView('report');
      } else {
        setError((res as any).error || 'Veicolo non trovato');
      }
    } catch (err: any) {
      setError(err.message || 'Errore durante la ricerca');
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { label: 'Cerca Auto', view: 'home' as View },
    { label: 'Piani', view: 'plans' as View },
    { label: 'Guida', view: 'knowledge' as View },
  ];

  return (
    <div className="max-w-2xl mx-auto min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-5 h-14 md:h-16">
          <button onClick={() => { setView('home'); setReport(null); }} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="text-text-primary">Auto</span><span className="text-accent">Esperto</span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => setView(item.view)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  view === item.view ? 'bg-surface-2 text-text-primary' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile menu */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border px-5 py-3 space-y-1 bg-background">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => { setView(item.view); setMobileMenuOpen(false); }}
                className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:bg-surface-2"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <main className="px-4 py-6 md:px-6 md:py-8">
        {view === 'home' && !report && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary leading-tight mb-3">
                L&apos;esperto che controlla l&apos;auto prima di comprarla.
              </h1>
              <p className="text-lg text-text-secondary leading-relaxed">
                Inserisci la targa o scatta una foto. Analisi AI, affidabilità, prezzo di mercato e consiglio d&apos;acquisto.
              </p>
            </div>

            <SearchForm onAnalyze={handleAnalyze} loading={loading} />

            {error && (
              <div className="mt-6 bg-danger/5 border border-danger/20 rounded-2xl p-6 text-center">
                <div className="text-4xl mb-2">🚗</div>
                <div className="text-lg font-bold text-danger mb-1">Veicolo non trovato</div>
                <div className="text-text-secondary mb-4">{error}</div>
                <button onClick={() => setError('')} className="px-6 py-2.5 rounded-xl bg-accent text-white font-semibold">
                  Riprova
                </button>
              </div>
            )}

            <div className="mt-12">
              <h2 className="text-xl font-bold text-text-primary mb-4">Come funziona</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { step: '1', title: 'Inserisci la targa', desc: 'Digita la targa italiana o scatta una foto.' },
                  { step: '2', title: 'Analisi AI', desc: 'AutoEsperto analizza affidabilità, mercato e costi.' },
                  { step: '3', title: 'Decidi con i dati', desc: 'Ricevi un report completo e un consiglio chiaro.' },
                ].map((item) => (
                  <div key={item.step} className="bg-surface rounded-2xl p-5 shadow-card">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center text-sm font-bold mb-3">
                      {item.step}
                    </div>
                    <div className="font-semibold text-text-primary mb-1">{item.title}</div>
                    <div className="text-sm text-text-secondary">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {view === 'report' && report && <ReportView report={report} />}
        {view === 'plans' && <SubscriptionPlans />}
        {view === 'knowledge' && <KnowledgeCenter />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-5 text-center">
        <p className="text-sm text-text-tertiary">
          AutoEsperto — Il consulente AI italiano per l&apos;auto usata.<br />
          &copy; {new Date().getFullYear()} AutoEsperto. Tutti i marchi appartengono ai rispettivi proprietari.
        </p>
      </footer>
    </div>
  );
}
