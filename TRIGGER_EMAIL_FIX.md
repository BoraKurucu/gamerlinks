# Fix Trigger Email Extension Installation

## 🔴 Problem
The extension failed to install because OAuth2 parameters are incomplete.

## ✅ Solution: Use Gmail with App Password (Easier)

### Step 1: Generate Gmail App Password

1. Go to your Google Account: https://myaccount.google.com
2. Click **Security** (left sidebar)
3. Under "How you sign in to Google", click **2-Step Verification**
   - If not enabled, enable it first
4. Scroll down and click **App passwords**
5. Select **Mail** and **Other (Custom name)**
6. Type: "GamerLinks Email"
7. Click **Generate**
8. **Copy the 16-character password** (you'll need this!)

### Step 2: Reconfigure Extension

1. Go back to Firebase Console → Extensions
2. Click on **Trigger Email from Firestore**
3. Click **⋮** (three dots) → **Reconfigure extension**

### Step 3: Update Configuration

**Change these settings:**

1. **Authentication Type:** Change from `OAuth2` to `UsernamePassword`

2. **SMTP connection URI:** 
   ```
   smtp://smtp.gmail.com:587
   ```

3. **SMTP password:** 
   - Paste the 16-character App Password you generated

4. **Default FROM address:** 
   ```
   gamerlinkscontact@gmail.com
   ```
   (Keep this as is)

5. **Default REPLY-TO address (Optional):**
   ```
   gamerlinkscontact@gmail.com
   ```

6. **Email documents collection:**
   ```
   mail
   ```
   (Keep this as is)

7. **Leave all OAuth2 fields empty** (they're not needed)

### Step 4: Save and Deploy

1. Click **Save** or **Update extension**
2. Wait for deployment (takes 1-2 minutes)
3. Check for any errors

---

## ✅ Alternative: Use SendGrid (More Reliable for Production)

If Gmail doesn't work or you want better deliverability:

### Step 1: Sign Up for SendGrid
1. Go to https://sendgrid.com
2. Sign up (free tier: 100 emails/day)
3. Verify your email
4. Go to **Settings** → **API Keys**
5. Click **Create API Key**
6. Name it: "GamerLinks"
7. Give it **Full Access**
8. **Copy the API key** (you'll only see it once!)

### Step 2: Configure Extension

1. **Authentication Type:** `UsernamePassword`

2. **SMTP connection URI:**
   ```
   smtp://smtp.sendgrid.net:587
   ```

3. **SMTP password:** 
   - Paste your SendGrid API key

4. **Default FROM address:**
   ```
   gamerlinkscontact@gmail.com
   ```
   (Or use a SendGrid verified sender)

5. **Default REPLY-TO address:**
   ```
   gamerlinkscontact@gmail.com
   ```

---

## 🧪 Test It

After configuration, test by creating a document in Firestore:

1. Go to Firestore Console
2. Create a document in `mail` collection
3. Add these fields:
   ```json
   {
     "to": "your-email@gmail.com",
     "message": {
       "subject": "Test Email",
       "html": "<h1>Test</h1><p>This is a test email from GamerLinks!</p>",
       "text": "Test email from GamerLinks"
     }
   }
   ```
4. The extension should send the email automatically!

---

## 🔍 Troubleshooting

### Error: "Authentication failed"
- Make sure you're using an **App Password**, not your regular Gmail password
- Verify 2-Step Verification is enabled
- Check the SMTP connection URI is correct

### Error: "Extension resources not deployed"
- Check Cloud Functions logs in Firebase Console
- Make sure you have billing enabled (free tier is fine)
- Try uninstalling and reinstalling the extension

### Emails not sending
- Check the `mail` collection in Firestore
- Look for documents with `delivery` field
- Check Cloud Functions logs for errors

---

## 📝 Quick Reference

**Gmail Settings:**
- SMTP Host: `smtp.gmail.com`
- SMTP Port: `587` (TLS) or `465` (SSL)
- Username: Your Gmail address
- Password: App Password (16 characters)

**SendGrid Settings:**
- SMTP Host: `smtp.sendgrid.net`
- SMTP Port: `587`
- Username: `apikey`
- Password: Your SendGrid API key

---

**After fixing, your welcome emails will send automatically!** 🎉
































