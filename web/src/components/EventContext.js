import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api'; // Your API instance
import { socket } from '../socket'; // Your shared socket instance

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. Initial Data Fetch ---
  // This runs once when the application first loads to get the current event list.
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await api.get('/events');
        setEvents(response.data);
      } catch (error) {
        console.error("Failed to fetch initial events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // --- 2. Real-Time Listeners ---
  // This sets up the listeners to keep the data synchronized.
  useEffect(() => {
    const onEventCreated = (newEvent) => {
      setEvents(prevEvents => [newEvent, ...prevEvents]);
    };
    const onEventUpdated = (updatedEvent) => {
      setEvents(prevEvents => 
        prevEvents.map(event => event._id === updatedEvent._id ? updatedEvent : event)
      );
    };
    const onEventDeleted = (eventId) => {
      setEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));
    };

    socket.on('eventCreated', onEventCreated);
    socket.on('eventUpdated', onEventUpdated);
    socket.on('eventDeleted', onEventDeleted);

    // Clean up listeners when the component unmounts
    return () => {
      socket.off('eventCreated', onEventCreated);
      socket.off('eventUpdated', onEventUpdated);
      socket.off('eventDeleted', onEventDeleted);
    };
  }, []); // Empty array ensures this runs only once

  const value = { events, loading };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};

// Custom hook to easily consume the context in your components
export const useEvents = () => {
  return useContext(EventContext);
};