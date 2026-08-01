import type { VehicleData, ReliabilityAnalysis } from '@autoesperto/types';
import { getVehicleKnowledge } from './vehicleKB';
import { estimateMarketValue } from './pricing';
import { cacheGet, cacheSet } from './cache';

export interface AIAnalysisInput {
  vehicle: VehicleData;
  km?: number;
  requestedPrice?: number;
}

export interface PhotoAnalysisInput {
  imageData: string;
  vehicle?: Partial<Pick<VehicleData, 'make' | 'model' | 'year'>>;
}

export interface PhotoAnalysisResult {
  vehicle: { make?: string; model?: string; generation?: string; confidence: 'bassa' | 'media' | 'alta' };
  damage: { visible: boolean; category: 'graffio' | 'ammaccatura' | 'paraurti' | 'fanale' | 'specchietto' | 'cerchio_gomma' | 'nessun_danno_evidente' | 'non_chiaro'; severity: 'lieve' | 'media' | 'alta'; description: string };
  repairRange?: { min: number; max: number };
  note: string;
}

const AI_ENRICH_ENABLED = process.env.AI_ENRICH === 'true';

function computeReliabilityScore(vehicle: VehicleData, km: number, knowledge: ReturnType<typeof getVehicleKnowledge>): number {
  const currentYear = new Date().getFullYear();
  const age = currentYear - (vehicle.year || currentYear - 5);
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
  if (score >= 7.5) return { verdict: 'BUY', label: 'Affidabile' };
  if (score >= 6) return { verdict: 'NEGOTIATE', label: 'Valuta con attenzione' };
  return { verdict: 'AVOID', label: 'Rischi possibili' };
}

function estimateCosts(vehicle: VehicleData, fuel: string, power: number) {
  const currentYear = new Date().getFullYear();
  const age = currentYear - (vehicle.year || currentYear - 5);
  const maintenance = age <= 5 ? 400 : age <= 10 ? 700 : 1100;
  const fuelCost = fuel.includes('diesel') ? 12 : fuel.includes('elettr') ? 6 : fuel.includes('ibrid') ? 8 : 15;
  const insurance = power < 90 ? 450 : power < 130 ? 650 : power < 180 ? 900 : 1300;
  return { maintenance, fuelCost, insurance };
}

function getAIBaseUrl() { return process.env.AI_BASE_URL || 'https://api.openai.com/v1'; }
function getAIModel() { return process.env.AI_MODEL || 'gpt-4o-mini'; }
function getVisionModel() { return process.env.VISION_MODEL || 'gpt-4o-mini'; }

const repairRanges: Record<PhotoAnalysisResult['damage']['category'], Record<PhotoAnalysisResult['damage']['severity'], [number, number]>> = {
  graffio: { lieve: [120, 280], media: [250, 550], alta: [450, 900] },
  ammaccatura: { lieve: [150, 350], media: [300, 700], alta: [600, 1400] },
  paraurti: { lieve: [220, 500], media: [450, 950], alta: [800, 1800] },
  fanale: { lieve: [120, 300], media: [250, 700], alta: [500, 1500] },
  specchietto: { lieve: [100, 250], media: [180, 450], alta: [350, 800] },
  cerchio_gomma: { lieve: [80, 200], media: [160, 450], alta: [300, 900] },
  nessun_danno_evidente: { lieve: [0, 0], media: [0, 0], alta: [0, 0] },
  non_chiaro: { lieve: [0, 0], media: [0, 0], alta: [0, 0] },
};

export async function analyzeVehiclePhoto(input: PhotoAnalysisInput): Promise<PhotoAnalysisResult> {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) return analyzeVehiclePhotoWithGemini(input, geminiKey);
  const key = process.env.OPENAI_API_KEY;
  if (!key || key === 'mock') throw new Error('Analisi foto non configurata');

  const vehicleContext = input.vehicle ? `${input.vehicle.make || ''} ${input.vehicle.model || ''} ${input.vehicle.year || ''}`.trim() : 'non indicato';
  const response = await fetch(`${getAIBaseUrl()}/chat/completions`, {
    method: 'POST',
    signal: AbortSignal.timeout(20000),
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: getVisionModel(),
      temperature: 0.1,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'Sei AutoEsperto. Analizza SOLO elementi visibili esterni dell\'auto. Ignora completamente targhe, numeri di targa, persone, indirizzi e ogni altro dato personale: non trascriverli, non dedurli e non citarli. Non diagnosticare motore, telaio, incidenti pregressi, sicurezza o chilometri. Rispondi solo JSON in italiano.' },
        { role: 'user', content: [
          { type: 'text', text: `Veicolo dichiarato: ${vehicleContext}. Riconosci, se possibile, marca/modello/generazione visibili. Poi restituisci {"vehicle":{"make":"","model":"","generation":"","confidence":"bassa|media|alta"},"damage":{"visible":true,"category":"graffio|ammaccatura|paraurti|fanale|specchietto|cerchio_gomma|nessun_danno_evidente|non_chiaro","severity":"lieve|media|alta","description":"max 180 caratteri"}}.` },
          { type: 'image_url', image_url: { url: input.imageData, detail: 'low' } },
        ] },
      ],
    }),
  });
  const data = await response.json() as any;
  const raw = data.choices?.[0]?.message?.content;
  if (!response.ok || !raw) {
    const providerMessage = typeof data?.error?.message === 'string' ? data.error.message : '';
    throw new Error(providerMessage || `Il provider visivo non ha restituito un risultato (HTTP ${response.status}).`);
  }
  const parsed = parseJsonContent<any>(raw);
  const categories = Object.keys(repairRanges);
  const category = categories.includes(parsed?.damage?.category) ? parsed.damage.category : 'non_chiaro';
  const severity = ['lieve', 'media', 'alta'].includes(parsed?.damage?.severity) ? parsed.damage.severity : 'media';
  const visible = Boolean(parsed?.damage?.visible) && category !== 'nessun_danno_evidente' && category !== 'non_chiaro';
  const range = visible ? repairRanges[category as PhotoAnalysisResult['damage']['category']][severity as PhotoAnalysisResult['damage']['severity']] : undefined;
  return {
    vehicle: {
      make: typeof parsed?.vehicle?.make === 'string' ? parsed.vehicle.make.slice(0, 50) : undefined,
      model: typeof parsed?.vehicle?.model === 'string' ? parsed.vehicle.model.slice(0, 50) : undefined,
      generation: typeof parsed?.vehicle?.generation === 'string' ? parsed.vehicle.generation.slice(0, 80) : undefined,
      confidence: ['bassa', 'media', 'alta'].includes(parsed?.vehicle?.confidence) ? parsed.vehicle.confidence : 'bassa',
    },
    damage: {
      visible,
      category,
      severity,
      description: typeof parsed?.damage?.description === 'string' ? parsed.damage.description.slice(0, 180) : 'La foto non permette una valutazione affidabile del danno.',
    },
    repairRange: range ? { min: range[0], max: range[1] } : undefined,
    note: 'Stima visiva indicativa: ricambi, verniciatura, sensori e manodopera possono cambiare il preventivo. La foto non certifica danni nascosti o meccanici.',
  };
}

async function analyzeVehiclePhotoWithGemini(input: PhotoAnalysisInput, key: string): Promise<PhotoAnalysisResult> {
  const match = input.imageData.match(/^data:(image\/(?:jpeg|jpg|png|webp));base64,(.+)$/);
  if (!match) throw new Error('Formato immagine non valido.');
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent', {
    method: 'POST', signal: AbortSignal.timeout(20000),
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify({
      contents: [{ parts: [
        { text: 'Analizza questa foto di auto. Ignora completamente targhe, persone e dati personali. Rispondi SOLO con JSON: {"vehicle":{"make":"","model":"","generation":"","confidence":"bassa|media|alta"},"damage":{"visible":false,"category":"graffio|ammaccatura|paraurti|fanale|specchietto|cerchio_gomma|nessun_danno_evidente|non_chiaro","severity":"lieve|media|alta","description":""}}. Riconosci marca e modello quando visibili; descrivi solo danni esterni visibili.' },
        { inline_data: { mime_type: match[1], data: match[2] } },
      ] }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.1 },
    }),
  });
  const data = await response.json() as any;
  const raw = data.candidates?.[0]?.content?.parts?.map((part: any) => part.text || '').join('');
  if (!response.ok || !raw) throw new Error(data?.error?.message || `Gemini non ha restituito un risultato (HTTP ${response.status}).`);
  const parsed = parseJsonContent<any>(raw);
  const categories = Object.keys(repairRanges);
  const category = categories.includes(parsed?.damage?.category) ? parsed.damage.category : 'non_chiaro';
  const severity = ['lieve', 'media', 'alta'].includes(parsed?.damage?.severity) ? parsed.damage.severity : 'media';
  const visible = Boolean(parsed?.damage?.visible) && category !== 'nessun_danno_evidente' && category !== 'non_chiaro';
  const range = visible ? repairRanges[category as PhotoAnalysisResult['damage']['category']][severity as PhotoAnalysisResult['damage']['severity']] : undefined;
  return {
    vehicle: { make: typeof parsed?.vehicle?.make === 'string' ? parsed.vehicle.make.slice(0, 50) : undefined, model: typeof parsed?.vehicle?.model === 'string' ? parsed.vehicle.model.slice(0, 50) : undefined, generation: typeof parsed?.vehicle?.generation === 'string' ? parsed.vehicle.generation.slice(0, 80) : undefined, confidence: ['bassa', 'media', 'alta'].includes(parsed?.vehicle?.confidence) ? parsed.vehicle.confidence : 'bassa' },
    damage: { visible, category, severity, description: typeof parsed?.damage?.description === 'string' ? parsed.damage.description.slice(0, 180) : 'La foto non permette una valutazione affidabile del danno.' },
    repairRange: range ? { min: range[0], max: range[1] } : undefined,
    note: 'Stima visiva indicativa: ricambi e manodopera possono cambiare il preventivo. La foto non certifica danni nascosti o meccanici.',
  };
}

const isGeneric = (s: string) => /verifica|controlla|cerca su|non disponibili/i.test(s);

function buildAdvice(knowledge: ReturnType<typeof getVehicleKnowledge>, make: string, model: string, source: 'plate' | 'model' | undefined): string[] {
  const advice: string[] = [];
  if (knowledge.versionsToAvoid.length) advice.push(`Evita: ${knowledge.versionsToAvoid.slice(0, 2).join(' · ')}.`);
  if (knowledge.versionsRecommended.length) advice.push(`Preferisci: ${knowledge.versionsRecommended.slice(0, 2).join(' · ')}.`);
  if (source === 'model') {
    advice.push('Dati basati sul modello: verifica l\'esemplare specifico prima dell\'acquisto.');
  } else {
    advice.push('Richiedi lo storico tagliandi e verifica revisione e cinghia/distribuzione.');
  }
  advice.push('Fai un test drive di almeno 30 minuti e controlla partenza a freddo, frenata e rumori anomali.');
  return advice;
}

export async function analyzeVehicle(input: AIAnalysisInput): Promise<ReliabilityAnalysis> {
  const { vehicle } = input;
  const cacheKey = [
    'analysis',
    vehicle.make.toLowerCase(),
    vehicle.model.toLowerCase(),
    vehicle.year || '',
    vehicle.fuel || '',
    input.km || '',
  ].join(':');
  const cached = cacheGet<ReliabilityAnalysis>(cacheKey);
  if (cached) return cached;

  const knowledge = getVehicleKnowledge(vehicle.make);
  const km = input.km || 100000;
  const power = parseInt((vehicle.power || '').replace(/\D/g, '')) || 100;
  const fuel = (vehicle.fuel || '').toLowerCase();

  const score = computeReliabilityScore(vehicle, km, knowledge);
  const { verdict, label } = getVerdict(score);

  const costs = estimateCosts(vehicle, fuel, power);
  const { value: estimatedValue } = estimateMarketValue(vehicle);

  const future1 = Math.round(estimatedValue * (fuel.includes('diesel') ? 0.82 : 0.85) / 100) * 100;
  const future3 = Math.round(estimatedValue * (fuel.includes('diesel') ? 0.55 : 0.62) / 100) * 100;
  const future5 = Math.round(estimatedValue * (fuel.includes('diesel') ? 0.35 : 0.42) / 100) * 100;

  const summary = verdict === 'BUY'
    ? `${vehicle.make} ${vehicle.model} è un modello complessivamente affidabile e con costi di gestione contenuti.`
    : verdict === 'NEGOTIATE'
    ? `${vehicle.make} ${vehicle.model} può essere una scelta valida, ma richiede controlli mirati: verifica storico manutenzione e condizioni generali.`
    : `${vehicle.make} ${vehicle.model} presenta alcuni rischi noti di affidabilità o costi elevati: valuta con molta attenzione.`;

  const weaknesses = knowledge.common.slice(0, 3).filter((w: string) => !isGeneric(w));

  const analysis: ReliabilityAnalysis = {
    score,
    verdict,
    verdictLabel: label,
    summary,
    strengths: [
      `Affidabilità complessiva ${knowledge.reliabilityScore}/10 per ${vehicle.make}.`,
      knowledge.robust,
      `Costi manutenzione ${knowledge.maintenance} per la categoria.`,
    ].filter(Boolean),
    weaknesses: weaknesses.length ? weaknesses : ['Nessuna criticità grave segnalata per questo modello.'],
    advice: buildAdvice(knowledge, vehicle.make, vehicle.model, vehicle.dataSource),
    engine: !isGeneric(knowledge.engine)
      ? knowledge.engine
      : `Motori ${vehicle.make}: affidabilità media, verificare condizioni reali dell'esemplare.`,
    transmission: !isGeneric(knowledge.transmission)
      ? knowledge.transmission
      : `Cambio ${vehicle.make}: preferire versioni con cambio manuale o automatico con tagliandi documentati.`,
    maintenance: knowledge.maintenance,
    commonIssues: knowledge.common.filter((i: string) => !isGeneric(i)),
    usage: knowledge.bestFor,
    recommendedVersions: knowledge.versionsRecommended,
    versionsToAvoid: knowledge.versionsToAvoid,
    aiEnhanced: false,
    futureCosts: {
      annualMaintenance: costs.maintenance,
      fuelCostPer100Km: costs.fuelCost,
      insuranceEstimate: costs.insurance,
      depreciation1Year: estimatedValue - future1,
      depreciation3Years: estimatedValue - future3,
      depreciation5Years: estimatedValue - future5,
    },
  };

  let result = analysis;

  const openaiKey = process.env.OPENAI_API_KEY;
  if (AI_ENRICH_ENABLED && openaiKey && openaiKey !== 'mock') {
    try {
      const enriched = await enrichWithAI(input, result, openaiKey);
      if (enriched) {
        console.log(`AI enrichment per ${vehicle.make} ${vehicle.model}`);
        result = { ...enriched, aiEnhanced: true };
      }
    } catch (e: any) {
      console.warn('AI enrichment fallito:', e.message);
    }
  }

  cacheSet(cacheKey, result, 24 * 60 * 60 * 1000);
  return result;
}

async function enrichWithAI(input: AIAnalysisInput, base: ReliabilityAnalysis, key: string): Promise<ReliabilityAnalysis | null> {
  const { vehicle } = input;
  const fullModel = `${vehicle.make} ${vehicle.model} ${vehicle.year || ''}`.trim();
  const prompt = `Analizza questo veicolo (${fullModel}) per un report di acquisto:

Modello: ${fullModel}
Versione: ${vehicle.version || 'N/A'}
Alimentazione: ${vehicle.fuel || 'N/A'}
Anno immatricolazione: ${vehicle.year || 'N/A'}

Usa la tua conoscenza su forum italiani (Quattroruote, forumauto.it), Reddit (r/cars_it) e recensioni YouTube.
Fornisci UNA SOLA risposta JSON valida con:
- "summary": analisi specifica (max 180 caratteri) basata sul modello reale, non generica
- "strengths": 3 punti di forza specifici di ${vehicle.make} ${vehicle.model}
- "weaknesses": 3 punti deboli specifici di ${vehicle.make} ${vehicle.model} (es. "Frizione pesante nel traffico", "Infotainment lento", "Materiali interni plastici"). NON scrivere frasi su prezzo o chilometraggio
- "advice": 3 consigli pratici prima dell'acquisto specifici per ${vehicle.make} ${vehicle.model}
- "engine": analisi del motore specifica per ${vehicle.make} ${vehicle.model} (es. "1.6 Multijet 120 CV: affidabile, attenzione FAP se uso urbano"). NON scrivere "verifica", "controlla" o consigli generici
- "transmission": consigli specifici sul cambio per ${vehicle.make} ${vehicle.model} (es. "Manuale preciso, automatico ZF 8HP raccomandato"). NON scrivere "verifica", "controlla" o consigli generici
- "commonIssues": 3 problemi specifici noti presso i proprietari di ${vehicle.make} ${vehicle.model}`;

  const resp = await fetch(`${getAIBaseUrl()}/chat/completions`, {
    method: 'POST',
    signal: AbortSignal.timeout(12000),
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
    body: JSON.stringify({
      model: getAIModel(),
      messages: [
        {
          role: 'system',
          content: 'Sei un meccanico esperto e consulente automotive italiano. Rispondi SOLO con JSON valido in italiano. Le tue risposte devono essere specifiche al modello (es. "DSG DQ200 ha recall frizione", non "verifica il cambio").',
        },
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
  const ai = parseJsonContent<Record<string, unknown>>(content);

  const clean = (list: unknown): string[] | null => {
    if (!Array.isArray(list) || list.length < 2) return null;
    const items = list.map((x) => String(x).trim()).filter((x) => x && !isGeneric(x));
    return items.length >= 2 ? items.slice(0, 3) : null;
  };

  return {
    ...base,
    summary: typeof ai.summary === 'string' && ai.summary.trim() ? ai.summary : base.summary,
    strengths: clean(ai.strengths) || base.strengths,
    weaknesses: clean(ai.weaknesses) || base.weaknesses,
    advice: clean(ai.advice) || base.advice,
    engine: typeof ai.engine === 'string' && !isGeneric(ai.engine) ? ai.engine : base.engine,
    transmission: typeof ai.transmission === 'string' && !isGeneric(ai.transmission) ? ai.transmission : base.transmission,
    commonIssues: clean(ai.commonIssues) || base.commonIssues,
  };
}

function parseJsonContent<T>(content: string): T {
  const json = content
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '');
  return JSON.parse(json) as T;
}

export interface AskInput {
  score?: number;
  verdict?: string;
  summary?: string;
  weaknesses?: string[];
  maintenance?: string;
  commonIssues?: string[];
  futureCosts?: { insuranceEstimate?: number };
}

export async function askAutoEsperto(question: string, vehicle: VehicleData, analysis: AskInput): Promise<string> {
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey || openaiKey === 'mock' || !AI_ENRICH_ENABLED) {
    const weaknesses = (analysis.weaknesses || []).slice(0, 2).join('; ');
    return `Per ${vehicle.make} ${vehicle.model}: affidabilità ${analysis.score ?? 0}/10, manutenzione ${analysis.maintenance || 'media'}. Punti deboli noti: ${weaknesses || 'nessuno segnalato'}. Prezzo stimato indicativo: vedi la sezione prezzo del report.`;
  }

  try {
    const response = await fetch(`${getAIBaseUrl()}/chat/completions`, {
      method: 'POST',
      signal: AbortSignal.timeout(15000),
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openaiKey}` },
      body: JSON.stringify({
        model: getAIModel(),
        messages: [
          { role: 'system', content: 'Sei AutoEsperto, un consulente automotive italiano esperto. Rispondi in modo professionale, conciso e utile.' },
          { role: 'user', content: `Veicolo: ${vehicle.make} ${vehicle.model} ${vehicle.year || ''}. Analisi: ${analysis.summary || ''}. Domanda: ${question}` },
        ],
        temperature: 0.6,
      }),
    });
    const data = await response.json() as any;
    if (data.error) return mockAnswer(question, vehicle, analysis);
    const content = data.choices?.[0]?.message?.content;
    return content || mockAnswer(question, vehicle, analysis);
  } catch (e: any) {
    console.warn('OpenAI fetch error:', e.message);
    return mockAnswer(question, vehicle, analysis);
  }
}

function mockAnswer(question: string, vehicle: VehicleData, analysis: AskInput): string {
  const q = question.toLowerCase();
  if (q.includes('conviene') || q.includes('comprare')) {
    return analysis.verdict === 'BUY'
      ? `Sì, ${vehicle.make} ${vehicle.model} è una scelta solida: ${analysis.summary} Verifica comunque lo storico tagliandi prima di chiudere.`
      : analysis.verdict === 'NEGOTIATE'
      ? `Può andare, ma con cautela: ${analysis.summary} Controlla i punti deboli segnalati prima di decidere.`
      : `Sconsiglio l'acquisto senza controlli approfonditi: ${analysis.summary}`;
  }
  if (q.includes('problema') || q.includes('difetti')) {
    return `I problemi più comuni su ${vehicle.make} ${vehicle.model}: ${(analysis.commonIssues || []).slice(0, 3).join('; ')}.`;
  }
  return `Per ${vehicle.make} ${vehicle.model}: affidabilità ${analysis.score}/10, manutenzione ${analysis.maintenance}, assicurazione stimata ${analysis.futureCosts?.insuranceEstimate ?? 0}€/anno. Vuoi approfondire un aspetto specifico?`;
}
