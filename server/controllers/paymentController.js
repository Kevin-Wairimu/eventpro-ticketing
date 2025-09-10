import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create a payment intent
// @route   POST /api/payments/create-payment-intent
// @access  Private
export const createPaymentIntent = async (req, res) => {
  // In a real app, the 'amount' should be calculated on the server
  // based on the eventId, not trusted from the client.
  const { amount, eventId } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Invalid payment amount' });
  }

  try {
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Amount is in cents, so multiply by 100
      currency: 'usd', // Change to your desired currency
      metadata: { eventId: eventId, user: req.user._id.toString() }, // Add useful metadata
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Send the clientSecret back to the client
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ message: "Failed to create payment intent" });
  }
};