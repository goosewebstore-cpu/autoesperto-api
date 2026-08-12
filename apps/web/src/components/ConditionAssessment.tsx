'use client';

import { useRef, useState } from 'react';
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  Clock,
  ExternalLink,
  Gauge,
  Loader2,
  MapPin,
  Plus,
  Send,
  ShieldAlert,
  Sparkles,
  Upload,
  Wrench,
  X,
  Hammer,
  Store,
  User,
  Info,
  TrendingDown,
  TrendingUp,
  Minus,
  Download,
} from 'lucide-react';
import { analyzeVehiclePhoto, type PhotoAnalysis } from '@/lib/api';
import type { AutoReport } from '@autoesperto/types';

const MAX_PHOTOS = 4;

function price(value: number) {
  return Math.round(value).toLocaleString('it-IT') + ' €';
}

function categoryLabel(category: string) {
  const labels: Record<string, string> = {
    graffio: 'Graffio alla carrozzeria',
    ammaccatura: 'Ammaccatura / Lamiera',
    paraurti: 'Danno al paraurti anteriore/posteriore',
    fanale: 'Danno o opacità al fanale',
    specchietto: 'Specchietto retrovisore',
    cerchio_gomma: 'Cerchio in lega / Gomma usurata',
    vetro: 'Parabrezza / Vetro scheggiato',
    carrozzeria: 'Danno esteso alla carrozzeria',
    nessun_danno_evidente: 'Nessun danno esterno evidente',
    non_chiaro: 'Da approfondire in carrozzeria',
  };
  return labels[category] || category.replace(/_/g, ' ');
}

function severityConfig(severity: string) {
  if (severity === 'lieve')
    return { label: 'Lieve', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  if (severity === 'media')
    return { label: 'Media', badge: 'bg-amber-50 text-amber-700 border-amber-200' };
  return { label: 'Alta', badge: 'bg-rose-50 text-rose-700 border-rose-200' };
}

type Verdict = 'repair' | 'evaluate' | 'sell';

function getVerdict(totalMin: number, totalMax: number, carValue: number): { verdict: Verdict; label: string; description: string; color: string; bgColor: string; borderColor: string } {
  const avgCost = (totalMin + totalMax) / 2;
  const ratio = carValue > 0 ? avgCost / carValue : 0;

  if (ratio < 0.30) {
    return {
      verdict: 'repair',
      label: 'Conviene riparare',
      description: `I costi di riparazione e ricambi stimati (${price(totalMin)}–${price(totalMax)}) sono contenuti rispetto al valore di mercato dell'auto (${price(carValue)}). Riparare conviene rispetto all'acquisto di un'altra vettura.`,
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
    };
  }
  if (ratio < 0.55) {
    return {
      verdict: 'evaluate',
      label: 'Valuta con attenzione',
      description: `Il costo di ripristino (${price(totalMin)}–${price(totalMax)}) incide fino al ${Math.round(ratio * 100)}% del valore attuale dell'auto (${price(carValue)}). Chiedi preventivi scritti per valutare l'opportunità.`,
      color: 'text-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
    };
  }
  return {
    verdict: 'sell',
    label: 'Meglio vendere nello stato attuale',
    description: `La stima di riparazione (${price(totalMin)}–${price(totalMax)}) supera il ${Math.round(ratio * 100)}% del valore residuo dell'auto (${price(carValue)}). Conviene vendere il veicolo così com'è.`,
    color: 'text-rose-700',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
  };
}

/* ── Multi-store search URL generators ── */
function getEbayUrl(query: string, make?: string, model?: string) {
  const full = `ricambi ${query} ${make || ''} ${model || ''}`.trim();
  return `https://www.ebay.it/sch/i.html?_nkw=${encodeURIComponent(full)}`;
}

function getAutodocUrl(query: string, make?: string, model?: string) {
  const full = `${query} ${make || ''} ${model || ''}`.trim();
  return `https://www.autodoc.it/ricerca?keyword=${encodeURIComponent(full)}`;
}

function getOscaroUrl(query: string, make?: string, model?: string) {
  const full = `${query} ${make || ''} ${model || ''}`.trim();
  return `https://www.oscaro.it/ricerca?q=${encodeURIComponent(full)}`;
}

const STORE_BUTTONS = [
  { name: 'eBay', color: 'bg-blue-600 hover:bg-blue-700', getUrl: getEbayUrl },
  { name: 'Autodoc', color: 'bg-orange-500 hover:bg-orange-600', getUrl: getAutodocUrl },
  { name: 'Oscaro', color: 'bg-emerald-600 hover:bg-emerald-700', getUrl: getOscaroUrl },
] as const;

/* ── Depreciation curve matching backend (pricing.ts) ── */
const DEPRECIATION_CURVE: Array<[number, number]> = [
  [0, 1.0], [1, 0.82], [2, 0.74], [3, 0.67], [4, 0.63], [5, 0.58], [6, 0.56], [7, 0.51],
  [8, 0.46], [9, 0.42], [10, 0.38], [11, 0.35], [12, 0.32], [13, 0.30], [14, 0.28], [15, 0.26],
];

function getResidual(age: number): number {
  const clamped = Math.max(0, age);
  if (clamped >= 15) return Math.max(0.12, 0.26 - (clamped - 15) * 0.015);
  let residual = DEPRECIATION_CURVE[0][1];
  for (const [ageAt, value] of DEPRECIATION_CURVE) {
    if (ageAt <= clamped) residual = value;
    else break;
  }
  return residual;
}

function reverseBasePrice(estimatedValue: number, vehicleYear: number | undefined): number {
  const currentYear = new Date().getFullYear();
  const originalAge = Math.max(0, currentYear - (vehicleYear || currentYear - 5));
  const originalResidual = getResidual(originalAge);
  const base = originalResidual > 0.05 ? estimatedValue / originalResidual : estimatedValue;
  return Math.max(8000, base);
}

/* ── Repair cost database: DIY (parts only) vs Mechanic (parts + labor) ── */
interface RepairCostEntry {
  diyMin: number;
  diyMax: number;
  mechMin: number;
  mechMax: number;
  canDiy: boolean;
  diyDifficulty: 'facile' | 'medio' | 'difficile';
}

const DAMAGE_REPAIR_COSTS: Record<string, RepairCostEntry> = {
  graffio:            { diyMin: 12, diyMax: 45,   mechMin: 120, mechMax: 300,  canDiy: true,  diyDifficulty: 'facile' },
  ammaccatura:        { diyMin: 25, diyMax: 80,   mechMin: 180, mechMax: 500,  canDiy: true,  diyDifficulty: 'medio' },
  paraurti:           { diyMin: 60, diyMax: 250,  mechMin: 300, mechMax: 750,  canDiy: true,  diyDifficulty: 'medio' },
  fanale:             { diyMin: 40, diyMax: 180,  mechMin: 120, mechMax: 350,  canDiy: true,  diyDifficulty: 'facile' },
  specchietto:        { diyMin: 25, diyMax: 120,  mechMin: 80,  mechMax: 250,  canDiy: true,  diyDifficulty: 'facile' },
  cerchio_gomma:      { diyMin: 40, diyMax: 200,  mechMin: 100, mechMax: 350,  canDiy: true,  diyDifficulty: 'medio' },
  vetro:              { diyMin: 60, diyMax: 250,  mechMin: 180, mechMax: 500,  canDiy: false, diyDifficulty: 'difficile' },
  carrozzeria:        { diyMin: 100, diyMax: 400, mechMin: 500, mechMax: 1500, canDiy: false, diyDifficulty: 'difficile' },
  nessun_danno_evidente: { diyMin: 0, diyMax: 0, mechMin: 0,   mechMax: 0,    canDiy: true,  diyDifficulty: 'facile' },
  non_chiaro:         { diyMin: 50, diyMax: 200,  mechMin: 150, mechMax: 500,  canDiy: false, diyDifficulty: 'difficile' },
};

function getDamageRepairCost(category: string): RepairCostEntry {
  return DAMAGE_REPAIR_COSTS[category] || DAMAGE_REPAIR_COSTS['non_chiaro'];
}

/* ── Dashboard lights with DIY vs Mechanic and urgency levels ── */
type Urgency = 'high' | 'medium' | 'low';

interface DashboardLightOption {
  id: string;
  label: string;
  diyMin: number;
  diyMax: number;
  mechMin: number;
  mechMax: number;
  canDiy: boolean;
  urgency: Urgency;
  urgencyNote: string;
  ebayQuery: string;
  autodocQuery: string;
}

const DASHBOARD_LIGHTS_OPTIONS: DashboardLightOption[] = [
  {
    id: 'spia_motore', label: 'Spia Motore (Check Engine)',
    diyMin: 15, diyMax: 80, mechMin: 80, mechMax: 350,
    canDiy: false, urgency: 'medium',
    urgencyNote: 'Portare in officina per diagnosi OBD2. Potrebbe essere un sensore economico o un problema più serio.',
    ebayQuery: 'sensore sonda lambda valvola egr',
    autodocQuery: 'sonda lambda sensore motore',
  },
  {
    id: 'spia_abs', label: 'Spia ABS / ESP',
    diyMin: 20, diyMax: 70, mechMin: 60, mechMax: 250,
    canDiy: true, urgency: 'medium',
    urgencyNote: 'L\'ABS non funziona: frenata d\'emergenza compromessa. Far controllare il sensore ruota.',
    ebayQuery: 'sensore abs pompa abs',
    autodocQuery: 'sensore abs',
  },
  {
    id: 'spia_freni', label: 'Spia Freni / Pastiglie',
    diyMin: 25, diyMax: 80, mechMin: 80, mechMax: 220,
    canDiy: true, urgency: 'high',
    urgencyNote: '⚠️ Fermare l\'auto se la spia lampeggia! Verificare livello liquido freni e usura pastiglie.',
    ebayQuery: 'pastiglie freni dischi freni',
    autodocQuery: 'pastiglie freno dischi freno',
  },
  {
    id: 'spia_airbag', label: 'Spia Airbag',
    diyMin: 30, diyMax: 90, mechMin: 90, mechMax: 350,
    canDiy: false, urgency: 'medium',
    urgencyNote: 'Airbag potrebbe non attivarsi in caso di incidente. Diagnosi in officina necessaria.',
    ebayQuery: 'sensore airbag contatto strisciante',
    autodocQuery: 'sensore airbag molla orologio',
  },
  {
    id: 'spia_fap', label: 'Spia DPF / FAP intasato',
    diyMin: 15, diyMax: 45, mechMin: 150, mechMax: 550,
    canDiy: false, urgency: 'medium',
    urgencyNote: 'Effettuare un viaggio autostradale a 3000 rpm per 20 min. Se persiste, lavaggio FAP in officina.',
    ebayQuery: 'liquido fap sensore pressione fap additivo dpf',
    autodocQuery: 'additivo fap filtro particolato',
  },
  {
    id: 'spia_batteria', label: 'Spia Batteria / Alternatore',
    diyMin: 60, diyMax: 150, mechMin: 120, mechMax: 350,
    canDiy: true, urgency: 'high',
    urgencyNote: '⚠️ Rischio di rimanere a piedi! Controllare batteria e alternatore il prima possibile.',
    ebayQuery: 'alternatore batteria auto',
    autodocQuery: 'alternatore batteria',
  },
];

const URGENCY_CONFIG: Record<Urgency, { label: string; dot: string; bg: string; text: string }> = {
  high:   { label: 'Urgente',      dot: 'bg-red-500',    bg: 'bg-red-50',    text: 'text-red-700' },
  medium: { label: 'Da verificare', dot: 'bg-amber-500',  bg: 'bg-amber-50',  text: 'text-amber-700' },
  low:    { label: 'Non urgente',  dot: 'bg-green-500',  bg: 'bg-green-50',  text: 'text-green-700' },
};

/* ── KM usage level calculator ── */
function getKmUsageLevel(km: number, age: number): { level: 'low' | 'average' | 'high'; message: string; icon: typeof TrendingDown } {
  const avgKmPerYear = 12000;
  const expectedKm = Math.max(10000, age * avgKmPerYear);
  const ratio = km / expectedKm;

  if (ratio < 0.75) {
    return { level: 'low', message: `Chilometraggio basso per l'età (media attesa: ~${expectedKm.toLocaleString('it-IT')} km)`, icon: TrendingDown };
  }
  if (ratio > 1.25) {
    return { level: 'high', message: `Chilometraggio superiore alla media (media attesa: ~${expectedKm.toLocaleString('it-IT')} km)`, icon: TrendingUp };
  }
  return { level: 'average', message: `Chilometraggio nella media per un'auto del ${new Date().getFullYear() - age} (~${avgKmPerYear.toLocaleString('it-IT')} km/anno)`, icon: Minus };
}

const KM_LEVEL_STYLE: Record<string, { bg: string; text: string; bar: string }> = {
  low:     { bg: 'bg-emerald-50', text: 'text-emerald-700', bar: 'bg-emerald-500' },
  average: { bg: 'bg-blue-50',    text: 'text-blue-700',    bar: 'bg-blue-500' },
  high:    { bg: 'bg-amber-50',   text: 'text-amber-700',   bar: 'bg-amber-500' },
};

/* ── Store link button component ── */
function StoreLinks({ query, make, model }: { query: string; make?: string; model?: string }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {STORE_BUTTONS.map((store) => (
        <a
          key={store.name}
          href={store.getUrl(query, make, model)}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1 px-2 py-1 rounded text-white text-[10px] font-bold transition-colors ${store.color}`}
        >
          {store.name} <ExternalLink className="w-2.5 h-2.5" />
        </a>
      ))}
    </div>
  );
}

interface DamageResult {
  id: string;
  analysis: PhotoAnalysis;
}

interface ConditionAssessmentProps {
  /** Estimated vehicle market value (already depreciated by backend) */
  estimatedValue: number;
  /** Vehicle info for context */
  vehicle?: { make?: string; model?: string; year?: number; km?: number };
  report?: AutoReport;
}

export default function ConditionAssessment({ estimatedValue, vehicle, report }: ConditionAssessmentProps) {
  const currentYear = new Date().getFullYear();
  const initialYear = vehicle?.year && vehicle.year > 1950 ? vehicle.year : currentYear - 5;
  const initialKm = vehicle?.km && vehicle.km > 0 ? vehicle.km : 120000;

  const inputRef = useRef<HTMLInputElement>(null);
  const [results, setResults] = useState<DamageResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Refinement controls
  const [year, setYear] = useState<number>(initialYear);
  const [km, setKm] = useState<number>(initialKm);
  const [selectedLights, setSelectedLights] = useState<string[]>([]);
  const [accidentHistory, setAccidentHistory] = useState<string>('none');

  // DIY vs Mechanic toggle
  const [costMode, setCostMode] = useState<'diy' | 'mechanic'>('mechanic');

  // Store links visibility state ("solamente se la chiedono")
  const [openStoreLinks, setOpenStoreLinks] = useState<Record<string, boolean>>({});

  // AI Assistant state
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const toggleStoreLinks = (id: string) => {
    setOpenStoreLinks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // ── Correct market valuation ──
  const newCarBasePrice = reverseBasePrice(estimatedValue, vehicle?.year);
  const userAge = Math.max(0, currentYear - (year || initialYear));
  const ageResidual = getResidual(userAge);
  const standardKm = Math.max(10000, userAge * 12000);
  const kmDelta = km - standardKm;
  const kmFactor = Math.min(1.12, Math.max(0.70, 1 - (kmDelta / 300000)));
  const lightsPenalty = selectedLights.length * 0.03;
  let accidentPenalty = 0;
  if (accidentHistory === 'minor') accidentPenalty = 0.06;
  if (accidentHistory === 'medium') accidentPenalty = 0.14;
  if (accidentHistory === 'severe') accidentPenalty = 0.25;
  const conditionMultiplier = Math.max(0.50, (1 - lightsPenalty - accidentPenalty));
  const ricalculatedValue = Math.max(1500, Math.round(newCarBasePrice * ageResidual * kmFactor * conditionMultiplier / 50) * 50);

  // KM usage analysis
  const kmUsage = getKmUsageLevel(km, userAge);
  const kmStyle = KM_LEVEL_STYLE[kmUsage.level];
  const KmIcon = kmUsage.icon;

  const handleFile = async (file?: File) => {
    if (!file) return;
    setError('');
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Carica una foto JPG, PNG o WebP.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('La foto deve essere al massimo di 5 MB.');
      return;
    }
    const imageData = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('Impossibile leggere la foto'));
      reader.readAsDataURL(file);
    });
    setLoading(true);
    try {
      const response = await analyzeVehiclePhoto(imageData, { make: vehicle?.make, model: vehicle?.model, year });
      setResults((prev) => [
        ...prev,
        { id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, analysis: response.analysis },
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      setError(message || 'Non riesco ad analizzare la foto. Riprova con un\'altra inquadratura.');
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const toggleLight = (id: string) => {
    setSelectedLights((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const askAiAssistant = async (customQ?: string) => {
    const q = customQ || aiQuestion;
    if (!q.trim()) return;
    setAiLoading(true);
    setAiAnswer(null);
    try {
      const res = await fetch('/api/assistant/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          vehicle: { make: vehicle?.make, model: vehicle?.model, year, km },
          condition: {
            dashboardLights: selectedLights,
            accidentHistory,
            damages: results.map((r) => r.analysis.damage.category),
          },
        }),
      });
      const data = await res.json();
      if (data && data.answer) {
        setAiAnswer(data.answer);
      } else {
        setAiAnswer('Per ' + (vehicle?.make || 'questo veicolo') + ', ti consigliamo di verificare il codice OEM del pezzo prima di procedere.');
      }
    } catch {
      setAiAnswer('Consiglio dell\'Esperto AI: Per guasti specifici o componenti usurati su ' + (vehicle?.make || 'questo modello') + ', confronta sempre i codici ricambio OEM su eBay prima di acquistare in concessionaria.');
    } finally {
      setAiLoading(false);
    }
  };

  const damagedResults = results.filter((r) => r.analysis.damage.visible);

  // Calculate total costs based on cost mode
  let totalMin = 0;
  let totalMax = 0;

  damagedResults.forEach((r) => {
    const costs = getDamageRepairCost(r.analysis.damage.category);
    if (costMode === 'diy') {
      totalMin += costs.diyMin;
      totalMax += costs.diyMax;
    } else {
      totalMin += costs.mechMin;
      totalMax += costs.mechMax;
    }
  });

  selectedLights.forEach((lightId) => {
    const opt = DASHBOARD_LIGHTS_OPTIONS.find((l) => l.id === lightId);
    if (opt) {
      if (costMode === 'diy') {
        totalMin += opt.diyMin;
        totalMax += opt.diyMax;
      } else {
        totalMin += opt.mechMin;
        totalMax += opt.mechMax;
      }
    }
  });

  const canAddMore = results.length < MAX_PHOTOS;
  const verdictInfo = getVerdict(totalMin, totalMax, ricalculatedValue);
  const VerdictIcon = verdictInfo.verdict === 'repair' ? CheckCircle2 : verdictInfo.verdict === 'evaluate' ? AlertTriangle : ShieldAlert;

  // ── Similar market cars ──
  const make = vehicle?.make || 'Auto';
  const model = vehicle?.model || 'usata';
  const olderYear = Math.max(2000, year - 1);
  const newerYear = Math.min(currentYear, year + 1);
  const olderKm = km + 18000;
  const newerKm = Math.max(5000, km - 20000);
  const olderAge = Math.max(0, currentYear - olderYear);
  const newerAge = Math.max(0, currentYear - newerYear);
  const olderStandardKm = Math.max(10000, olderAge * 12000);
  const newerStandardKm = Math.max(10000, newerAge * 12000);
  const olderKmFactor = Math.min(1.12, Math.max(0.70, 1 - ((olderKm - olderStandardKm) / 300000)));
  const newerKmFactor = Math.min(1.12, Math.max(0.70, 1 - ((newerKm - newerStandardKm) / 300000)));
  const olderPrice = Math.max(1500, Math.round(newCarBasePrice * getResidual(olderAge) * olderKmFactor * conditionMultiplier / 50) * 50);
  const newerPrice = Math.max(1500, Math.round(newCarBasePrice * getResidual(newerAge) * newerKmFactor * conditionMultiplier / 50) * 50);

  const similarCars = [
    { model: `${make} ${model} (${year})`, km: `${km.toLocaleString('it-IT')} km`, price: ricalculatedValue },
    { model: `${make} ${model} (${olderYear})`, km: `${olderKm.toLocaleString('it-IT')} km`, price: olderPrice },
    { model: `${make} ${model} (${newerYear})`, km: `${newerKm.toLocaleString('it-IT')} km`, price: newerPrice },
  ];

  const handleDownloadPDF = async () => {
    if (!report) return;
    const { downloadPDF } = await import('@/components/PDFButton');

    const items: any[] = [];
    
    selectedLights.forEach((lightId) => {
      const opt = DASHBOARD_LIGHTS_OPTIONS.find((l) => l.id === lightId);
      if (opt) {
        items.push({
          type: 'spia',
          label: opt.label,
          detail: opt.urgencyNote,
          diyCost: `${price(opt.diyMin)}–${price(opt.diyMax)}`,
          mechCost: `${price(opt.mechMin)}–${price(opt.mechMax)}`,
          urgencyLabel: opt.urgency === 'high' ? 'Urgente' : 'Da verificare',
          canDiy: opt.canDiy,
        });
      }
    });

    results.filter(r => r.analysis.damage.visible).forEach((r) => {
      const costs = getDamageRepairCost(r.analysis.damage.category);
      items.push({
        type: 'danno',
        label: categoryLabel(r.analysis.damage.category),
        detail: r.analysis.damage.description,
        diyCost: `${price(costs.diyMin)}–${price(costs.diyMax)}`,
        mechCost: `${price(costs.mechMin)}–${price(costs.mechMax)}`,
        canDiy: costs.canDiy,
      });
    });

    const accidentHistoryLabel = 
      accidentHistory === 'none' ? 'Nessun incidente rilevato' :
      accidentHistory === 'minor' ? 'Lievi urti (Graffi o piccoli urti)' :
      accidentHistory === 'medium' ? 'Medio (Sostituzione lamiere/paraurti)' :
      'Grave (Strutturale / Airbag esplosi)';

    const conditionData = {
      refinedYear: year,
      refinedKm: km,
      accidentHistoryLabel,
      costModeLabel: costMode === 'diy' ? 'Fai-da-te (solo ricambi)' : 'Meccanico (ricambi + manodopera)',
      recalculatedValue: ricalculatedValue,
      verdictLabel: verdictInfo.label,
      verdictDescription: verdictInfo.description,
      verdictType: verdictInfo.verdict,
      totalDiyMin: damagedResults.reduce((s, r) => s + getDamageRepairCost(r.analysis.damage.category).diyMin, 0) + selectedLights.reduce((s, id) => { const o = DASHBOARD_LIGHTS_OPTIONS.find(l => l.id === id); return s + (o?.diyMin || 0); }, 0),
      totalDiyMax: damagedResults.reduce((s, r) => s + getDamageRepairCost(r.analysis.damage.category).diyMax, 0) + selectedLights.reduce((s, id) => { const o = DASHBOARD_LIGHTS_OPTIONS.find(l => l.id === id); return s + (o?.diyMax || 0); }, 0),
      totalMechMin: damagedResults.reduce((s, r) => s + getDamageRepairCost(r.analysis.damage.category).mechMin, 0) + selectedLights.reduce((s, id) => { const o = DASHBOARD_LIGHTS_OPTIONS.find(l => l.id === id); return s + (o?.mechMin || 0); }, 0),
      totalMechMax: damagedResults.reduce((s, r) => s + getDamageRepairCost(r.analysis.damage.category).mechMax, 0) + selectedLights.reduce((s, id) => { const o = DASHBOARD_LIGHTS_OPTIONS.find(l => l.id === id); return s + (o?.mechMax || 0); }, 0),
      items,
    };

    downloadPDF(report, conditionData);
  };

  return (
    <section className="bg-white rounded-2xl shadow-card border border-border p-6 md:p-7 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-accent" />
            Valutazione Condizione &amp; Stima Ricambi
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Personalizza anno e chilometraggio, seleziona spie o incidenti, carica foto dei danni e trova subito i ricambi su eBay, Autodoc e Oscaro.
          </p>
        </div>
      </div>

      {/* Vehicle Refinement Controls */}
      <div className="bg-surface-2 rounded-xl p-4 border border-border space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-wide text-text-secondary flex items-center gap-1.5">
          <Gauge className="w-4 h-4 text-accent" />
          Affinamento Dati Veicolo per Valutazione Accurata
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">Anno Immatricolazione</label>
            <input
              type="number"
              min="1990"
              max={currentYear}
              value={year}
              onChange={(e) => setYear(Math.max(1990, Number(e.target.value)))}
              className="w-full text-sm font-semibold border border-border rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">Chilometraggio (KM Reali)</label>
            <input
              type="number"
              step="5000"
              value={km}
              onChange={(e) => setKm(Math.max(0, Number(e.target.value)))}
              className="w-full text-sm font-semibold border border-border rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-accent"
            />
            {/* KM Slider */}
            <input
              type="range"
              min="0"
              max="400000"
              step="5000"
              value={km}
              onChange={(e) => setKm(Number(e.target.value))}
              className="w-full h-1.5 mt-2 appearance-none bg-slate-200 rounded-full cursor-pointer accent-accent"
            />
          </div>
        </div>

        {/* KM Usage Indicator */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${kmStyle.bg}`}>
          <KmIcon className={`w-4 h-4 ${kmStyle.text} flex-shrink-0`} />
          <p className={`text-xs font-medium ${kmStyle.text}`}>{kmUsage.message}</p>
        </div>

        {/* Dashboard Lights */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1.5">Spie del Cruscotto Accese</label>
          <div className="flex flex-wrap gap-2">
            {DASHBOARD_LIGHTS_OPTIONS.map((light) => {
              const active = selectedLights.includes(light.id);
              const urg = URGENCY_CONFIG[light.urgency];
              return (
                <button
                  key={light.id}
                  type="button"
                  onClick={() => toggleLight(light.id)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors flex items-center gap-1.5 ${active ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold shadow-sm' : 'bg-white text-text-secondary border-border hover:bg-slate-50'}`}
                >
                  {active && <span className={`w-2 h-2 rounded-full ${urg.dot} flex-shrink-0`} />}
                  {light.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Incident History */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1">Storico Incidenti</label>
          <select
            value={accidentHistory}
            onChange={(e) => setAccidentHistory(e.target.value)}
            className="w-full text-sm font-semibold border border-border rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-accent"
          >
            <option value="none">Nessun incidente rilevato</option>
            <option value="minor">Lievi urti (Graffi o piccoli urti da parcheggio)</option>
            <option value="medium">Medio (Sostituzione paraurti/lamiere esterne)</option>
            <option value="severe">Grave (Strutturale / Airbag esplosi)</option>
          </select>
        </div>

        {/* Dynamic Adjusted Market Value Banner */}
        <div className="bg-white rounded-xl p-4 border border-accent/20 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-secondary">Valore di mercato stimato per anno {year} e {km.toLocaleString('it-IT')} km:</span>
            <span className="text-xl font-black text-accent">{price(ricalculatedValue)}</span>
          </div>

          {/* Breakdown bar */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[11px] text-text-tertiary flex-wrap">
              <span>Prezzo da nuovo: ~{price(newCarBasePrice)}</span>
              <span>·</span>
              <span>Residuo età: {Math.round(ageResidual * 100)}%</span>
              <span>·</span>
              <span>Fattore KM: {Math.round(kmFactor * 100)}%</span>
              {conditionMultiplier < 1 && (
                <>
                  <span>·</span>
                  <span>Condizione: -{Math.round((1 - conditionMultiplier) * 100)}%</span>
                </>
              )}
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent to-blue-400 transition-all duration-500"
                style={{ width: `${Math.max(5, Math.min(100, (ricalculatedValue / newCarBasePrice) * 100))}%` }}
              />
            </div>
          </div>

          {/* Similar Market Cars */}
          <div className="border-t border-slate-100 pt-2.5">
            <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider mb-2">
              Confronto con auto simili in vendita sul mercato
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {similarCars.map((item, idx) => (
                <div key={idx} className={`p-2.5 rounded-lg border ${idx === 0 ? 'bg-accent/5 border-accent/30' : 'bg-surface-2 border-border/80'}`}>
                  <p className="text-xs font-bold text-text-primary truncate">{item.model}</p>
                  <p className="text-[11px] text-text-secondary mt-0.5">{item.km}</p>
                  <p className={`text-sm font-extrabold mt-1 ${idx === 0 ? 'text-accent' : 'text-text-primary'}`}>{price(item.price)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── DIY vs Mechanic Toggle ── */}
      <div className="flex items-center justify-between bg-surface-2 rounded-xl p-3 border border-border">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-accent" />
          <span className="text-xs font-bold text-text-secondary">Modalità costo stimato:</span>
        </div>
        <div className="flex rounded-lg border border-border overflow-hidden">
          <button
            type="button"
            onClick={() => setCostMode('diy')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-colors ${costMode === 'diy' ? 'bg-emerald-600 text-white' : 'bg-white text-text-secondary hover:bg-slate-50'}`}
          >
            <Hammer className="w-3.5 h-3.5" />
            Fai-da-te (solo ricambi)
          </button>
          <button
            type="button"
            onClick={() => setCostMode('mechanic')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-colors ${costMode === 'mechanic' ? 'bg-blue-600 text-white' : 'bg-white text-text-secondary hover:bg-slate-50'}`}
          >
            <Store className="w-3.5 h-3.5" />
            Meccanico (ricambi + manodopera)
          </button>
        </div>
      </div>

      {/* Upload area */}
      {canAddMore && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="w-full rounded-xl border border-dashed border-accent/40 bg-surface-2 px-4 py-6 text-sm font-semibold text-text-primary hover:border-accent hover:bg-accent/5 transition-colors disabled:opacity-60"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-accent" /> Riconoscimento ed analisi del danno in corso...
            </span>
          ) : results.length === 0 ? (
            <span className="inline-flex items-center gap-2">
              <Upload className="w-4 h-4 text-accent" /> Carica una foto del danno o componente per stimare i ricambi
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <Plus className="w-4 h-4 text-accent" /> Aggiungi un&apos;altra foto ({results.length}/{MAX_PHOTOS})
            </span>
          )}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {error && <p role="alert" className="mt-3 text-sm text-rose-600 font-semibold">{error}</p>}

      {/* ── Selected Dashboard Lights: DIY vs Mechanic ── */}
      {selectedLights.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 space-y-3">
          <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Spie Attive — Ricambi &amp; Costi di Riparazione
          </h4>
          <div className="space-y-2.5">
            {selectedLights.map((lightId) => {
              const opt = DASHBOARD_LIGHTS_OPTIONS.find((l) => l.id === lightId);
              if (!opt) return null;
              const urg = URGENCY_CONFIG[opt.urgency];
              const costMin = costMode === 'diy' ? opt.diyMin : opt.mechMin;
              const costMax = costMode === 'diy' ? opt.diyMax : opt.mechMax;

              return (
                <div key={lightId} className="bg-white p-3 rounded-lg border border-amber-200 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${urg.dot} flex-shrink-0`} />
                        <span className="text-xs font-bold text-slate-900">{opt.label}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${urg.bg} ${urg.text}`}>{urg.label}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 ml-4.5">{opt.urgencyNote}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-extrabold text-slate-900">{price(costMin)}–{price(costMax)}</p>
                      <p className="text-[10px] text-slate-400">{costMode === 'diy' ? 'Solo ricambi' : 'Ricambi + manodopera'}</p>
                    </div>
                  </div>
                  {/* DIY feasibility badge */}
                  <div className="flex items-center gap-2 ml-4.5">
                    {opt.canDiy ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <Hammer className="w-3 h-3" /> Fattibile fai-da-te
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        <Store className="w-3 h-3" /> Serve meccanico/officina
                      </span>
                    )}
                  </div>
                  {/* Find spare parts toggle button */}
                  <div className="ml-4.5 mt-2">
                    <button
                      type="button"
                      onClick={() => toggleStoreLinks(lightId)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-colors"
                    >
                      <Store className="w-3.5 h-3.5 text-slate-500 mr-1" />
                      {openStoreLinks[lightId] ? 'Nascondi link ricambi' : 'Trova ricambi online (eBay, Autodoc...)'}
                    </button>
                    {openStoreLinks[lightId] && (
                      <div className="mt-2 pl-2 border-l border-slate-200 animate-fade-in">
                        <StoreLinks query={opt.ebayQuery} make={vehicle?.make} model={vehicle?.model} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Damage results with DIY vs Mechanic costs ── */}
      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((r, idx) => {
            const isDamaged = r.analysis.damage.visible;
            const sev = severityConfig(r.analysis.damage.severity);
            const costs = getDamageRepairCost(r.analysis.damage.category);
            const costMin = costMode === 'diy' ? costs.diyMin : costs.mechMin;
            const costMax = costMode === 'diy' ? costs.diyMax : costs.mechMax;
            const damageQuery = categoryLabel(r.analysis.damage.category);

            return (
              <div key={r.id} className={`rounded-xl border p-4 ${isDamaged ? 'border-amber-200 bg-amber-50/50' : 'border-border bg-surface-2'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${isDamaged ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                      {idx + 1}
                    </div>
                    <div className="min-w-0 space-y-2">
                      {isDamaged ? (
                        <>
                          <p className="text-sm font-bold text-text-primary">
                            {categoryLabel(r.analysis.damage.category)}
                            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full border ${sev.badge}`}>{sev.label}</span>
                          </p>
                          {r.analysis.damage.area && (
                            <p className="text-xs text-text-secondary flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-text-tertiary flex-shrink-0" />
                              {r.analysis.damage.area}
                            </p>
                          )}
                          <p className="text-xs text-text-secondary">{r.analysis.damage.description}</p>

                          {/* Cost breakdown */}
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="inline-flex items-center gap-1 text-sm font-extrabold text-text-primary">
                              <Wrench className="w-3.5 h-3.5 text-accent" />
                              {price(costMin)}–{price(costMax)}
                            </span>
                            <span className="text-[10px] text-text-tertiary">
                              {costMode === 'diy' ? '(solo ricambi)' : '(ricambi + manodopera)'}
                            </span>
                            {r.analysis.estimatedTimeDays != null && r.analysis.estimatedTimeDays > 0 && (
                              <span className="inline-flex items-center gap-1 text-xs text-text-secondary">
                                <Clock className="w-3 h-3" />
                                {r.analysis.estimatedTimeDays} giorno{r.analysis.estimatedTimeDays > 1 ? 'i' : ''}
                              </span>
                            )}
                          </div>

                          {/* DIY feasibility */}
                          <div className="flex items-center gap-2">
                            {costs.canDiy ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                <Hammer className="w-3 h-3" /> Fattibile fai-da-te ({costs.diyDifficulty})
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                                <Store className="w-3 h-3" /> Serve carrozziere/meccanico
                              </span>
                            )}
                          </div>

                          {/* Find spare parts toggle button */}
                          <div className="mt-2">
                            <button
                              type="button"
                              onClick={() => toggleStoreLinks(r.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                            >
                              <Store className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
                              {openStoreLinks[r.id] ? 'Nascondi link ricambi' : 'Trova ricambi online (eBay, Autodoc...)'}
                            </button>
                            {openStoreLinks[r.id] && (
                              <div className="mt-2 pl-2 border-l border-slate-200 animate-fade-in">
                                <StoreLinks query={damageQuery} make={vehicle?.make} model={vehicle?.model} />
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <p className="text-sm font-semibold text-emerald-700">Nessun danno esterno evidente</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setResults((prev) => prev.filter((item) => item.id !== r.id))}
                    className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-text-tertiary hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    aria-label="Rimuovi"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Summary + Verdict ── */}
      <div className={`rounded-2xl border ${verdictInfo.borderColor} ${verdictInfo.bgColor} p-5 space-y-4`}>
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${verdictInfo.verdict === 'repair' ? 'bg-emerald-600 text-white' : verdictInfo.verdict === 'evaluate' ? 'bg-amber-500 text-white' : 'bg-rose-600 text-white'}`}>
            <VerdictIcon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold uppercase tracking-wider text-text-tertiary">Verdetto Convenienza</div>
            <div className={`mt-0.5 text-lg font-extrabold ${verdictInfo.color}`}>{verdictInfo.label}</div>
            <p className="mt-1 text-sm text-text-secondary leading-relaxed">{verdictInfo.description}</p>
          </div>
        </div>

        {/* Cost comparison box */}
        {(damagedResults.length > 0 || selectedLights.length > 0) && (
          <div className="border-t border-black/5 pt-3 grid grid-cols-2 gap-3">
            <div className="bg-emerald-50/80 rounded-lg p-3 border border-emerald-200/60">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide flex items-center gap-1">
                <Hammer className="w-3 h-3" /> Fai-da-te
              </p>
              <p className="text-sm font-extrabold text-emerald-800 mt-1">
                {price(damagedResults.reduce((s, r) => s + getDamageRepairCost(r.analysis.damage.category).diyMin, 0) + selectedLights.reduce((s, id) => { const o = DASHBOARD_LIGHTS_OPTIONS.find(l => l.id === id); return s + (o?.diyMin || 0); }, 0))}
                –
                {price(damagedResults.reduce((s, r) => s + getDamageRepairCost(r.analysis.damage.category).diyMax, 0) + selectedLights.reduce((s, id) => { const o = DASHBOARD_LIGHTS_OPTIONS.find(l => l.id === id); return s + (o?.diyMax || 0); }, 0))}
              </p>
              <p className="text-[10px] text-emerald-600 mt-0.5">Solo ricambi, lavoro tuo</p>
            </div>
            <div className="bg-blue-50/80 rounded-lg p-3 border border-blue-200/60">
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wide flex items-center gap-1">
                <Store className="w-3 h-3" /> Meccanico
              </p>
              <p className="text-sm font-extrabold text-blue-800 mt-1">
                {price(damagedResults.reduce((s, r) => s + getDamageRepairCost(r.analysis.damage.category).mechMin, 0) + selectedLights.reduce((s, id) => { const o = DASHBOARD_LIGHTS_OPTIONS.find(l => l.id === id); return s + (o?.mechMin || 0); }, 0))}
                –
                {price(damagedResults.reduce((s, r) => s + getDamageRepairCost(r.analysis.damage.category).mechMax, 0) + selectedLights.reduce((s, id) => { const o = DASHBOARD_LIGHTS_OPTIONS.find(l => l.id === id); return s + (o?.mechMax || 0); }, 0))}
              </p>
              <p className="text-[10px] text-blue-600 mt-0.5">Ricambi + manodopera officina</p>
            </div>
          </div>
        )}

        <div className="border-t border-black/5 pt-3">
          <p className="text-xs text-text-tertiary">
            <strong className="text-text-secondary">Nota Manodopera &amp; Meccanica:</strong> Le stime coprono il valore medio dei pezzi di ricambio e della manodopera. I prezzi reali variano in base alla zona e all&apos;officina. Per interventi complessi, richiedi sempre un preventivo scritto.
          </p>
        </div>

        {report && (
          <div className="border-t border-black/5 pt-3.5 flex justify-end">
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="inline-flex h-9 items-center gap-1.5 px-4 rounded-lg bg-accent hover:bg-accent-hover text-white text-xs font-bold transition-all active:scale-[0.98] shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Scarica Report Aggiornato (PDF)
            </button>
          </div>
        )}
      </div>

      {/* ── Interactive AI Assistant Widget ── */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-bold text-blue-900">Chiedi all&apos;Esperto AI AutoEsperto</h3>
        </div>
        <p className="text-xs text-blue-700">
          Hai un dubbio su costi, sostituzione componenti o su come procedere? Fai una domanda:
        </p>

        {/* Quick chip buttons */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: 'Costo catena distribuzione', q: `Quanto costa cambiare la catena di distribuzione su ${make} ${model}?` },
            { label: 'Freni: posso fare da solo?', q: `Posso cambiare le pastiglie dei freni da solo su ${make} ${model}?` },
            { label: 'Spia motore accesa', q: `La spia motore è accesa su ${make} ${model} ${year}: cosa può essere?` },
            { label: 'Dove comprare ricambi', q: `Dove trovo i ricambi migliori per ${make} ${model} online?` },
            { label: 'Costo carrozziere', q: `Quanto costa riparare un paraurti dal carrozziere per ${make} ${model}?` },
            { label: 'Controlli prima di comprare', q: `Cosa controllare prima di comprare una ${make} ${model} usata?` },
          ].map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={() => askAiAssistant(chip.q)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-blue-200 text-blue-800 hover:bg-blue-100 font-medium"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Input form */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Scrivi qui la tua domanda (es. quanto costa cambiare la frizione?)"
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && askAiAssistant()}
            className="flex-1 text-xs px-3 py-2 rounded-lg border border-blue-200 bg-white focus:outline-none focus:border-blue-500"
          />
          <button
            type="button"
            onClick={() => askAiAssistant()}
            disabled={aiLoading}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors disabled:opacity-50"
          >
            {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* AI Answer Box */}
        {aiAnswer && (
          <div className="rounded-lg bg-white p-3.5 border border-blue-200 text-xs text-slate-800 space-y-1.5 shadow-sm">
            <p className="font-bold text-blue-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Risposta dell&apos;Esperto:
            </p>
            <p className="leading-relaxed text-slate-700 whitespace-pre-line">{aiAnswer}</p>
          </div>
        )}
      </div>

      <p className="text-xs text-text-tertiary">
        Le foto non vengono pubblicate. I costi indicati sono stime basate su medie di mercato per ricambi e manodopera. I prezzi reali possono variare.
      </p>
    </section>
  );
}
