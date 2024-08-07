importScripts('/src/js/idb.js');
importScripts('/src/js/utility.js');

// Bump these versions if you make changes in any of the static files that you are caching below in install event
var CACHE_STATIC_NAME = 'static-v18';
var CACHE_DYNAMIC_NAME = 'dynamic-v2';
var STATIC_FILES = [
  '/',
  '/index.html',
  '/offline.html',
  '/src/js/app.js',
  '/src/js/feed.js',
  '/src/js/idb.js',
  '/src/js/promise.js',
  '/src/js/fetch.js',
  '/src/js/material.min.js',
  '/src/css/app.css',
  '/src/css/feed.css',
  '/src/images/main-image.jpg',
  'https://fonts.googleapis.com/css?family=Roboto:400,700',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
]

// function trimCache(cacheName, maxItems) {
//   caches.open(cacheName)
//     .then(function (cache) {
//       return cache.keys()
//         .then(function (keys) {
//           if (keys.length > maxItems) {
//             cache.delete(keys[0])
//               .then(function () {
//                 trimCache(cacheName, maxItems)
//               });
//           }
//         });
//     })
// }

self.addEventListener('install', function (event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME) // open existing cache or create new
      .then(function (cache) {
        console.log('[Service Worker] Precaching App Shell');
        // fetch from server and then put it in the cache to server the subsequent requests
        // key in cache is the request object and not a string
        cache.addAll(STATIC_FILES);
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

function isInArray(string, array) {
  var cachePath;
  if (string.indexOf(self.origin) === 0) { // request targets domain where we serve the page from (i.e. NOT a CDN)
    console.log('matched ', string);
    cachePath = string.substring(self.origin.length); // take the part of the URL AFTER the domain (e.g. after localhost:8080)
  } else {
    cachePath = string; // store the full request (for CDNs)
  }
  return array.indexOf(cachePath) > -1;
}


// Cache then Network Strategy for url and else go back to old strategy ie cache with network fallback
self.addEventListener('fetch', function (event) { // cache then network
  var url = 'https://tomer-pwagram-default-rtdb.firebaseio.com/posts'; // this path can be changed to the path mentioned inside the index js inside the functions folder (requires credit card hence not implemented)
  if (event.request.url.indexOf(url) > -1) {
    event.respondWith(
      fetch(event.request)
        .then(function (res) {
          var clonedRes = res.clone();
          clearAllData('posts')
            .then(function () {
              return clonedRes.json();
            })
            .then(function (data) {
              for (var key in data) {
                writeData('posts', data[key]);
              }
            });
          return res;
        })
    );
  } else if (isInArray(event.request.url, STATIC_FILES)) { // cache only
    event.respondWith(
      caches.match(event.request)
    );
  } else { // cache with network fallback
    event.respondWith(
      caches.match(event.request)
        .then(function (response) {
          if (response) {
            return response;
          } else {
            return fetch(event.request)
              .then(function (res) {
                return caches.open(CACHE_DYNAMIC_NAME) // caching dynamic data
                  .then(function (cache) {
                    // put doesn't make request like add. It just stores the data you have.
                    // trimCache(CACHE_DYNAMIC_NAME, 3);
                    cache.put(event.request.url, res.clone());
                    return res;
                  })
              })
              .catch(function (err) {
                return caches.open(CACHE_STATIC_NAME)
                  .then(function (cache) {
                    // fallback page for when cache doesn't exist for a requested page when visiting without internet.
                    if (event.request.headers.get('accept').includes('text/html')) {
                      return cache.match('/offline.html');
                    }
                  });
              })
          }
        })
    );
  }
});

// Network with cache fallback strategy along with dynamic caching
// This will give bad user experience if the connection timeout because the cache look will happen after that
// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     fetch(event.request)
//       .then(function (res) {
//         return caches.open(CACHE_DYNAMIC_NAME) // caching dynamic data
//           .then(function (cache) {
//             // put doesn't make request like add. It just stores the data you have.
//             cache.put(event.request.url, res.clone());
//             return res;
//           })
//       })
//       .catch(function (err) {
//         return caches.match(event.request)
//       })
//   );
// });

// Network with cache fallback strategy
// This will give bad user experience if the connection timeout because the cache look will happen after that
// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     fetch(event.request)
//       .catch(function (err) {
//         return caches.match(event.request)
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

self.addEventListener('sync', function (event) {
  console.log('[Service Worker] Background syncing', event);
  if (event.tag === 'sync-new-posts') {
    console.log('[Service Worker] Syncing new Posts');
    event.waitUntil(
      readAllData('sync-posts')
        .then(function (data) {
          for (var dt of data) {
            var postData = new FormData();
            postData.append('id', dt.id);
            postData.append('title', dt.title);
            postData.append('location', dt.location);
            postData.append('rawLocationLat', dt.rawLocation.lat);
            postData.append('rawLocationLng', dt.rawLocation.lng);
            postData.append('file', dt.picture, dt.id + '.png');


            fetch('https://tomer-pwagram-default-rtdb.firebaseio.com/posts.json', {
              method: 'POST',
              body: postData
            })
              .then(function (res) {
                console.log('Sent data', res);
                if (res.ok) {
                  deleteItemFromData('sync-posts', dt.id);
                }
              })
              .catch(function () {
                console.log('Error while sending data', err);
              });
          }
        })
    );
  }
});

self.addEventListener('notificationclick', function (event) {
  var notification = event.notification;
  var action = event.action;

  console.log(notification);

  if (action === 'confirm') {
    console.log('Confirm was chosen');
    notification.close();
  } else {
    console.log(action);
    event.waitUntil(
      clients.matchAll()
        .then(function (clis) {
          var client = clis.find(function (c) {
            return c.visibilityState === 'visible';
          });

          if (client !== undefined) {
            client.navigate(notification.data.url);
            client.focus();
          } else {
            clients.openWindow(notification.data.url);
          }
        })
    );
    notification.close();
  }
});

self.addEventListener('notificationclose', function (event) {
  console.log('Notification was closed', event);
});

// Listen to push messages from the server
self.addEventListener('push', function (event) {
  console.log('Push Notification received', event);
  var data = {
    title: 'New!',
    content: 'Something new happened!',
    openUrl: '/'
  };
  if (event.data) {
    data = JSON.parse(event.data.text());
  }

  var options = {
    body: data.content,
    icon: '/src/images/icons/app-icon-96x96.png',
    badge: '/src/images/icons/app-icon-96x96.png',
    data: {
      url: data.openUrl
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
});

