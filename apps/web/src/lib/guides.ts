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
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
