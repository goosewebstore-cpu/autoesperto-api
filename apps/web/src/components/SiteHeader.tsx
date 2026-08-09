'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Car, ChevronDown, Menu, ScanSearch, UserRound, X } from 'lucide-react';
import { getAuthToken } from '@/lib/auth';

interface MenuItem {
  label: string;
  href: string;
  desc: string;
}

const TOOL_GROUPS: { title: string; items: MenuItem[] }[] = [
  {
    title: 'Valutazione',
    items: [
      { label: 'Valutazione auto usata', href: '/valutazione', desc: 'Stima il valore con i prezzi reali di mercato' },
      { label: 'Mi conviene comprarla?', href: '/compra', desc: 'Confronta il prezzo richiesto con la fascia giusta' },
      { label: 'Quanto vale la mia auto?', href: '/vendi', desc: 'Scopri a quanto puoi venderla oggi' },
    ],
  },
  {
    title: 'Affidabilità e costi',
    items: [
      { label: 'Affidabilità e guasti', href: '/affidabilita', desc: 'Punti deboli e problemi noti del modello' },
      { label: 'Costi di riparazione', href: '/riparazione', desc: 'Spese medie di manutenzione' },
      { label: 'Consumi reali', href: '/consumi', desc: 'Consumi dichiarati vs reali' },
    ],
  },
];

const DIRECT_LINKS = [
  { label: 'Confronta', href: '/confronta' },
  { label: 'Guide', href: '/guide' },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setSignedIn(Boolean(getAuthToken()));
  }, [pathname]);

  useEffect(() => {
    setMenuOpen(false);
    setDropdown(false);
  }, [pathname]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setDropdown(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  const isActive = (href: string) =>
    href !== '/#' && (pathname === href || pathname.startsWith(`${href}/`));

  return (
    <header className="site-header" ref={headerRef}>
      <div className="site-header-inner">
        <Link href="/" className="site-logo" aria-label="AutoEsperto — torna alla home">
          <span className="site-logo-icon"><Car className="h-4 w-4 text-white" /></span>
          <span className="site-logo-text">Auto<span>Esperto</span></span>
        </Link>

        <nav className="site-nav" aria-label="Navigazione principale">
          <div className={`site-nav-item${dropdown ? ' open' : ''}`}>
            <button
              type="button"
              className="site-nav-trigger"
              aria-haspopup="menu"
              aria-expanded={dropdown}
              onClick={() => setDropdown((value) => !value)}
            >
              Strumenti <ChevronDown className="site-nav-chev" />
            </button>
            <div className="site-drop" role="menu">
              {TOOL_GROUPS.map((group) => (
                <div key={group.title} className="site-drop-group">
                  <span className="site-drop-title">{group.title}</span>
                  {group.items.map((item) => (
                    <Link key={item.href} href={item.href} className="site-drop-link">
                      <span className="site-drop-label">{item.label}</span>
                      <span className="site-drop-desc">{item.desc}</span>
                    </Link>
                  ))}
                </div>
              ))}
              <div className="site-drop-cta">
                <Link href="/confronta">Confronta modelli</Link>
                <Link href="/guide">Guide sull'usato</Link>
              </div>
            </div>
          </div>

          {DIRECT_LINKS.map((item) => (
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
          <Link href={signedIn ? '/account' : '/accesso'} className="site-account-btn">
            <UserRound className="h-4 w-4" />
            <span className="site-account-label">{signedIn ? 'Area personale' : 'Accedi'}</span>
          </Link>
          <Link href="/#scanner-section" className="site-cta">
            <ScanSearch className="h-4 w-4" />
            <span className="site-cta-label">Analizza ora</span>
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
          {TOOL_GROUPS.map((group) => (
            <div key={group.title}>
              <span className="site-mobile-title">{group.title}</span>
              {group.items.map((item) => (
                <Link key={item.href} href={item.href} className="site-mobile-link">
                  <span className="site-mobile-label">{item.label}</span>
                  <span className="site-mobile-desc">{item.desc}</span>
                </Link>
              ))}
            </div>
          ))}
          <div className="site-mobile-ctas">
            <Link href="/confronta" className="site-mobile-chip">Confronta modelli</Link>
            <Link href="/guide" className="site-mobile-chip">Guide</Link>
          </div>
          <div className="site-mobile-actions">
            <Link href={signedIn ? '/account' : '/accesso'} className="home-hero-cta-secondary" onClick={() => setMenuOpen(false)}>{signedIn ? 'Area personale' : 'Accedi'}</Link>
            <Link href="/#scanner-section" className="home-hero-cta" onClick={() => setMenuOpen(false)}>Analizza ora</Link>
          </div>
        </div>
      )}
    </header>
  );
}
