'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { type GuideComment, getPendingGuideComments, moderateGuideComment } from '@/lib/api';

export default function CommentModeration() {
  const [comments, setComments] = useState<GuideComment[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    void getPendingGuideComments()
      .then((result) => setComments(result.comments))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Impossibile caricare i commenti.'));
  }, []);

  async function moderate(id: string, status: 'APPROVED' | 'REJECTED') {
    setBusy(id);
    setError('');
    try {
      await moderateGuideComment(id, status);
      setComments((current) => current.filter((comment) => comment.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operazione non riuscita.');
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5" aria-labelledby="moderation-title">
      <h2 id="moderation-title" className="text-lg font-extrabold text-slate-950">Commenti da rivedere <span className="text-sm text-slate-500">({comments.length})</span></h2>
      <p className="mt-1 text-sm text-slate-600">Pubblica solo commenti pertinenti e senza dati personali.</p>
      {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
      <div className="mt-4 space-y-3">
        {comments.length === 0 ? <p className="text-sm text-slate-500">Nessun commento in attesa.</p> : comments.map((comment) => (
          <article key={comment.id} className="rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-slate-500"><strong>{comment.author}</strong> · <Link href={`/guide/${comment.guideSlug}`} className="text-blue-700 underline">{comment.guideSlug}</Link></p>
            <p className="mt-2 whitespace-pre-wrap break-words text-sm text-slate-800">{comment.body}</p>
            <div className="mt-3 flex gap-2">
              <button type="button" disabled={busy === comment.id} onClick={() => void moderate(comment.id, 'APPROVED')} className="min-h-10 rounded-lg bg-emerald-700 px-4 text-xs font-bold text-white disabled:opacity-50">Pubblica</button>
              <button type="button" disabled={busy === comment.id} onClick={() => void moderate(comment.id, 'REJECTED')} className="min-h-10 rounded-lg border border-slate-300 px-4 text-xs font-bold text-slate-700 disabled:opacity-50">Rifiuta</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
