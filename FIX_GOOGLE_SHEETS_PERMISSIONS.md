# 🔧 Fix Google Sheets Not Being Created

## ❌ Problem: "Push Notification Subscribers" sheet not being created

The sheet should be created automatically, but it's not appearing.

## 🔍 Why This Happens

The service account email needs **Editor** access to your Google Sheet.

## ✅ Solution: Share Google Sheet with Service Account

### Step 1: Get Service Account Email

From your Firebase Service Account JSON:
```
"client_email": "firebase-adminsdk-fbsvc@bar-council-8a238.iam.gserviceaccount.com"
```

**Your service account email is:**
```
firebase-adminsdk-fbsvc@bar-council-8a238.iam.gserviceaccount.com
```

### Step 2: Share Google Sheet

1. Open your Google Sheet:
   - Sheet ID: `1YwwJVPK3neZVQhNPqjzBR5taukLYFgUkWi_vA4IB9KA`
   - Or go to: https://docs.google.com/spreadsheets/d/1YwwJVPK3neZVQhNPqjzBR5taukLYFgUkWi_vA4IB9KA

2. Click **"Share"** button (top right)

3. In the "Add people and groups" field, paste:
   ```
   firebase-adminsdk-fbsvc@bar-council-8a238.iam.gserviceaccount.com
   ```

4. Set permission: **"Editor"** (not Viewer!)

5. **UNCHECK** "Notify people" (service accounts don't have email)

6. Click **"Share"**

### Step 3: Verify

1. The service account should now have Editor access
2. Try allowing notifications again on your website
3. Check Google Sheets - "Push Notification Subscribers" tab should appear automatically

## 🔍 Alternative: Check Existing Service Account

You might already have a Google Sheets service account. Check Vercel for:

```
GOOGLE_SERVICE_ACCOUNT_EMAIL = [some-email@...iam.gserviceaccount.com]
```

**If different from Firebase service account:**
- Share the Google Sheet with **BOTH** service accounts
- Or use the same service account for both (recommended)

## ✅ Quick Checklist

- [ ] Google Sheet shared with: `firebase-adminsdk-fbsvc@bar-council-8a238.iam.gserviceaccount.com`
- [ ] Permission set to **Editor** (not Viewer)
- [ ] Service account has access (check "Share" button → see the email listed)
- [ ] Try allowing notifications again
- [ ] Check if "Push Notification Subscribers" sheet appears

## 🚨 Important

The service account email for **Google Sheets** might be different from the **Firebase service account**.

Check Vercel for:
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` - This is the one that needs sheet access
- `FIREBASE_SERVICE_ACCOUNT` - This is for Firebase Admin SDK (different)

Make sure **both** have the right permissions!
