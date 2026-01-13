# 🔧 FCM Token Troubleshooting Guide

## ❌ Error: "No FCM tokens found in Google Sheets"

### What This Means:
- Users are allowing notifications, but their FCM tokens aren't being saved to Google Sheets
- The admin panel shows 0 subscribers even though users have allowed notifications

### Why This Happens:

1. **FCM Token Not Generated:**
   - Firebase not properly configured
   - VAPID key missing or incorrect
   - Service worker not registered

2. **Token Not Saved to Google Sheets:**
   - API call to `/api/save-fcm-token` is failing
   - Google Sheets API error
   - Sheet doesn't exist

3. **Firebase Admin SDK Not Initialized:**
   - `FIREBASE_SERVICE_ACCOUNT` not added to Vercel
   - Causes 400 error when trying to send notifications

## ✅ Solutions

### Step 1: Check Browser Console

When a user allows notifications, check browser console (F12):

**Should see:**
```
✅ FCM Token: [long-token-string]
✅ FCM token saved to Google Sheets successfully
```

**If you see errors:**
- `Firebase: Error (messaging/invalid-vapid-key)` → VAPID key is wrong
- `Service Worker registration failed` → Service worker issue
- `Failed to save FCM token` → API error

### Step 2: Check Vercel Environment Variables

Make sure these are set in Vercel:

**Required:**
```
NEXT_PUBLIC_FIREBASE_PROJECT_ID = bar-council-8a238
NEXT_PUBLIC_FIREBASE_VAPID_KEY = [your-vapid-public-key]
FIREBASE_VAPID_PRIVATE_KEY = [your-vapid-private-key]
FIREBASE_SERVICE_ACCOUNT = [entire-json-content]
```

**Also needed for Google Sheets:**
```
GOOGLE_SERVICE_ACCOUNT_EMAIL = [your-service-account-email]
GOOGLE_PRIVATE_KEY = [your-google-private-key]
```

### Step 3: Check Google Sheets

1. Open your Google Sheet
2. Look for tab: **"Push Notification Subscribers"**
3. Should have columns: Timestamp | FCM Token | Status
4. Check if tokens are being added

**If sheet doesn't exist:**
- It should be created automatically when first token is saved
- If not, create it manually with headers: `Timestamp`, `FCM Token`, `Status`

### Step 4: Test Token Generation

1. Visit your live website
2. Open browser console (F12)
3. Allow notifications when prompted
4. Look for: `FCM Token: [token]`
5. Check if you see: `✅ FCM token saved to Google Sheets successfully`

### Step 5: Check Vercel Function Logs

1. Go to Vercel Dashboard → Your Project → Functions
2. Check logs for `/api/save-fcm-token`
3. Look for errors

## 🔍 Common Issues

### Issue 1: "400 Error" when sending notifications

**Cause:** Firebase Admin SDK not initialized

**Fix:**
1. Add `FIREBASE_SERVICE_ACCOUNT` to Vercel
2. Make sure it's the entire JSON content (all 13 lines)
3. Redeploy

### Issue 2: Tokens not saving to Google Sheets

**Cause:** API call failing silently

**Fix:**
1. Check browser console for errors
2. Check Vercel function logs
3. Verify Google Sheets API credentials in Vercel
4. Make sure service account has Editor access to the sheet

### Issue 3: Subscriber count shows 0

**Cause:** No tokens in Google Sheets

**Fix:**
1. Check if users are actually allowing notifications
2. Check browser console for token generation
3. Check Google Sheets for the "Push Notification Subscribers" tab
4. Verify tokens are being saved

## 📊 How to Verify Everything Works

### Test Flow:

1. **User visits website** → Calendar Modal appears
2. **User clicks "Download PDF"** → Permission prompt appears
3. **User clicks "Allow"** → Browser console shows:
   ```
   FCM Token: [token]
   ✅ FCM token saved to Google Sheets successfully
   ```
4. **Check Google Sheets** → Token appears in "Push Notification Subscribers" tab
5. **Check Admin Panel** → Subscriber count increases
6. **Send notification** → Should work without 400 error

## 🚨 Important Notes

### Google Sheets is Required (For Our Implementation)

- **FCM itself doesn't need Google Sheets** - it works independently
- **Our implementation uses Google Sheets** to:
  - Store FCM tokens for all subscribers
  - Track who has subscribed
  - Send notifications to all subscribers at once

### Alternative (Without Google Sheets):

If you don't want to use Google Sheets, you could:
- Store tokens in a database (MongoDB, PostgreSQL, etc.)
- Use Firebase Firestore (Firebase's database)
- Store in memory (not recommended - lost on restart)

But for now, **Google Sheets is the simplest solution** and it's already set up.

## ✅ Quick Checklist

- [ ] Firebase VAPID keys added to Vercel
- [ ] Firebase Service Account added to Vercel
- [ ] Google Sheets credentials in Vercel
- [ ] Service account has Editor access to Google Sheet
- [ ] "Push Notification Subscribers" sheet exists
- [ ] Users are allowing notifications
- [ ] Browser console shows FCM token
- [ ] Browser console shows "token saved" message
- [ ] Tokens appear in Google Sheets
- [ ] Admin panel shows subscriber count > 0

## 🆘 Still Not Working?

1. Check Vercel deployment logs for errors
2. Check browser console for detailed error messages
3. Verify all environment variables are set correctly
4. Test with a fresh browser (clear cache, incognito mode)
5. Check if Firebase project is active and billing is enabled (if required)
