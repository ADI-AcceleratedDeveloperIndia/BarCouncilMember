# 🔑 Service Account Clarification

## ✅ Recommendation: Keep Them Separate

**Use separate service accounts for Google Sheets and Firebase.**

### Why Separate is Better:
- ✅ Already set up and working
- ✅ Better security (isolated permissions)
- ✅ Easier to manage
- ✅ No conflicts

## 📧 Where to Find Firebase Service Account Email

### Method 1: From the JSON File You Downloaded

You already downloaded this file:
`bar-council-8a238-firebase-adminsdk-fbsvc-901cde24f6.json`

Open it and look for:
```json
{
  "client_email": "firebase-adminsdk-fbsvc@bar-council-8a238.iam.gserviceaccount.com",
  ...
}
```

**Your Firebase Service Account Email is:**
```
firebase-adminsdk-fbsvc@bar-council-8a238.iam.gserviceaccount.com
```

### Method 2: From Vercel Environment Variables

If you already added `FIREBASE_SERVICE_ACCOUNT` to Vercel:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Find `FIREBASE_SERVICE_ACCOUNT`
3. Click to view the value
4. Look for `"client_email"` in the JSON
5. That's your Firebase service account email

### Method 3: From Firebase Console

1. Go to: https://console.firebase.google.com
2. Select project: **bar-council-8a238**
3. Click gear icon → **Project settings**
4. Go to **"Service accounts"** tab
5. You'll see: `firebase-adminsdk-fbsvc@bar-council-8a238.iam.gserviceaccount.com`

## 📋 Your Current Setup

### Google Sheets Service Account:
- **Email:** `barcouncilmember@barcouncilmember.iam.gserviceaccount.com`
- **Purpose:** Access Google Sheets API
- **Vercel Variable:** `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- **Status:** ✅ Already configured

### Firebase Service Account:
- **Email:** `firebase-adminsdk-fbsvc@bar-council-8a238.iam.gserviceaccount.com`
- **Purpose:** Send push notifications via Firebase Admin SDK
- **Vercel Variable:** `FIREBASE_SERVICE_ACCOUNT` (entire JSON)
- **Status:** ✅ Already added to Vercel

## ✅ What You Need to Do

### Step 1: Share Google Sheet with Firebase Service Account

1. Open your Google Sheet:
   - https://docs.google.com/spreadsheets/d/1YwwJVPK3neZVQhNPqjzBR5taukLYFgUkWi_vA4IB9KA

2. Click **"Share"** button (top right)

3. Add this email:
   ```
   firebase-adminsdk-fbsvc@bar-council-8a238.iam.gserviceaccount.com
   ```

4. Set permission: **Editor**

5. **Uncheck** "Notify people"

6. Click **"Share"**

### Step 2: Verify Both Service Accounts Have Access

Your Google Sheet should be shared with:
- ✅ `barcouncilmember@barcouncilmember.iam.gserviceaccount.com` (Editor)
- ✅ `firebase-adminsdk-fbsvc@bar-council-8a238.iam.gserviceaccount.com` (Editor)

## 🎯 Summary

**Keep them separate!** It's the simplest approach:

- **Google Sheets** → Uses `barcouncilmember@barcouncilmember.iam.gserviceaccount.com`
- **Firebase** → Uses `firebase-adminsdk-fbsvc@bar-council-8a238.iam.gserviceaccount.com`

Both are already in Vercel. Just share the Google Sheet with the Firebase service account email, and you're done!

## ✅ Quick Checklist

- [ ] Found Firebase service account email: `firebase-adminsdk-fbsvc@bar-council-8a238.iam.gserviceaccount.com`
- [ ] Google Sheet shared with Firebase service account email
- [ ] Permission set to **Editor**
- [ ] Both service accounts in Vercel environment variables
- [ ] Ready to test!
