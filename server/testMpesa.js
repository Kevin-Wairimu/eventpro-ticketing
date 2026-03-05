import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const testMpesa = async () => {
  console.log("-----------------------------------------------");
  console.log("🚀 TESTING MPESA CREDENTIALS");
  console.log("-----------------------------------------------");
  
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  try {
    console.log("1. Requesting Access Token...");
    const tokenResponse = await axios.get(
      'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      { headers: { Authorization: `Basic ${auth}` } }
    );
    const accessToken = tokenResponse.data.access_token;
    console.log("✅ Token received:", accessToken.substring(0, 10) + "...");

    console.log("2. Attempting Test STK Push (Phone: 254708374149, Amount: 1)...");
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64');

    const payload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: 1,
      PartyA: '254708374149',
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: '254708374149',
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: 'Test-123',
      TransactionDesc: 'Mpesa Test',
    };

    const response = await axios.post(
      'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      payload,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    
    console.log("✅ Success! Safaricom Response:", response.data.CustomerMessage);
    console.log("-----------------------------------------------");
    process.exit(0);
  } catch (error) {
    console.error("❌ Test Failed!");
    if (error.response) {
      console.error("API Error Status:", error.response.status);
      console.error("API Error Message:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("Error:", error.message);
    }
    console.log("-----------------------------------------------");
    process.exit(1);
  }
};

testMpesa();
