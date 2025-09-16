import Stripe from 'stripe';
import dotenv from 'dotenv';

// CRITICAL: Ensure dotenv is configured
dotenv.config();

// Check if the key exists right at the start.
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("FATAL ERROR: STRIPE_SECRET_KEY is not defined in your .env file.");
  // In a real app, you might exit the process: process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  const { eventId, eventName, price } = req.body;
  const YOUR_DOMAIN = process.env.FRONTEND_URL || 'http://localhost:3000';

  console.log("\n--- Backend received request to create checkout session ---");
  console.log("Event ID:", eventId);

  // --- THIS IS A ROBUST TRY...CATCH BLOCK ---
  try {
    // In a real app, you would look up the price here from your database.
    // For now, we use a mock lookup.
    const priceLookup = {
      'tech-summit-2024': 199.99,
      'food-wine-expo-2024': 75.00,
      'classic-car-auction-fall': 25.00,
      'summer-carnivore-fest': 50.00
    };
    const serverPrice = priceLookup[eventId];

    if (!serverPrice) {
      console.error(`Price lookup failed for eventId: "${eventId}"`);
      // Always send a response
      return res.status(400).json({ message: "Invalid event ID or price not found." });
    }
    console.log(`Found price for event: ${serverPrice}`);

    console.log("Attempting to create session with Stripe...");
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: `Ticket for: ${eventName}` },
          unit_amount: Math.round(serverPrice * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/payment-success`,
      cancel_url: `${YOUR_DOMAIN}/checkout/${eventId}`,
      metadata: { userId: req.user._id.toString(), eventId: eventId }
    });
    
    console.log("Stripe session created successfully. Sending ID back to frontend.");
    // Always send a response
    res.json({ id: session.id });

  } catch (error) {
    // This will catch any error, from Stripe keys to other issues.
    console.error("--- FATAL ERROR IN createCheckoutSession ---");
    console.error(error); // Log the full error object
    // Always send a response
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
};

// ... (your handleStripeWebhook function)
export const handleStripeWebhook = (req, res) => { /* ... */ };