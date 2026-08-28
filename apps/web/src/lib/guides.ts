export interface GuideSection {
  heading: string;
  paragraphs: string[];
  list?: string[];
}

export type GuideCategory = 'acquisto' | 'vendita' | 'valutazione' | 'manutenzione' | 'affidabilita';

export const GUIDE_CATEGORIES: Record<GuideCategory, { label: string }> = {
  acquisto: { label: 'Acquisto' },
  vendita: { label: 'Vendita' },
  valutazione: { label: 'Valutazione' },
  manutenzione: { label: 'Manutenzione' },
  affidabilita: { label: 'Affidabilità' },
};

export interface Guide {
  slug: string;
  title: string;
  description: string;
  published: string;
  category: GuideCategory;
  sections: GuideSection[];
  cta: string;
}

export const guides: Guide[] = [
  {
    slug: 'straccia-bollo-sicilia-2026-chi-puo-farlo-norme',
    title: 'Straccia Bollo Sicilia 2026: come cancellare sanzioni e interessi sulle vecchie pendenze',
    description:
      'Guida completa allo Straccia Bollo della Regione Siciliana: chi può regolarizzare i bolli auto non pagati fino al 31 dicembre 2025 senza sanzioni né interessi, le scadenze del 31 ottobre 2026 e come verificare la propria auto con AutoEsperto.',
    published: '2026-08-27',
    category: 'valutazione',
    cta: 'auto-usata-affare',
    sections: [
      {
        heading: 'Cos\'è lo Straccia Bollo Sicilia 2026 e cosa prevede la nuova legge regionale',
        paragraphs: [
          'La Regione Siciliana ha approvato e pubblicato il provvedimento straordinario denominato "Straccia Bollo", una misura di agevolazione fiscale pensata per permettere a migliaia di automobilisti e motociclisti residenti in Sicilia di regolarizzare i pagamenti arretrati della tassa automobilistica senza applicazione di sanzioni amministrative e interessi di mora.',
          'La norma consente un risparmio compreso tra il 30% e il 45% rispetto all\'importo originariamente contestato dalle cartelle o dagli avvisi di accertamento della Regione.',
        ],
      },
      {
        heading: '1. Chi può beneficiarne e quali annualità sono coperte',
        paragraphs: [
          'L\'agevolazione riguarda tutti i proprietari di autoveicoli e motoveicoli iscritti nei registri tributari della Regione Siciliana per i periodi tributari scaduti fino al 31 dicembre 2025.',
          '• Sono incluse le tasse automobilistiche regionali non pagate o pagate solo parzialmente.',
          '• Il contribuente è tenuto a versare unicamente la quota capitale della tassa originaria, vedendosi azzerare totalmente le sovrattasse per ritardato pagamento e gli interessi legali maturati negli anni.',
          '• Il termine ultimo per presentare l\'adesione ed effettuare il versamento liberatorio è fissato al 31 ottobre 2026, secondo le disposizioni dei decreti attuativi dell\'Assessorato all\'Economia.',
        ],
      },
      {
        heading: '2. Come effettuare il pagamento agevolato',
        paragraphs: [
          'Il pagamento potrà essere eseguito attraverso i canali PagoPA dedicati della Regione Siciliana, gli uffici e delegazioni territoriali ACI (Automobile Club d\'Italia), le agenzie di pratiche auto telematiche (STA) e i punti Mooney/Lottomatica abilitati sul territorio.',
          'È consigliabile richiedere sempre la quietanza con l\'indicazione espressa della causale "Regolarizzazione Tassa Auto L.R. Sicilia - Straccia Bollo 2026" per evitare contestazioni successive.',
        ],
      },
      {
        heading: '3. Cartelle esattoriali e fermi amministrativi: cosa succede',
        paragraphs: [
          'Per i carichi già affidati all\'Agente della Riscossione (es. Agenzia delle Entrate - Riscossione), il pagamento della quota capitale consente la cancellazione delle procedure esecutive in corso e lo sblocco dei fermi amministrativi (le cosiddette "ganasce fiscali") iscritti sui veicoli, ripristinando la piena commerciabilità dell\'auto.',
        ],
      },
      {
        heading: '4. Prima di comprare un\'auto usata in Sicilia: il controllo dei bolli arretrati',
        paragraphs: [
          'Se stai valutando l\'acquisto di un\'auto usata immatricolata in Sicilia, è fondamentale verificare che il precedente proprietario sia in regola con i bolli o abbia aderito alla sanatoria per evitare che l\'auto sia gravata da fermi amministrativi che impediscono la circolazione e il passaggio di proprietà.',
          'Su AutoEsperto puoi analizzare qualsiasi vettura con il nostro sistema di verifica del valore, checklist documentale e profilo digitale pre-acquisto per acquistare in totale trasparenza e sicurezza.',
        ],
      },
      {
        heading: 'Domande frequenti sullo Straccia Bollo Sicilia',
        paragraphs: [
          'Ecco le risposte ai dubbi più comuni sulla misura agevolativa:',
        ],
        list: [
          'Chi ha già pagato sanzioni in passato ha diritto a un rimborso? No, la legge non prevede rimborsi per somme già versate a titolo di sanzione o interesse prima dell\'entrata in vigore della sanatoria.',
          'Qual è la scadenza per aderire allo Straccia Bollo? La scadenza indicata dalla norma regionale è il 31 ottobre 2026.',
          'Posso vendere l\'auto se aderisco allo Straccia Bollo? Sì, non appena effettuato il saldo della quota capitale e registrato lo sblocco del fermo amministrativo, l\'auto può essere venduta o radiata regolarmente.',
        ],
      },
    ],
  },
  {
    slug: 'le-10-auto-piu-rubate-italia-2026',
    title: 'Le 10 auto più rubate in Italia nel 2026: la classifica e come difendersi',
    description:
      'Classifica aggiornata 2026 delle 10 auto più rubate in Italia: dalla Fiat Panda alla Jeep Renegade, i dati ufficiali del Ministero dell\'Interno, le regioni a rischio e le tecniche di furto più diffuse.',
    published: '2026-08-27',
    category: 'affidabilita',
    cta: 'controllare-auto-usata',
    sections: [
      {
        heading: 'I numeri del fenomeno furti in Italia nel 2026',
        paragraphs: [
          'I dati diffusi dal Ministero dell\'Interno evidenziano oltre 120.000 furti d\'auto annui in Italia, con una media impressionante di più di 300 veicoli sottratti ogni giorno. Il mercato nero non risparmia né utilitarie né SUV moderni, guidato dalla fame insaziabile di componenti di ricambio a basso costo.',
        ],
      },
      {
        heading: '1. La Top 10 delle auto più rubate in Italia',
        paragraphs: [
          'Ecco la classifica dei modelli con il maggior numero di denunce registrate:',
          '1. Fiat Panda: regina incontrastata delle vendite e purtroppo anche dei furti (oltre 21.000 denunce annue).',
          '2. Fiat 500: bersaglio primario sia per furto intero che per la cannibalizzazione di fari e plancia.',
          '3. Lancia Ypsilon: popolarissima tra i giovani e facilissima da smembrare per ricambi di carrozzeria.',
          '4. Fiat Punto: ancora diffusissima nel parco circolante e ricercata per motori e cambi.',
          '5. Jeep Renegade: il SUV compatto più sottratto in assoluto per mercato estero e centraline.',
          '6. Fiat 500X: condivide telaio e componenti elettronici con la Renegade.',
          '7. Renault Clio: tra le straniere più colpite, specialmente per i motori dCi e sistemi multimediali.',
          '8. Smart Fortwo: ricercatissima nei centri metropolitani per furti lampo e pezzi carrozzeria.',
          '9. Volkswagen Golf: da sempre nel mirino per gruppi ottici LED, cerchi in lega e volanti sportivi.',
          '10. Nissan Qashqai: tra i crossover usati più richiesti per la componentistica meccanica.',
        ],
      },
      {
        heading: '2. Le regioni più colpite dai furti d\'auto',
        paragraphs: [
          'Oltre l\'80% dei furti nazionali si concentra in cinque regioni chiave: Campania, Lazio, Puglia, Sicilia e Lombardia. Nelle aree metropolitane di Napoli, Roma, Bari, Milano e Catania, il tasso di rischio per chi parcheggia su strada aperta è quadruplo rispetto alla media nazionale.',
        ],
      },
      {
        heading: '3. Come proteggere la tua auto e cosa fare prima dell\'acquisto',
        paragraphs: [
          'Per difenderti: combina sempre un antifurto meccanico (bloccasterzo blindato sul piantone) con un sistema di protezione per la presa diagnostica OBD e un localizzatore GPS autoalimentato.',
          'Se stai acquistando un\'auto usata appartenente alla Top 10, usa AutoEsperto per scansionare il veicolo, verificare la congruità del prezzo e controllare che non sia stato ricostruito con pezzi non tracciabili.',
        ],
      },
    ],
  },
  {
    slug: 'bollo-auto-sicilia-2026-chi-paga-esenzioni',
    title: 'Bollo auto Sicilia 2026: calcolo tariffe per kW, esenzioni ibride/elettriche e scadenze',
    description:
      'Guida completa al bollo auto in Sicilia nel 2026: calcolo importi in base ai kW e classe ambientale, esenzioni per auto elettriche, ibride, legge 104 e veicoli storici.',
    published: '2026-08-27',
    category: 'valutazione',
    cta: 'auto-svalutazione',
    sections: [
      {
        heading: 'Come si calcola il bollo auto in Sicilia nel 2026',
        paragraphs: [
          'Il bollo auto è un tributo regionale di possesso gestito direttamente dalla Regione Siciliana. L\'importo dipende dalla potenza del veicolo espressa in kilowatt (kW, indicata alla voce P.2 della carta di circolazione o Documento Unico) e dalla classe di emissioni Euro.',
        ],
      },
      {
        heading: '1. Tabella delle tariffe per kW in Sicilia',
        paragraphs: [
          '• Euro 6, Euro 5 ed Euro 4: tariffa base di 2,58 €/kW fino a 53 kW; per ogni kW eccedente i 53 kW la tariffa sale a 3,87 €/kW.',
          '• Euro 3: 2,70 €/kW fino a 53 kW, e 4,05 €/kW oltre i 53 kW.',
          '• Euro 2: 2,80 €/kW fino a 53 kW, e 4,20 €/kW oltre i 53 kW.',
          '• Superbollo: per le vetture con potenza superiore a 185 kW (250 CV) si applica l\'addizionale erariale di 20 € per ogni kW eccedente, ridotta gradualmente dopo 5, 10 e 15 anni dalla costruzione.',
        ],
      },
      {
        heading: '2. Esenzioni totali e parziali previste in Sicilia',
        paragraphs: [
          '• Auto 100% Elettriche (BEV): esenzione totale dal pagamento del bollo per 5 anni dalla data di prima immatricolazione. Dal sesto anno in poi si beneficia di una riduzione del 75% della tariffa corrispondente.',
          '• Auto Ibride (HEV / PHEV): esenzioni temporanee o riduzioni a seconda della data di immatricolazione e delle direttive regionali vigenti.',
          '• Esenzione Disabili (Legge 104/92): esenzione permanente per veicoli fino a 2.000 cc benzina, 2.800 cc diesel o 150 kW elettrici destinati a persone con ridotte o impedite capacità motorie.',
          '• Veicoli Storici ultra-trentennali (ASI): esenzione totale dal bollo di possesso; è dovuta una tassa di circolazione forfettaria di circa 25,82 € solo in caso di effettivo utilizzo su strada pubblica.',
        ],
      },
      {
        heading: '3. Come calcolare i costi di gestione della tua auto',
        paragraphs: [
          'Prima di scegliere la tua prossima auto, calcola il costo totale di possesso (TCO) su AutoEsperto: inserisci marca, modello e allestimento per conoscere subito bollo stimato, consumi reali, costi di manutenzione e svalutazione.',
        ],
      },
    ],
  },
  {
    slug: 'diesel-benzina-ibrida-2026-quale-comprare-conviene',
    title: 'Diesel, benzina o ibrida nel 2026? Quale conviene comprare per costi e svalutazione',
    description:
      'Guida alla scelta della motorizzazione nel 2026: diesel vs benzina vs full hybrid vs plug-in. Calcolo chilometrico di convenienza, costi di carburante, blocchi ambientali e valore di rivendita.',
    published: '2026-08-27',
    category: 'acquisto',
    cta: 'auto-usata-affare',
    sections: [
      {
        heading: 'Il grande dilemma dell\'acquisto auto nel 2026',
        paragraphs: [
          'Scegliere tra diesel, benzina o ibrida oggi non è solo una questione di gusti personali: con l\'evoluzione delle normative sulle emissioni, i blocchi del traffico nelle città e le oscillazioni dei prezzi del carburante, la scelta sbagliata può costare migliaia di euro in svalutazione anticipata.',
        ],
      },
      {
        heading: '1. Quando conviene comprare un\'auto Diesel nel 2026',
        paragraphs: [
          'Il motore a gasolio resta insuperabile per chi percorre oltre 20.000 - 25.000 km all\'anno, soprattutto su tratte autostradali ed extraurbane. Un motore Diesel moderno Euro 6d consuma fino al 30% in meno rispetto a un benzina di pari potenza e garantisce un\'autonomia elevata.',
          'Attenzione però: se usi l\'auto prevalentemente in città o per tragitti brevi sotto i 10 km, il filtro antiparticolato (DPF/FAP) tenderà a intasarsi rapidamente e il valore dell\'usato nei centri urbani sarà soggetto a limitazioni.',
        ],
      },
      {
        heading: '2. Quando scegliere il Benzina o Mild Hybrid',
        paragraphs: [
          'Il motore benzina (o Mild Hybrid 12V/48V) è la scelta perfetta per percorrenze annuali inferiori a 15.000 km, guida mista o prettamente urbana. I costi di acquisto iniziale e di manutenzione ordinaria sono più bassi rispetto al diesel, e non si hanno problemi di rigenerazione filtri o additivi AdBlue.',
        ],
      },
      {
        heading: '3. Full Hybrid (HEV): il miglior compromesso qualità/prezzo',
        paragraphs: [
          'La tecnologia Full Hybrid (come il sistema Toyota o Renault E-Tech) si ricarica da sola durante le frenate e le decelerazioni. Nel traffico cittadino consente di viaggiare fino al 50% del tempo in modalità puramente elettrica, abbattendo drasticamente i consumi (fino a 22-25 km/l reali) e mantenendo una tenuta di valore eccezionale sul mercato dell\'usato.',
        ],
      },
      {
        heading: '4. Fai il confronto su AutoEsperto',
        paragraphs: [
          'Usa il tool di confronto modelli di AutoEsperto per mettere a confronto fianco a fianco due motorizzazioni: potrai confrontare consumi reali, costi di gestione a 5 anni e indice di tenuta del prezzo.',
        ],
      },
    ],
  },
  {
    slug: 'migliori-auto-usate-10000-euro-2026',
    title: 'Le 10 auto usate migliori da comprare con 10.000 € nel 2026: affidabili e moderne',
    description:
      'Guida alle 10 migliori auto usate sotto i 10.000 euro nel 2026: modelli affidabili, economici da mantenere e con consumi contenuti, selezionati dall\'algoritmo di AutoEsperto.',
    published: '2026-08-27',
    category: 'acquisto',
    cta: 'auto-usata-affare',
    sections: [
      {
        heading: 'Cosa si può comprare oggi con un budget di 10.000 euro',
        paragraphs: [
          'Con un budget di 10.000 euro nel mercato dell\'usato del 2026 è possibile trovare ottime utilitarie e compatte di segmento B e C prodotte tra il 2015 e il 2021, con chilometraggi compresi tra 60.000 e 110.000 km, perfette per famiglie, neopatentati o pendolari.',
        ],
      },
      {
        heading: '1. Le 10 migliori scelte sotto i 10.000 €',
        paragraphs: [
          '1. Fiat Panda 1.2 Fire / 1.0 Hybrid (2017-2021): la regina dell\'usato italiano, ricambi ovunque a costi irrisori e meccanica indistruttibile.',
          '2. Renault Clio 0.9 TCe / 1.5 dCi (2016-2019): design accattivante, interni confortevoli e motore diesel campione di consumi (23 km/l).',
          '3. Toyota Yaris 1.5 Hybrid (2015-2018): affidabilità giapponese senza eguali, cambio automatico e consumi record in città.',
          '4. Volkswagen Polo 1.0 TSI / 1.4 TDI (2015-2018): qualità costruttiva tedesca, insonorizzazione eccellente e grande tenuta del valore.',
          '5. Ford Fiesta 1.1 / 1.0 EcoBoost (2017-2020): dinamica di guida eccellente, ottima dotazione tecnologica di sicurezza.',
          '6. Dacia Sandero Stepway (2018-2021): assetto rialzato, spazio generoso per i bagagli e grande robustezza per strade sconnesse.',
          '7. Peugeot 208 PureTech / BlueHDi (2016-2019): stile moderno, i-Cockpit futuristico e ottima guidabilità.',
          '8. Hyundai i20 (2016-2019): affidabilità comprovata, garanzia di fabbrica estesa e costi di manutenzione molto bassi.',
          '9. Fiat 500 1.2 Lounge (2016-2019): icona di stile, costi di gestione minimi e facilissima da rivendere in qualunque momento.',
          '10. Opel Corsa 1.2 / 1.4 GPL (2016-2019): ottima abitabilità, economica da rifornire con l\'impianto a gas di serie.',
        ],
      },
      {
        heading: '2. Come trovare l\'occasione perfetta senza rischi',
        paragraphs: [
          'Prima di versare una caparra per un\'auto da 10.000 euro, analizzala gratuitamente con lo scanner di AutoEsperto: verifica se il prezzo richiesto è in linea con gli annunci reali di tutta Italia ed esegui i controlli della nostra checklist anti-fregature.',
        ],
      },
    ],
  },
  {
    slug: 'auto-usate-che-perdono-piu-valore-2026',
    title: 'Le auto usate che stanno perdendo più valore nel 2026: la classifica del deprezzamento',
    description:
      'Analisi della svalutazione auto nel 2026: quali modelli e alimentazioni perdono più valore sul mercato dell\'usato, perché crollano i prezzi e come sfruttare la svalutazione a proprio vantaggio.',
    published: '2026-08-27',
    category: 'valutazione',
    cta: 'auto-svalutazione',
    sections: [
      {
        heading: 'La svalutazione non è uguale per tutti',
        paragraphs: [
          'Se in media un\'auto nuova perde circa il 20-25% del valore nel primo anno e il 50% dopo quattro anni, ci sono modelli che mantengono quasi intatto il proprio prezzo e altri che subiscono veri e propri crolli verticali di quotazione.',
        ],
      },
      {
        heading: '1. I segmenti e modelli con la maggiore perdita di valore nel 2026',
        paragraphs: [
          '• Grandi berline di rappresentanza e ammiraglie (es. Audi A6, BMW Serie 5, Mercedes Classe E): a causa di bollo elevato, manutenzioni costose e preferenza del mercato per i SUV, perdono fino al 65% del prezzo di listino dopo soli 4 anni.',
          '• Vetture Elettriche (BEV) di prima generazione: modelli con batterie piccole, ricarica lenta o degrado chimico precoce soffrono la concorrenza delle nuove generazioni con maggiore autonomia.',
          '• Grandi SUV a benzina o diesel di grossa cilindrata (oltre 2.500 cc): penalizzati dai costi di gestione, assicurazione e consumi elevati.',
          '• Diesel Euro 5 nei grandi centri urbani: soggetti a blocchi della circolazione nei mesi invernali in Lombardia, Piemonte, Veneto ed Emilia-Romagna.',
        ],
      },
      {
        heading: '2. Come trasformare la svalutazione in un grande affare',
        paragraphs: [
          'Chi acquista un\'auto usata che ha già subito il picco di svalutazione nei primi 3-5 anni può portarsi a casa vetture di segmento premium a una frazione del costo originario, a patto di verificarne accuratamente la salute meccanica.',
          'Usa il tool di valutazione di AutoEsperto per visualizzare la curva di deprezzamento storica e futura di qualsiasi marca e modello.',
        ],
      },
    ],
  },
  {
    slug: 'quanto-vale-fiat-panda-usata-2026',
    title: 'Quanto vale una Fiat Panda usata nel 2026? Quotazioni reali, allestimenti e prezzi',
    description:
      'Quotazioni reali per Fiat Panda usata dal 2012 al 2025: fasce di prezzo per 1.2 Benzina, 1.0 Hybrid, 1.3 Multijet e 4x4, punti critici da controllare e stima su AutoEsperto.',
    published: '2026-08-27',
    category: 'valutazione',
    cta: 'auto-svalutazione',
    sections: [
      {
        heading: 'Perché la Fiat Panda è l\'usato con la tenuta di valore più alta',
        paragraphs: [
          'La Fiat Panda è la vettura più venduta in Italia da oltre dodici anni consecutivi. Questa enorme popolarità si riflette direttamente sul mercato dell\'usato: la domanda è sempre superiore all\'offerta, e le svalutazioni annuali sono tra le più basse dell\'intero panorama automotive.',
        ],
      },
      {
        heading: '1. Tabella quotazioni medie Fiat Panda usata nel 2026',
        paragraphs: [
          '• Fiat Panda (2012-2015): 4.000 € – 6.500 € (motori 1.2 Fire 69cv e 1.3 MJet 75cv con oltre 120.000 km).',
          '• Fiat Panda (2016-2019): 6.800 € – 9.500 € (allestimenti Pop, Easy, Lounge con 60.000-100.000 km).',
          '• Fiat Panda 1.0 FireFly Hybrid (2020-2024): 9.800 € – 13.500 € (versioni Mild Hybrid ideali per centri urbani).',
          '• Fiat Panda 4x4 e Cross (2014-2023): 10.500 € – 17.500 € (trazione integrale molto ricercata in montagna, quotazioni stabilissime).',
        ],
      },
      {
        heading: '2. Cosa controllare prima di comprare una Panda usata',
        paragraphs: [
          '• Frizione e cambio manuale: verifica che la retromarcia entri senza grattare e che il pedale non sia eccessivamente duro.',
          '• Servosterzo elettrico Dualdrive (tasto City): controlla che non si accenda la spia rossa dello sterzo in manovra.',
          '• Ammortizzatori posteriori e braccetti: nei percorsi cittadini con buche possono presentare giochi o rumori metallici.',
        ],
      },
      {
        heading: '3. Calcola il valore esatto della tua Panda',
        paragraphs: [
          'Inserisci targa, anno e chilometri su AutoEsperto per scoprire in pochi secondi il prezzo medio reale calcolato su migliaia di annunci attualmente in vendita in Italia.',
        ],
      },
    ],
  },
  {
    slug: 'quanto-vale-fiat-500-usata-2026-prezzi-controlli',
    title: 'Quanto vale una Fiat 500 usata nel 2026? Prezzi reali, motorizzazioni e cosa controllare',
    description:
      'Guida alle quotazioni reali della Fiat 500 usata nel 2026: prezzi medi per 1.2 Fire, 1.0 Hybrid, 1.3 Multijet e Cabrio 500C, difetti noti e come evitare truffe.',
    published: '2026-08-27',
    category: 'valutazione',
    cta: 'auto-svalutazione',
    sections: [
      {
        heading: 'Il valore di un\'icona senza tempo',
        paragraphs: [
          'La Fiat 500 non è solo una citycar, ma un\'icona di design che attrae acquirenti di tutte le età. Sul mercato dell\'usato conserva quotazioni superiori rispetto alla media del segmento A.',
        ],
      },
      {
        heading: '1. Fasce di prezzo per anno di immatricolazione',
        paragraphs: [
          '• 2012-2015 (Pre-Restyling): 5.500 € – 7.500 € per versioni Pop e Lounge 1.2 benzina.',
          '• 2016-2019 (Restyling con fari lenticolari e Uconnect): 7.800 € – 10.800 €.',
          '• 2020-2024 (1.0 Hybrid e allestimenti Dolcevita / Cult): 10.500 € – 14.500 €.',
          '• Versioni 500C (Cabrio) e Abarth 595: quotazioni maggiorate dal 15% al 40% a parità di anno e condizioni.',
        ],
      },
      {
        heading: '2. I punti deboli da verificare prima dell\'acquisto',
        paragraphs: [
          '• Fascio cavi portellone bagagliaio: l\'apertura frequente può logorare i cavi elettrici provocando malfunzionamenti allo sbrinatore o alle luci targa.',
          '• Quadro strumenti digitale TFT (se presente): verifica che non ci siano pixel spenti o lampeggi.',
          '• Stato capote in tela (su 500C): ispeziona le guide di scorrimento e l\'assenza di infiltrazioni d\'acqua nel baule.',
        ],
      },
      {
        heading: '3. Verifica la quotazione su AutoEsperto',
        paragraphs: [
          'Controlla subito la scheda di valutazione dedicata alla Fiat 500 su AutoEsperto: confronta allestimenti, consumi reali e stima di mercato gratuita.',
        ],
      },
    ],
  },
  {
    slug: '5-cose-da-controllare-prima-comprare-auto-usata',
    title: '5 cose fondamentali da controllare prima di comprare un\'auto usata (guida anti-fregature)',
    description:
      'La checklist indispensabile in 5 passaggi per verificare un\'auto usata da privato o concessionario: chilometri scalati, incidenti nascosti, documentazione e test drive.',
    published: '2026-08-27',
    category: 'acquisto',
    cta: 'controllare-auto-usata',
    sections: [
      {
        heading: 'Comprare un\'auto usata senza brutte sorprese',
        paragraphs: [
          'L\'acquisto di un\'auto usata può trasformarsi in un ottimo affare o in un incubo economico se non si effettuano i controlli preventivi giusti. Ecco i 5 controlli irrinunciabili da eseguire prima di firmare o versare una caparra.',
        ],
      },
      {
        heading: '1. Verifica storica chilometri e revisioni ministeriali',
        paragraphs: [
          'Consulta il Portale dell\'Automobilista per verificare i chilometri registrati all\'ultima revisione periodica obbligatoria. Se l\'auto ha meno chilometri rispetto alla revisione di due anni prima, sei davanti a un\'evidente manomissione del contachilometri.',
        ],
      },
      {
        heading: '2. Ispezione visiva: fessure, verniciatura e cristalli',
        paragraphs: [
          'Cammina attorno all\'auto alla luce del sole. Le fessure tra cofano, parafanghi e portiere devono essere uniformi e simmetriche su entrambi i lati. Controlla le scritte sui vetri (DOT): devono riportare tutte lo stesso anno di fabbricazione; un finestrino con anno diverso indica una sostituzione per furto o incidente.',
        ],
      },
      {
        heading: '3. Controllo fluidi nel vano motore a freddo',
        paragraphs: [
          'Apri il cofano con motore spento e freddo: svita il tappo di rabbocco dell\'olio motore per verificare che non ci sia una schiuma color nocciola ("effetto maionese"), tipico sintomo di guarnizione di testa bruciata o trafilaggio di liquido refrigerante.',
        ],
      },
      {
        heading: '4. Usura coerente dell\'abitacolo',
        paragraphs: [
          'Un\'auto con soli 60.000 km dichiarati non può avere la corona del volante consumata fino alla gomma grezza, i pedali di frizione/freno lisci e il fianchetto del sedile guidatore strappato. L\'usura degli interni deve essere sempre proporzionata ai chilometri indicati.',
        ],
      },
      {
        heading: '5. Prova su strada con radio spenta e finestrini chiusi',
        paragraphs: [
          'Guida su asfalto irregolare per ascoltare rumori di braccetti e ammortizzatori. In rettilineo, lascia dolcemente il volante per verificare che l\'auto non tiri da un lato (convergenza o telaio storto) e premi a fondo sul pedale del freno.',
        ],
      },
      {
        heading: 'Usa lo Scanner di AutoEsperto',
        paragraphs: [
          'Carica le foto dell\'annuncio su AutoEsperto per ricevere un report istantaneo con identificazione modello, stima di prezzo di mercato e checklist dei punti deboli specifici per quella vettura.',
        ],
      },
    ],
  },
  {
    slug: 'auto-usata-100000-km-conviene-comprare',
    title: 'Auto usata con 100.000 km: conviene comprarla nel 2026? La verità su durata e manutenzione',
    description:
      'Ha ancora senso acquistare un\'auto usata con 100.000 km? Quali motori durano oltre 300.000 km, quali componenti sostituire e come trattare sul prezzo.',
    published: '2026-08-27',
    category: 'acquisto',
    cta: 'auto-usata-affare',
    sections: [
      {
        heading: 'Il mito psicologico dei 100.000 km',
        paragraphs: [
          'Per molti automobilisti la soglia dei 100.000 km rappresenta ancora un confine psicologico insuperabile. Ma con la tecnologia dei motori moderni, un\'auto con 100.000 km regolarmente tagliandata ha spesso superato appena un terzo della sua vita utile.',
        ],
      },
      {
        heading: '1. I motori che superano i 300.000 km senza difficoltà',
        paragraphs: [
          '• 1.2 Fire Benzina (Fiat): semplicità costruttiva, manutenzione minima e longevità proverbiale.',
          '• 1.5 dCi Diesel (Renault / Dacia / Nissan / Mercedes): uno dei migliori motori diesel a 8 valvole della storia, parco nei consumi e affidabilissimo.',
          '• 1.4 D-4D e 1.5 Hybrid (Toyota): distribuzioni a catena indistruttibili con cambio e-CVT privo di frizione tradizionale.',
          '• 1.6 / 2.0 TDI (Gruppo Volkswagen): se tagliandati con olio di qualità ad alto potere lubrificante.',
        ],
      },
      {
        heading: '2. I componenti che richiedono manutenzione straordinaria a 100.000 km',
        paragraphs: [
          'A questo chilometraggio metti in conto (o verifica nelle fatture che siano già stati sostituiti):',
          '• Cinghia di distribuzione e pompa dell\'acqua (intervallo tipico 5-6 anni o 100.000-120.000 km).',
          '• Ammortizzatori anteriori e posteriori.',
          '• Dischi e pastiglie freno.',
          '• Batteria dei servizi a 12V.',
        ],
      },
      {
        heading: '3. Come usare i 100.000 km nella trattativa',
        paragraphs: [
          'Se il venditore non è in grado di dimostrare la sostituzione della cinghia di distribuzione o dei freni, puoi richiedere legittimamente uno sconto di 500 € – 1.000 € sul prezzo esposto.',
          'Valuta l\'auto su AutoEsperto per scoprire la quotazione corretta parametrata esattamente al chilometraggio dichiarato.',
        ],
      },
    ],
  },
  {
    slug: 'come-capire-se-auto-usata-incidentata',
    title: 'Come capire se un\'auto usata è stata incidentata: i 7 indizi nascosti da cercare',
    description:
      'Come smascherare un\'auto usata incidentata prima di comprarla: fessure disallineate, punti di saldatura non originali, date dei vetri e fari asimmetrici.',
    published: '2026-08-27',
    category: 'acquisto',
    cta: 'controllare-auto-usata',
    sections: [
      {
        heading: 'Perché i venditori nascondono i danni strutturali',
        paragraphs: [
          'Un sinistro stradale grave può compromettere la rigidità torsionale del telaio, l\'efficacia degli airbag e la sicurezza complessiva dei passeggeri. Riconoscere un veicolo riparato male evita acquisti pericolosi ed esborsi ingenti.',
        ],
      },
      {
        heading: 'I 7 indizi per scoprire un incidente nascosto',
        paragraphs: [
          '1. Spessori e fessure asimmetriche: confronta sempre lo spazio tra cofano e faro sinistro con quello tra cofano e faro destro.',
          '2. Bulloni di fissaggio dei parafanghi nel vano motore: se la vernice attorno ai dadi è scheggiata o ci sono segni di cacciaviti, il pannello è stato smontato o sostituito.',
          '3. Codici e numeri di serie dei cristalli: tutti i finestrini e parabrezza devono riportare la medesima numerazione e marchio del costruttore.',
          '4. Cordoni di sigillatura sui duomi e nel vano ruota di scorta: in fabbrica il silicone è steso da robot industriali con precisione millimetrica; cordoni irregolari indicano riparazioni artigianali post-urto.',
          '5. Fari anteriori di colore o brillantezza differente: un faro nuovo trasparente e uno ingiallito dal sole indicano che l\'auto è stata urtata su un solo lato.',
          '6. Verniciatura con effetto "buccia d\'arancia" o polvere sotto trasparente.',
          '7. Spie airbag o ABS che si spengono contemporaneamente: trucchi usati da venditori scorretti per mascherare airbag scoppiati e mai rimpiazzati.',
        ],
      },
      {
        heading: 'Proteggiti con l\'analisi AI di AutoEsperto',
        paragraphs: [
          'Carica le foto dell\'auto su AutoEsperto: la nostra intelligenza artificiale esamina le immagini esterne segnalando difetti, incongruenze e anomalie prima di recarti sul posto.',
        ],
      },
    ],
  },
  {
    slug: 'diesel-euro-5-2026-posso-ancora-comprarlo-blocchi',
    title: 'Diesel Euro 5 nel 2026: posso ancora comprarlo? Blocchi del traffico, Move-In e prezzi',
    description:
      'Conviene comprare un\'auto diesel Euro 5 nel 2026? Normative sui blocchi invernali in Pianura Padana e grandi città, scatola nera Move-In, crollo dei prezzi e svalutazione.',
    published: '2026-08-27',
    category: 'acquisto',
    cta: 'auto-usata-affare',
    sections: [
      {
        heading: 'La situazione dei motori Diesel Euro 5 in Italia nel 2026',
        paragraphs: [
          'I motori Diesel Euro 5 (immatricolati tra il 2011 e il 2015) sono tra i più diffusi ed efficienti mai prodotti, ma subiscono restrizioni crescenti alla circolazione nelle aree ad alta densità abitativa.',
        ],
      },
      {
        heading: '1. Dove ci sono i blocchi e dove si può circolare liberamente',
        paragraphs: [
          '• Grandi città e Pianura Padana: in Lombardia, Piemonte, Veneto ed Emilia-Romagna, così come nelle Zone a Traffico Limitato (Area B di Milano, Fascia Verde di Roma), i diesel Euro 5 sono soggetti a limitazioni orarie nei mesi invernali (da ottobre a marzo).',
          '• Nel resto d\'Italia, piccoli centri e autostrade: la circolazione è assolutamente libera e non ci sono divieti generalizzati.',
        ],
      },
      {
        heading: '2. Il dispositivo Move-In per chi percorre pochi chilometri',
        paragraphs: [
          'Nelle regioni del bacino padano è possibile installare la scatola nera telematica "Move-In" (Monitoraggio Veicoli Inquinanti), che concede un tetto di chilometri annuali (es. 8.000 - 10.000 km) utilizzabili senza vincoli di orario o giorno.',
        ],
      },
      {
        heading: '3. Il crollo dei prezzi: un\'opportunità per chi vive fuori dai grandi centri',
        paragraphs: [
          'A causa delle restrizioni cittadine, le quotazioni dei diesel Euro 5 sono scese notevolmente: per chi vive in provincia, al Sud, nelle isole o viaggia principalmente su strade extraurbane e autostrade, rappresentano oggi il miglior rapporto qualità/prezzo del mercato dell\'usato.',
        ],
      },
      {
        heading: '4. Verifica le restrizioni su AutoEsperto',
        paragraphs: [
          'Consulta la sezione Blocchi del Traffico su AutoEsperto per conoscere in dettaglio la classe ambientale del modello che vuoi acquistare e le deroghe attive.',
        ],
      },
    ],
  },
  {
    slug: 'quanto-costa-mantenere-auto-2026-spese-reali',
    title: 'Quanto costa mantenere davvero un\'auto nel 2026? La spesa annuale reale che nessuno calcola',
    description:
      'Calcolo dettagliato dei costi fissi e variabili per mantenere un\'utilitaria o un SUV nel 2026: bollo, assicurazione RC, carburante, tagliandi ordinari, revisione e svalutazione.',
    published: '2026-08-27',
    category: 'valutazione',
    cta: 'auto-svalutazione',
    sections: [
      {
        heading: 'Il costo reale di possesso (TCO) di un\'automobile',
        paragraphs: [
          'Quando si acquista un\'auto ci si concentra quasi sempre solo sul prezzo di listino o sulle rate mensili. Tuttavia, la spesa effettiva per mantenere un\'auto comprende costi fissi, costi variabili legati all\'uso e la perdita di valore nel tempo.',
        ],
      },
      {
        heading: '1. I costi fissi annuali',
        paragraphs: [
          '• Bollo auto regionale: varia da 150 € a oltre 400 € a seconda dei kW e della classe Euro.',
          '• Assicurazione RCA + tutela legale/assistenza stradale: da 350 € (classi di merito virtuose) fino a 1.200 € nelle province a maggior sinistrosità.',
          '• Revisione ministeriale periodica: 79,02 € ogni due anni (circa 40 €/anno).',
        ],
      },
      {
        heading: '2. I costi variabili (calcolati su 15.000 km/anno)',
        paragraphs: [
          '• Carburante: circa 1.300 € – 1.800 € all\'anno a seconda dei consumi medi del modello (15-20 km/litro).',
          '• Tagliando ordinario (olio, filtri, candele/candelette): 180 € – 350 € annui.',
          '• Cambio treno gomme: 350 € – 600 € ogni 40.000 km (circa 150 €/anno).',
        ],
      },
      {
        heading: '3. Il costo nascosto più grande: la svalutazione',
        paragraphs: [
          'La svalutazione erode tra il 10% e il 20% del valore residuo del veicolo ogni anno. Nel complesso, mantenere un\'utilitaria usata costa tra 2.800 € e 3.600 € all\'anno; un SUV compatto moderno supera facilmente i 4.800 € annui.',
        ],
      },
      {
        heading: '4. Tieni traccia dei costi con il Profilo Digitale AutoEsperto',
        paragraphs: [
          'Registra la tua auto sul Passaporto Digitale di AutoEsperto per memorizzare tagliandi, scadenze bollo/revisione e monitorare l\'andamento del valore di mercato nel tempo.',
        ],
      },
    ],
  },
  {
    slug: '10-auto-piu-affidabili-usate-2026',
    title: 'Le 10 auto più affidabili da comprare usate nel 2026: classifica e motori indistruttibili',
    description:
      'Classifica delle 10 auto usate più affidabili in Italia nel 2026: indici di guasto minimi, motori a catena indistruttibili e bassi costi di ricambi, basata su dati reali di officina.',
    published: '2026-08-27',
    category: 'affidabilita',
    cta: 'auto-affidabili-2026',
    sections: [
      {
        heading: 'Come si misura l\'affidabilità reale di un\'auto usata',
        paragraphs: [
          'Un\'auto affidabile non è solo un\'auto che non si ferma mai per strada, ma un veicolo con impianto elettrico solido, assenza di difetti congeniti al motore o al cambio e componenti di usura a prezzi accessibili.',
        ],
      },
      {
        heading: '1. La classifica delle 10 auto usate più affidabili nel 2026',
        paragraphs: [
          '1. Toyota Yaris (Hybrid 1.5): al vertice di tutte le classifiche mondiali di affidabilità; zero cinghie di servizio, freni che durano il doppio grazie alla frenata rigenerativa.',
          '2. Honda Jazz (1.3 / 1.5 i-VTEC): motori a benzina aspirati con catena di distribuzione indistruttibile e spazio record.',
          '3. Fiat Panda (1.2 Fire 69cv): motore leggendario privo di interferenza valvole/pistoni, manutenzione eseguibile da qualsiasi meccanico con pezzi reperibili ovunque.',
          '4. Suzuki Swift (1.2 Dualjet): proverbiale robustezza meccanica giapponese con impianto ibrido leggero ed efficiente.',
          '5. Mazda 2 (1.5 Skyactiv-G): motori a 4 cilindri aspirati senza turbo, con compressione elevata e consumi contenuti.',
          '6. Volkswagen Golf 7 (1.4 TSI / 1.6 TDI post-2015): qualità costruttiva impeccabile e problemi di gioventù dei TSI completamente risolti con cinghia dentata.',
          '7. Hyundai i10 / Kia Picanto (1.0 / 1.2 MPI): tecnologia collaudata, distribuzione solida e garanzie di fabbrica fino a 7 anni.',
          '8. Dacia Duster (1.5 dCi): telaio robusto da fuoristrada leggero e motore Renault ultra-collaudato.',
          '9. Renault Clio 4 (1.5 dCi 8V): assenza di AdBlue nei modelli precedenti, frizione longeva e consumi ridotti.',
          '10. BMW Serie 3 F30 (2.0d motore B47 post-2015): la versione che ha risolto definitivamente i problemi di catena del vecchio N47.',
        ],
      },
      {
        heading: '2. Confronta l\'affidabilità su AutoEsperto',
        paragraphs: [
          'Prima di scegliere la tua prossima auto, consulta la sezione Affidabilità e Guasti su AutoEsperto: scopri i punti deboli noti, i richiami ufficiali e le opinioni degli esperti per oltre 4.000 modelli.',
        ],
      },
    ],
  },
  {
    slug: 'fiat-panda-500-rubate-sicilia-come-proteggersi',
    title: 'Fiat Panda e Fiat 500 rubate in Sicilia: perché sono nel mirino e come proteggere la tua auto',
    description:
      'Fiat Panda e Fiat 500 guidano la classifica dei furti d\'auto in Sicilia e in Italia: il business dei ricambi rubati, le tecniche usate dai ladri e le 6 difese pratiche per proteggere la tua auto.',
    published: '2026-08-27',
    category: 'manutenzione',
    cta: 'controllare-auto-usata',
    sections: [
      {
        heading: 'L\'allarme furti in Sicilia: perché Panda e 500 sono le più colpite',
        paragraphs: [
          'Secondo i dati del Ministero dell\'Interno e i report delle principali compagnie assicurative per il 2026, la Fiat Panda e la Fiat 500 si confermano stabilmente in cima alla classifica delle auto più rubate in Italia, con oltre 100.000 denunce complessive registrate sul territorio nazionale.',
          'In Sicilia il fenomeno ha raggiunto livelli di allerta particolarmente critici: le province di Catania, Palermo e Siracusa registrano uno dei tassi di furto per veicolo circolante più alti d\'Europa. Tra i modelli sottratti, quasi una vettura su tre appartiene al marchio Fiat (Panda, 500, Punto e Lancia Ypsilon).',
          'Ma cosa rende queste due utilitarie un bersaglio così costante per la criminalità organizzata e i ladri d\'auto specializzati?',
        ],
      },
      {
        heading: '1. Il business della "cannibalizzazione" e la richiesta di ricambi usati',
        paragraphs: [
          'A differenza delle supercar o dei SUV di lusso (spesso rubati su commissione per essere reimmatricolati e spediti nei mercati esteri), le utilitarie come la Fiat Panda e la Fiat 500 vengono sottratte principalmente per alimentare il fiorente mercato nero dei ricambi usati.',
          'La popolarità immensa di questi modelli in Italia — con milioni di esemplari circolanti — genera una richiesta quotidiana elevatissima di componenti di carrozzeria e meccanica per riparazioni a basso costo:',
          '• Gruppi ottici e fari LED: facili da asportare in pochi secondi e rivendibili a cifre comprese tra 200 e 500 euro a pezzo.',
          '• Paraurti anteriori, calandre e cofani motore: i pezzi più danneggiati nei piccoli urti cittadini, cercati costantemente da carrozzieri compiacenti o privati su marketplace online.',
          '• Volanti multifunzione e moduli airbag: componenti ad alto valore commerciale, asportabili senza nemmeno dover trainare via l\'automobile.',
          '• Sistemi di infotainment (Uconnect e touchscreen): facilmente smontabili dalla plancia centrale.',
          '• Catalizzatori e sonde lambda: ricercati per il recupero di metalli nobili e rari (platino, palladio e rodio).',
        ],
      },
      {
        heading: '2. Come agiscono i ladri: dalle squadre veloci alla riprogrammazione OBD',
        paragraphs: [
          'Le tecniche utilizzate per sottrarre o smontare una Fiat Panda o 500 sono diventate estremamente rapide e standardizzate:',
          '1. Lo smontaggio sul posto (Stripping express): squadre di due o tre persone agiscono in orario notturno in strade secondarie o parcheggi poco illuminati. In meno di 3-5 minuti smontano l\'intero avantreno o gli interni, lasciando la scocca sui mattoni senza far scattare sirene.',
          '2. Il furto elettronico via presa OBD-II: forzando la serratura o rompendo un deflettore, il malintenzionato si collega alla presa diagnostica di bordo (OBD-II) con un dispositivo di clonazione per programmare una chiave vergine in meno di 40 secondi, neutralizzando l\'immobilizer di serie.',
          '3. Relay Attack su versioni Keyless: per i modelli più recenti dotati di apertura e avviamento senza chiave (Keyless Go), amplificatori di segnale a radiofrequenza captano il codice della chiave custodita all\'interno dell\'abitazione del proprietario, sbloccando l\'auto senza scasso.',
        ],
      },
      {
        heading: '3. Tassi di ritrovamento in calo: la corsa contro il tempo',
        paragraphs: [
          'La percentuale di ritrovamento dei veicoli rubati in Sicilia è scesa sotto il 32%. Il motivo è la rapidità con cui opera la filiera clandestina: un\'auto rubata a Palermo o Catania viene spesso trasferita entro 2-4 ore in capannoni isolati (i cosiddetti "mattatoi delle auto") dove viene completamente smembrata in singoli pezzi non tracciabili.',
          'Una volta cancellati i numeri di serie o separati telaio e motore, il recupero da parte delle forze dell\'ordine diventa quasi impossibile.',
        ],
      },
      {
        heading: '4. Come proteggere efficacemente la tua Fiat Panda o 500: 6 difese pratiche',
        paragraphs: [
          'Nessun sistema rende un veicolo inespugnabile al 100%, ma l\'obiettivo di una buona difesa è moltiplicare il tempo e il rumore necessari per portare a termine il furto, spingendo il ladro a desistere e a cercare un bersaglio più facile:',
          '1. Installa un antifurto meccanico blindato sul piantone dello sterzo (es. Block Shaft o Defender): è il deterrente visivo e fisico più temuto, poiché richiede flessibili o attrezzi rumorosi e oltre 15 minuti di lavoro per essere forzato.',
          '2. Proteggi o sposta la presa OBD-II (OBD Blocker): installa un blocco corazzato con chiave o un connettore fittizio per impedire ai ladri di connettere computer di riprogrammazione centralina.',
          '3. Usa custodie schermate Faraday per chiavi Keyless: bloccano la propagazione delle radiofrequenze quando la chiave è in casa, neutralizzando i tentativi di furto via ponte radio.',
          '4. Installa un localizzatore GPS autonomo e autoalimentato: nascosto in punti non convenzionali del telaio (non collegato alla batteria principale), dotato di sensore di sollevamento e connettività anti-jammer.',
          '5. Parcheggia in modo strategico: preferisci aree illuminate, vicino a telecamere di sorveglianza o passaggi pedonali. Quando parcheggi lungo la strada, sterza completamente le ruote verso il marciapiede per ostacolare il caricamento rapido su carro attrezzi.',
          '6. Crea il fascicolo digitale della tua auto (Vehicle Passport su AutoEsperto): archivia foto ad alta risoluzione di dettagli unici, graffi identificativi, numero di telaio (VIN) e fatture dei ricambi. In caso di furto o ritrovamento parziale, avrai prove documentali immediate per denuncia e risarcimento assicurativo.',
        ],
      },
      {
        heading: '5. Cosa controllare se stai comprando una Fiat Panda o 500 usata',
        paragraphs: [
          'L\'alto tasso di furti e cannibalizzazioni rende fondamentale prestare la massima attenzione durante l\'acquisto di una Fiat usata da privati o commercianti non ufficiali:',
          '• Verifica la corrispondenza del telaio (VIN): controlla che il numero inciso sotto il parabrezza, sul pianale lato passeggero e nella targhetta del vano motore coincida perfettamente con il Documento Unico di Circolazione.',
          '• Controlla i componenti di carrozzeria: differenze marcate di verniciatura tra paraurti, cofano e fiancate possono indicare che l\'auto è stata ricostruita con ricambi di provenienza dubbia dopo un sinistro grave.',
          '• Ispezione pre-acquisto con AutoEsperto: prima di versare caparre o firmare contratti, incolla il link dell\'annuncio o carica le foto su AutoEsperto per verificare se il prezzo è in linea con il mercato reale, controllare la storia del modello e consultare la checklist dei punti critici.',
        ],
      },
      {
        heading: 'Domande frequenti sui furti di Fiat Panda e 500',
        paragraphs: [
          'Ecco le risposte degli esperti di AutoEsperto ai dubbi più frequenti degli automobilisti:',
        ],
        list: [
          'Qual è l\'auto più rubata in Sicilia? La Fiat Panda è stabilmente l\'auto più rubata in Sicilia e in Italia, seguita da Fiat 500, Lancia Ypsilon e Fiat Punto, principalmente a causa della forte richiesta di pezzi di ricambio nel mercato secondario.',
          'Perché i ladri rubano solo i fari e il volante della Fiat 500? I fari anteriori LED/Xeno e i volanti con airbag sono componenti costosi, veloci da asportare senza muovere l\'auto e facilmente smerciabili su canali clandestini e marketplace.',
          'Il bloccasterzo di serie della Fiat protegge dal furto? No, il bloccasterzo meccanico di fabbrica può essere forzato in pochi secondi facendo leva con una barra metallica. È sempre consigliabile installare un blocco corazzato aggiuntivo sul piantone o sui pedali.',
          'Cosa fare immediatamente dopo aver scoperto il furto? Sporgi denuncia presso Carabinieri o Polizia specificando numero di telaio, targa e segni distintivi, avvisa la compagnia assicurativa entro 3 giorni e invia il blocco del veicolo tramite l\'app del localizzatore GPS.',
        ],
      },
    ],
  },
  {
    slug: 'passaporto-digitale-veicolo-regolamento-ue-2026-1738',
    title: 'Passaporto Digitale del Veicolo (Regolamento UE 2026/1738): cos\'è, quando entra in vigore e cosa cambia per l\'usato',
    description:
      'Guida completa al nuovo Regolamento UE 2026/1738 sul Passaporto Digitale di Circolarità del Veicolo: dati obbligatori, storico chilometri, salute della batteria (SoH), date di entrata in vigore e impatto sulle compravendite di auto usate.',
    published: '2026-08-25',
    category: 'acquisto',
    cta: 'passaggio-proprieta',
    sections: [
      {
        heading: 'Il nuovo quadro normativo europeo (Regolamento UE 2026/1738)',
        paragraphs: [
          'Pubblicato nella Gazzetta Ufficiale dell\'Unione Europea il 24 luglio 2026, il Regolamento (UE) 2026/1738 introduce formalmente il Passaporto Digitale del Veicolo (Digital Vehicle Passport / DPP), una delle riforme più incisive della direttiva europea sull\'economia circolare e la tutela del consumatore nel settore automotive.',
          'La normativa risponde a una criticità storica del mercato unico dell\'usato: secondo le stime della Commissione Europea, le frodi sul contachilometri e i danni strutturali non dichiarati costano agli automobilisti europei oltre 8,7 miliardi di euro all\'anno, con un picco particolarmente elevato nelle importazioni transfrontaliere (es. vetture importate da Germania, Belgio o Francia).',
        ],
      },
      {
        heading: '1. Quali dati contiene obbligatoriamente il Passaporto Digitale',
        paragraphs: [
          'Il passaporto digitale è un fascicolo telematico unico associato al numero di telaio (VIN) del veicolo, strutturato su registri digitali interoperabili a livello unionale. Le informazioni obbligatorie comprendono:',
          '• Tracciabilità chilometrica certificata: registrazione a ogni revisione ministeriale periodica, passaggio di proprietà e intervento presso officine autorizzate, rendendo impossibile lo "schilometraggio" prima della rivendita.',
          '• Certificato State of Health (SoH) per batterie di trazione: per veicoli 100% elettrici (BEV) e ibridi plug-in (PHEV), il passaporto traccia la capacità residua reale della batteria, il numero di cicli di ricarica rapida DC effettuati e lo storico termico.',
          '• Registro interventi e riparazioni strutturali: indicazione obbligatoria di incidenti gravi che abbiano intaccato montanti, longheroni o telaio, con verifica della conformità di ripristino.',
          '• Impronta di carbonio e passaporto di circolarità: composizione dei materiali riciclabili, presenza di terre rare e conformità alle classi di emissione Euro in condizioni reali di guida (RDE).',
        ],
      },
      {
        heading: '2. Date di applicazione ed entrata in vigore graduale',
        paragraphs: [
          'L\'applicazione del Regolamento UE 2026/1738 segue una roadmap progressiva definita per consentire l\'adeguamento tecnico a costruttori, motorizzazioni e operatori:',
          '• Entrata in vigore della normativa generale: 20 giorni dalla pubblicazione in GUUE (agosto 2026).',
          '• Obbligo per i costruttori su veicoli di nuova omologazione: implementazione standardizzata del chip/QR Code di bordo e dei protocolli API entro 24 mesi.',
          '• Interconnessione registri nazionali dell\'usato (MCTC, PRA, CAR-PASS, RDW): piena operatività della banca dati europea unificata prevista per la fine della fase transitoria.',
        ],
      },
      {
        heading: '3. Cosa cambia concretamente per chi compra un\'auto usata',
        paragraphs: [
          'Per l\'acquirente privato, il passaporto digitale rappresenta una rivoluzione di trasparenza:',
          '1. Azzeramento del rischio truffe chilometriche: consultando il passaporto tramite scansione QR o verifica targa/VIN, l\'acquirente ottiene la curva di progressione dei chilometri senza doversi fidare unicamente del libretto cartaceo o delle dichiarazioni del venditore.',
          '2. Valutazione oggettiva delle auto elettriche usate: la trasparenza sullo stato di salute della batteria (SoH) elimina la paura di acquistare un EV con pacco batterie degradato, consentendo di calcolare il reale valore residuo di mercato.',
          '3. Verdetto pre-acquisto immediato: incrociando i dati ufficiali del passaporto con i prezzi medi degli annunci reali (come fa l\'algoritmo di AutoEsperto), è possibile stabilire istantaneamente se l\'offerta è un affare, è a prezzo di mercato o nasconde anomalie.',
        ],
      },
      {
        heading: '4. I vantaggi per chi vende: valorizzazione e velocità',
        paragraphs: [
          'Chi vende un\'auto dotata di passaporto digitale con manutenzioni verificate e storico chiaro gode di un vantaggio competitivo netto:',
          '• Difesa del prezzo di vendita: le auto usate con storico digitale certificato registrano un premio di valore compreso tra il +8% e il +15% rispetto a modelli comparabili privi di documentazione.',
          '• Tempi di compravendita dimezzati: la totale trasparenza abbatte i dubbi e le negoziazioni al ribasso da parte di potenziali compratori diffidenti.',
        ],
      },
      {
        heading: '5. Come anticipare la normativa con il Profilo Digitale Auto di AutoEsperto',
        paragraphs: [
          'In attesa che l\'infrastruttura governativa centrale completi l\'interconnessione, gli automobilisti italiani possono già creare gratuitamente il proprio Profilo Digitale Auto permanente su AutoEsperto:',
          'Caricando il libretto di circolazione (riconosciuto via AI OCR), è possibile archiviare fatture dei tagliandi, scadenze bollo/revisione, e generare un QR Code Trasparente da mostrare all\'acquirente in fase di vendita.',
        ],
      },
    ],
  },
  {
    slug: 'profilo-auto-digitale-passaporto-veicolo',
    title: 'Profilo Auto Digitale: come funziona il passaporto permanente della tua auto',
    description:
      'Cos\'è il Profilo Digitale Auto, come organizzare libretto, storico tagliandi, promemoria scadenze bollo e revisione, e come condividere una scheda certificata con QR code per vendere prima e meglio.',
    published: '2026-08-24',
    category: 'manutenzione',
    cta: 'Crea subito gratis il Profilo Digitale della tua auto',
    sections: [
      {
        heading: 'Perché il libretto cartaceo e i fogli volanti non bastano più',
        paragraphs: [
          'Chiunque abbia posseduto o venduto un\'auto usata conosce la frustrazione: fatture dei tagliandi sparse nel cassetto del cruscotto, scadenze di revisione ministeriale o bollo dimenticate, e acquirenti diffidenti che chiedono prove concrete sulla cura del veicolo.',
          'Il Profilo Digitale Auto (o Passaporto Digitale) di AutoEsperto nasce per risolvere definitivamente questo problema: un fascicolo digitale permanente, gratuito e privato sul tuo smartphone che racchiude tutta la vita della tua auto.',
        ],
      },
      {
        heading: '1. Documento Unico e dati tecnici sempre accessibili',
        paragraphs: [
          'Grazie alla tecnologia AI OCR, puoi caricare una foto del Documento Unico di Circolazione (libretto): il sistema estrae istantaneamente telaio VIN, omologazione, classe ambientale Euro, potenza fiscale e kW effettivi.',
          'Niente più dubbi su blocchi del traffico o limiti neopatentati: tutti i dati ufficiali sono a portata di tap in qualsiasi momento.',
        ],
      },
      {
        heading: '2. Cronologia tagliandi e interventi certificati',
        paragraphs: [
          'Ogni volta che fai un cambio olio, sostituisci le pastiglie freno o fai la cinghia di distribuzione, puoi registrare l\'intervento nel tuo passaporto, allegando foto della ricevuta e chilometraggio esatto.',
          'Questo storico documentato trasforma la tua auto da una semplice "usata" a un veicolo con manutenzione verificabile, aumentandone il valore commerciale del 10–15% rispetto alla media.',
        ],
      },
      {
        heading: '3. Promemoria scadenze: mai più multe o ritardi',
        paragraphs: [
          'Il Profilo Digitale calcola e notifica automaticamente le scadenze cruciali:',
          '• Revisione ministeriale MCTC (dopo 4 anni dalla prima immatricolazione, poi ogni 2 anni).',
          '• Scadenza del bollo auto con calcolo esatto delle aliquote regionali ed esenzioni per ibride ed elettriche.',
          '• Rinnovo polizza assicurativa RC e cambio pneumatici stagionale (estivi/invernali).',
        ],
      },
      {
        heading: '4. Vendere fino al 40% più velocemente con il QR Code Trasparente',
        paragraphs: [
          'Quando decidi di vendere l\'auto, puoi generare con un click un link pubblico o un QR code protetto: i potenziali acquirenti potranno consultare lo storico manutenzioni, le foto ad alta risoluzione e il verdetto AutoEsperto senza vedere i tuoi dati personali sensibili.',
          'La trasparenza totale azzera la diffidenza dell\'acquirente e ti permette di difendere il prezzo senza subire sconti ingiustificati.',
        ],
      },
    ],
  },
  {
    slug: 'come-controllare-annuncio-auto-usata',
    title: 'Come analizzare un annuncio di auto usata: cosa controllare e come evitare truffe',
    description:
      'La guida completa per analizzare annunci su AutoScout24, Subito.it e marketplace: verificare coerenza tra km e anno, individuare prezzi fuori mercato e ottenere il verdetto AutoEsperto.',
    published: '2026-08-24',
    category: 'acquisto',
    cta: 'Incolla il link dell\'annuncio su AutoEsperto per il verdetto immediato',
    sections: [
      {
        heading: 'Come leggere un annuncio tra le righe',
        paragraphs: [
          'Navigando tra i portali di annunci auto in Italia, la maggior parte delle offerte sembra perfetta: "come nuova", "tenuta maniacalmente", "chilometri certificati". Tuttavia, oltre il 30% degli annunci presenta omissioni strategiche o prezzi non realistici.',
          'Prima di contattare il venditore o versare qualsiasi caparra, è fondamentale verificare 4 parametri oggettivi.',
        ],
      },
      {
        heading: '1. Rapporto tra Anno e Chilometraggio',
        paragraphs: [
          'In Italia un\'auto diesel percorre mediamente tra i 15.000 e i 20.000 km all\'anno, mentre un\'auto a benzina circa 8.000–12.000 km. Un\'auto diesel di 8 anni con "soli 45.000 km" richiede controlli scrupolosi sul portale dell\'Automobilista (storico revisioni).',
          'Se i chilometri dichiarati sono insolitamente bassi, chiedi sempre le fatture dei tagliandi con data e km registrati.',
        ],
      },
      {
        heading: '2. Prezzo richiesto vs Prezzo medio reale di mercato',
        paragraphs: [
          'Un prezzo troppo basso (più del 20% sotto la media) è quasi sempre indice di problemi nascosti, incidenti strutturali pregressi o tentativi di truffa su acconti.',
          'Usa lo strumento "Controlla Annuncio" di AutoEsperto: incolla il link dell\'annuncio per confrontare la cifra richiesta con le quotazioni reali e scoprire subito se è un BUON AFFARE o un prezzo da trattare con decisione.',
        ],
      },
      {
        heading: '3. Foto: i dettagli che i venditori cercano di nascondere',
        paragraphs: [
          'Esamina le foto ingrandite: allineamento delle fessure tra cofano, parafanghi e fari (segno di riparazioni post-incidente), usura del volante e della pedaliera rispetto ai km dichiarati, e differenze di tonalità di vernice tra pannelli adiacenti.',
        ],
      },
    ],
  },
  {
    slug: 'come-trattare-prezzo-auto-usata',
    title: 'Come trattare il prezzo di un\'auto usata: tecniche e margine di trattativa',
    description:
      'Quanto margine di sconto chiedere su un\'auto usata da privati e concessionari. Strategie pratiche, argomenti tecnici oggettivi e come chiudere al miglior prezzo.',
    published: '2026-08-24',
    category: 'acquisto',
    cta: 'Calcola il valore di mercato e il margine di trattativa su AutoEsperto',
    sections: [
      {
        heading: 'Quanto si può trattare su un\'auto usata?',
        paragraphs: [
          'La trattativa sul prezzo non è una questione di fortuna o di aggressività verbale: è una questione di dati oggettivi. In media, gli annunci di auto usate in Italia hanno un margine di trattativa implicito compreso tra il 5% e il 10% del prezzo esposto.',
          'Presentarsi preparati con la quotazione reale di mercato e la lista dei lavori imminenti ti dà un vantaggio contrattuale imbattibile.',
        ],
      },
      {
        heading: '1. Trasforma i controlli in euro di sconto',
        paragraphs: [
          'Invece di chiedere genericamente "mi fai uno sconto?", quantifica i costi che dovrai sostenere subito dopo l\'acquisto:',
          '• Pneumatici con battistrada sotto i 3 mm: sconto di circa 300–500 € per il treno nuovo.',
          '• Tagliando ordinario imminente o non documentato: sconto di 200–350 €.',
          '• Cinghia di distribuzione in scadenza (oltre 5 anni o 100.000 km): sconto di 400–700 €.',
          '• Piccoli graffi o ammaccature su paraurti e cerchi: sconto di 150–300 €.',
        ],
      },
      {
        heading: '2. Differenza tra trattativa con privato e con concessionario',
        paragraphs: [
          'Con un privato conta la certezza e la rapidità del pagamento: mostrare che hai il budget pronto e che sei deciso a concludere rapidamente se il prezzo scende alla cifra equa è la leva più forte.',
          'Con un concessionario, se non scende sul prezzo finale, chiedi di includere nel prezzo il passaggio di proprietà (circa 300–600 €), il tagliando preconsegna completo o l\'estensione della garanzia di conformità a 24 mesi.',
        ],
      },
    ],
  },
  {
    slug: 'come-capire-se-auto-usata-e-affare',
    title: 'Come capire se un\'auto usata è un affare: 5 dati da verificare',
    description:
      'Valutare un\'auto usata senza dati è un tiro al buio. Ecco i 5 dati che contano davvero per capire se il prezzo è giusto, con lo strumento gratuito di AutoEsperto.',
    published: '2026-08-05',
    sections: [
      {
        heading: 'Perché i prezzi "da listino" non bastano',
        paragraphs: [
          'Quando si compra o si vende un\'auto usata il rischio è sempre lo stesso: chiedere o pagare un prezzo sbagliato. I privati tendono a gonfiare le richieste, i listini ufficiali parlano di auto nuove e le quotazioni a pagamento non dicono da dove arrivano i numeri.',
          'La verità è che un\'auto usata vale ciò che il mercato è disposto a pagare oggi, e l\'unico modo per conoscerlo è guardare i prezzi reali a cui auto simili vengono effettivamente vendute. Ecco i 5 dati da verificare prima di qualsiasi decisione.',
        ],
      },
      {
        heading: '1. Il valore di mercato reale, non quello teorico',
        paragraphs: [
          'Il dato numero uno è il prezzo medio di mercato: stessa marca, stesso modello, stessa annata. Non quello di un prezzario fermo a mesi fa, ma quello degli annunci di vendita effettivi di oggi.',
          'Su AutoEsperto puoi verificarlo in pochi secondi: inserisci marca, modello e anno e vedi il prezzo medio reale calcolato dagli annunci in vendita, con il range minimo e massimo. Un esempio: la Fiat 500 usata tiene il valore molto più di quanto suggerisca la vecchia "regola del 20%".',
        ],
      },
      {
        heading: '2. I chilometri, ma contestualizzati',
        paragraphs: [
          '150.000 km su un\'auto a benzina o ibrida ben tenuta possono valere molto meno di 80.000 km su un diesel usato prevalentemente in città. Il chilometraggio va sempre letto insieme a motore, tagliandi e tipo di utilizzo.',
          'Chiedi sempre quanti km vengono percorsi ogni anno e verifica che i tagliandi siano coerenti con il chilometraggio dichiarato.',
        ],
      },
      {
        heading: '3. Lo storico dei tagliandi',
        paragraphs: [
          'Un\'auto con libretto dei tagliandi regolare vale il 10-15% in più di una senza. I tagliandi sono la prova che l\'auto è stata curata: senza, ogni valutazione è una scommessa.',
          'Se il venditore non ha documentazione, considera il fatto come un punto di debolezza da scontare sul prezzo.',
        ],
      },
      {
        heading: '4. Gli allestimenti e gli optional che contano davvero',
        paragraphs: [
          'Non tutti gli accessori aggiungono valore al prezzo di rivendita. Cambio automatico, fari full LED e sedili riscaldati sì; cerchi aftermarket, impianti modificati e altre personalizzazioni quasi mai.',
          'Conta ciò che l\'acquirente medio cerca, non ciò che il venditore ha pagato a suo tempo.',
        ],
      },
      {
        heading: '5. La domanda per quel modello in questo momento',
        paragraphs: [
          'Non tutte le auto si svalutano allo stesso modo: alcune city car e ibride tengono il valore molto meglio di altre. Se un modello è molto richiesto oggi, il prezzo medio sale; se è fuori moda, scende anche se "valeva" di più in passato.',
          'Il consiglio è sempre lo stesso: verifica il valore reale di mercato prima di firmare qualsiasi cosa.',
        ],
      },
      {
        heading: 'Come usare questi dati',
        paragraphs: [
          'I dati esistono ma sono dispersi in migliaia di annunci. Per questo abbiamo messo insieme uno strumento gratuito: inserisci marca, modello e anno e in pochi secondi vedi il prezzo medio reale a cui quell\'auto viene venduta oggi, calcolato dagli annunci. Copre 238 marche e 4.225 modelli, dal 2015 a oggi, senza registrazione.',
        ],
      },
    ],
    category: 'acquisto',
    cta: 'auto-usata-affare',
  },
  {
    slug: 'auto-che-si-svalutano-meno',
    title: 'Le auto che si svalutano meno: quali tengono il valore nel 2026',
    description:
      'Deprezzamento auto: quali modelli perdono meno valore e perché. Le categorie che tengono meglio il prezzo e come controllare il valore reale con dati dagli annunci.',
    published: '2026-08-05',
    sections: [
      {
        heading: 'Perché alcune auto si svalutano meno',
        paragraphs: [
          'Il deprezzamento non è uguale per tutti. La regola del "perde il 20% il primo anno" vale solo in media: ci sono auto che perdono molto di più e auto che mantengono quasi intatto il valore per anni.',
          'Le vetture che si svalutano meno condividono alcune caratteristiche: forte domanda, costi di gestione contenuti, affidabilità dimostrata e mercato dell\'usato profondo.',
        ],
      },
      {
        heading: 'Le categorie che tengono meglio il valore',
        paragraphs: [
          'Sul mercato italiano, le city car compatte e alcune ibride benzina sono storicamente tra le auto che tengono meglio il valore: la domanda è costante e l\'offerta di esemplari in buone condizioni non basta mai.',
          'Anche i SUV compatti di marchi con grande rete di assistenza tendono a svalutarsi meno, grazie alla richiesta continuativa da parte di famiglie e aziende.',
        ],
      },
      {
        heading: 'Il motore conta',
        paragraphs: [
          'In generale, le versioni con motori a benzina moderni e soprattutto ibride tengono meglio il valore rispetto al diesel, che soffre di una domanda in calo nelle città. Le elettriche stanno recuperando, ma le dinamiche di prezzo sono ancora molto variabili da modello a modello.',
        ],
      },
      {
        heading: 'Come verificare il valore reale del tuo modello',
        paragraphs: [
          'Il modo più affidabile per capire quanto vale la tua auto oggi è confrontarla con il prezzo medio degli annunci reali in vendita. Su AutoEsperto puoi farlo gratuitamente: inserisci marca, modello e anno e vedi il prezzo medio di mercato, aggiornato sugli annunci disponibili.',
          'Così puoi capire se la tua auto tiene il valore, quando conviene venderla e a quale prezzo chiedere senza rischiare di svenderla.',
        ],
      },
    ],
    category: 'valutazione',
    cta: 'auto-svalutazione',
  },
  {
    slug: 'come-vendere-auto-usata-prezzo-giusto',
    title: 'Come vendere l\'auto usata al prezzo giusto: guida pratica',
    description:
      'Vendere l\'auto al prezzo giusto: come calcolare il valore reale dagli annunci, preparare la vettura, presentare l\'annuncio e trattare senza svendere.',
    published: '2026-08-05',
    sections: [
      {
        heading: 'Prima di tutto: qual è il valore reale?',
        paragraphs: [
          'Il primo errore di chi vende è partire da un prezzo inventato. Prima di scrivere l\'annuncio, verifica il valore reale di mercato: marca, modello, anno e allestimento, confrontati con i prezzi degli annunci in vendita oggi.',
          'Su AutoEsperto la verifica è gratuita e richiede pochi secondi: il prezzo medio reale dagli annunci ti dà la base giusta per fissare il tuo prezzo di partenza.',
        ],
      },
      {
        heading: 'Prepara l\'auto per la vendita',
        paragraphs: [
          'Un\'auto pulita e con la documentazione in ordine vale di più e si vende prima. Riordina i tagliandi, completa l\'eventuale manutenzione in scadenza (olio, freni, pneumatici) e fai una pulizia accurata sia degli interni sia dell\'esterno.',
          'Se la vettura ha difetti, dichiarali subito: nasconderli significa perdere tempo e credibilità durante le trattative.',
        ],
      },
      {
        heading: 'Scrivi un annuncio che vende',
        paragraphs: [
          'Usa foto in luce naturale, complete di ogni lato e degli interni. Nel testo indica: anno, chilometri, allestimento, storico tagliandi e un prezzo con un piccolo margine di trattativa sopra il valore reale.',
          'Un prezzo chiaro e in linea col mercato attira più contatti di uno gonfiato, perché i compratori confrontano.',
        ],
      },
      {
        heading: 'Tratta senza svendere',
        paragraphs: [
          'Quando arriva un\'offerta, non accettare al ribasso immediato: mostra i dati che giustificano il tuo prezzo, come il confronto con gli annunci simili. Se l\'acquirente ha pretese irrealistiche, passa oltre: il mercato premia chi ha pazienza e dati reali.',
          'Conoscere il valore medio del tuo modello ti dà la sicurezza di non scendere sotto la soglia giusta.',
        ],
      },
      {
        heading: 'Documentazione e passaggio',
        paragraphs: [
          'Quando trovi l\'acquirente, organizza il passaggio di proprietà in un PRA o tramite un\'agenzia di pratiche auto. Predisponi in anticipo: certificato di proprietà, libretto, documento di identità e codice fiscale. Occhio a non chiudere l\'accordo prima della firma del passaggio.',
        ],
      },
    ],
    category: 'vendita',
    cta: 'vendere-auto',
  },
  {
    slug: 'come-controllare-auto-usata-prima-acquisto',
    title: 'Come controllare un\'auto usata prima dell\'acquisto: checklist completa',
    description:
      'Cosa controllare prima di comprare un\'auto usata: documenti, carrozzeria, motore, interni e prova su strada. La checklist pratica per non commettere errori costosi.',
    published: '2026-08-06',
    sections: [
      {
        heading: 'Perché serve una checklist prima dell\'acquisto',
        paragraphs: [
          'Comprare un\'auto usata senza controlli approfonditi è uno dei modi più rapidi per spendere migliaia di euro in riparazioni non previste. Il venditore — privato o concessionario — ha sempre interesse a chiudere l\'affare: spetta a te verificare che l\'auto corrisponda a quanto promesso.',
          'Una buona ispezione non richiede necessariamente un meccanico, ma richiede metodo, tempo e attenzione ai dettagli. Ecco la checklist che usiamo noi, divisa per aree.',
        ],
      },
      {
        heading: '1. Documenti e identità del veicolo',
        paragraphs: [
          'Prima ancora di guardare la carrozzeria, verifica che i documenti siano coerenti con l\'auto che hai davanti.',
        ],
        list: [
          'Libretto di circolazione: targa, telaio (VIN), marca, modello e anno devono corrispondere all\'auto.',
          'Certificato di proprietà (CDP): verifica che il venditore sia il proprietario effettivo.',
          'Storico revisioni: revisione regolare ogni 2 anni (4 per auto nuove), senza sospensioni.',
          'Tagliandi e fatture di manutenzione: chilometraggio coerente nel tempo, senza salti sospetti.',
          'Visura PRA: controlla passaggi di proprietà frequenti, ipoteche o vincoli.',
        ],
      },
      {
        heading: '2. Carrozzeria e verniciatura',
        paragraphs: [
          'I segnali di un incidente passato non sono sempre evidenti. Controlla con luce naturale e, se possibile, con un magnete sui pannelli in acciaio.',
        ],
        list: [
          'Differenze di tonalità tra pannelli adiacenti: segno di ritintura.',
          'Spazi irregolari tra cofano, paraurti e portiere.',
          'Presenza di overspray (vernice su guarnizioni o vetri).',
          'Alette e modanature non allineate o con clip rotte.',
          'Usura eccessiva dei pneumatici su un solo lato (allineamento compromesso).',
        ],
      },
      {
        heading: '3. Motore, trasmissione e sotto il cofano',
        paragraphs: [
          'Con il motore freddo, apri il cofano e verifica lo stato generale. Poi fallo scaldare e controlla di nuovo.',
        ],
        list: [
          'Perdite di olio, liquido refrigerante o freni sotto il motore.',
          'Cinghia distribuzione: chiedi quando è stata sostituita (su molte auto è a intervalli di 60.000–120.000 km).',
          'Rumori anomali a motore acceso: ticchettii, fischii, vibrazioni eccessive.',
          'Fumo dallo scarico: bianco persistente (guarnizione testata), blu (olio bruciato), nero (miscela ricca).',
          'Cambio manuale: ingranaggi che "grattano" o difficoltà a inserire la retromarcia.',
          'Cambio automatico: slittamenti, strattoni o ritardi nel cambio marcia.',
        ],
      },
      {
        heading: '4. Interni, elettronica e comfort',
        paragraphs: [
          'Gli interni raccontano come l\'auto è stata usata e curata nel tempo.',
        ],
        list: [
          'Chilometraggio coerente con usura volante, pedali e sedili.',
          'Tutti i vetri elettrici, specchietti e luci funzionanti.',
          'Climatizzatore che scalda e raffredda correttamente.',
          'Infotainment, sensori di parcheggio e telecamera (se presenti).',
          'Odori persistenti di muffa o umidità: possibile allagamento o guarnizioni compromesse.',
        ],
      },
      {
        heading: '5. Prova su strada',
        paragraphs: [
          'Non comprare un\'auto usata senza averla guidata per almeno 15–20 minuti, su strade diverse e a velocità variabili.',
        ],
        list: [
          'Freni: l\'auto deve frenare in linea, senza tirare a destra o sinistra.',
          'Sterzo: nessun gioco eccessivo, nessun rumore in curva.',
          'Sospensioni: nessun rumore su buche o dossi.',
          'ABS e spie a bordo: tutte le spie si spengono dopo l\'avviamento.',
          'Cruise control e assistenti alla guida (se presenti).',
        ],
      },
      {
        heading: 'Quando chiedere un parere professionale',
        paragraphs: [
          'Se l\'auto ti interessa ma hai dubbi, un\'ispezione pre-acquisto da un meccanico indipendente costa 80–150 € e può farti risparmiare migliaia. AutoEsperto ti aiuta a partire con dati su prezzo di mercato e affidabilità del modello, ma non sostituisce un controllo meccanico sul posto.',
        ],
      },
    ],
    category: 'acquisto',
    cta: 'controllare-auto-usata',
  },
  {
    slug: 'auto-piu-affidabili-2026',
    title: 'Le auto più affidabili del 2026: quali scegliere nell\'usato',
    description:
      'Classifica delle auto più affidabili del 2026 per chi compra usato: city car, SUV, ibride e berline che tengono nel tempo con costi di manutenzione contenuti.',
    published: '2026-08-06',
    sections: [
      {
        heading: 'Cosa rende un\'auto affidabile nel 2026',
        paragraphs: [
          'L\'affidabilità non è solo "non si rompe": è la combinazione di meccanica collaudata, costi di manutenzione prevedibili, ricambi disponibili e rete di assistenza capillare. Nel 2026, con normative sempre più stringenti su emissioni e sicurezza, alcune categorie di auto si distinguono per solidità nel tempo.',
          'Per chi compra usato, l\'affidabilità conta ancora di più: un\'auto già usata per 5–8 anni con pochi problemi noti è spesso una scelta più sicura di un\'auto recente con tecnologia immatura.',
        ],
      },
      {
        heading: 'City car e utilitarie: le più solide',
        paragraphs: [
          'Le city car compatte restano tra le auto più affidabili sul mercato italiano: meccanica semplice, pochi optional complessi, costi di gestione bassi.',
        ],
        list: [
          'Toyota Yaris (soprattutto ibride): affidabilità eccellente, consumi ridotti, manutenzione economica.',
          'Honda Jazz: spazio interno generoso, motore benzina collaudato, pochi problemi cronici.',
          'Suzuki Swift: leggera, agile, meccanica semplice e robusta.',
          'Fiat Panda (motori Fire e Mild Hybrid): ricambi ovunque, riparazioni economiche, ideale in città.',
        ],
      },
      {
        heading: 'SUV compatti: equilibrio tra spazio e solidità',
        paragraphs: [
          'I SUV compatti sono la categoria più richiesta in Italia. Non tutti sono ugualmente affidabili: conviene puntare su modelli con motorizzazioni già testate da anni.',
        ],
        list: [
          'Toyota C-HR / Corolla Cross: ibrida, pochi richiami, costi di gestione contenuti.',
          'Hyundai Kona / Tucson (generazioni recenti): garanzia solida, qualità percepita in crescita.',
          'Skoda Kamiq / Karoq: piattaforma VW collaudata, ottimo rapporto qualità-prezzo.',
          'Mazda CX-30 / CX-5: guida piacevole, motori benzina Skyactiv affidabili.',
        ],
      },
      {
        heading: 'Berline e station wagon per chi percorre molti km',
        paragraphs: [
          'Se fai molti chilometri all\'anno, la scelta del motore pesa più del segmento. Nel 2026 le ibride benzina e i benzina moderni turbo piccoli offrono il miglior compromesso.',
        ],
        list: [
          'Toyota Corolla (ibrida): riferimento per chi cerca affidabilità e bassi consumi.',
          'Skoda Octavia (motori TSI e TDI di generazione recente): spazio, comfort, costi contenuti.',
          'Volkswagen Golf (motori 1.5 TSI e 1.6 TDI EA288): meccanica diffusa, assistenza capillare.',
          'Mazda 3: qualità costruttiva alta, motori aspirati e turbo affidabili.',
        ],
      },
      {
        heading: 'Motori e allestimenti da preferire (e da evitare)',
        paragraphs: [
          'A parità di modello, il motore fa la differenza. In generale, nel 2026 conviene preferire motori già collaudati da almeno 3–4 anni e allestimenti medi (non base né full optional con tecnologia sperimentale).',
        ],
        list: [
          'Preferisci: ibride benzina, benzina 1.0–1.5 turbo di generazione recente, diesel EA288 (VW group) su auto con storico tagliandi.',
          'Valuta con attenzione: primi motori ibridi plug-in di nuova generazione, diesel Euro 6d-TEMP su piccole percorrenze.',
          'Evita: auto con richiami aperti, motori con problemi cronici documentati, allestimenti con ADAS di prima generazione difettosi.',
        ],
      },
      {
        heading: 'Come verificare l\'affidabilità del modello che ti interessa',
        paragraphs: [
          'Prima di comprare, controlla il punteggio di affidabilità del modello specifico su AutoEsperto: analizziamo i problemi noti, i costi di manutenzione e il valore di mercato reale. Puoi anche confrontare due modelli con il tool Confronta per capire quale si adatta meglio alle tue esigenze.',
        ],
      },
    ],
    category: 'affidabilita',
    cta: 'auto-affidabili-2026',
  },
  {
    slug: 'come-scoprire-se-auto-e-stata-incidentata',
    title: 'Come scoprire se un\'auto è stata incidentata: segnali e controlli',
    description:
      'Guida pratica per capire se un\'auto usata ha subito un incidente: controlli visivi, documenti, VIN e strumenti per non comprare un veicolo riparato male.',
    published: '2026-08-06',
    sections: [
      {
        heading: 'Perché è importante scoprire un incidente passato',
        paragraphs: [
          'Un\'auto incidentata e riparata male può sembrare perfetta a un\'occhiata veloce, ma nascondere problemi strutturali, difetti di allineamento e una svalutazione futura molto più alta del previsto. In Italia non esiste un registro pubblico degli incidenti per privati, quindi la verifica spetta all\'acquirente.',
          'La buona notizia è che i segnali ci sono quasi sempre: servono occhio allenato, pazienza e qualche strumento semplice.',
        ],
      },
      {
        heading: 'Controlli visivi sulla carrozzeria',
        paragraphs: [
          'Inizia sempre da un controllo esterno con luce naturale, preferibilmente all\'aperto. Confronta i pannelli tra loro e cerca incongruenze.',
        ],
        list: [
          'Differenze di colore o texture tra pannelli adiacenti (cofano, paraurti, portiere).',
          'Contorni e modanature non allineati: spesso segno di smontaggio e rimontaggio post-riparazione.',
          'Presenza di gocce di vernice su guarnizioni, maniglie o vetri (overspray).',
          'Magnete che non aderisce su pannelli in acciaio: possibile stucco o fibra al posto del metallo.',
          'Saldature irregolari nel vano motore o nel bagagliaio (struttura compromessa).',
        ],
      },
      {
        heading: 'Interni e vano abitacolo',
        paragraphs: [
          'Gli interni raccontano storie che la carrozzeria può nascondere.',
        ],
        list: [
          'Cinture di sicurezza: segnate, rigide o con data di produzione incoerente con l\'anno dell\'auto.',
          'Airbag: spia che resta accesa o coperture non originali o mal allineate.',
          'Parabrezza o lunotto sostituiti: spesso rotti in un incidente frontale o posteriore.',
          'Rumori anomali su buche: cruscotto, plastica o sedili che scricchiolano possono indicare smontaggi precedenti.',
        ],
      },
      {
        heading: 'Documenti e verifiche ufficiali',
        paragraphs: [
          'I documenti non rivelano gli incidenti, ma possono segnalare anomalie.',
        ],
        list: [
          'Visura PRA: passaggi di proprietà frequenti in poco tempo possono essere un campanello d\'allarme.',
          'Storico revisioni: difetti gravi segnalati in passato (carrozzeria, telaio, impianto frenante).',
          'Numero di telaio (VIN): incrocialo con il libretto e verifica che non sia stato alterato.',
          'Report storico estero (Carfax, AutoDNA): utili per auto importate o con passato all\'estero.',
        ],
      },
      {
        heading: 'Prova su strada: cosa ascoltare',
        paragraphs: [
          'Un\'auto con telaio deformato si comporta in modo anomalo in guida.',
        ],
        list: [
          'L\'auto tira da un lato in frenata o in retilineo.',
          'Sterzo con gioco o che non torna al centro da solo.',
          'Rumori sospetti da sospensioni o telaio su dossi e buche.',
          'Vibrazioni al volante a velocità medio-alte (bilanciamento o allineamento compromessi).',
        ],
      },
      {
        heading: 'Come l\'AI di AutoEsperto può aiutare',
        paragraphs: [
          'Caricando una foto dell\'auto, AutoEsperto analizza lo stato visivo e segnala difetti evidenti, incongruenze e segni di usura anomala. Non sostituisce un perito o un controllo strutturale, ma è un primo filtro utile prima di spostarti per vedere l\'auto o pagare un\'ispezione professionale.',
        ],
      },
    ],
    category: 'acquisto',
    cta: 'auto-incidentata',
  },
  {
    slug: 'come-valutare-danno-o-riparazione-auto',
    title: 'Come valutare un danno o una riparazione sull\'auto usata',
    description:
      'Graffi, ammaccature, verniciature e riparazioni: come capire se un danno è cosmetico o strutturale e quanto incide sul valore dell\'auto usata.',
    published: '2026-08-06',
    sections: [
      {
        heading: 'Non tutti i danni sono uguali',
        paragraphs: [
          'Un graffio sulla portiera e un longherone piegato non hanno lo stesso peso, ma entrambi possono essere usati dal venditore per giustificare un prezzo o, al contrario, nascosti per chiudere l\'affare. Sapere classificare un danno ti dà leva in trattativa e ti evita brutte sorprese.',
          'In generale, distinguiamo tre categorie: danni cosmetici, danni funzionali e danni strutturali.',
        ],
      },
      {
        heading: 'Danni cosmetici: impatto limitato',
        paragraphs: [
          'I danni cosmetici riguardano l\'estetica e non compromettono la sicurezza o la meccanica dell\'auto.',
        ],
        list: [
          'Graffi superficiali sulla vernice (non arrivano al metallo).',
          'Piccole ammaccature su paraurti in plastica.',
          'Usura di cerchi o pneumatici.',
          'Segni su plastiche interne, tappetini o sedili.',
        ],
      },
      {
        heading: 'Quanto costa riparare un danno cosmetico',
        paragraphs: [
          'I costi variano molto per marca e colore, ma come ordine di grandezza in Italia nel 2026:',
        ],
        list: [
          'Ritocco vernice localizzato: 80–200 € per graffio.',
          'Ammaccatura con verniciatura (pannello piccolo): 200–500 €.',
          'Paraurti in plastica verniciato: 300–700 € (sostituzione o riparazione).',
          'Cerchio in lega rifinito: 60–120 € per cerchio.',
        ],
      },
      {
        heading: 'Danni funzionali: attenzione ai costi nascosti',
        paragraphs: [
          'I danni funzionali non compromettono il telaio, ma richiedono riparazioni che possono costare più del previsto.',
        ],
        list: [
          'Fari o fanali rotti o con condensa interna: 150–600 € a pezzo.',
          'Parabrezza incrinato: 200–500 € (sensore pioggia/lane assist aumenta il costo).',
          'Specchietto elettrico danneggiato: 150–400 €.',
          'Sospensioni usurate o ammortizzatori da sostituire: 300–800 € per asse.',
        ],
      },
      {
        heading: 'Danni strutturali: il segnale più grave',
        paragraphs: [
          'Un danno strutturale compromette il telaio o i punti di deformazione programmata. Anche se riparato, riduce il valore e può compromettere la sicurezza in un incidente futuro.',
        ],
        list: [
          'Longheroni piegati o saldati nel vano motore o bagagliaio.',
          'Pannelli strutturali sostituiti (cofano, parafanghi interni, montanti).',
          'Airbag esplosi e sostituiti (verifica che la sostituzione sia documentata).',
          'Telaio con segni di raddrizzatura o saldature non originali.',
        ],
      },
      {
        heading: 'Come valutare una riparazione già fatta',
        paragraphs: [
          'Se l\'auto ha già subito riparazioni, verifica che siano state eseguite correttamente.',
        ],
        list: [
          'Verniciatura uniforme: nessuna differenza di tonalità tra pannelli adiacenti.',
          'Guarnizioni e modanature originali, non "incollate" o forzate.',
          'Allineamento portiere, cofano e paraurti: spazi regolari su tutti i lati.',
          'Chiedi fattura o documentazione della riparazione: chi l\'ha fatta, quando e cosa è stato sostituito.',
        ],
      },
      {
        heading: 'Quanto incide sul prezzo',
        paragraphs: [
          'Come regola pratica: un danno cosmetico può giustificare uno sconto del 2–5% sul prezzo richiesto; un danno funzionale del 5–10%; un danno strutturale documentato può svalutare l\'auto del 15–30% rispetto a un esemplare senza incidenti.',
          'AutoEsperto ti aiuta a partire dal valore di mercato reale del modello e a valutare lo stato visivo con l\'analisi AI da foto. Per danni importanti, affianca sempre un parere di un carrozziere o perito indipendente.',
        ],
      },
    ],
    category: 'valutazione',
    cta: 'valutare-danno-riparazione',
  },
  {
    slug: 'quanto-costa-riparare-auto',
    title: 'Quanto costa riparare un\'auto: i costi che devi conoscere',
    description:
      'Manodopera e ricambi: quanto costa davvero riparare un\'auto per segmento, i guasti più cari e come stimare i costi del tuo modello e anno prima di spendere in officina.',
    published: '2026-08-06',
    sections: [
      {
        heading: 'Da cosa dipende il costo di una riparazione',
        paragraphs: [
          'Il prezzo di una riparazione non dipende solo dal guasto: conta il segmento dell\'auto, la marca, l\'età, la regione e l\'officina. Una frizione su una city car costa la metà della stessa frizione su un SUV, e su una marca premium i ricambi possono costare anche il 40% in più.',
          'La voce più ricorrente è comunque la manodopera, in Italia tra i 50 e i 70 €/ora a seconda della regione e della specializzazione dell\'officina.',
        ],
      },
      {
        heading: 'I costi indicativi degli interventi più comuni',
        paragraphs: [
          'Come ordine di grandezza sul mercato italiano, per un\'auto di segmento medio:',
        ],
        list: [
          'Tagliando olio e filtri: 100–200 €.',
          'Pastiglie e dischi freno anteriori (per asse): 200–500 €.',
          'Batteria: 90–200 €.',
          'Cinghia distribuzione: 350–800 € secondo segmento.',
          'Ammortizzatori (per asse): 300–800 €.',
          'Frizione: 600–1400 €.',
          'Turbo o iniettori: 800–2000 €.',
        ],
      },
      {
        heading: 'Le riparazioni più costose in assoluto',
        paragraphs: [
          'Sopra tutti, ci sono gli interventi che toccano la parte strutturale o le componenti di pregio: sostituzione di un cambio automatico (3.000–8.000 €), una centralina motore (1.000–3.000 €), la batteria di trazione di un\'ibrida o elettrica (4.000–12.000 €) o i freni carboceramici di una sportiva.',
          'Proprio per questo, prima di comprare un\'auto usata conviene verificare i problemi noti del modello: un difetto noto a cambio o turbina può costarti più del risparmio fatto sull\'acquisto.',
        ],
      },
      {
        heading: 'Perché l\'anno del modello conta',
        paragraphs: [
          'A parità di marca e modello, un\'auto di 3 anni richiede solo manutenzione ordinaria; una di 8-10 anni inizia a chiedere freni, sospensioni e distribuzione; oltre i 12 anni i costi tendono a superare quelli delle auto più giovani.',
          'La pagina dedicata al tuo modello e anno su AutoEsperto stima i costi di manodopera e ricambi in base a segmento, marca ed età, così sai quanto tenere da parte ogni anno.',
        ],
      },
      {
        heading: 'Come ridurre i costi',
        paragraphs: [
          'Chiedi sempre 2–3 preventivi scritti per lo stesso intervento, preferisci officine indipendenti specializzate per la marca, e fai manutenzione preventiva (olio, filtri, freni) prima che un piccolo problema diventi un guasto grosso.',
          'Una regola utile: se il preventivo supera il 50–70% del valore dell\'auto, inizia a essere più conveniente cambiare vettura.',
        ],
      },
    ],
    category: 'manutenzione',
    cta: 'stima-riparazione',
  },
  {
    slug: 'riparare-o-rottamare-auto',
    title: 'Riparare o rottamare l\'auto: come decidere senza sbagliare',
    description:
      'Il test dei numeri per decidere se riparare l\'auto o cambiarla: confronta il costo del preventivo con il valore reale di mercato e i costi futuri prima di scegliere.',
    published: '2026-08-06',
    sections: [
      {
        heading: 'La regola del 50–70%',
        paragraphs: [
          'La domanda più comune quando l\'officina ti presenta un preventivo salato è: "ne vale la pena?". La regola pratica più usata: se il costo della riparazione supera il 50–70% del valore dell\'auto, quasi sempre conviene cambiarla invece di ripararla.',
          'Ma è solo un punto di partenza: il conto vero dipende da cosa succede dopo.',
        ],
      },
      {
        heading: 'I dati che ti servono prima di decidere',
        paragraphs: [
          'Per decidere con i numeri ti servono tre dati:',
        ],
        list: [
          'Il costo del preventivo: chiedi sempre un preventivo scritto, dettagliato in manodopera e ricambi.',
          'Il valore reale di mercato dell\'auto: non quello che speri, ma quello che pagano davvero oggi gli acquirenti per il tuo modello e anno.',
          'I costi previsti nei prossimi 12–24 mesi: se hai già superato la soglia dei 100.000 km con distribuzione e frizione da fare, aggiungili.',
        ],
      },
      {
        heading: 'Quando conviene riparare',
        paragraphs: [
          'Conviene riparare quando il valore dell\'auto è solido e il guasto è isolato: un freno, un ammortizzatore, una batteria. In questi casi l\'intervento è una manutenzione normale che mantiene il valore della vettura.',
          'Se l\'auto ha comunque un buon valore di mercato e hai intenzione di tenerla altri 2–3 anni, ripararla quasi sempre batte il costo di cambiarla.',
        ],
      },
      {
        heading: 'Quando conviene rottamare o cambiare',
        paragraphs: [
          'Conviene fermarsi quando il guasto tocca la struttura o componenti molto costose (cambio automatico, centralina, motore, batteria di trazione), quando i problemi si accumulano e l\'auto è ferma più tempo in officina che in strada.',
          'Anche la normativa conta: un\'auto Euro 3–4 in zone con limitazioni crescenti vale molto meno di quanto sembri.',
        ],
      },
      {
        heading: 'Il passaggio decisivo: il valore reale',
        paragraphs: [
          'Il modo più affidabile per sapere quanto vale davvero la tua auto è confrontarla con il prezzo medio degli annunci reali in vendita per lo stesso modello e anno. Su AutoEsperto la verifica è gratuita: inserisci marca, modello e anno e ottieni il valore di mercato aggiornato, da confrontare con il preventivo dell\'officina.',
        ],
      },
    ],
    category: 'manutenzione',
    cta: 'riparare-o-rottamare',
  },
  {
    slug: 'come-capire-se-prezzo-auto-usata-e-giusto',
    title: 'Come capire se il prezzo di un\'auto usata è giusto',
    description:
      'Prezzo troppo alto o un vero affare? Impara a valutare un\'auto usata confrontando la richiesta con il valore di mercato reale dagli annunci, in pochi minuti e senza strumenti a pagamento.',
    published: '2026-08-06',
    category: 'valutazione',
    sections: [
      {
        heading: 'Il problema: "quanto dovrebbe costare?"',
        paragraphs: [
          'Quando guardi un annuncio di un\'auto usata, il dubbio è sempre lo stesso: il prezzo è giusto, alto o un affare? Rispondere "a occhio" è quasi impossibile, perché il valore di un\'auto dipende da anno, chilometri, allestimento, storico e — soprattutto — da quanto il mercato sta pagando per esemplari simili in questo momento.',
          'La buona notizia: capire se un prezzo è giusto è un\'operazione meccanica, fatta di confronti e dati. Ecco il metodo che funziona.',
        ],
      },
      {
        heading: 'Il primo confronto: stesso modello, stessa annata',
        paragraphs: [
          'La base di tutto è il prezzo medio di mercato per lo stesso modello e la stessa annata. Non basta guardare un solo annuncio: serve la media di più auto simili in vendita, così un prezzo fuori scala non distorce il giudizio.',
          'Su AutoEsperto puoi vedere in pochi secondi il valore medio reale per marca, modello e anno, calcolato dagli annunci in vendita, insieme al range minimo e massimo entro cui si muove il mercato.',
        ],
      },
      {
        heading: 'Poi affina con chilometri e allestimento',
        paragraphs: [
          'Il prezzo medio è il punto di partenza, non il verdetto. Rispetto alla media:',
        ],
        list: [
          'Chilometraggio sotto i 10.000 km/anno: il valore sale del 5–10% rispetto alla media.',
          'Chilometraggio sopra i 20.000 km/anno: il valore scende del 5–10%.',
          'Allestimenti alti (cambio automatico, full LED, ADAS): +5–10% se richiesti.',
          'Storico tagliandi completo e unico proprietario: +5–10%.',
          'Difetti dichiarati, danni o passaggi frequenti: -5–15%.',
        ],
      },
      {
        heading: 'La regola dei "tre prezzi"',
        paragraphs: [
          'Per decidere se la richiesta è onesta, calcola tre riferimenti: il prezzo medio di mercato, un valore "buono" (medio meno 10%, il tuo obiettivo se compri) e un valore "alto" (medio più 10%, ciò che chiede chi vuole vendere sopra il mercato).',
          'Se la richiesta sta sopra il prezzo alto, la trattativa parte in salita: ci sono alternative simili a meno. Se sta sotto il valore buono, è probabilmente un affare — ma verifica che non ci siano danni nascosti.',
        ],
      },
      {
        heading: 'Quando il prezzo "troppo basso" è un campanello d\'allarme',
        paragraphs: [
          'Un prezzo molto sotto la media non è sempre un\'occasione. Prima di entusiasmarti, controlla: storico degli incidenti, chilometraggio reale, presenza di ipoteche o fermi amministrativi, e lo stato di carrozzeria e meccanica. Un\'auto svalutata del 20–30% rispetto alla media ha quasi sempre un motivo.',
          'Il valore medio degli annunci ti dà il riferimento; la verifica dello stato dell\'auto resta un passo obbligato.',
        ],
      },
    ],
    cta: 'prezzo-giusto',
  },
  {
    slug: 'passaggio-di-proprieta-auto-costi',
    title: 'Passaggio di proprietà auto 2026: costi, documenti e procedure',
    description:
      'Quanto costa davvero il passaggio di proprietà di un\'auto nel 2026, quali documenti servono, chi lo fa (PRA, agenzia, concessionario) e come evitare errori costosi.',
    published: '2026-08-06',
    category: 'vendita',
    sections: [
      {
        heading: 'Cos\'è il passaggio di proprietà',
        paragraphs: [
          'Il passaggio di proprietà è la procedura con cui un\'auto cambia intestatario presso il PRA (Pubblico Registro Automobilistico). Senza di esso la vendita non è completa: l\'acquirente non è ancora proprietario legale, anche se ha già pagato.',
          'La pratica può essere fatta da un\'agenzia di pratiche auto, presso lo sportello telematico dell\'Automobilista o, in molti casi, direttamente dal concessionario che vende. Dal 2021 è obbligatoria la modalità telematica.',
        ],
      },
      {
        heading: 'I costi da mettere in conto nel 2026',
        paragraphs: [
          'Il costo totale del passaggio di proprietà si compone di più voci:',
        ],
        list: [
          'Imposta provinciale di trascrizione (IPT): la voce più pesante, varia da provincia a provincia (indicativamente 150–650 €, con tariffe ridotte per veicoli usati o meno inquinanti).',
          'Tassa automobilistica regionale (bollo): se l\'acquirente paga il bollo in forma di "tassa di circolazione", viene riproporzionata all\'anno in corso.',
          'Costo della pratica telematica: circa 27 € di diritti PRA.',
          'Compenso dell\'agenzia di pratiche auto: 50–150 € a seconda dell\'agenzia.',
          'Imposta di bollo per i documenti, quando prevista.',
        ],
      },
      {
        heading: 'I documenti necessari',
        paragraphs: [
          'Per avviare la pratica servono:',
        ],
        list: [
          'Certificato di proprietà (CDP) e libretto di circolazione firmati dal venditore.',
          'Documento di identità e codice fiscale di venditore e acquirente.',
          'Visura PRA aggiornata (se la fai tu) o verifica di assenza di fermo amministrativo e ipoteche.',
          'Targa originale sul veicolo (nel nuovo passaggio telematico la targa non cambia obbligatoriamente).',
          'Eventuale procura se una delle parti non può essere presente.',
        ],
      },
      {
        heading: 'I passaggi più comuni dove si sbaglia',
        paragraphs: [
          'Gli errori più frequenti costano tempo e denaro:',
        ],
        list: [
          'Non verificare prima che non ci siano fermi amministrativi o ipoteche sul veicolo.',
          'Firmare il CDP senza compilare correttamente i dati dell\'acquirente.',
          'Non controllare che il numero di telaio corrisponda tra libretto e auto.',
          'Trascurare il controllo della revisione: un\'auto senza revisione valida non è vendibile in regola.',
          'Dimenticare che l\'acquirente deve pagare il bollo auto pro-quota all\'atto del passaggio.',
        ],
      },
      {
        heading: 'Come calcolare quanto vale davvero l\'auto prima di vendere',
        paragraphs: [
          'Prima di avviare la pratica, stabilisci un prezzo giusto: il valore medio di mercato dagli annunci per il tuo modello e anno è la base più solida per non svendere né chiedere cifre irrealistiche. Su AutoEsperto la verifica è gratuita e richiede pochi secondi.',
        ],
      },
    ],
    cta: 'passaggio-proprieta',
  },
  {
    slug: 'auto-elettrica-o-benzina-conviene',
    title: 'Auto elettrica o benzina: quale conviene davvero nel 2026',
    description:
      'Costi, autonomia, valore di rivendita e incentivi: il confronto completo tra auto elettrica, ibrida e benzina per capire quale conviene in base al tuo utilizzo.',
    published: '2026-08-06',
    category: 'acquisto',
    sections: [
      {
        heading: 'Non esiste "la migliore": esiste la migliore per il tuo uso',
        paragraphs: [
          'Elettrica, ibrida o benzina? La risposta cambia in base a dove vivi, quanti chilometri fai ogni anno, se hai un posto auto con ricarica e quanto tempo pensi di tenere l\'auto. Confrontare solo il prezzo di listino è l\'errore più comune: conta il costo totale di possesso.',
          'Ecco i fattori che pesano davvero, aggiornati al 2026.',
        ],
      },
      {
        heading: 'Se fai pochi chilometri in città',
        paragraphs: [
          'Se percorri meno di 10.000 km all\'anno, prevalentemente in città, la differenza tra benzina e ibrida è minima sui consumi. L\'elettrica può convenire per i parcheggi e l\'accesso alle zone a traffico limitato, ma solo se hai una ricarica comoda (a casa o al lavoro).',
          'In questo scenario il peso maggiore ce l\'ha il costo iniziale: un\'elettrica costa mediamente il 30–40% in più dell\'equivalente benzina, e il recupero passa dai risparmi sui consumi.',
        ],
      },
      {
        heading: 'Se fai molti chilometri',
        paragraphs: [
          'Oltre i 15.000–20.000 km all\'anno i consumi diventano la voce dominante. Qui l\'ibrida benzina è spesso il miglior compromesso: consuma poco in città e in extraurbano, costa meno dell\'elettrica e non richiede di organizzare la ricarica.',
          'Per chi può ricaricare a casa e fa lunghi tragitti pianificati, l\'elettrica abbatte molto il costo per km: stimabile tra i 2 e i 5 € per 100 km in casa contro i 9–12 € di un\'auto a benzina.',
        ],
      },
      {
        heading: 'Costi e incentivi nel 2026',
        paragraphs: [
          'I prezzi variano di mese in mese, ma alcune regole restano:',
        ],
        list: [
          'Le elettriche godono ancora di agevolazioni fiscali, esenzione parziale dal bollo in molte regioni e accesso facilitato alle ZTL.',
          'Le ibride plug-in hanno costi di acquisto vicini alle elettriche ma richiedono di ricaricare per sfruttare i consumi dichiarati: senza ricarica, consumano come una benzina tradizionale.',
          'Le benzina restano le più economiche all\'acquisto e le più semplici: niente colonnine, niente pianificazione, valore di rivendita più prevedibile.',
        ],
      },
      {
        heading: 'Il valore di rivendita: cosa dice il mercato dell\'usato',
        paragraphs: [
          'L\'usato è il test più onesto per capire cosa conviene. Le ibride di marchi generalisti tengono bene il valore grazie alla domanda costante; le elettriche hanno dinamiche di prezzo più variabili e possono svalutarsi rapidamente se arriva un modello nuovo con più autonomia.',
          'Prima di scegliere, confronta il valore reale di mercato dei modelli che ti interessano: la differenza tra ciò che si paga oggi e ciò che recupererai alla vendita è il dato che decide la convenienza.',
        ],
      },
    ],
    cta: 'elettrica-benzina',
  },
  {
    slug: 'quanto-consuma-auto-guida',
    title: 'Quanto consuma un\'auto: guida ai consumi reali nel 2026',
    description:
      'Consumi dichiarati e consumi reali: come leggere urbano, extraurbano e combinato, quanto costa ogni 100 km per tipo di motore e come calcolare il costo annuo della tua auto.',
    published: '2026-08-07',
    category: 'manutenzione',
    sections: [
      {
        heading: 'Perché i consumi dichiarati non coincidono con quelli reali',
        paragraphs: [
          'I dati di consumo riportati sul libretto e nei depliant sono misurati in condizioni di laboratorio (ciclo WLTP), con percorsi e stili di guida standardizzati. Nel traffico reale, con il clima, il traffico e il piede del guidatore, il consumo reale è quasi sempre più alto: mediamente tra il 10% e il 25% in più rispetto a quanto dichiarato.',
          'Capire la differenza è importante sia prima dell\'acquisto (per stimare il vero costo di gestione) sia durante la vita dell\'auto (per capire quando un consumo anomalo segnala un guasto).',
        ],
      },
      {
        heading: 'Urbano, extraurbano e combinato: come leggerli',
        paragraphs: [
          'Il ciclo di misura distingue tre valori, espressi in litri per 100 km (L/100 km):',
        ],
        list: [
          'Urbano: il consumo in città, con soste, partenze e traffico. È il valore che cresce di più con lo stile di guida.',
          'Extraurbano: il consumo su strade a scorrimento, dove il motore lavora al regime più efficiente.',
          'Combinato: la media ponderata dei due, il valore di riferimento per confrontare modelli diversi.',
        ],
      },
      {
        heading: 'Quanto costa ogni 100 km per tipo di motore',
        paragraphs: [
          'Come ordine di grandezza, con i prezzi dei carburanti del 2026 in Italia, il costo per 100 km di un\'auto media (segmento utilitaria) è indicativamente:',
        ],
        list: [
          'Benzina (6,0 L/100 km combinati): circa 11 € ogni 100 km.',
          'Ibrida (4,6 L/100 km combinati): circa 8,5 € ogni 100 km.',
          'Diesel (5,2 L/100 km combinati): circa 9 € ogni 100 km.',
          'Elettrica ricaricata a casa (15 kWh/100 km): circa 4–5 € ogni 100 km.',
          'Elettrica ricaricata alle colonnine pubbliche: può superare i 10 € ogni 100 km.',
        ],
      },
      {
        heading: 'Come calcolare il costo annuo della tua auto',
        paragraphs: [
          'Il costo annuo di carburante è facile da stimare: moltiplica i litri consumati ogni 100 km per i chilometri che percorri all\'anno e dividi per 100, poi moltiplica per il prezzo del carburante. Esempio: 6 L/100 km × 15.000 km ÷ 100 × 1,85 € = circa 1.665 € all\'anno.',
          'Sulla pagina dedicata al tuo modello e anno puoi vedere il consumo stimato (urbano, extraurbano e combinato) e il costo annuo sia per 12.000 sia per 20.000 km.',
        ],
      },
      {
        heading: 'Come ridurre i consumi',
        paragraphs: [
          'Le leve più efficaci non richiedono modifiche: guida fluida senza accelerazioni brusche, anticipa la frenata, mantieni la pressione dei pneumatici corretta, evita i portabagagli al tetto inutili e spegni il motore nelle soste lunghe. Un\'auto ben manutenuta — olio, filtri, candele — consuma meno di una trascurata.',
          'Un consumo che sale improvvisamente del 15–20% senza motivo è spesso il primo segnale di un problema (sonde, iniettori, pressione pneumatici).',
        ],
      },
      {
        heading: 'Verifica i consumi del modello che ti interessa',
        paragraphs: [
          'Prima di comprare o prima di stimare il budget di gestione, controlla il consumo stimato del modello specifico e anno su AutoEsperto: confronta il costo per 100 km con il valore di mercato e con i costi di riparazione per avere il quadro completo del costo di possesso.',
        ],
      },
    ],
    cta: 'consumi-auto',
  },
  {
    slug: 'come-scegliere-assicurazione-auto',
    title: 'Come scegliere l\'assicurazione auto usata: guida 2026',
    description:
      'RC auto, kasko, furto-incendio, assistenza: quali garanzie servono davvero su un\'auto usata, come confrontare i preventivi e come risparmiare senza tagliare le coperture giuste.',
    published: '2026-08-07',
    category: 'acquisto',
    sections: [
      {
        heading: 'La RC obbligatoria e le garanzie accessorie',
        paragraphs: [
          'L\'assicurazione RC (responsabilità civile) è obbligatoria per legge e copre i danni che causi a terzi con il veicolo. Tutto il resto — kasko, furto-incendio, cristalli, assistenza, tutela legale — è facoltativo e va scelto in base al valore dell\'auto e al tuo profilo di rischio.',
          'Il punto di partenza: più è costosa l\'auto (o più è importante per te), più senso ha assicurarla con garanzie aggiuntive. Su un\'usata di basso valore, molte coperture accessorie costano più di quanto pagherebbero mai.',
        ],
      },
      {
        heading: 'Kasko: sì o no su un\'usata?',
        paragraphs: [
          'La kasko copre i danni al tuo veicolo, anche quando la colpa è tua. Su un\'auto usata conviene valutarla quando il valore del mezzo è alto rispetto al premio, oppure quando un danno anche piccolo metterebbe in difficoltà le tue finanze.',
          'Regola pratica: se l\'auto vale meno di 5.000–8.000 €, la kasko spesso non conviene, perché con 2–3 anni di premi hai già pagato quanto vale l\'intera vettura.',
        ],
      },
      {
        heading: 'Le garanzie che convengono di più su un\'usata',
        paragraphs: [
          'Non tutte le garanzie hanno lo stesso valore quando compri un\'auto di seconda mano:',
        ],
        list: [
          'Assistenza stradale: copre soccorso, auto sostitutiva e rimorchio. Utile sempre, costa poco.',
          'Furto e incendio: conviene su auto con valore residuo medio-alto o su modelli molto rubati.',
          'Cristalli: copre parabrezza e vetri, frequenti su auto di 5+ anni. Premio contenuto, massimale utile.',
          'Tutela legale: utile se acquisti da privato e devi far valere i tuoi diritti in caso di vizi.',
          'Kasko parziale (furto-incendio + atti vandalici): un compromesso per auto di fascia media.',
        ],
      },
      {
        heading: 'Come confrontare i preventivi',
        paragraphs: [
          'Le compagnie calcolano il premio con algoritmi diversi: per lo stesso conducente e la stessa auto, la differenza tra il preventivo più alto e il più basso può superare il 40%. Per confrontare correttamente:',
        ],
        list: [
          'Usa lo stesso importo di massimali (almeno 5 milioni di euro per la RC).',
          'Controlla le franchigie: un premio basso con franchigia alta può costarti più caro in caso di sinistro.',
          'Valuta la classe di merito e la possibilità di trasferire il bonus-malus.',
          'Guarda la copertura online dei sinistri e la qualità del servizio, non solo il prezzo.',
        ],
      },
      {
        heading: 'Cosa incide davvero sul premio',
        paragraphs: [
          'Il premio dipende da età e storico del conducente, classe di merito, provincia di residenza, tipo e valore dell\'auto, età del veicolo e utilizzo dichiarato. Su un\'usata, l\'età del mezzo pesa molto: dopo i 5–7 anni il premio tende a scendere perché l\'auto vale meno.',
          'Il modo più efficace per risparmiare resta la guida attenta: la classe di merito è il principale moltiplicatore del premio.',
        ],
      },
    ],
    cta: 'assicurazione-auto',
  },
  {
    slug: 'revisione-auto-costi-e-regole',
    title: 'Revisione auto 2026: costi, regole e cosa controlla l\'officina',
    description:
      'Quando va fatta la revisione, quanto costa, quali controlli vengono eseguiti, cosa succede se l\'auto non passa e la differenza tra revisione e collaudo.',
    published: '2026-08-07',
    category: 'manutenzione',
    sections: [
      {
        heading: 'Quando va fatta la revisione',
        paragraphs: [
          'La revisione è obbligatoria in Italia per tutti i veicoli immatricolati: la prima entro 4 anni dall\'immatricolazione, poi ogni 2 anni. La scadenza è indicata sul libretto di circolazione: il veicolo va presentato entro il mese di scadenza, senza necessità di aspettare la lettera della motorizzazione.',
          'Guidare un\'auto con la revisione scaduta comporta una multa e, in caso di controllo, il fermo del veicolo finché non viene ripristinata.',
        ],
      },
      {
        heading: 'Quanto costa',
        paragraphs: [
          'Il costo della revisione è un importo governativo per la tariffa dello stato, più l\'eventuale compenso dell\'officina autorizzata:',
        ],
        list: [
          'Tariffa statale (dal 2022): 66,88 € (che include gli oneri fissi).',
          'Compenso dell\'officina autorizzata: 40–70 € in base alla provincia.',
          'Totale indicativo: 95–145 €.',
          'Controllo in una motorizzazione pubblica: solo la tariffa statale, ma con tempi di attesa spesso lunghi.',
        ],
      },
      {
        heading: 'Cosa controlla l\'officina',
        paragraphs: [
          'La revisione verifica la sicurezza e la conformità del veicolo su diversi fronti:',
        ],
        list: [
          'Impianto frenante: efficienza, usura e spie.',
          'Fanaleria: luci, indicatori di direzione, assetti dei fari.',
          'Pneumatici: battistrada e stato generale.',
          'Sospensioni e sterzo: giochi e usura.',
          'Emissioni: verifica dei gas di scarico (opacimetro per i diesel).',
          'Documenti: coincidenza di targa e telaio, stato del libretto.',
        ],
      },
      {
        heading: 'Se l\'auto non passa la revisione',
        paragraphs: [
          'Se emergono difetti gravi, il veicolo viene bocciato e ricevi un verbale con l\'elenco dei problemi. Hai 60 giorni per riparare e ripresentare l\'auto (in alcuni casi la controvisita è scontata o gratuita nello stesso centro). Se non la ripresenti, il veicolo risulta con revisione sospesa.',
          'Se i difetti sono lievi, puoi ricevere l\'esito positivo con raccomandazione di intervento: è comunque obbligatorio sistemarli.',
        ],
      },
      {
        heading: 'Revisione e collaudo: non sono la stessa cosa',
        paragraphs: [
          'Il collaudo è la verifica fatta alla prima immatricolazione di un veicolo (nuovo o importato) e in caso di modifiche alle caratteristiche costruttive. La revisione, invece, è il controllo periodico successivo. Comprare un\'auto usata con revisione in scadenza o appena fatta può essere un indizio utile, ma la revisione non dice nulla sullo stato di incidenti o sulla manutenzione reale.',
        ],
      },
    ],
    cta: 'revisione-auto',
  },
  {
    slug: 'garanzia-auto-usata-diritti',
    title: 'Garanzia sull\'auto usata: i tuoi diritti come compratore',
    description:
      'Garanzia legale di conformità e garanzia convenzionale sull\'usato: cosa coprono, quanto durano, come farle valere e cosa cambia tra concessionario e privato.',
    published: '2026-08-07',
    category: 'acquisto',
    sections: [
      {
        heading: 'La garanzia legale di conformità',
        paragraphs: [
          'Quando acquisti un\'auto da un venditore professionale (concessionario, autosalone, venditore online), scatta automaticamente la garanzia legale di conformità, prevista dal Codice del Consumo. Per le auto usate vendute da professionisti la durata minima è di 12 mesi, riducibile di comune accordo a un minimo di 12 mesi (la legge oggi non consente di scendere sotto l\'anno).',
          'La garanzia legale non è un\'opzione a pagamento: è dovuta e gratuita. Il venditore non può escluderla.',
        ],
      },
      {
        heading: 'Cosa copre e cosa no',
        paragraphs: [
          'La garanzia legale copre i difetti di conformità presenti al momento della consegna e manifestati durante il periodo di garanzia: un guasto alla meccanica, un problema elettrico o un difetto dichiarato come escluso solo se è un normale deterioramento dovuto all\'uso.',
        ],
        list: [
          'Coperti: difetti di funzionamento non riconducibili all\'usura normale (motore, cambio, elettronica).',
          'Non coperti: danni da uso improprio, manutenzione non effettuata, usura normale di freni, gomme e consumabili.',
          'Vigilanza: per i primi 6 mesi spetta al venditore dimostrare che il difetto non esisteva; dopo 6 mesi, spetta a te provarlo.',
        ],
      },
      {
        heading: 'Venditore professionale vs privato',
        paragraphs: [
          'Se acquisti da un privato, la garanzia legale non si applica: vale il principio "visto e piaciuto". Puoi comunque agire per i vizi nascosti (vizi che il venditore conosceva e non ha dichiarato), ma è molto più difficile dimostrarli e la strada è quella di un\'azione legale.',
          'Per questo, comprare da un concessionario costa di più ma porta in dote la garanzia legale e, spesso, una garanzia convenzionale aggiuntiva.',
        ],
      },
      {
        heading: 'La garanzia convenzionale (o estesa)',
        paragraphs: [
          'Molti concessionari offrono una garanzia convenzionale a pagamento, che prolunga la copertura oltre l\'anno legale o la estende a componenti specifici. Prima di acquistarla valuta: il premio, le franchigie, cosa copre davvero (esclude spesso componenti di usura) e quanto è affidabile il soggetto che la emette.',
          'La garanzia estesa non è mai obbligatoria per legge: confronta premio e massimale prima di dire sì.',
        ],
      },
      {
        heading: 'Come far valere i tuoi diritti',
        paragraphs: [
          'Se entro il periodo di garanzia scopri un difetto, metti per iscritto la segnalazione al venditore (raccomandata, PEC o email con ricevuta), chiedendo la riparazione, la sostituzione o il rimborso. Per legge hai diritto alla riparazione gratuita in tempi ragionevoli.',
          'Se il venditore si rifiuta o i tempi sono irragionevoli, puoi richiedere una riduzione del prezzo o la risoluzione del contratto, e in ultima istanza rivolgerti alla conciliazione o al giudice di pace.',
        ],
      },
    ],
    cta: 'garanzia-usato',
  },
  {
    slug: 'come-trattare-prezzo-auto',
    title: 'Come trattare il prezzo di un\'auto: leva e tecniche di negoziazione',
    description:
      'Quanto si può trattare sul prezzo di un\'auto, come preparare la negoziazione con i dati reali di mercato e quali tecniche funzionano senza rovinare l\'affare.',
    published: '2026-08-07',
    category: 'acquisto',
    sections: [
      {
        heading: 'Il prezzo non è mai "fisso"',
        paragraphs: [
          'Sul prezzo di un\'auto — sia usata da concessionario sia, entro certi limiti, nuova — c\'è quasi sempre margine. Il margine dipende da quanto il venditore ha bisogno di spostare il veicolo, da quanto è richiesto il modello e da quanto sei preparato. Chi arriva con i dati dalla parte del giusto ottiene sconti migliori.',
          'La regola d\'oro: mai fare un\'offerta "a caso". Più conosci il valore reale del modello, più la tua offerta è credibile.',
        ],
      },
      {
        heading: 'Prepara i dati prima di iniziare',
        paragraphs: [
          'La tua arma migliore è il confronto con il mercato:',
        ],
        list: [
          'Prezzo medio di mercato per lo stesso modello, anno e allestimento (dalle quotazioni reali).',
          'Annunci simili attualmente in vendita, con i relativi prezzi.',
          'Costi noti del modello: guasti frequenti, manutenzione, assicurazione.',
          'Il valore di permuta della tua eventuale auto usata, calcolato prima di entrare in concessionaria.',
        ],
      },
      {
        heading: 'Le tecniche che funzionano',
        paragraphs: [
          'La negoziazione efficace non è un braccio di ferro, ma una serie di mosse calibrate:',
        ],
        list: [
          'Parti da un\'offerta leggermente sotto il prezzo che sei disposto a pagare, giustificandola con i dati di mercato.',
          'Chiedi cosa è incluso: garanzia, tagliando, gomme nuove, tappetini. Spesso gli sconti si fanno sui servizi più che sul prezzo.',
          'Fai capire che sei pronto a concludere subito: i venditori preferiscono chiudere oggi a un prezzo leggermente più basso.',
          'Usa il confronto tra più venditori: un preventivo concorrente è la leva più forte.',
          'Se non ottieni sconto sul prezzo, chiedilo su permuta, finanziamento o accessori.',
        ],
      },
      {
        heading: 'Cosa non fare',
        paragraphs: [
          'Non dichiarare fin dall\'inizio il tuo budget: ti impedisce di negoziare al rialzo. Non lasciare che il venditore ti carichi di finanziamenti e garanzie accessorie in modo disordinato: chiedi sempre il costo totale, non la rata. E non innamorarti dell\'auto prima di avere il prezzo: l\'entusiasmo è il peggior nemico della trattativa.',
        ],
      },
      {
        heading: 'Quando chiudere l\'affare',
        paragraphs: [
          'Chiudi quando l\'offerta è in linea con il valore reale di mercato, non quando sei "arrivato". Confronta sempre il prezzo finale — tutto incluso — con la media di mercato del modello: se stai pagando sopra, continua a cercare.',
        ],
      },
    ],
    cta: 'trattare-prezzo',
  },
  {
    slug: 'permuta-o-vendita-privata-auto',
    title: 'Permuta o vendita privata: cosa conviene davvero',
    description:
      'Permutare l\'auto usata in concessionaria o venderla a privati? Confronto su prezzo, tempo, burocrazia e valore reale per capire quale strada conviene.',
    published: '2026-08-07',
    category: 'vendita',
    sections: [
      {
        heading: 'Come funziona la permuta',
        paragraphs: [
          'Nella permuta, il concessionario valuta la tua auto usata e il suo valore viene scontato dal prezzo della nuova o della vettura che compri. È la soluzione più veloce: il venditore gestisce burocrazia, passaggio e ritiro, e tu esci con l\'auto nuova senza rotture.',
          'Il costo di questa comodità è il valore riconosciuto: il concessionario valuta al ribasso per coprirsi sul rischio di rivendita. In media la permuta riconosce il 15–30% in meno rispetto a una vendita a privati.',
        ],
      },
      {
        heading: 'I vantaggi della permuta',
        paragraphs: [
          'La permuta conviene quando il tempo è più importante del denaro e quando hai bisogno di chiudere l\'affare in un\'unica operazione: niente annunci, niente trattative con estranei, niente rischio di truffe, e lo sconto sulla permuta viene applicato prima del finanziamento (riducendo anche gli interessi, se finanzi).',
        ],
      },
      {
        heading: 'I vantaggi della vendita privata',
        paragraphs: [
          'Vendere da privato a privato massimizza il ricavato: il compratore paga un valore vicino al prezzo di mercato, senza il margine del concessionario. Per un\'auto di valore medio, la differenza può essere di migliaia di euro. Richiede però tempo, annunci ben fatti, disponibilità per visite e prove e la gestione del passaggio di proprietà.',
        ],
      },
      {
        heading: 'Il confronto economico',
        paragraphs: [
          'Per decidere con i numeri, confronta tre dati:',
        ],
        list: [
          'Il valore reale di mercato della tua auto (il riferimento per la vendita privata).',
          'L\'offerta di permuta del concessionario (dovresti ottenere almeno il 70–85% del valore di mercato).',
          'Il tempo che ti serve: ogni mese di annuncio significa un\'auto ferma che si svaluta.',
        ],
      },
      {
        heading: 'Il trucco dei concessionari: il "prezzo gonfiato"',
        paragraphs: [
          'Alcuni concessionari gonfiano il prezzo dell\'auto nuova e poi "concedono" un rilancio sulla permuta: il margine è il tuo stesso denaro. Controlla sempre che lo sconto sia calcolato sul prezzo finale effettivo, non su un listino maggioreggiato. Chiedi anche il prezzo di listino della permuta: se è più alto dell\'offerta reale, c\'è margine per trattare.',
        ],
      },
    ],
    cta: 'permuta-o-vendita',
  },
  {
    slug: 'auto-ibride-consumi-e-costi',
    title: 'Auto ibride nel 2026: consumi reali, costi e quando convengono',
    description:
      'Come funziona un\'ibrida, quanto consuma davvero in città e in autostrada, quali costi aggiuntivi ha rispetto a una benzina e quando conviene sceglierla.',
    published: '2026-08-07',
    category: 'valutazione',
    sections: [
      {
        heading: 'Come funziona un\'ibrida non plug-in',
        paragraphs: [
          'Un\'ibrida classica (HEV, full hybrid) combina un motore termico e uno elettrico con una piccola batteria che si ricarica da sola in frenata e in rilascio. Non va mai collegata alla corrente: la batteria si carica durante la marcia. Il motore elettrico assiste in partenza e a bassa velocità, dove il termico consuma di più.',
          'È proprio in città che l\'ibrida dà il meglio: nel traffico stop-and-go il motore termico lavora poco e i consumi calano del 30–40% rispetto alla stessa auto a benzina.',
        ],
      },
      {
        heading: 'Consumi reali: città e autostrada',
        paragraphs: [
          'Il vantaggio non è uniforme su tutti i percorsi:',
        ],
        list: [
          'In città: il vantaggio è massimo, i consumi scendono del 30–40% rispetto alla benzina.',
          'In extraurbano: vantaggio contenuto, intorno al 10–15%.',
          'In autostrada: a velocità costante l\'ibrida lavora quasi solo col termico: il consumo si avvicina a quello di una benzina equivalente.',
          'Con temperature molto basse o percorsi brevi (meno di 5 km), il motore termico parte spesso a freddo e il vantaggio si riduce.',
        ],
      },
      {
        heading: 'I costi extra di un\'ibrida',
        paragraphs: [
          'Rispetto a una benzina pura, un\'ibrida costa di più all\'acquisto (mediamente 1.500–3.500 €) e ha componenti in più da considerare:',
        ],
        list: [
          'Batteria di trazione: raramente si sostituisce prima dei 10–15 anni, ma se serve costa 2.000–6.000 €.',
          'Inverter e motore elettrico: affidabili, ma in caso di guasto i costi non sono banali.',
          'Manutenzione ordinaria: simile a una benzina (stessi tagliandi).',
          'Freni: si consumano meno grazie alla rigenerazione, un risparmio silenzioso.',
        ],
      },
      {
        heading: 'Il valore di rivendita',
        paragraphs: [
          'Sul mercato dell\'usato, le ibride di marchi generalisti tengono bene il valore grazie alla domanda costante di chi cerca bassi consumi senza l\'ansia della ricarica. La svalutazione è in genere più dolce rispetto alle auto a benzina comparabili.',
        ],
      },
      {
        heading: 'Quando conviene (e quando no)',
        paragraphs: [
          'Conviene se fai prevalentemente città o extraurbano con molti chilometri, se tieni l\'auto a lungo (recuperi il sovrapprezzo in 4–6 anni) e se non hai ricarica domestica ma vuoi consumi bassi. Conviene meno se fai quasi solo autostrada a velocità elevate o pochissimi chilometri all\'anno: lì il sovrapprezzo non viene recuperato.',
        ],
      },
    ],
    cta: 'ibride-convengono',
  },
  {
    slug: 'quanto-dura-un-auto-ciclo-di-vita',
    title: 'Quanti anni dura un\'auto: ciclo di vita e valore residuo',
    description:
      'Cosa determina la durata di un\'auto, a quale età inizia a perdere valore più in fretta, come allungare la vita del veicolo e come valutare la durata residua prima di comprare.',
    published: '2026-08-07',
    category: 'valutazione',
    sections: [
      {
        heading: 'Km e anni: cosa conta davvero',
        paragraphs: [
          'La durata di un\'auto non è un numero fisso: dipende da chilometri, manutenzione, tipo di utilizzo e tecnologia. Un\'auto di 10 anni con 100.000 km ben mantenuti può valere più di una di 6 anni con 180.000 km trascurati. In generale, conta più la manutenzione effettiva che il numero sul libretto.',
          'Come riferimento: le auto moderne ben curate superano regolarmente i 250.000–300.000 km e i 15 anni, purché la carrozzeria non sia compromessa dalla ruggine.',
        ],
      },
      {
        heading: 'La curva di svalutazione',
        paragraphs: [
          'Il valore non scende in modo lineare:',
        ],
        list: [
          'Primi 3 anni: la perdita maggiore, mediamente il 40–50% del valore a nuovo.',
          '3–7 anni: svalutazione più lenta, circa il 8–12% all\'anno.',
          '7–12 anni: calo moderato, dipende molto da domanda e condizioni.',
          'Oltre i 12 anni: il valore si avvicina al "valore minimo", legato a condizioni reali e a componenti da sostituire.',
        ],
      },
      {
        heading: 'I fattori che allungano (o accorciano) la vita',
        paragraphs: [
          'Prolungano la vita: manutenzione regolare, uso a motore caldo senza sforzi eccessivi, box invece di strada (protegge carrozzeria e plastica), trattamento antiruggine nelle zone piovose o costiere, sostituzione tempestiva dei consumabili.',
          'La accorciano: chilometri prevalentemente urbani a freddo (il motore non arriva mai a temperatura), manutenzione saltata, incidenti non riparati correttamente e ruggine non trattata.',
        ],
      },
      {
        heading: 'Quando l\'auto è "vecchia"',
        paragraphs: [
          'Un\'auto è funzionalmente vecchia quando i costi di manutenzione annui superano il suo valore residuo o quando le riparazioni si accumulano: oltre quella soglia, la manutenzione non è più conveniente. Lo è invece quando, pur datata, ha costi contenuti e valore d\'uso ancora alto.',
          'Le limitazioni alla circolazione (zone a basse emissioni) sono un fattore che oggi accelera l\'obsolescenza delle auto più vecchie: verifica sempre la classe di emissione prima di comprare.',
        ],
      },
      {
        heading: 'Come valutare la durata residua di un\'usata',
        paragraphs: [
          'Prima di comprare, stima la vita residua: controlla l\'usura reale (freni, sospensioni, distribuzione), lo stato di carrozzeria e ruggine, la completezza dei tagliandi e confronta il prezzo richiesto con il valore di mercato. Un\'auto che a 8 anni richiede subito distribuzione, frizione e gomme ha un costo reale più alto del prezzo scritto sull\'annuncio.',
        ],
      },
    ],
    cta: 'durata-auto',
  },
  {
    slug: 'comprare-auto-dall-estero-procedure',
    title: 'Comprare un\'auto dall\'estero: costi, documenti e procedure 2026',
    description:
      'Conviene comprare un\'auto all\'estero? Come importarla in Italia: documenti, IVA, immatricolazione, costi nascosti e controlli per evitare brutte sorprese.',
    published: '2026-08-07',
    category: 'acquisto',
    sections: [
      {
        heading: 'Perché si compra all\'estero (e quando conviene)',
        paragraphs: [
          'All\'estero si possono trovare prezzi più bassi per modelli molto richiesti, versioni con allestimenti diversi o auto che in Italia hanno attese lunghe. Il risparmio, però, deve coprire i costi e i rischi dell\'importazione: senza un calcolo preciso, l\'affare può trasformarsi in una perdita.',
          'Paesi di provenienza tipici per l\'Italia: Germania e Paesi Bassi (mercato ampio, prezzi spesso sotto la media italiana).',
        ],
      },
      {
        heading: 'I costi da mettere in conto',
        paragraphs: [
          'Il prezzo pagato al venditore è solo una parte del totale:',
        ],
        list: [
          'IVA: se l\'auto è nuova o usata con meno di 6 mesi o meno di 6.000 km, va pagata l\'IVA italiana (22%).',
          'Immatricolazione e collaudo: circa 200–400 € tra diritti e pratiche.',
          'Tasse di immatricolazione e bollo regionale pro-quota.',
          'Trasporto o viaggio per ritirarla: 200–800 € secondo distanza.',
          'Cambio targa, documenti e traduzioni: 50–200 €.',
          'Eventuale messa a norma (fanaleria, indicatori, velocità): 100–400 €.',
        ],
      },
      {
        heading: 'Documenti e procedure',
        paragraphs: [
          'Per importare servono i documenti esteri originali (certificato di proprietà o equivalente, targa e libretto), il certificato di conformità europeo (COC) se disponibile e la prova di acquisto. Con questi si ottiene la targa di importazione provvisoria, poi la visita e la procedura PRA con immatricolazione in Italia e nuove targhe.',
          'La strada più sicura è delegare a un\'agenzia di pratiche auto specializzata in importazioni: costa di più ma evita errori burocratici costosi.',
        ],
      },
      {
        heading: 'I controlli prima di comprare',
        paragraphs: [
          'Un\'auto proveniente dall\'estero può avere una storia che non vedi nei documenti:',
        ],
        list: [
          'Verifica con un report storico (Carfax, autoDNA) incidenti e chilometraggio.',
          'Controlla che il numero di telaio coincida e non sia alterato.',
          'Verifica che non ci siano fermi, sequestri o finanziamenti residui sull\'auto.',
          'Chiedi foto e video del sottoscocca e del vano motore prima di muoverti.',
          'Fai una verifica visiva con l\'AI o un meccanico se l\'auto è importante.',
        ],
      },
      {
        heading: 'Quando rinunciare',
        paragraphs: [
          'Se il risparmio rispetto al mercato italiano è inferiore al 15–20% dopo tutti i costi, l\'importazione di solito non conviene. Se l\'auto ha più di 5–6 anni o chilometraggio elevato, il rischio di problemi non documentati cresce molto: in quel caso, meglio il mercato nazionale con garanzia e storico verificabile.',
        ],
      },
    ],
    cta: 'auto-estero',
  },
  {
    slug: 'come-verificare-chilometraggio-auto',
    title: 'Come capire se il chilometraggio di un\'auto è reale',
    description:
      'Segnali di chilometraggio alterato, controlli sui documenti e come verificare che i km dichiarati siano veri prima di comprare un\'auto usata.',
    published: '2026-08-07',
    category: 'valutazione',
    sections: [
      {
        heading: 'Perché il chilometraggio conta così tanto',
        paragraphs: [
          'Il chilometraggio è il primo indicatore di usura e valore di un\'auto: incide sul prezzo, sui costi futuri di manutenzione e sulla scadenza di interventi come la distribuzione. Per questo è anche il dato più falsificato: abbassare i km dichiarati aumenta il prezzo che puoi chiedere.',
          'Il contachilometri alterato è una truffa punita dalla legge, ma la verifica resta in gran parte a carico dell\'acquirente.',
        ],
      },
      {
        heading: 'I segnali di chilometraggio alterato',
        paragraphs: [
          'L\'usura racconta più del contachilometri:',
        ],
        list: [
          'Usura di volante, pedali e sedile guida incoerente con i km dichiarati.',
          'Pneumatici troppo consumati per i km dichiarati (le gomme durano 30.000–50.000 km).',
          'Dischi e pastiglie freno usurati: se ha pochi km, i freni non dovrebbero essere al limite.',
          'Documenti di manutenzione con km più alti di quelli dichiarati (i tagliandi registrano il chilometraggio).',
          'Lacune inspiegabili nello storico: periodi senza tagliandi o con tagliandi "persi".',
        ],
      },
      {
        heading: 'I controlli che puoi fare',
        paragraphs: [
          'Non devi fidarti solo degli occhi:',
        ],
        list: [
          'Chiedi lo storico delle revisioni (ogni revisione registra i km al momento del controllo).',
          'Verifica il chilometraggio con un report storico su targa o telaio.',
          'Controlla i km registrati negli interventi di officina se disponibili.',
          'Per le auto più recenti, molti veicoli hanno il contachilometri "protetto" elettronicamente, ma non tutte le manipolazioni vengono scoperte: la verifica documentale resta fondamentale.',
        ],
      },
      {
        heading: 'La prova su strada come conferma',
        paragraphs: [
          'Una prova su strada può confermare i sospetti: un\'auto con km reali alti tende ad avere rumori da sospensioni, cambi un po\' stanchi e interni vissuti. Se i km dichiarati sono bassi ma tutto "suona" usurato, i numeri non tornano.',
        ],
      },
      {
        heading: 'Cosa fare se scopri una truffa',
        paragraphs: [
          'Se dopo l\'acquisto scopri che il chilometraggio era stato alterato, puoi denunciare il venditore (è un reato) e agire per ottenere il risarcimento o la risoluzione del contratto. Conserva tutti i documenti e fai una visura che dimostri la discrepanza: la strada è quella della querela e dell\'azione civile per dolo.',
        ],
      },
    ],
    cta: 'chilometraggio-reale',
  },
  {
    slug: 'come-comprare-auto-usata-da-privato',
    title: 'Come comprare un\'auto usata da un privato in sicurezza',
    description:
      'Acquisto tra privati: vantaggi, rischi e le verifiche da fare prima di comprare. Documenti, storico, prova su strada e pagamento in sicurezza.',
    published: '2026-08-07',
    category: 'acquisto',
    sections: [
      {
        heading: 'Perché comprare da un privato',
        paragraphs: [
          'Comprare da un privato permette di risparmiare rispetto al concessionario: non ci sono margini, garanzie e costi di gestione che si scaricano sul prezzo. In cambio, però, tutta la verifica della vettura ricade su di te.',
          'La regola d\'oro è semplice: più basso è il prezzo, più accurate devono essere le verifiche. Un\'auto a 3.000 euro può comunque nascondere difetti che la rendono cara.',
        ],
      },
      {
        heading: 'Le verifiche da fare prima di incontrare il venditore',
        paragraphs: [
          'Prima ancora di andare a vedere l\'auto, chiedi al venditore:',
        ],
        list: [
          'Il numero di telaio e la targa, per fare una visura e controllare km, incidenti e fermi amministrativi.',
          'Il libretto dei tagliandi e lo storico delle revisioni (ogni revisione registra i km).',
          'Il numero di proprietari e l\'uso prevalente (urbano, extraurbano, autostrada).',
          'Eventuali lavori fatti: quando e perché.',
        ],
      },
      {
        heading: 'La visita e la prova su strada',
        paragraphs: [
          'Non comprare mai senza vedere l\'auto e provarla. Controlla la coerenza tra km dichiarati e usura di volante, pedali, sedili e freni. La prova su strada deve durare almeno 15–20 minuti e includere città e strada veloce: cambiate rumorose, vibrazioni e fumi sono bandiere rosse.',
          'Porta con te qualcuno che non è emotivamente coinvolto: due paia di occhi vedono il doppio.',
        ],
      },
      {
        heading: 'Documenti e pagamento',
        paragraphs: [
          'L\'atto di vendita tra privati richiede il nuovo libretto con l\'intestazione aggiornata, la prova dell\'avvenuto passaggio di proprietà e il modello di vendita compilato. Il pagamento va fatto solo dopo il passaggio alla Motorizzazione o in agenzia: evita bonifici "di acconto" prima di vedere i documenti nuovi a tuo nome.',
        ],
      },
      {
        heading: 'Cosa succede se il prezzo è troppo bello',
        paragraphs: [
          'Un prezzo nettamente sotto la media di mercato è il campanello d\'allarme più importante: può nascondere km alterati, danni gravi o documenti irregolari. Prima di tutto controlla il valore reale della stessa auto (marca, modello, anno) per capire quanto sia fuori mercato l\'offerta.',
        ],
      },
    ],
    cta: 'controllo-usato',
  },
  {
    slug: 'come-riconoscere-truffe-auto-usate',
    title: 'Le truffe più comuni sull\'auto usata e come riconoscerle',
    description:
      'Chilometraggio alterato, clonazione, documenti falsi, acconti fasulli: le truffe più diffuse nel mercato dell\'usato e i controlli per difendersi.',
    published: '2026-08-07',
    category: 'acquisto',
    sections: [
      {
        heading: 'Le truffe più diffuse',
        paragraphs: [
          'Il mercato dell\'usato attira tentativi di truffa soprattutto online. Le più comuni sono il chilometraggio alterato, le auto clonate (stesso telaio e targa di un\'auto identica), i documenti falsi e gli acconti richiesti prima della consegna.',
        ],
      },
      {
        heading: 'Il chilometraggio alterato',
        paragraphs: [
          'Abbassare i km dichiarati aumenta il prezzo e rende l\'auto più vendibile. Difendersi è facile: confronta i km registrati nelle revisioni (ogni revisione li riporta), chiedi lo storico dei tagliandi e controlla l\'usura reale di volante, pedali e freni. Le revisioni sono il registro più affidabile.',
        ],
      },
      {
        heading: 'Le auto clonate',
        paragraphs: [
          'Con la clonazione un\'auto rubata o incidentata viene ri-targata con i dati di un\'auto identica regolare. Il controllo chiave è la visura: verifiche che telaio, targa e allestimento coincidano e che non ci siano segnalazioni di furto o incidenti. La visura costa poco e blocca la truffa più grave.',
        ],
      },
      {
        heading: 'Acconti e pagamenti sospetti',
        paragraphs: [
          'Mai versare acconti a venditori che "riservano l\'auto" o chiedono bonifici verso conti esteri, carte prepagate o sistemi di trasferimento istantaneo. Se l\'auto è reale, si vede, si prova e si paga a passaggio avvenuto.',
        ],
      },
      {
        heading: 'La difesa migliore è la verifica',
        paragraphs: [
          'Prima di qualsiasi trattativa, verifica il valore reale di mercato del modello e fai una visura. Se hai già l\'auto di fronte, carica una foto su AutoEsperto: l\'analisi visiva AI segnala incongruenze di stato che i documenti non mostrano.',
        ],
      },
    ],
    cta: 'analisi-ai',
  },
  {
    slug: 'come-controllare-telaio-e-targhe-auto',
    title: 'Numero di telaio e targa: come verificarli prima dell\'acquisto',
    description:
      'Dove trovare il numero di telaio, come leggerlo, cosa dicono targa e visura e quali controlli fare per evitare auto clonate o con problemi.',
    published: '2026-08-07',
    category: 'acquisto',
    sections: [
      {
        heading: 'Cosa sono telaio e numero di telaio',
        paragraphs: [
          'Il numero di telaio (VIN) è il codice univoco di 17 caratteri che identifica l\'auto: contiene produttore, anno di produzione e codice identificativo. Non è replicabile: per questo è lo strumento migliore per verificare che l\'auto sia quella dichiarata.',
        ],
      },
      {
        heading: 'Dove trovare il numero di telaio',
        paragraphs: [
          'Sull\'auto il VIN è stampigliato in più punti: sul cruscotto lato guidatore (visibile dal parabrezza), sul montante della portiera, nel vano motore e sotto la scocca. Deve corrispondere al numero riportato sul libretto di circolazione: se non combacia, non comprare.',
        ],
      },
      {
        heading: 'La visura e i controlli su targa',
        paragraphs: [
          'Con targa e telaio puoi fare una visura che rivela i dati del veicolo, i passaggi di proprietà, i km registrati, gli incidenti dichiarati e i fermi amministrativi o il pignoramento. È il controllo chiave contro clonazioni e documenti falsi.',
        ],
      },
      {
        heading: 'I segnali di telaio manomesso',
        paragraphs: [
          'Rivetti allentati o sostituiti, saldature sospette, vernice nuova su una zona in cui il telaio non dovrebbe essere stato toccato: ogni segno di manomissione sulla piastrina del VIN è motivo per abbandonare l\'acquisto senza esitazioni.',
        ],
      },
      {
        heading: 'Prima di firmare',
        paragraphs: [
          'Verifica che targa, telaio e dati del libretto coincidano, che la visura sia pulita e che il prezzo sia in linea con il valore reale di mercato. Un controllo da pochi euro evita l\'errore più costoso nella compravendita di un\'auto.',
        ],
      },
    ],
    cta: 'controllo-usato',
  },
  {
    slug: 'concessionario-o-privato-per-usato',
    title: 'Concessionario o privato: dove conviene comprare l\'usato',
    description:
      'Vantaggi e rischi di comprare da concessionario o da privato: garanzia, prezzo, trattativa e cosa cambia davvero per il portafoglio.',
    published: '2026-08-07',
    category: 'acquisto',
    sections: [
      {
        heading: 'Le differenze principali',
        paragraphs: [
          'La differenza chiave è la garanzia: il concessionario deve offrire almeno 12 mesi di garanzia legale sulle auto usate, il privato nessuna. In cambio, il concessionario applica un margine che in media fa lievitare il prezzo del 5–15% rispetto allo stesso usato venduto da privato.',
        ],
      },
      {
        heading: 'Quando conviene il concessionario',
        paragraphs: [
          'Scegli il concessionario se non vuoi correre rischi: la garanzia copre i vizi occulti, la trattativa è più tutelata e spesso puoi ottenere un\'auto "certificata" con tagliandi in rete. Conviene soprattutto su auto recenti e sopra una certa cifra, dove la garanzia vale la differenza di prezzo.',
        ],
      },
      {
        heading: 'Quando conviene il privato',
        paragraphs: [
          'Il privato conviene quando il prezzo è il fattore dominante: stessa auto, molto meno. In cambio devi fare da solo tutte le verifiche (storico, revisioni, prova su strada) e rinunci alla garanzia. È una scelta sensata su auto economiche, dove i costi di un eventuale guasto sono contenuti.',
        ],
      },
      {
        heading: 'La via di mezzo: usato garantito dal concessionario',
        paragraphs: [
          'Molti concessionari propongono auto usate con garanzia estesa, tagliando incluso e restituzione entro un certo numero di giorni. Costa di più, ma elimina il rischio principale dell\'acquisto: scoprire un difetto grave dopo pochi mesi.',
        ],
      },
      {
        heading: 'Il criterio per decidere',
        paragraphs: [
          'Confronta sempre lo stesso modello allo stesso prezzo: se la differenza con il privato è piccola, la garanzia del concessionario è quasi sempre la scelta migliore; se è grande, fai tutte le verifiche del caso e valuta il risparmio. Controlla prima il valore reale di mercato per capire quanto stai davvero risparmiando.',
        ],
      },
    ],
    cta: 'controllo-usato',
  },
  {
    slug: 'come-comprare-auto-usata-a-rate',
    title: 'Comprare un\'auto a rate: come funziona e cosa controllare',
    description:
      'Finanziamento per auto usata: tasso, TAEG, anticipo, polizze collegate e clausole da leggere prima di firmare un contratto di rate.',
    published: '2026-08-07',
    category: 'acquisto',
    sections: [
      {
        heading: 'Come funziona il finanziamento',
        paragraphs: [
          'Il finanziamento auto è un prestito finalizzato: la finanziaria paga l\'auto al venditore e tu restituisci la somma a rate, con interessi. Il costo totale è la differenza tra il prezzo "di listino" e quello che paghi davvero in rate.',
        ],
      },
      {
        heading: 'TAEG e TAN: cosa leggere',
        paragraphs: [
          'Il TAN è il tasso nominale, il TAEG è il costo totale del credito e include anche spese di istruttoria, assicurazioni e altri oneri. Confronta sempre il TAEG, non il TAN: è il numero che ti dice quanto costa davvero il finanziamento.',
        ],
      },
      {
        heading: 'Anticipo e durata',
        paragraphs: [
          'Più alto è l\'anticipo e più breve la durata, meno paghi di interessi. Allungare il finanziamento a 72 o 84 mesi abbassa la rata ma aumenta il costo totale in modo sensibile: prima di firmare, controlla quanto paghi in più rispetto al prezzo di acquisto in contanti.',
        ],
      },
      {
        heading: 'Le clausole da non sottovalutare',
        paragraphs: [
          'Leggi con attenzione le polizze obbligatorie collegate (furto, incendio, protezione del credito), le penali per estinzione anticipata e le condizioni in caso di ritardo. Una "rata zero" spesso nasconde un anticipo molto alto o una maxi rata finale (future value) che riporta il debito a fine contratto.',
        ],
      },
      {
        heading: 'Il vero costo dell\'usato a rate',
        paragraphs: [
          'Finanziare un\'auto usata che continua a svalutarsi significa pagare interessi su un bene che perde valore: se il finanziamento è lungo, potresti ritrovarti a pagare più del valore reale dell\'auto già dopo pochi anni. Confronta il costo totale con il valore di mercato del modello prima di scegliere.',
        ],
      },
    ],
    cta: 'valutazione-auto',
  },
  {
    slug: 'auto-usata-diesel-benzina-ibrida',
    title: 'Usato: diesel, benzina o ibrida, quale conviene davvero',
    description:
      'Quale alimentazione scegliere sull\'usato: costi di carburante e manutenzione, domanda di rivendita e regole delle città per diesel, benzina e ibride.',
    published: '2026-08-07',
    category: 'acquisto',
    sections: [
      {
        heading: 'La scelta dipende dai chilometri',
        paragraphs: [
          'Il criterio principale è quanti km percorri all\'anno e dove. Il diesel conviene su percorrenze alte e autostradali, dove il consumo è basso e il motore lavora nelle condizioni ideali; in città è il peggiore: consuma di più, inquina e rischia le limitazioni.',
        ],
      },
      {
        heading: 'Benzina: la scelta universale',
        paragraphs: [
          'Sull\'usato la benzina è la scelta più semplice: costo contenuto, manutenzione prevedibile e domanda di rivendita solida. Per percorrenze sotto i 15.000 km l\'anno è quasi sempre la scelta più economica in termini di costo totale.',
        ],
      },
      {
        heading: 'Ibrida: il valore che tiene',
        paragraphs: [
          'Le ibride benzina-elettrico (soprattutto Toyota, Honda, Suzuki) sono tra le auto che si svalutano meno: consumano poco in città, non hanno le limitazioni delle diesel e hanno una domanda di usato altissima. Il costo di acquisto è più alto, ma il valore residuo lo compensa.',
        ],
      },
      {
        heading: 'Elettrica: i conti da fare',
        paragraphs: [
          'Sull\'usato l\'elettrica conviene se hai ricarica a casa o in ufficio: il costo per chilometro è bassissimo. Occhio però a autonomia reale, garanzia batteria e svalutazione ancora variabile: valuta il modello specifico, non l\'elettrico "in generale".',
        ],
      },
      {
        heading: 'Il calcolo del costo totale',
        paragraphs: [
          'Confronta sempre il costo totale di proprietà: acquisto, carburante, manutenzione, bollo, assicurazione e valore residuo alla rivendita. La guida pratica: calcola i consumi reali del modello e confrontali con il prezzo di acquisto prima di scegliere.',
        ],
      },
    ],
    cta: 'consumi-modello',
  },
  {
    slug: 'cambio-manuale-o-automatico-usato',
    title: 'Cambio manuale o automatico sull\'usato: quale scegliere',
    description:
      'Cambio manuale, automatico, CVT e doppia frizione: pro e contro, costi di manutenzione e valore di rivendita per scegliere sull\'usato.',
    published: '2026-08-07',
    category: 'acquisto',
    sections: [
      {
        heading: 'Le tipologie di cambio',
        paragraphs: [
          'Sull\'usato trovi quattro famiglie: il manuale tradizionale, l\'automatico a convertitore di coppia, il CVT (a variazione continua, tipico delle ibride giapponesi) e il doppia frizione (DSG e simili). Ognuna ha un comportamento e costi diversi.',
        ],
      },
      {
        heading: 'Manuale: semplice e economico',
        paragraphs: [
          'Il cambio manuale è il più affidabile e il più economico da riparare: la frizione è un ricambio normale. Resta la scelta migliore su auto economiche e per chi percorre pochi km, e non perde valore come si pensava: la domanda di manuali sull\'usato resta alta.',
        ],
      },
      {
        heading: 'Automatico: comfort e domanda crescente',
        paragraphs: [
          'Gli automatici moderni a convertitore sono molto affidabili e rendono la guida più semplice, soprattutto in città. Sull\'usato valgono in genere qualche punto percentuale in più al momento della rivendita, perché la richiesta di automatico continua a crescere.',
        ],
      },
      {
        heading: 'Doppia frizione e CVT: controlli specifici',
        paragraphs: [
          'I doppia frizione (come il DSG) sono brillanti ma hanno costi di manutenzione più alti: sui modelli usati chiedi se è già stato fatto il cambio olio e se ci sono state campagne di richiamo. I CVT vanno testati con attenzione: i "gradini" bruschi o lo slittamento in accelerazione sono segnali di usura.',
        ],
      },
      {
        heading: 'La prova che decide',
        paragraphs: [
          'In prova, verifica che il cambio inserisca senza strattoni, che non ci siano ritardi in partenza e che il passaggio di marcia a freddo sia fluido. Poi controlla l\'affidabilità del modello specifico: alcuni cambi hanno problemi noti da conoscere prima dell\'acquisto.',
        ],
      },
    ],
    cta: 'affidabilita-modello',
  },
  {
    slug: 'auto-usate-sotto-i-5000-euro',
    title: 'Le migliori auto usate sotto i 5.000 euro',
    description:
      'Cosa aspettarsi da un\'auto sotto i 5.000 euro, quali modelli offrono il miglior rapporto qualità-prezzo e come non sbagliare la scelta.',
    published: '2026-08-07',
    category: 'acquisto',
    sections: [
      {
        heading: 'Cosa compra un budget da 5.000 euro',
        paragraphs: [
          'Sotto i 5.000 euro si comprano auto di 10-15 anni con chilometraggi spesso importanti. Non aspettarti auto moderne: cerca invece esemplari con manutenzione documentata, pochi proprietari e una meccanica semplice ed economica da riparare.',
        ],
      },
      {
        heading: 'Le categorie che funzionano meglio',
        paragraphs: [
          'In questa fascia i migliori acquisti sono le utilitarie robuste (city car e piccole compatte) con motori benzina semplici, e le diesel più datate di marche con ricambi economici. Il punto di forza è il costo di gestione: la manutenzione annua bassa vale più dei cavalli.',
        ],
      },
      {
        heading: 'I controlli che contano in questa fascia',
        paragraphs: [
          'A questi prezzi lo storico vale tutto: controlla le revisioni (registrano i km), il chilometraggio e la distribuzione già fatta, che su un\'auto di questa età è uno dei lavori più costosi. Un\'auto a 4.500 euro che ha bisogno di 800 euro di lavori non è più un affare.',
        ],
      },
      {
        heading: 'Cosa evitare',
        paragraphs: [
          'Evita modelli con problemi noti di motore, auto da corsa usurate, esemplari senza documentazione e qualsiasi "occasione" con prezzo molto sotto la media per la stessa auto: spesso nasconde difetti gravi. E controlla sempre l\'assenza di fermi amministrativi e pignoramenti con una visura.',
        ],
      },
      {
        heading: 'Prima di decidere',
        paragraphs: [
          'Verifica il valore reale di mercato dell\'esemplare specifico e confrontalo con la richiesta: se è sopra la media degli annunci per lo stesso modello e anno, cerca altro. Con la manutenzione giusta, un\'usato economico ben scelto può durare ancora molti anni.',
        ],
      },
    ],
    cta: 'valutazione-auto',
  },
  {
    slug: 'prima-auto-per-neopatentati',
    title: 'Prima auto per neopatentati: cosa scegliere nel 2026',
    description:
      'Limiti di potenza per i neopatentati, costo di gestione, sicurezza e i modelli più adatti come prima auto nel 2026.',
    published: '2026-08-07',
    category: 'acquisto',
    sections: [
      {
        heading: 'Le regole per i neopatentati',
        paragraphs: [
          'Per i primi tre anni dalla patente la legge limita la potenza: 70 kW (95 CV) e 55 kW per tonnellata. Il peso a vuoto è cruciale: un\'auto leggera con 95 CV può superare il rapporto consentito, quindi controlla sempre la potenza specifica (kW/t) prima dell\'acquisto.',
        ],
      },
      {
        heading: 'Cosa conta in una prima auto',
        paragraphs: [
          'La prima auto deve costare poco da comprare, poco da assicurare e poco da mantenere: la classe assicurativa di un neopatentato fa lievitare i premi, quindi scegli modelli con costo di gestione basso e ricambi economici.',
        ],
      },
      {
        heading: 'Le caratteristiche ideali',
        paragraphs: [
          'Una piccola city car o utilitaria con motore benzina o ibrida è la scelta tipica: maneggevole, economica e con consumi bassi. Anche la sicurezza conta: cerca airbag, controllo di stabilità (ESP) e una buona struttura, senza rinunciare alla praticità in città.',
        ],
      },
      {
        heading: 'Usato o quasi nuovo',
        paragraphs: [
          'Per un neopatentato l\'usato recente è quasi sempre la scelta migliore: si evita la svalutazione dei primi anni e si resta dentro i limiti di legge con un budget contenuto. I modelli più richiesti come prima auto tendono a tenere bene il valore, un vantaggio al momento della rivendita.',
        ],
      },
      {
        heading: 'Il budget reale',
        paragraphs: [
          'Oltre al prezzo di acquisto, considera assicurazione (che per un neopatentato pesa molto), bollo, manutenzione e carburante. Prima di scegliere, confronta il costo totale di gestione del modello che ti piace e verifica il suo valore di mercato per non pagare sopra la media.',
        ],
      },
    ],
    cta: 'valutazione-auto',
  },
  {
    slug: 'come-controllare-storico-auto-usata',
    title: 'Come controllare lo storico di un\'auto usata',
    description:
      'Dove e come verificare lo storico di un\'auto usata: revisioni, tagliandi, incidenti, passaggi di proprietà e i report che rivelano la vera storia.',
    published: '2026-08-07',
    category: 'acquisto',
    sections: [
      {
        heading: 'Perché lo storico conta',
        paragraphs: [
          'Lo storico è la memoria dell\'auto: revisioni, tagliandi, incidenti e passaggi di proprietà raccontano come è stata usata e curata. Un\'auto con uno storico pulito vale di più e ha meno sorprese; una senza documentazione è una scommessa.',
        ],
      },
      {
        heading: 'Le revisioni: il registro più affidabile',
        paragraphs: [
          'Ogni revisione obbligatoria registra i km al momento del controllo. Confrontare i km delle revisioni tra loro e con quelli dichiarati è il modo più semplice per scovare un chilometraggio alterato: se i numeri non crescono in modo coerente, qualcosa non torna.',
        ],
      },
      {
        heading: 'I tagliandi e le officine',
        paragraphs: [
          'Il libretto dei tagliandi, con date e km, mostra la regolarità della manutenzione. Per le auto più recenti i tagliandi in rete autorizzata sono tracciabili anche digitalmente. Una manutenzione saltuaria o "persa" va scontata sul prezzo.',
        ],
      },
      {
        heading: 'La visura e i report su targa e telaio',
        paragraphs: [
          'Con targa e numero di telaio puoi richiedere una visura e report storici che rivelano incidenti dichiarati, passaggi di proprietà, km registrati, fermi amministrativi, pignoramenti e risultanze di furto. È il controllo più importante prima di qualsiasi acquisto.',
        ],
      },
      {
        heading: 'Come usare le informazioni',
        paragraphs: [
          'Lo storico non decide da solo: un\'auto con un incidente dichiarato ma ben riparata può essere un buon affare se il prezzo lo riflette. Usa le informazioni per negoziare, ma prima controlla sempre il valore reale di mercato per capire se la richiesta è in linea.',
        ],
      },
    ],
    cta: 'controllo-usato',
  },
  {
    slug: 'quale-anno-scegliere-auto-usata',
    title: 'Quale anno di auto usata conviene comprare',
    description:
      'Come cambiano valore, costi di manutenzione e tecnologia in base all\'anno dell\'auto: quale annata offre il miglior compromesso sull\'usato.',
    published: '2026-08-07',
    category: 'acquisto',
    sections: [
      {
        heading: 'Perché l\'anno è un dato decisivo',
        paragraphs: [
          'L\'anno determina prezzo, tecnologia, sicurezza e costi di manutenzione. La svalutazione è più rapida nei primi 3-5 anni, poi rallenta: questo rende le auto di 4-7 anni il punto dolce del mercato dell\'usato, dove il prezzo è già sceso ma l\'auto è ancora moderna.',
        ],
      },
      {
        heading: 'Il momento in cui il valore scende più in fretta',
        paragraphs: [
          'Il primo anno l\'auto perde in media il 15-25% del valore, e nei primi tre anni può arrivare al 40%. Comprare un\'auto di 3-5 anni evita la parte più ripida della svalutazione: paghi meno e al momento della rivendita perdi proporzionalmente meno.',
        ],
      },
      {
        heading: 'Anno e sicurezza: quando conviene andare recenti',
        paragraphs: [
          'Dopo un certo anno le auto hanno dotazioni di sicurezza (ADAS, frenata d\'emergenza, telecamere) che prima non esistevano. Se l\'auto è per la famiglia o per molti km in autostrada, valuta un anno più recente con questi sistemi: possono valere la differenza di prezzo.',
        ],
      },
      {
        heading: 'Anno e costi di manutenzione',
        paragraphs: [
          'Le auto più datate costano di più da mantenere: ricambi, usure e interventi come distribuzione e frizione crescono con l\'età. Per questo la scelta dell\'anno va fatta insieme al controllo della manutenzione già svolta: un\'auto più vecchia con distribuzione e tagliandi fatti può costare meno di una più recente da sistemare.',
        ],
      },
      {
        heading: 'Il metodo pratico',
        paragraphs: [
          'Per ogni candidata, guarda il prezzo medio per anno, la dotazione di sicurezza e i costi di manutenzione del modello. Confronta il costo totale dei prossimi 5 anni: spesso l\'annata "di mezzo" è quella che fa spendere meno.',
        ],
      },
    ],
    cta: 'valutazione-auto',
  },
  {
    slug: 'domande-da-fare-prima-di-comprare-usato',
    title: 'Le 10 domande da fare prima di comprare un\'auto usata',
    description:
      'Le domande giuste al venditore per smascherare problemi: km, incidenti, manutenzione, uso e i dettagli che rivelano la vera storia dell\'auto.',
    published: '2026-08-07',
    category: 'acquisto',
    sections: [
      {
        heading: 'Perché le domande contano',
        paragraphs: [
          'Le risposte del venditore, con i suoi tempi e i suoi tentennamenti, valgono quanto i documenti. Fare le domande giuste è il primo filtro: chi ha qualcosa da nascondere si scopre presto.',
        ],
      },
      {
        heading: 'Le domande sul chilometraggio',
        paragraphs: [
          'Chiedi quanti km reali ha, quanti ne vengono percorsi ogni anno e come è stato usato (città, extraurbano, autostrada). Controlla poi la coerenza con le revisioni: le risposte devono tornare con i documenti.',
        ],
      },
      {
        heading: 'Le domande sugli incidenti',
        paragraphs: [
          'Chiedi direttamente se l\'auto ha avuto incidenti e che lavori di carrozzeria sono stati fatti. Chi ha riparato un danno tende a minimizzare: verifica con la visura gli incidenti dichiarati e cerca stuccature o differenze di vernice sulle fiancate.',
        ],
      },
      {
        heading: 'Le domande su manutenzione e documenti',
        paragraphs: [
          'Chiedi di vedere il libretto dei tagliandi, le fatture dei lavori, le revisioni e il numero di proprietari. La domanda chiave: "Perché vendi?" — la risposta (auto aziendale, cambio, trasferimento) dice molto sulla storia.',
        ],
      },
      {
        heading: 'Le domande tecniche',
        paragraphs: [
          'Chiedi quando è stata fatta la distribuzione, la frizione, i freni e le gomme: la risposta rivela i lavori già fatti e quelli da fare. Un venditore serio risponde con dati; se "non si ricorda" o risponde in modo vago, controlla da solo e valuta se il prezzo lo giustifica.',
        ],
      },
    ],
    cta: 'analisi-ai',
  },
  {
    slug: 'come-preparare-auto-per-la-vendita',
    title: 'Come preparare l\'auto per la vendita e aumentarne il valore',
    description:
      'Lavaggio, piccoli interventi estetici, documenti in ordine e gli accorgimenti che aumentano il valore percepito (e reale) di un\'auto in vendita.',
    published: '2026-08-07',
    category: 'vendita',
    sections: [
      {
        heading: 'La prima impressione è la metà del prezzo',
        paragraphs: [
          'Un\'auto pulita e curata all\'interno e all\'esterno fa percepire un valore più alto e attira più offerte. Il costo di una pulizia profonda è piccolo rispetto al beneficio: interni senza odori, cruscotto curato e fanali lucidi cambiano il risultato delle visite.',
        ],
      },
      {
        heading: 'I piccoli interventi che valgono più di quanto costano',
        paragraphs: [
          'Sistemare i piccoli difetti visibili (parabrezza scheggiato, lampadine bruciate, plastiche graffiate) evita che l\'acquirente li usi per chiedere sconti. Interventi da poche decine di euro possono valere centinaia di euro in più in trattativa.',
        ],
      },
      {
        heading: 'Documenti e storico in ordine',
        paragraphs: [
          'Prepara il libretto di circolazione, i tagliandi, le fatture dei lavori e le revisioni: la documentazione completa è uno degli argomenti più forti per giustificare il prezzo. Un\'auto con storico documentato si vende più in fretta e a condizioni migliori.',
        ],
      },
      {
        heading: 'Le foto e il primo annuncio',
        paragraphs: [
          'Foto nitide, con luce naturale, di tutti i lati e gli interni, aumentano le visualizzazioni dell\'annuncio. Scatta anche i dettagli (gomme, cruscotto, bagagliaio): la trasparenza riduce le visite "per sentire" e attrae compratori seri.',
        ],
      },
      {
        heading: 'Quanto vale davvero la tua auto',
        paragraphs: [
          'Preparazione e documenti non creano valore dal nulla: servono a ottenere il prezzo giusto, non a superarlo. Prima di pubblicare l\'annuncio, controlla il valore reale di mercato della tua auto per fissare una richiesta credibile e difendibile.',
        ],
      },
    ],
    cta: 'valore-vendita',
  },
  {
    slug: 'come-scrivere-annuncio-auto-perfetto',
    title: 'Come scrivere un annuncio che vende l\'auto in fretta',
    description:
      'Titolo, descrizione, foto e dati tecnici: la struttura di un annuncio auto efficace che attira compratori seri e riduce le trattative inutili.',
    published: '2026-08-07',
    category: 'vendita',
    sections: [
      {
        heading: 'Il titolo: i dati che contano',
        paragraphs: [
          'Il titolo deve contenere marca, modello, anno, alimentazione e chilometraggio: sono i campi che gli acquirenti cercano. Un titolo con dati precisi appare nei risultati di ricerca; uno generico ("auto usata in ottime condizioni") sparisce.',
        ],
      },
      {
        heading: 'La descrizione: onesta e completa',
        paragraphs: [
          'Descrivi allestimento, motore, optional e storico in modo onesto. Menziona i lavori fatti (tagliandi, distribuzione, gomme nuove): sono i dettagli che giustificano il prezzo. Nascondere i difetti non regge: gli acquirenti seri li scoprono in visita e abbandonano la trattativa.',
        ],
      },
      {
        heading: 'Le foto che vendono',
        paragraphs: [
          'Una buona foto vale più di mille parole: scatta con luce naturale, mostrando tutti i lati, gli interni, il cruscotto con i km e il bagagliaio. Le auto con foto complete ricevono molti più contatti e visite di qualità.',
        ],
      },
      {
        heading: 'Il prezzo nel annuncio',
        paragraphs: [
          'Il prezzo deve essere in linea con il mercato: troppo alto allontana, troppo basso insospettisce. Controlla il valore reale di mercato del modello e posiziona la richiesta in linea con gli annunci, lasciando un piccolo margine per la trattativa.',
        ],
      },
      {
        heading: 'I segnali che il annuncio funziona',
        paragraphs: [
          'Se ricevi poche visite, qualcosa non va: prezzo fuori mercato, foto brutte o titolo poco chiaro. Se ricevi molti contatti ma nessuna visita, probabilmente il prezzo è troppo alto. Usa i segnali per correggere l\'annuncio invece di aspettare.',
        ],
      },
    ],
    cta: 'valore-vendita',
  },
  {
    slug: 'dove-pubblicare-annuncio-auto',
    title: 'Dove vendere l\'auto: i canali migliori per l\'annuncio',
    description:
      'Portali online, concessionari, buyback e vendita diretta: vantaggi, costi e tempi dei canali per vendere l\'auto nel 2026.',
    published: '2026-08-07',
    category: 'vendita',
    sections: [
      {
        heading: 'I portali online generalisti e specializzati',
        paragraphs: [
          'I portali di annunci (generalisti e specializzati in auto) sono il canale principale: raggiungono tantissimi acquirenti, ma richiedono foto, descrizione e gestione delle risposte. I più specializzati attirano compratori più motivati.',
        ],
      },
      {
        heading: 'I portali a offerta',
        paragraphs: [
          'Alcuni servizi permettono di ricevere offerte da concessionari iscritti, senza pubblicare un annuncio pubblico: comodo e veloce, ma le offerte tendono a essere sotto il prezzo di vendita a privato. Ideale se hai fretta o non vuoi gestire trattative.',
        ],
      },
      {
        heading: 'Il concessionario e il buyback',
        paragraphs: [
          'Il concessionario è la via più rapida: ti fa un\'offerta e chiude in giornata, ma applica il suo margine. I servizi di compravendita diretta (buyback) funzionano in modo simile, con valutazione online. Ottimi per velocità, peggiori per prezzo.',
        ],
      },
      {
        heading: 'La vendita a privato',
        paragraphs: [
          'Il privato è il canale con il prezzo più alto, ma con tempi e lavoro maggiori: annuncio, visite, prove su strada e trattative. Conviene quando hai tempo e l\'auto ha una domanda ampia; è sconsigliato se devi liberartene in fretta.',
        ],
      },
      {
        heading: 'Come scegliere',
        paragraphs: [
          'La scelta dipende dal compromesso prezzo-tempo che vuoi. In ogni caso parte dallo stesso dato: il valore reale di mercato della tua auto. Confronta le offerte dei concessionari con quel numero per capire se stai svendendo o facendo un buon affare.',
        ],
      },
    ],
    cta: 'valore-vendita',
  },
  {
    slug: 'come-negoziare-quando-vendi-auto',
    title: 'Come negoziare il prezzo quando vendi l\'auto',
    description:
      'Come difendere il prezzo della tua auto in trattativa: preparazione, risposte agli sconti richiesti e i punti su cui non cedere.',
    published: '2026-08-07',
    category: 'vendita',
    sections: [
      {
        heading: 'Arriva preparato',
        paragraphs: [
          'La trattativa si vince prima che inizi: sapere esattamente quanto vale la tua auto (con dati dagli annunci reali) ti dà la base per difendere il prezzo. Senza dati, ogni richiesta di sconto sembra ragionevole.',
        ],
      },
      {
        heading: 'Fissa un prezzo con margine',
        paragraphs: [
          'Pubblica un prezzo leggermente sopra il tuo minimo accettabile, ma non troppo: un margine del 3-5% lascia spazio alla trattativa senza allontanare gli acquirenti seri. Il prezzo pubblicato deve essere comunque difendibile: troppo alto fa scappare prima ancora di negoziare.',
        ],
      },
      {
        heading: 'Come gestire le richieste di sconto',
        paragraphs: [
          'Di fronte a una richiesta di sconto, chiedi su cosa si basa: "qual è il problema che giustifica questa cifra?". Se l\'acquirente cita difetti veri, valuta se sistemarli è meglio che scendere; se cita solo "perché la voglio", non cedere. Ricorda che hai già documentato lo storico: è la tua arma.',
        ],
      },
      {
        heading: 'I punti da non negoziare',
        paragraphs: [
          'Non negoziare su documenti e sicurezza: il passaggio di proprietà e la correttezza dei dati non sono moneta di scambio. Evita anche gli sconti "a sorpresa" all\'ultimo momento: stabilisci prima le condizioni e, se cambiano, riparti da capo.',
        ],
      },
      {
        heading: 'Quando chiudere',
        paragraphs: [
          'Se l\'offerta è in linea con il valore di mercato e l\'acquirente è serio, chiudi: la differenza di qualche centinaio di euro vale meno di mesi di annunci attivi. Confronta sempre l\'offerta con il valore reale di mercato: è il metro con cui decidere.',
        ],
      },
    ],
    cta: 'valore-vendita',
  },
  {
    slug: 'quanto-tempo-per-vendere-auto',
    title: 'Quanto tempo serve per vendere un\'auto usata',
    description:
      'Tempi medi di vendita per canale, fattori che accelerano o rallentano e cosa fare se l\'auto non si vende.',
    published: '2026-08-07',
    category: 'vendita',
    sections: [
      {
        heading: 'I tempi medi',
        paragraphs: [
          'In media un\'auto usata venduta a privato resta in vendita 2-6 settimane; tramite concessionario o servizi di compravendita diretta si chiude in pochi giorni. Il tempo dipende da prezzo, modello, stagione e qualità dell\'annuncio.',
        ],
      },
      {
        heading: 'I modelli che vendono in fretta',
        paragraphs: [
          'City car, ibride e modelli con forte domanda (utilitarie, SUV compatti) si vendono in fretta se il prezzo è giusto. I modelli di nicchia, le auto molto datate o con percorrenze alte possono richiedere molto più tempo: in quei casi il canale privato può non bastare.',
        ],
      },
      {
        heading: 'I fattori che rallentano la vendita',
        paragraphs: [
          'Prezzo sopra la media, foto scarse, annunci senza dati tecnici e tempistiche sbagliate (inverno per una decappottabile, per esempio) sono i principali freni. Anche una domanda debole per il modello specifico pesa: se il mercato non lo cerca, nessun annuncio aiuta.',
        ],
      },
      {
        heading: 'Quando correggere la rotta',
        paragraphs: [
          'Se dopo 2-3 settimane ricevi poche visite, abbassa il prezzo o migliora l\'annuncio. Confronta la tua richiesta con la media degli annunci reali per lo stesso modello: se sei sopra, è il prezzo il problema; se sei in linea, è la visibilità.',
        ],
      },
      {
        heading: 'Il calcolo che decide',
        paragraphs: [
          'Ogni settimana di vendita ha un costo: la svalutazione continua a correre e l\'auto in vendita immobilizza tempo e spazio. Se i tempi stimati si allungano, valuta il prezzo offerto dai canali veloci: spesso la differenza è inferiore a quanto perdi aspettando.',
        ],
      },
    ],
    cta: 'valore-vendita',
  },
  {
    slug: 'documenti-per-vendere-auto',
    title: 'I documenti per vendere l\'auto tra privati',
    description:
      'Cosa serve per vendere un\'auto a un privato: libretto, passaggio di proprietà, atto di vendita e gli adempimenti per evitare brutte sorprese.',
    published: '2026-08-07',
    category: 'vendita',
    sections: [
      {
        heading: 'I documenti necessari',
        paragraphs: [
          'Per vendere un\'auto a un privato servono il libretto di circolazione, la carta di circolazione in ordine e il documento d\'identità valido. Il passaggio di proprietà si fa alla Motorizzazione o in agenzia di pratiche auto: lì si aggiorna l\'intestatario.',
        ],
      },
      {
        heading: 'Il passaggio di proprietà',
        paragraphs: [
          'Il passaggio di proprietà è l\'atto che trasferisce la titolarità: si presenta la domanda di trascrizione con i documenti e si paga il relativo costo (importo fisso + imposta provinciale). La procedura si può fare anche online tramite agenzie autorizzate.',
        ],
      },
      {
        heading: 'L\'atto di vendita tra privati',
        paragraphs: [
          'L\'atto di vendita (o il modulo di vendita) documenta l\'accordo tra le parti: viene firmato al momento della consegna e riporta dati di venditore, acquirente e veicolo. Va conservato come prova dell\'avvenuta cessione.',
        ],
      },
      {
        heading: 'Cosa controllare prima di firmare',
        paragraphs: [
          'Prima di consegnare le chiavi, verifica che non ci siano fermi amministrativi o pignoramenti sull\'auto: se ci sono, il passaggio non si può completare e la vendita salta. Una visura veloce evita perdite di tempo e sorprese per entrambe le parti.',
        ],
      },
      {
        heading: 'L\'intestazione e la comunicazione all\'assicurazione',
        paragraphs: [
          'Dopo il passaggio, comunica la vendita alla tua assicurazione per sospendere o trasferire la polizza, e ricordati che il bollo va pagato fino al mese del passaggio (con regole che variano per regione). Una cessione pulita protegge sia chi vende sia chi compra.',
        ],
      },
    ],
    cta: 'valore-vendita',
  },
  {
    slug: 'rottamare-o-vendere-auto',
    title: 'Rottamare o vendere l\'auto: quale conviene',
    description:
      'Quando conviene rottamare, quando vendere e quando chiedere la permuta: il calcolo tra valore reale, incentivi e costi di gestione.',
    published: '2026-08-07',
    category: 'vendita',
    sections: [
      {
        heading: 'Quando l\'auto non vale più nulla',
        paragraphs: [
          'Se l\'auto è molto vecchia, danneggiata o con riparazioni costose da fare, il valore di rivendita può scendere vicino allo zero. In quel caso la rottamazione (o l\'eco-incentivo) diventa competitiva con la vendita.',
        ],
      },
      {
        heading: 'Il valore della rottamazione',
        paragraphs: [
          'La rottamazione dà diritto a un valore fisso per la carcassa, più l\'eventuale contributo se l\'auto rientra nei limiti di emissioni e i programmi di incentivi statali o regionali lo prevedono. Vale soprattutto come "leva" per ottenere uno sconto sull\'auto nuova.',
        ],
      },
      {
        heading: 'Il calcolo onesto',
        paragraphs: [
          'Prima di rottamare, controlla il valore reale di mercato della tua auto: capita spesso che un\'auto considerata "da rottamare" valga ancora 1.000-3.000 euro tra privati. La differenza tra vendita e rottamazione è spesso più grande di quanto si pensi.',
        ],
      },
      {
        heading: 'Rottamare per comprare: l\'incentivo',
        paragraphs: [
          'Se il tuo obiettivo è comprare un\'auto nuova, l\'incentivo sulla rottamazione può superare il valore di vendita del vecchio veicolo. Confronta sempre: sconto incentivo + valore rottamazione contro il prezzo che otterresti vendendo a privato.',
        ],
      },
      {
        heading: 'La regola pratica',
        paragraphs: [
          'Vendi se l\'auto ha ancora un mercato e il costo delle riparazioni necessarie è basso rispetto al suo valore; rottama se le riparazioni superano il valore del veicolo o se gli incentivi all\'acquisto rendono la rottamazione più vantaggiosa. Il confronto parte sempre dal valore reale.',
        ],
      },
    ],
    cta: 'valutazione-auto',
  },
  {
    slug: 'come-fissare-prezzo-vendita-auto',
    title: 'Come fissare il prezzo di vendita dell\'auto',
    description:
      'Come scegliere il prezzo giusto per vendere in fretta senza svendere: valore di mercato, prezzo pubblicato, margine di trattativa e strategia.',
    published: '2026-08-07',
    category: 'vendita',
    sections: [
      {
        heading: 'Parti dal valore reale',
        paragraphs: [
          'Il prezzo di vendita non si decide "a sentimento": parte dal valore reale di mercato, cioè la media dei prezzi degli annunci reali per lo stesso modello, stesso anno e condizioni simili. Quel numero è la tua ancora: sopra, vendi poco o mai; sotto, svendi.',
        ],
      },
      {
        heading: 'La fascia di mercato',
        paragraphs: [
          'Ogni modello ha una fascia di prezzo: il minimo e il massimo degli annunci per lo stesso anno. Se il tuo esemplare ha pochi km, tagliandi in rete e optional, sei nel quartile alto; se ha percorrenze alte e da sistemare, sei nel basso. Il prezzo giusto è dentro la fascia, non fuori.',
        ],
      },
      {
        heading: 'Il prezzo pubblicato e il margine',
        paragraphs: [
          'Pubblica un prezzo leggermente sopra il tuo obiettivo per lasciare spazio alla trattativa (3-5%), ma mai sopra la fascia di mercato: un prezzo "da sogno" spaventa gli acquirenti e nessuno ti contatta. Il margine serve a negoziare, non a nascondere un prezzo irrealistico.',
        ],
      },
      {
        heading: 'Quando abbassare',
        paragraphs: [
          'Se dopo alcune settimane non ricevi visite serie, il prezzo è probabilmente sopra il valore percepito: abbassalo avvicinandoti alla media reale. Un prezzo corretto da subito vende in settimane; un prezzo alto resta in vendita per mesi, facendoti perdere più di quanto speravi di guadagnare.',
        ],
      },
      {
        heading: 'La coerenza con la tua offerta',
        paragraphs: [
          'Il prezzo deve riflettere ciò che offri: documentazione completa, gomme e tagliandi recenti giustificano la parte alta della fascia; un\'auto "così com\'è" no. Prepara la documentazione prima di fissare il prezzo: è ciò che rende credibile la richiesta.',
        ],
      },
    ],
    cta: 'valore-vendita',
  },
  {
    slug: 'come-calcolare-svalutazione-auto',
    title: 'Come calcolare la svalutazione dell\'auto anno per anno',
    description:
      'Come calcolare il deprezzamento di un\'auto: percentuali per anno, fattori che lo accelerano e come stimare il valore futuro prima di comprare.',
    published: '2026-08-07',
    category: 'valutazione',
    sections: [
      {
        heading: 'Cos\'è la svalutazione',
        paragraphs: [
          'La svalutazione (o deprezzamento) è la perdita di valore dell\'auto nel tempo: è il costo più grande della proprietà di un\'auto, spesso superiore a carburante e manutenzione messi insieme. Calcolarla bene evita sia di svendere sia di pagare troppo.',
        ],
      },
      {
        heading: 'Le percentuali tipiche',
        paragraphs: [
          'In media un\'auto perde il 15-25% del valore il primo anno, circa il 40% entro i primi tre e il 50-60% dopo 5 anni. Ma sono medie: i modelli a forte domanda (city car, ibride) perdono molto meno, mentre elettriche di prima generazione e modelli di nicchia perdono di più.',
        ],
      },
      {
        heading: 'I fattori che accelerano il deprezzamento',
        paragraphs: [
          'Perdono valore più in fretta: i modelli poco richiesti, quelli con problemi noti di affidabilità, le versioni con motori diesel nelle città a bassa emissione, e le auto con percorrenze alte. Anche l\'assenza di storico e optional datati pesano.',
        ],
      },
      {
        heading: 'I fattori che lo rallentano',
        paragraphs: [
          'Tengono meglio il valore: la forte domanda di usato, i costi di gestione bassi, l\'affidabilità dimostrata e le motorizzazioni ibride e benzina moderne. Un\'auto "da molti" che tutti cercano ha una curva di svalutazione molto più dolce.',
        ],
      },
      {
        heading: 'Il calcolo pratico',
        paragraphs: [
          'Il modo più affidabile per calcolare la svalutazione è confrontare il valore attuale del modello con quello di acquisto, usando i prezzi reali degli annunci. Guardando la differenza tra anni successivi capisci quanto perde ogni anno e quando conviene vendere prima che la curva si appiattisca.',
        ],
      },
    ],
    cta: 'valutazione-auto',
  },
  {
    slug: 'fattori-che-influenzano-valore-auto',
    title: 'I fattori che fanno salire o scendere il valore dell\'auto',
    description:
      'Chilometraggio, condizioni, storico, optional e domanda: i fattori che determinano il valore di un\'auto usata e come pesano sul prezzo.',
    published: '2026-08-07',
    category: 'valutazione',
    sections: [
      {
        heading: 'I fattori interni',
        paragraphs: [
          'Stato generale, chilometraggio, manutenzione, numero di proprietari e optional: sono i fattori che il venditore controlla. Un\'auto ben mantenuta con pochi km e un proprietario vale sensibilmente di più della stessa auto con storico saltuario.',
        ],
      },
      {
        heading: 'Il chilometraggio',
        paragraphs: [
          'Il chilometraggio è il fattore che pesa di più sul valore: meno km significa meno usura e più vita davanti. Ma il numero va letto con il contesto: 150.000 km di autostrada valgono più di 80.000 km di città, e i km devono essere coerenti con l\'età e i tagliandi.',
        ],
      },
      {
        heading: 'La manutenzione e lo storico',
        paragraphs: [
          'Un\'auto con libretto dei tagliandi e revisioni regolari vale il 10-15% in più di una senza documentazione. I lavori importanti già fatti (distribuzione, frizione, gomme nuove) aumentano il valore e rendono il prezzo più credibile.',
        ],
      },
      {
        heading: 'Gli optional e la dotazione',
        paragraphs: [
          'Non tutti gli optional aggiungono valore: cambio automatico, fari LED, sensori di parcheggio e climatizzatore automatico sì; modifiche estetiche e accessori aftermarket quasi mai. La domanda per la versione specifica (allestimento, motore, alimentazione) conta più del costo originario dell\'accessorio.',
        ],
      },
      {
        heading: 'I fattori esterni',
        paragraphs: [
          'La domanda di mercato, la stagione e le regole di accesso alle città influenzano il valore senza che il venditore possa farci nulla: un diesel in una città che lo limita vale meno di un\'ibrida. Per questo il valore reale si misura sugli annunci, non sui listini: verifica la media per il tuo modello prima di fissare qualsiasi prezzo.',
        ],
      },
    ],
    cta: 'valutazione-auto',
  },
  {
    slug: 'quanto-incide-chilometraggio-sul-valore',
    title: 'Quanto incide il chilometraggio sul valore di un\'auto',
    description:
      'Come i km influenzano il prezzo di un\'usato: il valore dei km in più, i punti di riferimento e quando il chilometraggio conta meno di quanto si creda.',
    published: '2026-08-07',
    category: 'valutazione',
    sections: [
      {
        heading: 'La regola di base',
        paragraphs: [
          'A parità di modello e anno, meno km significa più valore: è la regola più conosciuta del mercato dell\'usato. La percorrenza media in Italia è di circa 12.000 km l\'anno: molto sotto la media aumenta il valore, molto sopra lo riduce.',
        ],
      },
      {
        heading: 'Quanto vale un km in meno',
        paragraphs: [
          'La relazione non è lineare: i primi chilometri (da nuovo) costano tantissimo, poi il valore per km cala. Sull\'usato, la differenza tra 40.000 e 60.000 km vale più di quella tra 120.000 e 140.000 km. La curva del deprezzamento si appiattisce con l\'età: su auto vecchie il chilometraggio conta meno dello stato generale.',
        ],
      },
      {
        heading: 'Quando i km non contano',
        paragraphs: [
          'Su auto datate, il chilometraggio pesa meno di manutenzione e stato: un\'auto con 180.000 km e tagliandi regolari vale più di una con 100.000 km e manutenzione saltuaria. Anche il tipo di percorrenza conta: i km di autostrada usurano meno dei km di città.',
        ],
      },
      {
        heading: 'I km sospetti',
        paragraphs: [
          'Un chilometraggio troppo basso per l\'età va controllato: potrebbe essere un\'auto d\'epoca custodita o un contachilometri alterato. Confronta i km con le revisioni (ogni revisione registra il chilometraggio): se non combaciano, non fidarti.',
        ],
      },
      {
        heading: 'Il metodo pratico',
        paragraphs: [
          'Per capire quanto valgono i km in più, confronta gli annunci dello stesso modello e anno con chilometraggi diversi: la differenza di prezzo tra un esemplare a 60.000 e uno a 120.000 km ti dice quanto pesa quel dato sul tuo modello specifico.',
        ],
      },
    ],
    cta: 'valutazione-auto',
  },
  {
    slug: 'accessori-che-aumentano-valore-auto',
    title: 'Gli accessori che aumentano davvero il valore dell\'auto',
    description:
      'Quali optional aggiungono valore di rivendita e quali no: dotazioni che gli acquirenti cercano e accessori che non ripagano il costo.',
    published: '2026-08-07',
    category: 'valutazione',
    sections: [
      {
        heading: 'La regola: compra ciò che gli altri cercano',
        paragraphs: [
          'Il valore di un optional si misura sulla domanda degli acquirenti dell\'usato, non sul costo pagato al momento dell\'acquisto. Un accessorio che tutti cercano aumenta il valore; uno che nessuno considera non lo ripaga mai.',
        ],
      },
      {
        heading: 'Gli optional che aggiungono valore',
        paragraphs: [
          'Cambio automatico, fari full LED, sensori e telecamera di parcheggio, sedili riscaldati, climatizzatore automatico e sistemi ADAS sono gli optional che gli acquirenti cercano davvero. Sull\'usato possono valere centinaia o migliaia di euro in più rispetto alla versione base.',
        ],
      },
      {
        heading: 'Gli optional che non aggiungono valore',
        paragraphs: [
          'Cerchi aftermarket, impianti di scarico modificati, adesivi, interni "tuning" e personalizzazioni estreme non aumentano il valore e in alcuni casi lo riducono: restringono il pubblico di acquirenti. Anche gli accessori tecnologici datati (navigatori fissi di vecchia generazione) contano meno della ricarica wireless per il telefono.',
        ],
      },
      {
        heading: 'I danni che bruciano valore',
        paragraphs: [
          'Le modifiche che degradano l\'auto — motore elaborato, sospensioni abbassate non certificate, interni rovinati da modifiche — fanno scendere il valore sotto la media: gli acquirenti le vedono come rischio, non come valore.',
        ],
      },
      {
        heading: 'Come valorizzare le dotazioni in vendita',
        paragraphs: [
          'Quando vendi, elenca gli optional nella descrizione e nelle foto (sedili riscaldati, ADAS, cambio automatico): è ciò che giustifica la parte alta della fascia di prezzo. E ricorda: il valore di mercato si verifica sugli annunci reali, dove le versioni accessoriate hanno davvero prezzi più alti.',
        ],
      },
    ],
    cta: 'valutazione-auto',
  },
  {
    slug: 'come-valutare-auto-incidentata',
    title: 'Come valutare un\'auto incidentata o danneggiata',
    description:
      'Come stimare il valore di un\'auto danneggiata: valore di mercato, costo delle riparazioni e il calcolo che decide se riparare o vendere.',
    published: '2026-08-07',
    category: 'valutazione',
    sections: [
      {
        heading: 'Il punto di partenza: il valore prima del danno',
        paragraphs: [
          'La valutazione di un\'auto incidentata parte dal valore di mercato che l\'auto avrebbe senza danni: stessa marca, modello e anno. A quel numero si tolgono i costi di riparazione e il rischio legato ai danni non visibili.',
        ],
      },
      {
        heading: 'Il costo delle riparazioni',
        paragraphs: [
          'Un danno alla carrozzeria (portiere, parafango, paraurti) può costare da poche centinaia a migliaia di euro in carrozzeria, soprattutto con ricambi originali o fari e sensori moderni. I danni strutturali (travi, montanti, pianale) costano molto di più e lasciano un\'auto con valore ridotto per sempre, anche dopo la riparazione.',
        ],
      },
      {
        heading: 'Il danno economico (danno da ripercussione)',
        paragraphs: [
          'Un\'auto con danni strutturali riparati perde valore anche dopo il lavoro fatto: il mercato paga meno le auto "ricostruite" perché sono viste come più rischiose. Questo danno da ripercussione va stimato e toccato dal prezzo quando compri o vendi un\'auto che ha avuto un incidente importante.',
        ],
      },
      {
        heading: 'Riparare o vendere così com\'è',
        paragraphs: [
          'Confronta il costo di riparazione con l\'aumento di valore che la riparazione porta: se riparare costa meno dell\'aumento di valore, conviene; se costa di più, vendi "così com\'è" a un prezzo scontato. La regola vale sia per chi vende sia per chi compra: l\'incidentata ben comprata è un affare, pagata troppo è un bagno di sangue.',
        ],
      },
      {
        heading: 'La stima realistica',
        paragraphs: [
          'Per valutare un\'auto incidentata, parti dal valore reale di mercato del modello senza danni e sottrai i costi di riparazione stimati e il danno da ripercussione. È il metro con cui trattare: se la richiesta si avvicina al valore "a posto", non è un affare.',
        ],
      },
    ],
    cta: 'costi-riparazione',
  },
  {
    slug: 'come-valutare-auto-vecchia-d-epoca',
    title: 'Come si valutano le auto vecchie e d\'epoca',
    description:
      'Cosa determina il valore di un\'auto d\'epoca o da collezione: rarità, stato di conservazione, documentazione e i criteri per una stima.',
    published: '2026-08-07',
    category: 'valutazione',
    sections: [
      {
        heading: 'Un mercato diverso',
        paragraphs: [
          'Le auto d\'epoca e da collezione si valutano con criteri diversi dall\'usato normale: contano rarità, stato di conservazione, documentazione storica e la domanda degli appassionati, che spesso supera di gran lunga il valore "pratico" del veicolo.',
        ],
      },
      {
        heading: 'I criteri della valutazione',
        paragraphs: [
          'Rarità (quanti esemplari sopravvivono), stato di originalità (pezzi e vernice originali valgono più dei rifacimenti), restauro (solo se filologico) e documentazione (libretto storico, fatture, foto d\'epoca) sono i pilastri della stima. Un\'auto originale in buone condizioni vale spesso più di una restaurata male.',
        ],
      },
      {
        heading: 'Le categorie',
        paragraphs: [
          'Le auto storiche (oltre 30 anni o in liste speciali) hanno vantaggi fiscali e assicurativi che aumentano il valore; le "youngtimer" (15-30 anni) stanno crescendo come mercato. Le auto da collezione rare valgono per la loro storia, non per i km percorsi.',
        ],
      },
      {
        heading: 'Come informarsi',
        paragraphs: [
          'Per una stima affidabile, confronta i prezzi reali di vendita di modelli simili (aste, club, collezionisti), fai valutare l\'auto da un esperto del settore e verifica la documentazione. Il valore "teorico" di un\'auto d\'epoca vale poco: conta quello a cui transazioni simili vengono realmente concluse.',
        ],
      },
      {
        heading: 'Differenza rispetto all\'usato normale',
        paragraphs: [
          'A differenza dell\'usato normale, dove conta il valore di mercato corrente, l\'auto d\'epoca è un bene raro: un esempio ben tenuto può valere molto di più di un altro dello stesso modello. Per questo la stima va fatta caso per caso, mai "a listino".',
        ],
      },
    ],
    cta: 'valutazione-auto',
  },
  {
    slug: 'come-scoprire-valore-auto-dalla-targa',
    title: 'Quanto vale la mia auto: come scoprirlo con targa e telaio',
    description:
      'Come risalire al valore della propria auto da targa e telaio: visura, dati del veicolo e confronto con i prezzi reali degli annunci.',
    published: '2026-08-07',
    category: 'valutazione',
    sections: [
      {
        heading: 'Cosa ti serve',
        paragraphs: [
          'Per conoscere il valore della tua auto ti servono i dati esatti del veicolo: marca, modello, anno, alimentazione, allestimento e chilometraggio. Targa e numero di telaio servono per la visura che conferma questi dati: dati sbagliati = valore sbagliato.',
        ],
      },
      {
        heading: 'La visura con targa e telaio',
        paragraphs: [
          'La visura (presso PRA e Motorizzazione o con servizi online autorizzati) restituisce i dati del veicolo: intestatario, dati tecnici, passaggi di proprietà e km registrati. È il controllo che ti conferma di avere davanti l\'auto giusta e pulita, prima di fare qualsiasi valutazione.',
        ],
      },
      {
        heading: 'Il valore di mercato',
        paragraphs: [
          'Con i dati corretti puoi confrontare la tua auto con gli annunci reali: il prezzo medio per lo stesso modello, anno e fascia di km è il valore di mercato. La visura ti dice cos\'è l\'auto; gli annunci ti dicono quanto vale oggi.',
        ],
      },
      {
        heading: 'Quando serve',
        paragraphs: [
          'Vendere, permutare, assicurare, dividere o vendere un\'auto ereditata: sapere il valore reale prima di qualunque trattativa evita errori costosi. Anche per capire se conviene riparare dopo un danno, il valore di mercato è il riferimento.',
        ],
      },
      {
        heading: 'Il metodo completo',
        paragraphs: [
          'Fai la visura per confermare i dati, poi confronta il tuo esemplare con gli annunci dello stesso modello e anno: posizione nella fascia (pochi km, ottimo stato = alto; km alti, da sistemare = basso). Così arrivi a una stima realistica e difendibile in trattativa.',
        ],
      },
    ],
    cta: 'valutazione-auto',
  },
  {
    slug: 'quando-conviene-vendere-auto',
    title: 'Quando conviene vendere l\'auto: il momento giusto',
    description:
      'Come capire quando è il momento migliore per vendere l\'auto: curva di svalutazione, domanda stagionale e segnali che indicano che è tempo di cambiare.',
    published: '2026-08-07',
    category: 'valutazione',
    sections: [
      {
        heading: 'Il momento in cui conviene vendere',
        paragraphs: [
          'In generale conviene vendere quando la svalutazione rallenta ma l\'auto vale ancora: di solito tra i 3 e i 6 anni, quando la perdita annua scende e la domanda di usato per quel modello è ancora forte. Aspettare troppo significa perdere valore senza guadagnarci nulla.',
        ],
      },
      {
        heading: 'La stagione conta',
        paragraphs: [
          'Alcuni modelli si vendono meglio in certi periodi: le decappottabili in primavera, i SUV prima dell\'inverno, le auto da città tutto l\'anno. Anche la fine del trimestre favorisce le permute in concessionaria, mentre i mesi estivi sono più lenti per il privato.',
        ],
      },
      {
        heading: 'I segnali che è ora di cambiare',
        paragraphs: [
          'Manutenzione in crescita, riparazioni frequenti, costo dei lavori prossimo al valore dell\'auto, nuovi obblighi di accesso alle città o esigenze cambiate (famiglia, lavoro): quando le spese superano il beneficio dell\'auto, il momento di vendere è arrivato.',
        ],
      },
      {
        heading: 'Il rischio di aspettare',
        paragraphs: [
          'Ogni anno di attesa in più significa svalutazione e, spesso, costi crescenti: vendere un\'auto che "mi porterò finché non muore" quasi mai conviene. Il valore residuo a un certo punto scende sotto i costi di gestione e il margine di decisione si riduce.',
        ],
      },
      {
        heading: 'Il confronto che decide',
        paragraphs: [
          'Confronta il valore attuale della tua auto con i costi dei prossimi 12 mesi (manutenzione, assicurazione, riparazioni previste): se i costi superano una quota significativa del valore, è il momento di vendere. Controlla prima il valore reale di mercato per sapere dove sei nella curva.',
        ],
      },
    ],
    cta: 'valore-vendita',
  },
  {
    slug: 'come-confrontare-prezzi-auto-usate',
    title: 'Come confrontare i prezzi delle auto usate in Italia',
    description:
      'Come paragonare i prezzi dell\'usato senza sbagliare: stesse specifiche, chilometraggi simili, posizione e i trucchi per leggere gli annunci.',
    published: '2026-08-07',
    category: 'valutazione',
    sections: [
      {
        heading: 'Il confronto va fatto a parità di specifiche',
        paragraphs: [
          'Confrontare prezzi di auto usate senza considerare anno, allestimento, alimentazione e chilometraggio è inutile: la stessa modello può variare di migliaia di euro in base alla versione. Il primo passo è definire le specifiche esatte del veicolo che cerchi.',
        ],
      },
      {
        heading: 'Leggere gli annunci con attenzione',
        paragraphs: [
          'Due annunci con lo stesso prezzo possono nascondere auto molto diverse: uno con tagliandi in rete e pochi km, l\'altro senza storico e con percorrenze alte. Guarda sempre la dotazione e la documentazione, non solo il prezzo: è lì che si gioca la differenza reale.',
        ],
      },
      {
        heading: 'La fascia, non il singolo prezzo',
        paragraphs: [
          'Il valore di mercato è una fascia: il minimo e il massimo degli annunci per lo stesso modello e anno. Un prezzo dentro la fascia è normale; sotto il minimo insospettisce (difetti nascosti), sopra il massimo è troppo caro a meno di caratteristiche particolari.',
        ],
      },
      {
        heading: 'Posizione geografica e canale',
        paragraphs: [
          'I prezzi variano per regione (le grandi città hanno prezzi diversi dalle zone rurali) e per canale: concessionario e privato hanno margini diversi. Per confrontare bene, osserva la tua area o tieni conto della distanza: un\'auto a 500 km potrebbe sembrare più economica ma costare di più in viaggio e rischi.',
        ],
      },
      {
        heading: 'Il metodo che funziona',
        paragraphs: [
          'Seleziona 5-10 annunci dello stesso modello, anno e fascia di km, prendi la media e la fascia. Il prezzo medio degli annunci reali è la tua base: da lì valuti se un\'offerta è un buon affare o fuori mercato.',
        ],
      },
    ],
    cta: 'valutazione-auto',
  },
  {
    slug: 'come-valutare-auto-per-la-permuta',
    title: 'Come calcolare il valore della tua auto per la permuta',
    description:
      'Come difendere il valore della tua auto nella permuta: valutazione reale, offerta del concessionario e la trattativa per non svendere.',
    published: '2026-08-07',
    category: 'valutazione',
    sections: [
      {
        heading: 'La permuta è una vendita',
        paragraphs: [
          'La permuta non è un favore: è la vendita della tua auto al concessionario, che la rivenderà con un margine. Per questo l\'offerta di permuta è quasi sempre sotto il valore di mercato tra privati: il concessionario deve guadagnarci.',
        ],
      },
      {
        heading: 'Il tuo punto di partenza',
        paragraphs: [
          'Prima di entrare in concessionaria, conosci il valore reale di mercato della tua auto: stessa modello, anno e chilometraggio, dai prezzi reali degli annunci. Quello è il tetto che il concessionario non supererà e la base per capire quanto ti sta offrendo davvero.',
        ],
      },
      {
        heading: 'L\'offerta di permuta',
        paragraphs: [
          'L\'offerta di permuta varia tra il 60 e l\'85% del valore di mercato, in base al modello, alla sua vendibilità e a quanto margine ha il concessionario sull\'auto nuova. I concessionari tendono a gonfiare lo sconto sull\'auto nuova e a deprimere il valore del tuo usato: confronta le due voci separatamente.',
        ],
      },
      {
        heading: 'La trattativa sulla permuta',
        paragraphs: [
          'Non accettare la prima offerta: chiedi la scomposizione (sconto auto nuova + valore permuta) e confrontala con il valore reale. Se l\'offerta è molto bassa, ricorda che puoi vendere da privato: a volte la differenza giustifica l\'attesa. L\'alternativa sono i servizi di compravendita diretta, veloci ma con offerte in fascia bassa.',
        ],
      },
      {
        heading: 'La decisione finale',
        paragraphs: [
          'La permuta conviene per comodità: chiudi tutto in un\'unica operazione. Conviene vendere da privato quando il valore è alto e la differenza è significativa. Il metro di giudizio è sempre lo stesso: quanto ti offrono rispetto al valore reale di mercato della tua auto.',
        ],
      },
    ],
    cta: 'permuta-valutazione',
  },
  {
    slug: 'quanto-costa-mantenere-un-auto',
    title: 'Quanto costa mantenere un\'auto ogni anno',
    description:
      'Il costo di proprietà di un\'auto: tagliando, assicurazione, bollo, carburante e riparazioni medie, e come dipende da segmento, età e marca.',
    published: '2026-08-07',
    category: 'manutenzione',
    sections: [
      {
        heading: 'Le voci del costo di proprietà',
        paragraphs: [
          'Mantenere un\'auto costa più del solo acquisto: ogni anno si sommano assicurazione, bollo, carburante, tagliando, gomme e le piccole riparazioni. Ignorare queste voci porta a scegliere l\'auto sbagliata: quella che si può comprare non sempre è quella che si può mantenere.',
        ],
      },
      {
        heading: 'I costi fissi',
        paragraphs: [
          'Assicurazione (RC, incendio-furto e accessori), bollo e revisione sono le voci fisse: per un\'utilitaria si parte da 600-900 € all\'anno di solo assicurazione, e salgono per auto potenti o guidatori giovani. Il bollo dipende da potenza ed emissioni: per le auto elettriche è azzerato nei primi anni.',
        ],
      },
      {
        heading: 'I costi variabili',
        paragraphs: [
          'Carburante, tagliandi, gomme e piccoli interventi variano con l\'uso e con il modello. Un tagliando annuale costa in media 90-250 € per un\'utilitaria e sale con la cilindrata e la marca; le gomme si cambiano ogni 30.000-50.000 km e costano di più per le auto pesanti.',
        ],
      },
      {
        heading: 'Quanto incide il segmento',
        paragraphs: [
          'Il costo di mantenimento cresce con il segmento: una city car è la più economica da gestire, un SUV pesa molto di più (gomme, freni, consumi). Anche la marca conta: i ricambi delle marche premium costano fino al 30-40% in più a parità di intervento.',
        ],
      },
      {
        heading: 'La stima per la tua auto',
        paragraphs: [
          'Per capire quanto costa mantenere un modello specifico, somma i costi fissi (assicurazione, bollo) e variabili (tagliando, carburante, manutenzione prevista) per il tuo utilizzo. Con lo strumento di stima dei costi di riparazione puoi avere una base per segmento, marca ed età.',
        ],
      },
    ],
    cta: 'costi-riparazione',
  },
  {
    slug: 'tagliando-auto-cosa-comprende',
    title: 'Tagliando auto: cosa comprende, ogni quanto e quanto costa',
    description:
      'Cosa si fa nel tagliando, ogni quanto andrebbe fatto, quanto costa per segmento e perché il tagliando regolare aumenta il valore dell\'usato.',
    published: '2026-08-07',
    category: 'manutenzione',
    sections: [
      {
        heading: 'Cosa è il tagliando',
        paragraphs: [
          'Il tagliando è l\'insieme dei controlli e delle sostituzioni periodiche previste dal costruttore: cambio olio e filtri, controlli di freni, sospensioni, liquidi e cinghie. Serve a mantenere l\'auto in condizioni di sicurezza e a conservarne il valore.',
        ],
      },
      {
        heading: 'Cosa comprende di solito',
        paragraphs: [
          'Il tagliando base include cambio olio motore e filtro olio, filtro aria, filtro abitacolo e controlli generali (freni, liquidi, luci, pressione gomme, sospensioni). I tagliandi "grossi" (a scadenze chilometriche alte) aggiungono candele, filtro carburante e, su alcuni modelli, la distribuzione.',
        ],
      },
      {
        heading: 'Ogni quanto farlo',
        paragraphs: [
          'La regola tipica è una volta l\'anno o ogni 15.000-30.000 km, in base al modello e all\'olio usato: il libretto di manutenzione indica l\'intervallo esatto. Superare l\'intervallo con regolarità è la causa più comune di guasti e di perdita di valore.',
        ],
      },
      {
        heading: 'Quanto costa',
        paragraphs: [
          'Il costo di un tagliando base varia da circa 90-150 € per una city car a 250-400 € per un SUV o una berlina premium. Il costo cresce con il segmento e la marca, e con gli interventi previsti dal tagliando maggiore (candele, filtri, distribuzione).',
        ],
      },
      {
        heading: 'Il valore dello storico',
        paragraphs: [
          'Un\'auto con tagliandi regolari vale il 10-15% in più di una senza: i tagliandi in rete autorizzata o comunque documentati sono la prova che l\'auto è stata curata. Quando vendi, i tagliandi regolari sono l\'argomento più forte per difendere il prezzo.',
        ],
      },
    ],
    cta: 'costi-riparazione',
  },
  {
    slug: 'quanto-durano-i-pneumatici',
    title: 'Quanto durano i pneumatici e quando cambiarli',
    description:
      'Durata dei pneumatici in km e anni, battistrada minimo, usura irregolare e i controlli per cambiare le gomme al momento giusto.',
    published: '2026-08-07',
    category: 'manutenzione',
    sections: [
      {
        heading: 'La durata media',
        paragraphs: [
          'In media i pneumatici durano 30.000-50.000 km sull\'asse anteriore e di più sul posteriore, ma il dato dipende da auto, stile di guida e tipo di gomma. In termini di tempo, la gomma si indurisce: dopo 5-6 anni dalla produzione è consigliato cambiarli anche se il battistrada è ancora alto.',
        ],
      },
      {
        heading: 'Il battistrada minimo',
        paragraphs: [
          'La legge impone un battistrada minimo di 1,6 mm, ma la sicurezza consiglia di cambiare già a 3 mm: sotto questa soglia la tenuta sul bagnato cala rapidamente. Il controllo è semplice con un misuratore di profondità o i tasselli indicatori di usura presenti sui solchi.',
        ],
      },
      {
        heading: 'Le gomme stagionali',
        paragraphs: [
          'Le gomme invernali garantiscono tenuta sotto i 7 °C e con neve e ghiaccio; le estive sono migliori sopra i 7 °C. Le quattro stagioni sono un compromesso per chi percorre pochi km. La scelta dipende dal clima e dall\'uso: le invernali non vanno usate in estate (usura e consumi aumentano).',
        ],
      },
      {
        heading: 'L\'usura irregolare',
        paragraphs: [
          'Se il battistrada si consuma di più su un lato o al centro, qualcosa non va: pressioni sbagliate, convergenza da registrare o sospensioni da controllare. Le gomme vanno controllate ogni mese per pressione (a freddo) e usura: un battistrada consumato in modo irregolare è un campanello d\'allarme.',
        ],
      },
      {
        heading: 'Il costo e il valore',
        paragraphs: [
          'Un treno di gomme costa da 150 € per un\'utilitaria a 1.000+ € per SUV e modelli sportivi: è tra le spese più pesanti della manutenzione. Quando compri o vendi usato, gomme nuove valgono un buono sconto in trattativa: sono un intervento che tutti conoscono il costo.',
        ],
      },
    ],
    cta: 'costi-riparazione',
  },
  {
    slug: 'quando-cambiare-la-batteria-auto',
    title: 'Batteria auto: segnali di usura e quando cambiarla',
    description:
      'Quanto dura la batteria, i segnali di fine vita, come riconoscerli e come scegliere la batteria giusta per la tua auto.',
    published: '2026-08-07',
    category: 'manutenzione',
    sections: [
      {
        heading: 'La durata tipica',
        paragraphs: [
          'Una batteria auto dura in media 3-5 anni. La durata dipende da clima (il caldo la stressa, il freddo la scarica), da percorsi brevi (che non la ricaricano mai del tutto) e dall\'elettronica sempre in attesa, che la consuma anche da spenta.',
        ],
      },
      {
        heading: 'I segnali di fine vita',
        paragraphs: [
          'Avvio lento o a strappi, luci deboli, spie che lampeggiano al primo tentativo di avvio, orologio e radio che si azzerano: sono i segnali classici di batteria in esaurimento. Una batteria "che parte" d\'estate può piantarti al primo freddo: i controlli vanno fatti prima dell\'inverno.',
        ],
      },
      {
        heading: 'Le cause di una morte precoce',
        paragraphs: [
          'Percorsi troppo brevi, parcheggi prolungati, accessori lasciati accesi e elettronica con problemi di assorbimento sono le cause principali di batterie che muoiono presto. Anche una batteria di qualità sbagliata per l\'auto (potenza o tecnologia) ne riduce la vita.',
        ],
      },
      {
        heading: 'Come scegliere la batteria nuova',
        paragraphs: [
          'La batteria nuova deve rispettare i dati indicati: tensione, capacità (Ah) e tecnologia (piombo-acido, EFB, AGM). Le auto con start&stop e molta elettronica richiedono batterie EFB o AGM: una batteria base può non durare e causare errori elettronici.',
        ],
      },
      {
        heading: 'Il costo',
        paragraphs: [
          'Il cambio batteria costa in media 80-200 €, più per le batterie AGM delle auto moderne. È una spesa prevedibile: quando acquisti un\'usato, una batteria nuova vale un piccolo vantaggio in trattativa, perché tutti sanno quanto costa sostituirla.',
        ],
      },
    ],
    cta: 'costi-riparazione',
  },
  {
    slug: 'come-risparmiare-carburante',
    title: 'Come risparmiare carburante: stile di guida e abitudini',
    description:
      'Le tecniche di guida e le abitudini che riducono i consumi: accelerazioni, velocità, climatizzatore, pressione gomme e manutenzione.',
    published: '2026-08-07',
    category: 'manutenzione',
    sections: [
      {
        heading: 'Lo stile di guida conta più di tutto',
        paragraphs: [
          'Il modo di guidare pesa sui consumi quanto il modello di auto: accelerazioni brusche e frenate violente possono aumentare i consumi del 20-30%. Guidare in modo fluido, con accelerazioni dolci e cambi marcia anticipati, è il risparmio più grande e non costa nulla.',
        ],
      },
      {
        heading: 'La velocità e l\'aria condizionata',
        paragraphs: [
          'Oltre i 90-100 km/h il consumo cresce in modo esponenziale per la resistenza aerodinamica: a 130 km/h si consuma molto di più che a 110. Anche il climatizzatore pesa: in città, meglio i finestrini; in autostrada, a finestrini chiusi il clima consuma meno della resistenza aggiunta.',
        ],
      },
      {
        heading: 'La pressione delle gomme',
        paragraphs: [
          'Gomme sotto-gonfie aumentano il rotolamento e i consumi, e si usurano in modo irregolare. Controllare la pressione una volta al mese (a freddo, con i valori indicati) è gratis e vale fino al 3-5% di risparmio, oltre a migliorare la sicurezza.',
        ],
      },
      {
        heading: 'La manutenzione che risparmia',
        paragraphs: [
          'Filtro aria sporco, olio vecchio, candele usurate e sensori difettosi fanno consumare di più. Un\'auto ben mantenuta consuma quello che deve; un\'auto trascurata spreca carburante a ogni pieno. La regolarità dei tagliandi è un investimento che si ripaga in consumi.',
        ],
      },
      {
        heading: 'Calcola il tuo risparmio',
        paragraphs: [
          'Per capire quanto puoi risparmiare, parti dai consumi reali del tuo modello: se consumi molto sopra la media del modello, ci sono margini di guadagno sia nella guida sia nella manutenzione. Verifica i consumi stimati della tua auto e confrontali con quello che fai davvero.',
        ],
      },
    ],
    cta: 'consumi-modello',
  },
  {
    slug: 'spia-motore-accesa-cosa-fare',
    title: 'Spia motore accesa: cosa significa e quanto costa sistemarla',
    description:
      'Cosa fare quando si accende la spia motore, quali sono le cause più comuni e quanto costa la diagnosi e la riparazione in officina.',
    published: '2026-08-07',
    category: 'manutenzione',
    sections: [
      {
        heading: 'La spia motore non è sempre un dramma',
        paragraphs: [
          'La spia motore (check engine) si accende quando la centralina rileva un\'anomalia, ma non tutte le anomalie sono gravi: può essere un tappo del serbatoio non chiuso o un sensore guasto, come un problema al motore. La cosa giusta da fare è non ignorarla e far leggere i codici di errore.',
        ],
      },
      {
        heading: 'Spia fissa o lampeggiante',
        paragraphs: [
          'La spia fissa indica un\'anomalia da controllare, ma puoi generalmente proseguire fino all\'officina. La spia lampeggiante segnala un problema serio in corso (misfire, danni al catalizzatore): in quel caso devi fermarti e non proseguire se non necessario.',
        ],
      },
      {
        heading: 'Le cause più comuni',
        paragraphs: [
          'Sensore di ossigeno (sonda lambda) guasto, candele o bobine usurate, perdite nel tappo del serbatoio, valvola EGR, catalizzatore o sistemi AdBlue sulle diesel: la maggior parte delle cause è economica, ma ignorarla a lungo può rovinare componenti costosi (catalizzatore, motore).',
        ],
      },
      {
        heading: 'La diagnosi',
        paragraphs: [
          'La diagnosi si fa con lo strumento di lettura dei codici: costa 30-60 € in officina (o si può fare con lettori OBD personali). Il codice identifica la causa; poi si decide se è un intervento da poche decine di euro o da centinaia. Non far "azzerare" la spia senza riparare: torna.',
        ],
      },
      {
        heading: 'Il costo della riparazione',
        paragraphs: [
          'I costi variano molto: da 30-50 € per un sensore o un tappo, a 200-500 € per valvola EGR o sonda lambda, fino a oltre 1.000 € per problemi a turbo o catalizzatore. Prima di spendere, chiedi sempre un preventivo e confronta i costi stimati per il tuo modello.',
        ],
      },
    ],
    cta: 'costi-riparazione',
  },
  {
    slug: 'controlli-auto-fai-da-te',
    title: 'I controlli fai da te da fare ogni mese sull\'auto',
    description:
      'I controlli rapidi che puoi fare da solo senza officina: livelli dei liquidi, gomme, luci e i piccoli segnali che evitano guasti costosi.',
    published: '2026-08-07',
    category: 'manutenzione',
    sections: [
      {
        heading: 'Il controllo mensile',
        paragraphs: [
          'Dieci minuti al mese bastano a prevenire la maggior parte dei guasti e dei sorprendenti: pressione e battistrada delle gomme, livello dell\'olio, liquidi (freno, raffreddamento, lavavetri), luci e spie. Chi controlla con regolarità scopre i problemi quando costano poco.',
        ],
      },
      {
        heading: 'Olio e liquidi',
        paragraphs: [
          'Controlla il livello dell\'olio a motore freddo e su piano: se scende troppo in fretta, c\'è una perdita o un consumo anomalo da far vedere in officina. Anche i liquidi di raffreddamento e lavavetri vanno tenuti nei livelli indicati: liquidi sotto il minimo portano a surriscaldamenti e guasti.',
        ],
      },
      {
        heading: 'Gomme e pressione',
        paragraphs: [
          'Controlla la pressione a freddo ogni mese e prima dei viaggi lunghi, e il battistrada per usure irregolari. Le gomme sono l\'unico contatto con l\'asfalto: trascurarle costa in consumi, sicurezza e durata degli pneumatici.',
        ],
      },
      {
        heading: 'Luci e spie',
        paragraphs: [
          'Controlla luci, frecce, stop e tergicristalli (gomme che lasciano aloni vanno cambiate). Se si accende una spia che non conosci, consulta il manuale: alcune richiedono intervento, altre sono informative. Non azzerarla e basta.',
        ],
      },
      {
        heading: 'I segnali da non ignorare',
        paragraphs: [
          'Rumori nuovi, vibrazioni, odori, perdite sotto l\'auto: segnali che le verifiche mensili non coprono ma che vanno controllati subito. Un problema notato presto costa un intervento da centinaia di euro; ignorato può diventare un guasto da migliaia.',
        ],
      },
    ],
    cta: 'costi-riparazione',
  },
  {
    slug: 'quanto-dura-la-frizione',
    title: 'Quanto dura la frizione e come allungarne la vita',
    description:
      'Durata media della frizione, segnali di usura, le abitudini che la rovinano e il costo di sostituzione per segmento.',
    published: '2026-08-07',
    category: 'manutenzione',
    sections: [
      {
        heading: 'La durata media',
        paragraphs: [
          'La frizione dura in media 120.000-180.000 km, ma varia tantissimo con lo stile di guida: chi la usa bene supera i 200.000 km, chi la "sfrutta" può cambiarla a 60.000. Il tipo di percorso conta: l\'urbano stop-and-go è il nemico numero uno.',
        ],
      },
      {
        heading: 'I segnali di usura',
        paragraphs: [
          'Il pedale che "scatta" o prende più su, la marcia che striscia o pattina in accelerazione, l\'odore di bruciato e le vibrazioni alla partenza sono i segnali principali. Se la frizione pattina, va sostituita presto: usarla fino al limite può danneggiare il volano e raddoppiare il costo.',
        ],
      },
      {
        heading: 'Le abitudini che la rovinano',
        paragraphs: [
          'Tenere il piede appoggiato sulla frizione, usarla per "trattenere" l\'auto in salita, partire con il gas spinto e cambiare marcia a freddo sono le abitudini che la consumano in fretta. Anche il "mezzo pedale" prolungato nelle partenze in salita la stressa.',
        ],
      },
      {
        heading: 'Quanto costa sostituirla',
        paragraphs: [
          'La sostituzione della frizione costa in media 500-900 € per un\'utilitaria, fino a 1.500 € per SUV e auto premium: la manodopera (smontaggio della trasmissione) incide molto. Conviene sostituire anche il volano se usurato, per non dover smontare di nuovo.',
        ],
      },
      {
        heading: 'Frizione e acquisto usato',
        paragraphs: [
          'Quando compri un\'usato, controlla la frizione in prova su strada (partenze, cambi) e chiedi quando è stata fatta: è uno degli interventi più cari. Sull\'usato con percorrenze alte, una frizione nuova vale un buon punto in trattativa.',
        ],
      },
    ],
    cta: 'costi-riparazione',
  },
  {
    slug: 'cambio-olio-auto-quando-farlo',
    title: 'Cambio olio: ogni quanto farlo e quale olio scegliere',
    description:
      'Intervalli del cambio olio, come leggere le specifiche dell\'olio giusto e perché l\'olio vecchio accorcia la vita del motore.',
    published: '2026-08-07',
    category: 'manutenzione',
    sections: [
      {
        heading: 'Perché l\'olio è vitale',
        paragraphs: [
          'L\'olio lubrifica, raffredda e pulisce il motore: quando invecchia perde le sue proprietà e il motore lavora in condizioni peggiori, consumando di più e usurandosi prima. Il cambio olio è il tagliando più importante e il più trascurato.',
        ],
      },
      {
        heading: 'Ogni quanto cambiarlo',
        paragraphs: [
          'L\'intervallo tipico è una volta l\'anno o ogni 15.000-30.000 km, in base al modello e all\'olio: il libretto di manutenzione indica i valori esatti. Superare l\'intervallo con regolarità è tra le cause più comuni di guasti al motore; sui motori moderni il rischio è anche maggiore, perché la lubrificazione è più delicata.',
        ],
      },
      {
        heading: 'Quale olio scegliere',
        paragraphs: [
          'L\'olio giusto è quello indicato dal costruttore: la specifica (es. 0W-20, 5W-30) e l\'omologazione (le sigle ACEA, API o la specifica della casa) contano più della marca. Un olio sbagliato può non proteggere il motore o danneggiare il filtro antiparticolato sulle diesel.',
        ],
      },
      {
        heading: 'Olio sintetico e cambio motore',
        paragraphs: [
          'Gli oli sintetici durano di più e proteggono meglio: valgono la spesa per i motori moderni. Il cambio motore (filtro + olio) costa 50-150 € in officina per un\'utilitaria: poco rispetto al costo di un guasto causato da un olio lasciato invecchiare.',
        ],
      },
      {
        heading: 'Olio e acquisto usato',
        paragraphs: [
          'Quando compri un\'usato, chiedi il libretto dei tagliandi e controlla la regolarità dei cambi olio: una manutenzione dell\'olio saltuaria è uno dei segnali di un\'auto non curata, da scontare sul prezzo o da evitare.',
        ],
      },
    ],
    cta: 'costi-riparazione',
  },
  {
    slug: 'manutenzione-auto-in-inverno',
    title: 'Manutenzione auto in inverno: i controlli da non saltare',
    description:
      'I controlli da fare prima dell\'inverno: batteria, gomme, liquido raffreddamento, tergicristalli e le accortezze per guidare al freddo.',
    published: '2026-08-07',
    category: 'manutenzione',
    sections: [
      {
        heading: 'Prepararsi prima del freddo',
        paragraphs: [
          'L\'inverno è la stagione dei guasti "improvvisi": batterie scariche, avviamenti lenti, problemi di visibilità. La maggior parte si evita con una serie di controlli fatti in autunno, quando l\'officina non è piena di emergenze.',
        ],
      },
      {
        heading: 'Batteria e avviamento',
        paragraphs: [
          'Il freddo riduce la capacità della batteria: se ha più di 3 anni o mostra segni di debolezza, falla testare prima dell\'inverno. È il guasto più comune della stagione e si previene con un controllo di pochi minuti.',
        ],
      },
      {
        heading: 'Gomme e visibilità',
        paragraphs: [
          'Sotto i 7 °C le gomme estive perdono aderenza: monta gomme invernali o quattro stagioni e controlla il battistrada. Verifica anche tergicristalli, liquido lavavetri con antigelo e resistenze del lunotto: la visibilità è la prima sicurezza invernale.',
        ],
      },
      {
        heading: 'Liquidi e riscaldamento',
        paragraphs: [
          'Controlla il liquido di raffreddamento con il corretto antigelo (protegge fino a temperature sotto zero) e verifica che il riscaldamento, il climatizzatore e le sbrinature funzionino prima di partire. Un\'auto che non sbrina i vetri è un rischio quotidiano.',
        ],
      },
      {
        heading: 'Guida e viaggi invernali',
        paragraphs: [
          'Tieni un kit minimo in auto (cavo d\'avviamento, panno per i vetri, raschietto) e pianifica i viaggi con un occhio alle previsioni. Un\'auto preparata riduce i rischi e i costi imprevisti: la manutenzione invernale è tra gli interventi che ripagano di più.',
        ],
      },
    ],
    cta: 'costi-riparazione',
  },
  {
    slug: 'climatizzatore-auto-manutenzione',
    title: 'Climatizzatore auto: manutenzione, ricarica e sanificazione',
    description:
      'Come funziona il climatizzatore, ogni quanto va ricaricato e sanificato, i segnali di problemi e quanto costa mantenerlo efficiente.',
    published: '2026-08-07',
    category: 'manutenzione',
    sections: [
      {
        heading: 'Perché il climatizzatore va mantenuto',
        paragraphs: [
          'Il climatizzatore non è solo comfort: sbrina i vetri in inverno (deumidificando) e garantisce visibilità e sicurezza in ogni stagione. Come ogni impianto, perde lentamente il gas refrigerante e ha bisogno di manutenzione periodica.',
        ],
      },
      {
        heading: 'I segnali di problemi',
        paragraphs: [
          'Aria non abbastanza fredda, rumori strani, odori sgradevoli all\'accensione e appannamento dei vetri sono i segnali più comuni. Un impianto che raffredda poco spesso ha una perdita di gas; gli odori indicano batteri e umidità nei condotti.',
        ],
      },
      {
        heading: 'La ricarica del gas',
        paragraphs: [
          'Il gas refrigerante si riduce nel tempo (circa il 10-15% l\'anno): la ricarica va fatta quando l\'efficienza cala, in genere ogni 2-3 anni. Costa 60-120 € e include il controllo delle pressioni: una perdita importante va individuata e riparata, non mascherata con ricariche continue.',
        ],
      },
      {
        heading: 'La sanificazione',
        paragraphs: [
          'La sanificazione dei condotti elimina batteri e muffe che causano odori: va fatta una volta all\'anno, idealmente prima dell\'estate. Il filtro dell\'abitacolo va sostituito nei tagliandi: un filtro intasato riduce il flusso d\'aria e fa lavorare di più l\'impianto.',
        ],
      },
      {
        heading: 'Il costo complessivo',
        paragraphs: [
          'Ricarica, sanificazione e filtro costano in totale 100-200 € l\'anno se fatti insieme: poco rispetto al disagio di un impianto rotto in estate o alla sanificazione più costosa dopo anni di batteri. Sull\'usato, un impianto che non raffredda è un difetto da scontare in trattativa.',
        ],
      },
    ],
    cta: 'costi-riparazione',
  },
  {
    slug: 'pneumatici-invernali-o-quattro-stagioni',
    title: 'Pneumatici invernali o quattro stagioni: come scegliere',
    description:
      'Differenze tra gomme invernali, estive e quattro stagioni: quando cambiarle, obblighi, durata e quale conviene in base al tuo uso.',
    published: '2026-08-07',
    category: 'manutenzione',
    sections: [
      {
        heading: 'Le differenze di base',
        paragraphs: [
          'Le gomme invernali hanno mescola morbida e tassellatura che garantiscono tenuta sotto i 7 °C, su neve e bagnato. Le estive sono fatte per temperature alte. Le quattro stagioni sono un compromesso tra le due: accettabili tutto l\'anno, ma non eccellono in nessuna condizione estrema.',
        ],
      },
      {
        heading: 'Gli obblighi di legge',
        paragraphs: [
          'Dal 15 novembre al 15 aprile (con possibilità di estensione regionale) in Italia vige l\'obbligo di avere gomme invernali o catene a bordo, oppure pneumatici quattro stagioni con marcatura M+S. L\'obbligo si applica sulle strade indicate e le sanzioni partono da circa 80 €.',
        ],
      },
      {
        heading: 'Quando convengono le quattro stagioni',
        paragraphs: [
          'Le quattro stagioni convengono se percorri pochi km all\'anno, vivi in zone dal clima mite e non vuoi gestire due set di gomme: risparmi lo stoccaggio e il cambio stagionale. Il costo è in mezzo tra invernali ed estive, ma durano meno percorrendo molti km.',
        ],
      },
      {
        heading: 'Quando convengono le due stagioni',
        paragraphs: [
          'Chi percorre molti km o vive in zone con inverni rigidi fa meglio con set invernali + estivi: ogni gomma lavora nel suo ambiente ideale, consuma meno e dura di più. Anche chi fa autostrada d\'inverno beneficia della tenuta delle invernali vere.',
        ],
      },
      {
        heading: 'Il costo totale',
        paragraphs: [
          'Confronta il costo del set unico (quattro stagioni) con quello di due set + cambio e stoccaggio: per i km bassi vince il set unico, per i km alti i due set. Il risparmio sulle quattro stagioni si assottiglia se le percorrenze salgono.',
        ],
      },
    ],
    cta: 'costi-riparazione',
  },
  {
    slug: 'come-valutare-lo-stato-di-un-motore-usato',
    title: 'Come valutare lo stato di un motore usato',
    description:
      'Come capire se un motore è sano prima dell\'acquisto: avvio a freddo, fumo, rumori, olio e i controlli che rivelano i problemi.',
    published: '2026-08-07',
    category: 'affidabilita',
    sections: [
      {
        heading: 'Il motore si giudica a freddo',
        paragraphs: [
          'Il momento migliore per valutare un motore è a freddo, prima che venga scaldato per nascondere i problemi: un\'auto "già pronta" può mascherare avvii difficili o fumo. Chiedi di provarla a motore freddo, idealmente dopo una notte di sosta.',
        ],
      },
      {
        heading: 'L\'avvio e il regime',
        paragraphs: [
          'L\'avvio deve essere pronto e regolare, senza tentennamenti, e il motore deve girare al minimo stabile senza cali o sobbalzi. Un avvio stentato può dipendere da batteria, candele, iniettori o problemi più seri: tutto va indagato.',
        ],
      },
      {
        heading: 'Fumo, rumori e olio',
        paragraphs: [
          'Fumo bianco (fluido raffreddamento nel motore), blu (olio bruciato) o nero (combustibile incompleto) sono segnali da non ignorare. Anche i rumori metallici a freddo o al minimo meritano indagine, come un\'astina dell\'olio con residui o un\'emulsione sotto il tappo dell\'olio.',
        ],
      },
      {
        heading: 'La prova su strada',
        paragraphs: [
          'In strada il motore deve rispondere senza strappi, in salita e in ripresa: perdite di potenza o fumi durante l\'accelerazione indicano problemi. Anche i consumi anomali in prova (valutati al computer di bordo) sono un segnale.',
        ],
      },
      {
        heading: 'Il confronto con la storia del modello',
        paragraphs: [
          'Prima di decidere, controlla i problemi noti di quel motore: alcuni hanno difetti cronici (distribuzione, turbo, catena) che vanno verificati da un meccanico. Un\'auto con un motore problematico noto va valutata con più attenzione, anche se il prezzo è basso.',
        ],
      },
    ],
    cta: 'analisi-ai',
  },
  {
    slug: 'auto-usate-affidabili-sotto-10000',
    title: 'Le auto usate più affidabili sotto i 10.000 euro',
    description:
      'Quali categorie e modelli offrono la migliore affidabilità sotto i 10.000 euro e come scegliere senza rischiare riparazioni costose.',
    published: '2026-08-07',
    category: 'affidabilita',
    sections: [
      {
        heading: 'La fascia dei 10.000 euro',
        paragraphs: [
          'Sotto i 10.000 euro si trovano auto di 5-10 anni, spesso tra le più richieste e affidabili del mercato: city car, utilitarie e piccoli SUV con motori collaudati. È la fascia dove la scelta giusta fa la differenza tra anni senza pensieri e riparazioni continue.',
        ],
      },
      {
        heading: 'I punti di forza da cercare',
        paragraphs: [
          'Le auto più affidabili in questa fascia condividono: motori semplici e collaudati, meccanica diffusa con ricambi economici, rete di assistenza capillare e storici di manutenzione regolare. La semplicità tecnologica aiuta: meno sistemi complessi, meno guasti.',
        ],
      },
      {
        heading: 'I motori da preferire',
        paragraphs: [
          'I motori benzina aspirati di piccola cilindrata e le ibride giapponesi di generazioni mature sono tra i più affidabili. I motori più complessi (turbo di nuova generazione, sistemi ibridi di prima generazione su alcune marche) vanno valutati modello per modello.',
        ],
      },
      {
        heading: 'I controlli che contano',
        paragraphs: [
          'In questa fascia lo storico vale tutto: revisioni regolari, tagliandi documentati, distribuzione già fatta e pochi proprietari. Controlla anche i problemi noti del modello specifico: un difetto cronico può trasformare un buon prezzo in una spesa continua.',
        ],
      },
      {
        heading: 'Il metodo per scegliere',
        paragraphs: [
          'Seleziona pochi modelli affidabili, controlla i loro problemi noti, verifica lo storico di ogni esemplare e confronta i prezzi reali. L\'affidabilità di un modello non basta: conta lo stato del singolo esemplare. Controlla il punteggio di affidabilità del modello prima di decidere.',
        ],
      },
    ],
    cta: 'affidabilita-modello',
  },
  {
    slug: 'problemi-comuni-auto-usate-per-marca',
    title: 'I problemi più comuni dell\'usato, marca per marca',
    description:
      'I difetti ricorrenti delle principali marche: cosa controllare prima di comprare un usato e quali punti deboli sono noti per ogni costruttore.',
    published: '2026-08-07',
    category: 'affidabilita',
    sections: [
      {
        heading: 'Perché i problemi noti contano',
        paragraphs: [
          'Ogni marca ha punti deboli ricorrenti: conoscere i difetti noti di un modello prima dell\'acquisto permette di controllare i punti giusti in visita e di usare la scoperta come leva nella trattativa.',
        ],
      },
      {
        heading: 'Le trasmissioni automatiche',
        paragraphs: [
          'Alcuni cambi automatici e doppia frizione hanno problemi noti (strattoni, sostituzioni costose): sui modelli interessati, la storia della manutenzione del cambio e le campagne di richiamo vanno verificate con attenzione prima dell\'acquisto.',
        ],
      },
      {
        heading: 'I sistemi di post-trattamento diesel',
        paragraphs: [
          'AdBlue e sistemi di post-trattamento sono tra le voci di guasto più frequenti sulle diesel moderne: un\'auto usata con questi sistemi va controllata per errori, cristallizzazioni e costi di manutenzione previsti. Anche il consumo d\'olio su alcuni motori turbo benzina è un punto da verificare.',
        ],
      },
      {
        heading: 'Elettronica e sensori',
        paragraphs: [
          'Centraline, sensori di parcheggio, sistemi ADAS e moduli elettronici sono tra i guasti più comuni in generale: sull\'usato controlla che tutte le spie si spengano, che i sistemi funzionino e che non ci siano errori "cronici" già segnalati per il modello.',
        ],
      },
      {
        heading: 'Come usare questa conoscenza',
        paragraphs: [
          'Prima di ogni acquisto, cerca i problemi noti del modello specifico e controlla quei punti in visita. Un punto debole noto, se già sistemato e documentato, è meno preoccupante di uno sconosciuto: la documentazione della riparazione vale oro in trattativa.',
        ],
      },
    ],
    cta: 'affidabilita-modello',
  },
  {
    slug: 'motori-diesel-piu-affidabili',
    title: 'I motori diesel più affidabili dell\'usato',
    description:
      'Quali motorizzazioni diesel hanno dimostrato grande affidabilità nel tempo e cosa controllare prima di comprare un diesel usato.',
    published: '2026-08-07',
    category: 'affidabilita',
    sections: [
      {
        heading: 'Il diesel buono esiste ancora',
        paragraphs: [
          'Nonostante la crisi del diesel nelle città, molte motorizzazioni diesel dimostrate hanno eccellente affidabilità e durata: per chi fa molti km, un diesel ben scelto resta un\'opzione economica. La chiave è scegliere la generazione giusta.',
        ],
      },
      {
        heading: 'Le caratteristiche dei diesel affidabili',
        paragraphs: [
          'I diesel più affidabili dell\'usato condividono: motori di grande produzione e lunga esperienza, iniezione collaudata, distribuzione gestibile e costo dei ricambi contenuto. Le generazioni mature di alcuni motori hanno superato anni di rodaggio e problemi noti.',
        ],
      },
      {
        heading: 'I sistemi moderni da verificare',
        paragraphs: [
          'I diesel moderni con AdBlue, FAP e iniezioni complesse hanno più sistemi che possono guastarsi: sull\'usato controlla lo stato del filtro antiparticolato, gli errori AdBlue e la storia della manutenzione. Un diesel con sistemi di post-trattamento non curati è un costo nascosto.',
        ],
      },
      {
        heading: 'Le limitazioni alle città',
        paragraphs: [
          'Prima di comprare un diesel usato, verifica le regole di accesso della tua città: molti centri limitano i diesel, anche recenti, e questo pesa sul valore di rivendita e sull\'uso quotidiano. Un diesel bloccato in città vale molto meno del suo prezzo di listino.',
        ],
      },
      {
        heading: 'Il controllo del singolo esemplare',
        paragraphs: [
          'L\'affidabilità del motore non basta: controlla lo storico dei tagliandi (il diesel esige manutenzione regolare), i km reali e lo stato dei sistemi di post-trattamento. Un diesel ben mantenuto dura centinaia di migliaia di km; uno trascurato no.',
        ],
      },
    ],
    cta: 'affidabilita-modello',
  },
  {
    slug: 'come-controllare-cambio-e-frizione-usato',
    title: 'Come controllare cambio e frizione su un\'usato',
    description:
      'I test da fare in prova su strada per verificare cambio e frizione di un\'auto usata: rumori, strisci, pattinamenti e i segnali di usura.',
    published: '2026-08-07',
    category: 'affidabilita',
    sections: [
      {
        heading: 'La frizione si valuta in partenza',
        paragraphs: [
          'La frizione si giudica nelle partenze e nei cambi: il pedale deve essere morbido ma con un "punto" netto, senza scatti o ritardi. Una frizione che si solleva quasi subito o quasi alla fine indica usura; se pattina (il motore sale di giri ma l\'auto non accelera), va sostituita.',
        ],
      },
      {
        heading: 'Le marce e il cambio',
        paragraphs: [
          'Ogni marcia deve inserirsi senza forzature, a motore caldo e freddo, con cambi rapidi e sotto carico. Rumori, resistenze o "strattoni" in inserimento indicano problemi al cambio, alla frizione o ai supporti. Provale tutte, dal basso all\'alto e in scalata.',
        ],
      },
      {
        heading: 'I rumori e le vibrazioni',
        paragraphs: [
          'Ronzio del cambio in marcia, vibrazioni al pedale o rumori metallici in folle con frizione premuta o rilasciata sono segnali da indagare. Un differenziale o un cuscinetto usurato può non farsi sentire subito ma diventare un costo da centinaia di euro.',
        ],
      },
      {
        heading: 'La partenza in salita',
        paragraphs: [
          'Prova una partenza in salita con il freno a mano: la frizione deve prendere senza sforzo eccessivo e senza bruciare (odore). Questo test rivela l\'usura che le prove piatte non mostrano.',
        ],
      },
      {
        heading: 'Il confronto con il modello',
        paragraphs: [
          'Prima di decidere, informati sui problemi noti del cambio di quel modello: alcuni cambi hanno difetti cronici. E ricorda: frizione e cambio sono tra gli interventi più costosi, quindi in trattativa valgono come argomento di sconto se non sono recenti.',
        ],
      },
    ],
    cta: 'analisi-ai',
  },
  {
    slug: 'auto-usate-affidabili-per-famiglia',
    title: 'Le auto usate più affidabili per la famiglia',
    description:
      'Cosa cercare in un\'auto di famiglia usata: spazio, sicurezza, costi di gestione e i modelli con la migliore affidabilità dimostrata.',
    published: '2026-08-07',
    category: 'affidabilita',
    sections: [
      {
        heading: 'Le esigenze di una famiglia',
        paragraphs: [
          'Un\'auto di famiglia deve essere spaziosa, sicura, economica da gestire e affidabile: l\'affidabilità conta doppio quando a bordo ci sono bambini e i guasti non sono un\'opzione. La scelta del modello giusto previene spese e disagi.',
        ],
      },
      {
        heading: 'Spazio e sicurezza',
        paragraphs: [
          'Bagagliaio generoso, spazio per i seggiolini, agganci ISOFIX e dotazioni di sicurezza (airbag, ESP, ADAS sulle più recenti) sono le priorità. Le auto "di famiglia" per eccellenza — monovolume, station e SUV compatti — si scelgono proprio per questo.',
        ],
      },
      {
        heading: 'I costi di gestione',
        paragraphs: [
          'Per una famiglia i costi contano: consumi, assicurazione, tagliandi e ricambi pesano sul budget annuale. Le auto con rete di assistenza capillare e ricambi economici sono più facili da mantenere e da assicurare a tariffe contenute.',
        ],
      },
      {
        heading: 'L\'affidabilità dimostrata',
        paragraphs: [
          'Le marche e i modelli con maggiore affidabilità dimostrata negli anni sono la scelta più sicura per l\'usato: la storia del modello (problemi noti, campagne di richiamo, durata dei motori) va verificata prima dell\'acquisto, più del singolo esemplare.',
        ],
      },
      {
        heading: 'Il modello giusto per la tua famiglia',
        paragraphs: [
          'Parti dalle esigenze (numero di figli, utilizzo, budget) e seleziona pochi modelli che le coprono, poi confronta affidabilità, costi e valore reale di mercato. L\'auto di famiglia giusta è quella che unisce spazio e sicurezza a un\'affidabilità che non si discute.',
        ],
      },
    ],
    cta: 'affidabilita-modello',
  },
  {
    slug: 'quanto-dura-un-motore-auto',
    title: 'Quanto dura davvero un motore: benzina, diesel e ibrido',
    description:
      'La durata reale dei motori moderni: quanti km può percorrere un motore benzina, diesel e ibrido e cosa determina la differenza.',
    published: '2026-08-07',
    category: 'affidabilita',
    sections: [
      {
        heading: 'I motori moderni durano a lungo',
        paragraphs: [
          'Con la manutenzione corretta, i motori moderni superano facilmente i 200.000-300.000 km: la qualità costruttiva è migliorata molto. La durata non è più una questione di fortuna ma di manutenzione e di scelta del motore giusto per l\'uso.',
        ],
      },
      {
        heading: 'Benzina: robusto ma delicato',
        paragraphs: [
          'I benzina moderni, soprattutto turbo di piccola cilindrata, hanno una vita paragonabile ai diesel se mantenuti bene, ma sono più sensibili a tagliandi saltati e guida a freddo. I benzina aspirati (meno comuni oggi) sono storicamente tra i più longevi.',
        ],
      },
      {
        heading: 'Diesel: il campione dei chilometri',
        paragraphs: [
          'I diesel hanno la struttura più robusta (pressioni e coppie maggiori richiedono materiali più resistenti): ben mantenuti superano spesso i 300.000 km. Il punto critico moderno sono i sistemi di post-trattamento (AdBlue, FAP), più che il motore stesso.',
        ],
      },
      {
        heading: 'Ibrido: lunghissima vita del motore',
        paragraphs: [
          'Nei sistemi ibridi il motore termico lavora nelle condizioni ottimali e spesso a regime costante: la durata del motore è eccellente, e la batteria ibrida di generazioni mature dura molto a lungo. I taxi ibridi con centinaia di migliaia di km sono la dimostrazione pratica.',
        ],
      },
      {
        heading: 'Cosa determina davvero la durata',
        paragraphs: [
          'Manutenzione regolare, olio giusto, motore scaldato prima di spingere, utilizzo coerente con il tipo di motore e interventi fatti al momento giusto: questi fattori contano più della marca. Un motore ben mantenuto supera ogni previsione; uno trascurato muore presto.',
        ],
      },
    ],
    cta: 'affidabilita-modello',
  },
  {
    slug: 'motori-benzina-piu-affidabili-usato',
    title: 'I motori benzina più affidabili per l\'usato',
    description:
      'Quali motorizzazioni benzina offrono la migliore affidabilità sul mercato dell\'usato e i controlli da fare prima di comprare.',
    published: '2026-08-07',
    category: 'affidabilita',
    sections: [
      {
        heading: 'Le caratteristiche dei benzina affidabili',
        paragraphs: [
          'I motori benzina più affidabili dell\'usato sono quelli di grande produzione, con lunga storia di affidabilità e ricambi economici: meccanica semplice, iniezione collaudata e assenza di sistemi complessi fragili.',
        ],
      },
      {
        heading: 'Aspirati vs turbo',
        paragraphs: [
          'Gli aspirati di piccola cilindrata sono storicamente i più longevi e economici da mantenere; i turbo moderni offrono più coppia e consumi migliori, ma hanno più componenti (turbina, intercooler) che possono richiedere interventi. Su entrambi, la manutenzione regolare è il fattore decisivo.',
        ],
      },
      {
        heading: 'I punti deboli noti',
        paragraphs: [
          'Alcuni motori benzina hanno difetti noti da controllare: catene di distribuzione, cinghie bagnate o consumi d\'olio. Prima dell\'acquisto, verifica se il motore del modello che guardi ha problemi ricorrenti e controlla la documentazione delle eventuali campagne di richiamo.',
        ],
      },
      {
        heading: 'I controlli sul singolo esemplare',
        paragraphs: [
          'Consumo d\'olio anomalo (da verificare con l\'astina), avvio a freddo stentato, rumori di catena e perdite sono i controlli chiave su un benzina usato. Un motore ben mantenuto con olio giusto e tagliandi regolari è quasi sempre un acquisto sicuro.',
        ],
      },
      {
        heading: 'La scelta per il tuo uso',
        paragraphs: [
          'Per pochi km in città un piccolo benzina aspirato è ideale; per molti km, un turbo efficiente o un ibrido benzina. Confronta l\'affidabilità del modello specifico e i suoi costi di manutenzione prima di scegliere: il motore giusto per il tuo uso è quello che dura.',
        ],
      },
    ],
    cta: 'affidabilita-modello',
  },
  {
    slug: 'truffa-chilometri-scalati-auto-usata',
    title: 'Chilometri scalati auto usata: come scoprirli e verificare i km reali nel 2026',
    description:
      'La truffa del contachilometri scalato riguarda fino al 20% delle auto usate in Italia. Ecco come verificare i chilometri reali gratuitamente tramite Portale dell\'Automobilista, revisioni, centraline e difetti usura.',
    published: '2026-08-07',
    category: 'acquisto',
    sections: [
      {
        heading: 'Quanto è diffusa la truffa dei km legati',
        paragraphs: [
          "Scalare i chilometri da un'auto usata è uno dei metodi fraudolenti più diffusi sul mercato dell'usato italiano. Riducendo il chilometraggio di 50.000–100.000 km, un venditore disonesto può aumentare artificialmente il valore di vendita dell'auto anche di 2.000–5.000 euro.",
          "La buona notizia è che oggi esistono strumenti digitali ufficiali e controlli fisici in grado di smascherare quasi qualsiasi manomissione in pochi minuti.",
        ],
      },
      {
        heading: '1. Portale dell\'Automobilista e Storico Revisioni',
        paragraphs: [
          "Dal 2018 in Italia i centri revisione hanno l'obbligo di registrare il chilometraggio rilevato al momento della revisione ministeriale. Questi dati confluiscono nel Portale dell'Automobilista ed effettuando una ricerca gratuita inserendo la targa del veicolo è possibile accedere allo storico.",
        ],
        list: [
          "Inserisci la targa su 'Portale dell'Automobilista' sotto la voce 'Verifica Ultima Revisione'.",
          "Confronta i km registrati nell'ultima revisione con quelli dichiarati dal venditore oggi.",
          "Verifica l'andamento nel tempo: se nella revisione del 2022 l'auto aveva 140.000 km e oggi ne ha 110.000, si tratta di una chiara manomissione.",
          "Attenzione alle auto importate dall'estero: richiedi lo storico dei tagliandi del paese d'origine o report tipo Carfax.",
        ],
      },
      {
        heading: '2. Libretto tagliandi e fatture officina',
        paragraphs: [
          "Il libretto dei tagliandi originale (tagliandario) deve riportare date, chilometri e timbri delle officine. diffida dai libretti stampati di recente o privi di timbri reali.",
        ],
        list: [
          "Controlla che i km salgano in modo coerente anno dopo anno.",
          "Richiedi le fatture o ricevute fiscali degli interventi passati (sostituzione pastiglie freni, cambio olio, cinghia distribuzione).",
          "Chiama l'officina che ha effettuato l'ultimo tagliando per verificare la veridicità delle fatture fornite.",
        ],
      },
      {
        heading: '3. Diagnosi elettronica OBD e centraline nascoste',
        paragraphs: [
          "Molti venditori truffaldini modificano soltanto il numero sul quadro strumenti del cruscotto. Tuttavia, le auto moderne memorizzano il chilometraggio effettivo in diverse altre centraline (ABS, centralina motore ECU, chiave di accensione, cambio automatico, airbag).",
        ],
        list: [
          "Porta l'auto da un elettrauto o meccanico di fiducia per una diagnosi con strumento ufficiale OBD-II.",
          "Verifica le ore di lavoro del motore nella centralina ECU e dividile per la velocità media stimata (circa 40–50 km/h).",
          "Nelle auto con cambio automatico, la centralina della trasmissione spesso conserva i km originali indipendentemente dal quadro strumenti.",
        ],
      },
      {
        heading: '4. Segnali d\'usura incoerenti nell\'abitacolo',
        paragraphs: [
          "L'usura dei materiali dell'abitacolo deve essere proporzionata ai chilometri dichiarati. Un'auto con 60.000 km non deve presentare il volante consumato fino al metallo o i pedali usurati.",
        ],
        list: [
          "Volante e pomello del cambio: usura marcata significa solitamente oltre 120.000–150.000 km.",
          "Gommini dei pedali (frizione e freno): se sostituiti di recente su un'auto 'a pochi km', è sospetto.",
          "Fianchetto del sedile guidatore: pieghe o tagli nella pelle/tessuto indicano salite e discese frequenti.",
          "Dischi freno e ammortizzatori: i dischi originali durano solitamente 60.000–80.000 km; se sono già al secondo cambio ma l'auto indica 40.000 km, c'è un'anomalia.",
        ],
      },
      {
        heading: 'Cosa fare se scopri km scalati dopo l\'acquisto',
        paragraphs: [
          "La manomissione del contachilometri costituisce reato di truffa contrattuale (art. 640 c.p.) e difetto di conformità grave ai sensi del Codice del Consumo. Hai diritto alla risoluzione del contratto con restituzione dell'intero importo o a una congrua riduzione del prezzo, oltre all'eventuale risarcimento danni.",
        ],
      },
    ],
    cta: 'truffa-km',
  },
  {
    slug: 'migliori-auto-usate-neopatentati-2026',
    title: 'Migliori auto usate per neopatentati 2026: quali modelli scegliere e limiti di legge',
    description:
      'Guida alle migliori auto usate per neopatentati nel 2026: i limiti di potenza (kW e kW/t), i modelli più affidabili ed economici da mantenere per i primi anni di guida.',
    published: '2026-08-07',
    category: 'acquisto',
    sections: [
      {
        heading: 'I limiti di legge per i neopatentati in Italia',
        paragraphs: [
          "Per il primo anno dal conseguimento della patente B (o tre anni per i limiti di velocità), il Codice della Strada fissa stringenti limiti sulla potenza dei veicoli guidabili dai neopatentati. Acquistare un'auto usata non idonea comporta multe salate e la sospensione della patente.",
        ],
        list: [
          "Rapporto potenza/tara: massimo 55 kW per tonnellata (kW/t) per veicoli M1.",
          "Potenza massima assoluta: non oltre 70 kW (95 CV).",
          "Nota per ibride ed elettriche: per le auto elettriche/plug-in il limite di potenza/tara è calcolato in base alla potenza continua (30 minuti) riportata a libretto (P.2).",
          "Verifica libretto: campo P.2 (kW) e rapporto kW/t riportato nell'ultima pagina del libretto di circolazione.",
        ],
      },
      {
        heading: 'Le migliori city car usate per neopatentati',
        paragraphs: [
          "Le city car rappresentano la scelta ideale per iniziare: dimensioni contenute, costi di assicurazione ridotti, ricambi economici e facilità nei parcheggi urbani.",
        ],
        list: [
          "Fiat Panda 1.2 Fire / 1.0 Hybrid: ricambi ovunque, manutenzione quasi a zero, tenuta del valore imbattibile.",
          "Lancia Ypsilon 1.2 Fire: elegante, economica ed estremamente diffusa sul mercato dell'usato.",
          "Toyota Yaris 1.0 VVT-i / 1.5 Hybrid (versioni compatibili): affidabilità al vertice e consumi ridotti.",
          "Volkswagen Polo 1.0 MPI (55 kW / 75 CV): solida, sicura negli urti e confortevole nei viaggi extraurbani.",
          "Renault Clio 1.2 16V / 1.0 SCe: ottimo spazio di bagagliaio per il segmento B.",
        ],
      },
      {
        heading: 'Crossover e piccoli SUV per neopatentati',
        paragraphs: [
          "Se cerchi una posizione di guida rialzata e maggiore spazio per il tempo libero, esistono diversi piccoli SUV usati guidabili dai neopatentati.",
        ],
        list: [
          "Renault Captur 1.0 TCe 90 CV / 1.5 dCi 90 CV: versatile e con divanetto posteriore scorrevole.",
          "Peugeot 2008 1.2 PureTech 82 CV / 1.6 BlueHDi 75 CV: interni moderni e ottima abitabilità.",
          "Ford EcoSport 1.5 TDCi 95 CV / 1.0 EcoBoost 85 CV: robusto e adatto anche a percorsi extraurbani.",
          "Dacia Duster 1.6 LPG / 1.5 dCi (versioni da 90 CV): imbattibile per rapporto prezzo/spazio.",
        ],
      },
      {
        heading: 'Consigli per risparmiare su assicurazione e manutenzione',
        paragraphs: [
          "I giovani guidatori affrontano tariffe RC Auto particolarmente elevate. Per abbattere i costi nel primo anno:",
        ],
        list: [
          "Sfrutta la Legge Bersani (RC Familiare) per ereditare la classe di merito di un genitore nello stesso nucleo familiare.",
          "Scegli motorizzazioni benzina o ibride con cilindrata 1.0–1.2 per pagare una tariffa RC Auto più bassa.",
          "Sottometti il modello a una verifica preventiva di affidabilità per evitare interventi straordinari costosi nei primi 12 mesi.",
        ],
      },
    ],
    cta: 'auto-neopatentati',
  },
  {
    slug: 'bollo-auto-2026-calcolo-esenzioni',
    title: 'Bollo auto 2026: come si calcola, scadenze ed esenzioni regionali',
    description:
      'Guida al calcolo del bollo auto nel 2026: tariffe per kW e classe Euro, superbollo, esenzioni per auto ibride, elettriche e storiche nelle principali regioni italiane.',
    published: '2026-08-07',
    category: 'valutazione',
    sections: [
      {
        heading: 'Cos\'è la tassa automobilistica e come funziona',
        paragraphs: [
          "Il bollo auto (tassa automobilistica) è una tassa di possesso regionale dovuta da chiunque risulti proprietario di un veicolo a motore iscritto al PRA. Il pagamento deve essere effettuato ogni anno entro il mese successivo a quello di scadenza.",
        ],
      },
      {
        heading: 'Come si calcola l\'importo del bollo auto nel 2026',
        paragraphs: [
          "L'importo del bollo si basa sulla potenza del motore espressa in chilowatt (kW) riportata nel campo P.2 del libretto e sulla classe ambientale di omologazione (da Euro 0 a Euro 6).",
        ],
        list: [
          "Euro 4, Euro 5, Euro 6: tariffa base di 2,58 € al kW fino a 100 kW; 3,87 € per ogni kW eccedente i 100 kW.",
          "Euro 3: 2,70 € al kW fino a 100 kW; 4,05 €/kW oltre i 100 kW.",
          "Euro 2: 2,80 € al kW fino a 100 kW; 4,20 €/kW oltre i 100 kW.",
          "Euro 1: 2,90 € al kW fino a 100 kW; 4,35 €/kW oltre i 100 kW.",
          "Euro 0: 3,00 € al kW fino a 100 kW; 4,50 €/kW oltre i 100 kW.",
          "Superbollo: per le auto con potenza superiore a 185 kW (252 CV) si applica un'addizionale erariale di 20 € per ogni kW eccedente 185 kW (con riduzione progressiva in base all'età dell'auto).",
        ],
      },
      {
        heading: 'Esenzioni regionali per auto elettriche e ibride',
        paragraphs: [
          "Molte Regioni italiane prevedono importanti agevolazioni fiscali per incentivare la transizione verso veicoli a basse emissioni.",
        ],
        list: [
          "Auto Elettriche 100% (BEV): esenzione totale dal bollo per i primi 5 anni dalla prima immatricolazione in tutta Italia. Dal sesto anno si paga il 25% della tariffa ordinaria (in Lombardia e Piemonte l'esenzione è permanente).",
          "Auto Ibride (HEV / PHEV): esenzione temporanea dal bollo varia per Regione (es. 3 anni in Lazio, Campania, Liguria e Veneto; 5 anni in Puglia; aliquota ridotta in Emilia-Romagna e Toscana).",
          "Auto a GPL e Metano monovalenti: riduzione del 75% della tassa automobilistica in gran parte delle Regioni.",
        ],
      },
      {
        heading: 'Bollo per auto storiche e ultra-trentennali',
        paragraphs: [
          "Le auto con più di 30 anni iscritte al PRA sono esenti dal bollo ordinario e pagano una tassa di circolazione forfettaria (circa 28–30 €) solo se utilizzate su pubblica strada. Per le auto tra 20 e 29 anni dotate di certificato di rilevanza storica (CRS), il bollo è ridotto del 50%.",
        ],
      },
    ],
    cta: 'calcolo-bollo',
  },
  {
    slug: 'garanzia-auto-usata-privato-e-concessionario',
    title: 'Garanzia auto usata: cosa copre tra privati e in concessionario',
    description:
      'Come funziona la garanzia sull\'auto usata nel 2026: differenze tra acquisto da concessionario (garanzia di conformità 12-24 mesi) e acquisto da privato (visto e piaciuto).',
    published: '2026-08-07',
    category: 'acquisto',
    sections: [
      {
        heading: 'Garanzia legale da concessionario (Codice del Consumo)',
        paragraphs: [
          "Quando acquisti un'auto usata da un venditore professionale (concessionario, salonista o rivenditore), scatta obbligatoriamente la Garanzia Legale di Conformità disciplinata dagli artt. 128 e ss. del Codice del Consumo.",
        ],
        list: [
          "Durata: 24 mesi per legge, riducibili a non meno di 12 mesi con l'accordo espresso dell'acquirente.",
          "Cosa copre: tutti i difetti non derivanti dal normale uso o dall'usura proporzionata al chilometraggio e all'età dell'auto.",
          "Presunzione di difetto: se il guasto si manifesta nei primi 12 mesi, si presume fosse già presente al momento della consegna.",
          "Riparazione a carico del venditore: il ripristino deve avvenire senza spese per il consumatore (ricambi, manodopera e trasporto).",
        ],
      },
      {
        heading: 'Cosa si intende per "normale usura"',
        paragraphs: [
          "La garanzia legale non è una polizza casco. Non copre i componenti soggetti a normale usura chilometrica (pastiglie freni, pneumatici, spazzole tergicristallo, olio) a meno che non si rompano prematuramente per un difetto di fabbricazione.",
        ],
      },
      {
        heading: 'Vendita tra privati: la clausola "Visto e Piaciuto"',
        paragraphs: [
          "Tra privati non si applica il Codice del Consumo, ma le norme del Codice Civile (artt. 1490 e ss.). La vendita avviene solitamente con la formula 'visto e piaciuto nelle condizioni in cui si trova'.",
        ],
        list: [
          "Nessuna garanzia automatica di 12 mesi dopo la consegna.",
          "Eccezione per vizi occulti dolosi: se il venditore privato ha occultato intenzionalmente un difetto grave noto (es. albero motore incrinato, guarnizione testata bruciata), risponde per vizio occulto con obbligo di risarcimento o riduzione prezzo.",
          "Consiglio: prima di acquistare da un privato, fai sempre effettuare una diagnosi meccanica preventiva o un'analisi visiva dello stato del veicolo.",
        ],
      },
      {
        heading: 'Le garanzie commerciali aggiuntive (Polizze di Garanzia)',
        paragraphs: [
          "Spesso i concessionari propongono polizze convenzionali o garanzie guasti gestite da compagnie terze (es. Mapfre, Conformgest, NSA). Leggi sempre attentamente il fascicolo informativo per verificare i massimali di spesa, la franchigia a tuo carico e gli organi coperti.",
        ],
      },
    ],
    cta: 'garanzia-usato',
  },
  {
    slug: 'migliori-suv-usati-qualita-prezzo',
    title: 'I 10 migliori SUV usati per rapporto qualità-prezzo',
    description:
      'Classifica dei 10 migliori SUV e crossover usati da acquistare nel 2026: i modelli più affidabili, spaziosi ed economici nel mercato dell\'usato italiano.',
    published: '2026-08-07',
    category: 'valutazione',
    sections: [
      {
        heading: 'Perché i SUV dominano il mercato dell\'usato',
        paragraphs: [
          "I Sport Utility Vehicle (SUV) e i Crossover compatti rimangono i veicoli più ricercati in Italia. La posizione di guida rialzata, la facilità di accesso, la sensazione di sicurezza e la modularità del bagagliaio li rendono la prima scelta per famiglie ed esigenze quotidiane.",
          "Ecco i 10 migliori modelli usati selezionati per affidabilità dimostrata, costi di manutenzione e tenuta del valore sul mercato italiano.",
        ],
      },
      {
        heading: '1. Nissan Qashqai (2a Gen. 2014–2021)',
        paragraphs: [
          "Il punto di riferimento della categoria. Il motore 1.5 dCi da 110/115 CV offre consumi bassissimi (oltre 20 km/l reali), ricambi ampiamente disponibili e grande comfort sulle lunghe percorrenze.",
        ],
      },
      {
        heading: '2. Toyota C-HR 1.8 Hybrid (dal 2016 in poi)',
        paragraphs: [
          "Design audace e sistema Full Hybrid collaudatissimo. Consumi in città inferiori ai 4,2 l/100 km, trasmissione eCVT indistruttibile e costi di manutenzione estremamente prevedibili.",
        ],
      },
      {
        heading: '3. Peugeot 3008 (2a Gen. dal 2016)',
        paragraphs: [
          "Interni di livello premium con l'i-Cockpit, ottimo isolamento acustico e motori diesel 1.5/1.6 BlueHDi molto efficienti per i grandi viaggiatori.",
        ],
      },
      {
        heading: '4. Dacia Duster (2a Gen. 2018–2023)',
        paragraphs: [
          "Il re del rapporto qualità/prezzo. Disponibile con motore GPL di fabbrica (1.0 TCe eco-G) o trazione 4x4 reale con motore 1.5 dCi. Robustezza pura senza fronzoli.",
        ],
      },
      {
        heading: '5. Volkswagen Tiguan (2a Gen. dal 2016)',
        paragraphs: [
          "Spazio interno da prima della classe, finiture eccellenti e motori 2.0 TDI tra i più longevi in assoluto se regolarmente tagliandati.",
        ],
      },
      {
        heading: '6. Ford Kuga (2a e 3a Gen.)',
        paragraphs: [
          "Ottima dinamica di guida grazie al telaio rigido, grande abitabilità e versioni 2.0 TDCi o 2.5 Full Hybrid di grande sostanza.",
        ],
      },
      {
        heading: '7. Hyundai Tucson / Kia Sportage (dal 2015)',
        paragraphs: [
          "Garanzia nativa di 5/7 anni che spesso protegge anche il secondo proprietario. Meccanica solida e dotazione di accessori molto ricca già nelle versioni intermedie.",
        ],
      },
      {
        heading: '8. Renault Kadjar (2015–2022)',
        paragraphs: [
          "Basato sulla stessa piattaforma del Qashqai ma spesso reperibile nell'usato a prezzi compresi tra il 10% e il 15% in meno.",
        ],
      },
      {
        heading: '9. Mazda CX-5 (2a Gen. dal 2017)',
        paragraphs: [
          "Guida coinvolgente, motori 2.0/2.5 benzina Skyactiv-G aspirati molto affidabili e interni rifiniti con materiali di altissima qualità.",
        ],
      },
      {
        heading: '10. Jeep Renegade / FIAT 500X',
        paragraphs: [
          "Le regine delle vendite in Italia. Stile inconfondibile, motori 1.6 Multijet e 1.0 FireFly briosi e rete di assistenza capillare su tutto il territorio nazionale.",
        ],
      },
    ],
    cta: 'migliori-suv',
  },
  {
    slug: 'incentivi-auto-usate-2026-ecobonus',
    title: 'Incentivi auto usate ed Ecobonus 2026: come funzionano',
    description:
      'Guida agli incentivi per l\'acquisto di auto usate nel 2026: contributi rottamazione, requisiti di classe di emissione Euro 6 e come ottenerli dal concessionario.',
    published: '2026-08-07',
    category: 'acquisto',
    sections: [
      {
        heading: 'Come funzionano gli incentivi per l\'usato nel 2026',
        paragraphs: [
          "Gli incentivi statali ed ecobonus non riguardano soltanto le vetture nuove di fabbrica. Anche nel 2026 sono previsti contributi statali e regionali destinati all'acquisto di auto usate ad alimentazione ecologica o di recente omologazione (Euro 6D), a fronte della rottamazione di un veicolo inquinante.",
        ],
      },
      {
        heading: 'Requisiti per accedere al contributo usati',
        paragraphs: [
          "Per poter usufruire dell'ecobonus sull'acquisto di un'auto usata occorre soddisfare precisi requisiti stabiliti dal Ministero:",
        ],
        list: [
          "Veicolo acquistato: deve essere di categoria M1, omologato in classe non inferiore a Euro 6D, con emissioni di CO2 entro i limiti previsti dalla fascia di incentivo.",
          "Prezzo di acquisto: il valore risultante dalle quotazioni medie di mercato non deve superare i 25.000 euro (IVA esclusa).",
          "Rottamazione obbligatoria: occorre rottamare un veicolo della medesima categoria omologato da Euro 0 a Euro 4 (o Euro 5 in alcune regioni), intestato all'acquirente o a un familiare convivente da almeno 12 mesi.",
          "Acquisto da rivenditore: la misura è valida unicamente per acquisti effettuati presso concessionari o rivenditori con fattura e applicazione diretta dello sconto in ricevuta.",
        ],
      },
      {
        heading: 'Bonus regionali cumulabili',
        paragraphs: [
          "Diverse Regioni (come Lombardia, Veneto, Piemonte ed Emilia-Romagna) mettono a disposizione bandi regionali per la sostituzione dei veicoli inquinanti con contributi a fondo perduto cumulabili con le agevolazioni nazionali.",
        ],
      },
    ],
    cta: 'incentivi-usato',
  },
  {
    slug: 'auto-nuova-o-usata-conviene',
    title: 'Auto nuova o usata: quale conviene davvero nel 2026',
    description:
      'Conviene comprare un\'auto nuova o usata? Il confronto completo su svalutazione, garanzia, incentivi e costo totale di possesso per capire quale scelta è giusta per te.',
    published: '2026-08-10',
    category: 'acquisto',
    sections: [
      {
        heading: 'La domanda sbagliata: "nuova o usata"',
        paragraphs: [
          'La vera domanda non è se conviene il nuovo o l\'usato, ma quale conviene per il tuo utilizzo: chilometri all\'anno, budget, durata di possesso e città in cui vivi. La stessa persona può trovare conveniente un\'auto nuova oggi e un\'usata di 3 anni tra cinque anni.',
          'Il dato che decide tutto è il costo totale di possesso, non il prezzo di acquisto: svalutazione, assicurazione, manutenzione, carburante e valore alla rivendita pesano spesso più dello sconto iniziale.',
        ],
      },
      {
        heading: 'Quando conviene l\'auto nuova',
        paragraphs: [
          'L\'auto nuova conviene quando sfrutti i suoi tre vantaggi esclusivi:',
        ],
        list: [
          'Incentivi e sconti da rottamazione: contributi statali e regionali che l\'usato non ha, o ha in forma ridotta.',
          'Garanzia piena: di solito 2 anni estendibili, con copertura totale e assistenza in rete.',
          'Zero sorprese: nessuno storico da verificare, personalizzazione completa di colore e allestimento.',
        ],
      },
      {
        heading: 'Quando conviene l\'auto usata',
        paragraphs: [
          'L\'usato conviene quando il prezzo è il fattore dominante o quando i chilometri annuali sono pochi. Il vantaggio principale è la svalutazione già assorbita: un\'auto di 3 anni ha già perso in media il 35–45% del valore a nuovo, e tu non paghi quella perdita.',
          'Su un budget di 15.000 euro, il nuovo compra una city car base; l\'usato di 3–4 anni compra un\'utilitaria top o una compatta media con pochi chilometri.',
        ],
      },
      {
        heading: 'La fascia d\'oro: l\'usato recente (2–4 anni)',
        paragraphs: [
          'Il compromesso migliore per la maggior parte delle persone è l\'usato recente: 2–4 anni, pochi chilometri, ancora in garanzia residua o estendibile. Ha già subito la parte più ripida della svalutazione, mantiene la tecnologia moderna e i costi di manutenzione bassi.',
          'Modelli come Toyota Yaris ibrida, Fiat Panda o VW Golf di 2–3 anni sono tra i più cercati proprio perché combinano prezzo già scontato e vita utile ancora lunga.',
        ],
      },
      {
        heading: 'Il calcolo che decide per te',
        paragraphs: [
          'Prima di scegliere, confronta i numeri reali: il valore di mercato attuale del modello nuovo e dell\'usato che ti interessa, la differenza di prezzo, il costo assicurativo e di manutenzione per i prossimi 3 anni e il valore residuo alla rivendita.',
          'Su AutoEsperto puoi verificare gratuitamente il prezzo medio reale di un\'usata dagli annunci in vendita: confrontalo con il listino del nuovo e avrai la risposta con i numeri in mano, non a sensazione.',
        ],
      },
    ],
    cta: 'valutazione-auto',
  },
  {
    slug: 'noleggio-lungo-termine-o-acquisto',
    title: 'Noleggio a lungo termine o acquisto: quale conviene nel 2026',
    description:
      'Noleggio a lungo termine o comprare un\'auto? Canoni, km inclusi, anticipo e valore residuo: il confronto economico completo per decidere con i numeri.',
    published: '2026-08-10',
    category: 'acquisto',
    sections: [
      {
        heading: 'Come funziona il noleggio a lungo termine',
        paragraphs: [
          'Nel noleggio a lungo termine (NLT) paghi un canone mensile fisso per usare un\'auto per 24–60 mesi, con un numero di chilometri annui concordato. Il canone comprende in genere manutenzione ordinaria, assicurazione RC e kasko, soccorso stradale, bollo e gestione di tutto.',
          'A fine contratto restituisci l\'auto: non ne diventi mai proprietario. È il modello più diffuso per le aziende, ma dal 2020 circa è cresciuto molto anche tra i privati.',
        ],
      },
      {
        heading: 'Quando il noleggio conviene davvero',
        paragraphs: [
          'Il noleggio a lungo termine conviene quando:',
        ],
        list: [
          'Vuoi una rata tutto incluso, prevedibile al centesimo, senza sorprese in officina.',
          'Percorri un chilometraggio medio e stabile (10.000–25.000 km/anno), senza superare i km inclusi.',
          'Cambi auto ogni 3–4 anni e non vuoi occuparti della vendita dell\'usato.',
          'Puoi dedurre il canone se usi l\'auto anche per lavoro con partita IVA.',
          'Vuoi un\'auto recente con garanzia sempre attiva e tecnologia aggiornata.',
        ],
      },
      {
        heading: 'Quando conviene comprare',
        paragraphs: [
          'L\'acquisto conviene quando tieni l\'auto a lungo: dopo il periodo del canone, l\'auto è tua e continua a funzionare senza costi mensili. Su una vita di 8–10 anni, acquistare e mantenere costa in genere meno che noleggiare in continuazione.',
          'Conviene anche se percorri pochissimi chilometri o se il tuo budget non regge un canone mensile, e soprattutto se scegli l\'usato: nessun canone si avvicina al costo di un\'usata di 4–5 anni ben scelta.',
        ],
      },
      {
        heading: 'Le insidie da leggere prima di firmare',
        paragraphs: [
          'Il canone basso nasconde spesso condizioni da verificare con attenzione:',
        ],
        list: [
          'Superamento dei km inclusi: le penali a fine contratto vanno da 0,05 a 0,20 €/km in più.',
          'Anticipo iniziale: più alto è l\'anticipo, più basso è il canone, ma rischi di più se smetti prima.',
          'Penali di recesso anticipato: uscire prima dei 24–36 mesi ha costi molto alti.',
          'Usura del veicolo: a fine contratto ogni graffio oltre il "normale" viene addebitato.',
          'Assicurazione inclusa ma con franchigie: in caso di sinistro paghi la franchigia.',
        ],
      },
      {
        heading: 'Il confronto con i numeri',
        paragraphs: [
          'Per capire quale strada conviene, confronta il costo totale del noleggio (anticipo + canoni + penali previste) con il costo totale di possesso dell\'auto scelta: prezzo, manutenzione, assicurazione e valore residuo alla vendita.',
          'Su AutoEsperto puoi verificare il valore di mercato e i costi di manutenzione dell\'auto che vorresti comprare, e confrontare due modelli: è il modo più rapido per costruire il tuo confronto economico con dati reali.',
        ],
      },
    ],
    cta: 'valutazione-auto',
  },
  {
    slug: 'auto-km-0-conviene',
    title: 'Auto km 0: cosa significa e quando conviene comprarla',
    description:
      'Cosa sono le auto km 0, perché costano meno del nuovo, quali controlli fare e quando sono davvero un affare: guida all\'acquisto 2026.',
    published: '2026-08-10',
    category: 'acquisto',
    sections: [
      {
        heading: 'Cos\'è un\'auto km 0',
        paragraphs: [
          'Un\'auto km 0 è un veicolo già immatricolato ma mai usato (o usato per pochi chilometri di prova). Il concessionario la immatricola a proprio nome per raggiungere gli obiettivi di vendita mensili o di fine anno, e poi la rivende come "nuova ma immatricolata": è a tutti gli effetti un\'auto nuova con un passaggio di proprietà già avvenuto.',
          'La differenza rispetto a un\'auto "usata" vera è il chilometraggio: le km 0 hanno in genere meno di 500–1.000 km e non hanno subito alcun utilizzo reale.',
        ],
      },
      {
        heading: 'Perché le km 0 costano meno',
        paragraphs: [
          'Il vantaggio è doppio per il concessionario e per te:',
        ],
        list: [
          'Svalutazione già assorbita: con l\'immatricolazione l\'auto perde subito una quota del valore a nuovo, e il concessionario la scarica sul prezzo.',
          'Sconti tipici: 10–20% rispetto al listino del nuovo, a seconda di modello, allestimento e urgenza di smaltire il parco.',
          'Pronta consegna: non aspetti mesi di attesa come sul nuovo in ordine.',
          'Omologazione e garanzia: resta la garanzia costruttore piena, spesso appena iniziata.',
        ],
      },
      {
        heading: 'Cosa controllare prima di comprare una km 0',
        paragraphs: [
          'Una km 0 non è un\'auto qualsiasi: controlla con attenzione i dati di immatricolazione e lo stato reale del veicolo.',
        ],
        list: [
          'Data di prima immatricolazione: se supera i 6 mesi o i 6.000 km, ai fini fiscali è già usata (niente IVA agevolata su alcune configurazioni).',
          'Garanzia residua: se è immatricolata da molti mesi, parte della garanzia è già consumata.',
          'Chilometri realmente percorsi: guarda il contachilometri e chiedi i km di prova dichiarati.',
          'Allestimento e dotazioni: le km 0 sono spesso parco in stock: verificare che l\'allestimento sia quello che vuoi, senza "sconti" su optional non richiesti.',
          'Passaggi di proprietà: il veicolo risulta intestato al concessionario: controlla che non abbia avuto altri proprietari intermedi.',
        ],
      },
      {
        heading: 'Le insidie da non sottovalutare',
        paragraphs: [
          'Il prezzo "da km 0" può nascondere un\'auto invenduta da mesi, con batteria scarica o pneumatici di stazionamento. Controlla lo stato reale come faresti con un\'usata: telaio, battistrada, interni e documenti.',
          'E confronta sempre: a volte una km 0 scontata del 10% costa più di un\'usata di 1–2 anni con 15.000 km, che ha ancora tutta la garanzia e un prezzo di listino inferiore.',
        ],
      },
      {
        heading: 'Come capire se è un affare',
        paragraphs: [
          'Usa i dati: verifica il prezzo medio di mercato di un\'usata recente dello stesso modello (1–3 anni) su AutoEsperto e confrontalo con il prezzo della km 0. Se la differenza è piccola, la km 0 con garanzia piena è la scelta migliore; se è grande, l\'usato recente batte la km 0.',
        ],
      },
    ],
    cta: 'prezzo-giusto',
  },
  {
    slug: 'leasing-auto-privati-come-funziona',
    title: 'Leasing auto per privati: come funziona e quando conviene',
    description:
      'Canoni, anticipo, maxirata e riscatto finale: come funziona il leasing per i privati, quanto costa davvero e quando conviene rispetto ad acquisto e finanziamento.',
    published: '2026-08-10',
    category: 'acquisto',
    sections: [
      {
        heading: 'Cos\'è il leasing auto',
        paragraphs: [
          'Il leasing (o locazione finanziaria) è un contratto in cui una società finanziaria compra l\'auto e te la concede in uso per 24–48 mesi, dietro pagamento di un canone periodico. A fine contratto hai tre opzioni: riscattare l\'auto pagando il valore residuo, restituirla o rinnovare il contratto su un\'altra vettura.',
          'Per anni è stato riservato alle imprese; da qualche anno è disponibile anche per i privati e sta crescendo molto, soprattutto sulle auto nuove ed elettriche.',
        ],
      },
      {
        heading: 'Come è strutturato il contratto',
        paragraphs: [
          'Il contratto tipico si compone di tre parti:',
        ],
        list: [
          'Anticipo: una somma iniziale (0–30% del valore) che abbassa i canoni successivi.',
          'Canoni mensili: il costo dell\'uso nel periodo, che include o meno assicurazione e manutenzione secondo l\'offerta.',
          'Maxirata finale (riscatto): il valore residuo da pagare a fine contratto per diventare proprietario: di solito il 30–45% del valore iniziale.',
        ],
      },
      {
        heading: 'Il costo totale e come leggerlo',
        paragraphs: [
          'Come per ogni finanziamento, il numero da guardare è il TAEG: include interessi, spese di istruttoria e altri oneri. Per capire quanto paghi in più, somma anticipo + tutti i canoni + maxirata e confronta il totale con il prezzo di acquisto in contanti.',
          'Esempio realistico: su un\'auto da 25.000 €, anticipo di 5.000 €, canoni di 300 € per 36 mesi e riscatto di 10.000 €, il totale supera il prezzo di acquisto di 800–2.000 € secondo il tasso: è il costo del "pagare in comode rate".',
        ],
      },
      {
        heading: 'Quando conviene il leasing',
        paragraphs: [
          'Il leasing conviene se:',
        ],
        list: [
          'Vuoi un\'auto nuova con rata contenuta e puoi permetterti il riscatto a fine contratto.',
          'Hai partita IVA e puoi dedurre i canoni (per i privati puri la deducibilità non c\'è).',
          'Vuoi cambiare auto ogni 2–3 anni senza gestire la vendita dell\'usato.',
          'Preferisci una rata con opzioni tutto incluso (manutenzione, assicurazione, soccorso).',
        ],
      },
      {
        heading: 'Le cose da controllare prima di firmare',
        paragraphs: [
          'Leggi con attenzione: la durata minima del contratto (in genere 24–36 mesi), le penali per recesso anticipato, il limite di chilometraggio e le penali di superamento, lo stato richiesto a fine contratto e chi è responsabile di bollo, assicurazione e manutenzione.',
          'E ricorda la regola generale: il leasing ha senso sull\'auto nuova, quasi mai sull\'usato, dove un finanziamento classico o l\'acquisto diretto costano meno.',
        ],
      },
    ],
    cta: 'valutazione-auto',
  },
  {
    slug: 'fermo-amministrativo-auto-come-verificare',
    title: 'Fermo amministrativo auto: come verificarlo prima dell\'acquisto',
    description:
      'Cos\'è il fermo amministrativo, perché è pericoloso comprare un\'auto che ce l\'ha, come verificarlo con visura e report e come si toglie.',
    published: '2026-08-10',
    category: 'acquisto',
    sections: [
      {
        heading: 'Cos\'è il fermo amministrativo',
        paragraphs: [
          'Il fermo amministrativo è un vincolo iscritto al Pubblico Registro Automobilistico (PRA) quando il proprietario non ha pagato debiti verso la pubblica amministrazione: bollo auto, multe, cartelle esattoriali o contributi. Dal momento dell\'iscrizione, l\'auto non può circolare su strada pubblica e risulta bloccata fino al pagamento del debito.',
          'È diverso dall\'ipoteca (che garantisce un mutuo o un finanziamento) e dal sequestro giudiziario: è la misura più frequente e la più sottovalutata da chi compra usato.',
        ],
      },
      {
        heading: 'Perché è pericoloso acquistare un\'auto con fermo',
        paragraphs: [
          'Il fermo segue l\'auto, non il proprietario: se compri un veicolo con fermo iscritto, ti ritrovi un\'auto che non puoi usare, immatricolare a tuo nome senza risolvere il problema e che può essere confiscata in caso di controllo.',
          'Peggio ancora: per togliere il fermo devi pagare tu il debito del precedente proprietario (o convincerlo a farlo): se il venditore è sparito, il costo è tuo.',
        ],
      },
      {
        heading: 'Come verificarlo prima di comprare',
        paragraphs: [
          'Il controllo è semplice, economico e obbligatorio prima di qualsiasi acquisto:',
        ],
        list: [
          'Visura PRA: richiedila con targa o telaio (circa 6 € via ACI o agenzie di pratiche): rivela fermi, ipoteche, pignoramenti e passaggi di proprietà.',
          'Report storico su targa (Carfax, autoDNA e simili): oltre al fermo mostrano incidenti, km e danni.',
          'Portale dell\'Automobilista: per verifiche su revisione e dati del veicolo.',
          'Controllo documenti: il libretto e il certificato di proprietà non riportano i fermi, quindi non basta guardarli: serve la visura.',
        ],
      },
      {
        heading: 'Si può comprare o vendere un\'auto con fermo?',
        paragraphs: [
          'Vendere un\'auto con fermo non è illegale di per sé, ma il venditore deve dichiararlo e l\'acquirente deve essere consapevole che l\'auto non potrà circolare né essere intestata finché il fermo non viene cancellato.',
          'In pratica: o il venditore regolarizza prima del passaggio, o il prezzo deve essere drasticamente scontato, e comunque il rischio non vale il risparmio: se il fermo non si cancella, l\'auto vale solo come pezzi.',
        ],
      },
      {
        heading: 'Come si toglie il fermo',
        paragraphs: [
          'Il fermo si cancella pagando il debito (anche in rate tramite l\'agente della riscossione) e attendendo la revoca formale, che viene comunicata al PRA. Dopo la revoca, con il certificato di regolarità puoi fare il passaggio di proprietà.',
          'La lezione pratica: la visura costa pochi euro e pochi minuti. Fallo sempre, come prima verifica, prima di firmare qualsiasi compromesso.',
        ],
      },
    ],
    cta: 'controllo-usato',
  },
  {
    slug: 'auto-elettrica-usata-cosa-controllare',
    title: 'Auto elettrica usata: cosa controllare prima di comprare',
    description:
      'Batteria, autonomia reale, garanzia residua e valore di rivendita: la checklist per comprare un\'auto elettrica usata senza brutte sorprese.',
    published: '2026-08-10',
    category: 'acquisto',
    sections: [
      {
        heading: 'Perché l\'usato elettrico è (spesso) un affare',
        paragraphs: [
          'Le auto elettriche si svalutano più rapidamente delle benzina e delle ibride: sul mercato italiano si trovano esemplari di 3–4 anni con prezzi molto scontati rispetto al listino. Per chi ha la ricarica a casa, il costo per chilometro è bassissimo, e il mercato dell\'usato elettrico sta diventando una vera opportunità.',
          'Il rovescio della medaglia: la tecnologia si evolve in fretta e la batteria è il componente più caro. Sapere cosa controllare fa la differenza tra un affare e un salasso.',
        ],
      },
      {
        heading: 'La batteria è la cosa più importante',
        paragraphs: [
          'La batteria di trazione è il cuore e il componente più costoso (sostituirla costa in genere 8.000–20.000 €). Prima di comprare:',
        ],
        list: [
          'Verifica lo stato di salute (SOH) della batteria: molti modelli lo mostrano dal menu di servizio o dall\'app; sotto l\'85–90% di SOH l\'autonomia reale scende in modo sensibile.',
          'Controlla l\'autonomia reale a pieno carico in condizioni reali, non quella dichiarata da nuova.',
          'Verifica la garanzia residua della batteria: molti costruttori la coprono 8 anni/160.000 km: la garanzia segue l\'auto.',
          'Chiedi lo storico delle ricariche: ricariche rapide frequenti al 100% degradano più in fretta.',
          'Controlla che non ci siano richiami aperti o campagne di aggiornamento della batteria.',
        ],
      },
      {
        heading: 'Cosa controllare sul resto dell\'auto',
        paragraphs: [
          'Oltre alla batteria, l\'usato elettrico va controllato come un\'usata normale, con alcune differenze:',
        ],
        list: [
          'Motore e inverter: raramente si guastano, ma in caso di guasto i costi non sono banali: chiedi lo storico degli interventi.',
          'Freni: con la frenata rigenerativa si consumano meno, ma vanno controllati come su ogni auto.',
          'Pneumatici: le elettriche sono pesanti e consumano le gomme più in fretta: controlla il battistrada.',
          'Sospensioni: peso maggiore significa più usura su ammortizzatori e bracci.',
          'Ricarica: verifica che il cavo di ricarica sia incluso e che la presa domestica (se la usi) sia adatta.',
        ],
      },
      {
        heading: 'I costi da mettere in conto',
        paragraphs: [
          'Il costo di gestione di un\'elettrica usata è in genere più basso di una termica: meno manutenzione ordinaria, bollo ridotto o esente in molte regioni, accesso alle ZTL. In cambio considera: assicurazione spesso più cara, ricarica alle colonnine pubbliche che può costare come la benzina, e una svalutazione che resta imprevedibile.',
          'Il confronto più utile è tra lo stesso modello a benzina, ibrida ed elettrica usato: i consumi e il valore residuo dicono quale conviene per i tuoi chilometri.',
        ],
      },
      {
        heading: 'Come verificare il valore reale',
        paragraphs: [
          'Prima di trattare, verifica il prezzo medio di mercato del modello elettrico specifico (marca, modello, anno e batteria) confrontandolo con gli annunci reali. Su AutoEsperto puoi vedere il valore medio di un\'usata elettrica in pochi secondi e confrontarlo con l\'equivalente ibrida o benzina: è il dato che decide la convenienza.',
        ],
      },
    ],
    cta: 'controllare-auto-usata',
  },
  {
    slug: 'classe-euro-ztl-divieti-circolazione',
    title: 'Classe Euro e ZTL: dove può circolare la tua auto',
    description:
      'Classe Euro: cosa indica, dove trovarla sul libretto e quali divieti di circolazione e ZTL si applicano a diesel, benzina, GPL e ibride. Guida aggiornata 2026.',
    published: '2026-08-10',
    category: 'valutazione',
    sections: [
      {
        heading: 'Cos\'è la classe Euro',
        paragraphs: [
          'La classe Euro indica il livello di emissioni del veicolo, da Euro 0 (le più vecchie e inquinanti) a Euro 6 (le più recenti). Viene assegnata al momento dell\'omologazione e dipende dal rispetto dei limiti di emissione europei vigenti in quell\'anno.',
          'Non è un dettaglio tecnico: decide dove puoi circolare, quanto paghi di bollo in alcune regioni e quanto vale l\'auto sul mercato dell\'usato.',
        ],
      },
      {
        heading: 'Dove trovare la classe Euro sul libretto',
        paragraphs: [
          'Sul libretto di circolazione la classe Euro è indicata nella voce V.9 ("Normativa di riferimento"), con sigle tipo "Euro 6d", "Euro 6d-TEMP", "Euro 5" e così via. Sui documenti più recenti può essere presente anche la menzione della normativa specifica come "2020/2" o simili.',
          'Se non la trovi o hai dubbi, puoi verificarla sul Portale dell\'Automobilista con targa o telaio, oppure tramite una visura PRA.',
        ],
      },
      {
        heading: 'I divieti che stanno arrivando',
        paragraphs: [
          'Le grandi città italiane stanno progressivamente limitando la circolazione dei diesel:',
        ],
        list: [
          'Milano Area C/B: divieti progressivi per i diesel fino a Euro 5, con date che si aggiornano ogni anno.',
          'Torino, Bologna, Firenze e Roma: blocchi stagionali o permanenti per i diesel Euro 4 e precedenti.',
          'ZTL a targa alternata o a pagamento in molti centri storici.',
          'Aree verdi a livello regionale (Piemonte, Lombardia, Emilia-Romagna): paletti per diesel Euro 3–5.',
          'Alcune città escludono completamente i diesel dai centri storici nei weekend.',
        ],
      },
      {
        heading: 'Quali auto restano "libere"',
        paragraphs: [
          'I benzina Euro 4 e superiori sono in genere ammessi quasi ovunque; le ibride (full e plug-in) e le elettriche hanno accesso libero o facilitato alla maggior parte delle ZTL; le GPL e metano Euro 4+ sono ammesse in molte aree dove il diesel è bloccato.',
          'Prima di comprare, verifica sempre le ordinanze della tua città e di quelle in cui pensi di viaggiare: le date dei divieti si aggiornano spesso e le auto "diesel Euro 5" valgono molto meno dove non possono circolare.',
        ],
      },
      {
        heading: 'L\'impatto sul valore dell\'usato',
        paragraphs: [
          'La classe Euro è oggi uno dei fattori che incide di più sul valore di rivendita: un diesel Euro 4–5 in una città con blocchi è quasi invendibile, mentre una benzina o ibrida Euro 6 tiene il valore. Il consiglio: prima di valutare o acquistare, controlla la classe Euro insieme al prezzo medio di mercato del modello.',
        ],
      },
    ],
    cta: 'valutazione-auto',
  },
  {
    slug: 'auto-gpl-metano-usate-convengono',
    title: 'Auto a GPL e metano usate: costi, vantaggi e cosa controllare',
    description:
      'Quanto si risparmia con GPL e metano sull\'usato, quali impianti esistono, cosa controllare prima dell\'acquisto e quanto incidono su bollo, assicurazione e ZTL.',
    published: '2026-08-11',
    category: 'valutazione',
    sections: [
      {
        heading: 'Perché GPL e metano convengono ancora',
        paragraphs: [
          'Il GPL costa circa il 40–50% in meno della benzina e il metano anche di più: per chi percorre molti chilometri, la differenza sul pieno si sente ogni mese. Sul mercato dell\'usato si trovano molte auto bifuel già installate, che evitano il costo della trasformazione (1.500–2.500 € su un\'auto nuova).',
          'In più, GPL e metano Euro 4+ sono ammessi in molte ZTL dove il diesel è bloccato, e in alcune regioni godono di sconti sul bollo.',
        ],
      },
      {
        heading: 'Le differenze tra GPL e metano',
        paragraphs: [
          'Il GPL è più diffuso e ha una rete di distribuzione capillare; il metano ha un costo al kg più basso e consumi ancora più contenuti, ma le stazioni di rifornimento sono meno frequenti (soprattutto al Sud). L\'autonomia dipende dal serbatoio e spesso si combina con il pieno di benzina.',
          'Sull\'usato il metano è più raro e tende a essere più economico da trovare, ma la rete di rifornimento è il vero limite: valutalo in base a dove vivi e guidi.',
        ],
      },
      {
        heading: 'Cosa controllare su un\'usato a GPL o metano',
        paragraphs: [
          'Un impianto a gas richiede controlli specifici che una benzina normale non ha:',
        ],
        list: [
          'Revisione periodica del serbatoio: la bombola GPL va verificata ogni 10 anni (con sostituzione a fine vita); il serbatoio metano ogni 4 anni con test a pressione.',
          'Scadenza della bombola: se si avvicina o è scaduta, i costi di sostituzione sono 300–800 €: usali come leva sul prezzo.',
          'Certificazione dell\'impianto: deve essere a norma (EC 661/2009 o precedente), con documentazione dell\'installatore.',
          'Funzionamento a gas: fai una prova su strada con il commutatore in posizione gas: strattoni o stalli indicano riduttori o iniettori da rifare.',
          'Libretto aggiornato: l\'impianto deve risultare annotato sui documenti di circolazione.',
        ],
      },
      {
        heading: 'Costi di gestione da conoscere',
        paragraphs: [
          'La manutenzione di un\'impianto GPL/metano è contenuta ma va prevista: filtri gas da sostituire periodicamente, riduttore che invecchia e può costare 200–400 €, e iniettori che prima o poi si rifanno. In compenso, freni e motore tendono a durare bene su percorsi urbani.',
          'Per il metano il risparmio è massimo con molti chilometri; sotto i 10.000 km/anno la differenza con una benzina si assottiglia e il peso del serbatoio e lo spazio perso nel bagagliaio contano di più.',
        ],
      },
      {
        heading: 'Quanto si risparmia davvero',
        paragraphs: [
          'La regola pratica: con 15.000 km/anno, un\'auto a GPL risparmia in genere 600–900 € l\'anno di carburante rispetto alla stessa auto a benzina; a metano anche di più. Con la stessa percorrenza, in 3–4 anni il risparmio ripaga ampiamente la differenza di prezzo tra usato a gas e usato a benzina.',
          'Prima di comprare, confronta consumi e costi reali del modello specifico (urbano, extraurbano e combinato) e verifica il valore di mercato dell\'esemplare: un\'usata GPL ben mantenuta vale spesso più di una benzina equivalente proprio per il risparmio che garantisce.',
        ],
      },
    ],
    cta: 'consumi-modello',
  },
  {
    slug: 'quando-conviene-comprare-auto',
    title: 'Quando conviene comprare un\'auto: il momento giusto dell\'anno',
    description:
      'Fine anno, fine trimestre, lancio di nuovi modelli: i periodi in cui i prezzi scendono davvero e come sfruttare il calendario per trattare meglio.',
    published: '2026-08-11',
    category: 'acquisto',
    sections: [
      {
        heading: 'Il prezzo cambia con il calendario',
        paragraphs: [
          'Il prezzo di un\'auto non è una costante: cambia con le stagioni, gli obiettivi di vendita dei concessionari e il lancio di nuovi modelli. Chi compra nel momento giusto può ottenere sconti del 10–20% senza nemmeno trattare; chi compra nel momento sbagliato paga il pieno.',
          'Le dinamiche sono diverse tra nuovo e usato, ma la regola di fondo è una sola: i venditori scendono di prezzo quando hanno bisogno di vendere.',
        ],
      },
      {
        heading: 'Il momento migliore per il nuovo',
        paragraphs: [
          'Per l\'auto nuova il momento migliore è la fine del periodo di budget dei concessionari:',
        ],
        list: [
          'Fine mese: i venditori chiudono i conti mensili e preferiscono scontare a una consegna veloce.',
          'Fine trimestre e fine anno: i concessionari devono raggiungere gli obiettivi delle case e svendono parco e km 0.',
          'Lancio di un restyling o di un nuovo modello: la versione precedente viene scontata anche del 15–20%.',
          'Novembre–dicembre: i saldi di fine anno sugli invenduti sono i più aggressivi.',
        ],
      },
      {
        heading: 'Il momento migliore per l\'usato',
        paragraphs: [
          'Sull\'usato le dinamiche sono più morbide ma esistono:',
        ],
        list: [
          'Inverno: la domanda cala (specialmente per convertibili e auto sportive), e i privati che devono vendere scendono di prezzo.',
          'Dopo i saldi del nuovo: chi non ha trovato sconti sul nuovo ripiega sull\'usato recente, aumentando la concorrenza: compra prima.',
          'Cambio di stagione: auto invernali (4x4, catene) e estive (convertibili) seguono curve di domanda opposte.',
          'Fine anno: anche i privati vogliono chiudere prima delle feste: prezzi più trattabili su auto invendute da mesi.',
        ],
      },
      {
        heading: 'Come usare i dati per comprare nel momento giusto',
        paragraphs: [
          'Il calendario da solo non basta: il prezzo giusto si vede dai dati. Controlla il prezzo medio di mercato del modello che ti interessa (marca, modello, anno) e segui l\'andamento per qualche settimana: se la media scende, è il momento di fare l\'offerta; se sale, aspetta.',
          'La trattativa migliore si fa quando hai in mano il valore reale di mercato: il venditore che conosce i prezzi reali degli annunci simili non può sparare cifre senza fondamento.',
        ],
      },
      {
        heading: 'Il momento sbagliato: quando evitare',
        paragraphs: [
          'Evita di comprare quando la domanda è massima e l\'offerta scarsa: a inizio estate per i modelli richiesti, a settembre per i SUV "da famiglie", e nei giorni di lancio di un modello molto atteso, quando i prezzi dell\'usato di quello stesso modello salgono per qualche settimana.',
          'Pazienza e calendario: aspettare 3–4 settimane può valere centinaia di euro di differenza.',
        ],
      },
    ],
    cta: 'prezzo-giusto',
  },
  {
    slug: 'vendere-auto-incidentata-cosa-fare',
    title: 'Come vendere un\'auto incidentata senza svenderla',
    description:
      'Si può vendere un\'auto incidentata? Quanto vale, chi la compra e come fare un annuncio onesto che massimizzi il ricavato: guida pratica alla vendita.',
    published: '2026-08-11',
    category: 'vendita',
    sections: [
      {
        heading: 'Sì, si può vendere: ma con regole precise',
        paragraphs: [
          'Vendere un\'auto incidentata è legale, a una condizione non negoziabile: dichiarare per iscritto tutti i danni. Se nascondi un incidente strutturale e il compratore lo scopre, rischi la risoluzione del contratto, il risarcimento dei danni e anche conseguenze penali per truffa.',
          'L\'onestà, inoltre, è la tua arma di vendita: chi compra un\'auto con danni dichiarati sa cosa compra e non avrà pretese successive.',
        ],
      },
      {
        heading: 'Quanto vale davvero un\'auto incidentata',
        paragraphs: [
          'Il valore dipende dal tipo di danno:',
        ],
        list: [
          'Danno cosmetico (graffi, ammaccature su paraurti): sconto del 2–5% rispetto al valore di mercato.',
          'Danno funzionale (fari, sospensioni, parabrezza): sconto del 5–15%, pari al costo della riparazione.',
          'Danno strutturale (telaio, longheroni): sconto del 20–40%: l\'auto resta vendibile ma solo a chi la vuole riparare.',
          'Auto non riparabile (airbag esplosi, telaio piegato): vale il solo valore di recupero come pezzi o da demolire: 300–1.500 €.',
        ],
      },
      {
        heading: 'A chi vendere: le tre strade',
        paragraphs: [
          'Per un\'auto incidentata hai tre canali, con valori molto diversi:',
        ],
        list: [
          'Privato: il ricavato migliore se i danni sono riparabili e dichiarati, ma richiede tempo e trattativa.',
          'Concessionario o autosalone: prende l\'auto in permuta o a ritiro, scontando il danno ma gestendo tutto: comodo e veloce.',
          'Compratori di incidentate e demolitori: la soluzione più rapida per auto con danni gravi, ma pagano il minimo (spesso 10–30% del valore).',
        ],
      },
      {
        heading: 'Come preparare la vendita',
        paragraphs: [
          'Per massimizzare il ricavato:',
        ],
        list: [
          'Documenta i danni con foto chiare e oneste: le foto da tutti i lati aumentano la fiducia e le visite.',
          'Raccogli lo storico: tagliandi, revisioni e fatture di eventuali riparazioni aumentano il valore.',
          'Fai riparare i danni piccoli e economici (un paraurti, una portiera): l\'investimento torna quasi sempre.',
          'Per i danni strutturali, chiedi un preventivo scritto: ti serve per calcolare lo sconto onesto sul prezzo.',
        ],
      },
      {
        heading: 'Il prezzo giusto: come calcolarlo',
        paragraphs: [
          'Il punto di partenza è sempre il valore di mercato dell\'auto senza danni: stessa marca, modello, anno e chilometraggio. Da quel valore sottrai il costo di riparazione (se la fai fare al compratore) o uno sconto proporzionale al danno, e fissi il prezzo di partenza con un piccolo margine di trattativa.',
          'Su AutoEsperto puoi verificare gratuitamente il valore medio di mercato dell\'esemplare senza danni: da lì inizia il tuo calcolo e la tua trattativa.',
        ],
      },
    ],
    cta: 'valore-vendita',
  },
  {
    slug: 'furgoni-veicoli-commerciali-usati',
    title: 'Furgoni e veicoli commerciali usati: guida all\'acquisto',
    description:
      'Come comprare un furgone usato senza rischi: chilometraggio reale, usura, allestimenti, documenti e controlli specifici dei veicoli commerciali.',
    published: '2026-08-11',
    category: 'acquisto',
    sections: [
      {
        heading: 'I furgoni usati sono un\'altra specie',
        paragraphs: [
          'Un furgone usato non è un\'auto più grande: è un veicolo che ha probabilmente lavorato, con un\'usura concentrata su motore, frizione, sospensioni e pianale che i chilometri da soli non raccontano. Un furgone di 100.000 km può valere più o meno di uno di 60.000 km: dipende da come è stato usato.',
          'Il punto di partenza è sempre lo stesso: verificare i dati prima, guardare il veicolo dopo.',
        ],
      },
      {
        heading: 'Cosa controllare prima dell\'acquisto',
        paragraphs: [
          'Ai controlli classici di un\'usata si aggiungono quelli specifici dei commerciali:',
        ],
        list: [
          'Chilometraggio reale: i furgoni sono tra i veicoli con più km scalati: confronta le revisioni (registrano i km) e i tagliandi.',
          'Usura del pianale di carico: ammaccature, fori o ruggine indicano uso pesante e carichi non protetti.',
          'Portellone e portiere scorrevoli: i meccanismi si usurano con l\'uso quotidiano di carico e scarico.',
          'Frizione e cambio: la guida commerciale (molte manovre, carichi) li stressa molto: prova su strada con il mezzo carico.',
          'Motore: fai un test a freddo e a caldo, controlla fumi e livello olio: un furgone trascurato tradisce subito.',
          'Documenti: targa, telaio, revisione valida e coincidenza tra libretto e veicolo.',
        ],
      },
      {
        heading: 'Allestimenti e versatilità',
        paragraphs: [
          'Il valore di un furgone dipende molto dall\'allestimento: cassonato, furgone a tetto alto, pianale ribassato, celle frigorifere o attrezzature interne cambiano prezzo e destinazione. Verifica che l\'allestimento sia quello dichiarato e che eventuali modifiche (allestitori) risultino regolarmente annotate sui documenti.',
          'Chiedi sempre lo storico degli interventi di manutenzione: su un mezzo da lavoro, la regolarità della manutenzione vale più del chilometraggio.',
        ],
      },
      {
        heading: 'Documenti, fiscale e passaggio',
        paragraphs: [
          'Per i veicoli commerciali (categoria N) la normativa è diversa dalle autovetture: verifica la categoria di omologazione, la portata, la classe Euro (per le restrizioni urbane) e l\'eventuale agevolazione fiscale se compri con partita IVA. Il passaggio di proprietà segue la procedura standard PRA, ma per i mezzi commerciali controlla anche fermi amministrativi e ipoteche: sono più frequenti che sulle auto.',
        ],
      },
      {
        heading: 'Come valutare un furgone usato',
        paragraphs: [
          'Come per le auto, il riferimento è il valore medio di mercato di esemplari simili (marca, modello, anno, motorizzazione): i furgoni più richiesti come Fiat Ducato, Ford Transit, Renault Kangoo o VW Caddy tengono meglio il valore proprio per la domanda costante dei lavoratori.',
          'Verifica il prezzo medio di mercato del modello prima di trattare: un furgone da lavoro si compra con la testa, e i dati ti evitano di pagare l\'usura nascosta.',
        ],
      },
    ],
    cta: 'valutazione-auto',
  },
  {
    slug: 'migliori-city-car-usate',
    title: 'Le migliori city car usate: quali scegliere per la città',
    description:
      'City car usate: quali modelli tengono il valore, costano poco da mantenere e sono ideali per la città. Confronto, controlli e prezzi medi di mercato.',
    published: '2026-08-11',
    category: 'acquisto',
    sections: [
      {
        heading: 'Cosa rende buona una city car usata',
        paragraphs: [
          'Una city car deve fare poche cose, ma farle bene: consumare poco nel traffico, costare poco di assicurazione e manutenzione, parcheggiare ovunque e non svalutarsi in fretta. Sul mercato dell\'usato, i modelli che rispettano queste regole si riconoscono dalla domanda costante: si rivendono in pochi giorni.',
          'In più, le city car compatte sono tra le auto più affidabili in assoluto: meccanica semplice, pochi optional complessi, ricambi economici.',
        ],
      },
      {
        heading: 'I modelli che funzionano meglio',
        paragraphs: [
          'Sul mercato italiano queste sono le city car usate con la domanda più solida:',
        ],
        list: [
          'Fiat Panda: la più diffusa, ricambi ovunque, manutenzione molto economica: un\'usata tra le più semplici da gestire.',
          'Toyota Yaris (anche ibrida): consumi bassissimi in città, affidabilità eccellente, valore di rivendita alto.',
          'Suzuki Swift: leggera e agile, motore collaudato, costi contenuti.',
          'Fiat 500: icona di stile con domanda costante: tiene il valore meglio di molte rivali, ma occhio al prezzo richiesto.',
          'Hyundai i10 e Kia Picanto: garanzia solida e meccanica semplice, ottime come prima auto.',
        ],
      },
      {
        heading: 'Quanto costa mantenerle',
        paragraphs: [
          'Il punto di forza delle city car è il costo di gestione: assicurazione in classe bassa, tagliando annuale tra 100 e 200 €, consumi tra i 5 e i 6 litri per 100 km in città per la benzina, meno per l\'ibrida. Le gomme piccole costano poco e la frizione (intervento più caro ricorrente) parte da 400–600 €.',
          'Per questo, su una city car, un prezzo d\'acquisto anche di 1.000 € sopra la media è spesso compensato in pochi anni dal risparmio di gestione.',
        ],
      },
      {
        heading: 'Cosa controllare prima dell\'acquisto',
        paragraphs: [
          'Le city car economiche attraggono acquirenti che le trattano male:',
        ],
        list: [
          'Chilometraggio reale: confronta le revisioni (registrano i km) e l\'usura di volante, pedali e sedili.',
          'Ruggine su sottoscocca e passaruota: le utilitarie usate in città e sulle strade salate soffrono molto.',
          'Frizione usurata: nelle city car usate per lavoro è la prima cosa a cedere.',
          'Stato dei tagliandi: una manutenzione saltata su un\'auto economica si paga subito.',
          'Controlla sempre il valore medio di mercato del modello e anno specifico: il prezzo "da passione" è il rischio più diffuso su Fiat 500 e modelli iconici.',
        ],
      },
    ],
    cta: 'valutazione-auto',
  },
  {
    slug: 'auto-7-posti-usate-guida',
    title: 'Auto 7 posti usate: come scegliere la giusta per la famiglia',
    description:
      'SUV, monovolume e multispazio 7 posti usati: spazio, sicurezza, consumi e costo di gestione. Guida alla scelta per famiglie numerose senza brutte sorprese.',
    published: '2026-08-11',
    category: 'acquisto',
    sections: [
      {
        heading: '7 posti "veri" o occasionali?',
        paragraphs: [
          'La prima domanda è quanto userai davvero la terza fila: i 7 posti "veri" (con sedili grandi e spazio per adulti) sono tipici di monovolume e alcuni SUV di grandi dimensioni; molti SUV compatti offrono una terza fila ripiegabile, adatta solo a bambini e per tragitti brevi.',
          'Decidi prima l\'uso: se i 7 posti servono ogni giorno, serve un\'auto vera; se servono una volta al mese, un SUV con terza fila a scomparsa è più pratico, più economico e più facile da parcheggiare.',
        ],
      },
      {
        heading: 'I modelli più sensati sull\'usato',
        paragraphs: [
          'Sul mercato italiano i 7 posti usati più richiesti sono:',
        ],
        list: [
          'Skoda Kodiaq: spazio generoso, motori collaudati, ottimo rapporto qualità-prezzo.',
          'Dacia Jogger: il 7 posti più economico in assoluto, semplice e conveniente da mantenere.',
          'Ford Galaxy / S-Max: veri monovolume con terza fila comoda, ottimi sul lungo periodo.',
          'Renault Espace e Grand Scenic: comfort da monovolume, buona disponibilità sull\'usato.',
          'Volkswagen Touran e Sharan: riferimento per famiglie, affidabilità solida e ricambi ovunque.',
          'Mercedes Classe B e BMW 2 Series Active Tourer (7 posti): premium ma con costi di gestione più alti.',
        ],
      },
      {
        heading: 'Cosa controllare su un 7 posti usato',
        paragraphs: [
          'Un\'auto per famiglie ha usi e usure particolari:',
        ],
        list: [
          'Interni: sedili, rivestimenti e ganci di fissaggio mostrano subito se è stata usata con bambini: odori e usura sono la prova.',
          'Terza fila: verifica che si apra, si chiuda e si ripieghi correttamente.',
          'Capitolato carichi: i 7 posti a pieno carico pesano: controlla freni, ammortizzatori e pneumatici.',
          'Chilometraggio e revisioni: una famiglia che fa scuola e vacanze accumula km reali: verifica la coerenza.',
          'Portellone e scorrimento sedili: i meccanismi più usati sono i primi a cedere.',
        ],
      },
      {
        heading: 'Consumi e costi di gestione da mettere in conto',
        paragraphs: [
          'Un\'auto 7 posti pesa e consuma: conta su medie di 6–8 litri per 100 km per le termiche, meno per le ibride; il costo di pneumatici (taglie grandi) e freni è più alto di una city car. Prima dell\'acquisto verifica i consumi reali del modello specifico e il costo medio di manutenzione per anno, così il budget familiare non ha sorprese.',
        ],
      },
      {
        heading: 'Il valore che conta: confronta prima di scegliere',
        paragraphs: [
          'I 7 posti usati si svalutano in modo molto diverso: i modelli più richiesti (Kodiaq, Touran) tengono bene il valore, quelli meno desiderati si possono trovare a prezzi molto bassi ma con costi di gestione più alti. Verifica il prezzo medio di mercato dei modelli che ti interessano e confrontali: la differenza di prezzo tra due 7 posti equivalenti può superare i 5.000 €.',
        ],
      },
    ],
    cta: 'valutazione-auto',
  },
  {
    slug: 'auto-usate-pendolari-autostrada',
    title: 'Auto usate per pendolari e autostrada: quale scegliere',
    description:
      'Chilometri tutti i giorni? Le caratteristiche giuste per un\'auto da pendolare: consumi reali in autostrada, comfort, affidabilità e quale motore conviene davvero.',
    published: '2026-08-11',
    category: 'acquisto',
    sections: [
      {
        heading: 'L\'auto del pendolare è un\'altra cosa',
        paragraphs: [
          'Chi percorre 20.000–40.000 km l\'anno per lavoro ha esigenze specifiche: consumi bassi a velocità di crociera, comfort sui lunghi tragitti, sedili che non stancano, affidabilità che non fa restare a piedi e costi di manutenzione prevedibili. Scegliere un\'auto "da città" per fare autostrada ogni giorno è il primo errore.',
          'I dati che contano: consumo a 120–130 km/h, dotazione di comfort (cruise control, sedili regolabili), livello di rumorosità e cilindrata adeguata al carico.',
        ],
      },
      {
        heading: 'Quale motore per chi fa autostrada',
        paragraphs: [
          'Il motore è la scelta più importante:',
        ],
        list: [
          'Diesel: ancora il re dei lunghi tragitti: consuma poco a velocità costante e ha coppia per le riprese. Sulle usate di 5+ anni i prezzi sono scesi molto per via dei blocchi urbani, ma fuori città il vantaggio resta.',
          'Benzina turbo (1.0–1.5 TSI e simili): consumi buoni in extraurbano, più semplici e meno costosi da mantenere: ottima scelta sotto i 25.000 km/anno.',
          'Ibrida non plug-in: comoda e parsimoniosa, ma in autostrada il vantaggio si assottiglia: si comporta come una benzina.',
          'Elettrica: sensata solo con percorrenze pianificate e ricarica disponibile a entrambe le estremità del tragitto.',
        ],
      },
      {
        heading: 'I modelli giusti da valutare sull\'usato',
        paragraphs: [
          'Per il pendolarismo autostradale questi modelli usati sono tra i più sensati:',
        ],
        list: [
          'Skoda Octavia: spazio, comfort e consumi contenuti, riferimento assoluto del segmento.',
          'Volkswagen Golf: meccanica collaudata, assistenza ovunque, motori TSI e TDI di lunga storia.',
          'Toyota Corolla ibrida: affidabilità eccellente e consumi bassi, con terza generazione di ibrida ormai matura.',
          'Audi A3 e BMW Serie 1: comfort superiore e buoni consumi, ma con ricambi e manutenzione premium.',
          'Ford Focus e Peugeot 308: piattaforme collaudate, prezzi usato spesso competitivi.',
        ],
      },
      {
        heading: 'Cosa controllare su un\'auto da pendolare usata',
        paragraphs: [
          'Un\'auto usata per molti km l\'anno ha un\'usura particolare:',
        ],
        list: [
          'Chilometraggio coerente: 30.000 km/anno sono normali per un pendolare: verifica con le revisioni.',
          'Usura di sedile guida, volante e pedali: alta con i km reali.',
          'Storico tagliandi: un pendolare serio ha la manutenzione in ordine: i tagliandi annuali sono la prova.',
          'Freni e pneumatici: su auto da 100.000+ km possono essere al limite: includi il costo di sostituzione nella trattativa.',
          'Distribuzione: su molti motori va fatta tra i 60.000 e i 120.000 km: verifica se è già stata fatta.',
        ],
      },
      {
        heading: 'Il calcolo del costo per chilometro',
        paragraphs: [
          'Per un pendolare, la differenza tra 5 e 7 litri/100 km vale centinaia di euro l\'anno: 25.000 km con 6 €/litro di risparmio sono 1.500 € di carburante. Controlla i consumi reali del modello (urbano, extraurbano e combinato) prima dell\'acquisto e confronta il costo annuo del carburante insieme al valore di mercato: è il modo più rapido per capire quale auto conviene davvero.',
        ],
      },
    ],
    cta: 'consumi-modello',
  },
  {
    slug: 'spie-cruscotto-significato-guida',
    title: 'Spie del cruscotto: significato di tutte le luci di avviso',
    description:
      'Spia motore, olio, batteria, ABS, pressione gomme: il significato di tutte le spie del cruscotto e cosa fare quando si accendono, senza farsi prendere dal panico.',
    published: '2026-08-11',
    category: 'manutenzione',
    sections: [
      {
        heading: 'Spie rosse, gialle e verdi: cosa cambia',
        paragraphs: [
          'Il colore della spia dice subito la gravità: le spie rosse indicano un problema che richiede di fermarsi subito (olio, freni, batteria); le gialle/ambra indicano un\'anomalia da controllare al più presto ma senza fermarsi di colpo; le verdi e blu sono informative (luci accese, cruise control attivo).',
          'Conoscere la differenza evita sia il panico ingiustificato sia la sottovalutazione di un problema serio.',
        ],
      },
      {
        heading: 'Le spie rosse: quando fermarsi subito',
        paragraphs: [
          'Queste spie richiedono attenzione immediata:',
        ],
        list: [
          'Spia olio (lattina): pressione olio insufficiente: spegni il motore subito e controlla il livello, altrimenti rischi il grippaggio.',
          'Spia freni (cerchio con punto esclamativo): livello liquido freni o freno a mano inserito: non guidare se il livello è basso.',
          'Spia batteria: l\'alternatore non carica: puoi proseguire brevemente, ma la batteria si scarica: dirigiti verso un\'officina.',
          'Spia temperatura (termometro): liquido di raffreddamento troppo caldo: fermati e lascia raffreddare, rischio di guarnizione testata.',
          'Spia serbatoio: ultimo livello carburante: per alcuni motori (diesel e GDI) guidare a secco danneggia l\'impianto.',
        ],
      },
      {
        heading: 'Le spie gialle: da controllare presto',
        paragraphs: [
          'Le spie ambra segnalano problemi che possono aspettare qualche giorno, non mesi:',
        ],
        list: [
          'Spia motore (motore stilizzato): anomalia al motore o alle emissioni: la più comune, i motivi vanno da una sonda ai gas di scarico a problemi più seri: una diagnosi con l\'auto diagnostico (30–50 €) chiarisce subito.',
          'Spia ABS: il sistema antibloccaggio è fuori uso: i freni funzionano ma senza ABS: non aspettare per l\'intervento.',
          'Spia pressione pneumatici (ferro di cavallo): gonfiaggio da verificare: spesso basta il gonfiaggio per spegnerla.',
          'Spia ESP/controllo stabilità: sistema disattivato o guasto: controlla il pulsante prima di pensare al guasto.',
          'Spia AIRBAG: gli airbag sono disattivati: va riparato al più presto per ragioni di sicurezza.',
        ],
      },
      {
        heading: 'Le spie verdi e blu: niente paura',
        paragraphs: [
          'Le spie verdi (fari, luci di posizione, abbaglianti blu, cruise control, frenata rigenerativa sulle ibride) informano su funzioni attive: non richiedono interventi. Se una spia verde resta accesa quando la funzione è disattivata, può essere un\'anomalia del sensore: da verificare in officina.',
        ],
      },
      {
        heading: 'Cosa fare quando si accende una spia',
        paragraphs: [
          'La regola d\'oro: non ignorare mai una spia, ma non farti neanche prendere dal panico. Se è rossa, fermati in sicurezza e controlla il manuale; se è gialla, prenota una diagnosi al più presto. La diagnosi computerizzata in officina (o con un adattatore OBD da 20–40 €) legge il codice di errore e dice esattamente cosa cercare.',
          'E ricorda: sulle auto usate, una spia che resta accesa dopo l\'acquisto è un motivo valido per rientrare nella garanzia se l\'acquisto è avvenuto da un professionista.',
        ],
      },
    ],
    cta: 'costi-riparazione',
  },
  {
    slug: 'quanto-durano-freni-auto',
    title: 'Freni auto: quanto durano pastiglie e dischi, quando cambiarli',
    description:
      'Pastiglie e dischi freno: durata in km, segnali di usura, costi di sostituzione e come capire quando è il momento di cambiarli prima che sia tardi.',
    published: '2026-08-11',
    category: 'manutenzione',
    sections: [
      {
        heading: 'Quanto durano davvero i freni',
        paragraphs: [
          'La durata dei freni dipende da tre fattori: stile di guida, tipo di percorso e peso dell\'auto. In linea di massima le pastiglie anteriori durano 30.000–50.000 km, i dischi anteriori 50.000–80.000 km, e dietro si arriva spesso al doppio perché lavorano meno.',
          'Un\'ibrida con frenata rigenerativa può triplicare la durata delle pastiglie: l\'elettrico frena al posto dei dischi. Al contrario, la guida in città con frenate continue consuma i freni molto più dell\'autostrada.',
        ],
      },
      {
        heading: 'I segnali che i freni sono a fine vita',
        paragraphs: [
          'I sintomi più comuni di pastiglie o dischi usurati:',
        ],
        list: [
          'Sfregamento metallico in frenata: il classico "fischio" quando le pastiglie toccano il limite.',
          'Spia freni accesa: molte auto hanno un sensore di usura che accende la spia.',
          'Vibrazione al volante in frenata: tipico di dischi deformati (per surriscaldamento o usura).',
          'Auto che tira da un lato in frenata: possibile usura irregolare o pinza bloccata.',
          'Percorso di frenata più lungo: se l\'auto "non frena come prima", controlla subito.',
        ],
      },
      {
        heading: 'Quanto costa sostituirli',
        paragraphs: [
          'I costi indicativi sul mercato italiano per un\'auto di segmento medio:',
        ],
        list: [
          'Pastiglie anteriori (solo materiale e manodopera): 120–250 € per asse.',
          'Dischi + pastiglie anteriori: 250–500 € per asse.',
          'Freni posteriori: 20–30% in meno per l\'asse.',
          'Su segmenti premium o con freni sportivi (carboceramici), i costi possono triplicare: verifica sempre il prezzo per il tuo modello specifico.',
        ],
      },
      {
        heading: 'Come controllare l\'usura da solo',
        paragraphs: [
          'Alcuni controlli puoi farli da solo: guarda attraverso i raggi del cerchio lo spessore delle pastiglie (sotto i 3–4 mm di ferodo sono da cambiare), ascolta rumori in frenata e senti eventuali vibrazioni al volante. Se la spia freni si accende, non rimandare: la sostituzione è quasi sempre già "scaduta".',
        ],
      },
      {
        heading: 'I freni sull\'usato: prima dell\'acquisto',
        paragraphs: [
          'Quando compri un\'usata, ispeziona i freni: un\'auto con 50.000 km che ha già i dischi al limite ha un costo nascosto di 300–500 €. Usa questo dato nella trattativa: sapere che i freni sono da fare è un argomento concreto per abbassare il prezzo, e la stima del costo di sostituzione del tuo modello specifico ti dà la cifra esatta.',
        ],
      },
    ],
    cta: 'costi-riparazione',
  },
  {
    slug: 'ammortizzatori-auto-quando-cambiarli',
    title: 'Ammortizzatori auto: quando cambiarli e quanto costano',
    description:
      'Ammortizzatori usurati: segnali, durata in km, costi di sostituzione e perché guidare con sospensioni a fine vita è pericoloso oltre che scomodo.',
    published: '2026-08-11',
    category: 'manutenzione',
    sections: [
      {
        heading: 'Cosa fanno gli ammortizzatori',
        paragraphs: [
          'Gli ammortizzatori controllano le oscillazioni delle sospensioni: tengono le ruote a contatto con l\'asfalto, garantiscono stabilità in curva e frenata e filtrano le buche. Usurati, allungano lo spazio di frenata, destabilizzano l\'auto in curva e rendono il viaggio scomodo.',
          'Il problema è che si usurano gradualmente: chi guida ogni giorno non se ne accorge finché il degrado non è avanzato.',
        ],
      },
      {
        heading: 'Quando vanno cambiati',
        paragraphs: [
          'Non esiste una scadenza fissa, ma ci sono parametri di riferimento:',
        ],
        list: [
          'In genere tra 80.000 e 120.000 km, o dopo 6–8 anni: la taratura decade anche senza km (guarnizioni, olio interno).',
          'Se noti l\'auto che "rimbalza" sulle buche o che si assesta con più oscillazioni del normale.',
          'In frenata: se il muso "tuffa" in modo eccessivo o l\'auto sembra instabile.',
          'Usura irregolare dei pneumatici: un segno tipico di ammortizzatori a fine vita.',
          'Rumori dalle sospensioni su dossi (oltre ai silent block).',
        ],
      },
      {
        heading: 'Il costo della sostituzione',
        paragraphs: [
          'La sostituzione si fa sempre per asse (entrambi gli ammortizzatori anteriori o posteriori insieme):',
        ],
        list: [
          'Segmento piccolo: 200–350 € per asse, ammortizzatori e manodopera.',
          'Segmento medio: 300–500 € per asse.',
          'SUV e segmenti superiori: 400–800 € per asse (alcuni richiedono taratura elettronica).',
          'Auto con sospensioni adattive o aria: i costi salgono sensibilmente: verifica il preventivo sul tuo modello specifico.',
        ],
      },
      {
        heading: "Il test semplice che puoi fare da solo",
        paragraphs: [
          'Premi con forza sul cofano dell\'auto ferma e rilascia: se l\'auto torna su e rimbalza più di una volta e mezza prima di assestarsi, gli ammortizzatori sono probabilmente usurati. È un test indicativo: la verifica definitiva si fa in officina con il banco prova o l\'ispezione visiva delle perdite d\'olio.',
        ],
      },
      {
        heading: 'Ammortizzatori e acquisto usato',
        paragraphs: [
          'Su un\'usata di 100.000+ km, la condizione delle sospensioni è un punto di trattativa reale: la sostituzione di un asse costa 300–800 €. Controlla anche i silent block e i bracci delle sospensioni, che con gli anni diventano fonte di rumori. Conoscere i costi di riparazione del modello specifico ti permette di fare un\'offerta corretta senza sorprese dopo l\'acquisto.',
        ],
      },
    ],
    cta: 'costi-riparazione',
  },
  {
    slug: 'ruggine-auto-come-riconoscerla',
    title: 'Ruggine sull\'auto: come riconoscerla, trattarla e prevenire',
    description:
      'Ruggine su sottoscocca, passaruota e portiere: come riconoscerla nelle fasi iniziali, come fermarla e quanto costa intervenire prima che svaluti l\'auto.',
    published: '2026-08-11',
    category: 'manutenzione',
    sections: [
      {
        heading: 'Perché la ruggine è il nemico più silenzioso',
        paragraphs: [
          'La ruggine parte quasi sempre da un punto invisibile: un graffio, un sassolino che ha scavato la vernice, la salatura delle strade invernali o l\'umidità che ristagna tra le lamiere. Non fa rumore, non accende spie, ma nel giro di anni può compromettere la struttura e tagliare drasticamente il valore dell\'auto.',
          'Riconoscerla presto è la differenza tra un intervento da 100–300 € e una carrozzeria da migliaia di euro.',
        ],
      },
      {
        heading: 'Le zone più colpite da controllare',
        paragraphs: [
          'La ruggine non si distribuisce a caso: attacca prima le zone più esposte:',
        ],
        list: [
          'Passaruota: dove sabbia, sale e umidità si accumulano.',
          'Sottoscocca e longheroni: la zona più critica per la struttura.',
          'Bordi delle portiere e del cofano: dove la piega della lamiera espone il metallo.',
          'Montanti e raccordi dei parafanghi.',
          'Zone dietro i paraurti e i fascioni, dove la vernice si scrosta per i sassolini.',
          'Bassofondo del bagagliaio e sedi delle cerniere.',
        ],
      },
      {
        heading: 'Come riconoscerla nelle fasi iniziali',
        paragraphs: [
          'Le fasi della ruggine:',
        ],
        list: [
          'Bolle sotto la vernice: piccole protuberanze sulla superficie: la corrosione è già partita sotto.',
          'Scrostamenti con alone rossastro: la lamiera è esposta e sta ossidando.',
          'Punti marroni sulla vernice (ruggine "di superficie"): deriva spesso da residui ferrosi: spesso rimovibile con una lucidatura.',
          'Sotto l\'auto: cercala con una torcia su longheroni, bracci e punti di saldatura: è la più pericolosa perché invisibile dall\'alto.',
        ],
      },
      {
        heading: 'Come trattarla e quanto costa',
        paragraphs: [
          'Il trattamento dipende dallo stadio:',
        ],
        list: [
          'Ruggine superficiale: carteggiatura, antiruggine e ritocco vernice: 50–150 € per punto.',
          'Bolle sotto la vernice: carteggiatura fino al metallo, trattamento, stuccatura e verniciatura: 150–400 € a pannello.',
          'Ruggine penetrata (fori): richiede saldatura e verniciatura: da 500 € a migliaia, e spesso non è più un intervento conveniente.',
          'Trattamento antiruggine preventivo su auto nuove o appena acquistate: 300–800 € e vale anni di protezione.',
        ],
      },
      {
        heading: 'Prevenzione: le regole che funzionano',
        paragraphs: [
          'Garage o comunque riparo quando possibile, lavaggio regolare in inverno (soprattutto del sottoscocca, dove il sale si accumula), controllo e trattamento immediato di graffi e sassolini, e un giro annuale di controllo del sottoscocca: in officina basta un sollevatore e una torcia.',
        ],
      },
      {
        heading: 'La ruggine al momento dell\'acquisto',
        paragraphs: [
          'Quando valuti un\'usata, la ruggine è un argomento di trattativa concreto: bolle sui pannelli o ruggine sul sottoscocca meritano uno sconto pari al costo del trattamento (e oltre, se la struttura è coinvolta). Un\'auto con 10+ anni usata in zone umide o costiere va ispezionata con attenzione: la carrozzeria compromessa riduce il valore in modo molto più marcato della sola meccanica.',
        ],
      },
    ],
    cta: 'costi-riparazione',
  },
  {
    slug: 'catene-neve-obbligatorie-legge',
    title: 'Catene da neve e gomme invernali: cosa dice la legge',
    description:
      'Quando sono obbligatorie le catene da neve o le gomme invernali, dove scatta l\'obbligo, multe e sanzioni, e come scegliere tra catene, calze e pneumatici 4 stagioni.',
    published: '2026-08-11',
    category: 'manutenzione',
    sections: [
      {
        heading: 'L\'obbligo invernale: cosa prevede la legge',
        paragraphs: [
          'In Italia, dal 15 novembre al 15 aprile (con proroghe per le zone alpine), chi circola su strade con ordinanza di obbligo deve avere o pneumatici invernali (M+S con codice 3PMSF) o catene a bordo: basta una delle due. L\'obbligo vale per tutti i veicoli: auto, furgoni e moto.',
          'La norma di riferimento è l\'art. 6 del Codice della Strada con le ordinanze dei singoli enti: ogni provincia emana le proprie ordinanze, ma il periodo standard è lo stesso ovunque.',
        ],
      },
      {
        heading: 'Dove scatta l\'obbligo',
        paragraphs: [
          'L\'obbligo non vale ovunque, ma su tutte le strade in cui un\'ordinanza lo prevede:',
        ],
        list: [
          'Valichi e strade di montagna con ordinanza specifica.',
          'Strade extraurbane segnalate con l\'apposito pannello "catene a bordo obbligatorie".',
          'Autostrade e tangenziali delle regioni alpine e appenniniche (Piemonte, Valle d\'Aosta, Lombardia, Trentino, Alto Adige, Veneto, Friuli e altre).',
          'Alcune città e centri storici in caso di nevicate: controlla le ordinanze locali.',
        ],
      },
      {
        heading: 'Multe e sanzioni',
        paragraphs: [
          'Circolare su una strada con obbligo attivo senza gomme invernali né catene a bordo comporta:',
        ],
        list: [
          'Multa da 87 a 344 € (se la strada è extraurbana), ridotta del 30% se pagata entro 5 giorni.',
          'In caso di violazione in presenza di neve: può essere disposto anche il fermo del veicolo finché non viene messo in regola.',
          'La multa è personale: vale per il conducente, non per il proprietario.',
        ],
      },
      {
        heading: 'Catene, calze o gomme invernali?',
        paragraphs: [
          'La scelta dipende dal tuo uso:',
        ],
        list: [
          'Gomme invernali: la soluzione migliore se guidi spesso in montagna o con freddo intenso: tenuta superiore sotto i 7 °C, ma da montare tra novembre e aprile.',
          'Gomme 4 stagioni: un compromesso per chi guida prevalentemente in pianura e vuole una sola soluzione tutto l\'anno (certificate M+S e 3PMSF valgono per l\'obbligo).',
          'Catene da neve: obbligatorie da avere a bordo, fondamentali per le emergenze: in acciaio (robuste) o a rombo (più facili da montare), costano 50–150 €.',
          'Calze da neve: adatte solo a neve leggera e a bassa velocità: non sempre accettate dalle ordinanze: verifica prima.',
        ],
      },
      {
        heading: 'Consigli pratici per l\'inverno',
        paragraphs: [
          'Controlla lo stato e il battistrada delle gomme prima della stagione fredda (il limite legale è 1,6 mm ma sotto i 3 mm la tenuta sulla neve cala molto), monta le invernali su tutte e quattro le ruote (mai solo due), e tieni in auto il giubbotto riflettente e una pala per l\'emergenza.',
          'E ricorda: le gomme invernali non sono un\'opzione solo di sicurezza: sono anche una condizione legale sulle strade con obbligo, con multe che partono da 87 €.',
        ],
      },
    ],
    cta: 'revisione-auto',
  },
  {
    slug: 'donazione-auto-costi-procedura',
    title: 'Donazione di un\'auto: costi, documenti e procedure',
    description:
      'Come donare un\'auto a un familiare: costi, documenti necessari, passaggio di proprietà e quando conviene la donazione invece della vendita simbolica.',
    published: '2026-08-11',
    category: 'vendita',
    sections: [
      {
        heading: 'Cos\'è la donazione di un\'auto',
        paragraphs: [
          'La donazione è un atto con cui trasferisci la proprietà dell\'auto a un\'altra persona senza corrispettivo economico. È la soluzione tipica tra genitori e figli (prima auto per i neopatentati) o tra coniugi: permette di intestare il veicolo a chi lo usa davvero.',
          'Come ogni atto che trasferisce la proprietà, richiede il passaggio di proprietà al PRA: il passaggio è obbligatorio, non può essere "rimandato a voce".',
        ],
      },
      {
        heading: 'Quanto costa donare un\'auto',
        paragraphs: [
          'I costi della donazione sono simili a quelli di una vendita:',
        ],
        list: [
          'Imposta provinciale di trascrizione (IPT): 150–650 € a seconda della provincia.',
          'Diritti PRA per la pratica telematica: circa 27 €.',
          'Compenso dell\'agenzia di pratiche auto (se non la fai da solo): 50–150 €.',
          'Imposta di donazione: in genere non si paga tra parenti stretti (franchigia molto alta), ma verifica sempre con un professionista per il tuo caso.',
          'Tassa di bollo sui documenti, quando prevista.',
        ],
      },
      {
        heading: 'I documenti necessari',
        paragraphs: [
          'Per la donazione servono gli stessi documenti di un passaggio normale:',
        ],
        list: [
          'Certificato di proprietà (CDP) e libretto di circolazione firmati dal donante.',
          'Documento di identità e codice fiscale di donante e donatario.',
          'Visura PRA per verificare l\'assenza di fermi amministrativi e ipoteche.',
          'Eventuale procura se una delle parti non può presentarsi.',
          'Se serve, la dichiarazione di non parentela (per il trattamento fiscale) con i dati anagrafici.',
        ],
      },
      {
        heading: 'Donazione o vendita simbolica?',
        paragraphs: [
          'Molti "vendono" l\'auto a un euro ai familiari per risparmiare: è una pratica diffusa, ma attenzione: se il valore reale è diverso dal prezzo dichiarato, l\'Agenzia delle Entrate può riqualificare l\'operazione come donazione e applicare le imposte del caso.',
          'La donazione formale, invece, ha una disciplina fiscale chiara: tra coniugi e parenti in linea retta (figli, genitori) le agevolazioni rendono il costo quasi sempre inferiore a una vendita reale.',
        ],
      },
      {
        heading: 'Il passaggio che completa l\'operazione',
        paragraphs: [
          'Dopo la firma della pratica, il passaggio di proprietà va formalizzato entro 30 giorni: dal momento della trascrizione, il donatario è il proprietario a tutti gli effetti e gli passano anche bollo, assicurazione e responsabilità. Controlla che la revisione sia valida prima di donare e valuta sempre il valore di mercato dell\'auto: ti serve per impostare correttamente la pratica e per evitare contestazioni fiscali.',
        ],
      },
    ],
    cta: 'valutazione-auto',
  },
  {
    slug: 'auto-ereditata-cosa-fare',
    title: 'Auto ereditata: successione, passaggio di proprietà e bollo',
    description:
      'Cosa fare quando si eredita un\'auto: dichiarazione di successione, passaggio di proprietà, bollo, assicurazione e tutte le scadenze da non perdere.',
    published: '2026-08-11',
    category: 'vendita',
    sections: [
      {
        heading: 'I passaggi da fare in ordine',
        paragraphs: [
          'Ereditare un\'auto non è complicato ma ha scadenze precise: la successione (la dichiarazione dell\'eredità) va presentata entro 12 mesi dal decesso, e il passaggio di proprietà al PRA va fatto entro 60 giorni dal momento in cui il veicolo entra nel patrimonio ereditario.',
          'Finché il passaggio non è fatto, il veicolo resta intestato al defunto: guidarlo così è irregolare e rischia sanzioni.',
        ],
      },
      {
        heading: 'La dichiarazione di successione',
        paragraphs: [
          'La successione si presenta all\'Agenzia delle Entrate con il modello 4 (o 5): in essa va indicata anche l\'auto, con il suo valore di mercato. Per gli eredi in linea retta (figli, coniuge) l\'imposta di successione non si paga fino a franchigie elevate: nella maggior parte dei casi l\'unico costo è la pratica.',
          'Se il valore dell\'auto supera la franchigia, l\'imposta è del 4% (eredi in linea retta) sul valore eccedente: la valutazione corretta dell\'auto è quindi un dato concreto da non improvvisare.',
        ],
      },
      {
        heading: 'Il passaggio di proprietà agli eredi',
        paragraphs: [
          'Una volta fatta la successione, il passaggio di proprietà segue la procedura standard:',
        ],
        list: [
          'Costi: IPT provinciale (150–650 €) + diritti PRA (circa 27 €) + eventuale agenzia (50–150 €).',
          'Documenti: certificato di proprietà, libretto, atto di successione o attestazione dell\'eredità.',
          'Per le eredità tra familiari stretti, in molte province l\'IPT è ridotta: verifica con l\'agenzia di pratiche.',
          'Il passaggio va fatto entro 60 giorni dal momento in cui l\'auto entra nell\'eredità.',
        ],
      },
      {
        heading: 'Bollo, assicurazione e revisione',
        paragraphs: [
          'Il bollo: se il defunto aveva già pagato per l\'anno, l\'erede non paga fino alla scadenza; altrimenti il bollo va pagato pro-quota. L\'assicurazione: la polizza va riallineata immediatamente (l\'erede può subentrare o stipularne una nuova): guidare un\'auto ereditata senza assicurazione è una violazione grave.',
          'Controlla anche la revisione: se è scaduta o in scadenza, va rinnovata prima di circolare, e se non passa, la riparazione è a carico dell\'erede: includila nei costi.',
        ],
      },
      {
        heading: 'Tenere o vendere?',
        paragraphs: [
          'Se l\'auto non ti serve o è troppo vecchia per il tuo uso, puoi venderla subito: in quel caso il valore di mercato va comunque dichiarato in successione, e la vendita successiva segue le normali regole. Il consiglio pratico: verifica prima il valore reale di mercato del modello e anno, ti serve sia per la dichiarazione di successione sia per capire se conviene tenerla, venderla o rottamarla.',
        ],
      },
    ],
    cta: 'valutazione-auto',
  },
  {
    slug: 'come-pagare-auto-usata-sicurezza',
    title: 'Come pagare un\'auto usata in sicurezza: metodi e trucchi',
    description:
      'Bonifico, assegno circolare, contanti o agenzia: i metodi di pagamento sicuri per comprare un\'auto usata da privato, gli acconti da evitare e le regole anti-truffa.',
    published: '2026-08-11',
    category: 'acquisto',
    sections: [
      {
        heading: 'La regola d\'oro: si paga dopo, non prima',
        paragraphs: [
          'La regola che elimina la maggior parte delle truffe è una sola: il pagamento avviene quando l\'operazione è completa, cioè a passaggio di proprietà fatto (o contestualmente, in agenzia di pratiche, davanti al professionista che firma la pratica). Chi chiede acconti "per riservare l\'auto", per "spese di spedizione" o verso conti esteri sta quasi certamente truffando.',
          'Un venditore serio non ha fretta di incassare prima che tu veda, provi e verifichi l\'auto.',
        ],
      },
      {
        heading: 'I metodi di pagamento sicuri',
        paragraphs: [
          'I metodi consigliati, in ordine di sicurezza:',
        ],
        list: [
          'Bonifico bancario: tracciato, verificabile e con la possibilità di recuperare i fondi in caso di frode denunciata: il metodo più usato e consigliato.',
          'Assegno circolare: emesso dalla banca a nome del venditore: il pagamento è garantito dalla banca stessa (verifica che sia non trasferibile e intestato correttamente).',
          'Pagamento in agenzia di pratiche auto: ti occupi del passaggio e paghi lì, di fronte al professionista: la soluzione più protetta per entrambe le parti.',
          'Contanti: possibile entro i limiti di legge, ma senza tracciabilità: sconsigliato sopra poche migliaia di euro.',
        ],
      },
      {
        heading: 'Gli acconti: quando sono leciti',
        paragraphs: [
          'Un piccolo acconto (5–10%) può essere lecito se firmate un compromesso scritto che vincola il venditore, ma è sempre un rischio: prima di qualsiasi anticipo devi aver visto l\'auto, fatto la prova su strada, verificato i documenti e la visura PRA.',
          'Le richieste tipiche delle truffe sono: acconto immediato per "tenere il prezzo", bonifici verso carte prepagate o conti esteri, pagamento tramite servizi di trasferimento istantaneo non tracciabili, o acquisti "a distanza" con sole foto.',
        ],
      },
      {
        heading: 'Le verifiche da fare prima di pagare',
        paragraphs: [
          'Prima di trasferire un euro:',
        ],
        list: [
          'Verifica la visura PRA: nessun fermo, ipoteca o pignoramento sull\'auto.',
          'Controlla che targa, telaio e libretto coincidano con l\'auto che hai davanti.',
          'Fai la prova su strada e controlla lo stato reale (o l\'analisi visiva con una foto).',
          'Verifica il valore medio di mercato: un prezzo molto sotto la media è un campanello d\'allarme.',
          'Scrivi un documento di vendita completo, firmato da entrambi, con prezzo e dati del veicolo.',
        ],
      },
      {
        heading: 'E se qualcosa va storto?',
        paragraphs: [
          'Se hai pagato e l\'auto non ti è stata consegnata o non corrisponde a quanto dichiarato, denuncia subito: bonifici e assegni circolari sono tracciabili, e la querela alla polizia postale o alle forze dell\'ordine può bloccare i fondi. Conserva sempre ricevute, conversazioni e annunci: sono le prove che fanno la differenza.',
        ],
      },
    ],
    cta: 'controllo-usato',
  },
  {
    slug: 'come-leggere-libretto-di-circolazione',
    title: 'Come leggere il libretto di circolazione: tutte le voci',
    description:
      'Libretto di circolazione: significato di tutte le voci (voci tecniche, classi Euro, pesi, potenza) e come verificare che i dati corrispondano all\'auto prima dell\'acquisto.',
    published: '2026-08-11',
    category: 'acquisto',
    sections: [
      {
        heading: 'Cos\'è il libretto di circolazione',
        paragraphs: [
          'Il libretto di circolazione (oggi Carta di Circolazione, in molti casi unificata nel Documento Unico con il certificato di proprietà) è il documento che identifica il veicolo e ne descrive le caratteristiche tecniche e legali. È il primo documento da leggere quando valuti un\'auto usata: quasi tutte le incoerenze si scoprono lì.',
          'Le voci del libretto seguono una numerazione standard europea (voci A, B, C...): conoscerle ti permette di verificare in due minuti se l\'auto corrisponde a quanto dichiarato.',
        ],
      },
      {
        heading: 'Le voci di identificazione del veicolo',
        paragraphs: [
          'Le voci principali da controllare per identificare l\'auto:',
        ],
        list: [
          'A: targa del veicolo: deve coincidere con quella montata sull\'auto.',
          'B: data di prima immatricolazione: da lì partono età, garanzia e svalutazione.',
          'C.1 e C.1.a: cognome e nome del proprietario: verifica che sia il venditore (o il concessionario).',
          'E: numero di telaio (VIN): il controllo più importante: deve combaciare con quello stampigliato sul veicolo.',
          'D.1 e D.2: marca e tipo: la denominazione commerciale del modello.',
        ],
      },
      {
        heading: 'Le voci tecniche che contano',
        paragraphs: [
          'Le voci tecniche dicono com\'è fatta l\'auto:',
        ],
        list: [
          'P.1: cilindrata (cm³).',
          'P.2: potenza in kW: da verificare anche per superbollo (oltre 185 kW) e limiti neopatentati.',
          'P.3: tipo di alimentazione: benzina, diesel, ibrida, elettrica, GPL, metano.',
          'V.9: classe Euro di omologazione: decide accessi a ZTL e blocchi del traffico.',
          'F.1/F.2: massa massima e a vuoto: per il rapporto potenza/peso dei neopatentati e per i carichi.',
          'Q: rapporto potenza/massa, utile per le verifiche di legge.',
        ],
      },
      {
        heading: 'Le verifiche incrociate da fare prima dell\'acquisto',
        paragraphs: [
          'Il libretto non basta da solo: va incrociato con l\'auto fisica e con la visura:',
        ],
        list: [
          'Confronta il VIN del libretto (voce E) con quello stampigliato su cruscotto, montante e vano motore.',
          'Verifica che la targa montata corrisponda alla voce A.',
          'Controlla che la cilindrata e la potenza corrispondano al modello dichiarato: alterazioni possibili su allestimenti e motori.',
          'Confronta la classe Euro (V.9) con l\'anno di immatricolazione: incoerenze possibili su auto importate.',
          'Occhio a documenti "rifatti" o danneggiati: un libretto recentemente ristampato va verificato con la visura.',
        ],
      },
      {
        heading: 'Perché il libretto incide sul valore',
        paragraphs: [
          'Le voci del libretto determinano valore e costi: la classe Euro incide su circolazione e prezzo di rivendita, la potenza su bollo e superbollo, l\'alimentazione su incentivi e limiti. Prima di valutare o comprare, leggi il libretto insieme ai dati di mercato: un\'auto con classe Euro bassa o potenza che comporta superbollo può costare più di quanto sembri.',
        ],
      },
    ],
    cta: 'controllo-usato',
  },
  {
    slug: 'start-stop-come-funziona-problemi',
    title: 'Start&Stop: come funziona, a cosa serve e problemi comuni',
    description:
      'Il sistema Start&Stop spegne il motore in sosta per risparmiare carburante: come funziona, quando si disattiva, problemi comuni e perché serve una batteria dedicata.',
    published: '2026-08-11',
    category: 'manutenzione',
    sections: [
      {
        heading: 'Cos\'è e come funziona lo Start&Stop',
        paragraphs: [
          'Lo Start&Stop spegne automaticamente il motore quando l\'auto si ferma (semaforo, traffico, sosta breve) e lo riaccende quando rilasci il freno o premi la frizione. Lo scopo è evitare il consumo di carburante a motore acceso da fermo: nelle percorrenze urbane può far risparmiare il 5–10% di carburante.',
          'Il sistema è presente sulla maggior parte delle auto moderne a benzina e diesel: l\'avviamento è gestito da un motorino rinforzato o da un generatore-starter (BSG) e da una batteria dedicata.',
        ],
      },
      {
        heading: 'Quando NON si attiva',
        paragraphs: [
          'Lo Start&Stop è intelligente: si disattiva da solo quando le condizioni non sono ideali:',
        ],
        list: [
          'Batteria carica sotto una certa soglia: il sistema la protegge non spegnendo il motore.',
          'Temperatura motore non ottimale: motore freddo o troppo caldo.',
          'Clima in funzione con richiesta massima: per non compromettere l\'aria condizionata.',
          'Pendenza rilevante: per evitare di ripartire in salita a motore spento.',
          'Parabrezza in sbrinamento o spia di funzione attiva.',
          'In alcune auto con cambio manuale: se non premi la frizione a fondo.',
        ],
      },
      {
        heading: 'La batteria dedicata: l\'errore più comune',
        paragraphs: [
          'Le auto con Start&Stop hanno bisogno di una batteria speciale (EFB o AGM), più resistente ai cicli di scarica continui. Sostituirla con una batteria normale economica è l\'errore più diffuso: la batteria standard si degrada in pochi mesi e lo Start&Stop smette di funzionare.',
          'I costi: una batteria EFB costa 100–180 €, una AGM 150–300 €, montaggio incluso. Sull\'usato, verifica sempre l\'età e il tipo di batteria: una batteria vecchia è un costo immediato da mettere in conto.',
        ],
      },
      {
        heading: 'Problemi e falsi miti',
        paragraphs: [
          'I problemi più comuni segnalati dai proprietari:',
        ],
        list: [
          'Start&Stop che non si attiva mai: quasi sempre batteria in declino o soglia non raggiunta.',
          'Spegnimenti bruschi o riavvii tardivi: possibili problemi al motorino di avviamento o al sensore.',
          'Vibrazioni all\'avviamento: motorino di avviamento rinforzato usurato (costo 200–500 €).',
          'Falso mito: "consuma più di quanto risparmia" — non è vero nei cicli urbani reali, dove il risparmio è misurato e documentato.',
          'Falso mito: "spegne il motore in modo dannoso" — i motori moderni sono progettati per migliaia di cicli di avviamento.',
        ],
      },
      {
        heading: 'Come conviverci al meglio',
        paragraphs: [
          'Se il sistema ti infastidisce, quasi tutte le auto hanno un pulsante per disattivarlo (va ripetuto a ogni avvio): disattivarlo non è dannoso, ma rinunci al risparmio. In città, invece, lascialo attivo: nei percorsi stop-and-go è il modo più semplice per ridurre i consumi senza cambiare nulla.',
        ],
      },
    ],
    cta: 'costi-riparazione',
  },
  {
    slug: 'auto-non-parte-cosa-fare',
    title: 'L\'auto non parte: cause, diagnosi e soluzioni',
    description:
      'Auto che non si avvia? Le cause più comuni (batteria, motorino, candele, chiave) e cosa fare: cavi, booster, spinta e quando chiamare il soccorso stradale.',
    published: '2026-08-11',
    category: 'manutenzione',
    sections: [
      {
        heading: 'Il primo ascolto: cosa fa l\'auto quando giri la chiave',
        paragraphs: [
          'Il comportamento dell\'auto all\'avvio dice già molto sulla causa:',
        ],
        list: [
          'Niente di niente, quadro spento: batteria completamente scarica, morsetti corrosi o contatto della chiave.',
          'Clic, clic, clic (senza giro motore): batteria quasi scarica o motorino di avviamento bloccato.',
          'Giro motore lento e faticoso: batteria in declino o troppo fredda.',
          'Gira veloce ma non parte: manca carburante, scintilla (candele) o c\'è un\'anomalia elettronica (spia motore).',
          'Parte e si spegne subito: possibili problemi di alimentazione, immobilitizzatore o chiave non riconosciuta.',
        ],
      },
      {
        heading: 'Batteria scarica: come avviare con i cavi',
        paragraphs: [
          'La causa più frequente è la batteria: ecco come procedere in sicurezza:',
        ],
        list: [
          'Parcheggia l\'auto "donatrice" vicino (senza che si tocchino) e spegni entrambi i motori.',
          'Collega il cavo rosso al polo positivo della batteria scarica e poi al positivo della donatrice.',
          'Collega il cavo nero al negativo della donatrice e poi a una massa metallica dell\'auto scarica (mai al polo negativo della batteria).',
          'Avvia la donatrice, aspetta 1–2 minuti, poi avvia l\'auto scarica.',
          'Togli i cavi in ordine inverso e tieni il motore acceso 15–20 minuti (o guida) per ricaricare.',
        ],
      },
      {
        heading: 'Alternative: booster, spinta e soccorso',
        paragraphs: [
          'I booster (batterie portatili tipo "power bank" per auto, 40–120 €) avviano l\'auto senza bisogno di un\'altra vettura: vanno caricati e conservati a bordo. La spinta funziona solo con cambio manuale: inserisci la seconda, premi la frizione, spingi e lascia la frizione quando prendi velocità.',
          'Se l\'auto non parte dopo i tentativi o il problema si ripete, non insistere: chiama il soccorso stradale (incluso in quasi tutte le polizze assicurative): il guasto può essere al motorino di avviamento, all\'alternatore o all\'elettronica.',
        ],
      },
      {
        heading: 'Perché non parte (causa non batteria)',
        paragraphs: [
          'Se la batteria è a posto ma l\'auto non parte:',
        ],
        list: [
          'Candele usurate o iniettori sporchi (benzina), candelette (diesel): costo 100–300 €.',
          'Pompa carburante in silenzio: senti il ronzio all\'accensione: se manca, è un guasto da officina.',
          'Immobilizzatore o chiave non riconosciuta: prova con la seconda chiave.',
          'Sensore di posizione (crankshaft) o centralina: richiede diagnosi elettronica.',
          'Spia motore accesa con mancato avvio: non forzare, meglio la diagnosi.',
        ],
      },
      {
        heading: 'Prevenzione: la batteria non muore per caso',
        paragraphs: [
          'Le batterie durano in media 4–6 anni: dopo i 4 anni i freddi invernali e le soste lunghe le mettono alla prova. Previeni: controlla i morsetti ogni tanto (se hanno il "bicarbonato" bianco, puliscili), evita di lasciare consumatori accesi a motore spento, e sui percorsi brevi ripetuti ricarica la batteria ogni tanto con un caricabatterie.',
          'Quando compri un\'usata, chiedi l\'età della batteria: una batteria vicina alla fine è un costo immediato di 100–300 € da scontare sul prezzo.',
        ],
      },
    ],
    cta: 'costi-riparazione',
  },
  {
    slug: 'auto-si-surriscalda-cosa-fare',
    title: 'L\'auto si surriscalda: cosa fare subito e cause',
    description:
      'Indicatore temperatura in rosso? Cosa fare per non rovinare il motore, le cause del surriscaldamento (liquido, termostato, ventola) e come prevenirlo.',
    published: '2026-08-11',
    category: 'manutenzione',
    sections: [
      {
        heading: 'La prima regola: fermarsi',
        paragraphs: [
          'Quando l\'indicatore della temperatura entra in zona rossa (o si accende la spia), la priorità assoluta è spegnere il motore e fermarsi in sicurezza: il surriscaldamento prolungato deforma la testata, rompe la guarnizione e può rovinare il motore in modo irreparabile (costi da 1.500 a 5.000+ €).',
          'Appena possibile, fermati al sicuro, spegni il motore e apri il cofano solo dopo che si è raffreddato: il vapore e il liquido bollente possono ustionare.',
        ],
      },
      {
        heading: 'Cosa NON fare assolutamente',
        paragraphs: [
          'Gli errori più pericolosi in caso di surriscaldamento:',
        ],
        list: [
          'Non aprire il tappo del radiatore a motore caldo: il liquido esce a pressione e scotta.',
          'Non versare acqua fredda sul motore caldo: lo shock termico può crepare le parti in ghisa.',
          'Non ripartire "per arrivare a casa" con la spia accesa: è il modo più rapido di rovinare il motore.',
          'Non ignorare l\'indicatore "perché è sempre stato così": a 110–120 °C il motore è già in sofferenza.',
        ],
      },
      {
        heading: 'Le cause più comuni',
        paragraphs: [
          'Dopo il raffreddamento, le cause tipiche del surriscaldamento:',
        ],
        list: [
          'Liquido di raffreddamento insufficiente: livello basso per perdite o evaporazione.',
          'Termostato bloccato chiuso: il liquido non circola verso il radiatore (costo 80–200 €).',
          'Ventola di raffreddamento non funzionante (fusibile, sensore, motore ventola).',
          'Pompa dell\'acqua usurata: perde o non spinge il liquido (costo 200–500 €).',
          'Radiatore intasato o ostruito (anche da detriti o insetti).',
          'Cinghia o catena di distribuzione in ritardo (raro ma grave).',
        ],
      },
      {
        heading: 'Come fare il rabbocco corretto',
        paragraphs: [
          'A motore completamente freddo, controlla il livello nel vaso di espansione e rabbocca con il liquido di raffreddamento specifico (mai acqua sola: il liquido protegge da corrosione e congelamento). Se il livello scende di nuovo in fretta, c\'è una perdita: cerca macchie sotto l\'auto e vapore dal motore.',
          'Regola pratica: una perdita di liquido non va mai "sistemata" con il solo rabbocco: ogni litro perso è una goccia di guasto che si sta allargando.',
        ],
      },
      {
        heading: 'Prevenzione sul lungo periodo',
        paragraphs: [
          'Il liquido di raffreddamento va sostituito secondo i tempi della casa (in genere ogni 4–6 anni o 60.000–100.000 km): con il tempo perde le proprietà anticorrosive. Controlla il livello almeno a ogni cambio stagione e, sull\'usato, verifica che lo storico dei tagliandi includa il cambio liquido: un\'auto che ha sempre usato acqua invece di liquido è un rischio noto.',
        ],
      },
    ],
    cta: 'costi-riparazione',
  },
  {
    slug: 'rumori-auto-diagnosi-significato',
    title: 'Rumori dell\'auto: cosa indicano e come diagnosticarli',
    description:
      'Fischi, ticchettii, stridori, sferragliamenti: il significato dei rumori dell\'auto, quando sono normali e quando richiedono un intervento in officina.',
    published: '2026-08-11',
    category: 'manutenzione',
    sections: [
      {
        heading: 'L\'auto parla: impariamo ad ascoltarla',
        paragraphs: [
          'I rumori sono il primo segnale di usura di un\'auto: saperli riconoscere permette di intervenire quando l\'intervento costa poco, invece che quando il guasto è ormai serio. La regola base: un rumore nuovo, che prima non c\'era, va sempre indagato.',
          'Annota quando appare il rumore: a freddo o a caldo, in frenata, in curva, a velocità costante o in accelerazione: è l\'informazione più utile per il meccanico.',
        ],
      },
      {
        heading: 'I rumori in frenata',
        paragraphs: [
          'I rumori quando premi il freno sono tra i più facili da interpretare:',
        ],
        list: [
          'Sfregamento metallico acuto: pastiglie a fine vita (il sensore metallico tocca il disco): sostituzione urgente.',
          'Stridio in frenata su auto ferma da poco (umidità/ruggine sui dischi): spesso normale, sparisce dopo poche frenate.',
          'Ticchettio ritmico in rotazione: pietra o corpo estraneo tra pastiglia e disco: controlla subito.',
          'Vibrazione al volante in frenata: dischi deformati: vanno rettificati o sostituiti.',
        ],
      },
      {
        heading: 'Rumori da motore e trasmissione',
        paragraphs: [
          'Sotto il cofano i rumori raccontano molto:',
        ],
        list: [
          'Ticchettio metallico a caldo: può essere il gioco delle valvole (normale su alcuni motori) o un problema di lubrificazione: controlla il livello olio.',
          'Fischio in accelerazione: spesso la cinghia (accessori o distribuzione) o il tenditore: va controllato, una cinghia rotta lascia a piedi.',
          'Fruscio o "soffio" dallo scarico: marmitta o collettore forati: costo 200–600 € secondo il pezzo.',
          'Stridio della cinghia a freddo: tipico della cinghia degli accessori usurata o bagnata: sparisce a caldo ma va sostituita.',
          'Rumore sordo in accelerazione in curva: possibile problema ai semiassi (giunti omocinetici).',
        ],
      },
      {
        heading: 'Rumori da sospensioni e sterzo',
        paragraphs: [
          'I rumori che arrivano dalle ruote o dalle sospensioni:',
        ],
        list: [
          'Rumore "scuotendo" su dossi e buche: silent block, bracci o ammortizzatori usurati.',
          'Stridio o cigolio in curva: barra antirollio o boccole a secco.',
          'Ticchettio in curva a bassa velocità: giunto omocinetico del semiasse a fine vita.',
          'Rumore di rotolamento che cresce con la velocità: cuscinetto della ruota usurato (va sostituito prima che si blocchi).',
          'Stridio dello sterzo a ruote ferme: servosterzo o cremagliera da controllare.',
        ],
      },
      {
        heading: 'Quando è "normale" e quando no',
        paragraphs: [
          'Alcuni rumori sono fisiologici: il ticchettio degli iniettori diesel a freddo, il fruscio aerodinamico ad alta velocità, il rumore dei pneumatici invernali. Altri sono sempre un segnale: qualsiasi rumore nuovo, crescente o accompagnato da spie accese va diagnosticato.',
          'Il modo più economico per capire: una diagnosi in officina (30–60 €) che identifica la causa senza intervento: conoscerla prima ti permette di confrontare i preventivi e scegliere quando intervenire.',
        ],
      },
    ],
    cta: 'costi-riparazione',
  },
  {
    slug: 'lavare-auto-correttamente',
    title: 'Lavare l\'auto correttamente: guida al lavaggio fai da te',
    description:
      'Come lavare l\'auto senza rovinare la vernice: prodotti, tecnica, cerchi, interni e gli errori che lasciano aloni e micrograffi.',
    published: '2026-08-11',
    category: 'manutenzione',
    sections: [
      {
        heading: 'Perché il lavaggio conta anche per il valore',
        paragraphs: [
          'Un\'auto pulita non è solo più bella: la vernice ben tenuta protegge dalla ruggine e dallo sbiadimento, e un\'auto curata si vende più in fretta e a prezzo migliore. Ma un lavaggio fatto male può fare più danni del fango: spugne sporche, detersivi sbagliati e sole pieno lasciano micrograffi e aloni.',
          'La regola d\'oro: mai lavare un\'auto sporca con movimenti circolari e mai su vernice calda.',
        ],
      },
      {
        heading: 'La tecnica del lavaggio a mano',
        paragraphs: [
          'Il metodo che rispetta la vernice:',
        ],
        list: [
          'Pre-lavaggio: sciacqua abbondantemente l\'auto per togliere sabbia e polvere prima di toccarla con la spugna.',
          'Detersivo specifico auto (mai sapone per piatti: sgrassa e toglie la cera).',
          'Spugna o guanto in microfibra con movimenti rettilinei, dal tetto verso il basso.',
          'Sciacqua per pannello, non tutta l\'auto insieme: il detersivo non deve asciugare sulla vernice.',
          'Asciugatura con pelle di daino o panno in microfibra pulito: l\'asciugatura all\'aria lascia aloni calcarei.',
        ],
      },
      {
        heading: 'Cerchi, interni e vetri',
        paragraphs: [
          'Le zone che si rovinano di più con il lavaggio:',
        ],
        list: [
          'Cerchi: i detersivi acidi per cerchi vanno usati con cautela (corrodono i cerchi in lega): meglio un detergente neutro e una spazzola dedicata.',
          'Vetri: mai lo stesso panno usato per la carrozzeria: usa un panno specifico e prodotti per vetri, all\'interno con movimenti orizzontali e all\'esterno verticali (per individuare gli aloni).',
          'Interni: aspirazione prima, poi panni in microfibra leggermente inumiditi; niente prodotti siliconici sugli interni (attirano la polvere e rendono il cruscotto riflettente).',
          'Tappetini: lavali e asciugali fuori dall\'auto per evitare l\'umidità in abitacolo.',
        ],
      },
      {
        heading: 'Gli errori che costano caro',
        paragraphs: [
          'Gli errori più comuni che rovinano la vernice:',
        ],
        list: [
          'Lavare al sole: i detersivi asciugano in fretta e lasciano aloni e macchie.',
          'Usare spugne e panni sporchi di sabbia: è la causa principale dei micrograffi a ragnatela.',
          'Lavaggio in autolavaggio "a rulli" su auto con vernice delicata: accettabile, ma preferisci i tunnel con lavaggio a getto (touchless).',
          'Non asciugare mai: il calcare dell\'acqua lascia aloni permanenti sulla vernice.',
          'Usare la pressione alta su guarnizioni, fari e sensori: l\'acqua può infiltrarsi.',
        ],
      },
      {
        heading: 'Cera e protezione: la manutenzione che paga',
        paragraphs: [
          'La cera protegge la vernice e la fa durare: un trattamento con cera o sealant due volte l\'anno (costo 20–50 € fai da te) mantiene brillantezza e protegge da raggi UV e inquinamento. Un\'auto con vernice in ottime condizioni vale più di una con la stessa meccanica ma la carrozzeria rovinata: la differenza si vede anche in fase di valutazione.',
        ],
      },
    ],
    cta: 'valutazione-auto',
  },
  {
    slug: 'preparare-auto-viaggio-lungo',
    title: 'Preparare l\'auto per un viaggio lungo: checklist completa',
    description:
      'Controlli da fare prima di un viaggio lungo: gomme, freni, liquidi, clima, documenti e attrezzatura di emergenza. La checklist per partire sereni.',
    published: '2026-08-11',
    category: 'manutenzione',
    sections: [
      {
        heading: 'Perché i viaggi lunghi mettono alla prova l\'auto',
        paragraphs: [
          'Un viaggio lungo porta l\'auto a lavorare per ore a regime costante, con carico pieno e temperature magari estreme: è il test più impegnativo dopo la guida in città. La maggior parte dei guasti in viaggio si può prevenire con 30 minuti di controlli prima di partire.',
          'La regola: controlla ciò che si surriscalda, ciò che si consuma e ciò che deve frenare.',
        ],
      },
      {
        heading: 'La checklist meccanica',
        paragraphs: [
          'Prima di partire, verifica:',
        ],
        list: [
          'Pneumatici: pressione (anche quella della ruota di scorta) e battistrada: su un viaggio in autostrada un\'auto scarica aumenta consumi e rischio forature.',
          'Liquido di raffreddamento: livello e integrità dei tubi: il primo motivo di fermo in estate.',
          'Olio motore: livello tra minimo e massimo, con i km al limite considera il cambio prima di partire.',
          'Freni: se senti rumori o il pedale è "lungo", falli controllare prima, non durante.',
          'Lavavetri e tergicristalli: le strade lunghe si sporcano in fretta.',
          'Climatizzatore: verifica che raffreddi prima del viaggio: una ricarica costa 50–100 € e va fatta in officina.',
        ],
      },
      {
        heading: 'Documenti e attrezzatura',
        paragraphs: [
          'Controlla che ci sia tutto, e in regola:',
        ],
        list: [
          'Libretto di circolazione, patente e assicurazione valida (polizza o documento).',
          'Revisione non scaduta: è obbligatoria e controllata sulle strade.',
          'Triangolo, giubbotto riflettente e kit di pronto soccorso (obbligatori in Italia).',
          'Cavi di avviamento, torcia, guanti e acqua: l\'attrezzatura di base per le emergenze.',
          'Catene a bordo se attraversi zone con obbligo invernale (o trasportale in montagna fuori stagione).',
          'Se viaggi all\'estero: estintore e attrezzature richieste dal paese di destinazione.',
        ],
      },
      {
        heading: 'Il carico: le regole di sicurezza',
        paragraphs: [
          'Il carico influisce su consumi, frenata e stabilità:',
        ],
        list: [
          'Non superare la massa massima indicata sul libretto: a pieno carico la frenata si allunga.',
          'Carico pesante in basso e verso il centro, mai appoggiato sul lunotto.',
          'Bagagliaio pieno fino al tetto? Ripartisci il peso e blocca gli oggetti che potrebbero muoversi in caso di frenata brusca.',
          'Portabagagli al tetto: aumenta i consumi del 10–20% in autostrada: usa il portapacchi solo quando serve.',
          'Mai oggetti sciolti in abitacolo: in caso di frenata brusca diventano proiettili.',
        ],
      },
      {
        heading: 'Durante il viaggio',
        paragraphs: [
          'Nei primi 15 minuti ascolta l\'auto: rumori nuovi o spie accese in quel momento si risolvono prima di arrivare. Fermati ogni 2 ore (il limite di attenzione, oltre che la prudenza), e se senti vibrazioni, fumi o la temperatura sale, fermati subito: il guasto che si ferma in tempo costa cento volte meno di quello che si aggrava.',
        ],
      },
    ],
    cta: 'revisione-auto',
  },
  {
    slug: 'adblue-cosa-sapere-diesel',
    title: 'AdBlue: cos\'è, quando rabboccare e problemi comuni',
    description:
      'AdBlue nei diesel moderni: a cosa serve, quando rabboccare, quanto costa, e cosa succede se finisce. Guida pratica senza ansie.',
    published: '2026-08-11',
    category: 'manutenzione',
    sections: [
      {
        heading: 'Cos\'è l\'AdBlue',
        paragraphs: [
          'L\'AdBlue è un liquido a base di urea (soluzione al 32,5%) iniettato nel sistema di scarico dei diesel moderni (sistema SCR) per abbattere gli ossidi di azoto: i gas passano attraverso un catalizzatore dove l\'urea li trasforma in azoto e vapore acqueo, innocui.',
          'I diesel Euro 6 hanno tutti il sistema SCR: senza AdBlue, il motore non è in grado di rispettare le emissioni e l\'auto prima o poi si rifiuta di partire.',
        ],
      },
      {
        heading: 'Quando e come rabboccare',
        paragraphs: [
          'Il consumo di AdBlue è proporzionale al diesel: in media 1 litro ogni 1.000 km, ma varia molto con il tipo di guida (più ne consuma in autostrada e a pieno carico). Il tappo del serbatoio AdBlue è di solito accanto a quello del gasolio, con il colore blu.',
          'Rabbocca quando l\'auto te lo segnala (spia o messaggio con i km rimanenti): l\'AdBlue si trova in taniche da 1,5–10 litri al supermercato, in stazioni di servizio e in officina (costo 0,7–1 €/litro in tanica, meno alla pompa).',
        ],
      },
      {
        heading: 'Cosa succede se finisce',
        paragraphs: [
          'L\'auto non si ferma all\'improvviso: prima avvisa con un conto alla rovescia dei km, poi riduce progressivamente la potenza (modalità "limp home") e infine, se ignori tutto, si rifiuta di ripartire dopo lo spegnimento: non è un guasto, è un blocco di sicurezza anti-inquinamento.',
          'La regola: mai ignorare l\'avviso di AdBlue. Rabboccare a metà serbatoio costa 15–30 € e toglie ogni rischio di restare fermi nel momento peggiore.',
        ],
      },
      {
        heading: 'I problemi comuni del sistema SCR',
        paragraphs: [
          'Quando i problemi ci sono, di solito sono questi:',
        ],
        list: [
          'Spia del sistema emissioni accesa: sensore di qualità AdBlue o livello: spesso si risolve con un rabbocco o con la diagnosi.',
          'Cristallizzazione dell\'urea: se l\'AdBlue si deposita (auto ferma a lungo o rabbocco di qualità scadente), può intasare l\'iniettore.',
          'Iniettore AdBlue intasato o difettoso: costo di sostituzione 300–700 € con manodopera.',
          'Sensore di livello difettoso: segnala AdBlue basso anche a serbatoio pieno.',
          'Guasto del catalizzatore SCR: l\'intervento più costoso (1.500–3.000 €): raro se l\'impianto è mantenuto.',
        ],
      },
      {
        heading: 'AdBlue e usato: cosa verificare',
        paragraphs: [
          'Quando compri un diesel Euro 6 usato, controlla che l\'auto non abbia il sistema SCR "disattivato" o un "emulator" (manomissione illegale, oltre che motivo di bocciatura alla revisione): i segnali sono un consumo di AdBlue nullo o la mancanza di adesivi ufficiali. Chiedi lo storico del rabbocco e controlla che la spia del sistema emissioni sia spenta a caldo.',
          'E ricorda: un\'auto con SCR efficiente consuma un litro di AdBlue ogni mille km: se il proprietario dice di non averlo mai rabboccato, qualcosa non torna.',
        ],
      },
    ],
    cta: 'costi-riparazione',
  },
  {
    slug: 'guida-pioggia-neve-ghiaccio',
    title: 'Guidare con pioggia, neve e ghiaccio: tecniche e sicurezza',
    description:
      'Aquaplaning, distanze di sicurezza, partenza sul ghiaccio e frenata corretta: le tecniche per guidare in sicurezza con maltempo e le attrezzature giuste.',
    published: '2026-08-11',
    category: 'manutenzione',
    sections: [
      {
        heading: 'Le distanze: il problema numero uno',
        paragraphs: [
          'Sul bagnato lo spazio di frenata raddoppia rispetto all\'asciutto: a 50 km/h servono circa 25–30 metri di frenata su asciutto e 45–60 sul bagnato. Sulla neve compatta si arriva a triplicare: la prima regola del maltempo è aumentare la distanza dal veicolo che precede e ridurre la velocità.',
          'La regola dei 4 secondi: scegli un punto di riferimento e conta: se lo raggiungi in meno di 4 secondi, sei troppo vicino.',
        ],
      },
      {
        heading: 'L\'aquaplaning: come uscirne',
        paragraphs: [
          'L\'aquaplaning si verifica quando il pneumatico non riesce a evacuare l\'acqua e l\'auto "galleggia": lo sterzo diventa leggero e l\'auto non risponde. Come comportarsi:',
        ],
        list: [
          'Non frenare bruscamente: rilascia delicatamente l\'acceleratore.',
          'Non girare il volante bruscamente: mantieni la traiettoria dritta.',
          'Non agitarsi sui freni: l\'ABS va tenuto premuto solo se serve davvero.',
          'Togli il piede dall\'acceleratore e aspetta che il contatto torni: l\'aquaplaning dura pochi secondi.',
          'Prevenzione: battistrada sopra i 3 mm e velocità adeguata all\'acqua (più l\'acqua è alta, più devi ridurre).',
        ],
      },
      {
        heading: 'Partenza e guida su neve e ghiaccio',
        paragraphs: [
          'Le tecniche per muoversi sulla neve:',
        ],
        list: [
          'Partenza: inserisci la seconda marcia (sul ghiaccio) e rilascia la frizione con dolcezza: la coppia ridotta evita il pattinamento.',
          'Frenata: freni con il motore (scalata) e poi con il pedale a pulsazioni leggere: l\'ABS e l\'ESP fanno il resto se li lasci lavorare.',
          'Curve: entra largo, rallenta prima della curva e accelera delicatamente in uscita: mai frenare in curva.',
          'Salite: acquista velocità prima della salita e non fermarti a metà: ripartire su una salita innevata è quasi impossibile.',
          'In salita su ghiaccio con due ruote motrici: non forzare: se l\'auto non sale, non insistere: perdi aderenza e controllo.',
        ],
      },
      {
        heading: 'L\'attrezzatura che fa la differenza',
        paragraphs: [
          'Gomme invernali o 4 stagioni con marcatura 3PMSF (obbligatorie dove previsto dalle ordinanze), catene o calze a bordo, e poi: lavavetri antigelo, raschietto, sbrinatore e una pala piccola. Controlla anche i tergicristalli e le luci: la visibilità è la tua prima protezione.',
          'Con ghiaccio visibile o black ice, la velocità prudente è l\'unica vera difesa: nessun sistema elettronico vince la fisica.',
        ],
      },
      {
        heading: 'Il comportamento in caso di sbandata',
        paragraphs: [
          'Se l\'auto inizia a sbandare, il primo istinto è sbagliare: guarda dove vuoi andare, non dove stai andando, riduci gradualmente l\'acceleratore e correggi con il volante con piccoli movimenti nella direzione dello sbandamento. Con l\'ESP attivo, l\'elettronica interviene da sola: non lottare contro di essa, accompagnala.',
        ],
      },
    ],
    cta: 'revisione-auto',
  },
  {
    slug: 'incidente-stradale-cosa-fare',
    title: 'Incidente stradale: cosa fare, in ordine e senza errori',
    description:
      'Cosa fare subito dopo un incidente: sicurezza, soccorsi, constatazione amichevole, denuncia, perizia e i tempi per non perdere diritti.',
    published: '2026-08-11',
    category: 'manutenzione',
    sections: [
      {
        heading: 'I primi 60 secondi: sicurezza',
        paragraphs: [
          'La priorità assoluta dopo un incidente è la sicurezza, non la discussione: metti la freccia di emergenza, fermati in sicurezza se possibile, indossa il giubbotto riflettente, posiziona il triangolo (obbligatorio fuori dai centri abitati) e chiama i soccorsi se ci sono feriti (112) o se la strada è bloccata.',
          'Se ci sono feriti: non spostarli (salvo pericolo imminente come incendio), non togliere il casco ai motociclisti, e mantieni la calma: le informazioni raccolte nei primi minuti valgono più di qualsiasi discussione.',
        ],
      },
      {
        heading: 'La constatazione amichevole (CID)',
        paragraphs: [
          'La constatazione amichevole (modulo blu) è il documento che descrive le dinamiche dell\'incidente: compilala con cura sul posto, possibilmente con l\'altro conducente, indicando: luogo e ora, dati dei veicoli e delle polizze, danni visibili e una descrizione semplice e sincera della dinamica.',
          'Regole d\'oro: firma solo ciò che è vero (non firmare "per accontentare"), segna le caselle dei testimoni se presenti, e scatta foto del luogo, dei veicoli e delle posizioni: sono la prova più forte in caso di contestazione.',
        ],
      },
      {
        heading: 'Quando denunciare e quali tempi',
        paragraphs: [
          'La denuncia di sinistro alla propria assicurazione va fatta entro 3 giorni dall\'incidente (la polizza indica il termine, spesso 3 giorni): con la constatazione amichevole firmata, la denuncia è rapida e permette il risarcimento diretto se l\'altro veicolo è assicurato.',
          'Senza constatazione firmata o in caso di contestazione, la denuncia va comunque fatta e l\'incidente va gestito con la compagnia, che valuterà le responsabilità. Se ci sono feriti gravi o il conducente è fuggito: denuncia alle forze dell\'ordine, sempre.',
        ],
      },
      {
        heading: 'La perizia e il risarcimento',
        paragraphs: [
          'Dopo la denuncia, la compagnia valuta i danni: per danni alla carrozzeria superiori alle soglie previste (o contestati), può nominare un perito che visiona il veicolo (perizia mobile) e definisce l\'importo del risarcimento. Se non condividi la valutazione, puoi far stimare i danni da un perito di parte o da un carrozziere di fiducia.',
          'Su un\'usata, un incidente dichiarato influisce sul valore: se hai diritto a un risarcimento, fai includere anche la svalutazione del veicolo quando il danno è strutturale.',
        ],
      },
      {
        heading: 'Gli errori che costano cari',
        paragraphs: [
          'Gli errori più comuni dopo un incidente:',
        ],
        list: [
          'Lasciare la scena senza constatazione: la tua parola contro la sua vale pochissimo.',
          'Firmare un CID con dinamica non veritiera "per sbrigarsi": ammettere colpe che non hai.',
          'Dichiarare danni non visibili o non veri: la compagnia verifica e può decadere dal risarcimento.',
          'Non fotografare la scena: senza prove, le ricostruzioni si perdono.',
          'Aspettare settimane per la denuncia: rischi di perdere diritti e rimborsi.',
        ],
      },
    ],
    cta: 'analisi-ai',
  },
  {
    slug: 'multe-contestazione-punti-patente',
    title: 'Multe auto: pagamento scontato, punti patente e contestazione',
    description:
      'Come funzionano le multe: pagamento entro 5 giorni, decurtazione punti, termini di notifica e come contestare un verbale. Guida pratica 2026.',
    published: '2026-08-11',
    category: 'manutenzione',
    sections: [
      {
        heading: 'La regola dei 5 giorni: lo sconto',
        paragraphs: [
          'La maggior parte delle multe (eccesso di velocità, divieti di sosta, semaforo rosso) prevede lo sconto del 30% se il pagamento avviene entro 5 giorni dalla notifica o dalla contestazione immediata. Oltre i 5 giorni si paga l\'importo pieno entro i termini (in genere 60 giorni dalla notifica, 30 per alcune violazioni).',
          'Esempio: una multa da 173 € piena costa 121,10 € entro 5 giorni: ricordarlo può valere decine di euro a verbale.',
        ],
      },
      {
        heading: 'La decurtazione dei punti',
        paragraphs: [
          'Alle multe di competenza si collega la decurtazione dei punti della patente: la maggior parte delle violazioni (velocità, semaforo, uso del cellulare) comporta la sottrazione di 2–10 punti. Il titolare della patente può indicare un conducente diverso (in tal caso i punti vengono tolti a lui) tramite comunicazione alla motorizzazione: la scelta va fatta entro i termini indicati nel verbale.',
          'Se i punti finiscono (sotto 20 si è in "patente a punti ridotta", sotto 0 si perde la patente): controlla sempre il saldo punti sul Portale dell\'Automobilista.',
        ],
      },
      {
        heading: 'La notifica: se è invalida, la multa cade',
        paragraphs: [
          'Il verbale va notificato entro 90 giorni (per le violazioni con accertamento diretto) o 360 giorni (per le rilevazioni strumentali come gli autovelox senza contestazione immediata). La notifica deve avvenire al domicilio risultante dal PRA o dall\'anagrafe: un verbale notificato tardi o a un indirizzo errato è impugnabile.',
          'Controlla sempre la data di notifica e la validità dei dati: errori formali (targa errata, indirizzo sbagliato) sono il motivo di impugnazione più frequente.',
        ],
      },
      {
        heading: 'Come contestare una multa',
        paragraphs: [
          'La contestazione si fa con il ricorso:',
        ],
        list: [
          'Al giudice di pace (entro 30 giorni dalla notifica, senza spese di lite se si vince).',
          'Al prefetto (entro 60 giorni, con le stesse possibilità di impugnazione).',
          'Ricorso telematico o tramite avvocato: per importi rilevanti o violazioni tecniche (autovelox non omologato, segnaletica illeggibile) conviene un professionista.',
          'Il ricorso sospende il termine di pagamento: non pagare prima di ricorrere (il pagamento equivale ad accettazione).',
        ],
      },
      {
        heading: 'Multe e acquisto di un\'usata',
        paragraphs: [
          'Le multe non pagate seguono il proprietario, ma possono "aggrapparsi" al veicolo: una cartella esattoriale non pagata può trasformarsi in fermo amministrativo. Per questo, prima di comprare un\'usata, la visura PRA (che rivela fermi e ipoteche) è un passaggio obbligato: costa pochi euro e ti evita di ereditare le multe del precedente proprietario insieme all\'auto.',
        ],
      },
    ],
    cta: 'valutazione-auto',
  },
  {
    slug: 'rinnovo-patente-scadenze',
    title: 'Rinnovo patente: scadenze, visite mediche e costi nel 2026',
    description:
      'Ogni quanto si rinnova la patente, quali visite mediche servono, dove si fa (ASL, autoscuola, portale) e quanto costa: la guida completa al rinnovo 2026.',
    published: '2026-08-11',
    category: 'manutenzione',
    sections: [
      {
        heading: 'Le scadenze per età',
        paragraphs: [
          'La validità della patente dipende dall\'età: fino a 50 anni si rinnova ogni 10 anni, dai 50 ai 70 ogni 5, dai 70 agli 80 ogni 3, e oltre gli 80 ogni 2 anni (con eventuale periodo più breve in base alle valutazioni del medico). La scadenza è indicata sulla patente stessa: non serve aspettare il sollecito.',
          'Guidare con la patente scaduta comporta una multa (che va da circa 160 a 640 € secondo i casi) e il rischio del sequestro del veicolo.',
        ],
      },
      {
        heading: 'La visita medica',
        paragraphs: [
          'Il rinnovo richiede l\'accertamento dei requisiti fisici e psichici, che si svolge:',
        ],
        list: [
          'Presso la Commissione medica locale (ASL): per la maggior parte dei casi, con appuntamento.',
          'Presso medici autorizzati (autoscuole, ambulatori convenzionati, medici di base abilitati): più rapidi, con tariffa libera.',
          'Il certificato medico va presentato insieme alla domanda di rinnovo entro la scadenza.',
          'In caso di patologie rilevanti (diabete, epilessia, problemi visivi), la Commissione può prescrivere limitazioni o validità più brevi.',
        ],
      },
      {
        heading: 'Quanto costa rinnovare',
        paragraphs: [
          'I costi del rinnovo si compongono di più voci:',
        ],
        list: [
          'Tariffa statale per la patente (dal 2026): circa 26 € di diritti di emissione del documento.',
          'Costo della visita medica: 40–80 € a seconda del medico.',
          'Costo della pratica presso autoscuola o agenzia: 20–50 € se non la fai da solo.',
          'Totale indicativo: 80–150 €, variabile per regione e struttura scelta.',
        ],
      },
      {
        heading: 'Le modalità: dove e come',
        paragraphs: [
          'Il rinnovo si può fare:',
        ],
        list: [
          'Online sul Portale dell\'Automobilista (se hai SPID/CIE): invii la domanda, la visita va fatta comunque di persona.',
          'Presso una motorizzazione: prenotazione online, tempi variabili.',
          'Presso autoscuole e agenzie di pratiche auto abilitate: la soluzione più rapida: porti il certificato e risolvi tutto in un\'unica sede.',
          'Agenzie autorizzate all\'emissione diretta: con la visita medica integrata, esci con la patente nuova.',
        ],
      },
      {
        heading: 'Quando farlo: i consigli pratici',
        paragraphs: [
          'Non aspettare l\'ultimo mese: nei periodi di punta (estate, inverno) gli appuntamenti si saturano. Prenota la visita medica con 2–3 mesi di anticipo sulla scadenza: la domanda di rinnovo si può presentare già 6 mesi prima della scadenza. E se viaggi all\'estero: porta sempre con te la patente in corso di validità: la patente scaduta non è accettata nei controlli dei paesi esteri, anche se il rinnovo è in corso.',
        ],
      },
    ],
    cta: 'revisione-auto',
  },
  {
    slug: 'officina-preventivi-confronto',
    title: 'Officina: come confrontare i preventivi ed evitare sorprese',
    description:
      'Preventivi di riparazione: cosa devono contenere, come confrontare manodopera e ricambi, le voci da contestare e i segnali di un\'officina poco trasparente.',
    published: '2026-08-11',
    category: 'manutenzione',
    sections: [
      {
        heading: 'Il preventivo scritto è un diritto',
        paragraphs: [
          'Prima di qualsiasi intervento non banale, hai diritto a un preventivo scritto e dettagliato: la legge impone all\'officina di comunicare preventivamente il costo presunto dell\'intervento e di non superarlo senza il tuo consenso (se il preventivo è a "consumo", devi essere avvisato prima che l\'importo venga superato).',
          'Un preventivo fatto solo a voce non ti tutela: chiedi sempre carta (o email) con la scomposizione di manodopera e ricambi.',
        ],
      },
      {
        heading: 'Le voci da leggere nel preventivo',
        paragraphs: [
          'Un preventivo onesto contiene:',
        ],
        list: [
          'Manodopera: ore previste per tariffa oraria: la tariffa varia tra 45 e 75 €/ora a seconda di regione e tipo di officina.',
          'Ricambi: marca (originale, equivalente, ricondizionato) e prezzo per singolo pezzo: la differenza tra ricambio originale ed equivalente può superare il 40%.',
          'Voce "smontaggio e rimontaggio": se prevista, deve essere indicata: è un\'aggiunta frequente a fine lavoro.',
          'IVA: verificata, e detraibile solo se paghi con strumenti tracciabili.',
          'Termini di consegna e validità del preventivo: un preventivo "aperto" non è un preventivo.',
        ],
      },
      {
        heading: 'Come confrontare più preventivi',
        paragraphs: [
          'Il confronto corretto si fa a parità di contenuti:',
        ],
        list: [
          'Chiedi a tutte le officine di indicare gli stessi ricambi (originali o equivalenti): confrontare un preventivo con ricambi originali e uno con equivalenti non ha senso.',
          'Verifica la tariffa oraria e le ore stimate: un\'officina che "stima 2 ore" e una che ne stima 6 sullo stesso lavoro sono molto diverse.',
          'Considera la garanzia sul lavoro: le officine serie garantiscono l\'intervento (spesso 12–24 mesi su manodopera e ricambi).',
          'Non scegliere solo sul prezzo: la qualità del lavoro e la reputazione pesano quanto lo sconto.',
        ],
      },
      {
        heading: 'I segnali di un\'officina da evitare',
        paragraphs: [
          'Diffida di:',
        ],
        list: [
          'Chi non vuole mettere per iscritto il preventivo.',
          'Chi consiglia interventi "di prevenzione" non richiesti senza spiegazioni tecniche.',
          'Chi aggiunge voci a fine lavoro senza averti chiamato prima.',
          'Chi usa solo ricambi non tracciabili o non certificati.',
          'Chi consegna l\'auto senza la fattura o con la fattura senza la scomposizione delle voci.',
        ],
      },
      {
        heading: 'L\'autorizzazione che ti protegge',
        paragraphs: [
          'Per gli interventi oltre i 200 € (soglia che varia per attività), la legge prevede la forma scritta del consenso: firma solo quando hai letto e capito tutte le voci. Se il preventivo supera il valore dell\'auto, la regola del 50–70% che abbiamo visto per "riparare o rottamare" ti dice quando conviene fermarsi: i preventivi servono anche a capire che forse non vale la pena riparare.',
        ],
      },
    ],
    cta: 'costi-riparazione',
  },
  {
    slug: 'chiavi-auto-perse-cosa-fare',
    title: 'Chiavi auto perse o smarrite: cosa fare e quanto costa',
    description:
      'Chiave auto persa o rotta: cosa fare subito, quanto costa un duplicato, chiave elettronica e transponder, e come proteggersi da costi e rischi.',
    published: '2026-08-11',
    category: 'manutenzione',
    sections: [
      {
        heading: 'I primi passi: non farti prendere dal panico',
        paragraphs: [
          'Chiave persa o smarrita? La prima cosa da fare è controllare bene dove pensi di averla lasciata (tasca, borsa, portafoglio, sotto i sedili) e poi valutare i danni: se la chiave è caduta fuori casa, il rischio maggiore non è il costo del duplicato, ma il furto dell\'auto: se il portachiavi ha targa o documenti, considera l\'auto a rischio.',
          'Se la chiave è andata persa in un luogo pubblico o c\'è il rischio che qualcuno possa usarla, l\'intervento più prudente è far disattivare la chiave dal sistema della casa (molti sistemi lo permettono) e ordinare una nuova.',
        ],
      },
      {
        heading: 'Quanto costa un duplicato',
        paragraphs: [
          'Il costo dipende dal tipo di chiave:',
        ],
        list: [
          'Chiave meccanica classica (senza elettronica): 15–50 €, tagliata da un fabbro o da un\'officina specializzata.',
          'Chiave con transponder (chip): 80–200 €: il chip va "copiato" e programmato con l\'auto.',
          'Chiave elettronica con telecomando: 150–400 € secondo la marca, programmazione inclusa.',
          'Chiave smart (avviamento senza chiave, "keyless"): 250–600 €: la più costosa, richiede la casa o un\'officina autorizzata con attrezzatura specifica.',
          'Chiave persa in un\'auto con sistema keyless: in alcuni modelli servono procedure di sicurezza che portano i costi ancora più in alto.',
        ],
      },
      {
        heading: 'Dove rivolgersi',
        paragraphs: [
          'Le strade per ottenere una nuova chiave:',
        ],
        list: [
          'Concessionario ufficiale della marca: la soluzione più sicura (programmazione garantita) ma la più costosa.',
          'Officine specializzate in chiavi auto e codificazione: spesso costano il 30–50% in meno del concessionario.',
          'Servizi di "chiave a domicilio" (fabbro automobilistico): utili se sei bloccato fuori casa, con costi di trasferta.',
          'Ordine online con codice di taglio: possibile per chiavi meccaniche, meno per quelle elettroniche.',
        ],
      },
      {
        heading: 'Cosa serve per fare il duplicato',
        paragraphs: [
          'Per il duplicato servono di solito: il libretto di circolazione e la carta d\'identità (prova che sei il proprietario), la chiave originale quando è ancora disponibile (per la copia), e in alcuni casi il codice segreto della chiave (il "codice segreto" indicato nel libretto o nella scheda della casa).',
          'Per le chiavi elettroniche la programmazione va fatta con l\'auto presente: se la chiave è solo persa, il veicolo deve essere accessibile.',
        ],
      },
      {
        heading: 'Prevenzione: la chiave di riserva è un\'assicurazione',
        paragraphs: [
          'La regola più economica è non trovarsi mai con zero chiavi: il duplicato di riserva fatto subito (quando la chiave originale esiste ancora) costa molto meno di una chiave nuova dopo la perdita. Conservala in un posto sicuro fuori casa, mai in auto (sarebbe inutile).',
          'E quando compri un\'usata, verifica quante chiavi vengono consegnate: un\'auto con una sola chiave vale meno, perché il costo di una seconda chiave (fino a 400 €) è un costo reale da considerare nella valutazione.',
        ],
      },
    ],
    cta: 'valutazione-auto',
  },
  {
    slug: 'soccorso-stradale-come-funziona',
    title: 'Soccorso stradale: come funziona, costi e quando attivarlo',
    description:
      'Soccorso stradale: cosa copre l\'assistenza in polizza, quanto costa senza copertura, quando attivarlo e cosa fare mentre aspetti il carroattrezzi.',
    published: '2026-08-11',
    category: 'manutenzione',
    sections: [
      {
        heading: 'Cos\'è il soccorso stradale',
        paragraphs: [
          'Il soccorso stradale (o assistenza stradale) è il servizio che interviene quando un\'auto è ferma per guasto o incidente: soccorso sul posto, tentativo di riparazione rapida, e se necessario il trasporto del veicolo all\'officina più vicina o alla destinazione scelta, insieme al soccorso dei passeggeri.',
          'È incluso in quasi tutte le polizze assicurative (come garanzia accessoria) e in molti contratti di assistenza: avere la copertura giusta trasforma una giornata rovinata in un inconveniente di mezz\'ora.',
        ],
      },
      {
        heading: 'Cosa copre (e cosa no)',
        paragraphs: [
          'La copertura tipica del soccorso stradale include:',
        ],
        list: [
          'Soccorso sul luogo del guasto e tentativo di riparazione rapida.',
          'Traino del veicolo (fino a un limite di km, in genere 50–100 km, oltre si paga il sovrapprezzo).',
          'Trasporto dei passeggeri (di solito fino alla destinazione, entro certi limiti).',
          'Soccorso in caso di incidente, anche con auto non guidabile.',
          'Soccorso su strada o in autostrada: verificare che la copertura includa l\'autostrada (alcune escludono i tratti a pedaggio).',
        ],
      },
      {
        heading: 'Quanto costa senza copertura',
        paragraphs: [
          'Senza assistenza attiva, il soccorso stradale si paga a prezzo pieno:',
        ],
        list: [
          'Intervento su strada urbana: 80–150 €.',
          'Intervento su autostrada: 150–300 € (il pedaggio del tratto resta a carico).',
          'Traino con carroattrezzi oltre i km inclusi: 2–5 €/km.',
          'Soccorso notturno o nei festivi: maggiorazione del 30–50%.',
          'Per confronto: la garanzia di assistenza stradale in polizza costa in genere 20–60 €/anno.',
        ],
      },
      {
        heading: 'Quando attivarlo (e quando no)',
        paragraphs: [
          'Attiva il soccorso quando:',
          'Non serve il carroattrezzi per una foratura risolvibile con la ruota di scorta o un guasto che puoi gestire in sicurezza: usare il soccorso quando non serve allunga i tempi e, senza copertura, i costi.',
        ],
        list: [
          'L\'auto non riparte e non puoi risolvere da solo (batteria, chiave, guasto).',
          'C\'è un incidente con veicolo non marciante.',
          'Sei in una zona pericolosa (autostrada, strada di montagna) e restare fermo è un rischio.',
          'Il guasto riguarda sicurezza (freni, sterzo, pneumatico che si gonfia).',
        ],
      },
      {
        heading: 'Cosa fare mentre aspetti',
        paragraphs: [
          'Auto ferma in autostrada: giubbotto riflettente, triangolo a 100 metri (in curva anche di più), tutti fuori dall\'auto dietro la barriera, e contatta il soccorso dal telefono: su autostrada il riferimento è il 112 (o il pannello SOS con la progressiva chilometrica). Mai restare in auto su una corsia di marcia.',
          'Prima di firmare qualsiasi intervento, verifica che il servizio sia quello previsto dalla tua polizza e chiedi il costo se la copertura non è attiva: la chiarezza prima evita contestazioni dopo.',
        ],
      },
    ],
    cta: 'assicurazione-auto',
  },
  {
    slug: 'fumo-dallo-scarico-significato',
    title: 'Fumo dallo scarico: cosa indica il colore',
    description:
      'Fumo bianco, blu o nero dallo scarico: il colore rivela il problema (guarnizione, olio, carburante). Come diagnosticare e quanto costa riparare.',
    published: '2026-08-11',
    category: 'manutenzione',
    sections: [
      {
        heading: 'Il colore del fumo parla',
        paragraphs: [
          'Il fumo dallo scarico è uno dei segnali diagnostici più informativi di un\'auto: il colore rivela cosa brucia male nel motore, e conoscere la differenza evita sia di ignorare un guasto grave sia di spendere soldi per un problema inesistente.',
          'Importante: valuta il fumo a motore caldo e a regime, non quello al primo avvio a freddo: un filo di vapore bianco nei primi minuti può essere normale (condensa), e un pennacchio scuro in accelerazione violenta può essere solo un\'iniezione troppo ricca.',
        ],
      },
      {
        heading: 'Fumo bianco: attenzione al liquido di raffreddamento',
        paragraphs: [
          'Il fumo bianco denso e persistente, con odore dolciastro, è il segnale più grave: indica che il liquido di raffreddamento entra nella camera di combustione, tipicamente per una guarnizione della testata bruciata o una testata deformata. Se è accompagnato da calo del liquido e temperatura instabile, il problema è confermato.',
          'Costi: la sostituzione della guarnizione della testata parte da 800–1.500 €; se la testata è deformata o crepata, si arriva a 2.000–4.000 €. Prima di spendere, però, verifica anche i punti più semplici: un\'iniezione di urea (AdBlue) difettosa può produrre un pennacchio biancastro molto simile.',
        ],
      },
      {
        heading: 'Fumo blu: l\'olio brucia',
        paragraphs: [
          'Il fumo blu o grigio-bluastro indica che l\'olio motore entra nella camera di combustione: le cause tipiche sono fasce elastiche usurate (motore con molti km o surriscaldato), guide delle valvole logore o turbina che perde olio. Tipicamente appare in accelerazione (fasce) o in rilascio/freno motore (guide valvole).',
          'Il problema non è solo estetico: bruciare olio consuma lubrificante e aumenta le emissioni: il controllo del livello olio diventa frequente e il motore rischia danni se il livello scende troppo. La riparazione dipende dalla causa: da 300–600 € (turbina) a 1.500–3.000 € (rifacimento fasce e testata).',
        ],
      },
      {
        heading: 'Fumo nero: miscela troppo ricca',
        paragraphs: [
          'Il fumo nero indica carburante non bruciato, tipico di un\'iniezione troppo ricca: sui diesel è il problema più frequente (iniettori sporchi o usurati, EGR intasata, filtro intasato); sui benzina può dipendere da sonde lambda o sensori di flusso d\'aria in avaria.',
          'Oltre al fumo, la miscela ricca consuma di più, sporca il motore e, sui diesel, intasa il filtro antiparticolato (DPF). La diagnosi elettronica (30–60 €) individua la causa: la pulizia degli iniettori costa 100–300 €, la sostituzione 400–1.200 € secondo i pezzi.',
        ],
      },
      {
        heading: 'Il caso innocuo: il vapore a freddo',
        paragraphs: [
          'Un filo di vapore bianco che sparisce dopo pochi minuti a freddo è normale: è condensa nello scarico freddo, più evidente nei mesi invernali. Anche qualche goccia d\'acqua dallo scarico è fisiologica. Diventa un problema solo quando il fumo è denso, persistente e accompagnato da perdita di liquido o di potenza.',
        ],
      },
      {
        heading: 'Fumo e acquisto usato: cosa fare',
        paragraphs: [
          'Quando provi un\'usata, guarda lo scarico a motore caldo: un pennacchio blu o bianco persistente è un difetto da far emergere prima della trattativa, perché i costi di riparazione possono superare di gran lunga lo sconto chiesto. Porta l\'auto su un tratto in accelerazione e controlla lo specchietto: il fumo racconta anni di storia in pochi secondi.',
        ],
      },
    ],
    cta: 'costi-riparazione',
  },
];

const guideMap = new Map(guides.map((g) => [g.slug, g]));

export function getGuide(slug: string): Guide | undefined {
  return guideMap.get(slug);
}

