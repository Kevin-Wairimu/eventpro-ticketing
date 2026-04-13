import React, { useState } from "react";

const CATEGORIES = ["All", "Music", "Corporate", "Food & Drink", "Arts", "Sports"];

const EVENTS = [
  {
    t: "Summer music festival",
    d: "A sun-soaked day of live music.",
    date: "Jul 15, 2025",
    location: "Uhuru Gardens, Nairobi",
    price: "KES 1,500",
    tag: "Music",
    tagColor: "teal",
    img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1600&auto=format&fit=crop",
  },
  {
    t: "Tech conference 2025",
    d: "AI, cloud, and dev tools.",
    date: "Aug 3, 2025",
    location: "Radisson Blu, Nairobi",
    price: "KES 3,000",
    tag: "Corporate",
    tagColor: "purple",
    img: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1600&auto=format&fit=crop",
  },
  {
    t: "Food & wine expo",
    d: "Taste the very best.",
    date: "Sep 20, 2025",
    location: "Carnivore, Nairobi",
    price: "KES 2,000",
    tag: "Food & Drink",
    tagColor: "amber",
    img: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=1600&auto=format&fit=crop",
  },
];

const TAG_STYLES = {
  teal:   "bg-teal-50 text-teal-800 border border-teal-200",
  purple: "bg-purple-50 text-purple-800 border border-purple-200",
  amber:  "bg-amber-50 text-amber-800 border border-amber-200",
};

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? EVENTS
      : EVENTS.filter((e) => e.tag === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section
        className="relative h-[460px] flex items-center justify-center text-center text-white overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506157532120-0e4b7b09c9b1?q=80&w=1920&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-xl px-6">
          <span className="inline-block mb-4 px-4 py-1 rounded-full text-xs font-medium bg-teal-500/20 text-teal-300 border border-teal-400/30 tracking-wide">
            Kenya's #1 Event Platform
          </span>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Discover. Book. <span className="text-teal-400">Enjoy.</span>
          </h1>
          <p className="text-white/75 mb-8 text-base leading-relaxed">
            Find and book the best events happening around you — concerts, expos, festivals and more.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            
              href="/events"
              className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-semibold text-sm transition-colors"
            >
              Browse events
            </a>
            
              href="/login"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/25 text-sm transition-colors"
            >
              Sign in
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-4 -mt-10 relative z-10">
        <div className="grid grid-cols-3 gap-4">
          {[
            { num: "2,400+", label: "Events hosted" },
            { num: "18K+",   label: "Tickets sold" },
            { num: "4.9",    label: "Avg. rating" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center">
              <div className="text-2xl font-bold text-gray-900">{s.num}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured events */}
      <section className="max-w-6xl mx-auto px-4 py-10">

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                activeCategory === cat
                  ? "bg-teal-50 text-teal-800 border-teal-300 font-medium"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900">Featured events</h2>
          <a href="/events" className="text-sm text-teal-600 hover:underline">See all →</a>
        </div>

        {filtered.length === 0 ? (
          <p className="text-gray-500 text-sm py-10 text-center">No events in this category yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c, i) => (
              <article
                key={i}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-colors"
              >
                <img src={c.img} alt={c.t} className="h-44 w-full object-cover" />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${TAG_STYLES[c.tagColor]}`}>
                      {c.tag}
                    </span>
                    <span className="text-xs text-gray-400">{c.date}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{c.t}</h3>
                  <p className="text-xs text-gray-500 mb-3">{c.location}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">{c.price}</span>
                    
                      href="/events"
                      className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-xs rounded-lg font-medium transition-colors"
                    >
                      Buy ticket
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}