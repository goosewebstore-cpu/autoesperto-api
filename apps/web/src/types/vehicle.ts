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
  dataSource?: 'plate' | 'model' | 'segment_fallback';
  location?: {
    cap?: string;
    city?: string;
    province?: string;
    region?: string;
  };
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
  transactionPriceAvg?: number;
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
  body?: string;
  segment?: string;
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
  categoryScores?: {
    engine: number;
    transmission: number;
    electronics: number;
    suspension: number;
    body: number;
  };
  usage: {
    city: string;
    family: string;
    highway: string;
    newDriver: string;
  };
  recommendedVersions?: string[];
  versionsToAvoid?: string[];
  aiEnhanced?: boolean;
  consumption?: {
    city: number;
    highway: number;
    combined: number;
    fuelType?: string;
  };
  taxAnnual?: number;
  serviceIntervalKm?: number;
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
  isSegmentEstimate?: boolean;
}

export interface PhotoAnalysisResult {
  vehicle?: {
    make?: string;
    model?: string;
    generation?: string;
    year?: number;
    fuel?: string;
    color?: string;
    bodyType?: string;
    confidence: 'bassa' | 'media' | 'alta';
  };
  damage: {
    visible: boolean;
    category:
      | 'graffio'
      | 'ammaccatura'
      | 'paraurti'
      | 'fanale'
      | 'specchietto'
      | 'cerchio_gomma'
      | 'vetro'
      | 'carrozzeria'
      | 'frontale_grave'
      | 'strutturale_telaio'
      | 'meccanica_sospensioni'
      | 'nessun_danno_evidente'
      | 'non_chiaro';
    severity: 'lieve' | 'media' | 'alta';
    description: string;
    area?: string;
    repairHint?: string;
  };
  repairRange?: { min: number; max: number };
  estimatedTimeDays?: number;
  note: string;
}

export interface AutoReport {
  vehicle: VehicleData;
  reliability: ReliabilityAnalysis;
  price: PriceAnalysis;
  alternatives?: AlternativeVehicle[];
  photoAnalysis?: PhotoAnalysisResult;
  createdAt: string;
}
