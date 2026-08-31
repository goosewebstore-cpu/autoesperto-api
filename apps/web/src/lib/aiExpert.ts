import { askAutoEsperto as apiAskAutoEsperto } from '@/lib/api';

export interface ExpertResponse {
  answer: string;
  source: 'ai' | 'knowledge_base';
  tips?: string[];
  costRange?: string;
}

export function getInstantExpertKnowledge(question: string, vehicle: { make?: string; model?: string; year?: number }): string | null {
  const q = question.toLowerCase();
  const make = vehicle.make || 'auto';
  const model = vehicle.model || '';
  const carName = `${make} ${model}`.trim();

  if (q.includes('riverniciatur') || q.includes('verniciare paraurti') || q.includes('costo paraurti')) {
    return `Per ${carName}, la riverniciatura completa del paraurti in carrozzeria costa mediamente tra **180 € e 350 € + IVA** (compresa sfumatura e montaggio/smontaggio).
    
💡 **Consigli pratici**:
• **Spot Repair (ritocco parziale)**: se il graffio è limitato a un angolo o fascia inferiore, costa **80–130 €** in giornata.
• **Sostituzione completa**: se il paraurti è spaccato o con agganci rotti, un pezzo grezzo compatibile online costa **120–250 €**, più verniciatura.
• **Tempo di fermo veicolo**: 1-2 giorni lavorativi per essiccazione e trasparente.`;
  }

  if (q.includes('freni') || q.includes('pastiglie') || q.includes('dischi')) {
    return `Per ${carName}, la sostituzione delle pastiglie freno anteriori è un'operazione fattibile in fai-da-te se possiedi buona manualità, cavalletti di sicurezza e una chiave dinamometrica.
    
⚠️ **Punti chiave di sicurezza**:
• **Costo pastiglie online**: set anteriore di marca (Brembo, Ferodo, Bosch) costa **28 € – 65 €**.
• **In officina**: manodopera di circa **40–70 €** (30-45 minuti).
• **Attenzione**: se i dischi presentano un gradino superiore a 1,5 mm o rigature profonde, vanno sostituiti in coppia. Lo spurgo del liquido freni (DOT4) va invece eseguito da un professionista.`;
  }

  if (q.includes('faro opacizzato') || q.includes('lucidatura fari') || q.includes('fari ingialliti')) {
    return `I fari in policarbonato di ${carName} tendono ad opacizzarsi per l'azione dei raggi UV e degli agenti atmosferici.
    
✨ **Come ripristinarli con spesa minima**:
• **Kit fai-da-te (Consigliato)**: con un kit di carteggiatura a umido (grana 1000, 2000, 3000), pasta lucidante e **sigillante protettivo anti-UV** (costo **15 € – 25 €** su Amazon o eBay) tornano trasparenti al 95% in 40 minuti.
• **In carrozzeria**: costa **50 € – 90 € per la coppia** con applicazione di trasparente 2K lucido a forno (durata garantita oltre 3 anni).`;
  }

  if (q.includes('carrozziere orario') || q.includes('costo carrozziere') || q.includes('tariffa oraria')) {
    return `In Italia, la tariffa oraria media di un carrozziere qualificato si attesta tra **40 € e 65 €/ora + IVA**, a seconda della zona:
    
📊 **Medie regionali indicative**:
• **Nord Italia**: 48 € – 68 €/ora.
• **Centro Italia**: 42 € – 55 €/ora.
• **Sud e Isole**: 35 € – 48 €/ora.
• **Materiali di consumo e vernice**: vengono conteggiati a parte (mediamente 35–50 € a pannello). Richiedi sempre un preventivo scritto prima di autorizzare i lavori.`;
  }

  if (q.includes('conviene riparare') || q.includes('prima di vendere') || q.includes('vendere cosi')) {
    return `Per ${carName}, la convenienza dipende dall'entità del danno rispetto al valore commerciale dell'auto:
    
🎯 **Regola d'oro di AutoEsperto**:
• **Danni lievi (graffi, fari opachi, piccoli bolli)**: **CONVIENE RIPARARE**. Spendendo 150-250€ eviti che l'acquirente chieda sconti da 500-1.000€ in fase di trattativa.
• **Danni strutturali o pesanti (> 1.500 €)**: spesso conviene vendere l'auto "nello stato in cui si trova" dichiarando tutto con trasparenza e scalando il preventivo ufficiale dal prezzo richiesto.`;
  }

  if (q.includes('graffi') || q.includes('pasta abrasiva') || q.includes('polish') || q.includes('ritocco')) {
    return `Per eliminare graffi superficiali sulla carrozzeria di ${carName}:
    
🔍 **Test dell'unghia**:
• Passa l'unghia sul graffio: se non si incastra e non vedi il fondo bianco/grigio, il danno è solo sul trasparente.
• **Soluzione fai-da-te**: applica pasta abrasiva fine a grana decrescente con un panno in microfibra, poi rifinisci con polish lucidante e cera protettiva (spesa **12 € – 18 €**).
• Se il graffio ha raggiunto la lamiera, serve uno stick di vernice con il codice colore esatto dell'auto per evitare ruggine.`;
  }

  if (q.includes('cinghia') || q.includes('distribuzione') || q.includes('catena')) {
    return `Per ${carName}, la distribuzione è un componente critico per la vita del motore:
    
⚙️ **Intervalli e Costi**:
• **Motori con Cinghia**: sostituzione consigliata ogni **5-6 anni o 100.000 – 150.000 km**. Costo medio kit cinghia + pompa acqua + manodopera: **380 € – 650 €**.
• **Motori con Catena**: dura generalmente oltre 200.000 km, ma va verificata se compaiono rumori metallici di sferragliamento all'avviamento a freddo.`;
  }

  if (q.includes('frizione') || q.includes('volano')) {
    return `La sostituzione del gruppo frizione su ${carName} costa mediamente tra **450 € e 850 €** (disco, spingidisco e cuscinetto reggispinta).
    
Se il veicolo monta un **volano bimassa** (comune sui motori diesel e turbo benzina recenti), il kit completo con volano varia tra **750 € e 1.300 €** compresa manodopera (circa 4-6 ore di lavoro).`;
  }

  return null;
}

export async function askExpertSmart(
  question: string,
  vehicle: { make: string; model: string; year?: number },
  healthScore = 85
): Promise<string> {
  const instant = getInstantExpertKnowledge(question, vehicle);
  if (instant) return instant;

  try {
    const res = await apiAskAutoEsperto(question, { make: vehicle.make, model: vehicle.model }, { score: healthScore, verdict: 'BUY' });
    if (res.answer && !res.answer.includes('undefined') && !res.answer.includes('0€/anno')) {
      return res.answer;
    }
  } catch (err) {
    console.warn('API expert ask fallback:', err);
  }

  return `In merito a "${question}": Per ${vehicle.make} ${vehicle.model} ${vehicle.year || ''}, i costi di riparazione e ricambi variano in base alla marca dei componenti (aftermarket OE come Bosch, Valeo, Brembo vs ricambi originali). Consigliamo di richiedere almeno due preventivi dettagliati e verificare la disponibilità dei pezzi online per risparmiare fino al 40% sul solo costo dei ricambi.`;
}
