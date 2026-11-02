'use client';
import { useState } from 'react';
import type { AutoReport } from '@autoesperto/types';
import { calculateAnnualBudget, mileageAverage, offerDifference, type BudgetInputs, type ReportWithTools } from '@/lib/reportTools';
import ReportDisclosure from './ReportDisclosure';
const euro=(v:number)=>v.toLocaleString('it-IT',{style:'currency',currency:'EUR',maximumFractionDigits:0});
const CHECKS=[
  ['Documenti e identità dell’auto','Confronta il VIN sul veicolo e sul libretto. Controlla proprietà, revisioni e dati dichiarati.'],
  ['Tagliandi e interventi','Chiedi fatture e storico manutenzione. Verifica i lavori previsti per quella motorizzazione con un’officina.'],
  ['Carrozzeria e pneumatici','Osserva usura, allineamenti, gomme e segni visibili. Un’anomalia è un indizio da approfondire, non la prova di un incidente.'],
  ['Prova su strada','Con il venditore e in condizioni sicure, controlla frenata, sterzo, cambiata e rumori. Mantieni sempre il controllo del veicolo.'],
  ['Controllo professionale','Concorda un’ispezione indipendente prima di impegnarti. Le foto non permettono di valutare lo stato meccanico.'],
  ['Prezzo e accordi','Confronta annunci simili e metti per iscritto condizioni e difetti dichiarati. Chiarisci pagamento e passaggio prima di versare somme.'],
] as const;
export default function ReportDeepAnalysis({report,onUpdateReport}:{report:AutoReport;onUpdateReport?:(report:AutoReport)=>void}) {
  const saved=(report as ReportWithTools).userTools;
  const fc=report.reliability.futureCosts;
  const [budget,setBudget]=useState<BudgetInputs>(saved?.budget || {annualKm:10000,energyPer100Km:fc?.fuelCostPer100Km ?? 0,insurance:fc?.insuranceEstimate ?? 0,maintenance:fc?.annualMaintenance ?? 0,tax:report.reliability.taxAnnual ?? 0,tires:0});
  const [checked,setChecked]=useState<string[]>(saved?.checklist || []);
  const [offer,setOffer]=useState(report.price.requestedPrice ?? report.price.estimatedValue ?? 0);
  const [message,setMessage]=useState('');
  const totals=calculateAnnualBudget(budget);
  const avg=mileageAverage(report.vehicle.year,report.price.inputKm);
  const delta=offerDifference(offer,report.price.estimatedValue);
  function save() { if(!onUpdateReport)return; const updated:ReportWithTools={...report,userTools:{...(report as ReportWithTools).userTools,budget,checklist:checked}};onUpdateReport(updated);setMessage('Ipotesi e checklist applicate a questo report. Saranno incluse nel PDF completo; non modificano il prezzo stimato o l’affidabilità.'); }
  return <div className="space-y-3">
    <ReportDisclosure title="Calcola il tuo budget di gestione" description={`${euro(totals.monthly)} al mese con le ipotesi qui sotto`}>
      <p className="text-sm leading-relaxed text-slate-600">Modifica percorrenza e costi in base al tuo utilizzo. I valori iniziali provengono dal report quando disponibili; le voci mancanti partono da zero e vanno completate. Non sono preventivi.</p>
      <div className="grid gap-4 sm:grid-cols-2">{([{key:'annualKm',label:'Chilometri all’anno',max:200000},{key:'energyPer100Km',label:'Carburante o energia (€ ogni 100 km)',max:1000},{key:'insurance',label:'Assicurazione (€ all’anno)',max:100000},{key:'maintenance',label:'Manutenzione (€ all’anno)',max:100000},{key:'tax',label:'Bollo (€ all’anno)',max:100000},{key:'tires',label:'Pneumatici e altri costi (€ all’anno)',max:100000}] as const).map(field=><label key={field.key} className="block text-xs font-semibold text-slate-700">{field.label}<input type="number" min="0" max={field.max} step={field.key==='energyPer100Km' ? '0.1' : '1'} value={budget[field.key]} onChange={e=>{setBudget(prev=>({...prev,[field.key]:Math.max(0,Math.min(field.max,Number(e.target.value)||0))}));setMessage('');}} className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-base text-slate-900"/></label>)}</div>
      <dl className="grid grid-cols-2 gap-3 rounded-xl bg-blue-50 p-4"><div><dt className="text-xs text-slate-600">Totale annuo</dt><dd className="mt-1 text-lg font-bold">{euro(totals.total)}</dd></div><div><dt className="text-xs text-slate-600">Media mensile</dt><dd className="mt-1 text-lg font-bold">{euro(totals.monthly)}</dd></div><div><dt className="text-xs text-slate-600">Energia annua</dt><dd className="mt-1 font-semibold">{euro(totals.energy)}</dd></div><div><dt className="text-xs text-slate-600">Costo al km</dt><dd className="mt-1 font-semibold">{totals.perKm==null ? 'Inserisci i km annui' : `${totals.perKm.toLocaleString('it-IT',{minimumFractionDigits:2,maximumFractionDigits:2})} €`}</dd></div></dl>
      <p className="text-xs leading-relaxed text-slate-500">Energia = km annui ÷ 100 × costo ogni 100 km. Il totale somma le sei voci inserite. Sono esclusi acquisto, finanziamento, svalutazione e imprevisti non inseriti. Per il bollo verifica regione, potenza e agevolazioni presso i servizi ufficiali.</p>
      <a href="/calcolo-bollo" className="inline-flex min-h-10 items-center text-sm font-semibold text-blue-700">Apri il calcolo bollo →</a>
    </ReportDisclosure>
    <ReportDisclosure title="Prepara la trattativa" description="Confronta la tua proposta con la fascia stimata, senza promesse di risparmio">
      <p className="text-sm leading-relaxed text-slate-600">La stima è un riferimento. Stato, manutenzione, dotazione e annunci comparabili possono giustificare un prezzo diverso. Chiedi documentazione e preventivi per motivare la proposta.</p>
      <label className="block text-sm font-semibold">La tua proposta (€)<input type="number" min="0" max="10000000" value={offer} onChange={e=>setOffer(Math.max(0,Math.min(10000000,Number(e.target.value)||0)))} className="mt-2 h-11 w-full rounded-xl border border-slate-300 px-3 text-base"/></label>
      <dl className="space-y-2 text-sm"><div className="flex flex-wrap justify-between gap-2"><dt className="text-slate-600">Valore centrale del report</dt><dd className="font-bold">{report.price.estimatedValue>0 ? euro(report.price.estimatedValue) : 'Non disponibile'}</dd></div><div className="flex flex-wrap justify-between gap-2"><dt className="text-slate-600">La proposta rispetto alla stima</dt><dd className="font-bold">{delta==null ? 'Non calcolabile' : `${delta>0 ? '+' : ''}${delta.toLocaleString('it-IT',{maximumFractionDigits:1})}%`}</dd></div></dl>
      <p className="rounded-xl bg-slate-50 p-4 text-sm leading-relaxed">«Il prezzo che propongo è {euro(offer)}. Possiamo confrontare insieme manutenzioni documentate, condizioni e annunci simili per capire se è una proposta adeguata?»</p>
    </ReportDisclosure>
    <ReportDisclosure title="Chilometri: cosa puoi verificare" description={avg==null ? 'Inserisci anno e km per calcolare una media' : `Media aritmetica: ${avg.toLocaleString('it-IT')} km all’anno`}>
      <p className="text-sm leading-relaxed text-slate-700">{avg==null ? 'Con anno o chilometraggio mancanti, o con un’auto dell’anno corrente, la media non è disponibile.' : `La media divide ${report.price.inputKm?.toLocaleString('it-IT')} km per gli anni trascorsi dal ${report.vehicle.year}. Non conosce la data esatta di prima immatricolazione.`} Questa media non dimostra né esclude una manomissione e non permette di dedurre il tipo di utilizzo.</p>
      <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700"><li>Confronta i chilometri registrati alle revisioni con il valore dichiarato.</li><li>Chiedi fatture e registrazioni dei tagliandi, controllando date e progressione dei km.</li><li>Se trovi incongruenze, chiedi una verifica indipendente prima di decidere.</li></ul>
      <a href="https://www.ilportaledellautomobilista.it/interrogazionistoricorevisioni/spa/" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center text-sm font-semibold text-blue-700">Apri lo storico revisioni ufficiale →</a>
    </ReportDisclosure>
    <ReportDisclosure title="Checklist durante la visita" description={`${checked.length} di ${CHECKS.length} controlli annotati in questa sessione`}>
      <p className="text-xs leading-relaxed text-slate-500">Spuntare un elemento è una tua annotazione: non certifica che l’auto abbia superato il controllo.</p>
      <div className="space-y-3">{CHECKS.map(([title,description])=><label key={title} className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4"><input type="checkbox" checked={checked.includes(title)} onChange={e=>{setChecked(prev=>e.target.checked ? [...prev,title] : prev.filter(v=>v!==title));setMessage('');}} className="mt-1 h-5 w-5 shrink-0 accent-blue-600"/><span><span className="block text-sm font-bold">{title}</span><span className="mt-1 block text-sm leading-relaxed text-slate-600">{description}</span></span></label>)}</div>
    </ReportDisclosure>
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm leading-relaxed text-slate-600">Budget e checklist restano in questa sessione. Applica le modifiche per aggiungerle al PDF completo; la sintesi gratuita mantiene solo i dati essenziali.</p><button onClick={save} className="mt-3 min-h-11 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white">Applica budget e checklist al report</button>{message && <p role="status" className="mt-3 text-sm text-slate-700">{message}</p>}</div>
  </div>;
}
