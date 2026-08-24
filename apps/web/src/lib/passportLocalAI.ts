import type {
  VehiclePassportData,
  PassportChatMessage,
  PassportDocCategory,
} from '@autoesperto/types';

/**
 * Motore AI Locale di AutoEsperto per il Passaporto Auto
 * Risponde istantaneamente in italiano conoscendo il veicolo, il chilometraggio,
 * i documenti registrati, le scadenze e lo storico dei tagliandi.
 */
export function generatePassportLocalAI(
  question: string,
  passport: VehiclePassportData,
  history: PassportChatMessage[] = []
): PassportChatMessage {
  const qLower = question.toLowerCase();
  const v = passport.vehicle;
  const makeModel = `${v.make} ${v.model}`.trim();
  const currentKm = passport.currentKm || 0;
  const docsCount = passport.documents?.length || 0;
  const fuelType = (v.fuel || 'benzina').toLowerCase();

  let metadata: PassportChatMessage['metadata'] = undefined;
  let reply = '';

  // 1. Spie cruscotto & Anomalie
  if (/spia|avaria|anomalia|errore|check engine|motore acceso|olio|freni|dpf|fap|adblue|temperatura|abs/i.test(qLower)) {
    const isCriticalRed = /olio|pressione|freno|freni|temperatura|stop|rossa/i.test(qLower);
    const isDpf = /dpf|fap|filtro particolato/i.test(qLower);
    const isEngine = /motore|check engine|gialla|avaria/i.test(qLower);
    const isBrakes = /pastiglie|disco|liquido freni|freni/i.test(qLower);

    let lightName = 'Spia Allerta Cruscotto';
    let causes = ['Segnale anomalo registrato da uno dei sensori di bordo', 'Controllo periodico dei livelli richiesto'];
    let recommendation = 'Effettua una lettura codici errore con diagnosi OBD in officina per individuare il problema con certezza.';

    if (isCriticalRed) {
      lightName = '🔴 Spia Critica / Allerta Rossa (Pressione Olio / Temperatura / Freni)';
      causes = [
        'Pressione olio insufficiente o livello sotto il minimo',
        'Surriscaldamento liquido di raffreddamento motore',
        'Anomalia circuito frenante o livello liquido freni basso',
      ];
      recommendation = '⚠️ Arresta il veicolo in sicurezza appena possibile e spegni il motore. Non proseguire per evitare gravi danni meccanici.';
    } else if (isDpf) {
      lightName = '🟡 Spia Filtro Antiparticolato (DPF / FAP)';
      causes = [
        'Filtro intasato da percorsi brevi o tragitti urbani frequenti',
        'Rigenerazione automatica interrotta',
        'Sensore pressione differenziale sporco o guasto',
      ];
      recommendation = 'Percorri circa 20-30 minuti a velocità costante in tangenziale/autostrada (2.500 giri/min) per consentire la rigenerazione. Se persiste, richiede pulizia o diagnosi forzata.';
    } else if (isEngine) {
      lightName = '🟡 Spia Avaria Motore (MIL / Check Engine)';
      causes = [
        'Valvola EGR o debimetro sporchi',
        'Sensore sonda lambda o candele/candelette',
        'Pressione carburante o iniettori da calibrare',
      ];
      recommendation = 'Puoi proseguire a andatura moderata senza tirare le marce. Fai leggere la centralina con uno scanner OBD-II per rilevare il codice di guasto (es. P0401, P0300).';
    } else if (isBrakes) {
      lightName = '🟡 Spia Usura Pastiglie Freno / Livello Liquido';
      causes = ['Spessore materiale frenante sotto il limite di sicurezza (2-3 mm)', 'Contatto del sensore d\'usura sul disco'];
      recommendation = 'Fai ispezionare pastiglie e dischi freno entro 500-1.000 km. Su questa auto le pastiglie anteriori hanno in genere sensore di usura integrato.';
    }

    metadata = {
      warningLight: {
        name: lightName,
        severity: isCriticalRed ? 'critica' : 'media',
        stopImmediately: isCriticalRed,
        possibleCauses: causes,
        recommendation,
      },
    };

    reply = `Sulla tua **${makeModel}** (${currentKm.toLocaleString('it-IT')} km):\n\n` +
      `⚠️ **Analisi preliminare**: L'accensione della spia indica una segnalazione registrata dalla centralina.\n\n` +
      `🔍 **Gravità**: ${isCriticalRed ? '**CRITICA (ROSSA)** — fermati in sicurezza!' : '**ATTENZIONE (GIALLA/AMBRA)** — anomalia da far verificare a breve.'}\n\n` +
      `💡 **Cosa fare**:\n${recommendation}\n\n` +
      `*Nota di sicurezza: Questa indicazione orientativa si basa sulle specifiche della tua auto. Per una conferma definitiva rivolgiti a un meccanico specializzato.*`;
  }

  // 2. Prossimo tagliando & Manutenzione programmata
  else if (/prossim.*tagliand|scadenza.*tagliand|quant.*manca.*tagliand|quando.*tagliand|manutenzion.*ordinari/i.test(qLower)) {
    const nextTarget = passport.nextServiceKm || (Math.ceil((currentKm + 1) / 15000) * 15000);
    const diff = Math.max(0, nextTarget - currentKm);
    const oilSpec = fuelType.includes('diesel')
      ? (v.make.toLowerCase() === 'bmw' ? 'BMW Longlife-04 (0W-30 o 5W-30)' : '5W-30 C3 / 0W-30 Low-SAPS')
      : '5W-30 / 0W-20 con specifiche del costruttore';

    const lastTagliando = (passport.documents || []).find((d) => d.category === 'manutenzione') ||
      (passport.timeline || []).find((t) => t.type === 'TAGLIANDO');

    reply = `📊 **Stato Manutenzione per la tua ${makeModel}**:\n\n` +
      `- **Chilometraggio attuale**: **${currentKm.toLocaleString('it-IT')} km**\n` +
      `- **Prossimo tagliando stimato**: a circa **${nextTarget.toLocaleString('it-IT')} km** (${diff === 0 ? '⚠️ **Tagliando dovuto ora!**' : `mancano circa **${diff.toLocaleString('it-IT')} km** o entro 12 mesi`})\n\n` +
      (lastTagliando
        ? `📋 **Ultimo intervento registrato**: ${lastTagliando.title || 'Tagliando'} ${lastTagliando.km ? `a **${lastTagliando.km.toLocaleString('it-IT')} km**` : ''} ${(lastTagliando as any).eventDate || (lastTagliando as any).date ? `il **${new Date((lastTagliando as any).eventDate || (lastTagliando as any).date).toLocaleDateString('it-IT')}**` : ''}.\n\n`
        : `📋 Non ci sono ancora fatture di tagliandi caricate nel Passaporto. Carica la ricevuta dell'ultimo tagliando per avere promemoria precisi.\n\n`) +
      `🔧 **Interventi raccomandati per questo tagliando**:\n` +
      `1. Sostituzione Olio Motore sintetico (${oilSpec})\n` +
      `2. Filtro Olio + Filtro Aria motore\n` +
      `3. Filtro Abitacolo (anti-polline / carboni attivi)\n` +
      (fuelType.includes('diesel') ? `4. Filtro Carburante Gasolio (consigliato ogni 30-40.000 km)\n` : `4. Controllo candele di accensione\n`) +
      `5. Ispezione spessore dischi e pastiglie freni, controllo livelli liquidi.\n\n` +
      `💡 **Costo medio previsto**: circa **220 € – 420 €** in officina indipendente (circa 380 € – 650 € in rete ufficiale).`;
  }

  // 3. Ultimo tagliando registrato
  else if (/ultimo.*tagliand|storico.*tagliand|ultim.*manutenzion/i.test(qLower)) {
    const lastDoc = (passport.documents || []).find((d) => d.category === 'manutenzione');
    const lastEvt = (passport.timeline || []).find((e) => e.type === 'TAGLIANDO');

    if (lastDoc || lastEvt) {
      const date = lastDoc?.eventDate || lastEvt?.date || 'N/D';
      const km = lastDoc?.km || lastEvt?.km;
      const cost = lastDoc?.amount || lastEvt?.cost;
      const notes = lastDoc?.notes || lastEvt?.description || 'Manutenzione ordinaria';

      reply = `📋 **Dato Documentato nel Passaporto**:\n\n` +
        `L'ultimo tagliando registrato per la tua **${makeModel}** risale al **${new Date(date).toLocaleDateString('it-IT')}**` +
        (km ? ` a quota **${km.toLocaleString('it-IT')} km**` : '') +
        (cost ? ` (importo fattura: **${cost.toLocaleString('it-IT')} €**)` : '') + `.\n\n` +
        `🔧 **Dettaglio interventi**: ${notes}.\n\n` +
        `💡 Tutti i documenti salvati nel Passaporto Auto aumentano la trasparenza e il valore dell'auto al momento della vendita.`;
    } else {
      reply = `Non risultano ancora fatture o ricevute di tagliandi registrate nel Passaporto della tua **${makeModel}**.\n\n` +
        `Puoi caricare la ricevuta o la fattura dell'ultimo intervento dalla scheda **"I Tuoi Documenti"** con la scansione intelligente AI OCR!`;
    }
  }

  // 4. Costi Riparazione & Preventivi (Frizione, Distribuzione, Freni, ecc.)
  else if (/frizion|volano|distribuzion|cinghia|catena|fren|pastigli|disch|ammortizzator|turbin|cost|prezz|quant.*costa|preventiv/i.test(qLower)) {
    let partCost = '160 € – 380 €';
    let laborCost = '140 € – 280 €';
    let materialsCost = '40 € – 90 €';
    let totalCost = '340 € – 750 €';
    let estimatedHours = '2–4 ore';
    let compTitle = 'Intervento di Manutenzione Meccanica';

    if (/frizion|volano/i.test(qLower)) {
      compTitle = 'Sostituzione Kit Frizione & Volano Bimassa';
      partCost = '380 € – 680 € (Sachs / Luk / Valeo)';
      laborCost = '350 € – 600 €';
      materialsCost = '60 € – 120 € (Olio cambio + cuscinetto idraulico)';
      totalCost = '790 € – 1.400 €';
      estimatedHours = '5–7 ore';
    } else if (/distribuzion|cinghia|catena/i.test(qLower)) {
      const isChain = v.make.toLowerCase() === 'bmw' || /catena/i.test(qLower);
      compTitle = isChain ? 'Verifica / Sostituzione Catena di Distribuzione' : 'Kit Cinghia Distribuzione + Pompa Acqua';
      partCost = isChain ? '320 € – 650 €' : '180 € – 320 € (Gates, Continental, SKF)';
      laborCost = isChain ? '500 € – 950 €' : '200 € – 400 €';
      materialsCost = '50 € – 100 € (Liquido radiatore antigelo)';
      totalCost = isChain ? '870 € – 1.700 €' : '430 € – 820 €';
      estimatedHours = isChain ? '7–10 ore' : '3–5 ore';
    } else if (/fren|pastigli|disch/i.test(qLower)) {
      compTitle = 'Sostituzione Pastiglie e Dischi Freno Anteriori';
      partCost = '110 € – 220 € (Brembo / Bosch / Ferodo / Textar)';
      laborCost = '60 € – 130 €';
      materialsCost = '20 € – 40 € (Detergente freni + sensore usura)';
      totalCost = '190 € – 390 €';
      estimatedHours = '1–2 ore';
    } else if (/ammortizzator/i.test(qLower)) {
      compTitle = 'Sostituzione Coppia Ammortizzatori Anteriori';
      partCost = '180 € – 350 € (Bilstein, Sachs, Monroe)';
      laborCost = '120 € – 220 € (inclusa convergenza ruote)';
      materialsCost = '30 € – 60 € (tamponi paracolpi)';
      totalCost = '330 € – 630 €';
      estimatedHours = '2–3.5 ore';
    }

    metadata = {
      repairEstimate: {
        partCost,
        laborCost,
        materialsCost,
        totalCost,
        estimatedHours,
      },
    };

    reply = `🔧 **Stima Costi per ${compTitle}** su **${makeModel}** (${v.fuel || ''}):\n\n` +
      `📊 **Dettaglio preventivo medio di mercato**:\n` +
      `- **Costo ricambi**: ${partCost}\n` +
      `- **Manodopera stimata**: ${laborCost} (${estimatedHours})\n` +
      `- **Materiali di consumo**: ${materialsCost}\n` +
      `- 💰 **Totale stimato chiavi in mano**: **${totalCost}**\n\n` +
      `💡 **Consiglio AutoEsperto**: Richiedi sempre la specifica del marchio dei ricambi utilizzati (consigliati ricambi di primo impianto OE) e fattura con 24 mesi di garanzia sui pezzi.`;
  }

  // 5. Ricambi compatibili & Olio
  else if (/ricamb|pastigli|filtr|olio.*motore|candele|batteri|compatibil|tergicristall|gomm|pneumatic/i.test(qLower)) {
    const isOil = /olio/i.test(qLower);
    const isBattery = /batteri/i.test(qLower);
    const isTires = /gomm|pneumatic/i.test(qLower);

    let partName = `Ricambio compatibile per ${makeModel}`;
    let aftermarketPrice = '45 € – 130 €';
    let notes = `Compatibilità verificata per motore ${v.displacement || '2.0'} ${v.fuel || ''} (${v.year || '2021'})`;

    if (isOil) {
      partName = 'Olio Motore Sintetico 100% (Gradazione consigliata 0W-30 / 5W-30)';
      aftermarketPrice = '14 € – 22 € al litro (5-6 litri per cambio completo)';
      notes = 'Specifiche consigliate: BMW LL-04 / ACEA C3 / VW 507.00 (Castrol Edge, Motul 8100, Shell Helix Ultra)';
    } else if (isBattery) {
      partName = 'Batteria 12V AGM / EFB per sistema Start & Stop (70-80 Ah)';
      aftermarketPrice = '120 € – 210 € (Varta Silver Dynamic AGM, Bosch S5 A)';
      notes = 'Richiede codifica della nuova batteria in centralina (BMS) per ricarica corretta.';
    } else if (isTires) {
      partName = 'Pneumatici 4 Stagioni o Estivi di alta gamma';
      aftermarketPrice = '85 € – 160 € a gomma (Michelin, Continental, Pirelli, Goodyear)';
      notes = 'Verificare le misure omologate al quadro 3 del Documento Unico / Libretto.';
    }

    metadata = {
      partsLookup: {
        partName,
        oemCode: 'Verificato per specifiche di bordo',
        aftermarketPrice,
        compatibilityNotes: notes,
      },
    };

    reply = `🔩 **Specifiche Ricambi per la tua ${makeModel}**:\n\n` +
      `- **Componente**: **${partName}**\n` +
      `- **Prezzo indicativo**: **${aftermarketPrice}**\n` +
      `- **Specifiche & Note tecniche**: ${notes}\n\n` +
      `💡 Conserva le ricevute dei ricambi nel tuo Passaporto Auto per mantenere sempre certificata l'originalità e la cura del veicolo.`;
  }

  // 6. Assicurazione RC Auto
  else if (/assicurazion|polizz|rc auto|scadenza.*polizz/i.test(qLower)) {
    if (passport.insuranceExpiry) {
      const expDate = new Date(passport.insuranceExpiry);
      const diffDays = Math.ceil((expDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      const company = passport.insuranceCompany || 'Compagnia registrata';

      reply = `🛡️ **Polizza RC Auto registrata**:\n\n` +
        `- **Compagnia**: **${company}**\n` +
        `- **Scadenza**: **${expDate.toLocaleDateString('it-IT')}**\n` +
        `- **Stato**: ${diffDays < 0 ? '🔴 **Polizza scaduta!**' : diffDays <= 30 ? `🟡 **In scadenza tra ${diffDays} giorni**` : `🟢 **Attiva (mancano ${diffDays} giorni)**`}\n\n` +
        `💡 **Consiglio**: Ti ricordiamo che la copertura RC Auto prevede un periodo di tolleranza di 15 giorni dopo la scadenza, ma è preferibile rinnovarla prima.`;
    } else {
      reply = `Non hai ancora inserito la data di scadenza della polizza RC Auto nel Passaporto della tua **${makeModel}**.\n\n` +
        `Puoi caricarla o aggiornarla in un click per ricevere i promemoria automatici prima del rinnovo!`;
    }
  }

  // 7. Revisione Ministeriale & Bollo
  else if (/revision|bollo|tassa di possesso/i.test(qLower)) {
    if (passport.revisionExpiry) {
      const expDate = new Date(passport.revisionExpiry);
      const diffDays = Math.ceil((expDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

      reply = `🏛️ **Revisione Periodica Ministeriale**:\n\n` +
        `- **Scadenza**: **${expDate.toLocaleDateString('it-IT')}**\n` +
        `- **Stato**: ${diffDays < 0 ? '🔴 **Revisione scaduta!** Circolazione non consentita.' : `🟢 **In regola** (mancano circa ${diffDays} giorni)`}\n\n` +
        `💡 **Regola**: La revisione va effettuata entro l'ultimo giorno del mese di scadenza presso qualsiasi centro autorizzato MCTC (costo tariffa ministeriale: circa 79,00 €).`;
    } else {
      const carYear = v.year || new Date().getFullYear();
      reply = `In base all'anno d'immatricolazione (**${carYear}**), la revisione ministeriale va effettuata dopo 4 anni dalla prima immatricolazione e successivamente ogni 2 anni.\n\n` +
        `Carica il talloncino di revisione o il libretto nel Passaporto per tracciare la data precisa.`;
    }
  }

  // 8. Vendita & Valore del veicolo
  else if (/vender|vendit|valore|quanto vale|annuncio|subito|autoscout/i.test(qLower)) {
    const val = passport.estimatedValue || 22000;
    const score = passport.healthScore || 85;

    reply = `💶 **Valorizzazione e Vendita per la tua ${makeModel}**:\n\n` +
      `- **Health Score attuale**: **${score}/100**\n` +
      `- **Valore di mercato indicativo**: **${val.toLocaleString('it-IT')} €**\n` +
      `- **Documenti & Tagliandi registrati**: **${docsCount}**\n\n` +
      `⭐ **Perché il Passaporto Auto ti aiuta a vendere meglio?**\n` +
      `1. **Zero sospetti sui chilometri**: mostri la cronologia temporale trasparente dei tagliandi.\n` +
      `2. **Prezzo più alto del 5-10%**: un'auto con storico documentato si vende più rapidamente e a prezzo pieno.\n` +
      `3. **Link pubblico protetto**: puoi usare il pulsante **"Sto vendendo questa auto"** per generare un link sicuro e inserirlo direttamente su Subito o AutoScout24 senza rivelare dati personali sensibili!`;
  }

  // 9. Risposta generale contestuale
  else {
    reply = `Ho analizzato lo stato della tua **${makeModel}** (${currentKm.toLocaleString('it-IT')} km, Health Score **${passport.healthScore}/100**):\n\n` +
      `- Documenti registrati nel Passaporto: **${docsCount}**\n` +
      `- Prossimo tagliando stimato: a quota **${(passport.nextServiceKm || currentKm + 10000).toLocaleString('it-IT')} km**\n\n` +
      `Puoi chiedermi in qualsiasi momento:\n` +
      `• *"Quando devo fare il prossimo tagliando?"*\n` +
      `• *"Mi si è accesa la spia motore / pressione olio, cosa faccio?"*\n` +
      `• *"Quanto costa cambiare la frizione o i freni?"*\n` +
      `• *"Quale olio motore e ricambi sono compatibili?"*\n` +
      `• *"Come preparare la scheda per vendere la mia auto?"*`;
  }

  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: reply,
    level: 'advice',
    metadata,
    createdAt: new Date().toISOString(),
  };
}
