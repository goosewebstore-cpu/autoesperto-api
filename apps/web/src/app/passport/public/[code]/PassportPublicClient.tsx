'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Wrench,
  Clock,
  Car,
  Activity,
  FileCheck,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Camera,
  Tag,
  MessageCircle,
  Phone,
  Mail,
  Lock,
  Fuel,
  Gauge,
  Share2,
} from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { getPassportByShareCode, ensureSamplePassport, computeDynamicHealthScore, getTrustBadgeForPassport } from '@/lib/passportStorage';
import type { VehiclePassportData } from '@autoesperto/types';

export default function PassportPublicClient({ code }: { code: string }) {
  const [passport, setPassport] = useState<VehiclePassportData | null>(null);

  useEffect(() => {
    let p = getPassportByShareCode(code);
    if (!p) {
      const sample = ensureSamplePassport();
      if (sample.shareCode.toUpperCase() === code.toUpperCase() || code.toUpperCase() === 'SAMPLE' || code.toUpperCase() === 'AE-48291') {
        p = sample;
      }
    }
    setPassport(p);
  }, [code]);

  if (!passport || passport.shareConfig?.enabled === false) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <SiteHeader />
        <main className="flex-1 max-w-xl mx-auto px-4 py-20 text-center">
          <Car className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h1 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Profilo Digitale non attivo o revocato</h1>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            Il link di condivisione <strong className="font-mono">{code.toUpperCase()}</strong> è stato disattivato o revocato dal proprietario del veicolo. I dati privati rimangono completamente protetti.
          </p>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs"
          >
            Torna alla Home AutoEsperto
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const v = passport.vehicle;
  const trust = getTrustBadgeForPassport(passport);
  const cfg = passport.shareConfig || {
    enabled: true,
    showVehicleInfo: true,
    showMaintenance: true,
    showRepairs: true,
    showRevisions: true,
    showHealthScore: true,
    showOriginalDocs: false,
    showPhotos: true,
    showTimeline: true,
    showValuation: true,
  };

  const health = passport.healthBreakdown || computeDynamicHealthScore(passport);
  const selling = passport.sellingConfig;
  const mainPhoto =
    passport.mainPhoto ||
    passport.photos?.[0]?.url ||
    v.imageUrl ||
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-white">
      <SiteHeader />

      <main className="flex-1 pb-16 space-y-6">
        {/* Public Header Banner */}
        <section className="bg-slate-900 text-white pt-8 pb-12 px-4 sm:px-6 relative overflow-hidden">
          <div className="max-w-5xl mx-auto relative z-10 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/35 shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Profilo Digitale Auto · {passport.shareCode}
                </div>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${trust.colorClass}`}>
                  {trust.label}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Guarda il Profilo Digitale certificato di questa ${v.make} ${v.model} su AutoEsperto: ${typeof window !== 'undefined' ? window.location.href : `https://autoesperto.it/passport/public/${passport.shareCode}`}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-all"
                  title="Condividi su WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Condividi
                </a>

                <button
                  type="button"
                  onClick={() => {
                    if (typeof navigator !== 'undefined' && navigator.clipboard) {
                      void navigator.clipboard.writeText(window.location.href);
                      alert('Link del Profilo Digitale copiato negli appunti!');
                    }
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition-all"
                  title="Copia link"
                >
                  <Share2 className="w-3.5 h-3.5" /> Copia link
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6 items-center">
              <div>
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                  {v.make} {v.model}
                </h1>
                {v.version && (
                  <p className="text-sm sm:text-base text-slate-300 font-medium mt-1">
                    {v.version}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                  <span className="bg-blue-600/40 border border-blue-400/40 text-blue-200 px-3 py-1.5 rounded-xl font-mono font-black">
                    {passport.currentKm.toLocaleString('it-IT')} km certificati
                  </span>
                  {v.year && (
                    <span className="bg-white/10 text-slate-300 px-3 py-1.5 rounded-xl font-semibold">
                      Anno {v.year}
                    </span>
                  )}
                  {v.fuel && (
                    <span className="bg-white/10 text-slate-300 px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1">
                      <Fuel className="w-3.5 h-3.5 text-slate-400" /> {v.fuel}
                    </span>
                  )}
                  {v.euroClass && (
                    <span className="bg-white/10 text-slate-300 px-3 py-1.5 rounded-xl font-semibold">
                      {v.euroClass}
                    </span>
                  )}
                </div>

                {/* Selling Box if Active */}
                {selling?.enabled && (
                  <div className="mt-5 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-white space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                        <Tag className="w-4 h-4" /> Veicolo in Vendita
                      </span>
                      <span className="text-xl font-black text-emerald-400">
                        {selling.askingPrice ? `${selling.askingPrice.toLocaleString('it-IT')} €` : 'Trattativa Riservata'}
                      </span>
                    </div>

                    {selling.sellerNotes && (
                      <p className="text-xs text-slate-200 leading-relaxed italic">
                        &quot;{selling.sellerNotes}&quot;
                      </p>
                    )}

                    {selling.allowContact && selling.contactValue && (
                      <div className="pt-1">
                        {selling.contactMethod === 'whatsapp' ? (
                          <a
                            href={`https://wa.me/${selling.contactValue.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Salve, ho visto il Profilo Digitale della tua ${v.make} ${v.model} su AutoEsperto e vorrei maggiori informazioni.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
                          >
                            <MessageCircle className="w-4 h-4" /> Contatta su WhatsApp
                          </a>
                        ) : (
                          <span className="text-xs font-bold text-slate-300">
                            Contatto venditore: {selling.contactValue}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Photo & Score card */}
              <div className="relative rounded-3xl overflow-hidden border border-slate-700 aspect-16/10 bg-slate-950 shadow-2xl">
                <img src={mainPhoto} alt={`${v.make} ${v.model}`} className="w-full h-full object-cover" />
                {cfg.showHealthScore && (
                  <div className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur-md border border-white/20 px-3.5 py-2 rounded-2xl text-white flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-black text-sm">
                      {health.totalScore}
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-extrabold tracking-wider text-blue-300">
                        Vehicle Health Score
                      </div>
                      <div className="text-xs font-black text-white">{health.label}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Public Content Grid */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
          {/* Health Score Overview */}
          {cfg.showHealthScore && (
            <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-blue-600" /> Vehicle Health Score™ ({health.totalScore}/100)
                </h2>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/50 px-3 py-1 rounded-xl">
                  {health.label}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {health.verdictNote}
              </p>

              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 font-semibold">Manutenzione</span>
                  <p className="text-base font-black text-slate-900 dark:text-white">{health.maintenanceScore}/100</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 font-semibold">Chilometraggio</span>
                  <p className="text-base font-black text-slate-900 dark:text-white">{health.mileageScore}/100</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 font-semibold">Carrozzeria</span>
                  <p className="text-base font-black text-slate-900 dark:text-white">{health.bodyConditionScore}/100</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 font-semibold">Pneumatici</span>
                  <p className="text-base font-black text-slate-900 dark:text-white">{health.tiresScore}/100</p>
                </div>
              </div>
            </section>
          )}

          {/* Photo Gallery if Allowed */}
          {cfg.showPhotos && passport.photos?.length > 0 && (
            <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-blue-600" /> Galleria Fotografica Certificata ({passport.photos.length})
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {passport.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 aspect-4/3 group shadow-xs"
                  >
                    <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 text-white">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-blue-300">{photo.category}</span>
                      <p className="text-xs font-bold truncate">{photo.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Public Timeline if Allowed */}
          {cfg.showTimeline && passport.timeline?.length > 0 && (
            <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" /> Storico e Manutenzione Dimostrabile ({passport.timeline.length} eventi)
              </h2>

              <div className="space-y-3 pl-2 border-l-2 border-slate-200 dark:border-slate-800 ml-3">
                {passport.timeline.map((evt) => (
                  <div key={evt.id} className="relative pl-6 py-1 space-y-0.5">
                    <span className="absolute -left-[17px] top-2 w-3 h-3 rounded-full bg-blue-600 border-2 border-white dark:border-slate-900" />
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{evt.title}</span>
                      <span className="text-[11px] text-slate-400 font-medium">{evt.date}</span>
                    </div>
                    {evt.km && (
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {evt.km.toLocaleString('it-IT')} km registrati
                      </span>
                    )}
                    {evt.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {evt.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Market Value if Allowed */}
          {cfg.showValuation && passport.estimatedValue && (
            <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Stima di Valore di Mercato AutoEsperto
              </span>
              <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {passport.estimatedValue.toLocaleString('it-IT')} €
                {passport.estimatedValueMax && (
                  <span className="text-sm font-semibold text-slate-400 ml-2">
                    (Forbice mercato: {passport.estimatedValue.toLocaleString('it-IT')} € – {passport.estimatedValueMax.toLocaleString('it-IT')} €)
                  </span>
                )}
              </p>
              <p className="text-xs text-slate-500">
                Basato sull&apos;analisi in tempo reale di migliaia di annunci auto comparabili in Italia per anno, alimentazione e chilometraggio.
              </p>
            </section>
          )}

          {/* CTA: Create your own Profile */}
          <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-6 shadow-xl text-center space-y-3">
            <h3 className="text-base sm:text-xl font-black">
              Vuoi creare il Profilo Digitale della tua auto?
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-lg mx-auto leading-relaxed">
              Conserva analisi, foto, documenti, valore e storico in un unico posto. 100% gratis e privato sul tuo dispositivo.
            </p>
            <div className="pt-2">
              <Link
                href="/passport"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-slate-950 font-black text-xs shadow-md hover:bg-blue-50 transition-all"
              >
                Crea il Profilo Digitale della tua Macchina <ArrowRight className="w-4 h-4 text-blue-600" />
              </Link>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
