'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Car, CheckCircle2, UserRound, Sparkles, BarChart3, Shield, Wrench, Fuel, ArrowLeftRight, ChevronRight, Camera } from 'lucide-react';
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
    desc: 'Quanto vale? Stima di mercato basata su annunci reali.',
    href: '/valutazione',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'hover:border-blue-300',
  },
  {
    icon: Shield,
    title: 'Affidabilità',
    desc: 'Difetti noti, guasti comuni e punteggio affidabilità.',
    href: '/affidabilita',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'hover:border-emerald-300',
  },
  {
    icon: Wrench,
    title: 'Costi riparazione',
    desc: 'Quanto costa mantenere e riparare quel modello.',
    href: '/riparazione',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'hover:border-amber-300',
  },
  {
    icon: Fuel,
    title: 'Consumi reali',
    desc: 'Consumi in città, autostrada e misti per ogni modello.',
    href: '/consumi',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'hover:border-purple-300',
  },
  {
    icon: ArrowLeftRight,
    title: 'Confronta modelli',
    desc: 'Metti a confronto due auto fianco a fianco.',
    href: '/confronta',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'hover:border-rose-300',
  },
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
            {/* ═══════════ HERO: AI Scanner (punto centrale) ═══════════ */}
            <VehicleScanner key={scannerKey} />
            {error && <div role="alert" className="mb-6 rounded-xl border border-danger/20 bg-danger-light px-5 py-4 text-center text-sm font-semibold text-danger">{error}</div>}

            {/* ═══════════ COME FUNZIONA ═══════════ */}
            <section className="grid gap-4 border-y border-border/70 py-8 sm:grid-cols-3" aria-label="Come funziona">
              <h2 className="sr-only">Come funziona AutoEsperto</h2>
              {[
                ['Una foto, un risultato', 'Riconosciamo marca, modello e prezzo con l\'AI.'],
                ['Account gratuito', 'Crea un account e analizza le basi di tutte le auto che vuoi.'],
                ['Premium per chi vuole tutto', 'Report completi, prezzi di mercato reali e zero pubblicità.'],
              ].map(([title, text]) => (
                <div key={title} className="flex gap-3.5 p-4 rounded-xl bg-white border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                  <div><p className="text-sm font-bold text-text-primary">{title}</p><p className="mt-0.5 text-xs leading-relaxed text-text-secondary">{text}</p></div>
                </div>
              ))}
            </section>

            {/* ═══════════ STRUMENTI (visibili subito) ═══════════ */}
            <section className="py-10" aria-label="Strumenti AutoEsperto">
              <div className="flex flex-col items-center mb-8">
                <h2 className="text-center text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">Tutti gli strumenti per la tua auto</h2>
                <p className="mx-auto mt-2.5 max-w-2xl text-center text-sm text-text-secondary leading-relaxed">
                  Oltre all&apos;analisi AI, esplora valutazioni, affidabilità, costi e confronti per migliaia di modelli.
                </p>
              </div>

              {/* AI Scanner highlight card */}
              <Link href="/#" className="group relative mb-4 flex items-center gap-5 rounded-2xl border-2 border-accent/30 bg-gradient-to-r from-accent/5 via-white to-accent/5 p-5 sm:p-6 shadow-card hover:shadow-premium transition-all hover:border-accent/60" aria-label="Analisi AI">
                <div className="shrink-0 grid h-14 w-14 place-items-center rounded-xl bg-accent/10">
                  <Camera className="h-7 w-7 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-lg font-extrabold text-text-primary">Analisi AI da foto</p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-bold text-accent uppercase tracking-wider"><Sparkles className="h-3 w-3" /> Strumento principale</span>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">Carica una foto e la nostra AI riconosce il veicolo, stima il prezzo di mercato e genera un report completo in pochi secondi.</p>
                </div>
                <ChevronRight className="h-5 w-5 text-accent/40 group-hover:text-accent group-hover:translate-x-1 transition-all shrink-0 hidden sm:block" />
              </Link>

              {/* Tool cards grid */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {tools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className={`group flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card hover:shadow-card-hover transition-all ${tool.border}`}
                  >
                    <div className={`shrink-0 grid h-11 w-11 place-items-center rounded-xl ${tool.bg}`}>
                      <tool.icon className={`h-5 w-5 ${tool.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors">{tool.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-text-secondary">{tool.desc}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                  </Link>
                ))}
              </div>
            </section>

            {/* ═══════════ PRICING ═══════════ */}
            <section className="py-10 border-t border-border/70" aria-label="Scegli il tuo piano">
              <h2 className="text-center text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">AutoEsperto è per tutti</h2>
              <p className="mx-auto mt-2.5 max-w-2xl text-center text-sm text-text-secondary leading-relaxed">Inizia subito con un&apos;analisi completa gratuita senza registrazione. Poi decidi se continuare con l&apos;account base o sbloccare tutto il potenziale con Premium.</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 text-center shadow-card hover:border-blue-200 transition-all">
                  <p className="text-xl font-extrabold text-slate-800">Prova Gratuita</p>
                  <p className="mt-1 text-2xl font-bold text-slate-500">€0</p>
                  <p className="mt-2 text-xs text-text-secondary font-medium">1ª analisi completa gratuita, nessuna registrazione richiesta.</p>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 text-center shadow-card hover:border-blue-200 transition-all">
                  <p className="text-xl font-extrabold text-blue-600">Registrato</p>
                  <p className="mt-1 text-2xl font-bold text-slate-500">€0</p>
                  <p className="mt-2 text-xs text-text-secondary font-medium">Analisi illimitate con dati base (marca, modello, anno).</p>
                </div>
                <div className="rounded-2xl border border-blue-200 bg-gradient-to-b from-blue-50 to-white p-6 text-center shadow-card shadow-blue-900/5 hover:border-blue-400 transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2"><Sparkles className="w-5 h-5 text-blue-400" /></div>
                  <p className="text-xl font-extrabold text-blue-600">Premium</p>
                  <p className="mt-1 text-3xl font-bold text-blue-600">{premium.displayPrice}<span className="text-sm text-slate-500">/mese</span></p>
                  <p className="mt-2 text-xs text-text-secondary font-medium">Analisi complete illimitate, prezzi reali, no pubblicità.</p>
                </div>
              </div>
            </section>

            {/* ═══════════ ADS ═══════════ */}
            <AdSlot placement="banner" className="py-6" />

            {/* ═══════════ GUIDE ═══════════ */}
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
