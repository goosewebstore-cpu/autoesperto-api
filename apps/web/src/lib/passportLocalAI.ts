import type {
  VehiclePassportData,
  PassportChatMessage,
  PassportDocCategory,
} from '@autoesperto/types';

/**
 * Motore AI Conversazionale di AutoEsperto per il Passaporto Auto
 * Risponde come un vero esperto / capoofficina in italiano:
 * - Tono naturale, umano, rassicurante e preciso
 * - Stime realistiche di spesa (Fai-da-te vs Meccanico)
 * - Pone sempre domande di approfondimento diagnostico pertinenti per guidare l'utente
 * - Mantiene il filo del discorso con la cronologia dei messaggi
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
  const docsCount = passport.documents?.length || 0;
  const fuelType = (v.fuel || 'benzina').toLowerCase();
  const year = v.year || 2018;

  // Analizza gli ultimi messaggi per capire il contesto della conversazione
  const lastAiMsg = [...history].reverse().find((m) => m.role === 'assistant')?.content.toLowerCase() || '';

  let metadata: PassportChatMessage['metadata'] = undefined;
  let reply = '';

  // ── GESTIONE RISPOSTE A DOMANDE PRECEDENTI (Contesto Conversazionale) ──
  
  // Se l'utente risponde sul fischio dei freni o vibrazioni
  if (lastAiMsg.includes('fren') || lastAiMsg.includes('pastigli') || lastAiMsg.includes('fisch')) {
    if (/fisch|rumor|strid|metall/i.test(qLower)) {
      reply = `Se senti un fischio acuto o metallico sulla tua ${makeModel}, significa che il ferodo della pastiglia si è consumato fino alla linguetta di contatto o che la mescola si è vetrificata per il calore.

Ti consiglio di farle controllare al più presto: se il supporto metallico arriva a toccare il disco, rischi di rigarlo irrimediabilmente raddoppiando la spesa.

Hai notato se il fischio lo fa solo a freddo la mattina o a ogni singola frenata?`;
      return createAiMessage(reply);
    }
    if (/vibra|pedale|volante|trema/i.test(qLower)) {
      reply = `Se avverti vibrazioni sul pedale del freno o sul volante quando freni da 70-90 km/h, quasi sicuramente i dischi anteriori si sono **ovalizzati** (a causa di sbalzi termici o usura).

In questo caso, cambiare solo le pastiglie non risolverà il problema: serve il kit completo di **dischi + pastiglie nuove**. Su ${makeModel} il kit dischi+pastiglie Brembo o Ferodo costa circa **95 € – 160 €** di ricambi, oppure circa **180 € – 250 €** montato dal meccanico.

Vuoi che ti consigli le marche migliori di dischi e pastiglie per la tua guida?`;
      return createAiMessage(reply);
    }
    if (/da solo|fai da te|faccio io|garage/i.test(qLower)) {
      reply = `Ottima scelta se hai un minimo di manualità! Sulla tua ${makeModel} il lavoro richiede circa un'ora.

Ecco cosa ti serve:
1. Cric sollevatore e cavalletto di sicurezza
2. Chiave per i bulloni ruota e brugola/torx per le guide della pinza freno
3. Un arretratore per spingere indietro il pistoncino della pinza
4. Bomboletta di sgrassatore freni (brake cleaner) e pasta di rame per non far fischiare il retro della pastiglia

Ricordati di aprire la vaschetta del liquido freni nel cofano prima di arretrare il pistone, e di dare 3-4 pompate a vuoto sul pedale a lavoro finito prima di partire.

Vuoi i link diretti per ordinare le pastiglie giuste compatibili con la tua targa su eBay o Autodoc?`;
      return createAiMessage(reply);
    }
    if (/meccanic|officin|cost.*manodoper|preventiv/i.test(qLower)) {
      reply = `Dal meccanico per la sola sostituzione pastiglie anteriori su ${makeModel} la manodopera onesta è di **35 € – 60 €** (circa 45-60 minuti di lavoro). 

Se porti tu i ricambi comprati online, chiedi prima all'officina se accetta ricambi forniti dal cliente. In totale, pastiglie + montaggio dovresti spendere intorno ai **90 € – 130 €**.

Hai già un'officina di fiducia a cui rivolgerti?`;
      return createAiMessage(reply);
    }
  }

  // Se l'utente risponde sul tipo di spia (fissa/lampeggiante, colore)
  if (lastAiMsg.includes('spia') || lastAiMsg.includes('avaria')) {
    if (/ross|fermo|bloccat|subito/i.test(qLower)) {
      reply = `⚠️ **Fermati appena puoi in sicurezza!** Le spie rosse (pressione olio, temperatura liquido, freni o alternatore) indicano un rischio concreto per la sicurezza o per l'integrità del motore della tua ${makeModel}.

Spegni il motore e non ripartire:
- Se è l'olio, controlla l'astina a motore spento da 5 minuti.
- Se è la temperatura, attendi che il radiatore si raffreddi prima di toccare qualsiasi tappo.

Hai bisogno del numero del soccorso stradale della tua polizza?`;
      return createAiMessage(reply);
    }
    if (/giall|arancion|fiss|lampeggia/i.test(qLower)) {
      const isBlinking = /lampeggia/i.test(qLower);
      reply = isBlinking
        ? `Se la spia gialla/motore **lampeggia**, significa che c'è una mancata accensione (misfire) che potrebbe danneggiare il catalizzatore. Riduci subito la velocità, non accelerare a fondo e vai direttamente in officina.`
        : `Se la spia gialla è **fissa**, la centralina ha registrato un'anomalia (es. valvola EGR, sonda lambda, sensore debimetro o DPF), ma puoi viaggiare a andatura tranquilla fino alla diagnosi.

Hai notato se la macchina ha perso potenza (modalità protezione/recovery) o se fa fumo anomalo?`;
      return createAiMessage(reply);
    }
  }

  // ── CATEGORIE PRINCIPALI ──

  // 1. FRENI E PASTIGLIE
  if (/fren|pastigli|disch|pinz/i.test(qLower)) {
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

    reply = `Sulla tua **${makeModel}** (${year}, ${currentKm.toLocaleString('it-IT')} km), la sostituzione delle pastiglie dei freni è un intervento rapido e di routine.

Ecco i costi reali aggiornati di mercato:
• **Fai-da-te (solo ricambio)**: spendi circa **${partCost}** per un kit anteriore di ottima marca.
• **Dischi + Pastiglie anteriori**: circa **${fullKitCost}** se i dischi sono usurati o rigati.
• **In officina (ricambi + manodopera)**: il preventivo onesto è di circa **${totalMech}**.

Per aiutarti al meglio:
1. **Senti rumori strani, come fischi in frenata o vibrazioni sul pedale?**
2. **Preferisci fare il lavoro da solo nel tuo box o portarla dal meccanico?**`;
  }

  // 2. SPIE DEL CRUSCOTTO & DIAGNOSI
  else if (/spia|avaria|check engine|anomalia|errore|obd|spie/i.test(qLower)) {
    const isRed = /ross|olio|pressione|temperatura|stop/i.test(qLower);
    const isDpf = /dpf|fap|filtro particolato/i.test(qLower);

    if (isRed) {
      reply = `Sulla tua **${makeModel}**, una spia **ROSSA** è un allarme critico (pressione olio, temperatura refrigerante o impianto frenante).

⚠️ **Cosa fare subito**:
- Accosta in sicurezza appena possibile e spegni il motore.
- Non proseguire per evitare grippaggi o danni da migliaia di euro.
- Controlla a freddo il livello dell'olio motore o del liquido radiatore.

Quale spia esatta ti si è accesa sul cruscotto?`;
    } else if (isDpf) {
      reply = `La spia del **DPF / FAP** sulla tua **${makeModel}** indica che il filtro antiparticolato non è riuscito a completare le rigenerazioni automatiche (succede spesso con percorsi brevi in città).

💡 **Come risolvere**:
1. Fai un tragitto di 20-25 minuti in tangenziale o autostrada a circa 2.500-3.000 giri/min costanti in 4ª o 5ª marcia per far salire le temperature dello scarico.
2. Se la spia non si spegne, serve una rigenerazione forzata via diagnosi OBD in officina (costo circa 40 € – 80 €).

La macchina va a velocità normale o è entrata in protezione con potenza ridotta?`;
    } else {
      reply = `Sulla tua **${makeModel}** (${currentKm.toLocaleString('it-IT')} km), l'accensione di una spia gialla/ambra segnala che la centralina ha rilevato un parametro fuori tolleranza.

I motivi più frequenti su questo modello sono:
• Sensore della sonda lambda o debimetro sporco
• Valvola EGR o condotti di aspirazione intasati
• Candeletta / bobina di accensione o sensore di pressione

Una lettura codici OBD2 in officina (o con un adattatore bluetooth da 15 €) ti dice il codice errore esatto in 2 minuti.

La spia è **fissa o lampeggiante**? Noti strappi in accelerazione o consumi aumentati?`;
    }
  }

  // 3. TAGLIANDO E MANUTENZIONE PROGRAMMATA
  else if (/tagliand|cambio olio|manutenzion|filtri/i.test(qLower)) {
    const nextTarget = passport.nextServiceKm || (Math.ceil((currentKm + 1) / 15000) * 15000);
    const diff = Math.max(0, nextTarget - currentKm);
    const lastDoc = (passport.documents || []).find((d) => d.category === 'manutenzione');

    reply = `Per la tua **${makeModel}** (${year}, ${currentKm.toLocaleString('it-IT')} km), la manutenzione ordinaria è fondamentale per garantire longevità e mantenere alto l'Health Score (${passport.healthScore}/100).

📊 **Riepilogo scadenze**:
• Chilometraggio attuale: **${currentKm.toLocaleString('it-IT')} km**
• Prossimo tagliando consigliato: a quota **${nextTarget.toLocaleString('it-IT')} km** ${diff <= 1000 ? '(⚠️ **Da fare adesso!**)' : `(tra circa **${diff.toLocaleString('it-IT')} km** o entro 12 mesi)`}
${lastDoc ? `• Ultimo tagliando documentato: ${lastDoc.eventDate || 'Data recente'} a ${lastDoc.km ? `${lastDoc.km.toLocaleString('it-IT')} km` : 'N/D'}` : '• Nessun tagliando ancora registrato nel Passaporto Digitale.'}

💰 **Costi medi per tagliando completo (Olio sintetico + 4 filtri)**:
- Fai-da-te (kit filtri + olio di marca): **75 € – 120 €**
- In officina indipendente: **160 € – 260 €** tutto compreso

Vuoi sapere quale gradazione e specifica di olio motore raccomanda il costruttore per la tua motorizzazione?`;
  }

  // 4. DISTRIBUZIONE, CINGHIA O CATENA
  else if (/distribuzion|cinghi|caten|pompa acqua/i.test(qLower)) {
    const isChain = /catena/i.test(qLower) || (v.make.toLowerCase() === 'bmw' && !/147|fiat/i.test(makeModel.toLowerCase()));
    
    if (isChain) {
      reply = `Sulla tua **${makeModel}**, la distribuzione è a **catena**. In teoria è progettata per durare a lungo, ma l'olio vecchio può usurare i pattini tendicatena.

Sintomi di usura: tintinnio metallico a freddo nei primi 5-10 secondi dall'avviamento.
Costo eventuale sostituzione kit catena completo: circa **750 € – 1.400 €** per l'alta complessità di manodopera.

Senti per caso rumori di sferragliamento all'accensione a motore freddo?`;
    } else {
      reply = `Sulla tua **${makeModel}**, la cinghia di distribuzione è un elemento vitale. Se si rompe, le valvole impattano contro i pistoni causando danni molto gravi al motore.

⏰ **Intervallo consigliato**: ogni **5-6 anni** oppure ogni **60.000 – 100.000 km** (a seconda dell'utilizzo urbano o autostradale).
💰 **Costi medi di sostituzione (Kit Cinghia + Cuscinetti + Pompa Acqua + Liquido Antigelo)**:
- Solo ricambi (Gates, Dayco, SKF o Continental): **110 € – 200 €**
- Lavoro finito dal meccanico: **380 € – 580 €**

Sai quanti anni o chilometri ha la cinghia attualmente montata sulla tua auto?`;
    }
  }

  // 5. FRIZIONE E VOLANO
  else if (/frizion|volano|marce non entrano|pedale duro/i.test(qLower)) {
    reply = `Sulla tua **${makeModel}** (${fuelType}), i sintomi di una frizione usurata sono tipicamente il pedale duro, lo stacco molto in alto o il motore che sale di giri senza che l'auto acceleri proporzionalmente (slittamento).

💰 **Stima Costi di Mercato**:
• **Kit frizione standard (disco + spingidisco + cuscinetto)**: **130 € – 240 €** di ricambi (Valeo / Sachs / Luk).
• **Kit frizione + Volano bimassa** (se diesel o turbo): **380 € – 650 €** di ricambi.
• **Manodopera officina (4-6 ore di lavoro)**: circa **250 € – 420 €**.
• **Totale medio chiavi in mano**: **420 € – 650 €** (solo frizione) oppure **750 € – 1.150 €** (con volano bimassa).

Cosa noti esattamente quando guidi: la frizione slitta in accelerazione con marce alte, o fatichi a inserire la prima e la retromarcia?`;
  }

  // 6. AMMORTIZZATORI E ASSETTO
  else if (/ammortizzator|assetto|rumore dossi|braccetti|silent block/i.test(qLower)) {
    reply = `Per la tua **${makeModel}**, gli ammortizzatori e i braccetti delle sospensioni garantiscono stabilità e spazi di frenata sicuri.

Sintomi tipici di usura:
• Rumori sordi ("cloc-cloc") o cigolii su dossi e pavé (spesso i gommini dei braccetti o le biellette della barra stabilizzatrice)
• L'auto che si inclina eccessivamente in curva o 'rimbalza' sulle ondulazioni

💰 **Costi indicativi**:
- Coppia ammortizzatori anteriori (Monroe, Bilstein, Sachs): **110 € – 220 €** di ricambio, circa **240 € – 380 €** con montaggio e convergenza.
- Braccetti anteriori / biellette: **40 € – 90 €** a pezzo.

Senti rumori secchi sull'asfalto sconnesso o l'auto ti sembra troppo morbida e instabile?`;
  }

  // 7. BATTERIA & ALTERNATORE
  else if (/batteri|avviamento|non parte|alternatore/i.test(qLower)) {
    reply = `Sulla tua **${makeModel}** (${year}), una batteria al piombo standard dura in media dai 3 ai 5 anni (2-4 anni per le batterie AGM/EFB con sistema Start&Stop).

💡 **Costi di mercato**:
- Batteria standard 55-65 Ah (Varta, Bosch, Fiamm): **65 € – 110 €**
- Batteria Start&Stop AGM/EFB: **120 € – 190 €**
- Sostituzione autonoma: semplicissima, servono solo una chiave da 10 e una da 13.

L'auto fatica al primo avviamento la mattina, o hai visto spie della batteria accese mentre guidi?`;
  }

  // 8. PNEUMATICI E GOMME
  else if (/gomm|pneumatic|battistrada|invernal|estiv|4 stagion/i.test(qLower)) {
    reply = `Per la tua **${makeModel}**, la profondità minima del battistrada per legge è di 1,6 mm, ma sotto i 3 mm le prestazioni su bagnato crollano drasticamente.

💰 **Prezzi medi a treno (4 gomme montate ed equilibrate)**:
- Fascia economica / budget: **180 € – 260 €**
- Fascia media affidabile (Hankook, Kumho, Nexen): **260 € – 360 €**
- Fascia premium (Michelin, Continental, Pirelli, Goodyear): **360 € – 520 €**

Percorri molti km all'anno e cerchi un treno 4 stagioni per tutte le condizioni, oppure preferisci il doppio treno estive/invernali?`;
  }

  // 9. REVISIONE E BOLLO
  else if (/revision|bollo|scadenza/i.test(qLower)) {
    if (passport.revisionExpiry) {
      const exp = new Date(passport.revisionExpiry);
      reply = `La revisione ministeriale per la tua **${makeModel}** scade il **${exp.toLocaleDateString('it-IT')}**.

La tariffa ministeriale fissa in tutti i centri autorizzati è di circa **79,02 €**. Ricordati di far controllare preventivamente che non ci siano lampadine bruciate, clacson non funzionante o gomme lisce per passare al primo colpo senza dover pagare la ripetizione!

Vuoi anche verificare il calcolo dell'importo del bollo auto per la tua regione?`;
    } else {
      reply = `Sulla tua **${makeModel}** (${year}), la revisione ministeriale va effettuata dopo 4 anni dalla prima immatricolazione e poi ogni 2 anni entro la fine del mese di scadenza.

Il costo ministeriale è di circa **79,00 €** presso qualsiasi centro autorizzato.

Sai in quale mese dell'anno è stata immatricolata la vettura per calcolare la scadenza esatta?`;
    }
  }

  // 10. RISPOSTA GENERALE APERTA
  else {
    reply = `Ciao! Sono il tuo consulente tecnico di AutoEsperto per la tua **${makeModel}** (${year}, ${currentKm.toLocaleString('it-IT')} km, Health Score **${passport.healthScore}/100**).

Posso darti consigli pratici, stimare costi di ricambi e manodopera, o aiutarti a capire eventuali anomalie.

Ad esempio, puoi chiedermi:
• *"Quanto costa cambiare le pastiglie o la frizione?"*
• *"Mi si è accesa una spia gialla sul cruscotto, cosa faccio?"*
• *"Quale olio motore e filtri comprare per il tagliando?"*
• *"Cosa devo controllare prima della revisione?"*

Di cosa ha bisogno la tua auto in questo momento?`;
  }

  return createAiMessage(reply, metadata);
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
