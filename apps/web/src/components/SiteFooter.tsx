import Link from 'next/link';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import NewsletterSignup from '@/components/NewsletterSignup';

const VALUTAZIONI_LINKS = [
  { label: 'Valutazione per modello', href: '/valutazione' },
  { label: 'Controlla annuncio & Trust Score', href: '/analizza-annuncio' },
  { label: 'Profilo Digitale Auto', href: '/passport' },
  { label: 'AI Car Advisor', href: '/ai-car-advisor' },
  { label: 'Auto Finder (Trova Auto)', href: '/auto-finder' },
];

const COMPRAVENDITA_LINKS = [
  { label: 'Quanto vale la mia auto?', href: '/vendi' },
  { label: 'Mi conviene comprarla?', href: '/compra' },
  { label: 'Migliori auto usate', href: '/migliori-auto-usate' },
  { label: 'Auto per neopatentati', href: '/neopatentati' },
  { label: 'Confronta modelli', href: '/confronta' },
];

const COSTI_GUASTI_LINKS = [
  { label: 'Calcolo bollo auto', href: '/calcolo-bollo' },
  { label: 'Incentivi ed Ecobonus 2026', href: '/incentivi-auto' },
  { label: 'Blocchi del traffico Euro', href: '/blocchi-traffico' },
  { label: 'Passaggio di proprietà', href: '/passaggio-proprieta' },
  { label: 'Affidabilità e guasti', href: '/affidabilita' },
  { label: 'Guida problemi motori', href: '/motori-problemi' },
];

const INFO_LEGAL_LINKS = [
  { label: 'Guide per l\'usato', href: '/guide' },
  { label: 'Chi siamo', href: '/chi-siamo' },
  { label: 'Contatti e assistenza', href: '/contatti' },
  { label: 'Area personale', href: '/account' },
  { label: 'Privacy & Cookie Policy', href: '/privacy' },
  { label: 'Termini di Servizio & EULA', href: '/terms' },
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

        {/* Main Footer Columns */}
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 pb-10 border-b border-slate-200">
          {/* Col 1: Brand & CTA */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-1 pr-2">
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="AutoEsperto Logo" className="h-9 w-9 rounded-full shadow-xs shrink-0 object-contain" width={36} height={36} />
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Auto<span className="text-blue-600">Esperto</span>
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-600">
              Il tuo secondo parere prima di comprare o vendere un&apos;auto usata. Dati reali e stime trasparenti.
            </p>
            <Link
              href="/#scanner-section"
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition"
            >
              Analizza auto gratis <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-700">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              100% gratuito
            </div>
          </div>

          {/* Col 2: Valutazioni & AI */}
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Valutazioni &amp; AI</p>
            <ul className="mt-3.5 space-y-2 text-xs">
              {VALUTAZIONI_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-600 transition-colors hover:text-blue-600">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Compravendita */}
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Compravendita</p>
            <ul className="mt-3.5 space-y-2 text-xs">
              {COMPRAVENDITA_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-600 transition-colors hover:text-blue-600">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Costi & Guasti */}
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Costi &amp; Guasti</p>
            <ul className="mt-3.5 space-y-2 text-xs">
              {COSTI_GUASTI_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-600 transition-colors hover:text-blue-600">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Info & Note Legali */}
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Info &amp; Note Legali</p>
            <ul className="mt-3.5 space-y-2 text-xs">
              {INFO_LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-600 transition-colors hover:text-blue-600">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modelli più cercati SEO Hub Links */}
        <div className="py-7 border-b border-slate-200">
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-3">
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

        <div className="mt-7 flex flex-col items-center justify-between gap-4 text-center text-xs text-slate-500 sm:flex-row sm:text-left">
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
