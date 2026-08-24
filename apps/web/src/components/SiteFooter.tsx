import Link from 'next/link';
import { Car, ShieldCheck, ArrowRight } from 'lucide-react';
import NewsletterSignup from '@/components/NewsletterSignup';

const TOOL_LINKS = [
  { label: 'Profilo Digitale Auto', href: '/passport' },
  { label: 'Mi conviene comprarla?', href: '/compra' },
  { label: 'Quanto vale la mia auto?', href: '/vendi' },
  { label: 'Migliori auto usate', href: '/migliori-auto-usate' },
  { label: 'Incentivi ed Ecobonus 2026', href: '/incentivi-auto' },
  { label: 'Blocchi del traffico Euro', href: '/blocchi-traffico' },
  { label: 'Valutazione per modello', href: '/valutazione' },
  { label: 'Auto per neopatentati', href: '/neopatentati' },
  { label: 'Passaggio di proprietà', href: '/passaggio-proprieta' },
  { label: 'Guida problemi motori', href: '/motori-problemi' },
  { label: 'Confronta modelli', href: '/confronta' },
  { label: 'Affidabilità e guasti', href: '/affidabilita' },
  { label: 'Calcolo bollo auto', href: '/calcolo-bollo' },
  { label: 'Verifica targa', href: '/verifica-targa' },
];

const INFO_LINKS = [
  { label: 'Guide per l\'usato', href: '/guide' },
  { label: 'Chi siamo', href: '/chi-siamo' },
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

const POPULAR_MODELS = [
  { label: 'Fiat Panda', href: '/valutazione/fiat/panda' },
  { label: 'Volkswagen Golf', href: '/valutazione/volkswagen/golf' },
  { label: 'Toyota Yaris', href: '/valutazione/toyota/yaris' },
  { label: 'Fiat 500', href: '/valutazione/fiat/500' },
  { label: 'Jeep Renegade', href: '/valutazione/jeep/renegade' },
  { label: 'Volkswagen T-Roc', href: '/valutazione/volkswagen/t-roc' },
  { label: 'Renault Clio', href: '/valutazione/renault/clio' },
  { label: 'Peugeot 208', href: '/valutazione/peugeot/208' },
  { label: 'Ford Puma', href: '/valutazione/ford/puma' },
  { label: 'Dacia Duster', href: '/valutazione/dacia/duster' },
  { label: 'Citroën C3', href: '/valutazione/citroen/c3' },
  { label: 'Audi A3', href: '/valutazione/audi/a3' },
  { label: 'BMW Serie 1', href: '/valutazione/bmw/serie-1' },
  { label: 'Mercedes Classe A', href: '/valutazione/mercedes-benz/classe-a' },
  { label: 'Volkswagen Polo', href: '/valutazione/volkswagen/polo' },
  { label: 'Nissan Qashqai', href: '/valutazione/nissan/qashqai' },
  { label: 'Toyota C-HR', href: '/valutazione/toyota/c-hr' },
  { label: 'Hyundai Tucson', href: '/valutazione/hyundai/tucson' },
  { label: 'Kia Sportage', href: '/valutazione/kia/sportage' },
  { label: 'Alfa Romeo Stelvio', href: '/valutazione/alfa-romeo/stelvio' },
];

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white text-slate-600">
      <div className="mx-auto max-w-6xl px-5 pt-14 pb-8">
        {/* Newsletter */}
        <div className="pb-10 border-b border-slate-200 mb-10">
          <div className="max-w-md">
            <NewsletterSignup />
          </div>
        </div>

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

        {/* Modelli più cercati SEO Hub Links */}
        <div className="py-8 border-b border-slate-200">
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-3.5">
            Valutazioni auto più cercate in Italia
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
            {POPULAR_MODELS.map((model) => (
              <Link
                key={model.href}
                href={model.href}
                className="hover:text-blue-600 transition-colors"
              >
                {model.label}
              </Link>
            ))}
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
