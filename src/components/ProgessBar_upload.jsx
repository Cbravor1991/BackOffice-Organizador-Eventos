import React, { useEffect } from 'react';
import useStorage from '../hooks/useStorage';
import { api } from '../api/axios';


const ProgressBar = ({ file, setFile,loadImages }) => {

  const { url, progress } = useStorage(file, setFile);

  useEffect(() => {
    if (url) {
      setFile(null);
      let photos = JSON.parse(window.localStorage.getItem("photos_user"));
      const photo = {
        "link": url
      }

      photos.push(photo);
      console.log(typeof photos)
      window.localStorage.setItem("photos_user", JSON.stringify(photos));

      window.localStorage.setItem("photos_user", JSON.stringify(photos));

      let props = sessionStorage.getItem("publication_data")

      let id_event = (JSON.parse(props)).id

      try {
        api.post('/organizer/event/images',
          JSON.stringify({
            'event_id': id_event,
            'link': url
          }),
        )
          .then((response) => {
            loadImages();
          })
      } catch (err) { console.log(err) }
    }
  }, [url, setFile]);

  return (
    <div className='progress-bar' style={{ width: progress + '%' }}></div>
  );
}

export default ProgressBar;