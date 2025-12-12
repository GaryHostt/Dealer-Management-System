# Security & Credentials Configuration

## ⚠️ Important: Credentials Are Now Secured

As of the latest commit, all sensitive credentials have been moved to environment variables and are **NOT** included in the repository.

## Files Protected by .gitignore

The following files contain sensitive information and are **automatically ignored** by git:

```
.env                          # Main app environment variables
proxy-server/.env             # Proxy server credentials
```

These files will **never** be committed to the repository.

## Setup Instructions

### 1. Create Environment Files

After cloning this repository, you need to create your own `.env` files:

#### Main App `.env`
```bash
cp .env.example .env
```

#### Proxy Server `.env`
```bash
cd proxy-server
cp .env.example .env
```

### 2. Add Your Credentials

Edit `proxy-server/.env` and add your actual credentials:

```bash
# B2B API Credentials
CLIENT_ID=your_actual_client_id_here
CLIENT_SECRET=your_actual_client_secret_here
B2B_API_URL=https://your-api-endpoint.com/path
```

⚠️ **Never commit these files to git!**

## What Changed

### Before (Insecure ❌)
Credentials were hardcoded in source files:

```javascript
// proxy-server.js (OLD - DON'T DO THIS!)
headers: {
  'client_id': 'f064e3c1057441a783052e3ed5fc8805',
  'client_secret': '48bef0f99fB24C6698E8Dce7be6A7605',
}
```

### After (Secure ✅)
Credentials loaded from environment variables:

```javascript
// proxy-server.js (NEW - SECURE!)
require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const B2B_API_URL = process.env.B2B_API_URL;

headers: {
  'client_id': CLIENT_ID,
  'client_secret': CLIENT_SECRET,
}
```

## Environment Variables

### Proxy Server Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `CLIENT_ID` | B2B API Client ID | `f064e3c1...` |
| `CLIENT_SECRET` | B2B API Client Secret | `48bef0f9...` |
| `B2B_API_URL` | Full B2B API endpoint URL | `https://b2b-inbound-http-pj32...` |

### Main App Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_PROXY_URL` | Proxy server endpoint | `http://localhost:3001/api/submit-order` |

## Validation

The proxy server will validate that all required environment variables are set when it starts:

```bash
cd proxy-server
npm start
```

If any variables are missing, you'll see:
```
❌ ERROR: Missing required environment variables!
Please create a .env file in the proxy-server directory with:
  CLIENT_ID=your_client_id
  CLIENT_SECRET=your_client_secret
  B2B_API_URL=your_api_url
```

## Deployment

### Development
The `.env` files are already set up locally and working.

### Production
When deploying to production:

1. **Do NOT** commit `.env` files
2. **Do** set environment variables in your hosting platform:
   - Heroku: Use `heroku config:set`
   - AWS: Use Systems Manager Parameter Store or Secrets Manager
   - Vercel/Netlify: Use their environment variable settings
   - Docker: Use secrets or environment files

Example for Heroku:
```bash
heroku config:set CLIENT_ID=your_client_id
heroku config:set CLIENT_SECRET=your_client_secret
heroku config:set B2B_API_URL=your_api_url
```

## Verifying Security

### Check what will be committed:
```bash
git status
```

You should **NOT** see:
- `.env`
- `proxy-server/.env`

You **SHOULD** see:
- `.env.example`
- `proxy-server/.env.example`

### Verify .gitignore is working:
```bash
git check-ignore -v .env
git check-ignore -v proxy-server/.env
```

Both should show they're ignored.

## Best Practices

✅ **DO:**
- Use `.env` files for local development
- Commit `.env.example` files as templates
- Use environment variables in production
- Rotate credentials regularly
- Use different credentials for dev/staging/production

❌ **DON'T:**
- Commit `.env` files to git
- Share credentials in chat/email/slack
- Hardcode credentials in source files
- Use production credentials in development
- Push credentials to public repositories

## Recovery

If credentials were accidentally committed:

1. **Immediately rotate the credentials** on the API provider side
2. Remove from git history:
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch proxy-server/.env" \
     --prune-empty --tag-name-filter cat -- --all
   ```
3. Force push (⚠️ be careful!):
   ```bash
   git push origin --force --all
   ```
4. Update `.env` with new credentials

## Support

If you need the credentials:
- Contact the project administrator
- Check your secure credential vault
- Request access through proper channels

**Never** request credentials through:
- Public chat channels
- Email
- Issue trackers
- Pull request comments

