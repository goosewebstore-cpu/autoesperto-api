'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  CheckCircle2,
  Loader2,
  LogOut,
  MailCheck,
  Search,
} from 'lucide-react';
import ReportView from '@/components/ReportView';
import ReportErrorBoundary from '@/components/ReportErrorBoundary';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import { type AccountUser, type StoredAnalysis, getMyAccount, getMyAnalysis, resendVerification } from '@/lib/api';
import { clearAuthToken, getAuthToken } from '@/lib/auth';

const damageLabels: Record<string, string> = {
  graffio: 'Graffio sulla carrozzeria',
  ammaccatura: 'Ammaccatura',
  paraurti: 'Paraurti',
  fanale: 'Gruppo ottico',
  specchietto: 'Specchietto',
  cerchio_gomma: 'Cerchio o pneumatico',
  nessun_danno_evidente: 'Nessun danno evidente',
  non_chiaro: 'Area non valutabile',
};

function euro(value: number) {
  return `${value.toLocaleString('it-IT')} €`;
}

export default function AccountDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<AccountUser | null>(null);
  const [analyses, setAnalyses] = useState<StoredAnalysis[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resend, setResend] = useState(false);

  const isOwner = user?.email?.toLowerCase() === 'goosewebstore@gmail.com';
  const activeAnalysis = analyses.find((a) => a.id === activeId) || analyses[0] || null;

  useEffect(() => {
    let active = true;
    const bootstrap = async () => {
      if (!getAuthToken()) {
        router.replace('/accesso?next=/account');
        return;
      }
      try {
        const [accountResult, analysisResult] = await Promise.all([getMyAccount(), getMyAnalysis()]);
        if (!active) return;
        setUser(accountResult.user);
        const list = analysisResult.analyses || (analysisResult.analysis ? [analysisResult.analysis] : []);
        setAnalyses(list);
        setActiveId((current) => current ?? list[0]?.id ?? null);
      } catch (err) {
        const message = err instanceof Error ? err.message : '';
        if (/accesso richiesto|sessione|401/i.test(message)) {
          clearAuthToken();
          router.replace('/accesso?next=/account');
          return;
        }
        if (active) setError(message || 'Non riesco a caricare la tua area personale.');
      } finally {
        if (active) setLoading(false);
      }
    };
    void bootstrap();
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = () => {
    clearAuthToken();
    router.replace('/');
  };

  if (loading) {
    return <main className="grid min-h-screen place-items-center bg-slate-50"><div className="text-center"><Loader2 className="mx-auto h-7 w-7 animate-spin text-blue-600" /><p className="mt-3 text-sm font-semibold text-slate-600">Carico la tua area personale…</p></div></main>;
  }

  if (!user) return null;

  const emailVerified = !user.email || user.entitlement?.emailVerified !== false;

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-5 py-8 sm:py-12">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-700"><ArrowLeft className="h-3.5 w-3.5" /> Home</Link>
            <p className="mt-4 text-xs font-extrabold uppercase tracking-[.14em] text-blue-600">Area personale</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">Ciao {user.name || 'da AutoEsperto'}</h1>
            <p className="mt-2 text-sm text-slate-600">{user.email || user.phone} · Analisi salvate {analyses.length}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={logout} className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600">
              <LogOut className="h-3.5 w-3.5" /> Esci
            </button>
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-extrabold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-current" />
              Account gratuito
            </div>
          </div>
        </div>

        {message && <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-800">{message}</div>}
        {error && <div role="alert" className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}

        {!emailVerified && user.email && (
          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <MailCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <p className="text-sm font-extrabold text-amber-900">Verifica la tua email</p>
                <p className="mt-0.5 text-xs text-amber-800">La verifica ti assicura che le analisi restino salvate sul tuo account. Controlla la posta di <strong>{user.email}</strong> (anche spam).</p>
              </div>
            </div>
            <button onClick={() => { setError(''); setResend(true); resendVerification().then(() => setMessage('Email di verifica reinviata. Controlla la posta.')).catch((e: unknown) => setError(e instanceof Error ? e.message : 'Reinvio fallito.')).finally(() => setResend(false)); }} disabled={resend} className="inline-flex items-center gap-2 rounded-lg border border-amber-500 bg-white px-3 py-2 text-xs font-bold text-amber-700 hover:bg-amber-100 disabled:opacity-60">
              {resend ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MailCheck className="h-3.5 w-3.5" />} Reinvia email
            </button>
          </div>
        )}

        {isOwner && <AnalyticsDashboard />}

        <section className="mt-8" aria-label="Le tue analisi">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[.14em] text-emerald-600">Le tue analisi</p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">Le analisi salvate gratis</h2>
              <p className="mt-1 text-sm text-slate-600">Tutte le analisi complete sono salvate nel tuo account e restano consultabili quando vuoi, senza scadenza.</p>
            </div>
            <Link href="/#scanner-section" className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-extrabold text-white transition hover:bg-accent-hover">
              <Search className="h-4 w-4" /> Nuova analisi
            </Link>
          </div>

          {analyses.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <Camera className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-3 text-sm font-bold text-slate-700">Nessuna analisi salvata ancora</p>
              <p className="mt-1 text-sm text-slate-500">Analizza un&apos;auto dalla home: il report verrà salvato qui automaticamente.</p>
              <Link href="/#scanner-section" className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-extrabold text-white transition hover:bg-accent-hover">
                Analizza un&apos;auto <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {analyses.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setActiveId(a.id)}
                    className={`rounded-2xl border bg-white p-5 text-left transition ${a.id === activeAnalysis?.id ? 'border-accent ring-2 ring-accent/30' : 'border-slate-200 hover:border-accent/40'}`}
                  >
                    <p className="truncate text-base font-extrabold text-slate-950">{[a.vehicle.make, a.vehicle.model].filter(Boolean).join(' ')}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">{a.title}</p>
                    <p className="mt-2 text-[11px] text-slate-400">Creata il {new Date(a.createdAt).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </button>
                ))}
              </div>

              {activeAnalysis && (
                <div className="mt-6">
                  <section className="rounded-3xl bg-slate-950 p-6 text-white sm:p-9">
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                      <div>
                        <p className="text-xs font-extrabold uppercase tracking-[.14em] text-emerald-300">Analisi salvata</p>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight">{activeAnalysis.title}</h2>
                        <p className="mt-2 text-sm text-slate-400">Creata il {new Date(activeAnalysis.createdAt).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })} · salvata nel tuo account</p>
                      </div>
                      <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-bold"><Check className="h-4 w-4 text-emerald-400" /> {analyses.length} salvate</div>
                    </div>
                  </section>

                  <section className="mt-4 grid gap-4 md:grid-cols-3">
                    <article className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Riconoscimento</p><p className="mt-3 text-lg font-extrabold text-slate-950">{[activeAnalysis.vehicle.make, activeAnalysis.vehicle.model].filter(Boolean).join(' ')}</p><p className="mt-1 text-sm text-slate-600">Confidenza {activeAnalysis.vehicle.confidence}</p></article>
                    <article className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Stato visibile</p><p className="mt-3 text-lg font-extrabold text-slate-950">{damageLabels[activeAnalysis.photoAnalysis.damage.category] || 'Valutazione esterna'}</p><p className="mt-1 text-sm text-slate-600">{activeAnalysis.photoAnalysis.damage.description}</p></article>
                    <article className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Riparazione indicativa</p><p className="mt-3 text-lg font-extrabold text-slate-950">{activeAnalysis.photoAnalysis.repairRange ? `${euro(activeAnalysis.photoAnalysis.repairRange.min)} – ${euro(activeAnalysis.photoAnalysis.repairRange.max)}` : 'Nessun costo stimato'}</p><p className="mt-1 text-sm text-slate-600">Solo elementi esterni chiaramente visibili.</p></article>
                  </section>

                  <div className="mt-8"><ReportErrorBoundary><ReportView report={activeAnalysis.report} embedded showAds={false} allowPhotoTools={false} /></ReportErrorBoundary></div>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
