'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import { ArrowLeft, Car, Check, Loader2, LockKeyhole, MailCheck, AlertTriangle } from 'lucide-react';
import { loginAccount, registerAccount, verifyEmail, API_URL } from '@/lib/api';
import { setAuthToken } from '@/lib/auth';

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.7l6.2 5.2C36.9 40.2 44 34.5 44 24c0-1.3-.1-2.6-.4-3.9z"/>
    </svg>
  );
}

export default function AccessForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/account';
  const verifyToken = searchParams.get('verify') || undefined;
  const googleToken = searchParams.get('token') || undefined;
  const googleErr = searchParams.get('err') || undefined;
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');

  const destination = nextPath.startsWith('/') && !nextPath.startsWith('//') ? nextPath : '/account';

  useEffect(() => {
    if (googleToken) {
      setAuthToken(googleToken);
      router.replace('/account');
      return;
    }
    if (googleErr) {
      setError('Accesso con Google non riuscito. Riprova oppure usa email e password.');
      return;
    }
  }, [googleToken, googleErr, router]);

  useEffect(() => {
    if (!verifyToken) return;
    let active = true;
    setVerifying('loading');
    verifyEmail(verifyToken)
      .then((result) => {
        if (!active) return;
        setAuthToken(result.token);
        setVerifying('ok');
        setTimeout(() => router.replace('/account'), 1200);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setVerifying('error');
        setError(err instanceof Error ? err.message : 'Verifica non riuscita.');
      });
    return () => { active = false; };
  }, [verifyToken, router]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = mode === 'register'
        ? await registerAccount({ name, identifier, password, termsAccepted: termsAccepted as true })
        : await loginAccount({ identifier, password });
      setAuthToken(result.token);
      router.replace(destination);
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      setError(message || 'Non riesco a completare l’accesso. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  if (verifying === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50">
        <SiteHeader />
        <main className="grid place-items-center px-5 py-14">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
            <h1 className="mt-6 text-2xl font-extrabold text-slate-950">Verifica la tua email…</h1>
            <p className="mt-2 text-sm text-slate-600">Stiamo confermando il tuo indirizzo.</p>
          </div>
        </main>
      </div>
    );
  }

  if (verifying === 'ok') {
    return (
      <div className="min-h-screen bg-slate-50">
        <SiteHeader />
        <main className="grid place-items-center px-5 py-14">
          <div className="text-center">
            <MailCheck className="mx-auto h-12 w-12 text-emerald-600" />
            <h1 className="mt-4 text-2xl font-extrabold text-slate-950">Email verificata!</h1>
            <p className="mt-2 text-sm text-slate-600">Ti stiamo portando alla tua area personale…</p>
          </div>
        </main>
      </div>
    );
  }

  if (verifying === 'error') {
    return (
      <div className="min-h-screen bg-slate-50">
        <SiteHeader />
        <main className="grid place-items-center px-5 py-14">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-amber-500" />
            <h1 className="mt-4 text-2xl font-extrabold text-slate-950">Verifica non riuscita</h1>
            {error && <p className="mt-2 text-sm text-slate-600">{error}</p>}
            <Link href="/accesso" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">Tenta di nuovo l'accesso</Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="px-5 py-8 sm:py-14">
      <div className="mx-auto max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950">
          <ArrowLeft className="h-4 w-4" /> Torna ad AutoEsperto
        </Link>

        <section className="mt-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,.08)] sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white"><Car className="h-5 w-5" /></span>
            <div><p className="text-sm font-extrabold text-slate-950">AutoEsperto</p><p className="text-xs text-slate-500">La tua analisi resta nel tuo account</p></div>
          </div>

          <div className="mt-7 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
            <button type="button" onClick={() => { setMode('register'); setError(''); }} className={`rounded-lg px-3 py-2.5 text-sm font-bold transition ${mode === 'register' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'}`}>Crea account</button>
            <button type="button" onClick={() => { setMode('login'); setError(''); }} className={`rounded-lg px-3 py-2.5 text-sm font-bold transition ${mode === 'login' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'}`}>Accedi</button>
          </div>

          <div className="mt-6">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">{mode === 'register' ? 'Crea la tua area personale' : 'Bentornato'}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">Usa un’email oppure un numero di telefono. Gratis: salva le tue analisi complete e ritrovale quando vuoi.</p>
          </div>

          <a
            href={`${API_URL}/auth/google`}
            className="mt-6 flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white text-sm font-extrabold text-slate-800 transition hover:bg-slate-50"
          >
            <GoogleIcon />
            Continua con Google
          </a>

          <div className="mt-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            oppure
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === 'register' && <label className="block text-sm font-semibold text-slate-700">Nome
              <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required minLength={2} className="mt-1.5 h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-950 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100" placeholder="Come ti chiami" />
            </label>}
            <label className="block text-sm font-semibold text-slate-700">Email o telefono
              <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} autoComplete="username" required className="mt-1.5 h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-950 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100" placeholder="nome@email.it oppure +39…" />
            </label>
            <label className="block text-sm font-semibold text-slate-700">Password
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} required minLength={8} className="mt-1.5 h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-950 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100" placeholder="Almeno 8 caratteri" />
            </label>

            {mode === 'register' && <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3 text-xs leading-5 text-slate-600">
              <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} required className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600" />
              <span>Accetto i <Link href="/terms" className="font-semibold text-blue-700 hover:underline">Termini di servizio</Link> e ho letto la <Link href="/privacy" className="font-semibold text-blue-700 hover:underline">Privacy Policy</Link>.</span>
            </label>}

            {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}

            <button disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 text-sm font-extrabold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Attendi…</> : <>{mode === 'register' ? 'Crea account' : 'Accedi'} <Check className="h-4 w-4" /></>}
            </button>
          </form>

          <p className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500"><LockKeyhole className="h-3.5 w-3.5" /> Password protetta con crittografia; non salviamo la foto.</p>
        </section>
      </div>
    </main>
    </div>
  );
}
