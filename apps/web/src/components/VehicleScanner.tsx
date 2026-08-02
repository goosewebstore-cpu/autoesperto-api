'use client';

import { useRef, useState } from 'react';
import { AlertTriangle, Camera, Check, ChevronRight, Heart, Loader2, RotateCcw, ShieldCheck, Sparkles, Upload } from 'lucide-react';
import type { AutoReport } from '@autoesperto/types';
import { analyzeVehicle, analyzeVehiclePhoto, type PhotoAnalysis } from '@/lib/api';
import ReportView from '@/components/ReportView';

type ScannerStage = 'idle' | 'recognition' | 'vehicle-found' | 'analysis' | 'result' | 'error';

const promises = ['Marca', 'Modello', 'Versione', 'Anno', 'Stato estetico', 'Danni presenti', 'Valore di mercato', 'Costi di riparazione'];

const damageLabels: Record<string, string> = {
  graffio: 'Graffio sulla carrozzeria',
  ammaccatura: 'Ammaccatura',
  paraurti: 'Paraurti',
  fanale: 'Gruppo ottico',
  specchietto: 'Specchietto',
  cerchio_gomma: 'Cerchio o pneumatico',
  nessun_danno_evidente: 'Nessun danno evidente',
  non_chiaro: 'Area non valutabile',
};

const euro = (value: number) => `${Math.max(0, Math.round(value / 100) * 100).toLocaleString('it-IT')} €`;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function VehicleScanner() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<ScannerStage>('idle');
  const [imageUrl, setImageUrl] = useState('');
  const [analysis, setAnalysis] = useState<PhotoAnalysis | null>(null);
  const [report, setReport] = useState<AutoReport | null>(null);
  const [error, setError] = useState('');

  const reset = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(''); setAnalysis(null); setReport(null); setError(''); setStage('idle');
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleFile = async (file?: File) => {
    if (!file) return;
    setError(''); setAnalysis(null); setReport(null);
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
      const photoResponse = await analyzeVehiclePhoto(imageData);
      let photo = photoResponse.analysis;
      if (!photo.vehicle.make || !photo.vehicle.model) {
        const retryResponse = await analyzeVehiclePhoto(imageData);
        photo = retryResponse.analysis;
      }
      setAnalysis(photo); setStage('vehicle-found');

      if (!photo.vehicle.make || !photo.vehicle.model) {
        throw new Error('Non riesco a riconoscere l’auto con sufficiente sicurezza. Prova una foto nitida di tre quarti.');
      }

      await wait(850);
      setStage('analysis');
      const reportResponse = await analyzeVehicle({
        make: photo.vehicle.make,
        model: photo.vehicle.model,
        year: photo.vehicle.year,
      });
      setReport(reportResponse.report);
      await wait(450);
      setStage('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || 'Non riesco a completare l’analisi. Riprova con un’altra foto.');
      setStage('error');
    }
  };

  if (stage === 'idle') {
    return (
      <section className="scanner-hero">
        <div className="scanner-glow scanner-glow-one" /><div className="scanner-glow scanner-glow-two" />
        <div className="scanner-hero-copy">
          <div className="scanner-kicker"><Sparkles className="h-4 w-4" /> Scanner AI per auto</div>
          <h1>Analisi AI completa<br className="hidden sm:block" /> della tua macchina</h1>
          <p className="scanner-lead">Scopri in pochi secondi ogni dettaglio visibile del tuo veicolo, il suo valore indicativo e cosa potrebbe costare ripararlo.</p>
          <div className="scanner-promises" aria-label="Informazioni analizzate">
            {promises.map((item) => <span key={item}><Check className="h-3.5 w-3.5" /> {item}</span>)}
          </div>
          <button type="button" className="scanner-cta" onClick={() => inputRef.current?.click()}><Camera className="h-5 w-5" /> Analizza la mia macchina <ChevronRight className="h-5 w-5" /></button>
          <p className="scanner-microcopy">Carica una foto e lascia che l’AI faccia il resto.</p>
          <div className="scanner-privacy"><ShieldCheck className="h-4 w-4" /> La foto viene analizzata e non viene salvata.</div>
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

  if (stage === 'result' && analysis && report) {
    const repairMin = analysis.repairRange?.min || 0;
    const repairMax = analysis.repairRange?.max || 0;
    const repair = repairMax ? Math.round((repairMin + repairMax) / 2) : 0;
    const undamagedValue = report.price.adjustedForKm || report.price.estimatedValue;
    const currentValue = Math.max(0, undamagedValue - repair);
    const healthPenalty = analysis.damage.visible ? (analysis.damage.severity === 'alta' ? 18 : analysis.damage.severity === 'media' ? 10 : 5) : 0;
    const healthScore = Math.max(1, Math.min(100, Math.round(report.reliability.score * 10 - healthPenalty)));
    const vehicleName = [analysis.vehicle.make, analysis.vehicle.model, analysis.vehicle.generation, analysis.vehicle.year].filter(Boolean).join(' ');

    return (
      <section className="scanner-result animate-fade-in">
        <div className="scanner-result-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}<img src={imageUrl} alt={`Foto analizzata: ${vehicleName}`} />
          <div className="scanner-result-shade" />
          <button type="button" onClick={reset} className="scanner-reset"><RotateCcw className="h-4 w-4" /> Nuova analisi</button>
          <div className="scanner-result-title"><span>Analisi completata</span><h1>{vehicleName}</h1><p>Riconoscimento a confidenza {analysis.vehicle.confidence}</p></div>
        </div>

        <div className="scanner-result-grid">
          <article className="health-card"><div><span className="result-label">Car Health Score</span><h2><Heart className="h-6 w-6" fill="currentColor" /> {healthScore}<small>/100</small></h2><p>Indice indicativo basato sul modello e sui danni esterni visibili.</p></div><div className="health-ring" style={{ '--health': `${healthScore * 3.6}deg` } as React.CSSProperties}><span>{healthScore}</span></div></article>

          <article className="result-card valuation-card"><span className="result-label">Valutazione AI</span><div className="valuation-list"><div><span>Valore senza danni</span><strong>{euro(undamagedValue)}</strong></div><div><span>Valore attuale indicativo</span><strong>{euro(currentValue)}</strong></div><div><span>Costo riparazione</span><strong>{repairMax ? `${euro(repairMin)} – ${euro(repairMax)}` : 'Non rilevato'}</strong></div><div className="recommended"><span>Prezzo vendita consigliato</span><strong>{euro(currentValue)}</strong></div></div></article>

          <article className="result-card damage-card"><div className="result-card-heading"><div><span className="result-label">Analisi esterna</span><h2>{analysis.damage.visible ? 'Danno visibile rilevato' : 'Nessun danno evidente'}</h2></div>{analysis.damage.visible ? <AlertTriangle className="h-6 w-6 text-amber-500" /> : <Check className="h-6 w-6 text-emerald-600" />}</div><div className="damage-row"><span className={analysis.damage.visible ? 'damage-dot warning' : 'damage-dot good'} /><div><strong>{damageLabels[analysis.damage.category] || 'Area esterna'}</strong><p>{analysis.damage.description}</p>{repairMax > 0 && <span className="damage-price">Riparazione stimata: {euro(repairMin)} – {euro(repairMax)}</span>}</div></div><p className="result-note">{analysis.note}</p></article>
        </div>
        <div className="scanner-report-intro">
          <span>Report completo AutoEsperto</span>
          <h2>Tutti i dettagli della tua auto</h2>
          <p>Affidabilità, scheda tecnica, motore, cambio, problemi noti, costi futuri, dati di mercato, annunci comparabili e alternative.</p>
        </div>
        <ReportView report={report} embedded />
      </section>
    );
  }

  const progress = stage === 'recognition' ? 24 : stage === 'vehicle-found' ? 52 : stage === 'analysis' ? 78 : 0;
  const discovered = analysis ? [
    ['Marca trovata', analysis.vehicle.make], ['Modello riconosciuto', analysis.vehicle.model], ['Versione individuata', analysis.vehicle.generation], ['Anno stimato', analysis.vehicle.year], ['Colore rilevato', analysis.vehicle.color], ['Categoria', analysis.vehicle.bodyType],
  ].filter((item) => item[1]) : [];
  const checks = [
    ['Identificazione veicolo', stage !== 'recognition'],
    ['Analisi carrozzeria', Boolean(analysis)],
    ['Rilevamento danni visibili', Boolean(analysis)],
    ['Stima riparazione', Boolean(analysis?.repairRange)],
    ['Valore di mercato', Boolean(report)],
    ['Car Health Score', Boolean(report)],
  ] as const;

  return (
    <section className="scanner-workspace animate-fade-in">
      <div className="scanner-photo-stage">
        {/* eslint-disable-next-line @next/next/no-img-element */}<img src={imageUrl} alt="Foto dell’auto in analisi" />
        {stage !== 'error' && <><div className="scanner-photo-line" /><div className="scanner-focus focus-one" /><div className="scanner-focus focus-two" /><div className="scanner-focus focus-three" /></>}
        <div className="scanner-photo-badge"><Sparkles className="h-4 w-4" /> AutoEsperto Vision</div>
      </div>
      <div className="scanner-work-panel">
        {stage === 'error' ? (
          <div className="scanner-error"><AlertTriangle className="h-7 w-7" /><h2>Analisi non completata</h2><p>{error}</p><button type="button" onClick={() => inputRef.current?.click()}><Upload className="h-4 w-4" /> Scegli un’altra foto</button></div>
        ) : (
          <>
            <div className="scanner-stage-label">{stage === 'recognition' ? 'Identificazione veicolo' : stage === 'vehicle-found' ? 'Veicolo riconosciuto' : 'Analisi completa'}</div>
            <h2>{stage === 'recognition' ? 'Analisi AI in corso…' : stage === 'vehicle-found' ? [analysis?.vehicle.make, analysis?.vehicle.model].filter(Boolean).join(' ') : 'Calcolo valore e stato dell’auto…'}</h2>
            <p className="scanner-stage-copy">{stage === 'recognition' ? 'Osservo forme, dettagli e componenti visibili.' : stage === 'vehicle-found' ? 'Le informazioni vengono scoperte dalla foto, senza compilazione manuale.' : 'Sto preparando la valutazione finale usando i dati realmente disponibili.'}</p>
            <div className="scanner-progress"><div><span>Analisi completata</span><strong>{progress}%</strong></div><div className="scanner-progress-track"><span style={{ width: `${progress}%` }} /></div></div>
            {discovered.length > 0 && <div className="discovered-grid">{discovered.map(([label, value]) => <div key={String(label)}><span><Check className="h-3.5 w-3.5" /> {label}</span><strong>{value}</strong></div>)}</div>}
            <div className="scanner-checklist">{checks.map(([label, done]) => <div key={label} className={done ? 'done' : ''}><span>{done ? <Check className="h-3.5 w-3.5" /> : <Loader2 className="h-3.5 w-3.5 animate-spin" />}</span>{label}</div>)}</div>
          </>
        )}
      </div>
      <input ref={inputRef} className="hidden" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => handleFile(event.target.files?.[0])} />
    </section>
  );
}
