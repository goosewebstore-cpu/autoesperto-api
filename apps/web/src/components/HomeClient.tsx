'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  BarChart3,
  Camera,
  Check,
  ChevronRight,
  Fuel,
  Gauge,
  ScanSearch,
  ShieldAlert,
  Tag,
} from 'lucide-react';
import VehicleScanner from '@/components/VehicleScanner';
import SiteHeader from '@/components/SiteHeader';
import BuyVerdictCard, { type VerdictData } from '@/components/BuyVerdictCard';
import { trackEvent } from '@/lib/analytics';
import { type AnalyzePayload } from '@/lib/api';

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

const EXAMPLE_VERDICT: VerdictData = {
  label: 'BUON AFFARE',
  tone: 'good',
  score: 82,
  requestedPrice: 17900,
  estimated: 17500,
  min: 16800,
  max: 18200,
  percent: 2.3,
  checks: ['Pneumatici', 'Frizione', 'Manutenzione', 'Carrozzeria'],
  recommendedPrice: 17000,
  negotiationMin: 16500,
  negotiationMax: 17000,
  finalVerdict: 'La comprerei, ma proverei a trattare il prezzo.',
};

const BENEFITS = [
  {
    icon: Gauge,
    title: 'Valore',
    desc: 'Scopri quanto vale davvero l\u2019auto che stai guardando, con una fascia di mercato stimata sugli annunci reali.',
  },
  {
    icon: Tag,
    title: 'Prezzo',
    desc: 'Confronta il prezzo richiesto con il valore di mercato e scopri se è un buon affare, caro o nella norma.',
  },
  {
    icon: ShieldAlert,
    title: 'Rischi',
    desc: 'Punti deboli del modello, problemi noti e i controlli da fare prima di firmare qualsiasi cosa.',
  },
  {
    icon: Fuel,
    title: 'Costi',
    desc: 'Consumi reali, manutenzione e riparazioni medie: quanto ti costerà tenerla, non solo comprarla.',
  },
];

const HOW_IT_WORKS = [
  {
    num: '1',
    icon: Camera,
    title: 'Inserisci i dati dell\u2019auto',
    desc: 'Marca, modello, anno e chilometraggio. Oppure una foto: riconosciamo noi il veicolo.',
  },
  {
    num: '2',
    icon: BarChart3,
    title: 'La confrontiamo con il mercato',
    desc: 'Incrociamo gli annunci reali in vendita, le schede tecniche e i problemi noti del modello.',
  },
  {
    num: '3',
    icon: Check,
    title: 'Ricevi il verdetto',
    desc: 'BUON AFFARE, TRATTA o EVITALA: punteggio, differenza rispetto al mercato e cosa controllare.',
  },
];

const FAQS = [
  {
    q: '\u00C8 gratis analizzare un\u2019auto?',
    a: 'S\u00EC: l\u2019analisi completa \u00E8 sempre gratuita, senza account e senza limiti. Nessun pagamento, nessun abbonamento. Un account gratuito serve solo se vuoi salvare le analisi e ritrovarle quando vuoi.',
  },
  {
    q: 'Da dove vengono i dati?',
    a: 'Dagli annunci reali in vendita in Italia, incrociati con le schede tecniche, i richiami ufficiali e i costi di manutenzione medi del modello.',
  },
  {
    q: 'Cosa mi dice il verdetto?',
    a: 'Se l\u2019auto \u00E8 un buon affare, se conviene trattare il prezzo o evitarla. Ricevi un punteggio su 100, la differenza rispetto al valore di mercato, i controlli da fare e l\u2019obiettivo di trattativa.',
  },
  {
    q: 'Il riconoscimento da foto \u00E8 affidabile?',
    a: 'Per i modelli pi\u00F9 comuni s\u00EC. Caricare pi\u00F9 foto (frontale, laterale, posteriore) migliora la precisione. Se non \u00E8 sicuro, ti chiediamo di inserire marca e modello a mano. La foto non viene salvata.',
  },
  {
    q: 'Devo registrarmi per analizzare un\u2019auto?',
    a: 'No. Puoi analizzare subito, senza registrazione. Un account gratuito ti permette solo di salvare le analisi e ritrovarle in un secondo momento.',
  },
  {
    q: 'Salvate le mie foto?',
    a: 'No: salviamo solo il report con i dati e le valutazioni. La fotografia originale non viene conservata.',
  },
];

export default function HomeClient({ stats }: HomeClientProps) {
  const [initialPayload, setInitialPayload] = useState<AnalyzePayload | null>(null);

  const handlePrefill = (payload: AnalyzePayload) => {
    setInitialPayload(payload);
  };

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={null}>
        <PrefillHandler onPrefill={handlePrefill} />
      </Suspense>

      <SiteHeader />

      <main>
        {/* ─── HERO ─── */}
        <section className="hero-v2">
          <div className="hero-v2-inner">
            <div className="hero-v2-kicker"><ScanSearch className="h-3.5 w-3.5" /> Compreresti questa auto?</div>
            <h1 className="hero-v2-title">
              Hai trovato un&apos;auto usata?
              <br />
              <em>Scopri se vale davvero</em> quello che chiedono.
            </h1>
            <p className="hero-v2-sub">
              Analizza prezzo, valore, problemi e costi prima di comprarla. Verdetto in pochi secondi: BUON AFFARE, TRATTA o EVITALA.
            </p>
            <div className="home-hero-actions">
              <a href="#scanner-section" className="home-hero-cta" onClick={() => trackEvent('search_car', { feature: 'hero_cta' })}>
                Analizza un&apos;auto <ChevronRight className="h-4 w-4" />
              </a>
            </div>
            <p className="home-micro-steps">
              Analisi completa gratuita · Nessuna registrazione richiesta · Salvataggio con account gratuito
            </p>
          </div>
        </section>

        {/* ─── FORM / SCANNER ─── */}
        <section className="search-v2" id="scanner-section" aria-label="Analizza un'auto">
          <VehicleScanner embedded initialPayload={initialPayload ?? undefined} />
          <ul className="search-v2-trust">
            <li><Check /> Analisi completa sempre gratuita</li>
            <li><Check /> Più foto per un riconoscimento più preciso</li>
            <li><Check /> Dati da {stats.makes} marchi e {stats.models.toLocaleString('it-IT')} modelli</li>
          </ul>
        </section>

        {/* ─── MINI ESEMPIO ─── */}
        <section className="v2-section" id="esempio" aria-label="Esempio di verdetto">
          <div className="home-v2-wrap">
            <div className="home-section-head">
              <h2>Compreresti questa auto?</h2>
              <p>Esempio di verdetto: BMW Serie 1, 2018, 85.000 km.</p>
            </div>
            <div className="mx-auto max-w-3xl">
              <BuyVerdictCard verdict={EXAMPLE_VERDICT} />
              <p className="mt-3 text-center text-xs font-semibold text-slate-400">
                Esempio illustrativo. Prova con la tua auto sopra <ChevronRight className="inline h-3.5 w-3.5" />
              </p>
            </div>
          </div>
        </section>

        {/* ─── 4 BENEFICI ─── */}
        <section className="v2-section" aria-label="Cosa ottieni">
          <div className="home-v2-wrap">
            <div className="home-section-head">
              <h2>Prima di decidere, guarda tutto</h2>
              <p>Non solo il prezzo: tutta la verit\u00E0 su quell\u2019esemplare.</p>
            </div>
            <div className="home-benefits-grid">
              {BENEFITS.map((benefit) => (
                <article key={benefit.title} className="home-benefit-card">
                  <span className="home-benefit-icon"><benefit.icon className="h-5 w-5" /></span>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ─── COME FUNZIONA ─── */}
        <section className="v2-section" id="come-funziona" aria-label="Come funziona">
          <div className="home-v2-wrap">
            <div className="home-section-head">
              <h2>Come funziona</h2>
              <p>Tre passi, pochi secondi.</p>
            </div>
            <div className="home-how-grid">
              {HOW_IT_WORKS.map((step) => (
                <div key={step.num} className="home-how-card">
                  <span className="home-how-num">{step.num}</span>
                  <step.icon className="home-how-icon" />
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA BAND ─── */}
        <section className="cta-band-v2" aria-label="Inizia ora">
          <div className="cta-band-v2-inner">
            <h2>Hai trovato un&apos;auto?</h2>
            <p>Verifica se \u00E8 un buon affare prima di comprarla.</p>
            <div className="cta-band-v2-actions">
              <a href="#scanner-section" className="home-hero-cta" onClick={() => trackEvent('search_car', { feature: 'cta_band' })}>
                Analizza un&apos;auto <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section className="v2-section" aria-label="Domande frequenti">
          <div className="home-v2-wrap">
            <div className="home-section-head">
              <h2>Domande frequenti</h2>
            </div>
            <div className="home-faq">
              {FAQS.map((faq) => (
                <details key={faq.q} className="home-faq-item">
                  <summary>{faq.q}</summary>
                  <p>{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
