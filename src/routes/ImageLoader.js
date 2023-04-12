import React from 'react';
import { createTheme } from '@mui/material/styles';
import { Button, ThemeProvider } from '@mui/material';
import { useNavigate } from "react-router-dom";
import axios from '../api/axios';
import './ImageLoader.scss'
import { useRef, useState, useEffect} from "react";
import swal from "sweetalert2";


const theme = createTheme({
    palette: {
        primary: {
          main: '#dc9c13',
        },
        secondary:{
            main: '#e9bc65',
        } 
      },
}); 


const ImageLoader = () => {

  const navigate = useNavigate();
  
  const [link, setLink] = useState('');
  const [urls, setUrls] = useState(['']);
  const userRef = useRef();
  const [success, setSuccess] = useState(false);
  
 // let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqZWNhc3RpbGxvQGZpLnViYS5hciIsImV4cCI6MTY4MTA4Mzk0OH0.1lfXwumeCg1OGgP6lGdJNd4SeEwqbRlhNjP0wWyo_Lk';
  
  let token_user; 
  const id = sessionStorage.getItem("event_id");
  
  if (!window.localStorage.getItem("token")){
      console.log("no autorizado")
      window.location.href = "/home";
      return;
    } else {
      token_user = window.localStorage.getItem("token");
    }
  
  /*useEffect(() => {
    if (!sessionStorage.getItem("urls") === null){
      (JSON.parse(sessionStorage.getItem("urls"))).map(url => setUrls(prevUrls => [...prevUrls, url]));
     } 
     }, [])*/
     
  const handleSubmit = async (e) => {
    e.preventDefault();

    for(let i=0; i<(JSON.parse(sessionStorage.getItem("urls"))).length; i++) {  
    
    //setLink(urls[i])    
          
    try{    
      const response=await axios.post('/organizer/event/images',
                JSON.stringify({
                    'event_id': id,
                    'link': JSON.parse(sessionStorage.getItem("urls"))[i]
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
      setSuccess(true);
      navigate('/editGallery')
      
      
    })
    }catch (err) {console.log(err)}
   
   } 
      
  
  }
  
  return (
  
    <>

     {success ? (
                /*<section style={{ backgroundColor: 'grey' }}>
                    <h1>Fotos cargadas con exito!</h1>
                    <p>
                        <a href="/editGallery">Volver</a>
                    </p>
                    
                    
                </section>*/
                window.location.href = "http://localhost:3000/imageLoader"
            ) : (
 
      <ThemeProvider theme={theme}>
       <form onSubmit={handleSubmit}>
 
        <br/>
 
        <label> Carga de imagenes </label>
        
        <br/>
        <br/>
      
        <Button variant="outlined" onClick={() => navigate('/fileLoaderGallery')}> Cargar </Button>
        
        <br/>
        <br/>
        
        <button type="submit" titleStyle={{
                    color: '#00BAD4',
                    fontSize: 30,
                    fontStyle: 'italic',
                  }}>Aceptar</button>

       <button type="submit" titleStyle={{
                    color: '#00BAD4',
                    fontSize: 30,
                    fontStyle: 'italic',
                  }}>Cancelar</button>

       </form> 
      </ThemeProvider>
    )}
    </>

  );
 
} 
export default ImageLoader
