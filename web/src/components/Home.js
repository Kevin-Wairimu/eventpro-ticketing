import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

export default function Home() {
  const [events, setEvents] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:4000/api/events")
      .then(res => setEvents(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleBook = async (id) => {
    if (!token) return alert("Login to book ticket!");
    try {
      const res = await axios.post(`http://localhost:4000/api/events/${id}/book`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert("Booking failed");
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{padding:"2rem"}}>
        <h1>Events</h1>
        <div style={{display:"flex", gap:"1rem", flexWrap:"wrap"}}>
          {events.map(e => (
            <div key={e._id} style={{border:"1px solid #ccc", padding:"1rem", width:"250px", borderRadius:"10px"}}>
              <h3>{e.title}</h3>
              <p>{e.description}</p>
              <p>${e.price}</p>
              <button onClick={() => handleBook(e._id)}>Book Ticket</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
