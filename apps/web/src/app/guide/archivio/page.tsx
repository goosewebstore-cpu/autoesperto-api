import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { guides, GUIDE_CATEGORIES, type GuideCategory } from '@/lib/guides';

export const metadata: Metadata = {
  title: 'Tutte le guide sulle auto usate, per argomento',
  description: 'Sfoglia le guide AutoEsperto su acquisto, vendita, valutazione, manutenzione e affidabilità. Trova i controlli e le spiegazioni utili per la tua auto.',
  alternates: { canonical: '/guide/archivio' },
};

export default function GuideArchivePage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-12">
        <Link href="/guide" className="text-sm font-semibold text-blue-700 hover:underline">Guide e consigli</Link>
        <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">Un argomento, tutte le risposte.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">Le nostre {guides.length} guide, raccolte per tema: dai controlli prima di comprare ai costi di manutenzione, fino alla vendita.</p>
        <nav aria-label="Argomenti delle guide" className="my-8 flex flex-wrap gap-x-6 gap-y-3 border-y border-slate-200 py-5">
          {Object.entries(GUIDE_CATEGORIES).map(([key, category]) => <a key={key} href={`#${key}`} className="font-semibold text-blue-700 hover:underline">{category.label}</a>)}
        </nav>
        {Object.entries(GUIDE_CATEGORIES).map(([key, category]) => {
          const items = guides.filter(guide => guide.category === key as GuideCategory).sort((a, b) => a.title.localeCompare(b.title, 'it'));
          return (
            <section key={key} id={key} aria-labelledby={`heading-${key}`} className="scroll-mt-28 border-b border-slate-200 py-8">
              <h2 id={`heading-${key}`} className="text-2xl font-bold text-slate-900">{category.label} <span className="text-sm font-normal text-slate-500">{items.length} guide</span></h2>
              <p className="mt-2 text-slate-600">{category.description}</p>
              <ul className="mt-5 grid gap-x-10 md:grid-cols-2">
                {items.map(guide => <li key={guide.slug} className="border-t border-slate-100 py-3"><Link prefetch={false} href={`/guide/${guide.slug}`} className="block leading-relaxed text-slate-800 underline decoration-slate-300 underline-offset-4 hover:text-blue-700 hover:decoration-blue-700">{guide.title}</Link></li>)}
              </ul>
            </section>
          );
        })}
      </main>
      <SiteFooter />
    </div>
  );
}
