import React, { useEffect } from 'react';
import useStorage from '../hooks/useStorage';
import axios from '../api/axios';


const ProgressBar = ({ url, progress }) => {
  
  //const{url, progress} = useStorage(file, setFile);
 
  useEffect(() => {
    if (url) {
      //setFile(null);
      let photos = JSON.parse(window.localStorage.getItem("photos_user"));
      photos.push(url);
      window.localStorage.setItem("photos_user", JSON.stringify(photos));

      let token_user=window.localStorage.getItem("token"); 
      let id_event = window.localStorage.getItem("event_id"); 
      console.log('aca')
      console.log(url);
      console.log(id_event);
      
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
    
  }, [url, progress]);


  
 

  return (
    
    <div className='progress-bar' style = {{ width: progress + '%'}}></div>
    
    
  );
} 

export default ProgressBar;
