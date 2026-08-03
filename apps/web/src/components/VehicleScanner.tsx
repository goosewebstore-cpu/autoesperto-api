'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Camera, Check, ChevronRight, Loader2, LockKeyhole, RotateCcw, ShieldCheck, Sparkles, Upload, UserRound } from 'lucide-react';
import type { AutoReport } from '@autoesperto/types';
import { freeScanVehiclePhoto, analyzeVehicle, type FreeScanResult } from '@/lib/api';
import ReportView from '@/components/ReportView';

type ScannerStage = 'idle' | 'recognition' | 'vehicle-found' | 'result' | 'error' | 'login-required' | 'manual-input';

const promises = ['Marca e modello', 'Anno indicativo', 'Prezzo di mercato', 'Report completo incluso'];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const FREE_SCAN_COOKIE = 'ae_free_scan_used';

function hasFreeScanCookie() {
  if (typeof document === 'undefined') return false;
  return document.cookie.split('; ').some((c) => c.startsWith(`${FREE_SCAN_COOKIE}=1`));
}

function setFreeScanCookie() {
  document.cookie = `${FREE_SCAN_COOKIE}=1; path=/; max-age=31536000; samesite=lax`;
}

export default function VehicleScanner() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<ScannerStage>('idle');
  const [imageUrl, setImageUrl] = useState('');
  const [scan, setScan] = useState<FreeScanResult | null>(null);
  const [report, setReport] = useState<AutoReport | null>(null);
  const [error, setError] = useState('');
  const [manualMake, setManualMake] = useState('');
  const [manualModel, setManualModel] = useState('');
  const [manualYear, setManualYear] = useState('');
  const [manualLoading, setManualLoading] = useState(false);

  const reset = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(''); setScan(null); setReport(null); setError(''); setStage('idle');
    setManualMake(''); setManualModel(''); setManualYear(''); setManualLoading(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleFile = async (file?: File) => {
    if (!file) return;
    setError(''); setScan(null); setReport(null);

    if (hasFreeScanCookie()) {
      setStage('login-required');
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Carica una foto JPG, PNG o WebP.'); setStage('error'); return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('La foto deve essere al massimo di 5 MB.'); setStage('error'); return;
    }

    const localUrl = URL.createObjectURL(file);
    setImageUrl(localUrl); setStage('recognition');
    try {
      const imageData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error('Impossibile leggere la foto.'));
        reader.readAsDataURL(file);
      });
      const result = await freeScanVehiclePhoto(imageData);
      if (!result.recognized || !result.vehicle || !result.report) {
        // L'AI non ha riconosciuto: mostra il popup un attimo, poi passa a input manuale
        await wait(2500);
        setScan(result);
        setStage('manual-input');
        return;
      }
      setFreeScanCookie();
      setScan(result); setReport(result.report); setStage('vehicle-found');
      await wait(3500);
      setStage('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('impiegando troppo tempo')) {
        setError('Il server sta avviandosi (può richiedere fino a 60 secondi la prima volta). Riprova ora che è caldo.');
      } else {
        setError(msg || 'Non riesco a completare l’analisi. Riprova con un’altra foto.');
      }
      setStage('error');
    }
  };

  const handleManualSubmit = async () => {
    if (!manualMake.trim() || !manualModel.trim()) {
      setError('Inserisci almeno marca e modello.');
      return;
    }
    setManualLoading(true); setError('');
    try {
      const year = manualYear.trim() ? Number(manualYear.trim()) : undefined;
      const result = await analyzeVehicle({
        make: manualMake.trim(),
        model: manualModel.trim(),
        ...(year && !isNaN(year) ? { year } : {}),
      });
      setFreeScanCookie();
      setReport(result.report);
      setScan({
        success: true,
        recognized: true,
        vehicle: {
          make: manualMake.trim(),
          model: manualModel.trim(),
          year: year && !isNaN(year) ? year : undefined,
          confidence: 'media',
        },
      });
      setStage('vehicle-found');
      await wait(2500);
      setStage('result');
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

  if (stage === 'idle') {
    return (
      <section className="scanner-hero">
        <div className="scanner-glow scanner-glow-one" /><div className="scanner-glow scanner-glow-two" />
        <div className="scanner-hero-copy">
          <div className="scanner-kicker"><Sparkles className="h-4 w-4" /> Scanner AI per auto</div>
          <h1>Analizza l’auto.<br className="hidden sm:block" /> Scopri modello e prezzo.</h1>
          <p className="scanner-lead">Da una foto riconosciamo marca, modello e anno indicativo, stimiamo il prezzo e creiamo un’analisi dettagliata fatta apposta per quel modello e quell’anno.</p>
          <div className="scanner-promises" aria-label="Informazioni analizzate">
            {promises.map((item) => <span key={item}><Check className="h-3.5 w-3.5" /> {item}</span>)}
          </div>
           <button type="button" className="scanner-cta" onClick={() => inputRef.current?.click()}><Camera className="h-5 w-5" /> Prova la scansione gratuita <ChevronRight className="h-5 w-5" /></button>
           <p className="scanner-microcopy">Prima analisi gratuita e completa, senza account. Per una nuova analisi serve il login.</p>
          <div className="scanner-privacy"><ShieldCheck className="h-4 w-4" /> Salviamo il report, non la fotografia originale.</div>
          <p className="mt-3 flex items-start gap-2 text-xs text-amber-600 max-w-xl">
            <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            L'identificazione AI è indicativa e può contenere errori. Per maggiore precisione carica foto nitide da più angoli (frontale, laterale, posteriore).
          </p>
        </div>
        <div className="scanner-hero-visual" aria-hidden="true">
          <div className="scanner-device">
            <div className="scanner-device-top"><span /><span>AutoEsperto Vision</span><span /></div>
            <div className="scanner-car-silhouette">
              <svg viewBox="0 0 620 300" fill="none"><path d="M75 205 103 145l104-28 68-61h153l79 63 63 27 29 59-23 31H99Z" stroke="currentColor" strokeWidth="2"/><path d="m207 117 68-61h153l79 63M103 145l116 23h282l69-22M142 205h385M236 117l-17 51m236-51 46 51" stroke="currentColor" strokeWidth="1.4"/><circle cx="180" cy="217" r="43" stroke="currentColor" strokeWidth="2"/><circle cx="494" cy="217" r="43" stroke="currentColor" strokeWidth="2"/></svg>
              <div className="scanner-demo-line" />
              <span className="scanner-point point-a" /><span className="scanner-point point-b" /><span className="scanner-point point-c" />
            </div>
            <div className="scanner-device-status"><span>Riconoscimento visivo</span><strong>Pronto</strong></div>
          </div>
        </div>
        <input ref={inputRef} className="hidden" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => handleFile(event.target.files?.[0])} />
      </section>
    );
  }

  if (stage === 'login-required') {
    return (
      <section className="scanner-login-required animate-fade-in">
        <div className="scanner-login-card">
          <span className="scanner-login-icon"><UserRound className="h-6 w-6" /></span>
          <h2>La tua analisi gratuita è già stata usata</h2>
          <p>Accedi o crea un account: avrai una nuova analisi completa gratuita nel tuo account. Solo se vuoi conservare più analisi o salvarla, è richiesto il pagamento.</p>
          <button type="button" className="scanner-cta" onClick={() => router.push('/accesso?next=/account')}><ShieldCheck className="h-5 w-5" /> Accedi e ottieni un’analisi gratis <ChevronRight className="h-5 w-5" /></button>
          <small className="scanner-login-note"><LockKeyhole className="h-3.5 w-3.5" /> Nessun addebito per il login. Il pagamento serve solo per salvare le analisi.</small>
        </div>
      </section>
    );
  }

  if (stage === 'result' && scan?.vehicle && report) {
    const vehicleName = [scan.vehicle.make, scan.vehicle.model].filter(Boolean).join(' ');

    return (
      <section className="scanner-result animate-fade-in">
        <div className="scanner-result-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}<img src={imageUrl} alt={`Foto analizzata: ${vehicleName}`} />
          <div className="scanner-result-shade" />
          <button type="button" onClick={reset} className="scanner-reset"><RotateCcw className="h-4 w-4" /> Nuova analisi</button>
          <div className="scanner-result-title"><span>Analisi gratuita completata</span><h1>{vehicleName}</h1><p>Riconoscimento a confidenza {scan.vehicle.confidence}</p></div>
        </div>

        <div className="scanner-result-banner">
          <ShieldCheck className="h-4 w-4" />
          <span>Questa è la tua analisi completa gratuita. Per salvarla nel tuo account o crearne un’altra, <button type="button" onClick={() => router.push('/accesso?next=/account')} className="scanner-result-banner-link">accedi</button>.</span>
        </div>

        <div className="scanner-result-banner !border-amber-200 !bg-amber-50 !text-amber-800">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <span className="text-amber-800">L'identificazione AI è indicativa e può contenere errori. Verifica sempre con un meccanico prima di acquistare. Carica più foto per migliorare la precisione.</span>
        </div>

        <ReportView report={report} embedded />
      </section>
    );
  }

  const progress = stage === 'recognition' ? 30 : stage === 'vehicle-found' ? 85 : stage === 'manual-input' ? 40 : 0;
  const discovered = scan?.vehicle ? [
    ['Marca trovata', scan.vehicle.make], ['Modello riconosciuto', scan.vehicle.model], ['Anno stimato', scan.vehicle.year],
  ].filter((item) => item[1]) : [];

  return (
    <section className="scanner-workspace animate-fade-in">
      <div className="scanner-photo-stage">
        <div className="relative w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}<img src={imageUrl} alt="Foto dell’auto in analisi" className="w-full h-full object-cover" />
          {stage !== 'error' && (
            <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
              {stage === 'manual-input' ? (
                <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur-xl scanner-popup-animate">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">Riconoscimento automatico non riuscito</h2>
                      <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                        {scan?.message || 'L\'AI non ha identificato l\'auto con sufficiente sicurezza. Inserisci marca e modello per generare comunque il report completo, oppure prova con un\'altra foto.'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Marca *</label>
                      <input
                        type="text"
                        value={manualMake}
                        onChange={(e) => setManualMake(e.target.value)}
                        placeholder="es. Toyota"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Modello *</label>
                      <input
                        type="text"
                        value={manualModel}
                        onChange={(e) => setManualModel(e.target.value)}
                        placeholder="es. Corolla"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Anno (opzionale)</label>
                      <input
                        type="number"
                        value={manualYear}
                        onChange={(e) => setManualYear(e.target.value)}
                        placeholder="es. 2019"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      />
                    </div>
                    {error && (
                      <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700 flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </div>
                    )}
                    <div className="flex flex-col gap-2 pt-2">
                      <button
                        type="button"
                        disabled={manualLoading}
                        onClick={handleManualSubmit}
                        className="scanner-cta disabled:opacity-60 !mt-0"
                      >
                        {manualLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Generazione in corso…</> : <><Sparkles className="h-4 w-4" /> Genera report completo <ChevronRight className="h-4 w-4" /></>}
                      </button>
                      <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="text-sm text-slate-600 hover:text-slate-800 underline underline-offset-2 py-1"
                      >
                        Prova con un’altra foto
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-sm rounded-2xl border border-white/20 bg-slate-900/85 p-5 text-white shadow-2xl backdrop-blur-md scanner-popup-animate">
                  {stage === 'recognition' ? (
                    <>
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="h-5 w-5 text-amber-400 animate-pulse" />
                        <span className="font-bold">Analisi dettagliata e approfondita in corso</span>
                      </div>
                      <p className="text-sm text-white/80 leading-relaxed">
                        L'AI sta analizzando la foto per identificare marca, modello, anno, colore e stato visivo dell'auto…
                      </p>
                      <div className="mt-4 rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
                        <p className="text-xs text-amber-300 flex items-start gap-1.5">
                          <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                          <span>L'identificazione AI può essere imprecisa. Carica foto nitide di più angoli (frontale, laterale, posteriore) per migliorare la precisione.</span>
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-3">
                        <Check className="h-5 w-5 text-emerald-400" />
                        <span className="font-bold">Veicolo riconosciuto</span>
                      </div>
                      <div className="space-y-1.5 text-sm">
                        {scan?.vehicle?.make && <div className="flex justify-between gap-3"><span className="text-white/50">Marca</span><span className="font-semibold text-right">{scan.vehicle.make}</span></div>}
                        {scan?.vehicle?.model && <div className="flex justify-between gap-3"><span className="text-white/50">Modello</span><span className="font-semibold text-right">{scan.vehicle.model}</span></div>}
                        {scan?.vehicle?.generation && <div className="flex justify-between gap-3"><span className="text-white/50">Versione</span><span className="font-semibold text-right">{scan.vehicle.generation}</span></div>}
                        {scan?.vehicle?.year && <div className="flex justify-between gap-3"><span className="text-white/50">Anno stimato</span><span className="font-semibold text-right">{scan.vehicle.year}</span></div>}
                        {scan?.vehicle?.color && <div className="flex justify-between gap-3"><span className="text-white/50">Colore rilevato</span><span className="font-semibold text-right">{scan.vehicle.color}</span></div>}
                        {scan?.vehicle?.bodyType && <div className="flex justify-between gap-3"><span className="text-white/50">Categoria</span><span className="font-semibold text-right">{scan.vehicle.bodyType}</span></div>}
                      </div>
                      <div className="mt-4 rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
                        <p className="text-xs text-amber-300 flex items-start gap-1.5">
                          <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                          <span>Risultato indicativo: l'AI può sbagliare. Verifica sempre con ispezione professionale prima di acquistare.</span>
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="scanner-photo-badge"><Sparkles className="h-4 w-4" /> AutoEsperto Vision</div>
      </div>
      <div className="scanner-work-panel">
        {stage === 'error' ? (
          <div className="scanner-error"><AlertTriangle className="h-7 w-7" /><h2>Analisi non completata</h2><p>{error}</p><button type="button" onClick={() => inputRef.current?.click()}><Upload className="h-4 w-4" /> Scegli un’altra foto</button></div>
        ) : stage === 'manual-input' ? (
          <div className="scanner-manual-side animate-fade-in">
            <div className="scanner-stage-label">Inserimento manuale</div>
            <h2>Inserisci marca e modello</h2>
            <p className="scanner-stage-copy">Compila i dati nel form sopra la foto per generare il report completo comunque.</p>
            <div className="scanner-progress"><div><span>Analisi completata</span><strong>{progress}%</strong></div><div className="scanner-progress-track"><span style={{ width: `${progress}%` }} /></div></div>
          </div>
        ) : (
          <>
            <div className="scanner-stage-label">{stage === 'recognition' ? 'Analisi gratuita in corso' : 'Veicolo riconosciuto'}</div>
            <h2>{stage === 'recognition' ? 'Riconoscimento veicolo e preparazione report completo…' : [scan?.vehicle?.make, scan?.vehicle?.model].filter(Boolean).join(' ')}</h2>
            <p className="scanner-stage-copy">{stage === 'recognition' ? 'La prima analisi è gratuita e include il report completo.' : 'Completamento analisi con prezzo, affidabilità e controlli da fare.'}</p>
            <div className="scanner-progress"><div><span>Analisi completata</span><strong>{progress}%</strong></div><div className="scanner-progress-track"><span style={{ width: `${progress}%` }} /></div></div>
            {discovered.length > 0 && <div className="discovered-grid">{discovered.map(([label, value]) => <div key={String(label)}><span><Check className="h-3.5 w-3.5" /> {label}</span><strong>{value}</strong></div>)}</div>}
          </>
        )}
      </div>
      <input ref={inputRef} className="hidden" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => handleFile(event.target.files?.[0])} />
    </section>
  );
}
