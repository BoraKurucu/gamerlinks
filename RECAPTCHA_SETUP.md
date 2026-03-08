# reCAPTCHA v3 Setup Guide

## Step 1: Get Your reCAPTCHA Site Key

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin/create)
2. Click **"Create"** or **"Add"** to create a new site
3. Fill in the form:
   - **Label**: Enter a name (e.g., "GamerLinks")
   - **reCAPTCHA type**: Select **"reCAPTCHA v3"**
   - **Domains**: Add your domains:
     - `localhost` (for development)
     - `gamerlinks.org` (your production domain)
     - `www.gamerlinks.org` (if needed)
     - `gamerlinks.web.app` (Firebase hosting)
   - Accept the reCAPTCHA Terms of Service
4. Click **"Submit"**
5. Copy your **Site Key** (starts with something like `6Lc...`)

## Step 2: Add Site Key to Your Environment

1. Open your `.env.local` file (create it if it doesn't exist)
2. Add your reCAPTCHA site key:
   ```
   REACT_APP_RECAPTCHA_SITE_KEY=your_site_key_here
   ```
3. Save the file
4. Restart your development server: `npm start`

## Step 3: Test It

1. Try signing up with a new email account
2. Try signing in with an existing account
3. Check the browser console - you should see reCAPTCHA loading (no errors)
4. The reCAPTCHA runs invisibly in the background - users won't see any checkbox

## How It Works

- reCAPTCHA v3 runs **invisibly** in the background
- It analyzes user behavior and assigns a score (0.0 to 1.0)
- Scores below 0.5 are likely bots
- The token is generated automatically before sign-up/sign-in
- If reCAPTCHA fails to load, the app still works (graceful degradation)

## Optional: Server-Side Verification

For maximum security, you can verify tokens on the server side using your **Secret Key** (from the reCAPTCHA admin console). This would be done in a Firebase Cloud Function.

## Troubleshooting

- **reCAPTCHA not loading?** Check that your domain is added in the reCAPTCHA admin console
- **Getting errors?** Make sure your site key is correct in `.env.local`
- **Not working in production?** Ensure your production domain is added to the reCAPTCHA allowed domains list

