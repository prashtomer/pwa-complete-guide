// Registering in app.js because it's been added to all the html pages
var deferredPrompt;
var enableNotificationsButtons = document.querySelectorAll('.enable-notifications');

// check if Promise is supported or not
// if not assign it from the polyfill added in html files
if (!window.Promise) {
  window.Promise = Promise;
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js') // scope here can be passed as the second paramter and that will override the scope created by placing the service worker file in the public folder.
    .then(function () {
      console.log('Service worker registered!');
    })
    .catch(function (err) {
      console.log(err);
    });
}

window.addEventListener('beforeinstallprompt', function (event) {
  console.log('beforeinstallprompt fired');
  event.preventDefault();
  deferredPrompt = event;
  return false;
});

function displayConfirmNotification() {
  if ('serviceWorker' in navigator) {
    // not all options are supported in all the devices hence use title and body to cover the main data you want to show.
    var options = {
      body: 'You successfully subscribed to our Notification service!',
      icon: '/src/images/icons/app-icon-96x96.png',
      image: '/src/images/sf-boat.jpg',
      dir: 'ltr',
      lang: 'en-US',
      vibrate: [100, 50, 200],
      badge: '/src/images/icons/app-icon-96x96.png',
      tag: 'confirm-notification',
      renotify: true,
      actions: [
        {
          action: 'confirm',
          title: 'Okay',
          icon: '/src/images/icons/app-icon-96x96.png',
        },
        {
          action: 'cancel',
          title: 'Cancel',
          icon: '/src/images/icons/app-icon-96x96.png',
        }
      ]
    };
    navigator.serviceWorker.ready
      .then(function (swreg) {
        swreg.showNotification('Successfully subscribed (from SW)!', options);
      });
  }
}

function askForNotificationPermission() {
  Notification.requestPermission(function (result) {
    console.log('User choice', result);
    if (result !== 'granted') {
      console.log('No notification permission granted!');
    } else {
      displayConfirmNotification();
    }
  });
}

if ('Notification' in window) {
  for (var i = 0; i < enableNotificationsButtons.length; i++) {
    enableNotificationsButtons[i].style.display = 'inline-block';
    enableNotificationsButtons[i].addEventListener('click', askForNotificationPermission);
  }
}