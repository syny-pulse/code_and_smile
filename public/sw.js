const CACHE_VERSION = 'cas-academy-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;

// Core app shell files to precache on install
const APP_SHELL = [
  '/',
  '/offline',
  '/manifest.json',
  '/cas_favicon.svg',
  '/cas_logo.svg',
  '/cas_logowhite.svg',
];

// Install: cache the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );
  // Activate immediately
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key.startsWith('cas-academy-') && key !== STATIC_CACHE && key !== DYNAMIC_CACHE && key !== IMAGE_CACHE)
          .map((key) => caches.delete(key))
      );
    })
  );
  // Take control of all clients immediately
  self.clients.claim();
});

// Helper: is this a navigation request?
function isNavigationRequest(request) {
  return request.mode === 'navigate' || (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'));
}

// Helper: is this a static asset?
function isStaticAsset(url) {
  return /\.(js|css|woff2?|ttf|eot|svg|ico)(\?.*)?$/i.test(url.pathname) ||
    url.pathname.startsWith('/_next/static/');
}

// Helper: is this an image?
function isImageRequest(url) {
  return /\.(png|jpg|jpeg|gif|webp|avif|svg)(\?.*)?$/i.test(url.pathname);
}

// Helper: is this an API request?
function isApiRequest(url) {
  return url.pathname.startsWith('/api/');
}

// Fetch: apply different strategies based on request type
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) return;

  // API requests: network-only (don't cache API responses)
  if (isApiRequest(url)) return;

  // Static assets: cache-first
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(event.request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Images: cache-first with separate cache
  if (isImageRequest(url)) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(IMAGE_CACHE).then((cache) => cache.put(event.request, clone));
          }
          return response;
        }).catch(() => {
          // Return nothing for failed image requests
          return new Response('', { status: 404 });
        });
      })
    );
    return;
  }

  // Navigation requests: network-first with offline fallback
  if (isNavigationRequest(event.request)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful page loads
          if (response.ok) {
            const clone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          // Try the dynamic cache first, then the offline page
          return caches.match(event.request).then((cached) => {
            return cached || caches.match('/offline');
          });
        })
    );
    return;
  }

  // Everything else: stale-while-revalidate
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);

      return cached || fetchPromise;
    })
  );
});
