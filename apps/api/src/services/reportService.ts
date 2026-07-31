import type { AutoReport, PriceLabel, VehicleData } from '@autoesperto/types';
import { lookupPlate, type RegCheckRawData } from './regcheck';
import { normalizeVehicleData } from './vehicleKB';
import { searchModel } from './modelDB';
import { estimateMarketValue, estimateMarketValueWithKm } from './pricing';
import { getMarketSearchUrls } from './market';
import { analyzeVehicle } from './ai';
import { cacheGet, cacheSet } from './cache';
import { getAlternatives } from './vehicleKB';
import { badRequest, notFound } from '../http';

export interface ReportInput {
  plate?: string;
  make?: string;
  model?: string;
  km?: number;
  requestedPrice?: number;
}

const PLATE_TTL = 24 * 60 * 60 * 1000;
const MODEL_REPORT_TTL = 7 * 24 * 60 * 60 * 1000;

function priceLabelFor(requestedPrice: number, estimate: number): PriceLabel {
  if (requestedPrice < estimate * 0.95) return 'GOOD';
  if (requestedPrice > estimate * 1.05) return 'HIGH';
  return 'FAIR';
}

function buildPriceComment(requestedPrice: number | undefined, value: number, km: number | undefined): string {
  if (!requestedPrice) {
    return km
      ? `Stima indicativa per circa ${km.toLocaleString('it-IT')} km. Inserisci il prezzo richiesto per il confronto.`
      : 'Stima indicativa di mercato. Inserisci il prezzo richiesto per il confronto.';
  }
  const diff = Math.round(((requestedPrice - value) / value) * 100);
  if (requestedPrice < value * 0.95) return `Prezzo inferiore di circa il ${Math.abs(diff)}% rispetto alla stima: potenziale buon affare, verifica comunque lo stato.`;
  if (requestedPrice > value * 1.05) return `Prezzo superiore di circa il ${diff}% rispetto alla stima: prova a trattare.`;
  return 'Prezzo allineato alla stima di mercato.';
}

async function resolveVehicle(input: ReportInput): Promise<VehicleData> {
  if (!input.plate) {
    if (!input.make || !input.model) throw badRequest('Inserisci marca e modello');
    const found = searchModel(input.make, input.model);
    if (!found) throw notFound(`Modello "${input.make} ${input.model}" non trovato nel database.`);
    return found;
  }

  const cacheKey = cacheKeyFor(input);
  let raw = cacheGet<RegCheckRawData>(cacheKey);
  if (!raw) {
    raw = await lookupPlate(input.plate);
    cacheSet(cacheKey, raw, PLATE_TTL);
  }

  const vehicle = normalizeVehicleData(raw);
  vehicle.plate = input.plate;
  vehicle.dataSource = 'plate';
  return vehicle;
}

function cacheKeyFor(input: ReportInput): string {
  return input.plate
    ? `plate:${input.plate.toUpperCase()}`
    : `model:${(input.make || '').toLowerCase()}:${(input.model || '').toLowerCase()}`;
}

function reportKeyFor(input: ReportInput): string {
  return `${cacheKeyFor(input)}:${input.km || ''}:${input.requestedPrice || ''}`;
}

export async function buildReport(input: ReportInput): Promise<{ report: AutoReport; cached: boolean }> {
  const cached = cacheGet<AutoReport>(`report:${reportKeyFor(input)}`);
  if (cached) return { report: cached, cached: true };

  const vehicle = await resolveVehicle(input);
  const isModelSearch = !input.plate;

  const { value, min, max, adjustedForKm = 0, kmAdjustment = 0 } = input.km
    ? estimateMarketValueWithKm(vehicle, input.km)
    : { ...estimateMarketValue(vehicle), adjustedForKm: 0, kmAdjustment: 0 };

  const comparisonValue = adjustedForKm > 0 ? adjustedForKm : value;

  const reliability = await analyzeVehicle({
    vehicle,
    km: input.km,
    requestedPrice: input.requestedPrice,
  });

  const report: AutoReport = {
    vehicle,
    reliability,
    price: {
      estimatedValue: value,
      min,
      max,
      adjustedForKm: adjustedForKm || undefined,
      kmAdjustment: kmAdjustment || undefined,
      inputKm: input.km || undefined,
      requestedPrice: input.requestedPrice,
      priceVsMarketPercent: input.requestedPrice
        ? Math.round(((input.requestedPrice - comparisonValue) / comparisonValue) * 100)
        : undefined,
      priceLabel: input.requestedPrice ? priceLabelFor(input.requestedPrice, comparisonValue) : undefined,
      comment: buildPriceComment(input.requestedPrice, comparisonValue, input.km),
      marketUrls: getMarketSearchUrls(vehicle),
    },
    alternatives: getAlternatives(vehicle.make, vehicle.model)
      .slice(0, 4)
      .map((alt) => {
        const est = estimateMarketValue(alt);
        return { make: alt.make, model: alt.model, estimatedValue: est.value, estimatedMin: est.min, estimatedMax: est.max };
      }),
    createdAt: new Date().toISOString(),
  };

  cacheSet(`report:${reportKeyFor(input)}`, report, isModelSearch ? MODEL_REPORT_TTL : PLATE_TTL);
  return { report, cached: false };
}
