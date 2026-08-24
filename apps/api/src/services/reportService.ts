import type { AutoReport, PriceLabel, VehicleData } from '@autoesperto/types';
import { lookupPlate, type RegCheckRawData } from './regcheck';
import { normalizeVehicleData } from './vehicleKB';
import { searchModel } from './modelDB';
import { estimateMarketValue, estimateMarketValueWithKm } from './pricing';
import { fetchSubitoMarketStats, getMarketSearchUrls } from './market';
import { analyzeVehicle } from './ai';
import { cacheGet, cacheSet } from './cache';
import { getAlternatives } from './vehicleKB';
import { badRequest } from '../http';

export interface ReportInput {
  plate?: string;
  make?: string;
  model?: string;
  year?: number;
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
    if (found) return input.year ? { ...found, year: input.year } : found;
    return {
      make: input.make.trim(),
      model: input.model.trim(),
      year: input.year,
      dataSource: 'model',
    };
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
  return `${cacheKeyFor(input)}:${input.year || ''}:${input.km || ''}:${input.requestedPrice || ''}`;
}

export async function buildReport(input: ReportInput, options: { requireDetailedModelAnalysis?: boolean } = {}): Promise<{ report: AutoReport; cached: boolean }> {
  const cachePrefix = options.requireDetailedModelAnalysis ? 'report:detailed' : 'report';
  const cached = cacheGet<AutoReport>(`${cachePrefix}:${reportKeyFor(input)}`);
  if (cached) return { report: cached, cached: true };

  const vehicle = await resolveVehicle(input);
  const isModelSearch = !input.plate;

  const { value, min, max, adjustedForKm = 0, kmAdjustment = 0 } = input.km
    ? estimateMarketValueWithKm(vehicle, input.km)
    : { ...estimateMarketValue(vehicle), adjustedForKm: 0, kmAdjustment: 0 };

  let comparisonValue = adjustedForKm > 0 ? adjustedForKm : value;

  const alternatives = getAlternatives(vehicle.make, vehicle.model).slice(0, 4);

  // Run market scraping and vehicle reliability analysis in parallel
  const [marketStats, reliability] = await Promise.all([
    fetchSubitoMarketStats(vehicle.make, vehicle.model, vehicle.year, input.km).catch(() => undefined),
    analyzeVehicle({
      vehicle,
      km: input.km,
      requestedPrice: input.requestedPrice,
    }, { requireDetailedModelAnalysis: options.requireDetailedModelAnalysis }),
  ]);

  // Se gli annunci reali restituiscono un prezzo medio attendibile, il valore
  // stimato usa il mercato reale (già filtrato per anno e km confrontabili).
  const marketSample = marketStats?.comparison?.sampleSize ?? (marketStats?.total ?? 0);
  const useMarket = Boolean(marketStats?.priceAvg && marketSample >= 2);
  let finalValue = value;
  let finalMin = min;
  let finalMax = max;
  if (useMarket && marketStats) {
    finalValue = Math.round(marketStats.priceAvg! / 100) * 100;
    const spread = Math.round((finalValue * 0.2) / 100) * 100;
    // Range reale ma con spread contenuto: gli annunci estremi sporcano min/max.
    finalMin = marketStats.priceMin ? Math.max(Math.round(marketStats.priceMin / 100) * 100, finalValue - spread) : finalValue - spread;
    finalMax = marketStats.priceMax ? Math.min(Math.round(marketStats.priceMax / 100) * 100, finalValue + spread) : finalValue + spread;
    // Il campione è già filtrato per km: niente ulteriore aggiustamento.
    comparisonValue = finalValue;
  }

  const report: AutoReport = {
    vehicle,
    reliability,
    price: {
      estimatedValue: useMarket ? finalValue : comparisonValue,
      min: finalMin,
      max: finalMax,
      adjustedForKm: useMarket ? undefined : (adjustedForKm || undefined),
      kmAdjustment: useMarket ? undefined : (kmAdjustment || undefined),
      inputKm: input.km || undefined,
      inputYear: vehicle.year,
      requestedPrice: input.requestedPrice,
      priceVsMarketPercent: input.requestedPrice
        ? Math.round(((input.requestedPrice - comparisonValue) / comparisonValue) * 100)
        : undefined,
      priceLabel: input.requestedPrice ? priceLabelFor(input.requestedPrice, comparisonValue) : undefined,
      comment: useMarket && !input.requestedPrice
        ? (input.km
          ? `Prezzo medio reale da ${marketStats!.total} annunci simili su ${marketStats!.source} (filtro anno e km confrontabili). Inserisci il prezzo richiesto per il confronto.`
          : `Prezzo medio reale da ${marketStats!.total} annunci simili su ${marketStats!.source}. Inserisci il prezzo richiesto per il confronto.`)
        : buildPriceComment(input.requestedPrice, comparisonValue, input.km),
      marketUrls: getMarketSearchUrls(vehicle),
      market: marketStats,
    },
    alternatives: alternatives.map((alt) => {
      const altVehicle = {
        ...alt,
        year: vehicle.year,
        fuel: vehicle.fuel || alt.fuel,
        body: vehicle.body || alt.body,
      };
      const est = input.km
        ? estimateMarketValueWithKm(altVehicle, input.km)
        : estimateMarketValue(altVehicle);

      return {
        make: alt.make,
        model: alt.model,
        body: alt.body,
        estimatedValue: est.value,
        estimatedMin: est.min,
        estimatedMax: est.max,
      };
    }),
    createdAt: new Date().toISOString(),
  };

  cacheSet(`${cachePrefix}:${reportKeyFor(input)}`, report, isModelSearch ? MODEL_REPORT_TTL : PLATE_TTL);
  return { report, cached: false };
}
