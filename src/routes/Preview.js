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
import mapboxgl from 'mapbox-gl';


const Preview = () => {
  let event = JSON.parse(window.localStorage.getItem("cache_event"));
  let cover = window.localStorage.getItem("cache_cover");
  console.log(cover);
  const stringDate = new Date(event.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
  const [loading, setLoading] = React.useState(false);
  const [images, setImages] = React.useState(event.images); 
  const mapContainer = React.useRef(null);
  const [latitude, setLatitude] = React.useState(event ? event.ubication.latitude : -34.599722222222);
  const [longitude, setLongitude] = React.useState(event ? event.ubication.longitude : -58.381944444444);
  

  const sortImages = () => {
   
     let originalImages = images;
     
     console.log(images);
     
     const sortedImages = [
    ...originalImages.filter(({link}) => link === cover),
    ...originalImages.filter(({link}) => link !== cover)
    ];
    
    console.log(sortedImages);
    setImages(sortedImages);
     
   }


  React.useEffect(() => {
    sortImages();
  }, []);


  React.useEffect(() => {
   
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [longitude, latitude],
      zoom: 14,
      attributionControl: false
    });

    const marker = new mapboxgl.Marker({
         color: "red",
         offset: [25, -330]
      }).setLngLat([longitude, latitude]).addTo(map);
   
    return () => map.remove();
  }, []);


  const handleSubmitPublished = async (e) => {
    setLoading(true);
    e.preventDefault();
    event.state = "published"
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


  const handleSubmitDraft = async (e) => {
    setLoading(true);
    e.preventDefault();
    event.state = "draft";
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

            <ImageDisplay images={images} />
            <BasicInfoDisplay event={event} stringDate={stringDate}/>
            <DescriptionDisplay description={JSON.parse(event.description)}/>
            <AgendaDisplay agenda={event.agenda} />
                        
            <Grid item sx={{ width: '50%', height: '300px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                  <div ref={mapContainer} className="map-container"
                    style={{ width: 400, height: 250, justifyContent: 'center', marginTop: '10px', marginBotton: '5px', marginLeft: '250px', marginRight: '10px' }}
                  />
                </Box>
            </Grid>
            
            <FaqsDisplay faqs={event.faqs} />

          </CardContent>

          <CardActions sx={{ display: 'flex', justifyContent: 'center', pt: 0 }}>
            <Button onClick={handleSubmitDraft} sx={{
              fontFamily: "'Circular Std', Arial, sans-serif", fontSize: 14, fontWeight: 700, justifyContent: 'center',
              color: '#fff', backgroundColor: '#1286f7', borderRadius: 2, px: 2, py: 1, mr: 1, '&:hover': { backgroundColor: '#1286f7' }
            }}>
              Guardar borrador
            </Button>
            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={loading}
              onClick={() => setLoading(false)}
              >
              <CircularProgress color="inherit" />
            </Backdrop>
            
            <Button onClick={handleSubmitPublished} sx={{
              fontFamily: "'Circular Std', Arial, sans-serif", fontSize: 14, fontWeight: 700, justifyContent: 'center',
              color: '#fff', backgroundColor: '#1286f7', borderRadius: 2, px: 2, py: 1, mr: 1, '&:hover': { backgroundColor: '#1286f7' }
            }}>
              Publicar
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

