import sequelize from './config/database.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  console.log("--- 🕵️ Database Connection Debugger (Supabase PostgreSQL) ---");
  
  // 1. Check Public IP (useful for debugging any cloud-side firewall issues)
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    console.log(`✅ Your Public IP is: ${response.data.ip}`);
  } catch (err) {
    console.log("⚠️ Could not fetch public IP address (check your internet connection)");
  }

  // 2. Check DATABASE_URL
  const uri = process.env.DATABASE_URL;
  if (!uri) {
    console.error("❌ Error: DATABASE_URL is missing from your .env file!");
    return;
  }
  
  console.log(`📡 Attempting to connect to: ${uri.split('@')[1] ? '***@' + uri.split('@')[1] : uri}`);

  // 3. Test Sequelize Connection
  try {
    // Authenticate with the database
    await sequelize.authenticate();
    console.log("✅ SUCCESS: Successfully connected to Supabase PostgreSQL via Sequelize!");
    
    // Test model synchronization
    console.log("⏳ Syncing database models...");
    await sequelize.sync({ alter: true });
    console.log("✅ SUCCESS: Database models synchronized!");

    // Close the connection
    await sequelize.close();
    console.log("👋 Connection closed successfully.");
  } catch (error) {
    console.error("❌ FAILURE: Database Connection Error:");
    console.error(error.message);
    
    if (error.message.includes('ETIMEDOUT') || error.message.includes('ECONNREFUSED')) {
      console.log("\n💡 THIS MIGHT BE A NETWORK OR FIREWALL ISSUE.");
      console.log("Check if your internet connection is stable or if the Supabase project is active.");
    }
  }
}

testConnection();
