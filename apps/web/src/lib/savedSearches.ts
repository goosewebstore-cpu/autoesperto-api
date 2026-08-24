import type { FinderCriteria } from './finderEngine';

export interface SavedSearchItem {
  id: string;
  title: string;
  criteria: FinderCriteria;
  alertEnabled: boolean;
  alertEmail?: string;
  matchedCarsCount: number;
  createdAt: string;
}

export interface SavedCarFavorite {
  id: string;
  make: string;
  model: string;
  year?: number;
  price?: number;
  km?: number;
  matchScore?: number;
  trustScore?: number;
  imageUrl?: string;
  notes?: string;
  sourceUrl?: string;
  savedAt: string;
}

const SEARCHES_KEY = 'autoesperto_saved_searches_v1';
const FAVORITES_KEY = 'autoesperto_saved_favorites_v1';

export function getSavedSearches(): SavedSearchItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SEARCHES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSearch(
  criteria: FinderCriteria,
  title?: string,
  alertEmail?: string
): SavedSearchItem {
  const searches = getSavedSearches();
  const defaultTitle = `${criteria.bodyTypes.length > 0 && !criteria.bodyTypes.includes('indifferente') ? criteria.bodyTypes.join('/') : 'Auto'} fino a €${criteria.budgetMax.toLocaleString('it-IT')}`;

  const newItem: SavedSearchItem = {
    id: 'search-' + Math.random().toString(36).slice(2, 9),
    title: title || defaultTitle,
    criteria,
    alertEnabled: true,
    alertEmail: alertEmail || undefined,
    matchedCarsCount: 3,
    createdAt: new Date().toISOString(),
  };

  searches.unshift(newItem);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SEARCHES_KEY, JSON.stringify(searches.slice(0, 20)));
    } catch {
      // Ignore storage errors
    }
  }

  return newItem;
}

export function deleteSavedSearch(id: string) {
  const searches = getSavedSearches().filter((s) => s.id !== id);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SEARCHES_KEY, JSON.stringify(searches));
    } catch {
      // Ignore
    }
  }
}

export function getSavedFavorites(): SavedCarFavorite[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleSaveFavorite(car: Omit<SavedCarFavorite, 'id' | 'savedAt'>): boolean {
  const favs = getSavedFavorites();
  const index = favs.findIndex((f) => f.make.toLowerCase() === car.make.toLowerCase() && f.model.toLowerCase() === car.model.toLowerCase());

  if (index >= 0) {
    favs.splice(index, 1);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
      } catch {}
    }
    return false; // Removed
  } else {
    favs.unshift({
      ...car,
      id: 'fav-' + Math.random().toString(36).slice(2, 9),
      savedAt: new Date().toISOString(),
    });
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
      } catch {}
    }
    return true; // Added
  }
}
