import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import api from '../api/api';

// Load Stripe outside the component to prevent re-loading on every render
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutPage = () => {
  const { eventId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const eventDetails = location.state;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // --- NEW: State to hold the initialized Stripe instance ---
  const [stripe, setStripe] = useState(null);

  // --- NEW: Effect to initialize Stripe when the component mounts ---
  useEffect(() => {
    // This is a safer way to handle the promise
    stripePromise.then(stripeInstance => {
      if (stripeInstance) {
        setStripe(stripeInstance);
      } else {
        console.error("Stripe.js failed to load. Check your publishable key.");
        setError("Payment gateway failed to load. Please refresh the page.");
      }
    });
  }, []);

  // Redirect if event details are missing
  useEffect(() => {
    if (!eventDetails) {
      navigate('/');
    }
  }, [eventDetails, navigate]);

  const handleClick = async () => {
    setLoading(true);
    setError(null);

    // --- CRITICAL FIX: Check if stripe is initialized before proceeding ---
    if (!stripe) {
      setError("Payment gateway is not ready. Please wait a moment and try again.");
      setLoading(false);
      return;
    }

    try {
      // Create a checkout session on your backend
      const response = await api.post('/payments/create-checkout-session', {
        eventId: eventId,
        eventName: eventDetails.eventName,
        price: eventDetails.price
      });
      
      const session = response.data;
      if (!session || !session.id) {
        throw new Error("Failed to initialize payment session.");
      }

      // Redirect to Stripe's hosted checkout page
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (err) {
      const displayMessage = err?.response?.data?.message || err.message || "An unexpected error occurred.";
      setError(`Error: ${displayMessage}`);
      setLoading(false);
    }
  };

  if (!eventDetails) {
    return <div>Redirecting...</div>;
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
        <button 
          className="btn-primary-action" 
          style={{width: '100%', padding: '15px'}} 
          // --- CRITICAL FIX: Also disable the button if Stripe hasn't loaded ---
          onClick={handleClick} 
          disabled={loading || !stripe} 
        >
          {loading ? "Redirecting to Payment..." : "Proceed to Payment"}
        </button>
        {error && <p style={{color: 'red', marginTop: '15px', fontWeight: 'bold'}}>{error}</p>}
      </div>
    </div>
  );
};

export default CheckoutPage;