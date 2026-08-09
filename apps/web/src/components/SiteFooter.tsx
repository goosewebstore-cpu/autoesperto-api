import Link from 'next/link';
import { Car } from 'lucide-react';

interface SiteFooterProps {
  variant?: 'full' | 'compact';
}

export default function SiteFooter({ variant = 'compact' }: SiteFooterProps) {
  if (variant === 'full') {
    return (
      <footer className="mt-16 border-t border-slate-200/80 bg-slate-900 text-slate-300">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 pb-10 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white shadow-md">
                  <Car className="h-4 w-4" />
                </span>
                <span className="text-lg font-bold tracking-tight text-white">
                  Auto<span className="text-blue-500">Esperto</span>
                </span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-400">
                Il tuo secondo parere prima di comprare o vendere un'auto usata. Dati reali, stime trasparenti.
              </p>
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Strumenti</p>
              <ul className="mt-3 space-y-2 text-xs">
                <li><Link href="/compra" className="hover:text-white transition-colors">Mi conviene comprarla?</Link></li>
                <li><Link href="/vendi" className="hover:text-white transition-colors">Quanto vale la mia auto?</Link></li>
                <li><Link href="/valutazione" className="hover:text-white transition-colors">Valutazione auto usata</Link></li>
                <li><Link href="/affidabilita" className="hover:text-white transition-colors">Affidabilità e guasti</Link></li>
                <li><Link href="/riparazione" className="hover:text-white transition-colors">Costi riparazione</Link></li>
                <li><Link href="/consumi" className="hover:text-white transition-colors">Consumi reali</Link></li>
                <li><Link href="/confronta" className="hover:text-white transition-colors">Confronta modelli</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Risorse & Info</p>
              <ul className="mt-3 space-y-2 text-xs">
                <li><Link href="/guide" className="hover:text-white transition-colors">Guide per l'usato</Link></li>
                <li><Link href="/contatti" className="hover:text-white transition-colors">Contatti e assistenza</Link></li>
                <li><Link href="/lavora-con-noi" className="hover:text-white transition-colors">Lavora con noi</Link></li>
                <li><Link href="/account" className="hover:text-white transition-colors">Area personale</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Note Legali</p>
              <ul className="mt-3 space-y-2 text-xs">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Termini di Servizio</Link></li>
                <li><Link href="/eula" className="hover:text-white transition-colors">Licenza (EULA)</Link></li>
                <li><Link href="/dmca" className="hover:text-white transition-colors">Copyright (DMCA)</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 text-center text-xs text-slate-400 sm:flex-row sm:text-left">
            <p>
              Le stime di AutoEsperto sono indicative. Danni nascosti o meccanici richiedono sempre un controllo professionale.
            </p>
            <div className="shrink-0">
              <a
                href="https://www.directorysiti.it"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sito web segnalato da directorysiti.it"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://www.directorysiti.it/wp-content/uploads/2019/01/logoDirectorySitoSegnalato.png"
                  alt="sito web segnalato da directorysiti.it"
                  width={160}
                  height={120}
                  className="opacity-70 transition hover:opacity-100"
                />
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="mt-12 border-t border-slate-200/70 bg-slate-50/50">
      <div className="mx-auto max-w-4xl px-5 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="grid h-6 w-6 place-items-center rounded-md bg-blue-600 text-white">
              <Car className="h-3.5 w-3.5" />
            </div>
            <span className="text-sm font-bold tracking-tight text-slate-900">
              Auto<span className="text-blue-600">Esperto</span>
            </span>
          </div>

          <nav aria-label="Link legali e utili" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-slate-600">
            <Link href="/valutazione" className="hover:text-blue-600 transition-colors">Valutazione</Link>
            <Link href="/riparazione" className="hover:text-blue-600 transition-colors">Riparazioni</Link>
            <Link href="/guide" className="hover:text-blue-600 transition-colors">Guide</Link>
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-blue-600 transition-colors">Termini</Link>
            <Link href="/eula" className="hover:text-blue-600 transition-colors">EULA</Link>
            <Link href="/dmca" className="hover:text-blue-600 transition-colors">DMCA</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
