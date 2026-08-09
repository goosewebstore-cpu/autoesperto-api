import { Crown, Lock } from 'lucide-react';
import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';

interface PremiumBadgeProps {
  feature?: string;
  compact?: boolean;
}

export function PremiumBadge({ feature, compact = false }: PremiumBadgeProps) {
  const handleClick = () => {
    trackEvent('premium_cta_clicked', { feature: feature || 'generic' });
  };

  if (compact) {
    return (
      <Link href="/account?upgrade=true" onClick={handleClick} className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent hover:bg-accent/20 transition-colors">
        <Lock className="h-2.5 w-2.5" /> Premium
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3">
      <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent/10">
        <Crown className="h-4 w-4 text-accent" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-bold text-accent">{feature || 'Funzione Premium'}</p>
        <p className="text-[10px] text-text-secondary">Disponibile con l’abbonamento Premium</p>
      </div>
      <Link href="/account?upgrade=true" onClick={handleClick} className="rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-white hover:bg-accent-hover transition-colors">
        Sblocca
      </Link>
    </div>
  );
}
