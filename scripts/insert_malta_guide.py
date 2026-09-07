import json
import re

GUIDES_PATH = r"apps/web/src/lib/guides.ts"

NEW_GUIDE = {
    "slug": "malta-compra-carburante-italia-prezzi-pompa-confronto",
    "title": "Malta compra carburante dall'Italia ma ai distributori paga quasi 1 € in meno: chi ci guadagna davvero?",
    "description": "Malta importa gran parte dei prodotti raffinati dall'Italia, eppure la benzina costa 1,34 €/l e il diesel 1,21 €/l contro i quasi 2 € italiani: analisi economica tra sussidi, hedging, accise e costo totale della mobilità.",
    "published": "2026-09-07",
    "category": "manutenzione",
    "cta": "risparmio-carburante",
    "ctaType": "valutazione-auto",
    "image": "/images/guide/malta-compra-carburante-italia-prezzi-pompa-confronto.jpg",
    "readTime": "8 min",
    "featured": True,
    "sections": [
      {
        "heading": "Il paradosso del Mediterraneo: la benzina parte dall'Italia e costa meno sull'isola",
        "paragraphs": [
          "Fermiamoci un momento ad analizzare un fatto concreto che sta scuotendo il dibattito tra gli automobilisti: Malta importa una quota determinante dei suoi prodotti petroliferi raffinati direttamente dalle raffinerie italiane (in particolare dai poli petrolchimici della Sicilia), ma un cittadino maltese alla pompa di benzina paga nettamente meno di un automobilista italiano.",
          "A prima vista sembra un assurdo economico e logistico. Se il greggio viene raffinato in Italia, caricato sulle navi cisterna, trasportato attraverso il canale di Sicilia, sbarcato nei depositi costieri dell'arcipelago maltese e infine distribuito alle stazioni di servizio locali sostenendo ulteriori costi di nolo marittimo e logistica insulare... per quale motivo dall'altra parte del mare, dove il carburante viene prodotto e raffinato a chilometro zero, noi ci ritroviamo a pagarlo tra i 50 e i 70 centesimi al litro in più?",
          "La risposta istintiva di molti sui social network è la solita: «In Italia ci sono troppe accise». Ma limitarsi alle tasse significa fermarsi alla superficie di una realtà macroeconomica molto più complessa e affascinante. C'è di mezzo la finanza internazionale dei contratti di hedging, la scelta politica sulla fiscalità generale, e soprattutto una riflessione su quanto costa davvero muoversi in auto nel 2026."
        ]
      },
      {
        "heading": "I numeri reali del divario: 1,34 € contro quasi 2 € al litro",
        "paragraphs": [
          "Per capire l'entità del fenomeno, guardiamo le rilevazioni ufficiali del mercato dei carburanti aggiornate al 2026:",
          "A Malta, il prezzo dei carburanti è calmierato e fissato ufficialmente a circa **1,34 €/litro per la benzina senza piombo** e **1,21 €/litro per il gasolio (diesel)**. In Italia, nello stesso periodo, il prezzo medio self-service sulla rete ordinaria oscilla tra 1,80 € e 1,92 € al litro per la benzina e oltre 1,75 € per il diesel, toccando punte di oltre 2,10-2,20 € sulle tratte autostradali (come approfondito nella nostra [guida ai prezzi record della benzina](/guide/benzina-quasi-da-record-guida-risparmiare-1500-euro)).",
          "Tradotto in euro reali e tangibili per chi guida ogni giorno:"
        ],
        "list": [
          "**Il confronto su un singolo pieno da 50 litri:** se ipotizziamo una differenza prudenziale di circa 0,60 € al litro, un pieno da 50 litri a Malta costa circa 67 € contro i quasi 97 € in Italia. Sono **30 € tondi di risparmio a ogni singolo rifornimento**.",
          "**Il bilancio annuo per un pendolare (20 pieni/anno):** 20 pieni x 30 € = **600 € netti di differenza all'anno** che restano nelle tasche dell'automobilista.",
          "**Il bilancio per chi viaggia per lavoro (25-30 pieni/anno):** la forbice sale a **750 € - 900 € all'anno**. Non parliamo più di centesimi o statistiche astratte: sono somme equivalenti a una rata del mutuo, all'assicurazione RC Auto annuale o alla sostituzione programmata di un treno di [pneumatici nuovi](/guide/pneumatici-usura-pressione-inversione)."
        ]
      },
      {
        "heading": "Come nasce il prezzo di un litro: la formula della filiera petrolifera",
        "paragraphs": [
          "Malta non ha scoperto giacimenti segreti né possiede una formula magica per azzerare i costi del greggio. Per comprendere il divario occorre smontare la struttura del prezzo al consumo di un litro di benzina o gasolio, composto da tre macro-blocchi fondamentali:"
        ],
        "list": [
          "**1. Il costo industriale del prodotto (Platts CIF Med):** È la quotazione internazionale del carburante già raffinato nell'area mediterranea. Questo costo è identico per l'Italia e per Malta, poiché entrambe acquistano sui medesimi mercati internazionali di riferimento.",
          "**2. Il margine di distribuzione (costi logistici e margine lordo):** Copre il trasporto primario (oleodotto o nave cisterna), lo stoccaggio nei depositi costieri, il trasporto secondario in autobotte verso i distributori e il compenso per il gestore dell'impianto.",
          "**3. Il carico fiscale dello Stato (Accise + IVA):** In Italia le accise pesano circa 0,73 €/l sulla benzina e 0,62 €/l sul gasolio, a cui si aggiunge l'IVA al 22% calcolata sia sul prodotto che sulle stesse accise (la celebre «tassa sulla tassa»). A Malta le aliquote fiscali sono sensibilmente inferiori e la tassazione indiretta grava in misura decisamente più contenuta sui carburanti per autotrazione."
        ]
      },
      {
        "heading": "Il modello maltese: hedging finanziario e sussidi statali",
        "paragraphs": [
          "La vera differenza tra Roma e La Valletta non è soltanto fiscale, ma risiede nella gestione del rischio energetico adottata dal governo maltese attraverso due strumenti cardine: i **contratti derivati di hedging** e i **sussidi diretti al consumo**.",
          "L'**hedging** è una strategia di finanza d'impresa con cui un acquirente (in questo caso l'ente energetico controllato dallo Stato maltese) acquista sul mercato finanziario contratti a termine che bloccano il prezzo futuro dell'energia per 12, 18 o 24 mesi. Se il prezzo del barile sul mercato mondiale sale alle stelle per una crisi geopolitica, chi ha fatto hedging continua a pagare il prezzo concordato mesi prima, neutralizzando i picchi violenti del petrolio.",
          "Inoltre, il governo maltese ha scelto deliberatamente di stanziare centinaia di milioni di euro del proprio bilancio pubblico per sussidiare la differenza tra il costo reale di mercato e il prezzo finale esposto sui cartelli dei distributori Enemed. In pratica, il governo maltese dice ai propri cittadini: *«L'inflazione energetica non deve strangolare il potere d'acquisto delle famiglie; assorbiamo noi la volatilità con il debito e la fiscalità generale»*."
        ]
      },
      {
        "heading": "Il rovescio della medaglia: chi paga davvero il conto?",
        "paragraphs": [
          "A questo punto la riflessione economica si fa più severa. Dire che «a Malta sono più bravi e la benzina costa meno» è un'istantanea parziale se non ci si domanda chi sostiene i costi di questa stabilità.",
          "Quando un governo congela artificialmente i prezzi dei carburanti al di sotto dei costi industriali effettivi, la differenza non scompare nel nulla: viene coperta dal Ministero delle Finanze con fondi pubblici. Questo significa che l'automobilista maltese risparmia alla pompa, ma quello stesso costo viene ripartito sulla collettività attraverso il debito pubblico nazionale, minori investimenti in altri settori o future misure fiscali.",
          "In Italia, con un debito pubblico oltre i 2.900 miliardi di euro e oltre 40 milioni di autoveicoli circolanti (contro i circa 400.000 dell'intera Malta, una popolazione pari a quella del comune di Bologna), uno sgravio generalizzato permanente sul carburante costerebbe alle casse dello Stato tra i 10 e i 15 miliardi di euro ogni anno: una cifra titanica che il nostro bilancio difficilmente potrebbe reggere senza tagli drastici a sanità, scuola o pensioni."
        ]
      },
      {
        "heading": "Il vero problema italiano: il costo complessivo della mobilità (TCO)",
        "paragraphs": [
          "Il confronto con Malta mette a nudo una criticità strutturale ben più profonda della sola benzina: in Italia muoversi in automobile è diventato un lusso gravato da spese fisse e ricorrenti insostenibili.",
          "Il costo reale di mantenimento di un'auto (Total Cost of Ownership) per un italiano è una morsa a 360 gradi:",
          "Se desideri verificare quanto ti costa realmente mantenere la tua vettura ogni anno o scegliere modelli dai consumi più parchi, puoi utilizzare il nostro [calcolatore dei consumi reali](/consumi) e monitorare le spese sul [Profilo Digitale Veicolo](/passport)."
        ],
        "list": [
          "**Assicurazione RC Auto:** tariffe tra le più alte d'Europa, con rincari a doppia cifra e profonde discriminazioni territoriali (in Campania e Sicilia i premi possono superare i 1.200 €/anno anche per utilitarie).",
          "**Bollo Auto Regionale:** una tassa di possesso legata ai kW di potenza che non esiste in molti altri Stati UE. Puoi verificare l'importo esatto con il nostro [calcolo del bollo auto per regione](/calcolo-bollo).",
          "**Passaggio di proprietà (IPT):** una tassa di registro provinciale che rende compravendere un'usato in Italia costosissimo (spesso tra 300 € e 800 € per una vettura normale, come calcolabile nel modulo [passaggio di proprietà](/passaggio-proprieta)).",
          "**Pedaggi autostradali e sosta tariffata:** aumenti costanti delle tariffe autostradali e proliferazione di strisce blu e ZTL a pagamento in tutti i capoluoghi.",
          "**Manutenzione ordinaria e straordinaria:** rincari sui ricambi e manodopera officina di oltre il 20-30% negli ultimi 3 anni, stimabili nel nostro tool di [stima riparazione e tagliandi](/riparazione)."
        ]
      },
      {
        "heading": "La parola ai lettori di AutoEsperto: dite la vostra nei commenti",
        "paragraphs": [
          "I numeri parlano chiaro, ma la realtà quotidiana di chi guida sulle strade italiane è ancora più interessante dei dati statistici. Vogliamo aprire un confronto trasparente e basato sull'esperienza reale della community di AutoEsperto:",
          "Quanto pagate oggi un litro di carburante nella vostra città o provincia? E quanto vi costa riempire completamente il serbatoio?",
          "Lasciate un commento indicando la vostra **Provincia + Tipo Carburante + Prezzo al Litro rilevato**, e votate quale di queste 5 posizioni rispecchia meglio la vostra visione:"
        ],
        "list": [
          "**A) Intervento statale sui prezzi:** Lo Stato italiano deve intervenire direttamente tagliando le accise o calmierando il prezzo finale alla pompa a tutela del ceto medio.",
          "**B) Liberalizzazione e taglio tasse:** Meglio lasciare che sia la libera concorrenza tra impianti a fare il prezzo, ma azzerando l'IVA sulle accise e riducendo il prelievo fiscale complessivo.",
          "**C) Crisi sistemica della mobilità:** Il problema della benzina è solo la punta dell'iceberg; è l'intero costo di possesso dell'auto in Italia (bollo, RC Auto, passaggi) a dover essere riformato.",
          "**D) Il modello Malta dimostra che si può fare:** Anche un Paese privo di raffinerie e dipendente dalle importazioni può proteggere i cittadini se esiste la volontà politica.",
          "**E) Confronto non comparabile:** Malta è una micro-realtà insulare con 400mila auto; applicare gli stessi sussidi a un gigante industriale da 40 milioni di veicoli come l'Italia porterebbe al collasso dei conti pubblici.",
          "Condividete la vostra opzione (A, B, C, D o E) e spiegate la vostra motivazione: pubblicheremo i dati più interessanti nel nostro prossimo report sui costi della mobilità italiana."
        ]
      }
    ]
}

with open(GUIDES_PATH, "r", encoding="utf-8") as f:
    content = f.read()

# Check if already present
if NEW_GUIDE["slug"] in content:
    print("Guide already present in guides.ts, skipping insertion.")
else:
    # Insert right after "const initialGuides: Guide[] = ["
    target = "const initialGuides: Guide[] = [\n"
    idx = content.find(target)
    if idx == -1:
        target = "const initialGuides: Guide[] = ["
        idx = content.find(target)
        target_len = len(target)
    else:
        target_len = len(target)

    if idx == -1:
        print("ERROR: could not find insertion target in guides.ts")
    else:
        json_str = "  " + json.dumps(NEW_GUIDE, indent=2, ensure_ascii=False).replace("\n", "\n  ") + ",\n"
        new_content = content[:idx + target_len] + json_str + content[idx + target_len:]
        with open(GUIDES_PATH, "w", encoding="utf-8") as f:
            f.write(new_content)
        print("Successfully inserted guide into guides.ts!")
