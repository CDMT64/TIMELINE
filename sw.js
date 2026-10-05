/* Timeline mission — fonctionnement hors connexion.
   À CHAQUE MISE À JOUR : changer VERSION ici ET APP_VERSION dans index.html. */
const VERSION = '1.1';
const BUILD = '2026-10-05'; // change à chaque dépôt, même si le numéro de version ne change pas
const CACHE = 'timeline-mission-' + VERSION + '-' + BUILD;
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('timeline-mission-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('message', e => { if (e.data === 'skip') self.skipWaiting(); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true })
      .then(r => r || fetch(e.request).catch(() => caches.match('./index.html')))
  );
});
