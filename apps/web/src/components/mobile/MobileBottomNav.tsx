'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { triggerHaptic } from '@/lib/nativeBridge';

/* ────────────────────────────────────────────
   Google Material You / Apple-level Bottom Bar
   ──────────────────────────────────────────── */

interface NavItem {
  label: string;
  href: string;
  isCenter?: boolean;
  /** Outlined SVG path (inactive) */
  iconOutline: string;
  /** Filled SVG path (active) */
  iconFilled: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Home',
    href: '/',
    // Lucide Home outline
    iconOutline:
      'M3 9.5L12 3l9 6.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.5z M9 22V12h6v10',
    // Filled home
    iconFilled:
      'M3 9.5L12 3l9 6.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.5z M9 22V12h6v10',
  },
  {
    label: 'Valuta',
    href: '/valutazione',
    // Calculator outline
    iconOutline:
      'M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z M7 8h2 M15 8h2 M7 12h2 M15 12h2 M7 16h2 M15 16h2 M11 8h2',
    iconFilled:
      'M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z M7 8h2 M15 8h2 M7 12h2 M15 12h2 M7 16h2 M15 16h2 M11 8h2',
  },
  {
    label: 'Scansiona',
    href: '/analizza-annuncio',
    isCenter: true,
    // Search/scan icon
    iconOutline: 'M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16z M21 21l-4.35-4.35',
    iconFilled: 'M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16z M21 21l-4.35-4.35',
  },
  {
    label: 'Garage',
    href: '/passport',
    // Shield outline
    iconOutline:
      'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    iconFilled:
      'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  },
  {
    label: 'Guide',
    href: '/guide',
    // Book outline
    iconOutline:
      'M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z',
    iconFilled:
      'M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z',
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Hide on full-screen workflows
  if (pathname.includes('/pdf') || pathname.startsWith('/embed')) {
    return null;
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* CSS for the bottom bar — scoped animations */}
      <style jsx global>{`
        @keyframes ae-pill-in {
          0% { transform: scaleX(0); opacity: 0; }
          100% { transform: scaleX(1); opacity: 1; }
        }
        @keyframes ae-fab-pulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(37, 99, 235, 0.35); }
          50% { box-shadow: 0 6px 28px rgba(37, 99, 235, 0.55); }
        }
        @keyframes ae-icon-pop {
          0% { transform: scale(0.85); }
          50% { transform: scale(1.12); }
          100% { transform: scale(1); }
        }
        .ae-bottom-nav-pill {
          animation: ae-pill-in 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .ae-fab-glow {
          animation: ae-fab-pulse 2.5s ease-in-out infinite;
        }
        .ae-icon-active {
          animation: ae-icon-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>

      <nav
        aria-label="Navigazione Mobile"
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 6px)' }}
      >
        {/* Main bar container */}
        <div className="mx-2 mb-1 rounded-[22px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/70 dark:border-slate-700/60 shadow-[0_-2px_24px_rgba(0,0,0,0.08),0_-1px_6px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-around px-1 py-1.5">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);

              /* ── Center FAB Button ── */
              if (item.isCenter) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => triggerHaptic('medium')}
                    className="relative -top-4 flex flex-col items-center focus:outline-none group"
                  >
                    {/* Glow ring behind */}
                    <div className="absolute inset-0 -top-1 w-[60px] h-[60px] mx-auto rounded-[20px] bg-blue-500/10 blur-md group-active:bg-blue-500/20 transition-all" />

                    {/* FAB button */}
                    <div
                      className={`
                        relative w-[56px] h-[56px] rounded-[18px]
                        bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600
                        text-white flex items-center justify-center
                        shadow-lg border-[3px] border-white dark:border-slate-900
                        group-active:scale-90 transition-transform duration-200 ease-out
                        ae-fab-glow
                      `}
                    >
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d={item.iconOutline} />
                      </svg>
                    </div>

                    {/* Label */}
                    <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 mt-1 tracking-tight">
                      {item.label}
                    </span>
                  </Link>
                );
              }

              /* ── Regular Nav Item ── */
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => triggerHaptic('light')}
                  className="flex flex-col items-center justify-center py-1 px-2 min-w-[52px] rounded-2xl transition-all active:scale-90 focus:outline-none group"
                >
                  {/* Icon container with optional pill */}
                  <div className="relative flex items-center justify-center w-14 h-8">
                    {/* Active pill background — Google Material You style */}
                    {active && (
                      <div className="absolute inset-0 mx-auto w-14 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 ae-bottom-nav-pill" />
                    )}

                    {/* Icon */}
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill={active ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      strokeWidth={active ? '2.2' : '1.8'}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`
                        relative z-10 transition-all duration-200
                        ${active
                          ? 'text-blue-600 dark:text-blue-400 ae-icon-active'
                          : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                        }
                      `}
                    >
                      <path d={active ? item.iconFilled : item.iconOutline} />
                    </svg>
                  </div>

                  {/* Label — always visible, bold when active */}
                  <span
                    className={`
                      text-[10px] mt-0.5 tracking-tight transition-all duration-200
                      ${active
                        ? 'font-extrabold text-blue-600 dark:text-blue-400'
                        : 'font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-700'
                      }
                    `}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
