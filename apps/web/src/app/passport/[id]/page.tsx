import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const PassportDetailClient = dynamic(() => import('./PassportDetailClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-3 p-6 text-center">
        <div className="w-9 h-9 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Caricamento Profilo Digitale...</p>
      </div>
    </div>
  ),
});

export const metadata: Metadata = {
  title: 'Profilo Digitale Auto | AutoEsperto — Profilo Permanente & AI',
  description:
    'Gestisci foto, documenti, scadenze, cronologia manutenzione e chiedi all\'AI informazioni sulla tua auto.',
  robots: { index: false, follow: false },
};

export default async function PassportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PassportDetailClient id={id} />;
}

