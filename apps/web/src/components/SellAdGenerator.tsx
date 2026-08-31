'use client';

import { useState } from 'react';
import { Copy, Check, Megaphone, ChevronDown, ChevronUp, ShieldCheck, Sparkles, FileText, Share2 } from 'lucide-react';
import type { AutoReport } from '@autoesperto/types';
import { trackEvent } from '@/lib/analytics';

interface SellAdGeneratorProps {
  report: AutoReport;
}

export function SellAdGenerator({ report }: SellAdGeneratorProps) {
  const [expanded, setExpanded] = useState(false);
  const [km, setKm] = useState(report.price?.inputKm ? String(report.price.inputKm) : '');
  const [condition, setCondition] = useState('ottime');
  const [extras, setExtras] = useState('');
  const [platform, setPlatform] = useState<'subito' | 'autoscout' | 'trasparente'>('subito');
  const [includePassport, setIncludePassport] = useState(true);
  const [selectedHighlights, setSelectedHighlights] = useState<string[]>([
    'Tagliandi regolari documentati',
    'Mai incidentata',
  ]);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const { vehicle, price } = report;
  const reliability = report.reliability || ({} as any);
  const vehicleName = [vehicle.make, vehicle.model, vehicle.version].filter(Boolean).join(' ');
  const year = report.price?.inputYear || vehicle.year || new Date().getFullYear();

  const suggestedPrice = price.estimatedValue || 0;
  const minPrice = price.min || Math.round(suggestedPrice * 0.92);
  const startPrice = Math.round(suggestedPrice * 1.05);

  const HIGHLIGHTS_OPTIONS = [
    'Tagliandi regolari documentati',
    'Unico proprietario',
    'Mai incidentata',
    'Doppio treno di gomme estive/invernali',
    'Cinghia / Catena di distribuzione appena sostituita',
    'Ultimo tagliando eseguito di recente',
    'Bollo e revisione in regola',
    'Non fumatore, sempre in box',
  ];

  const toggleHighlight = (item: string) => {
    setSelectedHighlights((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const generateTitle = () => {
    const parts = [vehicle.make, vehicle.model];
    if (vehicle.version) parts.push(vehicle.version);
    if (year) parts.push(String(year));
    if (vehicle.fuel) parts.push(vehicle.fuel);
    if (km) parts.push(`${Number(km).toLocaleString('it-IT')} km`);
    if (includePassport) parts.push('- Profilo Verificato');
    return parts.join(' ');
  };

  const generateDescription = () => {
    const lines: string[] = [];

    if (platform === 'subito') {
      lines.push(`Vendo splendida ${vehicleName} anno ${year}.`);
      if (km) lines.push(`Chilometri effettivi: ${Number(km).toLocaleString('it-IT')} km (dimostrabili).`);
      lines.push(`Condizioni: ${condition === 'ottime' ? 'Ottime, tenuta con massima cura' : condition === 'buone' ? 'Buone, normali segni d\'uso' : condition}.`);
      if (vehicle.fuel) lines.push(`Alimentazione: ${vehicle.fuel} · Cambio: ${vehicle.transmission || 'Manuale'}.`);
      lines.push('');

      if (selectedHighlights.length > 0) {
        lines.push('Caratteristiche e punti di forza:');
        selectedHighlights.forEach((h) => lines.push(`• ${h}`));
        lines.push('');
      }

      if (extras.trim()) {
        lines.push(`Optional inclusi: ${extras.trim()}`);
        lines.push('');
      }

      if (includePassport) {
        lines.push('📋 PROFILO DIGITALE AUTO & STORICO DISPONIBILE:');
        lines.push('Tutta la documentazione, la cronologia tagliandi e la valutazione trasparente sono consultabili sul Profilo Digitale Auto AutoEsperto:');
        lines.push('https://autoesperto.it/passport');
        lines.push('');
      }

      lines.push(`Prezzo richiesto: ${suggestedPrice.toLocaleString('it-IT')} € (trattabile dopo visione).`);
      lines.push('Disponibile per qualsiasi prova su strada o controllo con vostro meccanico di fiducia.');
      lines.push('Contattare via messaggio o telefono.');
    } else if (platform === 'autoscout') {
      lines.push(`*** ${vehicleName.toUpperCase()} — ANNO ${year} ***`);
      lines.push('');
      lines.push('DESCRIZIONE DEL VEICOLO:');
      lines.push(`• Immatricolazione: ${year}`);
      if (km) lines.push(`• Chilometraggio: ${Number(km).toLocaleString('it-IT')} km certificati`);
      if (vehicle.power) lines.push(`• Potenza: ${vehicle.power}`);
      if (vehicle.fuel) lines.push(`• Alimentazione: ${vehicle.fuel}`);
      if (vehicle.euroClass) lines.push(`• Classe Ambientale: ${vehicle.euroClass}`);
      lines.push(`• Condizioni generali: ${condition}`);
      lines.push('');

      if (selectedHighlights.length > 0) {
        lines.push('NOTE PRINCIPALI & MANUTENZIONE:');
        selectedHighlights.forEach((h) => lines.push(`- ${h}`));
        lines.push('');
      }

      if (extras.trim()) {
        lines.push(`EQUIPAGGIAMENTO & OPTIONAL:`);
        lines.push(extras.trim());
        lines.push('');
      }

      if (includePassport) {
        lines.push('GARANZIA DI TRASPARENZA AUTOESPERTO:');
        lines.push('Questa vettura dispone di Profilo Digitale permanente con QR Code e storico manutenzione verificato:');
        lines.push('https://autoesperto.it/passport');
        lines.push('');
      }

      lines.push(`PREZZO DI VENDITA: ${suggestedPrice.toLocaleString('it-IT')} €`);
      lines.push('Massima serietà, no permute assurde né offerte al ribasso senza aver visto il veicolo.');
    } else {
      // Trasparente
      lines.push(`Vendo in piena trasparenza ${vehicleName} (${year}).`);
      if (km) lines.push(`Km reali e verificati: ${Number(km).toLocaleString('it-IT')} km.`);
      lines.push(`Quotazione di mercato calcolata su AutoEsperto: ${suggestedPrice.toLocaleString('it-IT')} €.`);
      lines.push('');

      if ((reliability.strengths || []).length > 0) {
        lines.push('Pregi del modello e di questo esemplare:');
        (reliability.strengths || []).slice(0, 3).forEach((s: string) => lines.push(`✓ ${s}`));
        lines.push('');
      }

      if (selectedHighlights.length > 0) {
        lines.push('Stato d\'uso e garanzie:');
        selectedHighlights.forEach((h) => lines.push(`✓ ${h}`));
        lines.push('');
      }

      if (includePassport) {
        lines.push('Link diretto al Profilo Digitale (Libretto & Tagliandi):');
        lines.push('https://autoesperto.it/passport');
        lines.push('');
      }

      lines.push(`Prezzo richiesto: ${suggestedPrice.toLocaleString('it-IT')} €.`);
      lines.push('Disponibile per visione e prova.');
    }

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
        className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 grid place-items-center shrink-0">
            <Megaphone className="w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Generatore Annuncio di Vendita Pronto con Profilo Digitale
            </p>
            <p className="text-xs text-slate-500">
              Testo ottimizzato per Subito, AutoScout24 e Facebook con QR Code e storico verificato
            </p>
          </div>
        </div>
        {expanded ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
      </button>

      {expanded && (
        <div className="border-t border-slate-100 p-4 sm:p-6 space-y-5 animate-slide-down">
          {/* Platform selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Stile e Piattaforma di Pubblicazione:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'subito', label: 'Subito.it / Marketplace', desc: 'Diretto e sintetico' },
                { id: 'autoscout', label: 'AutoScout24 PRO', desc: 'Dettagliato e formale' },
                { id: 'trasparente', label: 'Trasparenza Totale', desc: 'Con dati AutoEsperto' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlatform(p.id as any)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                    platform === p.id
                      ? 'bg-blue-50/80 border-blue-600 text-blue-900 ring-1 ring-blue-600 font-bold'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div>{p.label}</div>
                  <div className="text-[10px] text-slate-400 font-normal">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick inputs */}
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Chilometri Reali</label>
              <input
                type="number"
                value={km}
                onChange={(e) => setKm(e.target.value)}
                placeholder="es. 85000"
                className="w-full h-10 rounded-xl border border-slate-200 px-3 text-xs sm:text-sm font-semibold focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Condizioni Generali</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full h-10 rounded-xl border border-slate-200 px-3 text-xs sm:text-sm font-semibold focus:outline-none focus:border-blue-600 bg-white"
              >
                <option value="ottime">Ottime (Come nuova)</option>
                <option value="buone">Buone (Normale usura)</option>
                <option value="discrete">Discrete</option>
                <option value="da sistemare">Da ripristinare</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Optional Personalizzati</label>
              <input
                type="text"
                value={extras}
                onChange={(e) => setExtras(e.target.value)}
                placeholder="es. Tetto apribile, Fari LED, Gancio"
                className="w-full h-10 rounded-xl border border-slate-200 px-3 text-xs sm:text-sm font-semibold focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Highlights Checkbox Chips */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Punti di Forza da Evidenziare nell&apos;Annuncio:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {HIGHLIGHTS_OPTIONS.map((item) => {
                const isChecked = selectedHighlights.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleHighlight(item)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      isChecked
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    {isChecked && '✓ '}
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Include Passport Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/70 border border-blue-200/90">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-blue-900">
                Includi link e dicitura al Profilo Digitale Auto (Passport con QR Code)
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={includePassport}
                onChange={(e) => setIncludePassport(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
            </label>
          </div>

          {/* Price suggestion */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
            <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500 mb-2">
              Fascia di Prezzo Consigliata per la Vendita:
            </p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <p className="text-base sm:text-lg font-bold text-slate-800 number-mono">{minPrice.toLocaleString('it-IT')} €</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Prezzo Minimo</p>
              </div>
              <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-200">
                <p className="text-base sm:text-lg font-black text-blue-700 number-mono">{suggestedPrice.toLocaleString('it-IT')} €</p>
                <p className="text-[10px] text-blue-800 font-bold uppercase">Valore di Mercato</p>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <p className="text-base sm:text-lg font-bold text-slate-800 number-mono">{startPrice.toLocaleString('it-IT')} €</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Prezzo di Partenza</p>
              </div>
            </div>
          </div>

          {/* Generated title */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">Titolo Annuncio</label>
              <button
                type="button"
                onClick={() => copyToClipboard(generateTitle(), 'title')}
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                {copiedField === 'title' ? <><Check className="h-3.5 w-3.5 text-emerald-600" /> Copiato!</> : <><Copy className="h-3.5 w-3.5" /> Copia Titolo</>}
              </button>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-900">
              {generateTitle()}
            </div>
          </div>

          {/* Generated description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">Testo Completo Annuncio</label>
              <button
                type="button"
                onClick={() => copyToClipboard(generateDescription(), 'desc')}
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                {copiedField === 'desc' ? <><Check className="h-3.5 w-3.5 text-emerald-600" /> Copiato!</> : <><Copy className="h-3.5 w-3.5" /> Copia Tutto il Testo</>}
              </button>
            </div>
            <pre className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs sm:text-sm text-slate-800 whitespace-pre-wrap font-sans leading-relaxed">
              {generateDescription()}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
