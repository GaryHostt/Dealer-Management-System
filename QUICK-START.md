# 🚀 Quick Start Guide

## Prerequisites
- Node.js installed
- Two terminal windows

## First Time Setup

### 1. Install Dependencies

**Terminal 1 - Main App:**
```bash
npm install
```

**Terminal 2 - Proxy Server:**
```bash
cd proxy-server
npm install
```

## Running the Application

### Terminal 1 - Start Proxy Server
```bash
cd proxy-server
npm start
```

Wait for:
```
🚀  B2B API Proxy Server Running  🚀
✅  Server:        http://localhost:3001
```

### Terminal 2 - Start Frontend
```bash
npm run dev
```

Wait for:
```
VITE v5.4.21  ready in 339 ms
➜  Local:   http://localhost:3000/
```

### 3. Open Application
Navigate to: **http://localhost:3000**

## Using the Application

1. **Fill out the form** (all fields are pre-populated)
2. **Edit any fields** as needed
3. **Click "Submit Purchase Order"**
4. **View the confirmation screen** with:
   - ✅ Salesforce Order Number (00003444, 00003445, etc.)
   - ✅ **202 Accepted status** (you can now see this!)
   - ✅ Full API response
   - ✅ All submitted order details
5. **Click "Create New Order"** to submit another (number auto-increments!)

## Salesforce Order Numbers

- **Auto-increments** starting from 00003443
- First order: `00003444`
- Second order: `00003445`
- And so on...
- **Persists** across browser refreshes

## What's Different Now?

### Before (Without Proxy):
```
❌ Can't see 202 status code
❌ Shows "Failed to fetch" 
❌ CORS errors in console
```

### After (With Proxy):
```
✅ See 202 Accepted status
✅ See full API response
✅ No CORS errors!
```

## Troubleshooting

### "Connection Error" message?
- Make sure proxy server is running on port 3001
- Check Terminal 1 for proxy server logs

### Port already in use?
- Stop other processes using port 3000 or 3001
- Or change ports in the config files

### Need help?
- Check `PROXY-SOLUTION.md` for detailed documentation
- Check `DATE-FORMAT-FIX.md` for date format requirements
- Check proxy server logs in Terminal 1

## Architecture

```
Your Browser (port 3000)
    ↓ sends order to
Proxy Server (port 3001)
    ↓ forwards to
B2B API (Salesforce)
    ↓ returns 202
Proxy Server
    ↓ returns full response
Your Browser ✅ (you can see the 202!)
```

Enjoy your fully functional Dealer Management System! 🎉

