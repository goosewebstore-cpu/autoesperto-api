'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MapPin,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Car,
  Fuel,
  FileSearch,
} from 'lucide-react';

type FuelType = 'diesel' | 'benzina' | 'gpl-metano' | 'ibrida-elettrica';
type EuroClass = 'euro0' | 'euro1' | 'euro2' | 'euro3' | 'euro4' | 'euro5' | 'euro6' | 'euro6d';

interface CityStatus {
  zone: string;
  city: string;
  allowed: 'free' | 'restricted' | 'banned';
  message: string;
  details: string;
}

export default function BlocchiTrafficoClient() {
  const [fuel, setFuel] = useState<FuelType>('diesel');
  const [euro, setEuro] = useState<EuroClass>('euro5');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Status calculation for major cities
  const cityStatuses = useMemo<CityStatus[]>(() => {
    // 1. Milano Area B
    let milanoB: CityStatus = {
      zone: 'Area B (Quasi tutta la città)',
      city: 'Milano',
      allowed: 'free',
      message: 'Accesso libero',
      details: 'Nessuna limitazione in vigore.',
    };

    if (fuel === 'diesel') {
      if (['euro0', 'euro1', 'euro2', 'euro3', 'euro4', 'euro5'].includes(euro)) {
        milanoB.allowed = 'banned';
        milanoB.message = 'Vietato lun-ven 7:30-19:30';
        milanoB.details = 'Circolazione possibile solo con adesione a MoVe-In (tetto km annuo) o deroghe residenti.';
      }
    } else if (fuel === 'benzina') {
      if (['euro0', 'euro1', 'euro2'].includes(euro)) {
        milanoB.allowed = 'banned';
        milanoB.message = 'Vietato lun-ven 7:30-19:30';
        milanoB.details = 'Accesso vietato nei giorni feriali; possibile con Move-In.';
      }
    }

    // 2. Roma Fascia Verde
    let romaFV: CityStatus = {
      zone: 'Fascia Verde (ZTL Anello Ferroviario)',
      city: 'Roma',
      allowed: 'free',
      message: 'Accesso consentito',
      details: 'Circolazione libera dal lunedì al sabato.',
    };

    if (fuel === 'diesel') {
      if (['euro0', 'euro1', 'euro2', 'euro3'].includes(euro)) {
        romaFV.allowed = 'banned';
        romaFV.message = 'Divieto permanente h24 (lun-sab)';
        romaFV.details = 'Accesso vietato 24 ore su 24 dal lunedì al sabato (festivi esclusi).';
      } else if (euro === 'euro4') {
        romaFV.allowed = 'restricted';
        romaFV.message = 'Ammesso (blocco in allerta smog)';
        romaFV.details = 'Circola regolarmente ma viene bloccato in caso di livelli elevati di PM10.';
      }
    } else if (fuel === 'benzina') {
      if (['euro0', 'euro1', 'euro2'].includes(euro)) {
        romaFV.allowed = 'banned';
        romaFV.message = 'Divieto permanente h24 (lun-sab)';
        romaFV.details = 'Vietato dal lunedì al sabato.';
      }
    }

    // 3. Torino e Piemonte (Bacino Padano)
    let torino: CityStatus = {
      zone: 'Torino e 33 Comuni dell\'hinterland',
      city: 'Torino / Piemonte',
      allowed: 'free',
      message: 'Accesso consentito',
      details: 'Circolazione libera.',
    };

    if (fuel === 'diesel') {
      if (['euro0', 'euro1', 'euro2', 'euro3', 'euro4', 'euro5'].includes(euro)) {
        torino.allowed = 'restricted';
        torino.message = 'Blocco feriale 8:30-18:30 (Ott-Apr)';
        torino.details = 'Limitazioni stagionali invernali antismog; consentito con adesione a MoVe-In Piemonte.';
      }
    } else if (fuel === 'benzina') {
      if (['euro0', 'euro1', 'euro2'].includes(euro)) {
        torino.allowed = 'banned';
        torino.message = 'Blocco feriale h24 (Ott-Apr)';
        torino.details = 'Limitazione attiva nel periodo invernale.';
      }
    }

    // 4. Bologna ed Emilia-Romagna (PAIR)
    let bologna: CityStatus = {
      zone: 'Centro e Comuni sopra 30.000 abitanti',
      city: 'Bologna / E-R',
      allowed: 'free',
      message: 'Accesso consentito',
      details: 'Circolazione libera.',
    };

    if (fuel === 'diesel') {
      if (['euro0', 'euro1', 'euro2', 'euro3', 'euro4'].includes(euro)) {
        bologna.allowed = 'restricted';
        bologna.message = 'Vietato lun-ven 8:30-18:30 (Ott-Apr)';
        bologna.details = 'Limitazione invernale PAIR. In allerta emergenziale il divieto si estende agli Euro 5.';
      }
    } else if (fuel === 'benzina') {
      if (['euro0', 'euro1', 'euro2'].includes(euro)) {
        bologna.allowed = 'restricted';
        bologna.message = 'Vietato lun-ven 8:30-18:30 (Ott-Apr)';
        bologna.details = 'Limitazione attiva nel periodo autunno-inverno.';
      }
    }

    return [milanoB, romaFV, torino, bologna];
  }, [fuel, euro]);

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
            <span className="text-text-secondary font-medium">Blocchi Traffico e Classi Euro 2026</span>
          </li>
        </ol>
      </nav>

      {/* Hero */}
      <header className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200/80 px-3.5 py-1.5 text-xs font-bold text-emerald-700 mb-4 shadow-sm">
          <MapPin className="h-3.5 w-3.5" />
          Regole di Circolazione Urbane 2026
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
          Verifica Blocchi del Traffico e Classi Euro
        </h1>
        <p className="mt-3.5 text-base sm:text-lg text-slate-600 leading-relaxed">
          Seleziona il carburante e la classe ambientale della tua auto per verificare dove e quando puoi circolare a <strong>Milano (Area B/C), Roma (Fascia Verde), Torino, Bologna</strong> e scoprire le deroghe con scatola nera <strong>MoVe-In</strong>.
        </p>
      </header>

      {/* Selector Box */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-900/5 mb-12">
        <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-600 text-white text-xs font-bold">
            1
          </span>
          Seleziona i dati della tua vettura
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fuel selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Alimentazione del veicolo
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'diesel', label: 'Diesel / Gasolio' },
                { id: 'benzina', label: 'Benzina' },
                { id: 'gpl-metano', label: 'GPL / Metano' },
                { id: 'ibrida-elettrica', label: 'Ibrida / Elettrica' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFuel(f.id as FuelType)}
                  className={`p-3.5 rounded-2xl border text-xs font-bold text-left transition-all ${
                    fuel === f.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600/20'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Euro Class selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Classe ambientale Euro (punto V.9 libretto)
            </label>
            <select
              value={euro}
              onChange={(e) => setEuro(e.target.value as EuroClass)}
              className="w-full appearance-none rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none"
            >
              <option value="euro6d">Euro 6d / Euro 6d-TEMP / Euro 6e (Circolazione Libera Ovunque)</option>
              <option value="euro6">Euro 6 (6a, 6b, 6c)</option>
              <option value="euro5">Euro 5 (immatricolate indicativamente 2009 - 2015)</option>
              <option value="euro4">Euro 4 (immatricolate indicativamente 2006 - 2010)</option>
              <option value="euro3">Euro 3 (immatricolate indicativamente 2001 - 2005)</option>
              <option value="euro2">Euro 2 (immatricolate indicativamente 1997 - 2001)</option>
              <option value="euro1">Euro 1 (immatricolate indicativamente 1993 - 1996)</option>
              <option value="euro0">Euro 0 (pre-1992, non catalitiche)</option>
            </select>
            <p className="text-xs text-slate-500 mt-2">
              Verifica la voce <strong>(V.9)</strong> sul retro del Documento Unico per conoscere la normativa esatta.
            </p>
          </div>
        </div>
      </section>

      {/* Results Cities Grid */}
      <section className="mb-16">
        <h2 className="text-2xl font-black text-slate-900 mb-6">
          Esito circolazione nelle principali aree urbane
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cityStatuses.map((item) => {
            const isFree = item.allowed === 'free';
            const isRestricted = item.allowed === 'restricted';
            const isBanned = item.allowed === 'banned';

            const badgeBg = isFree
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : isRestricted
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-rose-50 text-rose-700 border-rose-200';

            return (
              <div
                key={item.city}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                        {item.city}
                      </span>
                      <h3 className="text-lg font-black text-slate-900">{item.zone}</h3>
                    </div>
                    <span className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${badgeBg}`}>
                      {item.allowed === 'free' ? 'Libero' : item.allowed === 'restricted' ? 'Limitato' : 'Bloccato'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    {isFree && <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />}
                    {isRestricted && <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />}
                    {isBanned && <XCircle className="h-5 w-5 text-rose-600 shrink-0" />}
                    <strong className="text-sm font-bold text-slate-900">{item.message}</strong>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.details}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    Auto selezionata: <strong>{fuel.toUpperCase()} {euro.toUpperCase()}</strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Move-In Explanatory Section */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 mb-16 relative overflow-hidden">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-2">
            <Sparkles className="h-4 w-4" /> La soluzione alternativa
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mb-3">
            Come continuare a circolare con il sistema MoVe-In
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
            Se la tua auto appartiene a una classe soggetta a blocco (es. Diesel Euro 4 o Euro 5), puoi installare una scatola nera telematica aderendo al servizio <strong>MoVe-In</strong> (attivo in Lombardia, Piemonte ed Emilia-Romagna). Ti viene assegnato un plafond annuale di chilometri (da 1.000 a 8.000 km in base a classe e veicolo) percorribili in qualsiasi orario.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700">
              <strong className="block text-emerald-400 text-sm font-bold">50 € / 1° anno</strong>
              <span className="text-slate-400">Installazione e fornitura scatola nera</span>
            </div>
            <div className="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700">
              <strong className="block text-emerald-400 text-sm font-bold">20 € / rinnovo</strong>
              <span className="text-slate-400">Canone annuale di monitoraggio</span>
            </div>
            <div className="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700">
              <strong className="block text-emerald-400 text-sm font-bold">Conteggio km</strong>
              <span className="text-slate-400">Solo sui tratti stradali vietati</span>
            </div>
          </div>
        </div>
      </section>

      {/* Guide: How to Read Euro on Libretto */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-16">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 mb-2">
            <FileSearch className="h-3.5 w-3.5" /> Come leggere il libretto
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            Dove trovare la classe Euro sul libretto di circolazione
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Prendi la Carta di Circolazione o Documento Unico e guarda il riquadro 2:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Campo (V.9) — Direttiva Europea</h3>
            <p className="leading-relaxed mb-3">
              Indica il codice della direttiva antinquinamento (es. <em>1999/96/CE, 2003/76/CE, 715/2007, 2018/1832</em>).
            </p>
            <ul className="space-y-1.5 text-slate-600">
              <li><strong>Euro 4:</strong> direttive 2003/76/CE-B, 2006/96/CE-B</li>
              <li><strong>Euro 5:</strong> direttive 715/2007*692/2008, 2009/125/CE</li>
              <li><strong>Euro 6:</strong> direttive 2015/45, 2016/646, 2018/1832 (6d-TEMP, 6d, 6e)</li>
            </ul>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Riquadro 3 — Descrizione testuale</h3>
            <p className="leading-relaxed mb-3">
              Nelle righe in basso al riquadro 3 spesso viene stampata la dicitura in chiaro (es. <em>RISPETTA IL REGOLAMENTO 2018/1832 EURO 6D-ISC-FCM</em>).
            </p>
            <p className="text-slate-500">
              Se hai dubbi, inserisci la targa nello strumento gratuito di AutoEsperto per conoscere la classe Euro all&apos;istante.
            </p>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="mb-16 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 mb-2">
            <HelpCircle className="h-3.5 w-3.5" /> Domande Frequenti
          </div>
          <h2 className="text-2xl font-black text-slate-900">FAQ Blocchi Traffico e Classi Euro</h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'Quali sanzioni rischio se entro in un\'area vietata?',
              a: 'La circolazione con un veicolo non autorizzato all\'interno delle ZTL ambientali (come Area B a Milano o Fascia Verde a Roma) comporta una multa compresa tra 168 € e 678 €. In caso di recidiva nel biennio è prevista la sospensione della patente da 15 a 30 giorni.',
            },
            {
              q: 'Le auto a GPL e Metano possono circolare sempre?',
              a: 'Nella quasi totalità dei casi sì: le auto con impianto a GPL o Metano (mono o bi-fuel benzina/GPL) sono esenti dai blocchi emergenziali e possono circolare regolarmente, ad eccezione degli impianti non omologati o installati su veicoli Euro 0.',
            },
            {
              q: 'Come faccio a vendere un\'auto soggetta a blocco?',
              a: 'Le auto Euro 4 e Euro 5 hanno ancora un forte mercato fuori dalle grandi metropoli (piccoli centri, province o per export). Con lo strumento di valutazione di AutoEsperto puoi conoscere il prezzo reale di realizzo per marca e modello.',
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
          Vuoi cambiare auto con una Euro 6 senza sorprese?
        </h2>
        <p className="text-sm text-slate-300 max-w-xl mx-auto mb-6">
          Analizza qualsiasi annuncio prima dell&apos;acquisto con AutoEsperto: prezzo giusto, consumi verificati e difetti noti.
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
