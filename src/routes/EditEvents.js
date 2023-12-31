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
//import Galery from '../components/Galery';
import Galery from '../components/Update_Galery';
import { format } from 'date-fns';
import Modal from '@mui/material/Modal';
import AddAlertIcon from '@mui/icons-material/AddAlert';

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

  let stored_event = JSON.parse(window.localStorage.getItem("cache_edit"));
  console.log("storesd =>",stored_event)
  let cover_id = window.localStorage.getItem("cache_cover_id");

  console.log(stored_event);

  const userRef = useRef();
  const errRef = useRef();
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationDescription, setNotificationDescription] = useState('');

  const [error, setError] = useState(false);
  const [id_event, setEventID] = useState(stored_event.Event.id);
  const [title, setTitle] = useState(stored_event ? stored_event.Event.title : '');
  const [category, setCategory] = useState(stored_event ? stored_event.Event.category : '');
  const [initDate, setInitDate] = useState(stored_event ? stored_event.Event.init_date : '');
  const [endDate, setEndDate] = useState(stored_event ? stored_event.Event.end_date : '');
  const [description, setDescription] = useState(stored_event ? stored_event.Event.description : '');
  const [capacity, setCapacity] = useState(stored_event ? stored_event.Event.capacity : '');
  const [vacancies, setVacancies] = useState(stored_event.Event.capacity);
  const [direction, setDirection] = useState(stored_event ? stored_event.Event.direction : '');
  const [latitude, setLatitude] = useState(stored_event ? stored_event.Event.latitude : -34.599722222222);
  const [longitude, setLongitude] = useState(stored_event ? stored_event.Event.longitude : -58.381944444444);
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  let minDate = tomorrow.toISOString();
 const [editorState, setEditorState] = useState(description === '' ? () => EditorState.createEmpty() : EditorState.createWithContent(convertFromRaw(JSON.parse(description))));
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [zoom, setZoom] = useState(7);
  const [preguntas, setPreguntas] = useState([]);
  const [state, setState] = useState(stored_event ? stored_event.Event.state : '');
  const { register, control, formState: { errors }, getValues, setValue } = useForm({ defaultValues: 
     { 
       sections: stored_event ? stored_event.Diary : [{ time: "", description: "" }],
      mails: stored_event ? stored_event.Authorizers : [{ email: "" }],
      faqs: stored_event ? stored_event.FAQ : [{ question: "", response: "" }]
     }
    });
  const { fields: fieldsSections, append: appendSection, remove: removeSection } = useFieldArray({ control, name: "sections" });
  const { fields: fieldsMails, append: appendMail, remove: removeMail } = useFieldArray({ control, name: "mails" });
  const { fields: fieldsFaqs, append: appendFaq, remove: removeFaq } = useFieldArray({ control, name: "faqs" });


  let token_user = window.localStorage.getItem("token");

 
  useEffect(() => {
    window.localStorage.setItem("cache_images", JSON.stringify(stored_event.Images));
  }, []); 


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


  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState);
    setDescription(JSON.stringify(convertToRaw(editorState.getCurrentContent())));

  };

  const toolbarOptions = {

  };


  const handleInitDateChange = (e) => {
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
      setInitDate(format(selectedDate, 'yyyy-MM-dd HH:mm'));
    }
  };


  const handleEndDateChange = (e) => {
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
      setEndDate(format(selectedDate, 'yyyy-MM-dd HH:mm'));
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


  const handleCancel = async (e) => {
    //window.localStorage.setItem("cache_event", null);
    window.location.href = '/eventList'
  }

  const sendNotification = async (e) => {
    e.preventDefault();

    const params = new URLSearchParams([['event_id', id_event]]);
    var options = {
      method: 'POST',
      url: 'organizer/event/notify',
      params: params,
      data: {
        "title": notificationTitle, 
        "description": notificationDescription
      }
    };
    api.request(options).then(response => {
      handleSubmit(e);
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = getValues();
    
    let images = JSON.parse(window.localStorage.getItem("cache_images"));
    console.log(images);
    images = images.filter(photo => photo.link !== null);    
    window.localStorage.setItem("cache_images", JSON.stringify(images));

    try {
      var options = {
        method: 'PUT',
        url: '/organizer/event',
        data: {
          "id": id_event,
          "title": title,
          "category": category,
          "init_date": initDate,
          "end_date": endDate,
          "description": description,
          "direction": direction,
          "latitude": latitude,
          "longitude": longitude,
          "capacity": capacity,
          "agenda" : formData.sections,
          "faqs" : formData.faqs,
          "images" : images,
          "vacancies": vacancies,
        }
      };

      api.request(options)
        .then(function (response) {
        
         window.localStorage.setItem("event_id", id_event);
         let cover = window.localStorage.getItem("cache_cover");

         if(cover == 'null'){
          if (images.length>0){
            cover = images[0].link
          }else {
            cover = 'https://firebasestorage.googleapis.com/v0/b/ticketapp-64209.appspot.com/o/44444.png?alt=media&token=d07be113-b878-4529-a5e3-29f0af4fe576'
          }
         }
         
         api.post(
          'organizer/event/cover/pic',
          JSON.stringify({
            "link": cover, 
            "event_id": id_event
          })
        );
        window.location.href = "/eventList";

        }).catch(function (error) {
          console.error(error);
        });

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


  const requiredFieldsMissing = () => {
    return title === '' || category === '' || initDate === '' || description === '' || direction === '';
  }


  const prepareEvent = () => {
    const formData = getValues();
    let images = JSON.parse(window.localStorage.getItem("cache_images"));

    const event = {
      "title": title,
      "category": category,
      "init_date": initDate,
      "end_date": endDate,
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
  
  
  const handlePublished = () => {
  
    if (requiredFieldsMissing()) {
      swal.fire({
        title: "Dejaste campos sin completar",
        text: "Recuerda que para cargar imagenes debes llenar los campos previos",
        icon: "warning",
        confirmButtonText: 'Entendido',
      })
      return;
    }
    
    const event = prepareEvent();
  
    window.localStorage.setItem("cache_edit_draft", JSON.stringify(event));
    window.location.href = '/previewDraft'
  
  }


  const handleEditPhotos = () => {

    window.localStorage.setItem("event_id", id_event);

    const formData = getValues();

    const event = {
     "id": id_event, 
     "Event": {
      "title": title,
      "category": category,
      "init_date": initDate,
      "end_date": endDate,
      "description": description,
      "capacity": capacity,
      "direction": direction,
      "latitude": latitude,
      "longitude": longitude 
      },
     "Diary": formData.sections,
     "FAQ": formData.faqs,
     "Authorizers": formData.mails,
     "Images": []
    };

    window.localStorage.setItem("cache_edit", JSON.stringify(event));
    
    window.location.href = "/updatePhotoGallery";

  }
  

  /*------------------------------------------------------------------------------------------------------------------------*/
  return (

    <ThemeProvider theme={theme}>

      <Navbar />
      <Box sx={{ border: '5px solid black', padding: '20px' }}>
        <Typography variant="h6" component="div" sx={{ color: 'black', fontSize: 16, fontWeight: 700, mb: 2, display: 'flex', justifyContent: 'center' }}>
          Editar evento
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
                    Fecha y hora de inicio del evento
                  </Typography>
                  
                  <TextField fullWidth sx={{ width: '70%', color: 'black', fontSize: 16, fontWeight: 700, mb: 2, display: 'flex', justifyContent: 'center', marginTop: '20px' }}
                    type="datetime-local" id="date" name="date" onChange={handleInitDateChange} value={initDate || ''} min={minDate = new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]} />
                  
                  <Typography variant="h6" component="div" sx={{ width: '50%', color: 'black', fontSize: 16, fontWeight: 700, display: 'flex', justifyContent: 'center' }}>
                    Fecha y hora de fin del evento
                  </Typography>
                  
                  <TextField fullWidth sx={{ width: '70%', color: 'black', fontSize: 16, fontWeight: 700, mb: 2, display: 'flex', justifyContent: 'center', marginTop: '20px' }}
                    type="datetime-local" id="date" name="date" onChange={handleEndDateChange} value={endDate || ''} min={minDate = new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]} />
                  
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

           <Grid container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            
              <Grid item xs={2}>
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
                    
              <Grid item xs={2}>
                <Button variant="contained" onClick={handleOpenModal} sx={{
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
                }}>Guardar
               </Button>
               <Modal
                  open={openModal}
                  onClose={handleCloseModal}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={{  
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 500,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                  }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                      <AddAlertIcon sx={{ m:1 }} />
                      ¿Desea enviar una <strong>notificación</strong> de los cambios a los usuarios inscriptos?
                    </Typography>
                    
                    <TextField 
                      inputProps={{ maxLength: 50 }}
                      error={notificationTitle.length === 50}
                      fullWidth
                      sx={{ m: 1 }}
                      label="Titulo"
                      value={notificationTitle}
                      onChange={(e) => setNotificationTitle(e.target.value)} 
                    />
                    <TextField 
                      inputProps={{ maxLength: 200 }}
                      error={notificationDescription.length === 200}
                      fullWidth
                      sx={{ m: 1 }}
                      label="Descripción"
                      value={notificationDescription}
                      onChange={(e) => setNotificationDescription(e.target.value)}
                      multiline rows={3}
                      size="small"
                    />
                    <Grid container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                      <Grid item xs={7}>
                      <Button onClick={handleSubmit}>Guardar sin notificación</Button>
                      </Grid>
                      <Grid item xs={5}>
                      <Button onClick={sendNotification}>Enviar y guardar</Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Modal>
              </Grid>
              
              <Grid item xs={2}>
                <Button variant="contained" onClick={handlePublished} 
                 disabled={state==="published"}
                 sx={{
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
                }}> Publicar &#10095;
               </Button>
              </Grid>


            </Grid>

            <Divider />
          </Stack>

        </Stack>
      </Box>



    </ThemeProvider>
  );
}

export default EditEvent;
