# ✅ Firebase Setup - What You've Done

## Your Firebase Configuration

- **Project ID:** `bar-council-8a238`
- **VAPID Public Key (Key Pair):** `BGTvsS1SepQ9sAMLRKQJDdI_VhD1JUUoRWjjAtsxT4QDDGWeOn9jtxsZzBcbYwO1aRSh-9i1oI7Ovk50MWQ6Rd8`
- **VAPID Private Key:** `C-dv95Px2Ist8LzP06bhfLcJ6MPdfEl0TLysibRCsTg`

## ✅ What You've Already Done

1. ✅ Generated VAPID key pair in Firebase Console
2. ✅ Saved keys and project ID in Vercel Environment Variables

## 📋 Vercel Environment Variables Checklist

Make sure you have these **exact variable names** in Vercel:

### Public Variables (NEXT_PUBLIC_ prefix):
```
NEXT_PUBLIC_FIREBASE_PROJECT_ID = bar-council-8a238
NEXT_PUBLIC_FIREBASE_VAPID_KEY = BGTvsS1SepQ9sAMLRKQJDdI_VhD1JUUoRWjjAtsxT4QDDGWeOn9jtxsZzBcbYwO1aRSh-9i1oI7Ovk50MWQ6Rd8
```

### Private Variable (no NEXT_PUBLIC_ prefix):
```
FIREBASE_VAPID_PRIVATE_KEY = C-dv95Px2Ist8LzP06bhfLcJ6MPdfEl0TLysibRCsTg
```

## 🔍 Understanding the Keys

- **"Key Pair" (Public Key):** This is the VAPID **public key**. It's safe to expose in your code/config. This is what you see in Firebase Console as "Key pair".
- **"Private Key":** This is the VAPID **private key**. Keep it secret! Only in environment variables, never in code.

## 🚀 Next Steps

1. **Verify Vercel Environment Variables:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Make sure all 3 variables above are set correctly
   - **Important:** After adding/updating variables, Vercel will auto-redeploy

2. **Wait for Deployment:**
   - Vercel will automatically redeploy after you add environment variables
   - Usually takes 1-2 minutes

3. **Test on Live URL:**
   - Visit your Vercel URL (HTTPS required for push notifications)
   - Calendar Modal should appear
   - Click "Download PDF" → Browser will ask for notification permission
   - Allow → PDF downloads, push notifications enabled!

## 🧪 Testing Checklist

- [ ] Visit live Vercel URL (HTTPS)
- [ ] Calendar Modal appears on page load
- [ ] Click "Download PDF" → Permission prompt appears
- [ ] Allow notifications → PDF downloads
- [ ] Check browser console for FCM token (should appear)
- [ ] Check Google Sheets → "Push Notification Subscribers" tab (token should be saved)

## 📱 Mobile Testing

- **Android Chrome:** Full support, works immediately
- **iOS Safari:** Requires iOS 16.4+, works in Safari and Chrome on iOS

## 🔄 For Additional Clients

When you add more clients to the same Firebase project:

1. Go to Firebase Console → Cloud Messaging → Web Push certificates
2. Click "Generate key pair" again
3. Get new Public Key and Private Key
4. Update `config/candidate.config.ts` with new keys (or use environment variables)
5. Add new keys to Vercel Environment Variables
6. Each client gets unique VAPID keys but uses the same project

## ✅ You're All Set!

Your Firebase setup is complete. Once Vercel redeploys with the environment variables, push notifications will work!

Need help testing? Let me know!
