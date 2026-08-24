'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Sparkles,
  Link2,
  Camera,
  Car,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Gauge,
  Wallet,
  MessageCircle,
  Share2,
  Bookmark,
  Check,
  ChevronRight,
  Info,
} from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { parseListingTextOrUrl, type ParsedAdData } from '@/lib/adParser';
import type { TrustScoreResult } from '@/lib/trustScore';
import { computeAdTrustScore } from '@/lib/trustScore';
import { saveAdvisorContext } from '@/lib/aiAdvisor';
import { trackEvent } from '@/lib/analytics';

export default function AdAnalysisLandingClient() {
  const searchParams = useSearchParams();

  const [inputVal, setInputVal] = useState<string>('');
  const [parsed, setParsed] = useState<ParsedAdData | null>(null);
  const [trustResult, setTrustResult] = useState<TrustScoreResult | null>(null);

  // Read query params if arriving from finder or external link
  useEffect(() => {
    const qMake = searchParams.get('make');
    const qModel = searchParams.get('model');
    const qPrice = searchParams.get('price');
    const qYear = searchParams.get('year');
    const qKm = searchParams.get('km');

    if (qMake && qModel) {
      const initialAd: ParsedAdData = {
        make: qMake,
        model: qModel,
        price: qPrice ? Number(qPrice) : undefined,
        year: qYear ? Number(qYear) : undefined,
        km: qKm ? Number(qKm) : undefined,
      };
      setParsed(initialAd);
      const res = computeAdTrustScore(initialAd);
      setTrustResult(res);
      saveAdvisorContext({ lastAnalyzedAd: initialAd });
    }
  }, [searchParams]);

  const handleInputChange = (val: string) => {
    setInputVal(val);
    const p = parseListingTextOrUrl(val);
    setParsed(p);
  };

  const handleAnalyze = () => {
    if (!parsed || (!parsed.make && !parsed.model)) {
      alert('Incolla un link di AutoScout24, Subito.it o un testo con almeno marca e modello (es. "Fiat Panda 2021 45.000 km 9.500 €")');
      return;
    }

    const res = computeAdTrustScore(parsed);
    setTrustResult(res);
    saveAdvisorContext({ lastAnalyzedAd: parsed });
    trackEvent('listing_analyzed', { make: parsed.make, model: parsed.model, trustScore: res.overallScore });
    window.scrollTo({ top: 420, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-white">
      <SiteHeader />

      <main className="flex-1 pb-16">
        {/* Hero Section */}
        <section className="bg-slate-900 text-white pt-10 pb-14 px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
              <ShieldCheck className="w-4 h-4 text-blue-400" /> Analisi Annuncio &amp; Trust Score™
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Scopri se l&apos;annuncio è un affare o una trappola
            </h1>
            <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto">
              Incolla il link dell&apos;annuncio o il testo dell&apos;offerta. AutoEsperto analizza prezzo reale, coerenza dei km, affidabilità e quanto offrire al venditore.
            </p>
          </div>
        </section>

        {/* Input Box Card */}
        <div className="max-w-4xl mx-auto px-4 -mt-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <label className="block text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Link2 className="w-4 h-4 text-blue-600" />
              Incolla link AutoScout24, Subito.it o testo dell&apos;annuncio:
            </label>

            <textarea
              rows={3}
              value={inputVal}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Incolla qui l'URL dell'annuncio oppure copia il testo (es. 'Fiat 500 1.2 Lounge 2019 68.000 km 10.900 € unico proprietario tagliandi regolari')..."
              className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-blue-600 resize-none transition-all"
            />

            {/* Extracted fields live pill preview */}
            {parsed && (parsed.make || parsed.model || parsed.year || parsed.price) && (
              <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-700 dark:text-blue-300">
                  <Sparkles className="w-3.5 h-3.5" /> Dati estratti automaticamente:
                </div>
                <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
                  {parsed.make && (
                    <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border">
                      Marca: <strong>{parsed.make}</strong>
                    </span>
                  )}
                  {parsed.model && (
                    <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border">
                      Modello: <strong>{parsed.model}</strong>
                    </span>
                  )}
                  {parsed.year && (
                    <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border">
                      Anno: <strong>{parsed.year}</strong>
                    </span>
                  )}
                  {parsed.km && (
                    <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border">
                      Km: <strong>{parsed.km.toLocaleString('it-IT')}</strong>
                    </span>
                  )}
                  {parsed.price && (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border border-emerald-300">
                      Prezzo: <strong>€{parsed.price.toLocaleString('it-IT')}</strong>
                    </span>
                  )}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleAnalyze}
              className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" /> Calcola Trust Score &amp; Verdetto
            </button>
          </div>
        </div>

        {/* ─── TRUST SCORE ANALYSIS RESULTS ─── */}
        {trustResult && (
          <div className="max-w-4xl mx-auto px-4 mt-8 space-y-6 animate-fade-in">
            {/* Verdict Hero Card */}
            <div
              className={`rounded-3xl p-6 sm:p-8 border shadow-lg ${
                trustResult.verdictTone === 'emerald'
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
                  : trustResult.verdictTone === 'amber'
                  ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-100'
                  : 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-current/15">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider block opacity-80">
                    Verdetto AutoEsperto
                  </span>
                  <h2 className="text-xl sm:text-3xl font-black mt-0.5">
                    {trustResult.verdictLabel}
                  </h2>
                </div>

                <div className="flex items-center gap-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-current/20">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-black opacity-70 block">Trust Score</span>
                    <span className="text-2xl font-black number-mono">{trustResult.overallScore}/100</span>
                  </div>
                </div>
              </div>

              {/* Direct "La compreresti?" Explanation */}
              <div className="pt-4 space-y-2">
                <span className="text-xs font-black uppercase tracking-wider block opacity-80 flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4" /> &quot;La compreresti?&quot; — Il parere dell&apos;esperto:
                </span>
                <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                  {trustResult.wouldBuyExplanation}
                </p>
              </div>
            </div>

            {/* Price & Offer Price Strategy Grid */}
            <div className="grid md:grid-cols-2 gap-5">
              {/* Market Comparison Card */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-blue-600" /> Analisi Prezzo di Mercato
                </span>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-xs text-slate-400 block">Prezzo Richiesto:</span>
                    <span className="text-xl font-black text-slate-900 dark:text-white font-mono">
                      €{trustResult.priceAnalysis.askingPrice.toLocaleString('it-IT')}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Valore Stimato Reale:</span>
                    <span className="text-lg font-black text-emerald-600 font-mono">
                      €{trustResult.priceAnalysis.estimatedValueMin.toLocaleString('it-IT')} – €{trustResult.priceAnalysis.estimatedValueMax.toLocaleString('it-IT')}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-2">
                  {trustResult.priceAnalysis.marketDiffPercent > 0
                    ? `Il venditore chiede circa il +${trustResult.priceAnalysis.marketDiffPercent}% rispetto alla media degli annunci reali in Italia.`
                    : `Prezzo competitivo: circa il ${Math.abs(trustResult.priceAnalysis.marketDiffPercent)}% sotto la media di mercato.`}
                </p>
              </div>

              {/* Offer Price Recommendation Card */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <Wallet className="w-4 h-4" /> Quanto offrire? (Strategia Trattativa)
                </span>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-xs text-slate-400 block">Offerta Iniziale Suggerita:</span>
                    <span className="text-xl font-black text-indigo-600 font-mono">
                      €{trustResult.offerPrice.suggestedStartingOffer.toLocaleString('it-IT')}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Target per Chiudere:</span>
                    <span className="text-base font-black text-slate-800 dark:text-slate-200 font-mono">
                      €{trustResult.offerPrice.fairTargetPrice.toLocaleString('it-IT')}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-2">
                  {trustResult.offerPrice.negotiationStrategy}
                </p>
              </div>
            </div>

            {/* Checklist of What to Inspect */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" /> Cosa controllare prima di comprare questo esemplare:
              </h3>
              <ol className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {trustResult.inspectionChecklist.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 font-bold grid place-items-center shrink-0 text-[11px]">
                      {idx + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <Link
                href={`/ai-car-advisor?ask=${encodeURIComponent(`Ho analizzato questo annuncio (${parsed?.make} ${parsed?.model} a ${parsed?.price}€) e il Trust Score è ${trustResult.overallScore}/100. Cosa mi consigli?`)}`}
                className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" /> Approfondisci con l&apos;AI Car Advisor
              </Link>

              <Link
                href="/passport"
                className="px-5 py-3 rounded-2xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs border border-slate-700 transition-all flex items-center gap-2"
              >
                <Car className="w-4 h-4" /> L&apos;hai comprata? Aggiungila al Profilo Digitale
              </Link>
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
