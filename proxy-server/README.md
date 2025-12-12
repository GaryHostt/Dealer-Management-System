# B2B API Proxy Server

This proxy server solves the CORS issue by acting as an intermediary between the frontend application and the B2B API.

## Why This Is Needed

Browsers enforce CORS (Cross-Origin Resource Sharing) security policies. The B2B API doesn't send CORS headers, so browsers block the response. This proxy:

1. ✅ Receives requests from your frontend (same origin = no CORS)
2. ✅ Forwards them to the B2B API (server-to-server = no CORS)
3. ✅ Returns the full response to your frontend (including status codes)

## Installation

```bash
cd proxy-server
npm install
```

## Running the Proxy Server

```bash
npm start
```

The server will start on `http://localhost:3001`

## Endpoints

- **Health Check**: `GET http://localhost:3001/health`
- **Submit Order**: `POST http://localhost:3001/api/submit-order`

## Usage

Once the proxy server is running, your frontend will automatically use it to submit orders and you'll be able to see the full API response including the 202 status code!

## Logs

The proxy server logs all requests and responses to the console, making it easy to debug any issues.

