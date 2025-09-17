import React, { useState } from 'react';

// This is now its own, independent component.
const EventModal = ({ event, onClose, onSave }) => {
  const isEditMode = event !== null;

  const [name, setName] = useState(isEditMode ? event.name : "");
  const [date, setDate] = useState(isEditMode ? new Date(event.date).toISOString().split('T')[0] : "");
  const [capacity, setCapacity] = useState(isEditMode ? event.capacity : 0);
  const [status, setStatus] = useState(isEditMode ? event.status : "Draft");
  const [price, setPrice] = useState(isEditMode ? event.price : 0);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const eventData = {
      name,
      date,
      capacity: parseInt(capacity, 10),
      status,
      price: parseFloat(price),
    };
    
    if (isEditMode) {
      eventData.id = event._id;
    }
    
    onSave(eventData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{isEditMode ? 'Edit Event' : 'Create New Event'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label className="form-label">Event Name</label><input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required /></div>
          <div className="form-group"><label className="form-label">Date</label><input type="date" className="form-input" value={date} onChange={(e) => setDate(e.target.value)} required /></div>
          <div className="form-group"><label className="form-label">Capacity</label><input type="number" className="form-input" value={capacity} onChange={(e) => setCapacity(e.target.value)} required min="0" /></div>
          <div className="form-group"><label className="form-label">Price (USD)</label><input type="number" className="form-input" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" step="0.01" /></div>
          <div className="form-group"><label className="form-label">Status</label><select className="form-input" value={status} onChange={(e) => setStatus(e.target.value)}><option value="Draft">Draft</option><option value="Published">Published</option><option value="Cancelled">Cancelled</option></select></div>
          <div className="form-actions">
            <button type="button" className="btn-secondary-admin" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary-admin">Save Event</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;