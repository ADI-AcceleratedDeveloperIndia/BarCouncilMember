# ✅ Verify Firebase Service Account JSON Format

## 🔍 How to Check Your `FIREBASE_SERVICE_ACCOUNT` in Vercel

### Step 1: View the Variable in Vercel

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Find `FIREBASE_SERVICE_ACCOUNT`
3. Click to view the value (it will be masked, but you can see the structure)

### Step 2: Verify the Format

The `FIREBASE_SERVICE_ACCOUNT` should be the **entire JSON file content** as a **single-line string**.

## ✅ Correct Format

### Option 1: Single-Line JSON (Recommended)
```
{"type":"service_account","project_id":"your-project-id","private_key_id":"your-key-id","private_key":"-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_CONTENT_HERE\n-----END PRIVATE KEY-----\n","client_email":"your-service-account@your-project.iam.gserviceaccount.com","client_id":"your-client-id","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project.iam.gserviceaccount.com","universe_domain":"googleapis.com"}
```

### Option 2: Multi-Line JSON (Also Works)
```
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "your-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_CONTENT_HERE\n-----END PRIVATE KEY-----\n",
  "client_email": "your-service-account@your-project.iam.gserviceaccount.com",
  "client_id": "your-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}
```

## ❌ Common Mistakes

### Mistake 1: Wrapped in Quotes
**Wrong:**
```
"{...entire json...}"
```

**Fix:** Remove the outer quotes, paste the JSON directly

### Mistake 2: Missing Fields
**Wrong:** Only pasting part of the JSON

**Required Fields:**
- `type`: `"service_account"`
- `project_id`: `"your-project-id"` (e.g., `"bar-council-8a238"`)
- `private_key_id`: (your key ID from the JSON file)
- `private_key`: `"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"` (with `\n` for newlines)
- `client_email`: `"your-service-account@your-project.iam.gserviceaccount.com"`
- `client_id`: (your client ID from the JSON file)
- `auth_uri`: `"https://accounts.google.com/o/oauth2/auth"`
- `token_uri`: `"https://oauth2.googleapis.com/token"`
- `auth_provider_x509_cert_url`: `"https://www.googleapis.com/oauth2/v1/certs"`
- `client_x509_cert_url`: (your cert URL from the JSON file)
- `universe_domain`: `"googleapis.com"`

### Mistake 3: Wrong Private Key Format
**Wrong:** Private key without `\n` newlines
```
"private_key": "-----BEGIN PRIVATE KEY-----YOUR_KEY_CONTENT_HERE..."
```

**Correct:** Private key with `\n` for newlines
```
"private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_KEY_CONTENT_HERE\n...\n-----END PRIVATE KEY-----\n"
```

## 🔧 How to Fix

### Step 1: Get the Original JSON File

1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project
3. Click gear icon → **Project settings**
4. Go to **"Service accounts"** tab
5. Click **"Generate new private key"** (or use the one you already downloaded)
6. Download the JSON file

### Step 2: Copy the Entire Content

1. Open the downloaded JSON file (e.g., `your-project-firebase-adminsdk-xxxxx.json`)
2. Select **ALL** (Cmd+A / Ctrl+A)
3. Copy (Cmd+C / Ctrl+C)

### Step 3: Paste into Vercel

1. Go to Vercel → Environment Variables
2. Find `FIREBASE_SERVICE_ACCOUNT`
3. **Delete the old value**
4. **Paste the entire JSON** (exactly as it appears in the file)
5. Click **"Save"**

## ✅ Verification Checklist

After updating, verify:

- [ ] JSON starts with `{` (not `"{`)
- [ ] JSON ends with `}` (not `}"`)
- [ ] Contains all required fields (see above)
- [ ] `private_key` includes `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- [ ] `private_key` has `\n` for newlines (or actual line breaks)
- [ ] `client_email` matches your Firebase service account email
- [ ] `project_id` matches your Firebase project ID

## 🧪 Test It

After updating, Vercel will redeploy. Then:

1. Go to: `https://yourdomain.com/admin/push-notifications`
2. Check if it loads without errors
3. Try sending a test notification

If you see errors, check Vercel logs for:
- `Error initializing Firebase Admin SDK`
- `JSON.parse` errors
- `Invalid service account` errors
