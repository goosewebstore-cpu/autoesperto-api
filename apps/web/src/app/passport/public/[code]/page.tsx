import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const PassportPublicClient = dynamic(() => import('./PassportPublicClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-3 p-6 text-center">
        <div className="w-9 h-9 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Caricamento Scheda Veicolo...</p>
      </div>
    </div>
  ),
});

export const metadata: Metadata = {
  title: 'Profilo Digitale Auto Certificato | AutoEsperto',
  description:
    'Visualizza lo storico manutenzione, l\'Health Score, le foto e i dati verificati di questo veicolo su AutoEsperto.',
};

export default async function PassportPublicPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  return <PassportPublicClient code={code} />;
}

