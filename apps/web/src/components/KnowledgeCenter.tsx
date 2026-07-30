'use client';

import { BookOpen, Search, Shield, Wrench, Star, TrendingUp, AlertTriangle, Battery, Car } from 'lucide-react';
import type { VehicleData } from '@autoesperto/types';
import { useState } from 'react';
import { analyzeVehicle } from '@/lib/api';

const brandTips = [
  { brand: 'Fiat', tip: 'Motori Fire e Multijet molto affidabili. Evitare Dualogic usurato — durante il test drive, verificare che le cambiate in automatico siano fluide. 1.3 Mjet 95 CV è il motore urbano ideale.' },
  { brand: 'Volkswagen', tip: 'DSG DQ200 7 marce: chiedere se è stata fatta la recall. Il 1.6 TDI è praticamente indistruttibile se tagliandato. Verificare pompa acqua su TSI vecchi prima dei 100.000 km.' },
  { brand: 'BMW', tip: 'Diesel N47 pre-2015: controllare se la catena distribuzione è stata sostituita (costo ~2.500€). I modelli B47 dal 2015 sono molto migliorati. Perdite olio da guarnizione coperchio valvole sui 6 cilindri.' },
  { brand: 'Mercedes', tip: 'Costi manutenzione alti ma qualità eccellente. OM651 2.2 diesel è tra i motori più longevi. Attenzione solo alle sospensioni Airmatic se presenti: costo sostituzione ~1.500€ per ammortizzatore.' },
  { brand: 'Peugeot', tip: 'PureTech 1.2: cinghia distribuzione a bagno d\'olio — chiedere fattura di sostituzione ogni 6 anni o 100.000 km. Il 1.5 BlueHDi 130 CV è il diesel consigliato: consumi bassi e coppia eccellente.' },
  { brand: 'Renault', tip: '1.5 dCi è un motore eccellente. Evitare il 1.2 TCe che consuma olio. Su modelli Clio o Captur, controllare FAP se usati solo in città. Meglio il 1.3 TCe co-sviluppato con Mercedes.' },
  { brand: 'Toyota', tip: 'Praticamente nessun difetto grave. Cambiare l\'olio ogni 10-15.000 km. Hybride: verificare stato batteria (costo sostituzione ~2.000€ ma dura in media 15 anni). 1.8 Hybrid il più popolare e collaudato.' },
  { brand: 'Mazda', tip: 'SkyActiv motori senza turbo: semplicità e affidabilità premium. 2.2 diesel controllare FAP se urbano. 2.0 benzina 165 CV è il punto dolce della gamma.' },
  { brand: 'Hyundai/Kia', tip: 'Garanzia 5-7 anni. CRDi diesel eccellenti. 1.6 GDI benzina un po\' rumoroso ma affidabile. Costi manutenzione tra i più bassi del segmento.' },
  { brand: 'Alfa Romeo', tip: '1.6 JTDM 120 CV motore consigliato. Multiair benzina: controllare modulo Multiair (costo sostituzione importante). Giulietta 2010-2020 ha sospensioni anteriori che tendono a usurarsi.' },
  { brand: 'Audi', tip: '2.0 TDI EA288 molto affidabile. 2.0 TFSI Gen2 (pre-2015) consuma olio: verificare livello e chiedere se è stata fatta la revisione. S-tronic: meglio manuale se possibile.' },
  { brand: 'Nissan', tip: 'Qashqai 1.5 dCi è una garanzia. CVT automatico: controllare vibrazioni a freddo. Evitare 1.2 DIG-T che ha dato problemi di consumo olio.' },
];

const buyingGuide = [
  { icon: Search, title: '1. Controlla i documenti', text: 'Verifica che il libretto di circolazione corrisponda al veicolo. Controlla ultima revisione e tagliandi registrati.' },
  { icon: Shield, title: '2. Verifica lo storico', text: 'Richiedi il report Carfax o VisurACI per incidenti, fermi amministrativi, km reali e proprietà precedenti.' },
  { icon: Wrench, title: '3. Ispezione meccanica', text: 'Porta l\'auto da un meccanico di fiducia. Controlla perdite olio, stato cinghia, pastiglie freni, ammortizzatori e convergenza.' },
  { icon: Battery, title: '4. Prova su strada', text: 'Fai almeno 30 minuti di test drive. Prova partenza a freddo, frenata, curve e autostrada. Ascolta rumori anomali.' },
  { icon: Star, title: '5. Tratta il prezzo', text: 'Usa i dati di AutoEsperto per confrontare il prezzo con il mercato. Chiedi uno sconto se il veicolo ha difetti o km elevati.' },
];

export default function KnowledgeCenter() {
  const [makeInput, setMakeInput] = useState('');
  const [kTips, setKTips] = useState(brandTips);

  const filtered = makeInput
    ? kTips.filter((t) => t.brand.toLowerCase().includes(makeInput.toLowerCase()))
    : kTips;

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Centro conoscenza</h2>
        <p className="text-text-secondary">Tutto quello che devi sapere prima di comprare un&apos;auto usata.</p>
      </section>

      {/* Brand tips */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-text-primary">Consigli per marca</h3>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              value={makeInput}
              onChange={(e) => setMakeInput(e.target.value)}
              placeholder="Cerca marca..."
              className="pl-9 pr-4 h-10 rounded-xl border border-border bg-surface-2 text-sm text-text-primary outline-none focus:border-accent"
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div key={item.brand} className="bg-surface rounded-2xl p-5 shadow-card">
              <div className="flex items-center gap-3 mb-2">
                <Car className="w-5 h-5 text-accent" />
                <span className="font-bold text-text-primary">{item.brand}</span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">{item.tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Buying guide */}
      <section>
        <h3 className="text-xl font-bold text-text-primary mb-4">Guida all&apos;acquisto</h3>
        <div className="space-y-4">
          {buyingGuide.map((step) => (
            <div key={step.title} className="bg-surface rounded-2xl p-5 shadow-card flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <step.icon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="font-semibold text-text-primary mb-1">{step.title}</div>
                <div className="text-sm text-text-secondary leading-relaxed">{step.text}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h3 className="text-xl font-bold text-text-primary mb-4">Domande frequenti</h3>
        <div className="space-y-3">
          {[
            { q: 'Quanti km sono troppi per un\'auto usata?', a: 'Dipende dalla motorizzazione. Un diesel ben manutenuto può superare 300.000 km. Un benzina piccolo urbano inizia a dare problemi dopo i 200.000 km. La cosa più importante è la regolarità dei tagliandi.' },
            { q: 'Diesel o benzina?', a: 'Diesel se fai più di 15.000 km/anno, soprattutto in autostrada. Benzina se guidi principalmente in città o fai meno di 10.000 km/anno. Ibrido è sempre consigliabile se il budget lo permette.' },
            { q: 'Conviene comprare da un concessionario o da un privato?', a: 'Il concessionario offre garanzia (obbligatoria 12 mesi), ma il prezzo è più alto del 10-15%. Il privato conviene se conosci l\'auto o hai un meccanico di fiducia che la controlla prima.' },
            { q: 'Cosa controllare subito dopo l\'acquisto?', a: 'Tagliando completo (olio, filtri, candele), cinghia distribuzione se non documentata, pastiglie e dischi freni, convergenza e assetto. Budget consigliato: 500-800€ per la prima messa a punto.' },
          ].map((faq) => (
            <details key={faq.q} className="bg-surface rounded-2xl shadow-card group">
              <summary className="p-5 cursor-pointer font-semibold text-text-primary text-sm list-none flex items-center justify-between">
                {faq.q}
                <span className="text-text-tertiary group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="px-5 pb-5 text-sm text-text-secondary leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
