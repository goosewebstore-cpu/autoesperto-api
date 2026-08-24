'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  ArrowRight,
  Camera,
  Car,
  Check,
  ChevronRight,
  Link2,
  Loader2,
  RotateCcw,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Upload,
} from 'lucide-react';
import type { AutoReport } from '@autoesperto/types';
import {
  API_URL,
  freeScanVehiclePhoto,
  freeScanManual,
  getMyAccount,
  type FreeScanResult,
  type AccountUser,
  type AnalyzePayload,
} from '@/lib/api';
import { generateInstantReport } from '@/lib/reportFallback';
import { trackEvent } from '@/lib/analytics';
import ReportView from '@/components/ReportView';
import ReportErrorBoundary from '@/components/ReportErrorBoundary';
import { parseListingTextOrUrl, type ParsedAdData } from '@/lib/adParser';

const POPULAR_CHIPS = [
  { make: 'Fiat', model: 'Panda' },
  { make: 'Fiat', model: '500' },
  { make: 'Volkswagen', model: 'Golf' },
  { make: 'Toyota', model: 'Yaris' },
  { make: 'Renault', model: 'Clio' },
  { make: 'Peugeot', model: '208' },
  { make: 'Ford', model: 'Puma' },
  { make: 'Jeep', model: 'Renegade' },
];

type ScannerStage = 'idle' | 'recognition' | 'vehicle-found' | 'result' | 'error' | 'manual-input';

const promises = ['Valutazione accurata', 'Prezzo reale di mercato', 'Affidabilità e difetti noti', 'Calcolo bollo esatto', 'Controlli pre-acquisto'];

const MAX_PHOTOS = 6;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Impossibile leggere la foto.'));
    reader.readAsDataURL(file);
  });
}

export default function VehicleScanner({
  embedded = false,
  initialPayload,
  onStageChange,
}: {
  embedded?: boolean;
  initialPayload?: AnalyzePayload;
  onStageChange?: (stage: ScannerStage) => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<ScannerStage>('idle');

  useEffect(() => {
    onStageChange?.(stage);
  }, [stage, onStageChange]);
  const [tab, setTab] = useState<'annuncio' | 'foto' | 'manual'>('annuncio');
  const [adInput, setAdInput] = useState('');
  const [parsedAd, setParsedAd] = useState<ParsedAdData | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [mainPhoto, setMainPhoto] = useState('');
  const [scan, setScan] = useState<FreeScanResult | null>(null);
  const [report, setReport] = useState<AutoReport | null>(null);
  const [error, setError] = useState('');
  const [manualMake, setManualMake] = useState('');
  const [manualModel, setManualModel] = useState('');
  const [manualYear, setManualYear] = useState('');
  const [manualKm, setManualKm] = useState('');
  const [manualPrice, setManualPrice] = useState('');
  const [manualLoading, setManualLoading] = useState(false);
  const [user, setUser] = useState<AccountUser | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/health`).catch(() => {});
    getMyAccount().then(res => {
      if (res.success && res.user) {
        setUser(res.user);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!initialPayload?.make || !initialPayload?.model) return;
    setTab('manual');
    setManualMake(initialPayload.make);
    setManualModel(initialPayload.model);
    if (initialPayload.year) setManualYear(String(initialPayload.year));
    if (initialPayload.km) setManualKm(String(initialPayload.km));
    if (initialPayload.requestedPrice) setManualPrice(String(initialPayload.requestedPrice));
    const timer = setTimeout(() => {
      void handleManualSubmit({
        make: initialPayload.make,
        model: initialPayload.model,
        year: initialPayload.year,
        km: initialPayload.km,
        requestedPrice: initialPayload.requestedPrice,
      });
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdInputChange = (value: string) => {
    setAdInput(value);
    setError('');
    const parsed = parseListingTextOrUrl(value);
    setParsedAd(parsed);
    if (parsed.make) setManualMake(parsed.make);
    if (parsed.model) setManualModel(parsed.model);
    if (parsed.year) setManualYear(String(parsed.year));
    if (parsed.km) setManualKm(String(parsed.km));
    if (parsed.price) setManualPrice(String(parsed.price));
  };

  const handleAnalyzeAd = () => {
    const make = parsedAd?.make || manualMake;
    const model = parsedAd?.model || manualModel;
    if (!make || !model) {
      setError('Incolla il link o il testo dell\'annuncio contenente marca e modello (es. Fiat Panda 2021).');
      return;
    }
    void handleManualSubmit({
      make,
      model,
      year: parsedAd?.year ?? (manualYear ? Number(manualYear) : undefined),
      km: parsedAd?.km ?? (manualKm ? Number(manualKm) : undefined),
      requestedPrice: parsedAd?.price ?? (manualPrice ? Number(manualPrice) : undefined),
    });
  };

  const reset = () => {
    setPhotos([]); setMainPhoto(''); setScan(null); setReport(null); setError(''); setStage('idle');
    setManualMake(''); setManualModel(''); setManualYear(''); setManualLoading(false);
    setManualKm(''); setManualPrice(''); setAdInput(''); setParsedAd(null);
    if (inputRef.current) inputRef.current.value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const applyResult = async (result: FreeScanResult, photoUrl: string) => {
    if (!result.recognized || !result.vehicle) return false;
    setScan(result);
    setReport(result.report ?? null);
    setMainPhoto(photoUrl);
    trackEvent('car_selected', { make: result.vehicle.make, model: result.vehicle.model });
    setStage('result');
    trackEvent('analysis_completed', { make: result.vehicle.make, model: result.vehicle.model });
    trackEvent('result_viewed', { make: result.vehicle.make, model: result.vehicle.model });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return true;
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(''); setScan(null); setReport(null); setManualLoading(true);

    const valid = Array.from(files).filter((file) => {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return false;
      return file.size <= MAX_PHOTO_BYTES;
    }).slice(0, MAX_PHOTOS);

    if (valid.length === 0) {
      setError('Carica una o più foto JPG, PNG o WebP (massimo 5 MB l’una).');
      setManualLoading(false);
      return;
    }

    trackEvent('car_image_uploaded', { count: valid.length });
    try {
      const imageDatas = await Promise.all(valid.map(readFileAsDataURL));
      setPhotos(imageDatas);
      setMainPhoto(imageDatas[0]);
      trackEvent('analysis_started', { analysis_type: 'photo', photos: imageDatas.length });

      for (const imageData of imageDatas) {
        const result = await freeScanVehiclePhoto(imageData);
        if (await applyResult(result, imageData)) {
          setManualLoading(false);
          return;
        }
      }
      // Se non riconosciuta, passa al tab manuale con messaggio
      setTab('manual');
      setError('Non siamo riusciti a identificare il modello esatto dalla foto. Inserisci marca e modello per il report.');
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      setTab('manual');
      setError(msg || 'Inserisci marca e modello qui sotto per calcolare subito il valore.');
    } finally {
      setManualLoading(false);
    }
  };

  const handleManualSubmit = async (overrides?: { make?: string; model?: string; year?: number; km?: number; requestedPrice?: number }) => {
    const make = overrides?.make?.trim() || manualMake.trim();
    const model = overrides?.model?.trim() || manualModel.trim();
    if (!make || !model) {
      setError('Inserisci almeno marca e modello.');
      return;
    }

    setManualLoading(true); setError('');
    trackEvent('analysis_started', { analysis_type: 'manual', make, model });
    try {
      const year = overrides?.year ?? (manualYear.trim() ? Number(manualYear.trim()) : undefined);
      const km = overrides?.km ?? (manualKm.trim() ? Number(manualKm.trim()) : undefined);
      const requestedPrice = overrides?.requestedPrice ?? (manualPrice.trim() ? Number(manualPrice.trim()) : undefined);
      const result = await freeScanManual({
        make,
        model,
        ...(year && !isNaN(year) ? { year } : {}),
        ...(km && !isNaN(km) ? { km } : {}),
        ...(requestedPrice && !isNaN(requestedPrice) ? { requestedPrice } : {}),
      });
      if (!result.recognized || !result.vehicle) {
        setError(result.message || 'Non riesco a riconoscere il veicolo. Riprova.');
        setStage('idle');
        return;
      }
      setScan(result);
      setReport(result.report ?? null);
      trackEvent('car_selected', { make: result.vehicle.make, model: result.vehicle.model });
      setStage('result');
      trackEvent('analysis_completed', { make: result.vehicle.make, model: result.vehicle.model });
      trackEvent('result_viewed', { make: result.vehicle.make, model: result.vehicle.model });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('impiegando troppo tempo') || msg.includes('500') || msg.includes('servizio')) {
        setError('Il server sta elaborando la richiesta. Riprova tra pochi istanti.');
      } else {
        setError(msg || 'Errore durante la generazione del report. Riprova.');
      }
      setStage('idle');
    } finally {
      setManualLoading(false);
    }
  };

  const [isDragOver, setIsDragOver] = useState(false);

  if (stage !== 'result') {
    if (embedded) {
      return (
        <div className="scanner-box">
          <div className="scanner-tabs" role="tablist" aria-label="Come vuoi analizzare l'auto">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'annuncio'}
              className={`scanner-tab${tab === 'annuncio' ? ' active' : ''}`}
              onClick={() => { setTab('annuncio'); setError(''); }}
            >
              <Link2 className="h-4 w-4" /> Controlla annuncio
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'foto'}
              className={`scanner-tab${tab === 'foto' ? ' active' : ''}`}
              onClick={() => { setTab('foto'); setError(''); }}
            >
              <Camera className="h-4 w-4" /> Da foto / screenshot
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'manual'}
              className={`scanner-tab${tab === 'manual' ? ' active' : ''}`}
              onClick={() => { setTab('manual'); setError(''); }}
            >
              <Car className="h-4 w-4" /> Marca e modello
            </button>
          </div>

          {tab === 'annuncio' ? (
            <div className="space-y-4 pt-1">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Incolla il link dell&apos;annuncio o il testo dell&apos;offerta:
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={adInput}
                    onChange={(e) => handleAdInputChange(e.target.value)}
                    placeholder="Incolla qui il link di AutoScout24, Subito.it, Facebook Marketplace oppure copia il testo dell'annuncio (es. 'Fiat Panda 1.2 Lounge 2021 45.000 km 9.500 €')..."
                    className="w-full p-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-600 outline-none transition-all resize-none shadow-xs"
                  />
                  {adInput && (
                    <button
                      type="button"
                      onClick={() => handleAdInputChange('')}
                      className="absolute top-3 right-3 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md"
                    >
                      Pulisci
                    </button>
                  )}
                </div>
              </div>

              {/* Live Extracted Fields Preview Pill Tags */}
              {parsedAd && (parsedAd.make || parsedAd.model || parsedAd.year || parsedAd.price) && (
                <div className="p-3 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-700 dark:text-blue-300">
                    <Sparkles className="w-3.5 h-3.5" /> Dati estratti automaticamente:
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {parsedAd.make && (
                      <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        Marca: <strong>{parsedAd.make}</strong>
                      </span>
                    )}
                    {parsedAd.model && (
                      <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        Modello: <strong>{parsedAd.model}</strong>
                      </span>
                    )}
                    {parsedAd.year && (
                      <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        Anno: <strong>{parsedAd.year}</strong>
                      </span>
                    )}
                    {parsedAd.km && (
                      <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        Km: <strong>{parsedAd.km.toLocaleString('it-IT')}</strong>
                      </span>
                    )}
                    {parsedAd.price && (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700">
                        Prezzo: <strong>{parsedAd.price.toLocaleString('it-IT')} €</strong>
                      </span>
                    )}
                    {parsedAd.fuel && (
                      <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        Alim.: <strong>{parsedAd.fuel}</strong>
                      </span>
                    )}
                  </div>
                </div>
              )}

              {error && <p className="scanner-box-error" role="alert">{error}</p>}

              <button
                type="button"
                onClick={handleAnalyzeAd}
                disabled={manualLoading}
                className="scanner-submit w-full"
              >
                {manualLoading ? (
                  <><Loader2 className="animate-spin" /> Analisi annuncio in corso…</>
                ) : (
                  <><ScanSearch /> Ottieni il Verdetto sull&apos;Annuncio <ArrowRight /></>
                )}
              </button>

              <div className="scanner-box-promises" aria-label="Cosa ricevi">
                {promises.map((item) => (
                  <span key={item}><Check className="h-3.5 w-3.5" /> {item}</span>
                ))}
              </div>
            </div>
          ) : tab === 'foto' ? (
            <div className="scanner-photo-tab">
              <button
                type="button"
                disabled={manualLoading}
                className={`scanner-dropzone ${isDragOver ? 'ring-4 ring-blue-500/20 border-blue-600 bg-blue-50/50' : ''} ${manualLoading ? 'opacity-75 cursor-wait' : ''}`}
                onClick={() => !manualLoading && inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  if (!manualLoading && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    void handleFiles(e.dataTransfer.files);
                  }
                }}
              >
                <span className="scanner-drop-icon">
                  {manualLoading ? <Loader2 className="h-6 w-6 animate-spin text-blue-600" /> : <Camera className="h-6 w-6" />}
                </span>
                <span className="scanner-drop-main">
                  {manualLoading ? 'Analisi foto / screenshot in corso…' : isDragOver ? 'Rilascia qui le immagini' : 'Trascina o carica foto o screenshot dell\'annuncio'}
                </span>
                <span className="scanner-drop-sub">
                  {manualLoading ? 'Riconoscimento IA e generazione verdetto…' : 'JPG, PNG o WebP · max 5 MB l\'una · fino a 6 foto'}
                </span>
              </button>
              {error && <p className="scanner-box-error mt-3" role="alert">{error}</p>}
              <div className="scanner-box-promises" aria-label="Cosa ricevi">
                {promises.map((item) => (
                  <span key={item}><Check className="h-3.5 w-3.5" /> {item}</span>
                ))}
              </div>
              <p className="scanner-box-micro">Analisi gratuita al 100% e senza registrazione.</p>
            </div>
          ) : (
            <form
              className="scanner-manual-form"
              onSubmit={(event) => { event.preventDefault(); void handleManualSubmit(); }}
            >
              {/* Quick Select Popular Chips */}
              <div className="mb-3 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500">Scelta rapida modelli diffusi:</span>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_CHIPS.map((chip) => (
                    <button
                      key={`${chip.make}-${chip.model}`}
                      type="button"
                      onClick={() => {
                        setManualMake(chip.make);
                        setManualModel(chip.model);
                      }}
                      className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
                        manualMake.toLowerCase() === chip.make.toLowerCase() && manualModel.toLowerCase() === chip.model.toLowerCase()
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                      }`}
                    >
                      {chip.make} {chip.model}
                    </button>
                  ))}
                </div>
              </div>

              <div className="scanner-manual-row">
                <label className="scanner-field">
                  <span>Marca *</span>
                  <input
                    type="text"
                    value={manualMake}
                    onChange={(e) => setManualMake(e.target.value)}
                    placeholder="es. Fiat"
                    autoComplete="off"
                    required
                  />
                </label>
                <label className="scanner-field">
                  <span>Modello *</span>
                  <input
                    type="text"
                    value={manualModel}
                    onChange={(e) => setManualModel(e.target.value)}
                    placeholder="es. Panda"
                    autoComplete="off"
                    required
                  />
                </label>
                <label className="scanner-field">
                  <span>Anno (opz.)</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={manualYear}
                    onChange={(e) => setManualYear(e.target.value)}
                    placeholder="es. 2018"
                    min={1900}
                    max={2100}
                  />
                </label>
                <label className="scanner-field">
                  <span>Km (opz.)</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={manualKm}
                    onChange={(e) => setManualKm(e.target.value)}
                    placeholder="es. 85000"
                    min={0}
                    max={1000000}
                  />
                </label>
                <label className="scanner-field">
                  <span>Prezzo richiesto (opz.)</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={manualPrice}
                    onChange={(e) => setManualPrice(e.target.value)}
                    placeholder="es. 17900"
                    min={0}
                    max={10000000}
                  />
                </label>
              </div>
              {error && <p className="scanner-box-error" role="alert">{error}</p>}
              <button type="submit" className="scanner-submit" disabled={manualLoading}>
                {manualLoading ? (
                  <><Loader2 className="animate-spin" /> Calcolo in corso…</>
                ) : (
                  <><ScanSearch /> Calcola valore <ArrowRight /></>
                )}
              </button>
            </form>
          )}
          <input
            ref={inputRef}
            className="hidden"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(event) => handleFiles(event.target.files)}
          />
        </div>
      );
    }

    return (
      <section className="scanner-hero">
        <div className="scanner-glow scanner-glow-one" /><div className="scanner-glow scanner-glow-two" />
        <div className="scanner-hero-copy">
          <div className="scanner-kicker"><Camera className="h-4 w-4" /> Riconoscimento auto da foto</div>
          <h1>Analizza l’auto.<br className="hidden sm:block" /> Scopri modello e prezzo.</h1>
          <p className="scanner-lead">Da una o più foto riconosciamo marca, modello e anno, stimiamo il prezzo e generiamo un report per quel modello.</p>
           <div className="scanner-promises" aria-label="Informazioni analizzate">
            {promises.map((item) => <span key={item}><Check className="h-3.5 w-3.5" /> {item}</span>)}
          </div>
            <button type="button" className="scanner-cta" onClick={() => inputRef.current?.click()}><Camera className="h-5 w-5" /> Analizza un&apos;auto gratis <ChevronRight className="h-5 w-5" /></button>
            <p className="scanner-microcopy">Analisi sempre gratuita, senza account e senza limiti. Un account gratuito consente di salvare i report.</p>
          <div className="scanner-privacy"><ShieldCheck className="h-4 w-4" /> Salviamo il report, non la fotografia originale.</div>
           <p className="mt-3 flex items-start gap-2 text-xs max-w-xl" style={{ color: 'var(--text-2)' }}>
             <Check className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: 'var(--success)' }} />
             <span>Per un risultato migliore: carica più foto (frontale, laterale, posteriore, interni) con buona illuminazione. Il riconoscimento è indicativo e può contenere errori.</span>
           </p>
        </div>
        <div className="scanner-hero-visual" aria-hidden="true">
          <div className="scanner-device">
            <div className="scanner-device-top"><span /><span>Analisi AutoEsperto</span><span /></div>
            <div className="scanner-car-silhouette">
              <svg viewBox="0 0 620 300" fill="none"><path d="M75 205 103 145l104-28 68-61h153l79 63 63 27 29 59-23 31H99Z" stroke="currentColor" strokeWidth="2"/><path d="m207 117 68-61h153l79 63M103 145l116 23h282l69-22M142 205h385M236 117l-17 51m236-51 46 51" stroke="currentColor" strokeWidth="1.4"/><circle cx="180" cy="217" r="43" stroke="currentColor" strokeWidth="2"/><circle cx="494" cy="217" r="43" stroke="currentColor" strokeWidth="2"/></svg>
              <div className="scanner-demo-line" />
              <span className="scanner-point point-a" /><span className="scanner-point point-b" /><span className="scanner-point point-c" />
            </div>
            <div className="scanner-device-status"><span>Riconoscimento visivo</span><strong>Pronto</strong></div>
          </div>
        </div>
        <input ref={inputRef} className="hidden" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => handleFiles(event.target.files)} />
      </section>
    );
  }

  if (stage === 'result') {
    const vehicleObj = scan?.vehicle || report?.vehicle || { make: manualMake || 'Auto', model: manualModel || 'Selezionata' };
    const vehicleName = [vehicleObj.make, vehicleObj.model].filter(Boolean).join(' ');
    const requestedPrice = manualPrice.trim() ? Number(manualPrice.trim()) : undefined;

    return (
      <section className="scanner-result">
        <div className="scanner-result-hero">
          {mainPhoto && (
            <div className="absolute inset-0 z-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mainPhoto} alt={`Foto analizzata: ${vehicleName}`} className="w-full h-full object-cover" />
              <div className="scanner-result-shade" />
            </div>
          )}
          <button type="button" onClick={reset} className="scanner-reset">
            <RotateCcw className="h-3.5 w-3.5" /> Nuova analisi
          </button>
          <div className="scanner-result-title">
            <span>Analisi completata con successo</span>
            <h1>{vehicleName}</h1>
            <p>
              {vehicleObj.year ? `Modello ${vehicleObj.year}` : 'Rapporto di mercato e affidabilità generato'}
              {photos.length > 1 ? ` · ${photos.length} foto analizzate` : ''}
            </p>
          </div>
        </div>

        {photos.length > 1 && (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="Foto caricate">
            {photos.map((photo, i) => (
              <div key={i} className={`h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 ${photo === mainPhoto ? 'border-accent' : 'border-transparent'}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo} alt={`Foto ${i + 1} dell'auto`} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        )}

        <div className="scanner-result-banner">
          <ShieldCheck className="h-4 w-4" />
          {user ? (
             <span>Analisi salvata gratuitamente. La trovi nell&apos;<button type="button" onClick={() => router.push('/account')} className="scanner-result-banner-link">account</button>.</span>
          ) : (
             <span>Analisi gratuita. Per salvarla, <button type="button" onClick={() => router.push('/accesso?next=/account')} className="scanner-result-banner-link">crea un account gratuito</button>.</span>
          )}
        </div>

        {(() => {
          const km = manualKm.trim() ? Number(manualKm.trim()) : undefined;
          const finalReport = report || (vehicleObj.make && vehicleObj.model ? generateInstantReport({
            make: vehicleObj.make,
            model: vehicleObj.model,
            year: vehicleObj.year,
            km,
            requestedPrice,
          }).report : null);

          return finalReport ? (
            <ReportErrorBoundary onRetry={reset}>
              <ReportView report={finalReport} embedded />
            </ReportErrorBoundary>
          ) : (
            <div className="mt-5 rounded-2xl p-5 border border-border bg-surface shadow-card">
              <h2 className="text-sm font-bold text-text-primary">Veicolo riconosciuto</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  ['Marca', vehicleObj.make],
                  ['Modello', vehicleObj.model],
                  ['Versione', (vehicleObj as any).generation],
                  ['Anno', vehicleObj.year],
                  ['Colore', vehicleObj.color],
                  ['Tipologia', (vehicleObj as any).bodyType],
                ]
                  .filter((item) => item[1])
                  .map(([label, value]) => (
                    <div key={String(label)} className="rounded-xl p-3 border border-border bg-surface-2">
                      <span className="block text-[11px] font-bold uppercase tracking-wide text-text-tertiary">{label}</span>
                      <strong className="mt-1 block text-sm capitalize text-text-primary">{String(value)}</strong>
                    </div>
                  ))}
              </div>
              {error && <p className="mt-3 text-center text-xs font-semibold text-danger" role="alert">{error}</p>}
            </div>
          );
        })()}
        {requestedPrice != null && (
          <p className="text-xs text-text-tertiary mt-4">Prezzo richiesto inserito: {requestedPrice.toLocaleString('it-IT')} €</p>
        )}
      </section>
    );
  }

  // Se non siamo in result, torna sempre al box di ricerca pulito
  return null;
}
