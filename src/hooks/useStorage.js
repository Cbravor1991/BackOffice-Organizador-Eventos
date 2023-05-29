import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { serverTimestamp } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { firebaseConfig, projectFirestore } from '../firebase/config';
import { initializeApp } from "firebase/app";

import {  getDownloadURL } from 'firebase/storage';
import { collection, doc, addDoc } from "firebase/firestore";

const app = initializeApp(firebaseConfig);
const projectStorage = getStorage(app);

const useStorage = (file) => { // remove setFile parameter
  const fotos = [];
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(null);
  const [uploaded, setUploaded] = useState(false);

  useEffect(() => {
    if (file && !uploaded) { // check if the file has not been uploaded yet
      const storageRef = ref(projectStorage, file.name);
      const collectionRef = collection(projectFirestore, 'images');
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', (snapshot) => {
        const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(percentage);
      }, (err) => {
        setError(err);
      }, async () => {
        const url = await getDownloadURL(storageRef);
        console.log(url);
        const createdAt = serverTimestamp();
        setUrl(url);
    
       
      });
    }

  }, [file, uploaded]); // agregar el estado de cargado a la lista de dependencias

  return { progress, url, error };
}

export default useStorage;
