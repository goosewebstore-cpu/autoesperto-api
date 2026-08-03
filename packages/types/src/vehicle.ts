export interface VehicleData {
  make: string;
  model: string;
  version?: string;
  year?: number;
  fuel?: string;
  displacement?: string;
  power?: string;
  transmission?: string;
  body?: string;
  doors?: number;
  color?: string;
  euroClass?: string;
  imageUrl?: string;
  plate?: string;
  vin?: string;
  dataSource?: 'plate' | 'model';
}

export interface MarketListing {
  id: string;
  title: string;
  price: number;
  km: number;
  year: number;
  city: string;
  source: string;
  sourceUrl: string;
  imageUrl?: string;
}

export interface MarketLink {
  source: string;
  url: string;
}

export interface MarketStats {
  source: string;
  total: number;
  priceAvg?: number;
  priceMin?: number;
  priceMax?: number;
  kmAvg?: number;
  yearMin?: number;
  yearMax?: number;
  url: string;
  fetchedAt: string;
  listings?: MarketListing[];
  /** Parametri usati per selezionare annunci davvero confrontabili. */
  comparison?: {
    targetYear?: number;
    targetKm?: number;
    yearMatched: boolean;
    kmMatched: boolean;
    sampleSize?: number;
    targetSample?: number;
    disclosure?: string;
  };
}

export interface AlternativeVehicle {
  make: string;
  model: string;
  estimatedValue: number;
  estimatedMin: number;
  estimatedMax: number;
  market?: MarketStats;
}

export interface ReliabilityAnalysis {
  score: number;
  verdict: 'BUY' | 'NEGOTIATE' | 'AVOID';
  verdictLabel: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  advice: string[];
  engine: string;
  transmission: string;
  maintenance: 'basso' | 'medio' | 'alto' | 'molto alto';
  commonIssues: string[];
  usage: {
    city: string;
    family: string;
    highway: string;
    newDriver: string;
  };
  recommendedVersions?: string[];
  versionsToAvoid?: string[];
  aiEnhanced?: boolean;
  futureCosts: {
    annualMaintenance: number;
    fuelCostPer100Km: number;
    insuranceEstimate: number;
    depreciation1Year: number;
    depreciation3Years: number;
    depreciation5Years: number;
  };
}

export type PriceLabel = 'GOOD' | 'FAIR' | 'HIGH';

export interface PriceAnalysis {
  estimatedValue: number;
  min: number;
  max: number;
  adjustedForKm?: number;
  kmAdjustment?: number;
  inputKm?: number;
  inputYear?: number;
  requestedPrice?: number;
  priceVsMarketPercent?: number;
  priceLabel?: PriceLabel;
  comment: string;
  marketUrls: MarketLink[];
  market?: MarketStats;
}

export interface AutoReport {
  vehicle: VehicleData;
  reliability: ReliabilityAnalysis;
  price: PriceAnalysis;
  alternatives?: AlternativeVehicle[];
  createdAt: string;
}
