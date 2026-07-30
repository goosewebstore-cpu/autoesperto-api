export interface ReportInput {
  plate?: string;
  vin?: string;
  requestedPrice?: number;
}

export interface ReportSummary {
  id: string;
  vehicleDisplay: string;
  reliabilityScore: number;
  verdict: string;
  createdAt: string;
}
