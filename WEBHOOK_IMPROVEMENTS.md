# LemonSqueezy Webhook Improvements

## ✅ What Was Fixed

I've improved your webhook handler to handle all LemonSqueezy subscription events correctly:

### 1. **Enhanced Event Handling**
All webhook events are now properly handled:
- ✅ `subscription_created` - Activates subscription
- ✅ `subscription_updated` - Updates subscription status
- ✅ `subscription_cancelled` - Marks as cancelled
- ✅ `subscription_resumed` - Reactivates subscription
- ✅ `subscription_expired` - Marks as expired
- ✅ `subscription_paused` - Marks as paused
- ✅ `subscription_unpaused` - Reactivates subscription
- ✅ `subscription_payment_failed` - Logs failure, maintains active status
- ✅ `subscription_payment_success` - Activates/confirms subscription

### 2. **Improved User ID Extraction**
The webhook now searches for `user_id` in multiple locations:
- `meta.custom_data.user_id`
- `data.attributes.custom_data.user_id`
- Included objects (for subscription_created events)
- Order relationships
- Variant metadata

This ensures we can find the user ID even if LemonSqueezy stores it differently.

### 3. **Better Signature Verification**
- Handles both `x-signature` and `X-Signature` headers
- Improved raw body handling for Firebase Functions v2
- Better error logging for debugging signature issues

### 4. **Enhanced Logging**
Added comprehensive logging to help debug any issues:
- Logs when webhook is received
- Logs signature verification status
- Logs where user_id was found
- Logs subscription update operations
- Logs errors with full context

## 🚀 Deployment Steps

### Option 1: Deploy via Firebase CLI

```bash
cd /Users/mehmetborakurucu/Desktop/gamerlinks

# Build the functions
cd functions
npm run build
cd ..

# Deploy the webhook function
firebase deploy --only functions:lemonsqueezyWebhook
```

If you get a service identity error, wait a few minutes and try again, or deploy all functions:

```bash
firebase deploy --only functions
```

### Option 2: Set Environment Variable (Recommended for v2)

For Firebase Functions v2, you can also set the secret as an environment variable:

1. Go to [Firebase Console](https://console.firebase.google.com/project/gamerlinks-844c5/functions/config)
2. Navigate to Functions → Configuration
3. Add environment variable:
   - **Name**: `LEMONSQUEEZY_WEBHOOK_SECRET`
   - **Value**: `sk_live_abc123xyz789`
4. Save and redeploy

The code already supports both the legacy config and environment variables.

## 🔍 Verification Steps

### 1. Check Webhook URL in LemonSqueezy

Ensure your webhook is configured in LemonSqueezy:
- **URL**: `https://gamerlinks.org/api/lemonsqueezyWebhook`
- **Signing Secret**: `sk_live_abc123xyz789`
- **Events**: All subscription events checked

### 2. Check Function Deployment

After deploying, verify the function exists:
```bash
firebase functions:list
```

You should see `lemonsqueezyWebhook` in the list.

### 3. Test the Webhook

**Option A: Test in LemonSqueezy Dashboard**
1. Go to LemonSqueezy → Settings → Webhooks
2. Find your webhook
3. Use "Send test event" if available
4. Or create a test subscription

**Option B: Check Logs**
```bash
firebase functions:log --only lemonsqueezyWebhook
```

Watch for:
- ✅ "Webhook received" - Function is being called
- ✅ "Webhook signature verified" - Signature is correct
- ✅ "Found user_id in webhook data" - User ID extracted successfully
- ✅ "Subscription updated" or "Subscription created" - Database updated

### 4. Verify Subscription Status

1. Go to your website and sign in
2. Check if subscription status shows as "Premium" or "Active"
3. Try adding more than 3 links or 2 events (should work if premium)

### 5. Check Firestore

1. Go to [Firebase Console](https://console.firebase.google.com/project/gamerlinks-844c5/firestore)
2. Navigate to `subscriptions` collection
3. Find your user ID document
4. Verify:
   - `status` = "active"
   - `lemonSqueezySubscriptionId` is set
   - `expiresAt` is set to a future date

## 🐛 Troubleshooting

### Issue: Subscription still shows as free

**Possible causes:**
1. **Webhook not receiving events**:
   - Check LemonSqueezy webhook logs
   - Verify webhook URL is correct: `https://gamerlinks.org/api/lemonsqueezyWebhook`
   - Check if webhook is enabled in LemonSqueezy

2. **Signature verification failing**:
   - Verify signing secret matches exactly in both places
   - Check function logs for "Invalid webhook signature"
   - Ensure no extra spaces in the secret

3. **User ID not found**:
   - Check function logs for "No user_id found"
   - Verify checkout includes `checkout[custom][user_id]` parameter
   - Check if custom_data is being sent by LemonSqueezy

4. **Webhook not deployed**:
   - Run `firebase deploy --only functions:lemonsqueezyWebhook`
   - Check Firebase Console for deployed functions

### Issue: Webhook returns 401 (Unauthorized)

- Signature verification is failing
- Check that `LEMONSQUEEZY_WEBHOOK_SECRET` or config value matches exactly
- No spaces or extra characters
- Try redeploying the function

### Issue: Webhook returns 400 (Bad Request)

- Usually means `user_id` is missing
- Check function logs for "Missing user_id in custom_data"
- Verify checkout URL includes custom_data parameter:
  ```
  checkout[custom][user_id]=${encodeURIComponent(userId)}
  ```

## 📝 Manual Subscription Activation (Testing)

If webhooks aren't working yet, you can manually activate your subscription:

1. Go to [Firestore Console](https://console.firebase.google.com/project/gamerlinks-844c5/firestore)
2. Navigate to `subscriptions` collection
3. Create/update document with your Firebase Auth UID:
   ```json
   {
     "status": "active",
     "subscriptionId": "test_subscription",
     "lemonSqueezySubscriptionId": "your_lemon_squeezy_subscription_id",
     "expiresAt": [Timestamp - 30 days from now],
     "createdAt": [Timestamp - now],
     "updatedAt": [Timestamp - now]
   }
   ```

## 🔐 Security Notes

- The webhook secret is stored in Firebase Functions config (will be deprecated) or environment variables
- Signature verification ensures only legitimate LemonSqueezy requests are processed
- All webhook events are logged for audit purposes

## 📚 Next Steps

1. Deploy the updated webhook function
2. Test by subscribing again or using a test subscription
3. Check logs to verify webhooks are being received
4. Confirm subscription status updates correctly

If you need help debugging, check the Firebase Functions logs first - they now include detailed information about what's happening.

