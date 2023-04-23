import { useRef, useState, useEffect } from 'react';
import axios from '../api/axios';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
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
import { EditorState, convertToRaw , convertFromRaw } from 'draft-js';
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

   //voy a tener que ver si hay algo cargado antes 
   let datos = JSON.parse(window.localStorage.getItem('cache_datos'));

   const userRef = useRef();
   const errRef = useRef();
   const [error, setError] = useState(false);
   const [title, setTitle] = useState(datos =='' ? '' : datos.titulo );
   const [category, setCategory] = useState(datos == '' ? '': datos.categoria);
   const [date, setDate] = useState(datos == '' ? '' : datos.fecha );
   const [description, setDescription] = useState('');
   const [capacity, setCapacity] = useState(datos =='' ? '': datos.tickets);
   const [vacancies, setVacancies] = useState('');
   const [direction, setDirection] = useState(datos ? datos.direccion : '');
   const [latitude, setLatitude] = useState(-34.599722222222);
   const [longitude, setLongitude] = useState(-58.381944444444);
   const [errMsg, setErrMsg] = useState('');
   const [success, setSuccess] = useState(false);
   const [files, setFiles] = useState(false);
   const [agenda, setAgenda] = useState([]);
   const [faqs, setFaqs] = useState(null);
   
   const mapContainer = useRef(null);
   const map = useRef(null);
   const [zoom, setZoom] = useState(7);
   
   const [editorState, setEditorState] = useState(datos == '' ?() => EditorState.createEmpty(): EditorState.createWithContent(convertFromRaw(JSON.parse(datos.descripcion))) );

   const today = new Date();
   const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
   let minDate = tomorrow.toISOString().split('T')[0];
  window.localStorage.setItem("preguntas_cargadas", JSON.stringify(''));;

  const url = window.localStorage.getItem('url');
  console.log(url);
 
 
  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState);
    setDescription(JSON.stringify(convertToRaw(editorState.getCurrentContent())));
  };


  const toolbarOptions = {

  };


  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [longitude, latitude],
      zoom: zoom
    });

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

    map.addControl(new mapboxgl.NavigationControl({ showZoom: true }));

    geocoder.on('result', function (event) {
      //let result = JSON.parse(event.result);
      let coordinates = event.result.center;
      setLongitude(coordinates[0]);
      setLatitude(coordinates[1]);
      setDirection(event.result.place_name);

      console.log('event');
      console.log(event);
      console.log('result');
      console.log(event.result);
      console.log('center');
      console.log(coordinates);
      console.log('longitude');
      console.log(longitude);
      console.log('latitude');
      console.log(latitude);
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


  const handleSubmit_sinPrevisualizacion = async (e) => {
    e.preventDefault();

    /*-------------------------------------------------------------------------------------------------------------------------------------*/
    e.preventDefault();
    let photos = [];

    window.localStorage.setItem("photos_user", JSON.stringify(photos));

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

      try {
        const response = axios.post('organizer/event',
          JSON.stringify({
            "title": title,
            "category": category,
            "date": date,
            "description": description,
            "capacity": capacity,
            "vacancies": 0,
            "ubication": {
              "direction": direction,
              "latitude": latitude,
              "longitude": longitude
            },
            "agenda": [
              {
                "time": "string",
                "description": "string"
              }
            ],
            "authorizers": [
              {
                "email": "jecastillo@fi.uba.ar"
              }
            ]
          }),
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token_user}`
            }
          },

        )
          .then((response) => {
            console.log()
            const preguntasRecuperadasJSON = window.localStorage.getItem("preguntas");
            let analizar = JSON.parse(preguntasRecuperadasJSON);
            if(analizar.length>0){
              console.log('ejecutando las preguntas')

            for (const [index, pregunta] of analizar.entries()) {
              if (pregunta.response !== '') {
                try {
                  const response_faqs = axios.post(
                    '/organizer/event/faq',
                    JSON.stringify({

                      "event_id": response.data.id,
                      "question": '',
                      "response": ''

                    }),
                    {
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token_user}`
                      }
                    }
                  );

                } catch (err) {
                  setError(true);
                  if (!err?.response_faqs) {
                    setErrMsg('El servidor no responde');
                  } else if (err.response_faqs?.status === 401) {
                    setErrMsg('Contraseña o usuario incorrecto');
                  } else if (err.response_faqs?.status === 402) {
                    setErrMsg('No tiene autorización');
                  } else {
                    token_user = window.localStorage.getItem('token');
                  }
                }
              }
            }} else{}


            let vaciar = JSON.stringify('');
            window.localStorage.setItem("preguntas", vaciar);
            window.localStorage.setItem('cache_datos', vaciar);
            window.location.href = "/showEvents"

          })
      } catch (err) { console.log(err) }

  }


  const handleSubmit_faqs = async (e) => {
    e.preventDefault();
    
   const data = {
    "titulo": "",
    "categoria": "",
    "descripcion": "",
    "fecha": "",
    "tickets": "",
    "direccion": ""
   }

    data.titulo = title
    data.categoria = category
    data.descripcion = description
    data.fecha = date
    data.tickets = capacity
    data.direccion = direction
    
    window.localStorage.setItem('cache_datos', JSON.stringify(data));
 
    window.location.href = "/faqs"

  }


  const handleChangeDirection = (address) => {

    setDirection(address);

  }


  const handleCreate = () => {

    if (title != '' && category != '' && date != '' && description != '' && direction != '') {

      const event = {
        "title": title,
        "category": category,
        "date": date,
        "description": description,
        "capacity": capacity,
        "vacancies": 0,
        "ubication": {
          "direction": direction,
          "latitude": latitude,
          "longitude": longitude
        },
        "agenda": [
              {
                "time": "string",
                "description": "string"
              }
            ],
            "authorizers": [
              {
                "email": "string"
              }
            ]
          };
      
      window.localStorage.setItem("event", JSON.stringify(event));
      window.location.href = '/Preview';

    } else {
      swal.fire({
        title: "Dejaste campos sin completar",
        text: "Recuerda que para cargar imagenes debes llenar los campos previos",
        icon: "warning",
        confirmButtonText: 'Entendido',
      })

  } }


  const loadImages = (files) => {
    window.localStorage.setItem('úrl', '');
    window.location.href = "/photoUpload";
    console.log("entro")
  }


  return (

    <ThemeProvider theme={theme}>

      <Navbar />
      <Box sx={{ border: '5px solid black', padding: '20px' }}>
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
                  <InputLabel id="demo-simple-select-label">Categoría</InputLabel>
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

                <Grid item sx={{ width: '50%', marginTop: '20px' }}>
                  <Box sx={{ height: '250px', overflow: 'auto', marginLeft: '200px', borderRadius: '10px' }}>
                    <Typography variant="h6" component="div" sx={{ width: '50%', color: 'black', fontSize: 16, fontWeight: 700, display: 'flex', justifyContent: 'center' }}>
                      Fecha del evento
                    </Typography>
                    <TextField fullWidth sx={{ width: '50%', color: 'black', fontSize: 16, fontWeight: 700, mb: 2, display: 'flex', justifyContent: 'center', marginTop: '20px' }} 
                     type="date" id="date" name="date" onChange={handleDateChange} value={date || ' '} min={minDate = new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]} />
                    <Typography variant="h6" component="div" sx={{ width: '50%', color: 'black', fontSize: 16, fontWeight: 700, display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                      Cantidad de tickets
                    </Typography>
                    <TextField fullWidth sx={{ width: '50%', color: 'black', fontSize: 16, fontWeight: 700, mb: 2, display: 'flex', justifyContent: 'center', marginTop: '20px' }} 
                     type="number" label="Cantidad de tickets" value={capacity} variant="outlined" onChange={handleDateChangeTickets} />
                 </Box>
                 <Box sx={{marginLeft: '220px', display: 'flex', justifyContent: 'left', alignItems: 'center', textAlign: 'center' }}>
                  <Button variant="contained" onClick={loadImages} sx={{
                    backgroundColor: '#1286f7',
                    border: 'none',
                    color: 'white',
                    width: '300px',
                    height: '50px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    padding: '10px 20px',
                    marginTop: '20px',
                    marginRight: '300px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease-in-out'
                  }}>Cargar fotos</Button>
                </Box>

                <Box sx={{ marginLeft: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                  <Button variant="contained" onClick={handleSubmit_faqs} sx={{
                    backgroundColor: '#1286f7',
                    border: 'none',
                    color: 'white',
                    width: '300px',
                    height: '50px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    padding: '10px 20px',
                    marginTop: '20px',
                    marginRight: '150px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease-in-out'
                  }}>Preguntas frecuentes</Button>
                </Box>
              </Grid>

              <Grid item sx={{ width: '50%', height: '300px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'right', alignItems: 'center', textAlign: 'center' }}>
                  <div ref={mapContainer} className="map-container"
                    style={{ width: 600, height: 350, marginLeft: '50px', marginTop: '20px', marginRight: '100px' }}
                  />
                </Box>
              </Grid>

            </Grid>


            <Grid xs={6} sx={{ width: '100%' }}>

              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <Button variant="contained" onClick={handleCreate} sx={{
                  backgroundColor: '#1286f7',
                  border: 'none',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  padding: '10px 20px',
                  borderRadius: '30px',
                  width: '200px',
                  height: '60px',
                  marginTop: '100px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease-in-out'
                }}>Crear</Button>
              </Box>

            </Grid>


            <Divider />
            
          </Stack>
        </Stack>
      </Box>
    </ThemeProvider>

  )
}

export default CreateEventForm

