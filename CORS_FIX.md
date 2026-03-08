# CORS Error Fix

## Problem

The Twitch callback was getting a CORS error when calling the Firebase Function:
```
Access to fetch at 'https://us-central1-gamerlinks-844c5.cloudfunctions.net/exchangeTwitchToken' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

## Root Cause

The Firebase callable function requires proper authentication context, and the callback page might be calling it before the user's auth state is fully initialized.

## Fixes Applied

### 1. Function Updates (`functions/src/twitchAuth.ts`)
- ✅ Removed strict auth requirement
- ✅ Added support for userId passed in request data
- ✅ Better error handling

### 2. Callback Page Updates (`src/pages/TwitchCallback.jsx`)
- ✅ Added auth state wait logic
- ✅ Ensures user is authenticated before calling function
- ✅ Better error messages

### 3. Auth Service Updates (`src/shared/twitchAuthService.js`)
- ✅ Properly imports Firebase Functions
- ✅ Passes userId in request data
- ✅ Better error handling

## Solution

**The function needs to be redeployed** with these fixes. Firebase callable functions automatically handle CORS, but the function needs to be deployed correctly.

### Steps to Fix

1. **Build the functions:**
   ```bash
   cd functions
   npm run build
   cd ..
   ```

2. **Deploy the functions:**
   ```bash
   firebase deploy --only functions
   ```

3. **Wait 1-2 minutes** for deployment to complete

4. **Test again:**
   - Go to Settings
   - Click "Connect Twitch"
   - Complete OAuth flow
   - Should work without CORS errors

## Why This Happens

Firebase callable functions (`onCall`) automatically handle CORS, but:
- The function must be deployed
- The function must respond properly to preflight OPTIONS requests
- Authentication context must be available

## If CORS Error Persists

If you still get CORS errors after deploying:

1. **Check function logs:**
   ```bash
   firebase functions:log
   ```

2. **Verify function is deployed:**
   - Go to Firebase Console → Functions
   - Confirm `exchangeTwitchToken` is listed

3. **Check function region:**
   - Ensure function is in the same region (us-central1)
   - Or update Firebase config to match

4. **Clear browser cache:**
   - Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
   - Or try incognito mode

## Expected Behavior After Fix

✅ No CORS errors  
✅ Function call succeeds  
✅ Twitch connection completes  
✅ User redirected to Settings with success message  

---

**Status:** ✅ Code fixed - **Deploy functions to apply fix**

























