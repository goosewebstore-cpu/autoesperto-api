'use client';
import { useState } from 'react';
import Link from 'next/link';
import { cancelSubscription, getMyAccount, type AccountUser } from '@/lib/api';
export default function AccountSubscription({user,onUpdate}:{user:AccountUser;onUpdate:(user:AccountUser)=>void}) {
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState('');
  const sub=user.subscription;
  const active=Boolean(user.entitlement.unlimited);
  const trial=sub?.status==='TRIALING';
  const end=sub?.renewsAt?new Date(sub.renewsAt).toLocaleDateString('it-IT',{day:'numeric',month:'long',year:'numeric'}):'';
  const cancel=async()=>{setBusy(true);setMessage('');try{await cancelSubscription();onUpdate((await getMyAccount(true)).user);setMessage('Rinnovo disattivato. Mantieni l’accesso fino alla scadenza indicata.');}catch(err){setMessage(err instanceof Error?err.message:'Non riesco a disdire. Riprova.');}finally{setBusy(false);}};
  return <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5" aria-labelledby="subscription-title"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h2 id="subscription-title" className="font-extrabold text-slate-950">{user.entitlement.owner?'Accesso amministratore':trial?'Abbonamento AI precedente in prova':active?'Abbonamento AI precedente attivo':'Anteprima e report AutoEsperto'}</h2><p className="mt-2 text-sm text-slate-600">{user.entitlement.owner?'Accesso completo riservato alla gestione del sito.':active?(sub?.cancelledAt?'Rinnovo disattivato. Accesso fino al '+end+'.':trial?'La prova termina il '+end+'. Poi 3,99 €/mese secondo le condizioni del tuo piano.':(sub?.plan==='PREMIUM_YEARLY'?'Piano annuale. ':'3,99 €/mese secondo le condizioni del tuo piano. ')+(end?'Prossimo rinnovo: '+end+'.':'')):'Anteprima gratuita. Report completo da 1,99 € oppure 4 report a 4,99 € (3 + 1 omaggio), senza rinnovo.'}</p></div>{active&&sub&&!user.entitlement.owner&&!sub?.cancelledAt?<button type="button" disabled={busy} onClick={()=>void cancel()} className="min-h-11 shrink-0 rounded-xl border border-slate-300 px-4 text-sm font-bold disabled:opacity-50">{busy?'Disattivo il rinnovo…':trial?'Disdici prima dell’addebito':'Disdici il rinnovo'}</button>:!active?<Link href="/prezzi-preview" className="inline-flex min-h-11 shrink-0 items-center rounded-xl bg-blue-700 px-4 text-sm font-bold text-white">Vedi i prezzi</Link>:null}</div>{message&&<p role="status" className="mt-3 text-sm text-blue-700">{message}</p>}</section>;
}
