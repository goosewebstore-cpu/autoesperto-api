/**
 * Database e logica di identificazione dell'era di produzione per modelli italiani ed europei.
 * Permette di determinare con precisione l'anno tipico di produzione, il listino storico
 * originale e la carrozzeria/alimentazione tipica per vetture usate e fuori produzione.
 */

export interface ModelEraInfo {
  productionStart: number;
  productionEnd: number;
  medianYear: number;
  basePrice: number;
  fuel?: string;
  body?: string;
  powerCv?: number;
}

function normalizeKey(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/**
 * Mappatura dettagliata di modelli storici, fuori produzione o con generazioni celebri in Italia.
 */
const MODEL_ERA_MAP: Record<string, ModelEraInfo> = {
  // Alfa Romeo
  'alfa romeo 147': { productionStart: 2000, productionEnd: 2010, medianYear: 2006, basePrice: 20500, fuel: 'Diesel', body: 'Berlina', powerCv: 120 },
  'alfa romeo 156': { productionStart: 1997, productionEnd: 2005, medianYear: 2002, basePrice: 21500, fuel: 'Diesel', body: 'Berlina', powerCv: 115 },
  'alfa romeo 159': { productionStart: 2005, productionEnd: 2011, medianYear: 2008, basePrice: 26500, fuel: 'Diesel', body: 'Berlina', powerCv: 150 },
  'alfa romeo gt': { productionStart: 2003, productionEnd: 2010, medianYear: 2007, basePrice: 26500, fuel: 'Diesel', body: 'Coupé', powerCv: 150 },
  'alfa romeo brera': { productionStart: 2005, productionEnd: 2010, medianYear: 2008, basePrice: 34000, fuel: 'Diesel', body: 'Coupé', powerCv: 200 },
  'alfa romeo spider': { productionStart: 2006, productionEnd: 2010, medianYear: 2008, basePrice: 35000, fuel: 'Benzina', body: 'Cabrio', powerCv: 185 },
  'alfa romeo mito': { productionStart: 2008, productionEnd: 2018, medianYear: 2013, basePrice: 17500, fuel: 'Benzina', body: 'Utilitaria', powerCv: 78 },
  'alfa romeo giulietta': { productionStart: 2010, productionEnd: 2020, medianYear: 2015, basePrice: 24500, fuel: 'Diesel', body: 'Berlina', powerCv: 120 },
  'alfa romeo 145': { productionStart: 1994, productionEnd: 2001, medianYear: 1998, basePrice: 15000, fuel: 'Benzina', body: 'Berlina', powerCv: 103 },
  'alfa romeo 146': { productionStart: 1995, productionEnd: 2001, medianYear: 1998, basePrice: 16000, fuel: 'Benzina', body: 'Berlina', powerCv: 103 },
  'alfa romeo 166': { productionStart: 1998, productionEnd: 2007, medianYear: 2003, basePrice: 35000, fuel: 'Diesel', body: 'Berlina', powerCv: 150 },

  // Fiat
  'fiat punto': { productionStart: 1993, productionEnd: 2018, medianYear: 2007, basePrice: 13500, fuel: 'Benzina', body: 'Utilitaria', powerCv: 60 },
  'fiat grande punto': { productionStart: 2005, productionEnd: 2012, medianYear: 2008, basePrice: 14500, fuel: 'Diesel', body: 'Utilitaria', powerCv: 75 },
  'fiat punto evo': { productionStart: 2009, productionEnd: 2012, medianYear: 2011, basePrice: 15000, fuel: 'Diesel', body: 'Utilitaria', powerCv: 75 },
  'fiat stilo': { productionStart: 2001, productionEnd: 2008, medianYear: 2004, basePrice: 16500, fuel: 'Diesel', body: 'Berlina', powerCv: 115 },
  'fiat bravo': { productionStart: 2007, productionEnd: 2014, medianYear: 2010, basePrice: 19500, fuel: 'Diesel', body: 'Berlina', powerCv: 120 },
  'fiat seicento': { productionStart: 1998, productionEnd: 2010, medianYear: 2004, basePrice: 8900, fuel: 'Benzina', body: 'Citycar', powerCv: 54 },
  'fiat multipla': { productionStart: 1998, productionEnd: 2010, medianYear: 2005, basePrice: 18500, fuel: 'Metano', body: 'Monovolume', powerCv: 103 },
  'fiat croma': { productionStart: 2005, productionEnd: 2010, medianYear: 2008, basePrice: 25000, fuel: 'Diesel', body: 'Station wagon', powerCv: 150 },
  'fiat sedici': { productionStart: 2006, productionEnd: 2014, medianYear: 2010, basePrice: 21000, fuel: 'Diesel', body: 'SUV', powerCv: 120 },
  'fiat idea': { productionStart: 2003, productionEnd: 2012, medianYear: 2007, basePrice: 15500, fuel: 'Diesel', body: 'Monovolume', powerCv: 90 },
  'fiat doblo': { productionStart: 2000, productionEnd: 2010, medianYear: 2006, basePrice: 16000, fuel: 'Diesel', body: 'Monovolume', powerCv: 105 },
  'fiat ulysse': { productionStart: 1994, productionEnd: 2010, medianYear: 2005, basePrice: 26000, fuel: 'Diesel', body: 'Monovolume', powerCv: 120 },
  'fiat freemont': { productionStart: 2011, productionEnd: 2016, medianYear: 2013, basePrice: 29000, fuel: 'Diesel', body: 'SUV', powerCv: 140 },
  'fiat barchetta': { productionStart: 1995, productionEnd: 2005, medianYear: 2000, basePrice: 18000, fuel: 'Benzina', body: 'Spider', powerCv: 130 },
  'fiat coupe': { productionStart: 1993, productionEnd: 2000, medianYear: 1997, basePrice: 22000, fuel: 'Benzina', body: 'Coupé', powerCv: 139 },

  // Lancia
  'lancia ypsilon': { productionStart: 2003, productionEnd: 2024, medianYear: 2014, basePrice: 15500, fuel: 'Benzina', body: 'Citycar', powerCv: 69 },
  'lancia y': { productionStart: 1995, productionEnd: 2003, medianYear: 1999, basePrice: 11500, fuel: 'Benzina', body: 'Citycar', powerCv: 60 },
  'lancia musa': { productionStart: 2004, productionEnd: 2012, medianYear: 2008, basePrice: 17500, fuel: 'Diesel', body: 'Monovolume', powerCv: 90 },
  'lancia delta': { productionStart: 2008, productionEnd: 2014, medianYear: 2011, basePrice: 23500, fuel: 'Diesel', body: 'Berlina', powerCv: 120 },
  'lancia lybra': { productionStart: 1999, productionEnd: 2005, medianYear: 2002, basePrice: 23000, fuel: 'Diesel', body: 'Berlina', powerCv: 115 },
  'lancia thesis': { productionStart: 2002, productionEnd: 2009, medianYear: 2005, basePrice: 38000, fuel: 'Diesel', body: 'Berlina', powerCv: 175 },
  'lancia phedra': { productionStart: 2002, productionEnd: 2010, medianYear: 2006, basePrice: 32000, fuel: 'Diesel', body: 'Monovolume', powerCv: 136 },

  // Peugeot
  'peugeot 206': { productionStart: 1998, productionEnd: 2012, medianYear: 2005, basePrice: 13500, fuel: 'Diesel', body: 'Utilitaria', powerCv: 68 },
  'peugeot 207': { productionStart: 2006, productionEnd: 2014, medianYear: 2009, basePrice: 15500, fuel: 'Diesel', body: 'Utilitaria', powerCv: 68 },
  'peugeot 307': { productionStart: 2001, productionEnd: 2008, medianYear: 2005, basePrice: 18500, fuel: 'Diesel', body: 'Berlina', powerCv: 90 },
  'peugeot 106': { productionStart: 1991, productionEnd: 2003, medianYear: 1998, basePrice: 10500, fuel: 'Benzina', body: 'Citycar', powerCv: 60 },
  'peugeot 107': { productionStart: 2005, productionEnd: 2014, medianYear: 2009, basePrice: 11500, fuel: 'Benzina', body: 'Citycar', powerCv: 68 },
  'peugeot 406': { productionStart: 1995, productionEnd: 2004, medianYear: 2000, basePrice: 22000, fuel: 'Diesel', body: 'Berlina', powerCv: 110 },
  'peugeot 407': { productionStart: 2004, productionEnd: 2011, medianYear: 2007, basePrice: 25000, fuel: 'Diesel', body: 'Berlina', powerCv: 136 },
  'peugeot 1007': { productionStart: 2005, productionEnd: 2009, medianYear: 2007, basePrice: 15000, fuel: 'Benzina', body: 'Monovolume', powerCv: 75 },
  'peugeot rcz': { productionStart: 2010, productionEnd: 2015, medianYear: 2012, basePrice: 29000, fuel: 'Benzina', body: 'Coupé', powerCv: 156 },

  // Renault
  'renault clio 2': { productionStart: 1998, productionEnd: 2005, medianYear: 2002, basePrice: 13000, fuel: 'Diesel', body: 'Utilitaria', powerCv: 65 },
  'renault clio 3': { productionStart: 2005, productionEnd: 2012, medianYear: 2008, basePrice: 15000, fuel: 'Diesel', body: 'Utilitaria', powerCv: 75 },
  'renault megane 2': { productionStart: 2002, productionEnd: 2008, medianYear: 2005, basePrice: 19000, fuel: 'Diesel', body: 'Berlina', powerCv: 105 },
  'renault megane 3': { productionStart: 2008, productionEnd: 2016, medianYear: 2012, basePrice: 21000, fuel: 'Diesel', body: 'Berlina', powerCv: 110 },
  'renault scenic 2': { productionStart: 2003, productionEnd: 2009, medianYear: 2006, basePrice: 21000, fuel: 'Diesel', body: 'Monovolume', powerCv: 105 },
  'renault modus': { productionStart: 2004, productionEnd: 2012, medianYear: 2008, basePrice: 15000, fuel: 'Diesel', body: 'Monovolume', powerCv: 75 },
  'renault twingo 1': { productionStart: 1993, productionEnd: 2007, medianYear: 2002, basePrice: 10500, fuel: 'Benzina', body: 'Citycar', powerCv: 58 },
  'renault twingo 2': { productionStart: 2007, productionEnd: 2014, medianYear: 2010, basePrice: 12500, fuel: 'Benzina', body: 'Citycar', powerCv: 75 },
  'renault laguna': { productionStart: 2001, productionEnd: 2015, medianYear: 2008, basePrice: 24000, fuel: 'Diesel', body: 'Berlina', powerCv: 130 },

  // Volkswagen
  'volkswagen golf 4': { productionStart: 1997, productionEnd: 2004, medianYear: 2002, basePrice: 19500, fuel: 'Diesel', body: 'Berlina', powerCv: 101 },
  'volkswagen golf 5': { productionStart: 2003, productionEnd: 2008, medianYear: 2006, basePrice: 22000, fuel: 'Diesel', body: 'Berlina', powerCv: 105 },
  'volkswagen golf 6': { productionStart: 2008, productionEnd: 2012, medianYear: 2010, basePrice: 24000, fuel: 'Diesel', body: 'Berlina', powerCv: 105 },
  'volkswagen polo 4': { productionStart: 2001, productionEnd: 2009, medianYear: 2005, basePrice: 14500, fuel: 'Diesel', body: 'Utilitaria', powerCv: 75 },
  'volkswagen lupo': { productionStart: 1998, productionEnd: 2005, medianYear: 2002, basePrice: 11500, fuel: 'Benzina', body: 'Citycar', powerCv: 50 },
  'volkswagen fox': { productionStart: 2005, productionEnd: 2011, medianYear: 2008, basePrice: 11000, fuel: 'Benzina', body: 'Citycar', powerCv: 55 },
  'volkswagen passat b5': { productionStart: 1996, productionEnd: 2005, medianYear: 2001, basePrice: 26000, fuel: 'Diesel', body: 'Berlina', powerCv: 130 },
  'volkswagen passat b6': { productionStart: 2005, productionEnd: 2010, medianYear: 2008, basePrice: 29000, fuel: 'Diesel', body: 'Berlina', powerCv: 140 },
  'volkswagen touran': { productionStart: 2003, productionEnd: 2015, medianYear: 2009, basePrice: 24000, fuel: 'Diesel', body: 'Monovolume', powerCv: 105 },
  'volkswagen new beetle': { productionStart: 1998, productionEnd: 2011, medianYear: 2005, basePrice: 21000, fuel: 'Diesel', body: 'Berlina', powerCv: 105 },
  'volkswagen scirocco': { productionStart: 2008, productionEnd: 2017, medianYear: 2012, basePrice: 27000, fuel: 'Benzina', body: 'Coupé', powerCv: 160 },

  // Ford
  'ford fiesta mk5': { productionStart: 2002, productionEnd: 2008, medianYear: 2006, basePrice: 13500, fuel: 'Diesel', body: 'Utilitaria', powerCv: 68 },
  'ford focus 1': { productionStart: 1998, productionEnd: 2004, medianYear: 2002, basePrice: 17000, fuel: 'Diesel', body: 'Berlina', powerCv: 100 },
  'ford focus 2': { productionStart: 2004, productionEnd: 2011, medianYear: 2007, basePrice: 19500, fuel: 'Diesel', body: 'Berlina', powerCv: 110 },
  'ford ka': { productionStart: 1996, productionEnd: 2016, medianYear: 2008, basePrice: 11500, fuel: 'Benzina', body: 'Citycar', powerCv: 69 },
  'ford fusion': { productionStart: 2002, productionEnd: 2012, medianYear: 2007, basePrice: 15000, fuel: 'Diesel', body: 'Utilitaria', powerCv: 68 },
  'ford c max': { productionStart: 2003, productionEnd: 2010, medianYear: 2007, basePrice: 21000, fuel: 'Diesel', body: 'Monovolume', powerCv: 109 },
  'ford mondeo 3': { productionStart: 2000, productionEnd: 2007, medianYear: 2004, basePrice: 23000, fuel: 'Diesel', body: 'Berlina', powerCv: 130 },

  // Citroen
  'citroen c1': { productionStart: 2005, productionEnd: 2014, medianYear: 2009, basePrice: 11000, fuel: 'Benzina', body: 'Citycar', powerCv: 68 },
  'citroen c2': { productionStart: 2003, productionEnd: 2009, medianYear: 2006, basePrice: 13500, fuel: 'Diesel', body: 'Utilitaria', powerCv: 68 },
  'citroen c4 1': { productionStart: 2004, productionEnd: 2010, medianYear: 2007, basePrice: 18500, fuel: 'Diesel', body: 'Berlina', powerCv: 110 },
  'citroen xsara picasso': { productionStart: 1999, productionEnd: 2010, medianYear: 2005, basePrice: 18000, fuel: 'Diesel', body: 'Monovolume', powerCv: 90 },
  'citroen saxo': { productionStart: 1996, productionEnd: 2003, medianYear: 2000, basePrice: 10000, fuel: 'Benzina', body: 'Citycar', powerCv: 60 },

  // Opel
  'opel corsa c': { productionStart: 2000, productionEnd: 2006, medianYear: 2004, basePrice: 13000, fuel: 'Diesel', body: 'Utilitaria', powerCv: 70 },
  'opel corsa d': { productionStart: 2006, productionEnd: 2014, medianYear: 2010, basePrice: 14500, fuel: 'Diesel', body: 'Utilitaria', powerCv: 75 },
  'opel astra g': { productionStart: 1998, productionEnd: 2004, medianYear: 2002, basePrice: 17000, fuel: 'Diesel', body: 'Berlina', powerCv: 101 },
  'opel astra h': { productionStart: 2004, productionEnd: 2009, medianYear: 2007, basePrice: 19500, fuel: 'Diesel', body: 'Berlina', powerCv: 101 },
  'opel meriva': { productionStart: 2003, productionEnd: 2010, medianYear: 2006, basePrice: 16000, fuel: 'Diesel', body: 'Monovolume', powerCv: 75 },
  'opel zafira': { productionStart: 1999, productionEnd: 2011, medianYear: 2005, basePrice: 22000, fuel: 'Diesel', body: 'Monovolume', powerCv: 120 },
  'opel agila': { productionStart: 2000, productionEnd: 2007, medianYear: 2004, basePrice: 11500, fuel: 'Benzina', body: 'Citycar', powerCv: 58 },

  // Smart
  'smart fortwo': { productionStart: 1998, productionEnd: 2014, medianYear: 2008, basePrice: 12500, fuel: 'Benzina', body: 'Citycar', powerCv: 71 },
  'smart forfour': { productionStart: 2004, productionEnd: 2006, medianYear: 2005, basePrice: 14500, fuel: 'Benzina', body: 'Citycar', powerCv: 75 },
  'smart roadster': { productionStart: 2003, productionEnd: 2006, medianYear: 2005, basePrice: 18500, fuel: 'Benzina', body: 'Spider', powerCv: 82 },

  // Audi
  'audi a3 8l': { productionStart: 1996, productionEnd: 2003, medianYear: 2000, basePrice: 23000, fuel: 'Diesel', body: 'Berlina', powerCv: 110 },
  'audi a3 8p': { productionStart: 2003, productionEnd: 2012, medianYear: 2007, basePrice: 26000, fuel: 'Diesel', body: 'Berlina', powerCv: 140 },
  'audi a4 b6': { productionStart: 2000, productionEnd: 2004, medianYear: 2002, basePrice: 31000, fuel: 'Diesel', body: 'Berlina', powerCv: 130 },
  'audi a4 b7': { productionStart: 2004, productionEnd: 2008, medianYear: 2006, basePrice: 34000, fuel: 'Diesel', body: 'Berlina', powerCv: 140 },
  'audi tt 8n': { productionStart: 1998, productionEnd: 2006, medianYear: 2002, basePrice: 34000, fuel: 'Benzina', body: 'Coupé', powerCv: 180 },

  // BMW
  'bmw serie 3 e46': { productionStart: 1998, productionEnd: 2005, medianYear: 2002, basePrice: 32000, fuel: 'Diesel', body: 'Berlina', powerCv: 136 },
  'bmw serie 3 e90': { productionStart: 2005, productionEnd: 2011, medianYear: 2008, basePrice: 36000, fuel: 'Diesel', body: 'Berlina', powerCv: 177 },
  'bmw serie 1 e87': { productionStart: 2004, productionEnd: 2011, medianYear: 2007, basePrice: 27000, fuel: 'Diesel', body: 'Berlina', powerCv: 122 },
  'bmw x3 e83': { productionStart: 2003, productionEnd: 2010, medianYear: 2006, basePrice: 39000, fuel: 'Diesel', body: 'SUV', powerCv: 150 },
  'bmw x5 e53': { productionStart: 1999, productionEnd: 2006, medianYear: 2003, basePrice: 55000, fuel: 'Diesel', body: 'SUV', powerCv: 184 },

  // Mercedes
  'mercedes classe a w168': { productionStart: 1997, productionEnd: 2004, medianYear: 2001, basePrice: 20000, fuel: 'Diesel', body: 'Monovolume', powerCv: 75 },
  'mercedes classe a w169': { productionStart: 2004, productionEnd: 2012, medianYear: 2008, basePrice: 23000, fuel: 'Diesel', body: 'Monovolume', powerCv: 109 },
  'mercedes classe c w203': { productionStart: 2000, productionEnd: 2007, medianYear: 2004, basePrice: 33000, fuel: 'Diesel', body: 'Berlina', powerCv: 143 },
  'mercedes classe e w211': { productionStart: 2002, productionEnd: 2009, medianYear: 2005, basePrice: 45000, fuel: 'Diesel', body: 'Berlina', powerCv: 150 },
  'mercedes classe b w245': { productionStart: 2005, productionEnd: 2011, medianYear: 2008, basePrice: 27000, fuel: 'Diesel', body: 'Monovolume', powerCv: 109 },
  'mercedes slk r170': { productionStart: 1996, productionEnd: 2004, medianYear: 2000, basePrice: 35000, fuel: 'Benzina', body: 'Spider', powerCv: 163 },

  // Toyota
  'toyota yaris 1': { productionStart: 1999, productionEnd: 2005, medianYear: 2003, basePrice: 12500, fuel: 'Benzina', body: 'Utilitaria', powerCv: 68 },
  'toyota yaris 2': { productionStart: 2005, productionEnd: 2011, medianYear: 2008, basePrice: 14500, fuel: 'Diesel', body: 'Utilitaria', powerCv: 90 },
  'toyota aygo 1': { productionStart: 2005, productionEnd: 2014, medianYear: 2009, basePrice: 11000, fuel: 'Benzina', body: 'Citycar', powerCv: 68 },
  'toyota auris': { productionStart: 2007, productionEnd: 2018, medianYear: 2012, basePrice: 21000, fuel: 'Diesel', body: 'Berlina', powerCv: 116 },
  'toyota rav4': { productionStart: 2000, productionEnd: 2012, medianYear: 2006, basePrice: 28000, fuel: 'Diesel', body: 'SUV', powerCv: 136 },

  // Seat
  'seat ibiza 3': { productionStart: 2002, productionEnd: 2008, medianYear: 2005, basePrice: 13500, fuel: 'Diesel', body: 'Utilitaria', powerCv: 75 },
  'seat ibiza 4': { productionStart: 2008, productionEnd: 2017, medianYear: 2012, basePrice: 15000, fuel: 'Diesel', body: 'Utilitaria', powerCv: 75 },
  'seat leon 1': { productionStart: 1999, productionEnd: 2005, medianYear: 2002, basePrice: 18000, fuel: 'Diesel', body: 'Berlina', powerCv: 110 },
  'seat leon 2': { productionStart: 2005, productionEnd: 2012, medianYear: 2008, basePrice: 20500, fuel: 'Diesel', body: 'Berlina', powerCv: 105 },
  'seat altea': { productionStart: 2004, productionEnd: 2015, medianYear: 2009, basePrice: 19500, fuel: 'Diesel', body: 'Monovolume', powerCv: 105 },

  // Nissan
  'nissan micra k12': { productionStart: 2002, productionEnd: 2010, medianYear: 2006, basePrice: 13000, fuel: 'Benzina', body: 'Citycar', powerCv: 65 },
  'nissan note': { productionStart: 2006, productionEnd: 2013, medianYear: 2009, basePrice: 15500, fuel: 'Diesel', body: 'Monovolume', powerCv: 86 },
  'nissan qashqai 1': { productionStart: 2007, productionEnd: 2013, medianYear: 2010, basePrice: 21500, fuel: 'Diesel', body: 'SUV', powerCv: 106 },
  'nissan qashqai 2': { productionStart: 2014, productionEnd: 2020, medianYear: 2017, basePrice: 24500, fuel: 'Diesel', body: 'SUV', powerCv: 115 },
  'nissan qashqai 3': { productionStart: 2021, productionEnd: 2026, medianYear: 2023, basePrice: 34000, fuel: 'Ibrida', body: 'SUV', powerCv: 140 },
  'nissan juke 1': { productionStart: 2010, productionEnd: 2019, medianYear: 2015, basePrice: 18500, fuel: 'Benzina', body: 'SUV', powerCv: 110 },
  'nissan juke 2': { productionStart: 2020, productionEnd: 2026, medianYear: 2022, basePrice: 26000, fuel: 'Ibrida', body: 'SUV', powerCv: 114 },

  // Generazioni Peugeot moderne
  'peugeot 2008 1': { productionStart: 2013, productionEnd: 2019, medianYear: 2016, basePrice: 19500, fuel: 'Benzina', body: 'SUV', powerCv: 110 },
  'peugeot 2008 2': { productionStart: 2020, productionEnd: 2026, medianYear: 2022, basePrice: 28500, fuel: 'Benzina', body: 'SUV', powerCv: 130 },
  'peugeot 208 1': { productionStart: 2012, productionEnd: 2019, medianYear: 2016, basePrice: 15500, fuel: 'Diesel', body: 'Utilitaria', powerCv: 82 },
  'peugeot 208 2': { productionStart: 2020, productionEnd: 2026, medianYear: 2022, basePrice: 22000, fuel: 'Benzina', body: 'Utilitaria', powerCv: 100 },
  'peugeot 308 2': { productionStart: 2013, productionEnd: 2021, medianYear: 2017, basePrice: 22500, fuel: 'Diesel', body: 'Berlina', powerCv: 120 },
  'peugeot 308 3': { productionStart: 2021, productionEnd: 2026, medianYear: 2023, basePrice: 30000, fuel: 'Ibrida', body: 'Berlina', powerCv: 130 },
  'peugeot 3008 1': { productionStart: 2009, productionEnd: 2016, medianYear: 2013, basePrice: 24000, fuel: 'Diesel', body: 'SUV', powerCv: 115 },
  'peugeot 3008 2': { productionStart: 2016, productionEnd: 2023, medianYear: 2020, basePrice: 32500, fuel: 'Diesel', body: 'SUV', powerCv: 130 },
  'peugeot 3008 3': { productionStart: 2024, productionEnd: 2026, medianYear: 2025, basePrice: 40500, fuel: 'Ibrida', body: 'SUV', powerCv: 136 },

  // Generazioni Renault moderne
  'renault captur 1': { productionStart: 2013, productionEnd: 2019, medianYear: 2016, basePrice: 18500, fuel: 'Diesel', body: 'SUV', powerCv: 90 },
  'renault captur 2': { productionStart: 2020, productionEnd: 2026, medianYear: 2022, basePrice: 26500, fuel: 'Ibrida', body: 'SUV', powerCv: 100 },
  'renault clio 4': { productionStart: 2012, productionEnd: 2019, medianYear: 2016, basePrice: 15500, fuel: 'Diesel', body: 'Utilitaria', powerCv: 75 },
  'renault clio 5': { productionStart: 2019, productionEnd: 2026, medianYear: 2022, basePrice: 20000, fuel: 'Ibrida', body: 'Utilitaria', powerCv: 90 },

  // Generazioni Volkswagen moderne
  'volkswagen golf 7': { productionStart: 2012, productionEnd: 2019, medianYear: 2016, basePrice: 24500, fuel: 'Diesel', body: 'Berlina', powerCv: 115 },
  'volkswagen golf 8': { productionStart: 2020, productionEnd: 2026, medianYear: 2022, basePrice: 33000, fuel: 'Benzina', body: 'Berlina', powerCv: 130 },
  'volkswagen polo 5': { productionStart: 2009, productionEnd: 2017, medianYear: 2013, basePrice: 15500, fuel: 'Diesel', body: 'Utilitaria', powerCv: 75 },
  'volkswagen polo 6': { productionStart: 2017, productionEnd: 2026, medianYear: 2021, basePrice: 22500, fuel: 'Benzina', body: 'Utilitaria', powerCv: 95 },
  'volkswagen tiguan 1': { productionStart: 2007, productionEnd: 2015, medianYear: 2012, basePrice: 28500, fuel: 'Diesel', body: 'SUV', powerCv: 140 },
  'volkswagen tiguan 2': { productionStart: 2016, productionEnd: 2023, medianYear: 2019, basePrice: 35000, fuel: 'Diesel', body: 'SUV', powerCv: 150 },

  // Generazioni Fiat & Jeep moderne
  'fiat 500x 1': { productionStart: 2014, productionEnd: 2018, medianYear: 2016, basePrice: 20500, fuel: 'Diesel', body: 'SUV', powerCv: 120 },
  'fiat 500x 2': { productionStart: 2019, productionEnd: 2026, medianYear: 2022, basePrice: 25500, fuel: 'Ibrida', body: 'SUV', powerCv: 120 },
  'fiat panda 2': { productionStart: 2003, productionEnd: 2011, medianYear: 2008, basePrice: 10500, fuel: 'Benzina', body: 'Citycar', powerCv: 60 },
  'fiat panda 3': { productionStart: 2012, productionEnd: 2020, medianYear: 2016, basePrice: 12500, fuel: 'Benzina', body: 'Citycar', powerCv: 69 },
  'fiat panda 4': { productionStart: 2020, productionEnd: 2026, medianYear: 2023, basePrice: 16500, fuel: 'Ibrida', body: 'Citycar', powerCv: 70 },
  'fiat 500 1': { productionStart: 2007, productionEnd: 2015, medianYear: 2011, basePrice: 13500, fuel: 'Benzina', body: 'Citycar', powerCv: 69 },
  'fiat 500 2': { productionStart: 2015, productionEnd: 2020, medianYear: 2018, basePrice: 15500, fuel: 'Benzina', body: 'Citycar', powerCv: 69 },
  'fiat 500 3': { productionStart: 2020, productionEnd: 2026, medianYear: 2023, basePrice: 19500, fuel: 'Ibrida', body: 'Citycar', powerCv: 70 },
  'jeep renegade 1': { productionStart: 2014, productionEnd: 2018, medianYear: 2016, basePrice: 22000, fuel: 'Diesel', body: 'SUV', powerCv: 120 },
  'jeep renegade 2': { productionStart: 2019, productionEnd: 2026, medianYear: 2022, basePrice: 27500, fuel: 'Ibrida', body: 'SUV', powerCv: 120 },

  // Generazioni Ford & Dacia moderne
  'ford fiesta 6': { productionStart: 2008, productionEnd: 2017, medianYear: 2013, basePrice: 14500, fuel: 'Diesel', body: 'Utilitaria', powerCv: 75 },
  'ford fiesta 7': { productionStart: 2017, productionEnd: 2023, medianYear: 2020, basePrice: 19500, fuel: 'Benzina', body: 'Utilitaria', powerCv: 100 },
  'ford focus 3': { productionStart: 2011, productionEnd: 2018, medianYear: 2015, basePrice: 21500, fuel: 'Diesel', body: 'Berlina', powerCv: 120 },
  'ford focus 4': { productionStart: 2018, productionEnd: 2026, medianYear: 2021, basePrice: 28500, fuel: 'Diesel', body: 'Berlina', powerCv: 125 },
  'dacia duster 1': { productionStart: 2010, productionEnd: 2017, medianYear: 2014, basePrice: 14000, fuel: 'Diesel', body: 'SUV', powerCv: 110 },
  'dacia duster 2': { productionStart: 2018, productionEnd: 2023, medianYear: 2020, basePrice: 17500, fuel: 'Diesel', body: 'SUV', powerCv: 115 },
  'dacia duster 3': { productionStart: 2024, productionEnd: 2026, medianYear: 2025, basePrice: 21500, fuel: 'Benzina', body: 'SUV', powerCv: 130 },
  'dacia sandero 1': { productionStart: 2008, productionEnd: 2012, medianYear: 2010, basePrice: 9500, fuel: 'Benzina', body: 'Utilitaria', powerCv: 75 },
  'dacia sandero 2': { productionStart: 2013, productionEnd: 2020, medianYear: 2016, basePrice: 11500, fuel: 'Benzina', body: 'Utilitaria', powerCv: 75 },
  'dacia sandero 3': { productionStart: 2021, productionEnd: 2026, medianYear: 2023, basePrice: 15500, fuel: 'GPL', body: 'Utilitaria', powerCv: 100 },

  // Citroen & Toyota moderne
  'citroen c3 1': { productionStart: 2002, productionEnd: 2009, medianYear: 2006, basePrice: 12500, fuel: 'Diesel', body: 'Utilitaria', powerCv: 70 },
  'citroen c3 2': { productionStart: 2009, productionEnd: 2016, medianYear: 2013, basePrice: 14500, fuel: 'Diesel', body: 'Utilitaria', powerCv: 75 },
  'citroen c3 3': { productionStart: 2016, productionEnd: 2023, medianYear: 2019, basePrice: 17500, fuel: 'Benzina', body: 'Utilitaria', powerCv: 82 },
  'citroen c3 4': { productionStart: 2024, productionEnd: 2026, medianYear: 2025, basePrice: 20500, fuel: 'Benzina', body: 'Utilitaria', powerCv: 100 },
  'citroen c4 cactus': { productionStart: 2014, productionEnd: 2020, medianYear: 2017, basePrice: 18500, fuel: 'Diesel', body: 'Crossover', powerCv: 100 },
  'toyota yaris 3': { productionStart: 2011, productionEnd: 2019, medianYear: 2015, basePrice: 16500, fuel: 'Ibrida', body: 'Utilitaria', powerCv: 100 },
  'toyota yaris 4': { productionStart: 2020, productionEnd: 2026, medianYear: 2023, basePrice: 23500, fuel: 'Ibrida', body: 'Utilitaria', powerCv: 116 },
};

function modelMatchesEraKey(normMake: string, normModel: string, key: string): boolean {
  const combined = `${normMake} ${normModel}`.trim();
  if (key === combined) return true;
  if (combined.startsWith(key)) return true;
  if (key.startsWith(combined)) return true;

  if (key.startsWith(normMake)) {
    const keyModelPart = key.replace(normMake, '').trim();
    // Rimozione suffisso generazione tipo " 1", " 2", " gen 1", " vii", " mk7", ecc.
    const cleanKeyModel = keyModelPart.replace(/\s+(?:[1-9]|gen\s*[1-9]|mk[1-9]|b[5-8]|w1[678][0-9]|e[489][0-9]|f[24][0-9]|8[lvp])$/i, '').trim();
    if (cleanKeyModel && (normModel.startsWith(cleanKeyModel) || cleanKeyModel.startsWith(normModel))) {
      return true;
    }
  }
  return false;
}

/**
 * Cerca se una combinazione marca/modello corrisponde a un modello con era definita.
 * Se year è specificato, individua con massima precisione la generazione corretta
 * con il relativo listino storico originale.
 */
export function findModelEra(make: string, model: string, year?: number): ModelEraInfo | null {
  const normMake = normalizeKey(make);
  const normModel = normalizeKey(model);
  const combined = `${normMake} ${normModel}`;

  // Raccogli tutti i match possibili
  const candidates: Array<{ key: string; info: ModelEraInfo; matchLen: number; yearMatches: boolean }> = [];

  for (const [key, info] of Object.entries(MODEL_ERA_MAP)) {
    if (modelMatchesEraKey(normMake, normModel, key)) {
      const yearMatches = Boolean(year && year >= info.productionStart && year <= info.productionEnd);
      const isExact = key === combined;
      const matchLen = isExact ? key.length + 50 : key.length;
      candidates.push({ key, info, matchLen, yearMatches });
    }
  }

  if (candidates.length === 0) return null;

  // Se l'anno è noto, privilegia la generazione esatta che copre quell'anno
  if (year) {
    const exact = candidates
      .filter((c) => c.yearMatches)
      .sort((a, b) => b.matchLen - a.matchLen)[0];
    if (exact) return exact.info;
  }

  // Altrimenti seleziona la corrispondenza più specifica
  candidates.sort((a, b) => b.matchLen - a.matchLen);
  return candidates[0].info;
}

/**
 * Risolve l'anno di riferimento quando l'utente non lo specifica.
 * Se il modello è fuori produzione (es. Alfa 147, Grande Punto, 206), usa la mediana storica.
 * Altrimenti, usa l'anno medio di rotazione usato (es. 2020-2021).
 */
export function resolveVehicleDefaultYear(make: string, model: string, userYear?: number): number {
  const currentYear = new Date().getFullYear();
  if (userYear && userYear >= 1970 && userYear <= currentYear) {
    return userYear;
  }

  const era = findModelEra(make, model, userYear);
  if (era) {
    return era.medianYear;
  }

  // Default moderno per auto ancora in produzione: circa 5 anni di anzianità
  return Math.max(2018, currentYear - 5);
}
