import { useRef, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { Select, MenuItem } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Button, Divider, Typography, TextField } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material';
import swal from 'sweetalert2';
import Navbar from '../components/NavBar';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


mapboxgl.accessToken = "pk.eyJ1Ijoic2FoaWx0aGFrYXJlNTIxIiwiYSI6ImNrbjVvMTkzNDA2MXQydnM2OHJ6aHJvbXEifQ.z5aEqRBTtDMWoxVzf3aGsg";


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

const CreateEventForm = () => {
  const userRef = useRef();
  const errRef = useRef();
  const [error, setError] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState('');
  const [vacancies, setVacancies] = useState('');
  const [direction, setDirection] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [files, setFiles] = useState(false);

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lat, setLat] = useState(-34.599722222222);
  const [lon, setLon] = useState(-58.381944444444);
  const [zoom, setZoom] = useState(7);

  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  const today = new Date();
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  let minDate = tomorrow.toISOString().split('T')[0];




  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const toolbarOptions = {

  };



  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lon, lat],
      zoom: zoom
    });

    map.addControl(new mapboxgl.NavigationControl({ showZoom: true }));

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: {
        color: 'red',
        offset: [340, -500]
      },
      countries: 'ar',
      placeholder: 'Ingrese una dirección',
      textColor: 'black',
      color: 'black'
    });

    map.addControl(geocoder);

    geocoder.on('result', function (e) {
      const coordinates = e.result.center;
      setLon(coordinates[0]);
      setLat(coordinates[1]);
      setDirection(e.result.place_name);

      console.log('center');
      console.log(coordinates);
      console.log('longitude');
      console.log(lon);
      console.log('latitude');
      console.log(lat);
      console.log('address');
      console.log(direction);
    })

    return () => map.remove();
  }, []);


  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const currentDate = new Date();

    if (selectedDate < currentDate) {
      swal.fire({
        title: "Elegui otra fecha",
        text: "Recuerda que la proxima fecha disponible es el " + new Date(minDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }),
        icon: "warning",
        confirmButtonText: 'Entendido',
      })

    } else {
      setDate(selectedDate.toISOString().split('T')[0]);
    }
  };

  const handleDateChangeTickets = (e) => {
    const numberOfTickets = e.target.value;


    if (numberOfTickets > 10000) {
      swal.fire({
        title: "Excediste el número de entradas permitidas",
        text: "Recuerda que el numero de entradas debe ser inferior a 10.000",
        icon: "warning",
        confirmButtonText: 'Entendido',
      })

    } else {
      setCapacity(numberOfTickets);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    let photos = [];


    window.localStorage.setItem("photos_user", JSON.stringify(photos));

    setLatitude(lat);
    setLongitude(lon);

    console.log("hola")
    console.log(title);
    console.log(category);
    console.log(date);
    console.log(description);
    console.log(capacity);
    //console.log (vacancies);
    console.log(direction);
    console.log(latitude);
    console.log(longitude);


    let token_user;

    if (!window.localStorage.getItem("token")) {
      console.log("no autorizado")
      window.location.href = "/home";
      return;
    } else {
      token_user = window.localStorage.getItem("token");
    }

    if (!window.localStorage.getItem("token")) {
      console.log("no autorizado")
      window.location.href = "/home";
      return;
    } else {
      token_user = window.localStorage.getItem("token");
    }

    if (title != '' && category != '' && date != '' && description != '' && direction != '') {


      try {
        const response = await axios.post('organizer/event',
          JSON.stringify({
            "title": title,
            "category": category,
            "date": date,
            "description": 'EN construcción',
            "capacity": capacity,
            "vacancies": 0,
            "ubication": {
              "direction": direction,
              "latitude": 0,
              "longitude": 0
            },
            "pic": "string"
          }),
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token_user}`
            }
          }

        );
        console.log(response.status);
        window.localStorage.setItem("event_id", response.data.id);
        window.location.href = "/photoUpload";
      } catch (err) {
        setError(true)
        if (!err?.response) {
          setErrMsg('El servidor no responde');
        } else if (err.response?.status === 401) {
          setErrMsg('Contraseña o usuario incorrecto');
        } else if (err.response?.status === 402) {
          setErrMsg('No tiene autorización');
        } else {
          token_user = window.localStorage.getItem("token");
        }

      }
    } else {
      swal.fire({
        title: "Dejaste campos sin completar",
        text: "Recuerda que para cargar imagenes debes llenar los campos previos",
        icon: "warning",
        confirmButtonText: 'Entendido',
      })

    }
  }


  const handleChangeDirection = (address) => {

    setDirection(address);

  }

  /*useEffect(() => {
   map.on('move', () => {
     setLon(map.getCenter().lng.toFixed(4));
     setLat(map.getCenter().lat.toFixed(4));
     //setZoom(map.getZoom().toFixed(2));
     console.log('longitude');
     console.log(lon);
     console.log('latitude');
     console.log(lat);
    })
  });*/


  /*useEffect(() => {
   map.geocoder.on('result', function(e) {
     setLon(e.result.center.lng);
     setLat(e.result.center.lat);
     console.log('longitude');
     console.log(lon);
     console.log('latitude');
     console.log(lat);
   })
   }, []);*/


  const loadImages = (files) => {
    console.log("entro")
  }


  const back = () => {
    window.location.href = "/showEvents"
  }


  return (

    <ThemeProvider theme={theme}>
      <Box sx={{ border: '1px solid black' }}>
        <Navbar />
        <Typography variant="h6" component="div" sx={{ color: 'black', fontSize: 16, fontWeight: 700, mb: 2, display: 'flex', justifyContent: 'center' }}>
          Crear evento
        </Typography>
        <Stack direction="row" spacing={15} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Stack
            direction="column"
            spacing={3}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              width: '100%',
              maxWidth: '100%',
              padding: '0 1rem',
              fontFamily: 'Arial, sans-serif',
              fontSize: '1rem',
              flexGrow: 1,

              border: '8px solid $primary-color' /* Agrega el borde */
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={6}>

                <TextField error={error} fullWidth sx={{ m: 1 }} label="Nombre del evento" variant="outlined" value={title} onChange={(e) => setTitle(e.target.value)} />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth sx={{ m: 1 }}>
                  <InputLabel id="demo-simple-select-label">Categoria</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={category}
                    label="Tipo de evento"
                    onChange={(e) => setCategory(e.target.value)}



                  >

                    <MenuItem sx={{ color: 'black' }} value="Evento deportivo">Evento deportivo</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Cena o gala">Cena o gala</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Clase, curso o taller">Clase, curso o taller</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Performance">Performance</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Conferencia">Conferencia</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Encuentro">Encuentro</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Networking">Networking</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Feria">Feria</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Festival">Festival</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Fiesta" >Fiesta</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Competencia">Competencia</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Promoción">Promoción"</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Seminario">Seminario</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Show">Show</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Torneo">Torneo</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Visita">Visita</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Otro">Otro</MenuItem>
                  </Select>

                </FormControl>
              </Grid>
            </Grid>



            <Grid item xs={6} sx={{ width: '100%' }}>
              <Typography variant="h6" component="div" sx={{ color: 'black', fontSize: 16, fontWeight: 700, mb: 2, display: 'flex', justifyContent: 'center' }}>
                Descripción
              </Typography>


              <Box sx={{ border: '1px solid black', height: '200px', overflow: 'auto', marginLeft: '10px', borderRadius: '10px' }}>
                <Editor
                  editorState={editorState}
                  onEditorStateChange={handleEditorChange}
                  toolbar={toolbarOptions}
                  wrapperClassName="wrapper-class"
                  editorClassName="editor-class"
                  toolbarClassName="toolbar-class"
                  style={{ maxHeight: '100px' }}
                />
              </Box>


            </Grid>

            <Grid container spacing={2}>
              <Grid item sx={{ width: '50%' }}>
                <Box sx={{ height: '200px', overflow: 'auto', marginLeft: '50px', borderRadius: '10px' }}>
                  <Typography variant="h6" component="div" sx={{ width: '50%', color: 'black', fontSize: 16, fontWeight: 700, display: 'flex', justifyContent: 'center' }}>
                    Fecha del evento
                  </Typography>
                  <TextField fullWidth sx={{ width: '50%', color: 'black', fontSize: 16, fontWeight: 700, mb: 2, display: 'flex', justifyContent: 'center' }} type="date" id="date" name="date" onChange={handleDateChange} value={date || ' '} min={minDate = new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]} />
                  <Typography variant="h6" component="div" sx={{ width: '50%', color: 'black', fontSize: 16, fontWeight: 700, display: 'flex', justifyContent: 'center' }}>
                    Cantidad de tickets
                  </Typography>

                  <TextField fullWidth sx={{ width: '50%', color: 'black', fontSize: 16, fontWeight: 700, mb: 2, display: 'flex', justifyContent: 'center' }} type="number" label="Cantidad de tickets" value={capacity} variant="outlined" onChange={handleDateChangeTickets} />

                </Box>

              </Grid>

              <Grid item sx={{ width: '50%' }}>
              <Typography variant="h6" component="div" sx={{ width: '100%', color: 'black', fontSize: 16, fontWeight: 700, display: 'flex', justifyContent: 'center' }}>
                    Ubicación
                  </Typography>
                
               
                  <div ref={mapContainer} className="map-container"
                    style={{ marginTop: "10px", marginLeft: "20px", height: 500, width: 700, justifyContent: 'center', textColor: 'black' }} />

                

              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="h6" component="div" sx={{ color: 'black', fontSize: 16, fontWeight: 700, mb: 1 }}>
                  Elegui las fotos de tu evento
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                  <Button variant="contained" onClick={handleSubmit} sx={{
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
                  }}>Cargar fotos</Button>
                </Box>
              </Grid>


            </Grid>


            <Divider />
          </Stack>

        </Stack>

      </Box>

    </ThemeProvider>


  )
}

export default CreateEventForm




