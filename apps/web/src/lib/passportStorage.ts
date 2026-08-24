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

const PASSPORTS_STORAGE_KEY = 'autoesperto_vehicle_passports_v2';
const LEGACY_STORAGE_KEY = 'autoesperto_vehicle_passports_v1';

export function generateShareCode(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `AE-${num}`;
}

let memoryPassports: VehiclePassportData[] = [];

/**
 * Calculates a realistic dynamic Health Score breakdown based on available data
 */
export function computeDynamicHealthScore(passport: Partial<VehiclePassportData>): VehicleHealthBreakdown {
  const vehicle = passport.vehicle || ({} as any);
  const km = passport.currentKm || 50000;
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
  const clean: VehiclePassportData = {
    id: p.id || `pass-${Date.now()}`,
    shareCode: p.shareCode || generateShareCode(),
    userId: p.userId,
    vehicle: p.vehicle || {},
    nickname: p.nickname || `${p.vehicle?.make || 'Auto'} ${p.vehicle?.model || ''}`.trim(),
    mainPhoto: p.mainPhoto || p.vehicle?.imageUrl,
    currentKm: Number(p.currentKm) || 50000,
    lastKmDate: p.lastKmDate || new Date().toISOString().split('T')[0],
    healthScore: p.healthScore || 88,
    healthBreakdown: p.healthBreakdown || computeDynamicHealthScore(p),
    estimatedValue: p.estimatedValue || p.price?.estimatedValue || 18000,
    estimatedValueMax: p.estimatedValueMax || Math.round((p.estimatedValue || 18000) * 1.08),
    recommendedSellPrice: p.recommendedSellPrice,
    attractiveBuyerPrice: p.attractiveBuyerPrice,
    insuranceExpiry: p.insuranceExpiry,
    insuranceCompany: p.insuranceCompany,
    revisionExpiry: p.revisionExpiry,
    nextServiceKm: p.nextServiceKm,
    nextServiceDate: p.nextServiceDate,
    photos: Array.isArray(p.photos) ? p.photos : [],
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
  const clean = code.toUpperCase().trim();
  const all = getAllPassports();
  const found = all.find((p) => p.shareCode.toUpperCase() === clean);
  if (found) return found;

  if (clean === 'AE-48291' || clean === 'SAMPLE') {
    return ensureSamplePassport();
  }
  return null;
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
  const km = price.inputKm || (vehicle as any).mileage || 50000;
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
  const initialPhotos: PassportPhotoItem[] = [];
  if (vehicle.imageUrl) {
    initialPhotos.push({
      id: `photo-${Date.now()}-1`,
      url: vehicle.imageUrl,
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
    vehicle,
    nickname: customNickname || `${vehicle.make || 'Auto'} ${vehicle.model || ''}`.trim(),
    mainPhoto: vehicle.imageUrl,
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
  const km = input.currentKm || 50000;

  const initialTimeline: PassportTimelineItem[] = [
    {
      id: `evt-${Date.now()}-1`,
      date: `${year}-05-15`,
      km: 0,
      type: 'IMMATRICOLAZIONE',
      title: 'Prima Immatricolazione',
      description: `Veicolo immatricolato nuovo in Italia (${input.vehicle.fuel || 'Alimentazione standard'}).`,
    },
  ];

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

  const passport: VehiclePassportData = {
    id,
    shareCode,
    vehicle: input.vehicle,
    nickname: input.nickname || `${input.vehicle.make} ${input.vehicle.model}`,
    mainPhoto: input.mainPhoto || input.vehicle.imageUrl,
    currentKm: km,
    lastKmDate: now.split('T')[0],
    healthScore: 88,
    estimatedValue: 18500,
    estimatedValueMax: 19800,
    recommendedSellPrice: 19000,
    attractiveBuyerPrice: 17800,
    insuranceExpiry: input.insuranceExpiry,
    insuranceCompany: input.insuranceCompany,
    revisionExpiry: input.revisionExpiry,
    nextServiceKm,
    photos: input.mainPhoto
      ? [
          {
            id: `photo-${Date.now()}`,
            url: input.mainPhoto,
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
      showMaintenance: true,
      showRepairs: true,
      showRevisions: true,
      showHealthScore: true,
      showOriginalDocs: false,
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
