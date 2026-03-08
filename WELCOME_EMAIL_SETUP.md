# Welcome Email Setup Guide for GamerLinks

## 🎯 Where to Set It Up: **Firebase Console**

You'll configure welcome emails in **Firebase Console** (not Google Console or Squarespace). Firebase has built-in email templates that trigger automatically when users sign up.

---

## 📧 Step-by-Step Setup

### Step 1: Go to Firebase Console
1. Go to https://console.firebase.google.com
2. Select your project (gamerlinks-844c5 or your project name)
3. Click on **Authentication** in the left sidebar
4. Click on the **Templates** tab
5. You'll see different email templates

### Step 2: Customize Welcome Email Template
1. Find **"Email address verification"** template (for email/password signups)
2. Click **Edit** or **Customize**
3. You can customize:
   - Subject line
   - Email body
   - Action button text
   - Footer

### Step 3: Enable Welcome Emails
Firebase doesn't have a separate "welcome email" template, but you can:

**Option A: Use Email Verification Template** (Recommended)
- Customize the verification email to also welcome them
- Include welcome message + verification link

**Option B: Send Custom Welcome Email via Cloud Function** (More Control)
- Create a Firebase Cloud Function that triggers on user creation
- Send custom welcome email using Firebase Admin SDK
- More flexible, can include personalized content

---

## 🔧 Option A: Customize Firebase Email Template

### Template Customization:

**Subject Line:**
```
Welcome to GamerLinks! Verify your email to get started 🎮
```

**Email Body:**
```
Hi there!

Welcome to GamerLinks - your free link in bio tool for streamers! 🎮

We're excited to have you join our community. To get started, please verify your email address by clicking the button below.

[VERIFY EMAIL BUTTON]

Once verified, you can:
• Create your gaming profile
• Auto-schedule your streams
• Track your analytics
• Get AI-powered growth tips

All completely free, forever!

Need help? Just reply to this email - we're here to help.

Happy streaming! 🚀

— Team GamerLinks
```

**Action Button Text:**
```
Verify Email & Get Started
```

---

## 🚀 Option B: Custom Welcome Email via Cloud Function (Recommended)

This gives you more control and allows you to send a separate welcome email after verification.

### Step 1: Create Cloud Function

Create a file: `functions/src/sendWelcomeEmail.ts`

```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';

// Configure email transporter (using Gmail or your email service)
const transporter = nodemailer.createTransport({
  service: 'gmail', // or use SMTP settings
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.password,
  },
});

// Trigger when a new user is created
export const sendWelcomeEmail = functions.auth.user().onCreate(async (user) => {
  // Only send if email is verified (or send after verification)
  if (!user.emailVerified) {
    console.log('Email not verified yet, will send after verification');
    return null;
  }

  const email = user.email;
  const displayName = user.displayName || 'Gamer';

  const mailOptions = {
    from: 'Team GamerLinks <noreply@gamerlinks.org>',
    to: email,
    subject: 'Welcome to GamerLinks! 🎮',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .features { list-style: none; padding: 0; }
            .features li { padding: 10px 0; border-bottom: 1px solid #eee; }
            .features li:before { content: "✓ "; color: #667eea; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to GamerLinks! 🎮</h1>
            </div>
            <div class="content">
              <p>Hi ${displayName},</p>
              
              <p>Welcome to GamerLinks - your free link in bio tool built specifically for streamers and gamers!</p>
              
              <p>We're excited to have you join our community. Here's what you can do:</p>
              
              <ul class="features">
                <li>Create your gaming profile in 30 seconds</li>
                <li>Auto-schedule recurring streams (set once, done forever)</li>
                <li>Track analytics - see which links get the most clicks</li>
                <li>Get AI-powered growth tips personalized for your channel</li>
                <li>Show "Live Now" status automatically when you stream</li>
              </ul>
              
              <p><strong>Everything is 100% free, forever.</strong> No credit card required, no hidden fees.</p>
              
              <div style="text-align: center;">
                <a href="https://gamerlinks.org/dashboard" class="button">Get Started Now</a>
              </div>
              
              <p><strong>Quick Start Guide:</strong></p>
              <ol>
                <li>Go to your <a href="https://gamerlinks.org/dashboard">Dashboard</a></li>
                <li>Add your social media links (Twitch, YouTube, etc.)</li>
                <li>Set up your first recurring stream schedule</li>
                <li>Share your profile link: <strong>gamerlinks.org/view/${user.uid}</strong></li>
              </ol>
              
              <p><strong>Need Help?</strong></p>
              <p>We're here for you! Just reply to this email or visit our <a href="https://gamerlinks.org/support">Support Page</a>.</p>
              
              <p>Happy streaming! 🚀</p>
              
              <p>— Team GamerLinks</p>
              
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
              
              <p style="font-size: 12px; color: #999;">
                You're receiving this because you signed up for GamerLinks.
                <br>
                <a href="https://gamerlinks.org">gamerlinks.org</a> | 
                <a href="https://gamerlinks.org/privacy-policy">Privacy Policy</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent to:', email);
    return null;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return null;
  }
});
```

### Step 2: Install Dependencies

In your `functions` directory:

```bash
cd functions
npm install nodemailer
npm install --save-dev @types/nodemailer
```

### Step 3: Configure Email Credentials

Set your email credentials in Firebase:

```bash
firebase functions:config:set email.user="your-email@gmail.com" email.password="your-app-password"
```

**Note:** For Gmail, you need to:
1. Enable 2-factor authentication
2. Generate an "App Password" (not your regular password)
3. Use that app password in the config

### Step 4: Deploy Function

```bash
firebase deploy --only functions:sendWelcomeEmail
```

---

## 🎯 Option C: Simple Client-Side Welcome (Easiest)

If you want something quick without Cloud Functions, you can show a welcome message in your app:

### Add to Landing.jsx or Dashboard.jsx:

```javascript
// After successful signup/login
useEffect(() => {
  if (user && isNewUser) {
    // Show welcome modal or toast
    setShowWelcomeModal(true);
  }
}, [user, isNewUser]);
```

---

## 📝 Recommended Approach

**For Quick Setup (Today):**
1. Go to Firebase Console → Authentication → Templates
2. Customize the "Email address verification" template
3. Add welcome message to the verification email

**For Better Experience (This Week):**
1. Set up Cloud Function (Option B)
2. Send separate welcome email after verification
3. Include personalized content and profile link

---

## 🔍 Where to Find in Firebase Console

1. **Firebase Console:** https://console.firebase.google.com
2. **Your Project:** Select gamerlinks project
3. **Authentication:** Left sidebar → Authentication
4. **Templates Tab:** Click "Templates" tab
5. **Email Templates:** You'll see:
   - Email address verification
   - Password reset
   - Email change
   - etc.

---

## ✨ Email Template Best Practices

### Subject Line:
- Keep it short (under 50 characters)
- Include emoji for attention
- Make it personal

**Examples:**
- "Welcome to GamerLinks! 🎮"
- "Your gaming profile is ready! 🚀"
- "Let's build your gaming identity 🎮"

### Email Body:
- Welcome them by name
- Explain what they can do next
- Include clear call-to-action button
- Make it mobile-friendly
- Include support contact

### Timing:
- Send immediately after signup
- Or send after email verification
- Don't send multiple welcome emails

---

## 🚨 Important Notes

1. **Firebase Free Tier:** Includes email sending for auth emails
2. **Custom Emails:** Require Cloud Functions (paid after free tier)
3. **Email Service:** You can use:
   - Gmail (free, but limited)
   - SendGrid (free tier: 100 emails/day)
   - Mailgun (free tier: 5,000 emails/month)
   - AWS SES (very cheap)

4. **Testing:** Always test emails before deploying!

---

## 🎯 Quick Start (5 Minutes)

**Right Now:**
1. Go to Firebase Console
2. Authentication → Templates
3. Edit "Email address verification"
4. Add welcome message to the template
5. Save

**This gives you a welcome message in the verification email immediately!**

---

## 📧 Example: Complete Welcome Email Template

Here's a complete HTML template you can use:

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
    .header { background: #000; color: #00E5FF; padding: 30px; text-align: center; }
    .content { background: #f9f9f9; padding: 30px; }
    .button { display: inline-block; background: #00E5FF; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎮 Welcome to GamerLinks!</h1>
  </div>
  <div class="content">
    <p>Hi there!</p>
    <p>Welcome to GamerLinks - your free link in bio tool for streamers!</p>
    <p><strong>What you can do:</strong></p>
    <ul>
      <li>✅ Create your gaming profile</li>
      <li>✅ Auto-schedule your streams</li>
      <li>✅ Track analytics</li>
      <li>✅ Get AI growth tips</li>
    </ul>
    <p><strong>100% free, forever.</strong></p>
    <p style="text-align: center;">
      <a href="https://gamerlinks.org/dashboard" class="button">Get Started</a>
    </p>
    <p>Need help? Just reply to this email!</p>
    <p>Happy streaming! 🚀</p>
    <p>— Team GamerLinks</p>
  </div>
  <div class="footer">
    <p>gamerlinks.org | Free forever</p>
  </div>
</body>
</html>
```

---

## ✅ Checklist

- [ ] Go to Firebase Console
- [ ] Navigate to Authentication → Templates
- [ ] Customize email verification template
- [ ] Add welcome message
- [ ] Test by creating a test account
- [ ] (Optional) Set up Cloud Function for custom emails
- [ ] (Optional) Configure email service (SendGrid/Mailgun)

---

**Start with Firebase Console templates - it's the quickest way to get welcome emails working!**
































