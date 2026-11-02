/** Planning scenarios, not market-calibrated residual-value forecasts. */
export function suggestedDepreciationRate(year?: number, asOfYear = new Date().getFullYear()): number {
  if (!Number.isInteger(year) || year! < 1900 || year! > asOfYear) return 9;
  const age = asOfYear - year!;
  return age < 3 ? 12 : age < 6 ? 9 : age < 10 ? 7 : 5;
}
export function depreciationScenario(value: number, annualRate: number) {
  const base = Number.isFinite(value) && value > 0 ? value : 0;
  const rate = Number.isFinite(annualRate) ? Math.min(25, Math.max(0, annualRate)) : 9;
  const step = base < 100 ? 1 : base < 1000 ? 10 : 100;
  const residual = (years: number, percent: number) => years === 0 ? base : Math.min(base, Math.round(base * Math.pow(1 - percent / 100, years) / step) * step);
  return Array.from({ length: 6 }, (_, year) => ({ year, value: residual(year, rate), lower: residual(year, Math.min(30, rate + 3)), upper: residual(year, Math.max(0, rate - 3)), loss: base - residual(year, rate) }));
}
