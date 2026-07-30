import type { VehicleData, ReliabilityAnalysis } from '@autoesperto/types';
import { getVehicleKnowledge } from './vehicleKB';
import { estimateMarketValue } from './pricing';

export interface AIAnalysisInput {
  vehicle: VehicleData;
  km?: number;
  requestedPrice?: number;
  marketValue: number;
}

function computeReliabilityScore(vehicle: VehicleData, km: number, knowledge: ReturnType<typeof getVehicleKnowledge>): number {
  const age = 2026 - (vehicle.year || 2020);
  let score = knowledge.reliabilityScore;
  if (age <= 5) score += 1.2;
  else if (age <= 8) score += 0.5;
  else score -= 0.8;

  if (km < 50000) score += 0.6;
  else if (km < 120000) score += 0.2;
  else if (km > 200000) score -= 1.0;

  if (knowledge.maintenance === 'basso') score += 0.5;
  if (knowledge.maintenance === 'molto alto') score -= 0.5;

  return Math.min(9.9, Math.max(3.0, Math.round(score * 10) / 10));
}

function getVerdict(score: number, priceVsMarket: number): { verdict: ReliabilityAnalysis['verdict']; label: string } {
  if (score >= 8 && priceVsMarket <= 10) return { verdict: 'BUY', label: 'Auto consigliata' };
  if (score >= 6 && priceVsMarket <= 25) return { verdict: 'NEGOTIATE', label: 'Valuta attentamente' };
  return { verdict: 'AVOID', label: 'Possibili problemi' };
}

function estimateCosts(vehicle: VehicleData, fuel: string, power: number) {
  const age = 2026 - (vehicle.year || 2020);
  const maintenance = age <= 5 ? 400 : age <= 10 ? 700 : 1100;
  const fuelCost = fuel.includes('diesel') ? 12 : fuel.includes('elettr') ? 6 : fuel.includes('ibrid') ? 8 : 15;
  const insurance = power < 90 ? 450 : power < 130 ? 650 : power < 180 ? 900 : 1300;
  return { maintenance, fuelCost, insurance };
}

function getAIBaseUrl() { return process.env.AI_BASE_URL || 'https://api.openai.com/v1'; }
function getAIModel() { return process.env.AI_MODEL || 'gpt-4o-mini'; }

export async function analyzeVehicle(input: AIAnalysisInput): Promise<ReliabilityAnalysis> {
  const knowledge = getVehicleKnowledge(input.vehicle.make);
  const km = input.km || 100000;
  const power = parseInt((input.vehicle.power || '').replace(/\D/g, '')) || 100;
  const fuel = (input.vehicle.fuel || '').toLowerCase();
  const priceVsMarket = input.requestedPrice && input.marketValue
    ? Math.round(((input.requestedPrice - input.marketValue) / input.marketValue) * 100)
    : 0;

  const score = computeReliabilityScore(input.vehicle, km, knowledge);
  const { verdict, label } = getVerdict(score, priceVsMarket);

  const costs = estimateCosts(input.vehicle, fuel, power);
  const { value: estimatedValue } = estimateMarketValue(input.vehicle);

  const future1 = Math.round(estimatedValue * (fuel.includes('diesel') ? 0.82 : 0.85) / 100) * 100;
  const future3 = Math.round(estimatedValue * (fuel.includes('diesel') ? 0.55 : 0.62) / 100) * 100;
  const future5 = Math.round(estimatedValue * (fuel.includes('diesel') ? 0.35 : 0.42) / 100) * 100;

  const summary = verdict === 'BUY'
    ? `${input.vehicle.make} ${input.vehicle.model} è un'ottima scelta: affidabile, con costi di gestione contenuti e valore di mercato sostenuto.`
    : verdict === 'NEGOTIATE'
    ? `${input.vehicle.make} ${input.vehicle.model} può andare bene, ma valuta il prezzo e verifica lo storico manutenzione prima di acquistare.`
    : `Attenzione: ${input.vehicle.make} ${input.vehicle.model} presenta rischi significativi di affidabilità o un prezzo troppo alto rispetto al mercato.`;

  const analysis: ReliabilityAnalysis = {
    score,
    verdict,
    verdictLabel: label,
    summary,
    strengths: [
      `Affidabilità generale ${knowledge.reliabilityScore}/10 per ${input.vehicle.make}.`,
      knowledge.robust,
      `Costi manutenzione ${knowledge.maintenance} per la categoria.`,
    ],
    weaknesses: knowledge.common.slice(0, 3),
    engine: knowledge.engine,
    transmission: knowledge.transmission,
    maintenance: knowledge.maintenance,
    commonIssues: knowledge.common,
    usage: knowledge.bestFor,
    futureCosts: {
      annualMaintenance: costs.maintenance,
      fuelCostPer100Km: costs.fuelCost,
      insuranceEstimate: costs.insurance,
      depreciation1Year: estimatedValue - future1,
      depreciation3Years: estimatedValue - future3,
      depreciation5Years: estimatedValue - future5,
    },
  };

  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey && openaiKey !== 'mock') {
    try {
      const enriched = await enrichWithAI(input, analysis, openaiKey);
      if (enriched) {
        console.log('AI enrichment: report arricchito con AI');
        return enriched;
      }
    } catch (e: any) {
      console.warn('AI enrichment fallito:', e.message);
    }
  }

  return analysis;
}

async function enrichWithAI(input: AIAnalysisInput, base: ReliabilityAnalysis, key: string): Promise<ReliabilityAnalysis | null> {
  const prompt = `Analizza questo veicolo per un report di acquisto:
- Modello: ${input.vehicle.make} ${input.vehicle.model} ${input.vehicle.year || ''}
- Versione: ${input.vehicle.version || 'N/A'}
- Km: ${input.km || 'N/A'}
- Carburante: ${input.vehicle.fuel || 'N/A'}
- Prezzo richiesto: €${input.requestedPrice || 'N/A'}
- Valore mercato: €${input.marketValue}
- Punteggio affidabilità base: ${base.score}/10

Fornisci UNA SOLA risposta JSON con questi campi:
- "summary": analisi personalizzata (max 150 caratteri)
- "strengths": array di 3 punti di forza specifici
- "weaknesses": array di 3 punti deboli specifici
- "recommendation": "comprare" | "trattare" | "evitare"`;

  const resp = await fetch(`${getAIBaseUrl()}/chat/completions`, {
    method: 'POST',
    signal: AbortSignal.timeout(8000),
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
    body: JSON.stringify({
      model: getAIModel(),
      messages: [
        { role: 'system', content: 'Sei un esperto automotive italiano. Rispondi SOLO con JSON valido.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.5,
      response_format: { type: 'json_object' },
    }),
  });
  const data = await resp.json() as any;
  if (data.error) return null;
  const content = data.choices?.[0]?.message?.content;
  if (!content) return null;
  const ai = JSON.parse(content);
  return {
    ...base,
    summary: ai.summary || base.summary,
    strengths: ai.strengths || base.strengths,
    weaknesses: ai.weaknesses || base.weaknesses,
  };
}

export async function askAutoEsperto(question: string, vehicle: VehicleData, analysis: ReliabilityAnalysis): Promise<string> {
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey || openaiKey === 'mock') {
    return mockAnswer(question, vehicle, analysis);
  }

  try {
    const response = await fetch(`${getAIBaseUrl()}/chat/completions`, {
      method: 'POST',
      signal: AbortSignal.timeout(15000),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
      model: getAIModel(),
        messages: [
          {
            role: 'system',
            content: 'Sei AutoEsperto, un consulente automotive italiano esperto. Rispondi in modo professionale, conciso e utile. Usa dati tecnici e di mercato per supportare la tua opinione.'
          },
          {
            role: 'user',
            content: `Veicolo: ${vehicle.make} ${vehicle.model} ${vehicle.year || ''}. Analisi: ${analysis.summary}. Domanda: ${question}`
          }
        ],
        temperature: 0.6,
      }),
    });
    const data = await response.json() as any;
    if (data.error) {
      console.warn('OpenAI API error:', data.error.message);
      return mockAnswer(question, vehicle, analysis);
    }
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      console.warn('OpenAI: risposta vuota');
      return mockAnswer(question, vehicle, analysis);
    }
    return content;
  } catch (e: any) {
    console.warn('OpenAI fetch error:', e.message);
    return mockAnswer(question, vehicle, analysis);
  }
}

function mockAnswer(question: string, vehicle: VehicleData, analysis: ReliabilityAnalysis): string {
  const q = question.toLowerCase();
  if (q.includes('conviene') || q.includes('comprare')) {
    return analysis.verdict === 'BUY'
      ? `Sì, ${vehicle.make} ${vehicle.model} è una scelta solida. ${analysis.summary} Verifica solo che l'auto abbia regolare tagliando e FAP/cinghia fatti.`
      : analysis.verdict === 'NEGOTIATE'
      ? `Può andare, ma con cautela. ${analysis.summary} Prova a trattare il prezzo e fai un test drive approfondito.`
      : `Sconsiglio l'acquisto. ${analysis.summary} I costi futuri e i problemi comuni superano i benefici.`;
  }
  if (q.includes('problema') || q.includes('difetti')) {
    return `I problemi più comuni su ${vehicle.make} ${vehicle.model} sono: ${analysis.commonIssues.slice(0, 3).join('; ')}.`;
  }
  if (q.includes('prezzo') || q.includes('trattare')) {
    return `Per ${vehicle.make} ${vehicle.model} ${vehicle.year || ''}, il valore di mercato è indicativamente quello mostrato. Se il prezzo richiesto è superiore al 10%, prova a trattare.`;
  }
  if (q.includes('manutenzione') || q.includes('costi')) {
    return `Manutenzione stimata: ${analysis.futureCosts.annualMaintenance}€/anno, carburante ~${analysis.futureCosts.fuelCostPer100Km}€/100km, assicurazione ~${analysis.futureCosts.insuranceEstimate}€/anno.`;
  }
  return `AutoEsperto consiglia di valutare ${vehicle.make} ${vehicle.model} in base a: affidabilità ${analysis.score}/10, costi ${analysis.maintenance} e problemi comuni noti. Vuoi approfondire un aspetto specifico?`;
}
