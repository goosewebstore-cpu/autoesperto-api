'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Car, CheckCircle2, UserRound, Sparkles, BarChart3, Shield,
  Wrench, Fuel, ArrowLeftRight, ChevronRight, Camera, Star,
  Zap, Crown, Lock, BookOpen,
} from 'lucide-react';
import type { AutoReport } from '@autoesperto/types';
import ReportView from '@/components/ReportView';
import VehicleScanner from '@/components/VehicleScanner';
import { analyzeVehicle, type AnalyzePayload } from '@/lib/api';
import { getPremiumPricing } from '@/lib/pricing';
import AdSlot from '@/components/AdSlot';
import GuideCard from '@/components/GuideCard';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import { guides } from '@/lib/guides';

export type HomeInitialPayload = AnalyzePayload | null;

interface HomeClientProps {
  initialPayload: HomeInitialPayload;
}

const tools = [
  {
    icon: BarChart3,
    title: 'Valutazione',
    desc: 'Prezzo di mercato reale',
    href: '/valutazione',
    color: 'text-blue-600',
    bg: 'bg-blue-500/10',
    ring: 'ring-blue-500/20',
  },
  {
    icon: Shield,
    title: 'Affidabilità',
    desc: 'Guasti e punteggio',
    href: '/affidabilita',
    color: 'text-emerald-600',
    bg: 'bg-emerald-500/10',
    ring: 'ring-emerald-500/20',
  },
  {
    icon: ArrowLeftRight,
    title: 'Confronta',
    desc: 'Due auto a confronto',
    href: '/confronta',
    color: 'text-rose-600',
    bg: 'bg-rose-500/10',
    ring: 'ring-rose-500/20',
  },
  {
    icon: BookOpen,
    title: 'Guide',
    desc: 'Consigli per l\'acquisto',
    href: '/guide',
    color: 'text-indigo-600',
    bg: 'bg-indigo-500/10',
    ring: 'ring-indigo-500/20',
  },
];

const steps = [
  { icon: Camera, label: 'Scatta una foto' },
  { icon: Sparkles, label: 'Analisi automatica' },
  { icon: CheckCircle2, label: 'Report completo' },
];

export default function HomeClient({ initialPayload }: HomeClientProps) {
  const [isAnnual, setIsAnnual] = useState(true);
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
      {/* ── HEADER ── */}
      {report ? (
        <header className="home-header">
          <div className="home-header-inner">
            <button onClick={handleBack} className="home-logo" aria-label="Torna alla home">
              <span className="home-logo-icon"><Car className="h-4 w-4 text-white" /></span>
              <span className="home-logo-text">Auto<span>Esperto</span></span>
            </button>
          </div>
        </header>
      ) : (
        <SiteHeader />
      )}

      <main>
        {report ? (
          <div className="mx-auto max-w-6xl px-5 pt-6">
            <ReportView report={report} onBack={handleBack} />
          </div>
        ) : (
          <div className="home-page">
            {/* ═══ NEW HERO ═══ */}
            <section className="home-hero">
              <h1>Prima di comprare o vendere un'auto, analizzala.</h1>
              <p>Carica una foto e scopri che auto è, quanto vale e cosa controllare.</p>
              <div className="home-hero-actions">
                <button
                  onClick={() => {
                    const scanner = document.getElementById('scanner-section');
                    if (scanner) scanner.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="home-hero-cta"
                >
                  <Camera className="h-5 w-5" /> Analizza la mia auto
                </button>
                <button
                  onClick={() => {
                    const how = document.getElementById('come-funziona');
                    if (how) how.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="home-hero-cta-secondary"
                >
                  Scopri come funziona
                </button>
              </div>
              <div className="home-micro-steps">
                <span>Foto</span> → <span>Analisi</span> → <span>Risultato</span>
              </div>
            </section>

            {/* ═══ SECOND PATH BLOCK ═══ */}
            <section className="home-paths px-5 mx-auto max-w-4xl">
              <div className="home-path-card">
                <h3>Hai trovato un'auto e vuoi comprarla?</h3>
                <p>Inserisci prezzo, chilometri e dati dell'auto. Ti aiutiamo a capire se il prezzo è giusto.</p>
                <Link href="/compra" className="home-path-cta">
                  <BarChart3 className="h-4 w-4" /> Controlla un'auto che voglio comprare
                </Link>
              </div>
              <div className="home-path-card">
                <h3>Vuoi vendere la tua auto?</h3>
                <p>Scopri quanto puoi chiedere sul mercato attuale con una stima precisa.</p>
                <Link href="/vendi" className="home-path-cta">
                  <BarChart3 className="h-4 w-4" /> Voglio vendere la mia auto
                </Link>
              </div>
            </section>

            <div id="scanner-section">
              {/* ═══ SCANNER ═══ */}
              <VehicleScanner key={scannerKey} />
              {error && (
                <div role="alert" className="home-error">
                  {error}
                </div>
              )}
            </div>

            {/* ═══ COME FUNZIONA ═══ */}
            <section id="come-funziona" className="home-section" aria-label="Come funziona">
              <div className="home-section-head">
                <h2>Come funziona</h2>
                <p>Tre passi, pochi secondi.</p>
              </div>
              <div className="home-how-grid">
                <div className="home-how-card">
                  <span className="home-how-num">1</span>
                  <h3>Carica una foto o i dati dell&apos;auto</h3>
                  <p>Una foto dell&apos;auto, oppure marca, modello, anno e chilometri.</p>
                </div>
                <div className="home-how-card">
                  <span className="home-how-num">2</span>
                  <h3>Confrontiamo con il mercato</h3>
                  <p>Analizziamo gli annunci reali in vendita per trovare la fascia di prezzo.</p>
                </div>
                <div className="home-how-card">
                  <span className="home-how-num">3</span>
                  <h3>Leggi il verdetto</h3>
                  <p>Valore, affidabilità, punti da controllare e prezzo consigliato.</p>
                </div>
              </div>
              <div className="home-trust-strip">
                <span>Dati dagli annunci reali in vendita</span>
                <span>Stime trasparenti, con data e campione</span>
                <span>Nessun dato personale richiesto</span>
              </div>
            </section>

            {/* ═══ STRUMENTI ═══ */}
            <section className="home-section" aria-label="Strumenti">
              <div className="home-section-head">
                <h2>Tutti gli strumenti</h2>
                <p>Esplora valutazioni, affidabilità e costi per ogni modello.</p>
              </div>
              <div className="home-tools-grid">
                {tools.map((tool) => (
                  <Link key={tool.href} href={tool.href} className={`home-tool-card ${tool.ring}`}>
                    <div className={`home-tool-icon ${tool.bg}`}>
                      <tool.icon className={`h-5 w-5 ${tool.color}`} />
                    </div>
                    <div className="home-tool-text">
                      <span className="home-tool-title">{tool.title}</span>
                      <span className="home-tool-desc">{tool.desc}</span>
                    </div>
                    <ChevronRight className="home-tool-arrow" />
                  </Link>
                ))}
              </div>
            </section>

            {/* ═══ PRICING ═══ */}
            <section className="home-section" aria-label="Piani">
              <div className="home-section-head">
                <h2>Inizia gratis, senza registrazione</h2>
                <p>La prima analisi è completa e gratuita. Poi scegli il piano che fa per te.</p>
              </div>
              <div className="home-pricing-grid">
                {/* Free */}
                <div className="home-price-card">
                  <div className="home-price-badge free"><Zap className="h-3.5 w-3.5" /> Prova</div>
                  <div className="home-price-amount">€0</div>
                  <p className="home-price-sub">Nessuna registrazione</p>
                  <ul className="home-price-features">
                    <li><CheckCircle2 className="h-4 w-4 text-emerald-500" /> 1 analisi completa gratis</li>
                    <li><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Marca, modello, anno</li>
                    <li><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Prezzo stimato</li>
                  </ul>
                </div>
                {/* Registrato */}
                <div className="home-price-card">
                  <div className="home-price-badge registered"><UserRound className="h-3.5 w-3.5" /> Registrato</div>
                  <div className="home-price-amount">€0</div>
                  <p className="home-price-sub">Account gratuito</p>
                  <ul className="home-price-features">
                    <li><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Analisi illimitate</li>
                    <li><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Dati base inclusi</li>
                    <li><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Storico analisi salvato</li>
                  </ul>
                </div>
                {/* Premium */}
                <div className="home-price-card premium">
                  <div className="home-price-badge premium-badge"><Crown className="h-3.5 w-3.5" /> Premium</div>
                  
                  <div className="flex bg-slate-100 rounded-lg p-1 mt-4 mb-4">
                    <button onClick={() => setIsAnnual(false)} className={`flex-1 text-xs font-bold py-1.5 rounded-md transition ${!isAnnual ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>Mensile</button>
                    <button onClick={() => setIsAnnual(true)} className={`flex-1 text-xs font-bold py-1.5 rounded-md transition ${isAnnual ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>Annuale <span className="text-[10px] text-emerald-600 ml-0.5">-33%</span></button>
                  </div>

                  <div className="home-price-amount">
                    {isAnnual ? getPremiumPricing('year').monthlyEquivalent : getPremiumPricing('month').displayPrice}
                    <span>/mese</span>
                  </div>
                  {isAnnual && <p className="text-xs text-slate-500 font-medium mt-1">Fatturato annualmente ({getPremiumPricing('year').displayPrice})</p>}
                  {!isAnnual && <p className="text-xs text-transparent font-medium mt-1 select-none">Spacer</p>}
                  
                  <p className="home-price-sub mt-4">Tutto illimitato</p>
                  <ul className="home-price-features">
                    <li><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Analisi complete illimitate</li>
                    <li><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Prezzi di mercato reali</li>
                    <li><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Nessuna pubblicità</li>
                    <li><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Download PDF</li>
                  </ul>
                  <Link href="/account" className="home-premium-cta">
                    Prova Premium <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </section>

            {/* ═══ GUIDE ═══ */}
            {latestGuides.length > 0 && (
              <section className="home-section" aria-label="Guide">
                <div className="home-section-head">
                  <h2>Guide utili</h2>
                  <Link href="/guide" className="home-see-all">
                    <BookOpen className="h-4 w-4" /> Tutte le guide
                  </Link>
                </div>
                <div className="home-guides-grid">
                  {latestGuides.map((guide) => (
                    <GuideCard key={guide.slug} guide={guide} />
                  ))}
                </div>
              </section>
            )}

            {/* ═══ ADS ═══ */}
            <AdSlot placement="banner" className="py-4" />
          </div>
        )}
      </main>

      <SiteFooter variant="full" />
    </div>
  );
}
