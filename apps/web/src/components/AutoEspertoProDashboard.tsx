'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ArrowLeft, Check, Loader2, Search, ShieldCheck } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import ReportView from '@/components/ReportView';
import ReportErrorBoundary from '@/components/ReportErrorBoundary';
import { cancelProSubscription, confirmProSubscription, createProCheckout, createReportShare, getMyAccount, getProSubscriptionStatus, getPurchasedReports, getUnlockedReport, type ProSubscriptionStatus, type PurchasedReportSummary } from '@/lib/api';
import type { AutoReport } from '@autoesperto/types';
import { clearAuthToken } from '@/lib/auth';

const date = (value: string | null) => value ? new Date(value).toLocaleDateString('it-IT') : 'In aggiornamento';

export default function AutoEspertoProDashboard() {
  const router = useRouter();
  const [subscription, setSubscription] = useState<ProSubscriptionStatus | null>(null);
  const [reports, setReports] = useState<PurchasedReportSummary[]>([]);
  const [report, setReport] = useState<AutoReport | null>(null);
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const refresh = useCallback(async () => {
    const [pro, history] = await Promise.all([getProSubscriptionStatus(), getPurchasedReports()]);
    setSubscription(pro.subscription);
    setReports(history.reports);
  }, []);

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams(window.location.search);
    const confirmation = params.get('pro') === 'success' && params.get('session_id') ? confirmProSubscription(params.get('session_id')!) : Promise.resolve(null);
    void Promise.all([getMyAccount(true), getProSubscriptionStatus(), getPurchasedReports(), confirmation]).then(([, pro, history, confirmed]) => {
      if (!active) return;
      setSubscription(pro.subscription); setReports(history.reports);
      if (confirmed) setMessage(confirmed.active ? 'Pagamento verificato da Stripe: AutoEsperto PRO è attivo.' : 'Checkout verificato. L’attivazione è ancora in elaborazione da Stripe.');
    }).catch((e: unknown) => {
      const text = e instanceof Error ? e.message : 'Non riesco a caricare la dashboard.';
      if (/401|accesso richiesto|sessione/i.test(text)) { clearAuthToken(); router.replace('/accesso?next=/account/pro'); return; }
      if (active) setError(text);
    });
    return () => { active = false; };
  }, [router]);

  const filtered = useMemo(() => reports.filter((item) => `${item.title} ${item.vehicle.make || ''} ${item.vehicle.model || ''}`.toLowerCase().includes(query.toLowerCase())), [reports, query]);
  const checkout = async () => { setBusy(true); setError(''); try { const result = await createProCheckout(); window.location.assign(result.url); } catch (e) { setError(e instanceof Error ? e.message : 'Checkout non disponibile.'); setBusy(false); } };
  const cancel = async () => {
    if (!window.confirm('Vuoi disdire AutoEsperto PRO? Il piano resterà attivo fino alla fine del periodo già pagato.')) return;
    setBusy(true); setError(''); try { await cancelProSubscription(); setMessage('Disdetta programmata. L’accesso resta attivo fino alla data indicata.'); await refresh(); } catch (e) { setError(e instanceof Error ? e.message : 'Non è stato possibile programmare la disdetta.'); } finally { setBusy(false); }
  };
  const open = async (id: string) => { setBusy(true); setError(''); try { const result = await getUnlockedReport(id); setReport(result.report); window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) { setError(e instanceof Error ? e.message : 'Report non disponibile.'); } finally { setBusy(false); } };
  const share = async (id: string) => { setBusy(true); setError(''); try { const result = await createReportShare(id); const url = `${window.location.origin}/report-condiviso/${result.token}`; await navigator.clipboard.writeText(url); setMessage(`Link copiato. È valido fino al ${date(result.expiresAt)}.`); } catch (e) { setError(e instanceof Error ? e.message : 'Non riesco a creare il link condivisibile.'); } finally { setBusy(false); } };

  return <div className="min-h-screen bg-slate-50"><SiteHeader /><main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
    <Link href="/account" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600"><ArrowLeft className="h-4 w-4" /> Area personale</Link>
    <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-extrabold uppercase tracking-widest text-blue-700">Per concessionarie e commercianti</p><h1 className="mt-2 text-3xl font-black text-slate-950">AutoEsperto PRO</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">30 report inclusi + 3 in omaggio per ciclo mensile, con storico consultabile e PDF scaricabile.</p></div><Link href="/prezzi-preview" className="text-sm font-bold text-blue-700">Dettagli piano e condizioni</Link></div>
    {error && <p role="alert" className="mt-5 flex gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"><AlertTriangle className="h-5 w-5 shrink-0" />{error}</p>}{message && <p role="status" className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">{message}</p>}
    <section className="mt-6 grid gap-4 md:grid-cols-[1.1fr_.9fr]" aria-label="Stato del piano PRO">
      <div className="rounded-2xl bg-slate-900 p-5 text-white sm:p-7"><div className="flex items-center gap-2 text-sm font-bold text-blue-200"><ShieldCheck className="h-5 w-5" /> Piano mensile · 29,99 €</div>{subscription?.status === 'ACTIVE' ? <><p className="mt-5 text-4xl font-black">{subscription.reportsRemaining}<span className="ml-2 text-base font-semibold text-slate-300">report disponibili</span></p><div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-blue-400" style={{ width: `${Math.min(100, subscription.reportsUsed / subscription.reportsTotal * 100)}%` }} /></div><p className="mt-2 text-sm text-slate-300">{subscription.reportsUsed} usati su {subscription.reportsTotal} · 30 inclusi + 3 omaggio · ciclo fino al {date(subscription.periodEnd)}</p>{subscription.cancelledAt && <p className="mt-3 text-sm text-amber-200">Disdetta programmata · accesso fino al {date(subscription.periodEnd)}</p>}<button disabled={busy || !!subscription.cancelledAt} onClick={() => void cancel()} className="mt-5 min-h-11 rounded-xl border border-white/25 px-4 text-sm font-bold disabled:opacity-50">{busy ? 'Attendi…' : subscription.cancelledAt ? 'Disdetta già programmata' : 'Disdici a fine periodo'}</button></> : <><p className="mt-4 text-sm leading-6 text-slate-300">Attiva PRO per avere 33 report completi per periodo: 30 inclusi + 3 in omaggio. I report non usati non si accumulano; nessuna prova gratuita.</p><button disabled={busy} onClick={() => void checkout()} className="mt-5 min-h-11 rounded-xl bg-blue-600 px-5 text-sm font-extrabold disabled:opacity-60">{busy ? 'Apro Stripe…' : 'Attiva PRO · 29,99 €/mese'}</button></>}</div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"><h2 className="text-lg font-extrabold text-slate-950">Come funziona</h2><ul className="mt-4 space-y-3 text-sm text-slate-700">{['Quota rinnovata a ogni fatturazione Stripe', 'Report già sbloccati sempre accessibili nell’account', 'PDF completo dal report aperto', 'Disdetta dal pannello, senza perdere l’accesso già pagato'].map((item) => <li key={item} className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-emerald-600" />{item}</li>)}</ul></div>
    </section>
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h2 className="text-xl font-extrabold text-slate-950">Storico report completi</h2><p className="mt-1 text-sm text-slate-600">Cerca per marca o modello; apri un report per consultarlo o scaricare il PDF.</p></div><label className="relative block sm:w-72"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cerca un veicolo" className="h-10 w-full rounded-lg border border-slate-300 pl-9 pr-3 text-sm" /></label></div>
      {filtered.length ? <ul className="mt-4 divide-y divide-slate-100">{filtered.map((item) => <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3"><div><p className="font-bold text-slate-900">{item.title}</p><p className="text-xs text-slate-500">Report completo · {date(item.unlockedAt)}</p></div><div className="flex gap-2"><button disabled={busy} onClick={() => void share(item.id)} className="min-h-10 rounded-lg border border-slate-300 px-3 text-sm font-bold text-slate-700 disabled:opacity-50">Copia link sicuro</button><button disabled={busy} onClick={() => void open(item.id)} className="min-h-10 rounded-lg bg-blue-700 px-4 text-sm font-bold text-white disabled:opacity-50">Apri e scarica PDF</button></div></li>)}</ul> : <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">{query ? 'Nessun report corrisponde alla ricerca.' : 'I report sbloccati compariranno qui.'}</p>}
    </section>
    {busy && <p className="mt-4 flex items-center gap-2 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" />Operazione in corso…</p>}
    {report && <div className="mt-6"><ReportErrorBoundary onRetry={() => setReport(null)}><ReportView report={report} embedded showAds={false} allowPhotoTools={false} /></ReportErrorBoundary></div>}
  </main></div>;
}
