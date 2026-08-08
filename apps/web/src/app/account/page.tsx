import type { Metadata } from 'next';
import AccountDashboard from '@/components/AccountDashboard';

export const metadata: Metadata = {
  title: 'La tua area personale',
  description: 'Accedi alla tua analisi AutoEsperto acquistata e salvata.',
  robots: { index: false, follow: false },
};

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ checkout?: string; subscription?: string; upgrade?: string; session_id?: string }> }) {
  const query = await searchParams;
  return <AccountDashboard checkout={query.checkout} subscription={query.subscription} upgrade={query.upgrade} sessionId={query.session_id} />;
}
