import type { Metadata } from 'next';
import Link from 'next/link';
import { Car, BookOpen } from 'lucide-react';
import { guides } from '@/lib/guides';

export const metadata: Metadata = {
  title: 'Guide auto usata: valore, vendita e acquisto | AutoEsperto',
  description:
    'Guide pratiche per comprare e vendere auto usate: checklist pre-acquisto, auto affidabili, come scoprire incidenti, valutare danni e capire se un prezzo è giusto.',
  alternates: {
    canonical: '/guide',
    languages: { 'it-IT': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it'}/guide` },
  },
};

export default function GuideIndexPage() {
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
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 pt-8 pb-20">
        <nav aria-label="Breadcrumb" className="text-xs text-text-tertiary mb-4">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <span> / </span>
          <span className="text-text-secondary font-medium">Guide</span>
        </nav>

        <section>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-text-primary leading-[1.15]">
            Guide sull&apos;auto usata
          </h1>
          <p className="text-text-secondary text-base leading-relaxed mt-3">
            Consigli pratici basati sui dati reali del mercato per comprare, vendere e valutare
            un&apos;auto usata senza rischiare di sbagliare il prezzo.
          </p>
        </section>

        <div className="mt-8 grid gap-4">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guide/${guide.slug}`}
              className="group rounded-2xl border border-border bg-surface-2 p-5 hover:border-accent transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-text-primary group-hover:text-accent transition-colors">
                    {guide.title}
                  </h2>
                  <p className="text-sm text-text-secondary leading-relaxed mt-2">{guide.description}</p>
                </div>
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                  <BookOpen className="w-4.5 h-4.5 text-accent" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <section className="mt-10 rounded-2xl bg-accent p-6 text-white">
          <h2 className="text-lg font-bold">Scopri quanto vale la tua auto</h2>
          <p className="text-sm text-white/85 leading-relaxed mt-2">
            Prezzo medio reale dagli annunci in vendita per marca, modello e anno. Gratis, senza registrazione.
          </p>
          <Link
            href="/valutazione"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-accent hover:bg-white/90 transition-colors"
          >
            Valuta la tua auto
          </Link>
        </section>
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
              <Link href="/valutazione" className="hover:text-text-primary transition-colors">Valutazione auto</Link>
              <Link href="/privacy" className="hover:text-text-primary transition-colors">Privacy</Link>
              <Link href="/cookie-policy" className="hover:text-text-primary transition-colors">Cookie</Link>
              <Link href="/terms" className="hover:text-text-primary transition-colors">Termini</Link>
              <Link href="/contatti" className="hover:text-text-primary transition-colors">Contatti</Link>
            </nav>
          </div>
          <p className="text-xs text-text-tertiary text-center mt-4">
            AutoEsperto fornisce valutazioni indicative e non sostituisce un&apos;ispezione professionale.
          </p>
        </div>
      </footer>
    </div>
  );
}
