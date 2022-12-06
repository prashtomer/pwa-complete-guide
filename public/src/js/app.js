// Registering in app.js because it's been added to all the html pages
var deferredPrompt;

if('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js') // scope here can be passed as the second paramter and that will override the scope created by placing the service worker file in the public folder.
    .then(function () {
      console.log('Service worker registered!');
    });
}

window.addEventListener('beforeinstallprompt', function (event) {
  console.log('beforeinstallprompt fired');
  event.preventDefault();
  deferredPrompt = event;
  return false;
});