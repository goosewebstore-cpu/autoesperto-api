import type { VehicleData, ReliabilityAnalysis } from '@autoesperto/types';
import { getVehicleKnowledge } from './vehicleKB';
import { estimateMarketValue } from './pricing';

export interface AIAnalysisInput {
  vehicle: VehicleData;
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

function getVerdict(score: number): { verdict: ReliabilityAnalysis['verdict']; label: string } {
  if (score >= 8) return { verdict: 'BUY', label: 'Auto consigliata' };
  if (score >= 6) return { verdict: 'NEGOTIATE', label: 'Valuta attentamente' };
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
  const km = 100000;
  const power = parseInt((input.vehicle.power || '').replace(/\D/g, '')) || 100;
  const fuel = (input.vehicle.fuel || '').toLowerCase();
  const score = computeReliabilityScore(input.vehicle, km, knowledge);
  const { verdict, label } = getVerdict(score);

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

  const isGeneric = (s: string) => /verifica|controlla|cerca su|non disponibili/i.test(s);

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
    weaknesses: knowledge.common.slice(0, 3).filter((w: string) => !isGeneric(w)),
    engine: !isGeneric(knowledge.engine) ? knowledge.engine : 'Dati specifici sul motore non disponibili per questa versione.',
    transmission: !isGeneric(knowledge.transmission) ? knowledge.transmission : 'Dati specifici sul cambio non disponibili per questa versione.',
    maintenance: knowledge.maintenance,
    commonIssues: knowledge.common.filter((i: string) => !isGeneric(i)),
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
  const fullModel = `${input.vehicle.make} ${input.vehicle.model} ${input.vehicle.year || ''}`.trim();
  const prompt = `Analizza questo veicolo (${fullModel}) per un report di acquisto:

Modello: ${fullModel}
Versione: ${input.vehicle.version || 'N/A'}
Alimentazione: ${input.vehicle.fuel || 'N/A'}
Anno immatricolazione: ${input.vehicle.year || 'N/A'}

Usa la tua conoscenza su forum italiani (Quattroruote, forumauto.it), Reddit (r/cars_it), YouTube (recensioni).
Fornisci UNA SOLA risposta JSON valida con:
- "summary": analisi specifica (max 180 caratteri) basata sul modello reale, non generica
- "strengths": 3 punti di forza specifici di ${input.vehicle.make} ${input.vehicle.model}
- "weaknesses": 3 punti deboli specifici di ${input.vehicle.make} ${input.vehicle.model} (es. "Frizione pesante nel traffico", "Infotainment lento", "Materiali plastici interni"). NON scrivere "prezzo non disponibile", "km non disponibili" o frasi sul prezzo/chilometraggio
- "engine": analisi del motore specifica per ${input.vehicle.make} ${input.vehicle.model} (es. "1.6 Multijet 120 CV: affidabile, attenzione a FAP se uso urbano. Consiglio olio 5W-30 full synthetic."). NON scrivere "verifica", "controlla" o suggerimenti generici. Scrivi SOLO dati reali.
- "transmission": consigli specifici sul cambio per ${input.vehicle.make} ${input.vehicle.model} (es. "Cambio manuale a 6 marce preciso, automatico ZF 8HP raccomandato su versioni 190 CV"). NON scrivere "verifica", "controlla" o suggerimenti generici. Scrivi SOLO dati reali.
- "commonIssues": 3 problemi specifici noti presso community owners di ${input.vehicle.make} ${input.vehicle.model} (es. "Problemi EGR su 1.6 CRDi 2016-2018", "Usura prematura cuscinetti ruota posteriori")`;

  const resp = await fetch(`${getAIBaseUrl()}/chat/completions`, {
    method: 'POST',
    signal: AbortSignal.timeout(12000),
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
    body: JSON.stringify({
      model: getAIModel(),
      messages: [
        { role: 'system', content: 'Sei un meccanico esperto e consulente automotive italiano. Rispondi SOLO con JSON valido in italiano. Le tue risposte devono essere specifiche al modello (es. "DSG DQ200 ha recall frizione" non "verificare cambio").' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.4,
      response_format: { type: 'json_object' },
    }),
  });
  const data = await resp.json() as any;
  if (data.error) return null;
  const content = data.choices?.[0]?.message?.content;
  if (!content) return null;
  const ai = JSON.parse(content);

  const isGeneric = (s: string) => /verifica|controlla|cerca su|non disponibili|prezzo|km\s*non/i.test(s);

  return {
    ...base,
    summary: ai.summary || base.summary,
    strengths: (ai.strengths && ai.strengths.length >= 2) ? ai.strengths : base.strengths,
    weaknesses: (ai.weaknesses && ai.weaknesses.length >= 2) ? ai.weaknesses.filter((w: string) => !isGeneric(w)) : base.weaknesses,
    engine: ai.engine && !isGeneric(ai.engine) ? ai.engine : base.engine,
    transmission: ai.transmission && !isGeneric(ai.transmission) ? ai.transmission : base.transmission,
    commonIssues: (ai.commonIssues && ai.commonIssues.length >= 2) ? ai.commonIssues.filter((i: string) => !isGeneric(i)) : base.commonIssues,
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
