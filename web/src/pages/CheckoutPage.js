import {React, useState } from 'react';
// --- 1. Import useParams and useLocation ---
import { useParams, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
// --- 2. Correct the import path for your api instance ---
import api from '../api/api'; 

// Load Stripe with your publishable key.
// It's best practice to put this in your .env file as REACT_APP_STRIPE_PUBLISHABLE_KEY
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'your_default_pk_test_key');

const CheckoutPage = () => {
  const { eventId } = useParams();
  // --- 3. Get the location object which contains the state ---
  const location = useLocation();

  // Get event details passed via navigation state from LandingPage, or set a default.
  // This prevents the page from crashing if visited directly.
  const eventDetails = location.state || { eventName: `Ticket for Event: ${eventId}`, price: 49.99 };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

    // ... inside your CheckoutPage component

  const handleClick = async () => {
    setLoading(true);
    setError(null);

    // The 'try' block contains the code that might fail (e.g., the API call).
    try {
      const stripe = await stripePromise;
      
      console.log("Attempting to create checkout session for:", { eventId, ...eventDetails });
      
      const response = await api.post('/payments/create-checkout-session', {
        eventId: eventId,
        eventName: eventDetails.eventName,
        price: eventDetails.price
      });
      
      const session = response.data;
      console.log("Backend response received:", session);

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        // This is a Stripe-specific error if the redirect itself fails.
        console.error("Stripe redirect error:", result.error);
        setError(result.error.message);
      }

    // The 'catch' block runs ONLY if an error occurs inside the 'try' block.
    // There must be no code between the closing '}' of try and the 'catch' keyword.
    } catch (err) {
      console.error("Failed to start payment process. Full error:", err);

      if (err.response) {
        // The server responded with an error status (e.g., 401, 404, 500)
        const serverMessage = err.response.data.message || "Our server encountered an issue.";
        setError(`Error: ${serverMessage} Please try again.`);
      } else if (err.request) {
        // The request was made but no response was received (network error)
        setError("Could not connect to the server. Please check your internet connection and try again.");
      } else {
        // A different error occurred while setting up the request
        setError("An unexpected error occurred. Please try again later.");
      }

    // The 'finally' block runs regardless of whether the try or catch block executed.
    // It's perfect for cleanup tasks, like setting loading to false.
    } finally {
      setLoading(false);
    }
  };

  // ... rest of your component

  return (
    <div className="client-page-container" style={{maxWidth: '800px', margin: '40px auto'}}>
      <div className="list-wrapper-client">
        <div className="dashboard-welcome">
          <h1>Event Checkout</h1>
          <p>Please confirm your purchase details below.</p>
        </div>
        <h2>{eventDetails.eventName}</h2>
        <p style={{fontSize: '2rem', fontWeight: 'bold'}}>Price: ${eventDetails.price.toFixed(2)}</p>
        <hr style={{margin: '20px 0'}}/>
        <button className="btn-primary-action" style={{width: '100%', padding: '15px'}} onClick={handleClick} disabled={loading}>
          {loading ? "Redirecting to Payment..." : "Proceed to Payment"}
        </button>
        {error && <p style={{color: 'red', marginTop: '15px', fontWeight: 'bold'}}>{error}</p>}
      </div>
    </div>
  );
};

export default CheckoutPage;