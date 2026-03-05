import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const getMpesaAccessToken = async () => {
  const consumerKey = process.env.MPESA_CONSUMER_KEY?.trim();
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET?.trim();
  
  if (!consumerKey || !consumerSecret) {
    throw new Error('Mpesa credentials not configured');
  }

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  // We will try the sandbox host first, with a timeout
  const hosts = [
    'https://sandbox.safaricom.co.ke',
    'https://api.safaricom.co.ke'
  ];

  let lastError = null;

  for (const host of hosts) {
    try {
      console.log(`📡 [Mpesa] Trying to connect to ${host}...`);
      const response = await axios.get(
        `${host}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: { Authorization: `Basic ${auth}` },
          timeout: 15000 // 15 seconds timeout
        }
      );
      console.log(`✅ [Mpesa] Successfully connected to ${host}`);
      return response.data.access_token;
    } catch (error) {
      lastError = error;
      console.warn(`⚠️ [Mpesa] Failed to connect to ${host}: ${error.message}`);
      // Continue to next host if available
    }
  }

  // If we reach here, all hosts failed
  if (lastError.response) {
    console.error('❌ [Mpesa Token API Error]:', {
      status: lastError.response.status,
      data: lastError.response.data
    });
  } else {
    console.error('❌ [Mpesa Token Network Error]: All connection attempts timed out. Safaricom Sandbox might be down or your network is blocking the request.');
  }
  throw new Error('Failed to generate Mpesa access token');
};

export const stkPush = async (phoneNumber, amount, eventId, userId) => {
  try {
    const accessToken = await getMpesaAccessToken();
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64');

    const payload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: phoneNumber,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: phoneNumber,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: `Event-${eventId.substring(0, 5)}`,
      TransactionDesc: 'Ticket Payment',
    };

    // Use the host that worked for the token (defaulting to sandbox)
    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      payload,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        timeout: 20000
      }
    );
    return response.data;
  } catch (error) {
    const errorData = error.response ? error.response.data : { message: error.message };
    console.error('❌ [Mpesa STK Error]:', JSON.stringify(errorData, null, 2));
    throw new Error(errorData.errorMessage || errorData.ResponseDescription || 'STK Push failed');
  }
};
