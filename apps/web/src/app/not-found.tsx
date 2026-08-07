import Link from 'next/link';
import { ArrowLeft, Car, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-5 text-center bg-slate-50 relative overflow-hidden">
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-100/50 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-sky-100/50 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md mx-auto animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/20 flex items-center justify-center mx-auto mb-6">
          <Car className="h-8 w-8 text-white" />
        </div>

        <span className="inline-block text-xs font-extrabold tracking-widest text-blue-600 uppercase mb-2">
          Errore 404
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Pagina non trovata
        </h1>
        <p className="text-sm text-slate-600 mt-3 leading-relaxed">
          La pagina che stai cercando non esiste o è stata spostata. Prova a tornare alla home o a consultare una delle nostre valutazioni.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-blue-600 shadow-md transition-all"
          >
            <Home className="h-4 w-4" /> Torna alla home
          </Link>
          <Link
            href="/valutazione"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:border-blue-500 hover:text-blue-600 transition-all"
          >
            <Search className="h-4 w-4" /> Valutazione auto
          </Link>
        </div>
      </div>
    </main>
  );
}
