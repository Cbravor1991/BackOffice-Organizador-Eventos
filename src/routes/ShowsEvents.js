import React, { useEffect, useState } from 'react';
import data from '../data/dataEvents';
import Card from "../components/Card";
import CardEvent from "../components/CardEvent";
import axios from '../api/axios';



const ShowsEvents = () => {
  const [publications, setPublications] = useState([]);
  const [cardAmount, setCardAmount] = useState(0);

  const loadPublications = () => {
    let token_user;
    //window.localStorage.setItem("token", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjaHJpc3RpYW4uZml1YmFAZ21haWwuY29tIiwiZXhwIjoxNjgxMDc2MDQyfQ.Wh-28x-wKNO3P6QJ3rt2wq8fLb4C6XSB4TJF3NFPRDE');
    /*if (!window.localStorage.getItem("token")){
      console.log("no autorizado")
      window.location.href = "/home";
      return;
    } else {
      token_user = window.localStorage.getItem("token");
      console.log("aca entro")
    }*/
    //console.log(window.localStorage.getItem("token"));
    
    token_user = (window.localStorage.getItem("token"));
    console.log(token_user);
    axios.get('/organizer/events', {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token_user}`
        }
    })
    .then((response) => {
      setPublications(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
  }


  useEffect(() => {
    loadPublications();
  }, []);
  

useEffect(() => {
    // Aplicar el estilo al body cuando el componente se monta
    document.body.style.backgroundColor = 'black';
    document.body.style.color = 'white';
    // Limpiar el estilo del body cuando el componente se desmonta
    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    }
  }, []);


/*  const cards = data.map(item => {
    return (
      <Card
        key={item.id}
        {...item}
      />
    )
  })*/


  const cards = publications.slice(0, cardAmount).map(item => {
    return (
      <Card
        key={item.id}
        {...item}
      />
    )
  })



  return (

    /*(data && data.length > 0) ?
      (publications && publications.length > 0) ?
        <div>
           <CardEvent />
            {cards}


        </div>
        :  <div>

        <CardEvent/>


      </div>*/
      
      
    (publications && publications.length > 0) ?
    <div>
    <CardEvent />
  

    <div className="shows-events">
      
      <div className="card-amount-container" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', fontSize: '14px' }}>
        <label htmlFor="card-amount" style={{ fontWeight: 'bold', color: 'white', fontSize: 22, fontWeight: 400 }}>Cantidad de eventos:</label>
        <select id="card-amount" value={cardAmount} onChange={(e) => setCardAmount(parseInt(e.target.value))} style={{ padding: '5px', borderRadius: '15px', border: '', backgroundColor: '#282828', color: '#b3b3b3', fontWeight: 'bold', cursor: 'pointer' }}>
        <option value="0">Seleccionar</option>
          <option value="1">1</option>
          <option value="5">5</option>
          <option value="10">10</option>
        </select>
      </div>
      <div className="card-container">
        {cards}
      </div>
    </div>
    
    </div> 
  :  <div>

  <CardEvent/>
  </div>  
  


  )
}

export default ShowsEvents;

{/*}  (data && data.length > 0) ?
        <div>
           <CardEvent />
            {cards}


        </div>
        :  <div>

        <CardEvent/>


      </div>*/}
