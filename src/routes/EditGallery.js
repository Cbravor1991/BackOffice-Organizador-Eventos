import React from 'react';
//import './App.css'
//import './EditGallery.scss';
import ImageUploading from 'react-images-uploading';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { useRef, useState, useEffect} from "react";
import axios from '../api/axios';
import swal from "sweetalert2";

 
export function EditGallery() {
  
  const [images, setImages] = useState([]);
  const [list, setList] = useState([]);
  const userRef = useRef();
  const [success, setSuccess] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [image, setImage] = useState([]);
  const maxNumber = 100;
  
  
  const [link, setLink] = useState('');
  const [urls, setUrls] = useState(['']);
  
  const id = sessionStorage.getItem("event_id");
  
  useEffect(()=>{
     setUpdated(window.localStorage.getItem("foto_actualizada"));
  }, [])   
  
  let token_user = window.localStorage.getItem("token");
  
  
  /*if (!window.localStorage.getItem("token")){
      console.log("no autorizado")
      window.location.href = "/home";
      return;
    } else {
      token_user = window.localStorage.getItem("token");
    }*/

  
  console.log("updated");
  console.log(updated);
  
  
  const loadImages = () => {
    setUpdated(window.localStorage.getItem("foto_actualizada"))
    
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
    
     
  if (updated===true) {
     console.log("Hay foto actualizada");
     console.log(image); 
     imageUpdate();
     window.localStorage.setItem("foto_actualizada", false);
     setUpdated(false);
   }
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
    //setImages(imageList);
    //loadImages();
  };
  
  
  const onImageUpdate = (image) => {
     window.localStorage.setItem("foto_actualizada", false)
     setImage(image);
      window.location.href ='/fileLoaderGallery';
  }
  
  const imageUpdate = () => {
     
     token_user=window.localStorage.getItem("token"); 
     const url = sessionStorage.getItem("urls");  
     console.log("Nueva url");
     console.log(url);
     
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
      loadImages();
    })
    }catch (err) {console.log(err)}
  };
 
 
  const onImageRemove = (image) => {   
  
    console.log("Prepara para borrar");
    swal.fire({
      title: "Deseas eliminar la imagen?",
      icon: "success",
      customClass: {
        container: 'spotify-modal-container',
        popup: 'spotify-modal-popup',
        title: 'spotify-modal-title',
        content: 'spotify-modal-content',
        confirmButton: 'spotify-modal-button',
        cancelButton: 'spotify-modal-button'
      },
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Eliminar imagen"
    }).then(function(result) {
      if (result.isConfirmed) {
        deleteImage(image);
      } else if (result.isDismissed) {
        window.location.href = "http://localhost:3000/editGallery";
      }
    });
    
  };
  
  
  
  const deleteImage = (image) => {
  
    token_user = window.localStorage.getItem("token");
    console.log(token_user);
    console.log(image.id);
    console.log(image.event_id);
   
    try{    
    
      const data=JSON.stringify({ 
                    'id': image.id,               
                    'event_id': image.event_id,
                })
      const headers =  {
                     'Content-Type': 'application/json',
                               'Access-Control-Allow-Origin': '*',
                               'Access-Control-Allow-Credentials': true,
                               'Access-Control-Allow-Headers': '*',
                               'Authorization': 'Bearer ' + token_user,
                             
                 }        
    /*  const response = axios.delete('/organizer/event/images',
                JSON.stringify({ 
                    'id': image.id,               
                    'event_id': image.event_id,
                }),
                {
                    headers: { 'Content-Type': 'application/json',
                               'Access-Control-Allow-Origin': '*',
                               'Access-Control-Allow-Credentials': true,
                               'Access-Control-Allow-Headers': '*',
                               'Authorization': 'Bearer ' + token_user,
                             }
                 },

            )*/
      const response = axios({method: 'delete', url: '/organizer/event/images',
                data: data,
                
               headers: headers,
                 

            })      
            
      .then((response) => {
      console.log("Imágen eliminada");
      setSuccess(true);
      loadImages();
    })
    }catch (err) {console.log(err)}
          
   }
   
      
   const onReturn = () => {
    window.location.href = "/editEvent";
  }
  
  const onImageUpload = () => {
     window.location.href = "/ImageLoader";
     
  }
  
 
  return (
    <div className="create-event-form">
     
      <h1 className="form-title">Editar galería de imágenes</h1>
   
      <div className="container">
      <ImageUploading
        multiple
        value={list}
        //onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({
          imageList,
          //onImageUpload,
          onImageRemoveAll,
          //onImageUpdate,
          //onImageRemove,
          isDragging,
          dragProps,
        }) => (

          <div className="upload__image-wrapper">
            <div className="form-actions">
              <button
                style={isDragging ? { color: 'red' } : undefined}
                 onClick={() => {onImageUpload()}}
                {...dragProps}
              >
                Agregar fotos
              </button>              
             
            </div>
            <br/>
            {imageList.map((image, index) => (
              <div key={index} className="form-group">
                <img src={image.link} height="160"/>
                <div className="form-actions">


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
