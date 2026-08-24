import type { FinderCriteria, FinderMatchResult } from './finderEngine';
import { runAutoFinder, VEHICLE_DATABASE } from './finderEngine';
import { computeAdTrustScore } from './trustScore';
import { parseListingTextOrUrl, type ParsedAdData } from './adParser';

export interface AdvisorContext {
  criteria?: FinderCriteria;
  lastFinderResults?: FinderMatchResult[];
  lastAnalyzedAd?: ParsedAdData;
  savedVehicles?: string[];
  userPreferencesSummary?: string;
}

export interface AdvisorMessage {
  id: string;
  sender: 'user' | 'advisor';
  text: string;
  timestamp: string;
  recommendedCars?: Array<{
    make: string;
    model: string;
    priceAvg: number;
    matchScore?: number;
    reason: string;
  }>;
  actionCta?: {
    label: string;
    href: string;
    type: 'finder' | 'ad_check' | 'passport';
  };
}

const ADVISOR_STORAGE_KEY = 'autoesperto_ai_advisor_history_v1';
const CONTEXT_STORAGE_KEY = 'autoesperto_ai_advisor_context_v1';

export function getAdvisorContext(): AdvisorContext {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(CONTEXT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveAdvisorContext(ctx: Partial<AdvisorContext>) {
  if (typeof window === 'undefined') return;
  try {
    const current = getAdvisorContext();
    const merged = { ...current, ...ctx };
    localStorage.setItem(CONTEXT_STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // Ignore storage errors
  }
}

export function getAdvisorHistory(): AdvisorMessage[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ADVISOR_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveAdvisorHistory(messages: AdvisorMessage[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ADVISOR_STORAGE_KEY, JSON.stringify(messages.slice(-30)));
  } catch {
    // Ignore storage errors
  }
}

export function generateAdvisorResponse(
  userQuery: string,
  context?: AdvisorContext
): AdvisorMessage {
  const q = userQuery.toLowerCase().trim();
  const now = new Date().toISOString();
  const ctx = context || getAdvisorContext();

  // 1. Check if user pasted an ad link or raw listing
  const parsed = parseListingTextOrUrl(userQuery);
  if (parsed.make && parsed.model) {
    const trust = computeAdTrustScore(parsed);
    saveAdvisorContext({ lastAnalyzedAd: parsed });

    const toneText = trust.wouldBuyVerdict
      ? `🟢 **Verdetto**: ${trust.wouldBuyExplanation}`
      : `🔴 **Attenzione**: ${trust.wouldBuyExplanation}`;

    return {
      id: 'adv-' + Math.random().toString(36).slice(2, 9),
      sender: 'advisor',
      timestamp: now,
      text: `Ho analizzato l'annuncio per **${parsed.make} ${parsed.model}** (${parsed.year || 'Anno N.D.'}, ${parsed.km ? parsed.km.toLocaleString('it-IT') + ' km' : 'km N.D.'}, ${parsed.price ? '€' + parsed.price.toLocaleString('it-IT') : 'prezzo N.D.'}):

• **Trust Score Annuncio**: ${trust.overallScore}/100
• **Valore Stimato di Mercato**: €${trust.priceAnalysis.estimatedValueMin.toLocaleString('it-IT')} – €${trust.priceAnalysis.estimatedValueMax.toLocaleString('it-IT')}
• **Strategia di Trattativa**: ${trust.offerPrice.negotiationStrategy}

${toneText}

Prima di firmare, controlla:
${trust.inspectionChecklist.slice(0, 3).map((c) => `• ${c}`).join('\n')}`,
      actionCta: {
        label: `Analisi completa ${parsed.make} ${parsed.model}`,
        href: `/analizza-annuncio?make=${encodeURIComponent(parsed.make)}&model=${encodeURIComponent(parsed.model)}&price=${parsed.price || ''}&km=${parsed.km || ''}&year=${parsed.year || ''}`,
        type: 'ad_check',
      },
    };
  }

  // 2. "La compreresti?" intent
  if (q.includes('la compreresti') || q.includes('comprarla') || q.includes('conviene comprare')) {
    if (ctx.lastAnalyzedAd?.make) {
      const trust = computeAdTrustScore(ctx.lastAnalyzedAd);
      return {
        id: 'adv-' + Math.random().toString(36).slice(2, 9),
        sender: 'advisor',
        timestamp: now,
        text: `Riguardo alla **${ctx.lastAnalyzedAd.make} ${ctx.lastAnalyzedAd.model}** che abbiamo analizzato:

${trust.wouldBuyExplanation}

• **Prezzo da offrire per iniziare**: €${trust.offerPrice.suggestedStartingOffer.toLocaleString('it-IT')}
• **Prezzo massimo raccomandato**: €${trust.offerPrice.maxRecommendedLimit.toLocaleString('it-IT')}

Se il venditore non scende sotto questa soglia o non fornisce le fatture dei tagliandi, ti consiglio di valutare le alternative emerse dal tuo Auto Finder.`,
      };
    }

    return {
      id: 'adv-' + Math.random().toString(36).slice(2, 9),
      sender: 'advisor',
      timestamp: now,
      text: 'Incollami il link dell\'annuncio (AutoScout24, Subito, Facebook) o i dati dell\'auto (es. "Fiat Panda 2021 45.000 km 9.500 €") e ti darò il mio parere schietto con la quotazione reale e i punti critici da verificare!',
      actionCta: {
        label: 'Controlla un annuncio',
        href: '/analizza-annuncio',
        type: 'ad_check',
      },
    };
  }

  // 3. "Quanto offrire?" intent
  if (q.includes('quanto offrire') || q.includes('trattare') || q.includes('sconto')) {
    return {
      id: 'adv-' + Math.random().toString(36).slice(2, 9),
      sender: 'advisor',
      timestamp: now,
      text: `Per trattare con successo il prezzo di un'auto usata:

1. **Non chiedere genericamente uno sconto**: quantifica i lavori imminenti (tagliando ~250 €, gomme usurate ~400 €, revisione ~80 €).
2. **Apri la trattativa circa il 5–8% sotto la media di mercato** per lasciare al venditore lo spazio psicologico di venirti incontro.
3. **Con i concessionari**, se sono rigidi sul prezzo, chiedi il passaggio di proprietà incluso (circa 350–500 € risparmiati) o il tagliando completo preconsegna.`,
      actionCta: {
        label: 'Calcola margine di trattativa',
        href: '/analizza-annuncio',
        type: 'ad_check',
      },
    };
  }

  // 4. Budget & general requirements inquiry (e.g. "Ho 10.000€, faccio 15.000 km e voglio un'auto affidabile")
  const budgetMatch = q.match(/(\d{1,2}(?:\.|\s)?\d{3})\s?€?/);
  let extractedBudget = 12000;
  if (budgetMatch) {
    extractedBudget = Number.parseInt(budgetMatch[1].replace(/\D/g, ''), 10);
  }

  const isFamily = q.includes('famiglia') || q.includes('spazio') || q.includes('bambin');
  const isCity = q.includes('città') || q.includes('citta') || q.includes('parcheggio');
  const isHighKm = q.includes('20.000') || q.includes('30.000') || q.includes('autostrada') || q.includes('diesel');

  const finderResult = runAutoFinder({
    budgetMax: extractedBudget,
    usages: isFamily ? ['famiglia', 'viaggi'] : isCity ? ['citta', 'misto'] : ['misto'],
    annualKm: isHighKm ? 25000 : isCity ? 9000 : 14000,
    fuel: isHighKm ? 'diesel' : 'indifferente',
    transmission: 'indifferente',
    bodyTypes: isFamily ? ['suv', 'station_wagon', 'monovolume'] : [],
    priorities: ['affidabilita', 'prezzo', 'consumi'],
    freeText: userQuery,
  });

  const top3 = finderResult.matches.slice(0, 3);
  saveAdvisorContext({
    criteria: {
      budgetMax: extractedBudget,
      usages: isFamily ? ['famiglia'] : ['citta'],
      annualKm: isHighKm ? 25000 : 12000,
      fuel: 'indifferente',
      transmission: 'indifferente',
      bodyTypes: [],
      priorities: ['affidabilita'],
    },
    lastFinderResults: top3,
  });

  const recommendations = top3.map((m) => ({
    make: m.vehicle.make,
    model: m.vehicle.model,
    priceAvg: m.vehicle.priceAvg,
    matchScore: m.matchScore,
    reason: m.whySuitsYou[0] || m.vehicle.reasonsToBuy[0],
  }));

  return {
    id: 'adv-' + Math.random().toString(36).slice(2, 9),
    sender: 'advisor',
    timestamp: now,
    text: `In base a quello che mi hai indicato (budget circa **€${extractedBudget.toLocaleString('it-IT')}** e le tue esigenze di utilizzo), ecco le 3 scelte migliori selezionate dal nostro Matching Engine:

${top3
  .map(
    (t, idx) =>
      `**${idx + 1}. ${t.vehicle.make} ${t.vehicle.model}** (Match: ${t.matchScore}/100)\n• Prezzo medio usato: €${t.vehicle.priceAvg.toLocaleString('it-IT')}\n• ${t.whySuitsYou.slice(0, 2).join('\n• ')}`
  )
  .join('\n\n')}

Vuoi vedere tutti i dettagli o provare a filtrare per un tipo di carrozzeria specifico?`,
    recommendedCars: recommendations,
    actionCta: {
      label: 'Esplora i risultati nel dettaglio',
      href: `/auto-finder?budget=${extractedBudget}`,
      type: 'finder',
    },
  };
}
