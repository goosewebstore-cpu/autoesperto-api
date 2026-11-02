'use client';
import { useId } from 'react';
import { Area, ComposedChart, Line, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { AutoReport } from '@autoesperto/types';
import { depreciationScenario, suggestedDepreciationRate } from '@/lib/depreciation';
import type { ReportWithTools } from '@/lib/reportTools';
const euro = (v: number) => v.toLocaleString('it-IT', { maximumFractionDigits: 0 }) + ' €';
export default function DepreciationChart({ report, onRateChange }: { report: AutoReport; onRateChange: (rate: number) => void }) {
  const id = useId().replace(/:/g, '');
  const asOfYear = Number.isFinite(Date.parse(report.createdAt)) ? new Date(report.createdAt).getFullYear() : new Date().getFullYear();
  const suggested = suggestedDepreciationRate(report.vehicle.year, asOfYear);
  const saved = (report as ReportWithTools).userTools?.depreciationRate;
  const rate = Number.isFinite(saved) ? Math.min(25, Math.max(0, saved!)) : suggested;
  const value = Number(report.price.estimatedValue);
  if (!(value > 0)) return <p className="text-sm text-slate-600">Serve un valore attuale per simulare la svalutazione.</p>;
  const data = depreciationScenario(value, rate).map(point => ({ ...point, band: [point.lower, point.upper] }));
  const last = data[5];
  return <div className="space-y-4">
    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-blue-700">Simulazione di rivendita</p><div className="mt-2 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs text-slate-600">Valore di partenza oggi</p><p className="mt-1 text-xl font-bold text-slate-950">{euro(value)}</p></div><div><p className="text-xs text-slate-600">Scenario centrale fra 5 anni</p><p className="mt-1 text-xl font-bold text-slate-950">{euro(last.value)}</p></div></div></div>
    <div><label htmlFor={id+'-rate'} className="flex justify-between gap-3 text-sm font-semibold text-slate-900"><span>Perdita di valore annua ipotizzata</span><span>{rate}%</span></label><input id={id+'-rate'} type="range" min="0" max="25" step="1" value={rate} onChange={e => onRateChange(Number(e.target.value))} className="mt-3 min-h-8 w-full accent-blue-600"/><p className="mt-1 text-xs leading-relaxed text-slate-500">Ipotesi iniziale: {suggested}% in base all’età dell’auto. Puoi modificarla: il tasso non è ricavato da vendite future né da una quotazione specifica di questa versione.</p></div>
    <div className="h-64 rounded-2xl border border-slate-200 bg-white px-1 py-4" role="img" aria-label={'Simulazione del valore: oggi '+euro(value)+', fra cinque anni '+euro(last.value)+'. Dati dettagliati nella tabella sotto.'}>
      <ResponsiveContainer width="100%" height="100%"><ComposedChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 4" stroke="#e2e8f0" vertical={false}/>
        <XAxis type="number" dataKey="year" domain={[0,5]} ticks={[0,1,3,5]} tickFormatter={v=>v===0?'Oggi':'+'+v+' a'} tick={{fill:'#475569',fontSize:11}} axisLine={false} tickLine={false}/>
        <YAxis domain={[0,'auto']} width={48} tickFormatter={v=>(Number(v)/1000).toLocaleString('it-IT',{maximumFractionDigits:1})+'k €'} tick={{fill:'#64748b',fontSize:10}} axisLine={false} tickLine={false}/>
        <Tooltip labelFormatter={v=>Number(v)===0?'Oggi':'Fra '+v+' anni'} formatter={(v,name)=>Array.isArray(v)?[v.map(Number).map(euro).join(' – '),'Scenari alternativi']:[euro(Number(v)),'Scenario centrale']} contentStyle={{borderRadius:12,fontSize:12,border:'1px solid #e2e8f0'}}/>
        <Area type="monotone" dataKey="band" stroke="none" fill="#dbeafe" fillOpacity={0.8} name="band"/>
        <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} dot={{r:3,fill:'#2563eb'}} name="value"/>
      </ComposedChart></ResponsiveContainer>
    </div>
    <p className="text-xs leading-relaxed text-slate-600"><span className="font-semibold text-blue-700">Linea blu:</span> ipotesi scelta. <span className="font-semibold">Fascia chiara:</span> tassi annui da {Math.max(0,rate-3)}% a {Math.min(30,rate+3)}%, per confrontare scenari; non è un intervallo di confidenza.</p>
    <div className="overflow-x-auto rounded-xl border border-slate-200"><table className="w-full text-left text-xs"><caption className="sr-only">Valore residuo e perdita cumulata nello scenario scelto</caption><thead className="bg-slate-50 text-slate-600"><tr><th className="p-3">Quando</th><th className="p-3">Valore residuo</th><th className="p-3">Perdita da oggi</th></tr></thead><tbody>{data.filter(p=>[1,3,5].includes(p.year)).map(p=><tr key={p.year} className="border-t border-slate-100"><th className="p-3 font-medium">+{p.year} {p.year===1?'anno':'anni'}</th><td className="p-3 font-bold">{euro(p.value)}</td><td className="p-3 text-slate-600">{euro(p.loss)}</td></tr>)}</tbody></table></div>
    <details className="rounded-xl bg-slate-50 p-4 text-xs text-slate-600"><summary className="cursor-pointer font-semibold text-slate-900">Ipotesi e limiti del calcolo</summary><p className="mt-3 leading-relaxed">Valore attuale × (1 − tasso annuo) elevato agli anni trascorsi; importi arrotondati a 100 €. Le ipotesi iniziali sono 12% per auto con meno di 3 anni, 9% da 3 a 5, 7% da 6 a 9, 5% da 10 anni. Sono parametri di pianificazione, non statistiche del modello. Non include effetti specifici di chilometri futuri, allestimento, manutenzione, domanda, incentivi o interesse collezionistico. Per una previsione commerciale servono dati aggiornati specifici dell’esemplare. La scelta viene riportata nel PDF completo.</p><a href="https://www.autovistaintelligence.com/subscribe/residual-value-monitor" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block underline">Come età e chilometraggio entrano nelle valutazioni professionali ↗</a></details>
  </div>;
}
