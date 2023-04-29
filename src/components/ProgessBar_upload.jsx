import React, { useEffect } from 'react';
import useStorage from '../hooks/useStorage';
import axios from '../api/axios';


const ProgressBar = ({ file, setFile }) => {
  
  const{url, progress} = useStorage(file, setFile);
 
  useEffect(() => {
    if (url) {
      setFile(null);
      let photos = JSON.parse(window.localStorage.getItem("photos_user"));
      const photo = {
        "link": url
      }
      
     
      photos.push(photo);
      console.log(typeof photos)
      window.localStorage.setItem("photos_user",  JSON.stringify(photos));

    window.localStorage.setItem("photos_user", JSON.stringify(photos));

     let props = sessionStorage.getItem("publication_data")

     let id_event = (JSON.parse(props)).id

      let token_user=window.localStorage.getItem("token"); 

      console.log(id_event)
  
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
        window.location.href = '/editEvent';
    
  
     })
     }catch (err) {console.log(err)}

      







  
      
    }
  }, [url, setFile]);


  
 

  return (
    
    <div className='progress-bar' style = {{ width: progress + '%'}}></div>
    
    
  );
} 

export default ProgressBar;