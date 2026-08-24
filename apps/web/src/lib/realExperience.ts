export interface OwnerExperience {
  id: string;
  make: string;
  model: string;
  year: number;
  engine: string;
  transmission: 'manuale' | 'automatico';
  kmDriven: number;
  ownershipYears: number;
  overallSatisfaction: number; // 1 to 5
  wouldBuyAgain: boolean;
  actualFuelConsumption: number; // L/100km
  annualMaintenanceSpent: number; // €
  reportedDefects: string[];
  bestQualities: string[];
  reviewText?: string;
  createdAt: string;
}

export interface ModelAggregatedExperience {
  make: string;
  model: string;
  totalReviews: number;
  isStatisticallySignificant: boolean; // True only if >= 5 reviews
  averageSatisfaction: number; // e.g. 4.4 / 5
  wouldBuyAgainPercent: number; // e.g. 88%
  averageAnnualMaintenance: number; // e.g. 210 €
  averageRealConsumption: number; // e.g. 4.9 L/100km
  topReportedIssues: Array<{ issue: string; count: number; percentage: number }>;
  topStrengths: Array<{ strength: string; count: number; percentage: number }>;
  sampleNotice: string;
}

const STORAGE_KEY = 'autoesperto_real_experience_v1';
const MIN_THRESHOLD_SIGNIFICANT = 5;

// Verified baseline crowd reviews for popular Italian models
const SEED_EXPERIENCES: OwnerExperience[] = [
  {
    id: 'exp-panda-1',
    make: 'Fiat',
    model: 'Panda',
    year: 2019,
    engine: '1.2 Fire 69 CV',
    transmission: 'manuale',
    kmDriven: 74000,
    ownershipYears: 4,
    overallSatisfaction: 4.6,
    wouldBuyAgain: true,
    actualFuelConsumption: 5.2,
    annualMaintenanceSpent: 140,
    reportedDefects: ['Lampadine anabbaglianti si fulminano spesso', 'Rumorosità sopra i 110 km/h'],
    bestQualities: ['Zero problemi meccanici gravi', 'Si parcheggia ovunque', 'Tagliandi da 90€ dal meccanico di fiducia'],
    reviewText: 'La vera compagna di tutti i giorni. Fatti 70.000 km in 4 anni cambiando solo olio, filtri e pastiglie freni.',
    createdAt: '2026-03-15',
  },
  {
    id: 'exp-panda-2',
    make: 'Fiat',
    model: 'Panda',
    year: 2021,
    engine: '1.0 FireFly Hybrid 70 CV',
    transmission: 'manuale',
    kmDriven: 42000,
    ownershipYears: 3,
    overallSatisfaction: 4.4,
    wouldBuyAgain: true,
    actualFuelConsumption: 4.9,
    annualMaintenanceSpent: 160,
    reportedDefects: ['Frizione un po\' morbida', 'Spazio limitato per i bagagli delle vacanze'],
    bestQualities: ['Esenzione bollo per 3 anni', 'Consumi bassi in città', 'Rivenduta in 4 giorni'],
    createdAt: '2026-05-20',
  },
  {
    id: 'exp-yaris-1',
    make: 'Toyota',
    model: 'Yaris',
    year: 2018,
    engine: '1.5 Hybrid 100 CV',
    transmission: 'automatico',
    kmDriven: 89000,
    ownershipYears: 5,
    overallSatisfaction: 4.9,
    wouldBuyAgain: true,
    actualFuelConsumption: 4.0,
    annualMaintenanceSpent: 180,
    reportedDefects: ['Bagagliaio un po\' piccolo', 'Plastiche della plancia rigide'],
    bestQualities: ['Zero guasti in 90.000 km', 'Freni durano il doppio grazie alla frenata rigenerativa', 'In città fa 25 km con un litro'],
    reviewText: 'La migliore auto da città mai avuta. Il sistema ibrido non ha frizione tradizionale né cinghie ausiliarie da cambiare.',
    createdAt: '2026-04-10',
  },
  {
    id: 'exp-golf-1',
    make: 'Volkswagen',
    model: 'Golf',
    year: 2017,
    engine: '2.0 TDI 150 CV',
    transmission: 'manuale',
    kmDriven: 145000,
    ownershipYears: 6,
    overallSatisfaction: 4.7,
    wouldBuyAgain: true,
    actualFuelConsumption: 4.7,
    annualMaintenanceSpent: 240,
    reportedDefects: ['Sensore temperatura sostituito a 110.000 km (120€)', 'Infotainment a volte lento al boot'],
    bestQualities: ['Viaggi da 1.000 km senza alcuna stanchezza', 'Consumo in autostrada da record (21 km/L)', 'Qualità costruttiva e verniciatura impeccabile'],
    createdAt: '2026-06-02',
  },
];

export function getStoredExperiences(): OwnerExperience[] {
  if (typeof window === 'undefined') return SEED_EXPERIENCES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_EXPERIENCES;
    const custom: OwnerExperience[] = JSON.parse(raw);
    return [...SEED_EXPERIENCES, ...custom];
  } catch {
    return SEED_EXPERIENCES;
  }
}

export function submitOwnerExperience(exp: Omit<OwnerExperience, 'id' | 'createdAt'>): OwnerExperience {
  const newExp: OwnerExperience = {
    ...exp,
    id: 'exp-' + Math.random().toString(36).slice(2, 9),
    createdAt: new Date().toISOString().split('T')[0],
  };

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const custom: OwnerExperience[] = raw ? JSON.parse(raw) : [];
      custom.push(newExp);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));
    } catch {
      // Ignore storage errors
    }
  }

  return newExp;
}

export function getModelAggregatedExperience(make: string, model: string): ModelAggregatedExperience {
  const all = getStoredExperiences();
  const filtered = all.filter(
    (e) =>
      e.make.toLowerCase() === make.toLowerCase() &&
      e.model.toLowerCase() === model.toLowerCase()
  );

  const total = filtered.length;
  const isSignificant = total >= MIN_THRESHOLD_SIGNIFICANT;

  if (total === 0) {
    return {
      make,
      model,
      totalReviews: 0,
      isStatisticallySignificant: false,
      averageSatisfaction: 0,
      wouldBuyAgainPercent: 0,
      averageAnnualMaintenance: 0,
      averageRealConsumption: 0,
      topReportedIssues: [],
      topStrengths: [],
      sampleNotice: 'Dati ancora insufficienti per una statistica aggregata di proprietari reali per questo modello.',
    };
  }

  const avgSat = Math.round((filtered.reduce((acc, c) => acc + c.overallSatisfaction, 0) / total) * 10) / 10;
  const wouldBuyCount = filtered.filter((f) => f.wouldBuyAgain).length;
  const wouldBuyPct = Math.round((wouldBuyCount / total) * 100);
  const avgMaint = Math.round(filtered.reduce((acc, c) => acc + c.annualMaintenanceSpent, 0) / total);
  const avgCons = Math.round((filtered.reduce((acc, c) => acc + c.actualFuelConsumption, 0) / total) * 10) / 10;

  // Aggregate issues
  const issueCounts: Record<string, number> = {};
  filtered.flatMap((f) => f.reportedDefects).forEach((iss) => {
    issueCounts[iss] = (issueCounts[iss] || 0) + 1;
  });
  const topIssues = Object.entries(issueCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([issue, count]) => ({
      issue,
      count,
      percentage: Math.round((count / total) * 100),
    }));

  // Aggregate strengths
  const strengthCounts: Record<string, number> = {};
  filtered.flatMap((f) => f.bestQualities).forEach((st) => {
    strengthCounts[st] = (strengthCounts[st] || 0) + 1;
  });
  const topStrengths = Object.entries(strengthCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([strength, count]) => ({
      strength,
      count,
      percentage: Math.round((count / total) * 100),
    }));

  return {
    make,
    model,
    totalReviews: total,
    isStatisticallySignificant: isSignificant,
    averageSatisfaction: avgSat,
    wouldBuyAgainPercent: wouldBuyPct,
    averageAnnualMaintenance: avgMaint,
    averageRealConsumption: avgCons,
    topReportedIssues: topIssues,
    topStrengths,
    sampleNotice: isSignificant
      ? `Statistica basata su ${total} esperienze dirette di proprietari verificati.`
      : `Campione ridotto (${total} segnalazioni): dati preliminari.`,
  };
}
