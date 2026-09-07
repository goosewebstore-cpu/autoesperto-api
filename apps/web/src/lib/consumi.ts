import { detectSegment, type SegmentKey } from './riparazione';

export interface ConsumptionEstimate {
  make: string;
  model: string;
  year: number;
  age: number;
  segmentKey: SegmentKey;
  segment: string;
  isElectric: boolean;
  fuelType?: string;
  unit: string;
  combined: number;
  urban: number;
  extraurban: number;
  costPer100km: number;
  annualKm: number;
  annualCost: number;
  label: string;
  note: string;
}

const EV_BRANDS = ['tesla', 'polestar', 'byd', 'smart', 'lucid', 'rivian', 'nio', 'xpeng', 'fisker'];
const EV_MODELS = ['500e', 'taycan', 'id.3', 'id.4', 'id.5', 'id.7', 'id.buzz', 'e-208', 'e-2008', 'leaf', 'zoe', 'enyaq', 'ev6', 'ioniq 5', 'ioniq 6', 'ariya', 'spring', 'mustang mach-e', 'eqc', 'eqa', 'eqb', 'eqe', 'eqs', 'ix', 'ix1', 'ix3', 'i4', 'i5', 'i7', 'q4 e-tron', 'e-tron'];

export function checkIsElectric(make: string, model: string, fuel?: string): boolean {
  const f = (fuel || '').toLowerCase();
  if (f.includes('elettr') || f.includes('ev') || f.includes('bev')) return true;
  const mk = make.toLowerCase();
  if (EV_BRANDS.some((b) => mk.includes(b))) return true;
  const mdl = model.toLowerCase();
  if (EV_MODELS.some((m) => mdl.includes(m))) return true;
  return false;
}

const SEGMENT_BASE: Record<SegmentKey, number> = {
  citycar: 5.2,
  utility: 5.9,
  berlina: 6.5,
  suv: 7.4,
  sportiva: 8.7,
};

const SEGMENT_LABEL: Record<SegmentKey, string> = {
  citycar: 'city car',
  utility: 'utilitaria / segmento medio',
  berlina: 'berlina',
  suv: 'SUV / crossover',
  sportiva: 'sportiva / coupé',
};

const FUEL_PRICE_PETROL = 1.78;
const FUEL_PRICE_DIESEL = 1.70;
const FUEL_PRICE_GPL = 0.72;
const FUEL_PRICE_METANO = 1.30;
const EV_PRICE_PER_KWH = 0.25;
export const ANNUAL_KM = 12000;

const EFFICIENT_BRANDS = ['toyota', 'honda', 'suzuki', 'smart', 'lexus', 'kia', 'hyundai', 'dacia'];
const HEAVY_BRANDS = ['audi', 'bmw', 'mercedes-benz', 'mercedes', 'land rover', 'range rover', 'porsche', 'volvo', 'alfa romeo', 'mini', 'jeep', 'mitsubishi', 'nissan'];

function brandFactor(make: string): number {
  const name = make.toLowerCase();
  if (EFFICIENT_BRANDS.some((b) => name.includes(b))) return 0.94;
  if (HEAVY_BRANDS.some((b) => name.includes(b))) return 1.06;
  return 1;
}

function yearFactor(year: number): number {
  if (year >= 2020) return 0.95;
  if (year >= 2015) return 1;
  if (year >= 2010) return 1.12;
  return 1.2;
}

function round1(v: number): number {
  return Math.round(v * 10) / 10;
}

function consumptionLabel(combined: number, isElectric: boolean): string {
  if (isElectric) {
    if (combined <= 15) return 'Molto efficiente';
    if (combined <= 18) return 'Efficiente';
    return 'Medio per EV';
  }
  if (combined < 5.0) return 'Molto basso';
  if (combined < 5.8) return 'Basso';
  if (combined < 6.8) return 'Medio';
  if (combined < 8.0) return 'Alto';
  return 'Molto alto';
}

function noteFor(combined: number, isElectric: boolean, make: string, model: string, year: number, fuel?: string): string {
  if (isElectric) {
    return `La ${make} ${model} (${year}) ha trazione 100% elettrica: consumo stimato in kWh/100 km con costo energetico ridotto rispetto ai carburanti tradizionali (~3.5-4.5 €/100 km).`;
  }
  const f = (fuel || '').toLowerCase();
  if (f.includes('diesel')) {
    return `La ${make} ${model} (${year}) Turbodiesel offre consumi ridotti su percorsi extraurbani e autostradali, ideale per alte percorrenze annue.`;
  }
  if (f.includes('ibrid')) {
    return `La ${make} ${model} (${year}) con propulsione ibrida garantisce la massima efficienza nei percorsi cittadini grazie al recupero di energia in frenata.`;
  }
  if (combined < 6) {
    return `La ${make} ${model} (${year}) ha consumi tra i più bassi del suo segmento: costi di gestione carburante contenuti.`;
  }
  if (combined > 8) {
    return `La ${make} ${model} (${year}) ha consumi sopra la media: il costo per chilometro pesa soprattutto se percorri molti km all'anno.`;
  }
  return `La ${make} ${model} (${year}) ha consumi in linea con il suo segmento (${SEGMENT_LABEL[detectSegment(make, model)]}).`;
}

export function estimateConsumption(make: string, model: string, year: number, fuelInput?: string): ConsumptionEstimate {
  const isElectric = checkIsElectric(make, model, fuelInput);
  const age = Math.max(0, new Date().getFullYear() - year);
  const segmentKey = detectSegment(make, model);
  const fuel = (fuelInput || '').toLowerCase();

  if (isElectric) {
    const isSmallEv = segmentKey === 'citycar' || segmentKey === 'utility';
    const isSuvEv = segmentKey === 'suv' || segmentKey === 'sportiva';
    const combined = isSmallEv ? 14.2 : isSuvEv ? 17.5 : 15.5;
    const urban = round1(combined * 0.88);
    const extraurban = round1(combined * 1.18);
    const costPer100km = round1(combined * EV_PRICE_PER_KWH);
    const annualCost = Math.round((combined * EV_PRICE_PER_KWH / 100) * ANNUAL_KM);
    return {
      make,
      model,
      year,
      age,
      segmentKey,
      segment: SEGMENT_LABEL[segmentKey],
      isElectric: true,
      fuelType: 'kWh/100 km',
      unit: 'kWh/100 km',
      combined,
      urban,
      extraurban,
      costPer100km,
      annualKm: ANNUAL_KM,
      annualCost,
      label: consumptionLabel(combined, true),
      note: noteFor(combined, true, make, model, year, fuelInput),
    };
  }

  const isDiesel = fuel.includes('diesel') || fuel.includes('tdi') || fuel.includes('dci');
  const isHybrid = fuel.includes('ibrid') || fuel.includes('hybrid');
  const isGpl = fuel.includes('gpl');
  const isMetano = fuel.includes('metano');

  const baseFactor = isDiesel ? 0.78 : isHybrid ? 0.70 : isGpl ? 1.25 : isMetano ? 0.65 : 1.0;
  const basePricePerUnit = isDiesel ? FUEL_PRICE_DIESEL : isGpl ? FUEL_PRICE_GPL : isMetano ? FUEL_PRICE_METANO : FUEL_PRICE_PETROL;
  const unit = isMetano ? 'kg/100 km' : 'L/100 km';

  const combined = round1(SEGMENT_BASE[segmentKey] * baseFactor * brandFactor(make) * yearFactor(year));
  const urban = round1(combined * (isHybrid ? 0.92 : 1.22));
  const extraurban = round1(combined * (isHybrid ? 1.08 : 0.86));
  const costPer100km = round1(combined * basePricePerUnit);
  const annualCost = Math.round((combined * basePricePerUnit / 100) * ANNUAL_KM);

  return {
    make,
    model,
    year,
    age,
    segmentKey,
    segment: SEGMENT_LABEL[segmentKey],
    isElectric: false,
    fuelType: unit,
    unit,
    combined,
    urban,
    extraurban,
    costPer100km,
    annualKm: ANNUAL_KM,
    annualCost,
    label: consumptionLabel(combined, false),
    note: noteFor(combined, false, make, model, year, fuelInput),
  };
}
