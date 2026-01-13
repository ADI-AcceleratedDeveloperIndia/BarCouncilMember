# 🔍 Debug: "Failed to Save FCM Token"

## ❌ Error: "Failed to save FCM token"

This means the FCM token was generated, but saving to Google Sheets failed.

## 🔍 How to Debug

### Step 1: Check Browser Console

Open browser console (F12) and look for the error. You should see:
```
❌ Failed to save FCM token: [error message]
Full error response: {error: "...", details: "..."}
```

**Common error messages:**
- `Permission denied` → Service account doesn't have access
- `Google Sheet not found` → Wrong Sheet ID
- `Authentication failed` → Invalid credentials

### Step 2: Check Vercel Function Logs

1. Go to Vercel Dashboard → Your Project
2. Click **"Functions"** tab
3. Find `/api/save-fcm-token`
4. Click to view logs
5. Look for error messages

**Look for:**
- `❌ Error saving FCM token:`
- `Error details:`
- `Permission denied`
- `403` or `404` status codes

### Step 3: Verify Google Sheets Service Account

The API uses **Google Sheets service account**, not Firebase service account!

**Check Vercel for:**
```
GOOGLE_SERVICE_ACCOUNT_EMAIL = barcouncilmember@barcouncilmember.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY = [your-private-key]
```

**Verify this email has access:**
1. Open your Google Sheet
2. Click "Share"
3. Check if `barcouncilmember@barcouncilmember.iam.gserviceaccount.com` is listed
4. Should have **Editor** permission

### Step 4: Share Sheet with Google Sheets Service Account

If the email is NOT in the share list:

1. Open Google Sheet
2. Click "Share"
3. Add: `barcouncilmember@barcouncilmember.iam.gserviceaccount.com`
4. Set permission: **Editor**
5. Uncheck "Notify people"
6. Click "Share"

## 🚨 Common Issues

### Issue 1: Wrong Service Account

**Problem:** You shared the sheet with Firebase service account, but API uses Google Sheets service account.

**Fix:** Share the sheet with **BOTH**:
- ✅ `barcouncilmember@barcouncilmember.iam.gserviceaccount.com` (for Google Sheets API)
- ✅ `firebase-adminsdk-fbsvc@bar-council-8a238.iam.gserviceaccount.com` (for Firebase Admin SDK)

### Issue 2: Invalid Credentials

**Error:** "Authentication failed" or "invalid_grant"

**Fix:**
1. Check `GOOGLE_SERVICE_ACCOUNT_EMAIL` in Vercel
2. Check `GOOGLE_PRIVATE_KEY` in Vercel
3. Make sure private key has `\n` for newlines (Vercel handles this automatically)
4. Verify the service account JSON is correct

### Issue 3: Sheet ID Wrong

**Error:** "Google Sheet not found" or "404"

**Fix:**
1. Check `googleSheetId` in `config/candidate.config.ts`
2. Should be: `1YwwJVPK3neZVQhNPqjzBR5taukLYFgUkWi_vA4IB9KA`
3. Verify the sheet exists and is accessible

### Issue 4: Permission Denied

**Error:** "Permission denied" or "403"

**Fix:**
1. Share Google Sheet with: `barcouncilmember@barcouncilmember.iam.gserviceaccount.com`
2. Set permission to **Editor** (not Viewer)
3. Make sure the email is exactly correct (no typos)

## ✅ Quick Fix Checklist

- [ ] Google Sheet shared with: `barcouncilmember@barcouncilmember.iam.gserviceaccount.com`
- [ ] Permission set to **Editor**
- [ ] `GOOGLE_SERVICE_ACCOUNT_EMAIL` in Vercel matches the email above
- [ ] `GOOGLE_PRIVATE_KEY` is correct in Vercel
- [ ] Sheet ID is correct: `1YwwJVPK3neZVQhNPqjzBR5taukLYFgUkWi_vA4IB9KA`
- [ ] Check browser console for detailed error message
- [ ] Check Vercel function logs for server-side errors

## 🔍 Get Detailed Error

After the fix, when you test again, check:
1. **Browser Console (F12)** - Shows client-side error
2. **Vercel Function Logs** - Shows server-side error with details

The error message will tell you exactly what's wrong!
