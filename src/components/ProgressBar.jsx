import React, { useEffect } from 'react';
import useStorage from '../hooks/useStorage';
import axios from '../api/axios';


const ProgressBar = ({ file, setFile }) => {
  
  const{url, progress} = useStorage(file, setFile);
 
  useEffect(() => {
    if (url) {
      setFile(null);
      let photos = JSON.parse(window.localStorage.getItem("photos_user"));
      const photo = {url}
      photos.push(url);
      window.localStorage.setItem("photos_user",  JSON.stringify(photos));

  
      
    }
  }, [url, setFile]);


  
 

  return (
    
    <div className='progress-bar' style = {{ width: progress + '%'}}></div>
    
    
  );
} 

export default ProgressBar;