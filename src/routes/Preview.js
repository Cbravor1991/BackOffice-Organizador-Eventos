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
import AgendaDisplay from '../components/AgendaDisplay';
import FaqsDisplay from '../components/FaqsDisplay';
import Paper from '@mui/material/Paper';
import BasicInfoDisplay from '../components/BasicInfoDisplay';

const Preview = () => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  let event = JSON.parse(window.localStorage.getItem("cache_event"));
  let cover = window.localStorage.getItem("cache_cover");
  const stringDate = new Date(event.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });

  useEffect(() => {
    const rawContent = JSON.parse(event.description);
    const contentState = convertFromRaw(rawContent);
    setEditorState(EditorState.createWithContent(contentState));
  }, []);

  const handleSubmitEvent = async (e) => {
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

            <Grid style={{ display: 'flex', justifyContent: 'center' }}>
              <img src={cover} alt="preview" height="180"/>
            </Grid>

            <Typography variant="h6" component="div" sx={{ marginTop: '20px', marginLeft: '50px', fontSize: 14, fontWeight: 700}}>
              Información básica
            </Typography>

            <BasicInfoDisplay event={event} stringDate={stringDate}/>

            <Typography variant="h6" component="div" sx={{ marginTop: '20px', marginLeft: '50px', fontSize: 14, fontWeight: 700}}>
              Descripción
            </Typography>

            <Paper elevation={0}>
              <Typography variant="body2" sx={{ padding:'10px', fontSize: 14, fontWeight: 400, display: 'flex', justifyContent: 'center' }}>
                {editorState.getCurrentContent().getPlainText()}
              </Typography>
            </Paper>

            <Typography variant="h6" component="div" sx={{ marginTop: '20px', marginLeft: '50px', fontSize: 14, fontWeight: 700}}>
              Agenda
            </Typography>

            <AgendaDisplay agenda={event.agenda} />

            <Typography variant="h6" component="div" sx={{ marginTop: '20px', marginLeft: '50px', fontSize: 14, fontWeight: 700}}>
              Preguntas frecuentes
            </Typography>

            <FaqsDisplay faqs={event.faqs} />
            
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
        </Paper>
      </Grid>

    </Box>

  )
}

export default Preview

