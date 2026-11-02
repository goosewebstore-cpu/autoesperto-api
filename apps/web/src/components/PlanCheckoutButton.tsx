'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';
import { createReportCheckout, getMyAccount } from '@/lib/api';

export default function PlanCheckoutButton({ product, label }: { product: 'report_pack_3'; label: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function startCheckout() {
    setLoading(true); setError('');
    try {
      await getMyAccount(true);
      const checkout = await createReportCheckout({ product, returnTo: '/account?credits=success' });
      window.location.assign(checkout.url);
    } catch (reason) {
      const status = (reason as { status?: number }).status;
      if (status === 401) { router.push('/accesso?next=/prezzi-preview'); return; }
      setError(reason instanceof Error ? reason.message : 'Checkout di prova non disponibile.');
    } finally { setLoading(false); }
  }

  return <div className="mt-5">
    <button type="button" onClick={() => void startCheckout()} disabled={loading} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-emerald-300 bg-white px-4 text-sm font-bold text-emerald-950 transition hover:bg-emerald-50 disabled:opacity-60">
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}{label}{!loading && <ArrowRight className="h-4 w-4" />}
    </button>
    {error && <p className="mt-2 text-xs leading-relaxed text-rose-700" role="alert">{error}</p>}
  </div>;
}
