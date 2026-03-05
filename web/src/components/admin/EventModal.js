import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const EventModal = ({ event, onClose, onSave }) => {
  const isEditMode = !!event?._id;

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
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditMode ? 'Edit Event' : 'Create New Event'}</h2>
          <button className="btn-icon-close" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#64748b' }}>
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Event Name</label>
              <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Summer Music Festival" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input type="date" className="form-input" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-input" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Capacity</label>
                <input type="number" className="form-input" value={capacity} onChange={(e) => setCapacity(e.target.value)} required min="0" />
              </div>
              <div className="form-group">
                <label className="form-label">Price (USD)</label>
                <input type="number" className="form-input" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" step="0.01" />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary-admin">Save Event</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
