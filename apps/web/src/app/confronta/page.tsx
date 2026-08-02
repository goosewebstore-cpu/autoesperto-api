import type { Metadata } from 'next';
import CompareModels from '@/components/CompareModels';

export const metadata: Metadata = {
  title: 'Confronta modelli auto usate',
  description: 'Confronta prezzo di mercato, affidabilità e alternative tra due auto usate.',
  alternates: { canonical: '/confronta/' },
  openGraph: {
    title: 'Confronta modelli auto usate | AutoEsperto',
    description: 'Confronta prezzo di mercato, affidabilità e alternative tra due auto usate.',
    url: '/confronta/',
  },
};

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-5xl mx-auto px-5 pt-12 pb-16">
        <a href="/" className="text-sm font-semibold text-accent hover:underline">← AutoEsperto</a>
        <div className="max-w-2xl mt-7 mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent mb-2">Confronto auto</p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary">Confronta due modelli prima di scegliere</h1>
          <p className="text-text-secondary mt-3 leading-relaxed">Metti a confronto prezzi reali dagli annunci, affidabilità e punti da controllare. È gratuito.</p>
        </div>
        <CompareModels />
      </section>
    </main>
  );
}
