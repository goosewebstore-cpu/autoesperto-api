'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Car, ChevronDown, LogOut, Menu, ScanSearch, UserRound, X, Gauge, Scale, Wrench, Fuel, SearchCheck, ArrowLeftRight, Hammer, Banknote, CreditCard, Search, Trophy, Zap, ShieldAlert, ShieldCheck, Compass, Bot } from 'lucide-react';
import { clearAuthToken, getAuthToken } from '@/lib/auth';

const TOOLS = [
  { group: 'Acquisto & Finder Intelligente', items: [
    { label: 'Auto Finder (Trova Auto)', desc: 'Matching Engine su budget ed esigenze', href: '/auto-finder', icon: Compass },
    { label: 'AI Car Advisor', desc: 'Consulente digitale: la compreresti?', href: '/ai-car-advisor', icon: Bot },
    { label: 'Controlla un Annuncio', desc: 'Trust Score 0-100 e quanto offrire', href: '/analizza-annuncio', icon: ShieldCheck },
    { label: 'Mi conviene comprarla?', desc: 'Prezzo e verdetto prima di firmare', href: '/compra', icon: SearchCheck },
    { label: 'Migliori auto usate', desc: 'Classifica per budget e categoria', href: '/migliori-auto-usate', icon: Trophy },
  ]},
  { group: 'Profilo Digitale & Valutazione', items: [
    { label: 'Profilo Digitale Auto', desc: 'Profilo della tua macchina, foto, tagliandi e scadenze', href: '/passport', icon: ShieldCheck },
    { label: 'Quanto vale la mia auto?', desc: 'Stima di mercato e annuncio pronto', href: '/vendi', icon: Banknote },
    { label: 'Valutazione per modello', desc: 'Prezzi reali per marca e modello', href: '/valutazione', icon: Gauge },
    { label: 'Auto per neopatentati', desc: 'Limiti kW e migliori usate 2026', href: '/neopatentati', icon: Car },
  ]},
  { group: 'Manutenzione & Normative 2026', items: [
    { label: 'Affidabilità e guasti', desc: 'Problemi noti modello per modello', href: '/affidabilita', icon: Hammer },
    { label: 'Guida problemi motori', desc: 'Difetti noti e costi di ripristino', href: '/motori-problemi', icon: Wrench },
    { label: 'Incentivi & Ecobonus', desc: 'Calcolo bonus rottamazione 2026', href: '/incentivi-auto', icon: Zap },
    { label: 'Blocchi del traffico', desc: 'Verifica classi Euro e Area B/Roma', href: '/blocchi-traffico', icon: ShieldAlert },
    { label: 'Calcolo bollo auto', desc: 'Quanto paghi di bollo nel 2026', href: '/calcolo-bollo', icon: CreditCard },
  ]},
];

const NAV_LINKS = [
  { label: 'Auto Finder', href: '/auto-finder' },
  { label: 'AI Advisor', href: '/ai-car-advisor' },
  { label: 'Controlla annuncio', href: '/analizza-annuncio' },
  { label: 'Profilo Digitale', href: '/passport' },
  { label: 'Guide', href: '/guide' },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [signedIn, setSignedIn] = useState(() => typeof window !== 'undefined' && Boolean(getAuthToken()));
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setSignedIn(Boolean(getAuthToken()));
  }, [pathname]);

  useEffect(() => {
    setMenuOpen(false);
    setUserMenu(false);
    setToolsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setUserMenu(false);
        setToolsOpen(false);
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
          <div className={`site-nav-item${toolsOpen ? ' open' : ''}`}>
            <button
              type="button"
              className="site-nav-trigger"
              aria-expanded={toolsOpen}
              onClick={() => setToolsOpen((value) => !value)}
            >
              Strumenti
              <ChevronDown className="site-nav-chev" />
            </button>
            <div className="site-drop" role="menu" aria-label="Strumenti AutoEsperto">
              {TOOLS.map((toolGroup) => (
                <div key={toolGroup.group} className="site-drop-group">
                  <span className="site-drop-title">{toolGroup.group}</span>
                  {toolGroup.items.map((tool) => (
                    <Link key={tool.href} href={tool.href} className="site-drop-link flex items-center gap-3" onClick={() => setToolsOpen(false)}>
                      <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 grid place-items-center shrink-0">
                        <tool.icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="site-drop-label">{tool.label}</span>
                        <span className="site-drop-desc">{tool.desc}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
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
            <span className="site-cta-label">Analizza gratis</span>
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
          {TOOLS.map((toolGroup) => (
            <div key={toolGroup.group} className="pt-2">
              <span className="site-mobile-title">{toolGroup.group}</span>
              {toolGroup.items.map((tool) => (
                <Link key={tool.href} href={tool.href} className="site-mobile-link flex items-center gap-3" onClick={() => setMenuOpen(false)}>
                  <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 grid place-items-center shrink-0">
                    <tool.icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="site-mobile-label">{tool.label}</span>
                    <span className="site-mobile-desc">{tool.desc}</span>
                  </div>
                </Link>
              ))}
            </div>
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
            <Link href="/#scanner-section" className="home-hero-cta" onClick={() => setMenuOpen(false)}>Analizza gratis</Link>
          </div>
        </div>
      )}
    </header>
  );
}
