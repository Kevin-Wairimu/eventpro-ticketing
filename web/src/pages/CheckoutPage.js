import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm'; // We will create this next
import api from '../api/api';

const CheckoutPage = () => {
  const { eventId } = useParams();
  const [clientSecret, setClientSecret] = useState("");
  // In a real app, you would fetch event details based on eventId
  const eventDetails = { name: `Ticket for Event ${eventId}`, price: 49.99 };

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    const createIntent = async () => {
      try {
        const response = await api.post("/payments/create-payment-intent", { 
          amount: eventDetails.price,
          eventId: eventId,
        });
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error("Error creating payment intent", error);
      }
    };
    createIntent();
  }, [eventId, eventDetails.price]);

  const appearance = { theme: 'stripe' };
  const options = { clientSecret, appearance };

  return (
    <div className="checkout-page">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm eventDetails={eventDetails} />
        </Elements>
      )}
      {!clientSecret && <h2>Loading Payment Gateway...</h2>}
    </div>
  );
};

// You need to pass stripePromise to this component too.
// The best way is to have it in a separate file and import it.
// For simplicity here, we assume it's available.
// import { stripePromise } from './App'; // Example

export default CheckoutPage;