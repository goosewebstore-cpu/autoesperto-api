'use client';

import type { AutoReport } from '@autoesperto/types';
import { AlertTriangle, CheckCircle2, XCircle, Gauge, Wrench, Fuel, Shield, Users, Navigation, GraduationCap, TrendingDown } from 'lucide-react';
import { useState } from 'react';
import { askAutoEsperto } from '@/lib/api';
import PDFButton from '@/components/PDFButton';

function getVerdictColor(verdict: string) {
  if (verdict === 'BUY') return 'bg-success/10 text-success';
  if (verdict === 'NEGOTIATE') return 'bg-warning/10 text-warning';
  return 'bg-danger/10 text-danger';
}

function getVerdictIcon(verdict: string) {
  if (verdict === 'BUY') return <CheckCircle2 className="w-8 h-8" />;
  if (verdict === 'NEGOTIATE') return <AlertTriangle className="w-8 h-8" />;
  return <XCircle className="w-8 h-8" />;
}

function formatPrice(n: number) {
  return n.toLocaleString('it-IT') + ' €';
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-surface-2 rounded-2xl p-4">
      <div className="text-xs font-medium text-text-secondary mb-2">{label}</div>
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold text-text-primary w-10">{value.toFixed(1)}</span>
        <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full" style={{ width: `${value * 10}%` }} />
        </div>
      </div>
    </div>
  );
}

export default function ReportView({ report }: { report: AutoReport }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const { vehicle, reliability, price } = report;

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
    <div className="space-y-6 pb-20">
      {/* Hero */}
      <section className="bg-surface rounded-3xl shadow-card overflow-hidden">
        {vehicle.imageUrl && (
          <img src={vehicle.imageUrl} alt={`${vehicle.make} ${vehicle.model}`} className="w-full h-52 md:h-72 object-cover" />
        )}
        <div className="p-6 md:p-8">
          {vehicle.plate && (
            <span className="inline-block bg-text-primary text-white px-4 py-1.5 rounded-lg text-sm font-bold tracking-widest mb-3">
              {vehicle.plate}
            </span>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight mb-2">
            {vehicle.make} {vehicle.model}
          </h1>
          <p className="text-text-secondary text-lg">
            {[vehicle.version, vehicle.year, vehicle.fuel, vehicle.body].filter(Boolean).join(' · ')}
          </p>
        </div>
      </section>

      {/* Score */}
      <section className="bg-surface rounded-3xl shadow-card p-6 md:p-8 text-center">
        <h2 className="text-lg font-semibold text-text-secondary mb-4">Indice di affidabilità</h2>
        <div className={`inline-flex items-center justify-center gap-3 px-6 py-4 rounded-2xl ${getVerdictColor(reliability.verdict)} mb-3`}>
          {getVerdictIcon(reliability.verdict)}
          <div className="text-left">
            <div className="text-4xl font-extrabold tracking-tight">{reliability.score.toFixed(1)}<span className="text-2xl font-medium opacity-70">/10</span></div>
            <div className="text-sm font-semibold">{reliability.verdictLabel}</div>
          </div>
        </div>
        <p className="text-text-secondary max-w-xl mx-auto">{reliability.summary}</p>
      </section>

      {/* Price */}
      <section className="bg-text-primary rounded-3xl shadow-card p-6 md:p-8 text-white">
        <div className="flex items-start justify-between mb-2">
          <span className="text-white/70 text-sm font-medium">Valore di mercato stimato</span>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10">
            {price.requestedPrice ? price.comment.split('.')[0] : 'Allineato al mercato'}
          </span>
        </div>
        <div className="text-4xl md:text-5xl font-bold mb-2">{formatPrice(price.estimatedValue)}</div>
        <div className="text-white/80 mb-6">Range: {formatPrice(price.min)} – {formatPrice(price.max)}</div>
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
          <div><div className="text-xl font-bold">{formatPrice(price.listings[0].price)}</div><div className="text-xs text-white/60">Minimo</div></div>
          <div><div className="text-xl font-bold">{formatPrice(Math.round(price.listings.reduce((a, l) => a + l.price, 0) / price.listings.length))}</div><div className="text-xs text-white/60">Media</div></div>
          <div><div className="text-xl font-bold">{formatPrice(price.listings[price.listings.length - 1].price)}</div><div className="text-xs text-white/60">Massimo</div></div>
        </div>
        {price.requestedPrice && (
          <div className="mt-4 text-sm bg-white/10 rounded-xl p-3">
            Prezzo richiesto: <strong>{formatPrice(price.requestedPrice)}</strong> — {price.comment}
          </div>
        )}
      </section>

      {/* Specs */}
      <section>
        <h2 className="text-xl font-bold text-text-primary mb-4">Scheda tecnica</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: 'Marca', value: vehicle.make },
            { label: 'Modello', value: vehicle.model },
            { label: 'Versione', value: vehicle.version },
            { label: 'Anno', value: vehicle.year },
            { label: 'Alimentazione', value: vehicle.fuel },
            { label: 'Potenza', value: vehicle.power },
            { label: 'Cilindrata', value: vehicle.displacement },
            { label: 'Cambio', value: vehicle.transmission },
            { label: 'Carrozzeria', value: vehicle.body },
            { label: 'Porte', value: vehicle.doors },
            { label: 'Colore', value: vehicle.color },
            { label: 'Classe Euro', value: vehicle.euroClass },
          ].filter((s) => s.value).map((s) => (
            <div key={s.label} className="bg-surface rounded-2xl p-4 shadow-card">
              <div className="text-xs font-medium text-text-secondary mb-1">{s.label}</div>
              <div className="text-base font-semibold text-text-primary">{s.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Analysis */}
      <section>
        <h2 className="text-xl font-bold text-text-primary mb-4">Analisi AutoEsperto</h2>
        <div className="bg-surface rounded-3xl shadow-card p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-border">
            <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center text-accent">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="text-lg font-bold text-text-primary">{reliability.verdictLabel}</div>
              <div className="text-text-secondary">{reliability.summary}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ScoreBar label="Affidabilità modello" value={reliability.score} />
            <ScoreBar label="Comfort" value={7.5} />
            <ScoreBar label="Rivendibilità" value={Math.max(4, 10 - (2026 - (vehicle.year || 2020)) * 0.4)} />
            <ScoreBar label="Qualità/prezzo" value={Math.min(9, Math.max(5, 10 - Math.abs((price.priceVsMarketPercent || 0)) / 5))} />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-text-primary mb-2 flex items-center gap-2"><Gauge className="w-4 h-4" /> Motore</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{reliability.engine}</p>
            </div>
            <div>
              <h3 className="font-semibold text-text-primary mb-2 flex items-center gap-2"><Wrench className="w-4 h-4" /> Cambio</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{reliability.transmission}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-text-primary mb-3">Problemi più comuni</h3>
            <ul className="space-y-2">
              {reliability.commonIssues.slice(0, 4).map((issue, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Usage */}
      <section>
        <h2 className="text-xl font-bold text-text-primary mb-4">Adatta per</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {             icon: <Navigation className="w-5 h-5" />, label: 'Città', value: reliability.usage.city  },
            { icon: <Users className="w-5 h-5" />, label: 'Famiglia', value: reliability.usage.family },
            { icon: <Fuel className="w-5 h-5" />, label: 'Viaggi lunghi', value: reliability.usage.highway },
            { icon: <GraduationCap className="w-5 h-5" />, label: 'Neopatentati', value: reliability.usage.newDriver },
          ].map((u) => (
            <div key={u.label} className="bg-surface rounded-2xl p-4 shadow-card text-center">
              <div className="flex justify-center text-accent mb-2">{u.icon}</div>
              <div className="text-xs text-text-secondary mb-1">{u.label}</div>
              <div className="text-sm font-semibold text-text-primary">{u.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Costs */}
      <section>
        <h2 className="text-xl font-bold text-text-primary mb-4">Costi stimati</h2>
        <div className="bg-surface rounded-3xl shadow-card p-6 md:p-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div><div className="text-2xl font-bold text-text-primary">{formatPrice(reliability.futureCosts.annualMaintenance)}</div><div className="text-xs text-text-secondary">Manutenzione/anno</div></div>
            <div><div className="text-2xl font-bold text-text-primary">{reliability.futureCosts.fuelCostPer100Km.toFixed(0)} €</div><div className="text-xs text-text-secondary">Carburante/100km</div></div>
            <div><div className="text-2xl font-bold text-text-primary">{formatPrice(reliability.futureCosts.insuranceEstimate)}</div><div className="text-xs text-text-secondary">Assicurazione/anno</div></div>
          </div>
          <div className="border-t border-border pt-6">
            <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2"><TrendingDown className="w-4 h-4" /> Svalutazione stimata</h3>
            <div className="grid grid-cols-3 gap-4">
              <div><div className="text-lg font-bold text-text-primary">-{formatPrice(reliability.futureCosts.depreciation1Year)}</div><div className="text-xs text-text-secondary">1 anno</div></div>
              <div><div className="text-lg font-bold text-text-primary">-{formatPrice(reliability.futureCosts.depreciation3Years)}</div><div className="text-xs text-text-secondary">3 anni</div></div>
              <div><div className="text-lg font-bold text-text-primary">-{formatPrice(reliability.futureCosts.depreciation5Years)}</div><div className="text-xs text-text-secondary">5 anni</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* Market listings */}
      <section>
        <h2 className="text-xl font-bold text-text-primary mb-4">Annunci simili</h2>
        <div className="bg-surface rounded-3xl shadow-card overflow-hidden">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <span className="text-sm font-semibold text-text-secondary">Auto simili in vendita</span>
            <span className="text-sm text-text-secondary">{price.listings.length} annunci</span>
          </div>
          <div className="divide-y divide-border">
            {price.listings.map((l) => (
              <a key={l.id} href={l.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 hover:bg-surface-2 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-accent text-white flex items-center justify-center text-lg font-bold flex-shrink-0">
                  {l.source.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-text-primary truncate">{l.title}</div>
                  <div className="text-sm text-text-secondary">{l.km.toLocaleString('it-IT')} km · {l.city}</div>
                  <div className="text-xs text-accent font-medium">{l.source}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-text-primary">{formatPrice(l.price)}</div>
                  <div className="text-xl text-text-tertiary">›</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* AI Chat */}
      <section>
        <h2 className="text-xl font-bold text-text-primary mb-4">Chiedi ad AutoEsperto</h2>
        <div className="bg-surface rounded-3xl shadow-card p-6 md:p-8">
          <form onSubmit={handleAsk} className="flex gap-3 mb-4">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Es. Conviene comprarla? Quali problemi ha?"
              className="flex-1 h-12 px-4 rounded-xl border border-border bg-surface-2 text-text-primary outline-none focus:border-accent transition-all"
            />
            <button
              type="submit"
              disabled={loadingAI || !question.trim()}
              className="h-12 px-5 rounded-xl bg-text-primary text-white font-semibold disabled:opacity-50 hover:bg-gray-800 transition-colors"
            >
              {loadingAI ? '...' : 'Chiedi'}
            </button>
          </form>
          {answer && (
            <div className="bg-surface-2 rounded-2xl p-4 text-text-secondary text-sm leading-relaxed">
              <strong className="text-text-primary">AutoEsperto:</strong> {answer}
            </div>
          )}
        </div>
      </section>

      {/* Alternatives */}
      <section>
        <h2 className="text-xl font-bold text-text-primary mb-4">Alternative consigliate</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {report.alternatives.map((a, i) => (
            <div key={i} className="bg-surface rounded-2xl p-4 shadow-card text-center">
              <div className="font-semibold text-text-primary">{a.make} {a.model}</div>
              <div className="text-xs text-text-secondary mt-1">Confronta prezzi</div>
            </div>
          ))}
        </div>
      </section>

      {/* PDF */}
      <section>
        <PDFButton report={report} />
      </section>

      {/* Videos */}
      <section>
        <h2 className="text-xl font-bold text-text-primary mb-4">Video e recensioni</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {report.videos.map((v, i) => (
            <a key={i} href={v.url} target="_blank" rel="noopener noreferrer" className="bg-surface rounded-2xl shadow-card overflow-hidden hover:shadow-card-hover transition-shadow">
              <div className="h-36 bg-surface-2 flex items-center justify-center text-text-tertiary">
                ▶ Video
              </div>
              <div className="p-4 font-semibold text-text-primary text-sm">{v.title}</div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
