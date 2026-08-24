'use client';

import { useState } from 'react';
import {
  Tag,
  CheckCircle2,
  Euro,
  Phone,
  MessageCircle,
  Mail,
  ShieldCheck,
  X,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import type { VehiclePassportData, SellingProfileConfig } from '@autoesperto/types';

interface SellingModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  passport: VehiclePassportData;
  onSaveSellingConfig: (config: SellingProfileConfig) => void;
}

export default function SellingModeModal({
  isOpen,
  onClose,
  passport,
  onSaveSellingConfig,
}: SellingModeModalProps) {
  const [enabled, setEnabled] = useState<boolean>(passport.sellingConfig?.enabled ?? true);
  const [askingPrice, setAskingPrice] = useState<string>(
    passport.sellingConfig?.askingPrice ? String(passport.sellingConfig.askingPrice) : String(passport.estimatedValue || 20000)
  );
  const [negotiable, setNegotiable] = useState<boolean>(passport.sellingConfig?.negotiable ?? true);
  const [allowContact, setAllowContact] = useState<boolean>(passport.sellingConfig?.allowContact ?? true);
  const [contactMethod, setContactMethod] = useState<'whatsapp' | 'email' | 'phone'>(
    passport.sellingConfig?.contactMethod || 'whatsapp'
  );
  const [contactValue, setContactValue] = useState<string>(passport.sellingConfig?.contactValue || '');
  const [sellerNotes, setSellerNotes] = useState<string>(
    passport.sellingConfig?.sellerNotes ||
      `Auto in ottime condizioni, tagliandi regolari e storico documentato con il Profilo Digitale AutoEsperto.`
  );

  if (!isOpen) return null;

  const handleSave = () => {
    const config: SellingProfileConfig = {
      enabled,
      askingPrice: askingPrice ? Number(askingPrice) : undefined,
      negotiable,
      showValuation: true,
      showHealthScore: true,
      showMaintenance: true,
      showInspection: true,
      showPhotos: true,
      allowContact,
      contactMethod,
      contactValue: contactValue || undefined,
      sellerNotes,
    };
    onSaveSellingConfig(config);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-blue-600 text-white shadow-xs">
              <Tag className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Prepara Profilo per la Vendita
              </h2>
              <p className="text-[11px] text-slate-500">Ottimizza la scheda per i potenziali acquirenti</p>
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
          {/* Main Switch */}
          <div className="flex items-center justify-between p-3.5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 rounded-2xl">
            <div>
              <p className="text-xs font-bold text-blue-950 dark:text-blue-200">
                Attiva Modalità Vendita
              </p>
              <p className="text-[11px] text-blue-700 dark:text-blue-400 mt-0.5">
                Mostra prezzo richiesto, note per l&apos;acquirente e pulsante contatto.
              </p>
            </div>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="rounded text-blue-600 h-5 w-5 cursor-pointer"
            />
          </div>

          {enabled && (
            <div className="space-y-4">
              {/* Price & Negotiable */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Prezzo Richiesto (€)
                  </label>
                  <input
                    type="number"
                    value={askingPrice}
                    onChange={(e) => setAskingPrice(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                  />
                </div>

                <div className="flex items-end pb-1.5">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={negotiable}
                      onChange={(e) => setNegotiable(e.target.checked)}
                      className="rounded text-blue-600 h-4 w-4"
                    />
                    <span>Trattabile</span>
                  </label>
                </div>
              </div>

              {/* Contact Method */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowContact}
                    onChange={(e) => setAllowContact(e.target.checked)}
                    className="rounded text-blue-600 h-4 w-4"
                  />
                  <span>Permetti all&apos;acquirente di contattarmi</span>
                </label>

                {allowContact && (
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setContactMethod('whatsapp')}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border transition-all ${
                        contactMethod === 'whatsapp'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs'
                          : 'bg-white dark:bg-slate-800 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp
                    </button>

                    <button
                      type="button"
                      onClick={() => setContactMethod('phone')}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border transition-all ${
                        contactMethod === 'phone'
                          ? 'bg-blue-50 text-blue-800 border-blue-300 shadow-2xs'
                          : 'bg-white dark:bg-slate-800 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Phone className="w-3.5 h-3.5 text-blue-600" /> Telefono
                    </button>

                    <button
                      type="button"
                      onClick={() => setContactMethod('email')}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border transition-all ${
                        contactMethod === 'email'
                          ? 'bg-purple-50 text-purple-800 border-purple-300 shadow-2xs'
                          : 'bg-white dark:bg-slate-800 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5 text-purple-600" /> Email
                    </button>
                  </div>
                )}

                {allowContact && (
                  <div>
                    <input
                      type="text"
                      placeholder={
                        contactMethod === 'whatsapp'
                          ? 'Numero WhatsApp (es. 340 1234567)'
                          : contactMethod === 'phone'
                          ? 'Numero di telefono'
                          : 'Indirizzo email per le richieste'
                      }
                      value={contactValue}
                      onChange={(e) => setContactValue(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                    />
                  </div>
                )}
              </div>

              {/* Seller notes */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Messaggio del Venditore / Descrizione Annuncio
                </label>
                <textarea
                  rows={3}
                  value={sellerNotes}
                  onChange={(e) => setSellerNotes(e.target.value)}
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
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600"
          >
            Annulla
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Salva impostazioni vendita
          </button>
        </div>
      </div>
    </div>
  );
}
