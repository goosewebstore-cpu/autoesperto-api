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
    icon: Wrench,
    title: 'Riparazione',
    desc: 'Costi manutenzione',
    href: '/riparazione',
    color: 'text-amber-600',
    bg: 'bg-amber-500/10',
    ring: 'ring-amber-500/20',
  },
  {
    icon: Fuel,
    title: 'Consumi',
    desc: 'Consumi reali l/100km',
    href: '/consumi',
    color: 'text-purple-600',
    bg: 'bg-purple-500/10',
    ring: 'ring-purple-500/20',
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
];

const steps = [
  { icon: Camera, label: 'Scatta una foto' },
  { icon: Sparkles, label: 'L\'AI analizza' },
  { icon: CheckCircle2, label: 'Report completo' },
];

export default function HomeClient({ initialPayload }: HomeClientProps) {
  const premium = getPremiumPricing();
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
      <header className="home-header">
        <div className="home-header-inner">
          <button onClick={handleBack} className="home-logo" aria-label="Torna alla home">
            <span className="home-logo-icon"><Car className="h-4 w-4 text-white" /></span>
            <span className="home-logo-text">Auto<span>Esperto</span></span>
          </button>
          {!report && (
            <Link href="/account" className="home-account-btn">
              <UserRound className="h-4 w-4" /> Account
            </Link>
          )}
        </div>
      </header>

      <main>
        {report ? (
          <div className="mx-auto max-w-6xl px-5 pt-6">
            <ReportView report={report} onBack={handleBack} />
          </div>
        ) : (
          <div className="home-page">
            {/* ═══ HERO: Scanner AI ═══ */}
            <VehicleScanner key={scannerKey} />
            {error && (
              <div role="alert" className="home-error">
                {error}
              </div>
            )}

            {/* ═══ COME FUNZIONA (3 step) ═══ */}
            <section className="home-steps" aria-label="Come funziona">
              <h2 className="sr-only">Come funziona AutoEsperto</h2>
              <div className="home-steps-track">
                {steps.map((step, i) => (
                  <div key={step.label} className="home-step">
                    <div className="home-step-num">{i + 1}</div>
                    <step.icon className="home-step-icon" />
                    <span className="home-step-label">{step.label}</span>
                  </div>
                ))}
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

            {/* ═══ ADS ═══ */}
            <AdSlot placement="banner" className="py-4" />

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
                    <li><Lock className="h-4 w-4 text-slate-300" /> Report completo bloccato</li>
                  </ul>
                </div>
                {/* Premium */}
                <div className="home-price-card premium">
                  <div className="home-price-badge premium-badge"><Crown className="h-3.5 w-3.5" /> Premium</div>
                  <div className="home-price-amount">{premium.displayPrice}<span>/mese</span></div>
                  <p className="home-price-sub">Tutto illimitato</p>
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
          </div>
        )}
      </main>

      <SiteFooter variant="full" />
    </div>
  );
}
