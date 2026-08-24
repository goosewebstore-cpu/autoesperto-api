'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  Search,
  Wrench,
  ShieldAlert,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Flame,
  Gauge,
  Info,
} from 'lucide-react';

interface EngineIssue {
  id: string;
  name: string;
  commercialName: string;
  brands: string[];
  models: string;
  years: string;
  fuel: string;
  severity: 'alta' | 'media' | 'critica';
  defectSummary: string;
  rootCause: string;
  symptoms: string[];
  estimatedRepairCost: string;
  preventionTip: string;
  relatedMakeSlug: string;
}

const ENGINES_DATA: EngineIssue[] = [
  {
    id: 'puretech-12',
    name: '1.2 PureTech 3 cilindri (EB2 / EB2DTS)',
    commercialName: '1.2 PureTech 68, 75, 82, 100, 110, 130 CV',
    brands: ['Peugeot', 'Citroën', 'Opel', 'DS', 'Jeep', 'Fiat'],
    models: '208, 2008, 308, 3008, C3, C3 Aircross, C4, Corsa F, Mokka, Crossland, Avenger, 600',
    years: '2014 - 2023 (versioni a cinghia)',
    fuel: 'Benzina / Mild Hybrid',
    severity: 'critica',
    defectSummary: 'Degrado della cinghia di distribuzione a bagno d\'olio con sfaldamento gomma nella coppa dell\'olio.',
    rootCause: 'I vapori di benzina nell\'olio motore degradano la mescola della gomma. I residui intasano la succhieruola della pompa olio, causando calo di pressione, perdita di servoassistenza ai freni (depressore) e possibile grippaggio.',
    symptoms: [
      'Spia "Pressione Olio Insufficiente" o spia motore accesa',
      'Pedale del freno duro all\'improvviso (pompa a vuoto ostruita)',
      'Consumo eccessivo d\'olio (oltre 1 litro ogni 1.500 km)',
      'Rumorosità metallica all\'avviamento a freddo',
    ],
    estimatedRepairCost: '700 € - 2.800 € (fino a 5.000 € se va sostituito il motore)',
    preventionTip: 'Misura la larghezza della cinghia dal tappo olio con l\'apposito calibro. Cambia l\'olio ogni 10.000 km usando SOLO l\'olio omologato Stellantis (es. 0W-20 FPW9.55535/03).',
    relatedMakeSlug: 'peugeot',
  },
  {
    id: 'multijet-13',
    name: '1.3 Multijet / CDTI 16V (SDE)',
    commercialName: '1.3 MultiJet 70, 75, 85, 90, 95 CV',
    brands: ['Fiat', 'Lancia', 'Alfa Romeo', 'Opel', 'Suzuki'],
    models: 'Panda, 500, Punto, Grande Punto, Ypsilon, Mito, Corsa D/E, Swift',
    years: '2003 - 2020',
    fuel: 'Diesel',
    severity: 'alta',
    defectSummary: 'Allungamento e rottura improvvisa della catena di distribuzione.',
    rootCause: 'La diluizione dell\'olio provocata dalle continue rigenerazioni DPF urbane riduce la pressione nel tendicatena idraulico. La catena si allenta, scavalca i denti dell\'ingranaggio e piega le valvole.',
    symptoms: [
      'Forte sferragliamento metallico proveniente dal lato destro del motore all\'avvio a freddo',
      'Spia cambio olio lampeggiante (degrado olio da rigenerazioni)',
      'Avviamento difficoltoso e minimo irregolare',
    ],
    estimatedRepairCost: '500 € - 1.200 € (kit catena) / 1.800 € - 2.500 € (se rotta con valvole piegate)',
    preventionTip: 'Sostituisci il kit catena di distribuzione completo preventivamente ogni 120.000-140.000 km e cambia l\'olio ogni 12.000-15.000 km, senza aspettare i 30.000 km.',
    relatedMakeSlug: 'fiat',
  },
  {
    id: 'bluehdi-15',
    name: '1.5 BlueHDi (DV5RD / DV5RC)',
    commercialName: '1.5 BlueHDi 100, 120, 130 CV',
    brands: ['Peugeot', 'Citroën', 'Opel', 'DS', 'Toyota'],
    models: '208, 2008, 308, 3008, 5008, C3, C4, C5 Aircross, Corsa, Grandland, ProAce',
    years: '2017 - 2023',
    fuel: 'Diesel',
    severity: 'critica',
    defectSummary: 'Rottura della catenella di sincronizzazione alberi a camme (7 mm) e serbatoio AdBlue.',
    rootCause: 'La catena interna da 7 mm tra i due alberi a camme è sottodimensionata e cede di schianto distruggendo le punterie e la testata. Inoltre il serbatoio AdBlue soffre di deformazione della pompa integrata.',
    symptoms: [
      'Ticchettio metallico continuo nella parte alta del coperchio punterie',
      'Messaggio "Anomalia Sistema Antinquinamento" o conto alla rovescia avviamento AdBlue',
      'Spegnimento improvviso del motore in marcia',
    ],
    estimatedRepairCost: '1.200 € - 2.200 € (kit 8 mm e testata) / 1.000 € - 1.400 € (serbatoio AdBlue)',
    preventionTip: 'Verifica se è stato effettuato l\'aggiornamento con la catena rinforzata da 8 mm (riconoscibile dalla nervatura sul carter albero a camme) e usa additivi anticristallizzanti per AdBlue.',
    relatedMakeSlug: 'citroen',
  },
  {
    id: 'ecoboost-10',
    name: '1.0 EcoBoost Fox 3 cilindri',
    commercialName: '1.0 EcoBoost 100, 125, 140 CV',
    brands: ['Ford'],
    models: 'Fiesta, Focus, Puma, EcoSport, B-Max, C-Max',
    years: '2012 - 2019 (versioni wet-belt)',
    fuel: 'Benzina',
    severity: 'alta',
    defectSummary: 'Cinghia a bagno d\'olio e fessurazione del tubetto di ritorno del refrigerante.',
    rootCause: 'La cinghia di distribuzione immersa nell\'olio si sgretola nel tempo, ostruendo il pescante dell\'olio. Sui primi esemplari (2012-2015), il tubetto in plastica del liquido di raffreddamento si crepava svuotando il circuito e bruciando la testata.',
    symptoms: [
      'Calo improvviso del liquido refrigerante nella vaschetta',
      'Spia pressione olio che si illumina in accelerazione',
      'Surriscaldamento rapido del motore',
    ],
    estimatedRepairCost: '800 € - 1.500 € (sostituzione cinghia e pulizia coppa) / 2.500 € (testata)',
    preventionTip: 'Sostituisci la cinghia prima dei 10 anni / 150.000 km e verifica che il tubo di sfiato del liquido di raffreddamento sia stato aggiornato con la versione modificata in gomma/metallo.',
    relatedMakeSlug: 'ford',
  },
  {
    id: 'tdi-16',
    name: '1.6 TDI Common Rail (EA189 / EA288)',
    commercialName: '1.6 TDI 90, 105, 110, 115, 120 CV',
    brands: ['Volkswagen', 'Audi', 'Seat', 'Skoda'],
    models: 'Golf 6/7, Polo, Passat, A1, A3, Leon, Ibiza, Octavia, Fabia',
    years: '2009 - 2020',
    fuel: 'Diesel',
    severity: 'media',
    defectSummary: 'Guasto iniettori piezoelettrici Continental/VDO e limatura pompa alta pressione CP4.',
    rootCause: 'Gli iniettori piezoelettrici della prima serie (EA189) soffrono di cortocircuiti interni. La pompa Bosch CP4, se alimentata con gasolio contaminato o secco, produce microscopica limatura metallica che devasta l\'intero circuito d\'iniezione.',
    symptoms: [
      'Spia candelette lampeggiante in marcia e veicolo in modalità recovery (blocco a 2.500 giri)',
      'Battito metallico simile a un "trattore" in forte accelerazione',
      'Difficoltà di riavvio a caldo',
    ],
    estimatedRepairCost: '400 € a singolo iniettore / 2.500 € - 4.000 € se la pompa CP4 ha rilasciato limatura',
    preventionTip: 'Sostituisci il filtro del gasolio a ogni tagliando (massimo ogni 20.000 km) e controlla la presenza di limatura magnetica nel pozzetto del filtro gasolio.',
    relatedMakeSlug: 'volkswagen',
  },
  {
    id: 'dsg-dq200',
    name: 'Cambio DSG 7 marce a secco (DQ200 / 0AM / 0CW)',
    commercialName: 'Cambio Automatico S-Tronic / DSG 7 rapporti',
    brands: ['Volkswagen', 'Audi', 'Seat', 'Skoda'],
    models: 'Golf, Polo, T-Roc, A1, A3, Q2, Leon, Arona, Octavia, Kamiq (motori fino a 250 Nm)',
    years: '2008 - Oggi',
    fuel: 'Benzina / Diesel leggeri',
    severity: 'alta',
    defectSummary: 'Strappi del pacco frizioni a secco e guasto accumulatore di pressione della meccatronica.',
    rootCause: 'Le due frizioni non lavorano a bagno d\'olio ma a secco: nelle code urbane surriscaldano e si vetrificano rapidamente. Il corpo valvola della meccatronica sviluppa micro-fessure che fanno perdere pressione idraulica all\'attuatore.',
    symptoms: [
      'Forti vibrazioni e scossoni in partenza o scalando tra 2a e 1a marcia nel traffico',
      'Icona chiave inglese lampeggiante sul display al posto delle marce (P, R, N, D)',
      'Impossibilità di innestare le marce pari o dispari',
    ],
    estimatedRepairCost: '900 € - 1.400 € (pacco frizioni) / 1.200 € - 1.800 € (revisione meccatronica)',
    preventionTip: 'In colonna evita di far scivolare continuamente l\'auto a passo d\'uomo con il freno premuto. Durante il test drive a caldo effettua diverse partenze in salita per verificare l\'assenza di strappi.',
    relatedMakeSlug: 'volkswagen',
  },
  {
    id: 'tsi-14',
    name: '1.4 TSI Twincharger / EA111',
    commercialName: '1.4 TSI / TFSI 122, 140, 150, 160, 170, 180 CV',
    brands: ['Volkswagen', 'Audi', 'Seat', 'Skoda'],
    models: 'Golf 5/6, Scirocco, Polo GTI, Tiguan, A1, A3, Ibiza Cupra, Fabia RS',
    years: '2006 - 2014',
    fuel: 'Benzina',
    severity: 'critica',
    defectSummary: 'Cedimento tendicatena idraulico, consumo d\'olio e fessurazione pistoni.',
    rootCause: 'Il tendicatena perde pressione da fermo provocando lo scavalcamento della catena al primo avviamento. Nelle versioni volumetriche + turbo (Twincharger 160/180 CV) le elevate temperature causavano la rottura dei mantelli dei pistoni.',
    symptoms: [
      'Forte rumore metallico nei primi 3 secondi dopo l\'accensione a motore freddo',
      'Mancate accensioni (misfire) sui cilindri e spia motore',
      'Consumo eccessivo di olio motore (fumo azzurro in rilascio)',
    ],
    estimatedRepairCost: '700 € - 1.200 € (kit catena modificato) / 3.000 € (sostituzione pistoni/motore)',
    preventionTip: 'Sui modelli dal 2014 in poi il Gruppo VW è passato ai motori EA211 a cinghia di distribuzione, molto più affidabili e privi di questo problema.',
    relatedMakeSlug: 'audi',
  },
  {
    id: 'dci-15',
    name: '1.5 dCi K9K (versioni pre-2012)',
    commercialName: '1.5 dCi 65, 85, 105, 110 CV',
    brands: ['Renault', 'Dacia', 'Nissan', 'Mercedes-Benz'],
    models: 'Clio 2/3, Megane 2/3, Scenic, Duster, Sandero, Qashqai, Juke, Classe A W176',
    years: '2001 - 2012',
    fuel: 'Diesel',
    severity: 'media',
    defectSummary: 'Usura precoce delle bronzine di biella e grippaggio albero motore.',
    rootCause: 'Sui motori prodotti fino al 2011 le bronzine originali prive di piombo tendevano a consumarsi prematuramente a causa dei lunghi intervalli di cambio olio da 30.000 km raccomandati dalla casa.',
    symptoms: [
      'Ticchettio sordo e ritmico nella parte bassa del blocco motore che aumenta con i giri',
      'Luce pressione olio che si accende al minimo a motore caldo',
    ],
    estimatedRepairCost: '400 € - 700 € (sostituzione preventiva bronzine) / 2.000 € (se albero motore segnato)',
    preventionTip: 'Sostituisci preventivamente le bronzine di biella a 150.000 km (costo contenuto) e cambia l\'olio ogni 15.000 km. I motori dal 2012 in poi montano bronzine rinforzate prive di difetto.',
    relatedMakeSlug: 'renault',
  },
];

const FAQS = [
  {
    q: 'Come faccio a sapere se l\'auto che voglio comprare ha un motore a rischio?',
    a: 'Controlla il codice motore riportato al punto (P.5) del libretto di circolazione e verifica la corrispondenza con la scheda tecnica del modello. Con lo strumento di AutoEsperto puoi inserire marca e modello per visualizzare all\'istante l\'elenco di tutti i richiami e difetti noti.',
  },
  {
    q: 'Se un motore ha un difetto noto, significa che si romperà sicuramente?',
    a: 'No: molti difetti dipendono dalla manutenzione, dalla qualità dell\'olio utilizzato e dallo stile di guida. Tuttavia, conoscere il punto debole consente di effettuare interventi preventivi (es. misurazione cinghia, sostituzione kit catena o bronzine) prima che si trasformino in danni catastrofici.',
  },
  {
    q: 'La garanzia legale di conformità del concessionario copre questi difetti?',
    a: 'La garanzia di 12 o 24 mesi del rivenditore copre i guasti non imputabili a normale usura. Tuttavia, per essere tutelati è fondamentale pretendere lo storico dei tagliandi certificati e la scheda di conformità dello stato d\'uso prima della firma.',
  },
  {
    q: 'Quanto incide un motore con difetti noti sul valore di rivendita dell\'usato?',
    a: 'I modelli con problemi noti (come le versioni 1.2 PureTech a cinghia o 1.4 TSI Twincharger) subiscono una svalutazione più rapida sul mercato dell\'usato. Puoi sfruttare questo fattore per trattare sul prezzo di acquisto.',
  },
];

export default function MotoriProblemiClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('Tutti');
  const [selectedSeverity, setSelectedSeverity] = useState('Tutti');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const brandsList = useMemo(() => {
    const set = new Set<string>();
    ENGINES_DATA.forEach((e) => e.brands.forEach((b) => set.add(b)));
    return ['Tutti', ...Array.from(set).sort()];
  }, []);

  const filteredEngines = useMemo(() => {
    return ENGINES_DATA.filter((engine) => {
      const matchesSearch =
        searchTerm === '' ||
        engine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        engine.models.toLowerCase().includes(searchTerm.toLowerCase()) ||
        engine.defectSummary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        engine.brands.some((b) => b.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesBrand =
        selectedBrand === 'Tutti' || engine.brands.includes(selectedBrand);

      const matchesSeverity =
        selectedSeverity === 'Tutti' || engine.severity === selectedSeverity;

      return matchesSearch && matchesBrand && matchesSeverity;
    });
  }, [searchTerm, selectedBrand, selectedSeverity]);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-20">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-text-tertiary mb-6">
        <ol className="inline-flex items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-accent transition-colors">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <span className="text-text-secondary font-medium">Guida Problemi Motori Auto</span>
          </li>
        </ol>
      </nav>

      {/* Hero */}
      <header className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 border border-rose-200/80 px-3.5 py-1.5 text-xs font-bold text-rose-700 mb-4 shadow-sm">
          <Flame className="h-3.5 w-3.5" />
          I difetti storici più discussi dalla community
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
          Guida ai Problemi e Difetti dei Motori Noti
        </h1>
        <p className="mt-3.5 text-base sm:text-lg text-slate-600 leading-relaxed">
          L&apos;archivio tecnico indipendente dei <strong>motori e cambi con guasti ricorrenti</strong> sul mercato dell&apos;usato: cause, sintomi di avvertimento, costi di riparazione e come tutelarsi prima di comprare.
        </p>
      </header>

      {/* Search & Filter Bar */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-900/5 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cerca per motore, marca o modello (es. PureTech, Multijet, Golf, Clio)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50/50 pl-11 pr-4 py-3.5 text-sm font-medium text-slate-900 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>

          {/* Brand Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-slate-300 bg-slate-50/50 px-4 py-3.5 text-sm font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none"
            >
              {brandsList.map((brand) => (
                <option key={brand} value={brand}>
                  Marca: {brand}
                </option>
              ))}
            </select>
          </div>

          {/* Severity Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-slate-300 bg-slate-50/50 px-4 py-3.5 text-sm font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none"
            >
              <option value="Tutti">Gravità: Tutte</option>
              <option value="critica">Critica (rischio rottura)</option>
              <option value="alta">Alta (costi elevati)</option>
              <option value="media">Media (usura anticipata)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Results List */}
      <section className="space-y-8 mb-16">
        <div className="flex justify-between items-center text-xs font-bold text-slate-500">
          <span>Trovati {filteredEngines.length} motori analizzati</span>
          <span>Aggiornato con bollettini tecnici 2026</span>
        </div>

        {filteredEngines.map((engine) => {
          const severityBadge =
            engine.severity === 'critica'
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : engine.severity === 'alta'
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-blue-50 text-blue-700 border-blue-200';

          return (
            <div
              key={engine.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${severityBadge}`}>
                      Rischio {engine.severity}
                    </span>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                      {engine.fuel}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      Anni: {engine.years}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    {engine.name}
                  </h2>
                  <p className="text-xs sm:text-sm font-semibold text-emerald-700 mt-0.5">
                    {engine.commercialName}
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[11px] text-slate-400 uppercase font-bold block">Costo indicativo riparazione</span>
                  <span className="text-base font-black text-slate-900">{engine.estimatedRepairCost}</span>
                </div>
              </div>

              {/* Models tags */}
              <div className="mb-5 text-xs text-slate-600 bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
                <strong className="text-slate-800">Modelli coinvolti:</strong> {engine.models} ({engine.brands.join(', ')})
              </div>

              {/* Problem Description */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4 text-rose-500" /> Causa tecnica del difetto
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {engine.rootCause}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-amber-500" /> Sintomi premonitori da controllare
                  </h3>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {engine.symptoms.map((sym, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                        <span>{sym}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Prevention Advice */}
              <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-100 mb-6 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-950">
                  <strong>Cosa controllare prima dell&apos;acquisto / Manutenzione consigliata:</strong> {engine.preventionTip}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                <Link
                  href={`/affidabilita/${engine.relatedMakeSlug}`}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1.5"
                >
                  Tutti i difetti {engine.brands[0]} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href={`/valutazione/${engine.relatedMakeSlug}`}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-900"
                >
                  Quotazioni usate {engine.brands[0]}
                </Link>
              </div>
            </div>
          );
        })}
      </section>

      {/* FAQ Section */}
      <section className="mb-16 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 mb-2">
            <HelpCircle className="h-3.5 w-3.5" /> FAQ e Consigli
          </div>
          <h2 className="text-2xl font-black text-slate-900">Domande Frequenti sui Difetti Meccanici</h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div
              key={faq.q}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left font-bold text-sm text-slate-900 hover:text-emerald-700"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform ${
                    openFaq === idx ? 'rotate-180 text-emerald-600' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Hub CTA */}
      <section className="rounded-3xl bg-slate-900 p-8 sm:p-10 text-white text-center">
        <span className="grid h-12 w-12 mx-auto place-items-center rounded-2xl bg-emerald-500/20 text-emerald-400 mb-4">
          <Sparkles className="h-6 w-6" />
        </span>
        <h2 className="text-2xl sm:text-3xl font-black mb-3">
          Fai analizzare l&apos;auto dall&apos;intelligenza artificiale
        </h2>
        <p className="text-sm text-slate-300 max-w-xl mx-auto mb-6">
          Invia la foto o il link dell&apos;annuncio per scoprire subito se il prezzo è un buon affare e quali controlli specifici eseguire.
        </p>
        <Link
          href="/#scanner-section"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-900/40"
        >
          Analizza un&apos;auto gratis <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </main>
  );
}
