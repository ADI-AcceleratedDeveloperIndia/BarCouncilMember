# 🔧 Fix: "DECODER routines::unsupported" Error

## ❌ Error: `ERR_OSSL_UNSUPPORTED`

This error means the private key format is incompatible with Node.js on Vercel.

## ✅ Solution: Fix Private Key Format in Vercel

### Step 1: Get Your Private Key

1. Go to Google Cloud Console: https://console.cloud.google.com
2. Go to: **IAM & Admin** → **Service Accounts**
3. Find: `barcouncilmember@barcouncilmember.iam.gserviceaccount.com`
4. Click on it → **Keys** tab
5. Click **"Add Key"** → **"Create new key"**
6. Select **JSON** format
7. Download the JSON file

### Step 2: Extract Private Key from JSON

1. Open the downloaded JSON file
2. Find the `"private_key"` field
3. Copy the **entire value** (including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`)
4. It should look like:
   ```
   -----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC4KKTpo3zq8TKj\n...\n-----END PRIVATE KEY-----\n
   ```

### Step 3: Update Vercel Environment Variable

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Find `GOOGLE_PRIVATE_KEY`
3. **Delete the old value**
4. **Paste the new private key** from Step 2
5. **Important:** Make sure it includes:
   - `-----BEGIN PRIVATE KEY-----` at the start
   - `-----END PRIVATE KEY-----` at the end
   - All the content in between
6. Click **"Save"**

### Step 4: Format Check

The private key in Vercel should look like this (with `\n` for newlines):
```
-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC4KKTpo3zq8TKj\nK9Js5hm3tbMdqmnn0GykWJ/miAPWc12MMRp+xUSfF3npNnknxMjO4n8FB5D6+m26\naMLgp5kPVzojn1VUmSIX8wQ1Sqcs91vK0OXE2VcFtAGLVQil2cW74KewMidmebRh\n...\n-----END PRIVATE KEY-----\n
```

**OR** it can be on multiple lines (Vercel handles both):
```
-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC4KKTpo3zq8TKj
K9Js5hm3tbMdqmnn0GykWJ/miAPWc12MMRp+xUSfF3npNnknxMjO4n8FB5D6+m26
...
-----END PRIVATE KEY-----
```

## 🔍 Alternative: Check Current Private Key

If you want to verify your current private key:

1. Go to Vercel → Environment Variables
2. Find `GOOGLE_PRIVATE_KEY`
3. Click to view (it will show masked)
4. Check if it:
   - Starts with `-----BEGIN PRIVATE KEY-----`
   - Ends with `-----END PRIVATE KEY-----`
   - Has `\n` for newlines (or actual newlines)

## ✅ After Fixing

1. Vercel will auto-redeploy
2. Wait 1-2 minutes
3. Test again - the error should be gone!

## 🚨 Common Issues

### Issue 1: Private Key Has Quotes
**Problem:** Key wrapped in quotes like `"-----BEGIN..."`

**Fix:** Remove the quotes, just paste the key directly

### Issue 2: Missing BEGIN/END Markers
**Problem:** Key doesn't have `-----BEGIN PRIVATE KEY-----`

**Fix:** Make sure to include the full key with markers

### Issue 3: Wrong Format
**Problem:** Key is in wrong format (PEM vs PKCS8)

**Fix:** Use the private key from the JSON file (it's already in correct format)

## 📝 Quick Checklist

- [ ] Downloaded new service account JSON from Google Cloud Console
- [ ] Extracted `private_key` field from JSON
- [ ] Updated `GOOGLE_PRIVATE_KEY` in Vercel
- [ ] Key includes `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- [ ] Vercel redeployed
- [ ] Test again
