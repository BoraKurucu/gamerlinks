# Manual Subscription Fix

Since the webhook handler is now fixed but your subscription was processed with the old handler, you can manually fix it in Firestore.

## Steps:

1. Go to [Firebase Console - Firestore](https://console.firebase.google.com/project/gamerlinks-844c5/firestore/data)

2. Navigate to the `subscriptions` collection

3. Find document with ID: `uiJeOoxo4CUfo2JZdUjZrPl3iOO2` (your user ID)

4. If the document exists, update it:
   - `status`: Change to `"active"`
   - `lemonSqueezySubscriptionId`: Set to `"1611164"`
   - `subscriptionId`: Set to `"1611164"`
   - `expiresAt`: Set to December 3, 2025 (based on `renews_at: "2025-12-03T14:03:48.000000Z"`)

5. If the document doesn't exist, create it with these fields:
   ```json
   {
     "status": "active",
     "subscriptionId": "1611164",
     "lemonSqueezySubscriptionId": "1611164",
     "expiresAt": [Timestamp: 2025-12-03 14:03:48 UTC],
     "createdAt": [Timestamp: 2025-11-03 14:03:50 UTC],
     "updatedAt": [Timestamp: now]
   }
   ```

6. Save the document

7. Hard refresh your browser (Ctrl+Shift+R / Cmd+Shift+R)

The subscription should now show as active!

