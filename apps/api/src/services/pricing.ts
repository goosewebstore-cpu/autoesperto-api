import type { VehicleData } from '@autoesperto/types';

export function estimateMarketValue(vehicle: VehicleData): { value: number; min: number; max: number } {
  const year = vehicle.year || 2020;
  const power = parseInt((vehicle.power || '').replace(/\D/g, '')) || 100;
  const fuel = (vehicle.fuel || '').toLowerCase();
  const body = (vehicle.body || '').toLowerCase();

  const isDiesel = fuel.includes('diesel');
  const isHybrid = fuel.includes('ibrida') || fuel.includes('elettrica');
  const isGas = fuel.includes('gpl') || fuel.includes('metano');
  const isPremium = /audi|bmw|mercedes|volvo|alfa/i.test(`${vehicle.make} ${vehicle.model}`);
  const isLuxury = /ferrari|lamborghini|porsche|maserati|bentley|rolls/i.test(`${vehicle.make} ${vehicle.model}`);
  const isSuv = /suv|crossover|fuoristrada/i.test(body);

  let base = isLuxury ? 75000 : isPremium ? 32000 : 22000;
  if (isSuv) base += 3500;
  if (isDiesel) base += 1500;
  if (isHybrid) base += 2500;
  if (isGas) base -= 1500;

  const age = 2026 - year;
  let depreciation = age <= 10 ? 1 - age * 0.05 : 0.5 - (age - 10) * 0.04;
  depreciation = Math.max(0.12, depreciation);

  const powerFactor = 1 + (Math.min(power, 300) - 100) * 0.003;
  let value = Math.round(base * depreciation * powerFactor / 100) * 100;
  value = Math.max(2000, value);

  const range = Math.round(value * 0.1 / 100) * 100;
  return { value, min: value - range, max: value + range };
}
