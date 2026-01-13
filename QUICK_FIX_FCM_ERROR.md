# 🔧 Quick Fix: "Failed to Save Notification Subscription"

## 🔍 Check the Error Message

When you see the error alert, it should now show **detailed error message**. 

**Please check:**
1. What does the alert say? (Copy the exact message)
2. Check browser console (F12) - what error do you see?

## 🚨 Most Common Issues

### Issue 1: Sheet Name Mismatch

**Error:** "Unable to parse range" or "Sheet name mismatch"

**Fix:**
1. Open your Google Sheet
2. Check the sheet tab name - it must be **exactly**: `Push Notification Subscribers`
3. **Case-sensitive!** Must match exactly:
   - ✅ `Push Notification Subscribers` (correct)
   - ❌ `push notification subscribers` (wrong - lowercase)
   - ❌ `Push notification subscribers` (wrong - mixed case)
   - ❌ `Push Notification Subscribers ` (wrong - extra space)

### Issue 2: Headers in Wrong Row

**Error:** "Unable to parse range" or range errors

**Fix:**
1. Open "Push Notification Subscribers" sheet
2. Make sure headers are in **Row 1**:
   - A1 = `Timestamp`
   - B1 = `FCM Token`
   - C1 = `Status`
3. **No empty rows above headers!**

### Issue 3: Service Account Still Doesn't Have Access

**Error:** "Permission denied" or "403"

**Fix:**
1. Open Google Sheet → Click "Share"
2. Verify `barcouncilmember@barcouncilmember.iam.gserviceaccount.com` is listed
3. Should have **Editor** permission
4. If not listed, add it with Editor permission

### Issue 4: Wrong Sheet ID

**Error:** "Google Sheet not found" or "404"

**Fix:**
1. Check `config/candidate.config.ts`
2. Verify `googleSheetId` is: `1YwwJVPK3neZVQhNPqjzBR5taukLYFgUkWi_vA4IB9KA`
3. Make sure this is the correct sheet

## 🔍 Debug Steps

### Step 1: Check Browser Console (F12)

Look for:
```
❌ Failed to save FCM token: [error message]
Full error response: {error: "...", details: "..."}
Service Account Email: barcouncilmember@barcouncilmember.iam.gserviceaccount.com
Sheet ID: 1YwwJVPK3neZVQhNPqjzBR5taukLYFgUkWi_vA4IB9KA
```

### Step 2: Check Vercel Function Logs

1. Go to Vercel Dashboard → Your Project
2. Click **"Functions"** tab
3. Find `/api/save-fcm-token`
4. Click to view logs
5. Look for error messages

### Step 3: Verify Sheet Setup

1. Open Google Sheet
2. Go to "Push Notification Subscribers" tab
3. Verify:
   - ✅ Tab name is exactly: `Push Notification Subscribers`
   - ✅ Row 1 has: `Timestamp | FCM Token | Status`
   - ✅ No empty rows above row 1
   - ✅ Sheet is shared with service account

## 📋 Quick Checklist

- [ ] Sheet tab name: `Push Notification Subscribers` (exact match, case-sensitive)
- [ ] Headers in Row 1: `Timestamp | FCM Token | Status`
- [ ] No empty rows above headers
- [ ] Sheet shared with: `barcouncilmember@barcouncilmember.iam.gserviceaccount.com`
- [ ] Permission: Editor
- [ ] Sheet ID correct in config

## 🆘 Still Not Working?

**Please share:**
1. The exact error message from the alert popup
2. Browser console error (F12)
3. Vercel function logs error
4. Screenshot of your "Push Notification Subscribers" sheet (showing headers)

This will help me identify the exact issue!
