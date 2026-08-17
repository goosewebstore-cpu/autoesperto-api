import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import ConditionPage from './ConditionPage';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';

export const metadata: Metadata = {
  title: 'Valutazione danni auto: riparare o vendere?',
  description:
    'Analisi dei danni da foto: costi di riparazione stimati e verdetto su riparare o vendere. Gratis, senza registrazione.',
  alternates: {
    canonical: '/condizione',
    languages: { 'it-IT': `${siteUrl}/condizione` },
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    title: 'Valutazione danni auto: riparare o vendere?',
    description:
      'Foto dei danni, costi di riparazione stimati e verdetto: riparare o vendere. Gratis.',
    url: `${siteUrl}/condizione`,
    siteName: 'AutoEsperto',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <PageHero
        crumb="Valuta condizione"
        photo="https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1600&q=80"
        title="Conviene riparare o vendere?"
      >
        <p>
          Seleziona un modello, carica le foto dei danni. Costi di riparazione stimati e verdetto:
          riparare o vendere. Gratis.
        </p>
      </PageHero>

      <main className="page-body narrow">
        <ConditionPage />

        <section className="mt-12 rounded-2xl bg-surface-2 border border-border p-6">
          <h2 className="text-base font-bold text-text-primary mb-2">Come funziona</h2>
          <ol className="space-y-3 text-sm text-text-secondary leading-relaxed">
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                1
              </span>
              <span>
                <strong className="text-text-primary">Seleziona un modello</strong> — Scegli marca
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
                i danni, stima i costi e indica se riparare o vendere.
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

      <SiteFooter variant="full" />
    </div>
  );
}
