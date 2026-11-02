import Link from 'next/link';
import GuideCard from './GuideCard';
import { guides, GUIDE_CATEGORIES } from '@/lib/guides';

const investorSlug = 'autoesperto-cerca-investitori-sistema-proprietario';
const recent = [...guides]
  .filter((guide) => guide.slug !== investorSlug)
  .sort((a, b) => b.published.localeCompare(a.published));

export default function GuideEditorialOverview() {
  return (
    <div className="space-y-12 mb-12">
      <section aria-labelledby="investitori-heading" className="rounded-3xl border border-blue-200 bg-blue-50 p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Il progetto AutoEsperto</p>
        <h2 id="investitori-heading" className="mt-2 text-2xl font-black text-slate-900">Cerchiamo investitori e partner</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-700">Stiamo sviluppando strumenti per aiutare chi compra, vende e mantiene un’auto. Scopri il progetto, le funzioni disponibili e i prossimi obiettivi.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href={`/guide/${investorSlug}`} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700">Conosci il progetto</Link>
          <a href="mailto:ralfhjavier@gmail.com" className="rounded-xl border border-blue-200 bg-white px-5 py-3 text-sm font-bold text-blue-800">Parliamone</a>
        </div>
      </section>
      <section aria-labelledby="recenti-heading">
        <h2 id="recenti-heading" className="text-2xl font-black text-slate-900">Gli ultimi articoli</h2>
        <p className="mt-2 mb-5 text-sm text-slate-600">Notizie e nuove guide del Team AutoEsperto, in ordine di pubblicazione.</p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recent.slice(0, 6).map((guide) => <GuideCard key={guide.slug} guide={guide} />)}
        </div>
      </section>
      <div className="space-y-10">
        {Object.entries(GUIDE_CATEGORIES).map(([key, category]) => (
          <section key={key} aria-labelledby={`categoria-${key}`}>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 id={`categoria-${key}`} className="text-xl font-black text-slate-900">{category.label}</h2>
                <p className="mt-1 text-sm text-slate-600">{category.description}</p>
              </div>
              <Link href={`/guide?categoria=${key}`} className="text-sm font-bold text-blue-700 underline underline-offset-4">Tutti gli articoli di {category.label.toLowerCase()}</Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {recent.filter((guide) => guide.category === key).slice(0, 3).map((guide) => <GuideCard key={guide.slug} guide={guide} />)}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
