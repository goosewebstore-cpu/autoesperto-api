'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { House, Calculator, ScanLine, CarFront, BookOpen } from 'lucide-react';
import { triggerHaptic } from '@/lib/nativeBridge';
const items = [
  { label: 'Home', href: '/', icon: House },
  { label: 'Valuta', href: '/valutazione', icon: Calculator },
  { label: 'Analizza', href: '/analizza-annuncio', icon: ScanLine },
  { label: 'Garage', href: '/passport', icon: CarFront },
  { label: 'Guide', href: '/guide', icon: BookOpen },
];
export default function MobileBottomNav() {
  const pathname = usePathname();
  if (pathname.includes('/pdf') || pathname.startsWith('/embed')) return null;
  return <nav aria-label="Navigazione principale" className="ae-mobile-nav fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white md:hidden">
    <div className="mx-auto grid max-w-lg grid-cols-5 gap-1 px-2 pt-1.5" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 8px)' }}>
      {items.map(({ label, href, icon: Icon }) => {
        const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
        return <Link key={href} href={href} aria-current={active ? 'page' : undefined} onClick={() => triggerHaptic('light')}
          className={`flex min-h-12 min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 text-[11px] leading-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${active ? 'bg-blue-50 font-bold text-blue-700' : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-950'}`}>
          <Icon aria-hidden="true" className="h-[21px] w-[21px]" strokeWidth={active ? 2.2 : 1.8} />
          <span>{label}</span>
        </Link>;
      })}
    </div>
  </nav>;
}
