'use client';

import { Suspense, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Camera,
  Car,
  Check,
  ChevronDown,
  Clock,
  FileText,
  Gauge,
  MessageCircle,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-react';
import VehicleScanner from '@/components/VehicleScanner';
import PricingPlans from '@/components/PricingPlans';
import ReportErrorBoundary from '@/components/ReportErrorBoundary';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { type AnalyzePayload } from '@/lib/api';

/* ── Configurazione Posizioni Guide (Centralizzata in src/config/guides-positions.ts) ── */
import HomeGuideFeed, { type HomeGuideItem } from '@/components/HomeGuideFeed';

/* ── App Shortcuts: I 6 bottoni strumento principali con colori originali ── */
const APP_TOOLS = [
  {
    id: 'advisor',
    title: 'Car Advisor',
    desc: 'Chiedi: "La compreresti?" o consigli personalizzati su budget e modelli.',
    href: '/ai-car-advisor',
    icon: MessageCircle,
    color: 'text-blue-700 bg-blue-50 border-blue-100 hover:bg-blue-100/70',
    tag: 'Consulente AutoEsperto',
  },
  {
    id: 'targa',
    title: 'Verifica Targa',
    desc: 'Informazioni disponibili per targa e collegamenti alle verifiche ufficiali.',
    href: '/verifica-targa',
    icon: Search,
    color: 'text-blue-700 bg-blue-50 border-blue-100 hover:bg-blue-100/70',
    tag: 'Verifiche disponibili',
  },
  {
    id: 'motori',
    title: 'Difetti Motori',
    desc: 'Problemi cronici, richiami ufficiali ministeriali e affidabilità modello.',
    href: '/motori-problemi',
    icon: Wrench,
    color: 'text-blue-700 bg-blue-50 border-blue-100 hover:bg-blue-100/70',
    tag: 'Guasti Noti',
  },
  {
    id: 'passaggio',
    title: 'Passaggio Proprietà',
    desc: 'Calcolo IPT esatto provincia per provincia, emolumenti e marca da bollo.',
    href: '/passaggio-proprieta',
    icon: FileText,
    color: 'text-blue-700 bg-blue-50 border-blue-100 hover:bg-blue-100/70',
    tag: 'Calcolo IPT',
  },
  {
    id: 'confronta',
    title: 'Confronta Auto',
    desc: 'Metti a confronto 2 o più modelli con TCO, consumi e costi annui.',
    href: '/confronta',
    icon: Scale,
    color: 'text-blue-700 bg-blue-50 border-blue-100 hover:bg-blue-100/70',
    tag: 'Fino a 4 auto',
  },
  {
    id: 'vendi',
    title: 'Quanto vale la mia?',
    desc: 'Stima del valore reale per vendere o permutare al prezzo giusto.',
    href: '/vendi',
    icon: Gauge,
    color: 'text-blue-700 bg-blue-50 border-blue-100 hover:bg-blue-100/70',
    tag: 'Stima Vendita',
  },
];

/* ── FAQ con trasparenza su analisi locale AutoEsperto ── */
const FAQS = [
  {
    q: 'Quanto costa analizzare un’auto?',
    a: 'L’anteprima è gratuita. Se vuoi approfondire, un report completo costa 1,99 €; a 4,99 € acquisti 3 report e ne ricevi 1 in omaggio. Sono pagamenti una tantum, senza rinnovo.',
  },
  {
    q: 'Come fa l’analisi di AutoEsperto a capire se un annuncio è un buon affare?',
    a: 'AutoEsperto combina i dati del veicolo con stime di valore, informazioni su affidabilità e costi disponibili. Il risultato è indicativo e va verificato insieme alle condizioni reali dell’auto.',
  },
  {
    q: 'Cosa posso caricare nello Scanner di AutoEsperto?',
    a: 'Puoi caricare foto dell’auto, screenshot di annunci da smartphone (es. da Subito.it, AutoScout24 o Facebook Marketplace) o scattare una foto direttamente dalla fotocamera per l\'analisi visiva locale.',
  },
  {
    q: 'I miei dati o il mio numero di telefono vengono ceduti a concessionari?',
    a: 'Assolutamente no. AutoEsperto è una piattaforma 100% indipendente. Non chiediamo il tuo numero di telefono, non ti chiamerà nessun venditore e non abbiamo accordi commerciali per favorire specifiche auto.',
  },
  {
    q: 'Cosa contiene il report generato dall’analisi di AutoEsperto?',
    a: 'Prezzo stimato di mercato, verdetto netto (BUON AFFARE, TRATTA IL PREZZO o EVITALA), Vehicle Health Score, calcolo del bollo regionale, consumi reali su strada e checklist di domande da fare al venditore.',
  },
];

export interface HomeClientProps {
  stats: { makes: number; models: number };
  homeGuides?: HomeGuideItem[];
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

export default function HomeClient({ stats, homeGuides = [] }: HomeClientProps) {
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
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      <Suspense fallback={null}>
        <PrefillHandler onPrefill={handlePrefill} />
      </Suspense>

      <SiteHeader />

      <main className="pb-20 relative">
        {/* ─── HERO DESKTOP BACKGROUND CON AUTO EUROPEE ─── */}
        {!isShowingResult && (
          <div className="relative overflow-hidden pt-4 pb-4 sm:pt-14 sm:pb-10">
            {/* Sfondo con auto europee (visibile con eleganza su desktop) */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/cars/segment-berlina.jpg"
                alt="Auto europee sfondo"
                className="w-full h-full object-cover object-top opacity-10 lg:opacity-15 filter blur-[0.5px] scale-105 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-50/80 via-slate-50/95 to-slate-50" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />
            </div>

            {/* ─── APP HERO (Ottimizzato per PC Desktop & Mobile) ─── */}
            <section className="relative z-10 px-4 sm:px-6 text-center max-w-3xl lg:max-w-6xl xl:max-w-[1440px] mx-auto">
              <h1 className="text-2xl sm:text-[2.85rem] lg:text-5xl xl:text-[3.25rem] font-extrabold tracking-tight text-slate-950 leading-[1.12]">
                Stai per comprare un&apos;auto usata?
                <span className="text-blue-600 block sm:inline"> Scopri se il prezzo conviene</span>
              </h1>

              <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
                Valuta gratis per modello, oppure usa foto e annunci con AutoEsperto AI. Scopri una fascia di prezzo indicativa e i controlli da fare.
              </p>

              <div className="mt-5 hidden sm:flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" aria-hidden="true" /> Modello sempre gratuito</span>
                <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-blue-600" aria-hidden="true" /> Anteprima gratuita da foto e annunci</span>
              </div>
            </section>
          </div>
        )}

        {/* ─── SCANNER AUTOESPERTO (Strumento #1 - Espanso su Desktop) ─── */}
        <section className="px-4 sm:px-6 max-w-4xl lg:max-w-6xl xl:max-w-[1440px] mx-auto mb-16 relative z-10" id="scanner-section">
          <div className="bg-white rounded-3xl p-0 sm:p-5 lg:p-6 border border-slate-200/90 shadow-xl lg:shadow-2xl shadow-slate-900/[0.06]">
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

            {/* ─── ANTEPRIMA VISIVA: "Ecco cosa scopri con l'analisi" (Wider on PC) ─── */}
            <section className="px-4 sm:px-6 max-w-5xl lg:max-w-[1440px] mx-auto mb-20">
              <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
                
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 relative z-10">
                  <div className="space-y-4 max-w-xl text-center lg:text-left">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
                      <Sparkles className="w-3.5 h-3.5" /> Esempio illustrativo · dati dimostrativi
                    </span>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                      Prezzo, punti da verificare e consigli per trattare.
                    </h2>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                      Una stima del prezzo, i controlli da approfondire e gli elementi utili per parlare con il venditore.
                    </p>
                    <div className="pt-3">
                      <a
                        href="#scanner-section"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg hover:shadow-blue-500/25 transition-all"
                      >
                        <Camera className="w-4 h-4" /> Valuta il tuo modello gratis ↑
                      </a>
                    </div>
                  </div>

                  {/* Mockup Card Report Fiat Panda */}
                  <div className="w-full lg:w-96 bg-white/95 backdrop-blur-sm rounded-2xl p-5 text-slate-900 shadow-2xl border border-white/20 shrink-0">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Analisi Veicolo</div>
                        <div className="text-sm font-black text-slate-900">Fiat Panda 1.2 Lounge</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> BUON AFFARE
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs sm:text-sm">
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-500">Punteggio indicativo:</span>
                        <span className="font-extrabold text-blue-600">86 / 100</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-500">Valore indicativo:</span>
                        <span className="font-bold text-slate-900">€ 8.900 <span className="text-emerald-600 font-semibold text-[11px]">(-€900)</span></span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-500">Bollo annuale:</span>
                        <span className="font-semibold text-slate-800">€ 152 / anno</span>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3 mt-3">
                        <div className="flex items-center gap-2 font-semibold text-slate-800"><Wrench className="h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" /> Controlli da fare</div>
                        <p className="mt-1 text-slate-600 leading-relaxed">Tagliandi, freni e pneumatici</p>
                        <p className="mt-2 text-[11px] leading-relaxed text-slate-500">Le condizioni meccaniche richiedono una verifica in officina.</p>
                      </div>
                    </div>

                    <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 font-medium">
                      <span>✓ Consumi reali: 17,2 km/l</span>
                      <span className="text-blue-600 font-bold">Valutazione per modello</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <PricingPlans />

            {/* ─── COME FUNZIONA L'ANALISI (3 Step Espansi per Desktop) ─── */}
            <section className="px-4 sm:px-6 max-w-5xl lg:max-w-6xl mx-auto mb-20">
              <div className="text-center max-w-xl mx-auto mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Come funziona, in 3 passaggi
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-2">
                  Dai dati dell’auto a una valutazione più chiara.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {[
                  { title: 'Inserisci i dati dell’auto', text: 'Scegli il modello, carica una foto o incolla un annuncio. Conferma anno, chilometri e prezzo.', image: '/images/ui/scanner-inspection.webp' },
                  { title: 'Scopri prezzo e criticità', text: 'Consulta la fascia di valore e i controlli consigliati prima di decidere.', image: '/images/guide/analisi-auto-report-comprare-vendere.jpg' },
                  { title: 'Approfondisci quando vuoi', text: 'Apri i dettagli che ti servono, prepara la visita e porta con te il PDF.', image: '/images/guide/documenti-controllare-prima-comprare-auto-privato.jpg' },
                ].map((step,index)=><article key={step.title} className="relative isolate flex min-h-[360px] flex-col justify-end overflow-hidden rounded-2xl bg-slate-900 p-6 text-left sm:p-7">
                  <img src={step.image} alt="" loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover"/>
                  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/10"/>
                  <span className="absolute left-6 top-6 grid h-10 w-10 place-items-center rounded-xl border border-white/30 bg-white/15 text-sm font-bold text-white backdrop-blur-sm">0{index+1}</span>
                  <h3 className="text-lg font-bold leading-snug text-white">{step.title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-100">{step.text}</p>
                </article>)}
              </div>
            </section>

            <section className="mx-auto mb-14 max-w-[1440px] px-4 sm:px-6" aria-labelledby="quick-tools-title">
              <h2 id="quick-tools-title" className="mb-4 text-lg font-bold text-slate-900">Altri strumenti utili</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { href: '/confronta', title: 'Confronta auto', description: 'Modelli, consumi e costi', icon: Scale },
                  { href: '/verifica-targa', title: 'Verifica targa', description: 'Dati e verifiche disponibili', icon: Search },
                  { href: '/calcolo-bollo', title: 'Calcolo bollo', description: 'Stima la tassa annuale', icon: Gauge },
                ].map((tool) => (
                  <Link key={tool.href} href={tool.href} className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600"><tool.icon className="h-5 w-5" aria-hidden="true" /></span>
                    <span className="min-w-0 flex-1"><span className="block text-sm font-bold text-slate-900">{tool.title}</span><span className="mt-0.5 block text-xs leading-relaxed text-slate-500">{tool.description}</span></span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-blue-600" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </section>
            <HomeGuideFeed items={homeGuides} />

            {/* ─── FAQ (Spaziose e centrate) ─── */}
            <section className="px-4 sm:px-6 max-w-4xl lg:max-w-6xl xl:max-w-[1440px] mx-auto mb-16">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Domande Frequenti
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Tutto ciò che c&apos;è da sapere su AutoEsperto e sull&apos;analisi locale del mercato usato.
                </p>
              </div>

              <div className="space-y-3">
                {FAQS.map((faq) => (
                  <details key={faq.q} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden group shadow-xs hover:border-slate-300 transition-colors">
                    <summary className="p-4 sm:p-5 font-bold text-sm sm:text-base text-slate-900 cursor-pointer list-none flex items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors">
                      <span>{faq.q}</span>
                      <ChevronDown className="h-4 w-4 text-slate-400 group-open:rotate-180 transition-transform shrink-0" />
                    </summary>
                    <p className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
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
