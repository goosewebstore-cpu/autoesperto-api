'use client';

import { useState } from 'react';
import { Copy, Check, Megaphone, ChevronDown, ChevronUp } from 'lucide-react';
import type { AutoReport } from '@autoesperto/types';
import { trackEvent } from '@/lib/analytics';

interface SellAdGeneratorProps {
  report: AutoReport;
}

export function SellAdGenerator({ report }: SellAdGeneratorProps) {
  const [expanded, setExpanded] = useState(false);
  const [km, setKm] = useState('');
  const [condition, setCondition] = useState('buone');
  const [extras, setExtras] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const { vehicle, price } = report;
  const reliability = report.reliability || ({} as any);
  const vehicleName = [vehicle.make, vehicle.model].filter(Boolean).join(' ');
  const year = vehicle.year || new Date().getFullYear();

  const suggestedPrice = price.estimatedValue || 0;
  const minPrice = price.min || 0;
  const startPrice = Math.round(suggestedPrice * 1.05);

  const generateTitle = () => {
    const parts = [vehicle.make, vehicle.model];
    if (vehicle.year) parts.push(String(vehicle.year));
    if (vehicle.fuel) parts.push(vehicle.fuel);
    if (km) parts.push(`${Number(km).toLocaleString('it-IT')} km`);
    return parts.join(' ');
  };

  const generateDescription = () => {
    const lines: string[] = [];
    lines.push(`Vendo ${vehicleName} del ${year}.`);
    if (km) lines.push(`Chilometraggio: ${Number(km).toLocaleString('it-IT')} km.`);
    lines.push(`Condizioni generali: ${condition}.`);
    if (vehicle.fuel) lines.push(`Alimentazione: ${vehicle.fuel}.`);
    if (vehicle.transmission) lines.push(`Cambio: ${vehicle.transmission}.`);
    lines.push('');
    if ((reliability.strengths || []).length > 0) {
      lines.push('Punti di forza:');
      (reliability.strengths || []).slice(0, 4).forEach(s => lines.push(`\u2022 ${s}`));
      lines.push('');
    }
    if ((reliability.weaknesses || []).length > 0) {
      lines.push('In trasparenza:');
      (reliability.weaknesses || []).slice(0, 3).forEach(w => lines.push(`\u2022 ${w}`));
      lines.push('');
    }
    if (extras.trim()) {
      lines.push(`Optional e accessori: ${extras.trim()}.`);
      lines.push('');
    }
    lines.push(`Prezzo trattabile. Analisi AutoEsperto disponibile.`);
    lines.push(`Per info contattare in privato.`);
    return lines.join('\n');
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
      trackEvent('sell_ad_generated', { vehicle: vehicleName, field });
    } catch {}
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-card overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10">
            <Megaphone className="h-5 w-5 text-accent" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-text-primary flex items-center gap-2">Genera annuncio di vendita</p>
            <p className="text-xs text-text-secondary">Testo pronto per Subito, AutoScout24 e Facebook</p>
          </div>
        </div>
        {expanded ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
      </button>

      {expanded && (
        <div className="border-t border-slate-100 p-5 sm:p-6 space-y-6 animate-slide-down">
          {/* Inputs */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">Chilometri</label>
              <input type="number" value={km} onChange={(e) => setKm(e.target.value)} placeholder="es. 85000" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">Condizioni</label>
              <select value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent">
                <option value="ottime">Ottime</option>
                <option value="buone">Buone</option>
                <option value="discrete">Discrete</option>
                <option value="da sistemare">Da sistemare</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">Optional</label>
              <input type="text" value={extras} onChange={(e) => setExtras(e.target.value)} placeholder="es. Navi, tetto, pelle" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
          </div>

          {/* Price suggestion */}
          <div className="rounded-xl bg-accent/5 border border-accent/20 p-4">
            <p className="text-xs font-semibold text-accent mb-2">Prezzo consigliato</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div><p className="text-lg font-bold text-text-primary">{minPrice.toLocaleString('it-IT')} €</p><p className="text-[10px] text-text-tertiary">Minimo</p></div>
              <div><p className="text-lg font-bold text-accent">{suggestedPrice.toLocaleString('it-IT')} €</p><p className="text-[10px] text-text-tertiary">Mercato</p></div>
              <div><p className="text-lg font-bold text-text-primary">{startPrice.toLocaleString('it-IT')} €</p><p className="text-[10px] text-text-tertiary">Partenza</p></div>
            </div>
          </div>

          {/* Generated title */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-text-secondary">Titolo annuncio</label>
              <button type="button" onClick={() => copyToClipboard(generateTitle(), 'title')} className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent-hover">
                {copiedField === 'title' ? <><Check className="h-3 w-3" /> Copiato</> : <><Copy className="h-3 w-3" /> Copia</>}
              </button>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-sm font-medium text-text-primary">{generateTitle()}</div>
          </div>

          {/* Generated description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-text-secondary">Descrizione</label>
              <button type="button" onClick={() => copyToClipboard(generateDescription(), 'desc')} className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent-hover">
                {copiedField === 'desc' ? <><Check className="h-3 w-3" /> Copiato</> : <><Copy className="h-3 w-3" /> Copia</>}
              </button>
            </div>
            <pre className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-text-primary whitespace-pre-wrap font-sans leading-relaxed">{generateDescription()}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
