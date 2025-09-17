import React, { useState } from 'react';
import api from '../../api/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { useEvents } from '../EventContext';
// --- 1. Import the new, separate EventModal component ---
import EventModal from './EventModal'; 

const ManageEvents = () => {
  const { events, loading } = useEvents();
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const handleDelete = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await api.delete(`/events/${eventId}`);
        toast.success("Event deleted!");
      } catch (error) { 
        toast.error(error?.response?.data?.message || "Failed to delete event."); 
      }
    }
  };
  
  const handleSaveEvent = async (savedEvent) => {
    try {
      if (editingEvent) {
        await api.put(`/events/${savedEvent.id}`, savedEvent);
        toast.success("Event updated!");
      } else {
        await api.post('/events', savedEvent);
        toast.success("Event created!");
      }
      handleCloseModal();
    } catch (error) { 
      toast.error(error?.response?.data?.message || "Failed to save event."); 
    }
  };

  const handleOpenModal = (event = null) => { setEditingEvent(event); setModalOpen(true); };
  const handleCloseModal = () => { setEditingEvent(false); setEditingEvent(null); };

  if (loading) { return <div className="admin-page-content"><h2>Loading Events...</h2></div>; }

  return (
    <div className="admin-page-content">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="colored" />
      <div className="dashboard-header">
        <h1>Manage Events</h1>
        <p>Create, edit, and manage all your events from this hub.</p>
        <button className="btn-primary-admin" onClick={() => handleOpenModal()}>
          <FaPlus /> Create New Event
        </button>
      </div>
      
      <div className="table-container">
        <table className="content-table">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Price</th>
              <th>Date</th>
              <th>Status</th>
              <th>Tickets Sold</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event._id}>
                <td>{event.name}</td>
                <td>${event.price ? event.price.toFixed(2) : '0.00'}</td>
                <td>{new Date(event.date).toLocaleDateString()}</td>
                <td><span className={`status-pill ${event.status.toLowerCase()}`}>{event.status}</span></td>
                <td>{event.ticketsSold} / {event.capacity}</td>
                <td className="action-buttons">
                  <button className="btn-icon-edit" onClick={() => handleOpenModal(event)}><FaEdit /></button>
                  <button className="btn-icon-delete" onClick={() => handleDelete(event._id)}><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* --- 2. The modal is now a clean, self-contained component --- */}
      {isModalOpen && <EventModal event={editingEvent} onClose={handleCloseModal} onSave={handleSaveEvent} />}
    </div>
  );
};

export default ManageEvents;