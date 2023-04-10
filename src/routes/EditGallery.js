import React from 'react';
//import './App.css'
//import './EditGallery.scss';
import ImageUploading from 'react-images-uploading';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { useRef, useState, useEffect} from "react";
import axios from '../api/axios';

 
export function EditGallery() {
  
  const [images, setImages] = useState([]);
  const [list, setList] = useState([]);
  const userRef = useRef();
  const [success, setSuccess] = useState(false);
  const maxNumber = 100;
  
  const id = sessionStorage.getItem("event_id");
  
  let token_user;
  
  const loadImages = () => {
    
    if (!window.localStorage.getItem("token")){
      console.log("no autorizado")
      window.location.href = "/home";
      return;
    } else {
      token_user = window.localStorage.getItem("token");
    }

     const params = new URLSearchParams([['event_id', id]]);
                             
     const headers = {'accept': 'application/json',
                               'Access-Control-Allow-Origin': '*',
                               'Access-Control-Allow-Credentials': true,
                               'Access-Control-Allow-Headers': '*',
                               'Authorization': 'Bearer ' + token_user
                             }  
                            
     axios({method: 'get', url: '/organizer/event/images', params: params, headers: headers})
       .then((response) => {
        setList(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
  }
  
  const passImages = () => {
     console.log("lista");   
     console.log(list);   
     for (let i = 0; i < list.length; i++) {
        setImages(images => [...images, list[i].link]);
     console.log("imágenes");   
     console.log(images);   
     }
  
  }
  
  
  useEffect(() => {
    loadImages();
    passImages();
  }, []); 
  
  
  const onChange = (imageList, addUpdateIndex) => {
     
    
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };
  
  
  const onImageUpdate = (image) => {
     
     window.location.href ='/fileLoaderGallery';
     let token_user; 
     const url = sessionStorage.getItem("urls");  
     
     try{    
      const response= axios.put('/organizer/event/images',
                JSON.stringify({ 
                    'event_id': image.event_id,
                    'id': image.id,
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
      console.log("Imágen actualizada");
      setSuccess(true);
    })
    }catch (err) {console.log(err)}
  };
 
 
  const onImageRemove = (image) => {
    try{    
      const response= axios.delete('/organizer/event/images',
                JSON.stringify({ 
                    'event_id': image.event_id,
                    'id': image.id,
                    'link': JSON.parse(image.link)
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
      console.log("Imágen eliminada");
      setSuccess(true);
    })
    }catch (err) {console.log(err)}
  };
  
  const onReturn = () => {
    window.location.href = "/editEvent";
  
  }
 
 
  return (
    <div className="create-event-form">
     
      <h1 className="form-title">Editar galería de imágenes</h1>
   
      <div className="container">
      <ImageUploading
        multiple
        value={list}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (

          <div className="upload__image-wrapper">
            <div className="form-actions">
              <button
                style={isDragging ? { color: 'red' } : undefined}
                onClick={onImageUpload}
                {...dragProps}
              >
                Agregar fotos
              </button>              
              <button onClick={onImageRemoveAll}>Eliminar todas las fotos</button>
            </div>
            <br/>
            {imageList.map((image, index) => (
              <div key={index} className="form-group">
                <img src={image.link} height="160"/>
                <div className="form-actions">
                  <button onClick={() => onImageUpdate(image)}>Actualizar</button>
                  <button onClick={() => onImageRemove(image)}>Eliminar</button>
                  <br/>
                </div>
              </div>
              
            ))}
           <div className="form-actions"> 
            <button onClick={onReturn}>Volver</button>
          </div>  
          </div>
        )}
      </ImageUploading>
      </div>
    </div>
  );
}
export default EditGallery;
