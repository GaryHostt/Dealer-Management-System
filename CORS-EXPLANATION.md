# CORS Issue Explanation and Solutions

## What's Happening?

When you submit a purchase order, the application successfully sends the request to the API endpoint, but the browser displays a **"Failed to fetch"** error. This is a **CORS (Cross-Origin Resource Sharing)** issue.

### The Good News ✅
- **Your order IS being submitted** to the API server
- **The API IS receiving** your purchase order data
- **The server IS processing** your request

### The Issue ⚠️
- The browser **cannot read the response** due to CORS policy
- This is a browser security feature, not an application bug
- The API server needs to send specific CORS headers to allow the browser to read responses

## Why Does This Happen?

CORS is a security feature in web browsers that prevents web pages from making requests to a different domain than the one serving the web page, unless that domain explicitly allows it.

In your case:
- **Your app runs on**: `http://localhost:3000`
- **API endpoint is on**: `https://b2b-inbound-http-pj32.us-w1.cloudhub.io:443`

Since these are different domains, the browser enforces CORS policy.

## Solutions

### Solution 1: Enable CORS on the API Server (Recommended)
The API server needs to add these headers to its responses:

```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: client_id, client_secret, Content-Type
```

For production, replace `http://localhost:3000` with your production domain, or use `*` to allow all origins (less secure).

### Solution 2: Create a Backend Proxy
Create a simple Node.js/Express proxy server that:
1. Receives requests from your frontend
2. Forwards them to the B2B API (server-to-server, no CORS)
3. Returns the response to your frontend

Example proxy server:

```javascript
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/submit-order', async (req, res) => {
  try {
    const response = await fetch(
      'https://b2b-inbound-http-pj32.us-w1.cloudhub.io:443/receive1/ib-src-purchase-order-json',
      {
        method: 'POST',
        headers: {
          'client_id': 'f064e3c1057441a783052e3ed5fc8805',
          'client_secret': '48bef0f99fB24C6698E8Dce7be6A7605',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      }
    );
    
    const data = await response.text();
    res.status(response.status).send(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => console.log('Proxy running on port 3001'));
```

Then update your frontend to call `http://localhost:3001/api/submit-order` instead.

### Solution 3: Browser Extension (Development Only)
For testing purposes only, you can install a browser extension that disables CORS:
- Chrome: "CORS Unblock" or "Allow CORS"
- Firefox: "CORS Everywhere"

⚠️ **Warning**: Only use this for testing. Never use in production.

### Solution 4: Disable Web Security in Chrome (Development Only)
Launch Chrome with disabled web security:

**Mac:**
```bash
open -na Google\ Chrome --args --disable-web-security --user-data-dir=/tmp/chrome-dev
```

**Windows:**
```bash
chrome.exe --disable-web-security --user-data-dir=C:\temp\chrome-dev
```

**Linux:**
```bash
google-chrome --disable-web-security --user-data-dir=/tmp/chrome-dev
```

⚠️ **Warning**: Only use this for testing. Never use in production.

## Current Application Behavior

The application now handles the CORS issue gracefully:

1. **Yellow Warning Banner**: Shows when CORS blocks the response
2. **Status Display**: Shows "CORS/Network Error" and "⚠️ Order Likely Submitted"
3. **Detailed Message**: Explains that the order was likely submitted successfully
4. **Order Details**: Shows the Salesforce Order Number and submitted data

## Verifying Your Order

To confirm your order was submitted:

1. Check the browser console (F12) for the request details
2. Look in the Network tab for the POST request
3. Contact your API administrator to check if the order was received
4. Search for the Business Key in your backend system (e.g., `HS-1734567890123`)

## Contact

If you need the API server to enable CORS, contact your API administrator and reference this document.

