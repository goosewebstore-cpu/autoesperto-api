import type { AutoReport, PriceLabel, VehicleData } from '@autoesperto/types';
import { lookupPlate, type RegCheckRawData } from './regcheck';
import { normalizeVehicleData } from './vehicleKB';
import { searchModel } from './modelDB';
import { findModelEra } from './modelEra';
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
  fuel?: string;
  transmission?: string;
  version?: string;
}

const PLATE_TTL = 24 * 60 * 60 * 1000;
const MODEL_REPORT_TTL = 7 * 24 * 60 * 60 * 1000;

function priceLabelFor(requestedPrice: number, value: number): PriceLabel {
  const diff = (requestedPrice - value) / value;
  if (diff <= -0.05) return 'GOOD';
  if (diff >= 0.05) return 'HIGH';
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
    const found = searchModel(input.make, input.model, input.fuel);
    const era = findModelEra(input.make, input.model);
    const resolvedYear = input.year || found?.year || era?.medianYear;

    const vehicle: VehicleData = found ? { ...found } : {
      make: input.make.trim(),
      model: input.model.trim(),
      year: resolvedYear,
      fuel: input.fuel || era?.fuel || 'Benzina',
      body: era?.body || 'Berlina',
      power: era?.powerCv ? `${era.powerCv} CV` : undefined,
      dataSource: 'model',
    };
    if (resolvedYear) vehicle.year = resolvedYear;
    if (input.fuel || (!vehicle.fuel && era?.fuel)) vehicle.fuel = input.fuel || era?.fuel;
    if (!vehicle.body && era?.body) vehicle.body = era.body;
    if (!vehicle.power && era?.powerCv) vehicle.power = `${era.powerCv} CV`;
    const isEv = (vehicle.fuel || '').toLowerCase().includes('elettr') || (vehicle.fuel || '').toLowerCase().includes('ev') || /tesla|polestar|byd/.test((vehicle.make || '').toLowerCase()) || /500e|taycan|id\.3|id\.4|id\.5|e-208|leaf|zoe/.test((vehicle.model || '').toLowerCase());
    vehicle.transmission = isEv ? 'Automatico' : (input.transmission || vehicle.transmission || 'Manuale');
    if (input.version) vehicle.version = input.version;
    return vehicle;
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
  if (input.fuel) vehicle.fuel = input.fuel;
  if (input.year) vehicle.year = input.year;
  const isEvPlate = (vehicle.fuel || '').toLowerCase().includes('elettr') || (vehicle.fuel || '').toLowerCase().includes('ev') || /tesla|polestar|byd/.test((vehicle.make || '').toLowerCase()) || /500e|taycan|id\.3|id\.4|id\.5|e-208|leaf|zoe/.test((vehicle.model || '').toLowerCase());
  if (isEvPlate) vehicle.transmission = 'Automatico';
  return vehicle;
}

function cacheKeyFor(input: ReportInput): string {
  return input.plate
    ? `plate:${input.plate.toUpperCase()}`
    : `model:${(input.make || '').toLowerCase()}:${(input.model || '').toLowerCase()}:${(input.fuel || '').toLowerCase()}`;
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
  const initialSpread = Math.round((comparisonValue * 0.10) / 100) * 100;
  let finalMin = comparisonValue - initialSpread;
  let finalMax = comparisonValue + initialSpread;

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
  // stimato combina il prezzo di mercato reale (con sconto trattativa) e la curva algoritmica.
  const marketSample = marketStats?.comparison?.sampleSize ?? (marketStats?.total ?? 0);
  const useMarket = Boolean(marketStats?.priceAvg && marketSample >= 2);
  let finalValue = comparisonValue;
  if (useMarket && marketStats) {
    // 1. Prezzo reale stimato di transazione (margine trattativa dedotto rispetto al prezzo in vetrina)
    const rawAsking = marketStats.priceAvg!;
    const transAvg = marketStats.transactionPriceAvg || Math.round(rawAsking * 0.91 / 100) * 100;

    // 2. Rettifica se la media km degli annunci diverge dai km del veicolo dell'utente
    let kmAdjusted = transAvg;
    if (input.km && marketStats.kmAvg && marketStats.kmAvg > 0) {
      const kmDiff = input.km - marketStats.kmAvg;
      const kmAdjFactor = Math.max(-0.18, Math.min(0.14, -(kmDiff / 100000) * 0.12));
      kmAdjusted = Math.round(transAvg * (1 + kmAdjFactor) / 100) * 100;
    }

    // 3. Ponderazione bilanciata: unisce il mercato reale e il listino Quattroruote/Eurotax
    // Campione solido (>= 5): 65% mercato reale transato, 35% stima algoritmica
    // Campione ridotto (2-4): 50% mercato reale transato, 50% stima algoritmica
    const marketWeight = marketSample >= 5 ? 0.65 : 0.50;
    finalValue = Math.round((kmAdjusted * marketWeight + comparisonValue * (1 - marketWeight)) / 100) * 100;

    const spread = Math.round((finalValue * 0.09) / 100) * 100;
    finalMin = finalValue - spread;
    finalMax = finalValue + spread;
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
