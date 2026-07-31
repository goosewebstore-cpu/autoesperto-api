/**
 * Generates apps/web/src/lib/catalogo.json (marca -> [modelli]).
 * Source: https://github.com/DanielKohut/car-data (car_data.json, CC0/community).
 * Riga: normalizza il naming al mercato italiano (BMW/Mercedes/VW/Mazda),
 * aggiunge i modelli chiave del mercato IT e deduplica.
 *
 * Uso: node scripts/generate-catalogo.js
 */
const fs = require('fs');
const path = require('path');

const SRC_URL = 'https://raw.githubusercontent.com/DanielKohut/car-data/main/car_data.json';
const OUT = path.join(__dirname, '..', 'apps', 'web', 'src', 'lib', 'catalogo.json');

function normalizeModel(brand, raw) {
  let s = raw.trim();

  // BMW: "3 Series - F30/F31" -> "Serie 3"; "X1 - E84" -> "X1"; "Z4 - G29" -> "Z4"
  if (brand === 'BMW') {
    s = s.replace(/^(1|2|3|4|5|6|7|8)\s*Series\b/i, (_, n) => `Serie ${n}`);
    s = s.replace(/^(1|2|3|4|5|6|7|8)\s*Series M\b/i, (_, n) => `Serie ${n} M`);
    s = s.replace(/\s*[-\u2013\u2014]\s*[A-Z]\d+(?:\/[A-Z]\d+)*\s*(\(.*\))?$/, '');
    s = s.replace(/\s*\([A-Z]\d+(?:\/[A-Z]\d+)*\)\s*$/, '');
  }

  // Mercedes: "C-Class" -> "Classe C"; "GLC-Class" -> "Classe GLC"; "V-Class" -> "Classe V"
  if (brand === 'Mercedes-Benz') {
    s = s.replace(/^(AMG GT|GLA|GLB|GLC|GLE|GLS|CLA|CLS|SL|SLC|A|B|C|E|G|S|V|T)-Class\b/i, (_, cls) => `Classe ${cls}`);
  }

  // VW: "Golf VII (Mk7)" -> "Golf"; "Passat B8" -> "Passat"; "Tiguan II" -> "Tiguan"
  if (brand === 'Volkswagen') {
    s = s.replace(/\s*\(Mk\s*\d+\)\s*$/i, '');
    s = s.replace(/^(Golf|Polo|Passat|Tiguan|Touran|Sharan|Jetta|Scirocco|Lupo|Fox|Beetle|Eos|Corrado|Bora|Caddy|Amarok|Phaeton|Crafter|Vento|Taro|Polo)\s*[IVX]+$/i, '$1');
    s = s.replace(/^(Golf|Polo|Passat|Tiguan|Touran|Sharan|Jetta|Scirocco|Lupo|Fox|Beetle|Eos|Corrado|Bora|Caddy|Amarok|Phaeton|Crafter|Vento|Taro|Polo)\s*B\d(\.\d+)?$/i, '$1');
  }

  // Mazda: "Mazda3 Sedan" -> "3 Sedan"; "Mazda CX-30" -> "CX-30"; "Mazda6" -> "6"; "MX-5 Miata" -> "MX-5"
  if (brand === 'Mazda') {
    s = s.replace(/^Mazda\s*/i, '');
    s = s.replace(/^(\d)(.*)$/, 'Mazda $1$2');
    s = s.replace(/MX-5 Miata/i, 'MX-5');
  }

  return s;
}

// Modelli chiave del mercato italiano, garantiti nel catalogo.
const TARGET = {
  Fiat: ['500', '500X', '500L', 'Panda', 'Punto', 'Tipo', '600', 'Doblo', 'Qubo', '124 Spider', 'Bravo'],
  Lancia: ['Ypsilon', 'Delta', 'Musa', 'Y', 'Thema'],
  'Alfa Romeo': ['Giulia', 'Giulietta', 'Stelvio', 'MiTo', '159', '156', '147', 'GT', 'Brera', 'Spider'],
  Opel: ['Corsa', 'Astra', 'Insignia', 'Mokka', 'Mokka X', 'Crossland', 'Grandland', 'Zafira', 'Meriva', 'Adam', 'Karl', 'Vivaro', 'Combo'],
  Renault: ['Clio', 'Captur', 'Megane', 'Scenic', 'Twingo', 'Zoe', 'Espace', 'Talisman', 'Kangoo', 'Trafic', 'Master', 'Arkana', 'Austral', 'Symbioz', 'Kadjar', 'Koleos'],
  Peugeot: ['208', '308', '2008', '3008', '5008', '508', '108', '207', '206', '301', '407', '406', '4008', 'Partner', 'Rifter', 'Traveller', 'Expert', 'Boxer'],
  Citroën: ['C1', 'C3', 'C3 Aircross', 'C4', 'C4 Cactus', 'C5', 'C5 Aircross', 'DS3', 'DS4', 'DS7', 'Berlingo', 'Jumper', 'Jumpy'],
  'Volkswagen': ['Golf', 'Polo', 'T-Roc', 'Tiguan', 'Passat', 'T-Cross', 'Taigo', 'Touareg', 'Touran', 'Scirocco', 'Beetle', 'up!', 'Sharan', 'ID.3', 'ID.4'],
  BMW: ['Serie 1', 'Serie 2', 'Serie 3', 'Serie 4', 'Serie 5', 'Serie 6', 'Serie 7', 'Serie 8', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'XM', 'i3', 'i4', 'i5', 'i7', 'iX', 'iX1', 'iX2', 'iX3', 'M2', 'M3', 'M4', 'M5', 'M8', 'Z4'],
  'Mercedes-Benz': ['Classe A', 'Classe B', 'Classe C', 'Classe E', 'Classe S', 'Classe CLA', 'Classe CLS', 'Classe GLA', 'Classe GLB', 'Classe GLC', 'Classe GLE', 'Classe GLS', 'Classe G', 'Classe V', 'Classe T', 'EQA', 'EQB', 'EQC', 'EQE', 'EQS', 'Citan', 'Vito', 'Sprinter'],
  Audi: ['A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q2', 'Q3', 'Q5', 'Q7', 'Q8', 'Q4 e-tron', 'Q6 e-tron', 'e-tron', 'e-tron GT', 'TT', 'RS3', 'S3'],
  Toyota: ['Yaris', 'Yaris Cross', 'Corolla', 'C-HR', 'RAV4', 'Aygo', 'Aygo X', 'Auris', 'Avensis', 'Camry', 'GT86', 'GR86', 'Supra', 'Proace', 'bZ4X', 'Prius', 'Highlander', 'Land Cruiser'],
  Ford: ['Fiesta', 'Focus', 'Kuga', 'Puma', 'EcoSport', 'Mondeo', 'C-MAX', 'B-MAX', 'Galaxy', 'S-MAX', 'Ka', 'Transit', 'Courier', 'Ranger', 'Mustang', 'Bronco', 'Capri', 'Explorer'],
  Mazda: ['Mazda 2', 'Mazda 3', 'Mazda 5', 'Mazda 6', 'CX-3', 'CX-30', 'CX-5', 'CX-60', 'CX-80', 'MX-5', 'MX-30', 'RX-8', 'RX-7'],
  Hyundai: ['i10', 'i20', 'i30', 'i40', 'Tucson', 'Santa Fe', 'Kona', 'Bayon', 'Ioniq', 'Ioniq 5', 'Ioniq 6', 'ix20', 'Getz', 'Elantra', 'Veloster', 'H-1'],
  Kia: ['Picanto', 'Rio', 'Ceed', 'XCeed', 'Sportage', 'Sorento', 'Niro', 'EV6', 'EV9', 'Stonic', 'Soul', 'Stinger', 'Carnival', 'Carens', 'Venga', 'Optima'],
  Nissan: ['Qashqai', 'Juke', 'Micra', 'Note', 'Pulsar', 'Leaf', 'X-Trail', 'Ariya', 'Navara', 'Murano', 'GT-R', 'Pathfinder', 'Almera', 'Primera', '370Z', 'Serena'],
  Seat: ['Ibiza', 'Leon', 'Arona', 'Ateca', 'Alhambra', 'Mii', 'Taracco', 'Taracoo', 'Cordoba', 'Altea', 'Toledo', 'Exeo', 'Inca', 'Arosa'],
  Skoda: ['Fabia', 'Octavia', 'Superb', 'Kamiq', 'Karoq', 'Kodiaq', 'Scala', 'Citigo', 'Rapid', 'Enyaq', 'Elroq', 'Roomster', 'Yeti', 'Favorit'],
  Dacia: ['Sandero', 'Sandero Stepway', 'Logan', 'Logan MCV', 'Duster', 'Jogger', 'Spring', 'Dokker', 'Lodgy'],
  Suzuki: ['Swift', 'Vitara', 'S-Cross', 'Jimny', 'Ignis', 'Baleno', 'Celerio', 'Splash', 'Alto', 'Wagon R', 'Across', 'XL7', 'Grand Vitara'],
  Jeep: ['Renegade', 'Compass', 'Grand Cherokee', 'Cherokee', 'Wrangler', 'Gladiator', 'Avenger', 'Commander'],
  Volvo: ['XC40', 'XC60', 'XC90', 'V40', 'V60', 'V90', 'S60', 'S90', 'S40', 'V50', 'C30', 'EX30', 'EX90', 'V70'],
  Honda: ['Civic', 'Jazz', 'CR-V', 'HR-V', 'Accord', 'Insight', 'NSX', 'S2000', 'Prelude', 'Integra', 'ZR-V', 'e', 'e:Ny1'],
  Mini: ['Cooper', 'Cooper S', 'One', 'Countryman', 'Clubman', 'Paceman', 'Roadster', 'John Cooper Works', 'Aceman'],
  Tesla: ['Model 3', 'Model S', 'Model X', 'Model Y', 'Roadster', 'Cybertruck', 'Semi'],
  Smart: ['Fortwo', 'Forfour', '#1', '#3', '#5', 'Roadster'],
  DS: ['DS 3', 'DS 4', 'DS 7', 'DS 9'],
  Cupra: ['Leon', 'Ateca', 'Formentor', 'Born', 'Tavascan', 'Terramar'],
  DR: ['DR 1.0', 'DR 2.0', 'DR 3.0', 'DR 4.0', 'DR 5.0', 'DR 6.0', 'DR 6.2', 'DR 7.0', 'DR F35', 'DR F50'],
};

async function main() {
  const res = await fetch(SRC_URL);
  if (!res.ok) throw new Error(`download failed: ${res.status}`);
  let text = await res.text();

  // Ripara virgole mancanti tra blocchi (dataset non perfettamente JSON).
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length - 1; i++) {
    const cur = lines[i].trim();
    const next = lines[i + 1].trim();
    if ((cur.endsWith(']') || cur.endsWith('}')) && (next.startsWith('"') || next === '{')) {
      lines[i] += ',';
    }
  }
  text = lines.join('\n');

  const data = JSON.parse(text);
  const brands = data.brands || {};
  const out = { brands: {} };

  for (const [brand, models] of Object.entries(brands)) {
    const seen = new Set();
    const list = [];
    for (const raw of Array.isArray(models) ? models : []) {
      const m = normalizeModel(brand, raw);
      if (!m || seen.has(m.toLowerCase())) continue;
      seen.add(m.toLowerCase());
      list.push(m);
    }
    out.brands[brand] = list;
  }

  // Aggiunge i modelli chiave mancanti.
  for (const [brand, models] of Object.entries(TARGET)) {
    if (!out.brands[brand]) out.brands[brand] = [];
    const existing = new Set(out.brands[brand].map((m) => m.toLowerCase()));
    for (const m of models) {
      if (!existing.has(m.toLowerCase())) {
        out.brands[brand].push(m);
        existing.add(m.toLowerCase());
      }
    }
  }

  // Ordina marche e modelli.
  const sorted = {};
  for (const brand of Object.keys(out.brands).sort((a, b) => a.localeCompare(b))) {
    sorted[brand] = out.brands[brand].sort((a, b) => a.localeCompare(b, 'it'));
  }
  out.brands = sorted;

  fs.writeFileSync(OUT, JSON.stringify(out));
  const total = Object.values(out.brands).reduce((a, m) => a + m.length, 0);
  console.log(`OK ${OUT}`);
  console.log(`brands: ${Object.keys(out.brands).length} | models: ${total}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
