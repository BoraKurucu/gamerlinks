# How to Get Cancel Subscription Working

## The Problem
The cancel subscription button needs a **signed customer portal URL** from LemonSqueezy webhooks. This URL includes a signature and expiration time that allows access without store activation.

## Solution: Resend Webhook to Store the URL

### Step 1: Resend the Webhook
1. Go to [LemonSqueezy Dashboard → Webhooks](https://app.lemonsqueezy.com/settings/webhooks)
2. Find your webhook for `gamerlinks.org/api/lemonsqueezyWebhook`
3. Click on it to see webhook events
4. Find the **`subscription_updated`** event for subscription `1611362`
5. Click **"Resend"**

This will:
- Send a fresh webhook with the signed customer portal URL
- Our webhook handler will store it in Firestore
- The cancel button will then work perfectly

### Step 2: Verify It Worked
After resending, wait 5-10 seconds, then:
1. Refresh your Settings page
2. Check browser console (F12) - you should see `customerPortalUrl` in the subscription data
3. The cancel button should now work!

## Alternative: Manual URL (Quick Fix)

If you can't resend the webhook right now, you can manually add the URL from your webhook data:

### From your webhook data:
```
customer_portal_update_subscription: "https://gamerlinks.lemonsqueezy.com/billing/1611362/update?expires=1762205096&user=5885319&signature=48315ba2170031c762dc568e851b96a5a77aa1dcb30d7a9374bf343f4cd61b4f"
```

**Note:** This URL expires, so resending the webhook is better for a permanent solution.

### Steps:
1. Go to [Firebase Console - Firestore](https://console.firebase.google.com/project/gamerlinks-844c5/firestore/data)
2. Navigate to `subscriptions` collection
3. Find document: `uiJeOoxo4CUfo2JZdUjZrPl3iOO2`
4. Add/update field:
   - **Field name**: `customerPortalUrl`
   - **Field value**: The full URL from webhook data above
5. Save

After this, the cancel button should work!

## About Store Activation

You **don't need to activate your store** for cancellation to work. The signed URLs from webhooks work independently of store activation status. The store activation is only needed for the general `/billing` portal, but the signed URLs bypass that requirement.

