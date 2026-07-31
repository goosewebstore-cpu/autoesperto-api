import type { VehicleData } from '@autoesperto/types';
import { getTextValue, type RegCheckRawData } from './regcheck';

export interface VehicleKnowledge {
  reliabilityScore: number;
  maintenance: 'basso' | 'medio' | 'alto' | 'molto alto';
  common: string[];
  engine: string;
  transmission: string;
  robust: string;
  bestFor: {
    city: string;
    family: string;
    highway: string;
    newDriver: string;
  };
  generations: string[];
  versionsToAvoid: string[];
  versionsRecommended: string[];
}

function normalizeDisplacement(raw: string): string | undefined {
  if (!raw) return undefined;
  const d = raw.trim().toLowerCase().replace(/\bcc\b/g, '').replace(/\s+/g, ' ');
  if (/^\d+(\.\d+)?$/.test(d)) {
    const n = parseFloat(d);
    const liters = n >= 100 ? n / 1000 : n;
    return `${liters.toFixed(1).replace(/\.0$/, '')} L`;
  }
  if (/^\d+(\.\d+)?\s*l$/.test(d)) return d;
  return raw.trim();
}

export function normalizeVehicleData(data: RegCheckRawData): VehicleData {
  const make = getTextValue(data.CarMake);
  const model = getTextValue(data.CarModel);
  const versionRaw = data.Version || '';
  const fuelRaw = getTextValue(data.FuelType);
  const engineSize = getTextValue(data.EngineSize);
  const powerCVRaw = data.PowerCV || '';
  const body = getTextValue(data.BodyStyle);
  const doors = data.NumberOfDoors;

  let fuel = fuelRaw;
  let displacement = normalizeDisplacement(engineSize);
  let power = powerCVRaw && parseFloat(powerCVRaw) > 0 ? String(Math.round(parseFloat(powerCVRaw))) : '';

  if (!fuel && versionRaw) {
    const v = versionRaw.toLowerCase();
    if (/\b\d+\.?\d*d\b/.test(v)) fuel = 'Diesel';
    else if (/\b\d+\.?\d*h\b|hybrid|e-power|mhev|phev|plugin/.test(v)) fuel = 'Ibrida';
    else if (/gpl|metano|cng|lpg/.test(v)) fuel = 'GPL/Metano';
    else if (/elettric|ev|zero|electric|bev/.test(v)) fuel = 'Elettrica';
    else fuel = 'Benzina';
  }

  if (!power && versionRaw) {
    const m = versionRaw.match(/(\d+)\s*cv/i);
    if (m) power = m[1];
  }

  if (!displacement && versionRaw) {
    const m = versionRaw.match(/(\d+\.?\d*)\s*(?:d|h|t)/i);
    if (m) displacement = `${m[1]} L`;
  }

  return {
    plate: '',
    vin: data.Vin || '',
    make,
    model,
    version: versionRaw,
    year: data.RegistrationYear ? parseInt(data.RegistrationYear) : undefined,
    fuel,
    displacement,
    power: power ? `${power} CV` : undefined,
    transmission: getTextValue(data.Transmission) || undefined,
    body: body || undefined,
    doors: doors ? parseInt(doors) : undefined,
    color: data.Colour || undefined,
    euroClass: data.EuroStatus || undefined,
    imageUrl: (data.ImageUrl || '').replace(/^http:\/\//i, 'https://'),
  };
}

const kb: Record<string, VehicleKnowledge> = {
  fiat: {
    reliabilityScore: 6,
    maintenance: 'medio',
    common: ['Cambio Dualogic robotizzato scattoso (2010-2018)', 'Problemi elettrici sensori/centralina', 'Rumore sospensioni anteriori su 500/Panda'],
    engine: 'Motori Fire e Multijet collaudati. 1.3/1.6 Mjet affidabili; 1.4 T-Jet controllare turbo.',
    transmission: 'Dualogic soggetto a usura precoci; meglio manuale o automatico Aisin su 500X.',
    robust: 'Buona robustezza strutturale. 500X e Tipo anche per viaggi.',
    bestFor: { city: 'Eccellente', family: 'Discreta', highway: 'Media', newDriver: 'Ottima' },
    generations: ['Fiat 500 (2007-2020)', 'Fiat 500X (2014-)', 'Fiat Tipo (2015-2020)', 'Panda (2011-)'],
    versionsToAvoid: ['0.9 TwinAir con problemi olio', 'Dualogic usurato', '1.3 Mjet molto carichi'],
    versionsRecommended: ['1.3 Multijet 95 CV', '1.6 Multijet 120 CV', '1.0 FireFly 70 CV']
  },
  ford: {
    reliabilityScore: 7,
    maintenance: 'medio',
    common: ['Cambio PowerShift DPS6 scattoso su Focus 2011-2017', 'FAP intasato su diesel urbano', 'Problemi SYNC prime versioni'],
    engine: '1.0 EcoBoost: catena distribuzione pre-2017. TDCi eccellenti per durata.',
    transmission: 'Evitare PowerShift 6DCT250; preferire manuale o automatico tradizionale.',
    robust: 'Struttura robusta, tenuta di strada eccellente.',
    bestFor: { city: 'Buona', family: 'Buona', highway: 'Eccellente', newDriver: 'Buona' },
    generations: ['Focus MK3 (2011-2018)', 'Fiesta MK7 (2008-2017)', 'Kuga MK2 (2012-2019)'],
    versionsToAvoid: ['PowerShift su Focus/Fiesta', '1.0 EcoBoost pre-2017'],
    versionsRecommended: ['1.5 TDCi 120 CV', '2.0 TDCi 150 CV', '1.5 EcoBoost 150 CV']
  },
  volkswagen: {
    reliabilityScore: 7,
    maintenance: 'alto',
    common: ['DSG DQ200 7 marce: recall perdita potenza', 'Costi manutenzione superiori alla media', 'Elettronica complessa con l\'età'],
    engine: '1.6 TDI icona di affidabilità. TSI EA211 migliorati; verificare pompa acqua su TSI vecchi.',
    transmission: 'DSG DQ200 soggetto a problemi frizione; DSG DQ250 più robusto.',
    robust: 'Struttura molto robusta, sicurezza elevata.',
    bestFor: { city: 'Buona', family: 'Eccellente', highway: 'Eccellente', newDriver: 'Buona' },
    generations: ['Golf VII (2012-2020)', 'Polo VI (2017-)', 'T-Roc (2017-)'],
    versionsToAvoid: ['1.2 TSI con problemi catena', 'DSG DQ200 usurato'],
    versionsRecommended: ['1.6 TDI 115 CV', '2.0 TDI 150 CV', '1.5 TSI ACT 150 CV']
  },
  mazda: {
    reliabilityScore: 8,
    maintenance: 'basso',
    common: ['Infotainment Mazda Connect prime versioni', 'Rumore a velocità autostradale', 'Usura pastiglie freno'],
    engine: 'SkyActiv eccellenti per affidabilità e consumi reali. Motori senza turbo più semplici.',
    transmission: 'Cambio manuale e automatico affidabili; SkyActiv-D richiede rigenerazioni FAP corrette.',
    robust: 'Robustezza molto buona, costruzione giapponese tradizionale.',
    bestFor: { city: 'Buona', family: 'Buona', highway: 'Eccellente', newDriver: 'Buona' },
    generations: ['Mazda 3 BM/BN (2013-2018)', 'Mazda CX-3 (2015-2021)', 'Mazda CX-5 KE/KF (2012-)'],
    versionsToAvoid: ['2.2 D con FAP problematico se non rigenerato', '1.5 D molto urbano'],
    versionsRecommended: ['2.0 SkyActiv-G 120 CV', '2.2 SkyActiv-D 150 CV', '1.5 SkyActiv-D 105 CV']
  },
  toyota: {
    reliabilityScore: 9,
    maintenance: 'basso',
    common: ['Rumore interni modelli entry-level', 'Infotainment datato', 'Usura pastiglie freno leggermente superiore'],
    engine: 'Hybrid e benzina tra le più affidabili al mondo. Hybrid Synergy Drive collaudato.',
    transmission: 'CVT e cambi automatici Toyota eccellenti; nessun punto debole noto.',
    robust: 'Robustezza eccellente, auto progettate per durare decenni.',
    bestFor: { city: 'Eccellente', family: 'Eccellente', highway: 'Eccellente', newDriver: 'Ottima' },
    generations: ['Yaris XP13 (2011-2020)', 'Auris E180 (2012-2018)', 'RAV4 XA40 (2012-2018)'],
    versionsToAvoid: ['Diesel Toyota prima del 2016 (rari e poco supportati)'],
    versionsRecommended: ['1.5 Hybrid 100 CV', '1.8 Hybrid 136 CV', '2.0 D-4D 143 CV']
  },
  bmw: {
    reliabilityScore: 7,
    maintenance: 'alto',
    common: ['Diesel N47: catena distribuzione (2007-2012)', 'Usura bracci sospensione anteriori', 'Perdite olio motori 6 cilindri vecchi'],
    engine: 'N47 problematico sostituito da B47. Benzina B48 molto valido.',
    transmission: 'ZF 8HP eccellente; cambi precedenti più delicati.',
    robust: 'Struttura sportiva robusta, materiali premium.',
    bestFor: { city: 'Discreta', family: 'Buona', highway: 'Eccellente', newDriver: 'Scarsa' },
    generations: ['Serie 1 F20 (2011-2019)', 'Serie 3 F30 (2012-2018)', 'X1 F48 (2015-2022)'],
    versionsToAvoid: ['N47 2.0d pre-2015', 'motori benzina con catena usurata'],
    versionsRecommended: ['B47 2.0d 190 CV', 'B48 2.0i 184 CV', 'B57 3.0d 265 CV']
  },
  mercedes: {
    reliabilityScore: 8,
    maintenance: 'molto alto',
    common: ['Costi manutenzione molto alti', 'Problemi sospensioni Airmatic', 'Elettronica complessa da diagnosticare'],
    engine: 'CDI e benzina eccellenti per durata. OM651 e OM654 tra i migliori diesel.',
    transmission: 'Automatici 7G/9G-Tronic molto robusti se manutenuti.',
    robust: 'Robustezza eccezionale, auto pensate per durare.',
    bestFor: { city: 'Discreta', family: 'Buona', highway: 'Eccellente', newDriver: 'Scarsa' },
    generations: ['Classe A W176 (2012-2018)', 'Classe C W205 (2014-2021)', 'GLC X253 (2015-2022)'],
    versionsToAvoid: ['Airmatic non manutenuta', 'diesel 1.5 dCi Renault su Classe A/B/C entry'],
    versionsRecommended: ['OM651 2.2 CDI 170 CV', 'OM654 2.0 CDI 194 CV', 'M274 2.0 184 CV']
  },
  audi: {
    reliabilityScore: 7,
    maintenance: 'alto',
    common: ['S-tronic DL382 usura frizione pre-2015', 'Consumo olio su 2.0 TFSI Gen2', 'Costi manutenzione elevati'],
    engine: '2.0 TDI EA288 molto affidabile. TFSI Gen2: attenzione catena distribuzione.',
    transmission: 'S-tronic 7 marce DL500/DL382 più delicato; meglio manuale o tiptronic.',
    robust: 'Struttura premium molto solida.',
    bestFor: { city: 'Buona', family: 'Buona', highway: 'Eccellente', newDriver: 'Discreta' },
    generations: ['A3 8V (2012-2020)', 'A4 B8/B9 (2008-2023)', 'Q3 8U (2011-2018)'],
    versionsToAvoid: ['2.0 TFSI Gen2 con consumo olio', 'S-tronic usurato'],
    versionsRecommended: ['2.0 TDI 150 CV', '2.0 TDI 184 CV', '1.4 TFSI 150 CV ACT']
  },
  renault: {
    reliabilityScore: 6,
    maintenance: 'medio',
    common: ['1.2 TCe consumo olio/rotture', 'Problemi elettrici Clio III/IV', 'FAP intasato su diesel urbano'],
    engine: '1.5 dCi molto affidabile. 1.3 TCe co-sviluppato con Mercedes ha sostituito 1.2 TCe.',
    transmission: 'EDC robotizzato scattoso; meglio manuale.',
    robust: 'Robustezza media, adatta all\'uso quotidiano.',
    bestFor: { city: 'Eccellente', family: 'Buona', highway: 'Buona', newDriver: 'Ottima' },
    generations: ['Clio IV (2012-2019)', 'Captur I (2013-2019)', 'Megane III (2008-2016)'],
    versionsToAvoid: ['1.2 TCe 115/130', 'EDC con molti km', '1.5 dCi 75 CV sottodimensionato'],
    versionsRecommended: ['1.5 dCi 90 CV', '1.5 dCi 110 CV', '1.3 TCe 130/140 CV']
  },
  peugeot: {
    reliabilityScore: 6,
    maintenance: 'medio',
    common: ['PureTech 1.2 cinghia distribuzione bagno olio', 'Problemi elettronici 208/308', 'FAP intasato su diesel urbano'],
    engine: 'BlueHDi eccellente per durata. PureTech verificare sempre stato cinghia.',
    transmission: 'Eat6/Eat8 affidabili se manutenuti; robotizzato da evitare.',
    robust: 'Piattaforma CMP/EMP2 molto solida.',
    bestFor: { city: 'Eccellente', family: 'Buona', highway: 'Buona', newDriver: 'Ottima' },
    generations: ['208 I (2012-2019)', '308 II (2013-2021)', '2008 I (2013-2019)'],
    versionsToAvoid: ['PureTech 1.2 con cinghia non sostituita', '1.6 THP con consumo olio'],
    versionsRecommended: ['1.6 BlueHDi 100 CV', '1.5 BlueHDi 130 CV', '1.2 PureTech 110 CV (cinghia controllata)']
  },
  honda: {
    reliabilityScore: 9,
    maintenance: 'basso',
    common: ['Cambio CVT su Civic precedenti', 'Elettronica datata'],
    engine: 'i-VTEC e i-DTEC eccellenti. 1.6 i-DTEC è un diesel leggendario.',
    transmission: 'Manuale Honda eccellente; CVT affidabile.',
    robust: 'Robustezza eccellente, specialmente i motori.',
    bestFor: { city: 'Buona', family: 'Buona', highway: 'Eccellente', newDriver: 'Buona' },
    generations: ['Civic IX (2012-2017)', 'Jazz III (2008-2014)', 'CR-V IV (2012-2016)'],
    versionsToAvoid: ['1.6 i-DTEC con problemi FAP solo se urbano estremo'],
    versionsRecommended: ['1.6 i-DTEC 120 CV', '1.8 i-VTEC 142 CV', '2.2 i-DTEC 150 CV']
  },
  hyundai: {
    reliabilityScore: 8,
    maintenance: 'basso',
    common: ['Infotainment lento prime versioni', 'Vernice delicata su alcuni colori'],
    engine: 'CRDi e T-GDI eccellenti per affidabilità e consumi. Garanzia 5 anni.',
    transmission: 'Automatici e manuali affidabili; doppia frizione migliorata nel tempo.',
    robust: 'Robustezza molto buona, migliorata drasticamente dal 2015.',
    bestFor: { city: 'Buona', family: 'Eccellente', highway: 'Buona', newDriver: 'Buona' },
    generations: ['i30 GD (2012-2017)', 'Tucson TL (2015-2020)', 'Kona (2017-)'],
    versionsToAvoid: ['1.4 benzina sottodimensionato su Tucson'],
    versionsRecommended: ['1.6 CRDi 136 CV', '1.6 T-GDI 177 CV', '2.0 CRDi 184 CV']
  },
  kia: {
    reliabilityScore: 8,
    maintenance: 'basso',
    common: ['Infotainment lento prime versioni', 'Rumore a velocità autostradale'],
    engine: 'Stessi motori Hyundai, affidabili. Garanzia 7 anni.',
    transmission: 'Cambio automatico e manuale affidabili.',
    robust: 'Robustezza molto buona, ottimo rapporto qualità-prezzo.',
    bestFor: { city: 'Buona', family: 'Eccellente', highway: 'Buona', newDriver: 'Buona' },
    generations: ['Ceed JD (2012-2018)', 'Sportage QL (2015-2021)', 'Stonic (2017-)'],
    versionsToAvoid: ['1.4 benzina su Sportage troppo piccolo'],
    versionsRecommended: ['1.6 CRDi 136 CV', '1.6 T-GDI 177 CV', '2.0 CRDi 185 CV']
  },
  nissan: {
    reliabilityScore: 7,
    maintenance: 'medio',
    common: ['Problemi frizione Qashqai dCi', 'Usura cuscinetti Note/Micra', 'CVT con l\'età'],
    engine: 'DCI Renault affidabili e motori benzina Nissan eccellenti.',
    transmission: 'Manuale affidabile; CVT controllare stato.',
    robust: 'Robustezza buona, materiali solidi.',
    bestFor: { city: 'Buona', family: 'Buona', highway: 'Buona', newDriver: 'Buona' },
    generations: ['Qashqai J11 (2014-2021)', 'Micra K14 (2016-)', 'Juke F15 (2010-2019)'],
    versionsToAvoid: ['1.5 dCi 110 con FAP urbano', '1.2 DIG-T con consumo olio'],
    versionsRecommended: ['1.5 dCi 110 CV', '1.3 DIG-T 140 CV', '1.0 DIG-T 117 CV']
  },
  seat: {
    reliabilityScore: 7,
    maintenance: 'alto',
    common: ['Stessi problemi VW (DSG, elettronica)', 'Rumore interni modelli entry-level'],
    engine: 'Stessi motori VW, eccellenti per prestazioni e consumi.',
    transmission: 'DSG DQ200 delicato; meglio manuale.',
    robust: 'Robustezza buona, come VW.',
    bestFor: { city: 'Buona', family: 'Buona', highway: 'Eccellente', newDriver: 'Buona' },
    generations: ['Leon III (2012-2020)', 'Ibiza V (2017-)', 'Ateca (2016-)'],
    versionsToAvoid: ['DSG 7 marce usurato'],
    versionsRecommended: ['1.6 TDI 115 CV', '2.0 TDI 150 CV', '1.5 TSI 150 CV']
  },
  skoda: {
    reliabilityScore: 8,
    maintenance: 'alto',
    common: ['Stessi problemi VW', 'Elettronica meno raffinata'],
    engine: 'Stessi motori VW, eccellenti per durata.',
    transmission: 'DSG DQ200 più delicato; manuale ottima.',
    robust: 'Robustezza molto buona, spazio interno eccellente.',
    bestFor: { city: 'Buona', family: 'Eccellente', highway: 'Eccellente', newDriver: 'Buona' },
    generations: ['Octavia III (2013-2020)', 'Superb III (2015-2023)', 'Kodiaq (2016-)'],
    versionsToAvoid: ['DSG 7 marce usurato'],
    versionsRecommended: ['1.6 TDI 115 CV', '2.0 TDI 150 CV', '1.5 TSI 150 CV']
  },
  'alfa romeo': {
    reliabilityScore: 6,
    maintenance: 'alto',
    common: ['Problemi elettrici Giulietta/MiTo', 'Usura sospensioni anteriori'],
    engine: 'Multijet e benzina eccellenti per emozioni. Manutenzione curata richiesta.',
    transmission: 'TCT doppia frizione controllare; manuale più affidabile.',
    robust: 'Robustezza media, struttura sportiva.',
    bestFor: { city: 'Buona', family: 'Discreta', highway: 'Buona', newDriver: 'Scarsa' },
    generations: ['Giulietta (2010-2020)', 'MiTo (2008-2018)'],
    versionsToAvoid: ['1.4 TB Multiair con manutenzione saltata'],
    versionsRecommended: ['2.0 JTDM 150 CV', '1.6 JTDM 120 CV', '1.4 TB 170 CV']
  },
  volvo: {
    reliabilityScore: 8,
    maintenance: 'molto alto',
    common: ['Costi manutenzione elevati', 'Elettronica complessa'],
    engine: 'D4 e D5 eccellenti per durata. Nuovi ibridi molto efficienti.',
    transmission: 'Automatici Geartronic/Aisin robusti.',
    robust: 'Robustezza eccellente, sicurezza top.',
    bestFor: { city: 'Discreta', family: 'Eccellente', highway: 'Eccellente', newDriver: 'Buona' },
    generations: ['V40 (2012-2019)', 'XC60 II (2017-)', 'XC90 II (2014-)'],
    versionsToAvoid: ['Motori Drive-E 1.5/2.0 benzina con consumo olio non gestito'],
    versionsRecommended: ['D4 2.0 190 CV', 'D5 2.4 225 CV', 'T5 2.0 250 CV']
  },
  mini: {
    reliabilityScore: 6,
    maintenance: 'alto',
    common: ['Problemi elettrici R56 2006-2013', 'Usura sospensioni sportive'],
    engine: 'Motori BMW Prince potenti ma richiedono manutenzione. Evitare 1.6 con catena.',
    transmission: 'Automatico Getrag/Aisin affidabile se manutenuto.',
    robust: 'Robustezza buona ma usura sospensioni elevata.',
    bestFor: { city: 'Eccellente', family: 'Scarsa', highway: 'Discreta', newDriver: 'Buona' },
    generations: ['MINI R56 (2006-2013)', 'MINI F56 (2014-)', 'Countryman F60 (2017-)'],
    versionsToAvoid: ['1.6 Prince con catena', 'R56 con molti problemi elettrici'],
    versionsRecommended: ['Cooper D 1.5 116 CV', 'Cooper S 2.0 192 CV', 'One D 1.5 95 CV']
  },
  suzuki: {
    reliabilityScore: 7,
    maintenance: 'basso',
    common: ['Spazio interno ridotto', 'Materiali interni economici'],
    engine: 'Benzina eccellenti per affidabilità. Hybrid mild affidabilissimo.',
    transmission: 'AGS robotizzato scattoso; meglio manuale o automatico Aisin.',
    robust: 'Robustezza buona, auto leggere e semplici.',
    bestFor: { city: 'Eccellente', family: 'Discreta', highway: 'Discreta', newDriver: 'Ottima' },
    generations: ['Swift V (2010-2017)', 'Vitara IV (2015-)', 'Ignis (2016-)'],
    versionsToAvoid: ['AGS robotizzato con molti km'],
    versionsRecommended: ['1.2 Dualjet 90 CV', '1.0 Boosterjet 111 CV', '1.6 DDiS 120 CV']
  },
  dacia: {
    reliabilityScore: 7,
    maintenance: 'basso',
    common: ['Materiali interni economici', 'Rumore isolamento acustico'],
    engine: 'Stessi motori Renault, semplici e facili da manutenere.',
    transmission: 'Manuale robusto; automatico EDC da evitare.',
    robust: 'Robustezza buona, costruita per essere economica.',
    bestFor: { city: 'Buona', family: 'Buona', highway: 'Buona', newDriver: 'Ottima' },
    generations: ['Duster I/II (2010-)', 'Sandero II (2012-2020)', 'Logan II (2012-2020)'],
    versionsToAvoid: ['EDC automatico', '1.2 16V datato'],
    versionsRecommended: ['1.5 dCi 90 CV', '1.5 Blue dCi 95 CV', '0.9 TCe 90 CV']
  },
  jeep: {
    reliabilityScore: 6,
    maintenance: 'alto',
    common: ['Problemi elettrici Renegade/Compass', 'Consumi elevati', 'Costi manutenzione superiori'],
    engine: 'Multijet Fiat affidabili. Motorizzazioni USA potenti ma assetate.',
    transmission: 'Doppia frizione DDCT controllare; 9 marce ZF robusto.',
    robust: 'Robustezza strutturale eccellente per fuoristrada.',
    bestFor: { city: 'Discreta', family: 'Buona', highway: 'Buona', newDriver: 'Discreta' },
    generations: ['Renegade (2014-)', 'Compass II (2016-)', 'Cherokee KL (2013-2021)'],
    versionsToAvoid: ['2.4 Tigershark con consumo olio', 'DDCT usurato'],
    versionsRecommended: ['1.6 Multijet 120 CV', '2.0 Multijet 140 CV', '1.4 MultiAir 170 CV']
  },
  citroen: {
    reliabilityScore: 6,
    maintenance: 'medio',
    common: ['Sospensioni idrauliche su modelli dotati', 'Elettronica con l\'età', 'Rumore interni modelli entry-level'],
    engine: 'Stessi motori PSA, affidabili se mantenuti correttamente.',
    transmission: 'Eat6/Eat8 affidabili; robotizzato da evitare.',
    robust: 'Comfort eccellente, robustezza media.',
    bestFor: { city: 'Eccellente', family: 'Buona', highway: 'Buona', newDriver: 'Ottima' },
    generations: ['C3 III (2016-)', 'C4 Cactus (2014-2020)', 'C4 Picasso II (2013-2022)'],
    versionsToAvoid: ['PureTech 1.2 senza cinghia sostituita', '1.6 THP consumo olio'],
    versionsRecommended: ['1.6 BlueHDi 100 CV', '1.5 BlueHDi 130 CV', '1.2 PureTech 110 CV']
  }
};

function normalizeMake(make: string): string {
  const m = make.toLowerCase().trim();
  const aliases: Record<string, string> = {
    'mercedes-benz': 'mercedes',
    'bmw ag': 'bmw',
    'alfa romeo': 'alfa romeo',
    'land rover': 'land rover',
    'groupe renault': 'renault',
    's.p.a.': '',
  };
  return aliases[m] !== undefined ? aliases[m] : m.replace(/-/g, ' ').replace(/\s+/g, ' ').replace(/\s?\(.*\)$/, '');
}

export function getVehicleKnowledge(make: string): VehicleKnowledge {
  const key = normalizeMake(make);
  const byKey = kb[key];
  if (byKey) return byKey;
  const root = key.split(' ')[0];
  const byRoot = kb[root];
  if (byRoot) return byRoot;
  return {
    reliabilityScore: 6,
    maintenance: 'medio',
    common: [
      `Storico tagliandi regolare essenziale per ${make}: verifica libretto manutenzione`,
      `Verifica richiami aperti su sicurezza-europa.eu per ${make}`,
      `Controlla cinghia/catena distribuzione e tagliando olio motore su ${make}`,
    ],
    engine: `Motori ${make}: verificare consumo olio, problemi cinghia/catena distribuzione e turbo (se presente). Preferire versioni con documentazione tagliandi.`,
    transmission: `Cambio: preferire versioni con tagliandi cambio documentati. Per automatici, verificare sostituzione olio cambio entro i 60.000 km.`,
    robust: `Robustezza nella media per la categoria ${make}. Verificare condizioni sospensioni e impianto frenante.`,
    bestFor: { city: 'Discreta', family: 'Buona', highway: 'Buona', newDriver: 'Discreta' },
    generations: [],
    versionsToAvoid: ['Versioni senza documentazione tagliandi continua'],
    versionsRecommended: ['Versioni con tagliandi documentati e basso chilometraggio'],
  };
}

export function getAlternatives(make: string, model: string): VehicleData[] {
  const map: Record<string, VehicleData[]> = {
    'volkswagen t-roc': [
      { make: 'Peugeot', model: '2008' },
      { make: 'Renault', model: 'Captur' },
      { make: 'Toyota', model: 'C-HR' },
      { make: 'Nissan', model: 'Juke' },
    ],
    'mazda cx-3': [
      { make: 'Peugeot', model: '2008' },
      { make: 'Renault', model: 'Captur' },
      { make: 'Toyota', model: 'C-HR' },
      { make: 'Nissan', model: 'Juke' },
    ],
    'fiat 500': [
      { make: 'Toyota', model: 'Aygo' },
      { make: 'Volkswagen', model: 'up!' },
      { make: 'Renault', model: 'Twingo' },
      { make: 'Smart', model: 'ForTwo' },
    ],
    'ford focus': [
      { make: 'Volkswagen', model: 'Golf' },
      { make: 'Peugeot', model: '308' },
      { make: 'Opel', model: 'Astra' },
      { make: 'Toyota', model: 'Corolla' },
    ],
    'bmw serie 3': [
      { make: 'Mercedes', model: 'Classe C' },
      { make: 'Audi', model: 'A4' },
      { make: 'Volvo', model: 'S60' },
      { make: 'Lexus', model: 'IS' },
    ]
  };
  return map[`${make.toLowerCase()} ${model.toLowerCase()}`] || [
    { make: 'Volkswagen', model: 'Golf' },
    { make: 'Toyota', model: 'Corolla' },
    { make: 'Peugeot', model: '308' },
    { make: 'Ford', model: 'Focus' },
  ];
}
