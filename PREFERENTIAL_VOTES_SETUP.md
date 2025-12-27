# Preferential Votes Feature - Setup Guide

## Overview
This feature allows advocates to cast their preferential vote (1-24) when they visit your website. The votes are automatically logged to Google Sheets.

## Step-by-Step Setup

### 1. Google Sheets Setup

#### Option A: Manual Creation (Recommended)
1. Open your Google Spreadsheet: `https://docs.google.com/spreadsheets/d/1YwwJVPK3neZVQhNPqjzBR5taukLYFgUkWi_vA4IB9KA`
2. Create a new sheet (tab) named exactly: **"Preferential Votes"**
3. In Row 1, add these headers:
   - **Column A**: `Timestamp`
   - **Column B**: `Preferential Order`
4. Format Row 1 as **bold** (optional but recommended)

#### Option B: Automatic Creation
- The system will automatically create the "Preferential Votes" sheet when the first vote is submitted
- Headers will be added automatically
- **Note**: Make sure your service account has permission to create sheets

### 2. Verify Service Account Permissions

1. Open your Google Spreadsheet
2. Click **Share** button (top right)
3. Make sure your service account email is added with **Editor** access:
   - Email: `barcouncilmember@barcouncilmember.iam.gserviceaccount.com`
   - Permission: **Editor** (not just Viewer)
4. If not added, add it now

### 3. Verify Environment Variables

Make sure these are set in your `.env.local` file (for local) and Vercel (for production):

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=barcouncilmember@barcouncilmember.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**For Vercel:**
1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Verify both variables are set
4. Redeploy if you just added them

### 4. Test the Feature

#### Test Locally:
1. Start dev server: `npm run dev`
2. Visit: `http://localhost:3000?vote=true`
3. The modal should appear automatically
4. Select a preferential order (e.g., 1)
5. Click Submit
6. Check your Google Sheet - you should see the vote logged

#### Test on Live Site:
1. Visit: `https://yourwebsite.com?vote=true`
2. Follow the same steps
3. Check Google Sheets for the entry

### 5. Google Sheets Structure

Your spreadsheet should have these 5 sheets:

1. **Quick Support** - Columns: Timestamp, Support Type, Details Provided, Image Generated, Image Downloaded
2. **Strong Support** - Columns: Timestamp, Support Type, Name, Enrollment Number, District, Bar Association, Mobile Number, Custom Message, Language, Image Generated, Image Downloaded
3. **Followers** - Columns: Timestamp, Support Type, Name, Enrollment Number, District, Bar Association, Mobile Number, Custom Message, Language, Status, Format
4. **Preferential Votes** - Columns: Timestamp, Preferential Order ⭐ (NEW)
5. **Preferential Votes Summary** - Auto-generated analytics sheet ⭐ (NEW)
   - Shows count for each preferential order (1-24)
   - Shows percentage of total votes
   - Updates automatically as votes come in

### 6. How It Works

1. **User visits website** with `?vote=true` parameter (from WhatsApp link)
2. **Modal appears** asking to cast preferential vote
3. **User selects** preferential order (1-24)
4. **User clicks Submit**
5. **Vote is logged** to "Preferential Votes" sheet with:
   - Timestamp (IST timezone)
   - Preferential Order number

### 7. WhatsApp Bulk Sending

To send links to 40,000 advocates:

1. Visit: `/admin/whatsapp` (e.g., `http://localhost:3000/admin/whatsapp`)
2. Upload your CSV file with phone numbers
3. Or enter phone numbers manually
4. Customize the message
5. Copy/download WhatsApp links
6. Use automation tools to send (see instructions in that page)

**Link Format:**
```
https://yourwebsite.com?vote=true
```

### 8. Troubleshooting

#### Modal doesn't appear:
- Clear browser localStorage: `localStorage.removeItem("preferentialVoteSubmitted")`
- Visit with `?vote=true` parameter
- Check browser console for errors

#### Votes not saving to Google Sheets:
- Verify service account has Editor access to the spreadsheet
- Check environment variables are set correctly
- Check Vercel logs for errors
- Verify the sheet name is exactly "Preferential Votes" (case-sensitive)

#### API returns 500 error:
- Check server logs
- Verify Google Sheets API is enabled
- Verify service account credentials are correct
- Check if sheet exists (or let it auto-create)

### 9. Analytics - Preferential Votes Summary

**The system automatically creates a "Preferential Votes Summary" sheet** that shows:

- **Preferential Order**: Numbers 1-24
- **Count**: How many votes for each order (auto-calculated)
- **Percentage**: Percentage of total votes for each order
- **Status**: Shows "Active" if there are votes for that order
- **TOTAL**: Total votes across all orders

**Example:**
If you have:
- 500 votes for order 1 (1st preference)
- 300 votes for order 2 (2nd preference)
- 200 votes for order 24 (24th preference)

The summary will show:
- Order 1: Count = 500, Percentage = 50%
- Order 2: Count = 300, Percentage = 30%
- Order 24: Count = 200, Percentage = 20%
- TOTAL: 1000 votes

**This gives you instant visibility:**
- How many 1st preference votes you have (most important!)
- Distribution across all 24 orders
- Total engagement
- Real-time updates as votes come in

**The summary sheet is created automatically** when the first vote is submitted. If you want to manually create it, you can call the setup endpoint (optional).

### 10. Summary Checklist

- [ ] "Preferential Votes" sheet created in Google Spreadsheet (or will auto-create)
- [ ] Headers added: "Timestamp" and "Preferential Order" (or will auto-create)
- [ ] "Preferential Votes Summary" sheet will be created automatically
- [ ] Service account has Editor access to spreadsheet
- [ ] Environment variables set in `.env.local` and Vercel
- [ ] Tested locally - modal appears and vote saves
- [ ] Tested on live site - vote saves correctly
- [ ] Checked "Preferential Votes Summary" sheet shows vote counts
- [ ] WhatsApp links generated with `?vote=true` parameter
- [ ] Ready to send to advocates

### 11. Understanding the Summary Sheet

**The "Preferential Votes Summary" sheet automatically calculates:**

1. **Count Column (B)**: Uses `=COUNTIF('Preferential Votes'!B:B, 1)` to count votes for each order
2. **Percentage Column (C)**: Calculates what percentage of total votes each order received
3. **Status Column (D)**: Shows "Active" if there are votes for that order

**Key Metrics to Watch:**
- **1st Preference Votes (Order 1)**: Most important - shows your core supporters
- **Total Votes**: Overall engagement
- **Distribution**: See which orders are getting votes

**Example Real-World Scenario:**
- Total votes: 24,000
- 1st preference: 500 votes (2.08%)
- 2nd preference: 300 votes (1.25%)
- 15th preference: 30 votes (0.125%)

This tells you: You have 500 strong supporters who gave you 1st preference, which is valuable data for election strategy!

## That's It!

Once these steps are complete, the preferential votes feature will work automatically. Votes will be logged to your Google Sheet whenever advocates visit your website via the WhatsApp link and submit their preferential order.

