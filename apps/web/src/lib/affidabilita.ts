import { BRAND_FAILURES, detectSegment, estimateRepair, type SegmentKey } from './riparazione';

export interface ReliabilityEstimate {
  make: string;
  model: string;
  year: number;
  age: number;
  score: number;
  label: string;
  segment: string;
  segmentKey: SegmentKey;
  strengths: string[];
  weaknesses: string[];
  maintenanceMin: number;
  maintenanceMax: number;
  verdictNote: string;
}

const SEGMENT_BASE: Record<SegmentKey, number> = {
  citycar: 8.3,
  utility: 7.9,
  berlina: 7.6,
  suv: 7.4,
  sportiva: 7.1,
};

const SEGMENT_LABEL: Record<SegmentKey, string> = {
  citycar: 'city car',
  utility: 'utilitaria / segmento medio',
  berlina: 'berlina',
  suv: 'SUV / crossover',
  sportiva: 'sportiva / coupé',
};

const SEGMENT_STRENGTHS: Record<SegmentKey, string[]> = {
  citycar: [
    'Meccanica semplice e collaudata',
    'Ricambi economici e disponibili ovunque',
    'Costi di manutenzione tra i più bassi',
  ],
  utility: [
    'Buon equilibrio tra solidità e costi',
    'Rete di assistenza capillare in Italia',
  ],
  berlina: [
    'Motori collaudati e guida stabile',
    'Buona affidabilità alle alte percorrenze',
  ],
  suv: [
    'Componenti robusti e tenuta nel tempo',
    'Motori spesso di generazioni già testate',
  ],
  sportiva: [
    'Componenti di qualità superiore',
    'Manutenzione curata da officine specializzate',
  ],
};

const BRAND_SCORE: Record<string, number> = {
  toyota: 0.7,
  honda: 0.5,
  suzuki: 0.6,
  mazda: 0.4,
  lexus: 0.3,
  hyundai: 0.3,
  kia: 0.2,
  skoda: 0.2,
  dacia: 0.1,
  fiat: 0.2,
  seat: 0.1,
  mini: 0,
  volkswagen: 0.1,
  peugeot: 0,
  citroën: 0,
  renault: -0.1,
  opel: -0.1,
  ford: 0,
  nissan: 0,
  lancia: 0.1,
  mitsubishi: 0.1,
  smart: 0,
  mg: 0,
  jeep: -0.4,
  'alfa romeo': -0.3,
  volvo: 0.1,
  bmw: -0.3,
  audi: -0.3,
  'mercedes-benz': -0.2,
  'land rover': -0.9,
  porsche: -0.4,
  tesla: -0.2,
  dr: -0.3,
};

function brandScoreFor(make: string): number {
  const name = make.toLowerCase();
  return (
    BRAND_SCORE[name] ??
    BRAND_SCORE[Object.keys(BRAND_SCORE).find((k) => name.includes(k)) ?? ''] ??
    0
  );
}

function brandFailuresFor(make: string): string[] {
  const name = make.toLowerCase();
  return (
    BRAND_FAILURES[name] ||
    BRAND_FAILURES[Object.keys(BRAND_FAILURES).find((k) => name.includes(k)) || ''] ||
    []
  );
}

function ageAdjust(age: number): number {
  if (age <= 3) return 0.2;
  if (age <= 7) return 0;
  if (age <= 12) return -0.3;
  return -0.6;
}

function verdictFor(score: number): string {
  if (score >= 8.5) return 'Eccellente';
  if (score >= 8) return 'Molto buona';
  if (score >= 7.5) return 'Buona';
  if (score >= 7) return 'Discreta';
  if (score >= 6.5) return 'Nella media';
  return 'Sotto la media';
}

function verdictNoteFor(score: number, make: string, model: string, age: number): string {
  const full = `${make} ${model}`;
  if (score >= 8) return `La ${full} è tra le vetture più solide del suo segmento: con la manutenzione ordinaria, anche con ${age} anni alle spalle, i rischi di guasti importanti restano contenuti.`;
  if (score >= 7) return `La ${full} ha un'affidabilità nella media del suo segmento: ben mantenuta regge bene gli anni, ma conviene seguire i controlli sui punti noti (freni, sospensioni, distribuzione).`;
  return `La ${full} richiede più attenzione alla manutenzione preventiva: alcuni punti deboli del modello vanno controllati con regolarità per evitare riparazioni costose.`;
}

export function estimateReliability(make: string, model: string, year: number): ReliabilityEstimate {
  const segmentKey = detectSegment(make, model);
  const age = Math.max(0, new Date().getFullYear() - year);
  const raw = SEGMENT_BASE[segmentKey] + brandScoreFor(make) + ageAdjust(age);
  const score = Math.min(9.8, Math.max(3.5, Math.round(raw * 10) / 10));
  const repair = estimateRepair(make, model, year);

  const weaknesses = brandFailuresFor(make).slice(0, 4);

  return {
    make,
    model,
    year,
    age,
    score,
    label: verdictFor(score),
    segment: SEGMENT_LABEL[segmentKey],
    segmentKey,
    strengths: SEGMENT_STRENGTHS[segmentKey],
    weaknesses,
    maintenanceMin: repair.maintenanceMin,
    maintenanceMax: repair.maintenanceMax,
    verdictNote: verdictNoteFor(score, make, model, age),
  };
}
