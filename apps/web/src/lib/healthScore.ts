import type { AutoReport } from '@autoesperto/types';

export interface SubsystemHealth {
  key: string;
  name: string;
  score: number;
  status: string;
  tone: 'good' | 'fair' | 'warn';
  note: string;
}

export interface VehicleHealthData {
  overallScore: number;
  statusLabel: string;
  tone: 'good' | 'fair' | 'warn';
  badgeColor: string;
  summary: string;
  subsystems: SubsystemHealth[];
  recommendedCheck: string;
}

export function computeVehicleHealth(report: AutoReport): VehicleHealthData {
  const vehicle = report?.vehicle || ({} as any);
  const reliability = report?.reliability || ({} as any);
  const price = report?.price || ({} as any);

  const currentYear = new Date().getFullYear();
  const year = Number(vehicle.year) || (currentYear - 4);
  const age = Math.max(0, currentYear - year);
  
  const km = Number(price.inputKm) || Number((vehicle as any).mileage) || Number((vehicle as any).km) || (age * 14000);
  const relScore = Number(reliability.score) || 7.5;
  const normalizedRel = Math.min(100, Math.max(10, Math.round(relScore <= 10 ? relScore * 10 : relScore)));

  // Age factor: penalty of 1.5 pts per year over 2 years
  const agePenalty = Math.min(25, age * 1.5);
  // Km factor: penalty for high km (> 100k)
  const kmPenalty = km > 150000 ? 18 : km > 100000 ? 10 : km > 60000 ? 5 : 0;
  // Verdict factor
  const verdictPenalty = reliability.verdict === 'AVOID' ? 25 : reliability.verdict === 'NEGOTIATE' ? 8 : 0;

  const rawOverall = Math.round(normalizedRel * 0.5 + (100 - agePenalty - kmPenalty) * 0.5 - verdictPenalty);
  const overallScore = Math.max(25, Math.min(98, rawOverall));

  // Determine health tone and label
  let tone: 'good' | 'fair' | 'warn' = 'good';
  let statusLabel = 'Ottima salute meccanica';
  let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';

  if (overallScore < 60 || reliability.verdict === 'AVOID') {
    tone = 'warn';
    statusLabel = 'Attenzione: Usura o difetti noti';
    badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (overallScore < 78 || reliability.verdict === 'NEGOTIATE') {
    tone = 'fair';
    statusLabel = 'Buono stato con controlli raccomandati';
    badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
  }

  // Calculate subsystems
  const engineBase = Math.max(30, Math.min(99, Math.round(normalizedRel - (age > 8 ? 8 : 2) - (km > 120000 ? 10 : 0))));
  const transBase = Math.max(35, Math.min(99, Math.round(normalizedRel * 0.95 - (km > 140000 ? 12 : 2))));
  const brakesBase = Math.max(40, Math.min(98, Math.round(92 - (km > 80000 ? 12 : 4) - (age > 6 ? 6 : 0))));
  const electricBase = Math.max(50, Math.min(99, Math.round(95 - (age > 5 ? 10 : 2))));
  const structureBase = Math.max(60, Math.min(99, Math.round(96 - (age > 10 ? 12 : age > 5 ? 6 : 0))));

  const getSubsystemTone = (sc: number): 'good' | 'fair' | 'warn' => {
    if (sc >= 78) return 'good';
    if (sc >= 60) return 'fair';
    return 'warn';
  };

  const getSubsystemStatus = (sc: number): string => {
    if (sc >= 85) return 'Ottimo';
    if (sc >= 75) return 'Buono';
    if (sc >= 60) return 'Nella media';
    return 'Da verificare';
  };

  const subsystems: SubsystemHealth[] = [
    {
      key: 'engine',
      name: 'Motore & Distribuzione',
      score: engineBase,
      status: getSubsystemStatus(engineBase),
      tone: getSubsystemTone(engineBase),
      note: reliability.engine || 'Verificare regolarità tagliandi e cinghia/catena.',
    },
    {
      key: 'transmission',
      name: 'Cambio & Frizione',
      score: transBase,
      status: getSubsystemStatus(transBase),
      tone: getSubsystemTone(transBase),
      note: reliability.transmission || 'Innesti e frizione in linea con il chilometraggio.',
    },
    {
      key: 'brakes',
      name: 'Freni & Sospensioni',
      score: brakesBase,
      status: getSubsystemStatus(brakesBase),
      tone: getSubsystemTone(brakesBase),
      note: 'Controllo spessore dischi e pastiglie prima dell\'acquisto.',
    },
    {
      key: 'electric',
      name: 'Elettronica & Batteria',
      score: electricBase,
      status: getSubsystemStatus(electricBase),
      note: 'Diagnosi centraline e stato batteria ausiliaria/servizi.',
      tone: getSubsystemTone(electricBase),
    },
    {
      key: 'structure',
      name: 'Struttura & Carrozzeria',
      score: structureBase,
      status: getSubsystemStatus(structureBase),
      note: 'Integrità scocca e assenza di sinistri pregressi.',
      tone: getSubsystemTone(structureBase),
    },
  ];

  let summary = `Stato di salute stimato a ${overallScore}/100 in base a età (${age} anni), chilometraggio stimato (${km.toLocaleString('it-IT')} km) e indice storico di affidabilità.`;
  if (overallScore >= 80) {
    summary = `Ottima condizione di salute meccanica generale: modello con elevata longevità e usura moderata rispetto all'anno (${year}).`;
  } else if (overallScore < 60) {
    summary = `Salute meccanica che richiede attenzione: modello o motorizzazione con note di criticità documentate. Fai ispezionare l'auto da un meccanico.`;
  }

  const weaknesses = reliability.weaknesses || [];
  const recommendedCheck = weaknesses.length > 0 
    ? weaknesses[0] 
    : 'Esegui una diagnosi OBD e verifica lo storico dei tagliandi timbrati.';

  return {
    overallScore,
    statusLabel,
    tone,
    badgeColor,
    summary,
    subsystems,
    recommendedCheck,
  };
}
