'use client';
import { useSearchParams } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import VehicleScanner from '@/components/VehicleScanner';
export default function AdAnalysisLandingClient() {
  const params=useSearchParams();
  return <div className="min-h-screen bg-slate-50"><SiteHeader /><main className="mx-auto max-w-5xl px-4 pb-12 pt-6 sm:pt-10"><div className="mb-6 max-w-2xl"><p className="text-xs font-bold uppercase tracking-wider text-blue-600">Anteprima gratuita</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">Hai trovato un annuncio?<br />Capisci cosa controllare.</h1><p className="mt-3 text-sm leading-relaxed text-slate-600">Incolla il link o il testo dell’offerta per ricevere un primo orientamento gratuito. Se vuoi approfondire, un report completo costa 1,99 €; il pacchetto da 4,99 € include 3 report e 1 in omaggio. Pagamenti una tantum, senza rinnovo. Puoi anche scegliere “Modello” e valutare gratis, senza account.</p></div><VehicleScanner embedded initialMode="annuncio" initialAd={params.get('url')||params.get('text')||undefined} /></main><SiteFooter /></div>;
}
