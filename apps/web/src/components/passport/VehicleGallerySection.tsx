'use client';

import { useState, useRef } from 'react';
import {
  Camera,
  Plus,
  Trash2,
  X,
  UploadCloud,
  Image as ImageIcon,
  Tag,
  Calendar,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import type { PassportPhotoItem, PassportPhotoCategory } from '@autoesperto/types';

const CATEGORIES: Array<{ id: 'tutte' | PassportPhotoCategory; label: string }> = [
  { id: 'tutte', label: 'Tutte' },
  { id: 'auto', label: 'Auto' },
  { id: 'esterni', label: 'Esterni' },
  { id: 'interni', label: 'Interni' },
  { id: 'motore', label: 'Motore' },
  { id: 'pneumatici', label: 'Pneumatici' },
  { id: 'danni', label: 'Danni & Dettagli' },
  { id: 'manutenzione', label: 'Manutenzione' },
  { id: 'documenti', label: 'Documenti' },
  { id: 'prima_dopo', label: 'Prima/Dopo' },
];

interface VehicleGallerySectionProps {
  photos: PassportPhotoItem[];
  onAddPhoto: (photo: Omit<PassportPhotoItem, 'id'>) => void;
  onDeletePhoto: (photoId: string) => void;
}

export default function VehicleGallerySection({
  photos,
  onAddPhoto,
  onDeletePhoto,
}: VehicleGallerySectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<'tutte' | PassportPhotoCategory>('tutte');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState<PassportPhotoItem | null>(null);

  // Upload modal states
  const [newCategory, setNewCategory] = useState<PassportPhotoCategory>('esterni');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const filteredPhotos = selectedCategory === 'tutte'
    ? photos
    : photos.filter((p) => p.category === selectedCategory);

  const handleImageSelected = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSavePhoto = () => {
    if (!previewUrl) return;
    onAddPhoto({
      url: previewUrl,
      category: newCategory,
      title: newTitle || 'Fotografia veicolo',
      description: newDescription || undefined,
      date: newDate,
    });
    setShowUploadModal(false);
    setPreviewUrl(null);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="space-y-5">
      {/* Category Pills & Add Photo Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const count = cat.id === 'tutte'
              ? photos.length
              : photos.filter((p) => p.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat.label}
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedCategory === cat.id ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Aggiungi foto
        </button>
      </div>

      {/* Grid of Photos */}
      {filteredPhotos.length === 0 ? (
        <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center bg-slate-50/50 dark:bg-slate-900/40">
          <ImageIcon className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Nessuna fotografia presente in questa categoria
          </p>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Carica le foto della tua auto per completare il suo profilo digitale permanente.
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs"
          >
            Carica prima foto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 aspect-4/3 cursor-pointer shadow-xs hover:shadow-md transition-all"
              onClick={() => setLightboxPhoto(photo)}
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
                  {photo.category}
                </span>
                <p className="text-xs font-bold truncate">{photo.title}</p>
                {photo.date && (
                  <p className="text-[10px] text-slate-300">{photo.date}</p>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeletePhoto(photo.id);
                }}
                title="Elimina foto"
                className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-all text-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Preview */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xs"
          onClick={() => setLightboxPhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/80 hover:bg-slate-950 text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="max-h-[75vh] flex items-center justify-center bg-slate-950 rounded-2xl overflow-hidden">
              <img
                src={lightboxPhoto.url}
                alt={lightboxPhoto.title}
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>
            <div className="p-4 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-400">
                  Categoria: {lightboxPhoto.category}
                </span>
                <h3 className="text-sm font-bold">{lightboxPhoto.title}</h3>
                {lightboxPhoto.description && (
                  <p className="text-xs text-slate-300 mt-0.5">{lightboxPhoto.description}</p>
                )}
              </div>
              {lightboxPhoto.date && (
                <span className="text-xs text-slate-400 shrink-0 font-medium">
                  {lightboxPhoto.date}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Photo Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Aggiungi fotografia al profilo
                </h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {previewUrl ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-52 bg-slate-950 flex items-center justify-center">
                  <img src={previewUrl} alt="Preview" className="max-h-52 object-contain w-full" />
                  <button
                    onClick={() => setPreviewUrl(null)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white text-xs"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-2xl p-6 text-center cursor-pointer bg-slate-50 dark:bg-slate-800/40 hover:bg-blue-50/30 transition-all"
                >
                  <UploadCloud className="w-8 h-8 text-blue-500 mx-auto mb-1.5" />
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Seleziona un&apos;immagine dal tuo dispositivo
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">JPG, PNG, WEBP, HEIC</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleImageSelected(e.target.files[0]);
                }}
              />

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Categoria
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                  >
                    <option value="auto">Auto (Generale)</option>
                    <option value="esterni">Esterni</option>
                    <option value="interni">Interni</option>
                    <option value="motore">Motore</option>
                    <option value="pneumatici">Pneumatici</option>
                    <option value="danni">Danni</option>
                    <option value="manutenzione">Manutenzione</option>
                    <option value="documenti">Documenti</option>
                    <option value="prima_dopo">Prima/Dopo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Data scatto
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Titolo o descrizione breve
                </label>
                <input
                  type="text"
                  placeholder="Es. Sedili posteriori e volante in pelle"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Dettagli aggiuntivi (opzionale)
                </label>
                <textarea
                  rows={2}
                  placeholder="Es. Tagliando eseguito con sostituzione pastiglie anteriori..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600"
              >
                Annulla
              </button>
              <button
                disabled={!previewUrl}
                onClick={handleSavePhoto}
                className="px-5 py-2.5 rounded-xl bg-blue-600 disabled:opacity-50 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Salva foto nel profilo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
