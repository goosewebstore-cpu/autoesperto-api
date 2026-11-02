'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import type { AutoReport, PhotoAnalysisResult, PriceAnalysis } from '@autoesperto/types';
import { Loader2, Camera } from 'lucide-react';
import { analyzeVehiclePhoto, type PhotoAnalysis } from '@/lib/api';
import { optimiseImageForAnalysis } from '@/lib/imageOptim';
import { conditionSimulation } from '@/lib/reportTools';

export default function VehicleHealthScore({report,onValuationAdjust,onPhotoAnalysis}:{report:AutoReport;onValuationAdjust?:(price:PriceAnalysis, deduction:number,note:string)=>void;onPhotoAnalysis?:(photo:PhotoAnalysisResult)=>void}) {
  const baseline=useRef(report.price);
  const [deduction,setDeduction]=useState(0);
  const [note,setNote]=useState('');
  const [applied,setApplied]=useState(false);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const [gate,setGate]=useState<'login'|'plan'|null>(null);
  const [photo,setPhoto]=useState<PhotoAnalysis|null>(null);
  const [preview,setPreview]=useState('');
  const base=baseline.current.estimatedValue;
  const value=conditionSimulation(base,deduction);
  const apply=()=> { if(!onValuationAdjust)return;const factor=base>0 ? value/base : 1;onValuationAdjust({...baseline.current,estimatedValue:value,min:Math.round(baseline.current.min*factor),max:Math.round(baseline.current.max*factor),comment:`${baseline.current.comment || ''} Simulazione dell’utente: riduzione di ${deduction.toLocaleString('it-IT')} € rispetto alla stima di partenza. ${note}`},deduction,note);setApplied(true); };
  async function scan(file:File|undefined) {
    if(!file || busy)return;setBusy(true);setError('');setGate(null);setPhoto(null);
    try {
      if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw new Error('Usa una foto JPG, PNG o WebP.');
      if(file.size>15*1024*1024)throw new Error('La foto deve essere inferiore a 15 MB.');
      const data=await optimiseImageForAnalysis(file);setPreview(data);
      const result=await analyzeVehiclePhoto(data,{make:report.vehicle.make,model:report.vehicle.model,year:report.vehicle.year});
      if(!result.success || !result.analysis)throw new Error('Analisi non disponibile. Nessun danno è stato verificato.');
      setPhoto(result.analysis);
      onPhotoAnalysis?.(result.analysis as PhotoAnalysisResult);
    }catch(err){const status=(err as {status?:number}).status;setGate(status===401 ? 'login' : status===402 ? 'plan' : null);setError(err instanceof Error ? err.message : 'Analisi non disponibile. Riprova; non è stato prodotto alcun risultato.');}
    finally{setBusy(false);}
  }
  return <div className="space-y-5">
    <div className="rounded-xl bg-slate-50 p-4"><h3 className="text-sm font-bold">Simula una spesa da considerare nel prezzo</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">Inserisci un preventivo o un importo da discutere con il venditore. La simulazione sottrae l’importo dalla stima di partenza: non diagnostica guasti e non cambia il punteggio di affidabilità.</p></div>
    <label className="block text-sm font-semibold">Importo da considerare (€)<input type="number" min="0" max={base>0 ? base : 0} value={deduction} onChange={e=>{setDeduction(Math.max(0,Math.min(base,Number(e.target.value)||0)));setApplied(false);}} className="mt-2 h-11 w-full rounded-xl border border-slate-300 px-3 text-base"/></label>
    <label className="block text-sm font-semibold">Motivo o riferimento del preventivo<textarea value={note} maxLength={800} onChange={e=>{setNote(e.target.value);setApplied(false);}} placeholder="Es. preventivo pneumatici da verificare con il venditore" className="mt-2 min-h-24 w-full rounded-xl border border-slate-300 p-3 text-sm"/></label>
    <dl className="grid grid-cols-2 gap-3 rounded-xl bg-blue-50 p-4"><div><dt className="text-xs text-slate-600">Stima di partenza</dt><dd className="mt-1 font-bold">{base.toLocaleString('it-IT')} €</dd></div><div><dt className="text-xs text-slate-600">Valore simulato</dt><dd className="mt-1 font-bold">{value.toLocaleString('it-IT')} €</dd></div></dl>
    <div className="flex flex-wrap gap-3"><button disabled={applied || base<=0} onClick={apply} className="min-h-11 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white disabled:opacity-50">{applied ? 'Simulazione applicata' : 'Applica al report'}</button><button onClick={()=>{onValuationAdjust?.(baseline.current,0,'');setDeduction(0);setNote('');setApplied(false);}} className="min-h-11 rounded-xl border border-slate-300 px-4 text-sm font-semibold">Ripristina la stima di partenza</button></div>
    <section className="space-y-3 border-t border-slate-200 pt-5"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="flex items-center gap-2 text-sm font-bold"><Camera className="h-4 w-4"/>Controllo visivo da foto</h3><span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">Con abbonamento</span></div><p className="text-sm leading-relaxed text-slate-600">Analizza i segni visibili, con limiti e attendibilità espliciti. Il risultato non cambia automaticamente il valore e non conferma lo stato meccanico.</p>
      <label className="block text-sm font-semibold">Foto JPG, PNG o WebP (massimo 15 MB)<input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={e=>{const file=e.currentTarget.files?.[0];e.currentTarget.value='';void scan(file);}} className="mt-2 block w-full rounded-xl border border-slate-300 p-3 text-xs"/></label>
      {busy && <p role="status" className="flex items-center gap-2 text-sm"><Loader2 className="h-4 w-4 animate-spin"/>Analisi della foto in corso…</p>}
      {preview && <img src={preview} alt="Foto scelta per il controllo visivo" className="max-h-64 w-full rounded-xl object-contain"/>}
      {error && <p role="alert" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{error}</p>}
      {gate && <Link href={gate==='login' ? '/accesso?next=%2Fabbonamento' : '/abbonamento'} className="inline-flex min-h-11 items-center rounded-xl bg-blue-600 px-4 text-sm font-bold text-white">{gate==='login' ? 'Accedi per continuare' : 'Scopri l’abbonamento'}</Link>}
      {photo && <div className="rounded-xl border border-slate-200 p-4"><p className="text-sm font-bold">Risultato del controllo visivo</p><p className="mt-2 text-sm leading-relaxed">{photo.inspection?.summary || photo.damage.description}</p>{photo.inspection?.areas?.map((area,i)=><p key={i} className="mt-3 text-sm leading-relaxed"><strong>{area.area}:</strong> {area.details}</p>)}{photo.repairRange && <p className="mt-3 text-sm font-semibold">Riparazione indicativa: {photo.repairRange.min.toLocaleString('it-IT')}–{photo.repairRange.max.toLocaleString('it-IT')} €. Richiedi un preventivo.</p>}<p className="mt-3 text-xs leading-relaxed text-slate-500">Attendibilità: {photo.inspection?.confidence || photo.vehicle.confidence}. {photo.inspection?.limitations?.join(' ')} {photo.note}</p></div>}
    </section>
  </div>;
}
