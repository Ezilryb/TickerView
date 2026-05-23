/* ══════════════════════════════════════════════════════════════
   TICKERVIEW — Service Worker (PWA)
   sw.js — Cache-first for static assets, network-first for data
══════════════════════════════════════════════════════════════ */

const CACHE_NAME = 'tickerview-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/styles/variables.css',
  '/src/styles/global.css',
  'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@200;300;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,700&family=IBM+Plex+Mono:wght@300;400;500&display=swap'
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
  // Network-first for API/market data
  if(e.request.url.includes('api.') || e.request.url.includes('stream.')){
    e.respondWith(fetch(e.request).catch(() => new Response('', {status:503})));
    return;
  }
  // Cache-first for static assets
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
