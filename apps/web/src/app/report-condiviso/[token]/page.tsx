'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, Loader2 } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import ReportView from '@/components/ReportView';
import ReportErrorBoundary from '@/components/ReportErrorBoundary';
import { getSharedReport } from '@/lib/api';
import type { AutoReport } from '@autoesperto/types';

export default function SharedReportPage({ params }: { params: Promise<{ token: string }> }) {
  const [report, setReport] = useState<AutoReport | null>(null);
  const [error, setError] = useState('');
  useEffect(() => { let active = true; void params.then(({ token }) => getSharedReport(token)).then((result) => { if (active) setReport(result.report); }).catch((e: unknown) => { if (active) setError(e instanceof Error ? e.message : 'Link non valido o scaduto.'); }); return () => { active = false; }; }, [params]);
  return <div className="min-h-screen bg-slate-50"><SiteHeader /><main className="mx-auto max-w-5xl px-4 py-8 sm:px-6"><div className="mb-5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950"><strong>Report condiviso in sola lettura.</strong> Il link è temporaneo. Le informazioni sono indicative e non verificano lo stato meccanico del veicolo.</div>{report ? <ReportErrorBoundary onRetry={() => setReport(null)}><ReportView report={report} embedded showAds={false} allowPhotoTools={false} /></ReportErrorBoundary> : error ? <div className="rounded-2xl border border-amber-200 bg-white p-6"><AlertTriangle className="h-6 w-6 text-amber-600" /><p className="mt-3 font-bold text-slate-900">{error}</p><Link href="/" className="mt-4 inline-block font-bold text-blue-700">Vai ad AutoEsperto</Link></div> : <div className="flex items-center gap-3 rounded-2xl bg-white p-6 text-sm text-slate-600"><Loader2 className="h-5 w-5 animate-spin text-blue-600" />Carico il report…</div>}</main></div>;
}
