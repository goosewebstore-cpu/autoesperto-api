import type {
  VehiclePassportData,
  PassportChatMessage,
} from '@autoesperto/types';
import { findModelEra } from './modelEra';

/**
 * Helper per calcolare i consumi reali realistici in base al veicolo specifico.
 */
function getVehicleConsumptionDetails(
  make: string,
  model: string,
  fuel: string,
  year: number,
  version?: string,
  displacement?: string
) {
  const mk = make.toLowerCase();
  const md = model.toLowerCase();
  const fl = fuel.toLowerCase();
  const ver = (version || '').toLowerCase();
  const disp = (displacement || '').toLowerCase();

  // 1. Fiat 500 / 500C / 500L / 500X
  if (mk.includes('fiat') && md.includes('500')) {
    if (fl.includes('diesel') || ver.includes('multijet') || disp.includes('1.3')) {
      return {
        fuelLabel: 'Diesel 1.3 Multijet',
        urban: '4.9 – 5.4 L/100 km (~18.5 – 20.4 km/L)',
        extraUrban: '3.7 – 4.2 L/100 km (~23.8 – 27.0 km/L)',
        mixed: '4.2 – 4.6 L/100 km (~21.7 – 23.8 km/L)',
        tankCapacity: '35 litri',
        range: 'circa 760 – 830 km con un pieno',
        fullCost: 'circa 58 € – 62 € (con gasolio a ~1,68 €/L)',
        costPer100Km: 'circa 7,05 € – 7,75 €',
        notes: 'Motore 1.3 Multijet eccezionale sulle lunghe percorrenze. In città fai attenzione al filtro antiparticolato (DPF) con rigenerazioni frequenti.',
      };
    }
    if (fl.includes('ibrid') || ver.includes('hybrid') || ver.includes('firefly') || year >= 2020) {
      return {
        fuelLabel: '1.0 FireFly Mild Hybrid 70 CV',
        urban: '5.3 – 5.8 L/100 km (~17.2 – 18.8 km/L)',
        extraUrban: '4.3 – 4.7 L/100 km (~21.2 – 23.2 km/L)',
        mixed: '4.8 – 5.2 L/100 km (~19.2 – 20.8 km/L)',
        tankCapacity: '35 litri',
        range: 'circa 670 – 730 km con un pieno',
        fullCost: 'circa 60 € – 64 € (con benzina a ~1,78 €/L)',
        costPer100Km: 'circa 8,50 € – 9,25 €',
        notes: 'Il sistema mild-hybrid a 12V con batteria ausiliaria sotto il sedile consente consumi bassissimi in città sfruttando il veleggiamento sotto i 30 km/h.',
      };
    }
    if (fl.includes('gpl') || ver.includes('easypower')) {
      return {
        fuelLabel: '1.2 EasyPower GPL',
        urban: '8.2 – 8.8 L/100 km GPL (~11.3 – 12.2 km/L)',
        extraUrban: '6.4 – 6.9 L/100 km GPL (~14.5 – 15.6 km/L)',
        mixed: '7.1 – 7.6 L/100 km GPL (~13.1 – 14.1 km/L)',
        tankCapacity: '31 litri effettivi GPL + 35 litri Benzina',
        range: 'oltre 1.050 km combinando entrambi i serbatoi (~420 km solo a GPL)',
        fullCost: 'circa 22 € per un pieno di GPL (a ~0,72 €/L)',
        costPer100Km: 'solo 5,10 € – 5,50 € a GPL',
        notes: 'Costo chilometrico tra i più bassi sul mercato. Il motore 1.2 Fire ha sedi valvole rinforzate per il gas.',
      };
    }
    if (fl.includes('elettric') || md.includes('500e')) {
      return {
        fuelLabel: 'Elettrica (500e)',
        urban: '12.8 – 14.2 kWh/100 km (~7.0 – 7.8 km/kWh)',
        extraUrban: '15.5 – 17.5 kWh/100 km (~5.7 – 6.4 km/kWh)',
        mixed: '14.0 – 15.2 kWh/100 km (~6.5 – 7.1 km/kWh)',
        tankCapacity: 'Batteria 42 kWh (37.3 kWh utilizzabili)',
        range: '260 – 310 km reali (fino a 400 km in ciclo esclusivamente urbano)',
        fullCost: 'circa 9 € – 11 € ricaricando a casa (a ~0,25 €/kWh)',
        costPer100Km: 'circa 3,50 € – 3,80 € da presa domestica',
        notes: 'Consumo eccellente in città grazie alla frenata rigenerativa one-pedal.',
      };
    }
    // Benzina Fire standard 1.2 69 CV
    return {
      fuelLabel: 'Benzina 1.2 Fire 69 CV',
      urban: '6.9 – 7.6 L/100 km (~13.1 – 14.5 km/L)',
      extraUrban: '4.7 – 5.2 L/100 km (~19.2 – 21.2 km/L)',
      mixed: '5.6 – 6.2 L/100 km (~16.1 – 17.8 km/L)',
      tankCapacity: '35 litri',
      range: 'circa 560 – 625 km con un pieno',
      fullCost: 'circa 62 € (con benzina a ~1,78 €/L)',
      costPer100Km: 'circa 9,90 € – 11,00 €',
      notes: 'Il 4 cilindri 1.2 Fire 8 valvole è un motore storico, affidabilissimo e con costi di ricambio irrisori. In città risente del traffico intenso ma in statale supera tranquillamente i 19 km/L con guida fluida.',
    };
  }

  // 2. Alfa Romeo MiTo / Giulietta
  if (mk.includes('alfa') || md.includes('mito') || md.includes('giulietta')) {
    if (fl.includes('diesel') || ver.includes('jtd') || disp.includes('1.6') || disp.includes('1.3')) {
      return {
        fuelLabel: 'Diesel JTDm-2',
        urban: '5.6 – 6.3 L/100 km (~15.8 – 17.8 km/L)',
        extraUrban: '4.2 – 4.7 L/100 km (~21.2 – 23.8 km/L)',
        mixed: '4.8 – 5.4 L/100 km (~18.5 – 20.8 km/L)',
        tankCapacity: '45 litri (MiTo) / 60 litri (Giulietta)',
        range: 'circa 830 – 940 km con un pieno',
        fullCost: 'circa 75 € (45 L a ~1,68 €/L)',
        costPer100Km: 'circa 8,00 € – 9,00 €',
        notes: 'Coppia generosa ai bassi regimi. In modalità Dynamic la risposta dell\'acceleratore è più pronta e consuma leggermente di più.',
      };
    }
    // Benzina MultiAir o T-Jet
    return {
      fuelLabel: 'Benzina Turbo MultiAir / T-Jet',
      urban: '8.4 – 9.2 L/100 km (~10.8 – 11.9 km/L)',
      extraUrban: '5.6 – 6.2 L/100 km (~16.1 – 17.8 km/L)',
      mixed: '6.7 – 7.4 L/100 km (~13.5 – 14.9 km/L)',
      tankCapacity: '45 litri',
      range: 'circa 600 – 670 km con un pieno',
      fullCost: 'circa 80 € (con benzina a ~1,78 €/L)',
      costPer100Km: 'circa 11,90 € – 13,20 €',
      notes: 'Motore brillante e divertente. In modalità Normal o All-Weather la centralina taglia la coppia migliorando i consumi fino all\'8%.',
    };
  }

  // 3. Fiat Panda / Lancia Ypsilon
  if (md.includes('panda') || md.includes('ypsilon')) {
    if (fl.includes('ibrid') || ver.includes('hybrid')) {
      return {
        fuelLabel: '1.0 FireFly Mild Hybrid',
        urban: '5.2 – 5.7 L/100 km (~17.5 – 19.2 km/L)',
        extraUrban: '4.2 – 4.6 L/100 km (~21.7 – 23.8 km/L)',
        mixed: '4.7 – 5.1 L/100 km (~19.6 – 21.2 km/L)',
        tankCapacity: '38 litri',
        range: 'circa 740 – 800 km con un pieno',
        fullCost: 'circa 67 € (a 1,78 €/L)',
        costPer100Km: 'circa 8,30 € – 9,10 €',
        notes: 'Ottima efficienza urbana con start&stop dolce e veleggiamento.',
      };
    }
    if (fl.includes('metan') || ver.includes('natural power')) {
      return {
        fuelLabel: 'Natural Power a Metano',
        urban: '5.0 – 5.4 kg/100 km (~18.5 – 20 km/kg)',
        extraUrban: '3.6 – 4.0 kg/100 km (~25 – 27.7 km/kg)',
        mixed: '4.1 – 4.5 kg/100 km (~22.2 – 24.4 km/kg)',
        tankCapacity: '12 kg Metano + 35 L Benzina',
        range: 'circa 270 – 300 km a metano (+ oltre 500 km a benzina)',
        fullCost: 'circa 15 € – 17 € per un pieno di metano',
        costPer100Km: 'solo 4,90 € – 5,50 € a metano',
        notes: 'Costo chilometrico record, esente o ridotto dal bollo in molte regioni.',
      };
    }
    return {
      fuelLabel: 'Benzina 1.2 Fire',
      urban: '6.7 – 7.3 L/100 km (~13.7 – 14.9 km/L)',
      extraUrban: '4.6 – 5.1 L/100 km (~19.6 – 21.7 km/L)',
      mixed: '5.5 – 6.0 L/100 km (~16.6 – 18.2 km/L)',
      tankCapacity: '38 litri',
      range: 'circa 630 – 690 km con un pieno',
      fullCost: 'circa 67 € (a 1,78 €/L)',
      costPer100Km: 'circa 9,80 € – 10,70 €',
      notes: 'Collaudatissimo e affidabile.',
    };
  }

  // 4. Gruppo VW (Golf, Polo, A3, Ibiza, Leon)
  if (mk.includes('volkswagen') || mk.includes('vw') || mk.includes('audi') || mk.includes('seat') || mk.includes('skoda')) {
    if (fl.includes('diesel') || ver.includes('tdi')) {
      return {
        fuelLabel: 'Diesel TDI Common Rail',
        urban: '5.2 – 5.9 L/100 km (~16.9 – 19.2 km/L)',
        extraUrban: '4.0 – 4.5 L/100 km (~22.2 – 25.0 km/L)',
        mixed: '4.5 – 5.1 L/100 km (~19.6 – 22.2 km/L)',
        tankCapacity: '50 litri',
        range: 'circa 980 – 1.100 km con un pieno',
        fullCost: 'circa 84 € (con gasolio a ~1,68 €/L)',
        costPer100Km: 'circa 7,50 € – 8,50 €',
        notes: 'Regina delle lunghe percorrenze autostradali. Con andatura costante a 110-120 km/h consuma pochissimo.',
      };
    }
    return {
      fuelLabel: 'Benzina TSI Turbo',
      urban: '6.8 – 7.5 L/100 km (~13.3 – 14.7 km/L)',
      extraUrban: '4.7 – 5.3 L/100 km (~18.8 – 21.2 km/L)',
      mixed: '5.6 – 6.3 L/100 km (~15.8 – 17.8 km/L)',
      tankCapacity: '50 litri',
      range: 'circa 790 – 890 km con un pieno',
      fullCost: 'circa 89 € (con benzina a ~1,78 €/L)',
      costPer100Km: 'circa 9,90 € – 11,20 €',
      notes: 'Grazie all\'iniezione diretta e al turbo a geometria variabile eroga coppia già a 1.500 giri evitando scalate continue.',
    };
  }

  // 5. Fallback generici in base all'alimentazione
  if (fl.includes('diesel') || fl.includes('gasolio')) {
    return {
      fuelLabel: 'Diesel Turbocompresso',
      urban: '5.8 – 6.7 L/100 km (~14.9 – 17.2 km/L)',
      extraUrban: '4.4 – 5.0 L/100 km (~20.0 – 22.7 km/L)',
      mixed: '5.0 – 5.6 L/100 km (~17.8 – 20.0 km/L)',
      tankCapacity: 'circa 45 – 55 litri',
      range: 'circa 800 – 1.000 km con un pieno',
      fullCost: 'circa 75 € – 90 €',
      costPer100Km: 'circa 8,40 € – 9,40 €',
      notes: 'Massima resa chilometrica extraurbana.',
    };
  }

  if (fl.includes('ibrid') || fl.includes('hybrid')) {
    return {
      fuelLabel: 'Ibrida (Benzina + Elettrico)',
      urban: '4.4 – 5.1 L/100 km (~19.6 – 22.7 km/L)',
      extraUrban: '4.8 – 5.5 L/100 km (~18.2 – 20.8 km/L)',
      mixed: '4.6 – 5.2 L/100 km (~19.2 – 21.7 km/L)',
      tankCapacity: 'circa 40 litri',
      range: 'circa 750 – 850 km con un pieno',
      fullCost: 'circa 70 €',
      costPer100Km: 'circa 8,20 € – 9,20 €',
      notes: 'Consumi minimi soprattutto in città e nel traffico stop&go.',
    };
  }

  if (fl.includes('gpl')) {
    return {
      fuelLabel: 'Bi-fuel Benzina / GPL',
      urban: '8.5 – 9.5 L/100 km a GPL (~10.5 – 11.7 km/L)',
      extraUrban: '6.8 – 7.6 L/100 km a GPL (~13.1 – 14.7 km/L)',
      mixed: '7.5 – 8.3 L/100 km a GPL (~12.0 – 13.3 km/L)',
      tankCapacity: 'circa 35 – 45 L serbatoio GPL',
      range: 'circa 400 – 500 km a GPL (+ autonomia serbatoio benzina)',
      fullCost: 'circa 25 € – 32 € per il pieno di GPL',
      costPer100Km: 'circa 5,40 € – 6,00 € a GPL',
      notes: 'Risparmio sul costo carburante fino al 50% rispetto alla benzina.',
    };
  }

  if (fl.includes('elettric')) {
    return {
      fuelLabel: 'Elettrica 100%',
      urban: '13 – 15 kWh/100 km',
      extraUrban: '16 – 19 kWh/100 km',
      mixed: '14.5 – 16.5 kWh/100 km',
      tankCapacity: 'Batteria di trazione agli ioni di litio',
      range: 'circa 280 – 380 km reali',
      fullCost: 'circa 10 € – 15 € ricaricando da casa',
      costPer100Km: 'circa 3,60 € – 4,50 € domestico',
      notes: 'Zero emissioni locali ed esenzione bollo per i primi 5 anni.',
    };
  }

  // Default Benzina generica
  return {
    fuelLabel: 'Benzina',
    urban: '7.2 – 8.2 L/100 km (~12.2 – 13.8 km/L)',
    extraUrban: '5.0 – 5.7 L/100 km (~17.5 – 20.0 km/L)',
    mixed: '6.0 – 6.8 L/100 km (~14.7 – 16.6 km/L)',
    tankCapacity: 'circa 40 – 48 litri',
    range: 'circa 600 – 720 km con un pieno',
    fullCost: 'circa 70 € – 85 € (a 1,78 €/L)',
    costPer100Km: 'circa 10,70 € – 12,10 €',
    notes: 'In città i consumi aumentano per le continue ripartenze; in autostrada a 110-130 km/h la resa chilometrica è molto equilibrata.',
  };
}

/**
 * Helper per indicazioni specifiche sull'olio motore.
 */
function getVehicleOilDetails(make: string, model: string, fuel: string, year: number) {
  const mk = make.toLowerCase();
  const md = model.toLowerCase();
  const fl = fuel.toLowerCase();

  if (mk.includes('fiat') || mk.includes('alfa') || mk.includes('lancia')) {
    if (fl.includes('ibrid') || year >= 2020) {
      return {
        grade: '0W-20',
        spec: 'Fiat 9.55535-DM1 / ACEA C5 (es. Selenia Eco2 o Motul 8100 Eco-clean)',
        capacity: 'circa 3.0 – 3.2 litri (compreso filtro)',
        interval: 'ogni 15.000 km o 1 anno',
      };
    }
    if (fl.includes('diesel')) {
      return {
        grade: '5W-30 o 0W-30',
        spec: 'Fiat 9.55535-DS1 / ACEA C2 per motori con filtro DPF (es. Selenia WR Forward)',
        capacity: 'circa 3.2 – 4.2 litri',
        interval: 'ogni 15.000 – 20.000 km o 1 anno',
      };
    }
    // Benzina Fire standard
    return {
      grade: '5W-40',
      spec: 'Fiat 9.55535-S2 / ACEA C3 sintetico 100% (es. Selenia K Pure Energy o Castrol EDGE)',
      capacity: 'circa 2.8 – 3.0 litri (con sostituzione filtro)',
      interval: 'ogni 15.000 km o entro 12 mesi',
    };
  }

  if (mk.includes('volkswagen') || mk.includes('vw') || mk.includes('audi') || mk.includes('seat')) {
    return {
      grade: fl.includes('diesel') ? '5W-30' : (year >= 2019 ? '0W-20' : '5W-30'),
      spec: fl.includes('diesel') ? 'VW 504.00 / 507.00 LongLife' : 'VW 508.00 / 509.00 (oppure 504.00)',
      capacity: 'circa 4.0 – 4.8 litri',
      interval: 'ogni 15.000 – 30.000 km (in base a programma fisso o variabile)',
    };
  }

  return {
    grade: fl.includes('diesel') ? '5W-30 ACEA C3' : (year >= 2018 ? '0W-20 o 5W-30' : '5W-40 sintetico'),
    spec: 'Conforme alle specifiche del costruttore riportate sul libretto di uso e manutenzione',
    capacity: 'circa 3.5 – 4.5 litri',
    interval: 'ogni 15.000 km o 12 mesi',
  };
}

/**
 * Motore AI Conversazionale di AutoEsperto (AutoEsperto Assistente AI)
 * Risponde con competenza meccanica, zero risposte circolari o saluti fuori luogo.
 */
export function generatePassportLocalAI(
  question: string,
  passport: VehiclePassportData,
  history: PassportChatMessage[] = []
): PassportChatMessage {
  const qLower = question.toLowerCase().trim();
  const v = passport.vehicle;
  const makeModel = `${v.make} ${v.model}`.trim();
  const currentKm = passport.currentKm || 0;
  const fuelType = (v.fuel || 'benzina').toLowerCase();
  const year = v.year || 2018;

  const lastAiMsg = [...history].reverse().find((m) => m.role === 'assistant')?.content.toLowerCase() || '';

  let metadata: PassportChatMessage['metadata'] = undefined;
  let reply = '';

  // ── 0. GESTIONE RISPOSTE SPECIFICHE AL CONTESTO (Cronologia messaggi) ──
  if (lastAiMsg.includes('fren') || lastAiMsg.includes('pastigli') || lastAiMsg.includes('fisch')) {
    if (/fisch|rumor|strid|metall/i.test(qLower)) {
      reply = `Se senti un fischio acuto o metallico sulla tua **${makeModel}**, significa che il ferodo della pastiglia si è consumato fino alla linguetta di contatto acustica o che la mescola si è vetrificata per il calore.

Ti consiglio di farle verificare al più presto: se il supporto metallico tocca il disco, rischi di rigarlo irrimediabilmente, raddoppiando la spesa.

Hai notato se il fischio lo fa solo a freddo la mattina o ad ogni singola frenata?`;
      return createAiMessage(reply);
    }
    if (/vibra|pedale|volante|trema/i.test(qLower)) {
      reply = `Se avverti vibrazioni sul pedale del freno o sul volante quando freni da 70-90 km/h, i dischi anteriori sono probabilmente **ovalizzati** per sbalzi termici o usura disomogenea.

In questo caso cambiare solo le pastiglie non risolve il difetto: serve il kit completo di **dischi e pastiglie nuove**. Su ${makeModel} il kit Brembo, Bosch o Ferodo costa circa **95 € – 160 €** di ricambi, oppure circa **180 € – 250 €** compresa la manodopera in officina.

I marchi con migliore resa e bassa rumorosità per questa vettura sono Brembo (serie verniciata anti-ruggine), Ferodo e Textar.`;
      return createAiMessage(reply);
    }
    if (/da solo|fai da te|faccio io|garage/i.test(qLower)) {
      reply = `Sulla tua **${makeModel}** l'operazione richiede circa un'ora.

Dotazione consigliata:
1. Cric sollevatore e cavalletto di stazionamento in sicurezza
2. Chiave bulloni ruota e chiave specifica per le guide della pinza
3. Arretratore per spingere indietro il pistoncino della pinza
4. Sgrassatore per dischi freni e pasta anti-fischio ceramica o al rame

Nota di sicurezza: prima di arretrare il pistoncino allenta il tappo della vaschetta del liquido freni nel cofano, e a fine montaggio dai 3-4 pompate a vuoto sul pedale a motore spento prima di muovere la vettura.`;
      return createAiMessage(reply);
    }
    if (/meccanic|officin|cost.*manodoper|preventiv/i.test(qLower)) {
      reply = `Dal meccanico per la sola sostituzione pastiglie anteriori su **${makeModel}** la manodopera media è di circa **35 € – 60 €** (circa 45-60 minuti di lavoro).

In totale (pastiglie di qualità + manodopera) la spesa si aggira sui **90 € – 130 €**. Se si sostituiscono anche i dischi freno, il totale finito è di circa **180 € – 270 €**.`;
      return createAiMessage(reply);
    }
  }

  // ── 1. CONSUMI & EFFICIENZA CARBURANTE ──
  if (
    /co[n]?sum|litr|km\/l|quanti km fa|quanto fa con un litro|costo carburante|pieno|autonomia|serbatoio|l\/100|quanto beve/i.test(
      qLower
    )
  ) {
    const cd = getVehicleConsumptionDetails(v.make, v.model, v.fuel || 'benzina', year, v.version, v.displacement);

    reply = `I consumi reali rilevati su strada per la tua **${makeModel}** (${year}, ${cd.fuelLabel}):

- **Urbano (città e traffico):** ${cd.urban}
- **Extraurbano (statale a 90-110 km/h):** ${cd.extraUrban}
- **Misto medio:** ${cd.mixed}

**Autonomia e spesa carburante:**
Con il serbatoio da ${cd.tankCapacity}, l'autonomia media è di ${cd.range}.
Un pieno completo costa indicativamente ${cd.fullCost}, con una spesa di ${cd.costPer100Km}.

**Nota tecnica:**
${cd.notes}`;
    return createAiMessage(reply);
  }

  // ── 2. VALUTAZIONE COMMERCIALE & VENDITA ──
  else if (
    /quanto vale|valutazion|quotazion|prezzo|vendere|quanto posso venderla|a quanto la vendo|conviene vendere|svalutazion|valore di mercato|prezzo di vendita/i.test(
      qLower
    )
  ) {
    let estVal = passport.estimatedValue || 0;
    if (!estVal) {
      const era = findModelEra(v.make, v.model);
      const base = era?.basePrice || 21000;
      const age = Math.max(0, new Date().getFullYear() - year);
      const depFactors = [0.94, 0.82, 0.73, 0.65, 0.58, 0.52, 0.46, 0.41, 0.37, 0.33, 0.29, 0.25, 0.21, 0.17, 0.14, 0.12, 0.10, 0.09, 0.08, 0.07];
      const dep = age < depFactors.length ? depFactors[age] : Math.max(0.05, 0.07 - (age - 19) * 0.003);
      const kmDelta = currentKm - (age * 15000);
      const kmFactor = Math.max(0.65, Math.min(1.15, 1 - (kmDelta * 0.0000022)));
      estVal = Math.max(1400, Math.round((base * dep * kmFactor) / 100) * 100);
    }
    const estValMax = passport.estimatedValueMax || Math.round(estVal * 1.10);
    const recSell = passport.recommendedSellPrice || Math.round(estVal * 1.04);
    const buyerAttractive = passport.attractiveBuyerPrice || Math.round(estVal * 0.93);
    const tradeIn = Math.round(estVal * 0.81);

    reply = `**Valutazione di mercato per ${makeModel}** (${year}, ${currentKm.toLocaleString('it-IT')} km)

In base ai dati tecnici e all'Health Score di ${passport.healthScore}/100:
• Vendita tra privati: ${recSell.toLocaleString('it-IT')} € – ${estValMax.toLocaleString('it-IT')} €
• Vendita rapida (1-2 settimane): circa ${buyerAttractive.toLocaleString('it-IT')} €
• Ritiro / Permuta in concessionaria: circa ${tradeIn.toLocaleString('it-IT')} € – ${Math.round(estVal * 0.88).toLocaleString('it-IT')} €

La documentazione completa dei tagliandi e dei chilometri nel profilo può farti recuperare tra 500 € e 1.000 € in più in fase di trattativa rispetto alla media del mercato.`;
    return createAiMessage(reply);
  }

  // ── 3. AFFIDABILITÀ, PREGI E DIFETTI NOTI ──
  else if (
    /affidabil|difett|problem|guast|pregi|punti deboli|criticit|rottur|è affidabile|come va questa macchina|conviene comprarla/i.test(
      qLower
    )
  ) {
    const isFiat500 = v.make.toLowerCase().includes('fiat') && v.model.toLowerCase().includes('500');
    const isMito = v.model.toLowerCase().includes('mito');

    if (isFiat500) {
      reply = `**Affidabilità e difetti noti — Fiat 500 (${year})**

La Fiat 500 ha una meccanica collaudata con costi di manutenzione molto contenuti.

**Punti di forza:**
- Motori affidabili (sia il 1.2 Fire che il 1.0 FireFly Hybrid hanno bassissima incidenza di guasti gravi se i cambi d'olio sono regolari).
- Ricambi reperibili ovunque a prezzi contenuti.
- Ottima tenuta del valore nel tempo.

**Aspetti da controllare periodicamente:**
- **Servosterzo elettrico Dualdrive:** sui modelli con più anni il sensore di coppia del piantone sterzo può dare anomalie.
- **Frizione nel traffico urbano:** frequenti partenze in salita e code possono usurare il disco verso gli 80.000 – 110.000 km.
- **Boccole e silent block ponte posteriore:** sulle buche possono iniziare a cigolare con l'invecchiamento della gomma.
- **Maniglie esterne:** lo snodo è delicato se tirato con forza eccessiva.`;
      return createAiMessage(reply);
    }

    if (isMito) {
      reply = `**Affidabilità e difetti noti — Alfa Romeo MiTo (${year})**

Vettura con assetto reattivo e buona dinamica, che richiede cura nella manutenzione ordinaria.

**Punti di forza:**
- Telaio preciso con selettore Alfa DNA.
- Motori diesel JTDm molto robusti e duraturi.
- Linea e interni ancora apprezzati.

**Aspetti da verificare:**
- **Versioni benzina MultiAir:** è indispensabile cambiare l'olio motore ogni 15.000 km con la specifica esatta per preservare il modulo idraulico MultiAir.
- **Sterzo:** verifica del servosterzo elettrico e della scatola guida.
- **Avantreno:** supporti motore e biellette dei braccetti anteriori soggetti a rumorosità sui dossi.`;
      return createAiMessage(reply);
    }

    reply = `**Affidabilità e storico tecnico per ${makeModel} (${year})**

In base ai dati tecnici e al chilometraggio di ${currentKm.toLocaleString('it-IT')} km (Health Score: ${passport.healthScore}/100):

**Punti di forza:**
- Meccanica equilibrata e adatta all'uso quotidiano.
- Ricambi ampiamente disponibili sia originali che compatibili garantiti.
- Buona efficienza complessiva.

**Aspetti da controllare a questo chilometraggio:**
- Stato di usura di dischi e pastiglie freni.
- Batteria e boccole sospensioni anteriori.
- Rispetto rigoroso dei cambi olio e filtri per proteggere motore e turbocompressore.`;
    return createAiMessage(reply);
  }

  // ── 4. SPECIFICHE OLIO MOTORE & LIQUIDI ──
  else if (
    /olio|gradazione|lubrificante|5w30|5w40|0w20|0w30|quanti litri d'olio|specifica olio|selenia|castrol|liquido refrigerante/i.test(
      qLower
    )
  ) {
    const oil = getVehicleOilDetails(v.make, v.model, v.fuel || 'benzina', year);

    reply = `**Specifiche olio motore per ${makeModel}** (${year}, ${v.fuel || 'benzina'})

- **Gradazione viscosimetrica:** ${oil.grade}
- **Specifica costruttore / Norma:** ${oil.spec}
- **Capacità coppa motore con filtro:** ${oil.capacity}
- **Intervallo consigliato:** ${oil.interval}

**Consigli pratici:**
- Sostituisci sempre anche il filtro olio a ogni cambio per non contaminare l'olio nuovo.
- Controlla il livello dall'astina a motore spento e freddo su terreno pianeggiante (il livello corretto è a circa 3/4 tra MIN e MAX).`;
    return createAiMessage(reply);
  }

  // ── 5. FRENI E PASTIGLIE ──
  else if (/fren|pastigli|disch|pinz/i.test(qLower)) {
    const partCost = '35 € – 75 € (Brembo / Ferodo / Bosch / Textar)';
    const fullKitCost = '95 € – 170 € (Dischi + Pastiglie)';
    const laborCost = '40 € – 80 € (circa 1 ora)';
    const totalMech = '85 € – 140 € (solo pastiglie) / 180 € – 270 € (dischi+pastiglie)';

    metadata = {
      repairEstimate: {
        partCost,
        laborCost,
        materialsCost: '15 € – 25 € (detergente + sensore usura)',
        totalCost: totalMech,
        estimatedHours: '1–1.5 ore',
      },
    };

    reply = `**Sostituzione freni per ${makeModel}** (${year}, ${currentKm.toLocaleString('it-IT')} km)

Stime medie di mercato:
- **Solo pastiglie anteriori (fai-da-te):** circa ${partCost}
- **Dischi e pastiglie anteriori (solo ricambi):** circa ${fullKitCost}
- **In officina (ricambi + manodopera):** ${totalMech}

Sostituisci le pastiglie quando lo spessore residuo del materiale scende sotto i 3 mm, o in caso di fischi metallici continui in frenata.`;
    return createAiMessage(reply, metadata);
  }

  // ── 6. SPIE DEL CRUSCOTTO & DIAGNOSI OBD ──
  else if (/spia|avaria|check engine|anomalia|errore|obd|spie/i.test(qLower)) {
    const isRed = /ross|olio|pressione|temperatura|stop/i.test(qLower);
    const isDpf = /dpf|fap|filtro particolato/i.test(qLower);

    if (isRed) {
      reply = `**Spia rossa su ${makeModel} — Intervento immediato**

1. Accosta in sicurezza appena possibile e spegni il motore.
2. Non proseguire la marcia: le spie rosse (pressione olio, temperatura liquido di raffreddamento, impianto frenante) indicano un rischio concreto per la sicurezza o l'integrità del motore.
3. A motore freddo, controlla il livello dell'olio e del liquido radiatore.`;
    } else if (isDpf) {
      reply = `**Spia DPF / FAP su ${makeModel}**

Indica che il filtro antiparticolato non riesce a completare la rigenerazione automatica, spesso a causa di tragitti brevi o frequente traffico cittadino.

**Cosa fare:**
- Percorri 20-25 minuti a velocità costante in tangenziale o autostrada a circa 2.500-3.000 giri/min per innescare la pulizia automatica.
- Se la spia resta accesa o l'auto entra in protezione (potenza ridotta), serve una rigenerazione forzata via diagnosi OBD in officina (costo: 40 € – 80 €).`;
    } else {
      reply = `**Spia gialla / avaria motore su ${makeModel}** (${currentKm.toLocaleString('it-IT')} km)

Segnala un'anomalia registrata dalla centralina tramite i sensori di bordo. Le cause più frequenti sono:
- Sonda lambda o debimetro con lettura non conforme
- Valvola EGR o condotti intasati da residui carboniosi
- Bobine, candele o candelette di preriscaldo
- Sensore di pressione (MAP)

Con una rapida lettura codici OBD2 (in officina costa circa 20-30 €) puoi risalire subito al codice errore esatto (es. P0300, P0420) e individuare il componente interessato.`;
    }
    return createAiMessage(reply);
  }

  // ── 7. TAGLIANDO E MANUTENZIONE PROGRAMMATA ──
  else if (/tagliand|cambio olio|manutenzion|filtri/i.test(qLower)) {
    const nextTarget = passport.nextServiceKm || (Math.ceil((currentKm + 1) / 15000) * 15000);
    const diff = Math.max(0, nextTarget - currentKm);
    const lastDoc = (passport.documents || []).find((d) => d.category === 'manutenzione');

    reply = `**Manutenzione programmata per ${makeModel}** (${year}, ${currentKm.toLocaleString('it-IT')} km)

- **Chilometraggio attuale:** ${currentKm.toLocaleString('it-IT')} km
- **Prossimo tagliando previsto:** a circa ${nextTarget.toLocaleString('it-IT')} km (mancano circa ${diff.toLocaleString('it-IT')} km o entro 12 mesi)
${lastDoc ? `- **Ultimo tagliando registrato:** ${lastDoc.eventDate || 'Recente'} a ${lastDoc.km ? `${lastDoc.km.toLocaleString('it-IT')} km` : 'N/D'}` : '- Nessun tagliando ancora registrato nel profilo.'}

**Costi medi per tagliando completo (olio + 4 filtri):**
- **Fai-da-te (solo ricambi di marca):** 75 € – 120 €
- **In officina indipendente:** 160 € – 260 € tutto compreso`;
    return createAiMessage(reply);
  }

  // ── 8. DISTRIBUZIONE, CINGHIA O CATENA ──
  else if (/(distribuzion|pompa acqua|cinghi(?!.*servizi)|\bcatena\b(?!\s+(da\s+)?neve))/i.test(qLower)) {
    const isChain = /catena/i.test(qLower) || (v.make.toLowerCase() === 'bmw' && !/147|fiat/i.test(makeModel.toLowerCase()));

    if (isChain) {
      reply = `**Distribuzione a catena per ${makeModel}**

La distribuzione è a catena ed è progettata per durare a lungo senza scadenze brevi fisse, purché i cambi d'olio siano rigorosamente regolari per non usurare i tendicatena idraulici.

Se all'avviamento a freddo nei primi secondi senti un tintinnio metallico continuo, fai verificare il tenditore idraulico. L'eventuale sostituzione del kit catena completo richiede molta manodopera e costa circa 750 € – 1.300 €.`;
    } else {
      reply = `**Cinghia di distribuzione per ${makeModel}**

La cinghia dentata è un componente critico: la rottura in marcia provoca danni gravi alle valvole e ai pistoni.

- **Intervallo consigliato:** ogni 5-6 anni oppure ogni 80.000 – 100.000 km.
- **Costi indicativi (kit cinghia + tenditori + pompa acqua + refrigerante):**
  - Solo ricambi di marca (Gates, Dayco, SKF, Continental): 110 € – 200 €
  - Lavoro completo finito in officina: 380 € – 580 €`;
    }
    return createAiMessage(reply);
  }

  // ── 9. FRIZIONE E TRASMISSIONE ──
  else if (/frizion|volano|marce non entrano|pedale duro|slitta/i.test(qLower)) {
    reply = `**Frizione e trasmissione per ${makeModel}** (${fuelType})

I sintomi tipici di frizione consumata sono il pedale duro, lo stacco a fine corsa o il motore che sale di giri a vuoto accelerando in 3ª o 4ª marcia (slittamento).

**Stima costi:**
- **Kit frizione standard (disco + spingidisco + cuscinetto):** 130 € – 240 € di ricambi
- **Kit frizione con volano bimassa (se diesel o turbo):** 380 € – 650 € di ricambi
- **Manodopera officina (4-6 ore di lavoro):** 250 € – 420 €
- **Totale medio finito:** 420 € – 650 € (frizione standard) / 750 € – 1.150 € (con volano bimassa)`;
    return createAiMessage(reply);
  }

  // ── 10. AMMORTIZZATORI, ASSETTO E BRACCETTI ──
  else if (/ammortizzator|assetto|rumore dossi|braccetti|silent block/i.test(qLower)) {
    reply = `**Sospensioni e assetto per ${makeModel}** (${currentKm.toLocaleString('it-IT')} km)

Sintomi comuni di usura a questo chilometraggio:
- Rumori sordi o cigolii su dossi e asfalto sconnesso (biellette della barra stabilizzatrice o boccole in gomma dei braccetti)
- Oscillazioni o beccheggio accentuato in frenata

**Costi indicativi:**
- Coppia ammortizzatori anteriori: 110 € – 220 € (ricambi) / 240 € – 380 € montati con convergenza
- Biellette barra stabilizzatrice: 35 € – 70 € la coppia`;
    return createAiMessage(reply);
  }

  // ── 11. BATTERIA & AVVIAMENTO ──
  else if (/batteri|avviamento|non parte|alternatore/i.test(qLower)) {
    reply = `**Batteria per ${makeModel}** (${year})

La durata media è di 3-5 anni (2-4 anni per le batterie AGM o EFB con sistema Start&Stop).

**Costi di sostituzione:**
- Batteria standard 50-60 Ah: 65 € – 105 €
- Batteria Start&Stop AGM/EFB: 120 € – 190 €
- La sostituzione autonoma è semplice con chiave da 10 mm (scollegare prima il polo negativo nero, poi il positivo rosso).`;
    return createAiMessage(reply);
  }

  // ── 12. PNEUMATICI, BATTISTRADA E PRESSIONE GOMME ──
  else if (/gomm|pneumatic|battistrada|invernal|estiv|4 stagion|pression|catene/i.test(qLower)) {
    const isPressure = /pression|bar|gonfi/i.test(qLower);
    const isChains = /catene/i.test(qLower);

    if (isChains) {
      reply = `**Catene da neve e calze per ${makeModel}**

La catenabilità dipende dalla misura del cerchio montato:
- **Cerchi da 14 o 15 pollici:** compatibili con normali catene da 9 mm.
- **Cerchi da 16 o 17 pollici:** lo spazio tra gomma e sospensione è ridotto. Servono catene a ingombro ridotto da 7 mm oppure calze da neve omologate (norma EN 16662-1).`;
      return createAiMessage(reply);
    }

    if (isPressure) {
      reply = `**Pressione pneumatici consigliata per ${makeModel}** (a freddo)

- **Anteriore:** 2,2 – 2,3 bar
- **Posteriore:** 2,1 – 2,2 bar (a pieno carico o per lunghi viaggi autostradali: 2,3 – 2,4 bar)
- **Ruotino di scorta:** 2,8 – 4,2 bar (controlla il valore stampato sulla spalla)

Consiglio: controlla la pressione una volta al mese. Anche solo 0,4 bar in meno aumentano i consumi fino al 3-5% e provocano usura anomala sui bordi del battistrada.`;
      return createAiMessage(reply);
    }

    reply = `**Pneumatici per ${makeModel}**

La profondità minima del battistrada per legge è 1,6 mm; sotto i 3 mm le prestazioni su asfalto bagnato calano sensibilmente.

**Prezzi indicativi per treno da 4 gomme (con montaggio ed equilibratura):**
- Fascia economica affidabile: 180 € – 260 €
- Fascia media consigliata (Hankook, Kumho, Kleber): 260 € – 360 €
- Fascia premium (Michelin, Continental, Pirelli, Goodyear): 360 € – 520 €`;
    return createAiMessage(reply);
  }

  // ── 13. REVISIONE E BOLLO AUTO ──
  else if (/revision|bollo|scadenza|superbollo|tassa/i.test(qLower)) {
    const isBollo = /bollo|superbollo|tassa/i.test(qLower);

    if (isBollo) {
      reply = `**Bollo auto per ${makeModel}** (${year}, ${v.power || 'potenza a libretto'})

La tassa automobilistica regionale si calcola sui chilowatt (kW) indicati al punto (P.2) del libretto:
- Fino a 100 kW: la tariffa base è di circa 2,58 € per kW (con addizionali regionali varia tra 2,80 € e 3,50 € per kW).
- Per potenze intorno a 51 kW (69 CV come Fiat 500 1.2), l'importo annuo è compreso tra 150 € e 185 € a seconda della regione.
- Le versioni ibride ed elettriche beneficiano in molte regioni di esenzioni totali pluriennali o forti riduzioni.`;
      return createAiMessage(reply);
    }

    if (passport.revisionExpiry) {
      const exp = new Date(passport.revisionExpiry);
      reply = `**Revisione ministeriale per ${makeModel}**

Scadenza registrata: **${exp.toLocaleDateString('it-IT')}**.
La tariffa ministeriale fissa presso tutti i centri autorizzati è di **79,02 €**.

Prima della prova, controlla il funzionamento di tutte le luci (compresi stop e targa), tergicristalli, avvisatore acustico e cinture di sicurezza.`;
    } else {
      reply = `**Revisione ministeriale per ${makeModel}** (${year})

La revisione va effettuata 4 anni dopo la prima immatricolazione e successivamente ogni 2 anni, entro la fine del mese di rilascio. La tariffa fissa ministeriale è di 79,02 €.`;
    }
    return createAiMessage(reply);
  }

  // ── 14. RUMORI, VIBRAZIONI E ANOMALIE MECCANICHE ──
  else if (/rumor|vibra|cigol|cloc|toc|sferragli|battit|strapp|fumo|odore/i.test(qLower)) {
    reply = `**Diagnosi rumori e vibrazioni per ${makeModel}**

Cause più frequenti in base alla situazione:
1. **Su dossi o buche ("cloc-cloc"):** biellette della barra stabilizzatrice o silent block dei braccetti anteriori.
2. **In frenata da 80-100 km/h:** dischi freno ovalizzati o con usura non uniforme.
3. **In accelerazione tra 70 e 90 km/h:** tripode o crociera del semiasse con gioco eccessivo.
4. **Fischio a freddo all'accensione:** cinghia servizi (alternatore/clima) allentata o indurita.
5. **Ticchettio ritmico dal motore:** punterie idrauliche con livello olio basso o usura della distribuzione.`;
    return createAiMessage(reply);
  }

  // ── 15. SALUTO PURO ──
  else if (/^(ciao|salve|buongiorno|buonasera|hey|ehi|ciao autoesperto|aiuto)\b/i.test(qLower) && qLower.length < 25) {
    reply = `Ciao! Sono **AutoEsperto Assistente AI** per la tua **${makeModel}** (${year}, ${currentKm.toLocaleString('it-IT')} km).

Posso darti informazioni chiare su:
- Consumi reali su strada e autonomia
- Valutazione commerciale aggiornata per la vendita
- Specifiche olio motore e manutenzioni
- Affidabilità e difetti noti del modello
- Stime costi di riparazione (freni, frizione, cinghia)
- Spie di bordo e scadenze (bollo e revisione)

Di cosa hai bisogno?`;
    return createAiMessage(reply);
  }

  // ── 16. RISPOSTA TECNICA APERTA ──
  else {
    reply = `Riguardo alla tua richiesta per **${makeModel}** (${year}, ${currentKm.toLocaleString('it-IT')} km, ${fuelType}):

Posso fornirti supporto tecnico su:
- Consumi medi su strada e costi carburante
- Valutazione commerciale e prezzo raccomandato per la vendita
- Preventivi e costi ricambi (tagliando, freni, distribuzione, frizione)
- Specifiche olio motore, pressione pneumatici e controlli pre-revisione

Dimmi pure cosa vuoi approfondire nello specifico.`;
    return createAiMessage(reply);
  }
}

function createAiMessage(
  content: string,
  metadata?: PassportChatMessage['metadata']
): PassportChatMessage {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    role: 'assistant',
    content,
    level: 'advice',
    metadata,
    createdAt: new Date().toISOString(),
  };
}
