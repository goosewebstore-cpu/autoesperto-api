import { VEHICLE_DATABASE, type VehicleProfile } from './finderEngine';

export interface TcoBreakdown {
  fuelAnnual: number;
  maintenanceAnnual: number;
  taxBolloAnnual: number;
  insuranceAnnual: number;
  tiresAnnual: number;
  depreciationAnnual: number;
  totalAnnualCost: number;
  monthlyCost: number;
  costPerKm: number;
}

export interface VehicleTcoResult {
  vehicle: VehicleProfile;
  annualKm: number;
  breakdown: TcoBreakdown;
  summarySentence: string;
}

const FUEL_PRICES = {
  benzina: 1.82, // €/L
  diesel: 1.74, // €/L
  hybrid: 1.82, // €/L
  plugin: 1.82, // €/L
  gpl: 0.72, // €/L
  metano: 1.35, // €/kg
  elettrica: 0.28, // €/kWh (stima ricarica domestica/mista)
};

export function calculateVehicleTco(
  vehicle: VehicleProfile,
  annualKm: number = 12000,
  fuelTypePreference?: string
): VehicleTcoResult {
  const fuel = (fuelTypePreference || vehicle.availableFuels[0] || 'benzina') as keyof typeof FUEL_PRICES;
  const fuelPricePerUnit = FUEL_PRICES[fuel] || 1.82;

  // Fuel annual cost
  let fuelCostAnnual = 0;
  if (fuel === 'gpl') {
    // GPL burns ~15% more volume but costs half
    const litersNeeded = (annualKm / 100) * (vehicle.litersPer100Km * 1.15);
    fuelCostAnnual = Math.round(litersNeeded * FUEL_PRICES.gpl);
  } else if (fuel === 'elettrica') {
    // ~15 kWh/100km
    const kwhNeeded = (annualKm / 100) * 15;
    fuelCostAnnual = Math.round(kwhNeeded * FUEL_PRICES.elettrica);
  } else {
    const litersNeeded = (annualKm / 100) * vehicle.litersPer100Km;
    fuelCostAnnual = Math.round(litersNeeded * fuelPricePerUnit);
  }

  // Bollo estimation (kW estimation based on segment)
  const kwEst = vehicle.segment === 'A' ? 51 : vehicle.segment === 'B' ? 66 : vehicle.segment === 'C' ? 85 : 110;
  let bolloAnnual = Math.round(kwEst * 2.58);
  if (vehicle.availableFuels.includes('hybrid')) bolloAnnual = Math.round(bolloAnnual * 0.7); // hybrid regional discount avg
  if (vehicle.availableFuels.includes('elettrica')) bolloAnnual = 0; // first 5 years free

  // Maintenance & Tires
  const maintAnnual = vehicle.annualMaintenanceEst;
  const tiresAnnual = Math.round((annualKm / 40000) * 350); // set every 40k km

  // Insurance estimation baseline
  const insuranceAnnual = vehicle.segment === 'A' ? 440 : vehicle.segment === 'B' ? 510 : vehicle.segment === 'C' ? 590 : 720;

  // Depreciation allocation (~7% annual on used car)
  const depreciationAnnual = Math.round(vehicle.priceAvg * 0.075);

  const totalAnnual = fuelCostAnnual + maintAnnual + bolloAnnual + insuranceAnnual + tiresAnnual + depreciationAnnual;
  const monthly = Math.round(totalAnnual / 12);
  const costPerKm = Math.round((totalAnnual / Math.max(1, annualKm)) * 100) / 100;

  const breakdown: TcoBreakdown = {
    fuelAnnual: fuelCostAnnual,
    maintenanceAnnual: maintAnnual,
    taxBolloAnnual: bolloAnnual,
    insuranceAnnual,
    tiresAnnual,
    depreciationAnnual,
    totalAnnualCost: totalAnnual,
    monthlyCost: monthly,
    costPerKm,
  };

  return {
    vehicle,
    annualKm,
    breakdown,
    summarySentence: `Per ${annualKm.toLocaleString('it-IT')} km/anno il costo reale stimato è di circa €${totalAnnual.toLocaleString('it-IT')}/anno (≈ €${monthly}/mese, pari a €${costPerKm.toFixed(2)}/km).`,
  };
}

export function compareVehiclesTco(
  vehicles: VehicleProfile[],
  annualKm: number = 12000
): {
  results: VehicleTcoResult[];
  cheapestVehicleId: string;
  annualSavingsMax: number;
} {
  const tcos = vehicles.map((v) => calculateVehicleTco(v, annualKm));
  tcos.sort((a, b) => a.breakdown.totalAnnualCost - b.breakdown.totalAnnualCost);

  const cheapest = tcos[0];
  const mostExpensive = tcos[tcos.length - 1];
  const diff = mostExpensive.breakdown.totalAnnualCost - cheapest.breakdown.totalAnnualCost;

  return {
    results: tcos,
    cheapestVehicleId: cheapest.vehicle.id,
    annualSavingsMax: diff,
  };
}

export function calculateAffordableCarPlan(
  cashBudget: number,
  maxMonthlySpending: number,
  annualKm: number = 12000
): {
  recommendedMaxPurchasePrice: number;
  monthlyBreakdownEstimate: {
    runningCostsMonthly: number;
    headroomMonthly: number;
  };
  suitableVehicles: VehicleProfile[];
  advice: string;
} {
  // Average monthly running cost for a compact car
  const estRunningCostMonthly = Math.round((annualKm * 0.22) / 12) + 65; // ~€280/mo
  const headroom = Math.max(0, maxMonthlySpending - estRunningCostMonthly);

  const matching = VEHICLE_DATABASE.filter(
    (v) => v.priceAvg <= cashBudget * 1.05
  ).slice(0, 4);

  return {
    recommendedMaxPurchasePrice: cashBudget,
    monthlyBreakdownEstimate: {
      runningCostsMonthly: estRunningCostMonthly,
      headroomMonthly: headroom,
    },
    suitableVehicles: matching,
    advice:
      maxMonthlySpending < estRunningCostMonthly
        ? `Attenzione: per ${annualKm.toLocaleString('it-IT')} km/anno i costi vivi (carburante, bollo, assicurazione, tagliandi) assorbono circa €${estRunningCostMonthly}/mese prima ancora di contare la svalutazione o un'eventuale rata. Ti consigliamo modelli a GPL o ibridi compatti come Panda, Yaris o Sandero.`
        : `Con il tuo budget mensile di €${maxMonthlySpending} puoi gestire comodamente un'auto usata di segmento A o B coprendo tutti i costi ordinari e imprevisti.`,
  };
}
