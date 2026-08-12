import type { Metadata } from 'next';
import Link from 'next/link';
import { Car } from 'lucide-react';
import ConditionPage from './ConditionPage';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';

export const metadata: Metadata = {
  title: 'Valuta la condizione della tua auto — Conviene riparare o vendere?',
  description:
    'Carica le foto dei danni alla tua auto: analizziamo graffi, ammaccature e carrozzeria, stimiamo i costi di riparazione e ti diciamo se conviene riparare o vendere. Gratuito e senza registrazione.',
  alternates: {
    canonical: '/condizione',
    languages: { 'it-IT': `${siteUrl}/condizione` },
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    title: 'Conviene riparare o vendere la tua auto? — AutoEsperto',
    description:
      'Carica le foto dei danni, scopri i costi di riparazione e ricevi il verdetto: riparare o vendere. Gratuito.',
    url: `${siteUrl}/condizione`,
    siteName: 'AutoEsperto',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-border/60">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-5 h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Car className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-text-primary">
              Auto<span className="text-accent">Esperto</span>
            </span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/valutazione" className="text-text-secondary hover:text-text-primary transition-colors font-medium">
              Valutazione
            </Link>
            <Link href="/guide" className="text-text-secondary hover:text-text-primary transition-colors font-medium">
              Guide
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 pt-8 pb-20">
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-text-tertiary mb-4 flex flex-wrap items-center gap-1.5"
        >
          <Link href="/" className="hover:text-accent transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-text-secondary font-medium">Valuta condizione</span>
        </nav>

        <section className="mb-8">
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-text-primary leading-[1.15]">
            Conviene riparare o vendere?
          </h1>
          <p className="text-text-secondary text-base leading-relaxed mt-3 max-w-xl">
            Seleziona la tua auto, carica le foto dei danni e scopri subito i costi di riparazione
            stimati e se conviene riparare o vendere. Gratuito e senza registrazione.
          </p>
        </section>

        <ConditionPage />

        <section className="mt-12 rounded-2xl bg-surface-2 border border-border p-6">
          <h2 className="text-base font-bold text-text-primary mb-2">Come funziona</h2>
          <ol className="space-y-3 text-sm text-text-secondary leading-relaxed">
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                1
              </span>
              <span>
                <strong className="text-text-primary">Seleziona la tua auto</strong> — Scegli marca
                e modello per calcolare il valore di mercato.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                2
              </span>
              <span>
                <strong className="text-text-primary">Carica le foto dei danni</strong> — Fino a 4
                foto ravvicinate di graffi, ammaccature o danni alla carrozzeria.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                3
              </span>
              <span>
                <strong className="text-text-primary">Ricevi il verdetto</strong> — L&apos;AI analizza
                ogni danno, stima i costi e ti dice se conviene riparare o vendere.
              </span>
            </li>
          </ol>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'Come capire se conviene riparare o vendere la mia auto?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Confronta il costo di riparazione con il valore dell\'auto. Se il costo è inferiore al 30% del valore, conviene riparare. Se supera il 60%, spesso conviene vendere. AutoEsperto lo calcola automaticamente dalle foto dei danni.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Quanto costa riparare un graffio sull\'auto?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Un graffio lieve costa circa 120-280 €, uno medio 250-550 € e uno profondo 450-900 €, incluse manodopera e verniciatura. Il costo varia in base alla zona e alla profondità.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Come funziona la valutazione dei danni da foto?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Carica una foto ravvicinata del danno. L\'intelligenza artificiale riconosce il tipo di danno (graffio, ammaccatura, paraurti, etc.), la gravità, la zona interessata e stima i costi di riparazione inclusi ricambi e manodopera.',
                  },
                },
              ],
            }),
          }}
        />
      </main>

      <footer className="border-t border-border/60 mt-10">
        <div className="max-w-3xl mx-auto px-5 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-accent flex items-center justify-center">
                <Car className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-bold text-text-primary">AutoEsperto</span>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-text-secondary">
              <Link
                href="/valutazione"
                className="hover:text-text-primary transition-colors"
              >
                Valutazione auto
              </Link>
              <Link
                href="/riparazione"
                className="hover:text-text-primary transition-colors"
              >
                Costi riparazione
              </Link>
              <Link href="/guide" className="hover:text-text-primary transition-colors">
                Guide
              </Link>
              <Link href="/privacy" className="hover:text-text-primary transition-colors">
                Privacy
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
