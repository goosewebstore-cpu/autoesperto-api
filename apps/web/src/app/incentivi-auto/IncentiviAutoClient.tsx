'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Zap,
  BatteryCharging,
  Car,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Percent,
  Banknote,
  ShieldCheck,
} from 'lucide-react';

type Co2Band = '0-20' | '21-60' | '61-135' | 'used';
type ScrapClass = 'none' | 'euro5' | 'euro4' | 'euro3' | 'euro0-2';

export default function IncentiviAutoClient() {
  const [band, setBand] = useState<Co2Band>('0-20');
  const [scrap, setScrap] = useState<ScrapClass>('euro3');
  const [lowIsee, setLowIsee] = useState<boolean>(false);
  const [carPrice, setCarPrice] = useState<number>(32000);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Incentive Calculation
  const result = useMemo(() => {
    let maxPriceIvaInc = 42700; // default 35k + IVA
    let incentive = 0;
    let isEligible = true;
    let reason = '';

    if (band === '0-20') {
      maxPriceIvaInc = 42700;
      if (scrap === 'none') {
        incentive = lowIsee ? 7500 : 6000;
      } else if (scrap === 'euro5') {
        incentive = lowIsee ? 7500 : 6000; // Euro 5 gets standard or none depending on decree
      } else if (scrap === 'euro4') {
        incentive = lowIsee ? 11250 : 9000;
      } else if (scrap === 'euro3') {
        incentive = lowIsee ? 12500 : 10000;
      } else if (scrap === 'euro0-2') {
        incentive = lowIsee ? 13750 : 11000;
      }
    } else if (band === '21-60') {
      maxPriceIvaInc = 54900; // 45k + IVA
      if (scrap === 'none') {
        incentive = lowIsee ? 5000 : 4000;
      } else if (scrap === 'euro5') {
        incentive = lowIsee ? 5000 : 4000;
      } else if (scrap === 'euro4') {
        incentive = lowIsee ? 6875 : 5500;
      } else if (scrap === 'euro3') {
        incentive = lowIsee ? 7500 : 6000;
      } else if (scrap === 'euro0-2') {
        incentive = lowIsee ? 10000 : 8000;
      }
    } else if (band === '61-135') {
      maxPriceIvaInc = 42700;
      // Low isee has no extra bonus on band 3
      if (scrap === 'none') {
        incentive = 0;
        isEligible = false;
        reason = 'Per la fascia 61-135 g/km (termiche e ibride) è obbligatoria la rottamazione di un veicolo fino a Euro 4.';
      } else if (scrap === 'euro5') {
        incentive = 0;
        isEligible = false;
        reason = 'La rottamazione di un Euro 5 non dà diritto a incentivi sulla fascia 61-135 g/km.';
      } else if (scrap === 'euro4') {
        incentive = 1500;
      } else if (scrap === 'euro3') {
        incentive = 2000;
      } else if (scrap === 'euro0-2') {
        incentive = 3000;
      }
    } else if (band === 'used') {
      maxPriceIvaInc = 30500; // 25k + IVA
      if (scrap === 'none' || scrap === 'euro5') {
        incentive = 0;
        isEligible = false;
        reason = 'Sull\'usato è richiesta la rottamazione di un veicolo fino a Euro 4 di proprietà da almeno 12 mesi.';
      } else {
        incentive = 2000;
      }
    }

    const priceOverCap = carPrice > maxPriceIvaInc;
    const finalPrice = Math.max(0, carPrice - incentive);

    return {
      incentive,
      isEligible: isEligible && !priceOverCap,
      priceOverCap,
      maxPriceIvaInc,
      finalPrice,
      reason,
    };
  }, [band, scrap, lowIsee, carPrice]);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-20">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-text-tertiary mb-6">
        <ol className="inline-flex items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-accent transition-colors">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <span className="text-text-secondary font-medium">Incentivi Auto ed Ecobonus 2026</span>
          </li>
        </ol>
      </nav>

      {/* Hero */}
      <header className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200/80 px-3.5 py-1.5 text-xs font-bold text-emerald-700 mb-4 shadow-sm">
          <Sparkles className="h-3.5 w-3.5" />
          Fondi e Tabelle Ufficiali Ecobonus 2026
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
          Calcolo Incentivi Auto ed Ecobonus 2026
        </h1>
        <p className="mt-3.5 text-base sm:text-lg text-slate-600 leading-relaxed">
          Simula subito lo <strong>sconto statale esatto</strong> per l&apos;acquisto della tua nuova auto: seleziona le emissioni, la classe dell&apos;auto da rottamare e calcola il contributo con bonus ISEE fino a <strong>13.750 €</strong>.
        </p>
      </header>

      {/* Interactive Simulator */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
        {/* Left Inputs */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-900/5 space-y-6">
          {/* Step 1: Vehicle Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              1. Tipologia e fascia di emissioni dell&apos;auto da acquistare
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setBand('0-20')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  band === '0-20'
                    ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-bold text-slate-900">Elettrica 100%</span>
                </div>
                <span className="text-xs text-slate-500 block">0 - 20 g/km CO2 (Fino a 13.750 €)</span>
              </button>

              <button
                type="button"
                onClick={() => setBand('21-60')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  band === '21-60'
                    ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <BatteryCharging className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-bold text-slate-900">Ibrida Plug-in (PHEV)</span>
                </div>
                <span className="text-xs text-slate-500 block">21 - 60 g/km CO2 (Fino a 10.000 €)</span>
              </button>

              <button
                type="button"
                onClick={() => setBand('61-135')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  band === '61-135'
                    ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Car className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-bold text-slate-900">Benzina / Diesel / Hybrid</span>
                </div>
                <span className="text-xs text-slate-500 block">61 - 135 g/km CO2 (Fino a 3.000 €)</span>
              </button>

              <button
                type="button"
                onClick={() => setBand('used')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  band === 'used'
                    ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Banknote className="h-4 w-4 text-indigo-600" />
                  <span className="text-sm font-bold text-slate-900">Auto Usata Euro 6</span>
                </div>
                <span className="text-xs text-slate-500 block">Fino a 160 g/km (2.000 € fissi)</span>
              </button>
            </div>
          </div>

          {/* Step 2: Scrap Car */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              2. Veicolo da rottamare (classe ambientale Euro)
            </label>
            <select
              value={scrap}
              onChange={(e) => setScrap(e.target.value as ScrapClass)}
              className="w-full appearance-none rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none"
            >
              <option value="euro0-2">Rottamazione Euro 0, Euro 1, Euro 2 (Sconto Massimo)</option>
              <option value="euro3">Rottamazione Euro 3</option>
              <option value="euro4">Rottamazione Euro 4</option>
              <option value="euro5">Rottamazione Euro 5</option>
              <option value="none">Nessun veicolo da rottamare</option>
            </select>
            <p className="text-xs text-slate-500 mt-1.5">
              Il veicolo da rottamare deve essere intestato all&apos;acquirente (o a un familiare convivente) da almeno 12 mesi.
            </p>
          </div>

          {/* Step 3: ISEE and Price */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={lowIsee}
                onChange={(e) => setLowIsee(e.target.checked)}
                className="h-5 w-5 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
              />
              <div>
                <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Percent className="h-4 w-4 text-emerald-600" />
                  ISEE familiare inferiore a 30.000 € (+25% extra bonus)
                </span>
                <span className="text-xs text-slate-500 block">
                  Aumenta il contributo sulle auto 100% elettriche e ibride plug-in.
                </span>
              </div>
            </label>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Prezzo di listino dell&apos;auto (IVA inclusa)
                </label>
                <span className="text-xs font-bold text-slate-500">
                  Tetto max: {result.maxPriceIvaInc.toLocaleString('it-IT')} €
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="5000"
                  max="120000"
                  step="500"
                  value={carPrice}
                  onChange={(e) => setCarPrice(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-lg font-black text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Result Card */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <span className="text-xs font-bold tracking-wider uppercase text-emerald-400 mb-1 block">
              Contributo Ecobonus Spettante
            </span>

            {result.priceOverCap ? (
              <div className="bg-rose-950/60 border border-rose-800 rounded-2xl p-4 my-3 text-xs text-rose-200">
                <AlertCircle className="h-4 w-4 text-rose-400 inline mr-1.5 -mt-0.5" />
                <strong>Prezzo oltre il tetto massimo:</strong> Il modello supera il limite di {result.maxPriceIvaInc.toLocaleString('it-IT')} € IVA inclusa e non beneficia dell&apos;incentivo statale.
              </div>
            ) : !result.isEligible && result.reason ? (
              <div className="bg-amber-950/60 border border-amber-800 rounded-2xl p-4 my-3 text-xs text-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-400 inline mr-1.5 -mt-0.5" />
                {result.reason}
              </div>
            ) : (
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl sm:text-5xl font-black text-emerald-400">
                  - {result.incentive.toLocaleString('it-IT')} €
                </span>
                <span className="text-xs font-semibold text-slate-400">sconto diretto</span>
              </div>
            )}

            <div className="border-t border-slate-800 pt-4 space-y-3 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Prezzo di listino iniziale:</span>
                <span className="font-bold text-white">{carPrice.toLocaleString('it-IT')} €</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Sconto statale applicato:</span>
                <span className="font-bold text-emerald-400">- {result.isEligible ? result.incentive.toLocaleString('it-IT') : 0} €</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
                <span>Prezzo finale stimato:</span>
                <span className="text-emerald-300 font-black">
                  {(result.isEligible ? result.finalPrice : carPrice).toLocaleString('it-IT')} €
                </span>
              </div>
            </div>
          </div>

          {/* Value Your Car CTA */}
          <div className="bg-emerald-50 rounded-3xl p-5 border border-emerald-200 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-emerald-950">Vuoi vendere la tua auto invece di rottamarla?</h3>
              <p className="text-xs text-emerald-700 mt-0.5">
                Controlla se vale più sul mercato dell&apos;usato rispetto al contributo di rottamazione.
              </p>
            </div>
            <Link
              href="/vendi"
              className="inline-flex items-center gap-1.5 shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              Valuta usata <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Summary Table */}
      <section className="mb-16">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Tabella Ufficiale Incentivi Auto 2026
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Schema riepilogativo degli importi con e senza maggiorazione ISEE.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 overflow-x-auto shadow-sm">
          <table className="w-full text-xs text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                <th className="p-4">Fascia Emissioni</th>
                <th className="p-4">No Rottamazione</th>
                <th className="p-4">Rott. Euro 4</th>
                <th className="p-4">Rott. Euro 3</th>
                <th className="p-4">Rott. Euro 0-2</th>
                <th className="p-4">Max Listino</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-emerald-800">
                  0-20 g/km (Elettriche)
                  <span className="block text-[11px] text-slate-400 font-normal">Con ISEE &lt; 30k (+25%)</span>
                </td>
                <td className="p-4">6.000 €<span className="block text-emerald-700 font-semibold">(7.500 €)</span></td>
                <td className="p-4">9.000 €<span className="block text-emerald-700 font-semibold">(11.250 €)</span></td>
                <td className="p-4">10.000 €<span className="block text-emerald-700 font-semibold">(12.500 €)</span></td>
                <td className="p-4 font-bold text-slate-900">11.000 €<span className="block text-emerald-700 font-black">(13.750 €)</span></td>
                <td className="p-4">42.700 €</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-blue-800">
                  21-60 g/km (Plug-in)
                  <span className="block text-[11px] text-slate-400 font-normal">Con ISEE &lt; 30k (+25%)</span>
                </td>
                <td className="p-4">4.000 €<span className="block text-blue-700 font-semibold">(5.000 €)</span></td>
                <td className="p-4">5.500 €<span className="block text-blue-700 font-semibold">(6.875 €)</span></td>
                <td className="p-4">6.000 €<span className="block text-blue-700 font-semibold">(7.500 €)</span></td>
                <td className="p-4 font-bold text-slate-900">8.000 €<span className="block text-blue-700 font-black">(10.000 €)</span></td>
                <td className="p-4">54.900 €</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-amber-800">
                  61-135 g/km (Termiche/Hybrid)
                </td>
                <td className="p-4 text-slate-400">—</td>
                <td className="p-4">1.500 €</td>
                <td className="p-4">2.000 €</td>
                <td className="p-4 font-bold text-slate-900">3.000 €</td>
                <td className="p-4">42.700 €</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-indigo-800">
                  Auto Usata Euro 6 (&lt;160 g/km)
                </td>
                <td className="p-4 text-slate-400">—</td>
                <td className="p-4" colSpan={3}>2.000 € fissi (rottamando veicolo fino a Euro 4)</td>
                <td className="p-4">30.500 €</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQs */}
      <section className="mb-16 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 mb-2">
            <HelpCircle className="h-3.5 w-3.5" /> Domande Frequenti
          </div>
          <h2 className="text-2xl font-black text-slate-900">Tutto sugli Incentivi Auto 2026</h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'Chi richiede materialmente il contributo Ecobonus?',
              a: 'Il contributo statale non va richiesto dall\'acquirente allo Stato: viene gestito direttamente dalla concessionaria tramite la piattaforma ufficiale Invitalia/MIMIT e applicato come sconto immediato sul contratto di acquisto.',
            },
            {
              q: 'Posso rottamare l\'auto di un genitore o parente?',
              a: 'Sì, a patto che il proprietario del veicolo da rottamare risulti nello stesso stato di famiglia (stesso nucleo anagrafico/convivente) da almeno 12 mesi.',
            },
            {
              q: 'Cosa succede se i fondi statali si esauriscono?',
              a: 'I fondi vengono erogati fino a esaurimento delle risorse stanziate. La fascia 61-135 g/km (auto termiche e mild hybrid) è tradizionalmente quella che si esaurisce più velocemente (spesso in pochi giorni), mentre per le elettriche e plug-in le risorse durano più a lungo.',
            },
            {
              q: 'C\'è un vincolo di mantenimento della proprietà?',
              a: 'Sì: per beneficiare dell\'Ecobonus è obbligatorio mantenere la proprietà del nuovo veicolo acquistato per almeno 12 mesi (24 mesi in caso di noleggio o persona giuridica).',
            },
          ].map((faq, idx) => (
            <div
              key={faq.q}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left font-bold text-sm text-slate-900 hover:text-emerald-700"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform ${
                    openFaq === idx ? 'rotate-180 text-emerald-600' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="rounded-3xl bg-slate-900 p-8 sm:p-10 text-white text-center">
        <span className="grid h-12 w-12 mx-auto place-items-center rounded-2xl bg-emerald-500/20 text-emerald-400 mb-4">
          <Sparkles className="h-6 w-6" />
        </span>
        <h2 className="text-2xl sm:text-3xl font-black mb-3">
          Trova la tua prossima auto con AutoEsperto
        </h2>
        <p className="text-sm text-slate-300 max-w-xl mx-auto mb-6">
          Scopri quotazioni reali, difetti noti e consumi di oltre 4.200 modelli di auto nuove e usate.
        </p>
        <Link
          href="/#scanner-section"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-900/40"
        >
          Analizza un&apos;auto gratis <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </main>
  );
}
