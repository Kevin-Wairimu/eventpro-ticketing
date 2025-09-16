import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

// --- Stripe Imports ---
import { loadStripe } from '@stripe/stripe-js';

// --- Core Application Imports ---
import api from '../api/api'; // Assumes api.js is in src/

// --- CRITICAL: Load Stripe outside the component render tree ---
// This prevents Stripe from being reloaded on every render.
// Ensure your .env file has REACT_APP_STRIPE_PUBLISHABLE_KEY=your_pk_test_key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutPage = () => {
  const { eventId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Get event details passed via navigation state from LandingPage.
  // This is the most efficient way to get the data without another API call.
  const eventDetails = location.state;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- NEW: Robustness check ---
  // If the user navigates directly to this page without event details,
  // it's better to redirect them than to show a broken page.
  useEffect(() => {
    if (!eventDetails) {
      console.warn("No event details found in location state. Redirecting home.");
      navigate('/');
    }
  }, [eventDetails, navigate]);
  
  // This effect checks if Stripe loaded correctly. Your original version was perfect.
  useEffect(() => {
    stripePromise.then(stripe => {
      if (!stripe) {
        console.error("Stripe.js failed to load. Check your publishable key.");
        setError("Payment gateway failed to load. Please refresh the page.");
      }
    });
  }, []);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    console.log("--- 1. Payment process started ---");

    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe.js has not loaded yet. Please try again.");
      }
      console.log("--- 2. Stripe.js is loaded ---");

      // Create a checkout session on your backend
      console.log("--- 3. Sending request to backend to create session... ---");
      const response = await api.post('/payments/create-checkout-session', {
        eventId: eventId,
        eventName: eventDetails.eventName,
        price: eventDetails.price // Backend should verify this price
      });
      
      const session = response.data;
      console.log("--- 4. Backend response received with session ID:", session.id, "---");

      // Redirect to Stripe's hosted checkout page
      console.log("--- 5. Redirecting to Stripe Checkout... ---");
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      // This part only runs if the redirect itself fails immediately
      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (err) {
      console.error("--- PAYMENT FAILED ---");
      console.error("Full error object:", err);
      const displayMessage = err?.response?.data?.message || err.message || "An unexpected error occurred.";
      setError(`Error: ${displayMessage}`);
      setLoading(false);
    }
  };

  // If we redirected, this component will unmount. If not, show the UI.
  if (!eventDetails) {
    return <div>Redirecting...</div>; // Or a loading spinner
  }

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