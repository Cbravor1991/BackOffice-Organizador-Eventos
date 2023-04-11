import React from 'react';
import { useRef, useState } from "react";
import './CreateEventForm.scss';
import axios from '../api/axios';
import swal from "sweetalert2";
import './swal.css';



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
  const [capacity, setCapacity] = useState(props.capacity);
  const [vacancies, setVacancies] = useState('');
  const [direction, setDirection] = useState(props.direction);
  const [latitude, setLatitude] = useState(props.latitude);
  const [length, setLength] = useState(props.length);
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const minDate = tomorrow.toISOString().split('T')[0];


  sessionStorage.setItem("event_id", id_event);
 
  console.log (length);
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    let token_user;
   // window.localStorage.setItem("token", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjaHJpc3RpYW4uZml1YmFAZ21haWwuY29tIiwiZXhwIjoxNjgxMDc2MDQyfQ.Wh-28x-wKNO3P6QJ3rt2wq8fLb4C6XSB4TJF3NFPRDE' )

        
    if (!window.localStorage.getItem("token")){
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
      params: {'': ''},
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token_user}`
      },
      data: {
        "id": props.id,
        "title": title,
        "category": category,
        "date": date,
        "description": description,
        "direction": direction,
        "latitude": 0,
        "capacity": capacity,
        "length": 0,
        "vacancies": 0
      }
    };
    
    axios.request(options).then(function (response) {
      console.log(response.data);
    }).catch(function (error) {
      console.error(error);
    }); 


  sessionStorage.setItem("event_id", id_event);
  window.localStorage.setItem("foto_actualizada", false)

 swal.fire({
  title: "Has modificado tu evento correctamente",
  icon: "success",
  customClass: {
    container: 'spotify-modal-container',
    popup: 'spotify-modal-popup',
    title: 'spotify-modal-title',
    content: 'spotify-modal-content',
    confirmButton: 'spotify-modal-button',
    cancelButton: 'spotify-modal-button'
  },
  showCancelButton: true,
  showCloseButton: true,
  cancelButtonText: "Agregar o quitar fotos de mi evento",
  confirmButtonText: "Ir a mis eventos"
}).then(function(result) {
  if (result.isConfirmed) {
    window.location.href = "http://localhost:3000/showEvents";
  } else if (result.isDismissed) {
    window.location.href = "http://localhost:3000/editGallery";
  }
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

  
  const loadImages = () => {
      window.location.href = "/editGallery";
  }


  const onReturn = () => {
    window.location.href = "/showEvents";
  } 


  /*------------------------------------------------------------------------------------------------------------------------*/
  return (
    <div>
    <form className="create-event-form"  onSubmit={handleSubmit}>
       <h2 className="form-title">Editar evento</h2>
      <div className="form-group">
        <label htmlFor="title">Nombre del evento</label>
        <input type="text" id="title" name="event-name" onChange={(e) => setTitle(e.target.value)}
                            value={title}
                            required />
      </div>
      <div className="form-group">
        <label htmlFor="category">Categoría</label>
        <select id="category" name="category" value = {category} onChange={(e) => setCategory(e.target.value)} required  >
        <option value="">Seleccionar categoría</option>
            <option value="Evento deportivo" style={{ color: 'black' }}>Evento deportivo</option>
            <option value="Cena o gala" style={{ color: 'black' }}>Cena o gala</option>
            <option value="Clase, curso o talle" style={{ color: 'black' }}>Clase, curso o talle</option>
            <option value="Performance" style={{ color: 'black' }}>Performance</option>
            <option value="Conferencia" style={{ color: 'black' }}>Conferencia</option>
            <option value="Encuentro" style={{ color: 'black' }}>Encuentro</option>
            <option value="Networking" style={{ color: 'black' }}>Networking</option>
            <option value="Feria" style={{ color: 'black' }}>Feria</option>
            <option value="Festival" style={{ color: 'black' }}>Festival</option>
            <option value="Fiesta" style={{ color: 'black' }}>Fiesta</option>
            <option value="Competencia" style={{ color: 'black' }}>Competencia</option>
            <option value="Promoción" style={{ color: 'black' }}>Promoción</option>
            <option value="Seminario" style={{ color: 'black' }}>Seminario</option>
            <option value="Show" style={{ color: 'black' }}>Show</option>
            <option value="Torneo" style={{ color: 'black' }}>Torneo</option>
            <option value="Visita" style={{ color: 'black' }}>Visita</option>
            <option value="Otro" style={{ color: 'black' }}>Otro</option>

        </select>
      </div>
      <div className="form-group">
  <label htmlFor="date">Fecha</label>
  <input type="date" id="date" name="date" onChange={(e) => setDate(e.target.value)} value={date || ''} min={minDate} />
  </div>
      <div className="form-group">
        <label htmlFor="description">Descripción</label>
        <textarea id="description" name="description" onChange={(e) => setDescription(e.target.value)}
                            value={description} rows="4"></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="capacity">Cantidad de tickets</label>
        <input type="number" id="capacity" name="capacity" min="0" onChange={(e) => setCapacity(e.target.value)}
                            value={capacity}
                            required />
      </div>
      <div className="form-group">
        <label htmlFor="direction">Dirección</label>
        <input type="text" id="direction" name="direction" onChange={(e) => setDirection(e.target.value)}
                            value={direction}
                            required />
      </div>
      {/*<div className="form-group">
        <label htmlFor="latitude">Latitud</label>
        <input type="number" id="latitude" name="latitude" min="0" step="1" onChange={(e) => setLatitude(e.target.value)}
                            value={latitude}
                            required />
      </div>
      <div className="form-group">
        <label htmlFor="length">Longitud</label>
        <input type="number" id="length" name="length" min="0" step="1" onChange={(e) => setLength(e.target.value)}
                            value={length}
                            required />
  </div>*/}
      <div className="form-group">
        <label htmlFor="location">Edita las fotos de tu evento</label>
        <div className="location-map">
        <button type="button" onClick={(e) => {loadImages()}}>Editar galería</button>
        <button type="button" onClick={(e) => {onReturn()}}>Volver</button>
        </div>
  </div>
  <div className="form-actions">
        
        <button type="submit" >Guardar cambios</button>
      </div>
    </form>
    </div>
  );
}

export default EditEvent;
