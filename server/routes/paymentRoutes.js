import express from 'express';
import { createPaymentIntent } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// This route is protected, meaning a user must be logged in to create a payment
router.post('/create-payment-intent', protect, createPaymentIntent);

export default router;