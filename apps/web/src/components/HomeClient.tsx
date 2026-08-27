'use client';

import { Suspense, useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowRight,
  BookOpen,
  Camera,
  Check,
  Clock,
  Compass,
  Gauge,
  HelpCircle,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import VehicleScanner from '@/components/VehicleScanner';
import ReportErrorBoundary from '@/components/ReportErrorBoundary';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { trackEvent } from '@/lib/analytics';
import { type AnalyzePayload } from '@/lib/api';

const FEATURED_GUIDES = [
  {
    slug: 'straccia-bollo-sicilia-2026-chi-puo-farlo-norme',
    title: 'Straccia Bollo Sicilia 2026: come cancellare sanzioni e interessi',
    tag: 'Novità Fiscale 2026',
    desc: 'Chi può mettersi in regola senza sanzioni fino al 2025, le scadenze del 31 ottobre e sblocco fermi.',
    readTime: '5 min',
  },
  {
    slug: 'le-10-auto-piu-rubate-italia-2026',
    title: 'Le 10 auto più rubate in Italia nel 2026: la classifica aggiornata',
    tag: 'Sicurezza & Furti',
    desc: 'Dalla Panda alla Renegade, i dati del Ministero dell\'Interno e le tecniche di furto più diffuse.',
    readTime: '6 min',
  },
  {
    slug: 'fiat-panda-500-rubate-sicilia-come-proteggersi',
    title: 'Fiat Panda e Fiat 500 rubate in Sicilia: perché e come proteggersi',
    tag: 'Furti & Ricambi',
    desc: 'Perché sono le auto più colpite, il business della cannibalizzazione ricambi e 6 difese efficaci.',
    readTime: '6 min',
  },
  {
    slug: 'passaporto-digitale-veicolo-regolamento-ue-2026-1738',
    title: 'Passaporto Digitale del Veicolo (Regolamento UE 2026/1738)',
    tag: 'Normativa 2026',
    desc: 'Cosa cambia per le auto usate, storico km certificato, salute batteria SoH e date di applicazione.',
    readTime: '6 min',
  },
  {
    slug: 'profilo-auto-digitale-passaporto-veicolo',
    title: 'Profilo Auto Digitale: come funziona il passaporto permanente',
    tag: 'Vehicle Passport',
    desc: 'Come digitalizzare libretto, storico tagliandi con AI e condividere la scheda trasparente con QR code.',
    readTime: '5 min',
  },
  {
    slug: 'come-controllare-annuncio-auto-usata',
    title: 'Come analizzare un annuncio di auto usata ed evitare truffe',
    tag: 'Guida Acquisto',
    desc: 'Verifica coerenza tra km e anno, individuazione prezzi civetta e controlli pre-acquisto fondamentali.',
    readTime: '7 min',
  },
  {
    slug: 'come-trattare-prezzo-auto-usata',
    title: 'Come trattare il prezzo di un\'auto usata e margine reale',
    tag: 'Trattativa',
    desc: 'Quanto margine chiedere a privati e concessionari, trasformando i controlli in euro di sconto.',
    readTime: '5 min',
  },
  {
    slug: 'come-capire-se-auto-usata-e-affare',
    title: 'Come capire se un\'auto usata è un affare: 5 dati chiave',
    tag: 'Valutazione',
    desc: 'I 5 parametri oggettivi da verificare prima di firmare o versare qualsiasi caparra.',
    readTime: '6 min',
  },
  {
    slug: 'auto-che-si-svalutano-meno',
    title: 'Le auto che si svalutano meno: quali tengono il valore nel 2026',
    tag: 'Mercato & Svalutazione',
    desc: 'Quali modelli e motorizzazioni perdono meno valore e come controllare il deprezzamento reale.',
    readTime: '5 min',
  },
];

export interface HomeClientProps {
  stats: { makes: number; models: number };
}

function optionalNumber(value: string | null) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function PrefillHandler({ onPrefill }: { onPrefill: (payload: AnalyzePayload) => void }) {
  const searchParams = useSearchParams();
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    const make = searchParams.get('make');
    const model = searchParams.get('model');
    if (make && model) {
      ranRef.current = true;
      onPrefill({
        make,
        model,
        year: optionalNumber(searchParams.get('year')),
        km: optionalNumber(searchParams.get('km')),
        requestedPrice: optionalNumber(searchParams.get('price')),
      });
    }
  }, [searchParams, onPrefill]);

  return null;
}

const STEPS = [
  {
    num: '1',
    icon: Camera,
    title: 'Inserisci l\u2019auto',
    desc: 'Carica una foto oppure seleziona marca e modello in pochi click.',
  },
  {
    num: '2',
    icon: TrendingUp,
    title: 'Analisi accurata & dati reali',
    desc: 'Incrociamo migliaia di annunci con i difetti noti, l\'affidabilità e i costi esatti.',
  },
  {
    num: '3',
    icon: Gauge,
    title: 'Verdetto chiaro & report completo',
    desc: 'Score oggettivo, prezzo giusto di mercato, bollo esatto e checklist pre-acquisto.',
  },
];

const FAQS = [
  {
    q: 'È davvero gratuito analizzare un\u2019auto?',
    a: 'Sì, l\u2019analisi è 100% gratuita e non richiede alcuna registrazione.',
  },
  {
    q: 'Come viene calcolato il verdetto?',
    a: 'Incrociamo gli annunci di vendita reali in Italia con lo storico dell\u2019affidabilità del modello, i costi di riparazione e la svalutazione per calcolare uno score oggettivo.',
  },
  {
    q: 'Come funziona il riconoscimento da foto?',
    a: 'L\u2019IA riconosce marca, modello e segmento dell\u2019auto dalla foto in pochi secondi. Se la foto non è nitida, puoi sempre selezionarli a mano.',
  },
  {
    q: 'Cosa contiene il report di analisi?',
    a: 'Prezzo stimato di mercato vs prezzo richiesto, verdetto (BUON AFFARE, TRATTA IL PREZZO, EVITALA), Vehicle Health Score, stima del bollo, consumi reali e checklist pre-acquisto.',
  },
  {
    q: 'Cosa indica il Vehicle Health Score?',
    a: 'È l\u2019indice complessivo dello stato di salute meccanica (da 0 a 100). Valuta motore, cambio, freni, impianto elettrico e carrozzeria in base a età, chilometri e difetti storici documentati del modello.',
  },
];

const POPULAR = [
  { make: 'Fiat', model: 'Panda', year: '2023', fuel: 'Benzina / Ibrida', priceRange: '8.400 – 11.200 €', score: 78, verdict: 'TRATTA IL PREZZO' },
  { make: 'Fiat', model: '500', year: '2024', fuel: 'Ibrida / Elettrica', priceRange: '11.500 – 15.200 €', score: 81, verdict: 'BUON AFFARE' },
  { make: 'Volkswagen', model: 'Golf', year: '2023', fuel: 'Benzina / Diesel', priceRange: '19.800 – 25.500 €', score: 75, verdict: 'TRATTA IL PREZZO' },
  { make: 'Toyota', model: 'Yaris', year: '2023', fuel: 'Full Hybrid', priceRange: '16.200 – 19.800 €', score: 86, verdict: 'BUON AFFARE' },
  { make: 'Renault', model: 'Clio', year: '2023', fuel: 'GPL / Ibrida', priceRange: '13.500 – 17.000 €', score: 79, verdict: 'TRATTA IL PREZZO' },
  { make: 'Peugeot', model: '208', year: '2023', fuel: 'Benzina / Elettrica', priceRange: '14.000 – 18.500 €', score: 82, verdict: 'BUON AFFARE' },
];

function popularHref(make: string, model: string) {
  const slug = (value: string) =>
    value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/[-\s]+/g, '-').replace(/^-+|-+$/g, '');
  return `/valutazione/${slug(make)}/${slug(model)}`;
}

export default function HomeClient({ stats }: HomeClientProps) {
  const [initialPayload, setInitialPayload] = useState<AnalyzePayload | null>(null);
  const [scannerStage, setScannerStage] = useState<string>('idle');

  const handleStageChange = useCallback((st: string) => {
    setScannerStage(st);
  }, []);

  const handlePrefill = (payload: AnalyzePayload) => {
    setInitialPayload(payload);
  };

  const isShowingResult = scannerStage === 'result';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Suspense fallback={null}>
        <PrefillHandler onPrefill={handlePrefill} />
      </Suspense>

      <SiteHeader />

      <main className="pb-16">
        {/* ─── HERO ─── */}
        {!isShowingResult && (
          <section className="pt-8 sm:pt-12 pb-6 px-4 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200/80 px-4 py-1.5 text-xs font-bold text-blue-700 mb-5 shadow-xs">
              <Sparkles className="h-4 w-4 text-blue-600" />
              AutoEsperto · Il Profilo Digitale Intelligente della tua Auto
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.15]">
              Hai trovato un&apos;auto?
              <span className="text-blue-600 block sm:inline"> Scopri se vale davvero il prezzo.</span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
              Compra al prezzo giusto con il <strong>Buy Score indipendente</strong>, gestisci scadenze e tagliandi nel tuo <strong>Vehicle Passport</strong>, vendi con <strong>QR Code verificato</strong>.
            </p>

            {/* Main Action CTAs Tier */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#scanner-section"
                className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-blue-600/25 transition-all flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" /> Analizza la mia auto <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                href="/auto-finder"
                className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 active:scale-98 text-slate-900 font-extrabold text-xs sm:text-sm border border-slate-300 shadow-xs transition-all flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-blue-600" /> Trova la mia auto (Auto Finder)
              </Link>

              <Link
                href="/passport"
                className="px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-all"
              >
                Vehicle Passport (Il mio Garage)
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600">
              <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-600" /> Compra meglio</span>
              <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-600" /> Mantieni meglio</span>
              <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-600" /> Vendi meglio</span>
            </div>
          </section>
        )}

        {/* ─── ANALIZZA AUTO (SCANNER) ─── */}
        <section className="px-4 max-w-5xl mx-auto mb-12" id="scanner-section">
          <div className="bg-white rounded-3xl p-4 sm:p-8 border border-slate-200 shadow-xl shadow-slate-900/5">
            <ReportErrorBoundary onRetry={() => window.location.reload()}>
              <VehicleScanner
                embedded
                initialPayload={initialPayload ?? undefined}
                onStageChange={handleStageChange}
              />
            </ReportErrorBoundary>
          </div>
        </section>

        {!isShowingResult && (
          <>
            {/* ─── COSA POSSO FARE? (4 CARD PILASTRI) ─── */}
            <section className="px-4 max-w-5xl mx-auto mb-16">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Cosa puoi fare con AutoEsperto</h2>
                <p className="text-sm text-slate-600 mt-1 font-medium">Un&apos;unica piattaforma per tutto il ciclo di vita della tua auto.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* 1. TROVA */}
                <Link
                  href="/auto-finder"
                  className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div>
                    <span className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 font-black grid place-items-center mb-4 group-hover:scale-105 transition-transform">
                      <Compass className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] uppercase font-black tracking-wider text-blue-600 block mb-1">
                      1. Trova
                    </span>
                    <h3 className="text-base font-black text-slate-900 mb-2">
                      Trova l&apos;auto giusta
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Matching su misura su budget, consumi reali, km annui e spazio per te.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                    <span>Avvia Auto Finder</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>

                {/* 2. CONTROLLA */}
                <Link
                  href="/analizza-annuncio"
                  className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div>
                    <span className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 font-black grid place-items-center mb-4 group-hover:scale-105 transition-transform">
                      <ShieldCheck className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] uppercase font-black tracking-wider text-emerald-600 block mb-1">
                      2. Controlla
                    </span>
                    <h3 className="text-base font-black text-slate-900 mb-2">
                      Scopri se è un affare
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Buy Score 0-100, prezzo di mercato reale e messaggio pronto per trattare col venditore.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600 group-hover:translate-x-0.5 transition-transform">
                    <span>Controlla annuncio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>

                {/* 3. GESTISCI */}
                <Link
                  href="/passport"
                  className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div>
                    <span className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 font-black grid place-items-center mb-4 group-hover:scale-105 transition-transform">
                      <Gauge className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] uppercase font-black tracking-wider text-indigo-600 block mb-1">
                      3. Gestisci
                    </span>
                    <h3 className="text-base font-black text-slate-900 mb-2">
                      Crea il Vehicle Passport
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Storico tagliandi con AI OCR, promemoria scadenze bollo/revisione e salute meccanica.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                    <span>Apri il Garage</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>

                {/* 4. VENDI */}
                <Link
                  href="/vendi"
                  className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div>
                    <span className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 font-black grid place-items-center mb-4 group-hover:scale-105 transition-transform">
                      <TrendingUp className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] uppercase font-black tracking-wider text-amber-600 block mb-1">
                      4. Vendi
                    </span>
                    <h3 className="text-base font-black text-slate-900 mb-2">
                      Vendi al valore reale
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Quotazione in tempo reale, scheda verificata con QR Code e trasferimento profilo.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600 group-hover:translate-x-0.5 transition-transform">
                    <span>Valuta la tua auto</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              </div>
            </section>

            {/* ─── PASSAPORTO AUTO SECTION ─── */}
            <section className="px-4 max-w-5xl mx-auto mb-16">
              <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden">
                <div className="max-w-2xl relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-4 border border-blue-400/30">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Novità · Passaporto Auto Digitale
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                    La tua auto, sempre con te.
                  </h2>
                  <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
                    Crea il tuo Passaporto Auto: libretto digitale, storico tagliandi certificato, promemoria scadenze, stima ricambi e assistente AI personale per la tua auto.
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Link
                      href="/passport"
                      className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-lg shadow-blue-600/25 active:scale-[0.98] transition-all"
                    >
                      Crea Passaporto Auto <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/passport"
                      className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 transition-all"
                    >
                      Scopri come funziona
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* ─── MODELLI POPOLARI ─── */}
            <section className="px-4 max-w-5xl mx-auto mb-16">
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-2">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Modelli più cercati</h2>
                  <p className="text-sm text-slate-600 font-medium">Controlla subito le quotazioni e i verdetti per le auto usate più diffuse.</p>
                </div>
                <Link href="/valutazione" className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">
                  Vedi tutti i modelli <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {POPULAR.map((item) => {
                  const isGood = item.verdict === 'BUON AFFARE';
                  return (
                    <Link
                      key={`${item.make}-${item.model}`}
                      href={popularHref(item.make, item.model)}
                      className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-blue-500 hover:shadow-md transition-all group flex flex-col justify-between"
                      onClick={() => trackEvent('tool_click', { tool: `${item.make} ${item.model}` })}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {item.make} {item.model}
                            </h3>
                            <p className="text-xs font-medium text-slate-500">{item.year} · {item.fuel}</p>
                          </div>
                          <span className="text-xs font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-full">
                            {item.score}/100
                          </span>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-slate-500 font-medium">Prezzo stimato:</span>
                          <strong className="text-slate-900 font-bold">{item.priceRange}</strong>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <span className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                          isGood ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {item.verdict}
                        </span>
                        <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                          Analizza <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* ─── GUIDE IN EVIDENZA & EDITORIALE (E-E-A-T) ─── */}
            <section className="px-4 max-w-5xl mx-auto mb-16">
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-2">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200/80 px-3 py-1 text-xs font-bold text-blue-700 mb-2">
                    <BookOpen className="h-3.5 w-3.5" /> Guide &amp; Consigli Esperti
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Guide all&apos;acquisto e normative 2026</h2>
                  <p className="text-sm text-slate-600 font-medium">Approfondimenti tecnici, normative UE, consigli per trattare ed evitare truffe.</p>
                </div>
                <Link
                  href="/guide"
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 shrink-0"
                >
                  Tutte le 110+ guide <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {FEATURED_GUIDES.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/guide/${g.slug}`}
                    className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-blue-500 hover:shadow-md transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 border border-blue-100">
                          {g.tag}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                          <Clock className="w-3 h-3 text-blue-500" /> {g.readTime}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                        {g.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed mt-2 line-clamp-2">
                        {g.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                      <span>Leggi la guida</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-6 text-center">
                <Link
                  href="/guide"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 px-5 py-2.5 text-xs font-bold text-slate-800 transition-colors"
                >
                  <BookOpen className="h-4 w-4 text-blue-600" /> Esplora l&apos;archivio completo di oltre 110 guide pratiche <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </section>

            {/* ─── DOMANDE FREQUENTI ─── */}
            <section className="px-4 max-w-3xl mx-auto mb-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1 text-xs font-bold text-slate-700 mb-2">
                  <HelpCircle className="h-3.5 w-3.5" /> Domande frequenti
                </div>
                <h2 className="text-2xl font-black text-slate-900">Tutto quello che c&apos;è da sapere</h2>
              </div>

              <div className="space-y-3">
                {FAQS.map((faq) => (
                  <details key={faq.q} className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden group">
                    <summary className="p-4 sm:p-5 font-bold text-sm text-slate-900 cursor-pointer list-none flex items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors">
                      <span>{faq.q}</span>
                      <span className="text-slate-400 group-open:rotate-180 transition-transform font-bold text-base">↓</span>
                    </summary>
                    <p className="px-4 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
