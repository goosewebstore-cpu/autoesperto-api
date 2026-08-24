import { VEHICLE_DATABASE } from './finderEngine';

export interface DecisionCardData {
  verdict: 'SI' | 'VALUTA_CON_ATTENZIONE' | 'NO';
  verdictLabel: string;
  verdictTone: 'emerald' | 'amber' | 'rose';
  conditionSummary: string;
  ratings: {
    price: number; // 0 - 10
    declaredCondition: number; // 0 - 10
    marketValue: number; // 0 - 10
    riskIndex: number; // 0 - 10 (lower is better, e.g. 2/10 = very low risk)
    personalFit: number; // 0 - 10
  };
  negotiationVerdict: string;
}

export interface WhyAndWhyNot {
  whyBuy: string[];
  whyNot: string[];
}

export interface PrePurchaseChecklist {
  beforeViewing: Array<{ task: string; tip: string }>;
  duringInspection: Array<{ task: string; tip: string }>;
  beforePaying: Array<{ task: string; tip: string }>;
}

export function generateDecisionCard(
  make: string,
  model: string,
  year: number,
  km: number,
  askingPrice: number,
  estimatedMarketAvg: number,
  matchScore: number = 85
): DecisionCardData {
  const diffPct = Math.round(((askingPrice - estimatedMarketAvg) / estimatedMarketAvg) * 100);

  let priceRating = 7;
  let riskRating = 3;
  let verdict: DecisionCardData['verdict'] = 'SI';
  let verdictLabel = '🟢 SÌ, ACQUISTO CONSIGLIATO';
  let verdictTone: DecisionCardData['verdictTone'] = 'emerald';
  let negotiationVerdict = `Offerta in linea: puoi provare a chiudere a €${Math.round(askingPrice * 0.96).toLocaleString('it-IT')} chiedendo il tagliando incluso.`;

  if (diffPct > 15) {
    verdict = 'NO';
    verdictLabel = '🔴 NO, NON ALLE CONDIZIONI ATTUALI';
    verdictTone = 'rose';
    priceRating = 3;
    riskRating = 7;
    negotiationVerdict = `La prenderei SOLO se il venditore accetta di scendere a circa €${Math.round(estimatedMarketAvg).toLocaleString('it-IT')}.`;
  } else if (diffPct > 5 || km > 160000) {
    verdict = 'VALUTA_CON_ATTENZIONE';
    verdictLabel = '🟡 VALUTALA CON ATTENZIONE';
    verdictTone = 'amber';
    priceRating = 5;
    riskRating = 5;
    negotiationVerdict = `La prenderei se il venditore accetta circa €${Math.round(estimatedMarketAvg * 0.98).toLocaleString('it-IT')} e dimostra i tagliandi certificati.`;
  } else if (diffPct <= -10) {
    priceRating = 9;
    riskRating = 4; // suspicious bargain check
    negotiationVerdict = `Prezzo molto competitivo: verificare tempestivamente che non vi siano fermi amministrativi o incidenti pregressi.`;
  }

  const personalFitRating = Math.min(10, Math.max(5, Math.round(matchScore / 10)));
  const conditionRating = km < 80000 ? 9 : km < 140000 ? 7 : 5;
  const marketValueRating = Math.min(10, Math.max(4, 10 - Math.max(0, Math.round(diffPct / 3))));

  return {
    verdict,
    verdictLabel,
    verdictTone,
    conditionSummary: `Esemplare del ${year} con ${km.toLocaleString('it-IT')} km.`,
    ratings: {
      price: priceRating,
      declaredCondition: conditionRating,
      marketValue: marketValueRating,
      riskIndex: riskRating,
      personalFit: personalFitRating,
    },
    negotiationVerdict,
  };
}

export function generateWhyAndWhyNot(make: string, model: string): WhyAndWhyNot {
  const profile = VEHICLE_DATABASE.find(
    (c) =>
      c.make.toLowerCase() === make.toLowerCase() &&
      c.model.toLowerCase() === model.toLowerCase()
  );

  if (profile) {
    const whyNotList: string[] = [];
    if (profile.warningNotice) whyNotList.push(profile.warningNotice);
    if (profile.spaceRating <= 3.5) whyNotList.push('Abitabilità posteriore e bagagliaio compatti rispetto a una station wagon.');
    if (profile.annualMaintenanceEst > 230) whyNotList.push('Costi dei ricambi e manodopera di fascia medio-alta.');
    if (profile.resaleRating >= 4.8) whyNotList.push('Prezzi dell\'usato sostenuti: si svaluta poco quindi costa di più comprarla.');
    if (whyNotList.length === 0) whyNotList.push('Controllare attentamente lo storico delle manutenzioni ordinarie.');

    return {
      whyBuy: profile.reasonsToBuy,
      whyNot: whyNotList,
    };
  }

  // Generic fallback
  return {
    whyBuy: [
      'Diffusione capillare sul territorio italiano con ricambi facilmente reperibili',
      'Costi di gestione e consumi commisurati al segmento',
      'Buona tenuta del valore sul mercato dell\'usato'
    ],
    whyNot: [
      'Richiede verifica puntuale della cronologia tagliandi e dello stato d\'usura di freni e frizione',
      'Valutare la classe ambientale Euro in caso di accesso a ZTL cittadine'
    ],
  };
}

export function generateSellerQuestions(
  make: string,
  model: string,
  fuel?: string,
  km?: number
): string[] {
  const questions: string[] = [
    'Hai a disposizione le fatture cartacee o la cronologia digitale di tutti i tagliandi eseguiti?',
    'Quanti proprietari precedenti ha avuto l\'auto e per quali percorsi è stata usata principalmente?',
    'Il veicolo ha mai subito incidenti con riparazioni strutturali di carrozzeria?',
  ];

  const fuelLower = (fuel || '').toLowerCase();
  const makeModel = `${make} ${model}`.toLowerCase();

  if (makeModel.includes('peugeot') || makeModel.includes('citroen') || makeModel.includes('opel')) {
    questions.push('Se il motore è il 1.2 PureTech a benzina, quando è stata controllata o sostituita la cinghia di distribuzione a bagno d\'olio?');
  }

  if (makeModel.includes('bmw')) {
    questions.push('Sui motori diesel 2.0 (N47/B47), è mai stata controllata o sostituita la catena di distribuzione?');
  }

  if (makeModel.includes('toyota') || fuelLower.includes('hybrid')) {
    questions.push('È stato eseguito l\'Hybrid Health Check annuale Toyota per mantenere attiva la garanzia sulla batteria di trazione?');
  }

  if (fuelLower.includes('diesel') && (km || 0) > 100000) {
    questions.push('Il filtro antiparticolato (FAP/DPF) o la valvola EGR hanno mai richiesto pulizie o sostituzioni?');
  }

  if ((km || 0) > 90000) {
    questions.push('La cinghia o la catena di distribuzione, la pompa dell\'acqua e la frizione sono ancora quelle originali o sono già state sostituite?');
  }

  questions.push('Gli pneumatici montati quanti chilometri hanno percorso e qual è il loro anno di produzione (codice DOT)?');
  questions.push('Tutte le dotazioni elettroniche (aria condizionata, sensori, infotainment, alzacristalli) funzionano senza anomalie?');

  return questions;
}

export function generatePrePurchaseChecklist(): PrePurchaseChecklist {
  return {
    beforeViewing: [
      {
        task: 'Verifica storico revisioni sul Portale dell\'Automobilista',
        tip: 'Inserisci la targa per verificare i km registrati all\'ultima revisione biennale e accertarti che non siano stati scalati.',
      },
      {
        task: 'Visura PRA / Targa per assenza fermi amministrativi',
        tip: 'Accertati che non vi siano ipoteche o fermi fiscali pendenti sul veicolo prima di versare qualsiasi caparra.',
      },
      {
        task: 'Richiesta copia libretto (Documento Unico di Circolazione)',
        tip: 'Verifica intestatario, omologazione Euro e numero di telaio VIN corrispondente.',
      },
    ],
    duringInspection: [
      {
        task: 'Avviamento a freddo del motore',
        tip: 'Tocca il cofano prima di accendere: deve essere freddo. Ascolta che non ci siano battiti metallici o fumi anomali allo scarico.',
      },
      {
        task: 'Controllo fessure tra i pannelli e viti parafanghi',
        tip: 'Se le fessure tra cofano, fari e portiere non sono simmetriche o se le viti mostrano segni di chiave, l\'auto potrebbe aver subito un sinistro.',
      },
      {
        task: 'Controllo usura pneumatici e codice DOT a 4 cifre',
        tip: 'Controlla che le gomme abbiano più di 3 mm di battistrada e non abbiano più di 4-5 anni (es. DOT 2421 = 2021).',
      },
      {
        task: 'Prova su strada: frizione, sterzo e frenata',
        tip: 'In salita verifica che la frizione non slitti. Frena deciso con le mani morbide sul volante per controllare che l\'auto non tiri a destra o sinistra.',
      },
    ],
    beforePaying: [
      {
        task: 'Firma dell\'atto di vendita presso agenzia pratiche auto o ACI',
        tip: 'Effettua sempre il passaggio di proprietà contestualmente al pagamento.',
      },
      {
        task: 'Pagamento tracciabile e sicuro',
        tip: 'Usa bonifico istantaneo concordato o assegno circolare verificato. Non pagare mai in contanti oltre i limiti di legge né con ricariche.',
      },
      {
        task: 'Ritiro della doppia chiave originale',
        tip: 'Verifica che ti vengano consegnate entrambe le chiavi con telecomando funzionante (rifarne una costa dai 150 ai 350 €).',
      },
    ],
  };
}
