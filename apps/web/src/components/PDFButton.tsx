'use client';
import type { AutoReport } from '@autoesperto/types';
import { sanitizePdfReport } from '@/lib/pdf/sanitize';
import type { PDFConditionData } from '@/lib/pdf/types';
export type { PDFConditionData } from '@/lib/pdf/types';

export class PdfSubscriptionError extends Error {}
export async function downloadPDF(report: AutoReport, conditionData?: PDFConditionData, edition: 'basic' | 'premium' | 'auto' = 'auto') {
  const body=JSON.stringify({report:sanitizePdfReport(report),conditionData,edition});
  let response:Response|undefined;
  for(let attempt=0;attempt<2;attempt++) {
    try { response=await fetch('/api/pdf',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body,cache:'no-store',signal:AbortSignal.timeout(45000)}); }
    catch(error) { if(attempt===1)throw new Error('Connessione interrotta durante la creazione del PDF. Controlla la rete e riprova.'); continue; }
    if(response.ok || response.status<500 || attempt===1)break;
    await new Promise(resolve=>setTimeout(resolve,500));
  }
  if(!response) throw new Error('Il servizio PDF non ha risposto. Riprova tra poco.');
  if(!response.ok) { const payload=await response.json().catch(()=>({}));const message=payload.error || (response.status===413 ? 'Il report contiene troppi dati per l’esportazione. Riprova con la sintesi essenziale.' : response.status>=500 ? 'Il servizio PDF è temporaneamente non disponibile. Riprova tra poco.' : `Impossibile creare il PDF (codice ${response.status}). Riprova.`);if(response.status===403)throw new PdfSubscriptionError(message);throw new Error(message); }
  const blob=await response.blob();
  if(blob.size<100 || blob.type!=='application/pdf') throw new Error('Il file ricevuto non è un PDF valido. Riprova tra poco.');
  const signature=new Uint8Array(await blob.slice(0,5).arrayBuffer());
  if(String.fromCharCode(...signature)!=='%PDF-') throw new Error('Il file ricevuto è incompleto. Riprova tra poco.');
  const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;
  const name=[report.vehicle.make,report.vehicle.model].filter(Boolean).join('-').replace(/[^a-zA-Z0-9-]/g,'');
  link.download=`AutoEsperto-${name || 'Auto'}-${response.headers.get('X-PDF-Edition')==='premium' ? 'Completo' : 'Sintesi'}.pdf`;
  link.rel='noopener';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
}
