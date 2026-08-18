'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ArrowRight, Camera, Car, Check, ChevronRight, Loader2, RotateCcw, ScanSearch, ShieldCheck, Upload } from 'lucide-react';
import type { AutoReport } from '@autoesperto/types';
import { API_URL, freeScanVehiclePhoto, freeScanManual, getMyAccount, type FreeScanResult, type AccountUser, type AnalyzePayload } from '@/lib/api';
import { trackEvent } from '@/lib/analytics';
import ReportView from '@/components/ReportView';

type ScannerStage = 'idle' | 'recognition' | 'vehicle-found' | 'result' | 'error' | 'manual-input';

const promises = ['Marca e modello', 'Anno indicativo', 'Valore stimato', 'Prezzo di mercato', 'Affidabilità e controlli', 'Salvataggio account (opz.)'];

const SCAN_PHASES = [
  'Foto ricevute',
  'Identificazione del veicolo',
  'Analisi del modello',
  'Valutazione del mercato',
  'Controllo affidabilità',
  'Preparazione del report',
];

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
  const [tab, setTab] = useState<'foto' | 'manual'>('foto');
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
  const [scanPhase, setScanPhase] = useState(0);

  const analyzing = stage === 'recognition' || stage === 'vehicle-found' || stage === 'manual-input';

  useEffect(() => {
    if (!analyzing) return;
    const timers = SCAN_PHASES.map((_, i) => setTimeout(() => setScanPhase(i + 1), 700 * (i + 1)));
    return () => timers.forEach(clearTimeout);
  }, [analyzing]);

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

  const reset = () => {
    setPhotos([]); setMainPhoto(''); setScan(null); setReport(null); setError(''); setStage('idle');
    setManualMake(''); setManualModel(''); setManualYear(''); setManualLoading(false);
    setManualKm(''); setManualPrice('');
    setScanPhase(0);
    if (inputRef.current) inputRef.current.value = '';
  };

  const applyResult = async (result: FreeScanResult, photoUrl: string) => {
    if (!result.recognized || !result.vehicle) return false;
    setScan(result);
    setReport(result.report ?? null);
    setMainPhoto(photoUrl);
    trackEvent('car_selected', { make: result.vehicle.make, model: result.vehicle.model });
    setStage('vehicle-found');
    await wait(3500);
    setStage('result');
    trackEvent('analysis_completed', { make: result.vehicle.make, model: result.vehicle.model });
    trackEvent('result_viewed', { make: result.vehicle.make, model: result.vehicle.model });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return true;
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(''); setScan(null); setReport(null);

    const valid = Array.from(files).filter((file) => {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return false;
      return file.size <= MAX_PHOTO_BYTES;
    }).slice(0, MAX_PHOTOS);

    if (valid.length === 0) {
      setError('Carica una o più foto JPG, PNG o WebP (massimo 5 MB l’una).'); setStage('error'); return;
    }

    trackEvent('car_image_uploaded', { count: valid.length });
    const imageDatas = await Promise.all(valid.map(readFileAsDataURL));
    setPhotos(imageDatas);
    setMainPhoto(imageDatas[0]);
    setStage('recognition'); setScanPhase(0);
    trackEvent('analysis_started', { analysis_type: 'photo', photos: imageDatas.length });

    try {
      let lastResult: FreeScanResult | undefined;
      for (const imageData of imageDatas) {
        const result = await freeScanVehiclePhoto(imageData);
        lastResult = result;
        if (await applyResult(result, imageData)) return;
      }
      // L'AI non ha riconosciuto nessuna foto: mostra il popup un attimo, poi passa a input manuale
      await wait(2500);
      setScan(lastResult ?? null);
      setStage('manual-input');
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('impiegando troppo tempo')) {
        setError('Il server si sta riattivando (può richiedere fino a un paio di minuti la prima volta). Riprova ora che è caldo.');
      } else {
        setError(msg || 'Non riesco a completare l’analisi. Riprova con un’altra foto.');
      }
      setStage('error');
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
        return;
      }
      setScan(result);
      setReport(result.report ?? null);
      trackEvent('car_selected', { make: result.vehicle.make, model: result.vehicle.model });
      setStage('vehicle-found');
      await wait(2500);
      setStage('result');
      trackEvent('analysis_completed', { make: result.vehicle.make, model: result.vehicle.model });
      trackEvent('result_viewed', { make: result.vehicle.make, model: result.vehicle.model });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('impiegando troppo tempo')) {
        setError('Il server sta avviandosi (può richiedere fino a 60 secondi la prima volta). Riprova ora che è caldo.');
      } else {
        setError(msg || 'Errore durante la generazione del report. Riprova.');
      }
    } finally {
      setManualLoading(false);
    }
  };

  const [isDragOver, setIsDragOver] = useState(false);

  if (stage === 'idle') {
    if (embedded) {
      return (
        <div className="scanner-box">
          <div className="scanner-tabs" role="tablist" aria-label="Come vuoi analizzare l'auto">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'foto'}
              className={`scanner-tab${tab === 'foto' ? ' active' : ''}`}
              onClick={() => { setTab('foto'); setError(''); }}
            >
              <Camera /> Da foto
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'manual'}
              className={`scanner-tab${tab === 'manual' ? ' active' : ''}`}
              onClick={() => { setTab('manual'); setError(''); }}
            >
              <Car /> Marca e modello
            </button>
          </div>

          {tab === 'foto' ? (
            <div className="scanner-photo-tab">
              <button
                type="button"
                className={`scanner-dropzone ${isDragOver ? 'ring-4 ring-blue-500/20 border-blue-600 bg-blue-50/50' : ''}`}
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    void handleFiles(e.dataTransfer.files);
                  }
                }}
              >
                <span className="scanner-drop-icon">
                  <Camera className="h-6 w-6" />
                </span>
                <span className="scanner-drop-main">
                  {isDragOver ? 'Rilascia le foto qui' : 'Trascina o carica le foto dell\'auto'}
                </span>
                <span className="scanner-drop-sub">JPG, PNG o WebP · max 5 MB l&apos;una · fino a 6 foto</span>
              </button>
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

  if (stage === 'result' && scan?.vehicle) {
    const vehicleName = [scan.vehicle.make, scan.vehicle.model].filter(Boolean).join(' ');
    const requestedPrice = manualPrice.trim() ? Number(manualPrice.trim()) : undefined;

    return (
      <section className="scanner-result animate-fade-in">
        <div className="scanner-result-hero">
          {mainPhoto && (
            <div className="relative w-full h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}<img src={mainPhoto} alt={`Foto analizzata: ${vehicleName}`} className="w-full h-full object-cover" />
              <div className="scanner-result-shade" />
            </div>
          )}
          <button type="button" onClick={reset} className="scanner-reset"><RotateCcw className="h-4 w-4" /> Nuova analisi</button>
          <div className="scanner-result-title">
            <span>Analisi completa gratuita</span>
            <h1>{vehicleName}</h1>
            <p>Riconoscimento a confidenza {scan.vehicle.confidence}{photos.length > 1 ? ` · ${photos.length} foto analizzate` : ''}</p>
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

        {report ? (
          <ReportView report={report} embedded />
        ) : (
          <div className="mt-5 rounded-2xl p-5 border border-border bg-surface shadow-card">
            <h2 className="text-sm font-bold text-text-primary">Veicolo riconosciuto</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                ['Marca', scan.vehicle.make],
                ['Modello', scan.vehicle.model],
                ['Versione', scan.vehicle.generation],
                ['Anno', scan.vehicle.year],
                ['Colore', scan.vehicle.color],
                ['Tipologia', scan.vehicle.bodyType],
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
        )}
        {requestedPrice != null && (
          <p className="text-xs text-text-tertiary mt-4">Prezzo richiesto inserito: {requestedPrice.toLocaleString('it-IT')} €</p>
        )}
      </section>
    );
  }

  const progress = stage === 'recognition' ? 30 : stage === 'vehicle-found' ? 85 : stage === 'manual-input' ? 40 : 0;
  const discovered = scan?.vehicle ? [
    ['Marca trovata', scan.vehicle.make], ['Modello riconosciuto', scan.vehicle.model], ['Anno stimato', scan.vehicle.year],
  ].filter((item) => item[1]) : [];

  return (
    <section className={`scanner-workspace animate-fade-in${mainPhoto ? '' : ' scanner-workspace-nophoto'}`}>
      {mainPhoto && (
      <div className="scanner-photo-stage">
        <div className="relative w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}<img src={mainPhoto} alt="Foto dell’auto in analisi" className="w-full h-full object-cover" />
          {photos.length > 1 && stage !== 'manual-input' && (
            <div className="absolute bottom-3 left-3 z-10 flex gap-1.5">
              {photos.map((photo, i) => (
                <div key={i} className={`h-12 w-16 overflow-hidden rounded-lg border-2 ${photo === mainPhoto ? 'border-amber-400' : 'border-white/40'}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
          {stage !== 'error' && (
            <div className="absolute inset-0 z-10 flex items-end justify-end p-3 pointer-events-none">
              {stage === 'manual-input' ? (
                <div className="w-full max-w-xs rounded-xl border border-white/20 bg-white/95 p-4 shadow-2xl backdrop-blur-xl scanner-popup-animate pointer-events-auto">
                  <div className="flex items-start gap-2 mb-3">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-slate-900">Riconoscimento non riuscito</h2>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">Inserisci marca e modello per generare il report completo.</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <input type="text" value={manualMake} onChange={(e) => setManualMake(e.target.value)} placeholder="Marca *" className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500" />
                    <input type="text" value={manualModel} onChange={(e) => setManualModel(e.target.value)} placeholder="Modello *" className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500" />
                    <input type="number" value={manualYear} onChange={(e) => setManualYear(e.target.value)} placeholder="Anno (opz.)" className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500" />
                    {error && <p className="text-xs text-red-700">{error}</p>}
                    <div className="flex gap-2 pt-1">
                      <button type="button" disabled={manualLoading} onClick={() => handleManualSubmit()} className="scanner-cta disabled:opacity-60 !mt-0 !min-h-[36px] !text-xs !px-3 flex-1">
                        {manualLoading ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> …</> : <>Genera <ChevronRight className="h-3.5 w-3.5" /></>}
                      </button>
                      <button type="button" onClick={() => inputRef.current?.click()} className="text-xs text-slate-600 hover:text-slate-800 underline underline-offset-2 px-2">Altre foto</button>
                    </div>
                  </div>
                </div>
              ) : stage === 'recognition' ? (
                <div className="w-full max-w-[200px] rounded-xl border border-white/20 bg-slate-900/85 p-3 text-white shadow-xl backdrop-blur-md scanner-popup-animate pointer-events-auto">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Loader2 className="h-4 w-4 text-amber-400 animate-spin" />
                    <span className="text-xs font-bold">Sto riconoscendo l&apos;auto…</span>
                  </div>
                  <p className="text-xs text-white/70 leading-snug">Identifico marca, modello e versione dalla foto.</p>
                </div>
              ) : (
                <div className="w-full max-w-[200px] rounded-xl border border-white/20 bg-slate-900/85 p-3 text-white shadow-xl backdrop-blur-md scanner-popup-animate pointer-events-auto">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs font-bold">Veicolo riconosciuto</span>
                  </div>
                  <div className="space-y-0.5 text-xs">
                    {scan?.vehicle?.make && <div className="flex justify-between gap-2"><span className="text-white/40">Marca</span><span className="font-semibold text-right">{scan.vehicle.make}</span></div>}
                    {scan?.vehicle?.model && <div className="flex justify-between gap-2"><span className="text-white/40">Modello</span><span className="font-semibold text-right">{scan.vehicle.model}</span></div>}
                    {scan?.vehicle?.generation && <div className="flex justify-between gap-2"><span className="text-white/40">Versione</span><span className="font-semibold text-right">{scan.vehicle.generation}</span></div>}
                    {scan?.vehicle?.year && <div className="flex justify-between gap-2"><span className="text-white/40">Anno</span><span className="font-semibold text-right">{scan.vehicle.year}</span></div>}
                    {scan?.vehicle?.color && <div className="flex justify-between gap-2"><span className="text-white/40">Colore</span><span className="font-semibold text-right">{scan.vehicle.color}</span></div>}
                    {scan?.vehicle?.bodyType && <div className="flex justify-between gap-2"><span className="text-white/40">Categoria</span><span className="font-semibold text-right">{scan.vehicle.bodyType}</span></div>}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="scanner-photo-badge"><ShieldCheck className="h-4 w-4" /> Analisi AutoEsperto</div>
      </div>
      )}
      <div className="scanner-work-panel">
        {stage === 'error' ? (
          <div className="scanner-error"><AlertTriangle className="h-7 w-7" /><h2>Non siamo riusciti ad analizzare queste foto</h2><p>{error}</p><button type="button" onClick={() => inputRef.current?.click()}><Upload className="h-4 w-4" /> Riprova con altre foto</button></div>
        ) : stage === 'manual-input' ? (
          <div className="scanner-manual-side animate-fade-in">
            <div className="scanner-stage-label">Inserimento manuale</div>
            <h2>Inserisci marca e modello</h2>
            <p className="scanner-stage-copy">Compila i dati per generare il report completo.</p>
            <div className="scanner-progress"><div><span>Analisi completata</span><strong>{progress}%</strong></div><div className="scanner-progress-track"><span style={{ width: `${progress}%` }} /></div></div>
          </div>
        ) : (
          <>
            <div className="scanner-stage-label">{stage === 'recognition' ? 'Analisi gratuita in corso' : 'Veicolo riconosciuto'}</div>
            <h2>{stage === 'recognition' ? 'Sto riconoscendo l\u2019auto e preparando il report…' : [scan?.vehicle?.make, scan?.vehicle?.model].filter(Boolean).join(' ')}</h2>
            <p className="scanner-stage-copy">{stage === 'recognition' ? 'Confronto i prezzi di mercato e raccolgo affidabilità, costi e controlli da fare.' : 'Completamento analisi con prezzo, affidabilità e controlli da fare.'}</p>
            <div className="scanner-phases" role="status" aria-live="polite">
              {SCAN_PHASES.map((phase, i) => (
                <div key={phase} className={`scanner-phase${i < scanPhase ? ' done' : ''}`}>
                  <span className="scanner-phase-icon">
                    {i < scanPhase ? <Check className="h-3.5 w-3.5" /> : <span className="scanner-phase-dot" />}
                  </span>
                  {phase}
                </div>
              ))}
            </div>
            <div className="scanner-progress"><div><span>Analisi completata</span><strong>{progress}%</strong></div><div className="scanner-progress-track"><span style={{ width: `${progress}%` }} /></div></div>
            {discovered.length > 0 && <div className="discovered-grid">{discovered.map(([label, value]) => <div key={String(label)}><span><Check className="h-3.5 w-3.5" /> {label}</span><strong>{value}</strong></div>)}</div>}
          </>
        )}
      </div>
      <input ref={inputRef} className="hidden" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => handleFiles(event.target.files)} />
    </section>
  );
}
