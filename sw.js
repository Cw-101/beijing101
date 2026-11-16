/* Běijīng 101 service worker — v2
 * Fixes: bumped cache version, precache the icons, and stop hijacking
 * cross-origin requests (the old handler answered failed font requests with
 * index.html, which broke typography instead of degrading gracefully).
 */
const CACHE = 'beijing101-v12';
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
  './js/srs.js',
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
  './audio/4e00-70b9-513f.mp3',
  './audio/4e00-767e-5f88-5927-3002.mp3',
  './audio/4e00-76f4-8d70-ff0c-7136-540e-5de6-8f6c-3002.mp3',
  './audio/4e00-76f4-8d70.mp3',
  './audio/4e00.mp3',
  './audio/4e03.mp3',
  './audio/4e09-70b9-534a-3002.mp3',
  './audio/4e0d-5ba2-6c14-ff0c-518d-89c1-3002.mp3',
  './audio/4e0d-5ba2-6c14.mp3',
  './audio/4e0d-8981.mp3',
  './audio/4e13-4e1a.mp3',
  './audio/4e2d-56fd.mp3',
  './audio/4e66.mp3',
  './audio/4e70-5355.mp3',
  './audio/4e70.mp3',
  './audio/4e86.mp3',
  './audio/4e94.mp3',
  './audio/4ec0-4e48.mp3',
  './audio/4eca-5929-5929-6c14-5f88-597d-3002.mp3',
  './audio/4eca-5929-5f88-51b7-3002.mp3',
  './audio/4eca-5929-661f-671f-4e00-3002.mp3',
  './audio/4eca-5929.mp3',
  './audio/4eca-5e74.mp3',
  './audio/4ed6-662f-533b-751f-3002.mp3',
  './audio/4ed6-662f-8c01-ff1f.mp3',
  './audio/4ee5-524d.mp3',
  './audio/4ee5-540e.mp3',
  './audio/4f1a.mp3',
  './audio/4f46-662f.mp3',
  './audio/4f4f.mp3',
  './audio/4f60-5403-4ec0-4e48-ff1f.mp3',
  './audio/4f60-597d-ff0c-8c22-8c22-3002.mp3',
  './audio/4f60-597d.mp3',
  './audio/4fbf-5b9c.mp3',
  './audio/516c-4ea4-8f66.mp3',
  './audio/518d-89c1.mp3',
  './audio/51b7.mp3',
  './audio/51e0-70b9.mp3',
  './audio/5206.mp3',
  './audio/524d.mp3',
  './audio/5317-4eac-7684-4e1c-897f-5f88-8d35-3002.mp3',
  './audio/5317-4eac.mp3',
  './audio/533b-751f.mp3',
  './audio/5341-52a0-5341-662f-4e8c-5341-3002.mp3',
  './audio/5341.mp3',
  './audio/534a.mp3',
  './audio/53eb.mp3',
  './audio/53ef-4ee5.mp3',
  './audio/53f3.mp3',
  './audio/53f7.mp3',
  './audio/5403.mp3',
  './audio/540d-5b57.mp3',
  './audio/540e.mp3',
  './audio/5411-53f3-8d70-3002.mp3',
  './audio/5417.mp3',
  './audio/54e5-54e5.mp3',
  './audio/54ea-513f.mp3',
  './audio/54ea.mp3',
  './audio/5546-5e97.mp3',
  './audio/559c-6b22.mp3',
  './audio/56e0-4e3a-4e0b-96e8-ff0c-6240-4ee5-6211-6ca1-53bb-3002.mp3',
  './audio/56e0-4e3a-559c-6b22-ff0c-6240-4ee5-6bcf-5929-5b66-4e60-3002.mp3',
  './audio/56e0-4e3a.mp3',
  './audio/5730-94c1.mp3',
  './audio/5757.mp3',
  './audio/591a-5c11-94b1.mp3',
  './audio/5927-5b66.mp3',
  './audio/5929-5b89-95e8.mp3',
  './audio/5929-6c14.mp3',
  './audio/592a-597d-4e86.mp3',
  './audio/592a-8d35-4e86-ff0c-4fbf-5b9c-4e00-70b9-3002.mp3',
  './audio/5973.mp3',
  './audio/5979-662f-5973-4eba-3002.mp3',
  './audio/597d-5403.mp3',
  './audio/5988-5988-9a82-9a6c-3002.mp3',
  './audio/5988-5988.mp3',
  './audio/5988.mp3',
  './audio/59d0-59d0.mp3',
  './audio/59d3.mp3',
  './audio/5b66-4e60.mp3',
  './audio/5b66-751f.mp3',
  './audio/5bb6.mp3',
  './audio/5bf9-4e0d-8d77-ff0c-6ca1-5173-7cfb-3002.mp3',
  './audio/5bf9-4e0d-8d77.mp3',
  './audio/5c81.mp3',
  './audio/5de5-4f5c.mp3',
  './audio/5de6.mp3',
  './audio/5df2-7ecf.mp3',
  './audio/600e-4e48.mp3',
  './audio/60f3.mp3',
  './audio/6211-4e0d-5403-8089-3002.mp3',
  './audio/6211-4eca-5e74-4e8c-5341-5c81-3002.mp3',
  './audio/6211-4f1a-8bf4-4e2d-6587-3002.mp3',
  './audio/6211-53bb-8fc7-5317-4eac-3002.mp3',
  './audio/6211-53bb-90a3-513f-73a9-513f-3002.mp3',
  './audio/6211-53eb-20-45-76-61-6e-3002.mp3',
  './audio/6211-5403-7d20-3002.mp3',
  './audio/6211-559c-6b22-5b66-4e60-4e2d-6587-3002.mp3',
  './audio/6211-559c-6b22-97f3-4e50-3002.mp3',
  './audio/6211-5728-5317-4eac-3002.mp3',
  './audio/6211-5750-5730-94c1-3002.mp3',
  './audio/6211-59d3-20-4a-6f-6e-65-73-3002.mp3',
  './audio/6211-5b66-4e60-4e2d-6587-3002.mp3',
  './audio/6211-5bb6-6709-56db-4e2a-4eba-3002.mp3',
  './audio/6211-60f3-559d-8336-3002.mp3',
  './audio/6211-662f-5b66-751f-3002.mp3',
  './audio/6211-770b-7535-5f71-3002.mp3',
  './audio/6211-8981-7c73-996d-3002.mp3',
  './audio/6211.mp3',
  './audio/6240-4ee5.mp3',
  './audio/6253-7b97.mp3',
  './audio/6253-8f66.mp3',
  './audio/660e-5929-6211-6253-7b97-5b66-4e60-3002.mp3',
  './audio/660e-5929-89c1-3002.mp3',
  './audio/660e-5929.mp3',
  './audio/660e-5e74-6211-53bb-4e2d-56fd-3002.mp3',
  './audio/660e-5e74.mp3',
  './audio/661f-671f.mp3',
  './audio/6628-5929-6211-5b66-4e60-4e86-3002.mp3',
  './audio/6628-5929.mp3',
  './audio/662f.mp3',
  './audio/6674.mp3',
  './audio/6708.mp3',
  './audio/670d-52a1-5458-ff0c-4e70-5355-3002.mp3',
  './audio/670d-52a1-5458.mp3',
  './audio/6765-81ea.mp3',
  './audio/6c34.mp3',
  './audio/6ca1-5173-7cfb.mp3',
  './audio/70b9-83dc.mp3',
  './audio/70b9.mp3',
  './audio/70ed.mp3',
  './audio/7238-7238.mp3',
  './audio/73a9-513f.mp3',
  './audio/73b0-5728-51e0-70b9-ff1f.mp3',
  './audio/73b0-5728.mp3',
  './audio/7535-5f71.mp3',
  './audio/767e.mp3',
  './audio/770b-4e66.mp3',
  './audio/7968.mp3',
  './audio/7ad9.mp3',
  './audio/7c73-996d.mp3',
  './audio/7d20.mp3',
  './audio/8001-5e08.mp3',
  './audio/800c-4e14.mp3',
  './audio/8089.mp3',
  './audio/80e1-540c.mp3',
  './audio/80fd.mp3',
  './audio/83dc-5355.mp3',
  './audio/867d-7136-5f88-51b7-ff0c-4f46-662f-5f88-597d-3002.mp3',
  './audio/867d-7136.mp3',
  './audio/8981.mp3',
  './audio/8bf7-770b-83dc-5355-3002.mp3',
  './audio/8bf7-95ee-ff0c-5730-94c1-7ad9-5728-54ea-513f-ff1f.mp3',
  './audio/8bf7-95ee.mp3',
  './audio/8c01.mp3',
  './audio/8c22-8c22-ff0c-4e0d-5ba2-6c14-3002.mp3',
  './audio/8c22-8c22.mp3',
  './audio/8d35.mp3',
  './audio/8f66-7ad9-5728-54ea-513f-ff1f.mp3',
  './audio/8fa3.mp3',
  './audio/8fc7-654f.mp3',
  './audio/8fc7.mp3',
  './audio/8fd0-52a8.mp3',
  './audio/8fd8-8981.mp3',
  './audio/8fd9-4e2a-591a-5c11-94b1-ff1f.mp3',
  './audio/8fd9-4e2a-5f88-597d-5403-3002.mp3',
  './audio/8fd9-513f-6709-4e00-70b9-513f-8fdc-3002.mp3',
  './audio/8fd9-513f.mp3',
  './audio/8fd9-662f-5730-94c1-7ad9-3002.mp3',
  './audio/8fd9-662f-6211-5988-5988-3002.mp3',
  './audio/8fd9-662f-6211-7684-4e66-3002.mp3',
  './audio/8fd9-662f-9ebb-3002.mp3',
  './audio/90a3-513f.mp3',
  './audio/96e8.mp3',
  './audio/96f6.mp3',
  './audio/9762-6761-5f88-597d-5403-3002.mp3',
  './audio/9762-6761.mp3',
  './audio/97f3-4e50.mp3',
  './audio/9a6c.mp3',
  './audio/9a82.mp3',
  './audio/9ebb-70e6-4f60.mp3',
  './audio/9ebb.mp3',
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
