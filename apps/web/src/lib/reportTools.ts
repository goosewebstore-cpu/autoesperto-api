import type { AutoReport } from '@autoesperto/types';
export interface BudgetInputs { annualKm: number; energyPer100Km: number; insurance: number; maintenance: number; tax: number; tires: number; }
export interface ReportToolsData { depreciationRate?: number; budget?: BudgetInputs; checklist?: string[]; conditionSimulation?: { baseValue: number; deduction: number; note: string }; }
export type ReportWithTools = AutoReport & { userTools?: ReportToolsData };
export const nonnegative = (value: number, max = 1000000) => Number.isFinite(value) ? Math.min(max,Math.max(0,value)) : 0;
export function calculateAnnualBudget(input: BudgetInputs) {
  const energy = nonnegative(input.annualKm,200000) / 100 * nonnegative(input.energyPer100Km,1000);
  const total = energy + nonnegative(input.insurance) + nonnegative(input.maintenance) + nonnegative(input.tax) + nonnegative(input.tires);
  return { energy, total, monthly: total / 12, perKm: input.annualKm > 0 ? total / input.annualKm : null };
}
export function mileageAverage(year: number | undefined, km: number | undefined, currentYear = new Date().getFullYear()): number | null {
  if(!Number.isInteger(year) || year! < 1900 || year! > currentYear || km == null || !Number.isFinite(km) || km < 0) return null;
  const age=currentYear-year!;return age>0 ? Math.round(km/age) : null;
}
export function conditionSimulation(baseValue:number,deduction:number) { return Math.max(0,nonnegative(baseValue)-nonnegative(deduction)); }
export function offerDifference(offer:number,estimatedValue:number) { return estimatedValue > 0 && offer >= 0 ? (offer-estimatedValue)/estimatedValue*100 : null; }
