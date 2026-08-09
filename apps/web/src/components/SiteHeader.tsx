'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Car, UserRound } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/#scanner-section', label: 'Analizza' },
  { href: '/valutazione', label: 'Valuta' },
  { href: '/confronta', label: 'Confronta' },
  { href: '/guide', label: 'Guide' },
];

export default function SiteHeader() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href.startsWith('/#')) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-logo" aria-label="AutoEsperto — torna alla home">
          <span className="site-logo-icon"><Car className="h-4 w-4 text-white" /></span>
          <span className="site-logo-text">Auto<span>Esperto</span></span>
        </Link>

        <nav className="site-nav" aria-label="Navigazione principale">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`site-nav-link${isActive(item.href) ? ' active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/account" className="site-account-btn">
          <UserRound className="h-4 w-4" />
          <span className="site-account-label">Account</span>
        </Link>
      </div>
    </header>
  );
}