import type { Metadata } from 'next';
import AccessForm from '@/components/AccessForm';

export const metadata: Metadata = {
  title: 'Accedi o crea il tuo account',
  description: 'Crea l’area personale AutoEsperto per acquistare e conservare la tua analisi auto.',
  robots: { index: false, follow: false },
};

export default async function AccessPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const query = await searchParams;
  return <AccessForm nextPath={query.next || '/account'} />;
}
