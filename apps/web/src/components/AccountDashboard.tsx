'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Camera,
  Car,
  Check,
  CheckCircle2,
  CreditCard,
  Crown,
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
import { getPremiumPricing, getReportPricing } from '@/lib/pricing';
import { trackEvent } from '@/lib/analytics';
import {
  type AccountUser,
  type LastAttempt,
  type StoredAnalysis,
  confirmCheckout,
  createCheckout,
  createSubscription,
  cancelSubscription,
  getMyAccount,
  getMyAnalysis,
  getLastAttempt,
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

export default function AccountDashboard() {
  const [isAnnual, setIsAnnual] = useState(true);
  const premium = getPremiumPricing(isAnnual ? 'year' : 'month');
  const reportPricing = getReportPricing();
  const router = useRouter();
  const searchParams = useSearchParams();
  const subscription = searchParams.get('subscription') || undefined;
  const upgrade = searchParams.get('upgrade') || undefined;
  const checkout = searchParams.get('checkout') || undefined;
  const reportCheckout = searchParams.get('report') || undefined;
  const sessionId = searchParams.get('session_id') || undefined;
  const reportCheckoutRan = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<AccountUser | null>(null);
  const [analysis, setAnalysis] = useState<StoredAnalysis | null>(null);
  const [analyses, setAnalyses] = useState<StoredAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [reportPaying, setReportPaying] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [immediateExecutionAccepted, setImmediateExecutionAccepted] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [resend, setResend] = useState(false);
  const [resumeAttempt, setResumeAttempt] = useState<LastAttempt | null>(null);

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
        router.replace(`/accesso?next=${encodeURIComponent('/account?upgrade=true')}`);
        return;
      }
      try {
        if (subscription === 'success' && sessionId) {
          setMessage('Abbonamento Premium attivato con successo! Ora hai accesso illimitato alle analisi complete.');
          fireAdsPurchase(premium.amountCents / 100, premium.currency.toUpperCase(), sessionId);
          window.history.replaceState(null, '', '/account');
        } else if (subscription === 'cancelled') {
          setMessage('Attivazione abbonamento annullata.');
          window.history.replaceState(null, '', '/account');
        } else if (checkout === 'success' && sessionId) {
          try {
            const res = await confirmCheckout(sessionId);
            trackEvent('purchase_completed', { product: 'single_report', amountCents: res.amountCents });
            setMessage(res.paid
              ? 'Report acquistato con successo! La tua prossima analisi sarà completa e salvata nel tuo account.'
              : 'Pagamento non completato: il report non è stato attivato.');
            fireAdsPurchase(res.amountCents / 100, res.currency.toUpperCase(), sessionId);
            if (res.paid) {
              const attempt = getLastAttempt();
              if (attempt) setResumeAttempt(attempt);
            }
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Non riesco a confermare il pagamento.');
          }
          window.history.replaceState(null, '', '/account');
        } else if (checkout === 'cancelled') {
          setMessage('Acquisto del report annullato. Puoi riprovare quando vuoi.');
          window.history.replaceState(null, '', '/account');
        } else if (upgrade === 'true') {
          window.history.replaceState(null, '', '/account');
        } else if (reportCheckout === 'checkout' && !reportCheckoutRan.current) {
          reportCheckoutRan.current = true;
          window.history.replaceState(null, '', '/account');
          try {
            const res = await createCheckout();
            trackEvent('report_purchase_started', { source: 'account_autocheckout' });
            window.location.assign(res.url);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Non riesco ad avviare il pagamento del report.');
          }
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
    trackEvent('premium_checkout_started', { source: 'account_pricing' });
    try {
      const result = await createSubscription(isAnnual ? 'year' : 'month');
      window.location.assign(result.url);
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      setError(message || 'Non riesco ad aprire il pagamento sicuro.');
      setPaying(false);
    }
  };

  const handleBuyReport = async () => {
    setError('');
    setReportPaying(true);
    trackEvent('report_purchase_started', { source: 'account_pricing' });
    try {
      const result = await createCheckout();
      window.location.assign(result.url);
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      setError(message || 'Non riesco ad avviare il pagamento del report.');
      setReportPaying(false);
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
      // Analisi a pagamento singolo disponibile da /account?report=checkout
      void imageData;
      router.push('/#scanner-section');
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
            <div className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-extrabold ${userTier === 'premium' ? 'bg-amber-100 text-amber-700' : user.entitlement?.paid ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-700'}`}>
              <span className="h-2 w-2 rounded-full bg-current" />
              {userTier === 'premium'
                ? 'Premium Attivo'
                : user.entitlement?.paid
                  ? 'Report singolo attivo'
                  : user.entitlement.emailVerified === false && user.email
                    ? 'Email da verificare'
                    : 'Piano Gratuito'}
            </div>
          </div>
        </div>

        {message && <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-800">{message}</div>}
        {error && <div role="alert" className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}

        {resumeAttempt && (
          <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
              <div>
                <p className="text-sm font-extrabold text-emerald-900">Report attivato: completa la tua analisi</p>
                <p className="mt-0.5 text-xs text-emerald-800">
                  Riprendi l&apos;analisi di <strong>{resumeAttempt.make} {resumeAttempt.model}</strong> per vedere il verdetto completo, ora sbloccato.
                </p>
              </div>
            </div>
            <Link
              href={`/?make=${encodeURIComponent(resumeAttempt.make)}&model=${encodeURIComponent(resumeAttempt.model)}${resumeAttempt.year ? `&year=${resumeAttempt.year}` : ''}${resumeAttempt.km ? `&km=${resumeAttempt.km}` : ''}${resumeAttempt.requestedPrice ? `&price=${resumeAttempt.requestedPrice}` : ''}#scanner-section`}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-extrabold text-white transition hover:bg-emerald-700"
            >
              Riprendi l&apos;analisi <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {user.entitlement && !user.entitlement.emailVerified && user.email && (
          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <MailCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <p className="text-sm font-extrabold text-amber-900">Verifica la tua email</p>
                <p className="mt-0.5 text-xs text-amber-800">La verifica serve per salvare le analisi e gestire l'abbonamento: la tua prima analisi completa è comunque già gratuita. Controlla la posta di <strong>{user.email}</strong> (anche spam).</p>
              </div>
            </div>
            <button onClick={() => { setError(''); setResend(true); resendVerification().then(() => setMessage('Email di verifica reinviata. Controlla la posta.')).catch((e: unknown) => setError(e instanceof Error ? e.message : 'Reinvio fallito.')).finally(() => setResend(false)); }} disabled={resend} className="inline-flex items-center gap-2 rounded-lg border border-amber-500 bg-white px-3 py-2 text-xs font-bold text-amber-700 hover:bg-amber-100 disabled:opacity-60">
              {resend ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MailCheck className="h-3.5 w-3.5" />} Reinvia email
            </button>
          </div>
        )}

        {isOwner && showAnalytics && <AnalyticsDashboard />}

        {userTier !== 'premium' && (
          <section className="mt-8" aria-label="Piani e prezzi">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">Compra meglio. Evita brutte sorprese.</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">La prima analisi completa è gratis. Dopo scegli tu come continuare: un solo report o Premium illimitato.</p>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {/* GRATIS */}
              <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700">Gratis</span>
                <div className="mt-4">
                  <div className="text-3xl font-extrabold tracking-tight text-slate-950">0&euro;</div>
                  <p className="mt-1 text-xs font-semibold text-slate-500">sempre</p>
                </div>
                <ul className="mt-5 flex flex-1 flex-col gap-2.5 text-sm font-semibold text-slate-700">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Riconoscimento da foto</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Analisi base (marca, anno, valore)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Prima analisi completa gratuita</li>
                </ul>
                <Link href="/#scanner-section" className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white text-sm font-extrabold text-slate-800 transition hover:border-blue-300 hover:text-blue-700">
                  Analizza un&apos;auto
                </Link>
              </div>

              {/* REPORT SINGOLO */}
              <div className="flex flex-col rounded-3xl border-2 border-blue-600 bg-white p-6 shadow-[0_16px_50px_rgba(37,99,235,0.14)]">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1 text-xs font-extrabold text-white">Report singolo</span>
                <div className="mt-4">
                  <div className="text-3xl font-extrabold tracking-tight text-slate-950">{reportPricing.displayPrice}</div>
                  <p className="mt-1 text-xs font-semibold text-slate-500">un&apos;analisi completa</p>
                </div>
                <ul className="mt-5 flex flex-1 flex-col gap-2.5 text-sm font-semibold text-slate-700">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Verdetto completo su un&apos;auto</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Prezzo, valore, controlli e costi</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Salvata nel tuo account, senza scadenza</li>
                </ul>
                <button onClick={handleBuyReport} disabled={reportPaying} className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-extrabold text-white transition hover:bg-blue-500 disabled:opacity-60">
                  {reportPaying ? <><Loader2 className="h-4 w-4 animate-spin" /> Apro Stripe&hellip;</> : <><FileText className="h-4 w-4" /> Compra il report</>}
                </button>
              </div>

              {/* PREMIUM */}
              <div className="flex flex-col rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-400/15 px-3 py-1 text-xs font-extrabold text-amber-300"><Crown className="h-3.5 w-3.5" /> Premium</span>
                  <div className="flex rounded-lg bg-slate-800 p-0.5">
                    <button onClick={() => setIsAnnual(false)} className={`rounded-md px-2.5 py-1 text-[10px] font-bold transition ${!isAnnual ? 'bg-white text-slate-900' : 'text-slate-400'}`}>Mensile</button>
                    <button onClick={() => setIsAnnual(true)} className={`rounded-md px-2.5 py-1 text-[10px] font-bold transition ${isAnnual ? 'bg-white text-slate-900' : 'text-slate-400'}`}>Annuale</button>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-extrabold tracking-tight">
                    {isAnnual ? premium.monthlyEquivalent : premium.displayPrice}
                  </div>
                  <p className="mt-1 text-xs font-semibold text-slate-400">
                    {isAnnual ? `fatturato annualmente (${premium.displayPrice})` : 'al mese, rinnovo automatico'}
                  </p>
                </div>
                <ul className="mt-5 flex flex-1 flex-col gap-2.5 text-sm font-semibold text-slate-200">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Analisi complete illimitate</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Generatore annunci di vendita</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Zero pubblicità</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Annulli quando vuoi</li>
                </ul>
                <button onClick={handleUpgrade} disabled={paying} className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-extrabold text-white transition hover:bg-blue-500 disabled:opacity-60">
                  {paying ? <><Loader2 className="h-4 w-4 animate-spin" /> Apro Stripe&hellip;</> : <><CreditCard className="h-4 w-4" /> Passa a Premium</>}
                </button>
              </div>
            </div>

            <p className="mt-4 flex items-center gap-2 text-xs text-slate-400"><LockKeyhole className="h-3.5 w-3.5 shrink-0" /> Pagamenti gestiti da Stripe. AutoEsperto non vede i dati della carta.</p>
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

            <div className="mt-8"><ReportView report={analysis.report} embedded showAds={false} allowPhotoTools={false} tier="premium" /></div>
          </div>
        )}
      </main>
    </div>
  );
}
