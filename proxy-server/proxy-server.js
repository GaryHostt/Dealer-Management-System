require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const https = require('https');

const app = express();
const PORT = 3001;

// Load credentials from environment variables
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const B2B_API_URL = process.env.B2B_API_URL;

// Validate environment variables
if (!CLIENT_ID || !CLIENT_SECRET || !B2B_API_URL) {
  console.error('\n❌ ERROR: Missing required environment variables!');
  console.error('Please create a .env file in the proxy-server directory with:');
  console.error('  CLIENT_ID=your_client_id');
  console.error('  CLIENT_SECRET=your_client_secret');
  console.error('  B2B_API_URL=your_api_url\n');
  process.exit(1);
}

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Create HTTPS agent that ignores SSL certificate errors
// (Only needed because the API has SSL cert issues)
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Proxy server is running' });
});

// Proxy endpoint for purchase orders
app.post('/api/submit-order', async (req, res) => {
  console.log('\n=== Incoming Request ===');
  console.log('Time:', new Date().toISOString());
  console.log('Body:', JSON.stringify(req.body, null, 2));

  try {
    console.log('\n=== Forwarding to API ===');
    console.log('URL:', B2B_API_URL);
    
    const response = await fetch(B2B_API_URL, {
      method: 'POST',
      headers: {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
      agent: httpsAgent
    });

    console.log('\n=== API Response ===');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    const responseText = await response.text();
    console.log('Response Body:', responseText);

    // Forward the response to the client with the same status code
    res.status(response.status)
       .set('Content-Type', 'application/json')
       .send(responseText || JSON.stringify({ 
         status: response.status, 
         statusText: response.statusText,
         message: 'Order submitted successfully'
       }));

  } catch (error) {
    console.error('\n=== ERROR ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    
    res.status(500).json({ 
      error: 'Proxy Error',
      message: error.message,
      details: 'Failed to forward request to B2B API'
    });
  }
});

app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                                                            ║');
  console.log('║         🚀  B2B API Proxy Server Running  🚀              ║');
  console.log('║                                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(`\n  ✅  Server:        http://localhost:${PORT}`);
  console.log(`  ✅  Health Check:  http://localhost:${PORT}/health`);
  console.log(`  ✅  Submit Order:  http://localhost:${PORT}/api/submit-order`);
  console.log('\n  📝  Logs will appear below when requests are made...\n');
  console.log('════════════════════════════════════════════════════════════════\n');
});

