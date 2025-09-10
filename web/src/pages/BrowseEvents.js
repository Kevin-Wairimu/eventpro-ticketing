import React from "react";
import { Link } from "react-router-dom";

export default function BrowseEvents() {
  const events = [
    { title: "Summer Music Festival", date: "Aug 29", location: "Nairobi", img: "festival" },
    { title: "Tech Conference 2025", date: "Sep 10", location: "Mombasa", img: "conference" },
    { title: "Food & Wine Expo", date: "Oct 5", location: "Kisumu", img: "wine" },
    { title: "Art & Culture Gala", date: "Oct 20", location: "Nakuru", img: "art" },
    { title: "Startup Pitch Day", date: "Nov 02", location: "Nairobi", img: "startup" },
    { title: "Marathon & Wellness", date: "Nov 15", location: "Eldoret", img: "marathon" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <h2 className="text-3xl font-bold text-center mb-10">Browse Events</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((e, i) => (
          <div key={i} className="card overflow-hidden">
            <img
              className="h-44 w-full object-cover"
              src={`https://source.unsplash.com/600x350/?${e.img}`}
              alt={e.title}
              loading="lazy"
            />
            <div className="p-6">
              <h3 className="text-lg font-semibold">{e.title}</h3>
              <p className="text-gray-600">{e.date} • {e.location}</p>
              <p className="text-gray-500 text-sm mt-2">A great experience awaits you. Book early to secure your spot.</p>
              <Link to="/login" className="mt-4 inline-block text-pink-500 hover:underline">
                Book Now (Login required)
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
