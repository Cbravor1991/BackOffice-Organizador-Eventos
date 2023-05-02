import * as React from 'react';
import Box from '@mui/material/Box';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { Backdrop, CircularProgress } from '@mui/material';
import Typography from '@mui/material/Typography';
import { api } from '../api/axios';
import Navbar from '../components/NavBar';
import { Grid } from '@mui/material';
import AgendaDisplay from '../components/AgendaDisplay';
import FaqsDisplay from '../components/FaqsDisplay';
import Paper from '@mui/material/Paper';
import BasicInfoDisplay from '../components/BasicInfoDisplay';
import ImageDisplay from '../components/ImageDisplay';
import DescriptionDisplay from '../components/DescriptionDisplay';

const Preview = () => {
  let event = JSON.parse(window.localStorage.getItem("cache_event"));
  let cover = window.localStorage.getItem("cache_cover");
  const stringDate = new Date(event.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
  const [loading, setLoading] = React.useState(false);

  const handleSubmitEvent = async (e) => {
    setLoading(true);
    e.preventDefault();
    await api
      .post('organizer/event', event)
      .then(async(response) => {
        api.post(
          'organizer/event/cover/pic',
          JSON.stringify({
            "link": cover, 
            "event_id": response.data.id
          })
        );
      })
      .then(() => {
        window.localStorage.setItem("cache_event", null);
        window.localStorage.setItem("cache_cover", null);      
        window.location.href = '/eventList';
      })
  }


  return (

    <Box sx={{ mb: 4, justifyContent: 'center' }}>
    
      <Navbar />

      <Typography variant="h5" component="div" sx={{ marginTop: '10px', color: 'black', fontSize: 16, fontWeight: 700, mb: 2, display: 'flex', justifyContent: 'center' }}>
        Confirme los datos del evento
      </Typography>

      <Grid style={{ display: 'flex', justifyContent: 'center' }}>
        <Paper elevation={5} sx={{width: '600px', background: '#fff'}}>

          <Typography variant="h5" component="div" sx={{ padding: 2, fontSize: 30, fontWeight: 70, display: 'flex', justifyContent: 'center' }}>
            {event.title}
          </Typography>

          <CardContent sx={{ pb: 2, justifyContent: 'center' }}>

            <ImageDisplay images={event.images} />
            <BasicInfoDisplay event={event} stringDate={stringDate}/>
            <DescriptionDisplay description={JSON.parse(event.description)}/>
            <AgendaDisplay agenda={event.agenda} />
            <FaqsDisplay faqs={event.faqs} />

          </CardContent>

          <CardActions sx={{ display: 'flex', justifyContent: 'center', pt: 0 }}>
            <Button onClick={handleSubmitEvent} sx={{
              fontFamily: "'Circular Std', Arial, sans-serif", fontSize: 14, fontWeight: 700, justifyContent: 'center',
              color: '#fff', backgroundColor: '#1286f7', borderRadius: 2, px: 2, py: 1, mr: 1, '&:hover': { backgroundColor: '#1286f7' }
            }}>
              Aceptar
            </Button>
            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={loading}
              onClick={() => setLoading(false)}
              >
              <CircularProgress color="inherit" />
            </Backdrop>

            <Button onClick={() => { window.history.back() }} sx={{
              fontFamily: "'Circular Std', Arial, sans-serif", justifyContent: 'center',
              fontSize: 14, fontWeight: 700, color: '#fff', backgroundColor: '#1286f7', borderRadius: 2, px: 2, py: 1, '&:hover': { backgroundColor: '#1c1c1c' }
            }}>
              Volver
            </Button>
          </CardActions>
        </Paper>
      </Grid>

    </Box>

  )
}

export default Preview

