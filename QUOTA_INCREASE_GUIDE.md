# Google Cloud Quota Increase Guide - For Multiple Clients

This guide explains **exactly** how to request quota increases when managing multiple clients.

---

## 🎯 Quick Answer

**You need to request quota increase for EACH CLIENT'S Google Cloud Project separately.**

**Why?**
- Quota limits are **per Google Cloud Project**, not per Gmail account
- Each client has their own Google Cloud Project
- Each project has its own separate quota (300 requests/minute by default)

---

## 📊 How It Works

### Your Setup:
```
Your Gmail: youremail@gmail.com
  │
  ├── Google Cloud Project: "client-a-election"
  │   └── Quota: 300 requests/minute (needs increase)
  │
  ├── Google Cloud Project: "client-b-election"
  │   └── Quota: 300 requests/minute (needs increase)
  │
  └── Google Cloud Project: "client-c-election"
      └── Quota: 300 requests/minute (needs increase)
```

**Key Point:** Each project has its own quota. You need to increase each one separately.

---

## ✅ What You Need to Do

### Option 1: Request for Each Client (Recommended)

**When to do this:**
- When you set up each new client
- Before they launch their campaign

**Steps for Each Client:**

1. **Go to Google Cloud Console**
   - Log in with your Gmail: `youremail@gmail.com`
   - Select the client's project: `client-a-election` (or whatever you named it)

2. **Navigate to Quotas**
   - Go to: **APIs & Services** → **Quotas**
   - Or search: "Quotas" in the top search bar

3. **Find Google Sheets API**
   - Filter by: **"Google Sheets API"**
   - Look for: **"Queries per minute"** or **"Requests per minute"**

4. **Request Increase**
   - Click on the quota
   - Click **"Edit Quotas"** button
   - Enter new limit: **10,000 requests/minute** (or higher)
   - Justification: 
     ```
     Election campaign website expecting 35,000 concurrent users. 
     Each user may submit 1-3 API requests (preferential vote, support form, tracking). 
     Need quota increase to handle peak traffic for [Client Name] campaign.
     ```
   - Submit request

5. **Wait for Approval**
   - Usually approved in 1-2 business days
   - You'll receive email notification

6. **Repeat for Next Client**
   - Switch to next client's project
   - Repeat steps 2-5

---

### Option 2: Request for All Clients at Once (Bulk)

**When to do this:**
- If you have many clients (10+)
- If you want to do it all at once

**Steps:**

1. **List All Client Projects**
   - Make a list of all Google Cloud Project IDs
   - Example:
     - `client-a-election-123456`
     - `client-b-election-789012`
     - `client-c-election-345678`

2. **For Each Project:**
   - Switch to that project in Google Cloud Console
   - Go to: **APIs & Services** → **Quotas**
   - Find: **Google Sheets API** → **Requests per minute**
   - Click **"Edit Quotas"**
   - Request: **10,000 requests/minute**
   - Justification: Same as above
   - Submit

3. **Track Approvals**
   - Keep a spreadsheet of:
     - Client name
     - Project ID
     - Request date
     - Approval status
     - Approval date

---

## 📋 Example: Requesting for Client A

### Step-by-Step:

1. **Log into Google Cloud Console**
   - URL: https://console.cloud.google.com
   - Use: `youremail@gmail.com`

2. **Select Client A's Project**
   - Click project dropdown (top bar)
   - Select: `client-a-election`

3. **Navigate to Quotas**
   ```
   Menu (☰) → APIs & Services → Quotas
   ```

4. **Filter for Google Sheets API**
   - In search/filter box, type: `Google Sheets API`
   - Or filter by service: `sheets.googleapis.com`

5. **Find "Requests per minute"**
   - Look for quota named:
     - "Queries per minute"
     - "Requests per minute"
     - "Queries per minute per user"
   - Click on it

6. **Edit Quota**
   - Click **"Edit Quotas"** button (top of page)
   - Enter: **10,000** (or higher)
   - Justification:
     ```
     Election campaign website for [Client A Name] expecting 35,000 concurrent users. 
     Each user may submit 1-3 API requests (preferential vote, support form, tracking). 
     Current quota of 300 requests/minute is insufficient. 
     Need quota increase to 10,000 requests/minute to handle peak traffic.
     ```
   - Click **"Submit Request"**

7. **Wait for Email**
   - Google will send email when approved
   - Usually 1-2 business days

8. **Verify**
   - Go back to Quotas page
   - Check that new limit shows: **10,000 requests/minute**

---

## 🎯 How Many Requests Do You Need?

### Calculation:

**Per Client:**
- Users: 35,000
- API calls per user: 1-3 (preferential vote, support, tracking)
- Total potential: 35,000 - 105,000 requests

**If all users click in 1 minute:**
- Need: 35,000 - 105,000 requests/minute
- Request: **50,000 requests/minute** (safe buffer)

**If users spread over 10 minutes:**
- Average: 3,500 - 10,500 requests/minute
- Request: **15,000 requests/minute** (safe buffer)

**Recommendation:**
- **Request: 10,000-20,000 requests/minute** per client
- This handles most scenarios
- Can request higher if needed

---

## ⚠️ Important Notes

### 1. **Quota is Per Project, Not Per Gmail**
- ✅ Each client's project = separate quota
- ❌ One quota increase does NOT apply to all projects
- ✅ You must request for each project separately

### 2. **Approval Time**
- Usually: 1-2 business days
- Sometimes: Same day
- Rarely: 3-5 business days
- **Plan ahead!** Request before launch

### 3. **Free to Request**
- ✅ Quota increases are **FREE**
- ✅ No cost to request or use
- ✅ Google approves based on justification

### 4. **Can Request Higher**
- If 10,000 isn't enough, request 20,000 or 50,000
- Just provide good justification
- Google usually approves reasonable requests

### 5. **One Gmail, Multiple Projects**
- ✅ You can manage all projects from one Gmail
- ✅ Each project has separate quota
- ✅ You request increases per project
- ✅ No confusion - each is independent

---

## 📊 Tracking Quota Increases

### Create a Spreadsheet:

| Client Name | Project ID | Request Date | Requested Quota | Status | Approval Date |
|------------|------------|--------------|-----------------|--------|---------------|
| Client A | client-a-election-123456 | 2024-01-15 | 10,000/min | Approved | 2024-01-16 |
| Client B | client-b-election-789012 | 2024-01-15 | 10,000/min | Pending | - |
| Client C | client-c-election-345678 | 2024-01-20 | 10,000/min | Approved | 2024-01-21 |

**Benefits:**
- Track which clients have quota increases
- Know when to follow up
- Keep records for client communication

---

## 🚀 Quick Checklist

### For Each New Client:

- [ ] Create Google Cloud Project
- [ ] Create Service Account
- [ ] Create Google Sheet
- [ ] **Request quota increase** (10,000+ requests/minute)
- [ ] Wait for approval (1-2 days)
- [ ] Verify quota is increased
- [ ] Configure website with service account
- [ ] Test with load testing tool
- [ ] Ready to launch!

---

## ❓ FAQ

### Q1: Do I need to request for each client separately?
**A:** ✅ **YES!** Each Google Cloud Project has its own quota. You must request increase for each project separately.

### Q2: Can I request for all clients at once?
**A:** ✅ **YES!** You can request for multiple projects, but you need to do it one project at a time (switch project, request, switch to next, request, etc.)

### Q3: How long does approval take?
**A:** Usually **1-2 business days**. Sometimes same day, rarely 3-5 days.

### Q4: Is there a cost?
**A:** ❌ **NO!** Quota increases are completely free.

### Q5: What if I need more than 10,000?
**A:** ✅ **Request higher!** Just provide good justification. Google usually approves reasonable requests (20,000, 50,000, etc.)

### Q6: Can I request before creating the project?
**A:** ❌ **NO!** You need to create the Google Cloud Project first, then request quota increase for that specific project.

### Q7: Will one quota increase apply to all my projects?
**A:** ❌ **NO!** Each project has separate quota. You must request for each project.

### Q8: How do I know which project to request for?
**A:** Check your Vercel environment variables or `config/candidate.config.ts` - the `googleSheetId` tells you which project's service account is being used.

---

## ✅ Summary

**Answer to Your Question:**

> "Should I request quota increase for all clients separately or just for one Gmail?"

**Answer:** ✅ **Request for EACH CLIENT'S PROJECT separately.**

**Why:**
- Quota is per Google Cloud Project, not per Gmail
- Each client has their own project
- Each project needs its own quota increase

**How:**
1. Log into Google Cloud Console with your Gmail
2. Switch to Client A's project
3. Request quota increase for that project
4. Switch to Client B's project
5. Request quota increase for that project
6. Repeat for all clients

**Timeline:**
- Request for each client: 5 minutes per client
- Approval: 1-2 business days per request
- Total time: Depends on number of clients

**Cost:**
- ✅ **FREE** - No cost for quota increases

---

**Bottom Line:** Request quota increase for **each client's Google Cloud Project separately**. One Gmail account, but multiple projects, each needing its own quota increase.
