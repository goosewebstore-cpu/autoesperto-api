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
  },
  opel: {
    reliabilityScore: 7,
    maintenance: 'medio',
    common: ['Catena di distribuzione su 1.4 benzina', 'Valvola EGR e FAP intasato su 1.3/1.7 CDTI urbano', 'Modulo bobine su motori Ecotec'],
    engine: 'Motori Ecotec e CDTI collaudati. 1.6 CDTI "Whisper Diesel" molto silenzioso e parco.',
    transmission: 'Cambi manuali precisi. Automatico Easytronic robotizzato da evitare.',
    robust: 'Carrozzeria e telaio robusti con buona protezione dalla corrosione.',
    bestFor: { city: 'Buona', family: 'Eccellente', highway: 'Buona', newDriver: 'Buona' },
    generations: ['Corsa E (2014-2019)', 'Astra K (2015-2021)', 'Mokka X (2016-2019)'],
    versionsToAvoid: ['Easytronic robotizzato', '1.4 Turbo con catena rumorosa'],
    versionsRecommended: ['1.6 CDTI 110 CV', '1.4 Turbo 125/150 CV', '1.2 Turbo 100 CV']
  },
  lti: {
    reliabilityScore: 7.4,
    maintenance: 'medio',
    common: ['Usura freni e frizione dovuta a uso urbano gravoso', 'Usura sospensioni anteriori e snodi dello sterzo', 'Danni alla carrozzeria e paraurti da traffico'],
    engine: 'Motore 2.5 VM Motori / VM2.8 turbodiesel robusto e concepito per altissimi chilometraggi in servizio continuativo.',
    transmission: 'Cambio automatico Chrysler/Jatco progettato per il servizio taxi urbano.',
    robust: 'Telaio a traliccio separato ultra-robusto, pannelli carrozzeria facili da sostituire.',
    bestFor: { city: 'Eccellente', family: 'Discreta', highway: 'Media', newDriver: 'Scarsa' },
    generations: ['TX1 (1997-2002)', 'TX2 (2002-2006)', 'TX4 (2006-2017)'],
    versionsToAvoid: ['Esemplari ex-taxi senza storico manutenzione documentato'],
    versionsRecommended: ['TX4 2.5 DOHC Euro 4/5 con storico officina']
  }
};

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function normalizeMake(make: string): string {
  const m = make.toLowerCase().trim();
  const aliases: Record<string, string> = {
    'mercedes-benz': 'mercedes',
    'bmw ag': 'bmw',
    'alfa romeo': 'alfa romeo',
    'land rover': 'land rover',
    'groupe renault': 'renault',
    'vauxhall': 'opel',
    'london taxis international': 'lti',
    'london taxi': 'lti',
    'lti vehicles': 'lti',
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

  const h = hashString(make);
  const scores = [6.2, 6.7, 7.1, 7.5, 6.4, 6.9];
  const maints: Array<VehicleKnowledge['maintenance']> = ['basso', 'medio', 'alto', 'medio'];
  const reliabilityScore = scores[h % scores.length];
  const maintenance = maints[h % maints.length];

  return {
    reliabilityScore,
    maintenance,
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

const SEGMENT_CANDIDATES: Record<string, Array<{ make: string; model: string; power: number; fuel: string; body: string }>> = {
  citycar: [
    { make: 'Fiat', model: 'Panda', power: 70, fuel: 'Ibrida', body: 'Citycar' },
    { make: 'Fiat', model: '500', power: 70, fuel: 'Ibrida', body: 'Citycar' },
    { make: 'Toyota', model: 'Aygo', power: 72, fuel: 'Benzina', body: 'Citycar' },
    { make: 'Toyota', model: 'Aygo X', power: 72, fuel: 'Benzina', body: 'Citycar Crossover' },
    { make: 'Hyundai', model: 'i10', power: 67, fuel: 'Benzina', body: 'Citycar' },
    { make: 'Kia', model: 'Picanto', power: 67, fuel: 'Benzina', body: 'Citycar' },
    { make: 'Renault', model: 'Twingo', power: 65, fuel: 'Benzina', body: 'Citycar' },
    { make: 'Smart', model: 'Fortwo', power: 71, fuel: 'Benzina', body: 'Citycar' },
    { make: 'Volkswagen', model: 'up!', power: 65, fuel: 'Benzina', body: 'Citycar' },
    { make: 'Lancia', model: 'Ypsilon', power: 70, fuel: 'Ibrida', body: 'Citycar' },
    { make: 'Suzuki', model: 'Ignis', power: 83, fuel: 'Ibrida', body: 'Citycar Crossover' },
    { make: 'Citroen', model: 'C1', power: 72, fuel: 'Benzina', body: 'Citycar' },
    { make: 'Peugeot', model: '108', power: 72, fuel: 'Benzina', body: 'Citycar' },
    { make: 'Dacia', model: 'Spring', power: 45, fuel: 'Elettrica', body: 'Citycar EV' },
  ],
  utilitaria: [
    { make: 'Toyota', model: 'Yaris', power: 116, fuel: 'Ibrida', body: 'Utilitaria' },
    { make: 'Renault', model: 'Clio', power: 90, fuel: 'Benzina', body: 'Utilitaria' },
    { make: 'Peugeot', model: '208', power: 100, fuel: 'Benzina', body: 'Utilitaria' },
    { make: 'Volkswagen', model: 'Polo', power: 95, fuel: 'Benzina', body: 'Utilitaria' },
    { make: 'Ford', model: 'Fiesta', power: 100, fuel: 'Benzina', body: 'Utilitaria' },
    { make: 'Opel', model: 'Corsa', power: 100, fuel: 'Benzina', body: 'Utilitaria' },
    { make: 'Dacia', model: 'Sandero', power: 90, fuel: 'Benzina', body: 'Utilitaria' },
    { make: 'Citroen', model: 'C3', power: 83, fuel: 'Benzina', body: 'Utilitaria' },
    { make: 'Hyundai', model: 'i20', power: 84, fuel: 'Benzina', body: 'Utilitaria' },
    { make: 'Seat', model: 'Ibiza', power: 95, fuel: 'Benzina', body: 'Utilitaria' },
    { make: 'Skoda', model: 'Fabia', power: 95, fuel: 'Benzina', body: 'Utilitaria' },
    { make: 'Suzuki', model: 'Swift', power: 83, fuel: 'Ibrida', body: 'Utilitaria' },
    { make: 'Nissan', model: 'Micra', power: 92, fuel: 'Benzina', body: 'Utilitaria' },
    { make: 'Mini', model: 'Cooper', power: 136, fuel: 'Benzina', body: 'Utilitaria' },
    { make: 'Fiat', model: 'Punto', power: 69, fuel: 'Benzina', body: 'Utilitaria' },
  ],
  bsuv: [
    { make: 'Jeep', model: 'Renegade', power: 120, fuel: 'Benzina', body: 'SUV compatto' },
    { make: 'Fiat', model: '500X', power: 120, fuel: 'Benzina', body: 'Crossover' },
    { make: 'Volkswagen', model: 'T-Roc', power: 110, fuel: 'Benzina', body: 'SUV compatto' },
    { make: 'Volkswagen', model: 'T-Cross', power: 95, fuel: 'Benzina', body: 'SUV compatto' },
    { make: 'Volkswagen', model: 'Taigo', power: 110, fuel: 'Benzina', body: 'Crossover Coupé' },
    { make: 'Toyota', model: 'Yaris Cross', power: 116, fuel: 'Ibrida', body: 'SUV compatto' },
    { make: 'Peugeot', model: '2008', power: 100, fuel: 'Benzina', body: 'SUV compatto' },
    { make: 'Renault', model: 'Captur', power: 90, fuel: 'Benzina', body: 'Crossover' },
    { make: 'Ford', model: 'Puma', power: 125, fuel: 'Ibrida', body: 'Crossover' },
    { make: 'Nissan', model: 'Juke', power: 114, fuel: 'Benzina', body: 'Crossover' },
    { make: 'Hyundai', model: 'Kona', power: 120, fuel: 'Benzina', body: 'SUV compatto' },
    { make: 'Hyundai', model: 'Bayon', power: 84, fuel: 'Benzina', body: 'Crossover' },
    { make: 'Kia', model: 'Stonic', power: 100, fuel: 'Ibrida', body: 'Crossover' },
    { make: 'Dacia', model: 'Duster', power: 100, fuel: 'GPL/Metano', body: 'SUV compatto' },
    { make: 'Suzuki', model: 'Vitara', power: 129, fuel: 'Ibrida', body: 'SUV compatto' },
    { make: 'Mazda', model: 'CX-3', power: 121, fuel: 'Benzina', body: 'SUV compatto' },
    { make: 'Mazda', model: 'CX-30', power: 122, fuel: 'Ibrida', body: 'Crossover' },
    { make: 'Opel', model: 'Mokka', power: 100, fuel: 'Benzina', body: 'Crossover' },
    { make: 'Opel', model: 'Crossland', power: 110, fuel: 'Benzina', body: 'Crossover' },
    { make: 'Seat', model: 'Arona', power: 95, fuel: 'Benzina', body: 'SUV compatto' },
    { make: 'Skoda', model: 'Kamiq', power: 95, fuel: 'Benzina', body: 'SUV compatto' },
    { make: 'Jeep', model: 'Avenger', power: 100, fuel: 'Benzina', body: 'SUV compatto' },
    { make: 'Citroen', model: 'C3 Aircross', power: 110, fuel: 'Benzina', body: 'SUV compatto' },
    { make: 'MG', model: 'ZS', power: 106, fuel: 'Benzina', body: 'SUV compatto' },
  ],
  compatta: [
    { make: 'Volkswagen', model: 'Golf', power: 115, fuel: 'Benzina', body: 'Berlina 2 volumi' },
    { make: 'Audi', model: 'A3', power: 116, fuel: 'Benzina', body: 'Berlina 2 volumi' },
    { make: 'BMW', model: 'Serie 1', power: 136, fuel: 'Benzina', body: 'Berlina 2 volumi' },
    { make: 'Mercedes', model: 'Classe A', power: 136, fuel: 'Benzina', body: 'Berlina 2 volumi' },
    { make: 'Ford', model: 'Focus', power: 125, fuel: 'Ibrida', body: 'Berlina 2 volumi' },
    { make: 'Toyota', model: 'Corolla', power: 140, fuel: 'Ibrida', body: 'Berlina 2 volumi' },
    { make: 'Peugeot', model: '308', power: 130, fuel: 'Benzina', body: 'Berlina 2 volumi' },
    { make: 'Seat', model: 'Leon', power: 115, fuel: 'Benzina', body: 'Berlina 2 volumi' },
    { make: 'Skoda', model: 'Octavia', power: 115, fuel: 'Diesel', body: 'Berlina' },
    { make: 'Fiat', model: 'Tipo', power: 100, fuel: 'Benzina', body: 'Berlina 2 volumi' },
    { make: 'Alfa Romeo', model: 'Giulietta', power: 120, fuel: 'Benzina', body: 'Berlina 2 volumi' },
    { make: 'Opel', model: 'Astra', power: 110, fuel: 'Benzina', body: 'Berlina 2 volumi' },
    { make: 'Hyundai', model: 'i30', power: 120, fuel: 'Benzina', body: 'Berlina 2 volumi' },
    { make: 'Kia', model: 'Ceed', power: 120, fuel: 'Benzina', body: 'Berlina 2 volumi' },
    { make: 'Mazda', model: 'Mazda 3', power: 122, fuel: 'Ibrida', body: 'Berlina 2 volumi' },
    { make: 'Honda', model: 'Civic', power: 126, fuel: 'Benzina', body: 'Berlina 2 volumi' },
    { make: 'Renault', model: 'Megane', power: 115, fuel: 'Benzina', body: 'Berlina 2 volumi' },
  ],
  csuv: [
    { make: 'Volkswagen', model: 'Tiguan', power: 150, fuel: 'Diesel', body: 'SUV medio' },
    { make: 'Toyota', model: 'RAV4', power: 218, fuel: 'Ibrida', body: 'SUV medio' },
    { make: 'Toyota', model: 'C-HR', power: 140, fuel: 'Ibrida', body: 'Crossover' },
    { make: 'Nissan', model: 'Qashqai', power: 140, fuel: 'Ibrida', body: 'Crossover' },
    { make: 'Peugeot', model: '3008', power: 130, fuel: 'Diesel', body: 'SUV medio' },
    { make: 'Hyundai', model: 'Tucson', power: 150, fuel: 'Ibrida', body: 'SUV medio' },
    { make: 'Kia', model: 'Sportage', power: 150, fuel: 'Ibrida', body: 'SUV medio' },
    { make: 'Ford', model: 'Kuga', power: 150, fuel: 'Diesel', body: 'SUV medio' },
    { make: 'Jeep', model: 'Compass', power: 130, fuel: 'Diesel', body: 'SUV medio' },
    { make: 'Cupra', model: 'Formentor', power: 150, fuel: 'Benzina', body: 'Crossover Coupé' },
    { make: 'BMW', model: 'X1', power: 150, fuel: 'Diesel', body: 'SUV medio' },
    { make: 'Audi', model: 'Q3', power: 150, fuel: 'Diesel', body: 'SUV medio' },
    { make: 'Mercedes', model: 'GLA', power: 150, fuel: 'Diesel', body: 'SUV medio' },
    { make: 'Volvo', model: 'XC40', power: 163, fuel: 'Ibrida', body: 'SUV medio' },
    { make: 'Alfa Romeo', model: 'Tonale', power: 130, fuel: 'Ibrida', body: 'SUV medio' },
    { make: 'Renault', model: 'Austral', power: 140, fuel: 'Ibrida', body: 'SUV medio' },
    { make: 'Citroen', model: 'C5 Aircross', power: 130, fuel: 'Diesel', body: 'SUV medio' },
    { make: 'Seat', model: 'Ateca', power: 150, fuel: 'Benzina', body: 'SUV medio' },
    { make: 'Skoda', model: 'Karoq', power: 150, fuel: 'Diesel', body: 'SUV medio' },
    { make: 'Mazda', model: 'CX-5', power: 165, fuel: 'Benzina', body: 'SUV medio' },
    { make: 'Land Rover', model: 'Range Rover Evoque', power: 163, fuel: 'Diesel', body: 'SUV medio' },
  ],
  berlina_d: [
    { make: 'BMW', model: 'Serie 3', power: 190, fuel: 'Diesel', body: 'Berlina' },
    { make: 'Audi', model: 'A4', power: 190, fuel: 'Diesel', body: 'Berlina / Station Wagon' },
    { make: 'Mercedes', model: 'Classe C', power: 200, fuel: 'Diesel', body: 'Berlina' },
    { make: 'Alfa Romeo', model: 'Giulia', power: 190, fuel: 'Diesel', body: 'Berlina' },
    { make: 'Volvo', model: 'S60', power: 197, fuel: 'Ibrida', body: 'Berlina' },
    { make: 'Volkswagen', model: 'Passat', power: 150, fuel: 'Diesel', body: 'Station Wagon' },
    { make: 'Tesla', model: 'Model 3', power: 283, fuel: 'Elettrica', body: 'Berlina EV' },
    { make: 'Skoda', model: 'Superb', power: 150, fuel: 'Diesel', body: 'Berlina / Station Wagon' },
    { make: 'Peugeot', model: '508', power: 130, fuel: 'Diesel', body: 'Berlina' },
    { make: 'Ford', model: 'Mondeo', power: 150, fuel: 'Diesel', body: 'Berlina' },
    { make: 'Audi', model: 'A6', power: 204, fuel: 'Diesel', body: 'Berlina' },
    { make: 'BMW', model: 'Serie 5', power: 190, fuel: 'Diesel', body: 'Berlina' },
    { make: 'Mercedes', model: 'Classe E', power: 197, fuel: 'Diesel', body: 'Berlina' },
  ],
  dsuv: [
    { make: 'BMW', model: 'X3', power: 190, fuel: 'Diesel', body: 'SUV grande' },
    { make: 'Audi', model: 'Q5', power: 204, fuel: 'Diesel', body: 'SUV grande' },
    { make: 'Mercedes', model: 'GLC', power: 197, fuel: 'Diesel', body: 'SUV grande' },
    { make: 'Porsche', model: 'Macan', power: 265, fuel: 'Benzina', body: 'SUV grande' },
    { make: 'Alfa Romeo', model: 'Stelvio', power: 210, fuel: 'Diesel', body: 'SUV grande' },
    { make: 'Volvo', model: 'XC60', power: 197, fuel: 'Diesel', body: 'SUV grande' },
    { make: 'Land Rover', model: 'Range Rover Velar', power: 204, fuel: 'Diesel', body: 'SUV grande' },
    { make: 'Tesla', model: 'Model Y', power: 299, fuel: 'Elettrica', body: 'SUV EV' },
    { make: 'Maserati', model: 'Grecale', power: 300, fuel: 'Ibrida', body: 'SUV grande' },
    { make: 'Volkswagen', model: 'Touareg', power: 231, fuel: 'Diesel', body: 'SUV grande' },
    { make: 'Jeep', model: 'Grand Cherokee', power: 250, fuel: 'Diesel', body: 'SUV grande' },
    { make: 'Porsche', model: 'Cayenne', power: 340, fuel: 'Benzina', body: 'SUV grande' },
    { make: 'BMW', model: 'X5', power: 286, fuel: 'Diesel', body: 'SUV grande' },
    { make: 'Audi', model: 'Q7', power: 231, fuel: 'Diesel', body: 'SUV grande' },
    { make: 'Mercedes', model: 'GLE', power: 245, fuel: 'Diesel', body: 'SUV grande' },
    { make: 'Volvo', model: 'XC90', power: 235, fuel: 'Diesel', body: 'SUV grande' },
  ],
  sportiva: [
    { make: 'Mazda', model: 'MX-5', power: 132, fuel: 'Benzina', body: 'Spider' },
    { make: 'Toyota', model: 'GR86', power: 234, fuel: 'Benzina', body: 'Coupé' },
    { make: 'BMW', model: 'Serie 2', power: 184, fuel: 'Benzina', body: 'Coupé' },
    { make: 'BMW', model: 'Z4', power: 197, fuel: 'Benzina', body: 'Spider' },
    { make: 'Audi', model: 'TT', power: 197, fuel: 'Benzina', body: 'Coupé' },
    { make: 'Porsche', model: '718 Cayman', power: 300, fuel: 'Benzina', body: 'Coupé' },
    { make: 'Ford', model: 'Mustang', power: 450, fuel: 'Benzina', body: 'Coupé' },
    { make: 'Alpine', model: 'A110', power: 252, fuel: 'Benzina', body: 'Coupé' },
    { make: 'Abarth', model: '595', power: 165, fuel: 'Benzina', body: 'Sportiva compatta' },
    { make: 'Toyota', model: 'Supra', power: 340, fuel: 'Benzina', body: 'Coupé' },
  ],
  supercar: [
    { make: 'Porsche', model: '911', power: 385, fuel: 'Benzina', body: 'Coupé' },
    { make: 'Ferrari', model: 'Roma', power: 620, fuel: 'Benzina', body: 'Coupé GT' },
    { make: 'Ferrari', model: '296 GTB', power: 830, fuel: 'Ibrida', body: 'Supercar' },
    { make: 'Lamborghini', model: 'Huracan', power: 610, fuel: 'Benzina', body: 'Supercar' },
    { make: 'McLaren', model: 'Artura', power: 680, fuel: 'Ibrida', body: 'Supercar' },
    { make: 'Aston Martin', model: 'Vantage', power: 510, fuel: 'Benzina', body: 'Coupé GT' },
    { make: 'Maserati', model: 'MC20', power: 630, fuel: 'Benzina', body: 'Supercar' },
    { make: 'Audi', model: 'R8', power: 570, fuel: 'Benzina', body: 'Supercar' },
    { make: 'Nissan', model: 'GT-R', power: 570, fuel: 'Benzina', body: 'Supercar' },
  ],
  monovolume: [
    { make: 'Fiat', model: '500L', power: 95, fuel: 'Diesel', body: 'Monovolume' },
    { make: 'Citroen', model: 'Berlingo', power: 100, fuel: 'Diesel', body: 'Multispazio' },
    { make: 'Peugeot', model: 'Rifter', power: 100, fuel: 'Diesel', body: 'Multispazio' },
    { make: 'Volkswagen', model: 'Touran', power: 115, fuel: 'Diesel', body: 'Monovolume' },
    { make: 'Volkswagen', model: 'Caddy', power: 102, fuel: 'Diesel', body: 'Multispazio' },
    { make: 'Mercedes', model: 'Classe B', power: 116, fuel: 'Diesel', body: 'Monovolume' },
    { make: 'Renault', model: 'Scenic', power: 115, fuel: 'Diesel', body: 'Monovolume' },
    { make: 'Ford', model: 'C-Max', power: 120, fuel: 'Diesel', body: 'Monovolume' },
    { make: 'Ford', model: 'S-Max', power: 150, fuel: 'Diesel', body: 'Monovolume' },
    { make: 'Dacia', model: 'Jogger', power: 110, fuel: 'Benzina', body: 'Multispazio' },
  ],
  fuoristrada: [
    { make: 'Jeep', model: 'Wrangler', power: 200, fuel: 'Diesel', body: 'Fuoristrada' },
    { make: 'Suzuki', model: 'Jimny', power: 102, fuel: 'Benzina', body: 'Fuoristrada' },
    { make: 'Toyota', model: 'Land Cruiser', power: 204, fuel: 'Diesel', body: 'Fuoristrada' },
    { make: 'Toyota', model: 'Hilux', power: 150, fuel: 'Diesel', body: 'Pick-up' },
    { make: 'Ford', model: 'Ranger', power: 170, fuel: 'Diesel', body: 'Pick-up' },
    { make: 'Land Rover', model: 'Defender', power: 200, fuel: 'Diesel', body: 'Fuoristrada' },
    { make: 'Mercedes', model: 'Classe G', power: 286, fuel: 'Diesel', body: 'Fuoristrada' },
  ],
  elettrica: [
    { make: 'Tesla', model: 'Model 3', power: 283, fuel: 'Elettrica', body: 'Berlina EV' },
    { make: 'Tesla', model: 'Model Y', power: 299, fuel: 'Elettrica', body: 'SUV EV' },
    { make: 'Volkswagen', model: 'ID.3', power: 204, fuel: 'Elettrica', body: 'Compatta EV' },
    { make: 'Volkswagen', model: 'ID.4', power: 204, fuel: 'Elettrica', body: 'SUV EV' },
    { make: 'Cupra', model: 'Born', power: 204, fuel: 'Elettrica', body: 'Compatta EV' },
    { make: 'Renault', model: 'Megane E-Tech', power: 220, fuel: 'Elettrica', body: 'Crossover EV' },
    { make: 'Kia', model: 'EV6', power: 229, fuel: 'Elettrica', body: 'Crossover EV' },
    { make: 'Hyundai', model: 'Ioniq 5', power: 217, fuel: 'Elettrica', body: 'Crossover EV' },
    { make: 'MG', model: 'MG4', power: 170, fuel: 'Elettrica', body: 'Compatta EV' },
    { make: 'BYD', model: 'Atto 3', power: 204, fuel: 'Elettrica', body: 'SUV EV' },
    { make: 'Smart', model: '#1', power: 272, fuel: 'Elettrica', body: 'Crossover EV' },
  ],
};

function classifySegment(make: string, model: string): string {
  const norm = `${make} ${model}`.toLowerCase().replace(/[-_.]/g, ' ');

  // 1. Supercars
  if (/911|ferrari|lamborghini|mclaren|aston martin|mc20|r8\b|huracan|aventador|roma|296|f8|sf90|gtb|granturismo|grancabrio|gt-r\b|gtr\b|corvette|artura|720s|765lt|vantage|db11|db12|revuelto|urus|purosangue/.test(norm)) return 'supercar';

  // 2. Pure offroaders & pickups
  if (/wrangler|jimny|land cruiser|hilux|ranger|navara|l200|amarok|classe g\b|g wagen|gladiator/.test(norm)) return 'fuoristrada';

  // 3. Sports cars / Coupé / Spider / Hot Hatch
  if (/mx 5|miata|gr86|gt86|brz|z4|tt\b|718|boxster|cayman|mustang|alpine|a110|abarth|spider|supra|370z|350z|golf gti|golf r|focus st|focus rs|civic type r|megane rs|i30 n|i20 n|yaris gr|gr yaris/.test(norm)) return 'sportiva';

  // 4. Large / Luxury SUVs (D-SUV, E-SUV)
  if (/x3\b|x4\b|x5\b|x6\b|x7\b|q5\b|q7\b|q8\b|glc|gle|gls|macan|cayenne|stelvio|grecale|levante|xc60|xc90|velar|range rover|grand cherokee|model y|f pace|e pace|touareg|rx\b|nx\b|santa fe|sorento|tarraco|edge|explorer|highlander|cx 60|cx 80|defender|discovery\b/.test(norm)) return 'dsuv';

  // 5. C-SUV / Medium Crossovers
  if (/tiguan|rav4|c hr|chr\b|corolla cross|qashqai|3008|5008|tucson|sportage|xceed|kuga|compass|formentor|ateca|karoq|kodiaq|x1\b|x2\b|q3\b|gla\b|glb\b|xc40|tonale|austral|kadjar|arkana|c5 aircross|grandland|cx 5|eclipse cross|cr v|crv\b|hr v|hrv\b|forester|xv\b|crosstrek|ux\b|evoque|discovery sport|hs\b|across|symbioz|rafale|elroq|enyaq|id 4|id 5|ioniq 5|ev6|atto 3/.test(norm)) return 'csuv';

  // 6. B-SUV / Compact Crossovers
  if (/renegade|500x|600\b|t roc|t cross|taigo|yaris cross|2008|captur|puma|juke|kona|bayon|stonic|duster|vitara|s cross|cx 3\b|cx 30|mokka|crossland|frontera|arona|kamiq|avenger|c3 aircross|zs\b|ecosport|tivoli|aceman|countryman|smart #1|smart #3|ex30|ds 3|mokka e|2008 e|e 2008/.test(norm)) return 'bsuv';

  // 7. Monovolume & MPVs
  if (/500l|berlingo|rifter|touran|sharan|caddy|multivan|classe b|b180|b200|classe v|vito|scenic|espace|c max|s max|galaxy|kangoo|doblo|qubo|combo|zafira|lodgy|dokker|jogger|carens|alhambra|altea|roomster|b max|meriva|c4 picasso|spacetourer/.test(norm)) return 'monovolume';

  // 8. Dedicated Electrics (Compact)
  if (/id 3|born|megane e tech|leaf|mg4|byd dolphin|zoe|i3\b/.test(norm)) return 'elettrica';

  // 9. Berlina & Station Wagon Segment D/E
  if (/serie 3|318|320|330|340|serie 5|520|530|540|a4\b|a5\b|a6\b|classe c|c180|c200|c220|classe e|e200|e220|giulia|159|s60|v60|s90|v90|passat|arteon|model 3|superb|508|mondeo|insignia|talisman|camry|mazda 6|avensis|accord|optima|i40|levorg|outback|i4\b|byd seal|polestar/.test(norm)) return 'berlina_d';

  // 10. Citycar (A-Segment)
  if (/panda|500\b|aygo|i10|picanto|twingo|fortwo|forfour|up!|up\b|ypsilon|ignis|celerio|spring|citigo|mii\b|c1\b|108\b|adam\b|ka\b|karl|matiz|seicento|space star|twizy/.test(norm)) return 'citycar';

  // 11. Utilitaria (B-Segment Hatchbacks)
  if (/yaris|clio|208|polo|fiesta|corsa|sandero|c3\b|i20|rio\b|ibiza|fabia|swift|micra|jazz|mito\b|cooper\b|mini\b|punto|grande punto|207|206|mazda 2|colt/.test(norm)) return 'utilitaria';

  // 12. Compatta (C-Segment Hatchbacks)
  if (/golf|a3\b|serie 1|116|118|120|128|135|classe a|a160|a180|a200|a220|focus|corolla|auris|308|megane|leon|octavia|tipo|giulietta|147|astra|i30|ceed|pro ceed|mazda 3|civic|scala|bravo|ds 4|ct200h|ct 200h|pulsar/.test(norm)) return 'compatta';

  // Fallback heuristic based on make/model keywords
  if (/\b(suv|cross|crossover|aircross)\b/.test(norm)) return 'csuv';
  if (/\b(sw|station|touring|avant|wagon|combi|variant|sportstourer)\b/.test(norm)) return 'berlina_d';
  if (/\b(sport|coupe|spider|cabrio|cabriolet|roadster)\b/.test(norm)) return 'sportiva';

  return 'compatta';
}

export function getAlternatives(make: string, model: string): VehicleData[] {
  const currentYear = new Date().getFullYear();
  const segment = classifySegment(make, model);
  const pool = SEGMENT_CANDIDATES[segment] || SEGMENT_CANDIDATES.compatta;
  const normMake = make.toLowerCase();
  const normModel = model.toLowerCase();

  // Filter out the same model and prioritize other makes for genuine market competition
  const candidates = pool.filter(
    (c) => !(c.make.toLowerCase() === normMake && c.model.toLowerCase() === normModel)
  );

  const seenMakes = new Set<string>();
  const selected: VehicleData[] = [];

  // Pass 1: pick 1 car per distinct make
  for (const c of candidates) {
    const cMake = c.make.toLowerCase();
    if (cMake === normMake || seenMakes.has(cMake)) continue;
    seenMakes.add(cMake);
    selected.push({
      make: c.make,
      model: c.model,
      year: currentYear - 3,
      power: `${c.power} CV`,
      fuel: c.fuel,
      body: c.body,
    });
    if (selected.length >= 4) break;
  }

  // Pass 2: if still under 4, fill remaining slots
  if (selected.length < 4) {
    for (const c of candidates) {
      if (selected.some((s) => s.make === c.make && s.model === c.model)) continue;
      selected.push({
        make: c.make,
        model: c.model,
        year: currentYear - 3,
        power: `${c.power} CV`,
        fuel: c.fuel,
        body: c.body,
      });
      if (selected.length >= 4) break;
    }
  }

  return selected;
}
