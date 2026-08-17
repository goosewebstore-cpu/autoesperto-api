import Link from 'next/link';
import { Car, ShieldCheck, ArrowRight } from 'lucide-react';

interface SiteFooterProps {
  variant?: 'full' | 'compact';
}

const TOOL_LINKS = [
  { label: 'Mi conviene comprarla?', href: '/compra' },
  { label: 'Quanto vale la mia auto?', href: '/vendi' },
  { label: 'Valutazione auto usata', href: '/valutazione' },
  { label: 'Confronta modelli', href: '/confronta' },
  { label: 'Affidabilità e guasti', href: '/affidabilita' },
];

const INFO_LINKS = [
  { label: 'Guide per l\'usato', href: '/guide' },
  { label: 'Contatti e assistenza', href: '/contatti' },
  { label: 'Lavora con noi', href: '/lavora-con-noi' },
  { label: 'Area personale', href: '/account' },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Cookie Policy', href: '/cookie-policy' },
  { label: 'Termini di Servizio', href: '/terms' },
  { label: 'Licenza (EULA)', href: '/eula' },
  { label: 'Copyright (DMCA)', href: '/dmca' },
];

export default function SiteFooter({ variant = 'compact' }: SiteFooterProps) {
  if (variant === 'full') {
    return (
      <footer className="mt-16 border-t border-slate-200 bg-white text-slate-600">
        <div className="mx-auto max-w-6xl px-5 pt-14 pb-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr] pb-10 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
                  <Car className="h-4.5 w-4.5" />
                </span>
                <span className="text-lg font-bold tracking-tight text-slate-900">
                  Auto<span className="text-blue-600">Esperto</span>
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                Il tuo secondo parere prima di comprare o vendere un&apos;auto usata.
                Dati reali dagli annunci in vendita, stime trasparenti e sempre gratis.
              </p>
              <Link
                href="/#scanner-section"
                className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700"
              >
                Analizza un&apos;auto gratis <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                100% gratuito · senza registrazione
              </div>
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Strumenti</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {TOOL_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-slate-600 transition-colors hover:text-blue-600">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Risorse &amp; Info</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {INFO_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-slate-600 transition-colors hover:text-blue-600">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Note Legali</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {LEGAL_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-slate-600 transition-colors hover:text-blue-600">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 text-center text-xs text-slate-500 sm:flex-row sm:text-left">
            <p>
              Le stime di AutoEsperto sono indicative e basate sui dati di mercato disponibili.
              Danni nascosti o meccanici richiedono sempre un controllo professionale.
            </p>
            <p className="shrink-0">© {new Date().getFullYear()} AutoEsperto · autoesperto.it</p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="mt-12 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-4xl px-5 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-blue-600 text-white">
              <Car className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold tracking-tight text-slate-900">
              Auto<span className="text-blue-600">Esperto</span>
            </span>
          </div>

          <nav aria-label="Link legali e utili" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-slate-600">
            <Link href="/valutazione" className="transition-colors hover:text-blue-600">Valutazione</Link>
            <Link href="/riparazione" className="transition-colors hover:text-blue-600">Riparazioni</Link>
            <Link href="/guide" className="transition-colors hover:text-blue-600">Guide</Link>
            <Link href="/privacy" className="transition-colors hover:text-blue-600">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-blue-600">Termini</Link>
            <Link href="/eula" className="transition-colors hover:text-blue-600">EULA</Link>
            <Link href="/dmca" className="transition-colors hover:text-blue-600">DMCA</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
