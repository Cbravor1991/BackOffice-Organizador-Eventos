import React from 'react';
import { useRef, useState } from "react";
import './CreateEventForm.scss';
import axios from '../api/axios';

const CreateEventForm = () => {
  const userRef = useRef();
  const errRef = useRef();
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
    window.localStorage.setItem("token", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjYnJhdm9yQGZpLnViYS5hciIsImV4cCI6MTY4MDY3NDU5N30.3pBK_k-ySKDrsw85MbdJO5g5tvn0XTBsPZ2NQiWuB5U' )

    
    
    if (!window.localStorage.getItem("token")){
      console.log("no autorizado")
      window.location.href = "/home";
      return;
  } else {
    token_user = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjYnJhdm9yQGZpLnViYS5hciIsImV4cCI6MTY4MDY3NTcyMn0.jcjO5SqhlqfkJN2-_ETUR4Q6PC7vL3-CKC3cQE80X1I'
  }
 
  try{  
    const response = await axios.post('/event/create',
            JSON.stringify({
              "title": "evento tres",
              "category": "string",
              "date": "2023-04-05",
              "description": "string",
              "capacity": 0,
              "vacancies": 0,
              "ubication": {
                "direction": "string",
                "latitude": 0,
                "length": 0
              }
            }),
            {
                headers: { 'Content-Type': 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjaHJpc3RpYW4uZml1YmFAZ21haWwuY29tIiwiZXhwIjoxNjgwNjgzOTkyfQ.Q_uYqfAoMtSPThpb2F0pEFG8LouBg5ZZvvmBZFjZMnM',
                 }
            },

        );} catch (err) {
  if (!err?.response) {
      setErrMsg('No hay respuesta del servidor');
  } else if (err.response?.status === 400) {
      setErrMsg('error del tipo 400');
  } else {
      setErrMsg('el registro fallo')
  }
  errRef.current.focus();

  setErrMsg(null)  
}


   /* 


    try {
    
         const response = await axios.post('/createProperty',
            JSON.stringify({
                'direction': direccion, 'province': provincia,  'location': localidad,
                'country': pais, 'toilets': banios, 'rooms': habitaciones, 'people': personas, 'description': descripcion,
                "images":  links, 'email_user': username
            }),
            {
                headers: { 'Content-Type': 'application/json' }
            },

        );
        setSuccess(true);
       
        //console.log(JSON.stringify(response?.data));
        //console.log(JSON.stringify(response))
            
          

        //clear state and controlled inputs

    } catch (err) {
        if (!err?.response) {
            setErrMsg('No hay respuesta del servidor');
        } else if (err.response?.status === 400) {
            setErrMsg('error del tipo 400');
        } else {
            setErrMsg('el registro fallo')
        }
        errRef.current.focus();

        setErrMsg(null)  
    }*/
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
      <div className="form-group">
        <label htmlFor="latitude">Latitud</label>
        <input type="number" id="latitude" name="latitude" min="0" step="0.01" onChange={(e) => setLatitude(e.target.value)}
                            value={latitude}
                            required />
      </div>
      <div className="form-group">
        <label htmlFor="length">Longitud</label>
        <input type="number" id="length" name="length" min="0" step="0.01" onChange={(e) => setLength(e.target.value)}
                            value={length}
                            required />
      </div>
      {/* <div className="form-group">
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
