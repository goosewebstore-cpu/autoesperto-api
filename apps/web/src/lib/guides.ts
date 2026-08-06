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
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
