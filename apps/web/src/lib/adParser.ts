import { getAllMakes, slugify } from './catalogo';

export interface ParsedAdData {
  make?: string;
  model?: string;
  year?: number;
  km?: number;
  price?: number;
  fuel?: string;
  powerCv?: number;
  rawText?: string;
}

const COMMON_FUELS = [
  { key: 'diesel', label: 'Diesel', regex: /\b(diesel|jtd|tdi|dci|hdi|cdti|crdi|bluehdi|d-4d|d4d)\b/i },
  { key: 'benzina', label: 'Benzina', regex: /\b(benzina|tsi|tfsi|puretech|tce|ecoboost|vti|firefly|fire|skyactiv-g)\b/i },
  { key: 'ibrida', label: 'Ibrida', regex: /\b(ibrid[ao]|hybrid|hev|phev|mhev|mild[- ]hybrid|plug[- ]in)\b/i },
  { key: 'gpl', label: 'GPL', regex: /\b(gpl|lpg|bifuel|bi-fuel|dual)\b/i },
  { key: 'metano', label: 'Metano', regex: /\b(metano|cng|natural power|g-tron|tgi)\b/i },
  { key: 'elettrica', label: 'Elettrica', regex: /\b(elettric[ao]|bev|ev|full electric|kwh)\b/i },
];

function normalizeCompact(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function parseListingTextOrUrl(input: string): ParsedAdData {
  const text = input.trim();
  const result: ParsedAdData = { rawText: text };
  if (!text) return result;

  let searchSpace = text;
  if (/^https?:\/\//i.test(text)) {
    try {
      const url = new URL(text);
      const decodedPath = decodeURIComponent(url.pathname);
      const decodedSearch = decodeURIComponent(url.search);
      searchSpace = `${decodedPath} ${decodedSearch} ${text}`;
    } catch {
      // Proceed with raw text
    }
  }

  // 1. Prezzo: es. "9.500 €", "€ 14.800", "12500 euro", "price=15000", "prezzo: 10000"
  const priceMatch =
    searchSpace.match(/(?:€|eur|euro)\s*(\d{1,3}(?:[.,]\d{3})+|\d{3,6})/i) ||
    searchSpace.match(/(\d{1,3}(?:[.,]\d{3})+|\d{3,6})\s*(?:€|eur|euro)\b/i) ||
    searchSpace.match(/(?:prezzo|price)[:=\s]+(\d{1,3}(?:[.,]\d{3})+|\d{3,6})/i);
  if (priceMatch) {
    const rawVal = priceMatch[1].replace(/[.,]/g, '');
    const num = parseInt(rawVal, 10);
    if (!isNaN(num) && num >= 500 && num <= 500000) {
      result.price = num;
    }
  }

  // 2. Anno (1990 - 2027)
  const yearMatch = searchSpace.match(/\b(199\d|20[0-2]\d)\b/);
  if (yearMatch) {
    result.year = parseInt(yearMatch[1], 10);
  }

  // 3. Chilometri: es. "45.000 km", "km 65.000", "km: 65000", "mileage=80000"
  const kmMatch =
    searchSpace.match(/(\d{1,3}(?:[.,]\d{3})+|\d{4,6})\s*(?:km|chilometri|mila km)\b/i) ||
    searchSpace.match(/(?:km|chilometri|chilometraggio|mileage)[:=\s]+(\d{1,3}(?:[.,]\d{3})+|\d{4,6})/i);
  if (kmMatch) {
    const rawKm = kmMatch[1].replace(/[.,]/g, '');
    const numKm = parseInt(rawKm, 10);
    if (!isNaN(numKm) && numKm >= 100 && numKm <= 1000000 && numKm !== result.year) {
      result.km = numKm;
    }
  }

  // 4. Alimentazione
  for (const f of COMMON_FUELS) {
    if (f.regex.test(searchSpace)) {
      result.fuel = f.label;
      break;
    }
  }

  // 5. Potenza in CV
  const cvMatch = searchSpace.match(/(\d{2,3})\s*(?:cv|cavall[io]|hp)\b/i);
  if (cvMatch) {
    result.powerCv = parseInt(cvMatch[1], 10);
  }

  // 6. Riconoscimento Marca e Modello
  const allMakes = getAllMakes().slice().sort((a, b) => b.name.length - a.name.length);
  const normalizedSpace = searchSpace.toLowerCase();
  const compactSpace = normalizeCompact(searchSpace);
  const slugSpace = slugify(searchSpace);

  for (const m of allMakes) {
    const makeName = m.name;
    const makeSlug = slugify(makeName);
    const makeCompact = normalizeCompact(makeName);

    const makeFound =
      normalizedSpace.includes(makeName.toLowerCase()) ||
      slugSpace.includes(makeSlug) ||
      compactSpace.includes(makeCompact);

    if (makeFound) {
      result.make = makeName;
      const sortedModels = m.models.slice().sort((a, b) => b.length - a.length);

      for (const mod of sortedModels) {
        const modSlug = slugify(mod);
        const modCompact = normalizeCompact(mod);
        const modLower = mod.toLowerCase();

        if (
          slugSpace.includes(modSlug) ||
          normalizedSpace.includes(modLower) ||
          compactSpace.includes(makeCompact + modCompact) ||
          (modCompact.length >= 3 && compactSpace.includes(modCompact))
        ) {
          result.model = mod;
          break;
        }
      }
      if (result.model) break;
    }
  }

  return result;
}

