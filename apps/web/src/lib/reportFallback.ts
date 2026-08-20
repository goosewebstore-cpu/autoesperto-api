import type { AutoReport, PriceLabel, VehicleData, ReliabilityAnalysis, PriceAnalysis } from '@autoesperto/types';
import type { FreeScanResult } from './api';
import { buildAlternatives } from './stima';

const MODEL_BASE_PRICES: Record<string, number> = {
  'fiat panda': 16500, 'fiat 500': 19500, 'fiat 500x': 25500, 'fiat 500l': 24500, 'fiat tipo': 21000, 'fiat punto': 17500,
  'lancia ypsilon': 19000, 'alfa romeo giulietta': 26000, 'alfa romeo stelvio': 62000, 'alfa romeo tonale': 42000,
  'volkswagen golf': 33000, 'volkswagen polo': 22500, 'volkswagen t-roc': 36000, 'volkswagen tiguan': 45000, 'volkswagen up': 16500,
  'audi a1': 27000, 'audi a3': 38000, 'audi a4': 50000, 'audi q3': 43000, 'audi q5': 58000,
  'bmw serie 1': 38000, 'bmw serie 3': 53000, 'bmw x1': 45000, 'bmw x3': 59000,
  'mercedes classe a': 39000, 'mercedes classe c': 57000, 'mercedes gla': 45000, 'mercedes glc': 63000,
  'ford fiesta': 19000, 'ford focus': 29000, 'ford puma': 33500, 'ford kuga': 32000,
  'peugeot 208': 22000, 'peugeot 308': 30000, 'peugeot 2008': 30000, 'peugeot 3008': 40500,
  'renault clio': 21000, 'renault captur': 26000, 'renault megane': 28000,
  'toyota yaris': 24000, 'toyota yaris cross': 28000, 'toyota corolla': 33000, 'toyota rav4': 45000, 'toyota aygo': 17000,
  'dacia sandero': 15000, 'dacia duster': 22000, 'dacia jogger': 21000,
  'hyundai i10': 17000, 'hyundai i20': 21000, 'hyundai tucson': 38000, 'hyundai kona': 30000,
  'kia picanto': 16500, 'kia rio': 19000, 'kia sportage': 38000, 'kia stonic': 23000,
  'nissan qashqai': 34000, 'nissan juke': 26000, 'nissan micra': 18000,
  'jeep renegade': 28000, 'jeep compass': 36000, 'jeep avenger': 26000,
};

function getBasePrice(make: string, model: string): number {
  const key = `${make.toLowerCase().trim()} ${model.toLowerCase().trim()}`;
  for (const [k, v] of Object.entries(MODEL_BASE_PRICES)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return 25000;
}

export function generateInstantReport(input: {
  make: string;
  model: string;
  year?: number;
  km?: number;
  requestedPrice?: number;
}): FreeScanResult {
  const currentYear = new Date().getFullYear();
  const year = input.year && input.year >= 1990 && input.year <= currentYear ? input.year : currentYear - 4;
  const age = Math.max(0, currentYear - year);
  const basePrice = getBasePrice(input.make, input.model);

  // Calcolo svalutazione italiana
  let depRate = 1.0;
  if (age === 0) depRate = 0.85;
  else if (age === 1) depRate = 0.75;
  else if (age === 2) depRate = 0.65;
  else if (age === 3) depRate = 0.58;
  else if (age === 4) depRate = 0.50;
  else if (age === 5) depRate = 0.44;
  else if (age === 6) depRate = 0.38;
  else if (age === 7) depRate = 0.33;
  else if (age === 8) depRate = 0.28;
  else if (age === 9) depRate = 0.24;
  else depRate = Math.max(0.12, 0.24 - (age - 9) * 0.02);

  let estValue = Math.round((basePrice * depRate) / 100) * 100;

  if (input.km) {
    const expectedKm = age * 15000;
    const diffKm = input.km - expectedKm;
    const kmPenalty = (diffKm / 10000) * 0.015;
    estValue = Math.round((estValue * (1 - Math.max(-0.2, Math.min(0.3, kmPenalty)))) / 100) * 100;
  }

  const min = Math.round((estValue * 0.92) / 100) * 100;
  const max = Math.round((estValue * 1.08) / 100) * 100;

  let priceLabel: PriceLabel = 'FAIR';
  let priceVsMarketPercent: number | undefined;
  if (input.requestedPrice) {
    priceVsMarketPercent = Math.round(((input.requestedPrice - estValue) / estValue) * 100);
    if (input.requestedPrice < estValue * 0.95) priceLabel = 'GOOD';
    else if (input.requestedPrice > estValue * 1.05) priceLabel = 'HIGH';
  }

  const scoreNum = Math.min(9.5, Math.max(6.0, Math.round((8.2 - age * 0.15 + (priceLabel === 'GOOD' ? 0.5 : priceLabel === 'HIGH' ? -0.6 : 0)) * 10) / 10));

  const vehicle: VehicleData = {
    make: input.make,
    model: input.model,
    year,
    dataSource: 'model',
  };

  const reliability: ReliabilityAnalysis = {
    score: scoreNum,
    verdict: scoreNum >= 7.8 ? 'BUY' : scoreNum >= 6.8 ? 'NEGOTIATE' : 'AVOID',
    verdictLabel: scoreNum >= 7.8 ? 'Consigliata' : scoreNum >= 6.8 ? 'Da valutare' : 'Attenzione',
    summary: `${input.make} ${input.model} (${year}) presenta un solido equilibrio complessivo tra affidabilità meccanica, costi di gestione e tenuta del valore sul mercato.`,
    strengths: [
      'Costi di gestione e manutenzione contenuti',
      'Buona reperibilità di ricambi sul mercato italiano',
      'Facile da rivendere sul mercato dell\'usato',
    ],
    weaknesses: [
      'Verificare lo stato della cinghia o catena di distribuzione',
      'Controllare usura freni e sospensioni anteriori',
    ],
    advice: [
      'Libretto tagliandi e cronologia manutenzione documentata',
      'Prova su strada a freddo con test di frenata e cambi marcia',
      'Verifica conformità chilometraggio con ultima revisione Ministero',
      'Controllo sottoscocca ed eventuale presenza di ruggine o perdite olio',
    ],
    engine: 'Motore affidabile con regolare manutenzione programmata.',
    transmission: 'Cambio fluido, verificare innesti a freddo.',
    maintenance: 'medio',
    commonIssues: [
      'Usura frizione nel ciclo prevalentemente urbano',
      'Sensori pressione pneumatici (TPMS) e batteria 12V dopo 4-5 anni',
    ],
    categoryScores: {
      engine: Math.min(9.5, Math.max(6.5, scoreNum + 0.3)),
      transmission: Math.min(9.5, Math.max(6.0, scoreNum)),
      electronics: Math.min(9.5, Math.max(5.5, scoreNum - 0.4)),
      suspension: Math.min(9.5, Math.max(6.0, scoreNum - 0.2)),
      body: Math.min(9.5, Math.max(6.5, scoreNum + 0.1)),
    },
    consumption: {
      city: 14.5,
      highway: 19.0,
      combined: 16.8,
      fuelType: 'km/L',
    },
    taxAnnual: Math.round(150 + Math.max(0, basePrice - 15000) * 0.006),
    serviceIntervalKm: 15000,
    usage: {
      city: 'Ottima agilità e facilità di parcheggio.',
      family: 'Buona abitabilità per l\'uso quotidiano.',
      highway: 'Stabile e confortevole nelle percorrenze autostradali.',
      newDriver: 'Verificare rapporto potenza/tara per neopatentati.',
    },
    futureCosts: {
      annualMaintenance: 350,
      fuelCostPer100Km: 11.5,
      insuranceEstimate: 480,
      depreciation1Year: Math.round(estValue * 0.12),
      depreciation3Years: Math.round(estValue * 0.28),
      depreciation5Years: Math.round(estValue * 0.42),
    },
  };

  const price: PriceAnalysis = {
    estimatedValue: estValue,
    min,
    max,
    inputKm: input.km,
    inputYear: year,
    requestedPrice: input.requestedPrice,
    priceVsMarketPercent,
    priceLabel,
    comment: input.requestedPrice
      ? priceLabel === 'GOOD'
        ? 'Prezzo vantaggioso rispetto al valore medio stimato di mercato.'
        : priceLabel === 'HIGH'
        ? 'Prezzo superiore alla media di mercato: ti consigliamo di negoziare.'
        : 'Prezzo in linea con le attuali quotazioni di mercato.'
      : `Quotazione media per ${input.make} ${input.model} (${year}). Inserisci il prezzo per il confronto.`,
    marketUrls: [
      { source: 'Subito.it', url: `https://www.subito.it/annunci-italia/vendita/auto/?q=${encodeURIComponent(`${input.make} ${input.model}`)}` },
      { source: 'AutoScout24', url: `https://www.autoscout24.it/lst/${encodeURIComponent(input.make)}/${encodeURIComponent(input.model)}` },
    ],
  };

  const alternatives = buildAlternatives(input.make, input.model, year);

  const report: AutoReport = {
    vehicle,
    reliability,
    price,
    alternatives,
    createdAt: new Date().toISOString(),
  };

  return {
    success: true,
    recognized: true,
    vehicle: {
      make: input.make,
      model: input.model,
      year,
      confidence: 'alta',
    },
    report,
    saved: false,
    freeUsed: true,
  };
}
