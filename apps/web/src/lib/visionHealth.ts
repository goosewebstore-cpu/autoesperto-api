import type { VehicleData } from '@autoesperto/types';

export interface DamageItem {
  id: string;
  part: string;
  category: 'paraurti' | 'cofano' | 'fanale' | 'parafango' | 'portiera' | 'graffio' | 'ammaccatura' | 'specchietto' | 'cerchio_gomma' | 'vetro' | 'carrozzeria' | 'radiatore' | 'ruggine' | 'allineamento';
  severity: 'lieve' | 'media' | 'grave';
  description: string;
  area: string;
  deductionPoints: number;
  partCostMin: number;
  partCostMax: number;
  laborMin: number;
  laborMax: number;
  totalMin: number;
  totalMax: number;
  diyPossible: boolean;
  diyTip?: string;
  verdictAdvice: string;
  searchUrls: {
    autodoc: string;
    ebay: string;
    oscaro: string;
  };
}

export interface HealthScoreResult {
  score: number; // 0 to 100
  rating: 'eccellente' | 'ottimo' | 'buono' | 'discreto' | 'da_ripristinare' | 'sinistrato';
  ratingLabel: string;
  ratingColor: string;
  ratingBadgeBg: string;
  summary: string;
  pointsDeducted: number;
  deductions: Array<{ reason: string; points: number; part: string; costEstimate: string }>;
  damages: DamageItem[];
  totalRepairMin: number;
  totalRepairMax: number;
  totalDiyMin: number;
  totalDiyMax: number;
  suggestedValuationAdjustment: number; // negative amount in €
  overallAdvice: string;
  economicVerdict: 'conviene_riparare' | 'fai_da_te_consigliato' | 'vendere_cosi_trattare' | 'intervento_urgente' | 'veicolo_sinistrato';
  economicVerdictLabel: string;
}

export function buildSearchLinks(make: string, model: string, part: string) {
  const query = `${make} ${model} ${part}`.trim();
  const encoded = encodeURIComponent(query);
  return {
    autodoc: `https://www.auto-doc.it/search?keyword=${encoded}`,
    ebay: `https://www.ebay.it/sch/i.html?_nkw=${encoded}+ricambi+auto`,
    oscaro: `https://www.oscaro.it/search?q=${encoded}`,
  };
}

interface ComponentRule {
  partName: string;
  category: DamageItem['category'];
  keywords: string[];
  points: { lieve: number; media: number; grave: number };
  partCost: { lieve: [number, number]; media: [number, number]; grave: [number, number] };
  laborCost: { lieve: [number, number]; media: [number, number]; grave: [number, number] };
  diyTip: string;
  advice: { lieve: string; media: string; grave: string };
}

const COMPONENT_RULES: ComponentRule[] = [
  {
    partName: 'Paraurti Anteriore / Posteriore',
    category: 'paraurti',
    keywords: ['paraurti', 'fascione', 'paracolpi', 'griglia anteriore', 'calandra'],
    points: { lieve: 8, media: 18, grave: 26 },
    partCost: { lieve: [60, 150], media: [180, 420], grave: [320, 750] },
    laborCost: { lieve: [50, 120], media: [150, 280], grave: [220, 450] },
    diyTip: 'Per graffi lievi basta kit ritocco a pennellino (~15€). Se spaccato, va sostituito il guscio.',
    advice: {
      lieve: 'Graffi da marciapiede: puoi risolvere con pasta abrasiva o trattare 100€ sul prezzo.',
      media: 'Paraurti crepato o disallineato: conviene sostituirlo con pezzo aftermarket prima di vendere.',
      grave: 'Paraurti staccato o distrutto: sostituzione obbligatoria per superare la revisione e circolare in sicurezza.',
    },
  },
  {
    partName: 'Cofano Motore',
    category: 'cofano',
    keywords: ['cofano', 'bonnet', 'cofano motore', 'vano motore'],
    points: { lieve: 6, media: 16, grave: 26 },
    partCost: { lieve: [50, 120], media: [200, 450], grave: [350, 850] },
    laborCost: { lieve: [60, 140], media: [160, 320], grave: [250, 500] },
    diyTip: 'Piccoli bolli possono essere rimossi con tirabolli a ventosa (PDR) senza riverniciare.',
    advice: {
      lieve: 'Segni lievi da sassi o piccoli bolli da grandine: non compromettono la funzionalità.',
      media: 'Cofano ammaccato: richiede tirabolli e sfumatura vernice.',
      grave: 'Cofano deformato o piegato da impatto frontale: sostituzione e verifica chiusura di sicurezza.',
    },
  },
  {
    partName: 'Gruppo Ottico / Faro',
    category: 'fanale',
    keywords: ['fanale', 'faro', 'fari', 'gruppo ottico', 'proiettore', 'fendinebbia'],
    points: { lieve: 5, media: 14, grave: 22 },
    partCost: { lieve: [20, 60], media: [140, 350], grave: [280, 750] },
    laborCost: { lieve: [20, 50], media: [40, 90], grave: [60, 130] },
    diyTip: 'Fari ingialliti tornano lucidi con un kit di lucidatura policarbonato anti-UV (~18€).',
    advice: {
      lieve: 'Faro leggermente opaco: ripristinabile con kit fai-da-te in 30 minuti.',
      media: 'Faro con crepe o infiltrazione condensa: conviene sostituire con ricambio compatibile online.',
      grave: 'Faro spaccato o proiettore distrutto: mancata visibilità, rischio multa e bocciatura revisione.',
    },
  },
  {
    partName: 'Parafango / Passaruota',
    category: 'parafango',
    keywords: ['parafango', 'passaruota', 'fianchetto'],
    points: { lieve: 6, media: 15, grave: 24 },
    partCost: { lieve: [30, 80], media: [120, 260], grave: [220, 520] },
    laborCost: { lieve: [60, 140], media: [140, 280], grave: [200, 420] },
    diyTip: 'Se non tocca la ruota, stuccatura e verniciatura spray per piccole ammaccature.',
    advice: {
      lieve: 'Piccolo segno sul passaruota: ripristino semplice con lucidatura.',
      media: 'Parafango ammaccato: raddrizzatura lamiera e riverniciatura in carrozzeria.',
      grave: 'Parafango schiacciato contro il vano ruota o telaio: sostituzione del pannello obbligatoria.',
    },
  },
  {
    partName: 'Portiera / Fiancata Laterale',
    category: 'portiera',
    keywords: ['portiera', 'sportello', 'fiancata', 'montante', 'porta'],
    points: { lieve: 5, media: 14, grave: 24 },
    partCost: { lieve: [30, 90], media: [150, 380], grave: [320, 750] },
    laborCost: { lieve: [70, 150], media: [150, 320], grave: [250, 550] },
    diyTip: 'Graffi da parcheggio eliminabili con pasta abrasiva fine se non intaccano il fondo bianco.',
    advice: {
      lieve: 'Graffi leggeri da parcheggio: risolvibili con polish e cera.',
      media: 'Lamiera portiera rientrata: richiede raddrizzatura e verniciatura completa pannello.',
      grave: 'Portiera deformata con guarnizioni e serratura compromesse: sostituzione porta completa.',
    },
  },
  {
    partName: 'Parabrezza / Vetri Cristalli',
    category: 'vetro',
    keywords: ['parabrezza', 'vetro', 'cristallo', 'lunotto', 'finestrino'],
    points: { lieve: 5, media: 15, grave: 25 },
    partCost: { lieve: [20, 50], media: [180, 380], grave: [280, 650] },
    laborCost: { lieve: [30, 60], media: [90, 180], grave: [120, 240] },
    diyTip: 'Piccole scheggiature (<2 cm) fuori dal campo visivo si riparano con resina cristalli (~15€).',
    advice: {
      lieve: 'Scheggiatura superficiale: riparabile con resina per evitare che si allarghi.',
      media: 'Incrinatura visibile: richiede sostituzione cristallo con collante strutturale.',
      grave: 'Parabrezza frantumato o crepa estesa nel campo visivo: vietata la circolazione.',
    },
  },
  {
    partName: 'Specchietto Retrovisore',
    category: 'specchietto',
    keywords: ['specchietto', 'retrovisore', 'calotta specchio'],
    points: { lieve: 4, media: 8, grave: 16 },
    partCost: { lieve: [15, 40], media: [60, 140], grave: [120, 280] },
    laborCost: { lieve: [20, 40], media: [30, 60], grave: [40, 80] },
    diyTip: 'Su eBay si trova la sola calotta o il solo vetro specchio con attacco a clip (~20€).',
    advice: {
      lieve: 'Calotta graffiata: sostituzione cover economica in fai-da-te.',
      media: 'Vetro o supporto crepato: cambio rapido del corpo specchio.',
      grave: 'Specchietto divelto o motorino elettrico strappato: sostituzione gruppo specchio.',
    },
  },
  {
    partName: 'Cerchi in Lega & Gomme',
    category: 'cerchio_gomma',
    keywords: ['cerchio', 'gomma', 'pneumatico', 'cerchi in lega', 'ruota'],
    points: { lieve: 3, media: 8, grave: 16 },
    partCost: { lieve: [20, 50], media: [90, 200], grave: [180, 420] },
    laborCost: { lieve: [15, 30], media: [25, 60], grave: [35, 80] },
    diyTip: 'Bordi cerchio segnati da marciapiede ritoccabili con stucco metallico e vernice argento.',
    advice: {
      lieve: 'Segni superficiali da marciapiede sul bordo cerchio.',
      media: 'Pneumatico con usura irregolare o cerchio ovalizzato.',
      grave: 'Cerchio spaccato o gomma squarciata: sostituzione immediata per sicurezza.',
    },
  },
  {
    partName: 'Radiatore / Frontale Meccanico',
    category: 'radiatore',
    keywords: ['radiatore', 'intercooler', 'traversa', 'longherone', 'motore frontale', 'impatto frontale grave', 'frontale distrutto', 'sinistrato'],
    points: { lieve: 10, media: 22, grave: 35 },
    partCost: { lieve: [80, 200], media: [250, 550], grave: [500, 1400] },
    laborCost: { lieve: [70, 160], media: [180, 400], grave: [350, 900] },
    diyTip: 'Intervento esclusivamente per meccanici/carrozzieri con dima e banchi di riscontro.',
    advice: {
      lieve: 'Supporti radiatore piegati: verifica tenuta liquido refrigerante.',
      media: 'Radiatore o traversa danneggiata da urto: rischio surriscaldamento motore.',
      grave: 'Danno strutturale frontale pesante da collisione/sinistro: veicolo non marciante.',
    },
  },
];

export function computeHealthScore(
  rawDamage: {
    visible: boolean;
    category?: string;
    severity?: string;
    description?: string;
    area?: string;
    repairHint?: string;
  } | null,
  vehicle?: Partial<VehicleData>
): HealthScoreResult {
  const make = vehicle?.make || 'Auto';
  const model = vehicle?.model || '';

  if (!rawDamage || !rawDamage.visible) {
    return {
      score: 96,
      rating: 'eccellente',
      ratingLabel: 'Stato Esterno Eccellente',
      ratingColor: 'text-emerald-700',
      ratingBadgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      summary: 'La carrozzeria e i componenti visibili non presentano difetti, urti o graffi rilevanti. Vernice e allineamenti integri.',
      pointsDeducted: 4,
      deductions: [
        {
          reason: 'Lievi micro-segni da normale circolazione stradale',
          points: 4,
          part: 'Carrozzeria generale',
          costEstimate: '0 € (Nessun intervento)',
        },
      ],
      damages: [],
      totalRepairMin: 0,
      totalRepairMax: 0,
      totalDiyMin: 0,
      totalDiyMax: 0,
      suggestedValuationAdjustment: 0,
      overallAdvice: 'L\'auto è in condizioni ottimali. Non necessita di ripristini estetici e mantiene il massimo del suo valore commerciale.',
      economicVerdict: 'conviene_riparare',
      economicVerdictLabel: 'Nessun ripristino necessario · Valore Integro al 100%',
    };
  }

  const descLower = (rawDamage.description || '').toLowerCase();
  const areaLower = (rawDamage.area || '').toLowerCase();
  const fullText = `${descLower} ${areaLower} ${rawDamage.category || ''}`;

  const globalSeverity = (rawDamage.severity || 'media') as 'lieve' | 'media' | 'grave';
  const isSevereCrash = /distrutt|staccat|schiacciat|deformat|spaccat|sinistrat|forte impatto|urto grave|danni gravi/i.test(fullText);

  // Identify ALL matching damaged components from description text & categories
  const detectedRules: Array<{ rule: ComponentRule; severity: 'lieve' | 'media' | 'grave' }> = [];

  for (const rule of COMPONENT_RULES) {
    const hasKeyword = rule.keywords.some((kw) => fullText.includes(kw));
    if (hasKeyword || (rawDamage.category && rule.category === rawDamage.category)) {
      let partSev = globalSeverity;
      if (isSevereCrash) partSev = 'grave';
      else if (/graffi|lieve|superficial|micro|segno/i.test(fullText) && !/spaccat|deformat|staccat/i.test(fullText)) {
        partSev = 'lieve';
      }
      detectedRules.push({ rule, severity: partSev });
    }
  }

  // Fallback: if no specific component matched, use paraurti or carrozzeria
  if (detectedRules.length === 0) {
    const fallbackRule = COMPONENT_RULES[0];
    detectedRules.push({ rule: fallbackRule, severity: globalSeverity });
  }

  // Deduplicate rules by category
  const uniqueRules = Array.from(new Map(detectedRules.map((item) => [item.rule.category, item])).values());

  let totalDeductions = 0;
  let totalPartMin = 0;
  let totalPartMax = 0;
  let totalLaborMin = 0;
  let totalLaborMax = 0;
  const deductionsList: HealthScoreResult['deductions'] = [];
  const damagesList: DamageItem[] = [];

  uniqueRules.forEach((item, idx) => {
    const { rule, severity } = item;
    const points = rule.points[severity];
    const [pMin, pMax] = rule.partCost[severity];
    const [lMin, lMax] = rule.laborCost[severity];
    const totMin = pMin + lMin;
    const totMax = pMax + lMax;

    totalDeductions += points;
    totalPartMin += pMin;
    totalPartMax += pMax;
    totalLaborMin += lMin;
    totalLaborMax += lMax;

    deductionsList.push({
      reason: `${rule.partName} (${severity.toUpperCase()})`,
      points,
      part: rule.partName,
      costEstimate: `${totMin}–${totMax} €`,
    });

    damagesList.push({
      id: `dmg-${idx + 1}`,
      part: rule.partName,
      category: rule.category,
      severity,
      description: rawDamage.description || `Difetto riscontrato su ${rule.partName.toLowerCase()} (${severity}).`,
      area: rawDamage.area || 'Zona anteriore/laterale',
      deductionPoints: points,
      partCostMin: pMin,
      partCostMax: pMax,
      laborMin: lMin,
      laborMax: lMax,
      totalMin: totMin,
      totalMax: totMax,
      diyPossible: severity === 'lieve',
      diyTip: rule.diyTip,
      verdictAdvice: rule.advice[severity],
      searchUrls: buildSearchLinks(make, model, rule.partName),
    });
  });

  const finalScore = Math.max(15, Math.min(95, 100 - totalDeductions));
  const totalRepairMin = totalPartMin + totalLaborMin;
  const totalRepairMax = totalPartMax + totalLaborMax;
  const avgRepair = Math.round((totalRepairMin + totalRepairMax) / 2);
  const suggestedValuationAdjustment = -Math.max(150, Math.round(avgRepair / 50) * 50);

  let rating: HealthScoreResult['rating'] = 'buono';
  let ratingLabel = 'Buono con Segni d\'Uso';
  let ratingColor = 'text-blue-700';
  let ratingBadgeBg = 'bg-blue-50 text-blue-700 border-blue-200';
  let economicVerdict: HealthScoreResult['economicVerdict'] = 'conviene_riparare';
  let economicVerdictLabel = 'Conviene Riparare Prima di Vendere';
  let overallAdvice = '';

  if (finalScore <= 40 || isSevereCrash) {
    rating = 'sinistrato';
    ratingLabel = '🔴 Veicolo Sinistrato / Danni Gravi';
    ratingColor = 'text-rose-700';
    ratingBadgeBg = 'bg-rose-50 text-rose-700 border-rose-200';
    economicVerdict = 'veicolo_sinistrato';
    economicVerdictLabel = 'Urto Grave / Non Circolante · Vendere come Incidentata o Ripristino Totale';
    overallAdvice = 'L\'auto ha subito un impatto importante con più componenti frontali distrutti o deformati. I costi di riparazione sono elevati: sconsigliato l\'acquisto senza perizia su ponte per verificare telaio e longheroni.';
  } else if (finalScore <= 60) {
    rating = 'da_ripristinare';
    ratingLabel = '🟠 Da Ripristinare / Danni Evidenti';
    ratingColor = 'text-amber-800';
    ratingBadgeBg = 'bg-amber-50 text-amber-800 border-amber-200';
    economicVerdict = 'intervento_urgente';
    economicVerdictLabel = 'Intervento Necessario · Scala Costi dal Prezzo';
    overallAdvice = 'Sono presenti danni estetici e strutturali estesi. Conviene quantificare i preventivi e scalare la spesa direttamente dal prezzo di acquisto o vendita.';
  } else if (finalScore <= 78) {
    rating = 'discreto';
    ratingLabel = '🟡 Discreto · Richiede Ripristini';
    ratingColor = 'text-yellow-800';
    ratingBadgeBg = 'bg-yellow-50 text-yellow-800 border-yellow-200';
    economicVerdict = 'conviene_riparare';
    economicVerdictLabel = 'Conviene Riparare · Recuperi Valore in Trattativa';
    overallAdvice = 'I componenti danneggiati possono essere ripristinati o sostituiti con ricambi economici online per incrementare notevolmente il valore di rivendita.';
  } else if (finalScore <= 90) {
    rating = 'buono';
    ratingLabel = '🟢 Buono · Lievi Segni da Parcheggio';
    ratingColor = 'text-emerald-700';
    ratingBadgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    economicVerdict = 'fai_da_te_consigliato';
    economicVerdictLabel = 'Fai-da-te Consigliato · Spesa Minima';
    overallAdvice = 'Danni minimi di usura. Con un kit di lucidatura o piccolo ritocco fai-da-te la vettura torna in perfetto stato.';
  } else {
    rating = 'ottimo';
    ratingLabel = '🟢 Ottimo Stato Generale';
    ratingColor = 'text-emerald-700';
    ratingBadgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    economicVerdict = 'conviene_riparare';
    economicVerdictLabel = 'Nessun Ripristino Urgente';
    overallAdvice = 'Condizioni ottimali di carrozzeria e gruppi ottici.';
  }

  return {
    score: finalScore,
    rating,
    ratingLabel,
    ratingColor,
    ratingBadgeBg,
    summary: rawDamage.description || `Rilevati ${uniqueRules.length} componenti danneggiati.`,
    pointsDeducted: totalDeductions,
    deductions: deductionsList,
    damages: damagesList,
    totalRepairMin,
    totalRepairMax,
    totalDiyMin: totalPartMin,
    totalDiyMax: totalPartMax,
    suggestedValuationAdjustment,
    overallAdvice,
    economicVerdict,
    economicVerdictLabel,
  };
}
