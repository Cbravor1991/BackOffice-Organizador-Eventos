/ Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: "AIzaSyCGG0h7J1O5Q5hbUm4xTD2tOWniett0WBQ",
  authDomain: "ticketapp-19a39.firebaseapp.com",
  projectId: "ticketapp-19a39",
  storageBucket: "ticketapp-19a39.appspot.com",
  messagingSenderId: "167142730483",
  appId: "1:167142730483:web:1a344e88a5a9ef0086e586"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});

