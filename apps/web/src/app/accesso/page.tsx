import type { Metadata } from 'next';
import { Suspense } from 'react';
import AccessForm from '@/components/AccessForm';

export const metadata: Metadata = {
  title: 'Accedi o crea il tuo account',
  description: 'Crea l’area personale AutoEsperto per salvare e conservare le tue analisi auto, gratis.',
  robots: { index: false, follow: false },
};

export default function AccessPage() {
  return (
    <Suspense fallback={null}>
      <AccessForm />
    </Suspense>
  );
}