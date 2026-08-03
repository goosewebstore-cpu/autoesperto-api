const STATIC_CACHE = 'autoesperto-static-v5';
const MAX_CACHE_ENTRIES = 80;

const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(STATIC_CACHE)
      .then((c) => Promise.allSettled(PRECACHE_URLS.map((u) => c.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== STATIC_CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

async function putWithEviction(request, response) {
  const cache = await caches.open(STATIC_CACHE);
  await cache.put(request, response);
  const keys = await cache.keys();
  if (keys.length > MAX_CACHE_ENTRIES) {
    await Promise.all(keys.slice(0, keys.length - MAX_CACHE_ENTRIES).map((k) => cache.delete(k)));
  }
}

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;

  if (url.pathname === '/sw.js' || url.pathname.startsWith('/_next/')) return;

  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).catch(() => caches.match('/')));
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cached) => {
      const fetched = fetch(e.request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            putWithEviction(e.request, clone).catch(() => undefined);
          }
          return response;
        })
        .catch(() => cached);
      return cached || fetched;
    })
  );
});