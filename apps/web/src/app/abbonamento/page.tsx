import { Suspense } from 'react';
import type { Metadata } from 'next';
import SubscriptionCheckout from '@/components/SubscriptionCheckout';
export const metadata: Metadata = { title:'Gestione piano AutoEsperto AI', robots:{index:false,follow:false} };
export default function SubscriptionPage() { return <Suspense fallback={<p className="p-8 text-center">Carico l’abbonamento…</p>}><SubscriptionCheckout /></Suspense>; }
