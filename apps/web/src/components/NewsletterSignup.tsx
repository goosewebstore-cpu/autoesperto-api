'use client';

import { useState } from 'react';
import { Mail, CheckCircle2, Loader2 } from 'lucide-react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [privacy, setPrivacy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !privacy) return;

    setStatus('loading');
    try {
      // For now, store in localStorage as a queue. Replace with API call when backend is ready.
      const stored = JSON.parse(localStorage.getItem('ae-newsletter-queue') || '[]');
      stored.push({ email, timestamp: new Date().toISOString() });
      localStorage.setItem('ae-newsletter-queue', JSON.stringify(stored));
      setStatus('success');
      setEmail('');
      setPrivacy(false);
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex items-center gap-2.5 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700 font-medium">
        <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
        <span>Iscrizione completata! Riceverai i nostri consigli nella tua inbox.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
        <Mail className="h-4 w-4 text-blue-600" />
        Ricevi consigli e offerte sull&apos;usato ogni settimana
      </div>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="La tua email"
          required
          className="flex-1 min-w-0 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          aria-label="Indirizzo email per la newsletter"
        />
        <button
          type="submit"
          disabled={status === 'loading' || !privacy}
          className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
        >
          {status === 'loading' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Iscriviti'
          )}
        </button>
      </div>
      <label className="flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={privacy}
          onChange={(e) => setPrivacy(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-[11px] text-slate-500 leading-relaxed">
          Acconsento al trattamento dei dati per ricevere la newsletter.{' '}
          <a href="/privacy" className="underline hover:text-blue-600 transition-colors">Privacy Policy</a>
        </span>
      </label>
      {status === 'error' && (
        <p className="text-xs text-red-600 font-medium">
          Si è verificato un errore. Riprova tra qualche istante.
        </p>
      )}
    </form>
  );
}
