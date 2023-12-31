import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import swal from 'sweetalert2';
import axios from '../api/axios';
import { WindowSharp } from '@mui/icons-material';
import { useEffect, useState } from 'react';

const DELETE_PROPERTY_URL = '/event/delete';


export function Cards(props) {


 const [image, setImage] = useState([]); 


 const update = async (props) => {
  console.log("probar")
  sessionStorage.setItem("publication_data", JSON.stringify(props));
  window.location.href="/editEvent/"


 }

 const loadImages = () => {
  
    let token_user;  
    if (!window.localStorage.getItem("token")){
      console.log("no autorizado")
      window.location.href = "/home";
      return;
    } else {
      token_user = window.localStorage.getItem("token");
    }

     const params = new URLSearchParams([['event_id', props.id]]);
                             
     const headers = {'accept': 'application/json',
                               'Access-Control-Allow-Origin': '*',
                               'Access-Control-Allow-Credentials': true,
                               'Access-Control-Allow-Headers': '*',
                               'Authorization': 'Bearer ' + token_user
                             }  
                            
    axios({method: 'get', url: '/organizer/event/images', params: params, headers: headers})
       .then((response) => {
        setImage((response.data)[0]); 
        console.log("image");   
        console.log((response.data)[0]);    
    })
    .catch((error) => {
      console.log(error);
    })
   };


 const deleteEvent = async (props) => {

  let token_user;
      
    if (!window.localStorage.getItem("token")){
      console.log("no autorizado")
      window.location.href = "/home";
      return;
  } else {
    token_user = window.localStorage.getItem("token");
  }

  const params = {event_id: props.id};

   swal.fire({
    title: "Confirmar",
    text: "¿Confirmas que deseas borrar el evento",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: 'Si, borrar!',
    cancelButtonText: 'No',
    dangerMode: true}).then(function(result) {

      if (result['isConfirmed']) {
              
        var options = {
          method: 'DELETE',
          url: '/event/delete',
          params: {event_id: props.id},
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token_user}`
          }
        };
        
        axios.request(options).then(function (response) {
          console.log(response.data);
          window.location.href="/showEvents"
        }).catch(function (error) {
          console.error(error);
        });      
      }    
    })
   } 

  const stringDate = new Date(props.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
  
  
  useEffect(() => {
    loadImages();
  }, []);
  
  return (
    <Box sx={{ mb: 4 }}>
      <Card variant="outlined" sx={{ borderRadius: 2, backgroundColor: '#282828', color: '#fff' }}>
        <CardContent sx={{ pb: 2 }}>
          <img src={image.link} alt="preview" height="150" />
          <Typography variant="h6" component="div" sx={{ fontSize: 16, fontWeight: 700, mb: 1 }}>
            {props.title}
          </Typography>
          <Typography variant="h5" component="div" sx={{ fontSize: 20, fontWeight: 700, mb: 1 }}>
            {props.category}
          </Typography>
          <Typography color="textSecondary" sx={{ fontSize: 14, fontWeight: 400, color: '##1286f7', mb: 1 }}>
            {stringDate}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 14, fontWeight: 400, mb: 1 }}>
            {props.direction}
          </Typography>
        </CardContent>
        <CardActions sx={{ display: 'flex', justifyContent: 'space-between', pt: 0 }}>
          <Button onClick={()=>{update(props)}} sx={{ fontFamily: "'Circular Std', Arial, sans-serif", fontSize: 14, fontWeight: 700, color: '#fff', backgroundColor: '##1286f7', borderRadius: 2, px: 2, py: 1, mr: 1, '&:hover': { backgroundColor: '#1286f7' } }}>
            Editar Evento
          </Button>
          <Button onClick={() => {deleteEvent(props)}} sx={{ fontFamily: "'Circular Std', Arial, sans-serif", fontSize: 14, fontWeight: 700, color: '#fff', backgroundColor: '#191414', borderRadius: 2, px: 2, py: 1, '&:hover': { backgroundColor: '#1c1c1c' } }}>
            Eliminar Evento
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
} export default Cards;
