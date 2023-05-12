import * as React from 'react';
import { api } from '../api/axios';
import { useRef, useState, useEffect } from 'react';
import { Select, MenuItem } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Button, Divider, Typography, TextField } from '@mui/material';
import { Backdrop, CircularProgress } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material';
import swal from 'sweetalert2';
import Navbar from '../components/NavBar';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useForm, useFieldArray } from 'react-hook-form';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Galery from '../components/Galery';
import { format } from 'date-fns';


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
  let stored_event = JSON.parse(window.localStorage.getItem('cache_event'));

  const [error, setError] = useState();
  const [title, setTitle] = useState(stored_event ? stored_event.title : '');
  const [category, setCategory] = useState(stored_event ? stored_event.category : '');
  const [date, setDate] = useState(stored_event ? stored_event.date : '');
  const [description, setDescription] = useState(stored_event ? stored_event.description : '');
  const [capacity, setCapacity] = useState(stored_event ? stored_event.capacity : '');
  const [direction, setDirection] = useState(stored_event ? stored_event.ubication.direction : '');
  const [latitude, setLatitude] = useState(stored_event ? stored_event.ubication.latitude : -34.599722222222);
  const [longitude, setLongitude] = useState(stored_event ? stored_event.ubication.longitude : -58.381944444444);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState(stored_event ? stored_event.state : 'draft');
  
    
  const { register, control, formState: { errors }, getValues, setValue } = useForm({
    defaultValues:
    {
      sections: stored_event ? stored_event.agenda : [{ time: "", description: "" }],
      mails: stored_event ? stored_event.authorizers : [{ email: "" }],
      faqs: stored_event ? stored_event.faqs : [{ question: "", response: "" }]
    }
  });
  const { fields: fieldsSections, append: appendSection, remove: removeSection } = useFieldArray({ control, name: "sections" });
  const { fields: fieldsMails, append: appendMail, remove: removeMail } = useFieldArray({ control, name: "mails" });
  const { fields: fieldsFaqs, append: appendFaq, remove: removeFaq } = useFieldArray({ control, name: "faqs" });

  const mapContainer = useRef(null);
  const [zoom, setZoom] = useState(7);

  const [editorState, setEditorState] = useState(description === '' ? () => EditorState.createEmpty() : EditorState.createWithContent(convertFromRaw(JSON.parse(description))));
  const today = new Date();
  
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  let minDate = tomorrow.toISOString();

  let cover = window.localStorage.getItem("cache_cover");


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
      zoom: zoom,
      attributionControl: false
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


  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const currentDate = new Date();

    if (selectedDate < currentDate) {
      swal.fire({
        title: "Elegí otra fecha",
        text: "Recuerda que la proxima fecha disponible es el " + new Date(minDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }),
        icon: "warning",
        confirmButtonText: 'Entendido',
      })

    } else {
      console.log(selectedDate.toISOString());
      console.log(format(selectedDate, 'yyyy-MM-dd hh:mm'));
      setDate(format(selectedDate, 'yyyy-MM-dd hh:mm'));
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


  const handleCancel = async (e) => {
    window.localStorage.setItem("cache_event", null);
    window.location.href = '/eventList'
  }


  const requiredFieldsMissing = () => {
    return title === '' || category === '' || date === '' || description === '' || direction === '';
  }
  
  
  const requiredFieldsMissingDraft = () => {
    return title === '' || capacity === '' || date === '';
  }
  
  
  const prepareEvent = () => {
    const formData = getValues();
    let images = JSON.parse(window.localStorage.getItem("cache_images"));

    const event = {
      "title": title,
      "category": category,
      "date": date,
      "description": description,
      "capacity": capacity,
      "ubication": {
        "direction": direction,
        "latitude": latitude,
        "longitude": longitude
      },
      "state": state,
      "agenda": formData.sections,
      "faqs": formData.faqs,
      "authorizers": formData.mails,
      "images": images
    };
   
   return event;  
  }
  
  
  const handleSubmitDraft = async (e) => {
     if (requiredFieldsMissingDraft()) {
      swal.fire({
        title: "Dejaste campos sin completar",
        text: "Para guardar el borrador debes completar como mínimo título, fecha y capacidad",
        icon: "warning",
        confirmButtonText: 'Entendido',
      })
      return;
    }
  
    setLoading(true);
    e.preventDefault();
    setState("draft");
    
    const event = prepareEvent(); 

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


  const handleCreate = async (e) => {
  
    if (requiredFieldsMissing()) {
      swal.fire({
        title: "Dejaste campos sin completar",
        text: "Recuerda que para cargar imagenes debes llenar los campos previos",
        icon: "warning",
        confirmButtonText: 'Entendido',
      })
      return;
    }
  
    e.preventDefault();

    const event = prepareEvent(); 

    window.localStorage.setItem("cache_event", JSON.stringify(event));
    window.location.href = '/preview'
  }


  return (

    <ThemeProvider theme={theme}>

      <Navbar />

      <Typography variant="h5" component="div" sx={{ marginTop: '20px', color: 'black', fontSize: 20, fontWeight: 700, display: 'flex', justifyContent: 'center' }}>
        Crear evento
      </Typography>

      <Grid sx={{ display: 'flex', justifyContent: 'center', padding: '100px', paddingTop: '20px', paddingBottom: '30px' }}>
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
                <TextField size="small" error={error} fullWidth sx={{ m: 1 }} label="Nombre del evento" variant="outlined" value={title} onChange={(e) => setTitle(e.target.value)} />
              </Grid>

              <Grid item xs={6}>
                <FormControl sx={{ m: 1, width: '90%' }}>
                  <InputLabel size="small" id="demo-simple-select-label">Categoría</InputLabel>
                  <Select
                    size="small"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={category}
                    label="Tipo de evento"
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    
                    <MenuItem sx={{ color: 'black' }} value="Cena o gala">Cena o gala</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Clase, curso o taller">Clase, curso o taller</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Competencia">Competencia</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Conferencia">Conferencia</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Encuentro">Encuentro</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Evento deportivo">Evento deportivo</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Feria">Feria</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Festival">Festival</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Fiesta" >Fiesta</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Networking">Networking</MenuItem>
                    <MenuItem sx={{ color: 'black' }} value="Performance">Performance</MenuItem>
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
              <Grid item xs={6}>

                <Typography variant="h6" component="div" sx={{ color: 'black', fontSize: 16, fontWeight: 700, display: 'flex', justifyContent: 'center' }}>
                  Descripción
                </Typography>
                <Box sx={{ border: '0.5px solid black', height: '300px', overflow: 'auto', borderRadius: '10px' }}>
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
                    Fecha y hora del evento
                  </Typography>
                  <TextField fullWidth sx={{ width: '70%', color: 'black', fontSize: 16, fontWeight: 700, mb: 1, display: 'flex', justifyContent: 'center', marginTop: '20px' }}
                    type="datetime-local" id="date" name="date" onChange={handleDateChange} value={date || ''} min={minDate = new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]} />
                  <Typography variant="h6" component="div" sx={{ width: '50%', color: 'black', fontSize: 16, fontWeight: 700, display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    Cantidad de tickets
                  </Typography>
                  <TextField fullWidth sx={{ width: '50%', color: 'black', fontSize: 16, fontWeight: 700, mb: 1, display: 'flex', justifyContent: 'center', marginTop: '20px' }}
                    type="number" label="Cantidad de tickets" value={capacity} variant="outlined" onChange={handleDateChangeTickets} />
                </Box>

              </Grid>

              <Grid item sx={{ width: '50%', height: '300px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'right', alignItems: 'center', textAlign: 'center' }}>
                  <div ref={mapContainer} className="map-container"
                    style={{ width: 600, height: 350, marginLeft: '50px', marginTop: '20px', marginRight: '100px' }}
                  />
                </Box>
              </Grid>

              <Box sx={{ width: '100%', marginTop: '200px' }}>
                <Galery  />
              </Box>
            </Grid>


            <Grid container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
             <CardActions sx={{ display: 'flex', justifyContent: 'center', pt: 0 }}>
              <Grid item xs={2}  sx={{ display: 'flex', justifyContent: 'left'}}>
                <Button variant="contained" onClick={handleCancel} sx={{
                  backgroundColor: '#1286f7',
                  border: 'none',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  padding: '10px 20px',
                  borderRadius: '30px',
                  width: '200px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease-in-out'
                }}>
                  &#10094; Volver
                </Button>
              </Grid>
              
               <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'center'}}>
                <Button variant="contained" onClick={handleSubmitDraft} sx={{
                  backgroundColor: '#1286f7',
                  border: 'none',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  padding: '10px 20px',
                  borderRadius: '30px',
                  width: '200px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease-in-out'
                }}>
                  Guardar borrador
                </Button>
              </Grid>
              
              <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
                onClick={() => setLoading(false)}
                >
               <CircularProgress color="inherit" />
             </Backdrop>

              <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'right'}}>
                <Button variant="contained" onClick={handleCreate} sx={{
                  backgroundColor: '#1286f7',
                  border: 'none',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  padding: '10px 20px',
                  borderRadius: '30px',
                  width: '200px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease-in-out'
                }}>
                  &#10095; Publicar
                </Button>
              </Grid>
             </CardActions> 
            </Grid>


            <Divider />

          </Stack>
        </Stack>
      </Grid>
    </ThemeProvider>

  )
}

export default CreateEventForm

