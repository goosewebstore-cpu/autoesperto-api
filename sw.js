const CACHE = 'autoesperto-v2';
const STATIC_CACHE = 'autoesperto-static-v2';
const API_CACHE = 'autoesperto-api-v2';

const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
];

const API_CACHE_PATTERNS = [
  /^https?:\/\/localhost:4000\/(health|vehicles\/lookup\/)/,
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(STATIC_CACHE).then((c) => c.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE && k !== STATIC_CACHE && k !== API_CACHE)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;

  if (API_CACHE_PATTERNS.some((p) => p.test(e.request.url))) {
    e.respondWith(networkFirst(e.request, API_CACHE));
    return;
  }

  if (url.origin === self.location.origin) {
    e.respondWith(networkFirst(e.request, CACHE));
    return;
  }

  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    return new Response(JSON.stringify({ offline: true, message: 'Sei offline. I dati saranno disponibili quando tornerai online.' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
