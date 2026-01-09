# Complete Client Setup Guide - Step-by-Step for Each New Client

This is a **spoon-fed, step-by-step guide** for setting up each new client from scratch.

---

## 📋 PART 1: Information You Need from Client

### **Before You Start - Collect This Information:**

- [ ] **Client's Full Name** (exactly as they want it displayed)
- [ ] **Client's Serial Number** (their election serial number, e.g., "1", "5", "24")
- [ ] **Client's High-Resolution Photo** (square format, minimum 800x800px, JPG/PNG)
- [ ] **Client's Slogan/Motto** (optional, if they have one)
- [ ] **Client's Gmail Address** (or create one for them)
- [ ] **Preferred Layout** (Left, Center, or Right)

**Example:**
- Name: "Advocate John Doe"
- Serial Number: "5"
- Photo: `john-doe-photo.jpg`
- Slogan: "Justice for All" (optional)
- Gmail: `johndoe@gmail.com`
- Layout: "center"

---

## 🚀 PART 2: Complete Step-by-Step Setup

### **STEP 1: Create Google Sheet for Client**

1. **Open Google Sheets**
   - Go to: https://sheets.google.com
   - Log in with your Gmail (or client's Gmail if they provided it)

2. **Create New Spreadsheet**
   - Click "+" button (or "Blank" spreadsheet)
   - Name it: `[Client Name] Election Data`
   - Example: "John Doe Election Data"

3. **Get Google Sheet ID**
   - Look at the URL in your browser
   - URL format: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
   - Copy the `SHEET_ID_HERE` part
   - **Save this ID** - you'll need it later!
   - Example: `1YwwJVPK3neZVQhNPqjzBR5taukLYFgUkWi_vA4IB9KA`

4. **Create Required Sheets (Tabs)**
   - The sheets will be created automatically by the API
   - But you can create them manually if you want:
     - Sheet 1: "Quick Support"
     - Sheet 2: "Strong Support"
     - Sheet 3: "Followers"
     - Sheet 4: "Preferential Votes"
     - Sheet 5: "Preferential Votes Summary"
     - Sheet 6: "Preferential Vote Tracking"

**✅ Step 1 Complete!** You now have:
- Google Sheet created
- Google Sheet ID saved

---

### **STEP 2: Create Google Cloud Project**

1. **Open Google Cloud Console**
   - Go to: https://console.cloud.google.com
   - Log in with your Gmail (or client's Gmail)

2. **Create New Project**
   - Click project dropdown (top bar)
   - Click "New Project"
   - Project Name: `[client-name]-election`
     - Example: `john-doe-election`
   - Project ID: Auto-generated (or customize)
     - Example: `john-doe-election-123456`
   - Click "Create"

3. **Select the Project**
   - Click project dropdown
   - Select the project you just created

4. **Enable Google Sheets API**
   - Go to: **APIs & Services** → **Library**
   - Search: "Google Sheets API"
   - Click on "Google Sheets API"
   - Click "Enable"
   - Wait for it to enable (takes a few seconds)

**✅ Step 2 Complete!** You now have:
- Google Cloud Project created
- Google Sheets API enabled

---

### **STEP 3: Create Service Account**

1. **Go to Service Accounts**
   - In Google Cloud Console
   - Go to: **APIs & Services** → **Credentials**
   - Click "Create Credentials" → "Service Account"

2. **Create Service Account**
   - Service Account Name: `election-service`
   - Service Account ID: Auto-generated (or customize)
     - Example: `election-service@john-doe-election-123456.iam.gserviceaccount.com`
   - Click "Create and Continue"

3. **Grant Role (Optional)**
   - Role: "Editor" (or leave default)
   - Click "Continue"

4. **Skip User Access (Optional)**
   - Click "Done"

5. **Create Key**
   - Click on the service account you just created
   - Go to "Keys" tab
   - Click "Add Key" → "Create New Key"
   - Key Type: **JSON**
   - Click "Create"
   - **JSON file will download automatically**
   - **SAVE THIS FILE SECURELY!** You'll need it later!

6. **Get Service Account Email**
   - In the service account details page
   - Copy the "Email" address
   - Format: `election-service@project-id.iam.gserviceaccount.com`
   - **Save this email** - you'll need it later!

**✅ Step 3 Complete!** You now have:
- Service Account created
- JSON key file downloaded
- Service Account email saved

---

### **STEP 4: Share Google Sheet with Service Account**

1. **Open Google Sheet**
   - Go back to the Google Sheet you created in Step 1
   - Click "Share" button (top right)

2. **Add Service Account Email**
   - In the "Add people and groups" field
   - Paste the Service Account email (from Step 3)
   - Permission: **Editor**
   - **UNCHECK** "Notify people" (service accounts don't have email)
   - Click "Share"

3. **Verify**
   - You should see the service account email in the sharing list
   - Permission should be "Editor"

**✅ Step 4 Complete!** Service account can now access the Google Sheet.

---

### **STEP 5: Request Quota Increase**

1. **Go to Quotas**
   - In Google Cloud Console
   - Go to: **APIs & Services** → **Quotas**
   - Make sure you're in the correct project

2. **Filter for Google Sheets API**
   - In the filter/search box, type: `Google Sheets API`
   - Or filter by service: `sheets.googleapis.com`

3. **Increase Write Requests Per Minute**
   - Find: "Write requests per minute"
   - Click on it
   - Click "Edit Quotas" button (top of page)
   - New Limit: Enter `35000` (or `10000` if you prefer)
   - Justification: Copy and paste this:
     ```
     Campaign website expecting 35,000 concurrent users. Users will receive messaging link and may click simultaneously within 1-2 minutes. Each user may submit 1-3 API requests: preference submission (1 request), support form submission (1 request), and modal tracking (1 request). Worst case scenario: 35,000 users × 3 API calls = 105,000 requests in 1-2 minutes. Average scenario: 35,000 users × 2 API calls = 70,000 requests in 1-2 minutes. Current quota of 300 requests/minute is insufficient. Need quota increase to 35,000 requests/minute to handle peak traffic without delays or failures. This is a time-sensitive campaign, and we need to ensure all submissions are recorded successfully.
     ```
   - Click "Submit"
   - **Wait for approval** (usually 1-2 business days)

4. **Increase Read Requests Per Minute** (Optional but Recommended)
   - Find: "Read requests per minute"
   - Click on it
   - Click "Edit Quotas"
   - New Limit: Enter `35000` (or `10000`)
   - Justification: Same as above
   - Click "Submit"

5. **Leave Per-User Limits** (Don't Change)
   - "Read requests per minute per user": Leave at 60
   - "Write requests per minute per user": Leave at 60
   - These are fine as-is

**✅ Step 5 Complete!** Quota increase requested (wait for approval).

---

### **STEP 6: Update Website Configuration**

1. **Open Project in Code Editor**
   - Open your project folder in VS Code (or any editor)

2. **Update `config/candidate.config.ts`**
   - Open file: `config/candidate.config.ts`
   - Update with client's information:

```typescript
export const candidateConfig = {
  name: "CLIENT FULL NAME HERE",  // Example: "Advocate John Doe"
  designation: "Candidate for Member – Telangana State Bar Council",
  photo: "/candidate/candidate.png",  // Keep this path
  layoutVariant: "center" as "left" | "center" | "right",  // Change to client's preference
  defaultLanguage: "en" as "en" | "te",
  googleSheetId: "PASTE_GOOGLE_SHEET_ID_HERE",  // From Step 1
  serialNumber: "111",  // Client's 3-digit serial number (e.g., "111", "005", "024")
  slogan: "CLIENT_SLOGAN_HERE",  // Optional, example: "Justice for All"
  whatsappShareText: {
    en: "I support this candidate for Telangana State Bar Council elections.\nPlease visit: ",
    te: "తెలంగాణ రాష్ట్ర బార్ కౌన్సిల్ ఎన్నికల్లో ఈ అభ్యర్థికి నా మద్దతు ఉంది.\nవివరాలకు ఈ లింక్ చూడండి: ",
  },
};
```

**Example:**
```typescript
export const candidateConfig = {
  name: "Advocate John Doe",
  designation: "Candidate for Member – Telangana State Bar Council",
  photo: "/candidate/candidate.png",
  layoutVariant: "center" as "left" | "center" | "right",
  defaultLanguage: "en" as "en" | "te",
  googleSheetId: "1YwwJVPK3neZVQhNPqjzBR5taukLYFgUkWi_vA4IB9KA",
  serialNumber: "111",  // 3-digit serial number (e.g., "111", "005", "024")
  slogan: "Justice for All",
  whatsappShareText: {
    en: "I support this candidate for Telangana State Bar Council elections.\nPlease visit: ",
    te: "తెలంగాణ రాష్ట్ర బార్ కౌన్సిల్ ఎన్నికల్లో ఈ అభ్యర్థికి నా మద్దతు ఉంది.\nవివరాలకు ఈ లింక్ చూడండి: ",
  },
};
```

**Important Notes:**
- **Serial Number:** Must be 3 digits (e.g., "111", "005", "024")
- **Serial Number Display:** Will appear BIG and prominently on:
  - Main website (Hero section) - centered, very large font
  - Preferential vote modal - centered, very large font
- **Default:** Serial number is set to "111" by default (change for each client)

**✅ Step 6 Complete!** Configuration file updated.

---

### **STEP 7: Add Client Photo**

1. **Prepare Photo**
   - Make sure photo is square format (e.g., 800x800px or 1000x1000px)
   - Format: JPG or PNG
   - File name: `candidate.png` (or `candidate.jpg`)

2. **Copy Photo to Project**
   - Copy the photo file
   - Paste it in: `public/candidate/candidate.png`
   - **Replace** the existing file if it exists

3. **Also Copy for Modal**
   - Copy the same photo
   - Paste it in: `public/candidate/modelPhoto.png`
   - This is used in the preferential vote modal

**✅ Step 7 Complete!** Client photo added.

---

### **STEP 8: Update Content Files (If Needed)**

1. **Check `lib/content.ts`**
   - Open file: `lib/content.ts`
   - Update any client-specific content if needed
   - Most content is generic, but check for any customizations

2. **Update Serial Number Display** (If Needed)
   - If you want to display serial number on the website
   - Add it to the Hero component or wherever needed
   - Example: "Serial Number: 5" or "Contesting as Candidate #5"

**✅ Step 8 Complete!** Content updated.

---

### **STEP 9: Deploy to Vercel**

1. **Push to GitHub**
   - Commit all changes:
     ```bash
     git add .
     git commit -m "Setup for [Client Name]"
     git push origin main
     ```

2. **Go to Vercel**
   - Go to: https://vercel.com
   - Log in with your account

3. **Create New Project**
   - Click "Add New Project"
   - Import from GitHub
   - Select your repository
   - Click "Import"

4. **Configure Project**
   - Project Name: `[client-name]-election`
     - Example: `john-doe-election`
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (default)

5. **Add Environment Variables**
   - Click "Environment Variables"
   - Add these variables:
     - **Name:** `GOOGLE_SERVICE_ACCOUNT_EMAIL`
       - **Value:** Paste Service Account email (from Step 3)
     - **Name:** `GOOGLE_PRIVATE_KEY`
       - **Value:** Open the JSON key file (from Step 3)
       - Find the `private_key` field
       - Copy the entire value (including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`)
       - Paste it here
     - **Name:** `NODE_ENV`
       - **Value:** `production`

6. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete (2-5 minutes)

7. **Get Website URL**
   - After deployment, you'll get a URL like:
     - `https://john-doe-election.vercel.app`
   - **Save this URL** - this is the client's website!

**✅ Step 9 Complete!** Website deployed to Vercel.

---

### **STEP 10: Test Everything**

1. **Test Website Loads**
   - Open the Vercel URL in browser
   - Check if website loads correctly
   - Check if client's name and photo display correctly

2. **Test Support Button**
   - Click "Support" button
   - Fill out form (if Strong Support)
   - Submit
   - Check Google Sheet - data should appear

3. **Test Preferential Vote Modal**
   - Modal should appear when you open website
   - Select a number (1-24)
   - Click "Submit Preference"
   - Check Google Sheet - vote should appear in "Preferential Votes" sheet

4. **Test WhatsApp Share**
   - Click WhatsApp share button
   - Check if link is correct

5. **Check Google Sheets**
   - Open the Google Sheet
   - Verify data is being saved correctly
   - Check all sheets are created automatically

**✅ Step 10 Complete!** Everything tested and working.

---

### **STEP 11: Share with Client**

1. **Provide Client with:**
   - Website URL (from Step 9)
   - Google Sheet link (from Step 1)
   - Instructions on how to access their data

2. **Document Everything**
   - Save all information in a document:
     - Client Name
     - Google Sheet ID
     - Service Account Email
     - Vercel URL
     - Serial Number
     - Any customizations

**✅ Step 11 Complete!** Client setup complete!

---

## 📋 Quick Checklist Summary

For each new client, complete these steps:

- [ ] **Step 1:** Create Google Sheet → Get Sheet ID
- [ ] **Step 2:** Create Google Cloud Project → Enable Sheets API
- [ ] **Step 3:** Create Service Account → Download JSON key → Get email
- [ ] **Step 4:** Share Google Sheet with Service Account
- [ ] **Step 5:** Request Quota Increase (35,000 requests/minute)
- [ ] **Step 6:** Update `config/candidate.config.ts` (name, serial number, slogan, sheet ID)
- [ ] **Step 7:** Add client photo (`candidate.png` and `modelPhoto.png`)
- [ ] **Step 8:** Update content files (if needed)
- [ ] **Step 9:** Deploy to Vercel → Add environment variables
- [ ] **Step 10:** Test everything
- [ ] **Step 11:** Share with client

---

## 📝 Information to Save for Each Client

Create a document/spreadsheet with this information:

| Client Name | Serial Number | Google Sheet ID | Service Account Email | Vercel URL | Quota Status |
|------------|---------------|-----------------|----------------------|------------|--------------|
| John Doe | 5 | 1YwwJVPK3ne... | election-service@... | john-doe.vercel.app | Approved |
| Jane Smith | 12 | 2XxxKVPK4ne... | election-service@... | jane-smith.vercel.app | Pending |

---

## ⚠️ Important Notes

1. **Serial Number:** Make sure to add it to the config file and display it on the website
2. **Quota Approval:** Wait 1-2 business days for quota increase approval
3. **Service Account Key:** Keep JSON key file secure - don't share it publicly
4. **Google Sheet:** Make sure service account has Editor access
5. **Photo Format:** Must be square, minimum 800x800px

---

## 🎯 Time Estimate

- **Step 1-4:** 15 minutes
- **Step 5:** 5 minutes (request), 1-2 days (approval)
- **Step 6-8:** 10 minutes
- **Step 9:** 10 minutes
- **Step 10:** 15 minutes
- **Total:** ~1 hour (excluding quota approval wait time)

---

**Bottom Line:** Follow these steps exactly for each new client, and you'll have them set up successfully!
