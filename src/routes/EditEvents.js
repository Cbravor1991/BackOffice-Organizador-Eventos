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
import './swal.css'
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { EditorState, convertToRaw, convertFromRaw  } from 'draft-js';
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


const EditEvent = () => {

  let props = sessionStorage.getItem("publication_data")
  props = (JSON.parse(props))

  const userRef = useRef();
  const errRef = useRef();
  const [error, setError] = useState(false);
  const [id_event, setEventID] = useState(props.id);
  const [title, setTitle] = useState(props.title)
  const [category, setCategory] = useState(props.category);
  const [date, setDate] = useState(props.date);
  const [description, setDescription] = useState(props.description);
  console.log('viendo descripcion');
  console.log(props.description);
  const [capacity, setCapacity] = useState(props.capacity);
  const [vacancies, setVacancies] = useState('');
  const [direction, setDirection] = useState(props.direction);
  const [latitude, setLatitude] = useState(props.latitude);
  const [longitude, setLongitude] = useState(props.longitude);
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  let minDate = tomorrow.toISOString().split('T')[0];
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [zoom, setZoom] = useState(7);


  useEffect(() => {
    const rawContent = JSON.parse(props.description);
    const contentState = convertFromRaw(rawContent);
    setEditorState (EditorState.createWithContent(contentState));    
  }, []);
  
  
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
  

  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState);
    setDescription (JSON.stringify(convertToRaw(editorState.getCurrentContent())));
    
  };

  const toolbarOptions = {

  };


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


  sessionStorage.setItem("event_id", id_event);

  //console.log(length);

  const handleSubmitEvent = async (e) => {
    e.preventDefault();

    let token_user;
    // window.localStorage.setItem("token", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjaHJpc3RpYW4uZml1YmFAZ21haWwuY29tIiwiZXhwIjoxNjgxMDc2MDQyfQ.Wh-28x-wKNO3P6QJ3rt2wq8fLb4C6XSB4TJF3NFPRDE' )


    if (!window.localStorage.getItem("token")) {
      console.log("no autorizado")
      window.location.href = "/home";
      return;
    } else {
      token_user = window.localStorage.getItem("token");
    }




    try {

      var options = {
        method: 'PUT',
        url: '/organizer/event',
        params: { '': '' },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token_user}`
        },
        data: {

          "id": id_event,
          "title": title,
          "category": category,
          "date": date,
          "description": description,
          "direction": direction,
          "latitude": 0,
          "longitude": 0,
          "capacity": capacity,
          "vacancies": 0
        }
      };

      axios.request(options).then(function (response) {
        console.log(response.data);
      }).catch(function (error) {
        console.error(error);
      });


      window.localStorage.setItem("event_id", id_event);
  
      window.location.href = "/showEvents";



    } catch (err) {
      setError(true)
      if (!err?.response) {
        setErrMsg('El servidor no responde');
      } else if (err.response?.status === 401) {
        setErrMsg('Contraseña o usuario incorrecto');
      } else if (err.response?.status === 402) {
        setErrMsg('No tiene autorización');
      } else {
        setErrMsg('El ingreso ha fallado');
      }

    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    let token_user;
    // window.localStorage.setItem("token", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjaHJpc3RpYW4uZml1YmFAZ21haWwuY29tIiwiZXhwIjoxNjgxMDc2MDQyfQ.Wh-28x-wKNO3P6QJ3rt2wq8fLb4C6XSB4TJF3NFPRDE' )


    if (!window.localStorage.getItem("token")) {
      console.log("no autorizado")
      window.location.href = "/home";
      return;
    } else {
      token_user = window.localStorage.getItem("token");
    }




    try {

      var options = {
        method: 'PUT',
        url: '/organizer/event',
        params: { '': '' },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token_user}`
        },
        data: {

          "id": id_event,
          "title": title,
          "category": category,
          "date": date,
          "description": description,
          "direction": direction,
          "latitude": 0,
          "longitude": 0,
          "capacity": capacity,
          "vacancies": 0,
         

          
        }
      };

      axios.request(options).then(function (response) {
        console.log(response.data);
      }).catch(function (error) {
        console.error(error);
      });


      window.localStorage.setItem("event_id", id_event);
  
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
        setErrMsg('El ingreso ha fallado');
      }

    }
  }


  


  /*------------------------------------------------------------------------------------------------------------------------*/
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
                  
                 <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                  <Button variant="contained" onClick={handleSubmit} sx={{
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
                  }}>Editar Fotos</Button>
                </Box>

                </Grid>
                
                
               <Grid item sx={{ width: '50%', height: '300px' }}>

                  <Box sx={{ display: 'flex', justifyContent: 'right',  alignItems: 'center', textAlign: 'center' }}>
                    <div ref={mapContainer} className="map-container"
                     style={{width: 600, height: 350, marginLeft: '50px', marginTop: '20px', marginRight: '100px'}}
                    />

                  </Box>

                </Grid>

              </Grid>


              <Grid xs={6} sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                  <Button variant="contained" onClick={handleSubmitEvent} sx={{
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
                  }}>Guardar</Button>
                </Box>

              </Grid>


              <Divider />
            </Stack>

          </Stack>
        </Box>

      

    </ThemeProvider>
  );
}

export default EditEvent;
