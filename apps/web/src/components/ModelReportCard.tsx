'use client';

import { useEffect, useState } from 'react';
import {
  CheckCircle2, AlertTriangle, Euro, ExternalLink, GitCompareArrows,
  Loader2, Search, TrendingUp,
} from 'lucide-react';
import type { AutoReport } from '@autoesperto/types';
import { analyzeVehicle } from '@/lib/api';
import { slugify } from '@/lib/catalogo';

interface ModelReportCardProps {
  make: string;
  model: string;
  year?: number;
  initialReport?: AutoReport;
  /** Quando true il componente non lancia la propria fetch: la gestisce il genitore. */
  isLoading?: boolean;
  hasError?: boolean;
}

function formatPrice(n: number) {
  return n.toLocaleString('it-IT') + ' €';
}

export default function ModelReportCard({ make, model, year, initialReport, isLoading, hasError }: ModelReportCardProps) {
  const [report, setReport] = useState<AutoReport | null>(initialReport || null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (initialReport) {
      setReport(initialReport);
      return;
    }

    let active = true;
    setReport(null);
    setError(false);
    if (isLoading || hasError) return;
    analyzeVehicle({ make, model, ...(year ? { year } : {}) })
      .then((res) => {
        if (active) setReport(res.report);
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, [make, model, year, initialReport, isLoading, hasError]);

  if (error || hasError) return null;

  const market = report?.price.market;
  const reliability = report?.reliability;

  return (
    <div className="bg-white rounded-2xl shadow-card border border-border p-6 md:p-7">
      <h2 className="text-base font-bold text-text-primary mb-4">
        Prezzo di mercato di {make} {model}
      </h2>

      {!report ? (
        <div className="flex items-center gap-3 text-sm text-text-secondary py-6">
          <Loader2 className="w-4 h-4 animate-spin text-accent" />
          Cerco gli annunci reali in vendita…
        </div>
      ) : (
        <div className="space-y-5">
          {market && market.priceAvg ? (
            <div className="bg-surface-2 rounded-xl p-4 border border-[#e6007e]/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-text-secondary">
                  Prezzo medio reale degli annunci in vendita
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#e6007e]/10 text-[#c4006b] text-[11px] font-semibold">
                  subito.it
                </span>
              </div>
              <div className="text-3xl font-extrabold text-text-primary number-mono">
                {formatPrice(market.priceAvg)}
              </div>
              <div className="text-xs text-text-secondary mt-0.5">
                Media di {market.total} annunci · Range: {formatPrice(market.priceMin || 0)} – {formatPrice(market.priceMax || 0)}
                {market.yearMin && market.yearMax ? ` · anni ${market.yearMin}–${market.yearMax}` : ''}
              </div>
              {market.comparison?.disclosure && (
                <p className="text-[11px] text-text-tertiary mt-1.5 leading-relaxed">
                  {market.comparison.disclosure.replace(/con\s+anno\s+undefined\s*(\(±1\))?/gi, 'su tutti gli anni')}
                </p>
              )}
              <a
                href={market.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-accent hover:underline"
              >
                Vedi gli annunci reali
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ) : (
            <div className="bg-surface-2 rounded-xl p-4 border border-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="text-xs font-medium text-text-secondary flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                  Stima indicativa di mercato
                </div>
                {report.price.isSegmentEstimate && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-200">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    Stima di categoria
                  </span>
                )}
              </div>
              <div className="text-3xl font-extrabold text-text-primary number-mono">
                {formatPrice(report.price.estimatedValue)}
              </div>
              <div className="text-xs text-text-secondary mt-0.5">
                Range: {formatPrice(report.price.min)} – {formatPrice(report.price.max)}
              </div>
              {report.price.isSegmentEstimate && (
                <div className="mt-3 p-2.5 rounded-lg bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
                  <strong>Trasparenza stima:</strong> Per questo modello raro o a bassa tiratura, il prezzo e l&apos;affidabilità sono stimati statisticamente sulla categoria/segmento di appartenenza e non su un volume sufficiente di annunci verificati.
                </div>
              )}
            </div>
          )}

          {reliability && (
            <div className="bg-surface-2 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl font-extrabold text-text-primary number-mono">
                  {(Number(reliability.score) > 10 ? Number(reliability.score) / 10 : (Number(reliability.score) || 7.5)).toFixed(1)}
                  <span className="text-base font-medium text-text-secondary">/10</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-text-primary">{reliability.verdictLabel}</div>
                  <div className="text-xs text-text-secondary mt-0.5">
                    {reliability.aiEnhanced && (
                      <span className="inline-flex items-center gap-1 text-indigo-600 font-semibold">
                        Analisi dettagliata
                      </span>
                    )}
                    {!reliability.aiEnhanced && 'Affidabilità del modello'}
                  </div>
                </div>
              </div>
              {reliability.summary && (
                <p className="mt-3 text-xs text-text-secondary leading-relaxed">
                  {reliability.summary}
                </p>
              )}
              {reliability.strengths.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {reliability.strengths.slice(0, 3).map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      {s}
                    </li>
                  ))}
                </ul>
              )}
              <div className={`mt-3 rounded-xl border p-3 ${reliability.verdict === 'BUY' ? 'border-emerald-200 bg-emerald-50' : reliability.verdict === 'NEGOTIATE' ? 'border-amber-200 bg-amber-50' : 'border-rose-200 bg-rose-50'}`}>
                <div className="text-[11px] font-bold uppercase tracking-wider text-text-tertiary">
                  Conviene comprarla?
                </div>
                <div className={`mt-0.5 text-sm font-extrabold ${reliability.verdict === 'BUY' ? 'text-emerald-700' : reliability.verdict === 'NEGOTIATE' ? 'text-amber-800' : 'text-rose-700'}`}>
                  {reliability.verdict === 'BUY'
                    ? 'Sì, con i controlli del caso'
                    : reliability.verdict === 'NEGOTIATE'
                      ? 'Con attenzione, tratta il prezzo'
                      : 'Valuta alternative o fai controlli approfonditi'}
                </div>
              </div>
              {(reliability.advice.length > 0 || reliability.commonIssues.length > 0) && (
                <div className="mt-3 rounded-xl border border-border bg-white p-3">
                  <h4 className="mb-2 flex items-center gap-1.5 text-xs font-bold text-text-primary">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Cosa controllare prima di comprare
                  </h4>
                  <ul className="space-y-1.5">
                    {(reliability.advice.length ? reliability.advice : reliability.commonIssues)
                      .slice(0, 4)
                      .map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-text-secondary leading-relaxed">
                          <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {report.alternatives && report.alternatives.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-2.5 flex items-center gap-1.5">
                <GitCompareArrows className="w-4 h-4 text-accent" />
                Confronta con auto simili
              </h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {report.alternatives.map((alt) => (
                  <a
                    key={`${alt.make}-${alt.model}`}
                    href={`/valutazione/${slugify(alt.make)}/${slugify(alt.model)}`}
                    className="bg-white border border-border rounded-xl px-3.5 py-3 text-sm hover:border-accent transition-colors"
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="font-semibold text-text-primary truncate">
                        {alt.make} {alt.model}
                      </div>
                      {alt.body && (
                        <span className="shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-surface-2 text-text-secondary">
                          {alt.body}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-text-secondary mt-0.5">
                      {alt.market?.priceAvg ? (
                        <>
                          <Euro className="w-3 h-3 inline mr-0.5 -mt-0.5" />
                          media {formatPrice(alt.market.priceAvg)} · da {alt.market.total} annunci
                        </>
                      ) : (
                        `Stima ${formatPrice(alt.estimatedValue)}`
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-accent/20 bg-accent-light p-4 text-center">
            <h3 className="text-sm font-extrabold text-text-primary">
              Hai trovato una {make} {model} in vendita?
            </h3>
            <p className="mt-0.5 text-xs text-text-secondary leading-relaxed">
              Controlla prezzo, affidabilità e cosa guardare sull&apos;esemplare prima di contattare il venditore.
            </p>
            <a
              href={`/?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}#scanner-section`}
              className="home-hero-cta w-full mt-3 !min-h-[44px]"
            >
              <Search className="w-4 h-4" />
              Controlla questa {model} gratis <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <p className="text-[11px] text-text-tertiary flex items-start gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            Dati indicativi dagli annunci in vendita. Verifica sempre l&apos;esemplare specifico prima dell&apos;acquisto.
          </p>
        </div>
      )}
    </div>
  );
}
