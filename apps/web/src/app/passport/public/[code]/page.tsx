import type { Metadata } from 'next';
import PassportPublicClient from './PassportPublicClient';

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

