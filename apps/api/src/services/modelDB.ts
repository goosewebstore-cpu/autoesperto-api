import type { VehicleData } from '@autoesperto/types';

export interface ModelEntry {
  make: string;
  model: string;
  version: string;
  year: number;
  fuel: string;
  displacement: string;
  power: string;
  transmission: string;
  body: string;
  doors: number;
}

export const ModelDB: ModelEntry[] = [
  // Fiat
  { make: 'Fiat', model: 'Panda', version: '1.2 Lounge 69 CV', year: 2020, fuel: 'Benzina', displacement: '1.2 L', power: '69 CV', transmission: 'Manuale', body: 'Utilitaria', doors: 5 },
  { make: 'Fiat', model: '500', version: '1.2 Lounge 69 CV', year: 2018, fuel: 'Benzina', displacement: '1.2 L', power: '69 CV', transmission: 'Manuale', body: 'Utilitaria', doors: 3 },
  { make: 'Fiat', model: 'Tipo', version: '1.6 Multijet 120 CV', year: 2018, fuel: 'Diesel', displacement: '1.6 L', power: '120 CV', transmission: 'Manuale', body: 'Berlina', doors: 5 },
  { make: 'Fiat', model: '500X', version: '1.3 Multijet 95 CV', year: 2018, fuel: 'Diesel', displacement: '1.3 L', power: '95 CV', transmission: 'Manuale', body: 'SUV', doors: 5 },
  // Volkswagen
  { make: 'Volkswagen', model: 'Golf', version: 'VII 1.6 TDI Highline 115 CV', year: 2018, fuel: 'Diesel', displacement: '1.6 L', power: '115 CV', transmission: 'Manuale', body: 'Berlina', doors: 5 },
  { make: 'Volkswagen', model: 'Polo', version: '1.0 TSI 95 CV', year: 2018, fuel: 'Benzina', displacement: '1.0 L', power: '95 CV', transmission: 'Manuale', body: 'Utilitaria', doors: 5 },
  { make: 'Volkswagen', model: 'T-Roc', version: '1.5 TSI ACT 150 CV', year: 2019, fuel: 'Benzina', displacement: '1.5 L', power: '150 CV', transmission: 'Manuale', body: 'SUV', doors: 5 },
  // Ford
  { make: 'Ford', model: 'Focus', version: '1.5 TDCi 120 CV', year: 2017, fuel: 'Diesel', displacement: '1.5 L', power: '120 CV', transmission: 'Manuale', body: 'Berlina', doors: 5 },
  { make: 'Ford', model: 'Fiesta', version: '1.1 85 CV', year: 2018, fuel: 'Benzina', displacement: '1.1 L', power: '85 CV', transmission: 'Manuale', body: 'Utilitaria', doors: 5 },
  { make: 'Ford', model: 'Kuga', version: '1.5 TDCi 120 CV', year: 2017, fuel: 'Diesel', displacement: '1.5 L', power: '120 CV', transmission: 'Manuale', body: 'SUV', doors: 5 },
  // Toyota
  { make: 'Toyota', model: 'Yaris', version: '1.5 Hybrid Active 116 CV', year: 2021, fuel: 'Ibrida', displacement: '1.5 L', power: '116 CV', transmission: 'Automatico CVT', body: 'Utilitaria', doors: 5 },
  { make: 'Toyota', model: 'Corolla', version: '1.8 Hybrid Trend 122 CV', year: 2020, fuel: 'Ibrida', displacement: '1.8 L', power: '122 CV', transmission: 'Automatico CVT', body: 'Berlina', doors: 5 },
  { make: 'Toyota', model: 'RAV4', version: '2.0 Hybrid AWD-i 218 CV', year: 2020, fuel: 'Ibrida', displacement: '2.0 L', power: '218 CV', transmission: 'Automatico CVT', body: 'SUV', doors: 5 },
  // BMW
  { make: 'BMW', model: 'Serie 1', version: '118d MSport 150 CV', year: 2019, fuel: 'Diesel', displacement: '2.0 L', power: '150 CV', transmission: 'Automatico', body: 'Berlina', doors: 5 },
  { make: 'BMW', model: 'Serie 3', version: '320d Business 190 CV', year: 2018, fuel: 'Diesel', displacement: '2.0 L', power: '190 CV', transmission: 'Automatico', body: 'Berlina', doors: 4 },
  { make: 'BMW', model: 'X1', version: '18d xLine 150 CV', year: 2019, fuel: 'Diesel', displacement: '2.0 L', power: '150 CV', transmission: 'Automatico', body: 'SUV', doors: 5 },
  // Mercedes
  { make: 'Mercedes', model: 'Classe A', version: '180d Executive 116 CV', year: 2019, fuel: 'Diesel', displacement: '1.5 L', power: '116 CV', transmission: 'Automatico', body: 'Berlina', doors: 5 },
  { make: 'Mercedes', model: 'Classe C', version: 'C220d 194 CV', year: 2018, fuel: 'Diesel', displacement: '2.0 L', power: '194 CV', transmission: 'Automatico', body: 'Berlina', doors: 4 },
  { make: 'Mercedes', model: 'GLC', version: '220d 4MATIC 194 CV', year: 2019, fuel: 'Diesel', displacement: '2.0 L', power: '194 CV', transmission: 'Automatico', body: 'SUV', doors: 5 },
  // Audi
  { make: 'Audi', model: 'A3', version: '2.0 TDI S line 150 CV', year: 2018, fuel: 'Diesel', displacement: '2.0 L', power: '150 CV', transmission: 'Automatico', body: 'Berlina', doors: 5 },
  { make: 'Audi', model: 'A4', version: '2.0 TDI Business 190 CV', year: 2018, fuel: 'Diesel', displacement: '2.0 L', power: '190 CV', transmission: 'Automatico', body: 'Berlina', doors: 4 },
  { make: 'Audi', model: 'Q3', version: '2.0 TDI 150 CV', year: 2018, fuel: 'Diesel', displacement: '2.0 L', power: '150 CV', transmission: 'Automatico', body: 'SUV', doors: 5 },
  // Renault
  { make: 'Renault', model: 'Clio', version: '1.5 dCi 90 CV', year: 2018, fuel: 'Diesel', displacement: '1.5 L', power: '90 CV', transmission: 'Manuale', body: 'Utilitaria', doors: 5 },
  { make: 'Renault', model: 'Captur', version: '1.5 dCi 90 CV', year: 2018, fuel: 'Diesel', displacement: '1.5 L', power: '90 CV', transmission: 'Manuale', body: 'Crossover', doors: 5 },
  { make: 'Renault', model: 'Megane', version: '1.5 dCi 110 CV', year: 2017, fuel: 'Diesel', displacement: '1.5 L', power: '110 CV', transmission: 'Manuale', body: 'Berlina', doors: 5 },
  // Peugeot
  { make: 'Peugeot', model: '208', version: '1.2 PureTech 100 CV', year: 2019, fuel: 'Benzina', displacement: '1.2 L', power: '100 CV', transmission: 'Manuale', body: 'Utilitaria', doors: 5 },
  { make: 'Peugeot', model: '308', version: '1.5 BlueHDi 130 CV', year: 2019, fuel: 'Diesel', displacement: '1.5 L', power: '130 CV', transmission: 'Automatico', body: 'Berlina', doors: 5 },
  { make: 'Peugeot', model: '2008', version: '1.2 PureTech 110 CV', year: 2019, fuel: 'Benzina', displacement: '1.2 L', power: '110 CV', transmission: 'Manuale', body: 'SUV', doors: 5 },
  // Honda
  { make: 'Honda', model: 'Civic', version: '1.8 i-VTEC 142 CV', year: 2016, fuel: 'Benzina', displacement: '1.8 L', power: '142 CV', transmission: 'Manuale', body: 'Berlina', doors: 5 },
  { make: 'Honda', model: 'CR-V', version: '1.6 i-DTEC 160 CV', year: 2017, fuel: 'Diesel', displacement: '1.6 L', power: '160 CV', transmission: 'Manuale', body: 'SUV', doors: 5 },
  // Hyundai / Kia
  { make: 'Hyundai', model: 'i30', version: '1.6 CRDi 136 CV', year: 2018, fuel: 'Diesel', displacement: '1.6 L', power: '136 CV', transmission: 'Manuale', body: 'Berlina', doors: 5 },
  { make: 'Hyundai', model: 'Tucson', version: '1.6 CRDi 136 CV', year: 2018, fuel: 'Diesel', displacement: '1.6 L', power: '136 CV', transmission: 'Manuale', body: 'SUV', doors: 5 },
  { make: 'Kia', model: 'Ceed', version: '1.6 CRDi 136 CV', year: 2018, fuel: 'Diesel', displacement: '1.6 L', power: '136 CV', transmission: 'Manuale', body: 'Berlina', doors: 5 },
  { make: 'Kia', model: 'Sportage', version: '1.6 CRDi 136 CV', year: 2018, fuel: 'Diesel', displacement: '1.6 L', power: '136 CV', transmission: 'Manuale', body: 'SUV', doors: 5 },
  // Nissan
  { make: 'Nissan', model: 'Qashqai', version: '1.5 dCi 110 CV', year: 2018, fuel: 'Diesel', displacement: '1.5 L', power: '110 CV', transmission: 'Manuale', body: 'SUV', doors: 5 },
  { make: 'Nissan', model: 'Juke', version: '1.0 DIG-T 117 CV', year: 2019, fuel: 'Benzina', displacement: '1.0 L', power: '117 CV', transmission: 'Manuale', body: 'SUV', doors: 5 },
  // Mazda
  { make: 'Mazda', model: 'CX-3', version: '1.5d Evolve 105 CV', year: 2017, fuel: 'Diesel', displacement: '1.5 L', power: '105 CV', transmission: 'Manuale', body: 'SUV', doors: 5 },
  { make: 'Mazda', model: 'Mazda 3', version: '2.0 SkyActiv-G 122 CV', year: 2017, fuel: 'Benzina', displacement: '2.0 L', power: '122 CV', transmission: 'Manuale', body: 'Berlina', doors: 5 },
  // Alfa Romeo
  { make: 'Alfa Romeo', model: 'Giulietta', version: '2.0 JTDM 150 CV', year: 2018, fuel: 'Diesel', displacement: '2.0 L', power: '150 CV', transmission: 'Manuale', body: 'Berlina', doors: 5 },
  { make: 'Alfa Romeo', model: 'MiTo', version: '1.4 TB 120 CV', year: 2015, fuel: 'Benzina', displacement: '1.4 L', power: '120 CV', transmission: 'Manuale', body: 'Utilitaria', doors: 3 },
  // Volvo
  { make: 'Volvo', model: 'V40', version: 'D2 115 CV', year: 2018, fuel: 'Diesel', displacement: '2.0 L', power: '115 CV', transmission: 'Manuale', body: 'Station wagon', doors: 5 },
  { make: 'Volvo', model: 'XC60', version: 'D4 190 CV', year: 2019, fuel: 'Diesel', displacement: '2.0 L', power: '190 CV', transmission: 'Automatico', body: 'SUV', doors: 5 },
  // Seat / Skoda
  { make: 'Seat', model: 'Leon', version: '1.6 TDI 115 CV', year: 2018, fuel: 'Diesel', displacement: '1.6 L', power: '115 CV', transmission: 'Manuale', body: 'Berlina', doors: 5 },
  { make: 'Skoda', model: 'Octavia', version: '1.6 TDI 115 CV', year: 2018, fuel: 'Diesel', displacement: '1.6 L', power: '115 CV', transmission: 'Manuale', body: 'Berlina', doors: 5 },
  { make: 'Skoda', model: 'Kodiaq', version: '1.6 TDI 120 CV', year: 2018, fuel: 'Diesel', displacement: '1.6 L', power: '120 CV', transmission: 'Manuale', body: 'SUV', doors: 7 },
  // Dacia
  { make: 'Dacia', model: 'Sandero', version: '1.0 SCe 75 CV', year: 2018, fuel: 'Benzina', displacement: '1.0 L', power: '75 CV', transmission: 'Manuale', body: 'Utilitaria', doors: 5 },
  { make: 'Dacia', model: 'Duster', version: '1.5 dCi 95 CV', year: 2019, fuel: 'Diesel', displacement: '1.5 L', power: '95 CV', transmission: 'Manuale', body: 'SUV', doors: 5 },
  // Mini
  { make: 'Mini', model: 'Cooper', version: '1.5 136 CV', year: 2018, fuel: 'Benzina', displacement: '1.5 L', power: '136 CV', transmission: 'Manuale', body: 'Utilitaria', doors: 3 },
  // Suzuki
  { make: 'Suzuki', model: 'Swift', version: '1.2 Dualjet 90 CV', year: 2018, fuel: 'Benzina', displacement: '1.2 L', power: '90 CV', transmission: 'Manuale', body: 'Utilitaria', doors: 5 },
  { make: 'Suzuki', model: 'Vitara', version: '1.4 Boosterjet 140 CV', year: 2018, fuel: 'Benzina', displacement: '1.4 L', power: '140 CV', transmission: 'Manuale', body: 'SUV', doors: 5 },
  // Jeep
  { make: 'Jeep', model: 'Renegade', version: '1.6 Multijet 120 CV', year: 2018, fuel: 'Diesel', displacement: '1.6 L', power: '120 CV', transmission: 'Manuale', body: 'SUV', doors: 5 },
  { make: 'Jeep', model: 'Compass', version: '1.6 Multijet 120 CV', year: 2018, fuel: 'Diesel', displacement: '1.6 L', power: '120 CV', transmission: 'Manuale', body: 'SUV', doors: 5 },
  // Citroen
  { make: 'Citroen', model: 'C3', version: '1.2 PureTech 83 CV', year: 2019, fuel: 'Benzina', displacement: '1.2 L', power: '83 CV', transmission: 'Manuale', body: 'Utilitaria', doors: 5 },
  { make: 'Citroen', model: 'C4 Cactus', version: '1.2 PureTech 110 CV', year: 2018, fuel: 'Benzina', displacement: '1.2 L', power: '110 CV', transmission: 'Manuale', body: 'Crossover', doors: 5 },
];

const ALIASES: Record<string, string> = {
  'vw': 'volkswagen',
  'volks wagen': 'volkswagen',
  'mercedes-benz': 'mercedes',
  'mercedes benz': 'mercedes',
  'alfa': 'alfa romeo',
  'alfa-romeo': 'alfa romeo',
  'alfaromeo': 'alfa romeo',
  'serie': '',
};

function normalizeMake(make: string): string {
  const m = make.toLowerCase().trim().replace(/-/g, ' ').replace(/\s+/g, ' ');
  if (ALIASES[m] !== undefined) return ALIASES[m];
  return m;
}

function compact(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function searchModel(make: string, model: string): VehicleData | null {
  const mk = normalizeMake(make);
  const modelCompact = compact(model);

  const candidates = ModelDB.filter((e) => e.make.toLowerCase() === mk);
  if (candidates.length === 0) return null;
  if (candidates.length === 1) return toVehicleData(candidates[0]);

  const exact = candidates.find((e) => compact(e.model) === modelCompact);
  if (exact) return toVehicleData(exact);

  const partial = candidates.find(
    (e) => compact(e.model).includes(modelCompact) || modelCompact.includes(compact(e.model))
  );
  if (partial) return toVehicleData(partial);

  return null;
}

export function suggestModels(make: string): string[] {
  const mk = normalizeMake(make);
  return ModelDB.filter((e) => e.make.toLowerCase() === mk).map((e) => e.model);
}

function toVehicleData(entry: ModelEntry): VehicleData {
  return {
    make: entry.make,
    model: entry.model,
    version: entry.version,
    year: entry.year,
    fuel: entry.fuel,
    displacement: entry.displacement,
    power: entry.power,
    transmission: entry.transmission,
    body: entry.body,
    doors: entry.doors,
    dataSource: 'model',
  };
}
