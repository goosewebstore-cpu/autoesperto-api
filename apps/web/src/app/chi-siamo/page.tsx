import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BarChart3, Car, Database, Eye, ShieldCheck, Users } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';

export const metadata: Metadata = {
  title: 'Chi siamo — la nostra missione | AutoEsperto',
  description:
    'AutoEsperto aiuta chi compra o vende un\'auto usata con dati reali di mercato, analisi di affidabilità e stime trasparenti. Scopri la nostra missione e metodologia.',
  alternates: {
    canonical: `${siteUrl}/chi-siamo`,
    languages: { 'it-IT': `${siteUrl}/chi-siamo` },
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    title: 'Chi siamo — la nostra missione | AutoEsperto',
    description:
      'AutoEsperto aiuta chi compra o vende un\'auto usata con dati reali di mercato, analisi di affidabilità e stime trasparenti.',
    url: `${siteUrl}/chi-siamo`,
    siteName: 'AutoEsperto',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Chi siamo — AutoEsperto' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chi siamo — la nostra missione',
    description: 'AutoEsperto: dati reali per comprare e vendere auto usate.',
    images: ['/og-image.png'],
  },
};

const VALUES = [
  {
    icon: Database,
    title: 'Dati reali, non stime generiche',
    description:
      'I nostri prezzi arrivano dagli annunci di vendita effettivi, aggiornati quotidianamente. Non inventiamo numeri: li calcoliamo dal mercato.',
  },
  {
    icon: Eye,
    title: 'Trasparenza totale',
    description:
      'Ogni dato che mostriamo ha una fonte chiara. Spieghiamo sempre come arriviamo ai numeri e cosa significano per la tua decisione.',
  },
  {
    icon: ShieldCheck,
    title: 'Indipendenza',
    description:
      'Non siamo concessionari, non vendiamo auto. Il nostro unico obiettivo è darti informazioni utili per decidere meglio.',
  },
  {
    icon: Users,
    title: 'Accessibilità',
    description:
      'Tutti gli strumenti principali sono gratuiti e senza registrazione. Crediamo che informarsi prima di un acquisto importante sia un diritto, non un lusso.',
  },
];

const METHODOLOGY_STEPS = [
  {
    num: '1',
    title: 'Raccolta dati',
    description: 'Analizziamo quotidianamente migliaia di annunci reali in vendita in Italia per marca, modello e anno.',
  },
  {
    num: '2',
    title: 'Elaborazione',
    description:
      'Il nostro algoritmo calcola prezzo medio, range di mercato, tendenze di svalutazione e indicatori di affidabilità per ogni modello.',
  },
  {
    num: '3',
    title: 'Incrocio fonti',
    description:
      'Incrociamo i dati di prezzo con schede tecniche, richiami ufficiali (Safety Gate UE, NHTSA), problemi noti e costi di manutenzione.',
  },
  {
    num: '4',
    title: 'Verdetto',
    description:
      'Generiamo un report con punteggio su 100, verdetto chiaro (BUON AFFARE, TRATTA IL PREZZO, EVITALA) e checklist di controlli da fare.',
  },
];

function JsonLd() {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'Chi siamo — AutoEsperto',
      url: `${siteUrl}/chi-siamo`,
      description:
        'AutoEsperto aiuta chi compra o vende un\'auto usata con dati reali di mercato.',
      mainEntity: {
        '@type': 'Organization',
        name: 'AutoEsperto',
        url: siteUrl,
        logo: `${siteUrl}/icon-192.png`,
        description:
          'Strumenti gratuiti per valutare auto usate: prezzo di mercato, affidabilità, consumi e costi di riparazione.',
        foundingDate: '2026',
        knowsAbout: [
          'Valutazione auto usate',
          'Quotazioni auto',
          'Affidabilità auto',
          'Mercato auto usata Italia',
        ],
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
        { '@type': 'ListItem', position: 2, name: 'Chi siamo', item: `${siteUrl}/chi-siamo` },
      ],
    },
  ];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function ChiSiamoPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <JsonLd />

      <main className="max-w-3xl mx-auto px-5 pt-8 pb-20">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-text-tertiary mb-6">
          <ol className="inline-flex items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            </li>
            <li>/</li>
            <li>
              <span className="text-text-secondary font-medium">Chi siamo</span>
            </li>
          </ol>
        </nav>

        {/* Hero */}
        <header className="border-b border-border/60 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent-light px-3 py-1.5 text-xs font-bold text-accent mb-4">
            <Car className="h-3.5 w-3.5" />
            La nostra missione
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary leading-[1.15]">
            Aiutiamo chi compra e vende auto usate a decidere con dati reali.
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed mt-4">
            AutoEsperto nasce da un&apos;idea semplice: prima di comprare o vendere un&apos;auto usata,
            dovresti avere accesso alle stesse informazioni dei professionisti del settore. Noi rendiamo
            questi dati accessibili a tutti, gratis.
          </p>
        </header>

        {/* Valori */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-text-primary mb-6">I nostri valori</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-border bg-surface-2 p-5 transition-colors hover:border-accent/30"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent-light text-accent">
                    <value.icon className="h-4.5 w-4.5" />
                  </span>
                  <h3 className="text-sm font-bold text-text-primary">{value.title}</h3>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Metodologia */}
        <section className="mb-12">
          <div className="flex items-center gap-2.5 mb-2">
            <BarChart3 className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-bold text-text-primary">Come funziona la nostra valutazione</h2>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed mb-6">
            La nostra metodologia si basa su dati di mercato reali, non su listini teorici. Ecco i passaggi:
          </p>
          <div className="space-y-4">
            {METHODOLOGY_STEPS.map((step) => (
              <div
                key={step.num}
                className="flex gap-4 rounded-xl border border-border bg-white p-4"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent text-white text-sm font-bold">
                  {step.num}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-text-primary">{step.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed mt-1">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Fonte dei dati */}
        <section className="mb-12 rounded-2xl bg-surface-2 border border-border p-6">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2 mb-3">
            <Database className="h-5 w-5 text-accent" />
            Da dove arrivano i dati
          </h2>
          <div className="text-sm text-text-secondary leading-relaxed space-y-3">
            <p>
              I prezzi di mercato sono calcolati analizzando gli annunci di vendita reali pubblicati sulle
              principali piattaforme italiane. Non usiamo listini del nuovo scontati né valutazioni
              soggettive.
            </p>
            <p>
              I dati di affidabilità provengono dall&apos;incrocio di banche dati di richiami ufficiali
              (Safety Gate UE, NHTSA), report di associazioni consumatori e analisi aggregate di
              problemi noti segnalati dagli utenti.
            </p>
            <p>
              I costi di riparazione sono stime indicative basate su medie nazionali per tipologia di
              intervento, ricambio e manodopera, e non sostituiscono un preventivo di un&apos;officina.
            </p>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="mb-12 rounded-2xl bg-warning-light border border-warning/20 p-6">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2 mb-3">
            <ShieldCheck className="h-5 w-5 text-warning" />
            Avvertenze importanti
          </h2>
          <div className="text-sm text-text-secondary leading-relaxed space-y-3">
            <p>
              Le stime di AutoEsperto sono <strong>indicative</strong> e basate sui dati di mercato
              disponibili al momento dell&apos;analisi. Non costituiscono una perizia professionale né
              un&apos;offerta commerciale.
            </p>
            <p>
              <strong>Danni nascosti, problemi meccanici e difetti non visibili</strong> richiedono
              sempre un controllo da parte di un meccanico qualificato o un&apos;ispezione professionale
              prima dell&apos;acquisto.
            </p>
            <p>
              AutoEsperto non vende auto, non è un concessionario e non è affiliato a nessun venditore.
              Il servizio è fornito a scopo informativo ai sensi dell&apos;art. 21 della Costituzione
              italiana e nel rispetto del D.Lgs. 206/2005 (Codice del Consumo).
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl bg-accent-light border border-accent/20 p-6 text-center">
          <h2 className="text-lg font-bold text-text-primary">Prova lo strumento gratuito</h2>
          <p className="text-sm text-text-secondary mt-2">
            Analizza un&apos;auto usata in pochi secondi: prezzo di mercato, affidabilità e cosa
            controllare prima di comprarla.
          </p>
          <Link
            href="/#scanner-section"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-accent/20 hover:bg-accent-hover transition-colors"
          >
            Analizza un&apos;auto gratis <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
