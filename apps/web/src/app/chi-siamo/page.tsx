import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BarChart3, Car, Database, Eye, ShieldCheck, User } from 'lucide-react';
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
    title: 'Stime con fonti e limiti visibili',
    description:
      'Quando sono disponibili annunci comparabili, li usiamo per orientare la stima. Se il campione è insufficiente, il report indica un valore algoritmico orientativo. I prezzi richiesti non sono prezzi di vendita conclusa.',
  },
  {
    icon: Eye,
    title: 'Trasparenza totale',
    description:
      'Distinguiamo i dati inseriti dall’utente, gli annunci disponibili e le stime. Un dato mancante o un campione ridotto non rappresentano una verifica positiva.',
  },
  {
    icon: ShieldCheck,
    title: 'Indipendenza editoriale',
    description:
      'Non siamo concessionari, non vendiamo auto e non accettiamo compensi per alterare i verdetti. Il nostro unico obiettivo è darti informazioni oggettive per decidere meglio.',
  },
  {
    icon: User,
    title: 'Prima prova e prezzi trasparenti',
    description:
      'Puoi ottenere un’anteprima gratuita partendo da modello, foto o annuncio. Il report completo costa 1,99 €; il pacchetto da 4,99 € comprende 3 report acquistati e 1 in omaggio. AutoEsperto PRO offre 30 report + 3 omaggio per ciclo a 29,99 €/mese.',
  },
];

const METHODOLOGY_STEPS = [
  {
    num: '1',
    title: 'Raccolta e Normalizzazione Dati',
    description: 'Partiamo da marca, modello, anno, chilometri e alimentazione confermati dall’utente. Quando disponibili, selezioniamo annunci confrontabili per orientare la stima.',
  },
  {
    num: '2',
    title: 'Pulizia Statistica Outlier (IQR)',
    description:
      'Applichiamo filtri statistici avanzati (Interquartile Range) per escludere prezzi fuori scala, calcolando la mediana reale, il range minimo-massimo e la svalutazione anno per anno.',
  },
  {
    num: '3',
    title: 'Informazioni sul modello e verifiche separate',
    description:
      'Le informazioni sui difetti noti riguardano il modello e non certificano lo stato del singolo veicolo. Revisioni, chilometraggio documentato e storico incidenti richiedono verifiche specifiche su fonti esterne.',
  },
  {
    num: '4',
    title: 'Verdetto Trasparente e Checklist',
    description:
      'Generiamo il report con Vehicle Health Score (0-100), verdetto immediato (BUON AFFARE, TRATTA IL PREZZO, EVITALA) e la checklist personalizzata di controlli tecnici da eseguire prima dell\'acquisto.',
  },
];

function JsonLd() {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'AutoEsperto',
      alternateName: 'AutoEsperto.it',
      url: siteUrl,
      logo: `${siteUrl}/icon-192.png`,
      image: `${siteUrl}/og-image.png`,
      description:
        'Piattaforma tecnologica indipendente per la valutazione, il controllo pre-acquisto e il passaporto digitale delle auto usate in Italia con dati reali di mercato.',
      email: 'goosewebstore@gmail.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Siracusa',
        addressRegion: 'SR',
        postalCode: '96100',
        addressCountry: 'IT',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: 'goosewebstore@gmail.com',
        availableLanguage: ['Italian'],
      },
      founder: {
        '@type': 'Person',
        name: 'Ralfh',
        jobTitle: 'Fondatore & Sviluppatore Freelance',
      },
      sameAs: [
        'https://www.instagram.com/autoesperto_it',
        'https://tiktok.com/@autoesperto',
      ],
      knowsAbout: [
        'Valutazione auto usate',
        'Quotazioni auto di mercato reale',
        'Affidabilità e diagnostica guasti motori',
        'Passaporto Digitale del Veicolo',
        'Mercato auto usata Italia',
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'Chi siamo — AutoEsperto',
      url: `${siteUrl}/chi-siamo`,
      description:
        'AutoEsperto aiuta chi compra o vende un\'auto usata con dati reali di mercato, analisi di affidabilità e trasparenza metodologica.',
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
            la valutazione per modello gratuita e le funzioni AI con un abbonamento dal prezzo visibile prima dell’attivazione.
          </p>
        </header>

        {/* Valori */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-text-primary mb-6">I nostri principi guida</h2>
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

        {/* Fondatore */}
        <section className="mb-12">
          <div className="flex items-center gap-2.5 mb-2">
            <User className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-bold text-text-primary">Fondatore &amp; Sviluppatore</h2>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed mb-6">
            AutoEsperto non è una grande azienda né una concessionaria, ma un progetto tecnologico indipendente sviluppato e curato da un professionista freelance:
          </p>
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm hover:border-accent/30 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-accent text-white font-black text-xl shadow-md shadow-accent/20">
                R
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-primary">Ralfh</h3>
                <p className="text-xs font-semibold text-accent mt-0.5">Fondatore &amp; Sviluppatore Freelance</p>
                <p className="text-sm text-text-secondary leading-relaxed mt-2.5">
                  Professionista freelance e ideatore di AutoEsperto. Ho sviluppato questa piattaforma in totale autonomia per offrire a chi compra o vende un&apos;auto usata in Italia uno strumento accessibile, neutrale e basato su dati reali di mercato, senza legami commerciali con concessionari o intermediari.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <Link
                    href="/guide/autoesperto-freelance-siciliano-dati-reali-mercato-usato"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <span>Leggi l&apos;articolo di presentazione: la storia di AutoEsperto</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Metodologia */}
        <section className="mb-12">
          <div className="flex items-center gap-2.5 mb-2">
            <BarChart3 className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-bold text-text-primary">Come funziona la nostra valutazione</h2>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed mb-6">
            La nostra metodologia si basa su dati di mercato reali, non su listini teorici. Ecco le fasi del processo analitico:
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
            Fonti, stime e limiti
          </h2>
          <div className="text-sm text-text-secondary leading-relaxed space-y-3">
            <p>
              <strong>Prezzi di mercato:</strong> stimati con i dati del veicolo e gli eventuali annunci disponibili. Il report mostra il campione e la data di rilevazione quando presenti; senza confronti adeguati la stima resta algoritmica.
            </p>
            <p>
              <strong>Affidabilità e richiami ufficiali:</strong> le informazioni generali sul modello aiutano a preparare le domande al venditore. La presenza o assenza di richiami sul singolo veicolo va verificata tramite VIN presso il costruttore.
            </p>
            <p>
              <strong>Passaporto Digitale del Veicolo:</strong> raccoglie le informazioni e i documenti caricati dall’utente. Non certifica i chilometri reali, lo stato della batteria o la conformità a un regolamento europeo.
            </p>
          </div>
        </section>

        {/* Dati e Trasparenza Legale */}
        <section className="mb-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-bold text-text-primary mb-3">Dati del progetto e trasparenza legale</h2>
          <div className="text-xs text-text-secondary leading-relaxed space-y-1.5">
            <p><strong>Piattaforma:</strong> AutoEsperto.it — Servizio di analisi e quotazione auto usate</p>
            <p><strong>Titolare &amp; Gestione:</strong> Ralfh (Sviluppatore Freelance — Progetto indipendente non societario)</p>
            <p><strong>Sede:</strong> Siracusa (SR) · Italia</p>
            <p><strong>Email generale:</strong> goosewebstore@gmail.com · <strong>Partner e investitori:</strong> ralfhjavier@gmail.com</p>
            <p><strong>Conformità normativa:</strong> Operante ai sensi dell&apos;art. 21 Cost. e del D.Lgs. 206/2005 (Codice del Consumo).</p>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="mb-12 rounded-2xl bg-amber-50 border border-amber-200/80 p-6">
          <h2 className="text-lg font-bold text-amber-900 flex items-center gap-2 mb-3">
            <ShieldCheck className="h-5 w-5 text-amber-700" />
            Avvertenze importanti per l&apos;utente
          </h2>
          <div className="text-sm text-amber-900/80 leading-relaxed space-y-3">
            <p>
              Le stime fornite da AutoEsperto sono <strong>indicative</strong> e calcolate sui dati di mercato disponibili al momento dell&apos;analisi. Non costituiscono una perizia asseverata né un&apos;offerta vincolante di compravendita.
            </p>
            <p>
              <strong>Controlli in officina:</strong> prima di concludere qualsiasi contratto di acquisto o versare caparre, raccomandiamo sempre di far ispezionare il veicolo sul ponte da un meccanico qualificato o perito indipendente per verificare assenza di danni strutturali o usure occulte.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl bg-accent-light border border-accent/20 p-6 text-center">
          <h2 className="text-lg font-bold text-text-primary">Valuta per modello, gratis</h2>
          <p className="text-sm text-text-secondary mt-2">
            Analizza un&apos;auto usata con i dati che confermi: prezzo di mercato, affidabilità e checklist controlli.
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
