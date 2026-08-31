'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AutoReport, PriceLabel } from '@autoesperto/types';
import {
  ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, Gauge, Wrench, Fuel, Car,
  Euro, Download, ExternalLink, ShieldCheck, GitCompareArrows, Users, ChevronDown,
  TrendingDown, Sparkles, Activity, Search, Loader2,
} from 'lucide-react';
import { slugify } from '@/lib/catalogo';
import ReportScoreHero from '@/components/ReportScoreHero';
import ReportQuickCustomizer from '@/components/ReportQuickCustomizer';
import ReliabilityRadar from '@/components/ReliabilityRadar';
import DepreciationChart from '@/components/DepreciationChart';
import KpiCards from '@/components/KpiCards';
import VehicleHealthScore from '@/components/VehicleHealthScore';
import { ShareButton } from '@/components/ShareButton';
import { SellAdGenerator } from '@/components/SellAdGenerator';
import { createPassportFromReport } from '@/lib/passportStorage';

function formatPrice(n: number | undefined | null) {
  return (n ?? 0).toLocaleString('it-IT') + ' €';
}

function formatKm(n: number | undefined | null) {
  return (n ?? 0).toLocaleString('it-IT') + ' km';
}

interface ReportViewProps {
  report: AutoReport;
  onBack?: () => void;
  embedded?: boolean;
  showAds?: boolean;
  allowPhotoTools?: boolean;
}

export default function ReportView({ report, onBack, embedded = false, showAds = true, allowPhotoTools = true }: ReportViewProps) {
  const router = useRouter();
  const [currentReport, setCurrentReport] = useState<AutoReport>(report);
  const [isCreatingPassport, setIsCreatingPassport] = useState(false);

  const handleCreatePassport = () => {
    if (isCreatingPassport) return;
    setIsCreatingPassport(true);
    try {
      const pass = createPassportFromReport(currentReport);
      router.push(`/passport/${pass.id}`);
    } catch (err) {
      console.error('Error creating passport:', err);
      setIsCreatingPassport(false);
    }
  };

  const vehicle = currentReport?.vehicle || ({} as any);
  const reliability = currentReport?.reliability || ({} as any);
  const price = currentReport?.price || ({} as any);

  const strengths = reliability.strengths || (reliability as any).pros || [
    'Costi di gestione e manutenzione contenuti',
    'Buona reperibilità di ricambi',
    'Facile da rivendere sul mercato',
  ];
  const weaknesses = reliability.weaknesses || (reliability as any).cons || [
    'Verificare lo stato della cinghia o catena',
    'Controllare usura freni e sospensioni',
  ];

  const isModelData = vehicle.dataSource === 'model';

  const specs = [
    { label: 'Marca', value: vehicle.make },
    { label: 'Modello', value: vehicle.model },
    { label: 'Versione', value: vehicle.version },
    { label: 'Anno', value: vehicle.year?.toString() },
    { label: 'Alimentazione', value: vehicle.fuel },
    { label: 'Potenza', value: vehicle.power },
    { label: 'Cilindrata', value: vehicle.displacement },
    { label: 'Cambio', value: vehicle.transmission },
    { label: 'Carrozzeria', value: vehicle.body },
    { label: 'Porte', value: vehicle.doors?.toString() },
    { label: 'Colore', value: vehicle.color },
    { label: 'Classe Euro', value: vehicle.euroClass },
  ].filter((s) => s.value);

  const handleHealthScoreAdjust = (adjustedEstimatedValue: number, healthScore: number) => {
    setCurrentReport((prev) => ({
      ...prev,
      price: {
        ...prev.price,
        estimatedValue: adjustedEstimatedValue,
      },
      reliability: {
        ...prev.reliability,
        score: Math.min(10, Math.round((healthScore / 10) * 10) / 10),
      },
    }));
  };

  return (
    <div className={`${embedded ? 'scanner-detailed-report max-w-none' : 'max-w-3xl mx-auto'} space-y-4 sm:space-y-5 pb-16 text-text-primary`}>
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Nuova ricerca
        </button>
      )}

      {/* 1. Score + verdetto unified hero */}
      <ReportScoreHero report={currentReport} isModelData={isModelData} />

      {/* 2. Interactive Vehicle Customizer: Anno, Km, Cambio, Alimentazione */}
      <ReportQuickCustomizer
        report={currentReport}
        onUpdate={(updated) => setCurrentReport(updated)}
      />

      {/* 3. KPI Cards: prezzo, affidabilità, costo annuo realistico, consumo, bollo */}
      <KpiCards report={currentReport} />

      {/* 4. PUNTI DI FORZA E CRITICITÀ */}
      <section className="bg-surface rounded-2xl shadow-card border border-border p-4 sm:p-5">
        <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-text-primary flex items-center gap-1.5 mb-3">
          <Users className="w-4 h-4 text-brand" />
          Punti di forza e Criticità
        </h2>
        <div className="grid sm:grid-cols-2 gap-3.5">
          <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 rounded-xl p-3.5">
            <h3 className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 mb-2 text-xs sm:text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              Punti di forza
            </h3>
            <ul className="space-y-1.5">
              {strengths.map((s: string, idx: number) => (
                <li key={idx} className="text-xs text-text-secondary flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 rounded-xl p-3.5">
            <h3 className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 mb-2 text-xs sm:text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              Criticità da verificare
            </h3>
            <ul className="space-y-1.5">
              {weaknesses.map((w: string, idx: number) => (
                <li key={idx} className="text-xs text-text-secondary flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* BANNER PROFILO DIGITALE AUTO (PASSPORT) */}
      <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50/80 via-white to-sky-50/50 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-black uppercase tracking-wide">
              Novità
            </span>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
              Crea il Profilo Digitale di questa {vehicle.make} {vehicle.model}
            </h3>
          </div>
          <p className="text-xs text-slate-600 max-w-xl">
            Ottieni un passaporto permanente con QR Code per monitorare tagliandi, scadenze bollo/revisione, libretto e cronologia riparazioni.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreatePassport}
          disabled={isCreatingPassport}
          className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 shrink-0 transition-all cursor-pointer disabled:opacity-50"
        >
          {isCreatingPassport ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Creazione...
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              Crea Profilo Digitale
            </>
          )}
        </button>
      </div>

      {/* 5. SPECIFICHE TECNICHE ESSENZIALI */}
      <div className="bg-surface rounded-2xl shadow-card border border-border p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-text-primary flex items-center gap-1.5">
            <Car className="w-4 h-4 text-brand" />
            Scheda Tecnica del Veicolo
          </h2>
          <span className="text-[11px] font-semibold text-text-secondary bg-surface-2 px-2.5 py-0.5 rounded-full border border-border">
            {specs.length} parametri
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {specs.map((item) => (
            <div key={item.label} className="bg-surface-2 rounded-xl p-2.5 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">{item.label}</span>
              <span className="text-xs sm:text-sm font-bold text-text-primary mt-0.5 truncate">{item.value}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-border flex items-center gap-1.5 text-[11px] text-text-tertiary">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>100% Privato &amp; Gratuito: i dati sono salvati in sicurezza sul tuo dispositivo.</span>
        </div>
      </div>

      {/* STRUTTURA ACCORDION PER TUTTI GLI STRUMENTI DI APPROFONDIMENTO */}
      <div id="report-accordion-tools" className="space-y-3 pt-1">
        {/* Accordion 1: Health Score Veicolo & Diagnostica Componenti */}
        <section className="bg-surface rounded-2xl shadow-card border border-border overflow-hidden">
          <details className="group" open>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 sm:p-5 text-xs sm:text-sm font-bold text-text-primary hover:bg-surface-2/50 transition-colors">
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-brand" />
                Health Score Veicolo &amp; Analisi Danni IA (Stima Ricambi &amp; Valore)
              </span>
              <ChevronDown className="h-4 w-4 text-text-tertiary transition-transform group-open:rotate-180" />
            </summary>
            <div className="border-t border-border p-4 sm:p-5">
              <VehicleHealthScore
                report={currentReport}
                onValuationAdjust={handleHealthScoreAdjust}
              />
            </div>
          </details>
        </section>

        {/* Accordion 2: Radar Affidabilità per Categoria */}
        {reliability.categoryScores && (
          <section className="bg-surface rounded-2xl shadow-card border border-border overflow-hidden">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 sm:p-5 text-xs sm:text-sm font-bold text-text-primary hover:bg-surface-2/50 transition-colors">
                <span className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-brand" />
                  Radar Affidabilità per Categoria
                </span>
                <ChevronDown className="h-4 w-4 text-text-tertiary transition-transform group-open:rotate-180" />
              </summary>
              <div className="border-t border-border p-4 sm:p-5">
                <ReliabilityRadar categoryScores={reliability.categoryScores} />
              </div>
            </details>
          </section>
        )}


        {/* Accordion 4: Previsione Svalutazione */}
        <section className="bg-surface rounded-2xl shadow-card border border-border overflow-hidden">
          <details className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 sm:p-5 text-xs sm:text-sm font-bold text-text-primary hover:bg-surface-2/50 transition-colors">
              <span className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-brand" />
                Previsione Svalutazione nel Tempo (1, 3, 5 anni)
              </span>
              <ChevronDown className="h-4 w-4 text-text-tertiary transition-transform group-open:rotate-180" />
            </summary>
            <div className="border-t border-border p-4 sm:p-5">
              <DepreciationChart price={price} reliability={reliability} />
            </div>
          </details>
        </section>

        {/* Accordion 5: Scheda Tecnica & Informazioni Veicolo */}
        <section className="bg-surface rounded-2xl shadow-card border border-border overflow-hidden">
          <details className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 sm:p-5 text-xs sm:text-sm font-bold text-text-primary hover:bg-surface-2/50 transition-colors">
              <span className="flex items-center gap-2">
                <Car className="w-4 h-4 text-brand" />
                Scheda Tecnica & Informazioni Veicolo
              </span>
              <ChevronDown className="h-4 w-4 text-text-tertiary transition-transform group-open:rotate-180" />
            </summary>
            <div className="space-y-4 border-t border-border px-4 py-4 sm:px-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {specs.map((s) => (
                  <div key={s.label} className="bg-surface-2 rounded-xl p-2.5 sm:p-3">
                    <div className="text-[10px] font-medium text-text-secondary">{s.label}</div>
                    <div className="text-xs sm:text-sm font-semibold text-text-primary truncate">{s.value}</div>
                  </div>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-surface-2 rounded-xl p-3">
                  <div className="text-xs font-bold text-text-primary mb-1 flex items-center gap-1.5">
                    <Fuel className="w-3.5 h-3.5 text-brand" />
                    Motore
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">{reliability.engine}</p>
                </div>
                <div className="bg-surface-2 rounded-xl p-3">
                  <div className="text-xs font-bold text-text-primary mb-1 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-brand" />
                    Cambio
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">{reliability.transmission}</p>
                </div>
              </div>
            </div>
          </details>
        </section>

        {/* Accordion 6: Annunci di Mercato & Portali */}
        {price.market?.listings && price.market.listings.length > 0 && (
          <section className="bg-surface rounded-2xl shadow-card border border-border overflow-hidden">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 sm:p-5 text-xs sm:text-sm font-bold text-text-primary hover:bg-surface-2/50 transition-colors">
                <span className="flex items-center gap-2">
                  <Euro className="w-4 h-4 text-brand" />
                  Annunci reali usati per il calcolo ({price.market.total || price.market.listings.length})
                </span>
                <ChevronDown className="h-4 w-4 text-text-tertiary transition-transform group-open:rotate-180" />
              </summary>
              <div className="space-y-2 border-t border-border px-4 py-4 sm:px-6">
                {price.market.listings.slice(0, 6).map((listing) => (
                  <a
                    key={listing.id}
                    href={listing.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-surface p-3 transition-colors hover:border-brand hover:bg-surface-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs sm:text-sm font-semibold text-text-primary">{listing.title}</p>
                      <p className="text-[11px] text-text-secondary">
                        {[listing.year || undefined, listing.km ? formatKm(listing.km) : undefined, listing.city || undefined].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm sm:text-base font-extrabold text-text-primary number-mono">{formatPrice(listing.price)}</p>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-text-tertiary group-hover:text-brand" />
                  </a>
                ))}
              </div>
            </details>
          </section>
        )}

        {/* Accordion 7: Alternative nella Stessa Categoria */}
        {currentReport.alternatives && currentReport.alternatives.length > 0 && (
          <section className="bg-surface rounded-2xl shadow-card border border-border overflow-hidden">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 sm:p-5 text-xs sm:text-sm font-bold text-text-primary hover:bg-surface-2/50 transition-colors">
                <span className="flex items-center gap-2">
                  <GitCompareArrows className="w-4 h-4 text-brand" />
                  Alternative nella stessa categoria ({currentReport.alternatives.length})
                </span>
                <ChevronDown className="h-4 w-4 text-text-tertiary transition-transform group-open:rotate-180" />
              </summary>
              <div className="grid sm:grid-cols-2 gap-2.5 border-t border-border px-4 py-4 sm:px-6">
                {currentReport.alternatives.map((alt) => (
                  <div key={`${alt.make}-${alt.model}`} className="bg-surface-2 rounded-xl p-3 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-bold text-text-primary truncate">{alt.make} {alt.model}</span>
                        {alt.body && (
                          <span className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-surface border border-border text-text-secondary">
                            {alt.body}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-text-secondary mt-0.5">Stima: {formatPrice(alt.estimatedValue)}</div>
                    </div>
                    <a
                      href={`/valutazione/${slugify(alt.make)}/${slugify(alt.model)}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:underline shrink-0"
                    >
                      Vedi <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </details>
          </section>
        )}

        {/* Accordion 8: Verifiche Ufficiali (VIN, Revisioni, PRA) */}
        <section className="bg-surface rounded-2xl shadow-card border border-border overflow-hidden">
          <details className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 sm:p-5 text-xs sm:text-sm font-bold text-text-primary hover:bg-surface-2/50 transition-colors">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand" />
                Link alle Verifiche Ufficiali (Revisioni, VIN, PRA)
              </span>
              <ChevronDown className="h-4 w-4 text-text-tertiary transition-transform group-open:rotate-180" />
            </summary>
            <div className="space-y-2 border-t border-border px-4 py-4 sm:px-6">
              <a
                href="https://www.ilportaledellautomobilista.it/interrogazionistoricorevisioni/spa/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 bg-surface-2 hover:bg-border/60 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-text-primary transition-colors"
              >
                Portale dell&apos;Automobilista (Revisioni e Km reali)
                <ExternalLink className="w-3.5 h-3.5 text-text-tertiary" />
              </a>
              <a
                href="https://richiami.unraeservizi.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 bg-surface-2 hover:bg-border/60 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-text-primary transition-colors"
              >
                Verifica Campagne di Richiamo UNRAE
                <ExternalLink className="w-3.5 h-3.5 text-text-tertiary" />
              </a>
              <a
                href="https://www.aci.it/servizi/lestratto-cronologico-pra/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 bg-surface-2 hover:bg-border/60 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-text-primary transition-colors"
              >
                Estratto Cronologico PRA (Vincoli e Ipotetiche)
                <ExternalLink className="w-3.5 h-3.5 text-text-tertiary" />
              </a>
            </div>
          </details>
        </section>

        {/* Accordion 9: Generatore Annuncio di Vendita */}
        <section className="bg-surface rounded-2xl shadow-card border border-border overflow-hidden">
          <details className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 sm:p-5 text-xs sm:text-sm font-bold text-text-primary hover:bg-surface-2/50 transition-colors">
              <span className="flex items-center gap-2">
                <Euro className="w-4 h-4 text-brand" />
                Genera Annuncio di Vendita (Testo pronto per Subito & AutoScout24)
              </span>
              <ChevronDown className="h-4 w-4 text-text-tertiary transition-transform group-open:rotate-180" />
            </summary>
            <div className="border-t border-border p-3 sm:p-4">
              <SellAdGenerator report={currentReport} />
            </div>
          </details>
        </section>
      </div>

      {/* ── Action Buttons (PDF & Condividi) in basso a fine report ── */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          type="button"
          onClick={() => {
            import('@/components/PDFButton').then((m) => m.downloadPDF(currentReport));
          }}
          className="h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20"
        >
          <Download className="w-4 h-4 shrink-0" />
          Scarica PDF
        </button>
        <ShareButton
          title={`Valutazione ${vehicle.make} ${vehicle.model}`}
          text={`Guarda il report di questa ${vehicle.make} ${vehicle.model} su AutoEsperto.`}
        />
      </div>

      {/* Footer disclaimer */}
      <p className="text-[11px] text-text-tertiary flex items-center justify-center gap-1.5 text-center pt-2">
        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
        Stima indicativa basata su dati di mercato. Verifica sempre l&apos;auto di persona prima dell&apos;acquisto.
      </p>
    </div>
  );
}

