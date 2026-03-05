import express from 'express';
import { initiateMpesaPayment, handleMpesaCallback } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to initiate STK push for M-PESA
router.post('/initiate-mpesa', protect, initiateMpesaPayment);

// Callback route for Safaricom to send results to
router.post('/mpesa-callback', handleMpesaCallback);

export default router;
