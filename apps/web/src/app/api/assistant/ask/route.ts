import { NextResponse } from 'next/server';

/* ── Repair cost knowledge base (mirrors backend) ── */
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
  pneumatici: { diy: '40-120€/pz (gomma)', mech: '60-150€/pz (montaggio incluso)', canDiy: false, time: '30 minuti al gommista', stores: 'Gommadiretto, eBay, Amazon' },
  olio_motore: { diy: '25-60€ (olio + filtro)', mech: '80-150€', canDiy: true, time: '30-45 minuti', stores: 'Autodoc, eBay (Castrol, Mobil, Shell)' },
};

function findRepairTopic(q: string): string | null {
  const topics: Array<[string[], string]> = [
    [['catena', 'chain'], 'catena_distribuzione'],
    [['cinghia', 'belt', 'distribuzione'], 'cinghia_distribuzione'],
    [['pastiglia', 'pastiglie', 'brake'], 'pastiglie_freni'],
    [['disco', 'dischi freno'], 'dischi_freni'],
    [['frizione', 'clutch'], 'frizione'],
    [['ammortizzat', 'sospension'], 'ammortizzatori'],
    [['batteria'], 'batteria'],
    [['alternatore'], 'alternatore'],
    [['paraurti', 'bumper'], 'paraurti'],
    [['fanale', 'faro', 'luce', 'lampadina'], 'fanale'],
    [['lambda', 'sonda'], 'sonda_lambda'],
    [['pneumatic', 'gomm', 'ruota'], 'pneumatici'],
    [['olio', 'tagliando'], 'olio_motore'],
  ];
  for (const [keywords, topic] of topics) {
    if (keywords.some(kw => q.includes(kw))) return topic;
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://autoesperto-api.onrender.com';

    // Try backend first
    try {
      const res = await fetch(`${apiUrl}/assistant/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch {
      // Backend unavailable, fall through to fallback
    }

    // ── Fallback: generate answer locally ──
    const { question, vehicle } = body;
    const makeModel = [vehicle?.make, vehicle?.model].filter(Boolean).join(' ') || 'veicolo';
    const qLower = (question || '').toLowerCase();
    const yearStr = vehicle?.year ? ` (${vehicle.year})` : '';

    let answer = '';

    // Check for specific repair topic
    const repairTopic = findRepairTopic(qLower);
    if (repairTopic && REPAIR_COSTS[repairTopic]) {
      const cost = REPAIR_COSTS[repairTopic];
      answer = `Sulla tua **${makeModel}**${yearStr}, ecco la stima dei costi reali di mercato:\n\n` +
        `• **Fai-da-te (solo ricambi)**: **${cost.diy}** (${cost.canDiy ? 'fattibile in autonomia con attrezzi standard' : 'richiede ponte sollevatore o attrezzatura specifica'})\n` +
        `• **In officina (ricambi + manodopera)**: **${cost.mech}** (tempo medio: ${cost.time})\n` +
        `• **Canali consigliati per i pezzi**: ${cost.stores}\n\n` +
        `Hai già notato sintomi specifici durante la guida (come rumori o perdite di efficienza), o stai pianificando una manutenzione preventiva?`;
    }
    // Warning lights
    else if (qLower.includes('spia') || qLower.includes('cruscotto') || qLower.includes('motore accesa')) {
      answer = `Sulla tua **${makeModel}**${yearStr}, l'accensione di una spia segnala un'anomalia registrata dalla centralina:\n\n` +
        `• **Spia ROSSA**: arresta subito l'auto in sicurezza (pressione olio, freni, temperatura motore).\n` +
        `• **Spia GIALLA / Check Engine**: anomalia a iniezione, scarico (EGR/DPF/lambda) o sensori. Puoi guidare a andatura moderata fino all'officina.\n\n` +
        `La spia è **fissa o lampeggiante**? L'auto ha perso potenza o funziona normalmente?`;
    }
    // Where to buy
    else if (qLower.includes('ricamb') || qLower.includes('dove') || qLower.includes('compra') || qLower.includes('ebay')) {
      answer = `Per ordinare i ricambi compatibili con la tua **${makeModel}**${yearStr}:\n\n` +
        `1. **eBay.it**: ideale per ricambi usati originali OEM (specchietti, fanali, centraline, alternatori).\n` +
        `2. **Autodoc.it**: catalogo completo per pastiglie, dischi, filtri e sospensioni nuove di qualità OE.\n` +
        `3. **Oscaro.it**: ottimo per kit frizione e cinghie di distribuzione.\n\n` +
        `Quale componente specifico devi sostituire? Posso indicarti le specifiche tecniche consigliate.`;
    }
    // DIY questions
    else if (qLower.includes('da solo') || qLower.includes('fai da te') || qLower.includes('posso')) {
      answer = `Sulla tua **${makeModel}**${yearStr}, ecco cosa puoi fare tranquillamente in autonomia e cosa richiede l'officina:\n\n` +
        `✅ **Fai-da-te facile**: batteria, filtro aria e abitacolo, lampadine, tergicristalli, ritocco graffi superficiali.\n` +
        `⚠️ **Fai-da-te medio (con attrezzi)**: cambio olio e filtro, pastiglie freni anteriori, specchietto.\n` +
        `🚫 **Consigliata officina**: frizione/volano, cinghia di distribuzione, ricarica clima, diagnosi elettronica avanzata.\n\n` +
        `Quale lavoro vorresti fare da solo? Hai già gli attrezzi base nel box?`;
    }
    // Carrozzeria / color
    else if (qLower.includes('colore') || qLower.includes('vernic') || qLower.includes('carrozzeria') || qLower.includes('carrozziere')) {
      answer = `Per ripristinare la carrozzeria della tua **${makeModel}**${yearStr}:\n\n` +
        `• **Graffi leggeri / trasparente**: stilo o pasta abrasiva di ritocco OEM (circa 12 € – 25 €).\n` +
        `• **Ammaccatura o paraurti dal carrozziere**: circa 150 € – 350 € a pannello verniciato a forno con garanzia.\n\n` +
        `💡 Il codice colore esatto è stampato sulla targhetta nel montante della portiera o sotto il cofano motore.\n\n` +
        `Il graffio è superficiale o si vede la lamiera/plastica scura sotto?`;
    }
    // Buy/sell
    else if (qLower.includes('comprare') || qLower.includes('controllare') || qLower.includes('acquist')) {
      answer = `Stai valutando l'acquisto di una **${makeModel}**${yearStr}? Ecco i 5 controlli chiave:\n\n` +
        `1. **Storico tagliandi**: verifica fatture reali per confermare la cura e i km effettivi.\n` +
        `2. **Diagnosi OBD**: per verificare errori cancellati di recente prima della vendita.\n` +
        `3. **Distribuzione e Frizione**: chiedi l'anno dell'ultima sostituzione.\n` +
        `4. **Freni e Gomme**: controlla lo scalino sui dischi e l'anno di fabbricazione degli pneumatici (DOT).\n` +
        `5. **Portate e visura**: controlla revisioni ministeriali e assenza di fermi amministrativi.\n\n` +
        `Hai già il link dell'annuncio o la targa dell'auto per fare un controllo completo su AutoEsperto?`;
    }
    // Generic fallback
    else {
      answer = `Ciao! Per la tua **${makeModel}**${yearStr}, posso aiutarti a stimare i costi di riparazione, verificare scadenze e consigliarti i pezzi compatibili.\n\n` +
        `Vuoi un preventivo per un intervento specifico (es. freni, frizione, tagliando) o hai una spia accesa da verificare?`;
    }

    return NextResponse.json({ success: true, answer, vehicle: makeModel });
  } catch {
    return NextResponse.json({
      success: true,
      answer: 'Ciao! Come posso aiutarti con la manutenzione, i ricambi o la valutazione della tua auto?',
    });
  }
}
