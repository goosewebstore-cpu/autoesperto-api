'use client';

import { useEffect, useState } from 'react';
import {
  Activity, AlertTriangle, BarChart3, CreditCard, Eye, FileText, Loader2, ScanLine, Star, TrendingUp, UserPlus,
} from 'lucide-react';
import { getAnalyticsOverview, type AnalyticsOverview } from '@/lib/api';

function StatCard({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: number; accent: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-slate-500">
        <Icon className={`h-4 w-4 ${accent}`} />
        {label}
      </div>
      <p className="mt-3 text-3xl font-extrabold text-slate-950 number-mono">{value.toLocaleString('it-IT')}</p>
    </div>
  );
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getAnalyticsOverview()
      .then((res) => { if (active) setData(res); })
      .catch((err) => { if (active) setError(err.message || 'Non riesco a caricare le statistiche.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  if (loading) {
    return <div className="mt-8 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-sm font-semibold text-slate-600"><Loader2 className="h-5 w-5 animate-spin text-blue-600" /> Carico le statistiche…</div>;
  }

  if (error || !data) {
    return <div role="alert" className="mt-8 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" /> {error || 'Statistiche non disponibili.'}</div>;
  }

  const { totals, last7d, last30d, funnel7d, visitsByDay } = data.overview;
  const maxDay = Math.max(1, ...visitsByDay.map((d) => d.count));
  const maxFunnel = Math.max(1, ...funnel7d.map((f) => f.count));

  return (
    <div className="mt-8 space-y-6">
      <section className="rounded-3xl bg-slate-950 p-6 text-white sm:p-8">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.14em] text-blue-300"><BarChart3 className="h-4 w-4" /> Statistiche del sito</div>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">Come sta andando AutoEsperto</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">Statistiche del browser con consenso analytics e operazioni confermate dal server. Le persone che rifiutano il consenso non sono incluse negli eventi del percorso.</p>
      </section>

      <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Dal 2 novembre 2026 le sessioni sono distinte dalle pagine viste e le visite non vengono più inviate anche all’uscita. Lo storico precedente contiene conteggi duplicati e non è direttamente confrontabile. Le schede “storico” coprono tutto il periodo di raccolta; visitatori e funnel coprono solo 7 giorni.</p>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icon={Eye} label="Sessioni · storico" value={totals.visits} accent="text-blue-600" />
        <StatCard icon={ScanLine} label="Scansioni riuscite · storico" value={totals.scans} accent="text-violet-600" />
        <StatCard icon={FileText} label="Analisi salvate · storico" value={totals.analyses} accent="text-emerald-600" />
        <StatCard icon={CreditCard} label="Checkout · storico" value={totals.checkouts} accent="text-amber-600" />
        <StatCard icon={UserPlus} label="Registrazioni · storico" value={totals.registers} accent="text-rose-600" />
        <StatCard icon={Activity} label="Visitatori unici (7g)" value={totals.uniqueVisitors7d} accent="text-cyan-600" />
        <StatCard icon={TrendingUp} label="Pagamenti · storico" value={totals.purchases} accent="text-emerald-600" />
        <StatCard icon={Star} label="Attivazioni Premium · storico" value={totals.premiumSubscribers} accent="text-amber-600" />
        <StatCard icon={Eye} label="Pagine viste · storico" value={totals.pageViews} accent="text-blue-600" />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="text-sm font-extrabold text-slate-950">Funnel di conversione · ultimi 7 giorni</h3>
        <p className="mt-1 text-xs text-slate-500">Conteggi degli eventi negli ultimi 7 giorni, non persone seguite individualmente. La prima analisi è gratuita: l’offerta può essere vista in una visita successiva.</p>
        <div className="mt-5 space-y-3">
          {funnel7d.map((f, i) => (
            <div key={f.step}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">{f.step}</span>
                <span className="text-slate-500">
                  <span className="font-extrabold text-slate-950 number-mono">{f.count.toLocaleString('it-IT')}</span>
                  {i > 0 && <span className="ml-2 text-emerald-600">↳ {f.conversion.toLocaleString('it-IT')}%</span>}
                  <span className="ml-1 text-slate-400">({f.overall.toLocaleString('it-IT')}% sul totale)</span>
                </span>
              </div>
              <div className="mt-1.5 h-2.5 w-full rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${i === 0 ? 'bg-blue-600' : i >= funnel7d.length - 1 ? 'bg-emerald-500' : 'bg-blue-400'}`}
                  style={{ width: `${(f.count / maxFunnel) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="text-sm font-extrabold text-slate-950">Visite ultimi 7 giorni</h3>
        <div className="mt-5 flex h-40 items-end gap-2">
          {visitsByDay.map((d) => (
            <div key={d.key} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="w-full rounded-t-lg bg-blue-600/80" style={{ height: `${Math.max(4, (d.count / maxDay) * 100)}%` }} title={`${d.count} visite`} />
              <span className="text-[10px] font-bold text-slate-500">{d.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="text-sm font-extrabold text-slate-950">Motivi dei tentativi non completati · 7 giorni</h3>
        <p className="mt-2 text-xs text-slate-500">Comprende limiti della prova gratuita, pagamento richiesto ed errori tecnici. Un tentativo senza evento finale può indicare un abbandono o una misurazione mancante.</p>
        <ul className="mt-4 space-y-2 text-sm">{(data.overview.failures7d || []).map(({ reason, count }) => <li key={reason} className="flex justify-between gap-3"><span>{({trial_used_login_required: 'Prova usata: accesso richiesto', payment_required: 'Pagamento richiesto', rate_limited: 'Troppe richieste', timeout: 'Tempo di attesa superato', missing_report: 'Report non restituito', network_error: 'Connessione non riuscita'} as Record<string, string>)[reason] || reason}</span><strong>{count}</strong></li>)}</ul>
        {!data.overview.failures7d?.length && <p className="mt-3 text-sm text-slate-500">Nessun motivo registrato nel periodo. La misurazione è disponibile dalla versione del 2 novembre.</p>}
      </section>
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-sm font-extrabold text-slate-950">Ultimi 7 giorni</h3>
          <dl className="mt-4 space-y-2 text-sm">
            {[['Visite', last7d.visits], ['Analisi avviate', last7d.analysesStarted], ['Analisi completate', last7d.analysesCompleted || 0], ['Tentativi non completati', last7d.analysesFailed || 0], ['Risultati visti', last7d.resultsViewed], ['Offerte report viste', last7d.reportOffersViewed], ['Acquisti report avviati', last7d.reportPurchasesStarted], ['Checkout Premium', last7d.premiumCheckoutsStarted], ['Pagamenti completati', last7d.purchases], ['Registrazioni', last7d.registers]].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between border-b border-slate-100 pb-2 last:border-0">
                <dt className="text-slate-600">{label}</dt>
                <dd className="font-extrabold text-slate-950 number-mono">{(value as number).toLocaleString('it-IT')}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-sm font-extrabold text-slate-950">Ultimi 30 giorni</h3>
          <dl className="mt-4 space-y-2 text-sm">
            {[['Visite', last30d.visits], ['Analisi avviate', last30d.analysesStarted], ['Analisi completate', last30d.analysesCompleted || 0], ['Tentativi non completati', last30d.analysesFailed || 0], ['Risultati visti', last30d.resultsViewed], ['Offerte report viste', last30d.reportOffersViewed], ['Acquisti report avviati', last30d.reportPurchasesStarted], ['Checkout Premium', last30d.premiumCheckoutsStarted], ['Pagamenti completati', last30d.purchases], ['Registrazioni', last30d.registers]].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between border-b border-slate-100 pb-2 last:border-0">
                <dt className="text-slate-600">{label}</dt>
                <dd className="font-extrabold text-slate-950 number-mono">{(value as number).toLocaleString('it-IT')}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  );
}
