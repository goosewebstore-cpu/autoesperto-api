import catalogoJson from '@/lib/catalogo.json';

interface CatalogRaw {
  brands: Record<string, string[]>;
}

export interface CatalogMake {
  name: string;
  slug: string;
  models: string[];
}

const raw = catalogoJson as CatalogRaw;
const brands = raw.brands;

export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[-\s]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getAllMakes(): CatalogMake[] {
  return Object.keys(brands)
    .sort((a, b) => a.localeCompare(b, 'it'))
    .map((name) => ({ name, slug: slugify(name), models: brands[name] || [] }));
}

export function findMakeBySlug(slug: string): CatalogMake | undefined {
  return getAllMakes().find((m) => m.slug === slug);
}

export function findModelBySlug(make: CatalogMake, modelSlug: string): string | undefined {
  return make.models.find((m) => slugify(m) === modelSlug);
}

export function getModelSlug(model: string): string {
  return slugify(model);
}

export function getModelsForMake(makeName: string): string[] {
  if (!makeName) return [];
  const normalized = makeName.trim().toLowerCase();
  const directKey = Object.keys(brands).find(
    (k) => k.toLowerCase() === normalized || slugify(k) === slugify(makeName)
  );
  if (directKey && brands[directKey] && brands[directKey].length > 0) {
    return [...brands[directKey]].sort((a, b) => a.localeCompare(b, 'it'));
  }
  return [];
}

export const POPULAR_MAKES_ITALY = [
  'Fiat',
  'Volkswagen',
  'Alfa Romeo',
  'Audi',
  'BMW',
  'Mercedes-Benz',
  'Ford',
  'Renault',
  'Peugeot',
  'Toyota',
  'Jeep',
  'Dacia',
  'Lancia',
  'Citroën',
  'Opel',
  'Nissan',
  'Seat',
  'Skoda',
  'Hyundai',
  'Kia',
  'Mini',
  'Suzuki',
  'Cupra',
  'Smart',
  'Volvo',
  'Tesla',
];

export function getTrimVersionsForModel(make: string, model: string): string[] {
  const mk = (make || '').toLowerCase();
  const md = (model || '').toLowerCase();

  if (mk.includes('fiat') && md.includes('500')) {
    return [
      '1.2 Lounge (69 CV)',
      '1.0 FireFly Hybrid Dolcevita (70 CV)',
      '1.0 FireFly Hybrid Cult (70 CV)',
      '1.3 Multijet Pop / Lounge (95 CV)',
      '0.9 TwinAir Turbo Sport (85 CV)',
      '1.2 Pop (69 CV)',
      '1.2 Sport (69 CV)',
      '1.2 EasyPower GPL',
      '500e Elettrica Icon / La Prima',
      'Abarth 595 Turismo (165 CV)',
      'Abarth 595 Competizione (180 CV)',
      'Altro allestimento',
    ];
  }

  if (mk.includes('fiat') && md.includes('panda')) {
    return [
      '1.0 FireFly Hybrid City Life (70 CV)',
      '1.2 Lounge / City Cross (69 CV)',
      '1.2 Pop / Easy (69 CV)',
      '1.3 Multijet 4x4 (95 CV)',
      '0.9 TwinAir 4x4 Cross',
      '1.2 EasyPower GPL',
      '0.9 Natural Power Metano',
      'Altro allestimento',
    ];
  }

  if (mk.includes('fiat') && md.includes('tipo')) {
    return [
      '1.6 Multijet Lounge / City Life (120/130 CV)',
      '1.3 Multijet Easy / Mirror (95 CV)',
      '1.0 FireFly Cross (100 CV)',
      '1.5 Hybrid DCT (130 CV)',
      '1.4 Benzina Pop / Lounge (95 CV)',
      'Altro allestimento',
    ];
  }

  if (mk.includes('alfa') && md.includes('mito')) {
    return [
      '1.4 TB MultiAir Distinctive (135 CV)',
      '1.3 JTDm Super (95 CV)',
      '1.6 JTDm Progression (120 CV)',
      '1.4 78 CV Neopatentati',
      '1.4 TB GPL (120 CV)',
      '1.4 TB Quadrifoglio Verde (170 CV)',
      'Altro allestimento',
    ];
  }

  if (mk.includes('alfa') && md.includes('giulietta')) {
    return [
      '1.6 JTDm Distinctive / Super (120 CV)',
      '2.0 JTDm Veloce / Distinctive (150/175 CV)',
      '1.4 Turbo Benzina Progression (120 CV)',
      '1.4 MultiAir Super TCT (150/170 CV)',
      '1.75 TBi Quadrifoglio Verde / Veloce (240 CV)',
      'Altro allestimento',
    ];
  }

  if (mk.includes('alfa') && (md.includes('giulia') || md.includes('stelvio'))) {
    return [
      '2.2 Turbo Diesel Super / Ti (160/190 CV)',
      '2.2 Turbo Diesel Q4 Veloce (210 CV)',
      '2.0 Turbo Benzina Q4 Veloce (200/280 CV)',
      '2.9 V6 Quadrifoglio (510 CV)',
      'Sprint / B-Tech',
      'Altro allestimento',
    ];
  }

  if (mk.includes('volkswagen') && md.includes('golf')) {
    return [
      '1.6 TDI Business / Life (115 CV)',
      '2.0 TDI R-Line / Style (150 CV)',
      '2.0 TDI GTD (184/200 CV)',
      '1.0 TSI Life (110 CV)',
      '1.5 eTSI R-Line / Style (130/150 CV)',
      '2.0 TSI GTI (245 CV)',
      '1.4 TSI GTE Plug-in Hybrid',
      'Comfortline / Highline',
      'Altro allestimento',
    ];
  }

  if (mk.includes('volkswagen') && md.includes('polo')) {
    return [
      '1.0 TSI Life / Style (95 CV)',
      '1.0 MPI Comfortline (65/80 CV)',
      '1.6 TDI Comfortline (95 CV)',
      '1.0 TGI Metano (90 CV)',
      '2.0 TSI GTI (200/207 CV)',
      'R-Line',
      'Altro allestimento',
    ];
  }

  if (mk.includes('toyota') && md.includes('yaris')) {
    return [
      '1.5 Hybrid Trend (116 CV)',
      '1.5 Hybrid Lounge / Style (116 CV)',
      '1.5 Hybrid GR Sport (130 CV)',
      '1.0 Active (72 CV)',
      'Yaris Cross 1.5 Hybrid AWD-i',
      'Altro allestimento',
    ];
  }

  if (mk.includes('renault') && md.includes('clio')) {
    return [
      '1.0 TCe GPL Intens / Techno (100 CV)',
      '1.5 dCi Business / Zen (85/115 CV)',
      '1.6 E-Tech Full Hybrid RS Line (140 CV)',
      '1.0 SCe Life / Equilibre (65/75 CV)',
      'Altro allestimento',
    ];
  }

  if (mk.includes('peugeot') && md.includes('208')) {
    return [
      '1.2 PureTech Allure / GT (100 CV)',
      '1.2 PureTech Active (75 CV)',
      '1.5 BlueHDi Allure (100 CV)',
      'e-208 Elettrica GT (136/156 CV)',
      'Altro allestimento',
    ];
  }

  if (mk.includes('dacia') && (md.includes('duster') || md.includes('sandero'))) {
    return [
      '1.0 TCe ECO-G GPL Expression (100 CV)',
      '1.5 dCi 4x4 Prestige / Journey (115 CV)',
      'Stepway Expression',
      'Extreme',
      'Altro allestimento',
    ];
  }

  if (mk.includes('jeep') && md.includes('renegade')) {
    return [
      '1.6 Multijet Longitude / Limited (120/130 CV)',
      '2.0 Multijet 4WD Trailhawk (140/170 CV)',
      '1.0 T3 Limited (120 CV)',
      '1.3 4xe Plug-in Hybrid Limited / S (190/240 CV)',
      'Night Eagle',
      'Altro allestimento',
    ];
  }

  // Brand-wide common trims
  if (mk.includes('audi')) {
    return ['Business Advanced', 'S line edition', 'Identity Contrast', 'Base', 'Altro allestimento'];
  }
  if (mk.includes('bmw')) {
    return ['M Sport', 'Business Advantage', 'xLine', 'Sport', 'Luxury', 'Base', 'Altro allestimento'];
  }
  if (mk.includes('mercedes')) {
    return ['Premium AMG Line', 'Sport', 'Executive', 'Business Extra', 'Night Edition', 'Base', 'Altro allestimento'];
  }
  if (mk.includes('ford')) {
    return ['Titanium', 'ST-Line', 'ST-Line X', 'Vignale', 'Active', 'Trend', 'Altro allestimento'];
  }
  if (mk.includes('renault')) {
    return ['Techno', 'Iconic', 'Evolution', 'RS Line', 'Esprit Alpine', 'Equilibre', 'Intens', 'Altro allestimento'];
  }
  if (mk.includes('peugeot')) {
    return ['GT', 'GT Pack', 'Allure', 'Allure Pack', 'Active', 'Altro allestimento'];
  }
  if (mk.includes('citroen') || mk.includes('citroën')) {
    return ['Shine', 'Feel', 'Feel Pack', 'Max', 'C-Series', 'Live', 'Altro allestimento'];
  }
  if (mk.includes('opel')) {
    return ['GS Line', 'Elegance', 'Edition', 'Ultimate', 'Design & Tech', 'Altro allestimento'];
  }
  if (mk.includes('seat') || mk.includes('cupra')) {
    return ['FR', 'Style', 'VZ', 'Xcellence', 'Reference', 'Altro allestimento'];
  }
  if (mk.includes('nissan')) {
    return ['N-Connecta', 'Tekna', 'Tekna+', 'Acenta', 'Visia', 'Altro allestimento'];
  }

  return [
    'Base',
    'Comfort / Business',
    'Sport / R-Line / S-Line',
    'Top di gamma / Luxury',
    'Altro allestimento',
  ];
}

export const POPULAR_MODELS: Array<{ make: string; model: string }> = [
  { make: 'Fiat', model: 'Panda' },
  { make: 'Fiat', model: '500' },
  { make: 'Fiat', model: '500X' },
  { make: 'Fiat', model: 'Punto' },
  { make: 'Fiat', model: 'Tipo' },
  { make: 'Volkswagen', model: 'Golf' },
  { make: 'Volkswagen', model: 'Polo' },
  { make: 'Volkswagen', model: 'T-Roc' },
  { make: 'Volkswagen', model: 'Tiguan' },
  { make: 'Volkswagen', model: 'T-Cross' },
  { make: 'Toyota', model: 'Yaris' },
  { make: 'Toyota', model: 'Corolla' },
  { make: 'Toyota', model: 'C-HR' },
  { make: 'Toyota', model: 'RAV4' },
  { make: 'Toyota', model: 'Aygo' },
  { make: 'Ford', model: 'Fiesta' },
  { make: 'Ford', model: 'Focus' },
  { make: 'Ford', model: 'Puma' },
  { make: 'Ford', model: 'Kuga' },
  { make: 'Ford', model: 'Fiesta' },
  { make: 'Renault', model: 'Clio' },
  { make: 'Renault', model: 'Captur' },
  { make: 'Renault', model: 'Megane' },
  { make: 'Renault', model: 'Duster' },
  { make: 'Peugeot', model: '208' },
  { make: 'Peugeot', model: '308' },
  { make: 'Peugeot', model: '2008' },
  { make: 'Peugeot', model: '3008' },
  { make: 'Peugeot', model: '5008' },
  { make: 'Citroën', model: 'C3' },
  { make: 'Citroën', model: 'C4' },
  { make: 'Citroën', model: 'C3 Aircross' },
  { make: 'Opel', model: 'Corsa' },
  { make: 'Opel', model: 'Astra' },
  { make: 'Opel', model: 'Mokka' },
  { make: 'Opel', model: 'Crossland' },
  { make: 'Dacia', model: 'Sandero' },
  { make: 'Dacia', model: 'Duster' },
  { make: 'Dacia', model: 'Jogger' },
  { make: 'Dacia', model: 'Logan' },
  { make: 'Hyundai', model: 'i10' },
  { make: 'Hyundai', model: 'i20' },
  { make: 'Hyundai', model: 'i30' },
  { make: 'Hyundai', model: 'Tucson' },
  { make: 'Hyundai', model: 'Kona' },
  { make: 'Kia', model: 'Picanto' },
  { make: 'Kia', model: 'Rio' },
  { make: 'Kia', model: 'Ceed' },
  { make: 'Kia', model: 'Sportage' },
  { make: 'Kia', model: 'Stonic' },
  { make: 'Nissan', model: 'Qashqai' },
  { make: 'Nissan', model: 'Juke' },
  { make: 'Nissan', model: 'Micra' },
  { make: 'Suzuki', model: 'Swift' },
  { make: 'Suzuki', model: 'Vitara' },
  { make: 'Suzuki', model: 'Ignis' },
  { make: 'Mazda', model: 'CX-3' },
  { make: 'Mazda', model: 'CX-5' },
  { make: 'Mazda', model: 'Mazda 3' },
  { make: 'Mazda', model: 'Mazda 2' },
  { make: 'BMW', model: 'Serie 1' },
  { make: 'BMW', model: 'Serie 3' },
  { make: 'BMW', model: 'X1' },
  { make: 'BMW', model: 'X3' },
  { make: 'Audi', model: 'A1' },
  { make: 'Audi', model: 'A3' },
  { make: 'Audi', model: 'A4' },
  { make: 'Audi', model: 'Q2' },
  { make: 'Audi', model: 'Q3' },
  { make: 'Mercedes-Benz', model: 'Classe A' },
  { make: 'Mercedes-Benz', model: 'Classe C' },
  { make: 'Mercedes-Benz', model: 'GLA' },
  { make: 'Mercedes-Benz', model: 'GLC' },
  { make: 'Volvo', model: 'V40' },
  { make: 'Volvo', model: 'XC40' },
  { make: 'Volvo', model: 'XC60' },
  { make: 'Mini', model: 'Mini' },
  { make: 'Land Rover', model: 'Evoque' },
  { make: 'Land Rover', model: 'Range Rover' },
  { make: 'Jeep', model: 'Renegade' },
  { make: 'Jeep', model: 'Compass' },
  { make: 'Alfa Romeo', model: 'Giulietta' },
  { make: 'Alfa Romeo', model: 'Giulia' },
  { make: 'Alfa Romeo', model: 'Stelvio' },
  { make: 'Lancia', model: 'Ypsilon' },
  { make: 'Seat', model: 'Ibiza' },
  { make: 'Seat', model: 'Leon' },
  { make: 'Seat', model: 'Arona' },
  { make: 'Seat', model: 'Ateca' },
  { make: 'Skoda', model: 'Fabia' },
  { make: 'Skoda', model: 'Octavia' },
  { make: 'Skoda', model: 'Kamiq' },
  { make: 'Skoda', model: 'Karoq' },
  { make: 'Skoda', model: 'Kodiaq' },
  { make: 'Tesla', model: 'Model 3' },
  { make: 'Tesla', model: 'Model Y' },
  { make: 'Tesla', model: 'Model S' },
  { make: 'Tesla', model: 'Model X' },
  { make: 'MG', model: 'MG4' },
  { make: 'MG', model: 'ZS' },
  { make: 'Honda', model: 'Civic' },
  { make: 'Honda', model: 'Jazz' },
  { make: 'Honda', model: 'CR-V' },
  { make: 'Mitsubishi', model: 'ASX' },
  { make: 'Mitsubishi', model: 'Outlander' },
  { make: 'Lexus', model: 'IS' },
  { make: 'Lexus', model: 'NX' },
  { make: 'Porsche', model: 'Cayenne' },
  { make: 'Porsche', model: 'Macan' },
  { make: 'Smart', model: 'Fortwo' },
  { make: 'DR', model: '5.0' },
].filter(
  (v, i, arr) =>
    arr.findIndex((x) => x.make === v.make && x.model === v.model) === i
);
