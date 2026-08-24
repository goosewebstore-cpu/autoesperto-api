'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Car, CheckCircle2, Link2, Loader2, RotateCcw, Search, Sparkles } from 'lucide-react';
import type { AutoReport } from '@autoesperto/types';
import { freeScanManual } from '@/lib/api';
import { trackEvent } from '@/lib/analytics';
import { getAllMakes, slugify } from '@/lib/catalogo';
import { parseListingTextOrUrl, type ParsedAdData } from '@/lib/adParser';

interface BuyVerdict {
  tone: 'green' | 'amber' | 'red';
  label: string;
  description: string;
}

function euro(v: number) {
  return v.toLocaleString('it-IT') + ' €';
}

function roundTo100(v: number) {
  return Math.max(0, Math.round(v / 100) * 100);
}

function getBuyVerdict(price: AutoReport['price'], reliability: AutoReport['reliability']): BuyVerdict {
  const pct = price.priceVsMarketPercent;

  if (reliability.verdict === 'AVOID') {
    return {
      tone: 'red',
      label: 'Non conviene',
      description:
        'Problemi importanti o rapporto prezzo/condizioni sfavorevole. Fai controlli approfonditi o valuta alternative.',
    };
  }

  if (reliability.verdict === 'BUY' && (pct === undefined || pct <= 3)) {
    return {
      tone: 'green',
      label: 'Conviene',
      description:
        'Prezzo in linea o sotto la media di mercato, modello affidabile. Verifica l\u2019esemplare prima di concludere.',
    };
  }

  if (pct !== undefined && pct > 5) {
    return {
      tone: 'amber',
      label: 'Prezzo da trattare',
      description:
        'Prezzo richiesto sopra la fascia di mercato. Usa il prezzo consigliato come base di trattativa.',
    };
  }

  return {
    tone: 'amber',
    label: 'Attenzione',
    description:
      'Auto interessante, con aspetti da verificare prima di concludere.',
  };
}

const PHASES = [
  'Dati ricevuti',
  'Identificazione del modello',
  'Valutazione del mercato',
  'Controllo affidabilità',
  'Preparazione del verdetto',
];

const inputClass =
  'w-full h-12 px-4 rounded-xl border border-border bg-white text-text-primary font-medium outline-none focus:border-accent input-premium transition-all placeholder:text-text-tertiary';

export default function BuyCheck() {
  const [adInput, setAdInput] = useState('');
  const [parsedAd, setParsedAd] = useState<ParsedAdData | null>(null);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [km, setKm] = useState('');
  const [price, setPrice] = useState('');

  const [loading, setLoading] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [error, setError] = useState('');
  const [report, setReport] = useState<AutoReport | null>(null);
  const router = useRouter();

  const handleAdInputChange = (value: string) => {
    setAdInput(value);
    setError('');
    const parsed = parseListingTextOrUrl(value);
    setParsedAd(parsed);
    if (parsed.make) setMake(parsed.make);
    if (parsed.model) setModel(parsed.model);
    if (parsed.year) setYear(String(parsed.year));
    if (parsed.km) setKm(String(parsed.km));
    if (parsed.price) setPrice(String(parsed.price));
  };

  const brands = useMemo(() => getAllMakes(), []);

  const modelsForMake = useMemo(() => {
    const found = brands.find((b) => b.name.toLowerCase() === make.trim().toLowerCase());
    return found ? found.models : [];
  }, [brands, make]);

  const canSubmit =
    !loading &&
    make.trim().length >= 2 &&
    model.trim().length >= 1 &&
    year.length === 4 &&
    price.trim().length > 0;

  useEffect(() => {
    if (!loading) return;
    const timers = PHASES.map((_, i) => setTimeout(() => setPhaseIndex(i + 1), 550 * (i + 1)));
    return () => timers.forEach(clearTimeout);
  }, [loading]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    setError('');
    setReport(null);
    setPhaseIndex(0);
    setLoading(true);
    trackEvent('analysis_started', { analysis_type: 'manual', make: make.trim(), model: model.trim() });
    try {
      const kmNum = km.trim() ? Number.parseInt(km, 10) : undefined;
      const priceNum = Number.parseInt(price, 10);
      const result = await freeScanManual({
        make: make.trim(),
        model: model.trim(),
        year: Number.parseInt(year, 10),
        ...(kmNum ? { km: kmNum } : {}),
        ...(priceNum ? { requestedPrice: priceNum } : {}),
      });
      if (!result.recognized || !result.report) {
        setError(result.message || 'Non siamo riusciti a generare il verdetto. Riprova.');
        return;
      }
      setReport(result.report);
      trackEvent('analysis_completed', { make: result.vehicle?.make, model: result.vehicle?.model });
      trackEvent('result_viewed', { make: result.vehicle?.make, model: result.vehicle?.model });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      setError(
        message || 'Non siamo riusciti a completare la verifica. Controlla i dati inseriti e riprova.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setReport(null);
    setError('');
    setPhaseIndex(0);
  };

  if (report) {
    const v = getBuyVerdict(report.price, report.reliability);
    const { price: p, reliability: r, vehicle } = report;

    const checkList =
      r.advice.length > 0
        ? r.advice.slice(0, 5)
        : r.commonIssues.length > 0
          ? r.commonIssues.slice(0, 5)
          : r.weaknesses.slice(0, 5);

    const range = p.max - p.min;
    const requestedPct =
      range > 0
        ? Math.min(100, Math.max(0, (((p.requestedPrice || p.estimatedValue) - p.min) / range) * 100))
        : 50;

    const catalogLink = brands.some(
      (b) =>
        b.name.toLowerCase() === vehicle.make.toLowerCase() &&
        b.models.includes(vehicle.model)
    );
    const reportUrl = catalogLink
      ? `/valutazione/${slugify(vehicle.make)}/${slugify(vehicle.model)}`
      : '/valutazione';

    const toneStyles: Record<BuyVerdict['tone'], { badge: string; bg: string }> = {
      green: { badge: 'bg-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
      amber: { badge: 'bg-amber-500', bg: 'bg-amber-50 border-amber-200' },
      red: { badge: 'bg-red-600', bg: 'bg-red-50 border-red-200' },
    };

    return (
      <div className="animate-fade-in space-y-5">
        {/* Header veicolo */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-accent">
              Sto per comprare questa auto
            </p>
            <h1 className="mt-1 text-2xl md:text-3xl font-extrabold tracking-tight text-text-primary">
              {vehicle.make} {vehicle.model}
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              {[vehicle.year, vehicle.fuel, vehicle.body].filter(Boolean).join(' · ')}
              {p.inputKm ? ` · ${p.inputKm.toLocaleString('it-IT')} km` : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-text-secondary hover:border-accent hover:text-accent transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Nuova verifica
          </button>
        </div>

        {/* Verdetto */}
        <div className={`rounded-2xl border p-5 md:p-6 ${toneStyles[v.tone].bg}`}>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-extrabold text-white ${toneStyles[v.tone].badge}`}>
              {v.tone === 'green' ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
              {v.label}
            </span>
            {p.priceLabel === 'GOOD' && (
              <span className="text-xs font-bold text-emerald-700">Prezzo sotto la media di mercato</span>
            )}
            {p.priceLabel === 'HIGH' && (
              <span className="text-xs font-bold text-amber-700">Prezzo sopra la media di mercato</span>
            )}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-text-primary">{v.description}</p>
        </div>

        {/* Prezzo richiesto vs valore stimato */}
        <div className="rounded-2xl border border-border bg-white p-5 md:p-6 shadow-card">
          <h2 className="text-sm font-bold text-text-primary mb-4">
            Quanto vale rispetto a quanto chiedono?
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-surface-2 p-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-text-tertiary">
                Prezzo richiesto
              </div>
              <div className="mt-1 text-2xl font-extrabold text-text-primary number-mono">
                {p.requestedPrice ? euro(p.requestedPrice) : '—'}
              </div>
            </div>
            <div className="rounded-xl bg-surface-2 p-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-text-tertiary">
                Valore stimato
              </div>
              <div className="mt-1 text-2xl font-extrabold text-text-primary number-mono">
                {euro(p.min)} – {euro(p.max)}
              </div>
            </div>
          </div>

          <div className="mt-5">
            <div className="relative h-2.5 rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-400">
              <div
                className="absolute -top-1.5 h-6 w-1.5 rounded-full bg-slate-900 ring-2 ring-white"
                style={{ left: `calc(${requestedPct}% - 3px)` }}
                aria-hidden="true"
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-text-tertiary">
              <span>{euro(p.min)}</span>
              {p.priceVsMarketPercent !== undefined && (
                <span className="text-text-secondary">
                  Prezzo richiesto {p.priceVsMarketPercent > 0 ? '+' : ''}
                  {p.priceVsMarketPercent}% vs stima
                </span>
              )}
              <span>{euro(p.max)}</span>
            </div>
            {p.market?.total ? (
              <p className="mt-2 text-[11px] text-text-tertiary">
                Media calcolata su {p.market.total} annunci simili in vendita.
                {p.market.fetchedAt
                  ? ` Ultimo aggiornamento: ${new Date(p.market.fetchedAt).toLocaleDateString('it-IT')}.`
                  : ''}
              </p>
            ) : null}
            {p.market?.comparison?.disclosure && (
              <p className="mt-1 text-[11px] text-text-tertiary leading-relaxed">
                {p.market.comparison.disclosure}
              </p>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-accent/20 bg-accent/5 p-4">
            <div>
              <div className="text-xs font-bold text-accent">Prezzo consigliato</div>
              <div className="mt-0.5 text-[11px] text-text-tertiary">
                Base di trattativa con il venditore
              </div>
            </div>
            <div className="text-xl font-extrabold text-text-primary number-mono">
              {euro(roundTo100(p.min))} – {euro(roundTo100(p.estimatedValue))}
            </div>
          </div>

          <p className="mt-3 text-[11px] text-text-tertiary leading-relaxed">
            La stima è basata sui prezzi pubblicati negli annunci disponibili e può differire dal
            prezzo finale di vendita.
          </p>
        </div>

        {/* Cosa controllare prima di comprare */}
        {checkList.length > 0 && (
          <div className="rounded-2xl border border-border bg-white p-5 md:p-6 shadow-card">
            <h2 className="mb-3 text-sm font-bold text-text-primary">
              Prima di comprarla, controlla
            </h2>
            <ol className="space-y-2.5">
              {checkList.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-text-secondary">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-surface-2 text-xs font-extrabold text-accent">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Affidabilità */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-border bg-white p-4 text-center shadow-sm">
            <div className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
              Affidabilità
            </div>
            <div className="mt-1 text-xl font-extrabold text-text-primary number-mono">
              {r.score.toFixed(1)}
              <span className="text-xs text-text-tertiary">/10</span>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-white p-4 text-center shadow-sm">
            <div className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
              Costi
            </div>
            <div className="mt-1 text-xl font-extrabold text-text-primary capitalize">
              {r.maintenance}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-white p-4 text-center shadow-sm">
            <div className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
              Manutenzione annua
            </div>
            <div className="mt-1 text-xl font-extrabold text-text-primary number-mono">
              {euro(r.futureCosts.annualMaintenance)}
            </div>
          </div>
        </div>

        <Link
          href={reportUrl}
          className="flex h-12 items-center justify-center gap-2 rounded-xl bg-accent text-sm font-bold text-white hover:bg-accent-hover transition-colors"
        >
          Vedi il report completo di {vehicle.make} {vehicle.model}
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <p className="text-xs font-bold uppercase tracking-wider text-accent">Mi conviene comprarla?</p>
      <h1 className="mt-1 text-2xl md:text-3xl font-extrabold tracking-tight text-text-primary">
        Sto per comprare questa auto
      </h1>
      <p className="mt-2 text-sm text-text-secondary leading-relaxed">
        Inserisci dati e prezzo richiesto. Verdetto su conviene o no, valore e cosa controllare.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-2xl border border-border bg-white p-5 md:p-6 shadow-card space-y-4"
      >
        {/* Quick Paste Ad Box */}
        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-2">
          <label htmlFor="buy-ad-input" className="block text-xs font-bold text-blue-900 flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5 text-blue-600" />
            Hai il link dell&apos;annuncio o il testo dell&apos;offerta?
          </label>
          <input
            id="buy-ad-input"
            type="text"
            value={adInput}
            onChange={(e) => handleAdInputChange(e.target.value)}
            placeholder="Incolla link AutoScout24, Subito.it o testo annuncio (es. 'Fiat Panda 2021 45000 km 9500 €')..."
            className="w-full h-11 px-3.5 rounded-xl border border-blue-300 bg-white text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-600 transition-all"
          />
          {parsedAd && (parsedAd.make || parsedAd.model || parsedAd.year || parsedAd.price) && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] font-bold text-blue-700">
              <Sparkles className="w-3 h-3" />
              <span>Dati rilevati:</span>
              {parsedAd.make && <span className="bg-white px-2 py-0.5 rounded-md border">{parsedAd.make}</span>}
              {parsedAd.model && <span className="bg-white px-2 py-0.5 rounded-md border">{parsedAd.model}</span>}
              {parsedAd.year && <span className="bg-white px-2 py-0.5 rounded-md border">{parsedAd.year}</span>}
              {parsedAd.price && <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-300">{parsedAd.price.toLocaleString('it-IT')} €</span>}
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="buy-make" className="block text-xs font-semibold text-text-secondary mb-1.5">
              Marca
            </label>
            <input
              id="buy-make"
              type="text"
              list="buy-makes"
              autoComplete="off"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              placeholder="Es. Fiat"
              className={inputClass}
            />
            <datalist id="buy-makes">
              {brands.map((b) => <option key={b.name} value={b.name} />)}
            </datalist>
          </div>
          <div>
            <label htmlFor="buy-model" className="block text-xs font-semibold text-text-secondary mb-1.5">
              Modello
            </label>
            <input
              id="buy-model"
              type="text"
              list="buy-models"
              autoComplete="off"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Es. 500"
              className={inputClass}
            />
            <datalist id="buy-models">
              {modelsForMake.map((m) => <option key={m} value={m} />)}
            </datalist>
          </div>
          <div>
            <label htmlFor="buy-year" className="block text-xs font-semibold text-text-secondary mb-1.5">
              Anno
            </label>
            <input
              id="buy-year"
              type="number"
              inputMode="numeric"
              min="1950"
              max={new Date().getFullYear() + 1}
              value={year}
              onChange={(e) => setYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="Es. 2018"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="buy-km" className="block text-xs font-semibold text-text-secondary mb-1.5">
              Chilometri <span className="text-text-tertiary font-normal">(opzionale)</span>
            </label>
            <input
              id="buy-km"
              type="number"
              inputMode="numeric"
              value={km}
              onChange={(e) => setKm(e.target.value.replace(/\D/g, ''))}
              placeholder="Es. 87000"
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="buy-price" className="block text-xs font-semibold text-text-secondary mb-1.5">
              Prezzo richiesto dal venditore
            </label>
            <input
              id="buy-price"
              type="number"
              inputMode="numeric"
              value={price}
              onChange={(e) => setPrice(e.target.value.replace(/\D/g, ''))}
              placeholder="Es. 12000"
              className={inputClass}
            />
            <p className="mt-1.5 text-[11px] text-text-tertiary">
              Serve per capire se il prezzo è giusto rispetto al mercato.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent text-sm font-bold text-white hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Verifica in corso…</>
          ) : (
            <><Search className="h-4 w-4" /> Ottieni il verdetto</>
          )}
        </button>
      </form>

      {loading && (
        <div className="mt-5 rounded-2xl border border-border bg-white p-5 shadow-card">
          <p className="flex items-center gap-2 text-sm font-extrabold text-text-primary">
            <Loader2 className="h-4 w-4 animate-spin text-accent" /> Analisi in corso…
          </p>
          <div className="mt-4 space-y-2.5">
            {PHASES.map((phase, i) => (
              <div
                key={phase}
                className={`flex items-center gap-2.5 text-sm transition-all duration-300 ${i < phaseIndex ? 'text-text-primary' : 'text-text-tertiary'}`}
              >
                <span className={`grid h-6 w-6 place-items-center rounded-full ${i < phaseIndex ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                  {i < phaseIndex ? <CheckCircle2 className="h-3.5 w-3.5" /> : <span className="h-2 w-2 rounded-full bg-current" />}
                </span>
                {phase}
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div role="alert" className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-900">Non siamo riusciti a completare la verifica</p>
            <p className="mt-1 text-sm text-amber-800 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center gap-3 rounded-2xl border border-border bg-white p-4 text-sm text-text-secondary">
        <Car className="h-5 w-5 text-accent shrink-0" />
        <p>
          Il verdetto combina il valore di mercato (dagli annunci in vendita) e l&apos;affidabilità del
          modello. È indicativo: non sostituisce un&apos;ispezione fisica.
        </p>
      </div>
    </div>
  );
}