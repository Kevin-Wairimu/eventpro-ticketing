import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// --- FUNCTION 1 ---
export const createCheckoutSession = async (req, res) => {
  const { eventId, eventName, price } = req.body;
  const YOUR_DOMAIN = process.env.FRONTEND_URL || 'http://localhost:3000';

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: `Ticket for: ${eventName}` },
          unit_amount: Math.round(price * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/checkout/${eventId}`,
      metadata: { userId: req.user._id.toString(), eventId: eventId }
    });
    res.json({ id: session.id });
  } catch (error) {
    console.error("Stripe Error:", error.message);
    res.status(500).json({ message: `Stripe Error: ${error.message}` });
  }
};

// --- FIX: THIS FUNCTION WAS MISSING OR NOT EXPORTED ---
// This is your webhook handler for Stripe to send events to.
export const handleStripeWebhook = (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the 'checkout.session.completed' event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    // FULFILL THE ORDER
    // This is where you would save the ticket to your database
    console.log(`Payment successful for user ${session.metadata.userId} for event ${session.metadata.eventId}`);
  }

  // Return a 200 response to acknowledge receipt
  res.send();
};