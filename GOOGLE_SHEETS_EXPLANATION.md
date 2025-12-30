# Google Sheets Explanation - Simple Guide

This document explains what each sheet in your Google Spreadsheet does and why it's important.

## 📊 Your Google Sheets Overview

Your spreadsheet has **6 different sheets (tabs)** that automatically collect different types of information from your website visitors. Here's what each one does:

---

### 1. **Quick Support** Sheet
**What it collects:**
- Timestamp (when they clicked)
- Support Type
- Whether they provided details (Yes/No)
- Whether they generated/downloaded an image

**What it means:**
- These are people who clicked the support button but chose to **skip** giving their details
- They might have downloaded a generic support card or just clicked and left
- **Use this to see:** How many people showed quick interest without committing

---

### 2. **Strong Support** Sheet
**What it collects:**
- Timestamp
- Full Name
- Enrollment Number
- District
- Bar Association
- Mobile Number (if provided)
- Custom Message (if provided)
- Language (English/Telugu)
- Image Generated status
- Image Downloaded status

**What it means:**
- These are people who **filled out the complete form** with their details
- **BUT did NOT download** their personalized support card
- They provided information but didn't download the image
- **Use this to see:** Supporters who gave details but didn't download the card

---

### 3. **Followers** Sheet
**What it collects:**
- All the same information as "Strong Support" sheet
- Plus: Image format

**What it means:**
- These are people who:
  1. Filled out the form with their details
  2. **AND** downloaded their personalized support card
- They are your most engaged supporters who actively downloaded and likely shared
- **Use this to see:** Who is actively sharing your support on social media

---

### 4. **Preferential Votes** Sheet
**What it collects:**
- Timestamp (when they voted)
- Preferential Order (1, 2, 3... up to 24)

**What it means:**
- These are people who **cast their preferential vote** through the modal
- Shows which preference number (1-24) each person selected
- **Use this to see:** Individual votes and when they were cast

---

### 5. **Preferential Votes Summary** Sheet
**What it shows:**
- Preferential Order (1-24)
- Count (how many votes for each number)
- Percentage (what % of total votes)

**What it means:**
- This is an **automatic summary** that calculates:
  - How many people gave you "1st preference"
  - How many gave you "2nd preference"
  - And so on...
- Updates automatically as votes come in
- **Use this to see:** Your vote distribution at a glance (most important for analytics)

---

### 6. **Preferential Vote Tracking** Sheet
**What it collects:**
- Timestamp
- Action ("Modal Opened", "Closed Without Vote", or "Voted")

**What it means:**
- Tracks when people **opened** the preferential vote modal
- Tracks when people **closed** the modal without voting
- Tracks when people **voted** (completed the vote)
- **Use this to see:**
  - How many people saw the voting modal
  - How many left without voting
  - How many actually voted
  - **Conversion rate** = (Voted ÷ Modal Opens) × 100
  - Complete user journey: Open → Vote or Close

---

## 📈 How to Use This Data

### For Campaign Strategy:
- **Quick Support** → Shows initial interest level
- **Strong Support** → Your verified supporter database
- **Followers** → Your most active promoters
- **Preferential Votes** → Your actual vote count
- **Preferential Votes Summary** → Your vote ranking distribution
- **Preferential Vote Tracking** → Your conversion rate (how many voted vs how many saw)

### Key Metrics to Watch:
1. **Conversion Rate** = (Preferential Votes ÷ Modal Opens) × 100
2. **Engagement Rate** = (Followers ÷ Strong Support) × 100
3. **Vote Distribution** = Check "Preferential Votes Summary" to see your ranking

---

## 🔧 Technical Notes

- All timestamps are in **Indian Standard Time (IST)**
- All sheets are created automatically when first data comes in
- Data is logged in real-time as users interact with your website
- You can export any sheet to Excel/CSV for further analysis

---

## ❓ Common Questions

**Q: Why do I have duplicate information in different sheets?**
A: Each sheet serves a different purpose. For example, "Strong Support" shows who gave details, while "Followers" shows who also downloaded the card. This helps you understand different levels of engagement.

**Q: What if a sheet shows "Conflict" in the name?**
A: The system will automatically fix this. If you see a sheet like "Preferential Vote Tracking? Conflict 12345", it will be automatically deleted and replaced with the correct name on the next data entry.

**Q: Can I delete or modify these sheets?**
A: You can view and export the data, but avoid manually deleting or renaming sheets as it may break the automatic logging system.

---

**Last Updated:** This document reflects the current system setup. All sheets are automatically managed by your website.

