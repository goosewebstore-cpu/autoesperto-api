import type { VehicleData } from './vehicle';

export type PassportDocCategory = 
  | 'veicolo'
  | 'assicurazione'
  | 'manutenzione'
  | 'riparazioni'
  | 'revisioni'
  | 'altro';

export type PassportPhotoCategory =
  | 'auto'
  | 'esterni'
  | 'interni'
  | 'motore'
  | 'pneumatici'
  | 'danni'
  | 'documenti'
  | 'manutenzione'
  | 'prima_dopo';

export type PassportEventType =
  | 'IMMATRICOLAZIONE'
  | 'ANALISI_AUTOESPERTO'
  | 'TAGLIANDO'
  | 'REVISIONE'
  | 'RIPARAZIONE'
  | 'ASSICURAZIONE'
  | 'PNEUMATICI'
  | 'ISPEZIONE_DANNI'
  | 'ALTRO';

export type PassportReminderType =
  | 'ASSICURAZIONE'
  | 'REVISIONE'
  | 'TAGLIANDO'
  | 'BOLLO'
  | 'PNEUMATICI'
  | 'ALTRO';

export interface PassportPhotoItem {
  id: string;
  url: string;
  thumbnailUrl?: string;
  category: PassportPhotoCategory;
  title: string;
  description?: string;
  date: string;
  timelineEventId?: string;
}

export type InspectionScanStatus = 'rilevato' | 'possibile' | 'non_determinabile';

export interface VehicleInspectionItem {
  id: string;
  date: string;
  angle: 'anteriore' | 'posteriore' | 'lato_sinistro' | 'lato_destro' | 'interni' | 'cruscotto' | 'pneumatici' | 'vano_motore' | 'dettagli_danni';
  angleLabel: string;
  component: string;
  status: InspectionScanStatus;
  severity?: 'lieve' | 'medio' | 'grave' | 'ottimo';
  description: string;
  estimatedRepairCost?: number;
  photoUrl?: string;
}

export interface VehicleAnalysisSnapshot {
  id: string;
  date: string;
  reportId?: string;
  healthScore: number;
  valuationMin: number;
  valuationMax: number;
  recommendedSellPrice?: number;
  attractiveBuyerPrice?: number;
  defects: string[];
  strengths: string[];
  estimatedRepairsMin?: number;
  estimatedRepairsMax?: number;
  annualMaintenanceEstimated?: number;
}

export interface VehicleHealthBreakdown {
  maintenanceScore: number;
  documentationScore: number;
  mileageScore: number;
  bodyConditionScore: number;
  interiorScore: number;
  tiresScore: number;
  modelReliabilityScore: number;
  deadlinesScore: number;
  totalScore: number;
  label: 'OTTIMO' | 'BUONO' | 'MEDIO' | 'ATTENZIONE';
  verdictNote: string;
}

export interface SellingProfileConfig {
  enabled: boolean;
  askingPrice?: number;
  negotiable?: boolean;
  showValuation: boolean;
  showHealthScore: boolean;
  showMaintenance: boolean;
  showInspection: boolean;
  showPhotos: boolean;
  allowContact: boolean;
  contactMethod?: 'whatsapp' | 'email' | 'phone';
  contactValue?: string;
  sellerNotes?: string;
}

export interface PassportDocumentItem {
  id: string;
  category: PassportDocCategory;
  title: string;
  fileUrl: string;
  fileName: string;
  fileSize?: number;
  mimeType: string;
  eventDate?: string;
  km?: number;
  amount?: number;
  extractedData?: Record<string, any>;
  notes?: string;
  status: 'CONFIRMED' | 'PENDING';
  createdAt: string;
}

export interface PassportTimelineItem {
  id: string;
  date: string;
  km?: number;
  type: PassportEventType;
  title: string;
  description?: string;
  cost?: number;
  documentId?: string;
  photoUrls?: string[];
}

export interface PassportReminderItem {
  id: string;
  type: PassportReminderType;
  title: string;
  dueDate?: string;
  dueKm?: number;
  daysRemaining?: number;
  kmRemaining?: number;
  isEstimate?: boolean;
  dismissed?: boolean;
}

export interface PassportShareConfig {
  enabled: boolean;
  showVehicleInfo: boolean;
  showMaintenance: boolean;
  showRepairs: boolean;
  showRevisions: boolean;
  showHealthScore: boolean;
  showOriginalDocs: boolean;
  showPhotos: boolean;
  showTimeline: boolean;
  showValuation: boolean;
}

export interface PassportChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  level?: 'documented' | 'estimate' | 'advice';
  metadata?: {
    repairEstimate?: {
      partCost: string;
      laborCost: string;
      materialsCost: string;
      totalCost: string;
      estimatedHours: string;
    };
    partsLookup?: {
      partName: string;
      oemCode?: string;
      aftermarketPrice?: string;
      compatibilityNotes?: string;
    };
    warningLight?: {
      name: string;
      severity: 'bassa' | 'media' | 'alta' | 'critica';
      stopImmediately: boolean;
      possibleCauses: string[];
      recommendation: string;
    };
  };
  createdAt: string;
}

export interface VehiclePassportData {
  id: string;
  shareCode: string; // es. "AE-48291"
  userId?: string;
  vehicle: VehicleData;
  nickname?: string;
  mainPhoto?: string;
  currentKm: number;
  lastKmDate: string;
  healthScore: number;
  healthBreakdown?: VehicleHealthBreakdown;
  estimatedValue?: number;
  estimatedValueMax?: number;
  recommendedSellPrice?: number;
  attractiveBuyerPrice?: number;
  insuranceExpiry?: string;
  insuranceCompany?: string;
  revisionExpiry?: string;
  nextServiceKm?: number;
  nextServiceDate?: string;
  photos: PassportPhotoItem[];
  inspections: VehicleInspectionItem[];
  analysisSnapshot?: VehicleAnalysisSnapshot;
  documents: PassportDocumentItem[];
  timeline: PassportTimelineItem[];
  reminders: PassportReminderItem[];
  shareConfig: PassportShareConfig;
  sellingConfig?: SellingProfileConfig;
  privacyAcknowledged?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentScanResult {
  documentType: PassportDocCategory;
  documentLabel: string;
  confidence: 'alta' | 'media' | 'bassa';
  extractedFields: {
    make?: string;
    model?: string;
    version?: string;
    plate?: string;
    vin?: string;
    year?: number;
    registrationDate?: string;
    fuel?: string;
    powerKw?: number;
    powerCv?: number;
    displacement?: string;
    euroClass?: string;
    insuranceCompany?: string;
    policyNumber?: string;
    insuranceExpiry?: string;
    insuranceStartDate?: string;
    serviceDate?: string;
    serviceKm?: number;
    serviceWorkshop?: string;
    serviceCost?: number;
    serviceItems?: string[];
    revisionDate?: string;
    revisionOutcome?: string;
    revisionKm?: number;
    revisionCenter?: string;
    nextRevisionDate?: string;
    notes?: string;
  };
  rawSummary?: string;
  warnings: string[];
}

