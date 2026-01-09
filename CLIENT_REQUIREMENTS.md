# Client Requirements Checklist

This document lists everything you need from each client before setting up their white-labeled website.

## ✅ Required Information from Client

### 1. **Basic Information**
- [ ] **Full Name** (for candidate name)
- [ ] **Designation** (e.g., "Candidate for Member – Telangana State Bar Council")
- [ ] **High-resolution Photo** (square format, minimum 800x800px, JPG/PNG)
- [ ] **Domain Name** (e.g., `clientname.com` or `clientname.in`)
- [ ] **Preferred Layout** (Left, Center, or Right)

### 2. **Google Account Setup**
**Option A: Client Provides Their Own Google Account** (Recommended)
- [ ] Client's Gmail address (for Google Sheets access)
- [ ] Client will create their own Google Sheet
- [ ] Client will create their own Google Service Account
- [ ] Client will share service account email with you

**Option B: You Create Google Account for Client**
- [ ] Client's preferred email format (e.g., `clientname@gmail.com`)
- [ ] You create Gmail account
- [ ] You create Google Sheet
- [ ] You create Google Service Account
- [ ] You share credentials with client

**Recommendation:** Option A is better for security and client ownership.

### 3. **Google Sheets Setup**
- [ ] Client creates a new Google Spreadsheet
- [ ] Client shares spreadsheet with service account email (Editor access)
- [ ] Client provides Google Sheet ID (from URL)
- [ ] Client understands they need to keep the spreadsheet accessible

### 4. **Vercel Account Setup**
**Option A: You Manage (Single Vercel Account)** (Recommended for simplicity)
- [ ] You deploy all client websites under your Vercel account
- [ ] You manage all deployments
- [ ] Client doesn't need Vercel account
- [ ] **Cost:** You pay for Vercel Pro ($20/month) if traffic exceeds free tier

**Option B: Client Has Their Own Vercel Account**
- [ ] Client creates Vercel account
- [ ] Client adds you as collaborator
- [ ] Client pays for their own Vercel plan
- [ ] **Cost:** Client pays (Free tier or Pro if needed)

**Recommendation:** Option A for simplicity, Option B if client wants full control.

### 5. **GitHub Repository**
**Option A: Separate Repository Per Client** (Recommended)
- [ ] Create new GitHub repository for each client
- [ ] Client gets their own codebase
- [ ] Easier to customize per client
- [ ] Client can have their own GitHub account access

**Option B: Monorepo (All Clients in One Repo)**
- [ ] Single repository with multiple branches/folders
- [ ] More complex to manage
- [ ] Lower cost (one repo)

**Recommendation:** Option A for better isolation and client ownership.

### 6. **Environment Variables**
You need to set these in Vercel for each client:
- [ ] `GOOGLE_SERVICE_ACCOUNT_EMAIL` (from client's service account)
- [ ] `GOOGLE_PRIVATE_KEY` (from client's service account JSON key)
- [ ] `NODE_ENV=production`

### 7. **Content & Branding**
- [ ] WhatsApp share text (English)
- [ ] WhatsApp share text (Telugu)
- [ ] Any custom messaging or branding requirements

### 8. **Domain & DNS**
- [ ] Client provides domain name
- [ ] Client updates DNS records (or you do it with their permission)
- [ ] DNS A record or CNAME pointing to Vercel

---

## 📋 Setup Process Checklist

### For Each New Client:

1. **Collect Information**
   - [ ] Fill out all items in "Required Information" above

2. **Google Setup**
   - [ ] Client creates Google Sheet (or you create it)
   - [ ] Client creates Google Service Account (or you create it)
   - [ ] Share Google Sheet with service account email
   - [ ] Get Google Sheet ID

3. **Code Setup**
   - [ ] Create new GitHub repository (or branch)
   - [ ] Update `config/candidate.config.ts` with client details
   - [ ] Add client photo to `/public/candidate/`
   - [ ] Push to GitHub

4. **Vercel Deployment**
   - [ ] Import GitHub repository to Vercel
   - [ ] Add environment variables:
     - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
     - `GOOGLE_PRIVATE_KEY`
   - [ ] Deploy
   - [ ] Connect custom domain

5. **Testing**
   - [ ] Test website loads correctly
   - [ ] Test support button works
   - [ ] Test preferential vote modal
   - [ ] Verify data saves to Google Sheets
   - [ ] Test WhatsApp share

6. **Handover**
   - [ ] Provide client with website URL
   - [ ] Provide Google Sheet link
   - [ ] Provide admin access (if applicable)
   - [ ] Document any custom configurations

---

## 💰 Cost Considerations

### Per Client Costs:

**Free Tier (Up to ~10,000 users/month):**
- Vercel: Free (100GB bandwidth/month)
- Google Sheets API: Free (60 requests/minute)
- Google Drive: Free (15GB storage)
- **Total: $0/month per client**

**If Traffic Exceeds Free Tier:**
- Vercel Pro: $20/month per team (can host multiple clients)
- Google Sheets API: Still free (but may hit rate limits)
- **Total: ~$20/month (shared across all clients)**

**Recommendation:** Start with free tier, upgrade to Vercel Pro if needed.

---

## ⚠️ Important Notes

1. **No MongoDB Needed:** This project uses Google Sheets, not MongoDB
2. **Client-Side Image Generation:** No server cost for image generation
3. **Domain-Specific localStorage:** Each client's website has isolated localStorage
4. **Separate Google Sheets:** Each client has their own data storage

---

## 📞 Client Communication Template

**Email to send to new client:**

```
Subject: Website Setup - Information Needed

Dear [Client Name],

To set up your election campaign website, I need the following information:

1. **Basic Details:**
   - Full name: ___________
   - High-resolution photo (square format)
   - Preferred layout: Left / Center / Right

2. **Google Account:**
   - Do you have a Gmail account? (Yes/No)
   - If yes, please provide: ___________
   - If no, I can create one for you

3. **Domain Name:**
   - What domain name do you want? (e.g., yourname.com)

4. **Vercel Account:**
   - Do you want to manage your own Vercel account? (Recommended: I manage it for you)

Once I have this information, I'll set up your website within 24-48 hours.

Best regards,
[Your Name]
```

