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
import Portada from './Portada';
import ProgressBar from './ProgressBar';
import swal from 'sweetalert2';
import '../routes/swal.css'
import { Box } from '@mui/material';
import useStorage from '../hooks/useStorage';



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
  
  const [selectedImg, setSelectedImg] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const types = ['image/png', 'image/jpeg'];
  const [cover, setCover] = useState('');
  const [url, setUrl] = useState('');
  //const{url, progress} = useStorage(file, setFile);
  
  //window.localStorage.setItem('url', url);
  //window.localStorage.setItem('progress', progress);
  //setUrl(window.localStorage.getItem('url'));
  

  
  let props = JSON.parse(sessionStorage.getItem("publication_data"))

  let id_event = props.id;


  
 

  const handleChange = (e) => {
    let selected = e.target.files[0];
    if (selected && types.includes(selected.type)) {
      setFile(selected);
      setError('');
    } else {
      setFile(null);
      setError('Selecciona un archivo que sea una imagen (png or jpg)');
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

    
    
 


    const params = new URLSearchParams([['event_id', id_event]]);

    const headers = {
      'accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': '*',
      'Authorization': 'Bearer ' + token_user
    }

    axios({ method: 'get', url: '/organizer/event/images', params: params, headers: headers })
      .then((response_photo) => {
        console.log( response_photo.data[0])
        setPhotos( JSON.parse(response_photo.data[0]))
    
      
       
        
     
       })
        .catch((error) => {
          console.log(error);
        })
       
      }



  useEffect(() => {

    loadImages();
   
  }, []);

 

  const cards = photos.map(item => {
    return (
      <PhotosCard
        key={item.id }
        {...item}
        setSelectedCover={setCover}
         
      />
    )
  })
  
  
  const saveImages = async () => {
  
      let photos = JSON.parse(window.localStorage.getItem("photos_user"));
      photos.push(url);
      window.localStorage.setItem("photos_user", JSON.stringify(photos));

      let token_user=window.localStorage.getItem("token"); 
      let id_event = window.localStorage.getItem("event_id"); 
     try{    
       const response= axios.post('/organizer/event/images',
                 JSON.stringify({ 
                     'event_id': id_event,
                     'link': url
                 }),
                 {
                     headers: { 'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Credentials': true,
                                'Access-Control-Allow-Headers': '*',
                                'Authorization': 'Bearer ' + token_user,
                              }
                  },
 
             )
       .then((response) => {
       console.log("Imágen cargada");
       setUrl(window.localStorage.getItem(''));
       window.history.back();
     })
     }catch (err) {console.log(err)}
  }


  const handleUpload = () => {
  
    window.localStorage.setItem('úrl', '');
    window.location.href = '/photoUpload';
  
 }
 

  return (

    (photos && photos.length > 0) ?
      <ThemeProvider theme={theme}>
   
         
        <Box sx={{
           textAlign: 'center'
        }}>
        <Typography variant="h6" component="div" sx={{ color: 'black', fontSize: 16, fontWeight: 700, mb: 2,  textAlign: 'center' }}>
          Bienvenido a tu galeria
        </Typography>
        
        

        <Box sx={{
           marginLeft: '590px'
        }}>
     
      
      <CardActions sx={{ display: 'flex', justifyContent: 'left', pt: 0 }}>
      <Button onClick={()=>{window.location.href = '/photoUpload'}}  variant="contained" component="label">
          Cargar Imagenes nuevas
        </Button>
        
   
    </CardActions>
      
      </Box>
        </Box>

        
        <Box sx={{
          flexWrap: 'wrap',
          mt: '7%',
          ml: '2%',
          margin: '20px auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',

          gridGap: '40px 0'
        }}>
            
          {cards}
        </Box>



      </ThemeProvider>
      : <ThemeProvider theme={theme}>

        <Typography variant="h6" component="div" sx={{ color: 'black', fontSize: 16, fontWeight: 700, mb: 2 }}>
          Bienvenido a tu galeria
        </Typography>
        <Button onClick={()=>{window.location.href = '/showEvents'}} variant="contained" component="label">
          Ir a mis eventos
        </Button>
        <Button onClick={handleUpload}  variant="contained" component="label">
          Cargar Imagenes nuevas
        </Button>






      </ThemeProvider>


  )





}
