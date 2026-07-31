interface CacheEntry {
  value: unknown;
  expires: number;
}

const cache = new Map<string, CacheEntry>();
const MAX_ENTRIES = 500;

export function cacheGet<T>(key: string): T | undefined {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (entry.expires < Date.now()) {
    cache.delete(key);
    return undefined;
  }
  return entry.value as T;
}

export function cacheSet(key: string, value: unknown, ttlMs: number): void {
  cache.set(key, { value, expires: Date.now() + ttlMs });
  if (cache.size > MAX_ENTRIES) {
    const oldest = cache.keys().next().value;
    if (oldest) cache.delete(oldest);
  }
}

export function cacheRemember<T>(key: string, ttlMs: number, producer: () => T): T {
  const cached = cacheGet<T>(key);
  if (cached !== undefined) return cached;
  const value = producer();
  cacheSet(key, value, ttlMs);
  return value;
}
