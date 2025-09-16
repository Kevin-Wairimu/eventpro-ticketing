import express from 'express';
import { createCheckoutSession, handleStripeWebhook } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// This route creates the session and is protected so only logged-in users can access it
router.post('/create-checkout-session', protect, createCheckoutSession);

// This route is for Stripe to send webhooks to. It needs to be public.
// We use express.raw to get the request body as a buffer, which Stripe requires.
router.post('/webhook', express.raw({type: 'application/json'}), handleStripeWebhook);

export default router;