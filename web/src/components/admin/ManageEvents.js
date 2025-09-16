import React, { useState, useEffect } from 'react';
import api from '../../api/api'; // Your API instance
import { socket } from '../../socket'; // The shared socket instance
import { toast, ToastContainer } from 'react-toastify'; // For notifications
import 'react-toastify/dist/ReactToastify.css'; // Styles for notifications
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

// The Reusable Modal Component does not need any changes
const EventModal = ({ event, onClose, onSave }) => { /* ... same as your code ... */ };

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // --- 1. Initial Data Fetch (runs only once on component mount) ---
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await api.get('/events');
        setEvents(response.data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        toast.error("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // --- 2. Real-Time Listeners ---
  useEffect(() => {
    // Function to handle a new event created by another admin
    const onNewEvent = (newEvent) => {
      toast.success(`New Event Added: ${newEvent.name}`);
      setEvents(prevEvents => [newEvent, ...prevEvents]);
    };
    // Function to handle an event updated by another admin
    const onEventUpdate = (updatedEvent) => {
      toast.info(`Event Updated: ${updatedEvent.name}`);
      setEvents(prevEvents => prevEvents.map(e => e._id === updatedEvent._id ? updatedEvent : e));
    };
    // Function to handle an event deleted by another admin
    const onEventDelete = (eventId) => {
      toast.error(`An event was deleted.`);
      setEvents(prevEvents => prevEvents.filter(e => e._id !== eventId));
    };

    // Attach the listeners
    socket.on('newEventCreated', onNewEvent);
    socket.on('eventUpdated', onEventUpdate);
    socket.on('eventDeleted', onEventDelete);

    // Clean up listeners when the component unmounts to prevent memory leaks
    return () => {
      socket.off('newEventCreated', onNewEvent);
      socket.off('eventUpdated', onEventUpdate);
      socket.off('eventDeleted', onEventDelete);
    };
  }, []); // Empty array ensures listeners are set up only once

  // --- 3. CRUD Handlers now talk to the API ---
  const handleDelete = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await api.delete(`/events/${eventId}`);
        // The real-time listener will handle updating the state for all clients, including this one.
      } catch (error) {
        toast.error("Failed to delete event.");
      }
    }
  };
  
  const handleSaveEvent = async (savedEvent) => {
    try {
      if (editingEvent) {
        await api.put(`/events/${savedEvent.id}`, savedEvent);
      } else {
        await api.post('/events', savedEvent);
      }
      handleCloseModal();
      // Real-time listeners will handle the state update.
    } catch (error) {
      toast.error("Failed to save event.");
    }
  };

  const handleOpenModal = (event = null) => { setEditingEvent(event); setModalOpen(true); };
  const handleCloseModal = () => { setModalOpen(false); setEditingEvent(null); };

  if (loading) { return <div className="admin-page-content"><h2>Loading Events...</h2></div>; }

  return (
    <div className="admin-page-content">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div className="dashboard-header">
        <h1>Manage Events</h1>
        <p>Create, edit, and manage all your events from this hub.</p>
        <button className="btn-primary-admin" onClick={() => handleOpenModal()}><FaPlus /> Create New Event</button>
      </div>
      <div className="table-container">
        <table className="content-table">{/* ... Table JSX ... */}</table>
      </div>
      {isModalOpen && <EventModal event={editingEvent} onClose={handleCloseModal} onSave={handleSaveEvent} />}
    </div>
  );
};

export default ManageEvents;