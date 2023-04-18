import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import Navbar from '../components/NavBar';
import axios from '../api/axios';
import { useState, useEffect } from 'react';
import PhotosCard from '../components/Card_photos';
import Portada from '../components/Portada';
import ProgressBar from '../components/ProgressBar';
import swal from 'sweetalert2';
import './swal.css'
import { Box } from '@mui/material';



const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#e9bc65',
    },
    tertiary: {
      main: 'black',
    },
  },
});



export default function UpdatePhotoGallery() {

  const [photos, setPhotos] = useState([]);
  let [portada, setPortada] = useState('https://img.freepik.com/fotos-premium/ponente-conferencia-presentacion-negocios-audiencia-sala-conferencias_561846-3.jpg?w=996');
  const [selectedImg, setSelectedImg] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const types = ['image/png', 'image/jpeg'];



  const handleChange = (e) => {
    let selected = e.target.files[0];
    if (selected && types.includes(selected.type)) {
      setFile(selected);
      setError('');
    } else {
      setFile(null);
      setError('Selecciona u archivo que sea una imagen (png or jpg)');
    }
  };




  const loadImages = () => {

    let token_user;
    if (!window.localStorage.getItem("token")) {
      console.log("no autorizado")
      window.location.href = "/home";
      return;
    } else {
      token_user = window.localStorage.getItem("token");
    }

    //let id_event = sessionStorage.getItem("event_id"); 
    let id_event = window.localStorage.getItem("event_id");
    console.log(id_event)


    const params = new URLSearchParams([['event_id', id_event]]);

    const headers = {
      'accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': '*',
      'Authorization': 'Bearer ' + token_user
    }

    axios({ method: 'get', url: '/organizer/event/images', params: params, headers: headers })
      .then((response) => {
        setPhotos(response.data);
        console.log(response.data)

      })
      .catch((error) => {
        console.log(error);
      })
  };



  useEffect(() => {

    loadImages();
 



  }, []);

 

  const cards = photos.slice(1).map(item => {
    return (
      <PhotosCard
        key={item.id }
        {...item}
  
        
      />
    )
  })

  return (

    (photos && photos.length > 0) ?
      <ThemeProvider theme={theme}>
        <Navbar />
        <Typography variant="h6" component="div" sx={{ color: 'black', fontSize: 16, fontWeight: 700, mb: 2 }}>
          Bienvenido a tu galeria
        </Typography>
        
        

        <Button onClick={()=>{window.location.href = '/showEvents'}} variant="contained" component="label">
          Ir a mis eventos
        </Button>
        
        
        <Box sx={{
          flexWrap: 'wrap',
          mt: '7%',
          ml: '2%',
          margin: '20px auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',

          gridGap: '40px 0'
        }}>
            <Portada
         portada = {portada}
      />
          {cards}
        </Box>



      </ThemeProvider>
      : <ThemeProvider theme={theme}>
        <Navbar />
        <Typography variant="h6" component="div" sx={{ color: 'black', fontSize: 16, fontWeight: 700, mb: 2 }}>
          Bienvenido a tu galeria
        </Typography>
        <Button onClick={()=>{window.location.href = '/showEvents'}} variant="contained" component="label">
          Ir a mis eventos
        </Button>
        <Button onClick={()=>{window.location.href = '/photoUpload'}}  variant="contained" component="label">
          Cargar Imagenes nuevas
        </Button>






      </ThemeProvider>


  )





}
