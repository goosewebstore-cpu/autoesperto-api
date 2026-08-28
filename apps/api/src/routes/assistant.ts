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

      answer = `Sulla tua **${makeModel}**${yearStr}, ecco la stima dei costi reali di mercato per ${label}:\n\n` +
        `• **Fai-da-te (solo ricambi)**: **${cost.diy}** (${cost.canDiy ? 'fattibile in autonomia con attrezzi standard' : 'richiede ponte sollevatore o attrezzatura specifica'})\n` +
        `• **In officina (ricambi + manodopera)**: **${cost.mech}** (tempo stimato: ${cost.time})\n` +
        `• **Canali consigliati per i ricambi**: ${cost.stores}\n\n`;

      if (kb) {
        const relevantIssues = kb.common.filter(issue =>
          repairTopic.split('_').some(word => issue.toLowerCase().includes(word))
        );
        if (relevantIssues.length > 0) {
          answer += `💡 **Nota specifica per ${vehicle?.make}**: ${relevantIssues[0]}\n\n`;
        }
      }

      answer += `Hai già notato sintomi specifici durante la guida (come rumori anomali o perdite di efficienza), o stai pianificando una manutenzione preventiva?`;
    }
    // Dashboard lights / warning questions
    else if (qLower.includes('spia') || qLower.includes('cruscotto') || qLower.includes('warning') || qLower.includes('motore accesa')) {
      answer = `Sulla tua **${makeModel}**${yearStr}${kmStr}, l'accensione di una spia segnala un'anomalia registrata dalla centralina:\n\n` +
        `🔴 **Spia ROSSA**: arresta subito l'auto in sicurezza (pressione olio, freni, temperatura motore).\n` +
        `🟡 **Spia GIALLA / Check Engine**: anomalia a iniezione, scarico (EGR/DPF/lambda) o sensori. Puoi guidare a andatura moderata fino all'officina.\n\n`;

      if (condition?.dashboardLights?.length) {
        answer += `Le anomalie indicate richiedono una diagnosi OBD2 in officina (costo: 20-50€) o un lettore diagnostico portatile (15-30€ su Amazon).\n\n`;
      }

      if (kb) {
        answer += `💡 **Criticità tipica per ${vehicle?.make}**: ${kb.common[0]}\n\n`;
      }

      answer += `La spia è **fissa o lampeggiante**? L'auto ha vuoti di potenza o rumori insoliti?`;

    }
    // Buy/sell advice
    else if (qLower.includes('vender') || qLower.includes('conviene') || qLower.includes('comprare') || qLower.includes('acquist')) {
      answer = `Ecco un'analisi strategica per **${makeModel}**${yearStr}${kmStr}:\n\n`;

      if (kb) {
        answer += `📊 **Affidabilità complessiva**: ${kb.reliabilityScore}/10\n`;
        answer += `💸 **Costi di gestione**: ${kb.maintenance}\n\n`;

        if (kb.versionsRecommended.length > 0) {
          answer += `✅ **Versioni consigliate**: ${kb.versionsRecommended.join(', ')}\n`;
        }
        if (kb.versionsToAvoid.length > 0) {
          answer += `❌ **Motorizzazioni/versioni da verificare o evitare**: ${kb.versionsToAvoid.join(', ')}\n`;
        }

        answer += `\n📋 **Punti di controllo chiave**:\n`;
        kb.common.slice(0, 3).forEach(issue => { answer += `• ${issue}\n`; });
      } else {
        answer += `💡 **Regola d'oro**: se il preventivo di ripristino supera il 35-40% del valore attuale di mercato, conviene pianificare la vendita o la permuta.\n\n`;
        answer += `📋 **Controlli essenziali prima di decidere**:\n`;
        answer += `• Libretto tagliandi e cronologia interventi\n`;
        answer += `• Diagnosi OBD2 per errori memorizzati\n`;
        answer += `• Stato cinghia/catena di distribuzione e frizione\n`;
      }
      answer += `\nQual è il prezzo richiesto o il preventivo di cui disponi? Posso confrontarlo con la quotazione di mercato.`;
    }
    // Where to buy parts
    else if (qLower.includes('ricamb') || qLower.includes('pezzo') || qLower.includes('dove') || qLower.includes('compra') || qLower.includes('ebay') || qLower.includes('autodoc') || qLower.includes('oscaro')) {
      answer = `Per ordinare i ricambi per la tua **${makeModel}**${yearStr}:\n\n` +
        `1. **eBay.it** — Ideale per ricambi usati originali OEM (specchietti, fanali, centraline, alternatori).\n` +
        `2. **Autodoc.it** — Catalogo completo per pastiglie, dischi, filtri e sospensioni nuove certificate.\n` +
        `3. **Oscaro.it** — Ottimo per kit frizione e cinghie di distribuzione a prezzi competitivi.\n` +
        `4. **Amazon.it** — Consigliato per fluidi, olio motore, lampadine e attrezzi fai-da-te.\n\n` +
        `Quale componente specifico devi sostituire? Posso aiutarti a trovare il tipo esatto.`;
    }
    // General mechanic questions
    else if (qLower.includes('meccanic') || qLower.includes('motore') || qLower.includes('fumo') || qLower.includes('rumore') || qLower.includes('vibrazio')) {
      answer = `Per problemi meccanici su **${makeModel}**${yearStr}${kmStr}:\n\n`;

      if (kb) {
        answer += `🔧 **Motore**: ${kb.engine}\n\n`;
        answer += `⚙️ **Trasmissione**: ${kb.transmission}\n\n`;
      }

      answer += `📋 **Procedura consigliata**:\n`;
      answer += `1. Diagnosi OBD2 in officina (20-50€) per isolare l'origine del problema\n`;
      answer += `2. Preventivo dettagliato che separi costo manodopera e ricambi\n`;
      answer += `3. Verifica disponibilità ricambi OEM/aftermarket su Autodoc o eBay per risparmiare\n\n`;
      answer += `Da quando hai notato il problema e in quali situazioni si manifesta (es. accelerazione, a freddo, in frenata)?`;
    }
    // Fallback: use KB if available
    else {
      answer = `Riguardo a "${question}" per **${makeModel}**${yearStr}${kmStr}:\n\n`;

      if (kb) {
        answer += `📊 **Affidabilità**: ${kb.reliabilityScore}/10 — **Manutenzione**: ${kb.maintenance}\n\n`;
        answer += `🔧 **Scheda tecnica**: ${kb.engine}\n\n`;
        answer += `📋 **Note sul modello**:\n`;
        kb.common.slice(0, 3).forEach(issue => { answer += `• ${issue}\n`; });
        answer += `\nCosa vorresti approfondire in particolare su questo veicolo?`;
      } else {
        answer += `Per piccoli difetti estetici (graffi, specchietti, plastiche) i ricambi online consentono un forte risparmio.\n`;
        answer += `Per problemi meccanici o spie, ti consiglio una lettura errori OBD2 in officina prima di sostituire componenti a caso.\n\n`;
        answer += `Vuoi verificare una stima dei costi per un componente specifico?`;
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
