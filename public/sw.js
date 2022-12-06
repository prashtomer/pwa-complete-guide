self.addEventListener('install', function (event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
});

self.addEventListener('activate', function (event) {
  console.log('[Service Worker] Activating Service Worker ...', event);
  return self.clients.claim(); // it ensure the service workers are loaded correctly, can also work without this line but may behave strangely
});

self.addEventListener('fetch', function (event) {
  console.log('[Service Worker] Fetching something ...', event);
  event.respondWith(fetch(event.request)); // let the request go as is.
});