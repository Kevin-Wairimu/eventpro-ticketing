import React from "react";

export default function FAQ() {
  const faqs = [
    { q: "How do I buy tickets?", a: "Register or log in, browse events, then purchase securely from the event page." },
    { q: "Can I cancel my booking?", a: "Some events allow cancellation. Check the event’s policy in its details page." },
    { q: "How do I contact support?", a: "Use the Contact link in the footer or email support@eventoria.com." },
  ];

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
      <div className="space-y-6">
        {faqs.map((f, i) => (
          <div key={i} className="card p-6">
            <h3 className="text-xl font-semibold mb-2">{f.q}</h3>
            <p className="text-gray-600">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
