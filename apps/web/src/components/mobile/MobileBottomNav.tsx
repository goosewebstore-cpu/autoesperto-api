'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Home, Calculator, Camera, ShieldCheck, User, Sparkles } from 'lucide-react';
import { triggerHaptic } from '@/lib/nativeBridge';

interface NavItem {
  label: string;
  href: string;
  icon: typeof Home;
  isCenter?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Valuta', href: '/valutazione', icon: Calculator },
  { label: 'Scansiona', href: '/analizza-annuncio', icon: Camera, isCenter: true },
  { label: 'Passaporto', href: '/passport', icon: ShieldCheck },
  { label: 'Account', href: '/account', icon: User },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  // Hide on certain full-screen workflows if needed (e.g. standalone print view)
  if (pathname.includes('/pdf') || pathname.startsWith('/embed')) {
    return null;
  }

  const isCurrentActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav
      aria-label="Navigazione Mobile"
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-surface/90 backdrop-blur-xl border-t border-border/80 pb-[max(env(safe-area-inset-bottom),8px)] pt-1 px-2 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = isCurrentActive(item.href);
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => triggerHaptic('medium')}
                className="relative -top-3.5 flex flex-col items-center group focus:outline-none"
              >
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-brand-dark via-brand to-blue-500 text-white flex items-center justify-center shadow-lg shadow-brand/35 border-2 border-surface active:scale-95 transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-extrabold text-brand mt-0.5 tracking-tight">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => triggerHaptic('light')}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all active:scale-95 ${
                isActive
                  ? 'text-brand font-bold'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand" />
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight ${isActive ? 'font-extrabold' : 'font-medium'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
