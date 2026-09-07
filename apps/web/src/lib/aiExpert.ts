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

**Consigli pratici:**
- **Spot Repair (ritocco parziale):** se il graffio è limitato a un angolo o fascia inferiore, costa circa **80–130 €** in giornata.
- **Sostituzione completa:** se il paraurti è spaccato o con agganci rotti, un pezzo grezzo compatibile costa **120–250 €**, più verniciatura.
- **Tempo di fermo veicolo:** 1-2 giorni lavorativi per essiccazione e trasparente.`;
  }

  if (q.includes('freni') || q.includes('pastiglie') || q.includes('dischi')) {
    return `Per ${carName}, la sostituzione delle pastiglie freno anteriori richiede circa 45 minuti.

**Costi e sicurezza:**
- **Costo pastiglie online:** set anteriore di marca (Brembo, Ferodo, Bosch) costa **28 € – 65 €**.
- **In officina:** manodopera di circa **40–70 €**.
- **Nota:** se i dischi presentano un gradino superiore a 1,5 mm o rigature profonde, vanno sostituiti in coppia con le pastiglie.`;
  }

  if (q.includes('faro opacizzato') || q.includes('lucidatura fari') || q.includes('fari ingialliti')) {
    return `I fari in policarbonato di ${carName} tendono ad opacizzarsi per l'azione dei raggi UV e degli agenti atmosferici.

**Soluzioni:**
- **Kit fai-da-te:** con un kit di carteggiatura a umido (grana 1000, 2000, 3000), pasta lucidante e sigillante protettivo anti-UV (**15 € – 25 €**) tornano trasparenti al 95%.
- **In carrozzeria:** costa circa **50 € – 90 € per la coppia** con applicazione di trasparente 2K lucido a forno (durata oltre 3 anni).`;
  }

  if (q.includes('carrozziere orario') || q.includes('costo carrozziere') || q.includes('tariffa oraria')) {
    return `In Italia la tariffa oraria media di un carrozziere qualificato si attesta tra **40 € e 65 €/ora + IVA**:

**Tariffe indicative per area geografica:**
- **Nord Italia:** 48 € – 68 €/ora
- **Centro Italia:** 42 € – 55 €/ora
- **Sud e Isole:** 35 € – 48 €/ora
- **Materiali di consumo e vernice:** conteggiati a parte (mediamente 35–50 € a pannello). Richiedi sempre un preventivo scritto.`;
  }

  if (q.includes('conviene riparare') || q.includes('prima di vendere') || q.includes('vendere cosi')) {
    return `Per ${carName}, la convenienza dipende dall'entità del danno rispetto al valore commerciale dell'auto:

**Valutazione costi/benefici:**
- **Danni lievi (graffi, fari opachi, piccoli bolli):** conviene riparare. Con una spesa di 150-250 € eviti svalutazioni da 500-1.000 € in fase di trattativa.
- **Danni strutturali o pesanti (> 1.500 €):** conviene vendere l'auto dichiarando lo stato d'uso con trasparenza e scalando il preventivo ufficiale dal prezzo richiesto.`;
  }

  if (q.includes('graffi') || q.includes('pasta abrasiva') || q.includes('polish') || q.includes('ritocco')) {
    return `Per verificare ed eliminare graffi sulla carrozzeria di ${carName}:

**Verifica profondità:**
- Se passando l'unghia non si incastra e non si vede il fondo chiaro, il danno è superficiale sul trasparente.
- **Intervento fai-da-te:** pasta abrasiva fine con panno in microfibra, rifinita con polish lucidante e cera protettiva (spesa 12 € – 18 €).
- Se il graffio ha raggiunto la lamiera, serve uno stick di vernice con codice colore originale per prevenire la ruggine.`;
  }

  if (q.includes('cinghia') || q.includes('distribuzione') || q.includes('catena')) {
    return `Per ${carName}, la distribuzione è un componente critico per la vita del motore:

**Intervalli e costi:**
- **Motori con cinghia:** sostituzione ogni **5-6 anni o 100.000 – 140.000 km**. Costo indicativo kit cinghia + pompa acqua + manodopera: **380 € – 650 €**.
- **Motori con catena:** progettata per durare oltre 200.000 km; va verificata solo in caso di tintinnii metallici all'avviamento a freddo.`;
  }

  if (q.includes('frizione') || q.includes('volano')) {
    return `La sostituzione della frizione su ${carName} costa mediamente tra **450 € e 850 €** (disco, spingidisco e cuscinetto reggispinta).

Se la vettura monta un **volano bimassa** (frequente sui motori diesel e turbo recenti), il kit completo con volano varia tra **750 € e 1.300 €** compresa manodopera (circa 4-6 ore di lavoro).`;
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
