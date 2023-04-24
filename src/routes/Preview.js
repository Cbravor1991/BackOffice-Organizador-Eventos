import * as React from 'react';
import { useRef, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axios from '../api/axios';
import swal from 'sweetalert2';
import Navbar from '../components/NavBar';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import ProgressBar from '../components/ProgressBar';
import { Grid } from '@mui/material';


const Preview = () => {

 const [error, setError] = useState(false);
 const [errMsg, setErrMsg] = useState('');
 const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
 
 let props = JSON.parse(window.localStorage.getItem("event"));
 
 console.log(props);

 const stringDate = new Date(props.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
 
 const [url, setUrl] = useState('');
 const [eventId, setEventId] = useState(null);

 let token_user=window.localStorage.getItem("token");
 
 useEffect(() => {
   console.log(props.description);
   const rawContent = JSON.parse(props.description);
   console.log(rawContent);
   const contentState = convertFromRaw(rawContent);
   console.log(contentState);
   setEditorState (EditorState.createWithContent(contentState));  
   console.log(editorState);  
   
   setUrl(window.localStorage.getItem('url')); 
   console.log(url);
 }, []);

  const saveImages = async () => {
  
      let photos = JSON.parse(window.localStorage.getItem("photos_user"));
      photos.push(url);
      window.localStorage.setItem("photos_user", JSON.stringify(photos));

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
       setUrl(window.localStorage.getItem(''));
       window.location.href = "/showEvents"
     })
     }catch (err) {console.log(err)}
  }
  
 const handleSubmitEvent = async (e) => {
    e.preventDefault();
    let photos = [];

    window.localStorage.setItem("photos_user", JSON.stringify(photos));

    if (!window.localStorage.getItem("token")) {
      console.log("no autorizado")
      window.location.href = "/home";
      return;
    } else {
      token_user = window.localStorage.getItem("token");
    }

    if (!window.localStorage.getItem("token")) {
      console.log("no autorizado")
      window.location.href = "/home";
      return;
    } else {
      token_user = window.localStorage.getItem("token");
    }

      try {
        const response = await axios.post('organizer/event',
          JSON.stringify(props),
          {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
              'Access-Control-Allow-Headers': '*',
              Authorization: `Bearer ${token_user}`
            }
          }

        ).then((response) => {window.localStorage.setItem("event_id", response.data.id);
          setEventId(response.data.id);
          saveImages();
          console.log(response.status); 
        })
      } catch (err) {
        setError(true)
        if (!err?.response) {
          setErrMsg('El servidor no responde');
        } else if (err.response?.status === 401) {
          setErrMsg('Contraseña o usuario incorrecto');
        } else if (err.response?.status === 402) {
          setErrMsg('No tiene autorización');
        } else {
          token_user = window.localStorage.getItem("token");
        }

      }
     
  }


 return (
 
  <Box sx={{ mb: 4, justifyContent: 'center' }}>
      <Navbar />

       <Typography variant="h5" component="div" sx={{ marginTop: '10px', color: 'black', fontSize: 16, fontWeight: 700, mb: 2, display: 'flex', justifyContent: 'center' }}>
            Crear evento
          </Typography>
          <Typography variant="h6" component="div" sx={{ fontSize: 14, fontWeight: 700, mb: 2, display: 'flex', justifyContent: 'center' }}>
            Confirme los datos del evento
          </Typography>

      <Grid style={{ display: 'flex', justifyContent: 'center' }}>
       <Card variant="outlined" sx={{ border:'2px solid black', borderRadius: 2, backgroundColor: '#fff', color: 'black',
                                      justifyContent: 'center', width: '700px', height: '1000px'}}>
        <CardContent sx={{ pb: 2, justifyContent: 'center' }}>
                    
          <img src={url} alt="preview" height="180" style={{ marginTop: '20px', marginLeft: '200px', display: 'flex', justifyContent: 'center' }} />
          
          <Typography variant="h6" component="div" sx={{ marginTop: '20px', fontSize: 16, fontWeight: 700, mb: 1, display: 'flex', justifyContent: 'center' }}>
            {props.category}
          </Typography>
          <Typography variant="h5" component="div" sx={{ fontSize: 20, fontWeight: 700, mb: 1, display: 'flex', justifyContent: 'center' }}>
            {props.title}
          </Typography>
          <Typography color="textSecondary" sx={{ fontSize: 14, fontWeight: 400, color: '##1286f7', mb: 1, display: 'flex', justifyContent: 'center' }}>
            {stringDate}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 14, fontWeight: 400, mb: 1, display: 'flex', justifyContent: 'center' }}>
            {props.ubication.direction}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 14, fontWeight: 400, mb: 1, display: 'flex', justifyContent: 'center' }}>
            Capacidad: {props.capacity}
          </Typography>

          <Typography variant="h6" component="div" sx={{ marginTop: '20px', fontSize: 14, fontWeight: 700, mb: 2, display: 'flex', justifyContent: 'center' }}>
            Descripción
          </Typography>

          <Typography variant="body2" sx={{ fontSize: 14, fontWeight: 400, mb: 1, display: 'flex', justifyContent: 'center' }}>
            {editorState.getCurrentContent().getPlainText()}
          </Typography>
          
          <Typography variant="h6" component="div" sx={{ marginTop: '20px', fontSize: 14, fontWeight: 700, mb: 2, display: 'flex', justifyContent: 'center' }}>
            Agenda
          </Typography>
          
          {props.agenda.map(function (item, key) {
            return (
              <div>
                <Card sx={{ border:'0.5px solid grey', borderRadius: 2, backgroundColor: '#fff', color: 'black'}}>
                  <Typography variant="body2" sx={{ fontSize: 14, fontWeight: 400, mb: 1, display: 'flex', justifyContent: 'center' }}>
                    {item.time} : {item.description} 
                  </Typography>
                </Card>
              </div>
            )
          })}
         
          <Typography variant="h6" component="div" sx={{ marginTop: '20px', fontSize: 14, fontWeight: 700, mb: 2, display: 'flex', justifyContent: 'center' }}>
            Preguntas frecuentes
          </Typography>
          
          {props.faqs.map(function (item, key) {
            return (
              <div>
                <Card sx={{ border:'0.5px solid grey', borderRadius: 2, backgroundColor: '#fff', color: 'black'}}>
                  <Typography variant="body2" sx={{ fontSize: 14, fontWeight: 800, mb: 1, display: 'flex', justifyContent: 'center' }}>
                    {item.question}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: 14, fontWeight: 400, mb: 1, display: 'flex', justifyContent: 'center' }}>
                    {item.response}
                  </Typography>
                </Card>
              </div>
              
            )})}

        </CardContent>
        
        <CardActions sx={{ display: 'flex', justifyContent: 'center', pt: 0 }}>
          <Button onClick={handleSubmitEvent} sx={{ fontFamily: "'Circular Std', Arial, sans-serif", fontSize: 14, fontWeight: 700, justifyContent: 'center',
           color: '#fff', backgroundColor: '#1286f7', borderRadius: 2, px: 2, py: 1, mr: 1, '&:hover': { backgroundColor: '#1286f7' } }}>
            Aceptar
          </Button>
          <Button onClick={() => {window.history.back()}} sx={{ fontFamily: "'Circular Std', Arial, sans-serif", justifyContent: 'center',
           fontSize: 14, fontWeight: 700, color: '#fff', backgroundColor: '#1286f7', borderRadius: 2, px: 2, py: 1, '&:hover': { backgroundColor: '#1c1c1c' } }}>
            Volver
          </Button>
        </CardActions>
       </Card>
      </Grid>
      
    </Box>

 )
}

export default Preview

