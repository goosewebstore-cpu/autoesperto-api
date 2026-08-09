'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Car, BarChart3, Camera, BookOpen } from 'lucide-react';
import type { AutoReport } from '@autoesperto/types';
import ReportView from '@/components/ReportView';
import VehicleScanner from '@/components/VehicleScanner';
import SiteHeader from '@/components/SiteHeader';
import { analyzeVehicle, type AnalyzePayload } from '@/lib/api';
import GuideCard from '@/components/GuideCard';
import { guides } from '@/lib/guides';

export type HomeInitialPayload = AnalyzePayload | null;

interface HomeClientProps {
  initialPayload: HomeInitialPayload;
}

export default function HomeClient({ initialPayload }: HomeClientProps) {
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
    </div>
  );
}
