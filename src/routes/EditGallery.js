import React from 'react';
//import './App.css'
import ImageUploading from 'react-images-uploading';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRef, useState, useEffect} from "react";
import axios from '../api/axios';

 
export function EditGallery() {
  
  const [images, setImages] = useState([]);
  const maxNumber = 100;
  
  //const id = sessionStorage.getItem("event_id");
  const id = 12;
  
  const loadImages = () => {
    
    let token_user='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqZWNhc3RpbGxvQGZpLnViYS5hciIsImV4cCI6MTY4MTAxMjY3OX0.jfY9a_lN2xARrOEerd4cZgxkxDiw4dkHCPrQUhCOCf0';
    //window.localStorage.setItem("token", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqZWNhc3RpbGxvQGZpLnViYS5hciIsImV4cCI6MTY4MTAxMjY3OX0.jfY9a_lN2xARrOEerd4cZgxkxDiw4dkHCPrQUhCOCf0');

   /* if (!window.localStorage.getItem("token")){
      console.log("no autorizado")
      window.location.href = "/home";
      return;
    } else {
      token_user = window.localStorage.getItem("token");
    }*/

    axios.get('/event/images', 
         JSON.stringify({
                    'event_id': id
                  }),
                  {
                    headers: { 'Content-Type': 'application/json',
                               'Access-Control-Allow-Origin': '*',
                               'Access-Control-Allow-Credentials': true,
                               'Access-Control-Allow-Headers': '*',
                               'Authorization': 'Bearer ' + token_user,
                             }
                 },)
    .then((response) => {
      setImages(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
  }
  
  
  useEffect(() => {
    loadImages();
  }, []); 
  
  
  const onChange = (imageList, addUpdateIndex) => {
    
    
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };
 
 
  return (
    <div className="App">
     
      <h1>Therichpost.com</h1>
     
   
      <div className="container">
      <ImageUploading
        multiple
        value={images}
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
            <div className="mainbtndiv">
              <button className="btn btn-primary"
                style={isDragging ? { color: 'red' } : undefined}
                onClick={onImageUpload}
                {...dragProps}
              >
                Haga click o arrastre aquí
              </button>
              
              <button className="btn btn-danger" onClick={onImageRemoveAll}>Eliminar todas las imágenes</button>
            </div>
            {imageList.map((image, index) => (
              <div key={index} className="image-item mt-5 mb-5 mr-5">
                <img src={image['data_url']} />
                <div className="image-item__btn-wrapper">
                  <button className="btn btn-primary" onClick={() => onImageUpdate(index)}>Actualizar</button>
                  <button className="btn btn-danger" onClick={() => onImageRemove(index)}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ImageUploading>
      </div>
    </div>
  );
}
export default EditGallery;
