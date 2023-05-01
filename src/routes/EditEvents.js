import { useRef, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/axios';
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
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import useStorage from '../hooks/useStorage';
import { useForm, useFieldArray } from 'react-hook-form';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Galery from '../components/Update_Galery';


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
  console.log(props)



  const userRef = useRef();
  const errRef = useRef();
  const [error, setError] = useState(false);
  const [id_event, setEventID] = useState(props.id);
  const [title, setTitle] = useState(props.title)
  const [category, setCategory] = useState(props.category);
  const [date, setDate] = useState(props.date);
  const [description, setDescription] = useState(props.description);


  const [capacity, setCapacity] = useState(props.capacity);
  const [vacancies, setVacancies] = useState(props.capacity);
  const [direction, setDirection] = useState(props.direction);
  const [latitude, setLatitude] = useState(props.latitude);
  const [longitude, setLongitude] = useState(props.longitude);
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  let minDate = tomorrow.toISOString().split('T')[0];
  const [editorState, setEditorState] = useState(description === '' ? () => EditorState.createEmpty() : EditorState.createWithContent(convertFromRaw(JSON.parse(description))));
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [zoom, setZoom] = useState(7);
  const [faqs, setFaqs] = useState(null);
  //const [agenda, setAgenta] = useState(props.agenda);
  const [preguntas, setPreguntas] = useState([]);
  const { register, control, formState: { errors }, getValues, setValue } = useForm({ defaultValues: 
     { 
       //sections: [{ time: "", description: "" }],
       //mails: [{ email: "" }],
       sections: [],
       mails: [],
       faqs: []
     }
    });
  const { fields: fieldsSections, append: appendSection, remove: removeSection } = useFieldArray({ control, name: "sections" });
  const { fields: fieldsMails, append: appendMail, remove: removeMail } = useFieldArray({ control, name: "mails" });
  const { fields: fieldsFaqs, append: appendFaq, remove: removeFaq } = useFieldArray({ control, name: "faqs" });


  let token_user = window.localStorage.getItem("token");

  /*const preguntasRecuperadasJSON = window.localStorage.getItem("preguntas");
  let analizar = JSON.parse(preguntasRecuperadasJSON);   */



 /* useEffect(() => {
    
    loadEvent();
    //const rawContent = JSON.parse(props.description);
    //const contentState = convertFromRaw(rawContent);
    //setEditorState(EditorState.createWithContent(contentState));

  }, []); */


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
        offset: [235, -350]
      },
      countries: 'ar',
      placeholder: 'Ingrese una dirección',
      textColor: 'black',
      color: 'black'
    });

    map.addControl(geocoder);

    map.addControl(new mapboxgl.NavigationControl({ showZoom: true }));

    geocoder.on('result', function (event) {
      let coordinates = event.result.center;
      setLongitude(coordinates[0]);
      setLatitude(coordinates[1]);
      setDirection(event.result.place_name);


    })

    map.on('load', () => {
      geocoder.query(direction);
    });

    return () => map.remove();
  }, []);


  const loadFaqs = () => {

    let token_user;
    if (!window.localStorage.getItem("token")) {
      console.log("no autorizado")
      window.location.href = "/home";
      return;
    } else {
      token_user = window.localStorage.getItem("token");
    }

    let id_event = sessionStorage.getItem("event_id");

    console.log(id_event)

    const params = new URLSearchParams([['event_id', id_event]]);


    api.get('/organizer/event/faq', { params: params })
      .then((response) => {
        setFaqs(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      })

  }


  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState);
    setDescription(JSON.stringify(convertToRaw(editorState.getCurrentContent())));

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

    //const formData = getValues();

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
          "agenda": "string",
          "faqs": "string"
        }
      };

      api.request(options).then(function (response) {
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
    try {
      var options = {
        method: 'PUT',
        url: '/organizer/event',
        data: {
          "id": id_event,
          "title": title,
          "category": category,
          "date": date,
          "description": description,
          "direction": direction,
          "latitude": latitude,
          "longitude": longitude,
          "capacity": capacity,
          "agenda" : [],
          "faqs" : [],
          "images" : [],
          "vacancies": vacancies,
        }
      };

      api.request(options)
        .then(function (response) {

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



  const loadEvent = () => {
  
     try {
     
      var options = {
        method: 'GET',
           url:`/organizer/event?event_id=${id_event}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token_user
            },
        };
  
      api.request(options)
        //.then((response) => response.json())
        .then((response) => {
            console.log(response);
            if (response.length === 0) {
                console.log("No hay evento")
            }
            setValue('faqs', response.data.FAQ);
            setValue('sections', response.data.Diary);
            setValue('mails', response.data.Authorizers);
        })
                
       } catch (error) {
            console.error(error);
        }

    }
 


  /*const saveFAQs = async () => { 
 
     let id_event = window.localStorage.getItem("event_id");      
     //const preguntasRecuperadasJSON = window.localStorage.getItem("preguntas");
     //let analizar = JSON.parse(preguntasRecuperadasJSON);     
     
     if(preguntas.length>0){
       console.log('ejecutando las preguntas')

       for (const [index, pregunta] of analizar.entries()) {
          if (pregunta.response !== '') {
          
                try {
                  const response_faqs = axios.post(
                    '/organizer/event/faq',
                    JSON.stringify({
                      "event_id": id_event,
                      "question": pregunta.question,
                      "response": pregunta.response
                    }),
                    {
                      headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': true,
                        'Access-Control-Allow-Headers': '*',
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
 
  }*/


  const handleEditPhotos = () => {

    window.localStorage.setItem("event_id", id_event);
    window.location.href = "/updatePhotoGallery";

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
                    onChange={(e) => setCategory(e.target.value)} s
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


            <Grid container spacing={2}>
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

             <Grid item xs={6}>
                <Typography variant="h6" component="div" sx={{ color: 'black', fontSize: 16, fontWeight: 700, display: 'flex', justifyContent: 'center' }}>
                  FAQs
                </Typography>

                <div style={{ mb: 1, display: 'flex', justifyContent: 'center' }}>
                  <form style={{ width: '100%' }}>
                    {fieldsFaqs.map((field, index) => (
                      <div key={field.id} sx={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                        <TextField
                          {...register(`faqs.${index}.question`, { required: true })}
                          error={errors.faqs && errors.faqs[index]?.question}
                          size="small" label="Pregunta" variant="outlined"
                          sx={{ mb: 1, marginRight: 1, width: '90%' }}
                          onChange={(e) => setValue(`faqs.${index}.question`, e.target.value)}
                        />

                        <IconButton aria-label="delete" onClick={() => removeFaq(index)}>
                          <DeleteIcon />
                        </IconButton>

                        <TextField
                          {...register(`faqs.${index}.response`, { required: true })}
                          error={errors.faqs && errors.faqs[index]?.response}
                          size="small" label="Respuesta" variant="outlined"
                          sx={{ mb: 1, width: '90%' }}
                          multiline rows={2}
                          onChange={(e) => setValue(`faqs.${index}.response`, e.target.value)}
                        />


                      </div>
                    ))}

                    <Button variant="outlined" size='small' onClick={() => appendFaq({ question: "", response: "" })}>Agregar FAQ</Button>
                  </form>
                </div>
              </Grid>
            </Grid> 
                         
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="h6" component="div" sx={{ color: 'black', fontSize: 16, fontWeight: 700, mb: 1, display: 'flex', justifyContent: 'center' }}>
                  Agenda
                </Typography>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <form style={{ width: '100%' }}>
                    {fieldsSections.map((field, index) => (
                      <div key={field.id} sx={{ alignItems: 'center', justifyContent: 'center', mb: 1, display: 'flex' }}>

                        <TextField
                          {...register(`sections.${index}.time`, { required: true })}
                          error={errors.sections && errors.sections[index]?.time}
                          size="small" label="Horario" variant="outlined"
                          sx={{ mb: 1, marginRight: 1, width: '100px' }}
                          onChange={(e) => setValue(`sections.${index}.time`, e.target.value)}
                        />

                        <TextField
                          {...register(`sections.${index}.description`, { required: true })}
                          error={errors.sections && errors.sections[index]?.description}
                          size="small" label="Descripción" variant="outlined"
                          sx={{ mb: 1, width: '65%' }}
                          onChange={(e) => setValue(`sections.${index}.description`, e.target.value)}
                        />

                        <IconButton aria-label="delete" onClick={() => removeSection(index)}>
                          <DeleteIcon />
                        </IconButton>

                      </div>
                    ))}

                    <Button variant="outlined" size='small' onClick={() => appendSection({ time: "", description: "" })}>Agregar sección</Button>
                  </form>
                </div>
              </Grid>


              <Grid item xs={6} sx={{ width: '50%' }}>
                <Typography variant="h6" component="div" sx={{ color: 'black', fontSize: 16, fontWeight: 700, mb: 1, display: 'flex', justifyContent: 'center' }}>
                  Colaboradores autorizados
                </Typography>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <form style={{ width: '100%' }}>
                    {fieldsMails.map((field, index) => (
                      <div key={field.id} sx={{ alignItems: 'center', justifyContent: 'center', mb: 1, display: 'flex' }}>
                        <TextField
                          {...register(`mails.${index}.email`, { required: true })}
                          error={errors.mails && errors.mails[index]?.email}
                          size="small" label="Mail" variant="outlined"
                          sx={{ mb: 1, marginRight: 1, width: '90%' }}
                          onChange={(e) => setValue(`mails.${index}.email`, e.target.value)}
                        />

                        <IconButton aria-label="delete" onClick={() => removeMail(index)}>
                          <DeleteIcon />
                        </IconButton>

                      </div>
                    ))}

                    <Button variant="outlined" size='small' onClick={() => appendMail({ email: "" })}>Agregar colaborador</Button>
                  </form>
                </div>
              </Grid>
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
              </Grid>

              <Grid item sx={{ width: '50%', height: '300px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'right', alignItems: 'center', textAlign: 'center' }}>
                  <div ref={mapContainer} className="mapboxgl-ctrl-top-right"
                    style={{ width: 600, height: 350, marginLeft: '50px', marginTop: '20px', marginRight: '100px' }}
                  />
                </Box>
              </Grid>
              <Box sx={{ width: '100%', marginTop: '200px' }}>
                <Galery />
              </Box>
            </Grid>

            <Grid xs={6} sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <Button variant="contained" onClick={handleSubmit} sx={{
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
