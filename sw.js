/* ══════════════════════════════════════════════════════════════
   TICKERVIEW — Service Worker (PWA)
   sw.js — Cache-first for static assets, network-first for data

   FIX v2 : chemins relatifs (sans leading slash) pour compatibilité
   GitHub Pages qui sert le site depuis un sous-dossier.
   Le SW est enregistré depuis index.html, donc son scope est déjà
   correct — les chemins relatifs s'y réfèrent naturellement.
══════════════════════════════════════════════════════════════ */

const CACHE_NAME = 'tickerview-v2';
const STATIC_ASSETS = [
  './',
  './index.html',
  './stock.html',
  './manifest.json',
  './src/styles/variables.css',
  './src/styles/global.css',
  './src/styles/stock.css',
  'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@200;300;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,700&family=IBM+Plex+Mono:wght@300;400;500&display=swap',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(c => c.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Network-first for AI proxy / market data streams
  if (
    e.request.url.includes('vercel.app') ||
    e.request.url.includes('api.') ||
    e.request.url.includes('stream.')
  ) {
    e.respondWith(
      fetch(e.request).catch(() => new Response('', { status: 503 }))
    );
    return;
  }
  // Cache-first for static assets
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
