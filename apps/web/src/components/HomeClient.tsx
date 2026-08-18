'use client';

import { Suspense, useEffect, useRef, useState, useCallback } from 'react';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowRight,
  Banknote,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  Euro,
  Gauge,
  LineChart,
  ListChecks,
  ScanSearch,
  SearchCheck,
  ShieldCheck,
  TrendingUp,
  Wrench,
} from 'lucide-react';
import VehicleScanner from '@/components/VehicleScanner';
import BuyChecklist from '@/components/BuyChecklist';
import SiteHeader from '@/components/SiteHeader';
import { trackEvent } from '@/lib/analytics';
import { type AnalyzePayload } from '@/lib/api';

export interface HomeClientProps {
  stats: { makes: number; models: number };
}

function optionalNumber(value: string | null) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function PrefillHandler({ onPrefill }: { onPrefill: (payload: AnalyzePayload) => void }) {
  const searchParams = useSearchParams();
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    const make = searchParams.get('make');
    const model = searchParams.get('model');
    if (make && model) {
      ranRef.current = true;
      onPrefill({
        make,
        model,
        year: optionalNumber(searchParams.get('year')),
        km: optionalNumber(searchParams.get('km')),
        requestedPrice: optionalNumber(searchParams.get('price')),
      });
    }
  }, [searchParams, onPrefill]);

  return null;
}

const QUESTIONS = [
  { icon: SearchCheck, title: 'Conviene comprarla?', desc: 'Prezzo, verdetto e controlli prima di firmare.', href: '/compra' },
  { icon: Banknote, title: 'Quanto vale?', desc: 'Valore di mercato e annuncio di vendita.', href: '/vendi' },
  { icon: Wrench, title: 'Cosa potrebbe costarmi?', desc: 'Costi di riparazione e manutenzione.', href: '/riparazione' },
  { icon: LineChart, title: 'Quale conviene?', desc: 'Confronta due modelli fianco a fianco.', href: '/confronta' },
];

const SECONDARY_TOOLS = [
  { label: 'Affidabilità e guasti', href: '/affidabilita' },
  { label: 'Consumi reali', href: '/consumi' },
  { label: 'Valuta la condizione', href: '/condizione' },
  { label: 'Valutazione per modello', href: '/valutazione' },
];

const STEPS = [
  {
    num: '1',
    icon: Camera,
    title: 'Inserisci l\u2019auto',
    desc: 'Una foto oppure marca e modello. Niente moduli lunghi.',
  },
  {
    num: '2',
    icon: TrendingUp,
    title: 'Analizziamo il mercato',
    desc: 'Prezzi dagli annunci reali, affidabilità e problemi noti del modello.',
  },
  {
    num: '3',
    icon: Gauge,
    title: 'Ricevi il verdetto',
    desc: 'Score su 100, prezzo vs mercato e cosa controllare prima di comprare.',
  },
];

const TRUST = [
  { icon: Euro, title: 'Prezzi di mercato', desc: 'Dati reali dagli annunci in vendita, incrociati con stime per anno e chilometri.' },
  { icon: ShieldCheck, title: 'Affidabilità', desc: 'Problemi noti, punti di forza e versioni da evitare per ogni modello.' },
  { icon: Wrench, title: 'Costi stimati', desc: 'Manutenzione, carburante, bollo e assicurazione come prima indicazione.' },
  { icon: ListChecks, title: 'Checklist pre-acquisto', desc: 'Controlli rapidi da fare sull\u2019esemplare prima di contattare il venditore.' },
];

const FAQS = [
  {
    q: 'È gratis analizzare un\u2019auto?',
    a: 'Sì: l\u2019analisi è sempre gratuita e senza registrazione. Serve un account solo per salvare le analisi nella tua area personale.',
  },
  {
    q: 'Da dove arrivano i dati?',
    a: 'Dagli annunci reali in vendita in Italia, incrociati con schede tecniche, problemi noti e costi di manutenzione del modello.',
  },
  {
    q: 'Cosa dice il verdetto?',
    a: 'Un punteggio su 100 con un giudizio: BUON AFFARE, TRATTA IL PREZZO o EVITALA, insieme a prezzo vs mercato e controlli da fare.',
  },
  {
    q: 'Il riconoscimento da foto è affidabile?',
    a: 'Per i modelli comuni sì. Più foto aumentano la precisione. Se il riconoscimento non è sicuro, ti chiediamo marca e modello. La foto non viene salvata.',
  },
];

const POPULAR: { make: string; model: string; year: string; score: number; verdict: string }[] = [
  { make: 'Fiat', model: 'Panda', year: '2023', score: 78, verdict: 'TRATTA IL PREZZO' },
  { make: 'Fiat', model: '500', year: '2024', score: 81, verdict: 'BUON AFFARE' },
  { make: 'Volkswagen', model: 'Golf', year: '2023', score: 75, verdict: 'TRATTA IL PREZZO' },
  { make: 'Toyota', model: 'Yaris', year: '2023', score: 86, verdict: 'BUON AFFARE' },
  { make: 'Renault', model: 'Clio', year: '2023', score: 79, verdict: 'TRATTA IL PREZZO' },
  { make: 'Peugeot', model: '208', year: '2023', score: 82, verdict: 'BUON AFFARE' },
  { make: 'Mazda', model: 'CX-3', year: '2023', score: 80, verdict: 'BUON AFFARE' },
  { make: 'Volkswagen', model: 'Polo', year: '2022', score: 77, verdict: 'TRATTA IL PREZZO' },
  { make: 'Hyundai', model: 'i20', year: '2023', score: 83, verdict: 'BUON AFFARE' },
];

function popularHref(make: string, model: string) {
  const slug = (value: string) =>
    value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/[-\s]+/g, '-').replace(/^-+|-+$/g, '');
  return `/valutazione/${slug(make)}/${slug(model)}`;
}

function verdictColor(verdict: string) {
  if (verdict === 'BUON AFFARE') return 'ae-popular-verdict-good';
  if (verdict === 'TRATTA IL PREZZO') return 'ae-popular-verdict-warn';
  return 'ae-popular-verdict-bad';
}

const formatEuro = (n: number) => n.toLocaleString('it-IT') + ' €';

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    const children = el.querySelectorAll('.reveal');
    children.forEach((child) => observer.observe(child));

    return () => observer.disconnect();
  }, []);

  return ref;
}

function RevealSection({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`reveal ${className}`} {...props}>
      {children}
    </div>
  );
}

export default function HomeClient({ stats }: HomeClientProps) {
  const [initialPayload, setInitialPayload] = useState<AnalyzePayload | null>(null);
  const [scannerStage, setScannerStage] = useState<string>('idle');
  const revealRef = useScrollReveal();

  const handlePrefill = (payload: AnalyzePayload) => {
    setInitialPayload(payload);
  };

  const scrollToScanner = () => {
    document.getElementById('scanner-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const isShowingResult = scannerStage === 'result';

  return (
    <div className="min-h-screen bg-background" ref={revealRef}>
      <Suspense fallback={null}>
        <PrefillHandler onPrefill={handlePrefill} />
      </Suspense>

      <SiteHeader />

      <main>
        {/* ─── HERO ─── */}
        <section className="ae-hero" aria-label="AutoEsperto — analizza un'auto usata">
          <div className="ae-wrap ae-hero-grid">
            <div className="ae-hero-copy">
              <span className="ae-hero-kicker">
                <ScanSearch className="h-3.5 w-3.5" />
                Valutazione auto usate
              </span>
              <h1 className="ae-hero-title">
                Scopri se un&apos;auto usata vale davvero la pena.
              </h1>
              <p className="ae-hero-sub">
                Carica una foto oppure inserisci marca e modello. AutoEsperto analizza prezzo,
                affidabilità, problemi noti e cosa controllare prima di comprarla.
              </p>
              <div className="ae-hero-actions">
                <a href="#scanner-section" className="home-hero-cta" onClick={() => trackEvent('search_car', { feature: 'hero_cta' })}>
                  Analizza un&apos;auto <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              <div className="ae-hero-micro">
                <span><Check className="h-3.5 w-3.5" /> Gratis</span>
                <span><Check className="h-3.5 w-3.5" /> Senza registrazione</span>
                <span><Check className="h-3.5 w-3.5" /> Risultato in pochi secondi</span>
              </div>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700 shadow-sm">
                <ScanSearch className="h-3.5 w-3.5" />
                Oltre 2.500 auto analizzate
              </div>
            </div>

            {/* Mockup del prodotto */}
            <div className="ae-hero-mock" aria-hidden="true">
              <div className="ae-mock-card">
                <div className="ae-mock-head">
                  <span className="ae-mock-brand">AutoEsperto Score</span>
                  <span className="ae-mock-live"><span /> Analisi in tempo reale</span>
                </div>
                <div className="ae-mock-car">
                  <div>
                    <h2>Mazda CX-3</h2>
                    <p>2.0 Sport · 2023</p>
                  </div>
                  <div className="ae-mock-ring" style={{ '--ae-score': '80deg' } as CSSProperties}>
                    <div className="ae-mock-ring-inner">
                      <strong>80</strong>
                      <span>/100</span>
                    </div>
                  </div>
                </div>
                <div className="ae-mock-verdict">
                  <CheckCircleIcon />
                  BUON AFFARE
                </div>
                <div className="ae-mock-rows">
                  <div className="ae-mock-row">
                    <span>Prezzo richiesto</span>
                    <strong>{formatEuro(18900)}</strong>
                  </div>
                  <div className="ae-mock-row">
                    <span>Valore di mercato</span>
                    <strong>{formatEuro(17500)} – {formatEuro(19200)}</strong>
                  </div>
                </div>
                <div className="ae-mock-bar">
                  <span className="ae-mock-bar-track" />
                  <span className="ae-mock-bar-range" />
                  <span className="ae-mock-bar-marker" />
                </div>
                <div className="ae-mock-chips">
                  <span>Affidabilità <strong>8.0/10</strong></span>
                  <span>Costi <strong>medi</strong></span>
                  <span>Rischio <strong className="text-success">basso</strong></span>
                </div>
                <div className="ae-mock-check">
                  <span>Prima di comprarla:</span>
                  <ul>
                    <li>Avviamento a freddo</li>
                    <li>Cambio automatico</li>
                    <li>Sospensioni</li>
                    <li>Tagliandi</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── ANALIZZA AUTO ─── */}
        <section className={`ae-scan ${isShowingResult ? 'pt-4' : ''}`} id="scanner-section" aria-label="Analizza un'auto">
          <div className={`ae-scan-card reveal ${isShowingResult ? 'p-3 sm:p-5 max-w-5xl' : ''}`}>
            {!isShowingResult && (
              <div className="ae-scan-head">
                <h2>Che auto vuoi controllare?</h2>
                <p>Carica una foto oppure inserisci marca e modello. Nessun modulo lungo.</p>
              </div>
            )}
            <VehicleScanner
              embedded
              initialPayload={initialPayload ?? undefined}
              onStageChange={(st) => setScannerStage(st)}
            />
            {!isShowingResult && (
              <ul className="ae-scan-trust">
                <li><Check /> Gratis · senza registrazione</li>
                <li><Check /> Più foto, più precisione</li>
                <li><Check /> Report completo in pochi secondi</li>
              </ul>
            )}
          </div>
        </section>

        {/* ─── ESEMPIO REALE DEL RISULTATO ─── */}
        <section className="ae-section alt" id="esempio" aria-label="Ecco cosa ottieni">
          <div className="ae-wrap">
            <div className="ae-section-head center reveal">
              <h2>Ecco cosa ottieni</h2>
              <p>Un esempio reale del report: verdetto, score, prezzo vs mercato e controlli.</p>
            </div>

            <div className="ae-example reveal">
              <div className="ae-example-main">
                <div className="ae-example-car">
                  <div>
                    <span className="ae-example-tag">Esempio</span>
                    <h3>FIAT 500</h3>
                    <p>1.2 Lounge · 2018 · 62.000 km</p>
                  </div>
                  <div className="ae-example-verdict">
                    <span className="ae-example-badge-good">
                      <CheckCircleIcon />
                      BUON AFFARE
                    </span>
                    <div className="ae-example-score">
                      <strong>81</strong>
                      <span>/100</span>
                    </div>
                  </div>
                </div>

                <div className="ae-example-price">
                  <div>
                    <span className="ae-price-cap">Prezzo richiesto</span>
                    <strong className="ae-price-val">{formatEuro(12900)}</strong>
                  </div>
                  <div>
                    <span className="ae-price-cap">Valore di mercato</span>
                    <strong className="ae-price-val">{formatEuro(12300)} – {formatEuro(13400)}</strong>
                  </div>
                </div>
                <div className="ae-bar">
                  <span className="ae-bar-track" />
                  <span className="ae-bar-range" />
                  <span className="ae-bar-marker" style={{ left: '46%' }} />
                </div>
                <p className="ae-price-hint text-text-secondary">
                  Prezzo in linea con la fascia di mercato · {formatEuro(12900)} entro {formatEuro(12300)} – {formatEuro(13400)}
                </p>

                <div className="ae-subb-grid">
                  {[
                    ['Prezzo', 84],
                    ['Affidabilità', 80],
                    ['Costi', 62],
                    ['Consumi', 76],
                    ['Rischio', 88],
                  ].map(([label, value]) => {
                    const v = value as number;
                    const tone = v >= 70 ? 'bg-success' : v >= 45 ? 'bg-warning' : 'bg-danger';
                    return (
                      <div key={label} className="ae-subb">
                        <div className="ae-subb-head">
                          <span>{label}</span>
                          <strong>{v}/100</strong>
                        </div>
                        <span className="ae-subb-bar">
                          <span className={`ae-subb-fill ${tone}`} style={{ width: `${v}%` }} />
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="ae-example-side">
                <div className="ae-example-check-head">
                  <span>Prima di comprarla</span>
                  <ul>
                    <li><Check /> Frizione</li>
                    <li><Check /> Distribuzione</li>
                    <li><Check /> Pneumatici</li>
                    <li><Check /> Tagliandi</li>
                  </ul>
                </div>
                <p className="ae-example-note">
                  Ogni report include la checklist dei controlli da fare sull&apos;esemplare specifico.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── MODELLI POPOLARI ─── */}
        <section className="ae-section" aria-label="Modelli più venduti in Italia">
          <div className="ae-wrap">
            <div className="ae-section-head center reveal">
              <h2>I modelli più venduti in Italia</h2>
              <p>Controlla il verdetto, il prezzo di mercato e cosa guardare prima di comprare.</p>
            </div>
            <div className="ae-popular-grid reveal">
              {POPULAR.map((item) => (
                <Link key={`${item.make}-${item.model}`} href={popularHref(item.make, item.model)} className="ae-popular-card" onClick={() => trackEvent('tool_click', { tool: `${item.make} ${item.model}` })}>
                  <div className="ae-popular-info">
                    <div>
                      <h3>{item.make} {item.model}</h3>
                      <p>{item.year}</p>
                    </div>
                    <div className="ae-popular-score">
                      <strong>{item.score}</strong>
                      <span>/100</span>
                    </div>
                  </div>
                  <span className={`ae-popular-verdict ${verdictColor(item.verdict)}`}>{item.verdict}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── COSA VUOI SAPERE? ─── */}
        <section className="ae-section alt" aria-label="Strumenti secondari">
          <div className="ae-wrap">
            <div className="ae-section-head reveal">
              <h2>Cosa vuoi sapere?</h2>
              <p>Gli strumenti di approfondimento, quando ti servono.</p>
            </div>
            <div className="ae-questions reveal">
              {QUESTIONS.map((q) => (
                <Link key={q.href} href={q.href} className="ae-question-card" onClick={() => trackEvent('tool_click', { tool: q.title })}>
                  <span className="ae-question-icon"><q.icon className="h-5 w-5" /></span>
                  <span className="ae-question-copy">
                    <strong>{q.title}</strong>
                    <small>{q.desc}</small>
                  </span>
                  <ChevronRight className="ae-question-chev" />
                </Link>
              ))}
            </div>
            <div className="ae-secondary-links">
              {SECONDARY_TOOLS.map((tool) => (
                <Link key={tool.href} href={tool.href}>{tool.label}</Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── COME FUNZIONA ─── */}
        <section className="ae-section" aria-label="Come funziona">
          <div className="ae-wrap">
            <div className="ae-section-head center reveal">
              <h2>Come funziona</h2>
              <p>Tre passi, pochi secondi, zero costi.</p>
            </div>
            <div className="ae-steps reveal">
              {STEPS.map((step) => (
                <div key={step.num} className="ae-step">
                  <span className="ae-step-num">{step.num}</span>
                  <span className="ae-step-icon"><step.icon className="h-5 w-5" /></span>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CHECKLIST ─── */}
        <section className="ae-section alt" aria-label="Checklist prima dell'acquisto">
          <div className="ae-wrap ae-wrap-narrow">
            <div className="ae-section-head center">
              <h2>Prima di comprare, controlla queste cose</h2>
              <p>La stessa checklist che trovi in ogni report. Portala con te quando vai a vedere l&apos;auto.</p>
            </div>
            <BuyChecklist />
          </div>
        </section>

        {/* ─── DATI E FIDUCIA ─── */}
        <section className="ae-section" aria-label="Da dove arrivano i dati">
          <div className="ae-wrap">
            <div className="ae-section-head reveal">
              <h2>Dati reali. Risultati semplici.</h2>
              <p>AutoEsperto incrocia dati di mercato e informazioni tecniche per aiutarti a decidere con più consapevolezza.</p>
            </div>
            <div className="ae-trust-grid reveal">
              {TRUST.map((t) => (
                <div key={t.title} className="ae-trust-card">
                  <span className="ae-trust-icon"><t.icon className="h-5 w-5" /></span>
                  <h3>{t.title}</h3>
                  <p>{t.desc}</p>
                </div>
              ))}
            </div>
            <p className="ae-trust-note">
              Le stime sono indicative e non sostituiscono un controllo professionale dell&apos;esemplare:
              danni nascosti o meccanici vanno sempre verificati da un meccanico o da un&apos;ispezione.
            </p>
          </div>
        </section>

        {/* ─── GUIDE / RISORSE UTILI ─── */}
        <section className="ae-section alt" aria-label="Guide pratiche per l'usato">
          <div className="ae-wrap">
            <div className="ae-section-head reveal">
              <h2>Guide pratiche per comprare e vendere</h2>
              <p>Consigli approfonditi, verifiche da fare e dati di mercato per non sbagliare acquisto.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6 reveal">
              <Link
                href="/guide/come-capire-se-auto-usata-e-affare"
                className="rounded-2xl border border-border bg-white p-5 hover:border-accent hover:shadow-card-hover transition-all flex flex-col justify-between group"
              >
                <div>
                  <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 px-2.5 py-1 text-xs font-bold mb-3">
                    Acquisto
                  </span>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    Come capire se un&apos;auto usata è un affare
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                    I 5 dati da verificare per capire se il prezzo richiesto è in linea con il mercato reale.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                  <span>Leggi la guida</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                href="/guide/auto-che-si-svalutano-meno"
                className="rounded-2xl border border-border bg-white p-5 hover:border-accent hover:shadow-card-hover transition-all flex flex-col justify-between group"
              >
                <div>
                  <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-1 text-xs font-bold mb-3">
                    Valutazione
                  </span>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    Le auto che si svalutano meno nel 2026
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                    Quali modelli mantengono meglio il prezzo nel tempo e perché conviene sceglierli.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                  <span>Leggi la guida</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                href="/guide/come-vendere-auto-usata-prezzo-giusto"
                className="rounded-2xl border border-border bg-white p-5 hover:border-accent hover:shadow-card-hover transition-all flex flex-col justify-between group"
              >
                <div>
                  <span className="inline-flex items-center rounded-full bg-purple-50 text-purple-700 px-2.5 py-1 text-xs font-bold mb-3">
                    Vendita
                  </span>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    Come vendere un&apos;auto al giusto prezzo
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                    Come fissare il valore di vendita, scrivere l&apos;annuncio e gestire le trattative senza svendere.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                  <span>Leggi la guida</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>

            <div className="ae-guide-cta">
              <span>Vuoi approfondire normative, manutenzione o checklist?</span>
              <Link href="/guide">Sfoglia tutte le oltre 80 guide <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </section>

        {/* ─── CTA FINALE ─── */}
        <section className="ae-section" aria-label="Chiamata finale">
          <div className="ae-wrap">
            <div className="ae-cta-final reveal">
              <h2>Hai trovato un&apos;auto?</h2>
              <p>Controllala prima di contattare il venditore. Prezzo, affidabilità e cosa guardare: gratis, in pochi secondi.</p>
              <div className="ae-cta-final-actions">
                <a href="#scanner-section" className="home-hero-cta" onClick={() => trackEvent('search_car', { feature: 'final_cta' })}>
                  Analizza un&apos;auto <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              <p className="ae-cta-final-micro">Gratis · senza registrazione · {stats.makes} marchi e {stats.models.toLocaleString('it-IT')} modelli</p>
            </div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section className="ae-section alt" aria-label="Domande frequenti">
          <div className="ae-wrap ae-wrap-narrow">
            <div className="ae-section-head center reveal">
              <h2>Domande frequenti</h2>
            </div>
            <div className="home-faq reveal">
              {FAQS.map((faq) => (
                <details key={faq.q} className="home-faq-item">
                  <summary>{faq.q}</summary>
                  <p>{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function CheckCircleIcon() {
  return <CheckCircle2 className="h-4 w-4" />;
}
