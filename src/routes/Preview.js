import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { api } from '../api/axios';
import Navbar from '../components/NavBar';
import { EditorState, convertFromRaw } from 'draft-js';
import { Grid } from '@mui/material';

const Preview = () => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  let event = JSON.parse(window.localStorage.getItem("cache_event")); // incluye las images
  let cover = JSON.parse(window.localStorage.getItem("cache_cover"));
  // let id_event = window.localStorage.getItem("event_id"); // ver donde se setea
  const stringDate = new Date(event.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });

  useEffect(() => {
    const rawContent = JSON.parse(event.description);
    const contentState = convertFromRaw(rawContent);
    setEditorState(EditorState.createWithContent(contentState));
  }, []);

  // const saveImages = async () => {

  //   try {
  //     api.post('/organizer/event/images',
  //       JSON.stringify({
  //         'event_id': id_event,
  //         'link': cover
  //       }),
  //     )
  //       .then((response) => {
  //         console.log("Imágen cargada");
  //         setUrl(window.localStorage.getItem(''));
  //         window.location.href = "/showEvents"
  //       })
  //   } catch (err) { console.log(err) }
  // }

  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    // save event junto con las images -> agregar imagenes al json de event
    await api
      .post('organizer/event', JSON.stringify(event))
      .then(async(response) => {
        await api.post(
          'organizer/event/cover/pic',
          JSON.stringify({
            "link": window.localStorage.getItem('coverPic'), 
            "event_id": response.data.id
          })
        );
      })
    
  }


  return (

    <Box sx={{ mb: 4, justifyContent: 'center' }}>
      <Navbar />

      <Typography variant="h5" component="div" sx={{ marginTop: '10px', color: 'black', fontSize: 16, fontWeight: 700, mb: 2, display: 'flex', justifyContent: 'center' }}>
        Crear evento
      </Typography>
      <Typography variant="h6" component="div" sx={{ fontSize: 14, fontWeight: 700, mb: 2, display: 'flex', justifyContent: 'center' }}>
        Confirme los datos del evento
      </Typography>

      <Grid style={{ display: 'flex', justifyContent: 'center' }}>
        <Card variant="outlined" sx={{
          border: '2px solid black', borderRadius: 2, backgroundColor: '#fff', color: 'black',
          justifyContent: 'center', width: '700px', height: '1000px'
        }}>
          <CardContent sx={{ pb: 2, justifyContent: 'center' }}>

            <img src={cover} alt="preview" height="180" style={{ marginTop: '20px', marginLeft: '120px', display: 'flex', justifyContent: 'center' }} />
            {/* imagen de portada y map para el resto de imagenes */}
            <Typography variant="h6" component="div" sx={{ marginTop: '20px', fontSize: 16, fontWeight: 700, mb: 1, display: 'flex', justifyContent: 'center' }}>
              {event.category}
            </Typography>
            <Typography variant="h5" component="div" sx={{ fontSize: 20, fontWeight: 700, mb: 1, display: 'flex', justifyContent: 'center' }}>
              {event.title}
            </Typography>
            <Typography color="textSecondary" sx={{ fontSize: 14, fontWeight: 400, color: '##1286f7', mb: 1, display: 'flex', justifyContent: 'center' }}>
              {stringDate}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: 14, fontWeight: 400, mb: 1, display: 'flex', justifyContent: 'center' }}>
              {event.ubication.direction}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: 14, fontWeight: 400, mb: 1, display: 'flex', justifyContent: 'center' }}>
              Capacidad: {event.capacity}
            </Typography>

            <Typography variant="h6" component="div" sx={{ marginTop: '20px', fontSize: 14, fontWeight: 700, mb: 2, display: 'flex', justifyContent: 'center' }}>
              Descripción
            </Typography>

            <Typography variant="body2" sx={{ fontSize: 14, fontWeight: 400, mb: 1, display: 'flex', justifyContent: 'center' }}>
              {editorState.getCurrentContent().getPlainText()}
            </Typography>

            <Typography variant="h6" component="div" sx={{ marginTop: '20px', fontSize: 14, fontWeight: 700, mb: 2, display: 'flex', justifyContent: 'center' }}>
              Agenda
            </Typography>

            {event.agenda.map(function (item, key) {
              return (
                <div>
                  <Card sx={{ border: '0.5px solid grey', borderRadius: 2, backgroundColor: '#fff', color: 'black', }}>
                    <Typography variant="body2" sx={{ fontSize: 14, fontWeight: 400, mb: 1, display: 'flex', justifyContent: 'left' }}>
                      {item.time} : {item.description}
                    </Typography>
                  </Card>
                </div>
              )
            })}

            <Typography variant="h6" component="div" sx={{ marginTop: '20px', fontSize: 14, fontWeight: 700, mb: 2, display: 'flex', justifyContent: 'center' }}>
              Preguntas frecuentes
            </Typography>

            {event.faqs.map(function (item, key) {
              return (
                <div>
                  <Card sx={{ border: '0.5px solid grey', borderRadius: 2, backgroundColor: '#fff', color: 'black' }}>
                    <Typography variant="body2" sx={{ fontSize: 14, fontWeight: 800, mb: 1, display: 'flex', justifyContent: 'left' }}>
                      {item.question}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: 14, fontWeight: 400, mb: 1, display: 'flex', justifyContent: 'left' }}>
                      {item.response}
                    </Typography>
                  </Card>
                </div>

              )
            })}

          </CardContent>

          <CardActions sx={{ display: 'flex', justifyContent: 'center', pt: 0 }}>
            <Button onClick={handleSubmitEvent} sx={{
              fontFamily: "'Circular Std', Arial, sans-serif", fontSize: 14, fontWeight: 700, justifyContent: 'center',
              color: '#fff', backgroundColor: '#1286f7', borderRadius: 2, px: 2, py: 1, mr: 1, '&:hover': { backgroundColor: '#1286f7' }
            }}>
              Aceptar
            </Button>
            <Button onClick={() => { window.history.back() }} sx={{
              fontFamily: "'Circular Std', Arial, sans-serif", justifyContent: 'center',
              fontSize: 14, fontWeight: 700, color: '#fff', backgroundColor: '#1286f7', borderRadius: 2, px: 2, py: 1, '&:hover': { backgroundColor: '#1c1c1c' }
            }}>
              Volver
            </Button>
          </CardActions>
        </Card>
      </Grid>

    </Box>

  )
}

export default Preview

