import React from "react";

export default function Home() {
  return (
    <div className="relative">
      <section
        className="h-[60vh] flex items-center justify-center text-center text-white"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506157532120-0e4b7b09c9b1?q=80&w=1920&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-2xl px-4">
          <h1 className="text-4xl font-extrabold mb-3">Discover. Book. Enjoy.</h1>
          <p className="text-white/90 mb-6">
            Eventoria makes event management and discovery effortless.
          </p>
          <div className="flex items-center justify-center gap-3">
            <a href="/events" className="px-5 py-3 rounded-xl bg-white text-gray-900 font-semibold">
              Browse Events
            </a>
            <a href="/login" className="px-5 py-3 rounded-xl bg-white/10 text-white border border-white/30">
              Sign In
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-4">Featured</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { t: "Summer Music Festival", d: "A sun-soaked day of live music.", img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1600&auto=format&fit=crop" },
            { t: "Tech Conference 2025", d: "AI, cloud, and dev tools.", img: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1600&auto=format&fit=crop" },
            { t: "Food & Wine Expo", d: "Taste the very best.", img: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=1600&auto=format&fit=crop" },
          ].map((c, i) => (
            <article key={i} className="bg-white rounded-2xl overflow-hidden shadow border border-gray-100">
              <img src={c.img} alt={c.t} className="h-44 w-full object-cover" />
              <div className="p-5">
                <h3 className="font-semibold text-lg">{c.t}</h3>
                <p className="text-sm text-gray-600">{c.d}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
