/** Provisional adjustments to one fixed report value; never use a prior adjusted output as the base. */
export function calculateCustomizedEstimate(input: {
  baseValue: number;
  baseYear: number;
  baseKm: number;
  year: number;
  km: number;
  rawOptionalValue: number;
  conditionFactor: number;
}) {
  const base = Math.max(1000, input.baseValue);
  const yearFactor = Math.pow(1.08, input.year - input.baseYear);
  const kmDelta = input.km - input.baseKm;
  const kmFactor = Math.max(0.75, Math.min(1.12, 1 - kmDelta * 0.0000012));
  const optionalsSum = Math.min(400, Math.round(base * 0.02), Math.max(0, input.rawOptionalValue));
  const finalValue = Math.max(1000, Math.round((base * yearFactor * kmFactor * input.conditionFactor + optionalsSum) / 50) * 50);
  return {
    finalValue,
    optionalsSum,
    kmDelta,
    conditionFactor: input.conditionFactor,
    min: Math.round(finalValue * 0.91),
    max: Math.round(finalValue * 1.09),
  };
}
