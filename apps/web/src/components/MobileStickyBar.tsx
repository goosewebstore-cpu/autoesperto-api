'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ScanSearch } from 'lucide-react';

export default function MobileStickyBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show when scrolling down on public pages
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Do not show on auth/account or if not scrolled enough
  if (!visible || pathname.startsWith('/accesso') || pathname.startsWith('/account')) {
    return null;
  }

  const handleAction = () => {
    if (pathname === '/') {
      const el = document.getElementById('scanner-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.location.href = '/#scanner-section';
  };

  return (
    <div className="fixed bottom-3 right-3 sm:hidden z-40 animate-slide-up">
      <button
        type="button"
        onClick={handleAction}
        className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow-xl shadow-blue-600/40 hover:bg-blue-700 active:scale-95 transition-all border border-blue-400/30"
      >
        <ScanSearch className="w-4 h-4" />
        <span>Analizza un&apos;auto</span>
      </button>
    </div>
  );
}
