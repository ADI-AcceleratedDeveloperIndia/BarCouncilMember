# Google Account Strategy - One Gmail for Multiple Clients

This guide explains how to manage 30 clients with ONE Gmail account while maintaining separate API quotas and client access.

---

## ✅ Answer: YES, You Can Use ONE Gmail Account

**Short Answer:** 
- ✅ Use **ONE Gmail account** for all clients
- ✅ Create **separate Google Cloud Projects** (one per client)
- ✅ Each project gets **separate API quota** (300 requests/minute each)
- ✅ Share Google Sheets with clients **WITHOUT giving them your Gmail password**

---

## 🏗️ Architecture Overview

### Current Setup (Per Client):
```
Gmail Account (yours)
  └── Google Cloud Project 1 (Client A)
      └── Service Account A
      └── Google Sheet A
      └── API Quota: 300 requests/minute
      
  └── Google Cloud Project 2 (Client B)
      └── Service Account B
      └── Google Sheet B
      └── API Quota: 300 requests/minute
      
  └── Google Cloud Project 3 (Client C)
      └── Service Account C
      └── Google Sheet C
      └── API Quota: 300 requests/minute
      
  ... (30 projects for 30 clients)
```

**Key Point:** Each Google Cloud Project has its own API quota, even if they're under the same Gmail account.

---

## 📊 Google Sheets API Rate Limits

### How Rate Limits Work:

**Per Google Cloud Project:**
- **Free Tier:** 300 requests per minute per project
- **Quota Increase:** Can request up to 10,000+ requests/minute per project

**Important:**
- ✅ **Separate projects = Separate quotas**
- ❌ **Same project = Shared quota** (BAD for 30 clients)

### Scenario: 30 Clients, Each with 35,000 Users

**If All Clients Share ONE Project:**
- Total quota: 300 requests/minute (shared)
- 30 clients × 35,000 users = 1,050,000 potential requests
- ❌ **Will fail** - All clients will hit rate limits

**If Each Client Has Separate Project:**
- Client A: 300 requests/minute (or 10,000 with quota increase)
- Client B: 300 requests/minute (or 10,000 with quota increase)
- Client C: 300 requests/minute (or 10,000 with quota increase)
- ... (30 separate quotas)
- ✅ **Will work** - Each client has their own quota

---

## 🔐 Sharing Google Sheets with Clients

### Can Clients See Their Sheet WITHOUT Your Gmail Password?

**YES! ✅** You can share individual Google Sheets without giving your Gmail password.

### How to Share:

1. **Open the Google Sheet** (e.g., Client A's sheet)
2. Click **"Share"** button (top right)
3. Enter **client's email address**
4. Set permission: **"Editor"** or **"Viewer"**
5. Click **"Send"**

**Result:**
- ✅ Client can access their sheet directly
- ✅ Client does NOT need your Gmail password
- ✅ Client can only see THEIR sheet (not other clients' sheets)
- ✅ You maintain full control of your Gmail account

### Sharing Options:

**Option 1: Share with Client's Email**
- Client uses their own Gmail/email
- They get direct link to their sheet
- They can view/edit based on permissions

**Option 2: Share with Link (Public)**
- Create shareable link
- Anyone with link can access
- ⚠️ Less secure, but easier

**Option 3: Share with Specific Email (Recommended)**
- Share with client's email address
- Only they can access
- ✅ Most secure

---

## 📋 Step-by-Step Setup for 30 Clients

### Step 1: Create Google Cloud Projects (One Per Client)

For each client:

1. **Go to Google Cloud Console**
   - Use your Gmail account
   - Visit: https://console.cloud.google.com

2. **Create New Project**
   - Click "Select a project" → "New Project"
   - Project name: `Client-A-Election` (or similar)
   - Click "Create"

3. **Enable Google Sheets API**
   - Go to "APIs & Services" → "Library"
   - Search "Google Sheets API"
   - Click "Enable"

4. **Create Service Account**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "Service Account"
   - Name: `client-a-service-account`
   - Click "Create and Continue"
   - Skip role assignment
   - Click "Done"

5. **Create Service Account Key**
   - Click on the service account
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key"
   - Choose "JSON"
   - Download the JSON file

6. **Extract Credentials**
   - From JSON file, get:
     - `client_email` (service account email)
     - `private_key` (private key)

7. **Repeat for Each Client**
   - Create separate project for Client B, C, D, etc.

### Step 2: Create Google Sheets (One Per Client)

For each client:

1. **Create New Google Spreadsheet**
   - Go to Google Sheets
   - Create new spreadsheet
   - Name it: `Client-A-Election-Data` (or similar)

2. **Share Sheet with Service Account**
   - Click "Share" button
   - Enter service account email (from Step 1)
   - Set permission: **"Editor"**
   - Click "Send"

3. **Get Sheet ID**
   - From URL: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
   - Copy the `SHEET_ID_HERE` part

4. **Share Sheet with Client**
   - Click "Share" button again
   - Enter client's email address
   - Set permission: **"Editor"** (so they can see data)
   - Click "Send"
   - ✅ Client can now access their sheet without your password

### Step 3: Configure Each Client's Website

For each client's website:

1. **Update `config/candidate.config.ts`**
   ```typescript
   export const candidateConfig = {
     name: "Client A Name",
     googleSheetId: "CLIENT_A_SHEET_ID", // Unique per client
     // ... other config
   };
   ```

2. **Set Environment Variables in Vercel**
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL` = Client A's service account email
   - `GOOGLE_PRIVATE_KEY` = Client A's private key
   - ✅ Each client has their own credentials

3. **Deploy**
   - Each client's website uses their own service account
   - Each client has their own API quota

---

## 💰 Cost Analysis

### Using ONE Gmail Account:

**Free Tier (Per Project):**
- Google Cloud: $0 (free tier)
- Google Sheets API: $0 (300 requests/minute)
- Google Drive: $0 (15GB storage per Gmail account)

**Total Cost:**
- ✅ **$0/month** for all 30 clients
- Each client gets their own free quota

**If You Request Quota Increases:**
- Google Cloud: $0 (quota increase is free)
- Each client can have 10,000+ requests/minute
- ✅ **Still $0/month**

---

## 🔒 Security Best Practices

### 1. **Never Share Gmail Password**
- ✅ Share individual Google Sheets
- ✅ Use service accounts for API access
- ❌ Never give clients your Gmail password

### 2. **Separate Projects = Better Security**
- Each client's data is isolated
- If one client's credentials leak, others are safe
- Easier to revoke access per client

### 3. **Service Account Permissions**
- Service accounts only have access to their specific sheet
- They cannot access other clients' sheets
- ✅ Secure by default

---

## 📊 Comparison: One Gmail vs. Separate Gmails

### Option A: ONE Gmail, Multiple Projects (Recommended) ✅

**Pros:**
- ✅ Easy to manage (one login)
- ✅ Lower cost ($0)
- ✅ Separate API quotas per client
- ✅ Clients don't need your password
- ✅ You maintain full control

**Cons:**
- ⚠️ More projects to manage (but manageable)
- ⚠️ Need to organize projects well

**Best For:** 30 clients, you manage everything

---

### Option B: Separate Gmail Per Client

**Pros:**
- ✅ Complete isolation
- ✅ Clients own their accounts
- ✅ Easier to transfer ownership later

**Cons:**
- ❌ 30 Gmail accounts to manage
- ❌ More complex setup
- ❌ Clients need to create accounts
- ❌ You may need access to all accounts

**Best For:** Clients who want full ownership

---

## ✅ Recommended Setup for 30 Clients

### Use ONE Gmail Account with 30 Separate Projects:

1. **Your Gmail:** `youremail@gmail.com`
2. **30 Google Cloud Projects:**
   - Project: `client-a-election`
   - Project: `client-b-election`
   - ... (30 projects)

3. **30 Service Accounts:**
   - `client-a@client-a-election.iam.gserviceaccount.com`
   - `client-b@client-b-election.iam.gserviceaccount.com`
   - ... (30 service accounts)

4. **30 Google Sheets:**
   - One sheet per client
   - Each shared with respective service account
   - Each shared with respective client's email

5. **30 Websites:**
   - Each uses their own service account credentials
   - Each has their own API quota

**Result:**
- ✅ One Gmail to manage
- ✅ 30 separate API quotas (300 requests/minute each, or 10,000+ with quota increase)
- ✅ Clients can access their sheets without your password
- ✅ Complete data isolation
- ✅ $0 cost

---

## 🎯 Action Items

### For Each New Client:

1. **Create Google Cloud Project**
   - [ ] Project name: `client-name-election`
   - [ ] Enable Google Sheets API
   - [ ] Create service account
   - [ ] Download JSON key

2. **Create Google Sheet**
   - [ ] Create new spreadsheet
   - [ ] Share with service account (Editor)
   - [ ] Share with client's email (Editor)
   - [ ] Get Sheet ID

3. **Configure Website**
   - [ ] Update `candidate.config.ts` with Sheet ID
   - [ ] Set environment variables in Vercel
   - [ ] Deploy

4. **Share with Client**
   - [ ] Send client the Google Sheet link
   - [ ] Client can access without your password
   - [ ] Client can view their data in real-time

---

## ❓ FAQ

### Q: Can clients see other clients' data?
**A:** No. Each client only has access to their own Google Sheet.

### Q: Do clients need my Gmail password?
**A:** No. You share individual sheets with their email addresses.

### Q: What if a client wants to manage their own Google account?
**A:** You can transfer the project to their Gmail account later, or they can create their own from the start.

### Q: What happens if I hit API limits?
**A:** Each client has their own quota. If one client hits limits, others are unaffected. Request quota increases per project if needed.

### Q: Can I use the same service account for all clients?
**A:** Technically yes, but NOT recommended. You'll share the API quota (300 requests/minute total), which will fail with 30 clients.

---

## ✅ Final Recommendation

**For 30 Clients:**
- ✅ Use **ONE Gmail account**
- ✅ Create **30 separate Google Cloud Projects**
- ✅ Each client gets **their own service account**
- ✅ Each client gets **their own API quota**
- ✅ Share sheets with clients **without giving password**
- ✅ **Total cost: $0/month**

This setup gives you:
- Easy management (one Gmail login)
- Separate quotas (no shared limits)
- Client access (without password sharing)
- Data isolation (secure)
- Zero cost (all free tier)

