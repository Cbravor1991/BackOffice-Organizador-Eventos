import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import { api } from '../api/axios';

export default function PhotosCard(props) {

  let event_id = JSON.parse(sessionStorage.getItem("publication_data")).id;

  const deletePublication = async (props) => {
    api.delete('/organizer/event/images', {
      data: {
        "id": props.id,
        "event_id": event_id
      },
    })
      .then((response) => {
        console.log("Imagen eliminada");
        window.location.href = '/editEvent'
      })
  }

  const changeCover = async (props) => {
    props.setSelectedCover(props.link)
    try {
      const response = await api.post('organizer/event/cover/pic',
        JSON.stringify({
          "id": props.id,
          "event_id": props.event_id
        }),
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