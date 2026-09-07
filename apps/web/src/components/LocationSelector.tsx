'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, CheckCircle2, ChevronDown } from 'lucide-react';
import { REGIONS_CONFIG, resolveLocationFromCap } from '../lib/bollo';

export interface LocationInfo {
  cap?: string;
  city?: string;
  province?: string;
  regionId: string;
  regionName: string;
}

interface LocationSelectorProps {
  initialCap?: string;
  initialRegionId?: string;
  onChange: (location: LocationInfo) => void;
  compact?: boolean;
}

export function LocationSelector({
  initialCap = '',
  initialRegionId,
  onChange,
  compact = false,
}: LocationSelectorProps) {
  const [cap, setCap] = useState(initialCap);
  const [selectedRegionId, setSelectedRegionId] = useState(initialRegionId || 'lombardia');
  const [detectedLocation, setDetectedLocation] = useState<LocationInfo>(() => {
    if (initialCap) {
      const res = resolveLocationFromCap(initialCap);
      return { cap: initialCap, ...res };
    }
    const reg = REGIONS_CONFIG[selectedRegionId] || REGIONS_CONFIG.lombardia;
    return { regionId: reg.id, regionName: reg.name };
  });
  const [geoLoading, setGeoLoading] = useState(false);

  useEffect(() => {
    if (cap && cap.trim().length === 5) {
      const res = resolveLocationFromCap(cap.trim());
      const loc: LocationInfo = {
        cap: cap.trim(),
        city: res.city,
        province: res.province,
        regionId: res.regionId,
        regionName: res.regionName,
      };
      setSelectedRegionId(res.regionId);
      setDetectedLocation(loc);
      onChange(loc);
    }
  }, [cap, onChange]);

  const handleRegionChange = (newRegId: string) => {
    setSelectedRegionId(newRegId);
    const reg = REGIONS_CONFIG[newRegId] || REGIONS_CONFIG.lombardia;
    const loc: LocationInfo = {
      cap: cap || undefined,
      city: detectedLocation.city,
      province: detectedLocation.province,
      regionId: reg.id,
      regionName: reg.name,
    };
    setDetectedLocation(loc);
    onChange(loc);
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`, {
            headers: { 'Accept-Language': 'it' },
          });
          if (res.ok) {
            const data = await res.json();
            const postcode = data?.address?.postcode?.slice(0, 5) || '';
            const city = data?.address?.city || data?.address?.town || data?.address?.village || '';
            if (postcode && postcode.length === 5) {
              setCap(postcode);
              const locRes = resolveLocationFromCap(postcode);
              const loc: LocationInfo = {
                cap: postcode,
                city: city || locRes.city,
                province: locRes.province,
                regionId: locRes.regionId,
                regionName: locRes.regionName,
              };
              setSelectedRegionId(locRes.regionId);
              setDetectedLocation(loc);
              onChange(loc);
            }
          }
        } catch {
          // fallback silenzioso
        } finally {
          setGeoLoading(false);
        }
      },
      () => {
        setGeoLoading(false);
      },
      { timeout: 8000 }
    );
  };

  const currentConfig = REGIONS_CONFIG[selectedRegionId] || REGIONS_CONFIG.lombardia;

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
          <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>{detectedLocation.city ? `${detectedLocation.city} (${detectedLocation.province || detectedLocation.regionName})` : detectedLocation.regionName}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
          <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Località & Bollo Regionale</span>
        </div>
        <button
          type="button"
          onClick={handleGeolocate}
          disabled={geoLoading}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors disabled:opacity-50"
        >
          <Navigation className={`w-3 h-3 ${geoLoading ? 'animate-spin' : ''}`} />
          <span>{geoLoading ? 'Localizzazione...' : 'Rileva posizione'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div>
          <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
            CAP (Codice Postale)
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              maxLength={5}
              value={cap}
              onChange={(e) => setCap(e.target.value)}
              placeholder="es. 20121 o 80100"
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {detectedLocation.city && cap.length === 5 && (
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {detectedLocation.city}
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
            Regione Fiscale ACI
          </label>
          <div className="relative">
            <select
              value={selectedRegionId}
              onChange={(e) => handleRegionChange(e.target.value)}
              className="w-full appearance-none px-3 py-2 pr-8 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
            >
              {Object.values(REGIONS_CONFIG).map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Regola regionale attiva */}
      <div className="p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-[11px] text-blue-800 dark:text-blue-300 flex items-start gap-2">
        <span className="font-bold shrink-0">Regola locale:</span>
        <span className="leading-tight">{currentConfig.note}</span>
      </div>
    </div>
  );
}
