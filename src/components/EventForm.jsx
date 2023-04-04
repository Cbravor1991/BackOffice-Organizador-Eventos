import React, { useState } from 'react';
import './EventForm.scss';

const EventForm = () => {
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDates, setEventDates] = useState('');

  const handleEventNameChange = (event) => {
    setEventName(event.target.value);
  };

  const handleEventDescriptionChange = (event) => {
    setEventDescription(event.target.value);
  };

  const handleEventLocationChange = (event) => {
    setEventLocation(event.target.value);
  };

  const handleEventDatesChange = (event) => {
    setEventDates(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Event form submitted!');
    console.log('Event Name:', eventName);
    console.log('Event Description:', eventDescription);
    console.log('Event Location:', eventLocation);
    console.log('Event Dates:', eventDates);
  };

  return (
    <div className="event-form-container">
      <h1 className="event-form-header">Create Event</h1>
      <form onSubmit={handleSubmit}>
        <div className="event-form-field">
          <label htmlFor="eventName" className="event-form-label">
            Event Name
          </label>
          <input
            type="text"
            id="eventName"
            className="event-form-input"
            value={eventName}
            onChange={handleEventNameChange}
            placeholder="Enter event name"
          />
        </div>
        <div className="event-form-field">
          <label htmlFor="eventDescription" className="event-form-label">
            Event Description
          </label>
          <textarea
            id="eventDescription"
            className="event-form-input"
            value={eventDescription}
            onChange={handleEventDescriptionChange}
            placeholder="Enter event description"
          />
        </div>
        <div className="event-form-field">
          <label htmlFor="eventLocation" className="event-form-label">
            Event Location
          </label>
          <input
            type="text"
            id="eventLocation"
            className="event-form-input"
            value={eventLocation}
            onChange={handleEventLocationChange}
            placeholder="Enter event location"
          />
        </div>
        <div className="event-form-field">
          <label htmlFor="eventDates" className="event-form-label">
            Event Dates
          </label>
          <input
            type="text"
            id="eventDates"
            className="event-form-input"
            value={eventDates}
            onChange={handleEventDatesChange}
            placeholder="Enter event dates"
          />
        </div>
        <button type="submit" className="event-form-button">
          Create
        </button>
      </form>
    </div>
  );
};

export default EventForm;
