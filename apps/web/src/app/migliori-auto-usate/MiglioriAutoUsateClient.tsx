'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Trophy,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Filter,
  Car,
  Fuel,
  CreditCard,
  Layers,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';

interface CarChoice {
  make: string;
  makeSlug: string;
  model: string;
  modelSlug: string;
  version: string;
  years: string;
  budgetBracket: 'under5k' | '5k-10k' | '10k-15k' | '15k-20k';
  bodyType: 'citycar' | 'suv' | 'berlina-sw';
  fuel: 'Benzina' | 'Ibrida' | 'Diesel' | 'GPL';
  priceEstimate: string;
  consumptionKmPerL: number;
  whyBuy: string;
  whatToCheck: string;
  ratingScore: number;
}

const BEST_CARS: CarChoice[] = [
  // Under 5k
  {
    make: 'Fiat',
    makeSlug: 'fiat',
    model: 'Panda',
    modelSlug: 'panda',
    version: '1.2 Fire 60/69 CV (Serie 2 & 3)',
    years: '2008 - 2015',
    budgetBracket: 'under5k',
    bodyType: 'citycar',
    fuel: 'Benzina',
    priceEstimate: '3.500 € - 4.900 €',
    consumptionKmPerL: 17.5,
    whyBuy: 'Meccanica Fire indistruttibile, ricambi reperibili ovunque a costo irrisorio.',
    whatToCheck: 'Frizione, servosterzo elettrico (funzione City), stato ammortizzatori posteriori.',
    ratingScore: 92,
  },
  {
    make: 'Toyota',
    makeSlug: 'toyota',
    model: 'Yaris',
    modelSlug: 'yaris',
    version: '1.0 / 1.3 VVT-i (XP90)',
    years: '2006 - 2011',
    budgetBracket: 'under5k',
    bodyType: 'citycar',
    fuel: 'Benzina',
    priceEstimate: '3.800 € - 5.000 €',
    consumptionKmPerL: 18.0,
    whyBuy: 'Campione assoluta di longevità; catena di distribuzione duratura e zero noie.',
    whatToCheck: 'Pompa dell\'acqua (trafilaggi), cuscinetti ruota posteriori.',
    ratingScore: 94,
  },
  {
    make: 'Ford',
    makeSlug: 'ford',
    model: 'Fiesta',
    modelSlug: 'fiesta',
    version: '1.2 16V Zetec / 1.4 TDCi',
    years: '2008 - 2012',
    budgetBracket: 'under5k',
    bodyType: 'citycar',
    fuel: 'Benzina',
    priceEstimate: '3.500 € - 4.800 €',
    consumptionKmPerL: 17.0,
    whyBuy: 'Ottima tenuta di strada, carrozzeria robusta e costi di gestione contenuti.',
    whatToCheck: 'Condensatore aria condizionata, scatola sterzo, usura dischi freno.',
    ratingScore: 88,
  },

  // 5k - 10k
  {
    make: 'Renault',
    makeSlug: 'renault',
    model: 'Clio',
    modelSlug: 'clio',
    version: '0.9 TCe / 1.5 dCi Energy (Clio 4)',
    years: '2013 - 2019',
    budgetBracket: '5k-10k',
    bodyType: 'citycar',
    fuel: 'Benzina',
    priceEstimate: '6.500 € - 9.500 €',
    consumptionKmPerL: 18.5,
    whyBuy: 'Design accattivante, bagagliaio capiente (300 litri) e motore 0.9 turbo brillante.',
    whatToCheck: 'Termostato liquido refrigerante, guarnizioni porte anteriori per fruscii.',
    ratingScore: 90,
  },
  {
    make: 'Volkswagen',
    makeSlug: 'volkswagen',
    model: 'Polo',
    modelSlug: 'polo',
    version: '1.0 MPI / 1.2 TSI 90 CV (6R / 6C)',
    years: '2012 - 2017',
    budgetBracket: '5k-10k',
    bodyType: 'citycar',
    fuel: 'Benzina',
    priceEstimate: '7.500 € - 10.000 €',
    consumptionKmPerL: 19.0,
    whyBuy: 'Finiture interne di classe superiore, insonorizzazione eccellente e tenuta valore.',
    whatToCheck: 'Sui motori TSI verificare che la cinghia/catena non abbia rumori a freddo.',
    ratingScore: 91,
  },
  {
    make: 'Dacia',
    makeSlug: 'dacia',
    model: 'Duster',
    modelSlug: 'duster',
    version: '1.5 dCi 110 CV / 1.6 GPL 4x2',
    years: '2013 - 2017',
    budgetBracket: '5k-10k',
    bodyType: 'suv',
    fuel: 'GPL',
    priceEstimate: '7.000 € - 9.800 €',
    consumptionKmPerL: 16.0,
    whyBuy: 'Il SUV più economico da mantenere, assetto ideale per strade dissestate.',
    whatToCheck: 'Valvola EGR, silent block sospensioni, ruggine sottoscocca se usata fuoristrada.',
    ratingScore: 89,
  },

  // 10k - 15k
  {
    make: 'Toyota',
    makeSlug: 'toyota',
    model: 'Yaris',
    modelSlug: 'yaris',
    version: '1.5 Hybrid E-CVT (XP130 restyling)',
    years: '2016 - 2020',
    budgetBracket: '10k-15k',
    bodyType: 'citycar',
    fuel: 'Ibrida',
    priceEstimate: '11.500 € - 14.500 €',
    consumptionKmPerL: 24.5,
    whyBuy: 'Consumi imbattibili in città (fino a 25 km/l), esente blocchi del traffico.',
    whatToCheck: 'Esecuzione del Hybrid Health Check Toyota con garanzia batteria estesa.',
    ratingScore: 97,
  },
  {
    make: 'Renault',
    makeSlug: 'renault',
    model: 'Captur',
    modelSlug: 'captur',
    version: '1.0 TCe GPL / 1.5 dCi EDC',
    years: '2016 - 2020',
    budgetBracket: '10k-15k',
    bodyType: 'suv',
    fuel: 'GPL',
    priceEstimate: '11.000 € - 14.800 €',
    consumptionKmPerL: 19.5,
    whyBuy: 'Seduta rialzata, divanetto scorrevole comodissimo e costi minimi a GPL.',
    whatToCheck: 'Frizione sul cambio manuale, sensori pressione pneumatici.',
    ratingScore: 90,
  },
  {
    make: 'Peugeot',
    makeSlug: 'peugeot',
    model: '2008',
    modelSlug: '2008',
    version: '1.6 BlueHDi 100/120 CV (1a serie)',
    years: '2016 - 2019',
    budgetBracket: '10k-15k',
    bodyType: 'suv',
    fuel: 'Diesel',
    priceEstimate: '10.500 € - 14.000 €',
    consumptionKmPerL: 21.0,
    whyBuy: 'Il motore 1.6 HDi è molto più affidabile del successivo 1.5; consumi da record.',
    whatToCheck: 'Serbatoio additivo FAP e livello AdBlue.',
    ratingScore: 91,
  },

  // 15k - 20k
  {
    make: 'Toyota',
    makeSlug: 'toyota',
    model: 'C-HR',
    modelSlug: 'c-hr',
    version: '1.8 Hybrid 122 CV',
    years: '2017 - 2021',
    budgetBracket: '15k-20k',
    bodyType: 'suv',
    fuel: 'Ibrida',
    priceEstimate: '16.000 € - 19.800 €',
    consumptionKmPerL: 22.0,
    whyBuy: 'Look da concept car, affidabilità giapponese al 100%, tenuta valore eccellente.',
    whatToCheck: 'Visibilità posteriore (verificare funzionamento retrocamera) e dischi freni.',
    ratingScore: 96,
  },
  {
    make: 'Volkswagen',
    makeSlug: 'volkswagen',
    model: 'Golf',
    modelSlug: 'golf',
    version: '1.5 TSI 130/150 CV / 2.0 TDI (Golf 7.5)',
    years: '2017 - 2020',
    budgetBracket: '15k-20k',
    bodyType: 'berlina-sw',
    fuel: 'Benzina',
    priceEstimate: '15.500 € - 19.500 €',
    consumptionKmPerL: 18.0,
    whyBuy: 'La regina del segmento: il restyling 7.5 è privo di difetti di gioventù e rifinito al top.',
    whatToCheck: 'Se DSG (cambio automatico), verificare fluidità negli innesti e assenza strappi.',
    ratingScore: 95,
  },
  {
    make: 'Nissan',
    makeSlug: 'nissan',
    model: 'Qashqai',
    modelSlug: 'qashqai',
    version: '1.3 DIG-T 140 CV / 1.5 dCi Euro 6d',
    years: '2018 - 2021',
    budgetBracket: '15k-20k',
    bodyType: 'suv',
    fuel: 'Benzina',
    priceEstimate: '15.000 € - 19.000 €',
    consumptionKmPerL: 17.5,
    whyBuy: 'Il motore 1.3 turbo benzina sviluppato con Mercedes è silenzioso, potente e affidabile.',
    whatToCheck: 'Batteria start&stop, funzionamento display infotainment centrale.',
    ratingScore: 93,
  },
];

export default function MiglioriAutoUsateClient() {
  const [selectedBudget, setSelectedBudget] = useState<string>('all');
  const [selectedBody, setSelectedBody] = useState<string>('all');
  const [selectedFuel, setSelectedFuel] = useState<string>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredCars = useMemo(() => {
    return BEST_CARS.filter((car) => {
      const matchBudget = selectedBudget === 'all' || car.budgetBracket === selectedBudget;
      const matchBody = selectedBody === 'all' || car.bodyType === selectedBody;
      const matchFuel = selectedFuel === 'all' || car.fuel === selectedFuel;
      return matchBudget && matchBody && matchFuel;
    });
  }, [selectedBudget, selectedBody, selectedFuel]);

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
            <span className="text-text-secondary font-medium">Migliori Auto Usate 2026</span>
          </li>
        </ol>
      </nav>

      {/* Hero */}
      <header className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200/80 px-3.5 py-1.5 text-xs font-bold text-emerald-700 mb-4 shadow-sm">
          <Trophy className="h-3.5 w-3.5" />
          Classifica Aggiornata Agosto 2026
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
          Le Migliori Auto Usate per Budget nel 2026
        </h1>
        <p className="mt-3.5 text-base sm:text-lg text-slate-600 leading-relaxed">
          I modelli con il miglior rapporto qualità/prezzo sul mercato dell&apos;usato in Italia: <strong>affidabilità meccanica testata</strong>, consumi ridotti e tenuta del valore nel tempo.
        </p>
      </header>

      {/* Filter Tabs */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-900/5 mb-12">
        <div className="space-y-4">
          {/* Budget filter pills */}
          <div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Fascia di prezzo
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'Tutti i budget' },
                { id: 'under5k', label: 'Sotto i 5.000 €' },
                { id: '5k-10k', label: '5.000 € - 10.000 €' },
                { id: '10k-15k', label: '10.000 € - 15.000 €' },
                { id: '15k-20k', label: '15.000 € - 20.000 €' },
              ].map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedBudget(b.id)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                    selectedBudget === b.id
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary filter selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Carrozzeria</label>
              <select
                value={selectedBody}
                onChange={(e) => setSelectedBody(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
              >
                <option value="all">Tutte le carrozzerie</option>
                <option value="citycar">Citycar & Utilitarie</option>
                <option value="suv">SUV & Crossover</option>
                <option value="berlina-sw">Berline & Station Wagon</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Alimentazione</label>
              <select
                value={selectedFuel}
                onChange={(e) => setSelectedFuel(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
              >
                <option value="all">Tutte le alimentazioni</option>
                <option value="Benzina">Benzina</option>
                <option value="Ibrida">Ibrida</option>
                <option value="GPL">GPL</option>
                <option value="Diesel">Diesel</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Grid of Recommended Cars */}
      <section className="mb-16">
        <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-6">
          <span>Mostrati {filteredCars.length} modelli selezionati dagli esperti</span>
          <span>Punteggio medio affidabilità: &gt; 88/100</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <div
              key={`${car.make}-${car.model}-${car.version}`}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {car.make}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <Trophy className="h-3 w-3 text-emerald-600" /> {car.ratingScore}/100
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900">
                  {car.make} {car.model}
                </h3>
                <p className="text-xs font-medium text-slate-500 mb-1">{car.version}</p>
                <span className="text-[11px] text-slate-400 block mb-4">Annate consigliate: {car.years}</span>

                <div className="grid grid-cols-2 gap-2 bg-slate-50 rounded-2xl p-3 mb-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Prezzo medio usato</span>
                    <strong className="text-slate-800 font-bold">{car.priceEstimate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Consumo reale</span>
                    <strong className="text-emerald-700 font-bold">{car.consumptionKmPerL} km/l</strong>
                  </div>
                </div>

                <div className="space-y-3 mb-4 text-xs">
                  <div className="bg-emerald-50/60 rounded-xl p-3 border border-emerald-100">
                    <strong className="text-emerald-950 block mb-0.5 flex items-center gap-1 font-bold">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Perché comprarla:
                    </strong>
                    <span className="text-slate-600">{car.whyBuy}</span>
                  </div>

                  <div className="bg-rose-50/60 rounded-xl p-3 border border-rose-100">
                    <strong className="text-rose-950 block mb-0.5 flex items-center gap-1 font-bold">
                      <AlertTriangle className="h-3.5 w-3.5 text-rose-600" /> Cosa controllare:
                    </strong>
                    <span className="text-slate-600">{car.whatToCheck}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  href={`/valutazione/${car.makeSlug}/${car.modelSlug}`}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
                >
                  Quotazione reale <ArrowRight className="h-3 w-3" />
                </Link>
                <Link
                  href={`/affidabilita/${car.makeSlug}/${car.modelSlug}`}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Tutti i difetti noti
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="mb-16 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 mb-2">
            <HelpCircle className="h-3.5 w-3.5" /> Domande Frequenti
          </div>
          <h2 className="text-2xl font-black text-slate-900">Consigli per l&apos;Acquisto dell&apos;Usato</h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'Quanti chilometri sono troppi per un\'auto usata?',
              a: 'Dipende dall\'alimentazione e dalla manutenzione: per un motore a benzina aspirato o ibrido giapponese 150.000 km con tagliandi regolari non sono un problema. Per un diesel, è fondamentale verificare lo stato del FAP, degli iniettori e della frizione/volano bimassa se si superano i 180.000 km.',
            },
            {
              q: 'Meglio comprare da un privato o da un concessionario?',
              a: 'Dal privato si risparmia solitamente il 10-15% sul prezzo d\'acquisto, ma vige la formula "vista e piaciuta" senza garanzia di legge. Il concessionario applica un prezzo più alto ma è obbligato per legge (Codice del Consumo) a fornire 12 o 24 mesi di garanzia legale di conformità.',
            },
            {
              q: 'Come faccio a evitare truffe sul chilometraggio scalato?',
              a: 'Inserisci il numero di targa nello strumento di AutoEsperto o sul Portale dell\'Automobilista per verificare i chilometri registrati durante le ultime revisioni periodiche obbligatorie.',
            },
          ].map((faq, idx) => (
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

      {/* Footer CTA */}
      <section className="rounded-3xl bg-slate-900 p-8 sm:p-10 text-white text-center">
        <span className="grid h-12 w-12 mx-auto place-items-center rounded-2xl bg-emerald-500/20 text-emerald-400 mb-4">
          <Sparkles className="h-6 w-6" />
        </span>
        <h2 className="text-2xl sm:text-3xl font-black mb-3">
          Hai trovato un annuncio e vuoi verificarlo?
        </h2>
        <p className="text-sm text-slate-300 max-w-xl mx-auto mb-6">
          Incolla il link o carica una foto per ricevere il verdetto istantaneo dell&apos;AI: prezzo giusto, affidabilità e controlli da fare.
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
