# 🚀 Deployment Checklist - Push Notifications

## ✅ Code is Deployed!

Your code has been committed and pushed to Git. Vercel will automatically deploy it.

## 🔧 Next Steps to Complete Firebase Setup

### Step 1: Set Up Firebase (One-Time Per Client)

1. **Login to Firebase CLI:**
   ```bash
   npx firebase-tools login
   ```
   (Opens browser - click "Allow")

2. **Run Setup Script:**
   ```bash
   node scripts/setup-firebase.js client1
   ```
   Replace `client1` with your actual client name.

3. **The script will:**
   - ✅ Create Firebase project
   - ✅ Generate VAPID keys
   - ✅ Save keys to `firebase-keys/` folder
   - ✅ Show you the keys to copy

### Step 2: Add VAPID Key to Firebase Console

1. Go to: `https://console.firebase.google.com/project/YOUR_PROJECT_ID/settings/cloudmessaging`
2. Scroll to "Web configuration" → "Web Push certificates"
3. Click "Add key pair" or paste your **Public Key** (from script output)
4. Save

### Step 3: Add Environment Variables to Vercel

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add these variables:

   ```
   NEXT_PUBLIC_FIREBASE_PROJECT_ID = (from script output)
   NEXT_PUBLIC_FIREBASE_VAPID_KEY = (public key from script output)
   FIREBASE_VAPID_PRIVATE_KEY = (private key from script output)
   ```

   **Also add your existing variables:**
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
   - `GOOGLE_SHEET_ID` (if needed)

3. **Redeploy** after adding variables (Vercel will auto-redeploy)

### Step 4: Test on Live URL

1. Visit your live Vercel URL (HTTPS required for push notifications)
2. You should see:
   - ✅ Calendar Modal appears first
   - ✅ Click "Download PDF" → Permission prompt → PDF downloads
   - ✅ Or click "X" → Permission prompt → Preferential Vote Modal
   - ✅ After voting → Full site content

3. **Test Push Notification:**
   - Allow notifications when prompted
   - Check browser console for FCM token
   - Verify token is saved in Google Sheets "Push Notification Subscribers" tab

## 📱 Testing on Mobile

### Android (Chrome):
- ✅ Full support
- ✅ Works immediately after deployment

### iOS (Safari):
- ✅ Requires iOS 16.4+
- ✅ Works in Safari and Chrome on iOS
- ✅ Native system prompts

## 🔍 Troubleshooting

### "Service Worker registration failed"
- Make sure you're on HTTPS (not localhost)
- Check browser console for errors
- Verify `firebase-messaging-sw.js` is in `/public` folder

### "Notification permission denied"
- User must click "Allow" on the browser prompt
- If denied, user needs to manually enable in browser settings

### "FCM token not generated"
- Check Firebase Console → Cloud Messaging → Web Push certificates
- Verify VAPID public key is added
- Check browser console for errors

### "Modals not showing"
- Clear browser localStorage: `localStorage.clear()`
- Or visit: `?clear=true` in URL

## 📊 Google Sheets Tracking

After setup, you'll see these new sheets:
- **Calendar Downloads** - Tracks PDF downloads and permission requests
- **Push Notification Subscribers** - Stores FCM tokens for sending notifications

## 🎯 What's Working Now

✅ Calendar Modal with PDF download  
✅ Push notification permission requests  
✅ Smart "X" button intercept  
✅ Sequential modal flow (Calendar → Vote → Site)  
✅ FCM token generation and storage  
✅ Google Sheets tracking  
✅ Mobile-responsive design  
✅ iOS and Android support  

## 🚨 Important Notes

1. **HTTPS Required:** Push notifications only work on HTTPS (production)
2. **One Firebase Project Per Client:** Use the setup script for each client
3. **Free Forever:** FCM is free for unlimited users and notifications
4. **VAPID Keys:** Keep private keys secure, never commit to Git

## 📞 Need Help?

Check `FIREBASE_SETUP_GUIDE.md` for detailed instructions.
