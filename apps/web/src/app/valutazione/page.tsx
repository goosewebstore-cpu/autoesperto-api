import type { Metadata } from 'next';
import Link from 'next/link';
import { Car, Search } from 'lucide-react';
import { getAllMakes } from '@/lib/catalogo';

export const metadata: Metadata = {
  title: 'Valutazione auto usate: prezzi di mercato per marca e modello',
  description:
    'Quanto costa un\'auto usata? Prezzi medi reali dagli annunci in vendita per ogni marca e modello, con valutazione di affidabilità e punti critici da controllare.',
  alternates: { canonical: '/valutazione' },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    title: 'Valutazione auto usate per marca e modello | AutoEsperto',
    description: 'Consulta prezzi indicativi, affidabilità e punti critici delle auto usate per marca e modello.',
    url: '/valutazione',
    siteName: 'AutoEsperto',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Valutazione auto usate con AutoEsperto' }],
  },
};

export default function ValutazioneIndexPage() {
  const makes = getAllMakes();

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
        <nav aria-label="Breadcrumb" className="text-xs text-text-tertiary mb-4 flex items-center gap-1.5">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <span>/</span>
          <span className="text-text-secondary font-medium">Valutazione</span>
        </nav>

        <section>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-text-primary leading-[1.15]">
            Valutazione auto usate: prezzi di mercato
          </h1>
          <p className="text-text-secondary text-base leading-relaxed mt-3">
            Scegli la marca per vedere il prezzo medio reale di ogni modello, calcolato
            dagli annunci in vendita, con affidabilità e punti critici da controllare.
          </p>
        </section>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {makes.map((make) => (
            <Link
              key={make.name}
              href={`/valutazione/${make.slug}`}
              className="bg-surface-2 hover:bg-border/50 rounded-xl px-3.5 py-3 text-sm font-semibold text-text-primary transition-colors"
            >
              {make.name}
            </Link>
          ))}
        </div>
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
              <Link href="/privacy" className="hover:text-text-primary transition-colors">Privacy</Link>
              <Link href="/cookie-policy" className="hover:text-text-primary transition-colors">Cookie</Link>
              <Link href="/terms" className="hover:text-text-primary transition-colors">Termini</Link>
              <Link href="/contatti" className="hover:text-text-primary transition-colors">Contatti</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
