# 📱 How to Send Push Notifications

## 🎯 Quick Answer

**You can send push notifications from:**
1. **Admin Panel:** `https://yourdomain.com/admin/push-notifications`
2. **API Endpoint:** `/api/send-push-notification`

## 📍 Where to Send From

### Option 1: Admin Panel (Easiest) ✅

1. **Visit:** `https://yourdomain.com/admin/push-notifications`
2. **Enter:**
   - Notification Title
   - Notification Message
3. **Choose:**
   - ✅ "Send to All Subscribers" - Sends to everyone in Google Sheets
   - Or uncheck and paste specific FCM tokens
4. **Click:** "Send Push Notification"

### Option 2: API Endpoint (For Automation)

```bash
POST /api/send-push-notification
Content-Type: application/json

{
  "title": "Important Update",
  "body": "Your message here",
  "sendToAll": true
}
```

## ⚙️ Setup Required

### Step 1: Get Firebase Server Key (Legacy API)

1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project: `bar-council-8a238`
3. Go to: **Project Settings** → **Cloud Messaging**
4. Scroll to **"Cloud Messaging API (Legacy)"** section
5. Click **"Server key"** (if available) or **"Generate new key"**
6. Copy the Server Key

### Step 2: Add to Vercel Environment Variables

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add:
```
FIREBASE_SERVER_KEY = your-server-key-here
```

### Step 3: Redeploy

Vercel will auto-redeploy after adding the variable.

## 🔄 Alternative: Use Firebase Admin SDK (More Secure)

If Server Key is not available, use Firebase Admin SDK:

1. **Create Service Account:**
   - Firebase Console → Project Settings → Service Accounts
   - Click "Generate new private key"
   - Download JSON file

2. **Add to Vercel:**
   ```
   FIREBASE_SERVICE_ACCOUNT = (paste entire JSON content)
   ```

3. **Update API route** to use Admin SDK instead of REST API

## 📊 How It Works

1. **FCM Tokens Stored:** When users allow notifications, their FCM tokens are saved to Google Sheets → "Push Notification Subscribers"
2. **Send Notification:** Admin panel reads tokens from Google Sheets
3. **Firebase Sends:** Uses Firebase Cloud Messaging to deliver notifications
4. **Users Receive:** Notifications appear on their devices

## 🧪 Testing

1. **Test to Yourself First:**
   - Get your FCM token from browser console (after allowing notifications)
   - Uncheck "Send to All"
   - Paste your token
   - Send test notification

2. **Then Send to All:**
   - Check "Send to All Subscribers"
   - Send notification
   - Check results (success count, failure count)

## 📝 Example Notification

**Title:** "Important Election Update"
**Message:** "Dear Advocate, please cast your first preferential vote for [Candidate Name] in the Telangana State Bar Council elections. Click here to vote."

## 🚨 Important Notes

- **HTTPS Required:** Push notifications only work on HTTPS (production)
- **User Permission:** Users must have allowed notifications
- **Token Validity:** FCM tokens can expire - failed tokens are logged for cleanup
- **Rate Limits:** Firebase has rate limits, but very high (thousands per second)

## 🔍 Troubleshooting

### "No FCM tokens found"
- Make sure users have subscribed (allowed notifications)
- Check Google Sheets → "Push Notification Subscribers" sheet exists
- Verify tokens are in Column B

### "Firebase Server Key required"
- Add `FIREBASE_SERVER_KEY` to Vercel environment variables
- Get key from Firebase Console → Cloud Messaging → Server Key

### "Failed to send"
- Check Firebase Console for errors
- Verify server key is correct
- Check token validity (some tokens may have expired)

## ✅ You're Ready!

Once you add the Firebase Server Key to Vercel, you can start sending push notifications to all your subscribers!
