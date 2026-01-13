# 🔍 Environment Variables Checklist

## Required Environment Variables for Vercel

Based on codebase analysis, here are **ALL** environment variables your project needs:

---

## 🔥 Firebase Configuration (7 variables)

### Public Variables (NEXT_PUBLIC_ prefix - exposed to browser):

1. **`NEXT_PUBLIC_FIREBASE_PROJECT_ID`**
   - **Required:** ✅ Yes
   - **Value:** `bar-council-8a238`
   - **Used in:** `lib/notificationManager.ts`, `config/candidate.config.ts`
   - **Check:** Should match your Firebase project ID

2. **`NEXT_PUBLIC_FIREBASE_VAPID_KEY`**
   - **Required:** ✅ Yes
   - **Value:** Your VAPID public key (starts with `BGTvsS1...`)
   - **Used in:** `lib/notificationManager.ts`, `config/candidate.config.ts`
   - **Check:** Should be the public key from Firebase Console

3. **`NEXT_PUBLIC_FIREBASE_API_KEY`**
   - **Required:** ✅ Yes
   - **Value:** Your Firebase API key (starts with `AIza...`)
   - **Used in:** `lib/notificationManager.ts`
   - **Check:** Get from Firebase Console → Project Settings → Your apps → Web app

4. **`NEXT_PUBLIC_FIREBASE_APP_ID`**
   - **Required:** ✅ Yes
   - **Value:** Your Firebase App ID (format: `1:123456789:web:abcdef`)
   - **Used in:** `lib/notificationManager.ts`
   - **Check:** Get from Firebase Console → Project Settings → Your apps → Web app

5. **`NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`**
   - **Required:** ✅ Yes
   - **Value:** Your messaging sender ID (numbers only, e.g., `245504696872`)
   - **Used in:** `lib/notificationManager.ts`
   - **Check:** Get from Firebase Console → Project Settings → Your apps → Web app

### Private Variables (server-side only):

6. **`FIREBASE_VAPID_PRIVATE_KEY`**
   - **Required:** ✅ Yes
   - **Value:** Your VAPID private key (starts with `C-dv95Px...`)
   - **Used in:** Firebase Admin SDK (if needed for server-side operations)
   - **Check:** Should match the private key from Firebase Console

7. **`FIREBASE_SERVICE_ACCOUNT`**
   - **Required:** ✅ Yes
   - **Value:** Complete JSON service account file content
   - **Used in:** `app/api/send-push-notification/route.ts`
   - **Format:** Entire JSON object (single-line or multi-line)
   - **Check:** Should include:
     - `type: "service_account"`
     - `project_id: "bar-council-8a238"`
     - `private_key: "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"`
     - `client_email: "firebase-adminsdk-fbsvc@bar-council-8a238.iam.gserviceaccount.com"`
     - All other required fields

---

## 📊 Google Sheets Configuration (2 variables)

8. **`GOOGLE_SERVICE_ACCOUNT_EMAIL`**
   - **Required:** ✅ Yes
   - **Value:** `barcouncilmember@barcouncilmember.iam.gserviceaccount.com`
   - **Used in:** All API routes that access Google Sheets
   - **Check:** Should match your Google Sheets service account email

9. **`GOOGLE_PRIVATE_KEY`**
   - **Required:** ✅ Yes
   - **Value:** Private key from Google Sheets service account JSON
   - **Format:** `"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"`
   - **Used in:** All API routes that access Google Sheets
   - **Check:** Should:
     - Start with `-----BEGIN PRIVATE KEY-----`
     - End with `-----END PRIVATE KEY-----`
     - Have `\n` for newlines (or actual line breaks)
     - NOT be wrapped in extra quotes

---

## 📋 Summary Checklist

### Firebase Variables (7 total):
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID` = `bar-council-8a238`
- [ ] `NEXT_PUBLIC_FIREBASE_VAPID_KEY` = (your VAPID public key)
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY` = (your Firebase API key)
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID` = (your Firebase App ID)
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` = (your messaging sender ID)
- [ ] `FIREBASE_VAPID_PRIVATE_KEY` = (your VAPID private key)
- [ ] `FIREBASE_SERVICE_ACCOUNT` = (complete JSON)

### Google Sheets Variables (2 total):
- [ ] `GOOGLE_SERVICE_ACCOUNT_EMAIL` = `barcouncilmember@barcouncilmember.iam.gserviceaccount.com`
- [ ] `GOOGLE_PRIVATE_KEY` = (your Google private key)

**Total: 9 environment variables required**

---

## 🔍 How to Verify in Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Select your project: **BarCouncilMember** (or your project name)
3. Go to: **Settings** → **Environment Variables**
4. Check each variable above

---

## ✅ Verification Steps

### Step 1: Check Variable Names
- [ ] All 9 variables are present
- [ ] Variable names match exactly (case-sensitive)
- [ ] No typos in variable names

### Step 2: Check Variable Values

#### Firebase Variables:
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID` = `bar-council-8a238`
- [ ] `NEXT_PUBLIC_FIREBASE_VAPID_KEY` starts with `BGTvsS1...`
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY` starts with `AIza...`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID` format: `1:123456789:web:abcdef`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` is numbers only
- [ ] `FIREBASE_VAPID_PRIVATE_KEY` starts with `C-dv95Px...`
- [ ] `FIREBASE_SERVICE_ACCOUNT` is valid JSON with all required fields

#### Google Sheets Variables:
- [ ] `GOOGLE_SERVICE_ACCOUNT_EMAIL` = `barcouncilmember@barcouncilmember.iam.gserviceaccount.com`
- [ ] `GOOGLE_PRIVATE_KEY` has `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`

### Step 3: Check Environment Scope
- [ ] All variables are set for **Production** environment
- [ ] All variables are set for **Preview** environment (optional but recommended)
- [ ] All variables are set for **Development** environment (optional)

---

## 🚨 Common Issues

### Issue 1: Missing Variables
**Symptom:** Errors like "FIREBASE_SERVICE_ACCOUNT not found"
**Fix:** Add missing variable to Vercel

### Issue 2: Wrong Variable Names
**Symptom:** Variables not being read
**Fix:** Check exact spelling (case-sensitive)

### Issue 3: Invalid JSON in FIREBASE_SERVICE_ACCOUNT
**Symptom:** "JSON.parse error" in logs
**Fix:** Ensure valid JSON format (no extra quotes, proper newlines)

### Issue 4: Private Key Format Issues
**Symptom:** "DECODER routines::unsupported" error
**Fix:** Ensure `GOOGLE_PRIVATE_KEY` has proper `\n` newlines

### Issue 5: Wrong Project ID
**Symptom:** Firebase errors, wrong project
**Fix:** Verify `NEXT_PUBLIC_FIREBASE_PROJECT_ID` matches your Firebase project

---

## 📝 Quick Reference

### Your Expected Values (Based on Previous Setup):

```
NEXT_PUBLIC_FIREBASE_PROJECT_ID = bar-council-8a238
NEXT_PUBLIC_FIREBASE_VAPID_KEY = BGTvsS1SepQ9sAMLRKQJDdI_VhD1JUUoRWjjAtsxT4QDDGWeOn9jtxsZzBcbYwO1aRSh-9i1oI7Ovk50MWQ6Rd8
FIREBASE_VAPID_PRIVATE_KEY = C-dv95Px2Ist8LzP06bhfLcJ6MPdfEl0TLysibRCsTg
GOOGLE_SERVICE_ACCOUNT_EMAIL = barcouncilmember@barcouncilmember.iam.gserviceaccount.com
```

**Note:** You need to verify the other values in Vercel dashboard.

---

## 🔧 Next Steps

1. **Check Vercel Dashboard** → Settings → Environment Variables
2. **Compare** with this checklist
3. **Add missing variables** if any
4. **Fix incorrect values** if any
5. **Redeploy** (Vercel auto-redeploys when you add/update variables)

---

## 📞 Need Help?

If you find missing or incorrect variables:
1. Check the specific error message in Vercel logs
2. Refer to the setup guides:
   - `GET_FIREBASE_WEB_CONFIG.md` - For Firebase web config
   - `VERIFY_FIREBASE_SERVICE_ACCOUNT.md` - For Firebase service account
   - `FIX_OPENSSL_DECODER_ERROR.md` - For Google private key issues
