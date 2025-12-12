# Dealer Management System

A modern front-end application for managing purchase orders and submitting them to B2B systems.

## Features

- **Purchase Order Form**: Comprehensive form with all necessary fields pre-populated
- **Editable Fields**: All form fields are editable to allow customization
- **Date Format Handling**: Automatically converts dates to YYYYMMDD format required by the API
- **API Integration**: Submits orders to the B2B endpoint
- **Reference Screen**: Shows confirmation with submitted order details
- **Salesforce Order Number**: Auto-incrementing tracking number starting from 00003443 (first order is 00003444)
- **Modern UI**: Beautiful, responsive design with gradient styling
- **Smart Error Handling**: Distinguishes between actual errors and CORS issues

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

**⚠️ IMPORTANT: Set up credentials first!**

1. Clone the repository

2. **Create environment files** (contains sensitive credentials):

**Main app `.env` file (root directory):**
```bash
# Copy the example file
cp .env.example .env

# Edit .env and set:
VITE_COMPANY_NAME=YourCompanyName
```

**Proxy server `.env` file (proxy-server directory):**
```bash
# Copy the example file
cd proxy-server
cp .env.example .env

# Edit proxy-server/.env and set:
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
B2B_API_URL=https://b2b-inbound-http-pj32.us-w1.cloudhub.io:443/receive1/ib-src-purchase-order-json

cd ..
```

3. Install dependencies for the main app:
```bash
npm install
```

4. Install dependencies for the proxy server:
```bash
cd proxy-server
npm install
cd ..
```

### Running the Application

You need to run **both** the frontend and the proxy server:

**Terminal 1 - Proxy Server:**
```bash
cd proxy-server
npm start
```
The proxy server will start on `http://localhost:3001`

**Terminal 2 - Frontend App:**
```bash
npm run dev
```
The frontend will start on `http://localhost:3000`

3. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Usage

1. Fill out the purchase order form (all fields are pre-populated but editable)
2. The date field uses a standard date picker (YYYY-MM-DD format)
3. Click "Submit Purchase Order" to send the order to the API
   - The app automatically converts the date to YYYYMMDD format required by the API
4. View the confirmation screen with your Salesforce Order Number
5. Check the API Response box to see the submission status
6. Click "Create New Order" to submit another order

## Important Notes

### Date Format
The API requires dates in `YYYYMMDD` format (e.g., `20251211`). The app handles this automatically:
- You enter dates using the date picker (shows as `2025-12-11`)
- The app converts it to `20251211` before sending to the API

### CORS Warning
You may see a yellow warning banner about CORS (Cross-Origin Resource Sharing). This is normal:
- ✅ Your order **IS** being submitted successfully
- ✅ The API **IS** processing your order
- ⚠️ The browser **cannot read** the response due to CORS restrictions

See `CORS-EXPLANATION.md` for more details and solutions.

## API Endpoint

The application submits to:
```
https://b2b-inbound-http-pj32.us-w1.cloudhub.io:443/receive1/ib-src-purchase-order-json
```

## Technologies Used

- React 18
- Vite
- Node.js + Express (proxy server)
- dotenv (environment variables)
- Modern CSS with gradients and animations

## Security

🔒 **Credentials are secured!** 

- All sensitive credentials are stored in `.env` files
- `.env` files are in `.gitignore` and will NOT be committed
- See `SECURITY.md` for detailed security information

## Before Committing

✅ **Checklist:**
- [ ] `.env` files are NOT staged for commit
- [ ] Only `.env.example` files are included
- [ ] No hardcoded credentials in source files
- [ ] Run `git status` to verify

See `SECURITY.md` for more details.

