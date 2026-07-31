'use client';

import { useEffect, useState } from 'react';
import {
  CheckCircle2, AlertTriangle, Euro, ExternalLink, GitCompareArrows,
  Loader2, Search, Sparkles, TrendingUp,
} from 'lucide-react';
import type { AutoReport } from '@autoesperto/types';
import { analyzeVehicle } from '@/lib/api';
import { slugify } from '@/lib/catalogo';

interface ModelReportCardProps {
  make: string;
  model: string;
}

function formatPrice(n: number) {
  return n.toLocaleString('it-IT') + ' €';
}

export default function ModelReportCard({ make, model }: ModelReportCardProps) {
  const [report, setReport] = useState<AutoReport | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    setReport(null);
    setError(false);
    analyzeVehicle({ make, model })
      .then((res) => {
        if (active) setReport(res.report);
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, [make, model]);

  if (error) return null;

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
                Range: {formatPrice(market.priceMin || 0)} – {formatPrice(market.priceMax || 0)} · da {market.total} annunci
                {market.yearMin && market.yearMax ? ` · anni ${market.yearMin}–${market.yearMax}` : ''}
              </div>
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
            <div className="bg-surface-2 rounded-xl p-4">
              <div className="text-xs font-medium text-text-secondary mb-1 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                Stima indicativa di mercato
              </div>
              <div className="text-3xl font-extrabold text-text-primary number-mono">
                {formatPrice(report.price.estimatedValue)}
              </div>
              <div className="text-xs text-text-secondary mt-0.5">
                Range: {formatPrice(report.price.min)} – {formatPrice(report.price.max)}
              </div>
            </div>
          )}

          {reliability && (
            <div className="bg-surface-2 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl font-extrabold text-text-primary number-mono">
                  {reliability.score.toFixed(1)}
                  <span className="text-base font-medium text-text-secondary">/10</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-text-primary">{reliability.verdictLabel}</div>
                  <div className="text-xs text-text-secondary mt-0.5">
                    {reliability.aiEnhanced && (
                      <span className="inline-flex items-center gap-1 text-indigo-600 font-semibold">
                        <Sparkles className="w-3 h-3" />
                        Analisi AI
                      </span>
                    )}
                    {!reliability.aiEnhanced && 'Affidabilità del modello'}
                  </div>
                </div>
              </div>
              {reliability.strengths.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {reliability.strengths.slice(0, 3).map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                      <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0 mt-0.5" />
                      {s}
                    </li>
                  ))}
                </ul>
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
                    href={`/valutazione/${slugify(alt.make)}/${slugify(alt.model)}/`}
                    className="bg-white border border-border rounded-xl px-3.5 py-3 text-sm hover:border-accent transition-colors"
                  >
                    <div className="font-semibold text-text-primary truncate">
                      {alt.make} {alt.model}
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

          <a
            href={`/?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}#ricerca`}
            className="w-full h-12 rounded-xl bg-accent text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-accent-hover active:scale-[0.99] transition-all"
          >
            <Search className="w-4 h-4" />
            Analisi completa gratuita di {make} {model}
          </a>

          <p className="text-[11px] text-text-tertiary flex items-start gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            Dati indicativi dagli annunci in vendita. Verifica sempre l&apos;esemplare specifico prima dell&apos;acquisto.
          </p>
        </div>
      )}
    </div>
  );
}
