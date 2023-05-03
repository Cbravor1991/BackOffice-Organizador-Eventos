import React, { useEffect } from 'react';
import useStorage from '../hooks/useStorage';

const ProgressBar = ({ file, setFile }) => {
  const{url, progress} = useStorage(file, setFile);
 
  useEffect(() => {
    if (url) {
      setFile(null);
      let photos = JSON.parse(window.localStorage.getItem("cache_images")) || [];
      if (url != null) {
        photos.push({ "link": url });
      }
      window.localStorage.setItem("cache_images",  JSON.stringify(photos));
    }
  }, [url, setFile]);

  return (
    <div className='progress-bar' style = {{ width: progress + '%'}}></div>
  );
} 

export default ProgressBar;
