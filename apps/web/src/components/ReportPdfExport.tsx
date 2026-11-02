'use client';
import { useState } from 'react';
import Link from 'next/link';
import type { AutoReport } from '@autoesperto/types';
import { Download, Loader2 } from 'lucide-react';
import { downloadPDF, PdfSubscriptionError } from './PDFButton';
export default function ReportPdfExport({report}:{report:AutoReport}) {
  const [busy,setBusy]=useState<'basic'|'premium'|null>(null);
  const [message,setMessage]=useState('');
  const [needsPlan,setNeedsPlan]=useState(false);
  async function download(edition:'basic'|'premium') { if(busy)return;setBusy(edition);setMessage('');setNeedsPlan(false);try{await downloadPDF(report,undefined,edition);}catch(err){setMessage(err instanceof Error ? err.message : 'Impossibile creare il PDF.');setNeedsPlan(err instanceof PdfSubscriptionError);}finally{setBusy(null);} }
  return <section aria-label="Scarica il report PDF" className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"><h2 className="text-base font-bold text-slate-950">Porta con te la valutazione</h2><p className="mt-1 text-sm text-slate-600">Scegli la sintesi gratuita o il report completo incluso nell’abbonamento, anche durante la prova attiva.</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{([{edition:'basic',title:'PDF essenziale',description:'Sintesi, prezzo e controlli principali. Gratis.'},{edition:'premium',title:'PDF completo',description:'Mercato, affidabilità, costi, checklist e fonti. Con abbonamento.'}] as const).map(item=><button key={item.edition} disabled={!!busy} onClick={()=>download(item.edition)} className={`flex min-h-20 items-start gap-3 rounded-xl border p-4 text-left transition-colors disabled:opacity-60 ${item.edition==='premium' ? 'border-blue-200 bg-blue-50 hover:bg-blue-100' : 'border-slate-200 hover:bg-slate-50'}`}>{busy===item.edition ? <Loader2 className="mt-0.5 h-5 w-5 shrink-0 animate-spin text-blue-600"/> : <Download className="mt-0.5 h-5 w-5 shrink-0 text-blue-600"/>}<span><span className="block text-sm font-bold text-slate-900">{busy===item.edition ? 'Preparazione PDF…' : item.title}</span><span className="mt-1 block text-xs leading-relaxed text-slate-600">{item.description}</span></span></button>)}</div>{message && <p role="status" className="mt-3 text-sm text-slate-700">{message}</p>}{needsPlan && <Link href="/abbonamento" className="mt-3 inline-flex min-h-11 items-center rounded-xl bg-blue-600 px-4 text-sm font-bold text-white">Scopri l’abbonamento</Link>}</section>;
}
