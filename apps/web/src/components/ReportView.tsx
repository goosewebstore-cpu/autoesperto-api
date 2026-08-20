'use client';

import type { AutoReport, PriceLabel } from '@autoesperto/types';
import {
  ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, Gauge, Wrench, Fuel, Car,
  Euro, Download, ExternalLink, ShieldCheck, Hash, Info, Scale, GitCompareArrows, Users, MessageCircle, ChevronDown,
} from 'lucide-react';
import { slugify } from '@/lib/catalogo';
import ReportScoreHero from '@/components/ReportScoreHero';
import AdSlot from '@/components/AdSlot';
import ConditionAssessment from '@/components/ConditionAssessment';
import ReliabilityRadar from '@/components/ReliabilityRadar';
import DepreciationChart from '@/components/DepreciationChart';
import KpiCards from '@/components/KpiCards';
import { ShareButton } from '@/components/ShareButton';
import { SellAdGenerator } from '@/components/SellAdGenerator';

function formatPrice(n: number | undefined | null) {
  return (n ?? 0).toLocaleString('it-IT') + ' €';
}

function formatKm(n: number | undefined | null) {
  return (n ?? 0).toLocaleString('it-IT') + ' km';
}

function getPriceLabelConfig(label: PriceLabel | undefined) {
  if (label === 'GOOD') return { text: 'text-success', bg: 'bg-success-light', border: 'border-success/20', label: 'Buon prezzo' };
  if (label === 'HIGH') return { text: 'text-warning', bg: 'bg-warning-light', border: 'border-warning/20', label: 'Sopra la media' };
  return { text: 'text-text-primary', bg: 'bg-surface-2', border: 'border-border', label: 'Nella media' };
}

interface ReportViewProps {
  report: AutoReport;
  onBack?: () => void;
  embedded?: boolean;
  showAds?: boolean;
  allowPhotoTools?: boolean;
}

export default function ReportView({ report, onBack, embedded = false, showAds = true, allowPhotoTools = true }: ReportViewProps) {
  const vehicle = report?.vehicle || ({} as any);
  const reliability = report?.reliability || ({} as any);
  const price = report?.price || ({} as any);

  const strengths = reliability.strengths || (reliability as any).pros || [
    'Costi di gestione e manutenzione contenuti',
    'Buona reperibilità di ricambi',
    'Facile da rivendere sul mercato',
  ];
  const weaknesses = reliability.weaknesses || (reliability as any).cons || [
    'Verificare lo stato della cinghia o catena',
    'Controllare usura freni e sospensioni',
  ];
  const advice = reliability.advice || (reliability as any).checkBeforeBuying || [
    'Controlla libretto tagliandi e cronologia',
    'Fai una prova su strada a freddo',
    'Verifica conformità chilometraggio',
  ];

  const priceLabelCfg = getPriceLabelConfig(price.priceLabel);
  const isModelData = vehicle.dataSource === 'model';
  const marketComparison = price.market?.comparison;
  const comparisonParts = [
    price.inputYear ? `anno ${price.inputYear}` : undefined,
    price.inputKm ? `circa ${formatKm(price.inputKm)}` : undefined,
  ].filter(Boolean);
  const comparisonLabel = comparisonParts.length ? comparisonParts.join(' · ') : 'modello e caratteristiche disponibili';
  const comparisonIsExact = marketComparison && marketComparison.yearMatched && marketComparison.kmMatched;
  const communityQuery = encodeURIComponent(`${vehicle.make || ''} ${vehicle.model || ''}`);
  const rawIssues = reliability.commonIssues?.length ? reliability.commonIssues : weaknesses;
  const communityHighlights = (rawIssues || []).slice(0, 3);
  const communityUrl = `https://www.reddit.com/search/?q=${communityQuery}&type=link&sort=relevance&t=all`;
  const communityLinks = [
    { label: 'Discussioni proprietari', detail: 'Reddit', href: communityUrl, icon: MessageCircle },
    { label: 'Gruppi di appassionati', detail: 'Facebook', href: `https://www.facebook.com/search/groups/?q=${communityQuery}`, icon: Users },
  ];

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
      <ReportScoreHero report={report} isModelData={isModelData} />

      {/* 2. KPI Cards: prezzo, affidabilità, costo annuo, consumo, bollo */}
      <KpiCards report={report} />

      {/* 3. Action Buttons (PDF & Condividi) - High visibility for mobile */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        <button
          onClick={() => {
            import('@/components/PDFButton').then((m) => m.downloadPDF(report));
          }}
          className="h-11 sm:h-12 rounded-xl bg-brand text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-brand-dark active:scale-[0.99] transition-all shadow-sm"
        >
          <Download className="w-4 h-4 shrink-0" />
          Scarica PDF
        </button>
        <ShareButton title={`Valutazione ${vehicle.make} ${vehicle.model}`} text={`Guarda il report di questa ${vehicle.make} ${vehicle.model} su AutoEsperto.`} />
      </div>

      {/* 4. Strengths & Weaknesses (Essential visual summary) */}
      <section className="bg-surface rounded-2xl shadow-card border border-border p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
          <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-text-primary flex items-center gap-1.5">
            <Users className="w-4 h-4 text-brand" />
            Punti di forza e Criticità
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 rounded-xl p-3.5">
            <h3 className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 mb-2.5 text-xs sm:text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              Punti di forza
            </h3>
            <ul className="space-y-2">
              {strengths.slice(0, 3).map((s: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-text-primary leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 rounded-xl p-3.5">
            <h3 className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5 mb-2.5 text-xs sm:text-sm">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              Possibili criticità
            </h3>
            <ul className="space-y-2">
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

      {/* 5. Grafici: radar affidabilità per categoria + andamento prezzo */}
      {reliability.categoryScores && (
        <section className="bg-surface rounded-2xl shadow-card border border-border p-4 sm:p-6">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div>
              <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-text-primary flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-brand" />
                Affidabilità per Categoria
              </h2>
            </div>
          </div>
          <ReliabilityRadar categoryScores={reliability.categoryScores} />
        </section>
      )}

      {/* Controllo danni: disponibile solo nell'analisi completa */}
      {allowPhotoTools && (
        <ConditionAssessment
          estimatedValue={price.estimatedValue}
          vehicle={{ make: vehicle.make, model: vehicle.model, year: vehicle.year }}
          report={report}
        />
      )}

      <section className="bg-surface rounded-2xl shadow-card border border-border p-4 sm:p-6">
        <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-text-primary mb-1 flex items-center gap-1.5">
          <TrendingDown className="w-4 h-4 text-brand" />
          Previsione Svalutazione
        </h2>
        <p className="text-xs text-text-secondary mb-3">Stima del valore residuo a 1, 3 e 5 anni.</p>
        <DepreciationChart price={price} reliability={reliability} />
      </section>

      {/* 6. Accordion: Dettagli Tecnici & Specifiche */}
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

      {/* 7. Accordion: Annunci di Mercato & Portali */}
      {price.market?.listings && price.market.listings.length > 0 && (
        <section className="bg-surface rounded-2xl shadow-card border border-border overflow-hidden">
          <details className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 sm:p-5 text-xs sm:text-sm font-bold text-text-primary hover:bg-surface-2/50 transition-colors">
              <span className="flex items-center gap-2">
                <Euro className="w-4 h-4 text-brand" />
                Annunci reali usati per il calcolo ({price.market.total})
              </span>
              <ChevronDown className="h-4 w-4 text-text-tertiary transition-transform group-open:rotate-180" />
            </summary>
            <div className="space-y-2 border-t border-border px-4 py-4 sm:px-6">
              {price.market.listings.slice(0, 6).map((listing) => {
                return (
                  <a key={listing.id} href={listing.sourceUrl} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-surface p-3 transition-colors hover:border-brand hover:bg-surface-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs sm:text-sm font-semibold text-text-primary">{listing.title}</p>
                      <p className="text-[11px] text-text-secondary">{[listing.year || undefined, listing.km ? formatKm(listing.km) : undefined, listing.city || undefined].filter(Boolean).join(' · ')}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm sm:text-base font-extrabold text-text-primary number-mono">{formatPrice(listing.price)}</p>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-text-tertiary group-hover:text-brand" />
                  </a>
                );
              })}
            </div>
          </details>
        </section>
      )}

      {/* 8. Accordion: Alternative & Confronti */}
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
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-text-primary truncate">{alt.make} {alt.model}</div>
                    <div className="text-[11px] text-text-secondary">Stima: {formatPrice(alt.estimatedValue)}</div>
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

      {/* 9. Accordion: Verifiche Ufficiali (VIN, Revisioni, PRA) */}
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

      {/* 10. Sell Ad Generator (optional tool) */}
      <section className="bg-surface rounded-2xl shadow-card border border-border overflow-hidden">
        <SellAdGenerator report={report} />
      </section>

      {/* Footer disclaimer */}
      <p className="text-[11px] text-text-tertiary flex items-center justify-center gap-1.5 text-center pt-2">
        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
        Stima indicativa basata su dati di mercato. Verifica sempre l&apos;auto di persona prima dell&apos;acquisto.
      </p>
    </div>
  );
}
