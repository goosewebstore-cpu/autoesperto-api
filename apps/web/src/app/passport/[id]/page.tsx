import type { Metadata } from 'next';
import PassportDetailClient from './PassportDetailClient';

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

