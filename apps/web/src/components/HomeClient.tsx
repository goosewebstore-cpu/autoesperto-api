'use client';

import { Suspense, useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowRight,
  Camera,
  Check,
  ChevronDown,
  Clock,
  Gauge,
  TrendingUp,
} from 'lucide-react';
import VehicleScanner from '@/components/VehicleScanner';
import ReportErrorBoundary from '@/components/ReportErrorBoundary';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { trackEvent } from '@/lib/analytics';
import { type AnalyzePayload } from '@/lib/api';

/* ── Guide in evidenza (max 3) ── */
const FEATURED_GUIDES = [
  {
    slug: 'auto-usata-10-segnali-problema-annuncio',
    title: 'Auto usata: 10 segnali che l\u2019annuncio nasconde un problema',
    tag: 'Controllo Annuncio',
    readTime: '6 min',
  },
  {
    slug: 'come-controllare-annuncio-auto-usata',
    title: 'Come analizzare un annuncio di auto usata ed evitare truffe',
    tag: 'Guida Acquisto',
    readTime: '7 min',
  },
  {
    slug: 'come-capire-se-auto-usata-e-affare',
    title: 'Come capire se un\u2019auto usata \u00e8 un affare: 5 dati chiave',
    tag: 'Valutazione',
    readTime: '6 min',
  },
];

/* ── FAQ ── */
const FAQS = [
  {
    q: '\u00c8 davvero gratuito?',
    a: 'S\u00ec, l\u2019analisi \u00e8 100\u0025 gratuita e non richiede alcuna registrazione.',
  },
  {
    q: 'Come viene calcolato il verdetto?',
    a: 'Incrociamo gli annunci di vendita reali in Italia con lo storico dell\u2019affidabilit\u00e0 del modello, i costi di riparazione e la svalutazione per calcolare uno score oggettivo.',
  },
  {
    q: 'Come funziona il riconoscimento da foto?',
    a: 'L\u2019IA riconosce marca, modello e segmento dell\u2019auto dalla foto in pochi secondi. Se la foto non \u00e8 nitida, puoi sempre selezionarli a mano.',
  },
  {
    q: 'Cosa contiene il report?',
    a: 'Prezzo stimato di mercato, verdetto (BUON AFFARE / TRATTA IL PREZZO / EVITALA), Vehicle Health Score, stima del bollo, consumi reali e checklist pre-acquisto.',
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
          <section className="pt-10 sm:pt-14 pb-8 px-4 text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-[2.75rem] font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Quanto vale davvero
              <span className="text-blue-600"> quell&apos;auto usata?</span>
            </h1>

            <p className="mt-4 text-base text-slate-500 font-medium max-w-xl mx-auto">
              Prezzo reale, affidabilità e problemi noti in pochi secondi.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] font-semibold text-slate-500">
              <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" /> Gratis</span>
              <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" /> Senza registrazione</span>
              <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" /> Risultato immediato</span>
            </div>
          </section>
        )}

        {/* ─── SCANNER ─── */}
        <section className="px-4 max-w-5xl mx-auto mb-14" id="scanner-section">
          <div className="bg-white rounded-2xl p-4 sm:p-8 border border-slate-200/80 shadow-lg shadow-slate-900/[0.04]">
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
            {/* ─── COME FUNZIONA (3 step) ─── */}
            <section className="px-4 max-w-4xl mx-auto mb-16">
              <h2 className="text-center text-xl sm:text-2xl font-bold text-slate-900 mb-8">
                Come funziona
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 grid place-items-center mx-auto mb-3">
                    <Camera className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Inserisci l&apos;auto</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Carica una foto, incolla un link o seleziona marca e modello.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 grid place-items-center mx-auto mb-3">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Analisi in tempo reale</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Incrociamo annunci reali, difetti noti e costi di gestione.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 grid place-items-center mx-auto mb-3">
                    <Gauge className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Verdetto chiaro</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Score 0-100, prezzo di mercato, bollo e checklist pre-acquisto.
                  </p>
                </div>
              </div>
            </section>

            {/* ─── GUIDE IN EVIDENZA ─── */}
            <section className="px-4 max-w-4xl mx-auto mb-16">
              <div className="flex items-end justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Guide utili</h2>
                <Link
                  href="/guide"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                >
                  Tutte le guide <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>


            </section>

            {/* ─── FAQ ─── */}
            <section className="px-4 max-w-3xl mx-auto mb-14">
              <h2 className="text-center text-xl sm:text-2xl font-bold text-slate-900 mb-6">
                Domande frequenti
              </h2>

              <div className="space-y-2">
                {FAQS.map((faq) => (
                  <details key={faq.q} className="bg-white rounded-xl border border-slate-200/80 overflow-hidden group">
                    <summary className="p-4 font-semibold text-sm text-slate-900 cursor-pointer list-none flex items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors">
                      <span>{faq.q}</span>
                      <ChevronDown className="h-4 w-4 text-slate-400 group-open:rotate-180 transition-transform shrink-0" />
                    </summary>
                    <p className="px-4 pb-4 pt-0 text-sm text-slate-500 leading-relaxed border-t border-slate-100">
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
