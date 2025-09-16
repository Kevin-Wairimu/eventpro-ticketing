import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const PaymentSuccessPage = () => {
  return (
    <div className="client-page-container" style={{textAlign: 'center', maxWidth: '800px', margin: '40px auto'}}>
       <div className="list-wrapper-client">
        <FaCheckCircle style={{fontSize: '5rem', color: '#38A169', marginBottom: '20px'}}/>
        <h1>Payment Successful!</h1>
        <p>Thank you for your purchase. Your ticket has been confirmed and sent to your email.</p>
        <Link to="/client/dashboard" className="btn-primary-action">
          Go to My Dashboard
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;