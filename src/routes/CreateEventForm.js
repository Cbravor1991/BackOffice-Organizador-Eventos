import React from 'react';
import { useRef, useState } from "react";
import './CreateEventForm.scss';
import axios from '../api/axios';
import swal from "sweetalert2";
import './swal.css';


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
  const [length, setLength] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    console.log("hola")
  console.log (title);
  console.log (category);
  console.log (date);
  console.log (description);
  console.log (capacity);
  //console.log (vacancies);
  console.log (direction);
  console.log (latitude);
  console.log (length);
  
    // if button enabled with JS hack floors

    let token_user;
    window.localStorage.setItem("token", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjaHJpc3RpYW4uZml1YmFAZ21haWwuY29tIiwiZXhwIjoxNjgxMDc2MDQyfQ.Wh-28x-wKNO3P6QJ3rt2wq8fLb4C6XSB4TJF3NFPRDE' )

    
    
    if (!window.localStorage.getItem("token")){
      console.log("no autorizado")
      window.location.href = "/home";
      return;
  } else {
    token_user = window.localStorage.getItem("token");
  }
 

 

  try {
    const response = await axios.post('event/create',
        JSON.stringify({
            "title": title,
            "category": category,
            "date": date,
            "description": description,
            "capacity": capacity,
            "vacancies": 0,
            "ubication": {
              "direction": direction,
              "latitude": 0,
              "length": 0
            }
          }),
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token_user}`
              }
        }
       
    );
    console.log(response.status);
    sessionStorage.setItem("event_id", response.data.id);
    
    swal.fire({
      title: "Has creado tu evento correctamente, ¿qué deseas hacer?",
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
      cancelButtonText: "Agregar fotos a mi evento",
      confirmButtonText: "Ir a mis eventos"
    }).then(function(result) {
      if (result.isConfirmed) {
        window.location.href = "http://localhost:3000/showEvents";
      } else if (result.isDismissed) {
        window.location.href = "http://localhost:3000/imageLoader";
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



  /*------------------------------------------------------------------------------------------------------------------------*/
  return (
    <form className="create-event-form"  onSubmit={handleSubmit}>
       <h2 className="form-title">Crear evento</h2>
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
          <option value="musica">Música</option>
          <option value="arte">Arte</option>
          <option value="teatro">Teatro</option>
          <option value="deporte">Deporte</option>
        </select>
      </div>
      <div className="form-group">
  <label htmlFor="date">Fecha</label>
  <input type="date" id="date" name="date" onChange={(e) => setDate(e.target.value)} value={date || ''} />
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
      </div>
      <div className="form-group">
        <label htmlFor="location">Ubicación</label>
        <div className="location-map">
          <p>Mapa de ubicación aquí</p>
        </div>
  </div>*/}
  <div className="form-actions">
        <button type="submit" >Crear evento</button>
      </div>
    </form>
  );
}

export default CreateEventForm;
