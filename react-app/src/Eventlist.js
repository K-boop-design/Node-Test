import React, { useState, useEffect } from 'react';

const EventList = () => {
  const [eventForms, setEventForms] = useState([]);

  useEffect(() => {
    const fetchEventForms = async () => {
      try {
        const response = await fetch('http://localhost:3001/events/all');
        const data = await response.json();
        console.log(data,'Events');
        setEventForms(data);
      } catch (error) {
        console.error('Error fetching event forms:', error);
      }
    };

    fetchEventForms();
  }, []);

  return (
    <div>
      <h2>All Saved Events</h2>
      {eventForms.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul>
          {eventForms.map((event, index) => (
            <li key={index}>
              <strong>Name:</strong> {event.name}<br />
              <strong>Description:</strong> {event.description}<br />
              <strong>Start Date:</strong> {event.startDate}<br />
              <strong>End Date:</strong> {event.endDate}<br />
             
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventList;
