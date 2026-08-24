'use client';

import { useState } from 'react';
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Layers,
  ShieldCheck,
  Eye,
  Info,
} from 'lucide-react';

interface Vehicle3DViewerProps {
  make: string;
  model: string;
  color?: string;
  mainPhoto?: string;
  hasDamages?: boolean;
}

export default function Vehicle3DViewer({
  make,
  model,
  color = 'Metallizzato',
  mainPhoto,
  hasDamages = false,
}: Vehicle3DViewerProps) {
  const [rotationAngle, setRotationAngle] = useState(45);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const fallbackImage =
    mainPhoto ||
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80';

  const handleRotateLeft = () => setRotationAngle((prev) => (prev - 45 + 360) % 360);
  const handleRotateRight = () => setRotationAngle((prev) => (prev + 45) % 360);
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(1.5, prev + 0.15));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(0.85, prev - 0.15));

  return (
    <div
      className={`relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white shadow-xl transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 rounded-3xl m-0 shadow-2xl' : 'aspect-16/10'
      }`}
    >
      {/* 3D Visualizer Canvas / Stage */}
      <div className="absolute inset-0 flex items-center justify-center p-6 overflow-hidden">
        {/* Subtle ground reflection & grid */}
        <div className="absolute bottom-10 w-3/4 h-24 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.08)_0,transparent_70%)]" />

        {/* Rotated Vehicle Render */}
        <div
          className="relative transition-transform duration-500 ease-out select-none"
          style={{
            transform: `scale(${zoomLevel}) rotateY(${rotationAngle}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          <img
            src={fallbackImage}
            alt={`${make} ${model} 3D View`}
            className="max-h-60 sm:max-h-72 w-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)] pointer-events-none"
          />

          {/* Interactive Hotspot 1: Front / Hood */}
          <div
            className="absolute top-1/4 left-1/4 cursor-pointer"
            onClick={() => setActiveHotspot('front')}
          >
            <span className="flex h-6 w-6 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-6 w-6 bg-blue-600 border-2 border-white items-center justify-center text-[10px] font-black">
                1
              </span>
            </span>
          </div>

          {/* Interactive Hotspot 2: Tires / Wheels */}
          <div
            className="absolute bottom-6 right-1/4 cursor-pointer"
            onClick={() => setActiveHotspot('tires')}
          >
            <span className="flex h-6 w-6 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-6 w-6 bg-emerald-600 border-2 border-white items-center justify-center text-[10px] font-black">
                2
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Top Controls & Status Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-xs font-bold text-slate-200 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Visualizzatore 360° Interattivo</span>
          <span className="text-[10px] text-slate-400 font-mono">({rotationAngle}°)</span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md border border-slate-700/80 p-1 rounded-2xl shadow-sm">
          <button
            onClick={handleZoomIn}
            title="Ingrandisci"
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Riduci"
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Riduci finestra' : 'Schermo intero'}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-auto">
        {/* Rotation quick buttons */}
        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-700/80 p-1.5 rounded-2xl">
          <button
            onClick={handleRotateLeft}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Ruota Sinistra
          </button>
          <button
            onClick={handleRotateRight}
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5"
          >
            Ruota Destra <RotateCcw className="w-3.5 h-3.5 scale-x-[-1]" />
          </button>
        </div>

        {/* Hotspot detail popup */}
        {activeHotspot && (
          <div className="bg-slate-900/95 backdrop-blur-md border border-blue-500/40 px-3.5 py-2 rounded-2xl text-xs flex items-center gap-2.5 shadow-lg">
            <Info className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              {activeHotspot === 'front'
                ? 'Frontale: Gruppo ottico LED, allineamento calandra conforme.'
                : 'Pneumatici: Cerchi in lega originali, usura battistrada regolare.'}
            </span>
            <button
              onClick={() => setActiveHotspot(null)}
              className="text-slate-400 hover:text-white text-xs ml-1"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
