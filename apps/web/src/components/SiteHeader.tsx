'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Car, ChevronDown, LogOut, Menu, ScanSearch, UserRound, X } from 'lucide-react';
import { clearAuthToken, getAuthToken } from '@/lib/auth';

const NAV_LINKS = [
  { label: 'Analizza auto', href: '/#scanner-section' },
  { label: 'Valuta auto', href: '/valutazione' },
  { label: 'Confronta', href: '/confronta' },
  { label: 'Guide', href: '/guide' },
  { label: 'Premium', href: '/account?upgrade=true' },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [signedIn, setSignedIn] = useState(() => typeof window !== 'undefined' && Boolean(getAuthToken()));
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setSignedIn(Boolean(getAuthToken()));
  }, [pathname]);

  useEffect(() => {
    setMenuOpen(false);
    setUserMenu(false);
  }, [pathname]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setUserMenu(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  const handleLogout = () => {
    clearAuthToken();
    setSignedIn(false);
    setUserMenu(false);
    setMenuOpen(false);
    router.push('/');
  };

  const isActive = (href: string) =>
    href.startsWith('/#') ? false : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="site-header" ref={headerRef}>
      <div className="site-header-inner">
        <Link href="/" className="site-logo" aria-label="AutoEsperto — torna alla home">
          <span className="site-logo-icon"><Car className="h-4 w-4 text-white" /></span>
          <span className="site-logo-text">Auto<span>Esperto</span></span>
        </Link>

        <nav className="site-nav" aria-label="Navigazione principale">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`site-nav-link${isActive(item.href) ? ' active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="site-actions">
          <div className={`site-user${userMenu ? ' open' : ''}`}>
            <button
              type="button"
              className="site-account-btn"
              aria-haspopup={signedIn ? 'menu' : undefined}
              aria-expanded={signedIn ? userMenu : undefined}
              onClick={() => (signedIn ? setUserMenu((value) => !value) : router.push('/accesso'))}
            >
              <UserRound className="h-4 w-4" />
              <span className="site-account-label">{signedIn ? 'Area personale' : 'Accedi'}</span>
              {signedIn && <ChevronDown className="site-nav-chev" />}
            </button>
            {signedIn && userMenu && (
              <div className="site-user-menu" role="menu">
                <Link href="/account" className="site-user-menu-link" role="menuitem">
                  <UserRound className="h-4 w-4" />
                  <span>Area personale</span>
                </Link>
                <button type="button" onClick={handleLogout} className="site-user-menu-link site-user-menu-logout" role="menuitem">
                  <LogOut className="h-4 w-4" />
                  <span>Esci</span>
                </button>
              </div>
            )}
          </div>
          <Link href="/#scanner-section" className="site-cta">
            <ScanSearch className="h-4 w-4" />
            <span className="site-cta-label">Analizza</span>
          </Link>
          <button
            type="button"
            className="site-burger"
            aria-label={menuOpen ? 'Chiudi il menu' : 'Apri il menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="site-mobile">
          {NAV_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className="site-mobile-link" onClick={() => setMenuOpen(false)}>
              <span className="site-mobile-label">{item.label}</span>
            </Link>
          ))}
          <div className="site-mobile-actions">
            {signedIn ? (
              <>
                <Link href="/account" className="home-hero-cta-secondary" onClick={() => setMenuOpen(false)}>Area personale</Link>
                <button onClick={handleLogout} className="site-mobile-logout"><LogOut className="h-4 w-4" /> Esci dall'account</button>
              </>
            ) : (
              <Link href="/accesso" className="home-hero-cta-secondary" onClick={() => setMenuOpen(false)}>Accedi</Link>
            )}
            <Link href="/#scanner-section" className="home-hero-cta" onClick={() => setMenuOpen(false)}>Analizza</Link>
          </div>
        </div>
      )}
    </header>
  );
}
