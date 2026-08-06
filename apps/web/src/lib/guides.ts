export interface GuideSection {
  heading: string;
  paragraphs: string[];
  list?: string[];
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  published: string;
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
    cta: 'vendere-auto',
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
