import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import api from '../api/api';

// Load Stripe with your publishable key (safe to expose on the frontend)
// Put this in your .env file as REACT_APP_STRIPE_PUBLISHABLE_KEY
const stripePromise = loadStripe('pk_test_...your_publishable_key');

const CheckoutPage = () => {
  const { eventId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // In a real app, you would fetch event details based on eventId
  const eventDetails = { name: `Ticket for Event ${eventId}`, price: 49.99 };

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    try {
      const stripe = await stripePromise;
      
      // 1. Create a checkout session on your backend
      const response = await api.post('/payments/create-checkout-session', {
        eventId: eventId,
        eventName: eventDetails.name,
        price: eventDetails.price
      });
      
      const session = response.data;

      // 2. Redirect to Stripe's hosted checkout page
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        setError(result.error.message);
      }
    } catch (err) {
      setError("Failed to start the payment process. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="client-page-container" style={{maxWidth: '800px', margin: '40px auto'}}>
      <div className="list-wrapper-client">
        <div className="dashboard-welcome">
          <h1>Event Checkout</h1>
          <p>You are purchasing a ticket for:</p>
        </div>
        <h2>{eventDetails.name}</h2>
        <p style={{fontSize: '2rem', fontWeight: 'bold'}}>Price: ${eventDetails.price}</p>
        <hr style={{margin: '20px 0'}}/>
        <button className="btn-primary-action" style={{width: '100%', padding: '15px'}} onClick={handleClick} disabled={loading}>
          {loading ? "Redirecting to Payment..." : "Proceed to Payment"}
        </button>
        {error && <p style={{color: 'red', marginTop: '15px'}}>{error}</p>}
      </div>
    </div>
  );
};

export default CheckoutPage;