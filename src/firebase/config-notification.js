import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";


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

    
export const getTokenFirebase = (setTokenFound) => {
  return getToken(messaging, {vapidKey: "Beared ya29.a0AWY7CklJPkDYxMlbVdWKWuzuCDzCxanQ0YlyT2wvYU-45geyzw_L4YP0z04b0CwPT2Dp3YqUa1PckMgKRNG5JCBdF8TmHcIKuoeoAPWjBZBfjWwAf6z4CIYRrLlfT4soH2D480btLT6wCfsWEN90VT3bgQQGaCgYKAe0SAQ4SFQG1tDrpLHJSd-9DT-UfQ9EB8UUnUA0163"}).then((currentToken) => {
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
}  


export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
});  


export const onForegroundMessage = () =>
  new Promise((resolve) => onMessage(messaging, (payload) => resolve(payload)));

