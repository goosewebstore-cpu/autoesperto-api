import type { Metadata } from 'next';
import { Suspense } from 'react';
import AccountDashboard from '@/components/AccountDashboard';

export const metadata: Metadata = {
  title: 'La tua area personale',
  description: 'Accedi alla tua analisi AutoEsperto acquistata e salvata.',
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (
    <Suspense fallback={null}>
      <AccountDashboard />
    </Suspense>
  );
}
