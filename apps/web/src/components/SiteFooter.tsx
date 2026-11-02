import CookiePreferencesButton from './CookiePreferencesButton';
import Link from 'next/link';
export default function SiteFooter() {
  return <footer className="mt-12 border-t border-slate-200 bg-white text-slate-600">
    <div className="mx-auto max-w-[1440px] px-5 py-8">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3"><img src="/logo.png" alt="" width={36} height={36} className="h-9 w-9 shrink-0 rounded-full object-contain" /><div><p className="font-extrabold text-slate-950">Auto<span className="text-blue-600">Esperto</span></p><p className="mt-1 text-xs">Un secondo parere, prima di scegliere.</p></div></div>
        <nav aria-label="Link utili" className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold"><Link href="/guide" className="hover:text-blue-700">Guide</Link><Link href="/chi-siamo" className="hover:text-blue-700">Chi siamo</Link><Link href="/contatti" className="hover:text-blue-700">Assistenza</Link><Link href="/account" className="hover:text-blue-700">Il tuo account</Link></nav>
      </div>
      <div className="mt-6 flex flex-col gap-5 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs"><p>© {new Date().getFullYear()} AutoEsperto</p><div className="mt-2 flex flex-wrap items-center gap-4"><Link href="/privacy" className="hover:underline">Privacy</Link><Link href="/cookie-policy" className="hover:underline">Cookie</Link><CookiePreferencesButton /><Link href="/terms" className="hover:underline">Termini e abbonamento</Link></div><p className="mt-3 max-w-lg text-[11px] leading-relaxed text-slate-400">Stime indicative. Per le condizioni reali dell’auto serve un controllo professionale.</p></div>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2"><img src="/images/brand/siracusa-web-design.webp" alt="Logo Siracusa Web Design" width={64} height={64} loading="lazy" className="h-16 w-16 rounded-xl object-contain" /><div><p className="text-[10px] uppercase tracking-wider text-slate-400">Ideazione e sviluppo</p><p className="mt-1 text-sm font-bold text-slate-800">Siracusa Web Design</p></div></div>
      </div>
    </div>
  </footer>;
}
