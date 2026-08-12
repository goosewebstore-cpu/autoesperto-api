import type { Metadata } from 'next';
import { Suspense } from 'react';
import AccessForm from '@/components/AccessForm';

export const metadata: Metadata = {
  title: 'Accedi o crea il tuo account',
  description: 'Crea l’area personale AutoEsperto per acquistare e conservare la tua analisi auto.',
  robots: { index: false, follow: false },
};

export default function AccessPage() {
  return (
    <Suspense fallback={null}>
      <AccessForm />
    </Suspense>
  );
}