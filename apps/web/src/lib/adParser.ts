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
  { key: 'diesel', label: 'Diesel', regex: /\b(diesel|jtd|tdi|dci|hdi|cdti|crdi|bluehdi|d-4d)\b/i },
  { key: 'benzina', label: 'Benzina', regex: /\b(benzina|tsi|tfsi|puretech|tce|ecoboost|vti|firefly|fire)\b/i },
  { key: 'ibrida', label: 'Ibrida', regex: /\b(ibrid[ao]|hybrid|hev|phev|mhev|mild[- ]hybrid|plug[- ]in)\b/i },
  { key: 'gpl', label: 'GPL', regex: /\b(gpl|lpg|bifuel|bi-fuel|dual)\b/i },
  { key: 'metano', label: 'Metano', regex: /\b(metano|cng|natural power|g-tron|tgi)\b/i },
  { key: 'elettrica', label: 'Elettrica', regex: /\b(elettric[ao]|bev|ev|full electric|kwh)\b/i },
];

export function parseListingTextOrUrl(input: string): ParsedAdData {
  const text = input.trim();
  const result: ParsedAdData = { rawText: text };
  if (!text) return result;

  // 1. Check if input is a URL (AutoScout24, Subito, Automobile.it, Facebook, etc.)
  if (/^https?:\/\//i.test(text)) {
    try {
      const url = new URL(text);
      const pathname = decodeURIComponent(url.pathname).toLowerCase();

      // Example AutoScout24: /annunci/fiat-panda-1-2-lounge-69cv-benzina-bianco-12345
      // Example Subito: /auto/volkswagen-golf-7-2-0-tdi-2019-milano-123456.htm
      const cleanPath = pathname.replace(/[._-]/g, ' ');

      // Estrai numeri a 4 cifre per l'anno (es. 2015 - 2026)
      const yearMatch = cleanPath.match(/\b(20[0-2]\d|199\d)\b/);
      if (yearMatch) {
        result.year = parseInt(yearMatch[1], 10);
      }

      // Estrai CV
      const cvMatch = cleanPath.match(/(\d{2,3})\s*cv\b/i);
      if (cvMatch) {
        result.powerCv = parseInt(cvMatch[1], 10);
      }

      // Check fuel
      for (const f of COMMON_FUELS) {
        if (f.regex.test(cleanPath)) {
          result.fuel = f.label;
          break;
        }
      }

      // Trova Marca e Modello dal path
      const makes = getAllMakes();
      for (const m of makes) {
        const makeLower = m.name.toLowerCase();
        if (cleanPath.includes(makeLower)) {
          result.make = m.name;
          for (const mod of m.models) {
            const modLower = mod.toLowerCase();
            if (cleanPath.includes(modLower)) {
              result.model = mod;
              break;
            }
          }
          if (result.model) break;
        }
      }

      return result;
    } catch {
      // Procedi con text parsing normale
    }
  }

  // 2. Text Parsing (Annuncio incollato o descrizione)
  const normText = text.replace(/[\n\r]+/g, ' ');

  // A. Trova Prezzo (es. 9.500 €, 14500 euro, € 12.800, 8900€)
  const priceMatch =
    normText.match(/(?:€|eur|euro)?\s*(\d{1,3}(?:[.,]\d{3})+|\d{3,6})\s*(?:€|eur|euro)?/i);
  if (priceMatch) {
    const rawVal = priceMatch[1].replace(/[.,]/g, '');
    const num = parseInt(rawVal, 10);
    if (!isNaN(num) && num >= 500 && num <= 500000 && num !== result.year) {
      result.price = num;
    }
  }

  // B. Trova Anno (es. anno 2019, del 2021, 2018)
  const yearMatch =
    normText.match(/(?:anno|immatricolazione|del|anno di produzione)?\s*\b(20[0-2]\d|199\d)\b/i);
  if (yearMatch) {
    result.year = parseInt(yearMatch[1], 10);
  }

  // C. Trova Chilometri (es. 85.000 km, 120000km, km 64.500)
  const kmMatch = normText.match(/(?:km|chilometri)?\s*(\d{1,3}(?:[.,]\d{3})+|\d{4,6})\s*(?:km|chilometri|mila km)/i);
  if (kmMatch) {
    const rawKm = kmMatch[1].replace(/[.,]/g, '');
    const numKm = parseInt(rawKm, 10);
    if (!isNaN(numKm) && numKm >= 100 && numKm <= 1000000) {
      result.km = numKm;
    }
  }

  // D. Trova Alimentazione
  for (const f of COMMON_FUELS) {
    if (f.regex.test(normText)) {
      result.fuel = f.label;
      break;
    }
  }

  // E. Trova Potenza in CV
  const cvMatch = normText.match(/(\d{2,3})\s*(?:cv|cavall[io]|hp)\b/i);
  if (cvMatch) {
    result.powerCv = parseInt(cvMatch[1], 10);
  }

  // F. Trova Marca e Modello incrociando il catalogo
  const allMakes = getAllMakes();
  for (const m of allMakes) {
    const makeRegex = new RegExp(`\\b${m.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (makeRegex.test(normText)) {
      result.make = m.name;
      for (const mod of m.models) {
        const modRegex = new RegExp(`\\b${mod.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (modRegex.test(normText)) {
          result.model = mod;
          break;
        }
      }
      if (result.model) break;
    }
  }

  return result;
}
