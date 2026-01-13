# 🔑 How to Get Firebase Web Config (API Key, App ID, Sender ID)

## ❌ Error: "API key not valid"

You need to get Firebase Web App configuration from Firebase Console.

## 📋 Step-by-Step Instructions

### Step 1: Go to Firebase Console

1. Visit: https://console.firebase.google.com
2. Select project: **bar-council-8a238**
3. Click the **gear icon** (⚙️) next to "Project Overview"
4. Click **"Project settings"**

### Step 2: Scroll to "Your apps" Section

1. Scroll down to **"Your apps"** section
2. If you see a web app (</> icon), click on it
3. If no web app exists, click **"Add app"** → Select **"Web"** (</> icon)

### Step 3: Register Web App (If Needed)

1. App nickname: `Bar Council Website` (or any name)
2. Click **"Register app"**
3. **DO NOT** copy the config code yet - we need the values separately

### Step 4: Get Configuration Values

1. In the app settings, you'll see:
   - **apiKey** - Copy this (starts with `AIza...`)
   - **appId** - Copy this (format: `1:123456789:web:abcdef`)
   - **messagingSenderId** - Copy this (numbers only, e.g., `245504696872`)

2. Or go to: **Project Settings** → **General** tab
3. Scroll to **"Your apps"** section
4. Click on your web app
5. You'll see all the config values

### Step 5: Add to Vercel

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add these **NEW** variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY = [paste apiKey from Step 4]
NEXT_PUBLIC_FIREBASE_APP_ID = [paste appId from Step 4]
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = [paste messagingSenderId from Step 4]
```

**You already have:**
- ✅ `NEXT_PUBLIC_FIREBASE_PROJECT_ID = bar-council-8a238`
- ✅ `NEXT_PUBLIC_FIREBASE_VAPID_KEY = [your-vapid-key]`
- ✅ `FIREBASE_VAPID_PRIVATE_KEY = [your-private-key]`
- ✅ `FIREBASE_SERVICE_ACCOUNT = [your-service-account-json]`

## 📝 Example Values

Your values will look like:
```
NEXT_PUBLIC_FIREBASE_API_KEY = AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567
NEXT_PUBLIC_FIREBASE_APP_ID = 1:245504696872:web:abc123def456
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 245504696872
```

## ✅ After Adding

1. Vercel will auto-redeploy
2. Wait 1-2 minutes
3. Test again - the "API key not valid" error should be gone!
