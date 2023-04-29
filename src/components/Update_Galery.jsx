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
import ProgressBar from './ProgessBar_upload';
import swal from 'sweetalert2';
import '../routes/swal.css'
import { Box } from '@mui/material';
import useStorage from '../hooks/useStorage';
import '../styles/index.css';



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
   
        setPhotos(response_photo.data)






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
        key={item.id}
        {...item}
        setSelectedCover={setCover}

      />
    )
  })


  const saveImages = async () => {

    let photos = JSON.parse(window.localStorage.getItem("photos_user"));
    photos.push(url);
    window.localStorage.setItem("photos_user", JSON.stringify(photos));

    let token_user = window.localStorage.getItem("token");
    let id_event = window.localStorage.getItem("event_id");
    try {
      const response = axios.post('/organizer/event/images',
        JSON.stringify({
          'event_id': id_event,
          'link': url
        }),
        {
          headers: {
            'Content-Type': 'application/json',
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
    } catch (err) { console.log(err) }
  }


  const handleUpload = () => {

    window.localStorage.setItem('úrl', '');
    window.location.href = '/photoUpload';

  }


  return (

    (photos && photos.length > 0) ?
      <ThemeProvider theme={theme}>
          <div>
    
    <div className="Galery">


        <Box sx={{
          textAlign: 'center'
        }}>
          <Typography variant="h6" component="div" sx={{ color: 'black', fontSize: 16, fontWeight: 700, mb: 2, textAlign: 'center' }}>
            Bienvenido a tu galeria
          </Typography>



          <Box sx={{
            marginLeft: '400px'
          }}>


            <CardActions sx={{ display: 'flex', justifyContent: 'left', pt: 0 }}>
            <Button sx={{
        backgroundColor: '#1286f7',
        border: 'none',
        color: 'white',
        fontSize: '16px',
        fontWeight: 'bold',
        padding: '10px 20px',
        borderRadius: '30px',
        marginTop: '20px',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease-in-out',
       
      }} variant="contained" component="label">
        Añadir foto
        <input type="file" onChange={handleChange} />
      </Button>
   
      

  

            </CardActions>

          </Box>
          <Box sx={{
            marginLeft: '0px'
          }}>
      <div className="output" >
        {error && <div className="error">{error}</div>}
        {file && <div sx={{ color: 'black' }}>{file.name}</div>}
        {file && <ProgressBar file={file} setFile={setFile} />}
      </div>
      </Box>
        </Box>


       

        </div>
        </div>
        
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
      :   <div>
    
      <div className="Galery">
        
        <Typography variant="h6" component="div" sx={{ color: 'black', fontSize: 16, fontWeight: 700, mb: 2 }}>
          Selecciona tus fotos para cargar a la galeria
        </Typography>
  
        <Button sx={{
          backgroundColor: '#1286f7',
          border: 'none',
          color: 'white',
          fontSize: '16px',
          fontWeight: 'bold',
          padding: '10px 20px',
          borderRadius: '30px',
          marginTop: '20px',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease-in-out'
        }} variant="contained" component="label">
          Añadir foto
          <input type="file" onChange={handleChange} />
        </Button>
  
  
  
        <div className="output" >
          {error && <div className="error">{error}</div>}
          {file && <div sx={{ color: 'black' }}>{file.name}</div>}
          {file && <ProgressBar file={file} setFile={setFile} />}
        </div>
  
  
      
  
   
      </div>
      </div>


  )





}