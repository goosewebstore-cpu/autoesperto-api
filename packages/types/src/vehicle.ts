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

export interface ReliabilityAnalysis {
  score: number;
  verdict: 'BUY' | 'NEGOTIATE' | 'AVOID';
  verdictLabel: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
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
  futureCosts: {
    annualMaintenance: number;
    fuelCostPer100Km: number;
    insuranceEstimate: number;
    depreciation1Year: number;
    depreciation3Years: number;
    depreciation5Years: number;
  };
}

export interface PriceAnalysis {
  estimatedValue: number;
  min: number;
  max: number;
  listings: MarketListing[];
  requestedPrice?: number;
  priceVsMarketPercent?: number;
  comment: string;
}

export interface AutoReport {
  vehicle: VehicleData;
  reliability: ReliabilityAnalysis;
  price: PriceAnalysis;
  alternatives: VehicleData[];
  videos: { title: string; thumbnail: string; url: string }[];
  createdAt: string;
}
