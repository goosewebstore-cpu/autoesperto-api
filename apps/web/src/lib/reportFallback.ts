import type { AutoReport, PriceLabel, VehicleData, ReliabilityAnalysis, PriceAnalysis } from '@autoesperto/types';
import type { FreeScanResult } from './api';
import { buildAlternatives } from './stima';
import { findModelEra, resolveVehicleDefaultYear } from './modelEra';
import { calculateBolloAccurate } from './bollo';
import { resolveVehicleImage } from './vehicleImageResolver';

const MODEL_BASE_PRICES: Record<string, number> = {
  // Utilitarie e compatte molto diffuse in Italia
  'fiat panda': 16500, 'fiat 500': 19500, 'fiat 500x': 25500, 'fiat 500l': 24500, 'fiat tipo': 21000,
  'fiat punto': 14000, 'fiat grande punto': 14500, 'fiat punto evo': 15000, 'fiat stilo': 16500,
  'fiat bravo': 19500, 'fiat multipla': 18500, 'fiat seicento': 8900, 'fiat 600': 23000, 'fiat sedici': 21000, 'fiat croma': 25000,
  'lancia ypsilon': 17000, 'lancia musa': 17500, 'lancia delta': 23500,
  'alfa romeo 147': 20500, 'alfa romeo 156': 21500, 'alfa romeo 159': 26500, 'alfa romeo gt': 26500, 'alfa romeo brera': 34000, 'alfa romeo spider': 35000,
  'alfa romeo giulietta': 26000, 'alfa romeo stelvio': 62000, 'alfa romeo tonale': 42000, 'alfa romeo mito': 17500, 'alfa romeo giulia': 52000,
  'volkswagen golf': 33000, 'volkswagen polo': 22500, 'volkswagen t-roc': 36000, 'volkswagen tiguan': 45000, 'volkswagen up': 16500, 'volkswagen t-cross': 27000,
  'volkswagen lupo': 11500, 'volkswagen fox': 11000, 'volkswagen passat': 35000, 'volkswagen touran': 26000,
  'audi a1': 27000, 'audi a3': 38000, 'audi a4': 50000, 'audi q2': 33000, 'audi q3': 43000, 'audi q5': 58000,
  'bmw serie 1': 38000, 'bmw serie 2': 42000, 'bmw serie 3': 53000, 'bmw x1': 45000, 'bmw x3': 59000,
  'mercedes classe a': 39000, 'mercedes classe b': 40000, 'mercedes classe c': 57000, 'mercedes gla': 45000, 'mercedes glc': 63000,
  'ford fiesta': 19000, 'ford focus': 29000, 'ford puma': 33500, 'ford kuga': 32000, 'ford ka': 13000, 'ford fusion': 15000, 'ford ecosport': 23500,
  'peugeot 206': 13500, 'peugeot 207': 15500, 'peugeot 208': 22000, 'peugeot 307': 18500, 'peugeot 308': 30000, 'peugeot 2008': 30000, 'peugeot 3008': 40500, 'peugeot 108': 16000,
  'citroen c1': 12000, 'citroen c2': 13500, 'citroen c3': 19500, 'citroen c4': 27000, 'citroen c3 aircross': 25000, 'citroen xsara picasso': 18000,
  'renault clio': 20000, 'renault captur': 26000, 'renault megane': 28000, 'renault twingo': 16500, 'renault modus': 15000, 'renault kadjar': 32000,
  'toyota yaris': 23500, 'toyota yaris cross': 28000, 'toyota corolla': 33000, 'toyota rav4': 45000, 'toyota aygo': 17000, 'toyota c-hr': 35000,
  'dacia sandero': 15000, 'dacia duster': 21500, 'dacia jogger': 20000, 'dacia spring': 19000,
  'hyundai i10': 16500, 'hyundai i20': 20000, 'hyundai tucson': 38000, 'hyundai kona': 30000,
  'kia picanto': 16500, 'kia rio': 19000, 'kia sportage': 38000, 'kia stonic': 23000,
  'nissan qashqai': 34000, 'nissan juke': 26000, 'nissan micra': 18000, 'nissan note': 16000,
  'jeep renegade': 27000, 'jeep compass': 36000, 'jeep avenger': 26000,
  'opel corsa': 19000, 'opel astra': 28000, 'opel mokka': 28000, 'opel crossland': 25000, 'opel meriva': 16500, 'opel zafira': 22000,
  'seat ibiza': 19500, 'seat leon': 30000, 'seat arona': 25500, 'seat altea': 19500,
  'skoda fabia': 20000, 'skoda octavia': 33000, 'skoda kamiq': 28000,
  'smart fortwo': 18000, 'smart forfour': 19000,
  'mini cooper': 28500, 'mini one': 24000, 'mini countryman': 36000,
  'suzuki swift': 18500, 'suzuki vitara': 27000, 'suzuki ignis': 19000,
};

function getBasePrice(make: string, model: string): number {
  const era = findModelEra(make, model);
  if (era?.basePrice) return era.basePrice;

  const key = `${make.toLowerCase().trim()} ${model.toLowerCase().trim()}`;
  for (const [k, v] of Object.entries(MODEL_BASE_PRICES)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  const m = make.toLowerCase().trim();
  if (/dacia|dr|suzuki/.test(m)) return 17500;
  if (/fiat|renault|citroen|peugeot|opel|hyundai|kia|seat|skoda|lancia|smart/.test(m)) return 21000;
  if (/volkswagen|toyota|ford|jeep|nissan|mazda|honda|cupra/.test(m)) return 28000;
  if (/audi|bmw|mercedes|volvo|alfa|lexus|mini/.test(m)) return 38000;
  if (/porsche|maserati|jaguar|land rover/.test(m)) return 68000;
  return 22000;
}

export function generateInstantReport(input: {
  make: string;
  model: string;
  year?: number;
  km?: number;
  requestedPrice?: number;
  fuel?: string;
  transmission?: string;
  version?: string;
}): FreeScanResult {
  const currentYear = new Date().getFullYear();
  const year = resolveVehicleDefaultYear(input.make, input.model, input.year);
  const age = Math.max(0, currentYear - year);
  const basePrice = getBasePrice(input.make, input.model);

  const makeLower = input.make.toLowerCase().trim();
  const modelLower = input.model.toLowerCase().trim();
  const fuelLower = (input.fuel || '').toLowerCase().trim();

  const isElectric = fuelLower.includes('elettr') || fuelLower.includes('ev') || fuelLower.includes('bev') ||
    /tesla|polestar|byd/.test(makeLower) ||
    /500e|taycan|id\.3|id\.4|id\.5|e-208|leaf|zoe/.test(modelLower);

  const isDiesel = fuelLower.includes('diesel') || fuelLower.includes('tdi') || fuelLower.includes('dci');
  const isHybrid = fuelLower.includes('ibrid') || fuelLower.includes('hybrid');
  const isGpl = fuelLower.includes('gpl');
  const isMetano = fuelLower.includes('metano');

  // Calcolo svalutazione italiana
  let depRate = 1.0;
  if (age === 0) depRate = 0.86;
  else if (age === 1) depRate = 0.76;
  else if (age === 2) depRate = 0.67;
  else if (age === 3) depRate = 0.59;
  else if (age === 4) depRate = 0.52;
  else if (age === 5) depRate = 0.45;
  else if (age === 6) depRate = 0.39;
  else if (age === 7) depRate = 0.34;
  else if (age === 8) depRate = 0.30;
  else if (age === 9) depRate = 0.26;
  else if (age === 10) depRate = 0.23;
  else if (age === 11) depRate = 0.20;
  else if (age === 12) depRate = 0.17;
  else if (age === 13) depRate = 0.15;
  else if (age === 14) depRate = 0.13;
  else if (age === 15) depRate = 0.115;
  else if (age === 16) depRate = 0.10;
  else if (age === 17) depRate = 0.09;
  else if (age === 18) depRate = 0.08;
  else if (age === 19) depRate = 0.075;
  else depRate = Math.max(0.055, 0.07 - (age - 20) * 0.003);

  let estValue = Math.round((basePrice * depRate) / 100) * 100;

  if (input.km) {
    let kmFactor = 1.0;
    if (input.km < 80000) {
      const bonusRatio = Math.min(1.0, (80000 - input.km) / 80000);
      kmFactor = 1.0 + bonusRatio * 0.12;
    } else if (input.km <= 130000) {
      kmFactor = 1.0 - ((input.km - 80000) / 50000) * 0.10;
    } else if (input.km <= 190000) {
      kmFactor = 0.90 - ((input.km - 130000) / 60000) * 0.12;
    } else if (input.km <= 260000) {
      kmFactor = 0.78 - ((input.km - 190000) / 70000) * 0.16;
    } else {
      kmFactor = Math.max(0.45, 0.62 - ((input.km - 260000) / 100000) * 0.15);
    }
    const minFloor = age >= 16 ? 1000 : age >= 12 ? 1300 : 1800;
    estValue = Math.max(minFloor, Math.round((estValue * kmFactor) / 100) * 100);
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

  const scoreNum = Math.min(9.5, Math.max(6.0, Math.round((8.2 - age * 0.15 + (priceLabel === 'GOOD' ? 0.5 : priceLabel === 'HIGH' ? -0.6 : 0) + (isElectric ? 0.3 : 0)) * 10) / 10));

  const era = findModelEra(input.make, input.model);
  const resolvedFuel = input.fuel || (isElectric ? 'Elettrica' : isDiesel ? 'Diesel' : isHybrid ? 'Ibrida' : isGpl ? 'GPL' : isMetano ? 'Metano' : era?.fuel || 'Benzina');

  const vehicle: VehicleData = {
    make: input.make,
    model: input.model,
    year,
    fuel: resolvedFuel,
    body: era?.body,
    power: era?.powerCv ? `${era.powerCv} CV` : undefined,
    transmission: isElectric ? 'Automatico' : (input.transmission || 'Manuale'),
    version: input.version || (era ? `${input.make} ${input.model} ${resolvedFuel}` : undefined),
    dataSource: 'model',
    imageUrl: resolveVehicleImage(input.make, input.model, era?.body),
  };

  const yearDisplay = input.year ? `${year}` : `circa ${year}`;

  const reliability: ReliabilityAnalysis = {
    score: scoreNum,
    verdict: scoreNum >= 7.8 ? 'BUY' : scoreNum >= 6.8 ? 'NEGOTIATE' : 'AVOID',
    verdictLabel: scoreNum >= 7.8 ? 'Consigliata' : scoreNum >= 6.8 ? 'Da valutare' : 'Attenzione',
    summary: `${input.make} ${input.model} (${yearDisplay}) presenta un solido equilibrio complessivo tra affidabilità meccanica, costi di gestione e tenuta del valore sul mercato.`,
    strengths: isElectric
      ? [
          'Powertrain 100% elettrico ultra-efficiente e silenzioso',
          'Costi di manutenzione ridotti di oltre il 50% (zero cambio olio o candele)',
          'Esenzione bollo e bassi costi energetici per 100 km',
        ]
      : [
          'Costi di gestione e manutenzione contenuti',
          'Buona reperibilità di ricambi sul mercato italiano',
          'Facile da rivendere sul mercato dell\'usato',
        ],
    weaknesses: isElectric
      ? [
          'Verificare stato di salute batteria di trazione (SoH)',
          'Autonomia reale variabile con clima rigido o velocità autostradale',
        ]
      : isDiesel
      ? [
          'Verificare regolarità tagliandi e stato filtro antiparticolato (FAP/DPF)',
          'Controllare usura cinghia/catena di distribuzione',
        ]
      : [
          'Verificare lo stato della cinghia o catena di distribuzione',
          'Controllare usura freni e sospensioni anteriori',
        ],
    advice: isElectric
      ? [
          'Richiedi report diagnostico sullo stato di salute batteria (SoH > 85%)',
          'Verifica dotazione e stato cavi di ricarica Tipo 2 e presa domestica',
          'Prova su strada controllando frenata rigenerativa e silenziosità',
          'Controllo usura uniforme battistrada pneumatici (coppia istantanea)',
        ]
      : [
          'Libretto tagliandi e cronologia manutenzione documentata',
          'Prova su strada a freddo con test di frenata e cambi marcia',
          'Verifica conformità chilometraggio con ultima revisione Ministero',
          'Controllo sottoscocca ed eventuale presenza di ruggine o perdite olio',
        ],
    engine: isElectric
      ? 'Powertrain 100% elettrico: nessuna manutenzione di olio motore, candele, cinghie o filtri carburante.'
      : isDiesel
      ? 'Motore Turbodiesel affidabile: verificare regolarità cambio olio specifico low-SAPS per FAP.'
      : 'Motore affidabile con regolare manutenzione programmata.',
    transmission: isElectric
      ? 'Presa diretta monomarcia senza frizione meccanica: massima affidabilità.'
      : 'Cambio fluido, verificare innesti a freddo.',
    maintenance: isElectric ? 'basso' : 'medio',
    commonIssues: isElectric
      ? [
          'Degrado naturale capacità batteria nel lungo termine',
          'Usura bracci sospensioni e pneumatici per peso e coppia istantanea',
        ]
      : [
          'Usura frizione nel ciclo prevalentemente urbano',
          'Sensori pressione pneumatici (TPMS) e batteria 12V dopo 4-5 anni',
        ],
    categoryScores: {
      engine: Math.min(9.8, Math.max(6.5, scoreNum + (isElectric ? 1.0 : 0.3))),
      transmission: Math.min(9.8, Math.max(6.0, scoreNum + (isElectric ? 1.2 : 0.0))),
      electronics: Math.min(9.5, Math.max(5.5, scoreNum - 0.4)),
      suspension: Math.min(9.5, Math.max(6.0, scoreNum - 0.2)),
      body: Math.min(9.5, Math.max(6.5, scoreNum + 0.1)),
    },
    consumption: isElectric
      ? {
          city: 13.8,
          highway: 17.5,
          combined: 15.2,
          fuelType: 'kWh/100 km',
        }
      : isDiesel
      ? {
          city: 5.6,
          highway: 4.3,
          combined: 4.8,
          fuelType: 'L/100 km',
        }
      : isHybrid
      ? {
          city: 3.8,
          highway: 4.6,
          combined: 4.2,
          fuelType: 'L/100 km',
        }
      : isGpl
      ? {
          city: 8.2,
          highway: 6.5,
          combined: 7.2,
          fuelType: 'L/100 km',
        }
      : isMetano
      ? {
          city: 4.5,
          highway: 3.6,
          combined: 4.0,
          fuelType: 'kg/100 km',
        }
      : {
          city: 6.9,
          highway: 5.1,
          combined: 5.8,
          fuelType: 'L/100 km',
        },
    taxAnnual: calculateBolloAccurate(vehicle.power, vehicle.fuel, vehicle.year).totale,
    serviceIntervalKm: isElectric ? 25000 : isDiesel ? 20000 : 15000,
    usage: {
      city: isElectric ? 'Perfetta: zero emissioni, accesso ZTL e rigenerazione energia continua.' : 'Ottima agilità e facilità di parcheggio.',
      family: 'Buona abitabilità per l\'uso quotidiano.',
      highway: isElectric ? 'Buona: pianificare le soste alle colonnine ad alta potenza (HPC).' : 'Stabile e confortevole nelle percorrenze autostradali.',
      newDriver: 'Verificare rapporto potenza/tara per neopatentati.',
    },
    futureCosts: {
      annualMaintenance: isElectric
        ? (/bmw|mercedes|audi|porsche/.test(makeLower) ? 160 : 100)
        : /panda|500|ypsilon|aygo|c1|c3|clio|208|i10|polo|fiesta|yaris/.test(modelLower)
        ? 160
        : /bmw|mercedes|audi|porsche|maserati|land rover|jaguar/.test(makeLower)
        ? 320
        : 210,
      fuelCostPer100Km: isElectric
        ? 3.6
        : isDiesel
        ? 8.0
        : isHybrid
        ? 7.2
        : isGpl
        ? 5.0
        : isMetano
        ? 5.5
        : 10.3,
      insuranceEstimate: 290,
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
      fuel: resolvedFuel,
      confidence: 'alta',
    },
    report,
    saved: false,
    freeUsed: true,
  };
}
