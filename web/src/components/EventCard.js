import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function EventCard({ event }) {
  const { user } = useAuth();
  const nav = useNavigate();

  const handleBuy = () => {
    if (!user) {
      nav("/login");
      return;
    }
    // In a full app you'd open Payment modal; here we just simulate
    alert(`Proceed to buy ticket for ${event.title}`);
  };

  return (
    <article className="card">
      <div style={{ height: 160, overflow: "hidden", borderRadius: 10 }}>
        <img src={event.image} alt={event.title} style={{ width: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ marginTop: 12 }}>
        <h3 style={{ margin: 0, fontSize: 18 }}>{event.title}</h3>
        <p className="small" style={{ margin: "6px 0 8px" }}>{new Date(event.date).toLocaleString()} • {event.location}</p>
        <p className="small" style={{ marginBottom: 12 }}>{event.description}</p>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn" onClick={handleBuy}>Buy / Book</button>
          <Link to={`/events/${event.id}`} className="btn-outline" style={{ alignSelf: "center" }}>Details</Link>
        </div>
      </div>
    </article>
  );
}
