import type { AutoReport } from '@autoesperto/types';
import type { FreeScanResult } from '@/lib/api';
import type { VerdictData, VerdictLabel, VerdictTone } from '@/components/BuyVerdictCard';

const VERDICT_LABEL: Record<string, VerdictLabel> = {
  BUY: 'BUON AFFARE',
  NEGOTIATE: 'TRATTA',
  AVOID: 'EVITALA',
};

const VERDICT_TONE: Record<string, VerdictTone> = {
  BUY: 'good',
  NEGOTIATE: 'fair',
  AVOID: 'high',
};

const toneFor = (label: VerdictLabel): VerdictTone => (label === 'BUON AFFARE' ? 'good' : label === 'TRATTA' ? 'fair' : 'high');

function pickChecks(report: AutoReport): string[] {
  const pool = [...report.reliability.weaknesses, ...report.reliability.commonIssues, ...report.reliability.advice];
  const unique = Array.from(new Set(pool));
  return unique.slice(0, 4).map((item) => item.replace(/\.$/, ''));
}

export function verdictFromReport(report: AutoReport): VerdictData {
  const label = VERDICT_LABEL[report.reliability.verdict] ?? 'TRATTA';
  const estimated = report.price.estimatedValue;
  const min = report.price.min;
  const max = report.price.max;
  const requested = report.price.requestedPrice;
  const score = Math.max(0, Math.min(100, Math.round(report.reliability.score * 10)));
  const percent = report.price.priceVsMarketPercent;
  const checks = pickChecks(report);
  const recommended = report.price.adjustedForKm ?? estimated;

  return {
    label,
    tone: VERDICT_TONE[report.reliability.verdict] ?? 'fair',
    score,
    requestedPrice: requested,
    estimated,
    min,
    max,
    percent,
    checks: checks.length > 0 ? checks : ['Kilometraggio', 'Manutenzione', 'Pneumatici', 'Carrozzeria'],
    recommendedPrice: recommended,
    negotiationMin: min,
    negotiationMax: Math.max(min, Math.min(recommended, max)),
    finalVerdict: report.reliability.summary,
  };
}

export function verdictFromGated(result: FreeScanResult, requestedPrice?: number): VerdictData {
  const value = result.value;
  const priceCheck = result.priceCheck;
  const label = priceCheck?.label ?? 'TRATTA';
  const estimated = value?.estimated ?? requestedPrice ?? 0;
  const min = value?.min ?? estimated;
  const max = value?.max ?? estimated;

  return {
    label,
    tone: priceCheck?.tone ?? toneFor(label),
    requestedPrice,
    estimated,
    min,
    max,
    percent: priceCheck?.percent,
    checks: ['Kilometraggio', 'Manutenzione', 'Pneumatici', 'Carrozzeria'],
    recommendedPrice: estimated,
    negotiationMin: min,
    negotiationMax: Math.max(min, Math.min(estimated, max)),
    finalVerdict:
      label === 'BUON AFFARE'
        ? 'Il prezzo è in linea con il valore di mercato. Verifica le condizioni dell\u2019auto prima di chiudere.'
        : label === 'EVITALA'
          ? 'Il prezzo è nettamente sopra il valore di mercato: serve il report completo per capire se conviene trattare.'
          : 'Il prezzo è leggermente sopra il valore stimato: c\u2019è margine di trattativa.',
  };
}
