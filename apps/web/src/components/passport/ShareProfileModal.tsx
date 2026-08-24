'use client';

import { useState } from 'react';
import {
  QrCode,
  Share2,
  Copy,
  Check,
  Download,
  ShieldCheck,
  Lock,
  Eye,
  X,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import type { VehiclePassportData, PassportShareConfig } from '@autoesperto/types';

interface ShareProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  passport: VehiclePassportData;
  onUpdateShareConfig: (config: Partial<PassportShareConfig>) => void;
}

export default function ShareProfileModal({
  isOpen,
  onClose,
  passport,
  onUpdateShareConfig,
}: ShareProfileModalProps) {
  const [copied, setCopied] = useState(false);
  const [cfg, setCfg] = useState<PassportShareConfig>(
    passport.shareConfig || {
      enabled: true,
      showVehicleInfo: true,
      showMaintenance: true,
      showRepairs: true,
      showRevisions: true,
      showHealthScore: true,
      showOriginalDocs: false,
      showPhotos: true,
      showTimeline: true,
      showValuation: true,
    }
  );

  if (!isOpen) return null;

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://autoesperto.it';
  const publicUrl = `${siteUrl}/passport/public/${passport.shareCode}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(publicUrl)}&color=0f172a&bgcolor=ffffff`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = `Guarda il Profilo Digitale certificato di questa ${passport.vehicle.make} ${passport.vehicle.model} (Health Score ${passport.healthScore}/100) su AutoEsperto: ${publicUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleToggle = (key: keyof PassportShareConfig) => {
    const updated = { ...cfg, [key]: !cfg[key] };
    setCfg(updated);
    onUpdateShareConfig(updated);
  };

  const handleDownloadQr = async () => {
    try {
      const res = await fetch(qrImageUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `QR-Profilo-${passport.vehicle.make}-${passport.vehicle.model}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      window.open(qrImageUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-blue-600 text-white shadow-xs">
              <Share2 className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Condividi Profilo Digitale Auto
              </h2>
              <p className="text-[11px] text-slate-500">Codice: {passport.shareCode} · QR Code &amp; Link pubblico</p>
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
        <div className="p-6 space-y-6">
          {/* QR Code display */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm shrink-0">
              <img src={qrImageUrl} alt="QR Code Profilo Digitale" className="w-28 h-28 object-contain" />
            </div>
            <div className="space-y-2 text-center sm:text-left flex-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                QR Code Univoco della Macchina
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Scansionabile da qualsiasi smartphone per accedere al profilo certificato.
              </p>
              <button
                onClick={handleDownloadQr}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Scarica QR Code
              </button>
            </div>
          </div>

          {/* Direct Actions */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleWhatsAppShare}
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
            >
              <MessageCircle className="w-4 h-4" /> Invia su WhatsApp
            </button>
            <button
              onClick={handleCopyLink}
              className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Link Copiato!' : 'Copia Link'}
            </button>
          </div>

          {/* Privacy Notice Card */}
          <div className="rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 p-3.5 flex items-start gap-2.5 text-xs text-emerald-900 dark:text-emerald-300">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Zero Dati Personali Esposti</p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5 leading-relaxed">
                Nella pagina pubblica non compariranno mai nome, cognome, indirizzo, telefono o file privati. Sono visibili solo le informazioni tecniche e storiche della macchina da te approvate.
              </p>
            </div>
          </div>

          {/* Granular Visibility Checkboxes */}
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2.5">
              Sezioni Visibili nella Pagina Pubblica
            </p>
            <div className="space-y-2 bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-3 border border-slate-200 dark:border-slate-700">
              <label className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer p-1.5">
                <span>Dati e Specifiche Veicolo</span>
                <input
                  type="checkbox"
                  checked={cfg.showVehicleInfo}
                  onChange={() => handleToggle('showVehicleInfo')}
                  className="rounded text-blue-600 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer p-1.5">
                <span>Vehicle Health Score (Punteggio Stato)</span>
                <input
                  type="checkbox"
                  checked={cfg.showHealthScore}
                  onChange={() => handleToggle('showHealthScore')}
                  className="rounded text-blue-600 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer p-1.5">
                <span>Galleria Fotografica</span>
                <input
                  type="checkbox"
                  checked={cfg.showPhotos}
                  onChange={() => handleToggle('showPhotos')}
                  className="rounded text-blue-600 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer p-1.5">
                <span>Storico Manutenzione &amp; Tagliandi</span>
                <input
                  type="checkbox"
                  checked={cfg.showMaintenance}
                  onChange={() => handleToggle('showMaintenance')}
                  className="rounded text-blue-600 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer p-1.5">
                <span>Timeline Cronologica</span>
                <input
                  type="checkbox"
                  checked={cfg.showTimeline}
                  onChange={() => handleToggle('showTimeline')}
                  className="rounded text-blue-600 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer p-1.5">
                <span>Stima Valore di Mercato</span>
                <input
                  type="checkbox"
                  checked={cfg.showValuation}
                  onChange={() => handleToggle('showValuation')}
                  className="rounded text-blue-600 h-4 w-4"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900">
          <a
            href={`/passport/public/${passport.shareCode}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            Apri anteprima pubblica <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
}
