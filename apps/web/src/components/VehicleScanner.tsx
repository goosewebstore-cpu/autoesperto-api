'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Camera, Check, ChevronRight, Loader2, RotateCcw, ShieldCheck, Sparkles, Upload } from 'lucide-react';
import { freeScanVehiclePhoto, type FreeScanResult } from '@/lib/api';

type ScannerStage = 'idle' | 'recognition' | 'vehicle-found' | 'result' | 'error';

const promises = ['Marca e modello', 'Anno indicativo', 'Prezzo di mercato', 'Gratis al primo utilizzo'];

const euro = (value: number) => `${Math.max(0, Math.round(value / 100) * 100).toLocaleString('it-IT')} €`;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function VehicleScanner() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<ScannerStage>('idle');
  const [imageUrl, setImageUrl] = useState('');
  const [scan, setScan] = useState<FreeScanResult | null>(null);
  const [error, setError] = useState('');

  const reset = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(''); setScan(null); setError(''); setStage('idle');
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleFile = async (file?: File) => {
    if (!file) return;
    setError(''); setScan(null);
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
      if (!result.recognized || !result.vehicle || !result.price) {
        throw new Error(result.message || 'Non riesco a riconoscere l’auto con sufficiente sicurezza. Prova una foto nitida di tre quarti.');
      }
      setScan(result); setStage('vehicle-found');
      await wait(500);
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
          <h1>Analizza l’auto.<br className="hidden sm:block" /> Scopri modello e prezzo.</h1>
          <p className="scanner-lead">Da una foto riconosciamo marca, modello e anno indicativo, stimiamo il prezzo e creiamo un’analisi dettagliata fatta apposta per quel modello e quell’anno.</p>
          <div className="scanner-promises" aria-label="Informazioni analizzate">
            {promises.map((item) => <span key={item}><Check className="h-3.5 w-3.5" /> {item}</span>)}
          </div>
           <button type="button" className="scanner-cta" onClick={() => inputRef.current?.click()}><Camera className="h-5 w-5" /> Prova la scansione gratuita <ChevronRight className="h-5 w-5" /></button>
           <p className="scanner-microcopy">Prima scansione gratuita, senza account. Paghi solo se vuoi il report dettagliato.</p>
          <div className="scanner-privacy"><ShieldCheck className="h-4 w-4" /> Salviamo il report, non la fotografia originale.</div>
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

  if (stage === 'result' && scan?.vehicle && scan.price) {
    const vehicleName = [scan.vehicle.make, scan.vehicle.model].filter(Boolean).join(' ');
    const year = scan.vehicle.year ? String(scan.vehicle.year) : 'anno non determinato';
    const market = scan.price.market;
    const price = market?.priceAvg || scan.price.estimatedValue;

    return (
      <section className="scanner-result animate-fade-in">
        <div className="scanner-result-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}<img src={imageUrl} alt={`Foto analizzata: ${vehicleName}`} />
          <div className="scanner-result-shade" />
          <button type="button" onClick={reset} className="scanner-reset"><RotateCcw className="h-4 w-4" /> Nuova analisi</button>
          <div className="scanner-result-title"><span>Scansione gratuita completata</span><h1>{vehicleName}</h1><p>Riconoscimento a confidenza {scan.vehicle.confidence}</p></div>
        </div>

        <div className="scanner-result-grid">
          <article className="result-card valuation-card"><span className="result-label">Risultato gratuito</span><div className="valuation-list"><div><span>Marca e modello</span><strong>{vehicleName}</strong></div><div><span>Anno indicativo</span><strong>{year}</strong></div><div className="recommended"><span>Prezzo medio indicativo</span><strong>{euro(price)}</strong></div></div><p className="result-note">{market?.total ? `Calcolato su ${market.total} annunci disponibili.` : `Range indicativo: ${euro(scan.price.min)} – ${euro(scan.price.max)}.`}</p></article>
        </div>
        <div className="scanner-report-intro scanner-locked-report">
          <span>Approfondimento AutoEsperto</span>
          <h2>Vuoi tutti i dettagli?</h2>
          <p>Affidabilità del modello, problemi noti, costi futuri, danni visibili, controlli da fare, annunci comparabili e alternative. Il primo risultato resta gratuito; paghi solo se vuoi il report completo.</p>
          <div className="scanner-locked-preview" aria-hidden="true"><span>Affidabilità · Problemi noti · Costi · Danni · Alternative</span></div>
          <button type="button" className="scanner-cta" onClick={() => router.push('/accesso?next=/account')}><ShieldCheck className="h-5 w-5" /> Approfondisci · 5,99 € <ChevronRight className="h-5 w-5" /></button>
          <small>Pagamento unico. Login richiesto solo per acquistare e conservare il report.</small>
        </div>
      </section>
    );
  }

  const progress = stage === 'recognition' ? 24 : stage === 'vehicle-found' ? 72 : 0;
  const discovered = scan?.vehicle ? [
    ['Marca trovata', scan.vehicle.make], ['Modello riconosciuto', scan.vehicle.model], ['Anno stimato', scan.vehicle.year],
  ].filter((item) => item[1]) : [];
  const checks = [
    ['Identificazione veicolo', stage !== 'recognition'],
    ['Marca e modello', Boolean(scan?.vehicle?.make && scan.vehicle.model)],
    ['Anno indicativo', Boolean(scan?.vehicle?.year)],
    ['Prezzo di mercato', Boolean(scan?.price)],
    ['Report dettagliato', false],
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
            <div className="scanner-stage-label">{stage === 'recognition' ? 'Scansione gratuita' : 'Veicolo riconosciuto'}</div>
            <h2>{stage === 'recognition' ? 'Cerco marca, modello e prezzo…' : [scan?.vehicle?.make, scan?.vehicle?.model].filter(Boolean).join(' ')}</h2>
            <p className="scanner-stage-copy">{stage === 'recognition' ? 'Il primo risultato è gratuito e non richiede registrazione.' : 'Ora puoi vedere il risultato base senza creare un account.'}</p>
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
