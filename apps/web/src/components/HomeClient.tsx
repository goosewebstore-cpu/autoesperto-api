'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  BookOpen,
  Camera,
  Car,
  Check,
  ChevronRight,
  FileSearch,
  Fuel,
  Gauge,
  GitCompareArrows,
  ScanSearch,
  ShieldCheck,
  Wrench,
} from 'lucide-react';
import type { AutoReport } from '@autoesperto/types';
import ReportView from '@/components/ReportView';
import VehicleScanner from '@/components/VehicleScanner';
import SiteHeader from '@/components/SiteHeader';
import { analyzeVehicle, type AnalyzePayload } from '@/lib/api';
import GuideCard from '@/components/GuideCard';
import { guides } from '@/lib/guides';
import { POPULAR_MODELS } from '@/lib/popular';

export type HomeInitialPayload = AnalyzePayload | null;

interface HomeStats {
  makes: number;
  models: number;
}

interface HomeClientProps {
  initialPayload: HomeInitialPayload;
  stats: HomeStats;
}

const U = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;

const OCCASIONS = [
  {
    img: U('photo-1494976388531-d1058494cdd8'),
    title: 'Prima di comprare da un privato',
    text: 'Scopri se il prezzo è giusto e quali controlli fare sull\u2019esemplare.',
    href: '/compra',
    cta: 'Controlla un\u2019auto',
  },
  {
    img: U('photo-1489824904134-891ab64532f1'),
    title: 'In concessionaria, prima di firmare',
    text: 'Arriva alla trattativa con la fascia di prezzo corretta in mano.',
    href: '/valutazione',
    cta: 'Stima il valore',
  },
  {
    img: U('photo-1503376780353-7e6692767b70'),
    title: 'Prima di vendere la tua auto',
    text: 'Scopri quanto puoi chiedere davvero sul mercato attuale.',
    href: '/vendi',
    cta: 'Quanto vale?',
  },
  {
    img: U('photo-1449965408869-eaa3f722e40d'),
    title: 'Per trattare il prezzo',
    text: 'Usa la fascia di mercato del modello come base di negoziazione.',
    href: '/valutazione',
    cta: 'Vedi i prezzi',
  },
];

const WHY_LIST = [
  'Prezzo di mercato calcolato sugli annunci reali in vendita',
  'Affidabilità del modello: guasti e problemi noti',
  'Consumi e costi di riparazione medi',
  'Checklist dei controlli da fare prima dell\u2019acquisto',
];

const TOOLS = [
  { icon: Gauge, title: 'Valutazione auto', desc: 'Prezzi di mercato per marca, modello e anno', href: '/valutazione' },
  { icon: GitCompareArrows, title: 'Confronta modelli', desc: 'Metti due auto faccia a faccia su prezzo e costi', href: '/confronta' },
  { icon: ShieldCheck, title: 'Affidabilità e guasti', desc: 'Punti deboli e problemi noti del modello', href: '/affidabilita' },
  { icon: Wrench, title: 'Costi di riparazione', desc: 'Spese medie di manutenzione per modello', href: '/riparazione' },
  { icon: Fuel, title: 'Consumi reali', desc: 'Consumi dichiarati vs reali su strada', href: '/consumi' },
  { icon: BarChart3, title: 'Quanto vale la mia auto', desc: 'Scopri a quanto puoi venderla oggi', href: '/vendi' },
];

const AVATARS = [
  { initial: 'M', color: '#2563EB' },
  { initial: 'G', color: '#16A34A' },
  { initial: 'S', color: '#D97706' },
  { initial: 'L', color: '#7C3AED' },
  { initial: 'R', color: '#0F172A' },
];

function SmartImg({
  src,
  alt,
  className = '',
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className={`${className} smart-img-fallback`} role="presentation" />;
  /* eslint-disable-next-line @next/next/no-img-element */
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      onError={() => setFailed(true)}
    />
  );
}

export default function HomeClient({ initialPayload, stats }: HomeClientProps) {
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
          <>
            {/* ═══ HERO ═══ */}
            <section className="hero-v2">
              <div className="hero-v2-inner">
                <div className="hero-v2-kicker"><ScanSearch className="h-3.5 w-3.5" /> Verifica l'usato prima di comprare o vendere</div>
                <h1 className="hero-v2-title">Prima di comprare, <em>verifica</em> l'auto.</h1>
                <p className="hero-v2-sub">
                  Da una foto o da marca e modello: valore, prezzo di mercato, affidabilità e controlli da fare.
                  Report in pochi secondi, analisi completa e gratuita.
                </p>
              </div>
              <div className="hero-v2-strip" aria-hidden="true">
                <SmartImg src={U('photo-1555215695-3004980ad54e', 640)} alt="" />
                <SmartImg src={U('photo-1533473359331-0135ef1b58bf', 640)} alt="" />
                <SmartImg src={U('photo-1552519507-da3b142c6e3d', 640)} alt="" />
              </div>
            </section>

            {/* ═══ SEARCH BOX ═══ */}
            <section className="search-v2" id="scanner-section" aria-label="Analizza un'auto">
              <VehicleScanner key={scannerKey} embedded />
              {error && (
                <div role="alert" className="home-error">
                  {error}
                </div>
              )}
              <ul className="search-v2-trust">
                <li><Check /> Analisi completa e gratuita</li>
                <li><ShieldCheck /> Nessun dato personale richiesto</li>
                <li><BarChart3 /> Dati dagli annunci reali in vendita</li>
              </ul>
              <div className="search-v2-avatars">
                <span className="avatar-v2" style={{ background: AVATARS[0].color }} aria-hidden="true">M</span>
                <span className="avatar-v2" style={{ background: AVATARS[1].color }} aria-hidden="true">G</span>
                <span className="avatar-v2" style={{ background: AVATARS[2].color }} aria-hidden="true">S</span>
                <span className="avatar-v2" style={{ background: AVATARS[3].color }} aria-hidden="true">L</span>
                <span className="avatar-v2" style={{ background: AVATARS[4].color }} aria-hidden="true">R</span>
                <p><strong>+2.000 automobilisti</strong> ogni settimana usano AutoEsperto</p>
              </div>
            </section>

            {/* ═══ STATS ═══ */}
            <section className="stats-v2" aria-label="Numeri di AutoEsperto">
              <div className="stats-v2-inner">
                <div className="stat-v2"><strong>{stats.makes}</strong><span>Marchi coperti</span></div>
                <div className="stat-v2"><strong>{stats.models.toLocaleString('it-IT')}</strong><span>Modelli analizzati</span></div>
                <div className="stat-v2"><strong>4 voci</strong><span>Prezzo, affidabilità, consumi, riparazioni</span></div>
                <div className="stat-v2"><strong>100%</strong><span>Analisi completa gratuita</span></div>
              </div>
            </section>

            {/* ═══ OCCASIONS ═══ */}
            <section className="v2-section" aria-label="Quando usare AutoEsperto">
              <div className="home-v2-wrap">
                <div className="home-section-head">
                  <h2>In quali occasioni ti aiuta</h2>
                  <p>La verità sull'usato prima di ogni decisione importante.</p>
                </div>
                <div className="occasions-v2-scroller">
                  {OCCASIONS.map((item) => (
                    <article key={item.title} className="occasions-v2-card">
                      <SmartImg src={item.img} alt={item.title} />
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                      <Link href={item.href}>{item.cta} <ChevronRight /></Link>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {/* ═══ COME FUNZIONA ═══ */}
            <section className="v2-section" id="come-funziona" aria-label="Come funziona">
              <div className="home-v2-wrap">
                <div className="home-section-head">
                  <h2>Come funziona</h2>
                  <p>Tre passi, pochi secondi.</p>
                </div>
                <div className="home-how-grid">
                  <div className="home-how-card">
                    <span className="home-how-num">1</span>
                    <Camera className="home-how-icon" />
                    <h3>Carica una foto o i dati dell&apos;auto</h3>
                    <p>Una foto dell&apos;auto, oppure marca, modello, anno e chilometri.</p>
                  </div>
                  <div className="home-how-card">
                    <span className="home-how-num">2</span>
                    <BarChart3 className="home-how-icon" />
                    <h3>Confrontiamo con il mercato</h3>
                    <p>Analizziamo gli annunci reali in vendita per trovare la fascia di prezzo.</p>
                  </div>
                  <div className="home-how-card">
                    <span className="home-how-num">3</span>
                    <FileSearch className="home-how-icon" />
                    <h3>Leggi il verdetto</h3>
                    <p>Valore, affidabilità, punti da controllare e prezzo consigliato.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ═══ TOOLS ═══ */}
            <section className="v2-section" aria-label="Strumenti gratuiti">
              <div className="home-v2-wrap">
                <div className="home-section-head">
                  <h2>Strumenti gratuiti per l'usato</h2>
                  <p>Valuta, confronta e controlla prima di comprare o vendere.</p>
                </div>
                <div className="home-tools-grid">
                  {TOOLS.map((tool) => (
                    <Link key={tool.href} href={tool.href} className="home-tool-card">
                      <span className="home-tool-icon"><tool.icon className="h-5 w-5" /></span>
                      <span className="home-tool-copy">
                        <strong>{tool.title}</strong>
                        <small>{tool.desc}</small>
                      </span>
                      <ChevronRight className="home-tool-chev" />
                    </Link>
                  ))}
                </div>
              </div>
            </section>

            {/* ═══ POPULAR MODELS ═══ */}
            <section className="v2-section" aria-label="Modelli più cercati">
              <div className="home-v2-wrap">
                <div className="home-section-head">
                  <h2>I modelli più cercati</h2>
                  <p>Accedi subito alla valutazione completa del modello.</p>
                </div>
                <div className="popular-v2">
                  {POPULAR_MODELS.slice(0, 16).map((item) => (
                    <Link key={item.href} href={item.href} className="popular-v2-chip">
                      {item.make} {item.model} <ChevronRight />
                    </Link>
                  ))}
                </div>
              </div>
            </section>

            {/* ═══ WHY ═══ */}
            <section className="v2-section" aria-label="Perché fidarsi">
              <div className="home-v2-wrap">
                <div className="why-v2">
                  <div className="why-v2-visual" aria-hidden="true">
                    <SmartImg src={U('photo-1553440569-bcc63803a83d')} alt="" className="why-v2-photo why-v2-photo-a" />
                    <SmartImg src={U('photo-1511919884226-fd3cad34687c', 640)} alt="" className="why-v2-photo why-v2-photo-b" />
                  </div>
                  <div className="why-v2-copy">
                    <h2>Un report onesto, basato sui dati.</h2>
                    <p>Ogni analisi confronta il modello con i dati reali del mercato italiano dell'usato.</p>
                    <ul className="why-v2-list">
                      {WHY_LIST.map((item) => (
                        <li key={item}><Check /> {item}</li>
                      ))}
                    </ul>
                    <Link href="/guide" className="why-v2-link">
                      Leggi le guide sull'usato <ChevronRight />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* ═══ GUIDE ═══ */}
            {latestGuides.length > 0 && (
              <section className="v2-section" aria-label="Guide">
                <div className="home-v2-wrap">
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
                </div>
              </section>
            )}

            {/* ═══ CTA BAND ═══ */}
            <section className="cta-band-v2" aria-label="Inizia ora">
              <SmartImg src={U('photo-1544636331-e26879cd4d9b', 1600)} alt="" eager />
              <div className="cta-band-v2-inner">
                <h2>Pronto a scoprire la verità sull'usato?</h2>
                <p>Analisi complete e gratuite. Risultati in pochi secondi.</p>
                <div className="cta-band-v2-actions">
                  <Link href="/#scanner-section" className="home-hero-cta">Analizza un'auto</Link>
                  <Link href="/valutazione" className="home-hero-cta-secondary">Sfoglia i modelli</Link>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
