import type { VehicleData } from '@autoesperto/types';

const BRAND_PREMIUM: Record<string, number> = {
  ferrari: 75000, lamborghini: 75000, porsche: 60000, maserati: 50000, bentley: 75000, rolls: 75000,
  audi: 38000, bmw: 35000, mercedes: 36000, volvo: 30000, alfa: 28000, lexus: 32000, jaguar: 35000,
  mini: 25000, land: 35000, tesla: 40000,
};

const BODY_ADJUSTMENT: Record<string, number> = {
  suv: 4000, crossover: 2500, fuoristrada: 3000, station: 2000, cabrio: 1500, spider: 1000, coupé: 1500,
};

const FUEL_ADJUSTMENT: Record<string, number> = {
  diesel: 1500, ibrida: 2500, elettrica: 3500, gpl: -1500, metano: -1500,
};

function findBrandBase(make: string): number {
  const key = Object.keys(BRAND_PREMIUM).find(k => make.toLowerCase().includes(k));
  return key ? BRAND_PREMIUM[key] : 22000;
}

function getBodyAdjust(body: string): number {
  const b = body.toLowerCase();
  const key = Object.keys(BODY_ADJUSTMENT).find(k => b.includes(k));
  return key ? BODY_ADJUSTMENT[key] : 0;
}

function getFuelAdjust(fuel: string): number {
  const f = fuel.toLowerCase();
  const key = Object.keys(FUEL_ADJUSTMENT).find(k => f.includes(k));
  return key ? FUEL_ADJUSTMENT[key] : 0;
}

export function estimateMarketValue(vehicle: VehicleData): { value: number; min: number; max: number } {
  const year = vehicle.year || 2020;
  const power = parseInt((vehicle.power || '').replace(/\D/g, '')) || 100;
  const fuel = vehicle.fuel || '';
  const body = vehicle.body || '';

  let base = findBrandBase(vehicle.make);
  base += getBodyAdjust(body);
  base += getFuelAdjust(fuel);

  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  let depreciation = age <= 10 ? 1 - age * 0.05 : 0.5 - (age - 10) * 0.04;
  depreciation = Math.max(0.12, depreciation);

  const powerFactor = 1 + (Math.min(power, 300) - 100) * 0.003;
  let value = Math.round(base * depreciation * powerFactor / 100) * 100;
  value = Math.max(2000, value);

  const range = Math.round(value * 0.1 / 100) * 100;
  return { value, min: value - range, max: value + range };
}

export function estimateMarketValueWithKm(vehicle: VehicleData, km: number): {
  value: number; min: number; max: number;
  adjustedForKm: number; kmAdjustment: number;
} {
  const base = estimateMarketValue(vehicle);
  const kmFactor = Math.max(0.65, 1 - (km - 50000) / 250000);
  const adjustedForKm = Math.round(base.value * kmFactor / 100) * 100;
  return {
    ...base,
    adjustedForKm,
    kmAdjustment: Math.round(base.value * (1 - kmFactor)),
  };
}
