'use client';
import type { AutoReport } from '@autoesperto/types';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { computeScores } from '@/lib/score';

const euro = (value?: number) => value != null && value > 0 ? `${Math.round(value).toLocaleString('it-IT')} €` : 'Non disponibile';

export default function ReportScoreHero({ report, isModelData = false }: { report: AutoReport; isModelData?: boolean }) {
  const { vehicle, reliability, price } = report;
  const scores = computeScores(report);
  const caution = reliability.verdict === 'AVOID';
  const negotiate = reliability.verdict === 'NEGOTIATE';
  const label = caution ? 'Valuta con cautela' : negotiate ? 'Valuta prezzo e condizioni' : reliability.verdict === 'BUY' ? 'Modello interessante' : 'Valutazione da approfondire';
  const nextStep = caution ? 'Prima di decidere, fai verificare in officina le criticità indicate per questo modello.' : negotiate ? 'Confronta il prezzo richiesto con la fascia stimata e verifica manutenzione e condizioni.' : 'Controlla lo storico dei tagliandi e prova l’auto prima di prendere una decisione.';
  const reliabilityScore = Number(reliability.score);
  const reliabilityLabel = Number.isFinite(reliabilityScore) ? `${(reliabilityScore > 10 ? (reliabilityScore / 10).toFixed(1) : reliabilityScore.toFixed(1)).replace(".", ",")} / 10` : 'Non disponibile';
  const hasRange = price.min > 0 && price.max >= price.min;
  return <section aria-label="Sintesi della valutazione" className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
    <div className="p-5 sm:p-7">
      <p className="text-[11px] font-bold uppercase tracking-[.14em] text-blue-700">La tua valutazione, in breve</p>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1"><h2 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">{[vehicle.make, vehicle.model].filter(Boolean).join(' ') || 'Veicolo'}</h2><p className="mt-2 text-sm leading-relaxed text-slate-600">{[vehicle.version, vehicle.year, vehicle.fuel].filter(Boolean).join(' · ')}</p></div>
        <div className="rounded-xl bg-slate-100 px-4 py-3"><p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Indice complessivo</p><p className="mt-1 text-2xl font-extrabold text-slate-900">{scores.overall}<span className="ml-1 text-sm font-medium text-slate-500">/ 100</span></p></div>
      </div>
      <div className={`mt-5 rounded-xl border p-4 ${caution ? 'border-amber-200 bg-amber-50' : negotiate ? 'border-blue-200 bg-blue-50' : reliability.verdict === 'BUY' ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>
        <p className="flex items-center gap-2 text-base font-bold text-slate-900">{caution && <AlertTriangle className="h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />}{label}</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">{nextStep}</p>
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:divide-x sm:divide-slate-200">
        <div className="col-span-2 sm:col-span-1"><dt className="text-xs font-medium text-slate-500">Fascia di valore stimata</dt><dd className="mt-1 text-lg font-bold text-slate-950">{hasRange ? `${euro(price.min)} – ${euro(price.max)}` : euro(price.estimatedValue)}</dd></div>
        <div className="sm:pl-4"><dt className="text-xs font-medium text-slate-500">Prezzo richiesto</dt><dd className="mt-1 text-lg font-bold text-slate-950">{(price.requestedPrice ?? 0) > 0 ? euro(price.requestedPrice) : 'Non inserito'}</dd></div>
        <div className="sm:pl-4"><dt className="text-xs font-medium text-slate-500">Affidabilità del modello</dt><dd className="mt-1 text-lg font-bold text-slate-950">{reliabilityLabel}</dd></div>
      </dl>
    </div>
    <p className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-xs leading-relaxed text-slate-600 sm:px-7">{isModelData ? 'Stima per modello: ' : 'Valutazione indicativa: '}il punteggio riassume i dati disponibili e non certifica le condizioni di questa auto. <span className="inline-flex items-center gap-1 font-semibold text-slate-700">Apri gli approfondimenti qui sotto <ArrowRight className="h-3 w-3" aria-hidden="true" /></span></p>
  </section>;
}
