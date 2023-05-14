import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";


//const GOOGLE_APPLICATION_CREDENTIALS="/home/user/Downloads/ticketapp-19a39-firebase-adminsdk-c8b6u-abcc43cee9.json";

var {google} = require('googleapis');

var MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';

var SCOPES = [MESSAGING_SCOPE];


export const firebaseConfig = {
    apiKey: "AIzaSyCGG0h7J1O5Q5hbUm4xTD2tOWniett0WBQ",
    authDomain: "ticketapp-19a39.firebaseapp.com",
    projectId: "ticketapp-19a39",
    storageBucket: "ticketapp-19a39.appspot.com",
    messagingSenderId: "167142730483",
    appId: "1:167142730483:web:1a344e88a5a9ef0086e586",
    measurementId: "G-VQ295DTJ89"    
  };
  
  
let firebaseapp = null;
  
if (!getApps().length) {
   firebaseapp = initializeApp(firebaseConfig);
} else {
   firebaseapp = getApp(); 
   }

const analytics = getAnalytics(firebaseapp);
  
const messaging = getMessaging(firebaseapp);


export function getAccessToken() {
  return new Promise(function(resolve, reject) {
    //const key = require('../placeholders/ticketapp-19a39-firebase-adminsdk-c8b6u-abcc43cee9.json');
    const jwtClient = new google.auth.JWT(
      "firebase-adminsdk-c8b6u@ticketapp-19a39.iam.gserviceaccount.com",
      null,
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCyvgyDRWcYoho9\ncdsqJwRhP0C7XjT2JOLyOwD0d6c85KkXM7RoF2v61HYiKvk33URFXQtIG68rXZtg\ngIslkcnBiGVRXEtWKm/+0XKQrN2cEtINmc6MpmwwOkDM5gb2VUDmEvnrXakmNp54\nft6lCbgM83IMIT/kqDXQseEitvlefC21ErP+MLABoy3LyZEYWKBSJ/MBBeegqNhw\ndnfPBVoDGfzHpVDMlhPD/BLUOtY8ZoWyeOuxoWa4WLEjOjg3GG2y6ZCSDkmsQZCC\nmW5YcQHZu6T5G9HidrzqiTM0SP2/oaXU9UHK6myY1yMCfmfvY8LQh/RqFK/E8YKG\n5PgN39VrAgMBAAECggEABuX2MxDE8FRW2x05F9dGprKOvuYQkplZpH8Ddx8XdlTe\nDVx8L3I/KbPBojYlxSXfryYIO+5//a/3DnixJha9m+ycLTfFjo9EhqfMGjcZtgU1\nILvZY8ZxsXcy4TvvDXQjDsR+HofQWEtOWJjCfGMaIwg4Ono3OydrLRRx+5yzlhWR\nqrQ2wCgzrTN5gSQEkUB0ojG9I49HlgA17CBtBw2U+znT6ESocoUB+qohvFp2hGXq\ney6fIpgyukLUantoBsIcJehe8qUMPnauqXHowYDFXGEzMwsgULpQFzXvrYmdmK/S\nfYWTx4eOyRGtFlfRAj1i19S5OuDV8wV35tAcxqGCVQKBgQDjezyD8ou/datXyd/2\nu44W6iS4RA0uxA4DyxcEz3l7QwmU8V1Rdz8adSh/p0s5Zk31To2b5FqSTPxubiCX\nUO/GAfDxI/zWL08zZ/sCA1BrDgy277UGEqwMXWTP3qF5UiWV4r5qaOCF1iBhF40t\nHT6v+Wks8VHlliMXQDuo261vPQKBgQDJJpZ31EkA9pykTMIB4HpjFOs9CS8EyL88\nIh/CkIOOlpDFjSCfqIL7Uyrck8eI86WjTBfaql/y44vDNQ1kErrMBnbr/ImAfi3L\nOMiRiZgDzDlFXAzU1aECCUIDs0my5QlUI7ieFcz6tQYIVInLTtc4wNYZ/bqZSnIu\nPGMB5Q2hxwKBgQCuUMUypy4HbPf7sap5u4dKb+nredpQN9Q1e+8LtKD2n4w8IijM\nQICOmbCLAXtXZNngXG2PRBFTgsL9LE61JURXiy1C27zntCEQ12E1TazWHFIJ7O3e\n1XgZkYeq8oLyIMzEaphXmj5S0J7HR/Da3UooNwstcU68i6wgKQyOfKgOUQKBgBxv\nB/YIXAl20s2mzAXX5XT8EASgt7TFa8LkT/kA1JfjULOcL3BiMaG1L+neOeZyCof6\nyaRvUQDUiX0ekrYCr8UHZOgW2pj/PRns/O0VthdTVwUm7eloCUpwZJSBU3mmRptO\nMVqnWkJWNHQY/yFuE55CJAGojCf/DgTbJGOwLS0hAoGAOX4h3LQwFsI6Hd/6xtMh\nF79hEIggV/Tr1fyl+i9sXvW9cJjd2hG9M7fRNmXxYfFNLNO9LmVWuFVbJFWacF6E\nW8+oSzuVBGlIhJNcP1jsf7HSoI1k3vezt4CpcGbzVK/aT3l1utAbp/5Tcv938nJR\nbiPftLztB9PWmiDDt7CCX28=\n-----END PRIVATE KEY-----\n",
      SCOPES,
      null
    );
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens.access_token);
    });
  });
}


export const getOrRegisterServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    return window.navigator.serviceWorker
      .getRegistration('/firebase-push-notification-scope')
      .then((serviceWorker) => {
        if (serviceWorker) return serviceWorker;
        return window.navigator.serviceWorker.register('/firebase-messaging-sw.js', {
          scope: '/firebase-push-notification-scope',
        });
      });
  }
  throw new Error('The browser doesn`t support service worker.');
};


export const getTokenFirebase = () =>
  getOrRegisterServiceWorker()
    .then((serviceWorkerRegistration) =>
      getToken(messaging, { vapidKey: "BBj4VkejOn6Id2GfXe1u9fQrzYxoxLOkHnBxHGXKA8DXmrTMasukIX-p4XiyzdkxrGxS_HpqtUOYxP4-E0zZQCA", serviceWorkerRegistration }));
    
    
/*export const getTokenFirebase = (setTokenFound) => {
  return getToken(messaging, {vapidKey: "BBj4VkejOn6Id2GfXe1u9fQrzYxoxLOkHnBxHGXKA8DXmrTMasukIX-p4XiyzdkxrGxS_HpqtUOYxP4-E0zZQCA"}).then((currentToken) => {
    if (currentToken) {
      console.log('current token for client: ', currentToken);
      setTokenFound(true);
      // Track the token -> client mapping, by sending to backend server
      // show on the UI that permission is secured
    } else {
      console.log('No registration token available. Request permission to generate one.');
      setTokenFound(false);
      // shows on the UI that permission is required 
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // catch error while creating client token
  });
} */ 


export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
});  


export const onForegroundMessage = () =>
  new Promise((resolve) => onMessage(messaging, (payload) => resolve(payload)));

