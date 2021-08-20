const VERSION_ONE = "V1";
const DATA_CACHE_NAME = "PWA-Budget-Tracker" + VERSION_ONE;
const FILES_TO_CACHE = [
  '/',
  './index.html',
  './styles.css',
  './index.js',
  './db.js',
  './manifest.webmanifest',
  './icons/icon-192x192.png',
  './icons/icon-152x152.png',
];


self.addEventListener("install", function (evt) {
  evt.waitUntil(
    caches.open(DATA_CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});


self.addEventListener("activate", function (evt) {
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== VERSION_ONE && key !== DATA_CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

self.addEventListener("fetch", function (evt) {
  if (evt.request.url.includes("/api/")) {
    evt.respondWith(
      caches.open(DATA_CACHE_NAME).then(cache => {
        return fetch(evt.request)
          .then(response => {
            if (response.status === 200) {
              cache.put(evt.request.url, response.clone());
            }

            return response;
          })
          .catch(err => {
            return cache.match(evt.request);
          });
      }).catch(err => console.log(err))
    );

    return;
  }

  evt.respondWith(
    caches.open(VERSION_ONE).then(cache => {
      return cache.match(evt.request).then(response => {
        return response || fetch(evt.request);
      });
    })
  );
});