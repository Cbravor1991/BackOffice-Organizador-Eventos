import React from 'react';
import { createTheme } from '@mui/material/styles';
import { Button, ThemeProvider } from '@mui/material';
import { useNavigate } from "react-router-dom";
import axios from '../api/axios';
import { useRef, useState, useEffect} from "react";


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
  
  let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqZWNhc3RpbGxvQGZpLnViYS5hciIsImV4cCI6MTY4MDk3OTIyM30.yh5XPmqTSEO-kjiBRqZyNFt-_cFw91_qbVm-RG6qyiY';
  
  const id = sessionStorage.getItem("event_id");
  
  useEffect(() => {
    if (!sessionStorage.getItem("urls") === null){
      (JSON.parse(sessionStorage.getItem("urls"))).map(url => setUrls(prevUrls => [...prevUrls, url]));
     } 
     }, [])
     
  const handleSubmit = async (e) => {
    e.preventDefault();

   for(let i=0; i<(JSON.parse(sessionStorage.getItem("urls"))).length; i++) {  
    
    //setLink(urls[i])    
          
    try{    
      const response=await axios.post('/event/images/add',
                JSON.stringify({
                    'event_id': id,
                    'link': JSON.parse(sessionStorage.getItem("urls"))[i]
                }),
                {
                    headers: { 'Content-Type': 'application/json',
                               'Access-Control-Allow-Origin': '*',
                               'Access-Control-Allow-Credentials': true,
                               'Access-Control-Allow-Headers': '*',
                               'Authorization': 'Bearer ' + token,
                             }
                 },

            )
      .then((response) => {
      console.log("Imágen cargada");
      setSuccess(true);
    })
    }catch (err) {console.log(err)}
   
   } 
      
  
  }
  
  return (
  
    <>

     {success ? (
                <section style={{ backgroundColor: 'grey' }}>
                    <h1>Fotos cargadas con exito!</h1>
                    <p>
                        <a href="/loadEvent">Volver</a>
                    </p>
                </section>
            ) : (
 
      <ThemeProvider theme={theme}>
       <form onSubmit={handleSubmit}>
 
        <br/>
 
        <label> Carga de imagenes </label>
        
        <br/>
        <br/>
      
        <Button variant="outlined" onClick={() => navigate('/fileLoaderGallery')}> Seleccionar fotos </Button>
        
        <br/>
        <br/>
        
        <button type="submit" titleStyle={{
                    color: '#00BAD4',
                    fontSize: 30,
                    fontStyle: 'italic',
                  }}>Aceptar</button>

       </form> 
      </ThemeProvider>
    )}
    </>

  );
 
} 
export default ImageLoader
