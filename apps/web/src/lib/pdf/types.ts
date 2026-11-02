export interface PDFConditionData {
  refinedYear: number;
  refinedKm: number;
  accidentHistoryLabel: string;
  costModeLabel: string;
  recalculatedValue: number;
  verdictLabel: string;
  verdictDescription: string;
  verdictType: 'repair' | 'evaluate' | 'sell';
  totalDiyMin: number;
  totalDiyMax: number;
  totalMechMin: number;
  totalMechMax: number;
  serviceHistoryLabel: string;
  previousOwnersLabel: string;
  interiorConditionLabel: string;
  optionsListLabels: string[];
  items: Array<{
    type: 'spia' | 'danno';
    label: string;
    detail?: string;
    diyCost: string;
    mechCost: string;
    urgencyLabel?: string;
    canDiy: boolean;
  }>;
}

