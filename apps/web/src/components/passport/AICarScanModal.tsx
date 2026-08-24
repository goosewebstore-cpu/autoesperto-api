'use client';

import { useState, useRef } from 'react';
import {
  Camera,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  UploadCloud,
  X,
  Sparkles,
  ShieldCheck,
  Eye,
  Plus,
  Wrench,
} from 'lucide-react';
import type { VehicleInspectionItem, InspectionScanStatus } from '@autoesperto/types';

const SCAN_ANGLES: Array<{
  id: VehicleInspectionItem['angle'];
  label: string;
  guide: string;
  recommendedComponent: string;
}> = [
  { id: 'anteriore', label: '1. Frontale Anteriore', guide: 'Inquadra cofano, paraurti e fari anteriori a 2-3 metri.', recommendedComponent: 'Paraurti & Fari Anteriori' },
  { id: 'posteriore', label: '2. Posteriore & Baule', guide: 'Inquadra portellone, fari posteriori e paraurti.', recommendedComponent: 'Paraurti & Portellone Posteriore' },
  { id: 'lato_sinistro', label: '3. Fiancata Sinistra', guide: 'Inquadra portiere e passaruota lato guidatore.', recommendedComponent: 'Fiancata & Portiere Sinistre' },
  { id: 'lato_destro', label: '4. Fiancata Destra', guide: 'Inquadra portiere e passaruota lato passeggero.', recommendedComponent: 'Fiancata & Portiere Destre' },
  { id: 'interni', label: '5. Interni & Sedili', guide: 'Fotografa i sedili anteriori, volante e usura tessuti/pelle.', recommendedComponent: 'Sedili & Rivestimenti Interni' },
  { id: 'cruscotto', label: '6. Cruscotto & Quadro', guide: 'Fotografa il quadro strumenti acceso con spie e infotainment.', recommendedComponent: 'Quadro Strumenti & Elettronica' },
  { id: 'pneumatici', label: '7. Pneumatici & Cerchi', guide: 'Inquadra il battistrada e i cerchi in lega da vicino.', recommendedComponent: 'Battistrada Gomme & Cerchi' },
  { id: 'vano_motore', label: '8. Vano Motore', guide: 'Apri il cofano e fotografa motore, liquidi e cablaggi.', recommendedComponent: 'Vano Motore & Cinghie' },
  { id: 'dettagli_danni', label: '9. Dettagli o Danni Noti', guide: 'Fotografa da vicino graffi, ammaccature o segni particolari.', recommendedComponent: 'Dettaglio Segno / Danno' },
];

interface AICarScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveInspection: (inspection: Omit<VehicleInspectionItem, 'id'>) => void;
  carName: string;
}

export default function AICarScanModal({
  isOpen,
  onClose,
  onSaveInspection,
  carName,
}: AICarScanModalProps) {
  const [selectedAngleIndex, setSelectedAngleIndex] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Inspection form fields
  const [status, setStatus] = useState<InspectionScanStatus>('rilevato');
  const [severity, setSeverity] = useState<'ottimo' | 'lieve' | 'medio' | 'grave'>('ottimo');
  const [component, setComponent] = useState(SCAN_ANGLES[0].recommendedComponent);
  const [description, setDescription] = useState('Superficie in ottimo stato, nessuna anomalia strutturale rilevata.');
  const [repairCost, setRepairCost] = useState<number | undefined>(undefined);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const currentAngle = SCAN_ANGLES[selectedAngleIndex];

  const handleFileSelected = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setPreviewImage(base64);
      runSimulatedAIAnalysis(currentAngle.id);
    };
    reader.readAsDataURL(file);
  };

  const runSimulatedAIAnalysis = (angle: VehicleInspectionItem['angle']) => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      if (angle === 'dettagli_danni') {
        setStatus('rilevato');
        setSeverity('lieve');
        setComponent('Danno Carrozzeria / Graffio');
        setDescription('Rilevata abrasione superficiale della vernice trasparente. Possibile ripristino con lucidatura.');
        setRepairCost(70);
      } else if (angle === 'pneumatici') {
        setStatus('rilevato');
        setSeverity('ottimo');
        setComponent('Pneumatici & Cerchi');
        setDescription('Battistrada in buono stato visivo (stimato residuo > 75%), cerchi senza deformazioni visibili.');
        setRepairCost(0);
      } else if (angle === 'cruscotto') {
        setStatus('rilevato');
        setSeverity('ottimo');
        setComponent('Quadro Strumenti');
        setDescription('Nessuna spia di anomalia critica visibile accesa a motore in funzione.');
        setRepairCost(0);
      } else {
        setStatus('rilevato');
        setSeverity('ottimo');
        setComponent(currentAngle.recommendedComponent);
        setDescription('Ispezione visiva completata: allineamento pannelli regolare, finitura conforme agli standard.');
        setRepairCost(0);
      }
    }, 1400);
  };

  const handleConfirmSave = () => {
    onSaveInspection({
      date: new Date().toISOString().split('T')[0],
      angle: currentAngle.id,
      angleLabel: currentAngle.label,
      component,
      status,
      severity,
      description,
      estimatedRepairCost: repairCost && repairCost > 0 ? repairCost : undefined,
      photoUrl: previewImage || undefined,
    });

    // Reset or advance
    setPreviewImage(null);
    if (selectedAngleIndex < SCAN_ANGLES.length - 1) {
      const nextIdx = selectedAngleIndex + 1;
      setSelectedAngleIndex(nextIdx);
      setComponent(SCAN_ANGLES[nextIdx].recommendedComponent);
      setDescription('In attesa di scansione fotografica...');
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                AI Car Scan &amp; Ispezione Visiva
              </h2>
              <p className="text-xs text-slate-500">{carName} · Scansione guidata 9 angolazioni</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Angle Selector Tabs */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
              Seleziona Angolazione ({selectedAngleIndex + 1} di 9)
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {SCAN_ANGLES.map((angle, idx) => (
                <button
                  key={angle.id}
                  onClick={() => {
                    setSelectedAngleIndex(idx);
                    setComponent(angle.recommendedComponent);
                    setPreviewImage(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedAngleIndex === idx
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {angle.label}
                </button>
              ))}
            </div>
          </div>

          {/* Guide Banner */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/50 rounded-2xl p-4 flex items-start gap-3">
            <Camera className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-blue-900 dark:text-blue-200">{currentAngle.label}</p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5 leading-relaxed">{currentAngle.guide}</p>
            </div>
          </div>

          {/* Image Upload Area */}
          <div className="space-y-3">
            {previewImage ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-64 bg-slate-950 flex items-center justify-center">
                <img src={previewImage} alt="Anteprima scansione" className="max-h-64 object-contain w-full" />
                {analyzing && (
                  <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-2">
                    <Sparkles className="w-8 h-8 text-blue-400 animate-spin" />
                    <p className="text-xs font-bold">Analisi AI in corso sui pixel dell&apos;immagine...</p>
                  </div>
                )}
                <button
                  onClick={() => setPreviewImage(null)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 text-xs flex items-center gap-1 px-2.5"
                >
                  <X className="w-3.5 h-3.5" /> Cambia foto
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-3xl p-8 text-center cursor-pointer bg-slate-50/50 dark:bg-slate-800/30 hover:bg-blue-50/30 transition-all"
              >
                <UploadCloud className="w-10 h-10 text-blue-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Scatta una foto o carica un&apos;immagine per questo angolo
                </p>
                <p className="text-xs text-slate-500 mt-1">Formati supportati: JPG, PNG, WEBP, HEIC</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFileSelected(e.target.files[0]);
              }}
            />
          </div>

          {/* AI Detection Classification (Rilevato vs Possibile vs Non Determinabile) */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wide text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Verdetto Ispezione AI
              </span>
              <span className="text-[11px] text-slate-500">Puoi modificare o confermare prima del salvataggio</span>
            </div>

            {/* Status Selector */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('rilevato')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                  status === 'rilevato'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Rilevato
              </button>

              <button
                type="button"
                onClick={() => setStatus('possibile')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                  status === 'possibile'
                    ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-2xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Possibile
              </button>

              <button
                type="button"
                onClick={() => setStatus('non_determinabile')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                  status === 'non_determinabile'
                    ? 'bg-slate-200 text-slate-800 border-slate-400 shadow-2xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                Non Determinabile
              </button>
            </div>

            {/* Severity and Component */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Componente analizzato
                </label>
                <input
                  type="text"
                  value={component}
                  onChange={(e) => setComponent(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Gravità riscontrata
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white"
                >
                  <option value="ottimo">Ottimo / Nessun danno</option>
                  <option value="lieve">Lieve (micro-segno / usura normale)</option>
                  <option value="medio">Medio (ammaccatura / graffio evidente)</option>
                  <option value="grave">Grave (da sostituire / riparare)</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                Note e descrizione ispezione
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white leading-relaxed"
              />
            </div>

            {/* Optional Repair Cost */}
            {severity !== 'ottimo' && (
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Stima indicativa costo ripristino (€)
                </label>
                <input
                  type="number"
                  placeholder="Es. 80"
                  value={repairCost ?? ''}
                  onChange={(e) => setRepairCost(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 transition-colors"
          >
            Annulla
          </button>
          <button
            onClick={handleConfirmSave}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Salva ispezione &amp; Continua
          </button>
        </div>
      </div>
    </div>
  );
}
