import type { Metadata } from 'next';
import PassportPublicClient from './PassportPublicClient';

export const metadata: Metadata = {
  title: 'Profilo Digitale Auto Condiviso | AutoEsperto',
  description:
    'Visualizza i dati del veicolo, le foto e lo storico che il proprietario ha scelto di condividere su AutoEsperto.',
};

export default async function PassportPublicPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  return <PassportPublicClient code={code} />;
}

