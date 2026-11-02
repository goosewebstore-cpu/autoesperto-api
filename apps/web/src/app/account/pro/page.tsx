import type { Metadata } from 'next';
import AutoEspertoProDashboard from '@/components/AutoEspertoProDashboard';

export const metadata: Metadata = { title: 'AutoEsperto PRO | Area professionale', robots: { index: false, follow: false } };
export default function ProAccountPage() { return <AutoEspertoProDashboard />; }
