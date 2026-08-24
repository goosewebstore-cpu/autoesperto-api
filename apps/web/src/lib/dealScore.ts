export type DealLabelType =
  | 'OTTIMO_AFFARE'
  | 'BUON_PREZZO'
  | 'PREZZO_CORRETTO'
  | 'SOPRA_MERCATO'
  | 'MOLTO_SOPRA_MERCATO'
  | 'DATI_INSUFFICIENTI';

export interface DealScoreResult {
  dealScore: number; // 0 - 100
  label: DealLabelType;
  labelText: string;
  badgeTone: 'emerald' | 'green' | 'slate' | 'amber' | 'rose' | 'gray';
  priceDiffPercent: number; // e.g. -7% or +15%
  savingsAmount: number; // € saved vs median market price
  percentileRank: number; // e.g. 61° percentile -> cheaper than 39% of cars
  cheaperThanPercent: number;
  comparablesCount: number;
  confidence: 'alta' | 'media' | 'bassa';
  explanation: string;
}

export function computeDealScore(
  askingPrice: number,
  estimatedMarketAvg: number,
  estimatedMarketMin: number,
  estimatedMarketMax: number,
  availableComparablesCount: number = 42
): DealScoreResult {
  const comparables = Math.max(1, availableComparablesCount);
  const isSampleInsufficient = comparables < 5;

  if (isSampleInsufficient || !askingPrice || !estimatedMarketAvg) {
    return {
      dealScore: 50,
      label: 'DATI_INSUFFICIENTI',
      labelText: 'DATI INSUFFICIENTI',
      badgeTone: 'gray',
      priceDiffPercent: 0,
      savingsAmount: 0,
      percentileRank: 50,
      cheaperThanPercent: 50,
      comparablesCount: comparables,
      confidence: 'bassa',
      explanation: 'Campione di annunci comparabili non sufficiente per una valutazione statistica certificata.',
    };
  }

  // Price difference vs market average
  const diffPct = Math.round(((askingPrice - estimatedMarketAvg) / estimatedMarketAvg) * 100);
  const savings = Math.max(0, estimatedMarketAvg - askingPrice);

  // Percentile approximation across market distribution
  const spread = Math.max(1000, estimatedMarketMax - estimatedMarketMin);
  const posInSpread = (askingPrice - estimatedMarketMin) / spread;
  const percentile = Math.min(99, Math.max(1, Math.round(posInSpread * 100)));
  const cheaperThan = Math.max(1, 100 - percentile);

  // Deal score calculation (100 = huge bargain, 50 = market average, 0 = grossly overpriced)
  let score = 50 - diffPct * 2.8;
  score = Math.min(99, Math.max(10, Math.round(score)));

  let label: DealLabelType = 'PREZZO_CORRETTO';
  let labelText = 'PREZZO CORRETTO';
  let badgeTone: DealScoreResult['badgeTone'] = 'slate';
  let explanation = `Il prezzo richiesto è perfettamente in linea con la media degli annunci comparabili (€${estimatedMarketAvg.toLocaleString('it-IT')}).`;

  if (diffPct <= -10) {
    label = 'OTTIMO_AFFARE';
    labelText = 'OTTIMO AFFARE';
    badgeTone = 'emerald';
    explanation = `Questo veicolo è circa il ${Math.abs(diffPct)}% sotto il valore stimato di mercato. Risparmio stimato di circa €${savings.toLocaleString('it-IT')}.`;
  } else if (diffPct <= -3) {
    label = 'BUON_PREZZO';
    labelText = 'BUON PREZZO';
    badgeTone = 'green';
    explanation = `Prezzo vantaggioso: circa il ${Math.abs(diffPct)}% inferiore alla media del mercato italiano.`;
  } else if (diffPct <= 3) {
    label = 'PREZZO_CORRETTO';
    labelText = 'PREZZO EQUO DI MERCATO';
    badgeTone = 'slate';
    explanation = 'Prezzo coerente con le quotazioni di riferimento per anzianità e chilometraggio.';
  } else if (diffPct <= 12) {
    label = 'SOPRA_MERCATO';
    labelText = 'SOPRA MERCATO';
    badgeTone = 'amber';
    explanation = `Il venditore richiede circa il +${diffPct}% rispetto alla media. Consigliata trattativa per rientrare nella fascia equa.`;
  } else {
    label = 'MOLTO_SOPRA_MERCATO';
    labelText = 'MOLTO SOPRA MERCATO';
    badgeTone = 'rose';
    explanation = `Prezzo fuori scala (+${diffPct}% rispetto al valore di riferimento). Non conveniente a queste condizioni.`;
  }

  const confidence: DealScoreResult['confidence'] =
    comparables >= 20 ? 'alta' : comparables >= 8 ? 'media' : 'bassa';

  return {
    dealScore: score,
    label,
    labelText,
    badgeTone,
    priceDiffPercent: diffPct,
    savingsAmount: savings,
    percentileRank: percentile,
    cheaperThanPercent: cheaperThan,
    comparablesCount: comparables,
    confidence,
    explanation,
  };
}
