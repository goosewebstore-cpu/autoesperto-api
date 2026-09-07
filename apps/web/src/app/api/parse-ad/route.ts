import { NextResponse } from 'next/server';
import catalogoJson from '@/lib/catalogo.json';

interface CatalogRaw {
  brands: Record<string, string[]>;
}

const rawCatalog = catalogoJson as CatalogRaw;
const allBrands = Object.keys(rawCatalog.brands).sort((a, b) => b.length - a.length);

export interface ExtractedAdInfo {
  make?: string;
  model?: string;
  version?: string;
  year?: number;
  km?: number;
  price?: number;
  fuel?: string;
  transmission?: string;
  powerCv?: number;
  photo?: string;
  city?: string;
  source?: string;
  title?: string;
  rawText?: string;
}

const FUELS = [
  { key: 'diesel', label: 'Diesel', regex: /\b(diesel|gasolio|jtd|multijet|tdi|dci|hdi|bluehdi|cdti|crdi)\b/i },
  { key: 'benzina', label: 'Benzina', regex: /\b(benzina|tsi|tfsi|puretech|tce|ecoboost|firefly|fire|vti|skyactiv-g)\b/i },
  { key: 'ibrida', label: 'Ibrida', regex: /\b(ibrid[ao]|hybrid|mild[- ]hybrid|plug[- ]in|phev|mhev|hev|full[- ]hybrid)\b/i },
  { key: 'gpl', label: 'GPL', regex: /\b(gpl|lpg|bifuel|bi-fuel|easypower|eco-g)\b/i },
  { key: 'metano', label: 'Metano', regex: /\b(metano|cng|natural power|g-tron|tgi)\b/i },
  { key: 'elettrica', label: 'Elettrica', regex: /\b(elettric[ao]|bev|full electric|100% elettrica|kwh)\b/i },
];

function cleanNumber(str: string): number {
  return parseInt(str.replace(/[^\d]/g, ''), 10);
}

function detectSource(urlStr: string): string {
  const lower = urlStr.toLowerCase();
  if (lower.includes('autoscout24')) return 'AutoScout24';
  if (lower.includes('subito')) return 'Subito.it';
  if (lower.includes('autohero')) return 'Autohero';
  if (lower.includes('brumbrum')) return 'Brumbrum';
  if (lower.includes('facebook.com/marketplace')) return 'Facebook Marketplace';
  if (lower.includes('automobile.it')) return 'Automobile.it';
  if (lower.includes('carvago')) return 'Carvago';
  return 'Annuncio Web';
}

function extractFromTextOrSlug(text: string): Partial<ExtractedAdInfo> {
  const result: Partial<ExtractedAdInfo> = {};
  const lower = text.toLowerCase();

  // 1. Prezzo (€ / EUR)
  const priceMatches = [
    text.match(/(?:€|eur|euro)\s*(\d{1,3}(?:\.\d{3})+|\d{3,6})\b/i),
    text.match(/\b(\d{1,3}(?:\.\d{3})+|\d{3,6})\s*(?:€|eur|euro)\b/i),
    text.match(/(?:prezzo|price)[:\s="]+(\d{1,3}(?:\.\d{3})+|\d{3,6})/i),
  ];
  for (const m of priceMatches) {
    if (m && m[1]) {
      const p = cleanNumber(m[1]);
      if (p >= 500 && p <= 500000) {
        result.price = p;
        break;
      }
    }
  }

  // 2. Chilometraggio
  const kmMatches = [
    text.match(/(\d{1,3}(?:\.\d{3})+|\d{4,6})\s*(?:km|chilometri|mila km)\b/i),
    text.match(/(?:km|chilometri|chilometraggio|mileage)[:\s="]+(\d{1,3}(?:\.\d{3})+|\d{4,6})/i),
  ];
  for (const m of kmMatches) {
    if (m && m[1]) {
      const k = cleanNumber(m[1]);
      if (k >= 100 && k <= 1000000 && k !== result.year) {
        result.km = k;
        break;
      }
    }
  }

  // 3. Anno (1990 - 2026)
  const yearMatches = [
    text.match(/(?:immatricolazion[ei]|anno|del)[\s:/-]*(\b199\d\b|\b20[0-2]\d\b)/i),
    text.match(/\b(199\d|20[0-2]\d)\b/),
  ];
  for (const m of yearMatches) {
    if (m && m[1]) {
      const y = parseInt(m[1], 10);
      if (y >= 1990 && y <= 2026) {
        result.year = y;
        break;
      }
    }
  }

  // 4. Carburante
  for (const f of FUELS) {
    if (f.regex.test(text)) {
      result.fuel = f.label;
      break;
    }
  }

  // 5. Cambio
  if (/\b(automatic[ao]|dsg|steptronic|tiptronic|s-tronic|edc|eat8|cvt)\b/i.test(text)) {
    result.transmission = 'Automatico';
  } else if (/\b(manual[ei])\b/i.test(text)) {
    result.transmission = 'Manuale';
  }

  // 6. Cavalli (CV)
  const cvMatch = text.match(/(\d{2,3})\s*(?:cv|cavall[io]|hp)\b/i);
  if (cvMatch && cvMatch[1]) {
    result.powerCv = parseInt(cvMatch[1], 10);
  }

  // 7. Marca e Modello con Catalogo
  for (const brand of allBrands) {
    const brandLower = brand.toLowerCase();
    const brandRegex = new RegExp(`(^|[^a-z0-9])${brandLower.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}([^a-z0-9]|$)`, 'i');
    
    if (brandRegex.test(lower) || lower.includes(brandLower)) {
      result.make = brand;
      const models = rawCatalog.brands[brand] || [];
      const sortedModels = models.slice().sort((a, b) => b.length - a.length);

      for (const mod of sortedModels) {
        const modLower = mod.toLowerCase();
        const modRegex = new RegExp(`(^|[^a-z0-9])${modLower.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}([^a-z0-9]|$)`, 'i');
        if (modRegex.test(lower) || lower.includes(modLower)) {
          result.model = mod;
          break;
        }
      }
      break;
    }
  }

  return result;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const inputUrl = (body.url || body.text || '').trim();

    if (!inputUrl) {
      return NextResponse.json({ success: false, error: 'Nessun link o testo fornito' }, { status: 400 });
    }

    const info: ExtractedAdInfo = { rawText: inputUrl };
    const isUrl = /^https?:\/\//i.test(inputUrl);

    if (isUrl) {
      info.source = detectSource(inputUrl);

      // Parse preliminare dall'URL slug (es. /auto/fiat-500-1-2-lounge...)
      try {
        const parsedUrl = new URL(inputUrl);
        const slugText = decodeURIComponent(`${parsedUrl.pathname} ${parsedUrl.search}`).replace(/[-_/]/g, ' ');
        const slugData = extractFromTextOrSlug(slugText);
        Object.assign(info, slugData);
      } catch {
        /* ignore */
      }

      // Fetch effettivo della pagina web
      try {
        const response = await fetch(inputUrl, {
          signal: AbortSignal.timeout(8500),
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            Accept:
              'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7',
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
          },
        });

        if (response.ok) {
          const html = await response.text();

          // 1. JSON-LD parsing (il metodo più accurato usato da AutoScout24, Subito, Autohero)
          const jsonLdMatches = html.match(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
          if (jsonLdMatches) {
            for (const scriptTag of jsonLdMatches) {
              const content = scriptTag.replace(/<script\b[^>]*>|<\/script>/gi, '').trim();
              try {
                const parsed = JSON.parse(content);
                const items = Array.isArray(parsed) ? parsed : [parsed];

                for (const item of items) {
                  // Cerca oggetti Car, Vehicle, Product, IndividualProduct
                  const type = String(item['@type'] || '');
                  if (/Car|Vehicle|Product|IndividualProduct|Offer/i.test(type)) {
                    const brandVal = typeof item.brand === 'object' ? item.brand?.name : item.brand;
                    if (brandVal && !info.make) info.make = String(brandVal);
                    if (item.model && !info.model) info.model = String(item.model);
                    if (item.name && (!info.title || info.title.length < item.name.length)) info.title = String(item.name);

                    // Chilometraggio
                    if (item.mileageFromOdometer) {
                      const mVal = typeof item.mileageFromOdometer === 'object' ? item.mileageFromOdometer.value : item.mileageFromOdometer;
                      const mNum = parseInt(String(mVal), 10);
                      if (!isNaN(mNum) && mNum > 100) info.km = mNum;
                    }

                    // Anno di produzione / immatricolazione
                    const dateVal = item.productionDate || item.vehicleModelDate || item.dateVehicleFirstRegistered;
                    if (dateVal) {
                      const y = parseInt(String(dateVal).slice(0, 4), 10);
                      if (!isNaN(y) && y >= 1990 && y <= 2026) info.year = y;
                    }

                    // Prezzo
                    const offer = item.offers || item;
                    if (offer && offer.price) {
                      const p = parseInt(String(offer.price).replace(/[^\d]/g, ''), 10);
                      if (!isNaN(p) && p >= 500 && p <= 500000) info.price = p;
                    }

                    // Carburante
                    if (item.fuelType && !info.fuel) {
                      const fStr = String(item.fuelType).toLowerCase();
                      for (const f of FUELS) {
                        if (f.regex.test(fStr)) {
                          info.fuel = f.label;
                          break;
                        }
                      }
                    }

                    // Immagine principale
                    if (item.image) {
                      const img = Array.isArray(item.image) ? item.image[0] : (typeof item.image === 'object' ? item.image.url : item.image);
                      if (img && typeof img === 'string' && /^https?:\/\//i.test(img)) {
                        info.photo = img;
                      }
                    }
                  }
                }
              } catch {
                /* ignore JSON-LD parse errors */
              }
            }
          }

          // 2. __NEXT_DATA__ e __INITIAL_STATE__ (AutoScout24, Subito, Autohero)
          const nextDataMatch = html.match(/<script\b[^>]*id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i);
          if (nextDataMatch) {
            try {
              const nextJson = JSON.parse(nextDataMatch[1]);
              const rawStr = JSON.stringify(nextJson);
              const fromNext = extractFromTextOrSlug(rawStr);
              if (!info.make && fromNext.make) info.make = fromNext.make;
              if (!info.model && fromNext.model) info.model = fromNext.model;
              if (!info.price && fromNext.price) info.price = fromNext.price;
              if (!info.year && fromNext.year) info.year = fromNext.year;
              if (!info.km && fromNext.km) info.km = fromNext.km;
              if (!info.fuel && fromNext.fuel) info.fuel = fromNext.fuel;
            } catch {
              /* ignore */
            }
          }

          const initialStateMatch = html.match(/window\.__INITIAL_STATE__\s*=\s*(\{[\s\S]*?\});/i);
          if (initialStateMatch) {
            try {
              const stateJson = JSON.parse(initialStateMatch[1]);
              const stateStr = JSON.stringify(stateJson);
              const fromState = extractFromTextOrSlug(stateStr);
              if (!info.make && fromState.make) info.make = fromState.make;
              if (!info.model && fromState.model) info.model = fromState.model;
              if (!info.price && fromState.price) info.price = fromState.price;
              if (!info.year && fromState.year) info.year = fromState.year;
              if (!info.km && fromState.km) info.km = fromState.km;
              if (!info.fuel && fromState.fuel) info.fuel = fromState.fuel;
            } catch {
              /* ignore */
            }
          }

          // 2. OpenGraph Meta Tags (og:title, og:description, og:image)
          const ogTitle = html.match(/<meta\b[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i)?.[1];
          const ogDesc = html.match(/<meta\b[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i)?.[1];
          const ogImg = html.match(/<meta\b[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)?.[1];

          if (ogTitle) {
            info.title = info.title || ogTitle;
            const fromOg = extractFromTextOrSlug(ogTitle);
            if (!info.make && fromOg.make) info.make = fromOg.make;
            if (!info.model && fromOg.model) info.model = fromOg.model;
            if (!info.price && fromOg.price) info.price = fromOg.price;
            if (!info.year && fromOg.year) info.year = fromOg.year;
            if (!info.km && fromOg.km) info.km = fromOg.km;
            if (!info.fuel && fromOg.fuel) info.fuel = fromOg.fuel;
          }

          if (ogDesc) {
            const fromDesc = extractFromTextOrSlug(ogDesc);
            if (!info.price && fromDesc.price) info.price = fromDesc.price;
            if (!info.km && fromDesc.km) info.km = fromDesc.km;
            if (!info.year && fromDesc.year) info.year = fromDesc.year;
            if (!info.fuel && fromDesc.fuel) info.fuel = fromDesc.fuel;
          }

          if (ogImg && /^https?:\/\//i.test(ogImg) && !info.photo) {
            info.photo = ogImg;
          }

          // 3. Regex sui blocchi di testo dell'HTML per eventuali dati mancanti
          const bodyTextMatches = extractFromTextOrSlug(html.slice(0, 150000));
          if (!info.price && bodyTextMatches.price) info.price = bodyTextMatches.price;
          if (!info.km && bodyTextMatches.km) info.km = bodyTextMatches.km;
          if (!info.year && bodyTextMatches.year) info.year = bodyTextMatches.year;
          if (!info.fuel && bodyTextMatches.fuel) info.fuel = bodyTextMatches.fuel;
          if (!info.transmission && bodyTextMatches.transmission) info.transmission = bodyTextMatches.transmission;
          if (!info.make && bodyTextMatches.make) info.make = bodyTextMatches.make;
          if (!info.model && bodyTextMatches.model) info.model = bodyTextMatches.model;
        }
      } catch (fetchErr) {
        console.warn('Scraping annuncio via fetch non riuscito (eseguo fallback su slug):', fetchErr);
      }
    } else {
      // Se l'utente ha incollato il testo dell'annuncio
      const fromText = extractFromTextOrSlug(inputUrl);
      Object.assign(info, fromText);
      info.source = 'Testo Annuncio';
    }

    // Perfeziona la versione (allestimento) dal titolo o slug se presente
    if (info.make && info.model && info.title) {
      const cleanTitle = info.title
        .replace(new RegExp(info.make, 'gi'), '')
        .replace(new RegExp(info.model, 'gi'), '')
        .replace(/usat[ao]|in vendita|prezzo|€|eur|\d+\s*km|\b(199\d|20[0-2]\d)\b/gi, '')
        .replace(/[-|—]/g, ' ')
        .trim();
      if (cleanTitle.length > 2 && cleanTitle.length < 50) {
        info.version = cleanTitle;
      }
    }

    return NextResponse.json({
      success: true,
      data: info,
    });
  } catch (error) {
    console.error('Errore API parse-ad:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Impossibile elaborare il link o il testo dell\'annuncio',
      },
      { status: 500 }
    );
  }
}
