'use client';

import { useEffect, useState } from 'react';
import {
  Activity, AlertTriangle, BarChart3, CreditCard, Eye, FileText, Loader2, ScanLine, UserPlus,
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

  const { totals, last7d, last30d, visitsByDay } = data.overview;
  const maxDay = Math.max(1, ...visitsByDay.map((d) => d.count));

  return (
    <div className="mt-8 space-y-6">
      <section className="rounded-3xl bg-slate-950 p-6 text-white sm:p-8">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.14em] text-blue-300"><BarChart3 className="h-4 w-4" /> Statistiche del sito</div>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">Come sta andando AutoEsperto</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">Visite, analisi e registrazioni raccolte in modo rispettoso della privacy: nessun dato personale, solo numeri aggregati.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icon={Eye} label="Visite totali" value={totals.visits} accent="text-blue-600" />
        <StatCard icon={ScanLine} label="Scansioni foto" value={totals.scans} accent="text-violet-600" />
        <StatCard icon={FileText} label="Analisi salvate" value={totals.analyses} accent="text-emerald-600" />
        <StatCard icon={CreditCard} label="Checkout avviati" value={totals.checkouts} accent="text-amber-600" />
        <StatCard icon={UserPlus} label="Registrazioni" value={totals.registers} accent="text-rose-600" />
        <StatCard icon={Activity} label="Visitatori unici (7g)" value={totals.uniqueVisitors7d} accent="text-cyan-600" />
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

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-sm font-extrabold text-slate-950">Ultimi 7 giorni</h3>
          <dl className="mt-4 space-y-2 text-sm">
            {[['Visite', last7d.visits], ['Scansioni', last7d.scans], ['Analisi salvate', last7d.analyses], ['Checkout', last7d.checkouts], ['Registrazioni', last7d.registers]].map(([label, value]) => (
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
            {[['Visite', last30d.visits], ['Scansioni', last30d.scans], ['Analisi salvate', last30d.analyses], ['Checkout', last30d.checkouts], ['Registrazioni', last30d.registers]].map(([label, value]) => (
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
