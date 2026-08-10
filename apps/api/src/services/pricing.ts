import type { VehicleData } from '@autoesperto/types';

/**
 * Prezzo di listino indicativo (€) per i modelli più diffusi, usato come base
 * della stima. Le chiavi sono normalizzate: marca e modello in minuscolo
 * senza accenti (es. "volkswagen golf"). Il match avviene per prefisso, così
 * "Volkswagen Golf 1.6 TDI" ricade su "volkswagen golf".
 */
const MODEL_PRICE: Record<string, number> = {
  // Fiat
  'fiat panda': 16500, 'fiat 500': 19500, 'fiat 500x': 25500, 'fiat 500l': 24500,
  'fiat tipo': 21000, 'fiat punto': 17500, 'fiat 600': 23000, 'fiat bravo': 22500,
  'fiat doblo': 25000, 'fiat freemont': 32000, 'fiat ducato': 35000, 'fiat sedici': 24000,
  'fiat multipla': 18000, 'fiat 124': 30000, 'fiat panda 4x4': 19000,
  // Lancia
  'lancia ypsilon': 19000, 'lancia delta': 24000, 'lancia thema': 30000, 'lancia voyager': 40000,
  // Alfa Romeo
  'alfa romeo giulietta': 26000, 'alfa romeo giulia': 55000, 'alfa romeo stelvio': 62000,
  'alfa romeo tonale': 42000, 'alfa romeo mito': 17500, 'alfa romeo 147': 22000,
  'alfa romeo 159': 26000, 'alfa romeo 4c': 60000, 'alfa romeo giulietta veloce': 34000,
  // Volkswagen
  'volkswagen golf': 33000, 'volkswagen polo': 22500, 'volkswagen t-roc': 36000,
  'volkswagen tiguan': 45000, 'volkswagen passat': 48000, 'volkswagen touran': 40000,
  'volkswagen up': 16500, 'volkswagen arteon': 55000, 'volkswagen taigo': 28000,
  'volkswagen id.3': 41000, 'volkswagen id.4': 46000, 'volkswagen id.5': 52000,
  'volkswagen scirocco': 36000, 'volkswagen jetta': 31000, 'volkswagen beetle': 28000,
  'volkswagen touareg': 75000, 'volkswagen sharan': 43000, 'volkswagen t-cross': 27000,
  'volkswagen golf sportsvan': 30000, 'volkswagen e-golf': 36000, 'volkswagen california': 65000,
  // Audi
  'audi a1': 27000, 'audi a3': 38000, 'audi a4': 50000, 'audi a5': 56000, 'audi a6': 63000,
  'audi a7': 75000, 'audi a8': 95000, 'audi q2': 32500, 'audi q3': 43000, 'audi q5': 58000,
  'audi q7': 76000, 'audi q8': 92000, 'audi tt': 55000, 'audi e-tron': 76000, 'audi a2': 25000,
  // BMW
  'bmw serie 1': 38000, 'bmw serie 2': 45000, 'bmw serie 3': 53000, 'bmw serie 4': 58000,
  'bmw serie 5': 68000, 'bmw serie 6': 76000, 'bmw serie 7': 105000, 'bmw serie 8': 115000,
  'bmw x1': 45000, 'bmw x2': 46000, 'bmw x3': 59000, 'bmw x4': 66000, 'bmw x5': 86000,
  'bmw x6': 96000, 'bmw x7': 115000, 'bmw z4': 62000, 'bmw i3': 40000, 'bmw i4': 60000,
  'bmw i5': 75000, 'bmw ix': 85000, 'bmw mini': 28000,
  // Mercedes
  'mercedes classe a': 39000, 'mercedes classe b': 40000, 'mercedes classe c': 57000,
  'mercedes classe e': 68000, 'mercedes classe s': 115000, 'mercedes gla': 45000,
  'mercedes glb': 48000, 'mercedes glc': 63000, 'mercedes gle': 86000, 'mercedes gls': 105000,
  'mercedes cls': 90000, 'mercedes slk': 55000, 'mercedes slc': 55000, 'mercedes classe v': 65000,
  'mercedes eqa': 48000, 'mercedes eqb': 52000, 'mercedes eqc': 61000, 'mercedes amg gt': 110000,
  'mercedes classe t': 36000, 'mercedes sprinter': 50000, 'mercedes g': 130000, 'mercedes g wagen': 130000,
  // Ford
  'ford fiesta': 19000, 'ford focus': 29000, 'ford puma': 33500, 'ford kuga': 32000,
  'ford mondeo': 45000, 'ford cmax': 30000, 'ford galaxy': 43000, 'ford ka': 15500,
  'ford ecosport': 23500, 'ford edge': 50000, 'ford mustang': 56000, 'ford s-max': 40000,
  'ford ranger': 43000, 'ford tourneo': 40000, 'ford transit': 40000, 'ford capri': 42000,
  'ford explorer': 70000, 'ford escort': 20000, 'ford fiesta st': 30000, 'ford focus rs': 45000,
  // Opel
  'opel corsa': 19000, 'opel astra': 29500, 'opel mokka': 29000, 'opel grandland': 38000,
  'opel insignia': 40000, 'opel adam': 16500, 'opel crossland': 27000, 'opel zafira': 34000,
  'opel meriva': 22000, 'opel corsa-e': 35000, 'opel vectra': 30000, 'opel combo': 28000,
  'opel vivaro': 35000, 'opel antara': 30000, 'opel frontera': 24000,
  // Peugeot
  'peugeot 208': 22000, 'peugeot 308': 30000, 'peugeot 2008': 30000, 'peugeot 3008': 40500,
  'peugeot 5008': 45000, 'peugeot 508': 46000, 'peugeot 108': 16000, 'peugeot 206': 17500,
  'peugeot 207': 18500, 'peugeot 301': 19000, 'peugeot 407': 35000, 'peugeot 607': 40000,
  'peugeot rcz': 40000, 'peugeot e-208': 36000, 'peugeot e-2008': 40000, 'peugeot expert': 35000,
  'peugeot 1007': 15000, 'peugeot 405': 15000, 'peugeot 406': 25000, 'peugeot 307': 21000,
  'peugeot 308 sw': 32000, 'peugeot 408': 38000,
  // Citroen
  'citroen c3': 19500, 'citroen c4': 28000, 'citroen c5': 38000, 'citroen c3 aircross': 26000,
  'citroen c4 cactus': 24000, 'citroen c5 aircross': 37000, 'citroen c1': 15500, 'citroen c2': 17500,
  'citroen grand c4 space tourer': 35000, 'citroen c4 picasso': 33000, 'citroen jumpy': 32000,
  'citroen berlingo': 27000, 'citroen ds3': 21000, 'citroen ds4': 30000, 'citroen ds5': 36000,
  'citroen c4x': 32000, 'citroen c3 picasso': 20000, 'citroen c6': 38000, 'citroen c8': 35000,
  // Renault
  'renault clio': 19000, 'renault captur': 28500, 'renault megane': 30000, 'renault scenic': 38000,
  'renault kadjar': 36000, 'renault twingo': 16500, 'renault zoe': 30000, 'renault arkana': 33000,
  'renault austral': 37000, 'renault espace': 45000, 'renault koleos': 40000, 'renault modus': 17000,
  'renault talisman': 43000, 'renault clio rs': 30000, 'renault megane rs': 42000, 'renault laguna': 33000,
  'renault scenic 4': 30000, 'renault twizy': 9000, 'renault 5': 33000, 'renault trafic': 35000,
  'renault kangoo': 24000, 'renault master': 35000, 'renault symbioz': 33000, 'renault rafale': 45000,
  // Dacia
  'dacia sandero': 14500, 'dacia duster': 21500, 'dacia logan': 15000, 'dacia jogger': 19000,
  'dacia spring': 19000, 'dacia dokker': 17000, 'dacia lodgy': 19000, 'dacia sandero stepway': 15500,
  // Toyota
  'toyota yaris': 23500, 'toyota corolla': 34500, 'toyota chr': 37000, 'toyota rav4': 49000,
  'toyota aygo': 16000, 'toyota camry': 50000, 'toyota avensis': 38000, 'toyota auris': 28000,
  'toyota hilux': 45000, 'toyota gt86': 33000, 'toyota proace': 38000, 'toyota yaris cross': 31000,
  'toyota land cruiser': 65000, 'toyota prius': 38000, 'toyota c-hr': 37000, 'toyota urban cruiser': 18000,
  'toyota iq': 14000, 'toyota aygo x': 17000, 'toyota bz4x': 47000, 'toyota corolla cross': 42000,
  'toyota highlander': 60000, 'toyota rav4 hybrid': 50000,
  // Nissan
  'nissan qashqai': 37500, 'nissan juke': 28500, 'nissan micra': 18500, 'nissan leaf': 33000,
  'nissan x-trail': 43000, 'nissan pulsar': 22000, 'nissan note': 19000, 'nissan patrol': 85000,
  'nissan gtr': 120000, 'nissan 370z': 50000, 'nissan townstar': 25000, 'nissan qashqai+2': 30000,
  'nissan juke nismo': 30000, 'nissan qashqai e-power': 40000, 'nissan ariya': 48000, 'nissan almera': 22000,
  'nissan primastar': 30000, 'nissan murano': 55000, 'nissan navara': 42000,
  // Kia
  'kia rio': 19500, 'kia ceed': 27500, 'kia sportage': 39000, 'kia picanto': 16500, 'kia stonic': 23500,
  'kia niro': 35000, 'kia stinger': 55000, 'kia soul': 26000, 'kia ev6': 51000, 'kia pro_ceed': 30000,
  'kia sorento': 50000, 'kia carnival': 40000, 'kia xceed': 32000, 'kia ev9': 75000, 'kia venga': 20000,
  'kia ceed sw': 29000, 'kia optima': 42000, 'kia sportage gt': 45000, 'kia niro ev': 40000,
  // Hyundai
  'hyundai i10': 16500, 'hyundai i20': 18500, 'hyundai i30': 28000, 'hyundai tucson': 41000,
  'hyundai kona': 34500, 'hyundai bayon': 25000, 'hyundai santa fe': 52000, 'hyundai ix20': 22000,
  'hyundai veloster': 30000, 'hyundai ioniq': 40000, 'hyundai i40': 33000, 'hyundai getz': 14500,
  'hyundai i30 fastback': 30000, 'hyundai ioniq 5': 50000, 'hyundai ioniq 6': 52000, 'hyundai i20 n': 28000,
  'hyundai i30 n': 38000, 'hyundai matrix': 18000, 'hyundai terracan': 30000, 'hyundai ix35': 28000,
  'hyundai kona electric': 40000,
  // Seat
  'seat ibiza': 19500, 'seat leon': 30500, 'seat arona': 26500, 'seat ateca': 37500, 'seat toledo': 22000,
  'seat alhambra': 38000, 'seat mi': 15000, 'seat tarraco': 40000, 'seat cordoba': 18000,
  'seat leon cupra': 38000, 'seat altea': 24000, 'seat ibiza st': 22000, 'seat leon st': 32000,
  'seat cupra': 38000, 'seat terraco': 40000, 'seat malaga': 15000,
  // Skoda
  'skoda fabia': 20000, 'skoda octavia': 34500, 'skoda kamiq': 29500, 'skoda karoq': 37500,
  'skoda kodiaq': 45000, 'skoda superb': 45000, 'skoda scala': 26000, 'skoda citigo': 16000,
  'skoda yeti': 30000, 'skoda rapid': 22000, 'skoda enyaq': 46000, 'skoda octavia scout': 38000,
  'skoda superb combi': 48000, 'skoda felicia': 15000, 'skoda roomster': 22000, 'skoda fabia rs': 25000,
  'skoda elroq': 40000,
  // Mazda
  'mazda 2': 19500, 'mazda 3': 31500, 'mazda 6': 38000, 'mazda cx-3': 27000, 'mazda cx-5': 40000,
  'mazda cx-30': 32000, 'mazda mx-5': 35000, 'mazda cx-7': 35000, 'mazda cx-9': 55000, 'mazda bt-50': 40000,
  'mazda cx-60': 52000, 'mazda cx-80': 60000, 'mazda mx-30': 38000, 'mazda 323': 15000, 'mazda 626': 22000,
  // Suzuki
  'suzuki swift': 18000, 'suzuki vitara': 28000, 'suzuki jimny': 28500, 'suzuki ignis': 18500,
  'suzuki sx4': 25000, 'suzuki baleno': 18000, 'suzuki celerio': 15500, 'suzuki across': 45000,
  'suzuki grand vitara': 30000, 'suzuki swift sport': 24000, 'suzuki alto': 14000, 'suzuki liana': 18000,
  'suzuki samurai': 15000, 'suzuki swace': 32000,
  // Honda
  'honda jazz': 23000, 'honda civic': 34500, 'honda crv': 48000, 'honda hr-v': 32000, 'honda accord': 45000,
  'honda city': 22000, 'honda insight': 35000, 'honda crz': 28000, 'honda nsx': 150000, 'honda e': 35000,
  'honda civic type r': 50000, 'honda jazz crosstar': 26000, 'honda crv hybrid': 52000, 'honda prelude': 40000,
  'honda integra': 35000, 'honda legend': 60000, 'honda s2000': 40000,
  // Mini
  'mini cooper': 28500, 'mini clubman': 35000, 'mini countryman': 38000, 'mini paceman': 33000,
  'mini cabrio': 30000, 'mini john cooper': 33000, 'mini one': 24000, 'mini aceman': 40000,
  'mini cooper s': 33000, 'mini countryman plug-in': 45000,
  // Volvo
  'volvo xc40': 46000, 'volvo xc60': 59000, 'volvo xc90': 80000, 'volvo s60': 55000, 'volvo s90': 65000,
  'volvo v40': 35000, 'volvo v60': 50000, 'volvo v90': 60000, 'volvo c30': 28000, 'volvo c40': 50000,
  'volvo ex30': 42000, 'volvo s40': 32000, 'volvo s80': 55000, 'volvo v50': 33000, 'volvo v70': 45000,
  'volvo xc70': 52000,
  // Land Rover
  'land rover evoque': 48000, 'land rover discovery sport': 52000, 'land rover freelander': 38000,
  'land rover discovery': 75000, 'land rover range rover': 120000, 'land rover range rover sport': 110000,
  'land rover defender': 80000, 'land rover velar': 75000, 'land rover range rover evoque': 48000,
  // Jaguar
  'jaguar xe': 50000, 'jaguar xf': 60000, 'jaguar xj': 80000, 'jaguar f-pace': 60000, 'jaguar e-pace': 48000,
  'jaguar f-type': 80000, 'jaguar xk': 90000, 'jaguar i-pace': 70000, 'jaguar x-type': 30000,
  // Tesla
  'tesla model 3': 45000, 'tesla model y': 48000, 'tesla model s': 95000, 'tesla model x': 110000,
  // Jeep
  'jeep renegade': 27000, 'jeep compass': 41000, 'jeep cherokee': 45000, 'jeep wrangler': 60000,
  'jeep grand cherokee': 75000, 'jeep avenger': 31000, 'jeep renegade 4xe': 40000, 'jeep patriot': 22000,
  'jeep compass 4xe': 45000, 'jeep grand cherokee l': 90000, 'jeep gladiator': 70000,
  // Lexus
  'lexus ct': 30000, 'lexus is': 45000, 'lexus es': 55000, 'lexus nx': 50000, 'lexus rx': 65000,
  'lexus ux': 42000, 'lexus lc': 95000, 'lexus ls': 100000, 'lexus gs': 60000, 'lexus nx 450h': 55000,
  // Porsche
  'porsche 911': 120000, 'porsche cayenne': 90000, 'porsche macan': 80000, 'porsche panamera': 100000,
  'porsche taycan': 90000, 'porsche boxster': 70000, 'porsche cayman': 75000, 'porsche 718': 75000,
  'porsche 911 turbo': 200000, 'porsche 911 carrera': 130000,
  // Smart
  'smart fortwo': 25000, 'smart forfour': 27000, 'smart fortwo cabrio': 28000, 'smart #1': 42000,
  'smart #3': 45000, 'smart roadster': 25000,
  // Subaru
  'subaru impreza': 35000, 'subaru outback': 45000, 'subaru forester': 40000, 'subaru xv': 32000,
  'subaru brz': 38000, 'subaru legacy': 45000, 'subaru levorg': 45000, 'subaru tribeca': 45000,
  'subaru justy': 16000, 'subaru svx': 30000,
  // Mitsubishi
  'mitsubishi space star': 18000, 'mitsubishi asx': 26000, 'mitsubishi outlander': 38000,
  'mitsubishi colt': 20000, 'mitsubishi eclipse cross': 32000, 'mitsubishi l200': 40000,
  'mitsubishi pajero': 60000, 'mitsubishi lancer': 25000, 'mitsubishi i-miev': 30000, 'mitsubishi carisma': 20000,
  // Altre premium
  'maserati ghibli': 80000, 'maserati levante': 95000, 'maserati quattroporte': 110000, 'maserati grancabrio': 120000,
  'maserati granturismo': 130000, 'maserati grecale': 85000, 'maserati mc20': 200000,
  'ferrari 488': 220000, 'ferrari 812': 340000, 'ferrari portofino': 200000, 'ferrari roma': 220000,
  'ferrari f8': 240000, 'ferrari 458': 220000, 'ferrari california': 200000, 'ferrari 430': 160000,
  'lamborghini huracan': 220000, 'lamborghini gallardo': 180000, 'lamborghini urus': 230000,
  'lamborghini aventador': 350000, 'lamborghini murcielago': 250000,
  'bentley continental': 200000, 'bentley bentayga': 210000, 'bentley flying spur': 220000,
  'rolls royce phantom': 400000, 'rolls royce ghost': 350000, 'rolls royce cullinan': 380000,
};

/**
 * Base di partenza (€) per i marchi senza prezzo per modello specifico.
 * Valore realistico del listino medio di una vettura nuova del marchio.
 */
const BRAND_BASE: Record<string, number> = {
  ferrari: 250000, lamborghini: 300000, bentley: 250000, rolls: 350000, porsche: 75000,
  maserati: 70000, mclaren: 250000, aston: 180000, lotus: 90000, tesla: 46000,
  audi: 48000, bmw: 43000, mercedes: 44000, lexus: 45000, jaguar: 50000, land: 60000,
  volvo: 38000, alfa: 38000, mini: 27000, jeep: 33000, lancia: 20000, smart: 26000,
  subaru: 31000, mitsubishi: 28000, suzuki: 23000, honda: 28000, mazda: 28000,
  toyota: 29000, nissan: 27000, kia: 26000, hyundai: 26500, seat: 25000, skoda: 26000,
  volkswagen: 30000, vw: 30000, renault: 25000, peugeot: 26000, citroen: 25000,
  opel: 25000, ford: 27000, fiat: 21000,   dacia: 16000, dodge: 55000, chrysler: 45000,
  chevrolet: 45000, dr: 22000, aito: 30000, byd: 30000,
  mg: 28000, xiaomi: 40000, polestar: 55000, lixiang: 50000, zeekr: 50000, leapmotor: 30000,
  jaecoo: 35000, omoda: 32000, dfsk: 25000, baic: 28000, ebro: 30000, cupra: 38000,
  ds: 32000, iveco: 40000, piaggio: 15000, austin: 25000, morris: 20000, rover: 25000,
  lada: 18000,
};

const BODY_ADJUSTMENT: Record<string, number> = {
  suv: 4500, crossover: 2500, fuoristrada: 4000, station: 2000, cabrio: 2500, spider: 1500,
  coupé: 2500, monovolume: 2000,
};

/** Residuo percentuale (0..1) rispetto al prezzo nuovo, per età in anni. */
const DEPRECIATION_CURVE: Array<[number, number]> = [
  [0, 1.0], [1, 0.82], [2, 0.74], [3, 0.67], [4, 0.63], [5, 0.58], [6, 0.56], [7, 0.51],
  [8, 0.46], [9, 0.42], [10, 0.38], [11, 0.35], [12, 0.32], [13, 0.30], [14, 0.28], [15, 0.26],
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ');
}

function normalizeMake(make: string): string {
  const m = normalize(make);
  if (m === 'vw') return 'volkswagen';
  if (m.startsWith('alfa')) return 'alfa romeo';
  if (m.startsWith('mercedes') || m === 'mb' || m === 'benz') return 'mercedes';
  if (m.startsWith('land')) return 'land rover';
  if (m.startsWith('rolls')) return 'rolls royce';
  if (m.startsWith('volks') || m.startsWith('vokswagen')) return 'volkswagen';
  if (m === 'lancia') return 'lancia';
  return m;
}

function findModelPrice(make: string, model: string): number | undefined {
  const makeNorm = normalizeMake(make);
  const modelNorm = normalize(model);
  const key = `${makeNorm} ${modelNorm}`;

  let best: number | undefined;
  let bestLength = 0;
  for (const [candidate, price] of Object.entries(MODEL_PRICE)) {
    const norm = normalize(candidate);
    if (key.startsWith(norm) && norm.length > bestLength) {
      best = price;
      bestLength = norm.length;
    }
  }
  return best;
}

function findBrandBase(make: string): number {
  const makeNorm = normalizeMake(make);
  const key = Object.keys(BRAND_BASE).find(k => makeNorm.startsWith(k));
  return key ? BRAND_BASE[key] : 24000;
}

function getBodyAdjust(body: string): number {
  if (!body) return 0;
  const b = normalize(body);
  const key = Object.keys(BODY_ADJUSTMENT).find(k => b.includes(k));
  return key ? BODY_ADJUSTMENT[key] : 0;
}

/** Fattore di segmento: le utilitarie tengono il valore, le ammiraglie lo perdono. */
function getSegmentFactor(basePrice: number): number {
  if (basePrice <= 18000) return 1.15;
  if (basePrice <= 25000) return 1.06;
  if (basePrice >= 90000) return 0.87;
  if (basePrice >= 60000) return 0.92;
  return 1.0;
}

/** Fattore alimentazione: ibrida/elettrica tengono di più da nuove, i diesel vecchi perdono di più. */
function getFuelFactor(fuel: string, age: number): number {
  const f = normalize(fuel);
  if (f.includes('diesel') || f.includes('tdi')) return age > 10 ? 0.88 : 1.0;
  if (f.includes('ibrid') || f.includes('hybrid')) return f.includes('mild') ? 1.0 : age <= 6 ? 1.06 : 0.98;
  if (f.includes('elettr') || f.includes(' ev') || f === 'ev') return age <= 4 ? 1.08 : 0.9;
  if (f.includes('gpl') || f.includes('metano')) return 0.95;
  return 1.0;
}

function getResidual(age: number): number {
  const clamped = Math.max(0, age);
  if (clamped >= 15) return Math.max(0.12, 0.26 - (clamped - 15) * 0.015);
  let residual = DEPRECIATION_CURVE[0][1];
  for (const [ageAt, value] of DEPRECIATION_CURVE) {
    if (ageAt <= clamped) residual = value;
    else break;
  }
  return residual;
}

/**
 * Le auto di lusso/sportive (sopra i 100k da nuove) tengono molto più del
 * valore: niente svalutazione sotto il 55% nei primi 10 anni.
 */
const COLLECTIBLE_MAKES = ['porsche', 'ferrari', 'lamborghini', 'bentley', 'rolls', 'aston', 'mclaren'];

function getCollectibleFloor(basePrice: number, make: string, age: number): number {
  if (basePrice < 100000) return 0;
  if (!COLLECTIBLE_MAKES.some(k => normalizeMake(make).startsWith(k))) return 0;
  if (age <= 10) return 0.55;
  return Math.max(0.35, 0.55 - (age - 10) * 0.02);
}

export function estimateMarketValue(vehicle: VehicleData): { value: number; min: number; max: number } {
  const year = vehicle.year || 2020;
  const power = parseInt((vehicle.power || '').replace(/\D/g, '')) || 100;
  const fuel = vehicle.fuel || '';
  const body = vehicle.body || '';

  // Con un prezzo per modello la carrozzeria è già inclusa: l'aggiustamento
  // body/fuel si applica solo al fallback sul marchio.
  const modelPrice = findModelPrice(vehicle.make, vehicle.model);
  const base = modelPrice ?? findBrandBase(vehicle.make) + getBodyAdjust(body);

  const currentYear = new Date().getFullYear();
  const age = Math.max(0, currentYear - year);

  let residual = getResidual(age);
  residual *= getSegmentFactor(base);
  residual *= getFuelFactor(fuel, age);
  residual = Math.max(residual, getCollectibleFloor(base, vehicle.make, age));

  const powerFactor = 1 + (Math.min(power, 300) - 100) * 0.0015;
  let value = Math.round(base * residual * powerFactor / 100) * 100;
  value = Math.max(1500, value);

  const range = Math.round(value * 0.1 / 100) * 100;
  return { value, min: value - range, max: value + range };
}

export function estimateMarketValueWithKm(vehicle: VehicleData, km: number): {
  value: number; min: number; max: number;
  adjustedForKm: number; kmAdjustment: number;
} {
  const base = estimateMarketValue(vehicle);
  const kmFactor = Math.min(1.1, Math.max(0.65, 1 - (km - 50000) / 250000));
  const adjustedForKm = Math.round(base.value * kmFactor / 100) * 100;
  return {
    ...base,
    adjustedForKm,
    kmAdjustment: Math.round(base.value * (1 - kmFactor)),
  };
}
