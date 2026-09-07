/**
 * Calcolo accurato Bollo Auto 2026, Superbollo e Regole Regionali Italiane.
 */

export interface RegionBolloConfig {
  id: string;
  name: string;
  basePerKw: number; // fino a 100 kW (Euro 4-6)
  extraPerKw: number; // oltre 100 kW
  euro3Multiplier: number;
  euro2Multiplier: number;
  euro01Multiplier: number;
  evExemptionYears: number; // 5 di default, 999 = per sempre (es. Lombardia/Piemonte)
  evRateAfterExemption: number; // default 0.25 (paga il 25%)
  hybridExemptionYears: number; // anni di esenzione o sconto
  hybridDiscount: number; // sconto percentuale (es. 0.5 per 50% o 1.0 per 100%)
  gplDiscount: number; // sconto GPL/Metano (default 0.25)
  marketFactor: number; // fattore di mercato regionale per stima usato
  note: string;
}

export const REGIONS_CONFIG: Record<string, RegionBolloConfig> = {
  lombardia: {
    id: 'lombardia',
    name: 'Lombardia',
    basePerKw: 2.58,
    extraPerKw: 3.87,
    euro3Multiplier: 1.1,
    euro2Multiplier: 1.2,
    euro01Multiplier: 1.3,
    evExemptionYears: 999, // Esenzione totale permanente per elettriche pure (BEV)
    evRateAfterExemption: 0.0,
    hybridExemptionYears: 5,
    hybridDiscount: 0.5,
    gplDiscount: 0.25,
    marketFactor: 1.02,
    note: 'Elettriche 100% esenti per sempre. Ibride sconto 50% per 5 anni.',
  },
  piemonte: {
    id: 'piemonte',
    name: 'Piemonte',
    basePerKw: 2.58,
    extraPerKw: 3.87,
    euro3Multiplier: 1.1,
    euro2Multiplier: 1.2,
    euro01Multiplier: 1.3,
    evExemptionYears: 999, // Esenzione totale permanente fino a 100 kW
    evRateAfterExemption: 0.0,
    hybridExemptionYears: 5,
    hybridDiscount: 0.5,
    gplDiscount: 0.25,
    marketFactor: 1.01,
    note: 'Elettriche esenti permanenti fino a 100 kW. Metano/GPL esenzione 5 anni.',
  },
  veneto: {
    id: 'veneto',
    name: 'Veneto',
    basePerKw: 2.58,
    extraPerKw: 3.87,
    euro3Multiplier: 1.1,
    euro2Multiplier: 1.2,
    euro01Multiplier: 1.3,
    evExemptionYears: 5,
    evRateAfterExemption: 0.25,
    hybridExemptionYears: 3,
    hybridDiscount: 1.0,
    gplDiscount: 0.25,
    marketFactor: 1.02,
    note: 'Elettriche 5 anni gratis poi 25%. Ibride nuove esenti per 3 anni.',
  },
  lazio: {
    id: 'lazio',
    name: 'Lazio',
    basePerKw: 2.84,
    extraPerKw: 4.26,
    euro3Multiplier: 1.1,
    euro2Multiplier: 1.2,
    euro01Multiplier: 1.3,
    evExemptionYears: 5,
    evRateAfterExemption: 0.25,
    hybridExemptionYears: 3,
    hybridDiscount: 1.0,
    gplDiscount: 0.25,
    marketFactor: 1.00,
    note: 'Tariffa maggiorata (+10%). Elettriche esenti 5 anni, Ibride esenti 3 anni.',
  },
  campania: {
    id: 'campania',
    name: 'Campania',
    basePerKw: 3.35,
    extraPerKw: 5.03,
    euro3Multiplier: 1.1,
    euro2Multiplier: 1.2,
    euro01Multiplier: 1.3,
    evExemptionYears: 5,
    evRateAfterExemption: 0.25,
    hybridExemptionYears: 3,
    hybridDiscount: 1.0,
    gplDiscount: 0.25,
    marketFactor: 0.98,
    note: 'Tariffa regionale con addizionale. Ibride esenti per i primi 3 anni.',
  },
  emilia_romagna: {
    id: 'emilia_romagna',
    name: 'Emilia-Romagna',
    basePerKw: 2.58,
    extraPerKw: 3.87,
    euro3Multiplier: 1.1,
    euro2Multiplier: 1.2,
    euro01Multiplier: 1.3,
    evExemptionYears: 5,
    evRateAfterExemption: 0.25,
    hybridExemptionYears: 3,
    hybridDiscount: 1.0,
    gplDiscount: 0.25,
    marketFactor: 1.01,
    note: 'Elettriche 5 anni esenti poi 25%. Contributi per ibride nei primi 3 anni.',
  },
  toscana: {
    id: 'toscana',
    name: 'Toscana',
    basePerKw: 2.71,
    extraPerKw: 4.07,
    euro3Multiplier: 1.1,
    euro2Multiplier: 1.2,
    euro01Multiplier: 1.3,
    evExemptionYears: 5,
    evRateAfterExemption: 0.25,
    hybridExemptionYears: 3,
    hybridDiscount: 0.5,
    gplDiscount: 0.25,
    marketFactor: 1.00,
    note: 'Tariffa regionale ACI. Elettriche 5 anni esenti poi 25%.',
  },
  sicilia: {
    id: 'sicilia',
    name: 'Sicilia',
    basePerKw: 2.58,
    extraPerKw: 3.87,
    euro3Multiplier: 1.1,
    euro2Multiplier: 1.2,
    euro01Multiplier: 1.3,
    evExemptionYears: 5,
    evRateAfterExemption: 0.25,
    hybridExemptionYears: 3,
    hybridDiscount: 1.0,
    gplDiscount: 0.25,
    marketFactor: 0.97,
    note: 'Esenzione bollo 3 anni per ibride nuove. Elettriche esenti 5 anni poi 25%.',
  },
  puglia: {
    id: 'puglia',
    name: 'Puglia',
    basePerKw: 2.58,
    extraPerKw: 3.87,
    euro3Multiplier: 1.1,
    euro2Multiplier: 1.2,
    euro01Multiplier: 1.3,
    evExemptionYears: 5,
    evRateAfterExemption: 0.25,
    hybridExemptionYears: 5,
    hybridDiscount: 1.0,
    gplDiscount: 0.25,
    marketFactor: 0.98,
    note: 'Esenzione fino a 5 anni per veicoli ibridi ed elettrici.',
  },
  liguria: {
    id: 'liguria',
    name: 'Liguria',
    basePerKw: 2.84,
    extraPerKw: 4.26,
    euro3Multiplier: 1.1,
    euro2Multiplier: 1.2,
    euro01Multiplier: 1.3,
    evExemptionYears: 5,
    evRateAfterExemption: 0.25,
    hybridExemptionYears: 5,
    hybridDiscount: 1.0,
    gplDiscount: 0.25,
    marketFactor: 1.00,
    note: 'Esenzione 5 anni per ibride ed elettriche immatricolate in regione.',
  },
  marche: {
    id: 'marche',
    name: 'Marche',
    basePerKw: 2.79,
    extraPerKw: 4.18,
    euro3Multiplier: 1.1,
    euro2Multiplier: 1.2,
    euro01Multiplier: 1.3,
    evExemptionYears: 5,
    evRateAfterExemption: 0.25,
    hybridExemptionYears: 6,
    hybridDiscount: 1.0,
    gplDiscount: 0.25,
    marketFactor: 0.99,
    note: 'Esenzione fino a 6 anni per ibride. Elettriche esenti 5 anni.',
  },
  abruzzo: {
    id: 'abruzzo',
    name: 'Abruzzo',
    basePerKw: 3.12,
    extraPerKw: 4.68,
    euro3Multiplier: 1.1,
    euro2Multiplier: 1.2,
    euro01Multiplier: 1.3,
    evExemptionYears: 5,
    evRateAfterExemption: 0.25,
    hybridExemptionYears: 3,
    hybridDiscount: 0.5,
    gplDiscount: 0.25,
    marketFactor: 0.98,
    note: 'Aliquota maggiorata. Elettriche esenti 5 anni poi 25%.',
  },
  calabria: {
    id: 'calabria',
    name: 'Calabria',
    basePerKw: 2.84,
    extraPerKw: 4.26,
    euro3Multiplier: 1.1,
    euro2Multiplier: 1.2,
    euro01Multiplier: 1.3,
    evExemptionYears: 5,
    evRateAfterExemption: 0.25,
    hybridExemptionYears: 3,
    hybridDiscount: 0.5,
    gplDiscount: 0.25,
    marketFactor: 0.97,
    note: 'Tariffa maggiorata ACI. Elettriche 5 anni esenti poi 25%.',
  },
  sardegna: {
    id: 'sardegna',
    name: 'Sardegna',
    basePerKw: 2.58,
    extraPerKw: 3.87,
    euro3Multiplier: 1.1,
    euro2Multiplier: 1.2,
    euro01Multiplier: 1.3,
    evExemptionYears: 5,
    evRateAfterExemption: 0.25,
    hybridExemptionYears: 3,
    hybridDiscount: 0.5,
    gplDiscount: 0.25,
    marketFactor: 0.98,
    note: 'Tariffa base ordinaria ACI. Elettriche 5 anni esenti.',
  },
  trentino_alto_adige: {
    id: 'trentino_alto_adige',
    name: 'Trentino-Alto Adige',
    basePerKw: 2.06,
    extraPerKw: 3.10,
    euro3Multiplier: 1.1,
    euro2Multiplier: 1.2,
    euro01Multiplier: 1.3,
    evExemptionYears: 5,
    evRateAfterExemption: 0.25,
    hybridExemptionYears: 5,
    hybridDiscount: 1.0,
    gplDiscount: 0.25,
    marketFactor: 1.03,
    note: 'Tariffe più basse d’Italia (-20%). Ibride ed elettriche molto agevolate.',
  },
  friuli_venezia_giulia: {
    id: 'friuli_venezia_giulia',
    name: 'Friuli Venezia Giulia',
    basePerKw: 2.58,
    extraPerKw: 3.87,
    euro3Multiplier: 1.1,
    euro2Multiplier: 1.2,
    euro01Multiplier: 1.3,
    evExemptionYears: 5,
    evRateAfterExemption: 0.25,
    hybridExemptionYears: 3,
    hybridDiscount: 0.5,
    gplDiscount: 0.25,
    marketFactor: 1.00,
    note: 'Tariffa standard. Elettriche 5 anni esenti poi 25%.',
  },
  umbria: {
    id: 'umbria',
    name: 'Umbria',
    basePerKw: 2.58,
    extraPerKw: 3.87,
    euro3Multiplier: 1.1,
    euro2Multiplier: 1.2,
    euro01Multiplier: 1.3,
    evExemptionYears: 5,
    evRateAfterExemption: 0.25,
    hybridExemptionYears: 2,
    hybridDiscount: 1.0,
    gplDiscount: 0.25,
    marketFactor: 0.99,
    note: 'Tariffa standard ACI.',
  },
  molise: {
    id: 'molise',
    name: 'Molise',
    basePerKw: 2.76,
    extraPerKw: 4.14,
    euro3Multiplier: 1.1,
    euro2Multiplier: 1.2,
    euro01Multiplier: 1.3,
    evExemptionYears: 5,
    evRateAfterExemption: 0.25,
    hybridExemptionYears: 3,
    hybridDiscount: 0.5,
    gplDiscount: 0.25,
    marketFactor: 0.98,
    note: 'Tariffa con addizionale regionale.',
  },
  basilicata: {
    id: 'basilicata',
    name: 'Basilicata',
    basePerKw: 2.58,
    extraPerKw: 3.87,
    euro3Multiplier: 1.1,
    euro2Multiplier: 1.2,
    euro01Multiplier: 1.3,
    evExemptionYears: 5,
    evRateAfterExemption: 0.25,
    hybridExemptionYears: 5,
    hybridDiscount: 1.0,
    gplDiscount: 0.25,
    marketFactor: 0.98,
    note: 'Esenzione 5 anni per ibride nuove.',
  },
  valle_d_aosta: {
    id: 'valle_d_aosta',
    name: 'Valle d\'Aosta',
    basePerKw: 2.58,
    extraPerKw: 3.87,
    euro3Multiplier: 1.1,
    euro2Multiplier: 1.2,
    euro01Multiplier: 1.3,
    evExemptionYears: 5,
    evRateAfterExemption: 0.25,
    hybridExemptionYears: 5,
    hybridDiscount: 1.0,
    gplDiscount: 0.25,
    marketFactor: 1.00,
    note: 'Esenzione 5 anni per ibride ed elettriche.',
  },
};

/**
 * Risolve la Regione e la Provincia a partire dal CAP italiano (5 cifre)
 */
export function resolveLocationFromCap(capInput?: string): {
  regionId: string;
  regionName: string;
  province?: string;
  city?: string;
} {
  const cap = (capInput || '').trim().replace(/\D/g, '').padStart(5, '0');
  if (cap.length !== 5) {
    return { regionId: 'lombardia', regionName: 'Lombardia', city: 'Milano' };
  }

  const prefix2 = cap.slice(0, 2);

  // Lazio (00xxx - 04xxx)
  if (prefix2 === '00') return { regionId: 'lazio', regionName: 'Lazio', province: 'RM', city: 'Roma' };
  if (prefix2 === '01') return { regionId: 'lazio', regionName: 'Lazio', province: 'VT', city: 'Viterbo' };
  if (prefix2 === '02') return { regionId: 'lazio', regionName: 'Lazio', province: 'RI', city: 'Rieti' };
  if (prefix2 === '03') return { regionId: 'lazio', regionName: 'Lazio', province: 'FR', city: 'Frosinone' };
  if (prefix2 === '04') return { regionId: 'lazio', regionName: 'Lazio', province: 'LT', city: 'Latina' };

  // Sardegna (07xxx - 09xxx)
  if (prefix2 === '07') return { regionId: 'sardegna', regionName: 'Sardegna', province: 'SS', city: 'Sassari' };
  if (prefix2 === '08') return { regionId: 'sardegna', regionName: 'Sardegna', province: 'NU', city: 'Nuoro' };
  if (prefix2 === '09') return { regionId: 'sardegna', regionName: 'Sardegna', province: 'CA', city: 'Cagliari' };

  // Piemonte (10xxx, 12xxx-15xxx, 28xxx) & Valle d'Aosta (11xxx)
  if (prefix2 === '10') return { regionId: 'piemonte', regionName: 'Piemonte', province: 'TO', city: 'Torino' };
  if (prefix2 === '11') return { regionId: 'valle_d_aosta', regionName: 'Valle d\'Aosta', province: 'AO', city: 'Aosta' };
  if (prefix2 === '12') return { regionId: 'piemonte', regionName: 'Piemonte', province: 'CN', city: 'Cuneo' };
  if (prefix2 === '13') return { regionId: 'piemonte', regionName: 'Piemonte', province: 'VC', city: 'Vercelli' };
  if (prefix2 === '14') return { regionId: 'piemonte', regionName: 'Piemonte', province: 'AT', city: 'Asti' };
  if (prefix2 === '15') return { regionId: 'piemonte', regionName: 'Piemonte', province: 'AL', city: 'Alessandria' };
  if (prefix2 === '28') return { regionId: 'piemonte', regionName: 'Piemonte', province: 'NO', city: 'Novara' };

  // Liguria (16xxx - 19xxx)
  if (prefix2 === '16') return { regionId: 'liguria', regionName: 'Liguria', province: 'GE', city: 'Genova' };
  if (prefix2 === '17') return { regionId: 'liguria', regionName: 'Liguria', province: 'SV', city: 'Savona' };
  if (prefix2 === '18') return { regionId: 'liguria', regionName: 'Liguria', province: 'IM', city: 'Imperia' };
  if (prefix2 === '19') return { regionId: 'liguria', regionName: 'Liguria', province: 'SP', city: 'La Spezia' };

  // Lombardia (20xxx - 27xxx)
  if (prefix2 === '20') return { regionId: 'lombardia', regionName: 'Lombardia', province: 'MI', city: 'Milano' };
  if (prefix2 === '21') return { regionId: 'lombardia', regionName: 'Lombardia', province: 'VA', city: 'Varese' };
  if (prefix2 === '22') return { regionId: 'lombardia', regionName: 'Lombardia', province: 'CO', city: 'Como' };
  if (prefix2 === '23') return { regionId: 'lombardia', regionName: 'Lombardia', province: 'LC', city: 'Lecco' };
  if (prefix2 === '24') return { regionId: 'lombardia', regionName: 'Lombardia', province: 'BG', city: 'Bergamo' };
  if (prefix2 === '25') return { regionId: 'lombardia', regionName: 'Lombardia', province: 'BS', city: 'Brescia' };
  if (prefix2 === '26') return { regionId: 'lombardia', regionName: 'Lombardia', province: 'CR', city: 'Cremona' };
  if (prefix2 === '27') return { regionId: 'lombardia', regionName: 'Lombardia', province: 'PV', city: 'Pavia' };

  // Trentino-Alto Adige (38xxx - 39xxx)
  if (prefix2 === '38') return { regionId: 'trentino_alto_adige', regionName: 'Trentino-Alto Adige', province: 'TN', city: 'Trento' };
  if (prefix2 === '39') return { regionId: 'trentino_alto_adige', regionName: 'Trentino-Alto Adige', province: 'BZ', city: 'Bolzano' };

  // Veneto (30xxx - 32xxx, 35xxx - 37xxx)
  if (prefix2 === '30') return { regionId: 'veneto', regionName: 'Veneto', province: 'VE', city: 'Venezia' };
  if (prefix2 === '31') return { regionId: 'veneto', regionName: 'Veneto', province: 'TV', city: 'Treviso' };
  if (prefix2 === '32') return { regionId: 'veneto', regionName: 'Veneto', province: 'BL', city: 'Belluno' };
  if (prefix2 === '35') return { regionId: 'veneto', regionName: 'Veneto', province: 'PD', city: 'Padova' };
  if (prefix2 === '36') return { regionId: 'veneto', regionName: 'Veneto', province: 'VI', city: 'Vicenza' };
  if (prefix2 === '37') return { regionId: 'veneto', regionName: 'Veneto', province: 'VR', city: 'Verona' };

  // Friuli Venezia Giulia (33xxx - 34xxx)
  if (prefix2 === '33') return { regionId: 'friuli_venezia_giulia', regionName: 'Friuli Venezia Giulia', province: 'UD', city: 'Udine' };
  if (prefix2 === '34') return { regionId: 'friuli_venezia_giulia', regionName: 'Friuli Venezia Giulia', province: 'TS', city: 'Trieste' };

  // Emilia-Romagna (29xxx, 40xxx - 48xxx)
  if (prefix2 === '29') return { regionId: 'emilia_romagna', regionName: 'Emilia-Romagna', province: 'PC', city: 'Piacenza' };
  if (prefix2 === '40') return { regionId: 'emilia_romagna', regionName: 'Emilia-Romagna', province: 'BO', city: 'Bologna' };
  if (prefix2 === '41') return { regionId: 'emilia_romagna', regionName: 'Emilia-Romagna', province: 'MO', city: 'Modena' };
  if (prefix2 === '42') return { regionId: 'emilia_romagna', regionName: 'Emilia-Romagna', province: 'RE', city: 'Reggio Emilia' };
  if (prefix2 === '43') return { regionId: 'emilia_romagna', regionName: 'Emilia-Romagna', province: 'PR', city: 'Parma' };
  if (prefix2 === '44') return { regionId: 'emilia_romagna', regionName: 'Emilia-Romagna', province: 'FE', city: 'Ferrara' };
  if (prefix2 === '47') return { regionId: 'emilia_romagna', regionName: 'Emilia-Romagna', province: 'FC', city: 'Forlì' };
  if (prefix2 === '48') return { regionId: 'emilia_romagna', regionName: 'Emilia-Romagna', province: 'RA', city: 'Ravenna' };

  // Toscana (50xxx - 59xxx)
  if (prefix2 === '50') return { regionId: 'toscana', regionName: 'Toscana', province: 'FI', city: 'Firenze' };
  if (prefix2 === '51') return { regionId: 'toscana', regionName: 'Toscana', province: 'PT', city: 'Pistoia' };
  if (prefix2 === '52') return { regionId: 'toscana', regionName: 'Toscana', province: 'AR', city: 'Arezzo' };
  if (prefix2 === '53') return { regionId: 'toscana', regionName: 'Toscana', province: 'SI', city: 'Siena' };
  if (prefix2 === '54') return { regionId: 'toscana', regionName: 'Toscana', province: 'MS', city: 'Massa' };
  if (prefix2 === '55') return { regionId: 'toscana', regionName: 'Toscana', province: 'LU', city: 'Lucca' };
  if (prefix2 === '56') return { regionId: 'toscana', regionName: 'Toscana', province: 'PI', city: 'Pisa' };
  if (prefix2 === '57') return { regionId: 'toscana', regionName: 'Toscana', province: 'LI', city: 'Livorno' };
  if (prefix2 === '58') return { regionId: 'toscana', regionName: 'Toscana', province: 'GR', city: 'Grosseto' };
  if (prefix2 === '59') return { regionId: 'toscana', regionName: 'Toscana', province: 'PO', city: 'Prato' };

  // Marche (60xxx - 63xxx)
  if (prefix2 === '60') return { regionId: 'marche', regionName: 'Marche', province: 'AN', city: 'Ancona' };
  if (prefix2 === '61') return { regionId: 'marche', regionName: 'Marche', province: 'PU', city: 'Pesaro' };
  if (prefix2 === '62') return { regionId: 'marche', regionName: 'Marche', province: 'MC', city: 'Macerata' };
  if (prefix2 === '63') return { regionId: 'marche', regionName: 'Marche', province: 'AP', city: 'Ascoli Piceno' };

  // Umbria (05xxx, 06xxx)
  if (prefix2 === '05') return { regionId: 'umbria', regionName: 'Umbria', province: 'TR', city: 'Terni' };
  if (prefix2 === '06') return { regionId: 'umbria', regionName: 'Umbria', province: 'PG', city: 'Perugia' };

  // Abruzzo (64xxx - 67xxx)
  if (prefix2 === '64') return { regionId: 'abruzzo', regionName: 'Abruzzo', province: 'TE', city: 'Teramo' };
  if (prefix2 === '65') return { regionId: 'abruzzo', regionName: 'Abruzzo', province: 'PE', city: 'Pescara' };
  if (prefix2 === '66') return { regionId: 'abruzzo', regionName: 'Abruzzo', province: 'CH', city: 'Chieti' };
  if (prefix2 === '67') return { regionId: 'abruzzo', regionName: 'Abruzzo', province: 'AQ', city: 'L\'Aquila' };

  // Molise (86xxx)
  if (prefix2 === '86') return { regionId: 'molise', regionName: 'Molise', province: 'CB', city: 'Campobasso' };

  // Campania (80xxx - 84xxx)
  if (prefix2 === '80') return { regionId: 'campania', regionName: 'Campania', province: 'NA', city: 'Napoli' };
  if (prefix2 === '81') return { regionId: 'campania', regionName: 'Campania', province: 'CE', city: 'Caserta' };
  if (prefix2 === '82') return { regionId: 'campania', regionName: 'Campania', province: 'BN', city: 'Benevento' };
  if (prefix2 === '83') return { regionId: 'campania', regionName: 'Campania', province: 'AV', city: 'Avellino' };
  if (prefix2 === '84') return { regionId: 'campania', regionName: 'Campania', province: 'SA', city: 'Salerno' };

  // Puglia (70xxx - 74xxx)
  if (prefix2 === '70') return { regionId: 'puglia', regionName: 'Puglia', province: 'BA', city: 'Bari' };
  if (prefix2 === '71') return { regionId: 'puglia', regionName: 'Puglia', province: 'FG', city: 'Foggia' };
  if (prefix2 === '72') return { regionId: 'puglia', regionName: 'Puglia', province: 'BR', city: 'Brindisi' };
  if (prefix2 === '73') return { regionId: 'puglia', regionName: 'Puglia', province: 'LE', city: 'Lecce' };
  if (prefix2 === '74') return { regionId: 'puglia', regionName: 'Puglia', province: 'TA', city: 'Taranto' };

  // Basilicata (75xxx, 85xxx)
  if (prefix2 === '75') return { regionId: 'basilicata', regionName: 'Basilicata', province: 'MT', city: 'Matera' };
  if (prefix2 === '85') return { regionId: 'basilicata', regionName: 'Basilicata', province: 'PZ', city: 'Potenza' };

  // Calabria (87xxx - 89xxx)
  if (prefix2 === '87') return { regionId: 'calabria', regionName: 'Calabria', province: 'CS', city: 'Cosenza' };
  if (prefix2 === '88') return { regionId: 'calabria', regionName: 'Calabria', province: 'CZ', city: 'Catanzaro' };
  if (prefix2 === '89') return { regionId: 'calabria', regionName: 'Calabria', province: 'RC', city: 'Reggio Calabria' };

  // Sicilia (90xxx - 98xxx)
  if (prefix2 === '90') return { regionId: 'sicilia', regionName: 'Sicilia', province: 'PA', city: 'Palermo' };
  if (prefix2 === '91') return { regionId: 'sicilia', regionName: 'Sicilia', province: 'TP', city: 'Trapani' };
  if (prefix2 === '92') return { regionId: 'sicilia', regionName: 'Sicilia', province: 'AG', city: 'Agrigento' };
  if (prefix2 === '93') return { regionId: 'sicilia', regionName: 'Sicilia', province: 'CL', city: 'Caltanissetta' };
  if (prefix2 === '94') return { regionId: 'sicilia', regionName: 'Sicilia', province: 'EN', city: 'Enna' };
  if (prefix2 === '95') return { regionId: 'sicilia', regionName: 'Sicilia', province: 'CT', city: 'Catania' };
  if (prefix2 === '96') return { regionId: 'sicilia', regionName: 'Sicilia', province: 'SR', city: 'Siracusa' };
  if (prefix2 === '97') return { regionId: 'sicilia', regionName: 'Sicilia', province: 'RG', city: 'Ragusa' };
  if (prefix2 === '98') return { regionId: 'sicilia', regionName: 'Sicilia', province: 'ME', city: 'Messina' };

  return { regionId: 'lombardia', regionName: 'Lombardia', city: 'Milano' };
}

export function extractKw(powerInput?: string | number): number {
  if (!powerInput) return 75;

  if (typeof powerInput === 'number') {
    return powerInput > 170 ? Math.round(powerInput * 0.735499) : powerInput;
  }

  const str = String(powerInput).trim().toLowerCase();

  const kwMatch = str.match(/(\d+(?:[.,]\d+)?)\s*kw/i);
  if (kwMatch) {
    return Math.round(parseFloat(kwMatch[1].replace(',', '.')));
  }

  const cvMatch = str.match(/(\d+(?:[.,]\d+)?)\s*(?:cv|hp|cavall)/i);
  if (cvMatch) {
    const cv = parseFloat(cvMatch[1].replace(',', '.'));
    return Math.round(cv * 0.735499);
  }

  const digits = parseInt(str.replace(/\D/g, ''), 10);
  if (!isNaN(digits) && digits > 0) {
    return digits > 170 ? Math.round(digits * 0.735499) : digits;
  }

  return 75;
}

export function calculateBolloAccurate(
  powerInput?: string | number,
  fuelInput?: string,
  yearInput?: number,
  regionInput?: string,
  euroClassInput?: string
): {
  bolloBase: number;
  superbollo: number;
  totale: number;
  isElectricExempt: boolean;
  regionName: string;
  regionalNote: string;
} {
  const kw = extractKw(powerInput);
  const fuel = (fuelInput || '').toLowerCase();
  const currentYear = new Date().getFullYear();
  const age = Math.max(0, currentYear - (yearInput || currentYear - 5));

  const cleanRegion = (regionInput || 'lombardia').toLowerCase().trim().replace(/[\s-]+/g, '_');
  const regConfig = REGIONS_CONFIG[cleanRegion] || REGIONS_CONFIG.lombardia;

  if (kw <= 0) {
    return {
      bolloBase: 0,
      superbollo: 0,
      totale: 0,
      isElectricExempt: false,
      regionName: regConfig.name,
      regionalNote: regConfig.note,
    };
  }

  // 1. Esenzione Elettrica (BEV)
  const isEv = fuel.includes('elettr') || fuel.includes('bev') || fuel === 'ev';
  if (isEv) {
    if (age <= regConfig.evExemptionYears) {
      return {
        bolloBase: 0,
        superbollo: 0,
        totale: 0,
        isElectricExempt: true,
        regionName: regConfig.name,
        regionalNote: regConfig.evExemptionYears > 10
          ? `${regConfig.name}: Esenzione 100% permanente per auto elettriche.`
          : `${regConfig.name}: Esenzione totale per i primi ${regConfig.evExemptionYears} anni.`,
      };
    }
    const baseRate = kw <= 100 ? kw * regConfig.basePerKw : 100 * regConfig.basePerKw + (kw - 100) * regConfig.extraPerKw;
    const bolloBase = Math.round(baseRate * regConfig.evRateAfterExemption);
    return {
      bolloBase,
      superbollo: 0,
      totale: bolloBase,
      isElectricExempt: false,
      regionName: regConfig.name,
      regionalNote: `${regConfig.name}: Tariffa ridotta al ${Math.round(regConfig.evRateAfterExemption * 100)}% dopo i primi ${regConfig.evExemptionYears} anni.`,
    };
  }

  // 2. Calcolo Ordinario (Euro 4 - Euro 6)
  let baseRate = kw <= 100 ? kw * regConfig.basePerKw : 100 * regConfig.basePerKw + (kw - 100) * regConfig.extraPerKw;

  // Moltiplicatori classe Euro
  const euro = (euroClassInput || 'euro6').toLowerCase();
  if (euro.includes('euro3')) baseRate *= regConfig.euro3Multiplier;
  else if (euro.includes('euro2')) baseRate *= regConfig.euro2Multiplier;
  else if (euro.includes('euro0') || euro.includes('euro1')) baseRate *= regConfig.euro01Multiplier;

  // Auto ibride (HEV / PHEV)
  const isHybrid = fuel.includes('ibrid') || fuel.includes('hybrid') || fuel.includes('phev') || fuel.includes('hev');
  if (isHybrid && age <= regConfig.hybridExemptionYears) {
    baseRate *= (1 - regConfig.hybridDiscount);
  }

  // Auto GPL / Metano
  const isGas = fuel.includes('gpl') || fuel.includes('metano') || fuel.includes('cng') || fuel.includes('lpg');
  if (isGas) {
    baseRate *= (1 - regConfig.gplDiscount);
  }

  // Auto storiche (over 30 o over 20 anni)
  if (age >= 30) {
    return {
      bolloBase: 30,
      superbollo: 0,
      totale: 30,
      isElectricExempt: false,
      regionName: regConfig.name,
      regionalNote: 'Auto storica (>30 anni): tassa di circolazione forfettaria (30 € se circola).',
    };
  } else if (age >= 20) {
    baseRate *= 0.5;
  }

  let bolloBase = Math.round(baseRate);

  // 3. Superbollo (potenza > 185 kW) per motori termici
  let superbollo = 0;
  if (kw > 185 && !isEv) {
    const extraKw = kw - 185;
    let ratePerKw = 20;
    if (age >= 20) ratePerKw = 0;
    else if (age >= 15) ratePerKw = 3;
    else if (age >= 10) ratePerKw = 6;
    else if (age >= 5) ratePerKw = 12;

    superbollo = Math.round(extraKw * ratePerKw);
  }

  const totale = bolloBase + superbollo;
  return {
    bolloBase,
    superbollo,
    totale,
    isElectricExempt: false,
    regionName: regConfig.name,
    regionalNote: isHybrid && age <= regConfig.hybridExemptionYears
      ? `${regConfig.name}: Agevolazione ibrida attiva (${Math.round(regConfig.hybridDiscount * 100)}% sconto nei primi ${regConfig.hybridExemptionYears} anni).`
      : superbollo > 0
      ? `${regConfig.name}: Include ${superbollo} € di Superbollo (>185 kW).`
      : regConfig.note,
  };
}
