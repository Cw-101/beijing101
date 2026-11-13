/* Běijīng 101 service worker — v2
 * Fixes: bumped cache version, precache the icons, and stop hijacking
 * cross-origin requests (the old handler answered failed font requests with
 * index.html, which broke typography instead of degrading gracefully).
 */
const CACHE = 'beijing101-v9';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './data/lessons.js',
  './js/accent.js',
  './js/audiokey.js',
  './js/backupreminder.js',
  './js/courseprogress.js',
  './js/daysleft.js',
  './js/examtimer.js',
  './js/exportcsv.js',
  './js/exportmd.js',
  './js/highcontrast.js',
  './js/installbutton.js',
  './js/keyhelp.js',
  './js/laststudied.js',
  './js/learnedcount.js',
  './js/nighttoggle.js',
  './js/offlinebadge.js',
  './js/printcards.js',
  './js/printlist.js',
  './js/progress.js',
  './js/listening.js',
  './js/quickjump.js',
  './js/searchresults.js',
  './js/sessioncount.js',
  './js/shortcuts.js',
  './js/streakcalc.js',
  './js/streakgrid.js',
  './js/studytimer.js',
  './js/vocabsearch.js',
  './js/wordofday.js',
  './icon-192.png',
  './icon-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // Leave cross-origin requests (Google Fonts) to the network untouched.
  if (url.origin !== self.location.origin) return;

  // Navigations: network-first so updates land, cache as offline fallback.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() =>
          caches.match(req).then((r) => r || caches.match('./index.html'))
        )
    );
    return;
  }

  // Static assets: cache-first, only cache good same-origin responses.
  e.respondWith(
    caches.match(req).then(
      (cached) =>
        cached ||
        fetch(req).then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
    )
  );
});
