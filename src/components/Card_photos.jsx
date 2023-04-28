import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axios from '../api/axios';
import swal from 'sweetalert2';

export default function PhotosCard(props) {
  console.log(props.link)

  const coverPhoto = async (props) => {


  }


  const deletePublication = async (props) => {
    let token_user;



    if (!window.localStorage.getItem("token")) {
      console.log("no autorizado")
      window.location.href = "/home";
      return;
    } else {
      token_user = window.localStorage.getItem("token");
    }



    console.log('entro')
    const response = axios.delete('/organizer/event/images', {
      data: {
        "id": props.id,
        "event_id": props.event_id
      },
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': '*',
        'Authorization': 'Bearer ' + token_user,
      }
    })
      .then((response) => {
        console.log("Imagen eliminada");
        window.location.href = '/updatePhotoGallery'
      })
  }

  const changeCover = async (props) => {
    let token_user;
    if (!window.localStorage.getItem("token")) {
      console.log("no autorizado")
      window.location.href = "/home";
      return;
    } else {
      token_user = window.localStorage.getItem("token");
    }

    console.log('propiedades')

    console.log(props.id)
    console.log(props.link)
    props.setSelectedCover(props.link)
    let id_event_photo = window.localStorage.getItem("event_id");
    try {
      const response = await axios.post('organizer/event/cover/pic',
        JSON.stringify({
         "id": props.id, 
         "event_id":id_event_photo

        }),
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token_user}`
          }
        }

      );
      console.log(response.data);
    
    } catch (err) {
     
      console.log('fijate hiciste algo mal')

    }



  } 





















return (
  <Card sx={{ maxWidth: 345 }}>
    <CardMedia

      sx={{ height: 200 }}
      image={props.link}
    />
    <CardContent>

    </CardContent>
    <CardActions>
      <Button size="small" onClick={() => { deletePublication(props) }}>Eliminar</Button>
      <Button size="small" onClick={() => changeCover(props)}>Seleccionar como portada</Button>
    </CardActions>
  </Card>
);
}