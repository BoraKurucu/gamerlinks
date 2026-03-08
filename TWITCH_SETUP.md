# Twitch API Integration Setup Guide

This guide will help you set up the Twitch API integration for GamerLinks.

## Step 1: Configure Twitch Developer Console

### Current Settings Status

Your current Twitch application settings:
- **Client ID**: `nb857fbdk9nj1vuf4tz9k0ppjqp5h7`
- **Client Type**: Confidential (Correct ✓)
- **Category**: Website Integration (Correct ✓)

### ✅ Required Redirect URLs

You need to add **BOTH** of these redirect URLs in your Twitch Developer Console:

1. **Development URL:**
   ```
   http://localhost:3000/auth/twitch/callback
   ```

2. **Production URL:**
   ```
   https://gamerlinks.org/auth/twitch/callback
   ```

### How to Add Redirect URLs

1. Go to [Twitch Developer Console](https://dev.twitch.tv/console)
2. Click on your application "GamerLinks"
3. Scroll to **"OAuth yeniden yönlendirme URL'leri"** (OAuth Redirect URLs)
4. Currently you have: `http://localhost:3000`
5. **Update it to:** `http://localhost:3000/auth/twitch/callback`
6. Click **"Ekle"** (Add) to add the production URL: `https://gamerlinks.org/auth/twitch/callback`
7. Click **"Güncelleştir"** (Update) to save

**Important:** The redirect URL must **exactly match** what you send in the OAuth request, including:
- Protocol (http vs https)
- Domain (localhost vs gamerlinks.org)
- Port (if specified)
- Path (`/auth/twitch/callback`)

## Step 2: Set Environment Variables

### Frontend (`.env.local`)

Add to your `.env.local` file:

```bash
REACT_APP_TWITCH_CLIENT_ID=nb857fbdk9nj1vuf4tz9k0ppjqp5h7
```

**Note:** Do NOT put the Client Secret in the frontend environment variables! It should only be stored as a Firebase Function secret (see below).

### Firebase Functions Secret

The Client Secret must be stored securely in Firebase Functions:

1. **Get your Client Secret:**
   - Go to your Twitch Developer Console
   - Click "Yeni Gizli" (New Secret) button
   - Copy the secret immediately (you can only see it once!)

2. **Set as Firebase Function Secret:**
   ```bash
   firebase functions:secrets:set TWITCH_CLIENT_SECRET
   ```
   When prompted, paste your Client Secret.

3. **Verify the secret is set:**
   ```bash
   firebase functions:secrets:access TWITCH_CLIENT_SECRET
   ```

4. **Deploy functions** (the secret will be automatically included):
   ```bash
   cd functions
   npm run build
   cd ..
   firebase deploy --only functions
   ```

### Firebase Functions Environment Variable

Add to your Firebase Functions environment (or set in Firebase Console):

```bash
firebase functions:config:set twitch.client_id="nb857fbdk9nj1vuf4tz9k0ppjqp5h7"
```

Or add to `functions/.env` or set in Firebase Console under Functions > Configuration.

## Step 3: Deploy the Integration

### 1. Build and Deploy Firebase Functions

```bash
cd functions
npm install  # Install any new dependencies
npm run build
cd ..
firebase deploy --only functions
```

### 2. Restart Your Development Server

```bash
npm start
```

## Step 4: Test the Integration

1. **Start your development server:**
   ```bash
   npm start
   ```

2. **Navigate to Settings** (you'll need to add a "Connect Twitch" button - see below)

3. **Click "Connect Twitch"** button

4. **Authorize the app** on Twitch

5. **You should be redirected back** to `/auth/twitch/callback`

6. **Check the console** for any errors

## Step 5: Add UI for Twitch Connection

You'll need to add a "Connect Twitch" button in your Settings page. Here's a quick example:

```jsx
import { initiateTwitchAuth, isTwitchConfigured } from '../shared/twitchAuthService';

// In your Settings component:
const handleConnectTwitch = () => {
  try {
    initiateTwitchAuth();
  } catch (error) {
    console.error('Failed to initiate Twitch auth:', error);
  }
};

// In your JSX:
{isTwitchConfigured() && (
  <button onClick={handleConnectTwitch}>
    Connect Twitch Account
  </button>
)}
```

## Troubleshooting

### Error: "Invalid redirect_uri"

**Cause:** The redirect URL in your Twitch Developer Console doesn't match the one in your code.

**Fix:**
1. Check what redirect URL your app is using (should be `http://localhost:3000/auth/twitch/callback` for dev)
2. Make sure it's **exactly** the same in Twitch Console (including trailing slash if present)
3. Twitch is case-sensitive for redirect URIs

### Error: "Failed to exchange code for token"

**Cause:** Client Secret is not set or incorrect.

**Fix:**
1. Verify the secret is set: `firebase functions:secrets:access TWITCH_CLIENT_SECRET`
2. Redeploy functions: `firebase deploy --only functions`
3. Check function logs: `firebase functions:log`

### Error: "Authentication required"

**Cause:** User is not signed in when trying to connect Twitch.

**Fix:** Make sure the user is authenticated before calling `initiateTwitchAuth()`.

### Error: "Twitch Client ID is not configured"

**Cause:** `REACT_APP_TWITCH_CLIENT_ID` is not set in `.env.local`.

**Fix:**
1. Create/update `.env.local` file
2. Add: `REACT_APP_TWITCH_CLIENT_ID=nb857fbdk9nj1vuf4tz9k0ppjqp5h7`
3. Restart dev server

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never commit secrets to Git:**
   - Client Secret should only be in Firebase Functions secrets
   - Client ID in `.env.local` is okay (it's public)

2. **Token Storage:**
   - Currently tokens are stored in `sessionStorage` (temporary)
   - In production, store tokens in Firestore per user
   - Encrypt sensitive token data

3. **Token Refresh:**
   - Access tokens expire after 1-3 months
   - Implement refresh token logic to automatically renew tokens
   - Handle token expiration gracefully in your API calls

## Next Steps

After basic integration is working:

1. **Store tokens in Firestore** (per user document)
2. **Implement token refresh logic**
3. **Add stream status checking** (use `isTwitchUserLive()`)
4. **Auto-sync profile data** from Twitch
5. **Show live indicators** on profiles

## API Documentation

- [Twitch API Reference](https://dev.twitch.tv/docs/api/)
- [Twitch OAuth Guide](https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/)
- [Twitch API Scopes](https://dev.twitch.tv/docs/authentication/scopes/)

## Support

If you encounter issues:

1. Check Firebase Function logs: `firebase functions:log`
2. Check browser console for errors
3. Verify all environment variables are set
4. Ensure redirect URLs match exactly

























