import React from "react";
import Footer from "../components/Footer";

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection:"column" }}>
      <main className="container" style={{ padding: 36, flex:1 }}>
        <h1>About Eventoria</h1>
        <p className="small" style={{ marginTop: 12 }}>
          Eventoria is a fictional event management platform built as a demo. It helps organizers publish events and customers discover and book tickets.
        </p>
      </main>
      <Footer />
    </div>
  );
}
