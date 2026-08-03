'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Car, Check, Loader2, LockKeyhole } from 'lucide-react';
import { loginAccount, registerAccount } from '@/lib/api';
import { setAuthToken } from '@/lib/auth';

export default function AccessForm({ nextPath = '/account' }: { nextPath?: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const destination = nextPath.startsWith('/') && !nextPath.startsWith('//') ? nextPath : '/account';

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
    } catch (err: any) {
      setError(err.message || 'Non riesco a completare l’accesso. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 sm:py-14">
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
            <p className="mt-2 text-sm leading-6 text-slate-600">Usa un’email oppure un numero di telefono. Ogni account può acquistare e conservare una sola analisi completa.</p>
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
  );
}
