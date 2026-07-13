const CACHE_NAME = 'jenca-cache-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './about.html',
  './services.html',
  './team.html',
  './book.html',
  './contact.html',
  './css/style.css',
  './js/main.js',
  './assets/jenca-logo.jpg',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Network-first: always try to get the freshest version from the server first.
// Only fall back to the cached copy if the network request fails (e.g. offline).
// This means live updates on GitHub Pages show up immediately for users who are online,
// while offline access still works using whatever was last successfully cached.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
