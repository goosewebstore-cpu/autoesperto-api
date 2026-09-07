/**
 * AutoEsperto Vehicle Image Resolver
 * Accurately resolves high-definition, model-specific vehicle photos
 * ensuring cars (like Alfa Romeo MiTo, Fiat Panda, VW Golf, etc.)
 * NEVER fall back indiscriminately to a generic BMW.
 */

// Model-specific curated photos
const MODEL_IMAGE_MAP: Record<string, string> = {
  // Alfa Romeo
  'alfa-romeo:mito': '/images/cars/alfa-romeo-mito.jpg',
  'alfa:mito': '/images/cars/alfa-romeo-mito.jpg',
  'alfa-romeo:giulietta': '/images/cars/alfa-romeo-giulietta.jpg',
  'alfa:giulietta': '/images/cars/alfa-romeo-giulietta.jpg',
  'alfa-romeo:giulia': '/images/cars/alfa-romeo-giulia.jpg',
  'alfa:giulia': '/images/cars/alfa-romeo-giulia.jpg',
  'alfa-romeo:stelvio': '/images/cars/alfa-romeo-stelvio.jpg',
  'alfa:stelvio': '/images/cars/alfa-romeo-stelvio.jpg',
  'alfa-romeo:tonale': '/images/cars/alfa-romeo-stelvio.jpg',

  // Fiat
  'fiat:panda': '/images/cars/fiat-panda.jpg',
  'fiat:500': '/images/cars/fiat-500.jpg',
  'fiat:500 hybrid': '/images/cars/fiat-500.jpg',
  'fiat:500e': '/images/cars/fiat-500.jpg',
  'fiat:500x': '/images/cars/fiat-500.jpg',
  'fiat:500l': '/images/cars/fiat-500.jpg',
  'fiat:tipo': '/images/cars/fiat-tipo.jpg',
  'fiat:punto': '/images/cars/fiat-tipo.jpg',
  'fiat:grande punto': '/images/cars/fiat-tipo.jpg',
  'fiat:punto evo': '/images/cars/fiat-tipo.jpg',
  'fiat:bravo': '/images/cars/fiat-tipo.jpg',

  // Volkswagen
  'volkswagen:golf': '/images/cars/volkswagen-golf.jpg',
  'vw:golf': '/images/cars/volkswagen-golf.jpg',
  'volkswagen:polo': '/images/cars/volkswagen-polo.jpg',
  'vw:polo': '/images/cars/volkswagen-polo.jpg',
  'volkswagen:tiguan': '/images/cars/volkswagen-tiguan.jpg',
  'vw:tiguan': '/images/cars/volkswagen-tiguan.jpg',
  'volkswagen:t-roc': '/images/cars/volkswagen-tiguan.jpg',
  'vw:t-roc': '/images/cars/volkswagen-tiguan.jpg',
  'volkswagen:t-cross': '/images/cars/volkswagen-tiguan.jpg',
  'vw:t-cross': '/images/cars/volkswagen-tiguan.jpg',
  'volkswagen:up': '/images/cars/volkswagen-polo.jpg',
  'volkswagen:up!': '/images/cars/volkswagen-polo.jpg',
  'volkswagen:passat': '/images/cars/volkswagen-golf.jpg',

  // Lancia
  'lancia:ypsilon': '/images/cars/lancia-ypsilon.jpg',
  'lancia:y': '/images/cars/lancia-ypsilon.jpg',
  'lancia:delta': '/images/cars/lancia-ypsilon.jpg',

  // Peugeot
  'peugeot:208': '/images/cars/peugeot-208.jpg',
  'peugeot:e-208': '/images/cars/peugeot-208.jpg',
  'peugeot:2008': '/images/cars/peugeot-208.jpg',
  'peugeot:308': '/images/cars/peugeot-208.jpg',
  'peugeot:3008': '/images/cars/peugeot-208.jpg',
  'peugeot:207': '/images/cars/peugeot-208.jpg',

  // Renault
  'renault:clio': '/images/cars/renault-clio.jpg',
  'renault:captur': '/images/cars/renault-clio.jpg',
  'renault:megane': '/images/cars/renault-clio.jpg',
  'renault:twingo': '/images/cars/renault-clio.jpg',

  // Toyota
  'toyota:yaris': '/images/cars/toyota-yaris.jpg',
  'toyota:yaris cross': '/images/cars/toyota-yaris.jpg',
  'toyota:c-hr': '/images/cars/toyota-c-hr.jpg',
  'toyota:chr': '/images/cars/toyota-c-hr.jpg',
  'toyota:corolla': '/images/cars/toyota-yaris.jpg',
  'toyota:aygo': '/images/cars/toyota-yaris.jpg',
  'toyota:aygo x': '/images/cars/toyota-yaris.jpg',
  'toyota:rav4': '/images/cars/toyota-c-hr.jpg',

  // Jeep
  'jeep:renegade': '/images/cars/jeep-renegade.jpg',
  'jeep:compass': '/images/cars/jeep-renegade.jpg',
  'jeep:avenger': '/images/cars/jeep-renegade.jpg',

  // Dacia
  'dacia:duster': '/images/cars/dacia-duster.jpg',
  'dacia:sandero': '/images/cars/dacia-sandero.jpg',
  'dacia:sandero stepway': '/images/cars/dacia-sandero.jpg',
  'dacia:jogger': '/images/cars/dacia-duster.jpg',

  // Citroën
  'citroen:c3': '/images/cars/citroen-c3.jpg',
  'citroën:c3': '/images/cars/citroen-c3.jpg',
  'citroen:c3 aircross': '/images/cars/citroen-c3.jpg',
  'citroen:c4': '/images/cars/citroen-c3.jpg',
  'citroen:c1': '/images/cars/citroen-c3.jpg',

  // Nissan
  'nissan:qashqai': '/images/cars/nissan-qashqai.jpg',
  'nissan:juke': '/images/cars/nissan-qashqai.jpg',
  'nissan:micra': '/images/cars/nissan-qashqai.jpg',

  // Ford
  'ford:focus': '/images/cars/ford-focus.jpg',
  'ford:fiesta': '/images/cars/ford-focus.jpg',
  'ford:puma': '/images/cars/ford-puma.jpg',
  'ford:kuga': '/images/cars/ford-puma.jpg',

  // Audi
  'audi:a3': '/images/cars/audi-a3.jpg',
  'audi:a3 sportback': '/images/cars/audi-a3.jpg',
  'audi:a1': '/images/cars/audi-a3.jpg',
  'audi:a1 sportback': '/images/cars/audi-a3.jpg',
  'audi:a4': '/images/cars/audi-a3.jpg',
  'audi:q2': '/images/cars/audi-a3.jpg',
  'audi:q3': '/images/cars/audi-a3.jpg',

  // Mercedes
  'mercedes-benz:classe a': '/images/cars/mercedes-classe-a.jpg',
  'mercedes:classe a': '/images/cars/mercedes-classe-a.jpg',
  'mercedes-benz:classe b': '/images/cars/mercedes-classe-a.jpg',
  'mercedes-benz:classe c': '/images/cars/mercedes-classe-a.jpg',
  'mercedes-benz:gla': '/images/cars/mercedes-classe-a.jpg',
  'mercedes-benz:cla': '/images/cars/mercedes-classe-a.jpg',

  // BMW
  'bmw:serie 1': '/images/cars/bmw-serie-1.jpg',
  'bmw:118d': '/images/cars/bmw-serie-1.jpg',
  'bmw:116d': '/images/cars/bmw-serie-1.jpg',
  'bmw:118i': '/images/cars/bmw-serie-1.jpg',
  'bmw:serie 2': '/images/cars/bmw-serie-1.jpg',
  'bmw:serie 3': '/images/cars/bmw-serie-3.jpg',
  'bmw:320d': '/images/cars/bmw-serie-3.jpg',
  'bmw:318d': '/images/cars/bmw-serie-3.jpg',
  'bmw:serie 4': '/images/cars/bmw-serie-3.jpg',
  'bmw:serie 5': '/images/cars/bmw-serie-3.jpg',
  'bmw:x1': '/images/cars/bmw-serie-3.jpg',
  'bmw:x3': '/images/cars/bmw-serie-3.jpg',

  // Honda & Suzuki
  'honda:jazz': '/images/cars/honda-jazz.jpg',
  'honda:civic': '/images/cars/honda-jazz.jpg',
  'suzuki:swift': '/images/cars/suzuki-swift.jpg',
  'suzuki:ignis': '/images/cars/suzuki-swift.jpg',
  'suzuki:vitara': '/images/cars/suzuki-swift.jpg',

  // Smart, Tesla, Mini
  'smart:fortwo': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
  'smart:forfour': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
  'tesla:model 3': 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80',
  'tesla:model y': 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80',
  'mini:cooper': 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80',
  'mini:one': 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80',
  'mini:countryman': 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80',
};

// Brand-level fallbacks (authentic image of that brand)
const BRAND_FALLBACK_MAP: Record<string, string> = {
  'alfa-romeo': '/images/cars/alfa-romeo-giulia.jpg',
  'alfa': '/images/cars/alfa-romeo-giulia.jpg',
  'fiat': '/images/cars/fiat-500.jpg',
  'volkswagen': '/images/cars/volkswagen-golf.jpg',
  'vw': '/images/cars/volkswagen-golf.jpg',
  'audi': '/images/cars/audi-a3.jpg',
  'bmw': '/images/cars/bmw-serie-3.jpg',
  'mercedes': '/images/cars/mercedes-classe-a.jpg',
  'mercedes-benz': '/images/cars/mercedes-classe-a.jpg',
  'lancia': '/images/cars/lancia-ypsilon.jpg',
  'peugeot': '/images/cars/peugeot-208.jpg',
  'renault': '/images/cars/renault-clio.jpg',
  'toyota': '/images/cars/toyota-yaris.jpg',
  'jeep': '/images/cars/jeep-renegade.jpg',
  'dacia': '/images/cars/dacia-duster.jpg',
  'citroen': '/images/cars/citroen-c3.jpg',
  'citroën': '/images/cars/citroen-c3.jpg',
  'nissan': '/images/cars/nissan-qashqai.jpg',
  'ford': '/images/cars/ford-focus.jpg',
  'seat': '/images/cars/volkswagen-golf.jpg',
  'cupra': '/images/cars/volkswagen-golf.jpg',
  'skoda': '/images/cars/volkswagen-golf.jpg',
  'opel': '/images/cars/peugeot-208.jpg',
  'hyundai': '/images/cars/segment-citycar.jpg',
  'kia': '/images/cars/peugeot-208.jpg',
  'suzuki': '/images/cars/suzuki-swift.jpg',
  'honda': '/images/cars/honda-jazz.jpg',
  'tesla': 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80',
  'mini': 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80',
  'smart': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
};

// Segment fallbacks if make is unknown
const SEGMENT_FALLBACK_MAP: Record<string, string> = {
  suv: '/images/cars/segment-suv.jpg',
  crossover: '/images/cars/segment-suv.jpg',
  fuoristrada: '/images/cars/segment-suv.jpg',
  citycar: '/images/cars/segment-citycar.jpg',
  utilitaria: '/images/cars/segment-citycar.jpg',
  compatta: '/images/cars/segment-citycar.jpg',
  berlina: '/images/cars/segment-berlina.jpg',
  stationwagon: '/images/cars/segment-berlina.jpg',
  default: '/images/cars/segment-berlina.jpg',
};

// The old hardcoded BMW URL that was incorrectly displayed on all non-BMW cars
export const OLD_HARDCODED_BMW_URL =
  'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80';

/**
 * Checks if a given image URL is the old default BMW stock photo
 */
export function isOldHardcodedBMWUrl(url?: string): boolean {
  if (!url) return false;
  return url.includes('photo-1555215695-3004980ad54e');
}

/**
 * Normalizes a car string for slug matching
 */
function cleanKey(str?: string): string {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

/**
 * Resolves a model-accurate car photo based on make, model, and body type
 */
export function resolveVehicleImage(make?: string, model?: string, bodyType?: string): string {
  const cleanM = cleanKey(make);
  const cleanMod = cleanKey(model);

  // 1. Direct match in MODEL_IMAGE_MAP
  const fullKey = `${cleanM}:${cleanMod}`;
  if (MODEL_IMAGE_MAP[fullKey]) {
    return MODEL_IMAGE_MAP[fullKey];
  }

  // 2. Loose model matching within the same make
  for (const [key, path] of Object.entries(MODEL_IMAGE_MAP)) {
    const [kMake, kModel] = key.split(':');
    if (kMake === cleanM) {
      if (cleanMod.includes(kModel) || kModel.includes(cleanMod)) {
        return path;
      }
    }
  }

  // 3. Brand-level fallback (authentic photo of that brand)
  if (BRAND_FALLBACK_MAP[cleanM]) {
    return BRAND_FALLBACK_MAP[cleanM];
  }

  // Loose brand matching (e.g. 'alfa romeo' vs 'alfa')
  for (const [bKey, path] of Object.entries(BRAND_FALLBACK_MAP)) {
    if (cleanM.includes(bKey) || bKey.includes(cleanM)) {
      return path;
    }
  }

  // 4. Segment-level fallback
  const cleanBody = cleanKey(bodyType);
  if (cleanBody && SEGMENT_FALLBACK_MAP[cleanBody]) {
    return SEGMENT_FALLBACK_MAP[cleanBody];
  }

  // 5. Safe neutral fallback (never a BMW with BMW badge on other cars!)
  return SEGMENT_FALLBACK_MAP.default;
}

/**
 * Determines the best photo to display for a passport or vehicle object.
 * Preserves genuine user-uploaded photos, but replaces the old BMW fallback on non-BMW vehicles!
 */
export function getVehiclePassportPhoto(item: {
  vehicle?: { make?: string; model?: string; imageUrl?: string; body?: string };
  mainPhoto?: string;
  photos?: Array<{ url: string }>;
}): string {
  const v = item?.vehicle || {};
  const make = v.make || '';
  const model = v.model || '';
  const isBmw = cleanKey(make).includes('bmw');

  // Candidate photo from item
  const candidate =
    item?.mainPhoto ||
    item?.photos?.[0]?.url ||
    v.imageUrl;

  // If candidate is the old hardcoded BMW and this vehicle is NOT a BMW, ignore candidate!
  if (candidate && isOldHardcodedBMWUrl(candidate) && !isBmw) {
    return resolveVehicleImage(make, model, v.body);
  }

  // If we have a valid photo (user photo, uploaded file, or resolved car photo), use it!
  if (candidate && candidate.trim() !== '') {
    return candidate;
  }

  // Otherwise, dynamically resolve the correct make/model photo!
  return resolveVehicleImage(make, model, v.body);
}
