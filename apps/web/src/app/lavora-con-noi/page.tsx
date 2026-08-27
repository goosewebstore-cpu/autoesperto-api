import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, Building2, Megaphone, ShieldCheck, Wrench } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Lavora con noi',
  description: 'Pubblicità, sponsorizzazioni e partnership professionali con AutoEsperto.',
  alternates: { canonical: '/lavora-con-noi' },
};

const offers = [
  { icon: Megaphone, title: 'Visibilità sponsorizzata', text: 'Spazi sulle pagine pubbliche e nelle guide, sempre separati dal report e indicati come pubblicità o contenuto sponsorizzato.' },
  { icon: Wrench, title: 'Professionisti verificati', text: 'Presenza territoriale per officine, carrozzerie, periti e centri di controllo con una scheda chiara dei servizi offerti.' },
  { icon: Building2, title: 'Soluzioni per concessionari', text: 'Report pre-vendita, strumenti per lead qualificati e pacchetti dedicati agli operatori, senza accesso ai dati privati degli utenti.' },
];

export default function WorkWithUsPage() {
  const subject = encodeURIComponent('Proposta di collaborazione con AutoEsperto');
  const body = encodeURIComponent('Ciao AutoEsperto,\n\nAzienda/attività:\nSito web:\nTipo di collaborazione:\nObiettivo:\nBudget indicativo:\n\nGrazie.');

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-12">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-sm font-bold text-slate-600 hover:text-blue-700">← Torna alla home</Link>
        <section className="mt-8 overflow-hidden rounded-3xl bg-slate-950 px-6 py-12 text-white sm:px-12 sm:py-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-extrabold text-blue-200"><BadgeCheck className="h-4 w-4" /> Partnership AutoEsperto</span>
          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">Raggiungi chi sta davvero valutando un’auto.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">Collaboriamo con aziende e professionisti automotive utili nel momento della decisione: prima dell’acquisto, della vendita o della riparazione.</p>
          <a href={`mailto:partner@autoesperto.it?subject=${subject}&body=${body}`} className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-extrabold text-white hover:bg-blue-500">Richiedi una proposta <ArrowRight className="h-4 w-4" /></a>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">{offers.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6"><Icon className="h-5 w-5 text-blue-600" /><h2 className="mt-4 text-lg font-extrabold text-slate-950">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></article>)}</section>

        <section className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8"><div className="flex items-start gap-4"><ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-emerald-700" /><div><h2 className="text-lg font-extrabold text-emerald-950">La fiducia non è in vendita</h2><p className="mt-2 text-sm leading-6 text-emerald-900">I partner non ricevono fotografie, email, numeri di telefono o report degli utenti. Una sponsorizzazione non modifica punteggi, stime o verdetti. Ogni contenuto commerciale viene etichettato in modo riconoscibile.</p></div></div></section>

        <section className="mt-10 text-center"><h2 className="text-2xl font-extrabold text-slate-950">Raccontaci cosa vuoi ottenere</h2><p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">Indica attività, area geografica, pubblico, obiettivo e budget indicativo. Prepariamo una proposta semplice e misurabile.</p><a href={`mailto:partner@autoesperto.it?subject=${subject}&body=${body}`} className="mt-5 inline-flex items-center gap-2 font-extrabold text-blue-700 hover:underline">Scrivi a partner@autoesperto.it <ArrowRight className="h-4 w-4" /></a></section>
      </div>
    </main>
  );
}
