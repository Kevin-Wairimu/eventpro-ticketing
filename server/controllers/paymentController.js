import Stripe from 'stripe';
import dotenv from 'dotenv';
import Event from '../models/Event.js'; 
// CRITICAL: Ensure dotenv is configured
dotenv.config();

// Check if the key exists right at the start.
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("FATAL ERROR: STRIPE_SECRET_KEY is not defined in your .env file.");
  // In a real app, you might exit the process: process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);




export const createCheckoutSession = async (req, res) => {
  const { eventId, eventName } = req.body;
  const YOUR_DOMAIN = process.env.FRONTEND_URL || 'http://localhost:3000';

  try {
    // --- 2. CRITICAL SECURITY FIX: Find the event in the database ---
    const event = await Event.findById(eventId);

    // If no event is found with that ID, or if it doesn't have a price, return an error.
    if (!event || !event.price) {
      console.error(`Price lookup failed for eventId: "${eventId}"`);
      return res.status(404).json({ message: "Event not found or has no price." });
    }

    // --- 3. Use the secure, server-side price from the database ---
    const price = event.price;

    console.log(`Found event: ${event.name}, Price: ${price}`);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: `Ticket for: ${event.name}` }, // Use the name from the DB
          unit_amount: Math.round(price * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/payment-success`,
      cancel_url: `${YOUR_DOMAIN}/checkout/${eventId}`,
      metadata: { userId: req.user._id.toString(), eventId: eventId }
    });
    
    res.json({ id: session.id });

  } catch (error) {
    console.error("Stripe Error:", error.message);
    res.status(500).json({ message: `Stripe Error: ${error.message}` });
  }
};
// ... (your handleStripeWebhook function)
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    // 1. Verify the event came from Stripe and is not a forgery
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.log(`❌ Webhook signature verification failed:`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 2. Handle the 'checkout.session.completed' event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('✅ Checkout session was successful!', session);

    // 3. FULFILL THE ORDER - Create the ticket in your database
    try {
      const { userId, eventId } = session.metadata;

      // Check if a ticket for this user and event already exists to prevent duplicates
      const ticketExists = await Ticket.findOne({ user: userId, event: eventId });
      
      if (ticketExists) {
        console.log(`Ticket already exists for user ${userId} and event ${eventId}. Skipping creation.`);
      } else {
        // Create the new ticket document in the database
        await Ticket.create({
          user: userId,
          event: eventId,
          status: 'Approved', // Or 'Pending' if you have another layer of approval
        });

        // Optional but recommended: Increment the 'ticketsSold' count on the Event model
        await Event.findByIdAndUpdate(eventId, { $inc: { ticketsSold: 1 } });
        
        console.log(`🎟️  New ticket created for user ${userId} for event ${eventId}`);
      }
    } catch (err) {
      console.error("Error fulfilling order in webhook:", err);
      // If this fails, you should have a system to retry or alert an admin
      return res.status(500).json({ message: "Error saving ticket to database." });
    }
  }

  // 4. Return a 200 response to Stripe to acknowledge receipt of the event
  res.send();
};