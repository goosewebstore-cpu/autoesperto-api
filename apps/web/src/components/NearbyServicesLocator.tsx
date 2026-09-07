'use client';

import React from 'react';
import { Wrench, ShieldAlert, MapPin, ExternalLink, Sparkles, CheckSquare, Search, Navigation } from 'lucide-react';
import type { PhotoAnalysisResult } from '@autoesperto/types';
import type { LocationInfo } from './LocationSelector';

interface NearbyServicesLocatorProps {
  make?: string;
  model?: string;
  damage?: PhotoAnalysisResult['damage'];
  repairRange?: { min: number; max: number };
  location?: LocationInfo;
}

export function NearbyServicesLocator({
  make,
  model,
  damage,
  repairRange,
  location,
}: NearbyServicesLocatorProps) {
  const city = location?.city || location?.province || location?.regionName || 'nelle vicinanze';
  const cap = location?.cap || '';
  const makeClean = make || 'Auto';
  const locQuery = cap ? `${cap} ${city}` : city;

  const hasDamage = Boolean(damage?.visible && damage.category !== 'nessun_danno_evidente' && damage.category !== 'non_chiaro');
  const isSevere = damage?.category === 'frontale_grave' || damage?.category === 'strutturale_telaio' || damage?.severity === 'alta';
  const isGlass = damage?.category === 'vetro';

  // Direct Google Maps Queries
  const mapsCarrozzeriaUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`carrozzeria auto ${makeClean} ${locQuery}`)}`;
  const mapsMeccanicaUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`officina meccanica autorizzata ${makeClean} ${locQuery}`)}`;
  const mapsGommistaUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`gommista equilibratura convergenza ${locQuery}`)}`;
  const mapsCristalliUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`sostituzione cristalli parabrezza auto ${locQuery}`)}`;

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden text-left">
      {/* Header */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold text-white mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            <span>Assistenza & Officine Partner Google</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black tracking-tight">
            Officine e Carrozzerie vicino a te
          </h3>
          <p className="text-xs text-blue-100 mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-blue-200" />
            <span>Ricerche geolocalizzate per <strong>{makeClean} {model || ''}</strong> a <strong>{locQuery}</strong></span>
          </p>
        </div>

        {repairRange && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-blue-200 block">Stima Riparazione</span>
            <span className="text-lg font-black text-white">
              {repairRange.min.toLocaleString('it-IT')} – {repairRange.max.toLocaleString('it-IT')} €
            </span>
          </div>
        )}
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        {/* Avviso Danno se presente */}
        {hasDamage && (
          <div className={`p-4 rounded-2xl border ${
            isSevere
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200'
              : 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60 text-blue-900 dark:text-blue-200'
          }`}>
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <div className="text-xs space-y-1">
                <span className="font-bold block text-sm">
                  {isSevere ? 'Attenzione: Danno strutturale o frontale rilevato' : 'Danno carrozzeria rilevato'}
                </span>
                <p>
                  {damage?.description || 'Ti consigliamo di richiedere almeno 2 preventivi scritti per ricambi originali e ricalibrazione sensori radar/ADAS.'}
                </p>
                {damage?.repairHint && (
                  <p className="font-medium pt-1">
                    <strong>Consiglio tecnico:</strong> {damage.repairHint}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pulsanti Ricerca Diretta Google Maps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href={mapsCarrozzeriaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:border-blue-300 dark:hover:border-blue-700 transition-all group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1">
                  Carrozzerie a {city}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Verniciatura, raddrizzatura e scocca
                </p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
          </a>

          <a
            href={mapsMeccanicaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center gap-1">
                  Officine Specializzate {makeClean}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Diagnosi elettronica, tagliandi e motori
                </p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0" />
          </a>

          <a
            href={mapsCristalliUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 hover:border-cyan-300 dark:hover:border-cyan-700 transition-all group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300 flex items-center justify-center shrink-0">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 flex items-center gap-1">
                  Centri Sostituzione Cristalli
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Parabrezza, lunotti e ricalibrazione telecamere
                </p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 transition-colors shrink-0" />
          </a>

          <a
            href={mapsGommistaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 flex items-center gap-1">
                  Gommisti & Assetto Ruote
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Convergenza, cerchi in lega e pneumatici
                </p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0" />
          </a>
        </div>

        {/* Guida Preventivo & Diritti del Consumatore */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
          <span className="font-bold text-slate-800 dark:text-slate-200 block">
            💡 Consigli per richiedere il preventivo:
          </span>
          <ul className="space-y-1 text-slate-600 dark:text-slate-400 list-disc list-inside">
            <li>Chiedi che la voce &quot;ricambi originali o equivalenti omologati&quot; sia specificata per iscritto.</li>
            <li>Su vetture dotate di cruise control adattivo o frenata d&apos;emergenza (ADAS), richiedi la certificazione di ricalibrazione dopo lo smontaggio paraurti.</li>
            <li>In caso di sinistro con ragione, hai diritto alla libera scelta del carrozziere di fiducia ai sensi della Legge Concorrenza.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
