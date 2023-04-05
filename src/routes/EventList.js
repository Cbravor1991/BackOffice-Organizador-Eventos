import React, { Component } from 'react';
import './EventList.scss';

class EventList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [
        {
          name: 'Concierto de rock',
          date: '05/05/2023',
          location: 'Teatro Nacional'
        },
        {
          name: 'Festival de cine',
          date: '10/06/2023',
          location: 'Cinepolis'
        },
        {
          name: 'Exposición de arte',
          date: '20/07/2023',
          location: 'Museo de Arte Moderno'
        }
      ]
    };
  }

  render() {
    return (
      <div className="event-list">
        <ul>
          {this.state.events.map((event, index) => (
            <li key={index}>
              <h3>{event.name}</h3>
              <p>{event.date}</p>
              <p>{event.location}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default EventList;