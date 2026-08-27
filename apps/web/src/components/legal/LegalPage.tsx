import Link from 'next/link';
import { ArrowLeft, FileText, Scale } from 'lucide-react';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';

interface LegalSection {
  heading: string;
  paragraphs: string[];
}

interface LegalPageProps {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}

export default function LegalPage({ title, updated, intro, sections }: LegalPageProps) {
  const renderText = (text: string) => {
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    return text.split(emailRegex).map((part, index) =>
      emailRegex.test(part) ? (
        <a
          key={`${part}-${index}`}
          href={`mailto:${part}`}
          className="font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2"
        >
          {part}
        </a>
      ) : (
        part
      )
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <SiteHeader />
        <main className="max-w-3xl mx-auto px-5 py-10 w-full animate-fade-in">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Torna ad AutoEsperto
        </Link>

        <header className="mb-8 rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-card">
          <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
            <Scale className="h-4 w-4" /> Informazioni Legali
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">{title}</h1>
          <p className="text-xs text-slate-400 mt-2 font-medium">Ultimo aggiornamento: {updated}</p>
          <p className="text-sm text-slate-600 leading-relaxed mt-4 pt-4 border-t border-slate-100">
            {renderText(intro)}
          </p>
        </header>

        <div className="space-y-6">
          {sections.map((s, idx) => (
            <section
              key={s.heading}
              className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-card hover:border-slate-300 transition-all"
            >
              <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2.5">
                <span className="grid h-6 w-6 place-items-center rounded-md bg-blue-50 text-xs font-extrabold text-blue-600">
                  {idx + 1}
                </span>
                {s.heading}
              </h2>
              <div className="space-y-3 pl-8">
                {s.paragraphs.map((p, i) => (
                  <p key={i} className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {renderText(p)}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
        </main>
      </div>

      <SiteFooter />
    </div>
  );
}
