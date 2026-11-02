'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, MessageCircle } from 'lucide-react';
import { type GuideComment, getGuideComments, getMyAccount, postGuideComment } from '@/lib/api';

export default function GuideComments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<GuideComment[]>([]);
  const [signedIn, setSignedIn] = useState(false);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let active = true;
    void Promise.allSettled([getGuideComments(slug), getMyAccount()]).then(([list, account]) => {
      if (!active) return;
      if (list.status === 'fulfilled') setComments(list.value.comments);
      else setError('Non riesco a caricare i commenti. Riprova più tardi.');
      setSignedIn(account.status === 'fulfilled');
      setLoading(false);
    });
    return () => { active = false; };
  }, [slug]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    setNotice('');
    setSending(true);
    try {
      const result = await postGuideComment(slug, body);
      setBody('');
      setNotice(result.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Non riesco a inviare il commento.');
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="commenti" className="mt-12 border-t border-slate-200 pt-9" aria-labelledby="comments-title">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-blue-700" />
        <h2 id="comments-title" className="text-xl font-black text-slate-950">Commenti e domande</h2>
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-600">Condividi un dubbio o un&apos;esperienza utile su questa guida. I commenti sono controllati prima della pubblicazione.</p>

      {loading ? <p className="mt-6 flex items-center gap-2 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Carico i commenti…</p> : (
        <div className="mt-6 space-y-3">
          {comments.length === 0 ? <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">Ancora nessun commento. Puoi essere il primo.</p> : comments.map((comment) => (
            <article key={comment.id} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-center gap-x-2 text-xs text-slate-500"><strong className="text-slate-900">{comment.author}</strong><span>·</span><time dateTime={comment.createdAt}>{new Date(comment.createdAt).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</time></div>
              <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">{comment.body}</p>
            </article>
          ))}
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/50 p-4 sm:p-5">
        {signedIn ? (
          <form onSubmit={(event) => void submit(event)}>
            <label htmlFor="guide-comment" className="block text-sm font-bold text-slate-900">Scrivi un commento</label>
            <textarea id="guide-comment" value={body} onChange={(event) => setBody(event.target.value)} minLength={10} maxLength={1500} required rows={4} className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100" placeholder="Scrivi qui la tua domanda o esperienza…" />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-slate-500">Verrà mostrato il tuo nome di battesimo. Non inserire dati personali o link.</p><button type="submit" disabled={sending || body.trim().length < 10} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-50">{sending && <Loader2 className="h-4 w-4 animate-spin" />} Invia commento</button></div>
          </form>
        ) : <p className="text-sm text-slate-700"><Link href={`/accesso?next=${encodeURIComponent(`/guide/${slug}#commenti`)}`} className="font-bold text-blue-700 underline underline-offset-2">Accedi o crea un account</Link> per commentare.</p>}
        {notice && <p className="mt-3 text-sm font-semibold text-emerald-700" role="status">{notice}</p>}
        {error && <p className="mt-3 text-sm font-semibold text-red-700" role="alert">{error}</p>}
      </div>
    </section>
  );
}
