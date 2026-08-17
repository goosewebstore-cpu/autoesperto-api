export interface RepairItem {
  label: string;
  min: number;
  max: number;
  note: string;
}

export type SegmentKey = 'citycar' | 'utility' | 'berlina' | 'suv' | 'sportiva';

export interface SegmentDef {
  key: SegmentKey;
  label: string;
  laborRate: number;
  partsFactor: number;
  yearlyMaintenance: [number, number];
}

export interface RepairEstimate {
  segment: SegmentDef;
  age: number;
  ageLabel: string;
  ageFactor: number;
  items: RepairItem[];
  totalMin: number;
  totalMax: number;
  maintenanceMin: number;
  maintenanceMax: number;
  commonFailures: string[];
  reliabilityNote: string;
}

const PREMIUM_BRANDS = ['audi', 'bmw', 'mercedes-benz', 'mercedes', 'lexus', 'land rover', 'range rover', 'porsche', 'volvo', 'alfa romeo', 'mini', 'jeep'];
const EV_BRANDS = ['tesla', 'mg'];
export const BOUTIQUE_SPORT_MAKES = ['mclaren', 'pagani', 'bugatti', 'koenigsegg', 'ferrari', 'lamborghini', 'aston martin', 'lotus', 'noble', 'tvr', 'spyker', 'morgan', 'saleen', 'zenvo', 'apollo', 'gumpert', 'rimac', 'de tomaso', 'bizzarrini', 'maserati', 'rolls royce', 'bentley', 'maybach', 'brabus', 'porsche'];

const SEGMENTS: Record<SegmentKey, SegmentDef> = {
  citycar: { key: 'citycar', label: 'city car', laborRate: 52, partsFactor: 1, yearlyMaintenance: [300, 520] },
  utility: { key: 'utility', label: 'utilitaria / segmento medio', laborRate: 56, partsFactor: 1.05, yearlyMaintenance: [380, 650] },
  berlina: { key: 'berlina', label: 'berlina', laborRate: 60, partsFactor: 1.15, yearlyMaintenance: [480, 800] },
  suv: { key: 'suv', label: 'SUV / crossover', laborRate: 62, partsFactor: 1.2, yearlyMaintenance: [520, 880] },
  sportiva: { key: 'sportiva', label: 'sportiva / coupé', laborRate: 66, partsFactor: 1.35, yearlyMaintenance: [650, 1100] },
};

const CITY_CAR = ['500', 'panda', 'aygo', 'yaris', 'jazz', 'swift', 'i10', 'i20', 'picanto', 'rio', 'micra', 'fortwo', 'smart', 'twingo', 'lupo', 'up', 'ka', 'citigo', 'mii', 'ignis', 'celerio', 'splash', 'matiz', 'punto', 'clio', 'corsa', 'fiesta', '208', 'sandro', 'logan', 'fabia', 'ibiza', 'pole', 'pol' ];
const SUV = ['suv', 'x3', 'x5', 'q2', 'q3', 'q5', 't-roc', 'tiguan', 'c-hr', 'rav4', 'kuga', 'puma', 'captur', 'duster', '2008', '3008', '5008', 'aircross', 'mokka', 'crossland', 'tucson', 'kona', 'sportage', 'stonic', 'qashqai', 'juke', 'vitara', 'cx-3', 'cx-5', 'cx-30', 'gla', 'glc', 'glb', 'x1', 'x2', 'xc40', 'xc60', 'evoque', 'renegade', 'compass', 'stelvio', 'arona', 'ateca', 'kamiq', 'karok', 'karoq', 'kodiaq', 'zs', 'cr-v', 'asx', 'outlander', 'nx', 'cayenne', 'macan', 's-cross', 'swace', 'corolla-cross', 'c-hr', 'proace', '1007', 'c3-aircross', 'captur'];
const SPORT = ['911', 'cayman', 'boxster', 'miata', 'gt86', 'supra', 'm2', 'm4', 'rs', 'giulia qv', 'type-r', 'gti', 'abarth', 'clio rs', 'megane rs', 'i20 n', 'ypsilon rally'];

export function detectSegment(make: string, model: string): SegmentKey {
  const m = `${make} ${model}`.toLowerCase();
  const makeNorm = make.toLowerCase();
  if (BOUTIQUE_SPORT_MAKES.some((b) => makeNorm.includes(b))) return 'sportiva';
  if (EV_BRANDS.includes(makeNorm)) return 'utility';
  if (SPORT.some((k) => m.includes(k))) return 'sportiva';
  if (SUV.some((k) => m.includes(k))) return 'suv';
  if (CITY_CAR.some((k) => m.includes(k))) return 'citycar';
  return 'utility';
}

function brandFactor(make: string): number {
  const name = make.toLowerCase();
  if (PREMIUM_BRANDS.some((b) => name.includes(b))) return 1.35;
  if (EV_BRANDS.includes(name)) return 1.15;
  return 1;
}

export const BRAND_FAILURES: Record<string, string[]> = {
  fiat: ['Fanaleria che si appanna o accumula condensa', 'Sospensioni anteriori e silent block usurati', 'Distribuzione da controllare scrupolosamente sul 1.3 Multijet', 'Cinghia accessori e tenditore'],
  volkswagen: ['Cambio DSG con strattoni (soprattutto 7 rapporti)', 'Iniettori e pompette diesel sulle versioni TDI', 'Turbocompressore sulle motorizzazioni 1.4/1.6', 'Centraline elettriche e sensori di parcheggio'],
  audi: ['Cambio DSG e trasmissione S-Tronic', 'Sistema di raffreddamento (termostato e pompa acqua)', 'Sospensioni multi-link anteriori costose da sistemare', 'Consumo olio sulle versioni 1.8/2.0 TFSI più datate'],
  bmw: ['Impianto di raffreddamento fragile sulle versioni più datate', 'Guarnizione testata su alcuni motori diesel', 'Sospensioni pneumatiche sull\'asse posteriore di SUV', 'Elettronica e sensori (valvole elettroniche motore)'],
  'mercedes-benz': ['Sospensioni Airmatic e ammortizzatori a controllo elettronico', 'Iniettori e sistemi SCR/AdBlue sulle versioni diesel', 'Elettronica di bordo e moduli Comand', 'Freni anteriori oversize molto costosi'],
  toyota: ['Batteria di trazione ibrida da tenere monitorata', 'Sospensioni posteriori su modelli più datati', 'Compressore climatizzatore', 'Sensori di parcheggio e radar'],
  renault: ['Turbina su alcune versioni 1.5 dCi / TCe', 'Frizione e volano sulle versioni a bassa percorrenza urbana', 'Elettronica e sensori vari', 'Corrosione su modelli più vecchi'],
  citroën: ['AdBlue e sistemi di post-trattamento diesel', 'Sospensioni idrauliche su modelli storici', 'Sensori e centraline elettriche', 'Cinghia bagnata su alcuni motori 1.2 PureTech'],
  peugeot: ['Cinghia bagnata su motori 1.2 PureTech', 'AdBlue e post-trattamento sulle versioni diesel', 'Sensori e centraline', 'Turbo sulle versioni 1.6 HDi'],
  opel: ['Catena di distribuzione su alcuni motori 1.4', 'AdBlue su diesel recenti', 'Elettronica e sensori', 'Sospensioni anteriori'],
  ford: ['Catena distribuzione su motori 1.0 EcoBoost (tensione)', 'Iniettori diesel', 'Elettronica e sensori (centralina BCM)', 'Sospensioni posteriori su modelli più datati'],
  hyundai: ['Elettronica e sensori (costi contenuti grazie alla garanzia)', 'Frizione su versioni a bassa percorrenza urbana', 'Sensori di parcheggio', 'AdBlue sulle versioni diesel'],
  kia: ['Elettronica e sensori', 'Frizione e volano', 'Sensori ADAS e telecamera', 'AdBlue sulle versioni diesel'],
  nissan: ['Cambio CVT da trattare con cura', 'Iniettori diesel', 'Elettronica e sensori', 'Sospensioni anteriori'],
  suzuki: ['Pochi problemi noti: meccanica semplice e robusta', 'Sensori e piccole elettroniche', 'Sospensioni anteriori', 'Fanaleria'],
  honda: ['Elettronica e sensori', 'Rumori da sospensioni su modelli più datati', 'Cambio CVT da controllare', 'Consumo olio su alcune versioni'],
  mazda: ['Elettronica e sensori', 'Corrosione su modelli più datati', 'Sospensioni anteriori', 'Sistemi i-ELOOP/Skyactiv da monitorare'],
  dacia: ['Elettronica di fascia economica', 'Sospensioni e silent block', 'Fanaleria', 'Costi comunque contenuti: ricambi economici'],
  seat: ['Cambio DSG su versioni con doppia frizione', 'Iniettori diesel', 'Sensori e centraline', 'Turbina sulle versioni 1.4/1.6'],
  skoda: ['Cambio DSG', 'Iniettori diesel', 'Sensori e centraline', 'Costi contenuti: ampia rete di ricambi'],
  volvo: ['Sospensioni pneumatiche su SUV', 'Elettronica e sensori', 'Batteria ausiliaria', 'Freni anteriori costosi'],
  'alfa romeo': ['Elettronica e sensori', 'Turbo e iniettori sulle versioni diesel', 'Sospensioni anteriori', 'Consumo olio su alcuni motori'],
  mini: ['Sospensioni e boccole', 'Impianto di raffreddamento', 'Elettronica e sensori', 'Frizione'],
  jeep: ['Elettronica e sensori', 'Turbo su motori benzina', 'Sistema 4x4 e differenziale', 'Consumo olio'],
  'land rover': ['Sospensioni pneumatiche', 'Elettronica e moduli', 'Sistema 4x4 e differenziali', 'Impianto di raffreddamento'],
  porsche: ['Freni carboceramici (se presenti) molto costosi', 'Sospensioni PASM/PDCC', 'Elettronica e sensori', 'Impianto di raffreddamento'],
  tesla: ['Batteria di trazione (pochi problemi, ma costosi)', 'Sospensioni e bracci', 'Parabrezza e vetri', 'Pneumatici specifici'],
  mg: ['Ricarica e batteria (versione EV)', 'Elettronica e sensori', 'Sospensioni', 'Assistenza in via di espansione in Italia'],
  dr: ['Elettronica e sensori', 'Sospensioni e silent block', 'Fanaleria', 'Costi contenuti'],
};

const GENERIC_FAILURES = [
  'Sospensioni anteriori e silent block usurati con il tempo',
  'Sensori di parcheggio e piccola elettronica',
  'Sistema di raffreddamento (termostato e pompa acqua)',
  'Frizione che richiede attenzione su percorrenze urbane',
];

function roundPrice(v: number): number {
  return Math.round(v / 10) * 10;
}

interface BaseItem {
  label: string;
  base: [number, number];
  note: string;
  minAge: number;
}

const BASE_ITEMS: Record<SegmentKey, BaseItem[]> = {
  citycar: [
    { label: 'Tagliando olio e filtri', base: [90, 150], note: 'Tagliando annuale o ogni 15.000 km.', minAge: 0 },
    { label: 'Pastiglie e dischi freno anteriori', base: [150, 280], note: 'Per asse. Dipende da usura e tipo di impianto.', minAge: 0 },
    { label: 'Batteria', base: [90, 160], note: 'Durata tipica 3–5 anni.', minAge: 0 },
    { label: 'Ricarica climatizzatore', base: [60, 120], note: 'Controllo gas e ripristino.', minAge: 2 },
    { label: 'Cinghia distribuzione', base: [300, 500], note: 'Intervallo tipico 60.000–120.000 km.', minAge: 5 },
    { label: 'Ammortizzatori anteriori', base: [250, 450], note: 'Per asse. Segnali: gocciolamenti o scorrimenti.', minAge: 6 },
    { label: 'Frizione', base: [500, 800], note: 'Solo cambio manuale, tipicamente dopo 120.000+ km.', minAge: 8 },
    { label: 'Termostato e pompa acqua', base: [180, 320], note: 'Prevenzione del surriscaldamento.', minAge: 8 },
  ],
  utility: [
    { label: 'Tagliando olio e filtri', base: [100, 180], note: 'Tagliando annuale o ogni 15.000–20.000 km.', minAge: 0 },
    { label: 'Pastiglie e dischi freno anteriori', base: [200, 350], note: 'Per asse.', minAge: 0 },
    { label: 'Batteria', base: [90, 170], note: 'Durata tipica 3–5 anni.', minAge: 0 },
    { label: 'Ricarica climatizzatore', base: [60, 130], note: 'Controllo gas e ripristino.', minAge: 2 },
    { label: 'Cinghia distribuzione', base: [350, 600], note: 'Intervallo tipico 60.000–120.000 km.', minAge: 5 },
    { label: 'Ammortizzatori anteriori', base: [300, 550], note: 'Per asse.', minAge: 6 },
    { label: 'Frizione', base: [600, 950], note: 'Solo cambio manuale.', minAge: 8 },
    { label: 'Termostato e pompa acqua', base: [200, 360], note: 'Prevenzione del surriscaldamento.', minAge: 8 },
    { label: 'Sensori e sonda lambda', base: [120, 280], note: 'Spia motore accesa e consumi anomali.', minAge: 6 },
  ],
  berlina: [
    { label: 'Tagliando olio e filtri', base: [120, 220], note: 'Tagliando annuale o ogni 15.000–20.000 km.', minAge: 0 },
    { label: 'Pastiglie e dischi freno anteriori', base: [300, 500], note: 'Per asse.', minAge: 0 },
    { label: 'Batteria', base: [100, 190], note: 'Durata tipica 3–5 anni.', minAge: 0 },
    { label: 'Ricarica climatizzatore', base: [70, 140], note: 'Controllo gas e ripristino.', minAge: 2 },
    { label: 'Cinghia distribuzione', base: [450, 750], note: 'Intervallo tipico 60.000–120.000 km.', minAge: 5 },
    { label: 'Ammortizzatori anteriori', base: [400, 700], note: 'Per asse.', minAge: 6 },
    { label: 'Frizione', base: [800, 1300], note: 'Solo cambio manuale.', minAge: 8 },
    { label: 'Termostato e pompa acqua', base: [220, 400], note: 'Prevenzione del surriscaldamento.', minAge: 8 },
    { label: 'Turbo o iniettori', base: [800, 1600], note: 'Soprattutto su versioni diesel e turbo benzina.', minAge: 9 },
  ],
  suv: [
    { label: 'Tagliando olio e filtri', base: [130, 250], note: 'Tagliando annuale o ogni 15.000–20.000 km.', minAge: 0 },
    { label: 'Pastiglie e dischi freno anteriori', base: [350, 600], note: 'Per asse. I SUV pesanti usurano di più.', minAge: 0 },
    { label: 'Batteria', base: [110, 210], note: 'Durata tipica 3–5 anni.', minAge: 0 },
    { label: 'Ricarica climatizzatore', base: [70, 150], note: 'Controllo gas e ripristino.', minAge: 2 },
    { label: 'Cinghia distribuzione', base: [500, 800], note: 'Intervallo tipico 60.000–120.000 km.', minAge: 5 },
    { label: 'Ammortizzatori anteriori', base: [450, 800], note: 'Per asse.', minAge: 6 },
    { label: 'Frizione', base: [900, 1400], note: 'Solo cambio manuale.', minAge: 8 },
    { label: 'Termostato e pompa acqua', base: [240, 420], note: 'Prevenzione del surriscaldamento.', minAge: 8 },
    { label: 'Turbo o iniettori', base: [900, 1700], note: 'Soprattutto su versioni diesel e turbo benzina.', minAge: 9 },
  ],
  sportiva: [
    { label: 'Tagliando olio e filtri', base: [180, 320], note: 'Intervalli spesso più ravvicinati.', minAge: 0 },
    { label: 'Pastiglie e dischi freno anteriori', base: [400, 750], note: 'Impianti maggiorati: costi più alti.', minAge: 0 },
    { label: 'Batteria', base: [130, 250], note: 'Durata tipica 3–5 anni.', minAge: 0 },
    { label: 'Ricarica climatizzatore', base: [80, 150], note: 'Controllo gas e ripristino.', minAge: 2 },
    { label: 'Cinghia distribuzione', base: [550, 950], note: 'Intervallo tipico 60.000–100.000 km.', minAge: 5 },
    { label: 'Ammortizzatori anteriori', base: [550, 950], note: 'Per asse.', minAge: 6 },
    { label: 'Frizione', base: [1000, 1600], note: 'Solo cambio manuale.', minAge: 8 },
    { label: 'Termostato e pompa acqua', base: [260, 450], note: 'Prevenzione del surriscaldamento.', minAge: 8 },
    { label: 'Turbo o iniettori', base: [1000, 2000], note: 'Soprattutto su versioni turbo.', minAge: 9 },
  ],
};

function ageDescriptor(age: number): string {
  if (age <= 3) return 'ancora recente: bastano la manutenzione ordinaria e controlli di base';
  if (age <= 7) return 'entrata nella fascia in cui compaiono le prime usure (freni, sospensioni, distribuzione)';
  if (age <= 12) return 'nella fascia in cui crescono le riparazioni: distribuzione, frizione, sospensioni';
  return 'dove i costi di manutenzione tendono a superare quelli delle auto più giovani: valutare con attenzione';
}

function ageFactorFor(age: number): number {
  if (age <= 3) return 0.85;
  if (age <= 7) return 1;
  if (age <= 12) return 1.15;
  return 1.35;
}

export function estimateRepair(make: string, model: string, year: number): RepairEstimate {
  const segment = SEGMENTS[detectSegment(make, model)];
  const age = Math.max(0, new Date().getFullYear() - year);
  const brandF = brandFactor(make);
  const ageF = ageFactorFor(age);
  const totalF = brandF * ageF;

  const items: RepairItem[] = BASE_ITEMS[segment.key]
    .filter((it) => age >= it.minAge)
    .map((it) => ({
      label: it.label,
      min: roundPrice(it.base[0] * segment.partsFactor * totalF),
      max: roundPrice(it.base[1] * segment.partsFactor * totalF),
      note: it.note,
    }));

  const totalMin = items.reduce((s, it) => s + it.min, 0);
  const totalMax = items.reduce((s, it) => s + it.max, 0);

  const maintenanceMin = Math.round(segment.yearlyMaintenance[0] * totalF);
  const maintenanceMax = Math.round(segment.yearlyMaintenance[1] * totalF);

  const failuresKey = make.toLowerCase();
  const commonFailures =
    BRAND_FAILURES[failuresKey] ||
    BRAND_FAILURES[Object.keys(BRAND_FAILURES).find((k) => failuresKey.includes(k)) || ''] ||
    GENERIC_FAILURES;

  return {
    segment,
    age,
    ageLabel: ageDescriptor(age),
    ageFactor: ageF,
    items,
    totalMin,
    totalMax,
    maintenanceMin,
    maintenanceMax,
    commonFailures,
    reliabilityNote:
      segment.key === 'citycar'
        ? `Una ${segment.label} come la ${make} ${model} ha costi di manutenzione tra i più bassi in circolazione.`
        : segment.key === 'sportiva'
          ? `Una ${segment.label} come la ${make} ${model} ha costi di manutenzione sopra la media: ricambi e manodopera specializzata pesano.`
          : `Una ${segment.label} come la ${make} ${model} ha costi di manutenzione in linea con il suo segmento.`,
  };
}
