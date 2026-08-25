'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Trophy,
  CheckCircle2,
  AlertTriangle,
  Plus,
  X,
  Gauge,
  ShieldCheck,
  Fuel,
  Wallet,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Search,
} from 'lucide-react';
import { VEHICLE_DATABASE, type VehicleProfile } from '@/lib/finderEngine';
import { calculateVehicleTco } from '@/lib/tcoEngine';
import { computeDealScore } from '@/lib/dealScore';
import { generateWhyAndWhyNot } from '@/lib/decisionEngine';

export default function CompareModels({
  initialLeftReport,
  initialRightReport,
}: {
  initialLeftReport?: any;
  initialRightReport?: any;
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>(['toyota-yaris', 'fiat-panda', 'renault-clio']);
  const [annualKm, setAnnualKm] = useState<number>(12000);

  const selectedVehicles: VehicleProfile[] = useMemo(
    () => selectedIds.map((id) => VEHICLE_DATABASE.find((v) => v.id === id)!).filter(Boolean),
    [selectedIds]
  );

  const availableVehiclesToAdd = useMemo(
    () => VEHICLE_DATABASE.filter((v) => !selectedIds.includes(v.id)),
    [selectedIds]
  );

  const handleAddVehicle = (id: string) => {
    if (selectedIds.length < 4 && !selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleRemoveVehicle = (id: string) => {
    if (selectedIds.length > 2) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    }
  };

  // Compute "LA NOSTRA SCELTA" Winner
  const comparisonResults = useMemo(() => {
    return selectedVehicles.map((v) => {
      const tco = calculateVehicleTco(v, annualKm);
      const deal = computeDealScore(v.priceAvg, v.priceAvg, v.priceMin, v.priceMax, 64);
      const why = generateWhyAndWhyNot(v.make, v.model);

      // Composite rating score
      const overallIndex =
        v.reliabilityScore * 10 +
        (100 - v.litersPer100Km * 8) +
        (300 - v.annualMaintenanceEst) * 0.15 +
        v.resaleRating * 12 +
        v.safetyRating * 10;

      return {
        vehicle: v,
        tco,
        deal,
        why,
        overallIndex,
      };
    });
  }, [selectedVehicles, annualKm]);

  const winner = useMemo(() => {
    if (comparisonResults.length === 0) return null;
    return [...comparisonResults].sort((a, b) => b.overallIndex - a.overallIndex)[0];
  }, [comparisonResults]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Selector & KM Slider Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Confronto Intelligente Multi-Modello
          </span>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            Confronta fino a 4 auto con TCO e Verdetto AI
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Annual KM filter */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span>Percorrenza:</span>
            <select
              value={annualKm}
              onChange={(e) => setAnnualKm(Number(e.target.value))}
              aria-label="Chilometri annui per il calcolo dei costi"
              className="h-9 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold outline-none"
            >
              <option value={8000}>8.000 km/anno</option>
              <option value={12000}>12.000 km/anno</option>
              <option value={18000}>18.000 km/anno</option>
              <option value={25000}>25.000 km/anno</option>
            </select>
          </div>

          {/* Add car dropdown if < 4 */}
          {selectedIds.length < 4 && availableVehiclesToAdd.length > 0 && (
            <div className="flex items-center gap-1.5">
              <select
                onChange={(e) => {
                  if (e.target.value) handleAddVehicle(e.target.value);
                  e.target.value = '';
                }}
                defaultValue=""
                aria-label="Aggiungi un'auto al confronto"
                className="h-9 px-3 rounded-xl border border-blue-300 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold outline-none cursor-pointer"
              >
                <option value="" disabled>
                  + Aggiungi un&apos;altra auto...
                </option>
                {availableVehiclesToAdd.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.make} {v.model} (€{v.priceAvg.toLocaleString('it-IT')})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* ─── "LA NOSTRA SCELTA" BANNER ─── */}
      {winner && (
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-600/15 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-amber-300" /> La nostra scelta tra queste
            </div>
            <span className="text-xs font-semibold text-blue-100">
              Calcolato su {annualKm.toLocaleString('it-IT')} km/anno · Affidabilità, TCO e tenuta di mercato
            </span>
          </div>

          <div className="grid md:grid-cols-[1.5fr_1fr] gap-6 items-center">
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black">
                Per il tuo utilizzo sceglieremmo {winner.vehicle.make} {winner.vehicle.model}
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed">
                Offre il miglior equilibrio complessivo tra costi chilometrici reali, affidabilità meccanica nel tempo e valore residuo.
              </p>

              <div className="space-y-1.5 pt-2">
                <span className="text-xs font-black uppercase tracking-wider text-blue-200 block">
                  Le 3 motivazioni principali:
                </span>
                <ul className="space-y-1 text-xs text-white">
                  {winner.why.whyBuy.slice(0, 3).map((w, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center space-y-2">
              <span className="text-[11px] uppercase font-bold text-blue-200 block">Costo Reale Stimato (TCO)</span>
              <div className="text-2xl font-black font-mono">
                €{winner.tco.breakdown.totalAnnualCost.toLocaleString('it-IT')}<span className="text-sm font-normal text-blue-200">/anno</span>
              </div>
              <span className="text-xs text-blue-100 block">
                ≈ €{winner.tco.breakdown.monthlyCost}/mese (€{winner.tco.breakdown.costPerKm.toFixed(2)}/km)
              </span>

              <div className="pt-2">
                <Link
                  href={`/analizza-annuncio?make=${encodeURIComponent(winner.vehicle.make)}&model=${encodeURIComponent(winner.vehicle.model)}`}
                  className="w-full py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" /> Analizza Annunci {winner.vehicle.model}
                </Link>
              </div>
            </div>
          </div>

          {/* Scegli X se... decision pills */}
          <div className="pt-3 border-t border-white/15 grid sm:grid-cols-2 gap-3">
            {comparisonResults.map(({ vehicle, why }) => (
              <div key={vehicle.id} className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 space-y-1">
                <span className="text-xs font-black text-amber-300 block">
                  👉 Scegli {vehicle.make} {vehicle.model} se:
                </span>
                <p className="text-[11px] text-blue-50 leading-relaxed">
                  Cerchi {why.whyBuy[0]?.toLowerCase() || 'un ottimo equilibrio'} e la tua priorità è {vehicle.segment.toLowerCase() === 'city car' ? 'la massima maneggevolezza urbana ed economia di gestione' : 'il comfort di viaggio e l’affidabilità sulle lunghe percorrenze'}.
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── SIDE-BY-SIDE MATRIX TABLE ─── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[650px]">
          {/* Header Row: Vehicle Cards */}
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
              <th className="p-4 sm:p-5 w-44 font-black text-slate-400 uppercase text-[10px] tracking-wider">
                Parametri di Confronto
              </th>
              {comparisonResults.map(({ vehicle, why }) => (
                <th key={vehicle.id} className="p-4 sm:p-5 font-black text-slate-900 dark:text-white min-w-[200px]">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-base sm:text-lg font-black block">
                        {vehicle.make} {vehicle.model}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 block">
                        {vehicle.segment} · {vehicle.bodyType.toUpperCase()}
                      </span>
                    </div>
                    {selectedIds.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveVehicle(vehicle.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
                        title="Rimuovi dal confronto"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {/* Prezzo Medio Usato */}
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <td className="p-4 font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-blue-600" /> Prezzo Medio Usato
              </td>
              {comparisonResults.map(({ vehicle }) => (
                <td key={vehicle.id} className="p-4 font-extrabold text-slate-900 dark:text-white font-mono text-sm">
                  €{vehicle.priceAvg.toLocaleString('it-IT')}
                  <span className="text-[10px] text-slate-400 block font-normal">
                    Forbice: €{vehicle.priceMin.toLocaleString('it-IT')} – €{vehicle.priceMax.toLocaleString('it-IT')}
                  </span>
                </td>
              ))}
            </tr>

            {/* TCO Costo Annuo */}
            <tr className="bg-blue-50/30 dark:bg-blue-950/20 hover:bg-blue-50/60 transition-colors">
              <td className="p-4 font-black text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-blue-600" /> Costo Reale (TCO Annuo)
              </td>
              {comparisonResults.map(({ vehicle, tco }) => (
                <td key={vehicle.id} className="p-4 font-black text-blue-700 dark:text-blue-300 font-mono text-sm">
                  €{tco.breakdown.totalAnnualCost.toLocaleString('it-IT')}/anno
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-normal">
                    ≈ €{tco.breakdown.monthlyCost}/mese (€{tco.breakdown.costPerKm.toFixed(2)}/km)
                  </span>
                </td>
              ))}
            </tr>

            {/* Affidabilità Meccanica */}
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <td className="p-4 font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Affidabilità (0-10)
              </td>
              {comparisonResults.map(({ vehicle }) => (
                <td key={vehicle.id} className="p-4 font-extrabold text-slate-900 dark:text-white">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{vehicle.reliabilityScore}/10</span>
                    {vehicle.reliabilityScore >= 9.2 && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black">
                        Top Affidabile
                      </span>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            {/* Consumi Reali */}
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <td className="p-4 font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Fuel className="w-3.5 h-3.5 text-amber-600" /> Consumo Medio Reale
              </td>
              {comparisonResults.map(({ vehicle }) => (
                <td key={vehicle.id} className="p-4 text-slate-800 dark:text-slate-200 font-semibold">
                  <span className="font-bold">{vehicle.litersPer100Km} L/100 km</span>
                  <span className="text-[11px] text-slate-500 block">
                    (≈ {(100 / vehicle.litersPer100Km).toFixed(1)} km/L)
                  </span>
                </td>
              ))}
            </tr>

            {/* Manutenzione Ordinaria Annua */}
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <td className="p-4 font-bold text-slate-700 dark:text-slate-300">
                Manutenzione Stimata
              </td>
              {comparisonResults.map(({ vehicle }) => (
                <td key={vehicle.id} className="p-4 font-bold text-slate-800 dark:text-slate-200 font-mono">
                  ~€{vehicle.annualMaintenanceEst}/anno
                </td>
              ))}
            </tr>

            {/* Spazio & Bagagliaio */}
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <td className="p-4 font-bold text-slate-700 dark:text-slate-300">
                Spazio &amp; Bagagliaio
              </td>
              {comparisonResults.map(({ vehicle }) => (
                <td key={vehicle.id} className="p-4 font-semibold text-slate-800 dark:text-slate-200">
                  {vehicle.spaceRating}/5 stelle
                </td>
              ))}
            </tr>

            {/* Tenuta del Valore (Rivendibilità) */}
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <td className="p-4 font-bold text-slate-700 dark:text-slate-300">
                Rivendibilità &amp; Valore
              </td>
              {comparisonResults.map(({ vehicle }) => (
                <td key={vehicle.id} className="p-4 font-semibold text-slate-800 dark:text-slate-200">
                  {vehicle.resaleRating}/5 stelle
                </td>
              ))}
            </tr>

            {/* Punti di Forza */}
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">
                ✓ Punti di Forza
              </td>
              {comparisonResults.map(({ vehicle, why }) => (
                <td key={vehicle.id} className="p-4 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  {why.whyBuy.slice(0, 2).map((b, idx) => (
                    <div key={idx} className="flex items-start gap-1">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </td>
              ))}
            </tr>

            {/* Punti Deboli / Cosa sapere */}
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <td className="p-4 font-bold text-amber-600 dark:text-amber-400">
                ⚠️ Punti da Valutare
              </td>
              {comparisonResults.map(({ vehicle, why }) => (
                <td key={vehicle.id} className="p-4 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                  {why.whyNot.slice(0, 2).map((w, idx) => (
                    <div key={idx} className="flex items-start gap-1">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{w}</span>
                    </div>
                  ))}
                </td>
              ))}
            </tr>

            {/* Action CTAs Bottom Row */}
            <tr className="bg-slate-50 dark:bg-slate-800/40">
              <td className="p-4 font-bold text-slate-500">Azioni Rapide</td>
              {comparisonResults.map(({ vehicle }) => (
                <td key={vehicle.id} className="p-4 space-y-2">
                  <a
                    href={`https://www.autoscout24.it/lst/${encodeURIComponent(vehicle.make.toLowerCase())}/${encodeURIComponent(vehicle.model.toLowerCase())}`}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all text-center"
                  >
                    <Search className="w-3.5 h-3.5" /> Cerca {vehicle.model}
                  </a>

                  <Link
                    href={`/analizza-annuncio?make=${encodeURIComponent(vehicle.make)}&model=${encodeURIComponent(vehicle.model)}`}
                    className="w-full py-2 px-3 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all text-center"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Analizza annuncio
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
