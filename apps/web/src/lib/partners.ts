export interface Partner {
  id: string;
  type: 'officina' | 'carrozzeria' | 'concessionario' | 'assicurazione' | 'finanziamento';
  name: string;
  city: string;
  province: string;
  rating?: number;
  specializations?: string[];
  contactUrl?: string;
}

export interface LeadRequest {
  partnerId: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear?: number;
  requestType: 'quotazione' | 'permuta' | 'riparazione' | 'assicurazione';
  userContact?: { name?: string; email?: string; phone?: string };
}

export interface PartnerResponse {
  available: boolean;
  partners: Partner[];
  quotations?: { partnerId: string; priceRange: { min: number; max: number } }[];
}
