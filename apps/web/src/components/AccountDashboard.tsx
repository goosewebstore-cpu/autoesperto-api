'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  Camera,
  Car,
  Check,
  CheckCircle2,
  CreditCard,
  FileText,
  Loader2,
  LockKeyhole,
  LogOut,
  MailCheck,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import ReportView from '@/components/ReportView';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import { fireAdsPurchase } from '@/components/AdsTracker';
import { getPremiumPricing } from '@/lib/pricing';
import {
  type AccountUser,
  type StoredAnalysis,
  createSubscription,
  cancelSubscription,
  getMyAccount,
  getMyAnalysis,
  resendVerification,
} from '@/lib/api';
import { clearAuthToken, getAuthToken } from '@/lib/auth';
import { getUserTier } from '@/lib/subscription';
import { PremiumBadge } from '@/components/PremiumBadge';

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

export default function AccountDashboard({ checkout, subscription, upgrade, sessionId }: { checkout?: string; subscription?: string; upgrade?: string; sessionId?: string }) {
  const premium = getPremiumPricing();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<AccountUser | null>(null);
  const [analysis, setAnalysis] = useState<StoredAnalysis | null>(null);
  const [analyses, setAnalyses] = useState<StoredAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [immediateExecutionAccepted, setImmediateExecutionAccepted] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [resend, setResend] = useState(false);

  const isOwner = user?.email?.toLowerCase() === 'goosewebstore@gmail.com';

  const refresh = async () => {
    const [accountResult, analysisResult] = await Promise.all([getMyAccount(), getMyAnalysis()]);
    setUser(accountResult.user);
    setAnalysis(analysisResult.analysis);
    setAnalyses(analysisResult.analyses || (analysisResult.analysis ? [analysisResult.analysis] : []));
  };

  useEffect(() => {
    let active = true;
    const bootstrap = async () => {
      if (!getAuthToken()) {
        router.replace('/accesso?next=/account');
        return;
      }
      try {
        if (subscription === 'success' && sessionId) {
          setMessage('Abbonamento Premium attivato con successo! Ora hai accesso illimitato alle analisi complete.');
          window.history.replaceState(null, '', '/account');
        } else if (subscription === 'cancelled') {
          setMessage('Attivazione abbonamento annullata.');
          window.history.replaceState(null, '', '/account');
        } else if (upgrade === 'true') {
          window.history.replaceState(null, '', '/account');
        }
        await refresh();
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

  const handleUpgrade = async () => {
    setError('');
    setPaying(true);
    try {
      const result = await createSubscription();
      window.location.assign(result.url);
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      setError(message || 'Non riesco ad aprire il pagamento sicuro.');
      setPaying(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Sei sicuro di voler annullare l\'abbonamento Premium? Avrai accesso fino alla scadenza del periodo pagato.')) return;
    setCancelling(true);
    try {
      await cancelSubscription();
      await refresh();
      setMessage('Abbonamento annullato. Rimarrà attivo fino alla scadenza.');
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      setError(message || 'Errore durante l\'annullamento dell\'abbonamento.');
    } finally {
      setCancelling(false);
    }
  };

  const analyzeFile = async (file?: File) => {
    if (!file) return;
    setError('');
    setMessage('');
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Carica una foto JPG, PNG o WebP.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('La foto deve essere al massimo di 5 MB.');
      return;
    }

    setAnalyzing(true);
    try {
      const imageData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error('Impossibile leggere la foto.'));
        reader.readAsDataURL(file);
      });
      // Implementata scansione lato frontend in caso di aggiunta
      // Per adesso disabilitiamo l'analisi a pagamento singolo e redirigiamo all'Home
      router.push('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      setError(message || 'Non riesco a completare l’analisi.');
    } finally {
      setAnalyzing(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const logout = () => {
    clearAuthToken();
    router.replace('/');
  };

  if (loading) {
    return <main className="grid min-h-screen place-items-center bg-slate-50"><div className="text-center"><Loader2 className="mx-auto h-7 w-7 animate-spin text-blue-600" /><p className="mt-3 text-sm font-semibold text-slate-600">Carico la tua area personale…</p></div></main>;
  }

  if (!user) return null;

  const userTier = getUserTier(user, true); // true forces tier logic evaluation (if registered, you get registered tier)

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5"><span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white"><Car className="h-4 w-4" /></span><span className="font-extrabold text-slate-950">Auto<span className="text-blue-600">Esperto</span></span></Link>
          <div className="flex items-center gap-3">
            {isOwner && (
              <button onClick={() => setShowAnalytics((v) => !v)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-blue-600 hover:text-blue-700"><BarChart3 className="h-4 w-4" /> {showAnalytics ? 'Chiudi statistiche' : 'Statistiche'}</button>
            )}
            <button onClick={logout} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950"><LogOut className="h-4 w-4" /> Esci</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8 sm:py-12">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-700"><ArrowLeft className="h-3.5 w-3.5" /> Home</Link>
            <p className="mt-4 text-xs font-extrabold uppercase tracking-[.14em] text-blue-600">Area personale</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">Ciao {user.name || 'da AutoEsperto'}</h1>
            <p className="mt-2 text-sm text-slate-600">{user.email || user.phone} · Analisi salvate {analyses.length}</p>
          </div>
          <div className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-extrabold ${userTier === 'premium' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-700'}`}>
            <span className="h-2 w-2 rounded-full bg-current" />
            {userTier === 'premium' ? 'Premium Attivo' : user.entitlement.emailVerified === false && user.email ? 'Email da verificare' : 'Piano Gratuito / Registrato'}
          </div>
        </div>

        {message && <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-800">{message}</div>}
        {error && <div role="alert" className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}

        {user.entitlement && !user.entitlement.emailVerified && user.email && (
          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <MailCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <p className="text-sm font-extrabold text-amber-900">Verifica la tua email</p>
                <p className="mt-0.5 text-xs text-amber-800">L'analisi gratuita si sblocca solo dopo la verifica. Controlla la posta di <strong>{user.email}</strong> (anche spam).</p>
              </div>
            </div>
            <button onClick={() => { setError(''); setResend(true); resendVerification().then(() => setMessage('Email di verifica reinviata. Controlla la posta.')).catch((e: unknown) => setError(e instanceof Error ? e.message : 'Reinvio fallito.')).finally(() => setResend(false)); }} disabled={resend} className="inline-flex items-center gap-2 rounded-lg border border-amber-500 bg-white px-3 py-2 text-xs font-bold text-amber-700 hover:bg-amber-100 disabled:opacity-60">
              {resend ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MailCheck className="h-3.5 w-3.5" />} Reinvia email
            </button>
          </div>
        )}

        {isOwner && showAnalytics && <AnalyticsDashboard />}

        {userTier !== 'premium' && (
          <section className="mt-8 grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,.07)] lg:grid-cols-[1.15fr_.85fr]">
            <div className="p-6 sm:p-9"><span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-extrabold text-blue-700"><LockKeyhole className="h-3.5 w-3.5" /> Sblocca Premium</span><h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-950">Ottieni il massimo da AutoEsperto.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">Il piano Registrato (attuale) include le informazioni base delle analisi. Passa a Premium per sbloccare prezzi reali, difetti frequenti, costi di riparazione e consumi.</p><div className="mt-6 grid gap-3 sm:grid-cols-2">{['Analisi complete illimitate', 'Generatore annunci di vendita', 'Zero pubblicità', 'Annulli quando vuoi'].map((item) => <div key={item} className="flex items-center gap-2 text-sm font-bold text-slate-700"><CheckCircle2 className="h-4 w-4 text-emerald-600" />{item}</div>)}</div></div>
            <div className="flex flex-col justify-center bg-slate-950 p-6 text-white sm:p-9"><p className="text-xs font-extrabold uppercase tracking-[.14em] text-blue-300">Abbonamento Mensile</p><div className="mt-3 text-4xl font-extrabold">{premium.displayPrice}<span className="text-xl text-slate-400 font-medium">/mese</span></div><p className="mt-1 text-sm text-slate-400">Rinnovo automatico. Cancelli online in un clic.</p><button onClick={handleUpgrade} disabled={paying} className="mt-7 flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-extrabold text-white transition hover:bg-blue-500 disabled:opacity-60">{paying ? <><Loader2 className="h-4 w-4 animate-spin" /> Apro Stripe…</> : <><CreditCard className="h-4 w-4" /> Passa a Premium</>}</button><p className="mt-4 flex items-center gap-2 text-xs text-slate-400"><LockKeyhole className="h-3.5 w-3.5 shrink-0" /> Pagamento gestito da Stripe. AutoEsperto non vede i dati della carta.</p></div>
          </section>
        )}

        {userTier === 'premium' && user.subscription && (
          <section className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-6 sm:p-9 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[.14em] text-amber-700">Abbonamento Attivo</p>
              <h2 className="mt-2 text-2xl font-extrabold text-slate-950">AutoEsperto Premium</h2>
              <p className="mt-1 text-sm text-slate-700">
                {user.subscription.status === 'ACTIVE' 
                  ? (user.subscription.cancelledAt ? `Si annullerà automaticamente il ${new Date(user.subscription.renewsAt!).toLocaleDateString('it-IT')}` : `Rinnovo automatico il ${new Date(user.subscription.renewsAt!).toLocaleDateString('it-IT')}`)
                  : 'Stato abbonamento non attivo.'}
              </p>
            </div>
            {user.subscription.status === 'ACTIVE' && !user.subscription.cancelledAt && (
              <button onClick={handleCancel} disabled={cancelling} className="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-white px-5 py-2.5 text-sm font-bold text-amber-900 transition hover:bg-amber-100 disabled:opacity-60">
                {cancelling ? <><Loader2 className="h-4 w-4 animate-spin" /> Annullamento…</> : 'Annulla abbonamento'}
              </button>
            )}
          </section>
        )}

        {analysis && (
          <div className="mt-8">
            <section className="rounded-3xl bg-slate-950 p-6 text-white sm:p-9"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-extrabold uppercase tracking-[.14em] text-emerald-300">Le tue analisi</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight">{analysis.title}</h2><p className="mt-2 text-sm text-slate-400">Creata il {new Date(analysis.createdAt).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })} · salvata nel tuo account</p></div><div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-bold"><Check className="h-4 w-4 text-emerald-400" /> {analyses.length} salvate</div></div>
            </section>

            <section className="mt-4 grid gap-4 md:grid-cols-3">
              <article className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Riconoscimento</p><p className="mt-3 text-lg font-extrabold text-slate-950">{[analysis.vehicle.make, analysis.vehicle.model].filter(Boolean).join(' ')}</p><p className="mt-1 text-sm text-slate-600">Confidenza {analysis.vehicle.confidence}</p></article>
              <article className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Stato visibile</p><p className="mt-3 text-lg font-extrabold text-slate-950">{damageLabels[analysis.photoAnalysis.damage.category] || 'Valutazione esterna'}</p><p className="mt-1 text-sm text-slate-600">{analysis.photoAnalysis.damage.description}</p></article>
              <article className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Riparazione indicativa</p><p className="mt-3 text-lg font-extrabold text-slate-950">{analysis.photoAnalysis.repairRange ? `${euro(analysis.photoAnalysis.repairRange.min)} – ${euro(analysis.photoAnalysis.repairRange.max)}` : 'Nessun costo stimato'}</p><p className="mt-1 text-sm text-slate-600">Solo elementi esterni chiaramente visibili.</p></article>
            </section>

            <div className="mt-8"><ReportView report={analysis.report} embedded showAds={false} allowPhotoTools={false} tier={userTier} /></div>
          </div>
        )}
      </main>
    </div>
  );
}
