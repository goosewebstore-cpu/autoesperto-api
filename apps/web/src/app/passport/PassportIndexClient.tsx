'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Car,
  ShieldCheck,
  Plus,
  ArrowRight,
  Camera,
  FileText,
  Sparkles,
  Gauge,
  CheckCircle2,
  Calendar,
  AlertCircle,
  UploadCloud,
  ChevronRight,
  Activity,
  Layers,
  Wrench,
  Trash2,
  ExternalLink,
  Search,
  Lock,
  Share2,
  Tag,
  Fuel,
} from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import {
  getAllPassports,
  ensureSamplePassport,
  createNewPassport,
  deletePassport,
  computeDynamicHealthScore,
  claimPassportTransfer,
  getTrustBadgeForPassport,
} from '@/lib/passportStorage';
import { scanPassportDoc } from '@/lib/api';
import type { VehiclePassportData } from '@autoesperto/types';

// Preset dei modelli più popolari in Italia per compilazione istantanea
const POPULAR_MODELS_PRESETS = [
  { make: 'Fiat', model: 'Panda', year: 2022, fuel: 'Ibrida / Benzina', power: '70 CV', km: 34000 },
  { make: 'Fiat', model: '500', year: 2021, fuel: 'Ibrida / Benzina', power: '70 CV', km: 42000 },
  { make: 'Volkswagen', model: 'Golf', year: 2020, fuel: 'Diesel', power: '150 CV (110 kW)', km: 68000 },
  { make: 'BMW', model: 'Serie 3', year: 2021, fuel: 'Diesel Mild-Hybrid', power: '190 CV (140 kW)', km: 82400 },
  { make: 'Alfa Romeo', model: 'Giulia', year: 2020, fuel: 'Diesel', power: '190 CV (140 kW)', km: 74000 },
  { make: 'Jeep', model: 'Renegade', year: 2021, fuel: 'Diesel / Ibrida', power: '130 CV (96 kW)', km: 53000 },
  { make: 'Toyota', model: 'Yaris', year: 2022, fuel: 'Full Hybrid', power: '116 CV (85 kW)', km: 29000 },
  { make: 'Renault', model: 'Clio', year: 2021, fuel: 'Benzina / GPL', power: '100 CV', km: 48000 },
  { make: 'Peugeot', model: '208', year: 2022, fuel: 'Benzina / Elettrica', power: '100 CV', km: 38000 },
  { make: 'Ford', model: 'Puma', year: 2022, fuel: 'Mild-Hybrid EcoBoost', power: '125 CV', km: 41000 },
  { make: 'Audi', model: 'A3 Sportback', year: 2021, fuel: 'Diesel / Benzina', power: '150 CV', km: 62000 },
  { make: 'Mercedes-Benz', model: 'Classe A', year: 2021, fuel: 'Diesel', power: '150 CV', km: 66000 },
];

export default function PassportIndexClient() {
  const router = useRouter();
  const [passports, setPassports] = useState<VehiclePassportData[]>([]);
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2>(1);
  const [activeTab, setActiveTab] = useState<'targa' | 'rapido' | 'libretto' | 'manuale' | 'vin'>('targa');

  // Form states
  const [plate, setPlate] = useState('');
  const [vin, setVin] = useState('');
  const [make, setMake] = useState('Fiat');
  const [model, setModel] = useState('Panda');
  const [year, setYear] = useState('2022');
  const [fuel, setFuel] = useState('Ibrida / Benzina');
  const [power, setPower] = useState('70 CV');
  const [km, setKm] = useState('35000');
  const [insuranceExpiry, setInsuranceExpiry] = useState('');
  const [insuranceCompany, setInsuranceCompany] = useState('');
  const [revisionExpiry, setRevisionExpiry] = useState('');

  // AI OCR state
  const [scanning, setScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Claim Transfer state
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimInput, setClaimInput] = useState('');
  const [claimError, setClaimError] = useState('');

  const handleClaimPassport = () => {
    setClaimError('');
    if (!claimInput.trim()) {
      setClaimError('Inserisci un codice di trasferimento valido (es. TR-48291-1234)');
      return;
    }
    const res = claimPassportTransfer(claimInput);
    if (res.success && res.passport) {
      setShowClaimModal(false);
      refreshPassports();
      router.push(`/passport/${res.passport.id}`);
    } else {
      setClaimError(res.message);
    }
  };

  useEffect(() => {
    refreshPassports();
  }, []);

  const refreshPassports = () => {
    const existing = getAllPassports();
    if (existing.length === 0) {
      const sample = ensureSamplePassport();
      setPassports([sample]);
    } else {
      setPassports(existing);
    }
  };

  const handleSelectPreset = (preset: typeof POPULAR_MODELS_PRESETS[0]) => {
    setMake(preset.make);
    setModel(preset.model);
    setYear(String(preset.year));
    setFuel(preset.fuel);
    setPower(preset.power);
    setKm(String(preset.km));
    setWizardStep(2);
  };

  const handleCreatePassport = () => {
    const created = createNewPassport({
      vehicle: {
        make: make.trim() || 'Auto',
        model: model.trim() || 'Modello',
        year: Number(year) || 2022,
        fuel,
        power,
        plate: plate.toUpperCase().trim() || undefined,
        vin: vin.toUpperCase().trim() || undefined,
      },
      currentKm: Number(km) || 50000,
      insuranceExpiry: insuranceExpiry || undefined,
      insuranceCompany: insuranceCompany || undefined,
      revisionExpiry: revisionExpiry || undefined,
    });

    setShowWizard(false);
    refreshPassports();
    router.push(`/passport/${created.id}`);
  };

  const handleScanLibretto = async (file: File) => {
    setScanning(true);
    setScanMessage('Analisi del Documento Unico in corso con AI OCR...');
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        const res = await scanPassportDoc({
          fileBase64: base64,
          fileName: file.name,
          mimeType: file.type || 'application/pdf',
        });

        if (res.success && res.data?.extractedFields) {
          const f = res.data.extractedFields;
          if (f.make) setMake(f.make);
          if (f.model) setModel(f.model);
          if (f.year) setYear(String(f.year));
          if (f.fuel) setFuel(f.fuel);
          if (f.powerCv) setPower(`${f.powerCv} CV`);
          if (f.plate) setPlate(f.plate);
          if (f.vin) setVin(f.vin);
          if (f.revisionDate) setRevisionExpiry(f.nextRevisionDate || '');
          setWizardStep(2);
        } else {
          setWizardStep(2);
        }
        setScanning(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setScanning(false);
      setWizardStep(2);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Sei sicuro di voler rimuovere questo profilo auto dal tuo dispositivo?')) {
      deletePassport(id);
      refreshPassports();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-white">
      <SiteHeader />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Top Hero / Intro */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-blue-600/30 text-blue-300 text-xs font-black uppercase tracking-wider border border-blue-500/30">
              <Sparkles className="w-3.5 h-3.5" /> Profilo Digitale della tua Macchina
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              I tuoi Profili Auto &amp; Garage Digitale
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Conserva analisi, foto, documenti, valore e storico delle tue auto in un unico posto permanente. Sempre aggiornabile, condivisibile con QR code e protetto sul tuo dispositivo.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setWizardStep(1);
                  setShowWizard(true);
                }}
                className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-md shadow-blue-600/30 flex items-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4" /> Aggiungi Nuova Auto al Garage
              </button>

              <button
                onClick={() => {
                  setClaimError('');
                  setShowClaimModal(true);
                }}
                className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 transition-all"
              >
                <ArrowRight className="w-4 h-4 text-indigo-300" /> Riscatta Profilo Trasferito
              </button>

              <div className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white/10 text-emerald-300 text-xs font-bold border border-white/10">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>100% Privato: I dati rimangono sul tuo dispositivo</span>
              </div>
            </div>
          </div>
        </section>

        {/* List of Vehicles (The Garage) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Car className="w-5 h-5 text-blue-600" /> Le mie Auto nel Garage ({passports.length})
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setClaimError('');
                  setShowClaimModal(true);
                }}
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                Hai un codice di trasferimento?
              </button>
              <button
                onClick={() => {
                  setWizardStep(1);
                  setShowWizard(true);
                }}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Aggiungi auto
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {passports.map((p) => {
              const v = p.vehicle;
              const health = p.healthBreakdown || computeDynamicHealthScore(p);
              const photo =
                p.mainPhoto ||
                p.photos?.[0]?.url ||
                v.imageUrl ||
                'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80';

              return (
                <div
                  key={p.id}
                  onClick={() => router.push(`/passport/${p.id}`)}
                  className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Card Photo Header */}
                    <div className="relative aspect-16/9 bg-slate-950 overflow-hidden">
                      <img
                        src={photo}
                        alt={`${v.make} ${v.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
                            {p.shareCode}
                          </span>
                          <h3 className="text-sm font-black truncate leading-tight">
                            {v.make} {v.model}
                          </h3>
                        </div>

                        <div className="px-2.5 py-1 rounded-xl bg-blue-600 text-white font-black text-xs shadow-xs">
                          {health.totalScore}/100
                        </div>
                      </div>

                      {p.sellingConfig?.enabled && (
                        <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                          <Tag className="w-3 h-3" /> In Vendita
                        </div>
                      )}
                    </div>

                    {/* Card Body Details */}
                    <div className="p-4 space-y-3">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                        {v.year && <span>Anno {v.year}</span>}
                        {v.fuel && <span>· {v.fuel}</span>}
                        {v.power && <span>· {v.power}</span>}
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Chilometri</span>
                          <p className="text-xs font-black text-slate-900 dark:text-white">
                            {p.currentKm.toLocaleString('it-IT')} km
                          </p>
                        </div>

                        <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Stima Valore</span>
                          <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                            {p.estimatedValue ? `${p.estimatedValue.toLocaleString('it-IT')} €` : 'N/D'}
                          </p>
                        </div>
                      </div>

                      {/* Next Reminder Preview */}
                      {p.reminders?.[0] && (
                        <div className="p-2 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 text-[11px] flex items-center justify-between">
                          <span className="truncate font-semibold">{p.reminders[0].title}</span>
                          <span className="font-bold shrink-0 ml-1">
                            {p.reminders[0].daysRemaining !== undefined
                              ? `${p.reminders[0].daysRemaining} gg`
                              : `${p.reminders[0].kmRemaining} km`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold">
                    <span className="text-blue-600 group-hover:underline flex items-center gap-1">
                      Apri Profilo Digitale <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                    <button
                      onClick={(e) => handleDelete(p.id, e)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                      title="Elimina dal garage"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── FEATURE PILLARS SECTION ─── */}
        <section className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Tutto sotto controllo in un unico posto
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Tutte le funzionalità del Profilo Digitale Auto
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Uno strumento potente per chi possiede, cura o desidera vendere la propria auto al miglior prezzo.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 grid place-items-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Documento Unico &amp; Libretto</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Targa, telaio VIN, classe ambientale Euro, potenza kW/CV e omologazione sempre a portata di mano sul tuo smartphone.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 grid place-items-center">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Storico Tagliandi &amp; Fatture</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Registra ogni intervento di manutenzione ordinaria e straordinaria, allegando foto e fatture per certificare la cura del veicolo.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2.5">
              <div className="w-10 h-10 rounded-2xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 grid place-items-center">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Promemoria Scadenze Intelligente</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Avvisi automatici per la revisione ministeriale MCTC, scadenza bollo auto, rinnovo polizza RC e cambio gomme stagionale.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 grid place-items-center">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Vehicle Health Score Dinamico</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Indice oggettivo dello stato di salute meccanica (0-100) aggiornato in base ai km percorsi, età e regolarità dei tagliandi.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2.5">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 grid place-items-center">
                <Gauge className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Valore di Mercato in Tempo Reale</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Monitora la svalutazione e la quotazione reale aggiornata del tuo modello sul mercato italiano dell&apos;usato.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2.5">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 grid place-items-center">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Scheda QR Code per la Vendita</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Genera un link pubblico o un QR code da stampare o allegare al tuo annuncio. Gli acquirenti vedranno la cura del veicolo senza accedere ai tuoi dati personali.
              </p>
            </div>
          </div>
        </section>

        {/* ─── SEO FAQ SECTION ─── */}
        <section className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Domande Frequenti
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Tutto quello che c&apos;è da sapere sul Profilo Digitale Auto
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {[
              {
                q: "Cos'è il Profilo Digitale Auto (o Passaporto Digitale)?",
                a: "È il fascicolo permanente e gratuito della tua auto su AutoEsperto. Raccoglie in un unico luogo digitale tutti i dati del libretto, la cronologia dei tagliandi, lo stato di salute meccanica (Vehicle Health Score), le scadenze di bollo e revisione, le foto e l'andamento del valore di mercato.",
              },
              {
                q: "Quanto costa creare e mantenere il Profilo Digitale?",
                a: "Il servizio è 100% gratuito e non richiede abbonamenti. Puoi aggiungere tutte le auto del tuo nucleo familiare o del tuo parco veicoli.",
              },
              {
                q: "I miei dati personali e la targa sono protetti?",
                a: "Sì. Tutti i dati del tuo veicolo vengono memorizzati localmente e in sicurezza sul tuo dispositivo. Quando condividi la scheda pubblica per la vendita, i tuoi dati personali sensibili (indirizzo, nome completo, ecc.) restano protetti.",
              },
              {
                q: "Come aiuta il Profilo Digitale a vendere l'auto più velocemente?",
                a: "Mostrare agli acquirenti una cronologia trasparente di tagliandi, scadenze in regola e verdetto AutoEsperto elimina la diffidenza tipica del mercato dell'usato, velocizzando le trattative fino al 40% e difendendo il prezzo richiesto.",
              },
            ].map((faq, idx) => (
              <details
                key={idx}
                className="group rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 transition-all open:ring-1 open:ring-blue-500/20"
              >
                <summary className="flex cursor-pointer items-center justify-between font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  <span>{faq.q}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-90 shrink-0 ml-2" />
                </summary>
                <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* ─── BOTTOM CTA ─── */}
        <section className="my-10 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 sm:p-8 text-center space-y-4 shadow-xl shadow-blue-600/15">
          <h2 className="text-xl sm:text-3xl font-black tracking-tight">
            Pronto a creare il Profilo Digitale della tua auto?
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto">
            Bastano meno di 60 secondi: inserisci la targa o scegli il modello per generare subito il passaporto permanente.
          </p>
          <div className="pt-2 flex justify-center">
            <button
              onClick={() => {
                setWizardStep(1);
                setShowWizard(true);
              }}
              className="px-6 py-3.5 rounded-2xl bg-white text-blue-600 font-extrabold text-xs sm:text-sm shadow-md hover:bg-blue-50 active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Crea Profilo Auto Gratis
            </button>
          </div>
        </section>

        {/* Wizard Modal: Add New Car Profile */}
        {showWizard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
              {/* Wizard Header */}
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Aggiungi Auto al tuo Profilo Digitale
                  </h3>
                  <p className="text-[11px] text-slate-500">Passaggio {wizardStep} di 2</p>
                </div>
                <button
                  onClick={() => setShowWizard(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              </div>

              {/* Wizard Step 1: Input method */}
              {wizardStep === 1 && (
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                    <button
                      onClick={() => setActiveTab('targa')}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        activeTab === 'targa' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Targa
                    </button>
                    <button
                      onClick={() => setActiveTab('rapido')}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        activeTab === 'rapido' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Popolari
                    </button>
                    <button
                      onClick={() => setActiveTab('libretto')}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        activeTab === 'libretto' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Libretto
                    </button>
                    <button
                      onClick={() => setActiveTab('manuale')}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        activeTab === 'manuale' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Manuale
                    </button>
                  </div>

                  {activeTab === 'targa' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Inserisci la Targa dell&apos;auto
                        </label>
                        <input
                          type="text"
                          placeholder="Es. GA 123 AB"
                          value={plate}
                          onChange={(e) => setPlate(e.target.value)}
                          className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-mono font-bold uppercase tracking-wider"
                        />
                      </div>
                      <button
                        onClick={() => setWizardStep(2)}
                        className="w-full h-11 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs"
                      >
                        Continua
                      </button>
                    </div>
                  )}

                  {activeTab === 'rapido' && (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-500">Seleziona uno dei modelli più diffusi in Italia:</p>
                      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                        {POPULAR_MODELS_PRESETS.map((p) => (
                          <button
                            key={`${p.make}-${p.model}`}
                            onClick={() => handleSelectPreset(p)}
                            className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 bg-slate-50 dark:bg-slate-800/40 text-left transition-all"
                          >
                            <p className="text-xs font-black text-slate-900 dark:text-white">
                              {p.make} {p.model}
                            </p>
                            <p className="text-[10px] text-slate-500">{p.year} · {p.fuel}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'libretto' && (
                    <div className="space-y-4">
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-8 text-center cursor-pointer bg-slate-50 dark:bg-slate-800/40 hover:bg-blue-50/30 transition-all"
                      >
                        <UploadCloud className="w-10 h-10 text-blue-600 mx-auto mb-2" />
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {scanning ? scanMessage : 'Carica foto o PDF del Documento Unico (Libretto)'}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1">L&apos;AI compilerà i campi in automatico</p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf,image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) handleScanLibretto(e.target.files[0]);
                        }}
                      />
                    </div>
                  )}

                  {activeTab === 'manuale' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Marca</label>
                          <input
                            type="text"
                            value={make}
                            onChange={(e) => setMake(e.target.value)}
                            className="w-full h-10 px-3 rounded-xl border text-xs font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Modello</label>
                          <input
                            type="text"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="w-full h-10 px-3 rounded-xl border text-xs font-semibold"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => setWizardStep(2)}
                        className="w-full h-11 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs mt-2"
                      >
                        Continua ai dettagli
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Wizard Step 2: Confirmation & Additional Details */}
              {wizardStep === 2 && (
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Marca
                      </label>
                      <input
                        type="text"
                        value={make}
                        onChange={(e) => setMake(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Modello
                      </label>
                      <input
                        type="text"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Anno
                      </label>
                      <input
                        type="number"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border text-xs font-semibold"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Alimentazione
                      </label>
                      <input
                        type="text"
                        value={fuel}
                        onChange={(e) => setFuel(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Chilometri attuali
                      </label>
                      <input
                        type="number"
                        value={km}
                        onChange={(e) => setKm(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Targa (opzionale)
                      </label>
                      <input
                        type="text"
                        value={plate}
                        onChange={(e) => setPlate(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border text-xs font-semibold uppercase"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => setWizardStep(1)}
                      className="text-xs font-bold text-slate-600 hover:underline"
                    >
                      ← Indietro
                    </button>
                    <button
                      onClick={handleCreatePassport}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20"
                    >
                      Crea Profilo Digitale
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── CLAIM TRANSFERRED PASSPORT MODAL ─── */}
        {showClaimModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-scale-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 grid place-items-center">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">Riscatta Passport Auto</h3>
                    <span className="text-[10px] text-slate-500 block">Acquisisci un profilo trasferito</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowClaimModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Hai acquistato un&apos;auto e il venditore ti ha fornito un codice di trasferimento AutoEsperto? Inseriscilo qui per caricare l&apos;intero storico nel tuo garage.
              </p>

              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  Codice di Trasferimento (es. TR-48291-1234)
                </label>
                <input
                  type="text"
                  placeholder="TR-XXXXX-XXXX"
                  value={claimInput}
                  onChange={(e) => setClaimInput(e.target.value.toUpperCase())}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-sm tracking-wider uppercase text-slate-900 dark:text-white outline-none focus:border-indigo-600"
                />
                {claimError && (
                  <p className="text-xs font-semibold text-rose-600">{claimError}</p>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowClaimModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  Annulla
                </button>
                <button
                  type="button"
                  onClick={handleClaimPassport}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
                >
                  Riscatta Profilo
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
