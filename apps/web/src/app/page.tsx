'use client';

import { useState } from 'react';
import { Car, Menu, X, Shield, TrendingUp, BarChart3, ChevronRight, User, LogOut } from 'lucide-react';
import type { AutoReport } from '@autoesperto/types';
import SearchForm from '@/components/SearchForm';
import ReportView from '@/components/ReportView';
import SubscriptionPlans from '@/components/SubscriptionPlans';
import KnowledgeCenter from '@/components/KnowledgeCenter';
import AuthModal from '@/components/AuthModal';
import { analyzeVehicle } from '@/lib/api';
import { useAuth } from '@/lib/auth';

type View = 'home' | 'report' | 'plans' | 'knowledge';

export default function Home() {
  const { user, logout } = useAuth();
  const [view, setView] = useState<View>('home');
  const [report, setReport] = useState<AutoReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const handleAnalyze = async (plate: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await analyzeVehicle({ plate });
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
    { label: 'Come funziona', view: 'home' as View, scroll: true },
    { label: 'Prezzi', view: 'plans' as View },
    { label: 'Guida', view: 'knowledge' as View },
  ];

  return (
    <div className="min-h-screen bg-background bg-grid">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong border-b border-border/80">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-5 h-16">
          <button onClick={() => { setView('home'); setReport(null); setError(''); }} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-premium transition-transform group-hover:scale-105">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-text-primary">Auto</span>
              <span className="text-accent">Esperto</span>
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => {
                  setView(item.view);
                  if ((item as any).scroll) {
                    setTimeout(() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }
                }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  view === item.view
                    ? 'bg-accent-light text-accent'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-2 text-sm">
                  <div className="w-6 h-6 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.charAt(0) || user.email.charAt(0)}
                  </div>
                  <span className="text-text-primary font-medium text-sm max-w-[100px] truncate">{user.name || user.email}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 hover:bg-surface-2 rounded-xl transition-colors text-text-secondary hover:text-danger"
                  title="Esci"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="hidden md:flex h-9 px-4 rounded-xl gradient-bg text-white text-sm font-semibold items-center gap-2 hover:shadow-premium active:scale-[0.98] transition-all"
              >
                <User className="w-4 h-4" />
                Accedi
              </button>
            )}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 hover:bg-surface-2 rounded-xl transition-colors">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/80 px-5 py-3 bg-white/95 backdrop-blur-xl">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => { setView(item.view); setMobileMenuOpen(false); }}
                className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:bg-surface-2 transition-colors"
              >
                {item.label}
              </button>
            ))}
            <hr className="my-2 border-border/50" />
            {user ? (
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.charAt(0) || user.email.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-text-primary">{user.name || user.email}</div>
                    <div className="text-xs text-text-secondary">{user.plan}</div>
                  </div>
                </div>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-sm text-danger font-medium">Esci</button>
              </div>
            ) : (
              <button
                onClick={() => { setShowAuth(true); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl gradient-bg text-white font-semibold text-sm"
              >
                <User className="w-4 h-4" />
                Accedi o Registrati
              </button>
            )}
          </div>
        )}
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-6 md:py-16">
        {view === 'home' && !report && (
          <div className="animate-fade-in">
            {/* Hero */}
            <div className="text-center mb-8 md:mb-16 pt-8 md:pt-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-light text-accent text-xs font-semibold mb-6 border border-accent/10">
                <Shield className="w-3.5 h-3.5" />
                Analisi Auto Esperto
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-text-primary leading-[1.05] mb-5 max-w-4xl mx-auto">
                L&apos;esperto che controlla
                <span className="gradient-text-accent block mt-1">l&apos;auto prima di comprarla</span>
              </h1>
              <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed px-4">
                Analizza un&apos;auto usata in pochi secondi: verifica i dati, confronta il prezzo
                di mercato e scopri i punti critici prima di acquistare.
              </p>
            </div>

            <div className="max-w-xl mx-auto">
              <SearchForm onAnalyze={handleAnalyze} loading={loading} />

              {error && (
                <div className="mt-6 bg-danger-light border border-danger/20 rounded-2xl p-6 text-center animate-scale-in">
                  <div className="text-lg font-bold text-danger mb-1">Veicolo non trovato</div>
                  <div className="text-text-secondary mb-4 text-sm">{error}</div>
                  <button onClick={() => setError('')} className="px-6 py-2.5 rounded-xl bg-danger text-white font-semibold text-sm hover:bg-red-600 transition-colors">
                    Riprova
                  </button>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="mt-16 md:mt-24">
              <div className="grid md:grid-cols-3 gap-5">
                {[
                  {
                    icon: <Shield className="w-6 h-6" />,
                    title: 'Analisi Affidabilità',
                    desc: 'Punteggio da 1 a 10 basato su dati tecnici, storico manutenzione e problemi noti del modello.',
                    color: 'text-emerald-600 bg-emerald-50',
                  },
                  {
                    icon: <TrendingUp className="w-6 h-6" />,
                    title: 'Prezzo di Mercato',
                    desc: 'Confronto con annunci reali: stesso modello, anno e km. Scopri se il prezzo richiesto è giusto.',
                    color: 'text-blue-600 bg-blue-50',
                  },
                  {
                    icon: <BarChart3 className="w-6 h-6" />,
                    title: 'Annunci Reali',
                    desc: 'Link diretti ad AutoScout24, Subito e Automobile.it. Annunci già filtrati per la tua ricerca.',
                    color: 'text-violet-600 bg-violet-50',
                  },
                ].map((f, i) => (
                  <div key={i} className="bg-white rounded-3xl p-6 md:p-7 shadow-card border border-border/50 card-hover">
                    <div className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center mb-5`}>
                      {f.icon}
                    </div>
                    <h3 className="text-lg font-bold text-text-primary mb-2.5">{f.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* How it works */}
            <div id="how-it-works" className="mt-16 md:mt-24">
              <h2 className="text-2xl md:text-3xl font-bold text-center text-text-primary mb-3">Come funziona</h2>
              <p className="text-text-secondary text-center mb-10 text-sm md:text-base">Tre semplici passi per un acquisto consapevole</p>
              <div className="relative">
                <div className="hidden md:block absolute top-12 left-[calc(16.67%_+_24px)] right-[calc(16.67%_+_24px)] h-0.5 bg-gradient-to-r from-accent/20 via-accent to-accent/20" />
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { step: '01', title: 'Inserisci la targa', desc: 'Basta la targa del veicolo. Analizziamo tutto noi.' },
                    { step: '02', title: 'Analisi completa', desc: 'AutoEsperto elabora affidabilità, valore di mercato, costi e problemi noti.' },
                    { step: '03', title: 'Scegli informato', desc: 'Ricevi un report completo con valutazione, annunci reali e costi stimati.' },
                  ].map((item, i) => (
                    <div key={i} className="relative">
                      <div className="bg-white rounded-3xl p-6 shadow-card border border-border/50 text-center">
                        <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center text-white text-sm font-bold mx-auto mb-4 shadow-premium">
                          <span className="text-lg">{item.step}</span>
                        </div>
                        <h3 className="font-bold text-text-primary mb-2">{item.title}</h3>
                        <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-16 bg-white rounded-3xl shadow-card border border-border/50 p-8 md:p-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {[
                  { value: '10.000+', label: 'Analisi completate' },
                  { value: '24', label: 'Marche coperte' },
                  { value: '4', label: 'Marketplace integrati' },
                  { value: '95%', label: 'Clienti soddisfatti' },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="text-3xl md:text-4xl font-extrabold gradient-text-accent mb-1">{s.value}</div>
                    <div className="text-sm text-text-secondary">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'report' && report && (
          <div className="animate-fade-in">
            <ReportView report={report} onBack={() => { setView('home'); setReport(null); }} />
          </div>
        )}
        {view === 'plans' && <SubscriptionPlans />}
        {view === 'knowledge' && <KnowledgeCenter />}
      </main>

      {/* Auth Modal */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      {/* Footer */}
      <footer className="border-t border-border/80 py-8 px-5 text-center bg-white/50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg gradient-bg flex items-center justify-center">
              <Car className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-text-primary">AutoEsperto</span>
          </div>
          <p className="text-xs text-text-tertiary">
            Il consulente AI italiano per l&apos;auto usata.<br />
            &copy; {new Date().getFullYear()} AutoEsperto. Tutti i diritti riservati.
          </p>
        </div>
      </footer>
    </div>
  );
}
