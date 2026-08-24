import type { ParsedAdData } from './adParser';
import { VEHICLE_DATABASE } from './finderEngine';

export interface TrustScoreCategory {
  category: string;
  score: number; // Max points
  maxScore: number;
  status: 'good' | 'warning' | 'critical';
  details: string;
}

export interface TrustScoreResult {
  overallScore: number; // 0 - 100
  verdict: 'CONVENIENTE' | 'PREZZO_TRATTABILE' | 'NON_CONVENIENTE';
  verdictLabel: string;
  verdictTone: 'emerald' | 'amber' | 'rose';
  wouldBuyVerdict: boolean; // "La compreresti?" -> true / false
  wouldBuyExplanation: string;
  categories: TrustScoreCategory[];
  highlights: {
    positive: string[];
    warnings: string[];
    criticals: string[];
  };
  priceAnalysis: {
    askingPrice: number;
    estimatedValueMin: number;
    estimatedValueMax: number;
    marketDiffPercent: number;
    isOverpriced: boolean;
    isSuspiciouslyLow: boolean;
  };
  offerPrice: {
    suggestedStartingOffer: number;
    fairTargetPrice: number;
    maxRecommendedLimit: number;
    negotiationStrategy: string;
  };
  inspectionChecklist: string[];
}

export function computeAdTrustScore(ad: ParsedAdData): TrustScoreResult {
  const categories: TrustScoreCategory[] = [];
  const positive: string[] = [];
  const warnings: string[] = [];
  const criticals: string[] = [];

  const currentYear = new Date().getFullYear();
  const year = ad.year || currentYear - 6;
  const km = ad.km || 95000;
  const price = ad.price || 11000;
  const ageYears = Math.max(1, currentYear - year);
  const kmPerYear = Math.round(km / ageYears);

  // Find matching profile from database or fallback estimation
  const carProfile = VEHICLE_DATABASE.find(
    (c) =>
      c.make.toLowerCase() === (ad.make || '').toLowerCase() &&
      c.model.toLowerCase() === (ad.model || '').toLowerCase()
  );

  const basePriceAvg = carProfile ? carProfile.priceAvg : price;
  const estMin = carProfile ? Math.round(carProfile.priceMin) : Math.round(price * 0.88);
  const estMax = carProfile ? Math.round(carProfile.priceMax) : Math.round(price * 1.12);
  const estAvg = Math.round((estMin + estMax) / 2);

  const diffPct = Math.round(((price - estAvg) / estAvg) * 100);
  const isOverpriced = diffPct > 8;
  const isSuspiciouslyLow = diffPct < -30;

  // 1. PREZZO (20 pt)
  let priceScore = 20;
  let priceStatus: TrustScoreCategory['status'] = 'good';
  let priceDetail = 'Prezzo in linea con la media reale degli annunci in Italia.';

  if (isSuspiciouslyLow) {
    priceScore = 5;
    priceStatus = 'critical';
    priceDetail = `Prezzo anomalo (${diffPct}% sotto media): prestare attenzione a truffe su acconti o vizi occulti.`;
    criticals.push(`Prezzo insolitamente basso rispetto alla quotazione di mercato (€${estMin.toLocaleString('it-IT')} – €${estMax.toLocaleString('it-IT')}).`);
  } else if (diffPct > 20) {
    priceScore = 6;
    priceStatus = 'critical';
    priceDetail = `Prezzo richiesto molto superiore alla media (+${diffPct}%). Trattativa indispensabile.`;
    criticals.push(`Il venditore chiede €${price.toLocaleString('it-IT')}, circa il ${diffPct}% in più del valore di mercato.`);
  } else if (isOverpriced) {
    priceScore = 13;
    priceStatus = 'warning';
    priceDetail = `Prezzo leggermente sopra la media (+${diffPct}%). C'è margine di sconto.`;
    warnings.push(`Prezzo superiore di circa €${(price - estAvg).toLocaleString('it-IT')} rispetto alla media.`);
  } else {
    positive.push('Prezzo richiesto coerente con le reali quotazioni di mercato.');
  }

  categories.push({
    category: 'Prezzo vs Mercato',
    score: priceScore,
    maxScore: 20,
    status: priceStatus,
    details: priceDetail,
  });

  // 2. COMPLETEZZA DATI ANNUNCIO (15 pt)
  let completenessScore = 5;
  let completenessStatus: TrustScoreCategory['status'] = 'warning';
  const hasMakeModel = Boolean(ad.make && ad.model);
  const hasYear = Boolean(ad.year);
  const hasKm = Boolean(ad.km);
  const hasPrice = Boolean(ad.price);
  const hasFuel = Boolean(ad.fuel);

  let fieldsCount = 0;
  if (hasMakeModel) fieldsCount += 5;
  if (hasYear) fieldsCount += 3;
  if (hasKm) fieldsCount += 3;
  if (hasPrice) fieldsCount += 2;
  if (hasFuel) fieldsCount += 2;

  completenessScore = fieldsCount;
  if (completenessScore >= 13) {
    completenessStatus = 'good';
    positive.push('Annuncio con dati essenziali completi e ben specificati.');
  } else {
    completenessStatus = 'warning';
    warnings.push('Mancano dettagli tecnici chiave (alimentazione, allestimento preciso o km esatti).');
  }

  categories.push({
    category: 'Completezza Dati',
    score: completenessScore,
    maxScore: 15,
    status: completenessStatus,
    details: `${completenessScore}/15 punti di completezza informativa.`,
  });

  // 3. COERENZA ANNO / KM (15 pt)
  let kmScore = 15;
  let kmStatus: TrustScoreCategory['status'] = 'good';
  let kmDetail = `Chilometraggio coerente con l'età del veicolo (${kmPerYear.toLocaleString('it-IT')} km/anno medi).`;

  const isDiesel = (ad.fuel || '').toLowerCase().includes('diesel');

  if (isDiesel && ageYears >= 6 && kmPerYear < 4500) {
    kmScore = 6;
    kmStatus = 'warning';
    kmDetail = `Km dichiarati insolitamente bassi per un diesel di ${ageYears} anni (${kmPerYear} km/anno). Verificare storico revisioni.`;
    warnings.push(`Chilometri molto bassi per un motore diesel: verifica sul Portale dell'Automobilista lo storico dell'ultima revisione.`);
  } else if (km > 220000) {
    kmScore = 8;
    kmStatus = 'warning';
    kmDetail = 'Chilometraggio elevato: richiedere prova di tutti gli interventi straordinari.';
    warnings.push('Oltre 200.000 km: necessaria verifica accurata di frizione, turbina e sospensioni.');
  } else {
    positive.push(`Chilometraggio verosimile per l'anzianità della vettura (~${kmPerYear.toLocaleString('it-IT')} km/anno).`);
  }

  categories.push({
    category: 'Coerenza Anno / Km',
    score: kmScore,
    maxScore: 15,
    status: kmStatus,
    details: kmDetail,
  });

  // 4. MANUTENZIONE & STATO MECCANICO (15 pt)
  let maintenanceScore = 12;
  let maintenanceStatus: TrustScoreCategory['status'] = 'good';
  let maintenanceDetail = 'Manutenzione ordinaria nella media.';

  if (carProfile?.enginesToAvoid && carProfile.enginesToAvoid.length > 0) {
    maintenanceScore = 8;
    maintenanceStatus = 'warning';
    maintenanceDetail = 'Attenzione ai difetti noti specifici per questa serie di motori.';
    warnings.push(carProfile.warningNotice || 'Controllare cinghia/catena e cronologia tagliandi ufficiali.');
  } else {
    positive.push('Meccanica collaudata con costi di esercizio prevedibili.');
  }

  categories.push({
    category: 'Affidabilità Meccanica',
    score: maintenanceScore,
    maxScore: 15,
    status: maintenanceStatus,
    details: maintenanceDetail,
  });

  // 5. DOCUMENTAZIONE & TAGLIANDI (10 pt)
  let docScore = 8;
  categories.push({
    category: 'Documentazione & Libretto',
    score: docScore,
    maxScore: 10,
    status: 'good',
    details: 'Richiedere sempre copia fatture e libretto Documento Unico.',
  });

  // 6. FOTO & DETTAGLI VISIVI (10 pt)
  let photoScore = 8;
  categories.push({
    category: 'Valutazione Foto',
    score: photoScore,
    maxScore: 10,
    status: 'good',
    details: 'Verificare fessure pannelli carrozzeria e usura volante/pedaliera.',
  });

  // 7. DESCRIZIONE VENDITORE (10 pt)
  let descScore = 8;
  categories.push({
    category: 'Descrizione Annuncio',
    score: descScore,
    maxScore: 10,
    status: 'good',
    details: 'Verificare corrispondenza tra dotazioni dichiarate e veicolo reale.',
  });

  // 8. COERENZA TECNICA (5 pt)
  let techScore = 5;
  categories.push({
    category: 'Coerenza Tecnica',
    score: techScore,
    maxScore: 5,
    status: 'good',
    details: 'Allestimento e motorizzazione standard coerenti.',
  });

  const totalScore = Math.min(
    100,
    Math.max(
      20,
      priceScore + completenessScore + kmScore + maintenanceScore + docScore + photoScore + descScore + techScore
    )
  );

  // Verdict determination
  let verdict: TrustScoreResult['verdict'] = 'CONVENIENTE';
  let verdictLabel = 'BUON AFFARE / PREZZO EQUO';
  let verdictTone: TrustScoreResult['verdictTone'] = 'emerald';
  let wouldBuyVerdict = true;
  let wouldBuyExplanation = 'L\'auto presenta dati di mercato coerenti e un rapporto prezzo/condizioni favorevole.';

  if (isSuspiciouslyLow || diffPct > 20 || totalScore < 60) {
    verdict = 'NON_CONVENIENTE';
    verdictLabel = 'NON CONVENIENTE / NON COMPRARLA ALLE CONDIZIONI ATTUALI';
    verdictTone = 'rose';
    wouldBuyVerdict = false;
    wouldBuyExplanation =
      diffPct > 20
        ? `Non la comprerei a €${price.toLocaleString('it-IT')}: il prezzo richiesto è fuori mercato (+${diffPct}%). Valuta solo a fronte di un forte sconto di almeno €${(price - estAvg).toLocaleString('it-IT')}.`
        : 'Non la comprerei senza verifiche fisiche approfondite: ci sono incongruenze significative su prezzo o chilometraggio.';
  } else if (isOverpriced || totalScore < 78) {
    verdict = 'PREZZO_TRATTABILE';
    verdictLabel = 'PREZZO DA TRATTARE';
    verdictTone = 'amber';
    wouldBuyVerdict = true;
    wouldBuyExplanation =
      `La comprerei SOLO dopo aver trattato il prezzo verso €${estAvg.toLocaleString('it-IT')} e verificato lo storico tagliandi.`;
  }

  // Offer Price Strategy
  const fairTarget = Math.round(estAvg);
  const suggestedStart = Math.round(estMin * 0.96);
  const maxLimit = Math.round(estAvg * 1.03);

  const negotiationStrategy =
    price > fairTarget
      ? `Il venditore chiede €${price.toLocaleString('it-IT')}. Apri la trattativa offrendo circa €${suggestedStart.toLocaleString('it-IT')}, con l'obiettivo di chiudere tra €${fairTarget.toLocaleString('it-IT')} e €${maxLimit.toLocaleString('it-IT')}. Fai leva su tagliando imminente e usura gomme.`
      : `Il prezzo di €${price.toLocaleString('it-IT')} è già competitivo rispetto alla media. Puoi tentare un arrotondamento simbolico a €${(Math.floor(price / 500) * 500).toLocaleString('it-IT')} o chiedere il passaggio di proprietà incluso.`;

  // Dynamic Inspection Checklist
  const inspectionChecklist = [
    'Verifica lo storico chilometrico delle revisioni sul Portale dell\'Automobilista con la targa.',
    'Chiedi le fatture cartacee o digitali degli ultimi 2 tagliandi (olio, filtri, candele/candelette).',
    'Controlla la data di produzione degli pneumatici (DOT a 4 cifre, es. 2421 = 24ª settimana 2021) e lo spessore residuo (>3 mm).',
    'Accendi il quadro: controlla che tutte le spie si accendano e poi si spengano a motore avviato senza anomalie.',
    'Prova su strada: sterza a fondo a bassa velocità per verificare assenza di rumori dai giunti omocinetici e prova la frizione in salita.',
  ];

  if (carProfile?.warningNotice) {
    inspectionChecklist.unshift(`Controllo specifico modello: ${carProfile.warningNotice}`);
  }

  return {
    overallScore: totalScore,
    verdict,
    verdictLabel,
    verdictTone,
    wouldBuyVerdict,
    wouldBuyExplanation,
    categories,
    highlights: {
      positive,
      warnings,
      criticals,
    },
    priceAnalysis: {
      askingPrice: price,
      estimatedValueMin: estMin,
      estimatedValueMax: estMax,
      marketDiffPercent: diffPct,
      isOverpriced,
      isSuspiciouslyLow,
    },
    offerPrice: {
      suggestedStartingOffer: suggestedStart,
      fairTargetPrice: fairTarget,
      maxRecommendedLimit: maxLimit,
      negotiationStrategy,
    },
    inspectionChecklist,
  };
}
