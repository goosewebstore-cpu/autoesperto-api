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
