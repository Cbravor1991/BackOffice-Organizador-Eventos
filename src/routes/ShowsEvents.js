import React from 'react';
import { Link } from "react-router-dom";
import data from '../data/dataPropiedad';
import Card from "../components/Card"
import CardEvent from "../components/CardEvent"








const ShowsEvents = () => {
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

export default ShowsEvents