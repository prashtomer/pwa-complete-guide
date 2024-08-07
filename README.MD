# Progressive Web Apps - Complete Guide
This source code is part of Maximilian Schwarzmüller's "Progressive Web Apps - Complete Guide" course on udemy.com.

# How to Use
You need [Node.js](https://nodejs.org) installed on your machine. Simply download the installer from [nodejs.org](https://nodejs.org) and go through the installation steps.

Once Node.js is installed, open your command prompt or terminal and **navigate into this project folder**. There, run `npm install` to install all required dependencies.

Finally, run `npm start` to start the development server and visit [localhost:8080](http://localhost:8080) to see the running application.


Docs: 

- Manifest file helps install the app on the home pafe of the device via web browser so that the app can be open by a icon just like we open native mobile apps via icon.

- Service workers
  - Scripts that runs in tha background on different thread and can react to certail events like fetch
  - Can keep running event after the application or browser is closed
  - Doesn't react to ajax ie traditional Xmlhttprequest and libraries like axios that worked on it.
  - All the requests to server go through service worker and so the service worker can decide what to cache and thus helps in implementing offline browsing of certain areas of the application
  - Receives push notifications from Server (Google, mozilla, android, ios each have their own web push servers) to which you can send notification from your server
  - Can listen to notification interaction
  - Push notifications are done in service worker because they work in background even when the app is closed.
  - Helps in background Syncronization means if the request fails due to bad internet connection connection than the request can re-execute once the internet connection is established. Thus it can store such actions.
  - Will only get active when there is no old service worker instance already running.
  - Service worker is not attached to a single page but to an overall domain or scope.
  - Scope means you can control which parts of the application are controlled by the service worker.
  - If the service worker file is unchanged it will not install it but if there is a change then service worker will be upgraded to the new version
  - Placing the service worker file in code base will decide it's scope so it's preferable to store it in the root of public folder so that all the pages can have access ito it or else will only be available to pages inside the folder it is kept in.
  - Service worker only work with pages on https, localhost is the exception.
  - You don't have access to DOM events in service worker but other special events like fetch, install, activate etc
  - If you make any change in the service worker file than make sure you close all the tabs running the application and open new one else you won't see the service wotker to be activated and running.
  - Service worker is only installed if it is changed but register will get called on very page refresh
  - caching the service worker dosn't make sense because you can get stuck in an infinite loop because we would constantly fetch an old version of the service worker
  - cache storage in browser under applications should be used to cache files and json data even though you can cache data also.

- Indexed DB
  - In browser database used to cache the data most probably in json format and not preferred for files but you can save files also.
  - Used for caching dynamic content
  - It's a key value database
  - It runs in browser and not on server
  - It is transactional in nature which means if one action within a transaction fails none of the actions of that transaction are applied
  - can be accessed asynchronously with both from javascript and service workers
  - Since in local storage and session storage data can be accessed synchronously they can not be used in service workers
  - data can be unstructured and doesn't have to have schema.

- Background Synchronization
  - Synchronizing the data even when the user is offline while sending it.
  - Using service worker you can't cache the post request. You can cache the response but you can't cache the request itself to be send at later point of time
  - It will work even after the application or the browser itself is closed. 
  - To see background synchronization in action you need to turn off the wifi, simply going offline from dev tools will not work.

- Periodic sync
  - Currently not supported in any browsers but will come later.
  - Get data from server in regular intervals in background, will help in websites like twitter

- Push Notifications
  - Notifications can simply be triggered via Notifications Api in the browser but how they are shown is in the control of the device.
  - But for push notifications we need service worker.
  - Notification is a system feature and not something browser specific so any actions you want to listen on notification can be listened in service worker and not the browser.
  - Each subscription stored on the server has it's own end point and corresponds to only one device and one browser which means through that endpoint messages can only be pushed to that device.
  - Unrgistering a service worker will make the old subscriptions useless so make sure to delete them.

- React
  - Create react app generated project is already configured as a pwa app and you can run the initial page in offline mode
  - You can eject react app to configure the hidden webpack and service worker configurations manually it's one way only.
  - Same code from this project can be used in react components and make it a complete pwa
  - look for documentation online

- Angular
  - Like react it's cli doesn't provide basic pwa setup by default
  - you have to manually setup the pwa by creating manifest json and service worker file
  - Same code from this project can be used in angular components and make it a complete pwa
  - you can use some angular service worker package to create all pwa files
  - look for documentation online

  - Vue
    - Use vue-pwa-boilerplate
    - look for documentation online