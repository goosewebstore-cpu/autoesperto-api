'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
export interface HomeGuideItem { slug: string; title: string; description: string; published: string; category: string; image: string; featured: boolean }
function Cover({ guide, large = false }: { guide: HomeGuideItem; large?: boolean }) {
  const [failed, setFailed] = useState(false);
  return <img src={failed ? '/og-image.png' : guide.image} alt={guide.title} width={1200} height={675} loading="lazy" onError={() => setFailed(true)} className={'aspect-[16/9] w-full object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-[1.025] ' + (large ? 'lg:h-full lg:aspect-auto' : '')} />;
}
export default function HomeGuideFeed({ items }: { items: HomeGuideItem[] }) {
  const [mode, setMode] = useState<'new' | 'discover'>('new');
  const [page, setPage] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(true);
  const ordered = useMemo(() => mode === 'new' ? items : [...items].sort((a, b) => Number(b.featured) - Number(a.featured)), [items, mode]);
  const pages = Math.max(1, Math.ceil(ordered.length / 4));
  const current = ordered.slice((page % pages) * 4, (page % pages) * 4 + 4);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPlaying(!preference.matches);
    const change = () => { if (preference.matches) setPlaying(false); };
    preference.addEventListener('change', change);
    const visibility = () => setVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', visibility);
    return () => { preference.removeEventListener('change', change); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  useEffect(() => {
    if (!playing || hovering || focused || !visible || pages < 2) return;
    const timer = window.setInterval(() => setPage(p => (p + 1) % pages), 10000);
    return () => window.clearInterval(timer);
  }, [playing, hovering, focused, visible, pages]);
  if (!current.length) return null;
  const lead = current[0];
  return <section aria-labelledby="home-guides-title" className="mx-auto mb-16 max-w-[1440px] px-4 sm:px-6" onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false); }} onTouchStart={() => setPlaying(false)}>
    <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-xs font-bold uppercase tracking-[.16em] text-blue-600">Da leggere prima di scegliere</p><h2 id="home-guides-title" className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Le guide di AutoEsperto</h2></div>
      <Link href="/guide" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-blue-700">Tutte le guide <ArrowRight className="h-4 w-4" /></Link>
    </div>
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1" role="group" aria-label="Selezione guide">
        {([['new', 'Novità'], ['discover', 'Da scoprire']] as const).map(([key, label]) => <button key={key} type="button" aria-pressed={mode === key} onClick={() => { setMode(key); setPage(0); }} className={'min-h-10 rounded-lg px-4 text-sm font-bold ' + (mode === key ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-slate-50')}>{label}</button>)}
      </div>
      <div className="flex items-center gap-1.5">
        <button type="button" onClick={() => setPage(p => (p - 1 + pages) % pages)} aria-label="Guide precedenti" className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white"><ChevronLeft className="h-4 w-4" /></button>
        <span className="min-w-10 text-center text-xs tabular-nums text-slate-500">{page % pages + 1} / {pages}</span>
        <button type="button" onClick={() => setPage(p => (p + 1) % pages)} aria-label="Guide successive" className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white"><ChevronRight className="h-4 w-4" /></button>
        <button type="button" onClick={() => setPlaying(p => !p)} aria-label={playing ? 'Pausa rotazione guide' : 'Avvia rotazione guide'} aria-pressed={playing} className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white">{playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}</button>
      </div>
    </div>
    <div aria-live="off">
      <Link key={lead.slug} href={'/guide/' + lead.slug} prefetch={false} className="group grid overflow-hidden rounded-3xl border border-slate-200 bg-white lg:grid-cols-[1.15fr_1fr]">
        <div className="overflow-hidden bg-slate-100"><Cover guide={lead} large /></div>
        <div className="flex flex-col justify-center p-5 sm:p-8"><div className="flex flex-wrap items-center gap-3 text-xs text-slate-500"><span className="rounded-full bg-blue-50 px-3 py-1 font-bold text-blue-700">{lead.category}</span><time dateTime={lead.published}>{lead.published.split('-').reverse().join('/')}</time></div><h3 className="mt-4 text-xl font-extrabold leading-tight text-slate-950 group-hover:text-blue-700 sm:text-2xl">{lead.title}</h3><p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">{lead.description}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-700">Leggi la guida <ArrowRight className="h-4 w-4" /></span></div>
      </Link>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">{current.slice(1).map(guide => <Link key={guide.slug} href={'/guide/' + guide.slug} prefetch={false} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="overflow-hidden bg-slate-100"><Cover guide={guide} /></div><div className="p-4"><span className="text-[11px] font-bold text-blue-700">{guide.category} · {guide.published.split('-').reverse().join('/')}</span><h3 className="mt-2 line-clamp-3 text-sm font-bold leading-snug text-slate-900 group-hover:text-blue-700">{guide.title}</h3><span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-blue-700">Leggi <ArrowRight className="h-3.5 w-3.5" /></span></div></Link>)}</div>
    </div>
  </section>;
}
