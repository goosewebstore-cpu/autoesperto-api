'use client';

import type { CSSProperties } from 'react';
import type { AutoReport } from '@autoesperto/types';
import { AlertTriangle, CheckCircle2, Info, ShieldCheck, XCircle } from 'lucide-react';
import { computeScores } from '@/lib/score';

type Tone = 'good' | 'fair' | 'bad';

interface SubScore {
  label: string;
  value: number;
  tone: Tone;
}

function formatPrice(n: number | undefined | null) {
  return Math.round(n ?? 0).toLocaleString('it-IT') + ' €';
}

function roundTo100(n: number | undefined | null) {
  return Math.round((n ?? 0) / 100) * 100;
}

function toneOf(value: number): Tone {
  if (value >= 70) return 'good';
  if (value >= 45) return 'fair';
  return 'bad';
}

function verdictFor(report: AutoReport, priceScore: number): { label: string; tone: Tone; note: string } {
  const reliability = report.reliability || ({} as any);
  if (reliability.verdict === 'AVOID') {
    return { label: 'EVITALA', tone: 'bad', note: 'Rischi o costi troppo elevati: valuta alternative prima di procedere.' };
  }
  if (reliability.verdict === 'NEGOTIATE' || priceScore < 70) {
    return { label: 'TRATTA IL PREZZO', tone: 'fair', note: 'Auto interessanti, ma il prezzo o le condizioni richiedono contrattazione.' };
  }
  return { label: 'BUON AFFARE', tone: 'good', note: 'Prezzo in fascia corretta e modello con buona affidabilità.' };
}

const TONE_UI = {
  good: {
    badge: 'bg-success-light text-success border-success/30',
    icon: CheckCircle2,
    label: 'Basso',
  },
  fair: {
    badge: 'bg-warning-light text-warning border-warning/30',
    icon: AlertTriangle,
    label: 'Medio',
  },
  bad: {
    badge: 'bg-danger-light text-danger border-danger/30',
    icon: XCircle,
    label: 'Alto',
  },
};

function Bar({ value, tone }: { value: number; tone: Tone }) {
  const color = tone === 'good' ? 'bg-success' : tone === 'fair' ? 'bg-warning' : 'bg-danger';
  return (
    <span className="ae-subb-bar">
      <span className={`ae-subb-fill ${color}`} style={{ width: `${value}%` }} />
    </span>
  );
}

export default function ReportScoreHero({ report, isModelData = false }: { report: AutoReport; isModelData?: boolean }) {
  const vehicle = report.vehicle || ({} as any);
  const reliability = report.reliability || ({} as any);
  const price = report.price || ({} as any);
  const scores = computeScores(report);
  const verdict = verdictFor(report, scores.priceScore);
  const VIcon = TONE_UI[verdict.tone].icon;

  const subScores: SubScore[] = [
    { label: 'Prezzo', value: scores.priceScore, tone: toneOf(scores.priceScore) },
    { label: 'Affidabilità', value: scores.reliabilityScore, tone: toneOf(scores.reliabilityScore) },
    { label: 'Costi', value: scores.costScore, tone: toneOf(scores.costScore) },
    { label: 'Consumi', value: scores.consumptionScore, tone: toneOf(scores.consumptionScore) },
    { label: 'Rischio', value: scores.riskScore, tone: toneOf(scores.riskScore) },
  ];

  const marketRef = (price.market?.priceAvg ?? price.estimatedValue) || 0;
  const requested = price.requestedPrice;
  const min = price.min || 0;
  const max = price.max || 0;
  const barPos = requested != null && max > min
    ? Math.max(2, Math.min(98, ((requested - min) / (max - min)) * 100))
    : 50;

  const offerMin = roundTo100(marketRef * 0.95);
  const offerMax = roundTo100(marketRef * 1.03);
  const maxPay = roundTo100(marketRef);
  const overpaid = requested != null && requested > marketRef
    ? Math.round(requested - marketRef)
    : null;

  const checklist = ((reliability.advice?.length ? reliability.advice : reliability.commonIssues) || []).slice(0, 4);

  return (
    <section className="ae-score-hero" aria-label={`Verdetto AutoEsperto: ${verdict.label}`}>
      <div className="ae-score-main">
        <div className="ae-score-ring" style={{ '--ae-score': `${scores.overall * 3.6}deg`, '--ae-ring': scores.overall >= 70 ? 'var(--success)' : scores.overall >= 45 ? 'var(--warning)' : 'var(--danger)' } as CSSProperties}>
          <div className="ae-score-ring-inner">
            <span className="ae-score-num">{scores.overall}</span>
            <span className="ae-score-max">/100</span>
          </div>
        </div>

        <div className="ae-score-copy">
          <span className="ae-score-label">AutoEsperto Score</span>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-extrabold ${TONE_UI[verdict.tone].badge}`}>
              <VIcon className="h-4 w-4" />
              {verdict.label}
            </span>
            {isModelData && (
              <span className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium bg-surface-2 text-text-secondary">
                <Info className="h-3.5 w-3.5" />
                Dati indicativi del modello
              </span>
            )}
          </div>
          {reliability.summary ? (
            <p className="ae-score-note">{reliability.summary}</p>
          ) : (
            <p className="ae-score-note">{verdict.note}</p>
          )}
        </div>
      </div>

      <div className="ae-score-details">
        <div className="ae-price-compare">
          {requested != null ? (
            <>
              <div className="ae-price-cols">
                <div>
                  <span className="ae-price-cap">Prezzo richiesto</span>
                  <strong className="ae-price-val">{formatPrice(requested)}</strong>
                </div>
                <div className="text-right">
                  <span className="ae-price-cap">Valore di mercato</span>
                  <strong className="ae-price-val">{formatPrice(price.estimatedValue)}</strong>
                  <span className="ae-price-range">{formatPrice(min)} – {formatPrice(max)}</span>
                </div>
              </div>
              <div className="ae-bar">
                <span className="ae-bar-track" />
                <span className="ae-bar-marker" style={{ left: `${barPos}%` }} title="Prezzo richiesto" />
                <span className="ae-bar-range" style={{ left: '0%', width: '100%' }} />
              </div>
              <p className={`ae-price-hint ${requested > max ? 'text-danger' : requested < min ? 'text-success' : 'text-text-secondary'}`}>
                {requested > max
                  ? `Sopra la fascia di mercato: pagheresti circa ${formatPrice(requested - max)} in più del limite stimato.`
                  : requested < min
                    ? `Sotto la fascia di mercato: un'offerta interessante, se l'esemplare è in ordine.`
                    : `In linea con la fascia di mercato (${formatPrice(min)} – ${formatPrice(max)}).`}
              </p>
            </>
          ) : (
            <p className="ae-price-hint text-text-secondary">
              Inserisci il prezzo richiesto durante l'analisi per confrontarlo con il valore di mercato.
            </p>
          )}
        </div>

        <div className="ae-subb-grid">
          {subScores.map((sub) => {
            const ui = TONE_UI[sub.tone];
            return (
              <div key={sub.label} className="ae-subb">
                <div className="ae-subb-head">
                  <span>{sub.label}</span>
                  <strong>{sub.value}/100</strong>
                </div>
                <Bar value={sub.value} tone={sub.tone} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="ae-score-bottom">
        {requested != null && (
          <div className="ae-offer">
            <span className="ae-offer-label">Quanto offrirei</span>
            <div className="ae-offer-cols">
              <div>
                <span className="ae-offer-cap">Offerta consigliata</span>
                <strong>{formatPrice(offerMin)} – {formatPrice(offerMax)}</strong>
              </div>
              <div>
                <span className="ae-offer-cap">Massimo che pagherei</span>
                <strong>{formatPrice(maxPay)}</strong>
              </div>
              {overpaid != null && (
                <p className="ae-offer-note">
                  A {formatPrice(requested)} pagheresti circa {formatPrice(overpaid)} sopra la fascia di mercato.
                </p>
              )}
            </div>
          </div>
        )}

        {checklist.length > 0 && (
          <div className="ae-score-check">
            <span className="ae-score-check-title">
              <ShieldCheck className="h-4 w-4" />
              Prima di comprarla
            </span>
            <ul>
              {checklist.map((item, i) => (
                <li key={`${item}-${i}`}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <p className="ae-score-disclaimer">
        <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
        Stime indicative basate su dati di mercato e informazioni tecniche. Non sostituiscono un controllo professionale dell'esemplare.
      </p>
    </section>
  );
}
