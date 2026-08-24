import type { VehicleData, ReliabilityAnalysis } from '@autoesperto/types';
import { getVehicleKnowledge } from './vehicleKB';
import { estimateMarketValue } from './pricing';
import { cacheGet, cacheSet } from './cache';

export interface AIAnalysisInput {
  vehicle: VehicleData;
  km?: number;
  requestedPrice?: number;
}

export interface AIAnalysisOptions {
  requireDetailedModelAnalysis?: boolean;
}

export interface PhotoAnalysisInput {
  imageData: string;
  vehicle?: Partial<Pick<VehicleData, 'make' | 'model' | 'year'>>;
  aggressive?: boolean;
}

export interface PhotoAnalysisResult {
  vehicle: { make?: string; model?: string; generation?: string; year?: number; color?: string; bodyType?: string; confidence: 'bassa' | 'media' | 'alta' };
  damage: {
    visible: boolean;
    category: 'graffio' | 'ammaccatura' | 'paraurti' | 'fanale' | 'specchietto' | 'cerchio_gomma' | 'vetro' | 'carrozzeria' | 'nessun_danno_evidente' | 'non_chiaro';
    severity: 'lieve' | 'media' | 'alta';
    description: string;
    /** Zona del veicolo interessata (es. "paraurti anteriore sinistro"). */
    area?: string;
    /** Come intervenire (es. "Lucidatura e ritocco", "Sostituzione componente"). */
    repairHint?: string;
  };
  repairRange?: { min: number; max: number };
  /** Giorni di officina stimati, quando l'analisi è di tipo "danni". */
  estimatedTimeDays?: number;
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
  const brand = (vehicle.make || '').toLowerCase();
  const isPremium = /bmw|mercedes|audi|porsche|maserati|land rover|jaguar/.test(brand);

  const baseMaint = age <= 5 ? 240 : age <= 10 ? 320 : 380;
  const maintenance = isPremium ? Math.round(baseMaint * 1.3) : baseMaint;

  const f = fuel.toLowerCase();
  const fuelCost = f.includes('diesel')
    ? 8.5
    : f.includes('elettr') || f.includes('ev')
    ? 4.2
    : f.includes('ibrid') || f.includes('hybrid')
    ? 7.2
    : f.includes('gpl') || f.includes('metano')
    ? 5.5
    : 9.8;

  const insurance = power < 90 ? 340 : power < 130 ? 420 : power < 180 ? 490 : 650;
  return { maintenance, fuelCost, insurance };
}

function deriveCategoryScores(
  vehicle: VehicleData,
  baseScore: number,
  knowledge: ReturnType<typeof getVehicleKnowledge>
): { engine: number; transmission: number; electronics: number; suspension: number; body: number } {
  const brand = (vehicle.make || '').toLowerCase();
  const fuel = (vehicle.fuel || '').toLowerCase();
  const isPremium = /bmw|mercedes|audi|volvo|lexus|alfa/.test(brand);
  const isJapanese = /toyota|honda|mazda|nissan|suzuki|lexus|subaru/.test(brand);
  const isEuropean = /fiat|alfa|lancia|peugeot|renault|citroen|vw|audi|bmw|mercedes|skoda|seat|volvo|opel/.test(brand);

  let engine = baseScore;
  if (fuel.includes('diesel') && /n47|ea189|tdi.*old/.test(knowledge.engine.toLowerCase())) engine -= 0.5;
  if (isJapanese) engine += 0.3;

  let transmission = baseScore - 0.3;
  if (/manuale/.test((vehicle.transmission || '').toLowerCase())) transmission += 0.6;
  if (/dsg|s.tronic|powershift|edc|tct|dualogic/.test(knowledge.transmission.toLowerCase())) transmission -= 0.6;
  if (isJapanese) transmission += 0.4;

  let electronics = baseScore - 0.5;
  if (isPremium) electronics -= 0.4;
  if (isJapanese) electronics += 0.5;
  const currentYear = new Date().getFullYear();
  const age = currentYear - (vehicle.year || currentYear - 5);
  if (age <= 5) electronics += 0.5;

  let suspension = baseScore - 0.2;
  if (/(suv|crossover| crossover)/.test((vehicle.body || '').toLowerCase())) suspension -= 0.3;

  let body = baseScore - 0.1;
  if (/(fiat|peugeot|renault|citroen)/.test(brand)) body += 0.1;
  if (/(bmw|audi|mercedes)/.test(brand)) body += 0.1;

  const clamp = (v: number) => Math.min(10, Math.max(3, Math.round(v * 10) / 10));
  return {
    engine: clamp(engine),
    transmission: clamp(transmission),
    electronics: clamp(electronics),
    suspension: clamp(suspension),
    body: clamp(body),
  };
}

function deriveConsumption(vehicle: VehicleData, fuel: string): { city: number; highway: number; combined: number; fuelType?: string } {
  const f = fuel.toLowerCase();
  const makeNorm = (vehicle.make || '').toLowerCase();
  let hash = 0;
  for (let i = 0; i < makeNorm.length; i++) hash += makeNorm.charCodeAt(i);

  const rawDisp = parseFloat((vehicle.displacement || '').replace(/[^0-9.]/g, '')) || (1.2 + (hash % 8) * 0.2);
  const displacement = rawDisp > 20 ? rawDisp / 1000 : rawDisp; // convert cc to Liters
  const isDiesel = f.includes('diesel');
  const isHybrid = f.includes('ibrid');
  const isElectric = f.includes('elettr') || f.includes('ev');
  const isGpl = f.includes('gpl') || f.includes('metano');

  if (isElectric) return { city: 16, highway: 13, combined: 14.5, fuelType: 'kWh/100km' };

  // Consumption in L/100 km
  const baseL100 = isDiesel ? 4.9 : isHybrid ? 4.3 : isGpl ? 6.8 : 5.8;
  const displacementFactor = Math.max(0.88, Math.min(1.35, 0.75 + (displacement / 2.0) * 0.35));
  const combined = Math.round(baseL100 * displacementFactor * 10) / 10;
  const city = Math.round(combined * 1.2 * 10) / 10;
  const highway = Math.round(combined * 0.85 * 10) / 10;

  return { city, highway, combined, fuelType: 'L/100 km' };
}

function extractKw(powerInput?: string | number): number {
  if (!powerInput) return 75;
  if (typeof powerInput === 'number') {
    return powerInput > 170 ? Math.round(powerInput * 0.735499) : powerInput;
  }
  const str = String(powerInput).trim().toLowerCase();
  const kwMatch = str.match(/(\d+(?:[.,]\d+)?)\s*kw/i);
  if (kwMatch) return Math.round(parseFloat(kwMatch[1].replace(',', '.')));
  const cvMatch = str.match(/(\d+(?:[.,]\d+)?)\s*(?:cv|hp|cavall)/i);
  if (cvMatch) return Math.round(parseFloat(cvMatch[1].replace(',', '.')) * 0.735499);
  const digits = parseInt(str.replace(/\D/g, ''), 10);
  if (!isNaN(digits) && digits > 0) {
    return digits > 170 ? Math.round(digits * 0.735499) : digits;
  }
  return 75;
}

function deriveTaxAnnual(powerInput?: string | number, fuelInput?: string, yearInput?: number): number {
  const kw = extractKw(powerInput);
  const fuel = (fuelInput || '').toLowerCase();
  const currentYear = new Date().getFullYear();
  const age = Math.max(0, currentYear - (yearInput || currentYear - 5));

  if (kw <= 0) return 0;

  if (fuel.includes('elettr') || fuel.includes('bev') || fuel === 'ev') {
    if (age <= 5) return 0;
    const baseRate = kw <= 100 ? kw * 2.58 : 100 * 2.58 + (kw - 100) * 3.87;
    return Math.round(baseRate * 0.25);
  }

  let baseRate = kw <= 100 ? kw * 2.58 : 100 * 2.58 + (kw - 100) * 3.87;

  if ((fuel.includes('ibrid') || fuel.includes('hybrid') || fuel.includes('phev') || fuel.includes('hev')) && age <= 3) {
    baseRate *= 0.5;
  }

  if (fuel.includes('gpl') || fuel.includes('metano') || fuel.includes('cng') || fuel.includes('lpg')) {
    baseRate *= 0.75;
  }

  if (age >= 30) return 30;
  if (age >= 20) baseRate *= 0.5;

  let bolloBase = Math.round(baseRate);
  let superbollo = 0;
  if (kw > 185) {
    const extraKw = kw - 185;
    let ratePerKw = 20;
    if (age >= 20) ratePerKw = 0;
    else if (age >= 15) ratePerKw = 3;
    else if (age >= 10) ratePerKw = 6;
    else if (age >= 5) ratePerKw = 12;
    superbollo = Math.round(extraKw * ratePerKw);
  }

  return bolloBase + superbollo;
}

function getAIBaseUrl() { return process.env.AI_BASE_URL || 'https://api.openai.com/v1'; }
function getAIModel() { return process.env.AI_MODEL || 'gpt-4o-mini'; }
function isGroqProvider() {
  return getAIBaseUrl().includes('api.groq.com') || process.env.OPENAI_API_KEY?.startsWith('gsk_');
}
function getVisionModel() {
  if (process.env.VISION_MODEL) return process.env.VISION_MODEL;
  return isGroqProvider() ? 'qwen/qwen3.6-27b' : 'gpt-4o-mini';
}

const repairRanges: Record<PhotoAnalysisResult['damage']['category'], Record<PhotoAnalysisResult['damage']['severity'], [number, number]>> = {
  graffio: { lieve: [120, 280], media: [250, 550], alta: [450, 900] },
  ammaccatura: { lieve: [150, 350], media: [300, 700], alta: [600, 1400] },
  paraurti: { lieve: [220, 500], media: [450, 950], alta: [800, 1800] },
  fanale: { lieve: [120, 300], media: [250, 700], alta: [500, 1500] },
  specchietto: { lieve: [100, 250], media: [180, 450], alta: [350, 800] },
  cerchio_gomma: { lieve: [80, 200], media: [160, 450], alta: [300, 900] },
  vetro: { lieve: [150, 400], media: [300, 800], alta: [600, 1800] },
  carrozzeria: { lieve: [200, 450], media: [400, 900], alta: [700, 1600] },
  nessun_danno_evidente: { lieve: [0, 0], media: [0, 0], alta: [0, 0] },
  non_chiaro: { lieve: [0, 0], media: [0, 0], alta: [0, 0] },
};

const repairDays: Record<PhotoAnalysisResult['damage']['category'], Record<PhotoAnalysisResult['damage']['severity'], number>> = {
  graffio: { lieve: 1, media: 2, alta: 3 },
  ammaccatura: { lieve: 1, media: 2, alta: 4 },
  paraurti: { lieve: 1, media: 3, alta: 5 },
  fanale: { lieve: 1, media: 2, alta: 3 },
  specchietto: { lieve: 1, media: 2, alta: 3 },
  cerchio_gomma: { lieve: 1, media: 1, alta: 2 },
  vetro: { lieve: 1, media: 2, alta: 3 },
  carrozzeria: { lieve: 2, media: 4, alta: 7 },
  nessun_danno_evidente: { lieve: 0, media: 0, alta: 0 },
  non_chiaro: { lieve: 0, media: 0, alta: 0 },
};

export async function analyzeVehiclePhoto(input: PhotoAnalysisInput): Promise<PhotoAnalysisResult> {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey && !isGroqProvider()) {
    try {
      return await analyzeVehiclePhotoWithGemini(input, geminiKey);
    } catch (error) {
      // A free Gemini quota can be exhausted independently of the OpenAI quota.
      // If OpenAI is configured, use it rather than failing every photo scan.
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'mock') throw error;
      console.warn('Gemini vision unavailable; falling back to OpenAI vision:', error instanceof Error ? error.message : error);
    }
  }
  const key = process.env.OPENAI_API_KEY;
  if (!key || key === 'mock') throw new Error('Analisi foto non configurata');

  const vehicleContext = input.vehicle ? `${input.vehicle.make || ''} ${input.vehicle.model || ''} ${input.vehicle.year || ''}`.trim() : 'non indicato';
  const isGroq = isGroqProvider();
  const isAggressive = input.aggressive === true;
  const prompt = isAggressive
    ? `Veicolo dichiarato: ${vehicleContext}. Analizza questa foto di un'automobile e fai la tua MIGLIORE STIMA possibile di marca, modello, generazione, anno indicativo, colore e categoria di carrozzeria visibili. Anche se non sei completamente sicuro, NON lasciare mai vuoti i campi "make" e "model": fai sempre una stima ragionata basata su forme, proporzioni, fanali, griglia e altri dettagli visivi. Per eventuali danni esterni visibili indica anche "area" (zona del veicolo, es. "paraurti anteriore sinistro") e "repairHint" (come intervenire, es. "Lucidatura e ritocco", "Sostituzione componente"). Poi restituisci UNICAMENTE il seguente JSON, senza altri testi, senza markdown, senza ragionamento: {"vehicle":{"make":"","model":"","generation":"","year":2021,"color":"","bodyType":"","confidence":"bassa|media|alta"},"damage":{"visible":true,"category":"graffio|ammaccatura|paraurti|fanale|specchietto|cerchio_gomma|vetro|carrozzeria|nessun_danno_evidente|non_chiaro","severity":"lieve|media|alta","description":"max 180 caratteri","area":"","repairHint":""}}.`
    : `Veicolo dichiarato: ${vehicleContext}. Riconosci, se possibile, marca, modello, generazione, anno indicativo, colore e categoria di carrozzeria visibili. Non inventare i campi incerti: omettili. Per eventuali danni esterni visibili indica anche "area" (zona del veicolo, es. "parafango posteriore destro") e "repairHint" (come intervenire, es. "Verniciatura e stuccatura", "Sostituzione fanale"). Poi restituisci UNICAMENTE il seguente JSON, senza altri testi, senza markdown, senza ragionamento: {"vehicle":{"make":"","model":"","generation":"","year":2021,"color":"","bodyType":"","confidence":"bassa|media|alta"},"damage":{"visible":true,"category":"graffio|ammaccatura|paraurti|fanale|specchietto|cerchio_gomma|vetro|carrozzeria|nessun_danno_evidente|non_chiaro","severity":"lieve|media|alta","description":"max 180 caratteri","area":"","repairHint":""}}.`;

  const attempt = async (extra: Record<string, unknown> = {}) => {
    const response = await fetch(`${getAIBaseUrl()}/chat/completions`, {
      method: 'POST',
      signal: AbortSignal.timeout(isGroq ? 45000 : 20000),
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: isAggressive && !isGroq ? 'gpt-4o' : getVisionModel(),
        temperature: isAggressive ? 0.4 : 0.1,
        ...(isGroq ? { reasoning_effort: 'none' } : { response_format: { type: 'json_object' } }),
        ...extra,
        max_tokens: 900,
        messages: [
          { role: 'system', content: isAggressive
            ? 'Sei AutoEsperto. Analizza SOLO elementi visibili esterni dell\'auto. Se non sei sicuro, fai comunque una stima ragionata basata su forme, proporzioni e dettagli visivi. Non lasciare mai vuoti make e model. Ignora targhe, persone, indirizzi e dati personali. Rispondi con un solo oggetto JSON valido, senza markdown, senza testo prima o dopo.'
            : 'Sei AutoEsperto. Analizza SOLO elementi visibili esterni dell\'auto. Ignora completamente targhe, persone, indirizzi e dati personali: non trascriverli. Non diagnosticare motore, telaio o danni interni. Rispondi con un solo oggetto JSON valido, senza markdown, senza testo prima o dopo, senza ragionamento.' },
          { role: 'user', content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: input.imageData, ...(isGroq || isAggressive ? {} : { detail: 'low' }) } },
          ] },
        ],
      }),
    });
    return response;
  };

  let response = await attempt();
  let data = await response.json() as any;
  if (!response.ok) {
    const msg = typeof data?.error?.message === 'string' ? data.error.message : `HTTP ${response.status}`;
    throw new Error(msg);
  }

  let message = data.choices?.[0]?.message;
  let parsed: any;
  try {
    parsed = parseJsonContent<any>(message?.content || message?.reasoning || message?.reasoning_content || '');
  } catch {
    response = await attempt({ reasoning_format: 'hidden' });
    data = await response.json() as any;
    message = data.choices?.[0]?.message;
    try {
      parsed = parseJsonContent<any>(message?.content || message?.reasoning || message?.reasoning_content || '');
    } catch (retryError) {
      console.warn('Failed to parse vision response as JSON. Content (first 800 chars):', String(message?.content || '').slice(0, 800));
      return {
        vehicle: { confidence: 'bassa' as const },
        damage: {
          visible: false,
          category: 'non_chiaro' as const,
          severity: 'media' as const,
          description: 'Il riconoscimento automatico non ha restituito dati utilizzabili per questa foto.',
        },
        note: 'Il riconoscimento visivo non è disponibile in questo momento. La foto non viene salvata: riprova più tardi oppure inserisci marca e modello.',
      };
    }
  }
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
      year: Number.isInteger(parsed?.vehicle?.year) && parsed.vehicle.year >= 1950 && parsed.vehicle.year <= new Date().getFullYear() + 1 ? parsed.vehicle.year : undefined,
      color: typeof parsed?.vehicle?.color === 'string' ? parsed.vehicle.color.slice(0, 40) : undefined,
      bodyType: typeof parsed?.vehicle?.bodyType === 'string' ? parsed.vehicle.bodyType.slice(0, 50) : undefined,
      confidence: ['bassa', 'media', 'alta'].includes(parsed?.vehicle?.confidence) ? parsed.vehicle.confidence : 'bassa',
    },
    damage: {
      visible,
      category,
      severity,
      description: typeof parsed?.damage?.description === 'string' ? parsed.damage.description.slice(0, 180) : 'La foto non permette una valutazione affidabile del danno.',
      area: typeof parsed?.damage?.area === 'string' ? parsed.damage.area.slice(0, 80) : undefined,
      repairHint: typeof parsed?.damage?.repairHint === 'string' ? parsed.damage.repairHint.slice(0, 120) : undefined,
    },
    repairRange: range ? { min: range[0], max: range[1] } : undefined,
    estimatedTimeDays: visible ? repairDays[category as PhotoAnalysisResult['damage']['category']][severity as PhotoAnalysisResult['damage']['severity']] : undefined,
    note: 'Stima visiva indicativa: ricambi, verniciatura, sensori e manodopera possono cambiare il preventivo. La foto non certifica danni nascosti o meccanici.',
  };
}

async function analyzeVehiclePhotoWithGemini(input: PhotoAnalysisInput, key: string): Promise<PhotoAnalysisResult> {
  const match = input.imageData.match(/^data:(image\/(?:jpeg|jpg|png|webp));base64,(.+)$/);
  if (!match) throw new Error('Formato immagine non valido.');
  const configuredModel = process.env.GEMINI_VISION_MODEL?.trim();
  const models = configuredModel ? [configuredModel] : ['gemini-3.5-flash', 'gemini-3.1-flash-lite'];
  let raw = '';
  let lastError = '';

  for (const model of models) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST', signal: AbortSignal.timeout(25000),
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        contents: [{ parts: [
          { text: 'Sei il riconoscimento visivo di AutoEsperto. Riconosci con attenzione la vettura nella foto usando logo, calandra, fari, carrozzeria e proporzioni. Indica marca, modello, generazione, anno indicativo, colore e tipo di carrozzeria solo quando sono ragionevolmente identificabili; ometti i campi incerti e non inventare dettagli. Ignora completamente targhe, persone e dati personali: non leggerli, non trascriverli e non citarli. Descrivi esclusivamente danni esterni chiaramente visibili, senza diagnosticare danni interni, meccanici o incidenti pregressi. Per eventuali danni visibili indica "area" (zona del veicolo) e "repairHint" (come intervenire). Rispondi SOLO con JSON: {"vehicle":{"make":"","model":"","generation":"","year":2021,"color":"","bodyType":"","confidence":"bassa|media|alta"},"damage":{"visible":false,"category":"graffio|ammaccatura|paraurti|fanale|specchietto|cerchio_gomma|vetro|carrozzeria|nessun_danno_evidente|non_chiaro","severity":"lieve|media|alta","description":"","area":"","repairHint":""}}.' },
          { inline_data: { mime_type: match[1], data: match[2] } },
        ] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.1 },
      }),
    });
    const data = await response.json() as any;
    raw = data.candidates?.[0]?.content?.parts?.map((part: any) => part.text || '').join('') || '';
    if (response.ok && raw) break;
    lastError = data?.error?.message || `Gemini non ha restituito un risultato (HTTP ${response.status}).`;
    raw = '';
    if (!/(not available|not found|not exist|unsupported|access)/i.test(lastError)) break;
  }
  if (!raw) throw new Error(lastError || 'Gemini non ha restituito un risultato.');
  const parsed = parseJsonContent<any>(raw);
  const categories = Object.keys(repairRanges);
  const category = categories.includes(parsed?.damage?.category) ? parsed.damage.category : 'non_chiaro';
  const severity = ['lieve', 'media', 'alta'].includes(parsed?.damage?.severity) ? parsed.damage.severity : 'media';
  const visible = Boolean(parsed?.damage?.visible) && category !== 'nessun_danno_evidente' && category !== 'non_chiaro';
  const range = visible ? repairRanges[category as PhotoAnalysisResult['damage']['category']][severity as PhotoAnalysisResult['damage']['severity']] : undefined;
  return {
    vehicle: { make: typeof parsed?.vehicle?.make === 'string' ? parsed.vehicle.make.slice(0, 50) : undefined, model: typeof parsed?.vehicle?.model === 'string' ? parsed.vehicle.model.slice(0, 50) : undefined, generation: typeof parsed?.vehicle?.generation === 'string' ? parsed.vehicle.generation.slice(0, 80) : undefined, year: Number.isInteger(parsed?.vehicle?.year) && parsed.vehicle.year >= 1950 && parsed.vehicle.year <= new Date().getFullYear() + 1 ? parsed.vehicle.year : undefined, color: typeof parsed?.vehicle?.color === 'string' ? parsed.vehicle.color.slice(0, 40) : undefined, bodyType: typeof parsed?.vehicle?.bodyType === 'string' ? parsed.vehicle.bodyType.slice(0, 50) : undefined, confidence: ['bassa', 'media', 'alta'].includes(parsed?.vehicle?.confidence) ? parsed.vehicle.confidence : 'bassa' },
    damage: {
      visible,
      category,
      severity,
      description: typeof parsed?.damage?.description === 'string' ? parsed.damage.description.slice(0, 180) : 'La foto non permette una valutazione affidabile del danno.',
      area: typeof parsed?.damage?.area === 'string' ? parsed.damage.area.slice(0, 80) : undefined,
      repairHint: typeof parsed?.damage?.repairHint === 'string' ? parsed.damage.repairHint.slice(0, 120) : undefined,
    },
    repairRange: range ? { min: range[0], max: range[1] } : undefined,
    estimatedTimeDays: visible ? repairDays[category as PhotoAnalysisResult['damage']['category']][severity as PhotoAnalysisResult['damage']['severity']] : undefined,
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

export async function analyzeVehicle(input: AIAnalysisInput, options: AIAnalysisOptions = {}): Promise<ReliabilityAnalysis> {
  const { vehicle } = input;
  const cacheKey = [
    options.requireDetailedModelAnalysis ? 'analysis:detailed' : 'analysis',
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
  const consumption = deriveConsumption(vehicle, fuel);
  const taxAnnual = deriveTaxAnnual(vehicle.power || power, fuel, vehicle.year);
  const serviceIntervalKm = fuel.includes('diesel') ? 20000 : 15000;
  const categoryScores = deriveCategoryScores(vehicle, score, knowledge);

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
    categoryScores,
    usage: knowledge.bestFor,
    recommendedVersions: knowledge.versionsRecommended,
    versionsToAvoid: knowledge.versionsToAvoid,
    aiEnhanced: false,
    consumption,
    taxAnnual,
    serviceIntervalKm,
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
  if ((AI_ENRICH_ENABLED || options.requireDetailedModelAnalysis) && openaiKey && openaiKey !== 'mock') {
    try {
      const enriched = await enrichWithAI(input, result, openaiKey);
      if (enriched) {
        console.log(`AI enrichment per ${vehicle.make} ${vehicle.model}`);
        result = { ...enriched, aiEnhanced: true };
      } else if (options.requireDetailedModelAnalysis) {
        throw new Error('Il provider non ha restituito l’analisi specifica del modello.');
      }
    } catch (e: any) {
      console.warn('AI enrichment fallito:', e.message);
      if (options.requireDetailedModelAnalysis) throw e;
    }
  } else if (options.requireDetailedModelAnalysis) {
    throw new Error('L’analisi dettagliata del modello non è configurata in questo momento.');
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
  const cleaned = (content || '').trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  for (let i = 0; i < cleaned.length; i++) {
    if (cleaned[i] !== '{' && cleaned[i] !== '[') continue;
    const open = cleaned[i];
    const close = open === '{' ? '}' : ']';
    let depth = 0;
    let inString = false;
    let escape = false;
    for (let j = i; j < cleaned.length; j++) {
      const ch = cleaned[j];
      if (escape) { escape = false; continue; }
      if (ch === '\\' && inString) { escape = true; continue; }
      if (ch === '"') { inString = !inString; continue; }
      if (inString) continue;
      if (ch === open) depth++;
      else if (ch === close) {
        depth--;
        if (depth === 0) {
          try {
            return JSON.parse(cleaned.slice(i, j + 1)) as T;
          } catch {
            break;
          }
        }
      }
    }
  }
  throw new Error('Il provider non ha restituito un JSON valido.');
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
