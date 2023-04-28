
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axios from '../api/axios';
import swal from 'sweetalert2';
import React, { useState } from 'react';
import { set } from 'immutable';



const ImageGrid = ({setCover, cover}) => {
 
 
  let photos;
  if (!window.localStorage.getItem("photos_user")) {
    photos = ["hola"]
    return;
  } else {
    photos = JSON.parse(window.localStorage.getItem("photos_user"));

  }


 


 
  


return (
  <div className="img-grid">
    {photos.map(function(url, index) {
      return (
<Card sx={{ maxWidth: 345 }}>
  <CardMedia sx={{ height: 200 }} image={url} />
  {url === cover && (
    <CardContent>
      <Typography variant="h6" component="div" sx={{ color: 'black', fontSize: 16, fontWeight: 700, mb: 2 }}>
        Foto de portada
      </Typography>
    </CardContent>
  )}
  <CardActions>
    <Button size="small">Eliminar</Button>
    <Button onClick={() => setCover(url)} size="small">
      Seleccionar como portada
    </Button>
  </CardActions>
</Card>





      );
    })}
  </div>
);
}

export default ImageGrid;

