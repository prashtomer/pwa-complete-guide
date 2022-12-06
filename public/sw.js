// Bump these versions if you make changes in any of the files that you are caching
var CACHE_STATIC_NAME = 'static-v11';
var CACHE_DYNAMIC_NAME = 'dynamic-v2';

self.addEventListener('install', function (event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME) // open existing cache or create new
      .then(function (cache) {
        console.log('[Service Worker] Precaching App Shell');
        // fetch from server and then put it in the cache to server the subsequent requests
        // key in cache is the request object and not a string
        cache.addAll([
          '/',
          '/index.html',
          '/offline.html',
          '/src/js/app.js',
          '/src/js/feed.js',
          '/src/js/promise.js',
          '/src/js/fetch.js',
          '/src/js/material.min.js',
          '/src/css/app.css',
          '/src/css/feed.css',
          '/src/images/main-image.jpg',
          'https://fonts.googleapis.com/css?family=Roboto:400,700',
          'https://fonts.googleapis.com/icon?family=Material+Icons',
          'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
        ]);
      })
  );
});

self.addEventListener('activate', function (event) {
  console.log('[Service Worker] Activating Service Worker ...', event);
  event.waitUntil(
    caches
      .keys()
      .then(function (keyList) {
        return Promise.all(keyList.map(function (key) {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            console.log('[Service Worker] Removing old cache.', key);
            return caches.delete(key);
          }
        }));
      })
  );
  return self.clients.claim(); // it ensures that the service workers are loaded correctly, can also work without this line but may behave strangely
});

// self.addEventListener('fetch', function (event) {
//   // event.respondWith(fetch(event.request)); // let the request go as is.
//   event.respondWith(
//     caches.match(event.request)
//       .then(function (response) {
//         if (response) {
//           return response;
//         } else {
//           return fetch(event.request)
//             .then(function (res) {
//               return caches.open(CACHE_DYNAMIC_NAME) // caching dynamic data
//                 .then(function (cache) {
//                   // put doesn't make request like add. It just stores the data you have.
//                   cache.put(event.request.url, res.clone());
//                   return res;
//                 })
//             })
//             .catch(function (err) {
//               return caches.open(CACHE_STATIC_NAME)
//                 .then(function (cache) {
//                   // fallback page for when cache doesn't exist for a requested page when visiting without internet.
//                   return cache.match('/offline.html');
//                 });
//             })
//         }
//       })
//   );
// });

// Cache only strategy (Not recommended). Can work if request is parsed for some resources
// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     caches.match(event.request)
//   );
// })

// Network only strategy (Not recommended even service worker is not required if every request is any ways going on network). Can work if request is parsed for some resources
// self.addEventListener('fetch', function (event) {
//   event.respondWith(fetch(event.request));
// })