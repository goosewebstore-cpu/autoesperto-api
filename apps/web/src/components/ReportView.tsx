'use client';

import type { AutoReport } from '@autoesperto/types';
import {
  AlertTriangle, CheckCircle2, XCircle, Gauge, Wrench, Fuel, Shield, Users,
  Navigation, GraduationCap, TrendingDown, Car, MapPin, ExternalLink,
  MessageSquare, Download, ChevronRight, ArrowLeft, Search,
  BarChart3, Euro, Zap, Percent, Hash
} from 'lucide-react';
import { useState } from 'react';
import { askAutoEsperto } from '@/lib/api';

function formatPrice(n: number) {
  return n.toLocaleString('it-IT') + ' €';
}

function formatKm(n: number) {
  return n.toLocaleString('it-IT') + ' km';
}

function getVerdictConfig(verdict: string) {
  if (verdict === 'BUY') return {
    bg: 'bg-success-light',
    text: 'text-success',
    border: 'border-success/20',
    badge: 'verdict-buy',
    icon: CheckCircle2,
    label: 'Consigliata',
    labelLong: 'Auto consigliata',
  };
  if (verdict === 'NEGOTIATE') return {
    bg: 'bg-warning-light',
    text: 'text-warning',
    border: 'border-warning/20',
    badge: 'verdict-negotiate',
    icon: AlertTriangle,
    label: 'Trattativa',
    labelLong: 'Valuta attentamente',
  };
  return {
    bg: 'bg-danger-light',
    text: 'text-danger',
    border: 'border-danger/20',
    badge: 'verdict-avoid',
    icon: XCircle,
    label: 'Sconsigliata',
    labelLong: 'Possibili problemi',
  };
}

function ScoreMeter({ label, value, maxValue = 10 }: { label: string; value: number; maxValue?: number }) {
  const pct = Math.min(100, (value / maxValue) * 100);
  const color = value >= 7.5 ? 'bg-success' : value >= 6 ? 'bg-warning' : 'bg-danger';
  return (
    <div className="bg-surface-2 rounded-2xl p-4 card-hover">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-text-secondary">{label}</span>
        <span className="text-lg font-bold text-text-primary number-mono">{value.toFixed(1)}</span>
      </div>
      <div className="h-2 bg-border rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

interface ReportViewProps {
  report: AutoReport;
  onBack?: () => void;
}

export default function ReportView({ report, onBack }: ReportViewProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const { vehicle, reliability, price } = report;

  const verdict = getVerdictConfig(reliability.verdict);
  const VerdictIcon = verdict.icon;

  const askAIEnabled = !!process.env.NEXT_PUBLIC_AI_ENABLED;

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoadingAI(true);
    try {
      const res = await askAutoEsperto(question, vehicle, reliability);
      setAnswer(res.answer);
    } catch (err: any) {
      setAnswer('Errore nella risposta AI: ' + err.message);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Back button */}
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors px-1 py-1">
          <ArrowLeft className="w-4 h-4" />
          Nuova ricerca
        </button>
      )}

      {/* Hero */}
      <section className="bg-white rounded-4xl shadow-card border border-border/50 overflow-hidden card-hover">
        {vehicle.imageUrl && (
          <div className="relative h-64 md:h-80 bg-surface-2 overflow-hidden">
            <img
              src={vehicle.imageUrl}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
        )}
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            {vehicle.plate && (
              <span className="inline-flex items-center gap-1.5 bg-text-primary text-white px-3.5 py-1.5 rounded-xl text-sm font-bold tracking-[0.15em]">
                <Hash className="w-3.5 h-3.5 opacity-70" />
                {vehicle.plate}
              </span>
            )}
            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-bold text-white ${verdict.badge}`}>
              <VerdictIcon className="w-3.5 h-3.5" />
              {verdict.label}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-text-primary tracking-tight mb-2">
            {vehicle.make} {vehicle.model}
          </h1>
          <p className="text-text-secondary text-base md:text-lg flex flex-wrap items-center gap-2">
            <span>{vehicle.version}</span>
            {vehicle.year && <><span className="w-1 h-1 rounded-full bg-text-tertiary" /><span>{vehicle.year}</span></>}
            {vehicle.fuel && <><span className="w-1 h-1 rounded-full bg-text-tertiary" /><span>{vehicle.fuel}</span></>}
            {vehicle.body && <><span className="w-1 h-1 rounded-full bg-text-tertiary" /><span>{vehicle.body}</span></>}
          </p>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: <Gauge className="w-4 h-4" />, label: 'Potenza', value: vehicle.power || 'N/D' },
          { icon: <Fuel className="w-4 h-4" />, label: 'Alimentazione', value: vehicle.fuel || 'N/D' },
          { icon: <Wrench className="w-4 h-4" />, label: 'Cambio', value: vehicle.transmission || 'N/D' },
          { icon: <Gauge className="w-4 h-4" />, label: 'Chilometraggio medio', value: price.listings.length > 0 ? formatKm(Math.round(price.listings.reduce((a, l) => a + l.km, 0) / price.listings.length)) : 'N/D' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-card border border-border/50 text-center card-hover">
            <div className="flex justify-center text-accent mb-2">{s.icon}</div>
            <div className="text-xs font-medium text-text-secondary mb-0.5">{s.label}</div>
            <div className="text-sm font-bold text-text-primary">{s.value}</div>
          </div>
        ))}
      </section>

      {/* Verdict + Score */}
      <section className="bg-white rounded-4xl shadow-card border border-border/50 p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className={`flex-shrink-0 w-24 h-24 rounded-3xl flex items-center justify-center ${verdict.bg} border ${verdict.border}`}>
            <VerdictIcon className={`w-12 h-12 ${verdict.text}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <span className={`text-4xl md:text-5xl font-extrabold text-text-primary number-mono`}>
                {reliability.score.toFixed(1)}
                <span className="text-xl md:text-2xl font-medium text-text-secondary">/10</span>
              </span>
              <span className={`px-3 py-1 rounded-xl text-sm font-bold text-white ${verdict.badge}`}>
                {verdict.labelLong}
              </span>
            </div>
            <p className="text-text-secondary leading-relaxed">{reliability.summary}</p>
          </div>
        </div>
      </section>

      {/* Price Analysis */}
      <section className="bg-white rounded-4xl shadow-card border border-border/50 overflow-hidden">
        <div className="gradient-bg p-6 md:p-8 text-white">
          <div className="flex items-center justify-between mb-1">
            <span className="text-white/80 text-sm font-semibold flex items-center gap-2">
              <Euro className="w-4 h-4" />
              Valore di mercato stimato
            </span>
            {price.requestedPrice && (
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                Math.abs(price.priceVsMarketPercent || 0) <= 10
                  ? 'bg-white/20 text-white'
                  : (price.priceVsMarketPercent || 0) > 10
                  ? 'bg-danger/30 text-white'
                  : 'bg-success/30 text-white'
              }`}>
                {price.priceVsMarketPercent !== undefined
                  ? `${price.priceVsMarketPercent > 0 ? '+' : ''}${price.priceVsMarketPercent}% vs mercato`
                  : 'Prezzo stimato'}
              </span>
            )}
          </div>
          <div className="text-4xl md:text-5xl font-extrabold mb-1 number-mono">
            {formatPrice(price.estimatedValue)}
          </div>
          <div className="text-white/70 text-sm mb-4">
            Range: {formatPrice(price.min)} – {formatPrice(price.max)}
          </div>

          {/* Km-adjusted value */}
          {price.adjustedForKm && price.adjustedForKm > 0 && (
            <div className="bg-white/10 rounded-2xl p-4 mb-4 border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <Gauge className="w-4 h-4" />
                  Valore con {formatKm(price.inputKm || 0)}
                </div>
                <span className="text-xl font-bold text-white number-mono">{formatPrice(price.adjustedForKm)}</span>
              </div>
              {price.kmAdjustment && price.kmAdjustment > 0 && (
                <div className="text-xs text-white/60 mt-1">
                  Adeguamento km: -{formatPrice(price.kmAdjustment)}
                </div>
              )}
            </div>
          )}

          {price.requestedPrice && (
            <div className={`rounded-2xl p-4 border ${
              Math.abs(price.priceVsMarketPercent || 0) <= 10
                ? 'bg-white/10 border-white/10'
                : (price.priceVsMarketPercent || 0) > 10
                ? 'bg-danger/20 border-danger/30'
                : 'bg-success/20 border-success/30'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-white/80 text-sm">Prezzo richiesto</span>
                <span className="text-xl font-bold text-white number-mono">{formatPrice(price.requestedPrice)}</span>
              </div>
              <p className="text-white/70 text-xs mt-2">{price.comment}</p>
            </div>
          )}
        </div>

        {/* Market summary */}
        <div className="p-6 md:p-8 border-t border-border/50">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Confronto mercato</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-surface-2 rounded-2xl p-4 text-center">
              <div className="text-xs font-medium text-text-secondary mb-1">Minimo</div>
              <div className="text-lg font-bold text-text-primary number-mono">{formatPrice(price.listings[0]?.price || 0)}</div>
            </div>
            <div className="bg-accent-light rounded-2xl p-4 text-center border border-accent/10">
              <div className="text-xs font-medium text-accent mb-1">Media</div>
              <div className="text-lg font-bold text-accent number-mono">
                {formatPrice(Math.round(price.listings.reduce((a, l) => a + l.price, 0) / price.listings.length))}
              </div>
            </div>
            <div className="bg-surface-2 rounded-2xl p-4 text-center">
              <div className="text-xs font-medium text-text-secondary mb-1">Massimo</div>
              <div className="text-lg font-bold text-text-primary number-mono">{formatPrice(price.listings[price.listings.length - 1]?.price || 0)}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Score bars */}
      <section className="bg-white rounded-4xl shadow-card border border-border/50 p-6 md:p-8">
        <h2 className="text-lg font-bold text-text-primary mb-5 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-accent" />
          Punteggi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ScoreMeter label="Affidabilità modello" value={reliability.score} />
          <ScoreMeter label="Comfort e qualità" value={7.5} />
          <ScoreMeter label="Rivendibilità" value={Math.max(4, 10 - (2026 - (vehicle.year || 2020)) * 0.4)} />
          <ScoreMeter label="Rapporto qualità/prezzo" value={Math.min(9, Math.max(5, 10 - Math.abs((price.priceVsMarketPercent || 0)) / 5))} />
        </div>
      </section>

      {/* Specs */}
      <section className="bg-white rounded-4xl shadow-card border border-border/50 p-6 md:p-8">
        <h2 className="text-lg font-bold text-text-primary mb-5 flex items-center gap-2">
          <Car className="w-5 h-5 text-accent" />
          Scheda tecnica
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {[
            { label: 'Marca', value: vehicle.make },
            { label: 'Modello', value: vehicle.model },
            { label: 'Versione', value: vehicle.version },
            { label: 'Anno', value: vehicle.year?.toString() },
            { label: 'Alimentazione', value: vehicle.fuel },
            { label: 'Potenza', value: vehicle.power },
            { label: 'Cilindrata', value: vehicle.displacement },
            { label: 'Cambio', value: vehicle.transmission },
            { label: 'Carrozzeria', value: vehicle.body },
            { label: 'Porte', value: vehicle.doors?.toString() },
            { label: 'Colore', value: vehicle.color },
            { label: 'Classe Euro', value: vehicle.euroClass },
          ].filter((s) => s.value).map((s) => (
            <div key={s.label} className="bg-surface-2 rounded-2xl p-3.5 card-hover">
              <div className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-1">{s.label}</div>
              <div className="text-sm font-bold text-text-primary">{s.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Analysis */}
      <section className="bg-white rounded-4xl shadow-card border border-border/50 p-6 md:p-8">
        <h2 className="text-lg font-bold text-text-primary mb-5 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-accent" />
          Analisi del veicolo
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Strengths */}
          <div className="bg-success-light rounded-3xl p-5 border border-success/10">
            <h3 className="font-bold text-success flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-4 h-4" />
              Punti di forza
            </h3>
            <ul className="space-y-3">
              {reliability.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-text-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-success mt-2 flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="bg-danger-light rounded-3xl p-5 border border-danger/10">
            <h3 className="font-bold text-danger flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4" />
              Punti deboli
            </h3>
            <ul className="space-y-3">
              {reliability.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-text-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-danger mt-2 flex-shrink-0" />
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Engine and transmission */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-surface-2 rounded-2xl p-4">
            <h4 className="font-bold text-text-primary mb-2 flex items-center gap-2 text-sm">
              <Gauge className="w-4 h-4 text-accent" />
              Motore
            </h4>
            <p className="text-sm text-text-secondary leading-relaxed">{reliability.engine}</p>
          </div>
          <div className="bg-surface-2 rounded-2xl p-4">
            <h4 className="font-bold text-text-primary mb-2 flex items-center gap-2 text-sm">
              <Wrench className="w-4 h-4 text-accent" />
              Cambio
            </h4>
            <p className="text-sm text-text-secondary leading-relaxed">{reliability.transmission}</p>
          </div>
        </div>

        {/* Common issues */}
        <div>
          <h4 className="font-bold text-text-primary mb-3 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warning" />
            Problemi più comuni
          </h4>
          <div className="grid md:grid-cols-2 gap-2">
            {reliability.commonIssues.slice(0, 6).map((issue, i) => (
              <div key={i} className="flex items-start gap-3 bg-surface-2 rounded-xl p-3.5 text-sm text-text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                {issue}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Usage */}
      <section className="bg-white rounded-4xl shadow-card border border-border/50 p-6 md:p-8">
        <h2 className="text-lg font-bold text-text-primary mb-5 flex items-center gap-2">
          <Users className="w-5 h-5 text-accent" />
          Adatta per
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: <Navigation className="w-5 h-5" />, label: 'Città', value: reliability.usage.city },
            { icon: <Users className="w-5 h-5" />, label: 'Famiglia', value: reliability.usage.family },
            { icon: <Fuel className="w-5 h-5" />, label: 'Viaggi lunghi', value: reliability.usage.highway },
            { icon: <GraduationCap className="w-5 h-5" />, label: 'Neopatentati', value: reliability.usage.newDriver },
          ].map((u, i) => (
            <div key={i} className="bg-surface-2 rounded-2xl p-5 text-center card-hover">
              <div className="flex justify-center text-accent mb-2">{u.icon}</div>
              <div className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-0.5">{u.label}</div>
              <div className="text-sm font-bold text-text-primary">{u.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Costs */}
      <section className="bg-white rounded-4xl shadow-card border border-border/50 overflow-hidden">
        <div className="p-6 md:p-8">
          <h2 className="text-lg font-bold text-text-primary mb-5 flex items-center gap-2">
            <Euro className="w-5 h-5 text-accent" />
            Costi stimati
          </h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-surface-2 rounded-2xl p-4 text-center card-hover">
              <div className="text-xs font-medium text-text-secondary mb-1">Manutenzione/anno</div>
              <div className="text-xl md:text-2xl font-bold text-text-primary number-mono">{formatPrice(reliability.futureCosts.annualMaintenance)}</div>
            </div>
            <div className="bg-surface-2 rounded-2xl p-4 text-center card-hover">
              <div className="text-xs font-medium text-text-secondary mb-1">Carburante/100km</div>
              <div className="text-xl md:text-2xl font-bold text-text-primary number-mono">{reliability.futureCosts.fuelCostPer100Km.toFixed(0)} €</div>
            </div>
            <div className="bg-surface-2 rounded-2xl p-4 text-center card-hover">
              <div className="text-xs font-medium text-text-secondary mb-1">Assicurazione/anno</div>
              <div className="text-xl md:text-2xl font-bold text-text-primary number-mono">{formatPrice(reliability.futureCosts.insuranceEstimate)}</div>
            </div>
          </div>
        </div>

        {/* Depreciation */}
        <div className="border-t border-border/50 p-6 md:p-8">
          <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2 text-sm">
            <TrendingDown className="w-4 h-4 text-warning" />
            Svalutazione stimata
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="relative bg-warning-light rounded-2xl p-4 border border-warning/10">
              <div className="text-xs font-medium text-warning mb-1">1 anno</div>
              <div className="text-lg font-bold text-text-primary number-mono">-{formatPrice(reliability.futureCosts.depreciation1Year)}</div>
              <div className="absolute top-3 right-3 text-warning/30">
                <Percent className="w-4 h-4" />
              </div>
            </div>
            <div className="relative bg-orange-50 rounded-2xl p-4 border border-orange-200/50">
              <div className="text-xs font-medium text-orange-600 mb-1">3 anni</div>
              <div className="text-lg font-bold text-text-primary number-mono">-{formatPrice(reliability.futureCosts.depreciation3Years)}</div>
              <div className="absolute top-3 right-3 text-orange-300">
                <Percent className="w-4 h-4" />
              </div>
            </div>
            <div className="relative bg-danger-light rounded-2xl p-4 border border-danger/10">
              <div className="text-xs font-medium text-danger mb-1">5 anni</div>
              <div className="text-lg font-bold text-text-primary number-mono">-{formatPrice(reliability.futureCosts.depreciation5Years)}</div>
              <div className="absolute top-3 right-3 text-danger/30">
                <Percent className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Annunci Simili */}
      <section className="bg-white rounded-4xl shadow-card border border-border/50 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-border/50">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <Search className="w-5 h-5 text-accent" />
              Annunci simili
            </h2>
            <span className="text-xs font-semibold text-text-secondary bg-surface-2 px-3 py-1 rounded-full">
              {price.listings.length} annunci
            </span>
          </div>
          <p className="text-sm text-text-secondary mt-1">
            {vehicle.make} {vehicle.model} — stessi anno e km simili
          </p>
        </div>
        <div className="divide-y divide-border/50">
          {price.listings.map((l) => (
            <a
              key={l.id}
              href={l.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 md:p-5 hover:bg-surface-2 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm"
                style={{ backgroundColor: l.source === 'AutoScout24' ? '#004170' : l.source === 'Subito.it' ? '#E60000' : l.source === 'Automobile.it' ? '#0A66C2' : '#1877F2' }}
              >
                {l.source === 'AutoScout24' ? 'A' : l.source === 'Subito.it' ? 'S' : l.source === 'Automobile.it' ? 'Au' : 'F'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-text-primary truncate group-hover:text-accent transition-colors">
                  {l.title}
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-secondary mt-0.5">
                  <span className="flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5" />
                    <strong className="font-semibold">{formatKm(l.km)}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {l.city}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-semibold text-accent bg-accent-light px-2 py-0.5 rounded-lg">
                    {l.source}
                  </span>
                  <span className="text-xs text-text-tertiary">
                    {l.year}
                  </span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xl font-extrabold text-text-primary number-mono">{formatPrice(l.price)}</div>
                <div className="flex items-center gap-1 text-xs text-accent font-semibold mt-0.5 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  Vedi annuncio
                  <ExternalLink className="w-3 h-3" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Chat + PDF */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Chat */}
        <section className="bg-white rounded-4xl shadow-card border border-border/50 p-6 md:p-8">
          <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-accent" />
            Domande sul veicolo
          </h2>
          <form onSubmit={handleAsk} className="flex gap-2">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Es. Conviene comprarla?"
              className="flex-1 h-12 px-4 rounded-2xl border-2 border-border bg-surface-2 text-text-primary text-sm outline-none focus:border-accent focus:bg-white input-premium transition-all placeholder:text-text-tertiary"
            />
            <button
              type="submit"
              disabled={loadingAI || !question.trim()}
              className="h-12 px-5 rounded-2xl gradient-bg text-white font-semibold text-sm disabled:opacity-50 hover:shadow-premium active:scale-[0.98] transition-all flex items-center gap-2"
            >
              {loadingAI ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              <span className="hidden md:inline">Chiedi</span>
            </button>
          </form>
          {answer && (
            <div className="mt-4 bg-surface-2 rounded-2xl p-4 animate-slide-up">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-accent flex items-center justify-center">
                  <MessageSquare className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-xs font-bold text-text-primary">AutoEsperto</span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">{answer}</p>
            </div>
          )}
        </section>

        {/* PDF */}
        <section className="bg-white rounded-4xl shadow-card border border-border/50 p-6 md:p-8 flex flex-col">
          <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <Download className="w-5 h-5 text-accent" />
            Scarica Report
          </h2>
          <p className="text-sm text-text-secondary mb-4 flex-1">
            Scarica il report completo in PDF con tutti i dati, l&apos;analisi AI e gli annunci simili. Perfetto da portare in concessionaria.
          </p>
          <button
            onClick={() => {
              import('@/components/PDFButton').then(m => m.downloadPDF(report));
            }}
            className="w-full h-12 rounded-2xl bg-text-primary text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-800 active:scale-[0.98] transition-all"
          >
            <Download className="w-4 h-4" />
            Scarica PDF
          </button>
        </section>
      </div>

      {/* Alternatives */}
      {report.alternatives.length > 0 && (
        <section className="bg-white rounded-4xl shadow-card border border-border/50 p-6 md:p-8">
          <h2 className="text-lg font-bold text-text-primary mb-5 flex items-center gap-2">
            <Car className="w-5 h-5 text-accent" />
            Alternative consigliate
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {report.alternatives.map((a, i) => (
              <div key={i} className="bg-surface-2 rounded-2xl p-5 text-center card-hover border border-border/30">
                <div className="w-10 h-10 rounded-2xl bg-accent-light flex items-center justify-center mx-auto mb-3">
                  <Car className="w-5 h-5 text-accent" />
                </div>
                <div className="font-bold text-text-primary text-sm">{a.make}</div>
                <div className="text-xs text-text-secondary mb-3">{a.model}</div>
                <span className="inline-flex items-center gap-1 text-xs text-accent font-semibold">
                  Confronta
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Videos */}
      {report.videos.length > 0 && (
        <section className="bg-white rounded-4xl shadow-card border border-border/50 p-6 md:p-8">
          <h2 className="text-lg font-bold text-text-primary mb-5 flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" />
            Video e recensioni
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {report.videos.map((v, i) => (
              <a
                key={i}
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-surface-2 rounded-3xl overflow-hidden card-hover border border-border/30 group"
              >
                <div className="h-40 bg-gradient-to-br from-accent/5 to-accent/10 flex items-center justify-center relative">
                  <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <div className="w-0 h-0 border-l-[18px] border-l-accent border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1" />
                  </div>
                  <div className="absolute bottom-3 left-3 text-xs font-medium text-white/80 bg-black/30 px-2 py-1 rounded-lg">
                    YouTube
                  </div>
                </div>
                <div className="p-4">
                  <div className="font-bold text-text-primary text-sm group-hover:text-accent transition-colors">{v.title}</div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
