import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import '../styles/checkout.css';

const PaymentSuccessPage = () => {
  return (
    <div className="checkout-container">
       <div className="checkout-card success-card">
        <FaCheckCircle className="success-icon" />
        <h1>Payment Successful!</h1>
        <p>Thank you for your purchase. Your ticket has been confirmed and is now available in your dashboard.</p>
        <Link to="/client/tickets" className="btn-primary-admin" style={{ marginTop: '2rem' }}>
          View My Tickets
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
