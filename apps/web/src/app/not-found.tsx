import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-5 text-center bg-white">
      <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center mb-6">
        <span className="text-white font-extrabold text-lg">AE</span>
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-text-primary">Pagina non trovata</h1>
      <p className="text-text-secondary mt-3 max-w-md">
        La pagina che cerchi non esiste o è stata spostata.
      </p>
      <Link
        href="/"
        className="mt-6 px-6 py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover transition-colors"
      >
        Torna alla home
      </Link>
    </main>
  );
}
