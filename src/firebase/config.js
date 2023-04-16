import { initializeApp } from "firebase/app";
import { getFirestore, serverTimestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyDHm07mFV4y3VNxGOcwy7IiyiIy4R1bXC4",
    authDomain: "ticketapp-64209.firebaseapp.com",
    projectId: "ticketapp-64209",
    storageBucket: "ticketapp-64209.appspot.com",
    messagingSenderId: "57564813951",
    appId: "1:57564813951:web:b84f5357fd18643bd4bd4a"
  };

  //initialize Firebase


  const app = initializeApp(firebaseConfig);
  const projectFirestore = getFirestore(app);
  const projectStorage = getStorage(app);
  
  export { projectFirestore, projectStorage, serverTimestamp,  firebaseConfig };
