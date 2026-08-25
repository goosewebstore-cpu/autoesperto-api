'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Sparkles,
  Link2,
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
  HelpCircle,
  Copy,
  Tag,
  ClipboardList,
  Fuel,
} from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { parseListingTextOrUrl, type ParsedAdData } from '@/lib/adParser';
import type { TrustScoreResult } from '@/lib/trustScore';
import { computeAdTrustScore } from '@/lib/trustScore';
import { computeDealScore, type DealScoreResult } from '@/lib/dealScore';
import {
  generateDecisionCard,
  generateWhyAndWhyNot,
  generateSellerQuestions,
  generatePrePurchaseChecklist,
  type DecisionCardData,
  type WhyAndWhyNot,
  type PrePurchaseChecklist,
} from '@/lib/decisionEngine';
import { calculateVehicleTco, type VehicleTcoResult } from '@/lib/tcoEngine';
import { VEHICLE_DATABASE } from '@/lib/finderEngine';
import { saveAdvisorContext } from '@/lib/aiAdvisor';
import { saveToBuyingRoom } from '@/lib/buyingRoom';
import { trackEvent } from '@/lib/analytics';

export default function AdAnalysisLandingClient() {
  const searchParams = useSearchParams();

  const [inputVal, setInputVal] = useState<string>('');
  const [parsed, setParsed] = useState<ParsedAdData | null>(null);
  const [trustResult, setTrustResult] = useState<TrustScoreResult | null>(null);
  const [dealResult, setDealResult] = useState<DealScoreResult | null>(null);
  const [decisionCard, setDecisionCard] = useState<DecisionCardData | null>(null);
  const [whyData, setWhyData] = useState<WhyAndWhyNot | null>(null);
  const [sellerQuestions, setSellerQuestions] = useState<string[]>([]);
  const [checklist, setChecklist] = useState<PrePurchaseChecklist | null>(null);
  const [tcoResult, setTcoResult] = useState<VehicleTcoResult | null>(null);
  const [shareCopied, setShareCopied] = useState<boolean>(false);
  const [savedToRoomToast, setSavedToRoomToast] = useState<boolean>(false);

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
        rawText: `${qMake} ${qModel}`,
      };
      runFullAnalysis(initialAd);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleInputChange = (val: string) => {
    setInputVal(val);
    const p = parseListingTextOrUrl(val);
    setParsed(p);
  };

  const runFullAnalysis = (ad: ParsedAdData) => {
    setParsed(ad);
    const tRes = computeAdTrustScore(ad);
    setTrustResult(tRes);

    const estAvg = Math.round((tRes.priceAnalysis.estimatedValueMin + tRes.priceAnalysis.estimatedValueMax) / 2);
    const askingPrice = ad.price || estAvg;
    const year = ad.year || new Date().getFullYear() - 5;
    const km = ad.km || 85000;

    const dRes = computeDealScore(askingPrice, estAvg, tRes.priceAnalysis.estimatedValueMin, tRes.priceAnalysis.estimatedValueMax, 72);
    setDealResult(dRes);

    const dCard = generateDecisionCard(ad.make || '', ad.model || '', year, km, askingPrice, estAvg, 88);
    setDecisionCard(dCard);

    const wData = generateWhyAndWhyNot(ad.make || '', ad.model || '');
    setWhyData(wData);

    const questions = generateSellerQuestions(ad.make || '', ad.model || '', ad.fuel, km);
    setSellerQuestions(questions);

    const chk = generatePrePurchaseChecklist();
    setChecklist(chk);

    const profile = VEHICLE_DATABASE.find(
      (c) =>
        c.make.toLowerCase() === (ad.make || '').toLowerCase() &&
        c.model.toLowerCase() === (ad.model || '').toLowerCase()
    );
    if (profile) {
      const tco = calculateVehicleTco(profile, 12000, ad.fuel);
      setTcoResult(tco);
    }

    saveAdvisorContext({ lastAnalyzedAd: ad });
    trackEvent('listing_analyzed', {
      make: ad.make,
      model: ad.model,
      trustScore: tRes.overallScore,
      dealScore: dRes.dealScore,
    });
  };

  const handleAnalyze = () => {
    if (!parsed || (!parsed.make && !parsed.model)) {
      alert('Incolla un link di AutoScout24, Subito.it o un testo con almeno marca e modello (es. "Fiat Panda 2021 45.000 km 9.500 €")');
      return;
    }

    runFullAnalysis(parsed);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleSaveToRoom = () => {
    if (!parsed) return;
    saveToBuyingRoom({
      make: parsed.make || '',
      model: parsed.model || '',
      year: parsed.year,
      km: parsed.km,
      askingPrice: parsed.price,
      matchScore: 88,
      trustScore: trustResult?.overallScore,
      dealScore: dealResult?.dealScore,
      stage: 'analizzata',
    });
    setSavedToRoomToast(true);
    setTimeout(() => setSavedToRoomToast(false), 3500);
  };

  const handleShareReport = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-white">
      <SiteHeader />

      <main className="flex-1 pb-16">
        {/* Hero Section */}
        <section className="bg-slate-900 text-white pt-10 pb-14 px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
              <ShieldCheck className="w-4 h-4 text-blue-400" /> Analisi Annuncio &amp; Copilot Pre-Acquisto
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Seconda Opinione: Scopri se comprarla o no
            </h1>
            <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto">
              Incolla il link dell&apos;annuncio o il testo. AutoEsperto analizza Deal Score, Trust Score, rischi noti e ti genera le domande esatte da fare al venditore.
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
              placeholder="Incolla qui l'URL dell'annuncio o copia il testo (es. 'Toyota Yaris 1.5 Hybrid Lounge 2019 62.000 km 12.800 € unico proprietario tagliandi ufficiali')..."
              className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-blue-600 resize-none transition-all"
            />

            {/* Extracted fields preview */}
            {parsed && (parsed.make || parsed.model || parsed.year || parsed.price) && (
              <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-700 dark:text-blue-300">
                  <Sparkles className="w-3.5 h-3.5" /> Parametri estratti dal testo:
                </div>
                <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
                  {parsed.make && <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border">Marca: <strong>{parsed.make}</strong></span>}
                  {parsed.model && <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border">Modello: <strong>{parsed.model}</strong></span>}
                  {parsed.year && <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border">Anno: <strong>{parsed.year}</strong></span>}
                  {parsed.km && <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border">Km: <strong>{parsed.km.toLocaleString('it-IT')}</strong></span>}
                  {parsed.price && <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border border-emerald-300">Prezzo: <strong>€{parsed.price.toLocaleString('it-IT')}</strong></span>}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleAnalyze}
              className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" /> Esegui Analisi Completa Pre-Acquisto
            </button>
          </div>
        </div>

        {/* ─── FULL REPORT PRESENTATION ─── */}
        {trustResult && dealResult && decisionCard && (
          <div className="max-w-4xl mx-auto px-4 mt-8 space-y-6 animate-fade-in">
            {/* Top Share & Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div>
                <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">Report di Valutazione Indipendente</span>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  {parsed?.make} {parsed?.model} ({parsed?.year || 'Usata'})
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveToRoom}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Bookmark className="w-3.5 h-3.5" /> Salva nella Buying Room
                </button>

                <button
                  type="button"
                  onClick={handleShareReport}
                  className="px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center gap-1.5 hover:bg-blue-100 transition-all"
                >
                  {shareCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                  {shareCopied ? 'Link Copiato!' : 'Invia a un amico'}
                </button>
              </div>
            </div>

            {savedToRoomToast && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-300 text-xs font-bold flex items-center gap-2 animate-slide-up">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Auto salvata nel tuo spazio personale (Buying Room)!
              </div>
            )}

            {/* ─── 1. DECISION CARD ─── */}
            <div
              className={`rounded-3xl p-6 sm:p-8 border shadow-lg space-y-4 ${
                decisionCard.verdictTone === 'emerald'
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
                  : decisionCard.verdictTone === 'amber'
                  ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-100'
                  : 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-current/15">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider block opacity-80">
                    Decisione Sintetica AutoEsperto
                  </span>
                  <h3 className="text-xl sm:text-3xl font-black mt-0.5">
                    Dovrei comprarla? → {decisionCard.verdictLabel}
                  </h3>
                </div>

                <div className="flex items-center gap-2 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md px-4 py-2 rounded-2xl border border-current/20">
                  <Tag className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-black">{dealResult.labelText}</span>
                </div>
              </div>

              {/* 5-Axis Ratings Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-current/10">
                  <span className="text-[10px] opacity-70 block">Prezzo</span>
                  <span className="font-black text-sm">{decisionCard.ratings.price}/10</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-current/10">
                  <span className="text-[10px] opacity-70 block">Condizioni</span>
                  <span className="font-black text-sm">{decisionCard.ratings.declaredCondition}/10</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-current/10">
                  <span className="text-[10px] opacity-70 block">Valore</span>
                  <span className="font-black text-sm">{decisionCard.ratings.marketValue}/10</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-current/10">
                  <span className="text-[10px] opacity-70 block">Rischio</span>
                  <span className="font-black text-sm">{decisionCard.ratings.riskIndex}/10</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-current/10 col-span-2 sm:col-span-1">
                  <span className="text-[10px] opacity-70 block">Match Personale</span>
                  <span className="font-black text-sm">{decisionCard.ratings.personalFit}/10</span>
                </div>
              </div>

              {/* Direct Negotiation Rule */}
              <div className="pt-2">
                <p className="text-xs sm:text-sm font-bold leading-relaxed bg-white/60 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-current/15">
                  💬 <strong>Strategia:</strong> {decisionCard.negotiationVerdict}
                </p>
              </div>
            </div>

            {/* ─── 2. BUY SCORE & AI NEGOTIATOR (INVESTOR-GRADE HERO RESULT) ─── */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-xl grid place-items-center font-mono">
                    {dealResult.dealScore}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">AutoEsperto Buy Score</span>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      {dealResult.labelText}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Trust Level Badge */}
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" /> AI ANALYZED
                  </span>
                  {/* Market Confidence Badge */}
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold border ${
                    dealResult.confidence === 'alta'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200'
                      : dealResult.confidence === 'media'
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200'
                      : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200'
                  }`}>
                    Confidenza: {dealResult.confidence.toUpperCase()} ({dealResult.comparablesCount} comparabili)
                  </span>
                </div>
              </div>

              {/* Price & Target Values 4-Card Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Prezzo Richiesto</span>
                  <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-mono">
                    €{trustResult.priceAnalysis.askingPrice.toLocaleString('it-IT')}
                  </span>
                  <span className={`text-[10px] font-bold block mt-0.5 ${
                    dealResult.priceDiffPercent > 0 ? 'text-amber-600' : 'text-emerald-600'
                  }`}>
                    {dealResult.priceDiffPercent > 0 ? `+${dealResult.priceDiffPercent}% vs media` : `${dealResult.priceDiffPercent}% vs media`}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Valore Reale Medio</span>
                  <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-mono">
                    €{Math.round((trustResult.priceAnalysis.estimatedValueMin + trustResult.priceAnalysis.estimatedValueMax) / 2).toLocaleString('it-IT')}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Forbice: €{trustResult.priceAnalysis.estimatedValueMin.toLocaleString('it-IT')} – {trustResult.priceAnalysis.estimatedValueMax.toLocaleString('it-IT')}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-center">
                  <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-300 block">Prezzo Consigliato</span>
                  <span className="text-lg sm:text-xl font-black text-blue-700 dark:text-blue-200 font-mono">
                    €{dealResult.recommendedOfferPrice.toLocaleString('it-IT')}
                  </span>
                  <span className="text-[10px] text-blue-600/80 dark:text-blue-300/80 block mt-0.5">
                    Offerta consigliata
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Prezzo Max che Pagherei</span>
                  <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-mono">
                    €{dealResult.maxAcceptablePrice.toLocaleString('it-IT')}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Limite massimo
                  </span>
                </div>
              </div>

              {/* AI Negotiator Message Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-blue-50/80 dark:from-indigo-950/40 dark:to-blue-950/40 border border-indigo-200/80 dark:border-indigo-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 text-indigo-600" /> AI Negotiator — Messaggio pronto per il venditore
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        navigator.clipboard.writeText(dealResult.negotiatorMessage);
                        trackEvent('negotiator_message_copied', { make: parsed?.make, model: parsed?.model });
                        alert('Messaggio per il venditore copiato negli appunti!');
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800 flex items-center gap-1 shadow-xs transition-all"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copia messaggio
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950/80 border border-indigo-100 dark:border-indigo-900/60 text-xs text-slate-700 dark:text-slate-300 font-sans leading-relaxed whitespace-pre-line">
                  {dealResult.negotiatorMessage}
                </div>
              </div>

              {/* Data Transparency Accordion */}
              <details className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden group">
                <summary className="p-3.5 bg-slate-50 dark:bg-slate-800/60 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-blue-600" /> Come abbiamo calcolato questo valore? (Data Transparency)
                  </span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform font-bold text-xs">↓</span>
                </summary>
                <div className="p-4 bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                  <p>
                    • <strong>Campione di comparabili:</strong> {dealResult.comparablesCount} annunci reali di {parsed?.make} {parsed?.model} rilevati sui principali marketplace italiani.
                  </p>
                  <p>
                    • <strong>Filtri di omogeneità:</strong> Anno {parsed?.year || 'di riferimento'} (±1 anno), chilometraggio simile e alimentazione corrispondente.
                  </p>
                  <p>
                    • <strong>Valutazione oggettiva:</strong> Non vendiamo auto né prendiamo commissioni sul prezzo finale. Le stime sono calcolate per tutelare l&apos;acquirente da richieste fuori mercato.
                  </p>
                </div>
              </details>
            </div>

            {/* ─── 4. WHY THIS CAR? vs WHY NOT? ─── */}
            {whyData && (
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Perché te la stiamo consigliando:
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    {whyData.whyBuy.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold shrink-0">✓</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Perché potresti non volerla (Cosa sapere):
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    {whyData.whyNot.map((w, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold shrink-0">⚠️</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* ─── 5. TCO ESTIMATE BOX IF AVAILABLE ─── */}
            {tcoResult && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                    <Fuel className="w-4 h-4" /> Costo Reale Totale di Possesso (TCO)
                  </span>
                  <span className="text-xs text-slate-400">12.000 km/anno</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Costo Annuo</span>
                    <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                      €{tcoResult.breakdown.totalAnnualCost.toLocaleString('it-IT')}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Costo Mensile</span>
                    <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                      ≈ €{tcoResult.breakdown.monthlyCost}/mese
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Costo al Km</span>
                    <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                      €{tcoResult.breakdown.costPerKm.toFixed(2)}/km
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ─── 6. SELLER QUESTIONS GENERATOR ─── */}
            {sellerQuestions.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4" /> Domande specifiche da fare al venditore prima di pagare:
                </h4>
                <div className="space-y-2">
                  {sellerQuestions.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-xs text-indigo-950 dark:text-indigo-200 flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold grid place-items-center shrink-0 text-[11px]">
                        {idx + 1}
                      </span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── 7. 3-STAGE CHECKLIST ─── */}
            {checklist && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ClipboardList className="w-4 h-4 text-blue-600" /> Checklist di Ispezione in 3 Fasi:
                </h4>

                <div className="grid md:grid-cols-3 gap-4">
                  {/* Phase 1 */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-2">
                    <span className="text-[11px] font-bold text-blue-600 uppercase block">1. Prima di vederla</span>
                    <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                      {checklist.beforeViewing.map((item, idx) => (
                        <li key={idx} className="space-y-0.5">
                          <span className="font-bold block">☐ {item.task}</span>
                          <span className="text-[11px] text-slate-500 block leading-tight">{item.tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Phase 2 */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-2">
                    <span className="text-[11px] font-bold text-amber-600 uppercase block">2. Durante la prova</span>
                    <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                      {checklist.duringInspection.map((item, idx) => (
                        <li key={idx} className="space-y-0.5">
                          <span className="font-bold block">☐ {item.task}</span>
                          <span className="text-[11px] text-slate-500 block leading-tight">{item.tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Phase 3 */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-2">
                    <span className="text-[11px] font-bold text-emerald-600 uppercase block">3. Prima di pagare</span>
                    <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                      {checklist.beforePaying.map((item, idx) => (
                        <li key={idx} className="space-y-0.5">
                          <span className="font-bold block">☐ {item.task}</span>
                          <span className="text-[11px] text-slate-500 block leading-tight">{item.tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <Link
                href={`/ai-car-advisor?ask=${encodeURIComponent(`Ho analizzato questo annuncio (${parsed?.make} ${parsed?.model} a ${parsed?.price}€) e il Deal Score è ${dealResult.dealScore}/100. Cosa mi consigli per trattare?`)}`}
                className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" /> Approfondisci con l&apos;AI Car Advisor
              </Link>

              <Link
                href="/passport"
                className="px-5 py-3 rounded-2xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs border border-slate-700 transition-all flex items-center gap-2"
              >
                <Car className="w-4 h-4" /> L&apos;hai comprata? Salva nel Vehicle Passport
              </Link>
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
