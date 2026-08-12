import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { getVehicleKnowledge } from '../services/vehicleKB';

const router = Router();

const AskAssistantSchema = z.object({
  question: z.string().min(3, 'La domanda deve avere almeno 3 caratteri.').max(500, 'Domanda troppo lunga.'),
  vehicle: z.object({
    make: z.string().optional(),
    model: z.string().optional(),
    year: z.number().optional(),
    km: z.number().optional(),
  }).optional(),
  condition: z.object({
    dashboardLights: z.array(z.string()).optional(),
    accidentHistory: z.string().optional(),
    damages: z.array(z.string()).optional(),
  }).optional(),
});

/* ── Repair cost knowledge base ── */
const REPAIR_COSTS: Record<string, { diy: string; mech: string; canDiy: boolean; time: string; stores: string }> = {
  catena_distribuzione: { diy: '80-200€ (kit catena)', mech: '400-900€', canDiy: false, time: '4-8 ore in officina', stores: 'Autodoc, eBay (kit catena + tenditore)' },
  cinghia_distribuzione: { diy: '40-120€ (kit cinghia)', mech: '300-700€', canDiy: false, time: '3-6 ore in officina', stores: 'Autodoc, eBay (kit cinghia + rulli + pompa acqua)' },
  pastiglie_freni: { diy: '20-60€ (set pastiglie)', mech: '80-180€', canDiy: true, time: '1-2 ore fai-da-te', stores: 'Autodoc, Oscaro, eBay' },
  dischi_freni: { diy: '40-120€ (coppia dischi)', mech: '150-350€', canDiy: true, time: '2-3 ore fai-da-te', stores: 'Autodoc, Oscaro, eBay' },
  frizione: { diy: '120-300€ (kit frizione)', mech: '500-1200€', canDiy: false, time: '6-10 ore in officina', stores: 'Autodoc, eBay (kit frizione completo)' },
  ammortizzatori: { diy: '60-180€ (coppia)', mech: '250-500€', canDiy: false, time: '3-5 ore in officina', stores: 'Autodoc, Oscaro (Monroe, Bilstein, Sachs)' },
  batteria: { diy: '60-150€', mech: '100-200€', canDiy: true, time: '15-30 minuti', stores: 'Autodoc, eBay, Oscaro' },
  alternatore: { diy: '80-250€ (rigenerato)', mech: '200-500€', canDiy: false, time: '2-4 ore in officina', stores: 'eBay (rigenerato), Autodoc (nuovo)' },
  paraurti: { diy: '60-250€ (usato/aftermarket)', mech: '300-750€', canDiy: true, time: '2-4 ore fai-da-te', stores: 'eBay (usato OEM), Autodoc (aftermarket)' },
  fanale: { diy: '40-180€', mech: '120-350€', canDiy: true, time: '30-60 minuti', stores: 'eBay, Autodoc, Oscaro' },
  sonda_lambda: { diy: '25-80€', mech: '80-200€', canDiy: true, time: '30-60 minuti', stores: 'Autodoc, eBay (Bosch, NGK, Denso)' },
  sensore_abs: { diy: '20-70€', mech: '60-180€', canDiy: true, time: '30-60 minuti', stores: 'Autodoc, eBay, Oscaro' },
  filtro_fap: { diy: '15-40€ (additivo)', mech: '300-800€ (lavaggio/sostituzione)', canDiy: false, time: '2-4 ore in officina', stores: 'Autodoc (additivo), eBay (filtro nuovo/rigenerato)' },
  pneumatici: { diy: '40-120€/pz (gomma)', mech: '60-150€/pz (montaggio incluso)', canDiy: false, time: '30 minuti al gommista', stores: 'Gommadiretto, eBay, Amazon' },
  olio_motore: { diy: '25-60€ (olio + filtro)', mech: '80-150€', canDiy: true, time: '30-45 minuti', stores: 'Autodoc, eBay (Castrol, Mobil, Shell)' },
  candele: { diy: '15-50€ (set)', mech: '50-120€', canDiy: true, time: '30-60 minuti', stores: 'Autodoc, Oscaro (NGK, Bosch, Denso)' },
  specchietto: { diy: '25-120€', mech: '80-250€', canDiy: true, time: '15-30 minuti', stores: 'eBay (usato OEM), Autodoc' },
};

function findRepairTopic(question: string): string | null {
  const q = question.toLowerCase();
  const topics: Array<[string[], string]> = [
    [['catena', 'chain'], 'catena_distribuzione'],
    [['cinghia', 'belt', 'distribuzione'], 'cinghia_distribuzione'],
    [['pastiglia', 'pastiglie', 'brake pad'], 'pastiglie_freni'],
    [['disco', 'dischi freno'], 'dischi_freni'],
    [['frizione', 'clutch'], 'frizione'],
    [['ammortizzat', 'sospension', 'shock'], 'ammortizzatori'],
    [['batteria', 'battery'], 'batteria'],
    [['alternatore', 'alternator'], 'alternatore'],
    [['paraurti', 'bumper'], 'paraurti'],
    [['fanale', 'faro', 'luce', 'lampadina', 'headlight'], 'fanale'],
    [['lambda', 'sonda'], 'sonda_lambda'],
    [['abs', 'sensore abs'], 'sensore_abs'],
    [['fap', 'dpf', 'particolato'], 'filtro_fap'],
    [['pneumatic', 'gomm', 'ruota', 'tire'], 'pneumatici'],
    [['olio', 'tagliando', 'oil'], 'olio_motore'],
    [['candel', 'spark'], 'candele'],
    [['specchietto', 'mirror'], 'specchietto'],
  ];

  for (const [keywords, topic] of topics) {
    if (keywords.some(kw => q.includes(kw))) return topic;
  }
  return null;
}

router.post('/ask', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { question, vehicle, condition } = AskAssistantSchema.parse(req.body);
    const qLower = question.toLowerCase();
    const makeModel = [vehicle?.make, vehicle?.model].filter(Boolean).join(' ') || 'veicolo';
    const yearStr = vehicle?.year ? ` (${vehicle.year})` : '';
    const kmStr = vehicle?.km ? ` con ${vehicle.km.toLocaleString('it-IT')} km` : '';

    // Get vehicle-specific knowledge if available
    let kb = null;
    try {
      if (vehicle?.make) {
        kb = getVehicleKnowledge(vehicle.make);
      }
    } catch { /* ignore */ }

    let answer = '';

    // Check if it's a specific repair cost question
    const repairTopic = findRepairTopic(qLower);
    if (repairTopic && REPAIR_COSTS[repairTopic]) {
      const cost = REPAIR_COSTS[repairTopic];
      const topicLabels: Record<string, string> = {
        catena_distribuzione: 'la catena di distribuzione',
        cinghia_distribuzione: 'la cinghia di distribuzione',
        pastiglie_freni: 'le pastiglie freni',
        dischi_freni: 'i dischi freno',
        frizione: 'la frizione',
        ammortizzatori: 'gli ammortizzatori',
        batteria: 'la batteria',
        alternatore: 'l\'alternatore',
        paraurti: 'il paraurti',
        fanale: 'il fanale/faro',
        sonda_lambda: 'la sonda lambda',
        sensore_abs: 'il sensore ABS',
        filtro_fap: 'il filtro antiparticolato (FAP/DPF)',
        pneumatici: 'i pneumatici',
        olio_motore: 'l\'olio motore + filtro',
        candele: 'le candele',
        specchietto: 'lo specchietto',
      };
      const label = topicLabels[repairTopic] || repairTopic;

      answer = `💰 Costi per ${label} su ${makeModel}${yearStr}:\n\n`;
      answer += `🔧 Fai-da-te (solo ricambi): ${cost.diy}\n`;
      answer += `🏭 Meccanico (ricambi + manodopera): ${cost.mech}\n`;
      answer += `⏱️ Tempo stimato: ${cost.time}\n`;
      answer += cost.canDiy
        ? `\n✅ Intervento fattibile fai-da-te con attrezzatura base.`
        : `\n⚠️ Intervento consigliato in officina specializzata.`;
      answer += `\n\n🛒 Dove comprare: ${cost.stores}`;

      if (kb) {
        const relevantIssues = kb.common.filter(issue =>
          repairTopic.split('_').some(word => issue.toLowerCase().includes(word))
        );
        if (relevantIssues.length > 0) {
          answer += `\n\n📋 Nota specifica per ${vehicle?.make}: ${relevantIssues[0]}`;
        }
      }
    }
    // Dashboard lights / warning questions
    else if (qLower.includes('spia') || qLower.includes('cruscotto') || qLower.includes('warning')) {
      answer = `Per le spie del cruscotto su ${makeModel}${yearStr}${kmStr}:\n\n`;
      answer += `🔴 Spie ROSSE (fermare subito): Freni, Temperatura motore, Olio\n`;
      answer += `🟡 Spie GIALLE (far controllare): Check Engine, ABS, Airbag, FAP\n\n`;

      if (condition?.dashboardLights?.length) {
        answer += `Le spie che hai selezionato richiedono una diagnosi OBD2 in officina (costo: 20-50€). `;
        answer += `Spesso il problema è un sensore economico (20-80€ su Autodoc o eBay).\n\n`;
      }

      answer += `🔧 Fai-da-te: puoi comprare un lettore OBD2 su Amazon (15-30€) per leggere i codici errore.\n`;
      answer += `🏭 Meccanico: diagnosi completa 30-60€, poi preventivo specifico per la riparazione.`;

      if (kb) {
        answer += `\n\n📋 Problemi noti per ${vehicle?.make}: ${kb.common[0]}`;
      }
    }
    // Buy/sell advice
    else if (qLower.includes('vender') || qLower.includes('conviene') || qLower.includes('comprare') || qLower.includes('acquist')) {
      answer = `Consiglio per ${makeModel}${yearStr}${kmStr}:\n\n`;

      if (kb) {
        answer += `📊 Affidabilità: ${kb.reliabilityScore}/10\n`;
        answer += `💸 Costi manutenzione: ${kb.maintenance}\n\n`;

        if (kb.versionsRecommended.length > 0) {
          answer += `✅ Versioni consigliate: ${kb.versionsRecommended.join(', ')}\n`;
        }
        if (kb.versionsToAvoid.length > 0) {
          answer += `❌ Da evitare: ${kb.versionsToAvoid.join(', ')}\n`;
        }

        answer += `\n📋 Controlli importanti prima dell'acquisto:\n`;
        kb.common.forEach(issue => { answer += `• ${issue}\n`; });
      } else {
        answer += `Regola generale: se la riparazione supera il 35-40% del valore dell'auto, conviene vendere.\n\n`;
        answer += `📋 Controlli fondamentali:\n`;
        answer += `• Verifica tagliandi (libretto manutenzione)\n`;
        answer += `• Diagnosi OBD2 per errori nascosti\n`;
        answer += `• Controllare cinghia/catena distribuzione\n`;
        answer += `• Stato pneumatici e freni\n`;
        answer += `• Carrozzeria: ruggine, graffi, incidenti`;
      }
    }
    // Where to buy parts
    else if (qLower.includes('ricamb') || qLower.includes('pezzo') || qLower.includes('dove') || qLower.includes('compra') || qLower.includes('ebay') || qLower.includes('autodoc') || qLower.includes('oscaro')) {
      answer = `🛒 Dove comprare ricambi per ${makeModel}${yearStr}:\n\n`;
      answer += `1. **eBay.it** — Ottimo per ricambi usati OEM a prezzi bassi. Cerca sempre con il codice OEM del pezzo.\n`;
      answer += `2. **Autodoc.it** — Grande catalogo di ricambi nuovi aftermarket e OEM. Spedizione veloce.\n`;
      answer += `3. **Oscaro.it** — Specializzato auto, prezzi competitivi su freni, filtri, sospensioni.\n`;
      answer += `4. **Amazon.it** — Buono per accessori, olio, lampadine, attrezzi.\n\n`;
      answer += `💡 Consiglio: cerca sempre inserendo marca, modello, anno e il codice OEM del pezzo (stampato sul ricambio vecchio o nel libretto). `;
      answer += `Confronta i prezzi tra i 3 siti prima di ordinare.`;
    }
    // General mechanic questions
    else if (qLower.includes('meccanic') || qLower.includes('motore') || qLower.includes('fumo') || qLower.includes('rumore') || qLower.includes('vibrazio')) {
      answer = `Per problemi meccanici su ${makeModel}${yearStr}${kmStr}:\n\n`;

      if (kb) {
        answer += `🔧 Motore: ${kb.engine}\n\n`;
        answer += `⚙️ Cambio: ${kb.transmission}\n\n`;
      }

      answer += `📋 Passaggi consigliati:\n`;
      answer += `1. Diagnosi OBD2 in officina (20-50€) per identificare il problema esatto\n`;
      answer += `2. Chiedere preventivo scritto con dettaglio ricambi + manodopera\n`;
      answer += `3. Confrontare il costo dei ricambi su Autodoc/eBay/Oscaro\n`;
      answer += `4. Se il costo supera il 40% del valore auto, valutare la vendita\n\n`;
      answer += `💡 Per rumori o vibrazioni anomale, è fondamentale la diagnosi di un meccanico esperto. Non rimandare se senti rumori dal motore o dal cambio.`;
    }
    // DIY questions
    else if (qLower.includes('da solo') || qLower.includes('fai da te') || qLower.includes('posso') || qLower.includes('difficile')) {
      answer = `🔧 Lavori fattibili fai-da-te su ${makeModel}:\n\n`;
      answer += `✅ FACILI (nessuna esperienza richiesta):\n`;
      answer += `• Cambio lampadine/fanali — 10-30€, 15 min\n`;
      answer += `• Cambio tergicristalli — 10-25€, 5 min\n`;
      answer += `• Sostituzione batteria — 60-150€, 15 min\n`;
      answer += `• Cambio filtro aria — 10-25€, 10 min\n`;
      answer += `• Ritocco graffi (stilo) — 12-25€, 20 min\n\n`;
      answer += `⚠️ MEDI (serve un po' di esperienza):\n`;
      answer += `• Cambio pastiglie freni — 25-60€, 1-2 ore\n`;
      answer += `• Cambio olio + filtro — 25-60€, 30 min\n`;
      answer += `• Cambio specchietto — 25-120€, 15 min\n`;
      answer += `• Sostituzione sensore ABS — 20-70€, 30 min\n\n`;
      answer += `🚫 RICHIEDE MECCANICO:\n`;
      answer += `• Catena/cinghia distribuzione\n`;
      answer += `• Frizione\n`;
      answer += `• Alternatore\n`;
      answer += `• Lavaggio FAP/DPF\n`;
      answer += `• Problemi centralina/elettronica complessa`;
    }
    // Fallback: use KB if available
    else {
      answer = `Riguardo "${question}" per ${makeModel}${yearStr}${kmStr}:\n\n`;

      if (kb) {
        answer += `📊 Affidabilità: ${kb.reliabilityScore}/10 — Manutenzione: ${kb.maintenance}\n\n`;
        answer += `🔧 Motore: ${kb.engine}\n\n`;
        answer += `📋 Problemi comuni:\n`;
        kb.common.forEach(issue => { answer += `• ${issue}\n`; });
        answer += `\n🛒 Per qualsiasi ricambio: cerca su eBay.it, Autodoc.it o Oscaro.it inserendo marca, modello e anno.`;
      } else {
        answer += `Per piccoli difetti estetici (graffi, specchietti, plastiche) i ricambi su eBay e Autodoc sono molto convenienti.\n`;
        answer += `Per problemi meccanici, fai sempre una diagnosi OBD2 prima di procedere (20-50€ in officina).`;
      }
    }

    return res.json({
      success: true,
      answer,
      vehicle: makeModel,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
