import { slugify } from './catalogo';

export type BodyType = 'citycar' | 'compatta' | 'berlina' | 'station_wagon' | 'suv' | 'monovolume' | 'coupe' | 'indifferente';
export type FuelType = 'benzina' | 'diesel' | 'hybrid' | 'plugin' | 'elettrica' | 'gpl' | 'metano' | 'indifferente';
export type TransmissionType = 'manuale' | 'automatico' | 'indifferente';
export type UsageType = 'citta' | 'misto' | 'extraurbano' | 'autostrada' | 'lavoro' | 'famiglia' | 'viaggi' | 'sportivo';
export type PriorityType = 'affidabilita' | 'prezzo' | 'consumi' | 'manutenzione' | 'prestazioni' | 'comfort' | 'spazio' | 'sicurezza' | 'rivendibilita';

export interface FinderCriteria {
  budgetMax: number;
  budgetMin?: number;
  usages: UsageType[];
  annualKm: number; // e.g. 8000, 12000, 18000, 25000, 35000
  fuel: FuelType;
  transmission: TransmissionType;
  maxKm?: number;
  minYear?: number;
  bodyTypes: BodyType[];
  priorities: PriorityType[]; // max 3
  location?: {
    city?: string;
    province?: string;
    radiusKm?: number;
  };
  freeText?: string;
}

export interface VehicleProfile {
  id: string;
  make: string;
  model: string;
  segment: 'A' | 'B' | 'C' | 'D' | 'SUV' | 'Sport';
  bodyType: BodyType;
  availableFuels: FuelType[];
  transmissions: ('manuale' | 'automatico')[];
  priceMin: number; // Prezzo mercato usato tipico recente
  priceAvg: number;
  priceMax: number;
  yearMinTypical: number;
  typicalKmRange: [number, number];
  reliabilityScore: number; // 0 - 10
  annualMaintenanceEst: number; // €
  litersPer100Km: number; // Consumo medio combinato
  spaceRating: number; // 1 - 5
  comfortRating: number; // 1 - 5
  safetyRating: number; // 1 - 5
  resaleRating: number; // 1 - 5 (tenuta del valore)
  idealForUsages: UsageType[];
  reasonsToBuy: string[];
  warningNotice?: string;
  recommendedEngines: string[];
  enginesToAvoid?: string[];
  imageUrl: string;
}

export interface MatchSubScores {
  budget: number; // 0 - 100
  usage: number; // 0 - 100
  reliability: number; // 0 - 100
  consumption: number; // 0 - 100
  maintenance: number; // 0 - 100
  space: number; // 0 - 100
}

export interface FinderMatchResult {
  vehicle: VehicleProfile;
  matchScore: number; // 0 - 100
  badgeCategory?: 'best_overall' | 'best_value' | 'best_reliability' | 'standard';
  subScores: MatchSubScores;
  whySuitsYou: string[];
  warning?: string;
  estimatedPriceRange: [number, number];
  suggestedOfferRange: [number, number];
  isOverBudget?: boolean;
}

export const VEHICLE_DATABASE: VehicleProfile[] = [
  {
    id: 'toyota-yaris',
    make: 'Toyota',
    model: 'Yaris',
    segment: 'B',
    bodyType: 'compatta',
    availableFuels: ['hybrid', 'benzina'],
    transmissions: ['automatico', 'manuale'],
    priceMin: 8500,
    priceAvg: 12500,
    priceMax: 18500,
    yearMinTypical: 2016,
    typicalKmRange: [30000, 120000],
    reliabilityScore: 9.6,
    annualMaintenanceEst: 190,
    litersPer100Km: 4.1,
    spaceRating: 3.5,
    comfortRating: 4.0,
    safetyRating: 4.8,
    resaleRating: 4.9,
    idealForUsages: ['citta', 'misto', 'lavoro'],
    reasonsToBuy: [
      'Affidabilità leggendaria del sistema ibrido Toyota',
      'Consumi record in ambito urbano (oltre 24 km/L reali)',
      'Altissima tenuta del valore sul mercato dell\'usato',
      'Costi di manutenzione e usura freni ridotti al minimo'
    ],
    warningNotice: 'Lo spazio per i passeggeri posteriori e il bagagliaio sono compatti rispetto a una station wagon.',
    recommendedEngines: ['1.5 Hybrid 116 CV / 100 CV', '1.0 VVT-i 72 CV'],
    imageUrl: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'fiat-panda',
    make: 'Fiat',
    model: 'Panda',
    segment: 'A',
    bodyType: 'citycar',
    availableFuels: ['benzina', 'hybrid', 'gpl', 'metano'],
    transmissions: ['manuale'],
    priceMin: 5500,
    priceAvg: 9200,
    priceMax: 14500,
    yearMinTypical: 2015,
    typicalKmRange: [25000, 130000],
    reliabilityScore: 8.8,
    annualMaintenanceEst: 150,
    litersPer100Km: 5.2,
    spaceRating: 3.2,
    comfortRating: 3.4,
    safetyRating: 3.5,
    resaleRating: 4.8,
    idealForUsages: ['citta', 'misto', 'lavoro'],
    reasonsToBuy: [
      'L\'auto con i costi di ricambi e gestione più bassi in Italia',
      'Facilissima da parcheggiare e visibilità ottima',
      'Richiestissima: si rivende in pochi giorni a prezzo solido',
      'Motore 1.2 Fire indistruttibile ed economico da riparare'
    ],
    warningNotice: 'Insonorizzazione e comfort limitati alle alte velocità autostradali.',
    recommendedEngines: ['1.2 Fire 69 CV', '1.0 FireFly Hybrid 70 CV'],
    imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'fiat-500',
    make: 'Fiat',
    model: '500',
    segment: 'A',
    bodyType: 'citycar',
    availableFuels: ['benzina', 'hybrid', 'gpl', 'elettrica'],
    transmissions: ['manuale', 'automatico'],
    priceMin: 6500,
    priceAvg: 10800,
    priceMax: 17500,
    yearMinTypical: 2015,
    typicalKmRange: [25000, 110000],
    reliabilityScore: 8.7,
    annualMaintenanceEst: 160,
    litersPer100Km: 5.0,
    spaceRating: 2.8,
    comfortRating: 3.6,
    safetyRating: 3.8,
    resaleRating: 4.9,
    idealForUsages: ['citta', 'misto'],
    reasonsToBuy: [
      'Design iconico senza tempo con valore che non si svaluta',
      'Dimensioni perfette per i centri storici e parcheggi stretti',
      'Meccanica collaudata con manutenzione molto accessibile'
    ],
    warningNotice: '3 porte con accesso posteriore e bagagliaio limitati.',
    recommendedEngines: ['1.2 Fire 69 CV', '1.0 Hybrid 70 CV'],
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'volkswagen-golf',
    make: 'Volkswagen',
    model: 'Golf',
    segment: 'C',
    bodyType: 'compatta',
    availableFuels: ['diesel', 'benzina', 'hybrid', 'metano'],
    transmissions: ['manuale', 'automatico'],
    priceMin: 10500,
    priceAvg: 16800,
    priceMax: 27000,
    yearMinTypical: 2015,
    typicalKmRange: [40000, 160000],
    reliabilityScore: 8.9,
    annualMaintenanceEst: 230,
    litersPer100Km: 4.8,
    spaceRating: 4.2,
    comfortRating: 4.7,
    safetyRating: 4.9,
    resaleRating: 4.7,
    idealForUsages: ['autostrada', 'viaggi', 'misto', 'famiglia', 'lavoro'],
    reasonsToBuy: [
      'Comfort acustico e qualità degli interni da riferimento',
      'Eccezionale nei lunghi viaggi autostradali con consumi contenuti (TDI)',
      'Equilibrio perfetto tra spazio a bordo e dimensioni esterne',
      'Grande sicurezza attiva e passiva'
    ],
    warningNotice: 'Tagliandi e ricambi presso rete ufficiale con costo superiore alle utilitarie.',
    recommendedEngines: ['2.0 TDI 115/150 CV', '1.5 TSI 130/150 CV'],
    imageUrl: 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'renault-clio',
    make: 'Renault',
    model: 'Clio',
    segment: 'B',
    bodyType: 'compatta',
    availableFuels: ['benzina', 'gpl', 'hybrid', 'diesel'],
    transmissions: ['manuale', 'automatico'],
    priceMin: 7000,
    priceAvg: 11500,
    priceMax: 17000,
    yearMinTypical: 2016,
    typicalKmRange: [30000, 130000],
    reliabilityScore: 8.9,
    annualMaintenanceEst: 180,
    litersPer100Km: 4.7,
    spaceRating: 3.9,
    comfortRating: 4.2,
    safetyRating: 4.7,
    resaleRating: 4.4,
    idealForUsages: ['citta', 'misto', 'lavoro', 'famiglia'],
    reasonsToBuy: [
      'Versione GPL di fabbrica (TCe 100) con costi al chilometro imbattibili',
      'Bagagliaio tra i più capienti della categoria B (391 litri)',
      'Ottimo assorbimento delle asperità stradali',
      'Interni moderni con schermo touch intuitivo'
    ],
    warningNotice: 'Visibilità posteriore parziale in manovra: utile la retrocamera.',
    recommendedEngines: ['1.0 TCe GPL 100 CV', '1.5 dCi 85/115 CV', '1.6 E-Tech Hybrid 140 CV'],
    imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'peugeot-208',
    make: 'Peugeot',
    model: '208',
    segment: 'B',
    bodyType: 'compatta',
    availableFuels: ['benzina', 'diesel', 'elettrica', 'hybrid'],
    transmissions: ['manuale', 'automatico'],
    priceMin: 7500,
    priceAvg: 12200,
    priceMax: 18500,
    yearMinTypical: 2016,
    typicalKmRange: [30000, 125000],
    reliabilityScore: 8.3,
    annualMaintenanceEst: 200,
    litersPer100Km: 4.6,
    spaceRating: 3.6,
    comfortRating: 4.4,
    safetyRating: 4.6,
    resaleRating: 4.5,
    idealForUsages: ['citta', 'misto', 'sportivo'],
    reasonsToBuy: [
      'Design esterno audace con fari LED a zanna di leone',
      'i-Cockpit con volante compatto e guida agile e divertente',
      'Disponibile anche 100% elettrica (e-208) con ricarica rapida'
    ],
    warningNotice: 'Sui motori 1.2 PureTech a benzina ante-2023 controllare attentamente lo storico sostituzione cinghia di distribuzione a bagno d\'olio.',
    recommendedEngines: ['1.5 BlueHDi 100 CV', '1.2 PureTech 100 CV (post-2022 o con catena)', 'e-208 136 CV'],
    enginesToAvoid: ['1.2 PureTech 2014-2019 senza manutenzione certificata'],
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'ford-puma',
    make: 'Ford',
    model: 'Puma',
    segment: 'SUV',
    bodyType: 'suv',
    availableFuels: ['hybrid', 'benzina', 'diesel'],
    transmissions: ['manuale', 'automatico'],
    priceMin: 13500,
    priceAvg: 18500,
    priceMax: 25000,
    yearMinTypical: 2020,
    typicalKmRange: [20000, 90000],
    reliabilityScore: 9.1,
    annualMaintenanceEst: 210,
    litersPer100Km: 5.3,
    spaceRating: 4.4,
    comfortRating: 4.3,
    safetyRating: 4.8,
    resaleRating: 4.7,
    idealForUsages: ['misto', 'famiglia', 'citta', 'viaggi'],
    reasonsToBuy: [
      'MegaBox lavabile nel fondo del bagagliaio: praticità unica per la famiglia',
      'Assetto dinamico e divertente, il migliore tra i B-SUV',
      'Motore EcoBoost Hybrid brillante e con consumi moderati',
      'Posizione di guida rialzata con ottima visuale'
    ],
    recommendedEngines: ['1.0 EcoBoost Hybrid 125 CV / 155 CV'],
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'jeep-renegade',
    make: 'Jeep',
    model: 'Renegade',
    segment: 'SUV',
    bodyType: 'suv',
    availableFuels: ['diesel', 'benzina', 'hybrid', 'plugin'],
    transmissions: ['manuale', 'automatico'],
    priceMin: 11000,
    priceAvg: 16500,
    priceMax: 24000,
    yearMinTypical: 2016,
    typicalKmRange: [40000, 140000],
    reliabilityScore: 8.8,
    annualMaintenanceEst: 240,
    litersPer100Km: 5.7,
    spaceRating: 4.3,
    comfortRating: 4.4,
    safetyRating: 4.7,
    resaleRating: 4.6,
    idealForUsages: ['famiglia', 'viaggi', 'misto', 'lavoro'],
    reasonsToBuy: [
      'Stile squadrato da vero SUV con abitabilità verticale eccezionale',
      'Disponibile anche con trazione integrale 4x4 o 4xe ibrida plug-in',
      'Motori diesel Multijet 1.6 e 2.0 solidissimi sui lunghi chilometraggi',
      'Grande facilità di accesso all\'abitacolo per seggiolini e bagagli'
    ],
    warningNotice: 'La forma squadrata aumenta la resistenza aerodinamica e i fruscii oltre i 120 km/h.',
    recommendedEngines: ['1.6 MultiJet 120 CV / 130 CV', '1.3 T4 150 CV', '1.5 e-Hybrid 130 CV'],
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'dacia-duster',
    make: 'Dacia',
    model: 'Duster',
    segment: 'SUV',
    bodyType: 'suv',
    availableFuels: ['gpl', 'diesel', 'benzina', 'hybrid'],
    transmissions: ['manuale', 'automatico'],
    priceMin: 8500,
    priceAvg: 13500,
    priceMax: 19500,
    yearMinTypical: 2016,
    typicalKmRange: [35000, 130000],
    reliabilityScore: 9.0,
    annualMaintenanceEst: 170,
    litersPer100Km: 5.5,
    spaceRating: 4.6,
    comfortRating: 3.9,
    safetyRating: 4.1,
    resaleRating: 4.9,
    idealForUsages: ['famiglia', 'lavoro', 'viaggi', 'misto'],
    reasonsToBuy: [
      'Il miglior rapporto spazio/prezzo tra tutti i SUV sul mercato',
      'Versione ECO-G a GPL con oltre 1.000 km di autonomia combinata',
      'Altezza da terra generosa per strade dissestate e campagna',
      'Costi di manutenzione e ricambi estremamente economici'
    ],
    recommendedEngines: ['1.0 TCe ECO-G GPL 100 CV', '1.5 dCi 115 CV 4x2 / 4x4'],
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'dacia-sandero',
    make: 'Dacia',
    model: 'Sandero',
    segment: 'B',
    bodyType: 'compatta',
    availableFuels: ['gpl', 'benzina'],
    transmissions: ['manuale', 'automatico'],
    priceMin: 6500,
    priceAvg: 10500,
    priceMax: 15500,
    yearMinTypical: 2017,
    typicalKmRange: [25000, 110000],
    reliabilityScore: 9.1,
    annualMaintenanceEst: 155,
    litersPer100Km: 5.3,
    spaceRating: 4.2,
    comfortRating: 3.8,
    safetyRating: 4.0,
    resaleRating: 4.8,
    idealForUsages: ['citta', 'misto', 'famiglia', 'lavoro'],
    reasonsToBuy: [
      'Prezzo di acquisto e costi di gestione più bassi della categoria',
      'Versione Stepway con look crossover molto apprezzato',
      'Impianto GPL affidabile e integrato nei dati del computer di bordo',
      'Abitacolo spazioso per 4-5 persone'
    ],
    recommendedEngines: ['1.0 TCe ECO-G 100 CV', '1.0 SCe 65 CV (per neopatentati)'],
    imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'honda-jazz',
    make: 'Honda',
    model: 'Jazz',
    segment: 'B',
    bodyType: 'monovolume',
    availableFuels: ['hybrid', 'benzina'],
    transmissions: ['automatico', 'manuale'],
    priceMin: 8000,
    priceAvg: 13500,
    priceMax: 21000,
    yearMinTypical: 2016,
    typicalKmRange: [30000, 110000],
    reliabilityScore: 9.8,
    annualMaintenanceEst: 185,
    litersPer100Km: 4.3,
    spaceRating: 4.8,
    comfortRating: 4.5,
    safetyRating: 4.9,
    resaleRating: 4.5,
    idealForUsages: ['famiglia', 'citta', 'misto', 'viaggi'],
    reasonsToBuy: [
      'In assoluto una delle auto più affidabili e prive di guasti al mondo',
      'Sedili Magic Seats posteriori che si ribaltano verticalmente: capienza da furgoncino',
      'Consumi ibridi e-HEV bassissimi in città e percorso misto',
      'Abitacolo luminosissimo con montanti sottili e visibilità perfetta'
    ],
    recommendedEngines: ['1.5 e:HEV Full Hybrid 109/122 CV', '1.3 i-VTEC 102 CV'],
    imageUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'ford-focus',
    make: 'Ford',
    model: 'Focus',
    segment: 'C',
    bodyType: 'station_wagon',
    availableFuels: ['diesel', 'benzina', 'hybrid'],
    transmissions: ['manuale', 'automatico'],
    priceMin: 9000,
    priceAvg: 15200,
    priceMax: 22000,
    yearMinTypical: 2016,
    typicalKmRange: [40000, 150000],
    reliabilityScore: 8.9,
    annualMaintenanceEst: 215,
    litersPer100Km: 4.7,
    spaceRating: 4.9,
    comfortRating: 4.6,
    safetyRating: 4.9,
    resaleRating: 4.3,
    idealForUsages: ['famiglia', 'autostrada', 'viaggi', 'lavoro'],
    reasonsToBuy: [
      'Versione Station Wagon con bagagliaio immenso (oltre 600 litri)',
      'Guida tra le più precise e piacevoli della categoria',
      'Motori EcoBlue diesel perfetti per chi fa oltre 20.000 km all\'anno',
      'Ottimo rapporto contenuti tecnologici/prezzo sull\'usato'
    ],
    recommendedEngines: ['1.5 EcoBlue Diesel 120 CV', '1.0 EcoBoost Hybrid 125 CV'],
    imageUrl: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'volkswagen-tiguan',
    make: 'Volkswagen',
    model: 'Tiguan',
    segment: 'SUV',
    bodyType: 'suv',
    availableFuels: ['diesel', 'benzina', 'hybrid', 'plugin'],
    transmissions: ['automatico', 'manuale'],
    priceMin: 14500,
    priceAvg: 22500,
    priceMax: 34000,
    yearMinTypical: 2016,
    typicalKmRange: [40000, 150000],
    reliabilityScore: 8.8,
    annualMaintenanceEst: 270,
    litersPer100Km: 5.4,
    spaceRating: 4.9,
    comfortRating: 4.8,
    safetyRating: 5.0,
    resaleRating: 4.8,
    idealForUsages: ['famiglia', 'viaggi', 'autostrada', 'misto'],
    reasonsToBuy: [
      'Il SUV familiare medio di riferimento per qualità e sicurezza',
      'Spazio posteriore regale con divano scorrevole e bagagliaio da 615 litri',
      'Insonorizzazione e comfort da vettura di categoria superiore',
      'Trazione integrale 4Motion eccellente per montagna e pioggia'
    ],
    recommendedEngines: ['2.0 TDI 150 CV DSG', '1.5 TSI 150 CV'],
    imageUrl: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'bmw-serie-1',
    make: 'BMW',
    model: 'Serie 1',
    segment: 'C',
    bodyType: 'compatta',
    availableFuels: ['diesel', 'benzina'],
    transmissions: ['automatico', 'manuale'],
    priceMin: 11500,
    priceAvg: 18500,
    priceMax: 28000,
    yearMinTypical: 2016,
    typicalKmRange: [40000, 140000],
    reliabilityScore: 8.7,
    annualMaintenanceEst: 280,
    litersPer100Km: 5.0,
    spaceRating: 3.7,
    comfortRating: 4.6,
    safetyRating: 4.8,
    resaleRating: 4.7,
    idealForUsages: ['sportivo', 'autostrada', 'misto', 'lavoro'],
    reasonsToBuy: [
      'Piacere di guida e dinamica telaistica premium al vertice',
      'Cambio automatico Steptronic a 8 rapporti fulmineo e fluido',
      'Motori diesel 2.0 (118d/120d) potenti ed estremamente parsimoniosi',
      'Finiture e materiali dell\'abitacolo di altissimo livello'
    ],
    warningNotice: 'Costi di manutenzione e tagliandi più elevati rispetto a marchi generalisti.',
    recommendedEngines: ['118d 150 CV', '118i 136/140 CV'],
    imageUrl: 'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'hyundai-i10',
    make: 'Hyundai',
    model: 'i10',
    segment: 'A',
    bodyType: 'citycar',
    availableFuels: ['benzina', 'gpl'],
    transmissions: ['manuale', 'automatico'],
    priceMin: 6000,
    priceAvg: 9800,
    priceMax: 14000,
    yearMinTypical: 2016,
    typicalKmRange: [20000, 95000],
    reliabilityScore: 9.3,
    annualMaintenanceEst: 160,
    litersPer100Km: 5.0,
    spaceRating: 3.7,
    comfortRating: 3.9,
    safetyRating: 4.3,
    resaleRating: 4.4,
    idealForUsages: ['citta', 'misto', 'lavoro'],
    reasonsToBuy: [
      'La city car 5 posti più spaziosa e rifinita del segmento',
      '5 anni di garanzia originaria con affidabilità complessiva eccellente',
      'Consumi contenuti e facilità di guida disarmante',
      'Tecnologia di bordo con Apple CarPlay e Android Auto su molti allestimenti'
    ],
    recommendedEngines: ['1.0 MPI 67 CV', '1.0 GPL 67 CV', '1.2 MPI 84 CV'],
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'skoda-octavia',
    make: 'Skoda',
    model: 'Octavia',
    segment: 'D',
    bodyType: 'station_wagon',
    availableFuels: ['diesel', 'benzina', 'metano', 'hybrid'],
    transmissions: ['manuale', 'automatico'],
    priceMin: 11000,
    priceAvg: 17500,
    priceMax: 26000,
    yearMinTypical: 2016,
    typicalKmRange: [40000, 160000],
    reliabilityScore: 9.2,
    annualMaintenanceEst: 220,
    litersPer100Km: 4.6,
    spaceRating: 5.0,
    comfortRating: 4.7,
    safetyRating: 5.0,
    resaleRating: 4.6,
    idealForUsages: ['famiglia', 'viaggi', 'autostrada', 'lavoro'],
    reasonsToBuy: [
      'Il re indiscusso dei bagagliai: 640 litri di capacità e soluzioni Simply Clever',
      'Meccanica e pianale identici a Volkswagen Golf e Passat a prezzo più accessibile',
      'Comfort da ammiraglia nei lunghi viaggi autostradali',
      'Consumi del 2.0 TDI che superano facilmente i 20 km/L reali'
    ],
    recommendedEngines: ['2.0 TDI 115/150 CV', '1.5 TSI / e-TEC 150 CV', '1.5 G-TEC Metano 130 CV'],
    imageUrl: 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'toyota-c-hr',
    make: 'Toyota',
    model: 'C-HR',
    segment: 'SUV',
    bodyType: 'suv',
    availableFuels: ['hybrid', 'plugin'],
    transmissions: ['automatico'],
    priceMin: 13500,
    priceAvg: 19500,
    priceMax: 27000,
    yearMinTypical: 2017,
    typicalKmRange: [30000, 120000],
    reliabilityScore: 9.5,
    annualMaintenanceEst: 205,
    litersPer100Km: 4.4,
    spaceRating: 3.9,
    comfortRating: 4.6,
    safetyRating: 4.9,
    resaleRating: 4.8,
    idealForUsages: ['citta', 'misto', 'viaggi', 'famiglia'],
    reasonsToBuy: [
      'Look coupé-crossover futuristico con tecnologia Full Hybrid di 4ª e 5ª generazione',
      'Affidabilità Toyota ai massimi livelli mondiali con garanzia Relax fino a 15 anni',
      'Consumi sorprendentemente bassi anche in città trafficate',
      'Dotazione ADAS di sicurezza attiva completa su tutte le versioni'
    ],
    warningNotice: 'I finestrini posteriori piccoli riducono la luminosità per i passeggeri dietro.',
    recommendedEngines: ['1.8 Hybrid 122/140 CV', '2.0 Hybrid 184/197 CV'],
    imageUrl: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'suzuki-swift',
    make: 'Suzuki',
    model: 'Swift',
    segment: 'B',
    bodyType: 'compatta',
    availableFuels: ['hybrid', 'benzina', 'gpl'],
    transmissions: ['manuale', 'automatico'],
    priceMin: 7500,
    priceAvg: 12000,
    priceMax: 16500,
    yearMinTypical: 2017,
    typicalKmRange: [20000, 100000],
    reliabilityScore: 9.4,
    annualMaintenanceEst: 175,
    litersPer100Km: 4.5,
    spaceRating: 3.5,
    comfortRating: 4.0,
    safetyRating: 4.5,
    resaleRating: 4.6,
    idealForUsages: ['citta', 'misto', 'sportivo'],
    reasonsToBuy: [
      'Peso piuma (sotto i 1.000 kg): guida scattante, divertente e consumi minuscoli',
      'Disponibile con vera trazione integrale 4x4 AllGrip nella categoria B',
      'Affidabilità giapponese eccellente e tecnologia ibrida leggera semplice',
      'Ricca dotazione di serie con fari LED e sistemi di assistenza'
    ],
    recommendedEngines: ['1.2 Dualjet Hybrid 83/90 CV', '1.4 Boosterjet Sport 129/140 CV'],
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
  }
];

export function runAutoFinder(criteria: FinderCriteria): {
  matches: FinderMatchResult[];
  totalEvaluated: number;
  infeasibleNotice?: {
    reason: string;
    suggestion: string;
  };
} {
  const {
    budgetMax,
    budgetMin = 0,
    usages = [],
    annualKm = 12000,
    fuel = 'indifferente',
    transmission = 'indifferente',
    maxKm,
    minYear,
    bodyTypes = [],
    priorities = [],
    freeText = ''
  } = criteria;

  // NLP Free Text Enhancer: Detect additional intent from free text
  const textLower = freeText.toLowerCase();
  const wantsSpacious = textLower.includes('spazio') || textLower.includes('famiglia') || textLower.includes('4 persone') || textLower.includes('5 persone') || textLower.includes('bambin') || textLower.includes('passeggin');
  const wantsLowMaintenance = textLower.includes('manutenzion') || textLower.includes('spend') || textLower.includes('econom');
  const wantsReliable = textLower.includes('affidab') || textLower.includes('sicur') || textLower.includes('non mi lasci a piedi');
  const wantsGpl = textLower.includes('gpl') || textLower.includes('gas');
  const wantsAutomatic = textLower.includes('automat');

  const evaluated: FinderMatchResult[] = [];

  for (const car of VEHICLE_DATABASE) {
    let score = 70; // Base score
    const whyList: string[] = [];

    // 1. BUDGET SCORING (Hard + Soft)
    let budgetScore = 100;
    const isOverBudget = car.priceMin > budgetMax;

    if (isOverBudget) {
      const diffPct = ((car.priceMin - budgetMax) / budgetMax) * 100;
      budgetScore = Math.max(0, 100 - diffPct * 3.5);
      score -= Math.min(45, diffPct * 2);
    } else {
      // Car fits budget perfectly
      const headroom = budgetMax - car.priceAvg;
      if (headroom >= 0) {
        budgetScore = 95 + Math.min(5, Math.round(headroom / 1000));
        score += 8;
        whyList.push(`Rientra ampiamente nel tuo budget di spesa (prezzo medio: €${car.priceAvg.toLocaleString('it-IT')})`);
      } else {
        budgetScore = 85;
      }
    }

    // 2. USAGE SCORING
    let usageScore = 75;
    const matchedUsages = usages.filter(u => car.idealForUsages.includes(u));
    if (matchedUsages.length > 0) {
      usageScore = 85 + (matchedUsages.length / Math.max(1, usages.length)) * 15;
      score += 10;
      if (usages.includes('citta') && car.idealForUsages.includes('citta')) {
        whyList.push('Dimensioni e maneggevolezza ideali per l\'uso urbano e parcheggi');
      }
      if (usages.includes('autostrada') && car.idealForUsages.includes('autostrada')) {
        whyList.push('Grande stabilità, insonorizzazione e comfort sulle lunghe tratte autostradali');
      }
      if ((usages.includes('famiglia') || wantsSpacious) && (car.spaceRating >= 4.0 || car.bodyType === 'suv' || car.bodyType === 'station_wagon')) {
        whyList.push('Abitacolo e bagagliaio generosi per le esigenze di tutta la famiglia');
      }
    }

    // 3. FUEL & ANNUAL KM SCORING
    let fuelScore = 80;
    const isHighKm = annualKm >= 20000;
    const isLowKm = annualKm <= 10000;

    if (fuel !== 'indifferente') {
      if (car.availableFuels.includes(fuel)) {
        fuelScore = 98;
        score += 8;
      } else {
        fuelScore = 40;
        score -= 20;
      }
    } else {
      // Auto-recommendation based on annual mileage
      if (isHighKm && (car.availableFuels.includes('diesel') || car.availableFuels.includes('gpl') || car.availableFuels.includes('hybrid'))) {
        fuelScore = 95;
        score += 6;
        whyList.push(`I motori disponibili (${car.availableFuels.join('/')}) sono ideali per i tuoi ${annualKm.toLocaleString('it-IT')} km all'anno`);
      } else if (isLowKm && (car.availableFuels.includes('benzina') || car.availableFuels.includes('hybrid'))) {
        fuelScore = 94;
        score += 5;
      }
    }

    // 4. TRANSMISSION SCORING
    if (transmission !== 'indifferente' || wantsAutomatic) {
      const targetTrans = wantsAutomatic ? 'automatico' : transmission;
      if (car.transmissions.includes(targetTrans as any)) {
        score += 5;
      } else {
        score -= 15;
      }
    }

    // 5. BODY TYPE SCORING
    let spaceScore = Math.round((car.spaceRating / 5) * 100);
    if (bodyTypes.length > 0 && !bodyTypes.includes('indifferente')) {
      if (bodyTypes.includes(car.bodyType)) {
        score += 10;
      } else {
        score -= 14;
      }
    }

    // 6. RELIABILITY & MAINTENANCE SCORING
    const reliabilityScorePct = Math.round(car.reliabilityScore * 10);
    let maintenanceScore = Math.max(50, 100 - Math.round((car.annualMaintenanceEst - 140) / 3));

    if (car.reliabilityScore >= 9.0) {
      whyList.push(`Punteggio affidabilità eccellente (${car.reliabilityScore}/10) con bassissima frequenza di guasti`);
    }

    if (car.annualMaintenanceEst <= 190 || wantsLowMaintenance) {
      whyList.push(`Costi di manutenzione stimati molto contenuti (circa €${car.annualMaintenanceEst}/anno)`);
    }

    // 7. USER PRIORITIES WEIGHTING (Max 3 priorities selected)
    for (const prio of priorities) {
      if (prio === 'affidabilita') {
        score += (car.reliabilityScore - 8.0) * 8;
      } else if (prio === 'consumi') {
        score += (6.0 - car.litersPer100Km) * 8;
      } else if (prio === 'manutenzione') {
        score += (260 - car.annualMaintenanceEst) * 0.12;
      } else if (prio === 'spazio') {
        score += (car.spaceRating - 3.0) * 7;
      } else if (prio === 'prezzo') {
        score += budgetScore > 90 ? 8 : 0;
      } else if (prio === 'rivendibilita') {
        score += (car.resaleRating - 3.5) * 8;
      } else if (prio === 'comfort') {
        score += (car.comfortRating - 3.0) * 7;
      } else if (prio === 'sicurezza') {
        score += (car.safetyRating - 3.5) * 7;
      }
    }

    // Free text NLP boosts
    if (wantsGpl && car.availableFuels.includes('gpl')) score += 12;
    if (wantsReliable && car.reliabilityScore >= 9.2) score += 10;

    // Normalizing final Match Score to 0-100
    const finalScore = Math.min(99, Math.max(25, Math.round(score)));

    // Offer Price logic
    const estMin = Math.max(car.priceMin, Math.round(car.priceAvg * 0.88));
    const estMax = Math.min(car.priceMax, Math.round(car.priceAvg * 1.12));
    const offerMin = Math.round(estMin * 0.94);
    const offerMax = Math.round(estMin * 0.98);

    // Guarantee at least 2 distinct why points
    if (whyList.length < 2) {
      whyList.push(...car.reasonsToBuy.slice(0, 2));
    }

    evaluated.push({
      vehicle: car,
      matchScore: finalScore,
      isOverBudget,
      subScores: {
        budget: Math.min(100, Math.max(10, Math.round(budgetScore))),
        usage: Math.min(100, Math.max(20, Math.round(usageScore))),
        reliability: reliabilityScorePct,
        consumption: Math.min(100, Math.max(30, Math.round(100 - car.litersPer100Km * 8.5))),
        maintenance: Math.min(100, Math.max(30, Math.round(maintenanceScore))),
        space: spaceScore,
      },
      whySuitsYou: Array.from(new Set(whyList)).slice(0, 4),
      warning: car.warningNotice,
      estimatedPriceRange: [estMin, estMax],
      suggestedOfferRange: [offerMin, offerMax],
    });
  }

  // Sort by match score descending
  evaluated.sort((a, b) => b.matchScore - a.matchScore);

  // Assign Top 3 Badges
  if (evaluated.length >= 3) {
    evaluated[0].badgeCategory = 'best_overall';

    // Find best value (highest budget + maintenance subscore)
    const bestValueCandidate = evaluated.slice(1).reduce((best, curr) => {
      const currVal = curr.subScores.budget + curr.subScores.maintenance;
      const bestVal = best.subScores.budget + best.subScores.maintenance;
      return currVal > bestVal ? curr : best;
    }, evaluated[1]);
    bestValueCandidate.badgeCategory = 'best_value';

    // Find best reliability
    const bestRelCandidate = evaluated
      .filter(e => e.badgeCategory !== 'best_overall' && e.badgeCategory !== 'best_value')
      .reduce((best, curr) => (curr.vehicle.reliabilityScore > best.vehicle.reliabilityScore ? curr : best), evaluated[2]);
    if (bestRelCandidate) {
      bestRelCandidate.badgeCategory = 'best_reliability';
    }
  }

  // Detect Infeasible criteria
  let infeasibleNotice: { reason: string; suggestion: string } | undefined;
  const goodMatches = evaluated.filter(e => e.matchScore >= 70 && !e.isOverBudget);

  if (goodMatches.length === 0) {
    const minNeededBudget = Math.min(...evaluated.map(e => e.vehicle.priceMin));
    if (budgetMax < minNeededBudget) {
      infeasibleNotice = {
        reason: `Con un budget massimo di €${budgetMax.toLocaleString('it-IT')} e i filtri selezionati, l'offerta di auto usate affidabili è estremamente ristretta.`,
        suggestion: `Ti suggeriamo di aumentare il budget a circa €${minNeededBudget.toLocaleString('it-IT')} oppure di valutare modelli con oltre 120.000 km con manutenzione certificata.`
      };
    } else {
      infeasibleNotice = {
        reason: 'La combinazione di filtri (carburante specifico, carrozzeria e anno) è molto restrittiva.',
        suggestion: 'Ti consigliamo di impostare "Alimentazione: Indifferente" o di allargare i tipi di carrozzeria compatibili.'
      };
    }
  }

  return {
    matches: evaluated,
    totalEvaluated: VEHICLE_DATABASE.length,
    infeasibleNotice,
  };
}

export function quickTweakCriteria(
  current: FinderCriteria,
  tweakType: 'spend_less' | 'more_space' | 'want_suv' | 'lower_consumption' | 'max_reliability'
): FinderCriteria {
  const updated = { ...current };

  switch (tweakType) {
    case 'spend_less':
      updated.budgetMax = Math.max(5000, Math.round(updated.budgetMax * 0.8));
      updated.priorities = Array.from(new Set(['prezzo', ...updated.priorities])).slice(0, 3) as PriorityType[];
      break;
    case 'more_space':
      updated.bodyTypes = ['suv', 'station_wagon', 'monovolume'];
      updated.priorities = Array.from(new Set(['spazio', ...updated.priorities])).slice(0, 3) as PriorityType[];
      break;
    case 'want_suv':
      updated.bodyTypes = ['suv'];
      break;
    case 'lower_consumption':
      updated.fuel = 'hybrid';
      updated.priorities = Array.from(new Set(['consumi', ...updated.priorities])).slice(0, 3) as PriorityType[];
      break;
    case 'max_reliability':
      updated.priorities = Array.from(new Set(['affidabilita', ...updated.priorities])).slice(0, 3) as PriorityType[];
      break;
  }

  return updated;
}
