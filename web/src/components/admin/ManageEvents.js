import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

// Initial mock data - in a real app, this would come from an API call in a useEffect hook
const initialEvents = [
  { id: 1, name: "Annual Tech Summit 2024", date: "2024-10-26", status: "Published", ticketsSold: 450, capacity: 500 },
  { id: 2, name: "Summer Music Festival", date: "2024-08-15", status: "Published", ticketsSold: 8500, capacity: 10000 },
  { id: 3, name: "Gourmet Food & Wine Expo", date: "2024-11-05", status: "Draft", ticketsSold: 0, capacity: 1200 },
  { id: 4, name: "Charity Gala Dinner", date: "2024-12-01", status: "Cancelled", ticketsSold: 150, capacity: 200 },
];

// --- Reusable Modal Component ---
const EventModal = ({ event, onClose, onSave }) => {
  // If no event is passed, it's a "Create" modal, otherwise it's "Edit"
  const isEditMode = event !== null;
  const [eventName, setEventName] = useState(isEditMode ? event.name : "");
  const [eventDate, setEventDate] = useState(isEditMode ? event.date : "");
  const [eventCapacity, setEventCapacity] = useState(isEditMode ? event.capacity : 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      // Keep existing data if editing, or create new ID if creating
      ...event, 
      id: isEditMode ? event.id : Date.now(), 
      name: eventName,
      date: eventDate,
      capacity: parseInt(eventCapacity, 10),
      // Default new events to Draft status
      status: isEditMode ? event.status : "Draft",
      ticketsSold: isEditMode ? event.ticketsSold : 0,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{isEditMode ? 'Edit Event' : 'Create New Event'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Event Name</label>
            <input 
              type="text" 
              className="form-input" 
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input 
              type="date" 
              className="form-input"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Capacity</label>
            <input 
              type="number" 
              className="form-input" 
              value={eventCapacity}
              onChange={(e) => setEventCapacity(e.target.value)}
              required 
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary-admin" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary-admin">Save Event</button>
          </div>
        </form>
      </div>
    </div>
  );
};


// --- Main ManageEvents Component ---
const ManageEvents = () => {
  const [events, setEvents] = useState(initialEvents);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null); // null for create, event object for edit

  const handleDelete = (eventId) => {
    // In a real app, you would show a confirmation dialog first
    if (window.confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter(event => event.id !== eventId));
    }
  };
  
  const handleOpenModal = (event = null) => {
    setEditingEvent(event);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingEvent(null);
  };

  const handleSaveEvent = (savedEvent) => {
    if (editingEvent) {
      // Update existing event
      setEvents(events.map(event => event.id === savedEvent.id ? savedEvent : event));
    } else {
      // Add new event
      setEvents([...events, savedEvent]);
    }
    handleCloseModal();
  };

  return (
    <div className="admin-page-content">
      {/* --- Page Header --- */}
      <div className="dashboard-header">
        <h1>Manage Events</h1>
        <p>Create, edit, and manage all your events from this hub.</p>
        <button className="btn-primary-admin" onClick={() => handleOpenModal()}>
          <FaPlus /> Create New Event
        </button>
      </div>
      
      {/* --- Events Table --- */}
      <div className="table-container">
        <table className="content-table">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Date</th>
              <th>Status</th>
              <th>Tickets Sold</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event.id}>
                <td>{event.name}</td>
                <td>{event.date}</td>
                <td><span className={`status-pill ${event.status.toLowerCase()}`}>{event.status}</span></td>
                <td>{event.ticketsSold} / {event.capacity}</td>
                <td className="action-buttons">
                  <button className="btn-icon-edit" aria-label="Edit" onClick={() => handleOpenModal(event)}>
                    <FaEdit />
                  </button>
                  <button className="btn-icon-delete" aria-label="Delete" onClick={() => handleDelete(event.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* --- Create/Edit Modal --- */}
      {isModalOpen && <EventModal event={editingEvent} onClose={handleCloseModal} onSave={handleSaveEvent} />}
    </div>
  );
};

export default ManageEvents;