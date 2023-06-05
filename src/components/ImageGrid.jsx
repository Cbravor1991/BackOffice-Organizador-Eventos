import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';

const ImageGrid = ({ setCover, cover }) => {
  const [deleteCount, setDeleteCount] = useState(0);

  const deletePicture = async (link) => {
    let photos = JSON.parse(window.localStorage.getItem("cache_images"));
    console.log(photos);
    
    photos = photos.filter(photo => photo.link !== link);
    
    // Guarda el nuevo array en el localStorage
    window.localStorage.setItem("cache_images", JSON.stringify(photos));
    setDeleteCount(deleteCount + 1);
    if(window.localStorage.getItem("cache_cover") == link){
      window.localStorage.setItem("cache_cover", null)
    }
  }

  const changeCover = async (link) => {
    setCover(link)
    window.localStorage.setItem('cache_cover', link)
  }

  let photos = JSON.parse(window.localStorage.getItem("cache_images"));
  if (!photos) {
    return null;
  }

  return (
    <div className="img-grid">
      {photos.map(item => {
        return (
          <Card key={item.link} sx={{ maxWidth: 345 }}>
            {item.link === cover ? (
              <CardContent>
                <Typography variant="h6" component="div" sx={{color: 'black', fontSize: 16, fontWeight: 700, mb: 2 }}>
                  Foto de portada
                </Typography>
              </CardContent>
            ) : (
              <CardContent>
                <Typography variant="h6" component="div" sx={{ marginLeft: '100px', color: 'white', fontSize: 16, fontWeight: 700, mb: 2 }}>
                  ''
                </Typography>
              </CardContent>
            )}
            <CardMedia sx={{ height: 200 }} image={item.link} />
            <CardActions>
              <Button onClick={() => deletePicture(item.link)} size="small">Eliminar</Button>
              <Button onClick={() => changeCover(item.link)} size="small">
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
