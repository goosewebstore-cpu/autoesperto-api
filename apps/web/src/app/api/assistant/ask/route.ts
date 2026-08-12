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
      answer = `💰 Costi stimati per ${makeModel}${yearStr}:\n\n`;
      answer += `🔧 Fai-da-te (solo ricambi): ${cost.diy}\n`;
      answer += `🏭 Meccanico (ricambi + manodopera): ${cost.mech}\n`;
      answer += `⏱️ Tempo stimato: ${cost.time}\n`;
      answer += cost.canDiy
        ? `\n✅ Intervento fattibile fai-da-te con attrezzatura base.`
        : `\n⚠️ Intervento consigliato in officina specializzata.`;
      answer += `\n\n🛒 Dove comprare: ${cost.stores}`;
    }
    // Warning lights
    else if (qLower.includes('spia') || qLower.includes('cruscotto') || qLower.includes('motore accesa')) {
      answer = `Per le spie del cruscotto su ${makeModel}${yearStr}:\n\n`;
      answer += `🔴 Spie ROSSE (fermare subito): Freni, Temperatura, Olio\n`;
      answer += `🟡 Spie GIALLE (controllare): Check Engine, ABS, Airbag, FAP\n\n`;
      answer += `🔧 Fai-da-te: lettore OBD2 su Amazon (15-30€) per leggere i codici errore.\n`;
      answer += `🏭 Meccanico: diagnosi completa 30-60€, poi preventivo specifico.`;
    }
    // Where to buy
    else if (qLower.includes('ricamb') || qLower.includes('dove') || qLower.includes('compra') || qLower.includes('ebay')) {
      answer = `🛒 Dove comprare ricambi per ${makeModel}${yearStr}:\n\n`;
      answer += `1. **eBay.it** — Ricambi usati OEM a prezzi bassi\n`;
      answer += `2. **Autodoc.it** — Catalogo enorme, ricambi nuovi\n`;
      answer += `3. **Oscaro.it** — Specializzato auto, prezzi competitivi\n\n`;
      answer += `💡 Cerca sempre con marca, modello, anno e codice OEM del pezzo.`;
    }
    // DIY questions
    else if (qLower.includes('da solo') || qLower.includes('fai da te') || qLower.includes('posso')) {
      answer = `🔧 Lavori fattibili fai-da-te su ${makeModel}:\n\n`;
      answer += `✅ Facili: lampadine, tergicristalli, batteria, filtro aria, ritocco graffi\n`;
      answer += `⚠️ Medi: pastiglie freni, olio + filtro, specchietto, sensore ABS\n`;
      answer += `🚫 Meccanico: catena/cinghia, frizione, alternatore, FAP`;
    }
    // Carrozzeria / color
    else if (qLower.includes('colore') || qLower.includes('vernic') || qLower.includes('carrozzeria') || qLower.includes('carrozziere')) {
      answer = `Per lavori di carrozzeria su ${makeModel}${yearStr}:\n\n`;
      answer += `🔧 Fai-da-te:\n`;
      answer += `• Graffi leggeri: stilo ritocco OEM (12-25€)\n`;
      answer += `• Graffi medi: kit verniciatura spray (30-60€)\n\n`;
      answer += `🏭 Carrozziere:\n`;
      answer += `• Ritocco singolo pannello: 150-350€\n`;
      answer += `• Verniciatura paraurti: 250-500€\n`;
      answer += `• Verniciatura completa: 2.000-4.000€\n`;
      answer += `• Wrapping pellicola: 1.500-3.500€\n\n`;
      answer += `💡 Per il codice colore esatto, controlla la targhetta nel vano motore o nel montante portiera.`;
    }
    // Buy/sell
    else if (qLower.includes('comprare') || qLower.includes('controllare') || qLower.includes('acquist')) {
      answer = `📋 Controlli prima di comprare una ${makeModel}${yearStr} usata:\n\n`;
      answer += `1. Verifica tagliandi (libretto manutenzione)\n`;
      answer += `2. Diagnosi OBD2 per errori nascosti (20-50€)\n`;
      answer += `3. Controllare cinghia/catena distribuzione\n`;
      answer += `4. Stato pneumatici e freni\n`;
      answer += `5. Carrozzeria: ruggine, graffi, segni di incidenti\n`;
      answer += `6. Verifica km reali su portale Motorizzazione\n`;
      answer += `7. Visura PRA per vincoli o ipoteche`;
    }
    // Generic fallback
    else {
      answer = `Per ${makeModel}${yearStr}:\n\n`;
      answer += `Per qualsiasi intervento di riparazione, confronta i prezzi dei ricambi su:\n`;
      answer += `• eBay.it (usato OEM economico)\n`;
      answer += `• Autodoc.it (nuovo aftermarket)\n`;
      answer += `• Oscaro.it (nuovo, specializzato)\n\n`;
      answer += `Cerca sempre con codice OEM e richiedi un preventivo scritto al meccanico o carrozziere.`;
    }

    return NextResponse.json({ success: true, answer, vehicle: makeModel });
  } catch {
    return NextResponse.json({
      success: true,
      answer: 'Consiglio dell\'Esperto AI: confronta i prezzi dei ricambi su eBay.it, Autodoc.it e Oscaro.it. Cerca sempre con il codice OEM del pezzo e richiedi preventivi scritti.',
    });
  }
}
