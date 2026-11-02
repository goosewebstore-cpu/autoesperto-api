'use client';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowRight, Check, Loader2, Smartphone, X } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import PaymentMethods from '@/components/PaymentMethods';
import { canExportPremiumPdf } from '@/lib/pdf/access';
import { createSubscription, confirmSubscription, getMyAccount, type AccountUser } from '@/lib/api';
export default function SubscriptionCheckout() {
  const params = useSearchParams();
  const router = useRouter();
  const rawNext = params.get('next') || '/';
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') && !rawNext.includes('\\') ? rawNext.split('#')[0] : '/';
  const [account,setAccount] = useState<AccountUser | null>(null);
  const [ready,setReady] = useState(false);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState('');
  const [checkout,setCheckout] = useState<{url:string;sessionId:string;trialDays:number} | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const activated = useRef(false);
  useEffect(() => {
    getMyAccount(true).then(result => {setAccount(result.user);setReady(true);}).catch(err => {
      if (err.status === 401) setReady(true);
      else {setError('Non riesco a verificare il tuo account. Riprova tra poco.');setReady(true);}
    });
  },[next,router]);
  useEffect(() => {
    if (!checkout) return;
    dialog.current?.showModal();
    let busy = false;
    let stopped = false;
    const started = Date.now();
    const poll = async () => {
      if (busy || stopped || activated.current || document.visibilityState !== 'visible' || Date.now()-started > 10*60*1000) return;
      busy = true;
      try {
        const result = await confirmSubscription(checkout.sessionId);
        if (result.active && !stopped) {activated.current=true;window.location.assign(next + (next.includes('?')?'&':'?') + 'subscription=success&session_id=' + encodeURIComponent(checkout.sessionId));}
      } catch { /* An open checkout is not an activation. */ }
      finally {busy=false;}
    };
    const timer = window.setInterval(() => {void poll();},5000);
    return () => {stopped=true;window.clearInterval(timer);};
  },[checkout,next]);
  const start = async () => {
    if (loading || !ready) return;
    if (!account) {router.push('/accesso?next=' + encodeURIComponent('/abbonamento?next=' + encodeURIComponent(next)));return;}
    if (canExportPremiumPdf(account)) {router.push('/account');return;}
    setLoading(true);setError('');
    try {
      const result = await createSubscription('month',next);
      if (!result.sessionId) {window.location.assign(result.url);return;}
      if (window.matchMedia('(max-width: 639px)').matches) window.location.assign(result.url);
      else setCheckout(result as {url:string;sessionId:string;trialDays:number});
    } catch(err) {setError(err instanceof Error?err.message:'Non riesco ad aprire il checkout. Riprova.');}
    finally {setLoading(false);}
  };
  const alreadyActive=canExportPremiumPdf(account);
  if (!ready) return <div className="grid min-h-screen place-items-center bg-slate-50"><p className="text-sm font-semibold text-slate-600">Verifico il tuo piano…</p></div>;
  if (ready && !alreadyActive) return <div className="flex min-h-screen flex-col bg-slate-50"><SiteHeader /><main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6"><section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10"><p className="text-xs font-extrabold uppercase tracking-widest text-blue-700">Piani AutoEsperto</p><h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Anteprima gratis.<br />Report completo quando ti serve.</h1><p className="mt-4 text-base leading-relaxed text-slate-600">I nuovi acquisti sono a pagamento una tantum: 1,99 € per un report o 4,99 € per 4 report (3 + 1 omaggio), senza rinnovo. AutoEsperto PRO è dedicato ai professionisti: 30 report + 3 omaggio per ciclo.</p><Link href="/prezzi-preview" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-blue-700 px-5 text-sm font-bold text-white">Confronta i piani <ArrowRight className="h-4 w-4" /></Link><p className="mt-4 text-xs leading-relaxed text-slate-500">Se hai già un vecchio abbonamento attivo, le sue condizioni restano invariate: puoi consultarlo e disdirlo dalla tua area personale.</p>{!account&&<Link href="/accesso?next=/account" className="ml-4 text-sm font-bold text-blue-700">Accedi al tuo account</Link>}</section></main><SiteFooter /></div>;
  return <div className="min-h-screen bg-slate-50"><SiteHeader />
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Link href={next} className="inline-flex min-h-10 items-center text-sm font-semibold text-blue-700">← Torna alla valutazione</Link>
      <div className="mt-5 grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <section className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-slate-100 p-5 sm:p-8">
          <div className="flex items-center gap-3"><img src="/logo.png" alt="" width={40} height={40} className="h-10 w-10 rounded-full"/><p className="text-sm font-extrabold text-slate-950">AutoEsperto <span className="text-blue-600">AI</span></p></div>
          <h1 className="mt-5 max-w-lg text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">{alreadyActive ? 'Il tuo piano è già attivo.' : 'Più informazioni, prima di scegliere.'}</h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600">Analizza foto e annunci senza limiti. Ritrova i report nel tuo account e porta con te il PDF completo.</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">{[{title:'Foto e annunci',desc:'Riconoscimento e confronto del prezzo.'},{title:'Controlli e costi',desc:'Criticità, budget e checklist della visita.'},{title:'PDF completo',desc:'Dettagli e ipotesi, pronti da consultare.'},{title:'Report salvati',desc:'Le tue analisi riunite nel tuo account.'}].map(item=><li key={item.title} className="flex gap-3 rounded-2xl border border-white bg-white/80 p-4"><Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" aria-hidden="true"/><span><strong className="block text-sm text-slate-950">{item.title}</strong><span className="mt-1 block text-xs leading-relaxed text-slate-600">{item.desc}</span></span></li>)}</ul>
          <p className="mt-5 rounded-xl bg-blue-100/60 px-4 py-3 text-xs leading-relaxed text-blue-950">Vuoi partire dal modello? La valutazione e il PDF essenziale restano sempre gratuiti.</p>
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-blue-100 pt-4 text-xs"><Link href="/contatti" className="font-semibold text-blue-700 underline underline-offset-2">Hai dubbi? Contattaci</Link><Link href="/chi-siamo" className="text-slate-600 underline underline-offset-2">Chi siamo</Link></div>
        </section>
        <aside className="space-y-4 lg:sticky lg:top-24" aria-label="Riepilogo abbonamento">
          <section className="overflow-hidden rounded-3xl border border-blue-200 bg-white shadow-sm">
            <div className="border-b border-blue-100 bg-blue-50 px-6 py-4"><h2 className="text-base font-bold text-slate-950">{alreadyActive ? 'Abbonamento attivo' : 'Il tuo abbonamento'}</h2><p className="mt-1 text-xs text-slate-600">Foto, annunci e report completi</p></div>
            <div className="p-6"><p className="text-sm font-medium text-slate-600">{alreadyActive ? 'Gestisci il piano dal tuo account' : 'Abbonamento mensile'}</p><p className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950">{alreadyActive ? 'Già disponibile' : '3,99 €'}{!alreadyActive&&<span className="text-base font-medium text-slate-500"> / mese</span>}</p>
              {!alreadyActive&&<dl className="mt-5 space-y-3 border-y border-slate-100 py-4 text-sm"><div className="flex justify-between gap-3"><dt className="text-slate-600">Rinnovo</dt><dd className="font-bold text-slate-900">3,99 €/mese</dd></div><div className="flex justify-between gap-3"><dt className="text-slate-600">Metodo di pagamento</dt><dd className="text-right font-semibold text-slate-900">Richiesto su Stripe</dd></div></dl>}
              <button type="button" onClick={()=>void start()} disabled={!ready||loading} className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 text-sm font-bold text-white transition-colors hover:bg-blue-800 disabled:opacity-60">{(!ready||loading)&&<Loader2 className="h-4 w-4 animate-spin"/>}{!ready ? 'Verifico il tuo account…' : loading ? 'Preparo il checkout…' : alreadyActive ? 'Gestisci il tuo piano' : !account ? 'Accedi e continua' : 'Continua su Stripe · 3,99 €/mese'}<ArrowRight className="h-4 w-4 shrink-0"/></button>
              {!alreadyActive&&<p className="mt-3 text-xs leading-relaxed text-slate-600">Carta richiesta. Addebito immediato di 3,99 €, poi rinnovo automatico mensile. Puoi disdire in qualsiasi momento dall’account. L’abbonamento si attiva solo dopo la conferma nel checkout Stripe.</p>}
              <p className="mt-4 text-xs leading-relaxed text-slate-500"><Link href="/terms" className="underline underline-offset-2">Termini e rinnovo</Link><span className="mx-2">·</span><Link href="/privacy" className="underline underline-offset-2">Privacy</Link><span className="mx-2">·</span><Link href="/contatti" className="underline underline-offset-2">Assistenza</Link></p>
              {error&&<p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            </div>
          </section>
          <PaymentMethods />
          <p className="px-2 text-xs leading-relaxed text-slate-500">Da computer puoi scegliere di continuare sul telefono inquadrando il QR del tuo checkout. Il QR apre la stessa sessione Stripe.</p>
        </aside>
      </div>
    </main><SiteFooter />
    <dialog ref={dialog} onCancel={()=>setCheckout(null)} className="max-h-[90vh] w-[min(92vw,480px)] overflow-y-auto rounded-3xl p-6 shadow-2xl backdrop:bg-slate-950/50"><div className="flex items-center justify-between gap-4"><h2 className="text-lg font-extrabold text-slate-950">Continua sul checkout Stripe</h2><button type="button" aria-label="Chiudi opzioni checkout" onClick={()=>{dialog.current?.close();setCheckout(null);}} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100"><X className="h-4 w-4"/></button></div>{checkout&&<><p className="mt-2 text-sm text-slate-600">3,99 €/mese · addebito immediato con rinnovo automatico</p><a href={checkout.url} className="mt-5 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 text-sm font-bold text-white">Apri Stripe su questo computer<ArrowRight className="h-4 w-4"/></a><div className="my-5 border-t border-slate-100"/><div className="flex items-center justify-center gap-2 text-sm font-bold"><Smartphone className="h-4 w-4"/>Oppure continua sul telefono</div><div className="mx-auto my-4 w-fit rounded-2xl border border-slate-200 bg-white p-4"><QRCodeSVG value={checkout.url} size={196} level="M" marginSize={2} title="Apri questo checkout Stripe sul telefono"/></div><p className="mb-5 text-center text-xs leading-relaxed text-slate-500">Inquadra con la fotocamera. Dopo l’attivazione confermata, questa pagina ti riporta alla valutazione.</p><PaymentMethods compact/></>}</dialog>
  </div>;
}
