import { Grid, Button, InputLabel } from '@mui/material';
import { useState } from 'react';

export default function BasicInfoDisplay({ images, cover }) {
  const [index, setIndex] = useState(0);

  function goToPrevSlide () {
    setIndex(Math.max(0, index - 1) % images.length);
  }
  
  function goToNextSlide ()  {
    setIndex((index + 1) % images.length);
  }
  
  return(
    // style={{display: 'flex', direction: 'row', justifyItems: 'space-between'
    <Grid container sx={{display: 'flex', justifyContent: 'center'}} spacing={0}>
      <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }} >
        <Button onClick={goToPrevSlide} sx={{height: '150px'}}>&#10094;</Button>
      </Grid>

      <Grid item>
        <img src={images[index].link} width = "300" alt='Foto'/>
        <InputLabel>{index + 1} / {images.length}</InputLabel>
      </Grid>

      <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }} >
        <Button onClick={goToNextSlide} sx={{height: '150px'}}>&#10095;</Button>
      </Grid>
    </Grid>

  );
}