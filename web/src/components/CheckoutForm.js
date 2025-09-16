import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import '../styles/checkout.css'; // --- NEW: A dedicated stylesheet ---

const CheckoutForm = ({ eventDetails }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // --- IMPORTANT: This is the URL the user is sent to after payment ---
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    // This point will only be reached if there is an immediate error, such as
    // an invalid card number. The user will not be redirected.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <div className="checkout-header">
        <h2>Confirm your purchase</h2>
        <div className="order-summary">
          <span>{eventDetails.name}</span>
          <span>${eventDetails.price.toFixed(2)}</span>
        </div>
      </div>
      
      {/* This is the pre-built, secure Stripe form */}
      <PaymentElement id="payment-element" />
      
      <button disabled={isLoading || !stripe || !elements} id="submit-button">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : `Pay $${eventDetails.price.toFixed(2)}`}
        </span>
      </button>

      {/* Show any error messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
};

export default CheckoutForm;