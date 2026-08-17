import type { AutoReport } from '@autoesperto/types';

export interface CarScores {
  overall: number;
  priceScore: number;
  reliabilityScore: number;
  costScore: number;
  consumptionScore: number;
  riskScore: number;
}

export function computeScores(report: AutoReport): CarScores {
  const { reliability, price } = report;

  const reliabilityScore = Math.round(reliability.score * 10);

  let priceScore = 60;
  if (price.requestedPrice && price.estimatedValue) {
    const pct = ((price.requestedPrice - price.estimatedValue) / price.estimatedValue) * 100;
    priceScore = Math.round(100 - pct * 4);
    priceScore = Math.max(15, Math.min(98, priceScore));
  } else if (price.priceLabel === 'GOOD') {
    priceScore = 88;
  } else if (price.priceLabel === 'HIGH') {
    priceScore = 45;
  }

  const maint = reliability.futureCosts.annualMaintenance;
  const costScore = maint < 400 ? 85 : maint < 700 ? 65 : 45;

  let consumptionScore = 60;
  const cons = reliability.consumption;
  if (cons?.combined) {
    const unit = (cons.fuelType || 'l/100 km').toLowerCase();
    if (unit.includes('kw') || unit.includes('kwh')) {
      consumptionScore = 92;
    } else if (unit.includes('ibr')) {
      consumptionScore = 88;
    } else if (unit.includes('km/l')) {
      consumptionScore = Math.round(Math.min(95, 40 + cons.combined * 2.2));
    } else {
      consumptionScore = Math.round(Math.max(20, 110 - cons.combined * 8));
    }
  }

  const riskScore = reliability.verdict === 'BUY' ? 88 : reliability.verdict === 'NEGOTIATE' ? 60 : 30;

  const overall = Math.round(
    (reliabilityScore + priceScore + costScore + consumptionScore + riskScore) / 5
  );

  return { overall, priceScore, reliabilityScore, costScore, consumptionScore, riskScore };
}
