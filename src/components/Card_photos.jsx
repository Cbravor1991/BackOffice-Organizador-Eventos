import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import { api } from '../api/axios';
import Typography from '@mui/material/Typography';

export default function PhotosCard(props) {

  let event_id = JSON.parse(window.localStorage.getItem("cache_edit")).Event.id;

  const deletePublication = async (props) => {
    api.delete('/organizer/event/images', {
      data: {
        "id": props.id,
        "event_id": event_id
      },
    })
      .then((response) => {
        console.log("Imagen eliminada");
     
        let photos = JSON.parse(window.localStorage.getItem("cache_images"));
        console.log(photos);
        photos = photos.filter(photo => photo.link !== props.link);    
        window.localStorage.setItem("cache_images", JSON.stringify(photos));

        props.loadImages()
      })
  }

  const changeCover = async (props) => {
    props.setSelectedCover(props.link)
    try {
      const response = await api.post('organizer/event/cover/pic',
        JSON.stringify({
          "link": props.link, 
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
           {props.link === props.cover ? (
      <CardContent>
        <Typography variant="h6" component="div" sx={{marginLeft: '100px', color: 'black', fontSize: 16, fontWeight: 700, mb: 2 }}>
          Foto de portada
        </Typography>
      </CardContent>
    ) : (
      <CardContent>
        <Typography variant="h6" component="div" sx={{marginLeft: '100px', color: 'white', fontSize: 16, fontWeight: 700, mb: 2 }}>
          ''
        </Typography>
      </CardContent>
    )}
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
