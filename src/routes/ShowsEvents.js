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



  const cards = data.map(item => {
    return (
      <Card
        key={item.id}
        {...item}
      />
    )
  })

  return (

    (data && data.length > 0) ?
        <div>
           <CardEvent />
            {cards}


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
