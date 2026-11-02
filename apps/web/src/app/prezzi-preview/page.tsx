import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Clock3, FileText, ShieldCheck, Sparkles } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import PlanCheckoutButton from '@/components/PlanCheckoutButton';

export const metadata: Metadata = {
  title: 'Anteprima locale dei nuovi piani | AutoEsperto',
  robots: { index: false, follow: false },
};

const privatePlans = [
  {
    name: 'Anteprima gratuita',
    price: '0 €',
    detail: 'Senza account',
    description: 'Per capire subito l’auto, senza account.',
    features: ['Marca, modello e dati disponibili', 'Prezzo e primo giudizio, se attendibili', 'Un controllo utile prima dell’acquisto'],
    notIncluded: 'È un primo orientamento: non include lo storico dettagliato, i costi e i consigli di trattativa.',
    action: 'Inizia l’analisi gratis',
    style: 'border-slate-200 border-t-slate-400 bg-white',
    priceStyle: 'text-slate-950',
    label: 'INIZIA GRATIS',
  },
  {
    name: 'Report singolo',
    price: '1,99 €',
    detail: 'Pagamento una tantum',
    description: 'Il report completo per una sola auto.',
    features: ['Valutazione e confronto del prezzo', 'Fascia di mercato e metodo usato', 'Difetti comuni, costi e punti di forza', 'Controlli, trattativa e verdetto motivato', 'Salvato nel tuo account · nessun rinnovo'],
    action: 'Analizza gratis, poi sblocca',
    style: 'border-blue-200 border-t-blue-600 bg-blue-50',
    priceStyle: 'text-blue-900',
    label: '1 REPORT',
  },
  {
    name: 'Pacchetto 3 + 1 omaggio',
    price: '4,99 €',
    detail: '4 crediti · 3 pagati + 1 omaggio',
    description: 'Quattro report completi per quattro auto diverse.',
    features: ['Tutto quello incluso nel report singolo', '3 report acquistati + 1 report in omaggio', 'Circa 1,25 € per report', 'Crediti visibili nell’account · nessun rinnovo'],
    action: 'Acquista 4 report · 4,99 €',
    style: 'border-emerald-200 border-t-emerald-600 bg-emerald-50',
    priceStyle: 'text-emerald-950',
    label: '3 + 1 OMAGGIO',
  },
] as const;

const proFeatures = [
  '33 report completi per ciclo · 30 inclusi + 3 omaggio',
  'Dashboard, storico e ricerca',
  'PDF e link sicuro per condividere',
];

function PlanCheck() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0">
    <circle cx="12" cy="12" r="12" fill="#43a047" />
    <path d="m6.8 12.4 3.3 3.2 7.2-7.4" fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" />
  </svg>;
}

export default function PricingPreviewPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold text-blue-800">
          <span className="h-2 w-2 rounded-full bg-blue-600" /> Anteprima locale · checkout solo test
        </div>

        <div className="max-w-3xl">
          <p className="text-xs font-extrabold uppercase tracking-[.16em] text-blue-700">Prezzi AutoEsperto</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">Prova gratis.<br className="sm:hidden" /> Approfondisci se ti serve.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">Un primo orientamento gratuito. Poi scegli un report, il pacchetto da 4 report (3 + 1 omaggio) o il piano per professionisti.</p>
        </div>

        <section className="mt-9" aria-labelledby="private-title">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div><p className="text-xs font-bold uppercase tracking-widest text-slate-500">Privati</p><h2 id="private-title" className="mt-1 text-xl font-extrabold">Anteprima e report completi</h2></div>
            <p className="text-sm font-semibold text-slate-600">Report singoli: nessun rinnovo.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {privatePlans.map((plan) => (
              <article key={plan.name} className={`flex flex-col rounded-2xl border border-t-4 p-5 shadow-sm sm:p-6 ${plan.style}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5"><span className="grid h-9 w-9 place-items-center rounded-lg bg-white/80 text-slate-700"><FileText className="h-4 w-4" /></span><h3 className="text-base font-extrabold">{plan.name}</h3></div>
                  <span className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-extrabold tracking-wide text-slate-600">{plan.label}</span>
                </div>
                <p className={`mt-6 text-3xl font-black tracking-tight ${plan.priceStyle}`}>{plan.price}</p>
                <p className="mt-1 text-sm font-semibold text-slate-600">{plan.detail}</p>
              <p className="mt-3 min-h-10 text-sm font-medium leading-5 text-slate-800">{plan.description}</p>
                <ul className="mt-4 space-y-2.5 border-t border-slate-900/10 pt-4">
                  {plan.features.map((feature) => <li key={feature} className="flex gap-2.5 text-sm leading-5 text-slate-800"><PlanCheck />{feature}</li>)}
                </ul>
                {'notIncluded' in plan && <p className="mt-3 rounded-lg bg-white/70 px-3 py-2 text-xs leading-5 text-slate-600">{plan.notIncluded}</p>}
                {plan.name === 'Pacchetto 3 + 1 omaggio' ? <PlanCheckoutButton product="report_pack_3" label={plan.action} /> : <Link href="/#scanner-section" className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white/80 px-4 text-sm font-bold text-slate-800 transition hover:bg-white">{plan.action}<ArrowRight className="h-4 w-4" /></Link>}
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl bg-[#132238] text-white" aria-labelledby="pro-title">
          <div className="grid lg:grid-cols-[1.2fr_.8fr]">
            <div className="p-5 sm:p-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-blue-100"><Sparkles className="h-3.5 w-3.5" /> PER CONCESSIONARIE E COMMERCIANTI</div>
              <h2 id="pro-title" className="mt-4 text-2xl font-black tracking-tight sm:text-3xl">AutoEsperto PRO</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">Include 30 report completi + 3 in omaggio per ogni ciclo di abbonamento. In totale 33 report al mese.</p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-3">
                {proFeatures.map((feature) => <li key={feature} className="flex gap-2 rounded-xl border border-white/10 bg-white/[.05] p-3 text-sm leading-5 text-slate-100"><PlanCheck />{feature}</li>)}
              </ul>
            </div>
            <div className="flex flex-col justify-center border-t border-white/10 bg-white/[.04] p-5 sm:p-8 lg:border-l lg:border-t-0">
              <p className="text-xs font-extrabold uppercase tracking-widest text-blue-200">Abbonamento mensile</p>
              <p className="mt-2 text-4xl font-black tracking-tight">29,99 €<span className="ml-2 text-base font-semibold text-slate-300">/ mese</span></p>
              <p className="mt-1 text-sm text-slate-300">33 report per ciclo: 30 inclusi + 3 omaggio.</p>
              <div className="mt-4 space-y-2 rounded-xl bg-slate-950/40 p-3 text-sm text-slate-200">
                <p className="flex gap-2"><Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" />I report non utilizzati non si cumulano.</p>
                <p className="flex gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" />Rinnovo automatico, disdetta dall’account.</p>
              </div>
              <Link href="/account/pro" className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-500">Dashboard PRO<ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </section>

        <div className="mt-6 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p><strong className="text-slate-900">Nota:</strong> una foto non verifica chilometri, incidenti o stato meccanico.</p>
          <Link href="/" className="shrink-0 font-bold text-blue-700 hover:text-blue-900">Torna alla home <span aria-hidden="true">→</span></Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
