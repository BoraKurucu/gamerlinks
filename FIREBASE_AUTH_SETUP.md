# Firebase Authentication - Authorized Domains Setup

## Issue
Getting `auth/unauthorized-domain` error when trying to sign in with Google on `gamerlinks.org`.

## Solution
Add `gamerlinks.org` to Firebase Authentication's authorized domains.

## Step-by-Step Instructions

### 1. Go to Firebase Console
Open: [Firebase Console - Authentication](https://console.firebase.google.com/project/gamerlinks-844c5/authentication/settings)

Direct link to authorized domains:
```
https://console.firebase.google.com/project/gamerlinks-844c5/authentication/settings/authorized-domains
```

### 2. Navigate to Authorized Domains
1. In Firebase Console, go to your project: **gamerlinks-844c5**
2. Click on **Authentication** in the left sidebar
3. Click on the **Settings** tab
4. Click on **Authorized domains** tab

### 3. Add Your Custom Domain
1. You should see a list of authorized domains like:
   - `localhost` (for development)
   - `gamerlinks-844c5.firebaseapp.com`
   - `gamerlinks-844c5.web.app`

2. Click the **Add domain** button

3. Enter your custom domain:
   ```
   gamerlinks.org
   ```

4. Click **Add**

### 4. Verify
After adding, you should see `gamerlinks.org` in the list of authorized domains.

## Important Notes

### Authorized Domains Explained
- **Authorized domains** are domains that Firebase allows to perform OAuth redirects
- This is a security feature to prevent unauthorized domains from using your Firebase Auth
- Each domain must be explicitly added

### Domains That Should Be Authorized
For your project, you should have:
- ✅ `localhost` (for local development)
- ✅ `gamerlinks-844c5.firebaseapp.com` (default Firebase hosting)
- ✅ `gamerlinks-844c5.web.app` (default Firebase hosting)
- ✅ `gamerlinks.web.app` (your custom site)
- ✅ `gamerlinks.org` (your custom domain) ← **Add this one!**

### Testing
After adding the domain:
1. Wait 1-2 minutes for changes to propagate
2. Try signing in with Google on `https://gamerlinks.org`
3. The error should be gone and Google sign-in should work

### Troubleshooting

**Still getting the error?**
- Make sure you added `gamerlinks.org` (not `www.gamerlinks.org` or `https://gamerlinks.org`)
- Wait a few minutes for Firebase to propagate the changes
- Clear your browser cache and try again
- Try in an incognito/private window

**Need to add www subdomain?**
- If you also want `www.gamerlinks.org` to work, add it as a separate domain
- Add: `www.gamerlinks.org`

## Quick Access Links

- **Firebase Console**: https://console.firebase.google.com/project/gamerlinks-844c5
- **Auth Settings**: https://console.firebase.google.com/project/gamerlinks-844c5/authentication/settings
- **Authorized Domains**: https://console.firebase.google.com/project/gamerlinks-844c5/authentication/settings/authorized-domains

