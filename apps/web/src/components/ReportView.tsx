'use client';

import type { AutoReport, PriceLabel } from '@autoesperto/types';
import {
  ArrowLeft, CheckCircle2, AlertTriangle, Gauge, Wrench, Fuel, Car,
  Euro, Download, ExternalLink, ShieldCheck, Hash, Info, Scale, GitCompareArrows, Users, MessageCircle, ChevronDown,
} from 'lucide-react';
import ReportSummary from '@/components/ReportSummary';
import AdSlot from '@/components/AdSlot';
import ConditionAssessment from '@/components/ConditionAssessment';
import ReliabilityRadar from '@/components/ReliabilityRadar';
import DepreciationChart from '@/components/DepreciationChart';
import KpiCards from '@/components/KpiCards';
import { ShareButton } from '@/components/ShareButton';
import { SellAdGenerator } from '@/components/SellAdGenerator';
import { Lock } from 'lucide-react';
import Link from 'next/link';

function formatPrice(n: number) {
  return n.toLocaleString('it-IT') + ' €';
}

function formatKm(n: number) {
  return n.toLocaleString('it-IT') + ' km';
}

function getVerdictConfig(verdict: string) {
  if (verdict === 'BUY') return {
    bg: 'bg-success-light', text: 'text-success', border: 'border-success/20',
    badge: 'verdict-buy', icon: CheckCircle2, label: 'Affidabile',
  };
  if (verdict === 'NEGOTIATE') return {
    bg: 'bg-warning-light', text: 'text-warning', border: 'border-warning/20',
    badge: 'verdict-negotiate', icon: AlertTriangle, label: 'Valuta con attenzione',
  };
  return {
    bg: 'bg-danger-light', text: 'text-danger', border: 'border-danger/20',
    badge: 'verdict-avoid', icon: AlertTriangle, label: 'Rischi possibili',
  };
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
  tier?: 'anonymous' | 'registered' | 'premium';
}

export default function ReportView({ report, onBack, embedded = false, showAds = true, allowPhotoTools = true, tier = 'premium' }: ReportViewProps) {
  const { vehicle, reliability, price } = report;
  const verdict = getVerdictConfig(reliability.verdict);
  const VerdictIcon = verdict.icon;
  const priceLabelCfg = getPriceLabelConfig(price.priceLabel);
  const isModelData = vehicle.dataSource === 'model';
  const marketComparison = price.market?.comparison;
  const comparisonParts = [
    price.inputYear ? `anno ${price.inputYear}` : undefined,
    price.inputKm ? `circa ${formatKm(price.inputKm)}` : undefined,
  ].filter(Boolean);
  const comparisonLabel = comparisonParts.length ? comparisonParts.join(' · ') : 'modello e caratteristiche disponibili';
  const comparisonIsExact = marketComparison && marketComparison.yearMatched && marketComparison.kmMatched;
  const communityQuery = encodeURIComponent(`${vehicle.make} ${vehicle.model}`);
  const communityHighlights = (reliability.commonIssues?.length ? reliability.commonIssues : reliability.weaknesses).slice(0, 3);
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
    <div className={`${embedded ? 'scanner-detailed-report max-w-none' : 'max-w-3xl mx-auto'} space-y-5 pb-20 animate-fade-in`}>
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Nuova ricerca
        </button>
      )}

      {/* Summary Card - always visible */}
      <ReportSummary report={report} />

      {/* Header */}
      {!embedded && <header className="bg-white rounded-2xl shadow-card border border-border overflow-hidden">
        {vehicle.imageUrl && (
          <div className="relative h-56 md:h-72 bg-surface-2">
            <img
              src={vehicle.imageUrl}
              alt={`${vehicle.make} ${vehicle.model}`}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        )}
        <div className="p-6 md:p-7">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {vehicle.plate && (
              <span className="inline-flex items-center gap-1.5 bg-text-primary text-white px-3 py-1 rounded-lg text-sm font-bold tracking-[0.15em]">
                <Hash className="w-3.5 h-3.5 opacity-70" />
                {vehicle.plate}
              </span>
            )}
            {vehicle.plate && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-surface-2 text-text-secondary">
                <Car className="w-3 h-3" />
                Modello riconosciuto dalla targa
              </span>
            )}
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-semibold text-white ${verdict.badge}`}>
              <VerdictIcon className="w-3.5 h-3.5" />
              {verdict.label}
            </span>
            {reliability.aiEnhanced && (
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-violet-600 text-white"
                title="Punti di forza, criticità e consigli specifici per questo modello"
              >
                Analisi completa
              </span>
            )}
            {isModelData && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-surface-2 text-text-secondary">
                <Info className="w-3 h-3" />
                Dati indicativi del modello
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
            {vehicle.make} {vehicle.model}
          </h1>
          <p className="text-text-secondary text-sm md:text-base mt-1">
            {[vehicle.version, vehicle.year, vehicle.fuel, vehicle.body].filter(Boolean).join(' · ')}
          </p>
        </div>
      </header>}

      {/* Disclaimer AI */}
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 md:p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-amber-900">Nota importante — Risultato indicativo</h3>
            <p className="mt-1 text-sm text-amber-800 leading-relaxed">
              Questa analisi è <strong>indicativa</strong> e basata sui dati di mercato disponibili. Può contenere errori su marca, modello, anno, stato visivo o stima di prezzo.
              Per decisioni d'acquisto, rivolgiti sempre a un professionista per un controllo reale dell'auto.
              <strong> Carica più foto</strong> (frontale, laterale, posteriore, interni, targa) per migliorare la precisione dell'analisi.
            </p>
          </div>
        </div>
      </section>

      {/* Score + verdict */}
      <section className="bg-white rounded-2xl shadow-card border border-border p-6 md:p-7">
        <div className="flex flex-col md:flex-row items-start gap-5">
          <div className={`flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center ${verdict.bg} border ${verdict.border}`}>
            <VerdictIcon className={`w-10 h-10 ${verdict.text}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-4xl font-extrabold text-text-primary number-mono">
                {reliability.score.toFixed(1)}
                <span className="text-lg font-medium text-text-secondary">/10</span>
              </span>
              <span className={`px-2.5 py-1 rounded-lg text-sm font-semibold text-white ${verdict.badge}`}>
                {reliability.verdictLabel}
              </span>
            </div>
            <p className="text-text-secondary leading-relaxed">{reliability.summary}</p>
            <p className="text-xs text-text-tertiary mt-3 flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              {isModelData
                ? 'Valutazione basata sul modello e sulle informazioni fornite. Verifica l\'esemplare specifico prima dell\'acquisto.'
                : 'Valutazione indicativa basata sui dati disponibili e sulle informazioni fornite. Non sostituisce un\'ispezione fisica.'}
            </p>
          </div>
        </div>
      </section>

      {/* Metodologia */}
      <section className="bg-white rounded-2xl shadow-card border border-border overflow-hidden">
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 md:p-6 text-sm font-bold text-text-primary hover:bg-surface-2/50 transition-colors">
            <span>Come viene calcolato?</span>
            <ChevronDown className="h-4 w-4 text-text-tertiary transition-transform group-open:rotate-180" />
          </summary>
          <div className="space-y-3 border-t border-border/60 px-5 py-4 text-sm text-text-secondary leading-relaxed md:px-6">
            <p>
              <strong className="font-semibold text-text-primary">Valore:</strong> la stima parte dai prezzi
              pubblicati negli annunci reali per lo stesso modello. Dove possibile confrontiamo anno e
              chilometraggio simili e mostriamo il campione usato e la data di aggiornamento. Non è una
              perizia.
            </p>
            <p>
              <strong className="font-semibold text-text-primary">Affidabilità:</strong> il punteggio 0-10 è
              costruito dai dati tecnici del modello: motore, cambio, componenti più a rischio e costi di
              manutenzione attesi.
            </p>
            <p>
              <strong className="font-semibold text-text-primary">Costi:</strong> manutenzione annuale,
              carburante, bollo e assicurazione sono stime basate sul modello e sul chilometraggio indicato.
            </p>
            <p>
              I dati sono indicativi: un esemplare specifico può valere più o meno della stima. Per decisioni
              d&apos;acquisto chiedi sempre un controllo fisico.
            </p>
          </div>
        </details>
      </section>

      {tier !== 'premium' ? (
        <div className="relative mt-8">
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center">
            <div className="rounded-3xl bg-slate-900/95 backdrop-blur-md p-8 sm:p-12 shadow-2xl border border-slate-700 max-w-xl w-full mx-auto">
              <div className="mx-auto w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center mb-6">
                <Lock className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Sblocca il report completo</h3>
              <p className="text-slate-300 text-sm mb-8 leading-relaxed">
                Il tuo piano attuale non include l'accesso ai dati completi. Passa a Premium per visualizzare affidabilità, difetti comuni, andamento del mercato e prezzi reali.
              </p>
              <Link
                href="/account?upgrade=true"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 text-sm font-bold text-white transition hover:bg-blue-500"
              >
                Passa a Premium
              </Link>
            </div>
          </div>
          
          <div className="space-y-5 blur-[8px] opacity-60 pointer-events-none select-none" aria-hidden="true">
            <KpiCards report={report} />
            <section className="bg-white rounded-2xl shadow-card border border-border p-6 md:p-7 h-64" />
            <section className="bg-white rounded-2xl shadow-card border border-border p-6 md:p-7 h-96" />
          </div>
        </div>
      ) : (
        <>
          {/* KPI Cards premium: prezzo, affidabilità, costo annuo, consumo, bollo */}
          <KpiCards report={report} />

      {/* Grafici: radar affidabilità per categoria + andamento prezzo */}
      {reliability.categoryScores && (
        <section className="bg-white rounded-2xl shadow-card border border-border p-6 md:p-7">
          <h2 className="text-base font-bold text-text-primary mb-1">Affidabilità per categoria</h2>
          <p className="text-sm text-text-secondary mb-4">Punteggio 0-10 per ogni componente: motore, cambio, elettronica, sospensioni e carrozzeria.</p>
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

      <section className="bg-white rounded-2xl shadow-card border border-border p-6 md:p-7">
        <h2 className="text-base font-bold text-text-primary mb-1">Andamento valore stimato</h2>
        <p className="text-sm text-text-secondary mb-3">Svalutazione prevista a 1, 3 e 5 anni basata sul valore stimato di mercato.</p>
        <DepreciationChart price={price} reliability={reliability} />
      </section>

      {/* Ad slot (attivo solo se NEXT_PUBLIC_ADSENSE_CLIENT è configurato) */}
      <section className="bg-white rounded-2xl shadow-card border border-border p-6 md:p-7">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-text-primary">Controlla la community</h2>
            <p className="text-sm text-text-secondary mt-1">I temi pi&ugrave; ricorrenti su {vehicle.make} {vehicle.model}, utili da approfondire prima di decidere.</p>
          </div>
          <MessageCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
        </div>
        <div className="grid sm:grid-cols-3 gap-2">
          {communityHighlights.map((highlight, index) => (
            <div key={`${highlight}-${index}`} className="rounded-xl bg-surface-2 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-text-tertiary mb-1">Da verificare</p>
              <p className="text-sm font-semibold text-text-primary leading-snug">{highlight}</p>
            </div>
          ))}
        </div>
        <a href={communityUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-accent hover:underline">
          Cerca discussioni su {vehicle.make} {vehicle.model}
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <p className="text-xs text-text-tertiary mt-3">Le discussioni sono opinioni personali: usale per fare domande pi&ugrave; precise a venditore e meccanico.</p>
      </section>

      {showAds && <AdSlot placement="result" />}

      {/* Strengths / weaknesses / advice */}
      <section className="bg-white rounded-2xl shadow-card border border-border p-6 md:p-7">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-text-primary">Valutazione del modello</h2>
            <p className="text-xs text-text-tertiary mt-1">Punti ricorrenti da approfondire con community, storico manutenzione e ispezione.</p>
          </div>
          <Users className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <h3 className="font-semibold text-success flex items-center gap-2 mb-3 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              Punti di forza
            </h3>
            <ul className="space-y-2.5">
              {reliability.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-text-primary leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-danger flex items-center gap-2 mb-3 text-sm">
              <AlertTriangle className="w-4 h-4" />
              Possibili criticità
            </h3>
            <ul className="space-y-2.5">
              {reliability.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-text-primary leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-danger mt-1.5 flex-shrink-0" />
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 bg-surface-2 rounded-xl p-4">
          <h3 className="font-semibold text-text-primary mb-2.5 text-sm flex items-center gap-2">
            <Gauge className="w-4 h-4 text-accent" />
            Consigli prima dell&apos;acquisto
          </h3>
          <ul className="space-y-2">
            {reliability.advice.map((a, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-text-secondary leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                {a}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Usage suitability + versions */}
      {(reliability.usage || reliability.recommendedVersions?.length || reliability.versionsToAvoid?.length) && (
        <section className="bg-white rounded-2xl shadow-card border border-border p-6 md:p-7">
          {reliability.usage && (
            <>
              <h2 className="text-base font-bold text-text-primary mb-4 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-accent" />
                A chi si addice
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-5">
                {[
                  { label: 'Città', value: reliability.usage.city },
                  { label: 'Famiglia', value: reliability.usage.family },
                  { label: 'Autostrada', value: reliability.usage.highway },
                  { label: 'Neopatentati', value: reliability.usage.newDriver },
                ].map((u) => (
                  <div key={u.label} className="bg-surface-2 rounded-xl p-3 text-center">
                    <div className="text-[11px] font-medium text-text-secondary mb-0.5">{u.label}</div>
                    <div className="text-sm font-semibold text-text-primary">{u.value}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {(reliability.recommendedVersions?.length || reliability.versionsToAvoid?.length) && (
            <div className="grid md:grid-cols-2 gap-5">
              {reliability.recommendedVersions?.length ? (
                <div>
                  <h3 className="font-semibold text-success flex items-center gap-2 mb-3 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Versioni consigliate
                  </h3>
                  <ul className="space-y-2">
                    {reliability.recommendedVersions.map((v, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-text-primary">
                        <span className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 flex-shrink-0" />
                        {v}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {reliability.versionsToAvoid?.length ? (
                <div>
                  <h3 className="font-semibold text-danger flex items-center gap-2 mb-3 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    Versioni da evitare
                  </h3>
                  <ul className="space-y-2">
                    {reliability.versionsToAvoid.map((v, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-text-primary">
                        <span className="w-1.5 h-1.5 rounded-full bg-danger mt-1.5 flex-shrink-0" />
                        {v}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          )}
        </section>
      )}

      {/* Vehicle info */}
      <section className="bg-white rounded-2xl shadow-card border border-border p-6 md:p-7">
        <h2 className="text-base font-bold text-text-primary mb-4 flex items-center gap-2">
          <Car className="w-4 h-4 text-accent" />
          Informazioni veicolo
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
          {specs.map((s) => (
            <div key={s.label} className="bg-surface-2 rounded-xl p-3">
              <div className="text-[11px] font-medium text-text-secondary mb-0.5">{s.label}</div>
              <div className="text-sm font-semibold text-text-primary">{s.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Engine / transmission / common issues */}
      <section className="bg-white rounded-2xl shadow-card border border-border p-6 md:p-7">
        <h2 className="text-base font-bold text-text-primary mb-4">Dettagli tecnici</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-5">
          <div className="bg-surface-2 rounded-xl p-4">
            <h3 className="font-semibold text-text-primary mb-1.5 text-sm flex items-center gap-2">
              <Fuel className="w-4 h-4 text-accent" />
              Motore
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">{reliability.engine}</p>
          </div>
          <div className="bg-surface-2 rounded-xl p-4">
            <h3 className="font-semibold text-text-primary mb-1.5 text-sm flex items-center gap-2">
              <Wrench className="w-4 h-4 text-accent" />
              Cambio
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">{reliability.transmission}</p>
          </div>
        </div>
        {reliability.commonIssues.length > 0 && (
          <div>
            <h3 className="font-semibold text-text-primary mb-2.5 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              Problemi più comuni
            </h3>
            <ul className="space-y-2">
              {reliability.commonIssues.slice(0, 5).map((issue, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-text-secondary leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}
        {(reliability.consumption || reliability.taxAnnual || reliability.serviceIntervalKm) && (
          <div>
            <h3 className="font-semibold text-text-primary mb-2.5 text-sm flex items-center gap-2">
              <Fuel className="w-4 h-4 text-accent" />
              Consumi, bollo e manutenzione
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
              {reliability.consumption && (
                <>
                  <div className="rounded-lg bg-surface-2 px-3 py-2">
                    <div className="text-xs text-text-tertiary">Consumo città</div>
                    <div className="font-bold text-text-primary">{reliability.consumption.city} {reliability.consumption.fuelType || 'km/L'}</div>
                  </div>
                  <div className="rounded-lg bg-surface-2 px-3 py-2">
                    <div className="text-xs text-text-tertiary">Consumo autostrada</div>
                    <div className="font-bold text-text-primary">{reliability.consumption.highway} {reliability.consumption.fuelType || 'km/L'}</div>
                  </div>
                  <div className="rounded-lg bg-surface-2 px-3 py-2">
                    <div className="text-xs text-text-tertiary">Consumo combinato</div>
                    <div className="font-bold text-text-primary">{reliability.consumption.combined} {reliability.consumption.fuelType || 'km/L'}</div>
                  </div>
                </>
              )}
              {reliability.taxAnnual !== undefined && (
                <div className="rounded-lg bg-surface-2 px-3 py-2">
                  <div className="text-xs text-text-tertiary">Bollo annuo</div>
                  <div className="font-bold text-text-primary">{formatPrice(reliability.taxAnnual)}</div>
                </div>
              )}
              {reliability.serviceIntervalKm !== undefined && (
                <div className="rounded-lg bg-surface-2 px-3 py-2">
                  <div className="text-xs text-text-tertiary">Tagliando ogni</div>
                  <div className="font-bold text-text-primary">{formatKm(reliability.serviceIntervalKm)}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Price */}
      <section className="bg-white rounded-2xl shadow-card border border-border overflow-hidden">
        <div className="p-6 md:p-7">
          <h2 className="text-base font-bold text-text-primary mb-4 flex items-center gap-2">
            <Euro className="w-4 h-4 text-accent" />
            Prezzo
          </h2>

          {price.requestedPrice ? (
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div>
                <div className="text-xs text-text-secondary mb-0.5">Prezzo inserito</div>
                <div className="text-3xl font-extrabold text-text-primary number-mono">
                  {formatPrice(price.requestedPrice)}
                </div>
              </div>
              <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${priceLabelCfg.text} ${priceLabelCfg.bg} border ${priceLabelCfg.border}`}>
                {priceLabelCfg.label}
              </span>
            </div>
          ) : (
            <p className="text-sm text-text-secondary mb-5">
              Inserisci il prezzo richiesto per il confronto con la stima di mercato.
            </p>
          )}

          <div className="bg-surface-2 rounded-xl p-4 mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-text-secondary">Stima indicativa di mercato</span>
              {price.requestedPrice && price.priceVsMarketPercent !== undefined && !price.adjustedForKm && (
                <span className="text-xs font-semibold text-text-secondary">
                  {price.priceVsMarketPercent > 0 ? '+' : ''}{price.priceVsMarketPercent}% vs stima
                </span>
              )}
            </div>
            <div className="text-2xl font-extrabold text-text-primary number-mono">
              {formatPrice(price.estimatedValue)}
            </div>
            <div className="text-xs text-text-secondary mt-0.5">
              Range: {formatPrice(price.min)} – {formatPrice(price.max)}
            </div>
          </div>

          {price.market && price.market.priceAvg && (
            <div className="bg-surface-2 rounded-xl p-4 mb-3 border border-[#e6007e]/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-text-secondary">
                  Prezzo medio reale dagli annunci per {comparisonLabel}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#e6007e]/10 text-[#c4006b] text-[11px] font-semibold">
                  subito.it
                </span>
              </div>
              <div className="text-2xl font-extrabold text-text-primary number-mono">
                {formatPrice(price.market.priceAvg)}
              </div>
              <div className="text-xs text-text-secondary mt-0.5">
                Media di {price.market.total} annunci · Range: {formatPrice(price.market.priceMin || 0)} – {formatPrice(price.market.priceMax || 0)}
                {price.market.yearMin && price.market.yearMax ? ` · anni ${price.market.yearMin}–${price.market.yearMax}` : ''}
              </div>
              {price.market.comparison?.disclosure && (
                <p className="text-[11px] text-text-tertiary mt-1.5 leading-relaxed">
                  {price.market.comparison.disclosure}
                </p>
              )}
              {!price.market.comparison?.disclosure && (
                <div className="text-[11px] text-text-tertiary mt-1">
                  {comparisonIsExact
                    ? 'Confronto ristretto agli annunci più simili per anno e chilometraggio.'
                    : 'Confronto ampliato perché non erano disponibili almeno 3 annunci con anno e km equivalenti.'}
                </div>
              )}
              <a
                href={price.market.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-accent hover:underline"
              >
                Vedi gli annunci reali
                <ExternalLink className="w-3 h-3" />
              </a>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs">
                {price.marketUrls.filter((link) => link.source !== 'Subito.it').map((link) => (
                  <a key={link.source} href={link.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent hover:underline">
                    Cerca su {link.source}
                  </a>
                ))}
              </div>
            </div>
          )}

          {price.adjustedForKm && price.adjustedForKm > 0 && (
            <div className="bg-surface-2 rounded-xl p-4 mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-text-secondary">
                  Valore con {formatKm(price.inputKm || 0)}
                </span>
                {price.requestedPrice && price.priceVsMarketPercent !== undefined && (
                  <span className="text-xs font-semibold text-text-secondary">
                    {price.priceVsMarketPercent > 0 ? '+' : ''}{price.priceVsMarketPercent}% vs stima
                  </span>
                )}
              </div>
              <div className="text-lg font-bold text-text-primary number-mono">{formatPrice(price.adjustedForKm)}</div>
            </div>
          )}

          <p className="text-xs text-text-tertiary flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            {price.comment} La stima è orientativa e calcolata su modello, anno e caratteristiche.
          </p>
        </div>
      </section>

      {/* Costs */}
      <section className="bg-white rounded-2xl shadow-card border border-border p-6 md:p-7">
        <h2 className="text-base font-bold text-text-primary mb-4">Costi stimati</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          <div className="bg-surface-2 rounded-xl p-4">
            <div className="text-[11px] font-medium text-text-secondary mb-0.5">Manutenzione / anno</div>
            <div className="text-lg font-bold text-text-primary number-mono">{formatPrice(reliability.futureCosts.annualMaintenance)}</div>
          </div>
          <div className="bg-surface-2 rounded-xl p-4">
            <div className="text-[11px] font-medium text-text-secondary mb-0.5">Carburante / 100 km</div>
            <div className="text-lg font-bold text-text-primary number-mono">{reliability.futureCosts.fuelCostPer100Km.toFixed(0)} €</div>
          </div>
          <div className="bg-surface-2 rounded-xl p-4">
            <div className="text-[11px] font-medium text-text-secondary mb-0.5">Assicurazione / anno</div>
            <div className="text-lg font-bold text-text-primary number-mono">{formatPrice(reliability.futureCosts.insuranceEstimate)}</div>
          </div>
          <div className="bg-surface-2 rounded-xl p-4">
            <div className="text-[11px] font-medium text-text-secondary mb-0.5">Svalutazione 3 anni</div>
            <div className="text-lg font-bold text-text-primary number-mono">-{formatPrice(reliability.futureCosts.depreciation3Years)}</div>
          </div>
        </div>
        <p className="text-xs text-text-tertiary mt-3 flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
          Stime indicative basate sul modello. I costi reali variano in base a utilizzo e stato del veicolo.
        </p>
      </section>

      {/* Alternatives comparison */}
      {price.market?.listings && price.market.listings.length > 0 && (
        <section className="bg-white rounded-2xl shadow-card border border-border p-6 md:p-7">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h2 className="text-base font-bold text-text-primary">Annunci usati per il calcolo</h2>
              <p className="text-sm text-text-secondary mt-1">
                Ho confrontato {price.market.total} annunci di {vehicle.make} {vehicle.model} filtrati per {comparisonLabel}: la media è {formatPrice(price.market.priceAvg || 0)}. Sotto vedi quelli più vicini alla media.
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-[#e6007e]/10 px-2.5 py-1 text-[11px] font-semibold text-[#c4006b]">subito.it</span>
          </div>
          <div className="space-y-2">
            {price.market.listings.map((listing) => {
              const distance = Math.round(((listing.price - (price.market?.priceAvg || listing.price)) / (price.market?.priceAvg || listing.price)) * 100);
              return (
                <a key={listing.id} href={listing.sourceUrl} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 rounded-xl border border-border bg-white p-4 transition-colors hover:border-accent/40 hover:bg-surface-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-text-primary">{listing.title}</p>
                    <p className="mt-1 text-xs text-text-secondary">{[listing.year || undefined, listing.km ? formatKm(listing.km) : undefined, listing.city || undefined].filter(Boolean).join(' · ')}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-lg font-extrabold text-text-primary number-mono">{formatPrice(listing.price)}</p>
                    <p className={`text-[11px] font-semibold ${Math.abs(distance) <= 3 ? 'text-success' : 'text-text-secondary'}`}>{distance >= 0 ? '+' : ''}{distance}% dalla media</p>
                  </div>
                  <ExternalLink className="h-4 w-4 shrink-0 text-text-tertiary transition-colors group-hover:text-accent" />
                </a>
              );
            })}
          </div>
          <p className="mt-3 text-[11px] text-text-tertiary flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            Il prezzo medio è la somma dei prezzi richiesti divisa per il numero di annunci comparabili. È un indicatore di mercato, non una perizia: controlla sempre l&apos;esemplare specifico.
          </p>
        </section>
      )}

      {/* Sell Ad Generator Component */}
      <section className="bg-white rounded-2xl shadow-card border border-border overflow-hidden">
        <SellAdGenerator report={report} />
      </section>

      {report.alternatives && report.alternatives.length > 0 && (
        <section className="bg-white rounded-2xl shadow-card border border-border p-6 md:p-7">
          <h2 className="text-base font-bold text-text-primary mb-1 flex items-center gap-2">
            <GitCompareArrows className="w-4 h-4 text-accent" />
            Alternative nella stessa fascia
          </h2>
          <p className="text-xs text-text-tertiary mb-4 flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            Modelli comparabili per prezzo, categoria e utilizzo. Le medie sotto usano {comparisonLabel} per rendere il confronto più equo.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {report.alternatives.map((alt) => {
              const market = alt.market;
              const hasMarket = Boolean(market && market.priceAvg);
              return (
                <div key={`${alt.make}-${alt.model}`} className="bg-surface-2 rounded-xl p-4">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="text-sm font-semibold text-text-primary truncate">
                      {alt.make} {alt.model}
                    </div>
                    <Scale className="w-4 h-4 text-text-tertiary flex-shrink-0" />
                  </div>
                  <div className="text-lg font-extrabold text-text-primary number-mono">
                    {formatPrice(alt.estimatedValue)}
                  </div>
                  <div className="text-xs text-text-secondary mt-0.5">
                    {hasMarket ? (
                      <>
                        Prezzo medio da {market!.total} annunci · Range: {formatPrice(alt.estimatedMin)} – {formatPrice(alt.estimatedMax)}
                      </>
                    ) : (
                      <>
                        Stima · Range: {formatPrice(alt.estimatedMin)} – {formatPrice(alt.estimatedMax)}
                      </>
                    )}
                  </div>
                  {hasMarket && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#e6007e]/10 text-[#c4006b] text-[11px] font-semibold">
                        subito.it
                      </span>
                      {market!.yearMin && market!.yearMax && (
                        <span className="text-[11px] text-text-tertiary">
                          {market!.yearMin}–{market!.yearMax}{market!.kmAvg ? ` · ${formatKm(market!.kmAvg)} in media` : ''}
                        </span>
                      )}
                    </div>
                  )}
                  <a
                    href={market?.url || `https://www.subito.it/annunci-italia/vendita/auto/${alt.make.toLowerCase()}/${alt.model.toLowerCase()}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-accent hover:underline"
                  >
                    Cerca annunci
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="bg-white rounded-2xl shadow-card border border-border p-6 md:p-7">
        <h2 className="text-base font-bold text-text-primary mb-2 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-accent" />
          Controlli importanti per anno e chilometri
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed mb-4">
          Per una {vehicle.year ? `vettura del ${vehicle.year}` : 'vettura usata'}{price.inputKm ? ` con circa ${formatKm(price.inputKm)}` : ''}, verifica anche le campagne di richiamo e lo storico delle revisioni. Un richiamo dipende dal VIN: anno e modello da soli non bastano per dire se questa specifica auto è coinvolta.
        </p>
        <div className="grid sm:grid-cols-3 gap-2">
          <a
            href="https://richiami.unraeservizi.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 bg-surface-2 hover:bg-border/50 rounded-xl px-4 py-3 text-sm font-semibold text-text-primary transition-colors"
          >
            Verifica richiami con VIN
            <ExternalLink className="w-4 h-4 text-text-tertiary" />
          </a>
          <a
            href="https://www.ilportaledellautomobilista.it/interrogazionistoricorevisioni/spa/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 bg-surface-2 hover:bg-border/50 rounded-xl px-4 py-3 text-sm font-semibold text-text-primary transition-colors"
          >
            Verifica storico revisioni e km
            <ExternalLink className="w-4 h-4 text-text-tertiary" />
          </a>
          <a
            href="https://www.aci.it/servizi/lestratto-cronologico-pra/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 bg-surface-2 hover:bg-border/50 rounded-xl px-4 py-3 text-sm font-semibold text-text-primary transition-colors"
          >
            Controlla storico PRA e vincoli
            <ExternalLink className="w-4 h-4 text-text-tertiary" />
          </a>
        </div>
        <p className="text-xs text-text-tertiary mt-3 flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
          Se un chilometraggio di revisione risulta inferiore a una registrazione precedente, chiedi documenti e una verifica professionale: è un&apos;anomalia da approfondire, non una prova automatica di manomissione.
        </p>
      </section>

      {vehicle.plate && (
        <section className="bg-white rounded-2xl shadow-card border border-border p-6 md:p-7">
          <h2 className="text-base font-bold text-text-primary mb-2">Verifiche ufficiali aggiuntive</h2>
          <p className="text-sm text-text-secondary mb-4">
            Per privacy e sicurezza la targa non viene inoltrata automaticamente: inseriscila tu sul Portale dell&apos;Automobilista per controllare copertura RCA, revisioni e chilometri rilevati.
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            <a
              href="https://www.ilportaledellautomobilista.it/web/portale-automobilista/ext/verifica-copertura-rc?p_p_id=CoperturaRC_WAR_ServiziAlCittadinowar100SNAPSHOTesercizio&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view&p_p_col_id=_118_INSTANCE_hoIzOCy6I6vu__column-2&p_p_col_count=1&_CoperturaRC_WAR_ServiziAlCittadinowar100SNAPSHOTesercizio_action=coperturaRCCiclomotore"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 bg-surface-2 hover:bg-border/50 rounded-xl px-4 py-3 text-sm font-semibold text-text-primary transition-colors"
            >
              Verifica copertura RCA
              <ExternalLink className="w-4 h-4 text-text-tertiary" />
            </a>
            <a
              href="https://www.ilportaledellautomobilista.it/web/portale-automobilista/verifica-revisioni-effettuate-ms"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 bg-surface-2 hover:bg-border/50 rounded-xl px-4 py-3 text-sm font-semibold text-text-primary transition-colors"
            >
              Verifica revisioni e km
              <ExternalLink className="w-4 h-4 text-text-tertiary" />
            </a>
          </div>
        </section>
      )}

      {/* Market links + PDF */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-card border border-border p-6">
          <h2 className="text-base font-bold text-text-primary mb-3">Confronta sul mercato</h2>
          <p className="text-sm text-text-secondary mb-4">
            Vedi gli annunci reali in vendita su questi portali.
          </p>
          <div className="space-y-2">
            {price.marketUrls.map((l) => (
              <a
                key={l.source}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 bg-surface-2 hover:bg-border/50 rounded-xl px-4 py-3 text-sm font-semibold text-text-primary transition-colors"
              >
                {l.source}
                <ExternalLink className="w-4 h-4 text-text-tertiary" />
              </a>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-border p-6 flex flex-col">
          <h2 className="text-base font-bold text-text-primary mb-3 flex items-center gap-2">
            <Download className="w-4 h-4 text-accent" />
            Scarica il report
          </h2>
          <p className="text-sm text-text-secondary mb-4 flex-1">
            Report completo in PDF con dati, valutazione e stima di mercato. Perfetto da portare in concessionaria.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                import('@/components/PDFButton').then((m) => m.downloadPDF(report));
              }}
              className="w-full h-11 rounded-xl bg-accent text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-accent-hover active:scale-[0.99] transition-all"
            >
              <Download className="w-4 h-4 shrink-0" />
              Scarica PDF
            </button>
            <ShareButton title={`Valutazione ${vehicle.make} ${vehicle.model}`} text={`Guarda il report di questa ${vehicle.make} ${vehicle.model} su AutoEsperto.`} />
          </div>
        </div>
      </section>
      
      </>
      )}

      {/* Footer note */}
      <p className="text-xs text-text-tertiary flex items-center justify-center gap-1.5 text-center">
        <ShieldCheck className="w-3.5 h-3.5" />
        AutoEsperto fornisce valutazioni indicative. Rivolgiti sempre a un professionista per l&apos;ispezione.
      </p>
    </div>
  );
}
