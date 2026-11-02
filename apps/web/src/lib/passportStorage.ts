import type {
  VehiclePassportData,
  PassportDocumentItem,
  PassportTimelineItem,
  PassportReminderItem,
  PassportShareConfig,
  PassportPhotoItem,
  VehicleInspectionItem,
  VehicleAnalysisSnapshot,
  VehicleHealthBreakdown,
  SellingProfileConfig,
  VehicleData,
} from '@autoesperto/types';
import type { AutoReport } from '@autoesperto/types';
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import {
  resolveVehicleImage,
  getVehiclePassportPhoto,
  isOldHardcodedBMWUrl,
} from './vehicleImageResolver';

const PASSPORTS_STORAGE_KEY = 'autoesperto_vehicle_passports_v2';
const LEGACY_STORAGE_KEY = 'autoesperto_vehicle_passports_v1';
const SHARED_CACHE_KEY = 'autoesperto_shared_passports_cache_v1';

export function generateShareCode(): string {
  const bytes = new Uint8Array(16);
  globalThis.crypto.getRandomValues(bytes);
  const suffix = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `AE-${suffix}`;
}

let memoryPassports: VehiclePassportData[] = [];

export function getSharedPassportsCache(): VehiclePassportData[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SHARED_CACHE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as VehiclePassportData[];
    return Array.isArray(list) ? list.map(sanitizePassport) : [];
  } catch (e) {
    return [];
  }
}

export function saveSharedPassportCache(passport: VehiclePassportData): void {
  if (typeof window === 'undefined') return;
  try {
    const sanitized = sanitizePassport(passport);
    const existing = getSharedPassportsCache().filter(
      (p) => (p.shareCode || '').toUpperCase() !== (sanitized.shareCode || '').toUpperCase()
    );
    existing.unshift(sanitized);
    localStorage.setItem(SHARED_CACHE_KEY, JSON.stringify(existing.slice(0, 25)));
  } catch (e) {
    console.error('Error saving shared passport cache', e);
  }
}

/**
 * Calculates a realistic dynamic Health Score breakdown based on available data
 */
export function computeDynamicHealthScore(passport: Partial<VehiclePassportData>): VehicleHealthBreakdown {
  const vehicle = passport.vehicle || ({} as any);
  const km = passport.currentKm ?? 50000;
  const year = vehicle.year || (new Date().getFullYear() - 3);
  const age = Math.max(1, new Date().getFullYear() - year);
  const avgKmPerYear = km / age;

  // 1. Manutenzione (0-100)
  const maintenanceDocs = (passport.documents || []).filter((d) => d.category === 'manutenzione' || d.category === 'revisioni');
  let maintenanceScore = 80;
  if (maintenanceDocs.length >= 3) maintenanceScore = 95;
  else if (maintenanceDocs.length >= 1) maintenanceScore = 88;
  else if (age > 5) maintenanceScore = 74;

  // 2. Documentazione (0-100)
  const docs = passport.documents || [];
  let docScore = 75;
  if (docs.some((d) => d.category === 'veicolo')) docScore += 12;
  if (docs.some((d) => d.category === 'assicurazione')) docScore += 8;
  if (docs.some((d) => d.status === 'CONFIRMED')) docScore += 5;
  docScore = Math.min(100, docScore);

  // 3. Chilometraggio (0-100)
  let mileageScore = 90;
  if (avgKmPerYear > 25000) mileageScore = 72;
  else if (avgKmPerYear > 18000) mileageScore = 82;
  else if (avgKmPerYear < 10000) mileageScore = 96;

  // 4. Carrozzeria & Danni (0-100)
  const damages = (passport.inspections || []).filter((i) => i.status === 'rilevato' && i.severity && i.severity !== 'ottimo');
  let bodyScore = 92;
  for (const d of damages) {
    if (d.severity === 'grave') bodyScore -= 18;
    else if (d.severity === 'medio') bodyScore -= 10;
    else if (d.severity === 'lieve') bodyScore -= 4;
  }
  bodyScore = Math.max(40, bodyScore);

  // 5. Interni (0-100)
  const interiorInspections = (passport.inspections || []).filter((i) => i.angle === 'interni' || i.angle === 'cruscotto');
  let interiorScore = 88;
  if (interiorInspections.some((i) => i.status === 'rilevato' && i.severity === 'grave')) interiorScore = 65;

  // 6. Pneumatici (0-100)
  const tireEvents = (passport.timeline || []).filter((e) => e.type === 'PNEUMATICI');
  let tiresScore = 85;
  if (tireEvents.length > 0) tiresScore = 94;

  // 7. Affidabilità Modello (0-100)
  const modelScore = 84;

  // 8. Scadenze (0-100)
  const reminders = passport.reminders || [];
  let deadlinesScore = 90;
  if (reminders.some((r) => r.daysRemaining !== undefined && r.daysRemaining < 0 && !r.dismissed)) {
    deadlinesScore = 68; // Scaduto
  } else if (reminders.some((r) => r.daysRemaining !== undefined && r.daysRemaining <= 15 && !r.dismissed)) {
    deadlinesScore = 80;
  }

  // Punteggio totale ponderato
  const weighted =
    maintenanceScore * 0.22 +
    docScore * 0.14 +
    mileageScore * 0.16 +
    bodyScore * 0.16 +
    interiorScore * 0.08 +
    tiresScore * 0.08 +
    modelScore * 0.10 +
    deadlinesScore * 0.06;

  const totalScore = Math.round(Math.min(100, Math.max(30, weighted)));

  let label: 'OTTIMO' | 'BUONO' | 'MEDIO' | 'ATTENZIONE' = 'OTTIMO';
  if (totalScore < 60) label = 'ATTENZIONE';
  else if (totalScore < 75) label = 'MEDIO';
  else if (totalScore < 86) label = 'BUONO';

  let verdictNote = 'Veicolo in eccellenti condizioni generali con storico manutentivo documentato.';
  if (label === 'BUONO') verdictNote = 'Buone condizioni d’uso, pochi interventi ordinari consigliati.';
  else if (label === 'MEDIO') verdictNote = 'Stato nella media: consigliata una verifica delle scadenze e dei controlli periodici.';
  else if (label === 'ATTENZIONE') verdictNote = 'Rilevate alcune scadenze o anomalie da controllare prima dell’acquisto/uso.';

  return {
    maintenanceScore,
    documentationScore: docScore,
    mileageScore,
    bodyConditionScore: bodyScore,
    interiorScore,
    tiresScore,
    modelReliabilityScore: modelScore,
    deadlinesScore,
    totalScore,
    label,
    verdictNote,
  };
}

export function getAllPassports(): VehiclePassportData[] {
  if (typeof window === 'undefined') return memoryPassports;
  try {
    const raw = localStorage.getItem(PASSPORTS_STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as VehiclePassportData[];
    // Ensure all items conform to new format
    return list.map(sanitizePassport);
  } catch (e) {
    console.error('Error reading passports from localStorage', e);
    return [];
  }
}

function sanitizePassport(p: any): VehiclePassportData {
  const vehicle = p.vehicle || {};
  const photo = getVehiclePassportPhoto(p);
  const isBmw = (vehicle.make || '').toLowerCase().includes('bmw');
  const existingPhotos = Array.isArray(p.photos) ? p.photos : [];
  const sanitizedPhotos = existingPhotos
    .filter((ph: any) => ph && ph.url)
    .map((ph: any) => {
      if (isOldHardcodedBMWUrl(ph.url) && !isBmw) {
        return { ...ph, url: photo };
      }
      return ph;
    });

  if (sanitizedPhotos.length === 0 && photo) {
    sanitizedPhotos.push({
      id: `photo-${Date.now()}-1`,
      url: photo,
      category: 'auto',
      title: `${vehicle.make || 'Auto'} ${vehicle.model || ''}`.trim(),
      description: 'Foto principale veicolo',
      date: (p.lastKmDate || new Date().toISOString().split('T')[0]),
    });
  }

  const clean: VehiclePassportData = {
    id: p.id || `pass-${Date.now()}`,
    shareCode: p.shareCode || generateShareCode(),
    userId: p.userId,
    vehicle: {
      ...vehicle,
      imageUrl: photo,
    },
    nickname: p.nickname || `${vehicle.make || 'Auto'} ${vehicle.model || ''}`.trim(),
    mainPhoto: photo,
    currentKm: Number.isFinite(Number(p.currentKm)) ? Number(p.currentKm) : 50000,
    lastKmDate: p.lastKmDate || new Date().toISOString().split('T')[0],
    healthScore: p.healthScore || 88,
    healthBreakdown: p.healthBreakdown || computeDynamicHealthScore(p),
    estimatedValue: p.estimatedValue ?? p.price?.estimatedValue,
    estimatedValueMax: p.estimatedValueMax ?? (p.estimatedValue ? Math.round(p.estimatedValue * 1.08) : undefined),
    recommendedSellPrice: p.recommendedSellPrice,
    attractiveBuyerPrice: p.attractiveBuyerPrice,
    insuranceExpiry: p.insuranceExpiry,
    insuranceCompany: p.insuranceCompany,
    revisionExpiry: p.revisionExpiry,
    nextServiceKm: p.nextServiceKm,
    nextServiceDate: p.nextServiceDate,
    photos: sanitizedPhotos,
    inspections: Array.isArray(p.inspections) ? p.inspections : [],
    analysisSnapshot: p.analysisSnapshot,
    documents: Array.isArray(p.documents) ? p.documents : [],
    timeline: Array.isArray(p.timeline) ? p.timeline : [],
    reminders: Array.isArray(p.reminders) ? p.reminders : [],
    shareConfig: p.shareConfig || {
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
    },
    sellingConfig: p.sellingConfig,
    privacyAcknowledged: p.privacyAcknowledged ?? true,
    createdAt: p.createdAt || new Date().toISOString(),
    updatedAt: p.updatedAt || new Date().toISOString(),
  };
  return clean;
}

export function getPassportById(id: string): VehiclePassportData | null {
  const all = getAllPassports();
  const found = all.find((p) => p.id === id);
  if (found) return found;

  if (id === 'pass-bmw-320d-sample' || id === 'sample') {
    return ensureSamplePassport();
  }
  return null;
}

export function getPassportByShareCode(code: string): VehiclePassportData | null {
  if (!code) return null;
  const clean = code.toUpperCase().trim();

  // 1. Check user's local garage
  const all = getAllPassports();
  const found = all.find((p) => p.shareCode && p.shareCode.toUpperCase() === clean);
  if (found) return found;

  // 2. Check cached shared passports loaded on this device
  const cached = getSharedPassportsCache().find((p) => p.shareCode && p.shareCode.toUpperCase() === clean);
  if (cached) return cached;

  // 3. Check memory store
  const inMemory = memoryPassports.find((p) => p.shareCode && p.shareCode.toUpperCase() === clean);
  if (inMemory) return inMemory;

  // 4. Sample fallback ONLY if code is specifically AE-48291 or SAMPLE
  if (clean === 'AE-48291' || clean === 'SAMPLE') {
    return ensureSamplePassport();
  }
  return null;
}

export interface CompactPublicPassportPayload {
  c: string; // shareCode
  nn?: string; // nickname
  v: {
    mk: string; // make
    md: string; // model
    vr?: string; // version
    y?: number; // year
    f?: string; // fuel
    p?: string; // power
    dp?: string; // displacement
    tr?: string; // transmission
    bd?: string; // body
    cl?: string; // color
    ec?: string; // euroClass
    pl?: string; // plate
    vin?: string; // vin
    img?: string; // imageUrl
  };
  km?: number;
  kd?: string; // lastKmDate
  hs?: number; // healthScore
  ev?: number; // estimatedValue
  em?: number; // estimatedValueMax
  rp?: number; // recommendedSellPrice
  ab?: number; // attractiveBuyerPrice
  ph?: Array<{
    id?: string;
    u: string;
    c?: string;
    t?: string;
    d?: string;
  }>;
  tm?: Array<{
    id?: string;
    d: string;
    k?: number;
    t: any;
    ti: string;
    de?: string;
    c?: number;
  }>;
  sc?: PassportShareConfig;
  sl?: SellingProfileConfig;
  tb?: 'AI_ANALYZED' | 'VERIFIED' | 'INSPECTED';
  ca?: string;
}

export function encodePublicPassport(payload: any): string {
  try {
    const json = JSON.stringify(payload);
    return `z.${compressToEncodedURIComponent(json)}`;
  } catch (err) {
    console.error('Error encoding passport for share:', err);
    return '';
  }
}

export function decodePublicPassport(encoded: string): any | null {
  try {
    if (!encoded) return null;
    if (encoded.startsWith('z.')) {
      const json = decompressFromEncodedURIComponent(encoded.slice(2));
      return json ? JSON.parse(json) : null;
    }
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json);
  } catch (err) {
    console.error('Error decoding public passport:', err);
    return null;
  }
}

export function serializePassportForShare(passport: VehiclePassportData): CompactPublicPassportPayload {
  const v = passport.vehicle || ({} as any);
  const sc = passport.shareConfig || {
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
  };

  const photo = getVehiclePassportPhoto(passport);
  const selling = passport.sellingConfig;

  let photosForShare: Array<{ id?: string; u: string; c?: string; t?: string; d?: string }> = [];
  if (sc.showPhotos !== false && Array.isArray(passport.photos)) {
    photosForShare = passport.photos
      .filter((p) => p && p.url && !(isOldHardcodedBMWUrl(p.url) && !v.make?.toLowerCase().includes('bmw')))
      .map((p) => ({
        id: p.id,
        u: p.url,
        c: p.category,
        t: p.title,
        d: p.description,
      }));
  }

  if (photosForShare.length === 0 && photo && sc.showPhotos !== false) {
    photosForShare.push({
      u: photo,
      c: 'auto',
      t: `${v.make || 'Auto'} ${v.model || ''}`.trim(),
    });
  }

  let timelineForShare: Array<{ id?: string; d: string; k?: number; t: any; ti: string; de?: string; c?: number }> = [];
  if (sc.showTimeline !== false && Array.isArray(passport.timeline)) {
    timelineForShare = passport.timeline.map((item) => ({
      id: item.id,
      d: item.date,
      k: sc.showMileage === true ? item.km : undefined,
      t: item.type,
      ti: item.title,
      de: item.description,
      c: item.cost,
    }));
  }

  const payload: CompactPublicPassportPayload = {
    c: passport.shareCode,
    nn: undefined,
    v: {
      mk: v.make || 'Auto',
      md: v.model || '',
      vr: sc.showVehicleInfo ? v.version : undefined,
      y: sc.showVehicleInfo ? v.year : undefined,
      f: sc.showVehicleInfo ? v.fuel : undefined,
      p: sc.showVehicleInfo ? v.power : undefined,
      dp: sc.showVehicleInfo ? v.displacement : undefined,
      tr: sc.showVehicleInfo ? v.transmission : undefined,
      bd: sc.showVehicleInfo ? v.body : undefined,
      cl: sc.showVehicleInfo ? v.color : undefined,
      ec: sc.showVehicleInfo ? v.euroClass : undefined,
    // Never expose the registration plate in a public share link.
      img: sc.showPhotos ? photo : undefined,
    },
    km: sc.showMileage === true ? passport.currentKm : undefined,
    kd: sc.showMileage === true ? passport.lastKmDate : undefined,
    hs: sc.showHealthScore ? passport.healthScore : undefined,
    ev: sc.showValuation !== false ? passport.estimatedValue : undefined,
    em: sc.showValuation !== false ? passport.estimatedValueMax : undefined,
    rp: sc.showValuation !== false ? passport.recommendedSellPrice : undefined,
    ab: sc.showValuation !== false ? passport.attractiveBuyerPrice : undefined,
    ph: photosForShare,
    tm: timelineForShare,
    sc,
    sl: selling?.enabled ? {
      enabled: true,
      askingPrice: selling.askingPrice,
      negotiable: selling.negotiable,
      showValuation: selling.showValuation,
      showHealthScore: selling.showHealthScore,
      showMaintenance: selling.showMaintenance,
      showInspection: selling.showInspection,
      showPhotos: selling.showPhotos,
      allowContact: selling.allowContact,
      contactMethod: selling.allowContact ? selling.contactMethod : undefined,
      contactValue: selling.allowContact ? selling.contactValue : undefined,
      sellerNotes: selling.sellerNotes?.slice(0, 1000),
    } : undefined,
    tb: passport.trustBadge || getTrustBadgeForPassport(passport).badge,
    ca: passport.createdAt,
  };

  return payload;
}

export function deserializePassportFromShare(encoded: string): VehiclePassportData | null {
  try {
    const raw = decodePublicPassport(encoded);
    if (!raw || typeof raw !== 'object' || !raw.c) return null;

    const v = raw.v || {};
    const photo = v.img || resolveVehicleImage(v.mk, v.md, v.bd);

    const nowIso = new Date().toISOString().split('T')[0];
    const photos: PassportPhotoItem[] = Array.isArray(raw.ph)
      ? raw.ph.map((p: any, idx: number) => ({
          id: p.id || `photo-shared-${idx}`,
          url: p.u || photo,
          category: p.c || 'auto',
          title: p.t || `${v.mk || ''} ${v.md || ''}`.trim(),
          description: p.d,
          date: p.dt || raw.kd || nowIso,
        }))
      : [];

    if (photos.length === 0 && photo) {
      photos.push({
        id: 'photo-main',
        url: photo,
        category: 'auto',
        title: `${v.mk || ''} ${v.md || ''}`.trim(),
        date: raw.kd || nowIso,
      });
    }

    const timeline: PassportTimelineItem[] = Array.isArray(raw.tm)
      ? raw.tm.map((t: any, idx: number) => ({
          id: t.id || `evt-shared-${idx}`,
          date: t.d || new Date().toISOString().split('T')[0],
          km: t.k,
          type: t.t || 'ALTRO',
          title: t.ti || 'Evento Manutenzione',
          description: t.de,
          cost: t.c,
        }))
      : [];

    const reconstructed: VehiclePassportData = {
      id: `shared-${raw.c}`,
      shareCode: raw.c,
      nickname: raw.nn || `${v.mk || 'Auto'} ${v.md || ''}`.trim(),
      vehicle: {
        make: v.mk || 'Auto',
        model: v.md || '',
        version: v.vr,
        year: v.y,
        fuel: v.f,
        power: v.p,
        displacement: v.dp,
        transmission: v.tr,
        body: v.bd,
        color: v.cl,
        euroClass: v.ec,
        plate: v.pl,
        imageUrl: photo,
      },
      mainPhoto: photo,
      currentKm: Number.isFinite(Number(raw.km)) && raw.km !== undefined ? Number(raw.km) : 0,
      lastKmDate: raw.kd || new Date().toISOString().split('T')[0],
      healthScore: Number(raw.hs) || 88,
      estimatedValue: raw.ev,
      estimatedValueMax: raw.em,
      recommendedSellPrice: raw.rp,
      attractiveBuyerPrice: raw.ab,
      photos,
      timeline,
      inspections: [],
      documents: [],
      reminders: [],
      shareConfig: raw.sc || {
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
      },
      sellingConfig: raw.sl,
      trustBadge: raw.tb,
      privacyAcknowledged: true,
      createdAt: raw.ca || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    reconstructed.healthBreakdown = computeDynamicHealthScore(reconstructed);
    if (typeof raw.hs === 'number') {
      reconstructed.healthBreakdown.totalScore = raw.hs;
      reconstructed.healthScore = raw.hs;
    }

    return reconstructed;
  } catch (err) {
    console.error('Failed to deserialize shared passport:', err);
    return null;
  }
}

export function buildPassportShareUrl(passport: VehiclePassportData, baseUrl?: string): string {
  const origin = baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://autoesperto.it');
  const payload = serializePassportForShare(passport);
  const encoded = encodePublicPassport(payload);
  if (encoded) {
    // Keep private profile data in the fragment, which browsers do not send
    // to the server in HTTP requests or include in ordinary access logs.
    return `${origin}/passport/public/${passport.shareCode}#d=${encoded}`;
  }
  return `${origin}/passport/public/${passport.shareCode}`;
}

export async function fetchPassportFromPublicApi(shareCode: string): Promise<VehiclePassportData | null> {
  try {
    const clean = shareCode.toUpperCase().trim();
    const res = await fetch(`/api/passport/public/${clean}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.success && data.payload) {
      if (typeof data.payload === 'string') {
        return deserializePassportFromShare(data.payload);
      }
      if (data.payload.v) {
        const enc = encodePublicPassport(data.payload);
        return deserializePassportFromShare(enc);
      }
      return sanitizePassport(data.payload);
    }
    return null;
  } catch {
    return null;
  }
}

export function savePassport(passport: VehiclePassportData): void {
  const sanitized = sanitizePassport(passport);
  sanitized.healthBreakdown = computeDynamicHealthScore(sanitized);
  sanitized.healthScore = sanitized.healthBreakdown.totalScore;
  sanitized.updatedAt = new Date().toISOString();

  if (typeof window === 'undefined') {
    const idx = memoryPassports.findIndex((p) => p.id === sanitized.id);
    if (idx >= 0) {
      memoryPassports[idx] = sanitized;
    } else {
      memoryPassports.unshift(sanitized);
    }
    return;
  }
  try {
    const all = getAllPassports();
    const idx = all.findIndex((p) => p.id === sanitized.id);
    if (idx >= 0) {
      all[idx] = sanitized;
    } else {
      all.unshift(sanitized);
    }
    localStorage.setItem(PASSPORTS_STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    console.error('Error saving passport to localStorage', e);
  }
}

export function deletePassport(id: string): void {
  if (typeof window === 'undefined') {
    memoryPassports = memoryPassports.filter((p) => p.id !== id);
    return;
  }
  try {
    const all = getAllPassports().filter((p) => p.id !== id);
    localStorage.setItem(PASSPORTS_STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    console.error('Error deleting passport', e);
  }
}

/**
 * Calcola il livello di trust del veicolo (AutoEsperto Trust Layer)
 */
export function getTrustBadgeForPassport(passport: VehiclePassportData): {
  badge: 'AI_ANALYZED' | 'VERIFIED' | 'INSPECTED';
  label: string;
  desc: string;
  colorClass: string;
} {
  const hasInspections = (passport.inspections || []).some((i) => i.status === 'rilevato');
  const hasConfirmedDocs = (passport.documents || []).some((d) => d.status === 'CONFIRMED');

  if (passport.trustBadge === 'INSPECTED' || hasInspections) {
    return {
      badge: 'INSPECTED',
      label: 'INSPECTED',
      desc: 'Veicolo con controllo fisico documentato',
      colorClass: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800',
    };
  }

  if (passport.trustBadge === 'VERIFIED' || hasConfirmedDocs) {
    return {
      badge: 'VERIFIED',
      label: 'VERIFIED',
      desc: 'Dati e documenti ufficiali verificati',
      colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
    };
  }

  return {
    badge: 'AI_ANALYZED',
    label: 'AI ANALYZED',
    desc: 'Analisi automatica basata su dati di mercato',
    colorClass: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
  };
}

/**
 * Genera un codice di trasferimento per cedere il Passport al nuovo acquirente
 */
export function generatePassportTransfer(id: string): string {
  const passport = getPassportById(id);
  if (!passport) throw new Error('Passport non trovato');

  const randomPart = Math.floor(1000 + Math.random() * 9000);
  const transferCode = `TR-${passport.shareCode.replace('AE-', '')}-${randomPart}`;

  passport.transferCode = transferCode;
  passport.transferStatus = 'PENDING';
  savePassport(passport);
  return transferCode;
}

/**
 * Riscatta un Passport trasferito con il codice
 */
export function claimPassportTransfer(transferCode: string): { success: boolean; passport?: VehiclePassportData; message: string } {
  const clean = transferCode.trim().toUpperCase();
  const all = getAllPassports();
  const found = all.find((p) => p.transferCode && p.transferCode.toUpperCase() === clean);

  if (!found) {
    return { success: false, message: 'Codice di trasferimento non valido o inesistente.' };
  }

  found.transferStatus = 'TRANSFERRED';
  found.transferDate = new Date().toISOString();
  found.transferCode = undefined;
  savePassport(found);

  return {
    success: true,
    passport: found,
    message: `Profilo di ${found.vehicle.make} ${found.vehicle.model} acquisito con successo!`,
  };
}

/**
 * Creates a digital profile directly from an AutoReport without re-asking any info!
 */
export function createPassportFromReport(report: AutoReport, customNickname?: string): VehiclePassportData {
  const id = `pass-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const shareCode = generateShareCode();
  const now = new Date().toISOString();
  const vehicle = report.vehicle || ({} as any);
  const price = report.price || ({} as any);
  const reliability = report.reliability || ({} as any);

  const year = vehicle.year || price.inputYear || new Date().getFullYear() - 3;
  const km = price.inputKm ?? (vehicle as any).mileage ?? 50000;
  const valMin = price.estimatedValue || 15000;
  const valMax = (price.market as any)?.maxPrice || (price.market as any)?.max || Math.round(valMin * 1.08);
  const repVerdict = reliability.verdict || (report as any).verdict || 'Buon Affare';
  const calculatedHealth = (report as any).healthScore || Math.round((reliability.score ? reliability.score * 10 : 88));

  const analysisSnapshot: VehicleAnalysisSnapshot = {
    id: `snap-${Date.now()}`,
    date: now,
    reportId: (report as any).id,
    healthScore: calculatedHealth,
    valuationMin: valMin,
    valuationMax: valMax,
    recommendedSellPrice: Math.round(valMin * 1.03),
    attractiveBuyerPrice: Math.round(valMin * 0.96),
    defects: reliability.weaknesses || (reliability as any).cons || [],
    strengths: reliability.strengths || (reliability as any).pros || [],
    estimatedRepairsMin: (report as any).repairEstimate?.totalMin || 250,
    estimatedRepairsMax: (report as any).repairEstimate?.totalMax || 600,
    annualMaintenanceEstimated: (report as any).repairEstimate?.maintenanceMax || 450,
  };

  const initialTimeline: PassportTimelineItem[] = [
    {
      id: `evt-${Date.now()}-1`,
      date: `${year}-05-15`,
      km: 0,
      type: 'IMMATRICOLAZIONE',
      title: 'Prima Immatricolazione',
      description: `Veicolo immatricolato nuovo (${vehicle.fuel || 'Alimentazione standard'}).`,
    },
    {
      id: `evt-${Date.now()}-2`,
      date: now.split('T')[0],
      km,
      type: 'ANALISI_AUTOESPERTO',
      title: 'Analisi Completa AutoEsperto AI',
      description: `Analisi di mercato e affidabilità completata con verdetto ${repVerdict} e Health Score ${calculatedHealth}/100.`,
      cost: 0,
    },
  ];

  // Photos from analysis if available
  let photoUrl = vehicle.imageUrl || (report as any).mainPhoto || (report as any).photoUrl || (vehicle as any).photo || (report as any).photos?.[0];
  const isBmw = (vehicle.make || '').toLowerCase().includes('bmw');
  if (!photoUrl || (isOldHardcodedBMWUrl(photoUrl) && !isBmw)) {
    photoUrl = resolveVehicleImage(vehicle.make, vehicle.model, vehicle.body || (vehicle as any).bodyType);
  }

  const initialPhotos: PassportPhotoItem[] = [];
  if (photoUrl) {
    initialPhotos.push({
      id: `photo-${Date.now()}-1`,
      url: photoUrl,
      category: 'auto',
      title: `${vehicle.make} ${vehicle.model}`,
      description: 'Foto principale acquisita durante l’analisi',
      date: now.split('T')[0],
    });
  }

  const nextServiceKm = Math.ceil((km + 1) / 15000) * 15000;
  const initialReminders: PassportReminderItem[] = [
    {
      id: `rem-srv-${Date.now()}`,
      type: 'TAGLIANDO',
      title: 'Prossimo Tagliando & Manutenzione Ordinaria',
      dueKm: nextServiceKm,
      kmRemaining: nextServiceKm - km,
      isEstimate: true,
      dismissed: false,
    },
    {
      id: `rem-rev-${Date.now()}`,
      type: 'REVISIONE',
      title: 'Revisione Periodica Ministeriale',
      dueDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      daysRemaining: 180,
      isEstimate: true,
      dismissed: false,
    },
  ];

  const passport: VehiclePassportData = {
    id,
    shareCode,
    vehicle: {
      ...vehicle,
      imageUrl: photoUrl,
    },
    nickname: customNickname || `${vehicle.make || 'Auto'} ${vehicle.model || ''}`.trim(),
    mainPhoto: photoUrl,
    currentKm: km,
    lastKmDate: now.split('T')[0],
    healthScore: calculatedHealth,
    estimatedValue: valMin,
    estimatedValueMax: valMax,
    recommendedSellPrice: Math.round(valMin * 1.03),
    attractiveBuyerPrice: Math.round(valMin * 0.96),
    nextServiceKm,
    photos: initialPhotos,
    inspections: [],
    analysisSnapshot,
    documents: [],
    timeline: initialTimeline,
    reminders: initialReminders,
    shareConfig: {
      enabled: true,
      showVehicleInfo: true,
      showMaintenance: true,
      showRepairs: true,
      showRevisions: true,
      showHealthScore: true,
      showOriginalDocs: false, // 100% Privacy by default
      showPhotos: true,
      showTimeline: true,
      showValuation: true,
    },
    privacyAcknowledged: true,
    createdAt: now,
    updatedAt: now,
  };

  passport.healthBreakdown = computeDynamicHealthScore(passport);
  passport.healthScore = passport.healthBreakdown.totalScore;

  savePassport(passport);
  return passport;
}

export function createNewPassport(input: {
  vehicle: VehicleData;
  nickname?: string;
  currentKm?: number;
  mainPhoto?: string;
  insuranceExpiry?: string;
  insuranceCompany?: string;
  revisionExpiry?: string;
}): VehiclePassportData {
  const id = `pass-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const shareCode = generateShareCode();
  const now = new Date().toISOString();
  const year = input.vehicle.year || new Date().getFullYear() - 3;
  const km = input.currentKm ?? 50000;

  const initialTimeline: PassportTimelineItem[] = [];

  const initialReminders: PassportReminderItem[] = [];

  if (input.insuranceExpiry) {
    const exp = new Date(input.insuranceExpiry);
    const diffDays = Math.ceil((exp.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    initialReminders.push({
      id: `rem-ins-${Date.now()}`,
      type: 'ASSICURAZIONE',
      title: `Scadenza Polizza RC (${input.insuranceCompany || 'Assicurazione'})`,
      dueDate: input.insuranceExpiry,
      daysRemaining: diffDays,
      dismissed: false,
    });
  }

  if (input.revisionExpiry) {
    const exp = new Date(input.revisionExpiry);
    const diffDays = Math.ceil((exp.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    initialReminders.push({
      id: `rem-rev-${Date.now()}`,
      type: 'REVISIONE',
      title: 'Revisione Periodica Ministeriale',
      dueDate: input.revisionExpiry,
      daysRemaining: diffDays,
      dismissed: false,
    });
  }

  const nextServiceKm = Math.ceil((km + 1) / 15000) * 15000;
  initialReminders.push({
    id: `rem-srv-${Date.now()}`,
    type: 'TAGLIANDO',
    title: 'Prossimo Tagliando & Manutenzione Ordinaria',
    dueKm: nextServiceKm,
    kmRemaining: nextServiceKm - km,
    isEstimate: true,
    dismissed: false,
  });

  let photoUrl = input.mainPhoto || input.vehicle.imageUrl;
  const isBmw = (input.vehicle.make || '').toLowerCase().includes('bmw');
  if (!photoUrl || (isOldHardcodedBMWUrl(photoUrl) && !isBmw)) {
    photoUrl = resolveVehicleImage(input.vehicle.make, input.vehicle.model, input.vehicle.body);
  }

  const passport: VehiclePassportData = {
    id,
    shareCode,
    vehicle: {
      ...input.vehicle,
      imageUrl: photoUrl,
    },
    nickname: input.nickname || `${input.vehicle.make} ${input.vehicle.model}`,
    mainPhoto: photoUrl,
    currentKm: km,
    lastKmDate: now.split('T')[0],
    healthScore: 88,
    estimatedValue: undefined,
    estimatedValueMax: undefined,
    recommendedSellPrice: undefined,
    attractiveBuyerPrice: undefined,
    insuranceExpiry: input.insuranceExpiry,
    insuranceCompany: input.insuranceCompany,
    revisionExpiry: input.revisionExpiry,
    nextServiceKm,
    photos: photoUrl
      ? [
          {
            id: `photo-${Date.now()}`,
            url: photoUrl,
            category: 'auto',
            title: `${input.vehicle.make} ${input.vehicle.model}`,
            date: now.split('T')[0],
          },
        ]
      : [],
    inspections: [],
    documents: [],
    timeline: initialTimeline,
    reminders: initialReminders,
    shareConfig: {
      enabled: true,
      showVehicleInfo: true,
      showMileage: false,
      showMaintenance: true,
      showRepairs: true,
      showRevisions: true,
      showHealthScore: true,
      showOriginalDocs: false,
      showPhotos: true,
      showTimeline: true,
      showValuation: false,
    },
    privacyAcknowledged: true,
    createdAt: now,
    updatedAt: now,
  };

  passport.healthBreakdown = computeDynamicHealthScore(passport);
  passport.healthScore = passport.healthBreakdown.totalScore;

  savePassport(passport);
  return passport;
}

export function addPhotoToPassport(
  passportId: string,
  photo: Omit<PassportPhotoItem, 'id'>
): VehiclePassportData | null {
  const passport = getPassportById(passportId);
  if (!passport) return null;

  const item: PassportPhotoItem = {
    ...photo,
    id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  };

  passport.photos = [item, ...(passport.photos || [])];
  if (!passport.mainPhoto && item.category === 'auto') {
    passport.mainPhoto = item.url;
  }

  savePassport(passport);
  return passport;
}

export function deletePhotoFromPassport(passportId: string, photoId: string): VehiclePassportData | null {
  const passport = getPassportById(passportId);
  if (!passport) return null;

  passport.photos = (passport.photos || []).filter((p) => p.id !== photoId);
  if (passport.mainPhoto && !passport.photos.some((p) => p.url === passport.mainPhoto)) {
    passport.mainPhoto = passport.photos[0]?.url || passport.vehicle.imageUrl;
  }

  savePassport(passport);
  return passport;
}

export function addInspectionToPassport(
  passportId: string,
  inspection: Omit<VehicleInspectionItem, 'id'>
): VehiclePassportData | null {
  const passport = getPassportById(passportId);
  if (!passport) return null;

  const item: VehicleInspectionItem = {
    ...inspection,
    id: `insp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  };

  passport.inspections = [item, ...(passport.inspections || [])];

  // Also log into timeline if it's a confirmed damage/finding
  if (item.status === 'rilevato' && item.severity && item.severity !== 'ottimo') {
    passport.timeline.unshift({
      id: `evt-${Date.now()}`,
      date: item.date,
      km: passport.currentKm,
      type: 'ISPEZIONE_DANNI',
      title: `Rilevamento: ${item.component} (${item.angleLabel})`,
      description: item.description,
      cost: item.estimatedRepairCost,
      photoUrls: item.photoUrl ? [item.photoUrl] : undefined,
    });
  }

  savePassport(passport);
  return passport;
}

export function updateSellingConfig(
  passportId: string,
  config: SellingProfileConfig
): VehiclePassportData | null {
  const passport = getPassportById(passportId);
  if (!passport) return null;

  passport.sellingConfig = config;
  savePassport(passport);
  return passport;
}

export function addDocumentToPassport(
  passportId: string,
  docInput: {
    category: PassportDocumentItem['category'];
    title: string;
    fileUrl: string;
    fileName: string;
    mimeType: string;
    eventDate?: string;
    km?: number;
    amount?: number;
    extractedData?: Record<string, any>;
    notes?: string;
  }
): VehiclePassportData | null {
  const passport = getPassportById(passportId);
  if (!passport) return null;

  const docId = `doc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const now = new Date().toISOString();

  const newDoc: PassportDocumentItem = {
    id: docId,
    category: docInput.category,
    title: docInput.title,
    fileUrl: docInput.fileUrl,
    fileName: docInput.fileName,
    mimeType: docInput.mimeType,
    eventDate: docInput.eventDate,
    km: docInput.km,
    amount: docInput.amount,
    extractedData: docInput.extractedData,
    notes: docInput.notes,
    status: 'CONFIRMED',
    createdAt: now,
  };

  passport.documents.unshift(newDoc);

  // Auto timeline entry
  let eventType: PassportTimelineItem['type'] = 'ALTRO';
  if (docInput.category === 'manutenzione') eventType = 'TAGLIANDO';
  else if (docInput.category === 'revisioni') eventType = 'REVISIONE';
  else if (docInput.category === 'riparazioni') eventType = 'RIPARAZIONE';
  else if (docInput.category === 'assicurazione') eventType = 'ASSICURAZIONE';

  passport.timeline.unshift({
    id: `evt-${Date.now()}`,
    date: docInput.eventDate || now.split('T')[0],
    km: docInput.km || passport.currentKm,
    type: eventType,
    title: docInput.title,
    description: docInput.notes || `Documento registrato: ${docInput.fileName}`,
    cost: docInput.amount,
    documentId: docId,
  });

  // If km is higher than currentKm, auto update
  if (docInput.km && docInput.km > passport.currentKm) {
    passport.currentKm = docInput.km;
    passport.lastKmDate = docInput.eventDate || now.split('T')[0];
  }

  savePassport(passport);
  return passport;
}

export function removeDocumentFromPassport(passportId: string, documentId: string): VehiclePassportData | null {
  const passport = getPassportById(passportId);
  if (!passport) return null;

  passport.documents = passport.documents.filter((d) => d.id !== documentId);
  passport.timeline = passport.timeline.filter((e) => e.documentId !== documentId);

  savePassport(passport);
  return passport;
}

export function updatePassportKm(passportId: string, newKm: number, date?: string): VehiclePassportData | null {
  const passport = getPassportById(passportId);
  if (!passport) return null;

  passport.currentKm = newKm;
  passport.lastKmDate = date || new Date().toISOString().split('T')[0];

  passport.timeline.unshift({
    id: `evt-km-${Date.now()}`,
    date: passport.lastKmDate,
    km: newKm,
    type: 'ALTRO',
    title: 'Aggiornamento Chilometraggio',
    description: `Chilometraggio registrato a ${newKm.toLocaleString('it-IT')} km.`,
  });

  savePassport(passport);
  return passport;
}

export function addTimelineEvent(
  passportId: string,
  event: Omit<PassportTimelineItem, 'id'>
): VehiclePassportData | null {
  const passport = getPassportById(passportId);
  if (!passport) return null;

  const item: PassportTimelineItem = {
    ...event,
    id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  };

  passport.timeline.unshift(item);
  passport.timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (event.km && event.km > passport.currentKm) {
    passport.currentKm = event.km;
    passport.lastKmDate = event.date;
  }

  savePassport(passport);
  return passport;
}

export function updatePassportShareConfig(
  passportId: string,
  config: Partial<PassportShareConfig>
): VehiclePassportData | null {
  const passport = getPassportById(passportId);
  if (!passport) return null;

  passport.shareConfig = { ...passport.shareConfig, ...config };
  savePassport(passport);
  return passport;
}

/**
 * Ensures high-quality rich sample profile for instant demo & review
 */
export function ensureSamplePassport(): VehiclePassportData {
  const all = getAllPassports();
  const existingSample = all.find((p) => p.id === 'pass-bmw-320d-sample');
  if (existingSample) return existingSample;

  const now = new Date().toISOString();
  const sample: VehiclePassportData = {
    id: 'pass-bmw-320d-sample',
    shareCode: 'AE-48291',
    vehicle: {
      make: 'BMW',
      model: 'Serie 3',
      version: '320d Touring M Sport Automatico',
      year: 2021,
      fuel: 'Diesel Mild-Hybrid',
      power: '190 CV (140 kW)',
      displacement: '1995 cc',
      euroClass: 'Euro 6d-ISC-FCM',
      color: 'Grigio Minerale Metallizzato',
      body: 'Station Wagon',
      doors: 5,
      transmission: 'Automatico Steptronic 8 rapporti',
      plate: 'GE 482 TN',
      vin: 'WBA31AY060F894120',
      imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
    },
    nickname: 'La mia BMW 320d Touring',
    mainPhoto: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
    currentKm: 82400,
    lastKmDate: '2026-02-15',
    healthScore: 89,
    estimatedValue: 28900,
    estimatedValueMax: 30500,
    recommendedSellPrice: 29500,
    attractiveBuyerPrice: 28200,
    insuranceExpiry: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    insuranceCompany: 'UnipolSai Assicurazioni',
    revisionExpiry: new Date(Date.now() + 210 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    nextServiceKm: 88000,
    photos: [
      {
        id: 'photo-1',
        url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
        category: 'auto',
        title: 'Vista Tre Quarti Anteriore',
        description: 'Condizioni carrozzeria impeccabili, pacchetto M Sport originale.',
        date: '2026-02-15',
      },
      {
        id: 'photo-2',
        url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80',
        category: 'interni',
        title: 'Interni & Plancia BMW Live Cockpit',
        description: 'Sedili sportivi in pelle/alcantara M, plancia perfetta.',
        date: '2026-02-15',
      },
      {
        id: 'photo-3',
        url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
        category: 'esterni',
        title: 'Vista Posteriore e Baule',
        description: 'Fari Full LED oscurati originali e doppio scarico M.',
        date: '2026-02-15',
      },
      {
        id: 'photo-4',
        url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
        category: 'pneumatici',
        title: 'Cerchi M Sport 18” & Gomme Michelin',
        description: 'Battistrada residuo 85%, cerchi senza segni da marciapiede.',
        date: '2026-01-20',
      },
    ],
    inspections: [
      {
        id: 'insp-1',
        date: '2026-02-15',
        angle: 'anteriore',
        angleLabel: 'Frontale Anteriore',
        component: 'Paraurti & Griglia Doppio Rene',
        status: 'rilevato',
        severity: 'ottimo',
        description: 'Nessun segno di impatto, vernice originale in perfetto stato.',
      },
      {
        id: 'insp-2',
        date: '2026-02-15',
        angle: 'lato_destro',
        angleLabel: 'Fiancata Destra',
        component: 'Passaruota Posteriore Destro',
        status: 'rilevato',
        severity: 'lieve',
        description: 'Micro-graffio superficiale da parcheggio (lucidabile con polish).',
        estimatedRepairCost: 60,
      },
      {
        id: 'insp-3',
        date: '2026-02-15',
        angle: 'cruscotto',
        angleLabel: 'Quadro Strumenti & Diagnostica',
        component: 'Spie & Check Control',
        status: 'rilevato',
        severity: 'ottimo',
        description: 'Nessun codice errore in centralina, tutti i sistemi di assistenza attivi.',
      },
    ],
    documents: [
      {
        id: 'doc-1',
        category: 'veicolo',
        title: 'Documento Unico di Circolazione (Libretto)',
        fileName: 'documento_unico_bmw_320d.pdf',
        fileUrl: '#',
        mimeType: 'application/pdf',
        eventDate: '2021-04-12',
        status: 'CONFIRMED',
        createdAt: '2026-01-15T10:00:00.000Z',
      },
      {
        id: 'doc-2',
        category: 'manutenzione',
        title: 'Fattura Tagliando 78.000 km (Officina BMW)',
        fileName: 'fattura_tagliando_78k.pdf',
        fileUrl: '#',
        mimeType: 'application/pdf',
        eventDate: '2025-11-18',
        km: 78000,
        amount: 420,
        notes: 'Olio BMW Longlife-04 0W-30, filtro olio, filtro aria, filtro carburante, igienizzazione clima.',
        status: 'CONFIRMED',
        createdAt: '2025-11-19T14:30:00.000Z',
      },
      {
        id: 'doc-3',
        category: 'assicurazione',
        title: 'Polizza RC Auto + Kasko Collisione',
        fileName: 'certificato_polizza_unipolsai.pdf',
        fileUrl: '#',
        mimeType: 'application/pdf',
        eventDate: '2025-03-28',
        amount: 680,
        notes: 'Massimale 10M, Furto/Incendio, Eventi Naturali, Assistenza Stradale Top.',
        status: 'CONFIRMED',
        createdAt: '2025-03-29T09:15:00.000Z',
      },
    ],
    timeline: [
      {
        id: 'evt-6',
        date: '2026-02-15',
        km: 82400,
        type: 'ANALISI_AUTOESPERTO',
        title: 'Analisi Completa AutoEsperto AI',
        description: 'Analisi di mercato e diagnostica completata: Verdetto OTTIMO AFFARE (Health Score 89/100).',
        cost: 0,
      },
      {
        id: 'evt-5',
        date: '2025-11-18',
        km: 78000,
        type: 'TAGLIANDO',
        title: 'Tagliando Completo Ufficiale BMW',
        description: 'Sostituzione olio motore, microfiltro, filtro aria, pastiglie anteriori al 70%.',
        cost: 420,
        documentId: 'doc-2',
      },
      {
        id: 'evt-4',
        date: '2025-03-12',
        km: 67000,
        type: 'PNEUMATICI',
        title: 'Sostituzione 4 Pneumatici Estivi',
        description: 'Montaggio treno Michelin Pilot Sport 4 con equilibratura e convergenza 3D.',
        cost: 650,
      },
      {
        id: 'evt-3',
        date: '2024-05-20',
        km: 52000,
        type: 'REVISIONE',
        title: 'Prima Revisione Periodica Ministeriale',
        description: 'Controllo fumi e frenata superati con esito REGOLARE.',
        cost: 79,
      },
      {
        id: 'evt-2',
        date: '2023-04-10',
        km: 31000,
        type: 'TAGLIANDO',
        title: 'Primo Tagliando di Manutenzione BMW',
        description: 'Controllo elettronico, cambio olio e filtro antipolline.',
        cost: 320,
      },
      {
        id: 'evt-1',
        date: '2021-04-12',
        km: 0,
        type: 'IMMATRICOLAZIONE',
        title: 'Prima Immatricolazione',
        description: 'Immatricolazione veicolo nuovo presso concessionario BMW Italia.',
      },
    ],
    reminders: [
      {
        id: 'rem-1',
        type: 'ASSICURAZIONE',
        title: 'Scadenza Polizza RC Auto (UnipolSai)',
        dueDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        daysRemaining: 42,
        dismissed: false,
      },
      {
        id: 'rem-2',
        type: 'REVISIONE',
        title: 'Revisione Periodica Ministeriale',
        dueDate: new Date(Date.now() + 210 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        daysRemaining: 210,
        dismissed: false,
      },
      {
        id: 'rem-3',
        type: 'TAGLIANDO',
        title: 'Prossimo Tagliando (stimato a 88.000 km)',
        dueKm: 88000,
        kmRemaining: 5600,
        isEstimate: true,
        dismissed: false,
      },
    ],
    shareConfig: {
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
    },
    sellingConfig: {
      enabled: true,
      askingPrice: 29500,
      negotiable: true,
      showValuation: true,
      showHealthScore: true,
      showMaintenance: true,
      showInspection: true,
      showPhotos: true,
      allowContact: true,
      contactMethod: 'whatsapp',
      sellerNotes: 'BMW 320d Touring M Sport sempre tagliandata regolarmente con storico dimostrabile. Tenuta in garage, non fumatore.',
    },
    privacyAcknowledged: true,
    createdAt: '2025-01-10T12:00:00.000Z',
    updatedAt: now,
  };

  sample.healthBreakdown = computeDynamicHealthScore(sample);
  sample.healthScore = sample.healthBreakdown.totalScore;

  savePassport(sample);
  return sample;
}
