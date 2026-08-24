'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AutoReport, PriceLabel } from '@autoesperto/types';
import {
  ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, Gauge, Wrench, Fuel, Car,
  Euro, Download, ExternalLink, ShieldCheck, GitCompareArrows, Users, ChevronDown,
  TrendingDown, Sparkles, Activity, Search,
} from 'lucide-react';
import { slugify } from '@/lib/catalogo';
import ReportScoreHero from '@/components/ReportScoreHero';
import ReportQuickCustomizer from '@/components/ReportQuickCustomizer';
import ConditionAssessment from '@/components/ConditionAssessment';
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

  return (
    <div className={`${embedded ? 'scanner-detailed-report max-w-none' : 'max-w-3xl mx-auto'} space-y-4 sm:space-y-5 pb-16 text-text-primary`}>
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors py-1 px-2 -ml-2 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Nuova ricerca
        </button>
      )}

      {/* 1. Score + verdetto unified hero */}
      <ReportScoreHero report={currentReport} isModelData={isModelData} />

      {/* 2. Interactive Vehicle Customizer: Anno, Km, Cambio, Prezzo */}
      <ReportQuickCustomizer
        report={currentReport}
        onUpdate={(updated) => setCurrentReport(updated)}
      />

      {/* 3. KPI Cards: prezzo, affidabilità, costo annuo realistico, consumo, bollo */}
      <KpiCards report={currentReport} />

      {/* 4. Action Buttons (PDF & Condividi) */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        <button
          onClick={() => {
            import('@/components/PDFButton').then((m) => m.downloadPDF(currentReport));
          }}
          className="h-11 sm:h-12 rounded-xl bg-brand text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-brand-dark active:scale-[0.99] transition-all shadow-sm"
        >
          <Download className="w-4 h-4 shrink-0" />
          Scarica PDF
        </button>
        <ShareButton
          title={`Valutazione ${vehicle.make} ${vehicle.model}`}
          text={`Guarda il report di questa ${vehicle.make} ${vehicle.model} su AutoEsperto.`}
        />
      </div>

      {/* 5. PROFILO DIGITALE AUTO — HERO CARD CON DATI AGGIORNATI */}
      <div className="rounded-2xl border border-blue-200/90 dark:border-blue-800/60 bg-gradient-to-br from-blue-50/90 via-white to-blue-50/60 dark:from-blue-950/40 dark:via-slate-900 dark:to-blue-950/20 p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 text-[10px] font-extrabold uppercase tracking-wide mb-1">
              <ShieldCheck className="w-3 h-3 text-blue-600" /> Profilo Digitale Auto
            </span>
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight">
              Salva questa auto nel tuo Profilo Digitale Auto
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              Conserva analisi, foto, documenti, valore e storico della tua auto in un unico posto. Sempre aggiornabile e condivisibile con QR code.
            </p>
          </div>
        </div>

        <div className="pt-1 flex flex-col sm:flex-row items-center gap-2.5">
          <button
            onClick={() => {
              const pass = createPassportFromReport(currentReport);
              router.push(`/passport/${pass.id}`);
            }}
            className="w-full sm:w-auto flex-1 h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20"
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            Crea Profilo Digitale
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('report-accordion-tools');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto h-11 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
          >
            Continua senza salvare
          </button>
        </div>

        <div className="pt-1 flex items-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>100% Privato: i dati rimangono memorizzati nel tuo profilo personale sul tuo dispositivo.</span>
        </div>
      </div>

      {/* 6. PUNTI DI FORZA E CRITICITÀ (Essenziali e puliti fuori) */}
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
              {strengths.slice(0, 3).map((s: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-text-primary leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 rounded-xl p-3.5">
            <h3 className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5 mb-2 text-xs sm:text-sm">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              Possibili criticità
            </h3>
            <ul className="space-y-1.5">
              {weaknesses.slice(0, 3).map((w: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-text-primary leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* STRUTTURA ACCORDION PER TUTTI GLI STRUMENTI DI APPROFONDIMENTO */}
      <div id="report-accordion-tools" className="space-y-3 pt-1">
        {/* Accordion 1: Health Score Veicolo & Diagnostica Componenti */}
        <section className="bg-surface rounded-2xl shadow-card border border-border overflow-hidden">
          <details className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 sm:p-5 text-xs sm:text-sm font-bold text-text-primary hover:bg-surface-2/50 transition-colors">
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-brand" />
                Diagnosi Salute & Sottosistemi Meccanici (Health Score)
              </span>
              <ChevronDown className="h-4 w-4 text-text-tertiary transition-transform group-open:rotate-180" />
            </summary>
            <div className="border-t border-border p-4 sm:p-5">
              <VehicleHealthScore report={currentReport} />
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

        {/* Accordion 3: Valutazione Condizione, Danni & Stima Ricambi */}
        {allowPhotoTools && (
          <section className="bg-surface rounded-2xl shadow-card border border-border overflow-hidden">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 sm:p-5 text-xs sm:text-sm font-bold text-text-primary hover:bg-surface-2/50 transition-colors">
                <span className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-brand" />
                  Valutazione Condizione, Danni & Stima Ricambi
                </span>
                <ChevronDown className="h-4 w-4 text-text-tertiary transition-transform group-open:rotate-180" />
              </summary>
              <div className="border-t border-border p-3 sm:p-4">
                <ConditionAssessment
                  estimatedValue={price.estimatedValue}
                  vehicle={{ make: vehicle.make, model: vehicle.model, year: vehicle.year }}
                  report={currentReport}
                />
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
        {report.alternatives && report.alternatives.length > 0 && (
          <section className="bg-surface rounded-2xl shadow-card border border-border overflow-hidden">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 sm:p-5 text-xs sm:text-sm font-bold text-text-primary hover:bg-surface-2/50 transition-colors">
                <span className="flex items-center gap-2">
                  <GitCompareArrows className="w-4 h-4 text-brand" />
                  Alternative nella stessa categoria ({report.alternatives.length})
                </span>
                <ChevronDown className="h-4 w-4 text-text-tertiary transition-transform group-open:rotate-180" />
              </summary>
              <div className="grid sm:grid-cols-2 gap-2.5 border-t border-border px-4 py-4 sm:px-6">
                {report.alternatives.map((alt) => (
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

      {/* Footer disclaimer */}
      <p className="text-[11px] text-text-tertiary flex items-center justify-center gap-1.5 text-center pt-2">
        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
        Stima indicativa basata su dati di mercato. Verifica sempre l&apos;auto di persona prima dell&apos;acquisto.
      </p>
    </div>
  );
}

