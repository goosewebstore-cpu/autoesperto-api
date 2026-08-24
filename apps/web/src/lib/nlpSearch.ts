import type { FinderCriteria, BodyType, FuelType, TransmissionType, UsageType, PriorityType } from './finderEngine';

export interface ParsedSearchIntent {
  rawQuery: string;
  criteria: FinderCriteria;
  extractedSummary: string[];
  confidence: 'alta' | 'media' | 'bassa';
  suggestedFollowUpQuestions?: string[];
}

export function parseNaturalLanguageQuery(query: string): ParsedSearchIntent {
  const text = query.toLowerCase().trim();
  const summary: string[] = [];
  const followUps: string[] = [];

  // Default baseline criteria
  let budgetMax = 15000;
  let budgetMin = 0;
  let annualKm = 12000;
  let fuel: FuelType = 'indifferente';
  let transmission: TransmissionType = 'indifferente';
  const bodyTypes: BodyType[] = [];
  const usages: UsageType[] = [];
  const priorities: PriorityType[] = [];
  let cityLocation: string | undefined;

  // 1. BUDGET EXTRACTION
  // Patterns like "sotto i 12.000 euro", "max 15000€", "10k", "fino a 18.000"
  const kMatch = text.match(/(?:sotto|fino\s*a|max(?:imo)?|budget|meno\s*di)?\s*(\d{1,2})\s*k(?:\s*€|\s*euro)?/);
  const fullBudgetMatch = text.match(/(?:sotto|fino\s*a|max(?:imo)?|budget|meno\s*di|circa)?\s*(\d{1,2}[.\s]?\d{3})\s*(?:€|euro)?/);

  if (kMatch) {
    budgetMax = Number.parseInt(kMatch[1], 10) * 1000;
    summary.push(`Budget massimo: €${budgetMax.toLocaleString('it-IT')}`);
  } else if (fullBudgetMatch) {
    const rawNum = Number.parseInt(fullBudgetMatch[1].replace(/[.\s]/g, ''), 10);
    if (rawNum >= 2000 && rawNum <= 150000) {
      budgetMax = rawNum;
      summary.push(`Budget massimo: €${budgetMax.toLocaleString('it-IT')}`);
    }
  }

  // Range pattern like "tra 8000 e 12000"
  const rangeMatch = text.match(/tra\s*(\d{1,2}[.\s]?\d{3})\s*e\s*(\d{1,2}[.\s]?\d{3})/);
  if (rangeMatch) {
    budgetMin = Number.parseInt(rangeMatch[1].replace(/[.\s]/g, ''), 10);
    budgetMax = Number.parseInt(rangeMatch[2].replace(/[.\s]/g, ''), 10);
    summary.push(`Fascia budget: €${budgetMin.toLocaleString('it-IT')} – €${budgetMax.toLocaleString('it-IT')}`);
  }

  // 2. ANNUAL KM EXTRACTION
  const kmMatch = text.match(/(\d{1,2}[.\s]?\d{3})\s*(?:km|chilometri)(?:\s*all['’]anno|\s*annui|\s*l['’]anno|\s*anno)?/);
  if (kmMatch) {
    annualKm = Number.parseInt(kmMatch[1].replace(/[.\s]/g, ''), 10);
    summary.push(`Percorrenza: ${annualKm.toLocaleString('it-IT')} km/anno`);
  } else if (text.includes('pochi km') || text.includes('uso saltuario') || text.includes('weekend')) {
    annualKm = 7000;
    summary.push('Percorrenza bassa: ~7.000 km/anno');
  } else if (text.includes('tanti km') || text.includes('pendolare') || text.includes('agente') || text.includes('viaggio molto')) {
    annualKm = 28000;
    summary.push('Percorrenza alta: ~28.000 km/anno');
  }

  // 3. FUEL EXTRACTION
  if (text.includes('ibrid') || text.includes('hybrid') || text.includes('e-tech') || text.includes('full hybrid')) {
    fuel = 'hybrid';
    summary.push('Alimentazione: Ibrida (Full/Mild Hybrid)');
  } else if (text.includes('gpl') || text.includes('gas')) {
    fuel = 'gpl';
    summary.push('Alimentazione: GPL (costi al km bassi)');
  } else if (text.includes('diesel') || text.includes('gasolio') || text.includes('tdi') || text.includes('dci') || text.includes('multijet')) {
    fuel = 'diesel';
    summary.push('Alimentazione: Diesel');
  } else if (text.includes('elettric') || text.includes('bev') || text.includes('a batteria')) {
    fuel = 'elettrica';
    summary.push('Alimentazione: 100% Elettrica');
  } else if (text.includes('benzina')) {
    fuel = 'benzina';
    summary.push('Alimentazione: Benzina');
  } else if (text.includes('plug-in') || text.includes('phev')) {
    fuel = 'plugin';
    summary.push('Alimentazione: Plug-in Hybrid');
  }

  // 4. USAGE EXTRACTION
  if (text.includes('città') || text.includes('citta') || text.includes('urbano') || text.includes('parcheggi')) {
    usages.push('citta');
    summary.push('Uso: Città e spostamenti urbani');
  }
  if (text.includes('autostrada') || text.includes('tangenziale') || text.includes('lunghi viaggi') || text.includes('tratte veloci')) {
    usages.push('autostrada');
    summary.push('Uso: Autostrada e viaggi');
  }
  if (text.includes('famiglia') || text.includes('bambin') || text.includes('passeggin') || text.includes('4 persone') || text.includes('5 persone') || text.includes('figli')) {
    usages.push('famiglia');
    summary.push('Esigenza: Famiglia e spazio per bambini');
  }
  if (text.includes('lavoro') || text.includes('carico') || text.includes('spesa')) {
    usages.push('lavoro');
  }
  if (text.includes('sportiv') || text.includes('divertent') || text.includes('prestazion') || text.includes('scattant')) {
    usages.push('sportivo');
    priorities.push('prestazioni');
  }

  if (usages.length === 0) {
    usages.push('misto');
  }

  // 5. BODY TYPE EXTRACTION
  if (text.includes('suv') || text.includes('crossover') || text.includes('guida alta') || text.includes('rialzata')) {
    bodyTypes.push('suv');
    summary.push('Carrozzeria: SUV / Crossover');
  }
  if (text.includes('station wagon') || text.includes('sw') || text.includes('station') || text.includes('familiare') || text.includes('touring') || text.includes('avant')) {
    bodyTypes.push('station_wagon');
    summary.push('Carrozzeria: Station Wagon');
  }
  if (text.includes('city car') || text.includes('citycar') || text.includes('piccola') || text.includes('utilitaria piccola') || text.includes('neopatentat')) {
    bodyTypes.push('citycar');
    summary.push('Carrozzeria: City car (compatta)');
  }
  if (text.includes('monovolume') || text.includes('multispazio')) {
    bodyTypes.push('monovolume');
    summary.push('Carrozzeria: Monovolume');
  }
  if (text.includes('berlina')) {
    bodyTypes.push('berlina');
    summary.push('Carrozzeria: Berlina');
  }
  if (text.includes('compatta') || text.includes('2 volumi')) {
    bodyTypes.push('compatta');
    summary.push('Carrozzeria: Compatta');
  }

  if (bodyTypes.length === 0) {
    bodyTypes.push('indifferente');
  }

  // 6. TRANSMISSION EXTRACTION
  if (text.includes('automatico') || text.includes('cambio automatico') || text.includes('dsg') || text.includes('steptronic')) {
    transmission = 'automatico';
    summary.push('Cambio: Automatico');
  } else if (text.includes('manuale')) {
    transmission = 'manuale';
    summary.push('Cambio: Manuale');
  }

  // 7. PRIORITIES EXTRACTION
  if (text.includes('affidab') || text.includes('sicur') || text.includes('non mi lasci a piedi') || text.includes('solida') || text.includes('senza guasti')) {
    priorities.push('affidabilita');
    summary.push('Priorità: Massima Affidabilità');
  }
  if (text.includes('consum') || text.includes('poco') || text.includes('econom') || text.includes('km/l') || text.includes('spendere poco di benzina')) {
    priorities.push('consumi');
    summary.push('Priorità: Consumi bassi');
  }
  if (text.includes('spazio') || text.includes('bagagliaio') || text.includes('capiente')) {
    priorities.push('spazio');
    summary.push('Priorità: Grande capacità di carico');
  }
  if (text.includes('manutenzion') || text.includes('tagliand') || text.includes('ricambi')) {
    priorities.push('manutenzione');
    summary.push('Priorità: Manutenzione economica');
  }
  if (text.includes('prezzo') || text.includes('offert') || text.includes('affare')) {
    priorities.push('prezzo');
  }

  if (priorities.length === 0) {
    priorities.push('affidabilita', 'consumi');
  }

  // 8. LOCATION EXTRACTION
  const locationMatch = text.match(/(?:a|in|zona|provincia di|vicino a)\s+([a-zA-ZàèéìòùÀÈÉÌÒÙ\s]{3,20})/);
  if (locationMatch && !['città', 'citta', 'famiglia', 'macchina', 'benzina', 'diesel', 'autostrada'].includes(locationMatch[1].trim())) {
    cityLocation = locationMatch[1].trim();
    summary.push(`Zona: ${cityLocation}`);
  }

  // Generate smart follow-up suggestions if details are sparse
  if (fuel === 'indifferente' && annualKm > 18000) {
    followUps.push(`Per i tuoi ${annualKm.toLocaleString('it-IT')} km/anno preferisci Diesel o Full Hybrid per abbattere i costi al km?`);
  }
  if (bodyTypes.includes('indifferente') && usages.includes('famiglia')) {
    followUps.push('Per la famiglia preferisci un SUV con guida rialzata o una Station Wagon con bagagliaio più lungo?');
  }

  const confidence: ParsedSearchIntent['confidence'] =
    summary.length >= 3 ? 'alta' : summary.length >= 2 ? 'media' : 'bassa';

  return {
    rawQuery: query,
    criteria: {
      budgetMax,
      budgetMin: budgetMin > 0 ? budgetMin : undefined,
      usages,
      annualKm,
      fuel,
      transmission,
      bodyTypes,
      priorities: Array.from(new Set(priorities)).slice(0, 3),
      location: cityLocation ? { city: cityLocation } : undefined,
      freeText: query,
    },
    extractedSummary: summary,
    confidence,
    suggestedFollowUpQuestions: followUps.length > 0 ? followUps : undefined,
  };
}
