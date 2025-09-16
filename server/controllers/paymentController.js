import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create a Stripe Checkout Session
// @route   POST /api/payments/create-checkout-session
// @access  Private
export const createCheckoutSession = async (req, res) => {
  // In a real app, get the eventId and find its price from your database
  const { eventId, eventName, price } = req.body;
  const YOUR_DOMAIN = process.env.FRONTEND_URL || 'http://localhost:3000';

  try {
    const session = await stripe.checkout.sessions.create({
      // Add payment method types you want to accept.
      // Stripe will automatically show the right ones based on the user's location.
      payment_method_types: ['card', 'paypal', 'mpesa'], // M-pesa is currently for Kenyan businesses
      line_items: [
        {
          price_data: {
            currency: 'usd', // Change to your currency (e.g., kes for M-pesa)
            product_data: {
              name: `Ticket for: ${eventName}`,
              images: [], // Optionally add event image URLs
            },
            unit_amount: price * 100, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // These are the URLs Stripe will redirect to after payment
      success_url: `${YOUR_DOMAIN}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/checkout/${eventId}`, // Go back to the checkout page on cancel
      metadata: {
        userId: req.user._id.toString(), // The logged-in user
        eventId: eventId,
      }
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ message: "Failed to create checkout session" });
  }
};

// @desc    Stripe webhook handler
// @route   POST /api/payments/webhook
// @access  Public (Stripe needs to be able to access this)
export const handleStripeWebhook = (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // FULFILL THE ORDER
      // This is where you save the ticket to your database
      // You can access the metadata you saved earlier:
      console.log(`Payment successful for user ${session.metadata.userId} for event ${session.metadata.eventId}`);
      // Example: createTicketInDB(session.metadata.userId, session.metadata.eventId);
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
};