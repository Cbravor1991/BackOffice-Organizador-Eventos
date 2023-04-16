import React, { useEffect } from 'react';
import useStorage from '../hooks/useStorage';
import axios from '../api/axios';


const ProgressBar = ({ file, setFile }) => {
  
  const{url, progress} = useStorage(file, setFile);
 
  useEffect(() => {
    if (url) {
      setFile(null);
      console.log('te llamo una vez');
      console.log(typeof url);
      let photos = JSON.parse(window.localStorage.getItem("photos_user"));
      photos.push(url);
      window.localStorage.setItem("photos_user", JSON.stringify(photos));

      let token_user=window.localStorage.getItem("token"); 
      let id_event = sessionStorage.getItem("event_id"); 
      
      try{    
       const response= axios.post('/organizer/event/images',
                 JSON.stringify({ 
                     'event_id': id_event,
                     'link': url
                 }),
                 {
                     headers: { 'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Credentials': true,
                                'Access-Control-Allow-Headers': '*',
                                'Authorization': 'Bearer ' + token_user,
                              }
                  },
 
             )
       .then((response) => {
       console.log("Imágen cargada");
     })
     }catch (err) {console.log(err)}
    
    }
  }, [url, setFile]);
 

  return (
    <div className='progress-bar' style = {{ width: progress + '%'}}></div>
  );
} 

export default ProgressBar;