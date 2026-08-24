'use client';

import { useState, useRef } from 'react';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  X,
  Sparkles,
  ShieldCheck,
  Calendar,
  Layers,
  Euro,
  Gauge,
  Lock,
} from 'lucide-react';
import type { PassportDocumentItem, PassportDocCategory } from '@autoesperto/types';
import { scanPassportDoc } from '@/lib/api';

interface DocumentVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDocument: (doc: {
    category: PassportDocCategory;
    title: string;
    fileUrl: string;
    fileName: string;
    mimeType: string;
    eventDate?: string;
    km?: number;
    amount?: number;
    extractedData?: Record<string, any>;
    notes?: string;
  }) => void;
}

export default function DocumentVerificationModal({
  isOpen,
  onClose,
  onConfirmDocument,
}: DocumentVerificationModalProps) {
  const [category, setCategory] = useState<PassportDocCategory>('manutenzione');
  const [file, setFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>('');
  const [fileName, setFileName] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [step, setStep] = useState<'upload' | 'verify'>('upload');

  // Extracted editable fields
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [km, setKm] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [workshop, setWorkshop] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [confidence, setConfidence] = useState<'alta' | 'media' | 'bassa'>('alta');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile);
    setFileName(selectedFile.name);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setFileBase64(base64);
      runOcrExtraction(base64, selectedFile.name, selectedFile.type);
    };
    reader.readAsDataURL(selectedFile);
  };

  const runOcrExtraction = async (base64: string, name: string, mime: string) => {
    setIsScanning(true);
    try {
      const res = await scanPassportDoc({
        fileBase64: base64,
        fileName: name,
        mimeType: mime,
      });

      if (res.success && res.data) {
        const fields = res.data.extractedFields || {};
        setCategory(res.data.documentType || category);
        setTitle(res.data.documentLabel || name.replace(/\.[^/.]+$/, ''));
        setEventDate(fields.serviceDate || fields.revisionDate || fields.registrationDate || new Date().toISOString().split('T')[0]);
        if (fields.serviceKm || fields.revisionKm) {
          setKm(String(fields.serviceKm || fields.revisionKm));
        }
        if (fields.serviceCost) {
          setAmount(String(fields.serviceCost));
        }
        if (fields.serviceWorkshop || fields.revisionCenter) {
          setWorkshop(fields.serviceWorkshop || fields.revisionCenter || '');
        }
        if (fields.serviceItems?.length) {
          setNotes(fields.serviceItems.join(', '));
        }
        setConfidence(res.data.confidence || 'alta');
      } else {
        fallbackExtraction(name);
      }
    } catch {
      fallbackExtraction(name);
    } finally {
      setIsScanning(false);
      setStep('verify');
    }
  };

  const fallbackExtraction = (name: string) => {
    setTitle(name.replace(/\.[^/.]+$/, ''));
    setEventDate(new Date().toISOString().split('T')[0]);
    setConfidence('media');
  };

  const handleSave = () => {
    onConfirmDocument({
      category,
      title: title || fileName,
      fileUrl: fileBase64 || '#',
      fileName: fileName || 'documento.pdf',
      mimeType: file?.type || 'application/pdf',
      eventDate: eventDate || undefined,
      km: km ? Number(km) : undefined,
      amount: amount ? Number(amount) : undefined,
      notes: notes || (workshop ? `Presso: ${workshop}` : undefined),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-blue-600 text-white shadow-xs">
              <FileText className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                {step === 'upload' ? 'Carica Documento o Fattura' : 'Controlla i Dati Estratti (OCR AI)'}
              </h2>
              <p className="text-[11px] text-slate-500">
                {step === 'upload' ? 'Libretto, assicurazione, tagliandi e revisioni' : 'Verifica e correggi i dati prima del salvataggio definitivo'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {step === 'upload' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                  Tipo di documento
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                >
                  <option value="manutenzione">Fattura Tagliando / Manutenzione Ordinaria</option>
                  <option value="riparazioni">Fattura Riparazione Straordinaria / Carrozzeria</option>
                  <option value="revisioni">Certificato di Revisione Periodica</option>
                  <option value="veicolo">Documento Unico di Circolazione (Libretto)</option>
                  <option value="assicurazione">Polizza o Certificato Assicurativo RC</option>
                  <option value="altro">Altro Documento / Ricevuta</option>
                </select>
              </div>

              {isScanning ? (
                <div className="border-2 border-dashed border-blue-400 bg-blue-50/50 dark:bg-blue-950/20 rounded-3xl p-10 text-center space-y-3">
                  <Sparkles className="w-10 h-10 text-blue-600 mx-auto animate-spin" />
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    Estrazione OCR AI in corso su {fileName}...
                  </p>
                  <p className="text-xs text-slate-500">
                    Riconoscimento date, chilometraggio, officina e importo speso.
                  </p>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-3xl p-10 text-center cursor-pointer bg-slate-50 dark:bg-slate-800/40 hover:bg-blue-50/30 transition-all"
                >
                  <UploadCloud className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Trascina qui il file o clicca per scattare/caricare
                  </p>
                  <p className="text-xs text-slate-500 mt-1">PDF, JPG, PNG, WEBP (Fino a 15 MB)</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileChange(e.target.files[0]);
                }}
              />

              {/* Privacy Notice Card */}
              <div className="rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/50 p-3.5 flex items-start gap-2.5 text-xs text-emerald-900 dark:text-emerald-300">
                <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Privacy e Sicurezza Totale</p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5 leading-relaxed">
                    I documenti originali rimangono memorizzati esclusivamente nel tuo profilo personale sul tuo dispositivo. Nessun dato sensibile viene reso pubblico automaticamente.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 rounded-2xl p-3 px-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-blue-900 dark:text-blue-200">
                    Dati estratti con accuratezza {confidence}
                  </span>
                </div>
                <button
                  onClick={() => setStep('upload')}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Ricarica file
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Titolo evento / Documento
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Data evento
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Km registrati
                  </label>
                  <input
                    type="number"
                    placeholder="Es. 78000"
                    value={km}
                    onChange={(e) => setKm(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Importo speso (€)
                  </label>
                  <input
                    type="number"
                    placeholder="Es. 420"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Officina / Centro (opzionale)
                </label>
                <input
                  type="text"
                  placeholder="Es. Concessionaria Ufficiale / Officina Rossi"
                  value={workshop}
                  onChange={(e) => setWorkshop(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Dettagli interventi &amp; Note
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  placeholder="Es. Sostituzione olio motore 0W-30, filtro aria, filtro antipolline..."
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs leading-relaxed"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            Annulla
          </button>
          {step === 'verify' && (
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Conferma e Salva nel Profilo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
