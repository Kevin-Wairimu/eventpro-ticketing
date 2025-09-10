// src/components/TicketModal.jsx
import React, { useState } from "react";
import axios from "axios";

export default function TicketModal({ event, onClose, onBooked }) {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to purchase a ticket.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:4000/api/events/${event._id}/book`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message || "Ticket booked!");
      onBooked && onBooked(res.data);
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl max-w-lg w-full p-6">
        <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
        <p className="text-sm text-gray-600 mb-4">{event.description}</p>
        <div className="flex gap-3">
          <button onClick={handlePurchase}
            className={`px-4 py-2 rounded ${loading ? "bg-gray-300" : "bg-indigo-600 text-white"}`} disabled={loading}>
            {loading ? "Processing..." : `Buy Ticket — $${event.price}`}
          </button>
          <button onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
        </div>
      </div>
    </div>
  );
}
