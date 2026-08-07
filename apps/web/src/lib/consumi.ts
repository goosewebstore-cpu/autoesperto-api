import { detectSegment, type SegmentKey } from './riparazione';

export interface ConsumptionEstimate {
  make: string;
  model: string;
  year: number;
  age: number;
  segmentKey: SegmentKey;
  segment: string;
  isElectric: boolean;
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

const EV_BRANDS = ['tesla', 'mg'];

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

const FUEL_PRICE = 1.85;
const EV_PRICE_PER_KWH = 0.35;
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

function consumptionLabel(combined: number): string {
  if (combined < 5.5) return 'Basso';
  if (combined < 6.3) return 'Contenuto';
  if (combined < 7.2) return 'Medio';
  if (combined < 8.2) return 'Alto';
  return 'Molto alto';
}

function noteFor(combined: number, isElectric: boolean, make: string, model: string, year: number): string {
  if (isElectric) {
    return `La ${make} ${model} ${year} è venduta come elettrica: i consumi stimati si misurano in kWh/100 km e dipendono molto da stile di guida, temperatura e utilizzo del climatizzatore.`;
  }
  if (combined < 6) {
    return `La ${make} ${model} ${year} ha consumi tra i più bassi del suo segmento: ideale per chi percorre tanti chilometri in città e in extraurbano.`;
  }
  if (combined > 8) {
    return `La ${make} ${model} ${year} ha consumi sopra la media: il costo per chilometro pesa soprattutto se percorri molti km all'anno.`;
  }
  return `La ${make} ${model} ${year} ha consumi in linea con il suo segmento (${SEGMENT_LABEL[detectSegment(make, model)]}).`;
}

export function estimateConsumption(make: string, model: string, year: number): ConsumptionEstimate {
  const name = make.toLowerCase();
  const isElectric = EV_BRANDS.some((b) => name.includes(b));
  const age = Math.max(0, new Date().getFullYear() - year);

  if (isElectric) {
    const combined = 16;
    const urban = 14;
    const extraurban = 18;
    const costPer100km = round1(combined * EV_PRICE_PER_KWH);
    const annualCost = Math.round((combined * EV_PRICE_PER_KWH / 100) * ANNUAL_KM);
    return {
      make,
      model,
      year,
      age,
      segmentKey: detectSegment(make, model),
      segment: SEGMENT_LABEL[detectSegment(make, model)],
      isElectric,
      unit: 'kWh/100 km',
      combined,
      urban,
      extraurban,
      costPer100km,
      annualKm: ANNUAL_KM,
      annualCost,
      label: 'Molto basso',
      note: noteFor(combined, true, make, model, year),
    };
  }

  const segmentKey = detectSegment(make, model);
  const combined = round1(SEGMENT_BASE[segmentKey] * brandFactor(make) * yearFactor(year));
  const urban = round1(combined * 1.25);
  const extraurban = round1(combined * 0.8);
  const costPer100km = round1(combined * FUEL_PRICE);
  const annualCost = Math.round((combined * FUEL_PRICE / 100) * ANNUAL_KM);

  return {
    make,
    model,
    year,
    age,
    segmentKey,
    segment: SEGMENT_LABEL[segmentKey],
    isElectric,
    unit: 'l/100 km',
    combined,
    urban,
    extraurban,
    costPer100km,
    annualKm: ANNUAL_KM,
    annualCost,
    label: consumptionLabel(combined),
    note: noteFor(combined, false, make, model, year),
  };
}
