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

const DELETE_PROPERTY_URL = '/event/delete';


const update = async (props) => {
  console.log("probar")
  sessionStorage.setItem("publication_data", JSON.stringify(props));
  window.location.href="/editEvent/"


}

const deleteEvent = async (props) => {

  let token_user;
  window.localStorage.setItem("token", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjaHJpc3RpYW4uZml1YmFAZ21haWwuY29tIiwiZXhwIjoxNjgxMDc2MDQyfQ.Wh-28x-wKNO3P6QJ3rt2wq8fLb4C6XSB4TJF3NFPRDE' )

    

    
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
    text: "¿Confirmas que deseas borrar la propiedad?",
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
      
    
    }
    )

}



export default function Cards(props) {


  


  const stringDate = new Date(props.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
  return (
    <Box sx={{ mb: 4 }}>
      <Card variant="outlined" sx={{ borderRadius: 2, backgroundColor: '#282828', color: '#fff' }}>
        <CardContent sx={{ pb: 2 }}>
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
          <Button onClick={() => {}} sx={{ fontFamily: "'Circular Std', Arial, sans-serif", fontSize: 14, fontWeight: 700, color: '#fff', backgroundColor: '#191414', borderRadius: 2, px: 2, py: 1, '&:hover': { backgroundColor: '#1c1c1c' } }}>
            Ver evento
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
