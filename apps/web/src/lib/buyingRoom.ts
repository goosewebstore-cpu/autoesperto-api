export type BuyingStage =
  | 'scoperta'
  | 'analizzata'
  | 'salvata'
  | 'contattato_venditore'
  | 'vista'
  | 'trattativa'
  | 'acquistata';

export interface ShortlistedCar {
  id: string;
  make: string;
  model: string;
  version?: string;
  year?: number;
  km?: number;
  askingPrice?: number;
  estimatedValue?: number;
  matchScore: number;
  trustScore?: number;
  dealScore?: number;
  stage: BuyingStage;
  notes?: string;
  adUrl?: string;
  sellerPhone?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'autoesperto_buying_room_v1';

export const STAGE_CONFIG: Record<
  BuyingStage,
  { label: string; stepNumber: number; badgeColor: string; nextAction: string }
> = {
  scoperta: { label: 'Scoperta', stepNumber: 1, badgeColor: 'bg-slate-100 text-slate-700', nextAction: 'Analizza annuncio' },
  analizzata: { label: 'Analizzata con AI', stepNumber: 2, badgeColor: 'bg-blue-100 text-blue-800', nextAction: 'Salva nei preferiti' },
  salvata: { label: 'In Lista Scelta', stepNumber: 3, badgeColor: 'bg-indigo-100 text-indigo-800', nextAction: 'Contatta il venditore' },
  contattato_venditore: { label: 'Contattato', stepNumber: 4, badgeColor: 'bg-purple-100 text-purple-800', nextAction: 'Fissa appuntamento per vederla' },
  vista: { label: 'Vista e Provata', stepNumber: 5, badgeColor: 'bg-amber-100 text-amber-800', nextAction: 'Avvia la trattativa sul prezzo' },
  trattativa: { label: 'Trattativa in corso', stepNumber: 6, badgeColor: 'bg-orange-100 text-orange-800', nextAction: 'Concludi o acquista' },
  acquistata: { label: '🎉 Acquistata!', stepNumber: 7, badgeColor: 'bg-emerald-100 text-emerald-800', nextAction: 'Aggiungi al Vehicle Passport' },
};

export function getShortlistedCars(): ShortlistedCar[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveToBuyingRoom(
  car: Omit<ShortlistedCar, 'id' | 'createdAt' | 'updatedAt' | 'stage'> & { stage?: BuyingStage }
): ShortlistedCar {
  const all = getShortlistedCars();
  const existingIdx = all.findIndex(
    (c) => c.make.toLowerCase() === car.make.toLowerCase() && c.model.toLowerCase() === car.model.toLowerCase()
  );

  const now = new Date().toISOString();
  if (existingIdx >= 0) {
    all[existingIdx] = {
      ...all[existingIdx],
      ...car,
      updatedAt: now,
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    }
    return all[existingIdx];
  }

  const newCar: ShortlistedCar = {
    ...car,
    id: 'room-' + Math.random().toString(36).slice(2, 9),
    stage: car.stage || 'salvata',
    createdAt: now,
    updatedAt: now,
  };

  all.unshift(newCar);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch {}
  }

  return newCar;
}

export function updateBuyingStage(id: string, stage: BuyingStage): ShortlistedCar | null {
  const all = getShortlistedCars();
  const car = all.find((c) => c.id === id);
  if (!car) return null;

  car.stage = stage;
  car.updatedAt = new Date().toISOString();

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch {}
  }

  return car;
}

export function removeFromBuyingRoom(id: string) {
  const filtered = getShortlistedCars().filter((c) => c.id !== id);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch {}
  }
}
