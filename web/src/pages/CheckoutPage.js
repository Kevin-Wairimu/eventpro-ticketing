import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { FaMobileAlt, FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import '../styles/checkout.css';

const CheckoutPage = () => {
  const { eventId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const eventDetails = location.state;

  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!eventDetails) {
      navigate('/');
    }
  }, [eventDetails, navigate]);

  const handleMpesaPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // More flexible phone validation
    let cleanPhone = phoneNumber.replace(/\s+/g, '').replace('+', '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '254' + cleanPhone.substring(1);
    } else if (cleanPhone.startsWith('7') || cleanPhone.startsWith('1')) {
      cleanPhone = '254' + cleanPhone;
    }
    
    if (!/^254(7|1)\d{8}$/.test(cleanPhone)) {
      setError("Please enter a valid Kenyan phone number (e.g., 0712345678)");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/payments/initiate-mpesa', {
        eventId: eventId,
        phoneNumber: cleanPhone
      });
      
      setSuccess(true);
    } catch (err) {
      const msg = err?.response?.data?.message || "M-PESA STK Push failed.";
      if (msg.includes("503") || msg.includes("unavailable")) {
        setError("Safaricom's payment system is currently unavailable. This is a common sandbox issue. Please try again in a few minutes.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!eventDetails) return null;

  if (success) {
    return (
      <div className="checkout-container">
        <div className="checkout-card success-card">
          <FaCheckCircle className="success-icon" />
          <h1>STK Push Sent!</h1>
          <p>We've sent an M-PESA prompt to <strong>{phoneNumber}</strong>.</p>
          <p>Please enter your PIN on your phone to complete the payment of <strong>KES {eventDetails.price}</strong>.</p>
          <button className="btn-primary-admin" onClick={() => navigate('/client/tickets')} style={{ marginTop: '2rem' }}>
            Go to My Tickets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <button className="back-btn" onClick={() => navigate(-1)}><FaArrowLeft /> Back to Events</button>
      
      <div className="checkout-grid">
        <div className="checkout-card order-summary">
          <h2>Order Summary</h2>
          <div className="event-info-mini">
            {eventDetails.imageUrl && <img src={eventDetails.imageUrl} alt={eventDetails.eventName} />}
            <div>
              <h3>{eventDetails.eventName}</h3>
              <p>{new Date(eventDetails.date).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="price-breakdown">
            <div className="price-row"><span>Ticket Price</span><span>KES {eventDetails.price.toFixed(2)}</span></div>
            <div className="price-row"><span>Service Fee</span><span>KES 0.00</span></div>
            <div className="price-row total"><span>Total</span><span>KES {eventDetails.price.toFixed(2)}</span></div>
          </div>
        </div>

        <div className="checkout-card payment-method">
          <h2>Payment Method</h2>
          <div className="mpesa-header">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/M-PESA_LOGO-01.svg/1200px-M-PESA_LOGO-01.svg.png" alt="M-PESA" />
            <span>Lipa na M-PESA (STK Push)</span>
          </div>
          
          <form onSubmit={handleMpesaPayment}>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div className="input-with-icon">
                <FaMobileAlt className="input-icon-inner" />
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. 0712345678" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <p className="form-hint">The STK push will be sent to this number.</p>
            </div>

            {error && (
              <div className="error-message" style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <FaExclamationTriangle style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="btn-primary-admin pay-btn" disabled={loading}>
              {loading ? "Requesting STK Push..." : `Pay KES ${eventDetails.price.toFixed(2)}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
