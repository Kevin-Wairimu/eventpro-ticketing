import dotenv from 'dotenv';
import Event from '../models/Event.js'; 
import Ticket from '../models/Ticket.js';
import { stkPush } from '../services/mpesa.services.js';

dotenv.config();

export const initiateMpesaPayment = async (req, res) => {
  const { eventId, phoneNumber } = req.body;
  const userId = req.user.id;

  try {
    const event = await Event.findByPk(eventId);
    if (!event || !event.price) {
      return res.status(404).json({ message: "Event not found or has no price." });
    }

    const amount = Math.round(event.price); // Mpesa takes KES (integers recommended)
    
    console.log(`Initiating Mpesa STK Push for event: ${event.name}, Amount: ${amount}, Phone: ${phoneNumber}`);

    const result = await stkPush(phoneNumber, amount, eventId, userId);
    
    res.json({ message: "STK Push initiated. Check your phone.", result });

  } catch (error) {
    console.error("Mpesa Error:", error.message);
    res.status(500).json({ message: `Mpesa Error: ${error.message}` });
  }
};

export const handleMpesaCallback = async (req, res) => {
  const callbackData = req.body.Body.stkCallback;
  console.log('✅ Mpesa Callback received:', JSON.stringify(callbackData, null, 2));

  if (callbackData.ResultCode === 0) {
    // Transaction successful
    const metadata = callbackData.CallbackMetadata.Item;
    const amount = metadata.find(item => item.Name === 'Amount').Value;
    const receipt = metadata.find(item => item.Name === 'MpesaReceiptNumber').Value;
    const phoneNumber = metadata.find(item => item.Name === 'PhoneNumber').Value;

    // The Daraja API callback doesn't natively include our custom metadata like userId/eventId
    // We usually parse it from the 'AccountReference' or use a temporary storage/cache mapped to the CheckoutRequestID
    // For this prototype, let's assume we find the event by matching the price or reference
    
    console.log(`✅ Payment Successful: Receipt ${receipt}, Amount ${amount}`);

    // Logic to fulfill order (similar to Stripe webhook)
    // NOTE: In a real app, you'd store the CheckoutRequestID in a database when initiating 
    // and look it up here to get the userId and eventId.
  } else {
    console.log(`❌ Payment Failed: ${callbackData.ResultDesc}`);
  }

  res.status(200).send("OK");
};
