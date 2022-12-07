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
        swreg.showNotification('Successfully subscribed!', options);
      });
  }
}

function configurePushSub() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  var reg;

  navigator.serviceWorker.ready
    .then(function (swreg) {
      reg = swreg;
      return swreg.pushManager.getSubscription();
    })
    .then(function (sub) {
      if (sub === null) {
        // create a new subscription
        // for this we need credit card info in firebase and then we have to initialise this project with firebase tooling
        // This will generated a folder called functions in the root where we can install this webpush package used for generating the public and private key
        // This cloud functions featuer in firebase requires credit card information
        // without it we won't have server for sending push messages to trigger push notifications

        var vapidPublicKey = 'some-generated-key-through-webpush-package';
        var convertedVapidPublicKey = urlBase64ToUint8Array(vapidPublicKey);
        return reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidPublicKey,
        });
      } else {
        // we have subscription
      }
    })
    .then(function (newSub) {
      // here we are pushing this new subscription to the firbase server
      // And is the firebase database under subscriptions you will see this subscription with endpoint which is a vendor endpoint like google where we can then send push messages to.
      return fetch('https://tomer-pwagram-default-rtdb.firebaseio.com/subscriptions.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(newSub)
      });
    })
    .then(function (res) {
      if(res.ok) {
        displayConfirmNotification();
      }
    })
    .catch(function (err) {
      console.log(err);
    })
}

function askForNotificationPermission() {
  Notification.requestPermission(function (result) {
    console.log('User choice', result);
    if (result !== 'granted') {
      console.log('No notification permission granted!');
    } else {
      configurePushSub();
      // displayConfirmNotification();
    }
  });
}

if ('Notification' in window && 'serviceWorker' in navigator) {
  for (var i = 0; i < enableNotificationsButtons.length; i++) {
    enableNotificationsButtons[i].style.display = 'inline-block';
    enableNotificationsButtons[i].addEventListener('click', askForNotificationPermission);
  }
}